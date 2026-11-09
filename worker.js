// =====================================================================
//  Cloudflare 서버 파일  ·  사이트 전체 + /api/remodel
//  OpenAI 대신 Cloudflare Workers AI(무료 하루 10,000 뉴런)를 씁니다.
//
//  처리 순서
//   1) 시연 코드·입력값 확인 (정해진 스타일/시나리오만 허용)
//   2) 입력 사진 점검: 사람·선정적 내용이 있으면 변환하지 않음 (Cloudflare 비전 모델)
//   3) 이미지 편집: 원본 사진(+선택: 평면도) + 짧은 스타일 지시문 → FLUX.2 [klein] 4B
//   4) 결과 이미지 점검: 사람·선정성·로고·글자가 있으면 이미지를 버리고 "차단"만 알림
//      (Cloudflare 자체 출력 필터도 한 번 더 걸러 줌)
//  2026-11-09: 입력 점검 때 공간 종류(방/주방/욕실)와 입구 문 위치도 함께 읽어 지시문에 넣음
//      → 옷장·수납장을 문으로 바꿔 그리던 문제, 주방·욕실에 침대가 생기던 문제 방지
//      화면에서 사용자가 직접 고르면 그 값을 우선 사용
//
//  API 키가 필요 없습니다. wrangler.jsonc의 "ai" 연결로 계정 안에서 바로 호출합니다.
//  선택: 대시보드 > 설정 > 변수 및 비밀에 ACCESS_CODE 를 넣으면 시연 코드를 묻습니다.
// =====================================================================
import "./prompts.js";
const { buildShortPrompt, SCENARIOS, STYLES, ROOMS, DOORS } = globalThis.REMODEL;

const IMG_MODEL = "@cf/black-forest-labs/flux-2-klein-4b";
const VISION_MODELS = ["@cf/meta/llama-4-scout-17b-16e-instruct", "@cf/meta/llama-3.2-11b-vision-instruct"];
const MAX_BYTES = 1.5 * 1024 * 1024;

class Fail extends Error {
  constructor(status, code, message, retryable, detail) { super(message); this.status = status; this.code = code; this.retryable = retryable; this.detail = detail; }
}
const json = (status, obj) => new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
const sleep = ms => new Promise(r => setTimeout(r, ms));

function decodeDataUrl(s, label) {
  const m = /^data:(image\/(png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/.exec(s || "");
  if (!m) throw new Fail(400, "bad_input", `${label} 형식이 올바르지 않습니다 (PNG, JPG, WEBP).`, false);
  const bin = atob(m[3]);
  if (bin.length > MAX_BYTES) throw new Fail(413, "too_large", `${label} 용량이 너무 큽니다.`, false);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return { mime: m[1], bytes };
}

// Workers AI 오류 → 한국어
function classify(e) {
  const msg = String((e && e.message) || e || "");
  if (/3030|flagged|nsfw|safety/i.test(msg)) return new Fail(422, "output_blocked", "생성된 이미지가 Cloudflare 안전 필터에서 차단되어 표시하지 않습니다. 다시 시도하거나 다른 사진을 써 주세요.", true, msg);
  if (/3040|capacity|429|too many|busy|overloaded/i.test(msg)) return new Fail(503, "busy", "AI 서버가 바쁩니다. 잠시 후 다시 시도해 주세요.", true, msg);
  if (/4006|neurons?\b|daily free|free allocation/i.test(msg)) return new Fail(402, "quota", "오늘 무료 사용량을 다 썼습니다. 매일 오전 9시(한국 시간)에 다시 채워집니다.", false, msg);
  if (/5\d\d|timeout|timed out|internal/i.test(msg)) return new Fail(502, "upstream", "AI 서버 오류입니다. 잠시 후 다시 시도해 주세요.", true, msg);
  return new Fail(502, "failed", "AI 변환에 실패했습니다. 다시 시도해 주세요.", true, msg);
}

// makeInput: 시도할 때마다 새로 만듦 (업로드 본문은 한 번 읽으면 다시 못 씀)
async function runAI(env, model, makeInput, label) {
  let last;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try { return await env.AI.run(model, makeInput()); }
    catch (e) {
      last = classify(e);
      console.error(`[${label}] ${model} (시도 ${attempt})`, last.detail);
      if (!last.retryable || last.code === "output_blocked") throw last;
      await sleep(1500);
    }
  }
  throw last;
}

// 비전 모델로 사진 내용 점검. 점검을 못 하면 안전 쪽(표시 안 함)으로 처리
const CHECK_PROMPT = 'Inspect this interior image. Answer ONLY compact JSON: {"person":true|false,"sexual":true|false,"logo":true|false,"text":true|false}. person = any human or body part (including in mirrors, pictures or screens). sexual = any nudity or suggestive content. logo = any brand logo or trademark. text = any clearly readable letters, words or numbers.';
// 입력 사진에서만: 공간 종류와 문 위치도 읽음. 문은 손잡이·문틀·경첩이 보이는 여닫이/미닫이 문만 (옷장·수납장·냉장고·창은 문이 아님)
const INPUT_PROMPT = 'Inspect this interior photo. Answer ONLY compact JSON: {"person":true|false,"sexual":true|false,"room":"bedroom|kitchen|bathroom|other","door":"none|left|right|back|unsure"}. person = any human or body part (including in mirrors, pictures or screens). sexual = any nudity or suggestive content. room = what this space mainly is. door = where a real room entrance door (a hinged or sliding door leaf in a door frame that people walk through) is visible: on the left wall, right wall or far back wall; none if no such door is visible. Wardrobes, closets, cabinets, fridges, shower screens, windows and mirrors are NOT doors.';
let agreed = false;
async function inspect(env, dataUrl, stage) {
  const keys = stage === "input" ? ["person", "sexual"] : ["person", "sexual", "logo", "text"];
  for (const model of VISION_MODELS) {
    try {
      if (model.includes("llama-3.2") && !agreed) { try { await env.AI.run(model, { prompt: "agree" }); } catch (_) {} agreed = true; }
      const r = await env.AI.run(model, {
        messages: [{ role: "user", content: [{ type: "text", text: stage === "input" ? INPUT_PROMPT : CHECK_PROMPT }, { type: "image_url", image_url: { url: dataUrl } }] }],
        max_tokens: 120, temperature: 0
      });
      const t = typeof r === "string" ? r : typeof r?.response === "string" ? r.response : JSON.stringify(r?.response ?? r ?? "");
      const m = t.match(/\{[\s\S]*?\}/);
      if (!m) continue;
      const v = JSON.parse(m[0]);
      const hits = keys.filter(k => v[k] === true);
      hits.room = ["bedroom", "kitchen", "bathroom"].includes(v.room) ? v.room : "bedroom";
      hits.door = ["none", "left", "right", "back"].includes(v.door) ? v.door : "auto";
      return hits;
    } catch (e) {
      console.error(`[inspect-${stage}] ${model}`, String(e && e.message));
    }
  }
  throw new Fail(502, "check_failed", stage === "input" ? "사진 안전 검사를 하지 못했습니다. 다시 시도해 주세요." : "결과 이미지 안전 검사를 끝내지 못해 표시하지 않습니다. 다시 시도해 주세요.", true);
}

function pickSize(aspect) {
  const a = Number(aspect) || 1.5;
  return a > 1.2 ? [1024, 768] : a < 0.83 ? [768, 1024] : [1024, 1024];
}

async function editImage(env, room, plan, prompt, [w, h]) {
  const makeInput = () => {
    const form = new FormData();
    form.append("prompt", prompt);
    form.append("input_image_0", new Blob([room.bytes], { type: room.mime }), "room");
    if (plan) form.append("input_image_1", new Blob([plan.bytes], { type: plan.mime }), "plan");
    form.append("width", String(w));
    form.append("height", String(h));
    // FormData → multipart 본문과 boundary 헤더를 얻는 방법 (Cloudflare 문서 방식)
    const fr = new Request("https://form.local/", { method: "POST", body: form });
    return { multipart: { body: fr.body, contentType: fr.headers.get("content-type") || "multipart/form-data" } };
  };
  const r = await runAI(env, IMG_MODEL, makeInput, "edit");
  const b64 = r && (r.image || (r.result && r.result.image));
  if (!b64) throw new Fail(502, "empty", "AI가 이미지를 돌려주지 않았습니다. 다시 시도해 주세요.", true);
  const mime = b64.startsWith("/9j/") ? "image/jpeg" : b64.startsWith("UklG") ? "image/webp" : "image/png";
  return `data:${mime};base64,${b64}`;
}

async function api(req, env) {
  const t0 = Date.now();
  if (req.method === "GET") return json(200, { ready: Boolean(env.AI), needsCode: Boolean(env.ACCESS_CODE), engine: "cloudflare", model: "FLUX.2 klein", maxInput: 504, plan: true, roomDoor: true, promptVersion: globalThis.REMODEL.PROMPT_VERSION });
  if (req.method !== "POST") return json(405, { code: "method", error: "POST 요청만 받습니다." });
  if (!env.AI) return json(500, { code: "config", error: "Workers AI 연결(AI)이 없습니다. wrangler.jsonc가 저장소에 있는지 확인해 주세요." });
  if (env.ACCESS_CODE && req.headers.get("x-access-code") !== env.ACCESS_CODE) return json(401, { code: "bad_code", error: "시연 코드가 맞지 않습니다." });

  try {
    const body = await req.json().catch(() => ({}));
    const { image, plan, scenario, style, aspect, room: roomSel, door: doorSel } = body || {};
    if (!SCENARIOS[scenario] || !STYLES[style]) throw new Fail(400, "bad_input", "시나리오나 스타일 값이 올바르지 않습니다.", false);
    const room = decodeDataUrl(image, "사진");
    const planImg = plan ? decodeDataUrl(plan, "평면도") : null;

    // 2) 입력 사진 점검 (사람·선정성만. 글자·로고는 지시문으로 지움)
    const seen = await inspect(env, image, "input");
    const inHits = seen.filter(k => k === "person" || k === "sexual");
    if (inHits.length) return json(422, { code: "input_blocked", error: "올린 사진에 " + (inHits.includes("sexual") ? "부적절한 내용이" : "사람이") + " 보여 변환하지 않습니다. 사람·개인정보가 없는 실내 사진으로 다시 시도해 주세요.", categories: inHits });

    // 3) 이미지 편집
    const size = pickSize(aspect);
    // 사용자가 고른 값 우선, "자동"이면 사진 인식 결과
    const roomUse = roomSel && roomSel !== "auto" && ROOMS[roomSel] ? roomSel : seen.room;
    const doorUse = doorSel && doorSel !== "auto" && DOORS[doorSel] ? doorSel : seen.door;
    const out = await editImage(env, room, planImg, buildShortPrompt(scenario, style, !!planImg, { room: roomUse, door: doorUse }), size);

    // 4) 결과 점검 → 걸리면 이미지를 버림
    const outHits = await inspect(env, out, "output");
    if (outHits.length) {
      const ko = { person: "사람이", sexual: "부적절한 내용이", logo: "로고가", text: "글자가" };
      console.warn("[blocked] output", outHits);
      return json(422, { code: "output_blocked", error: `결과에 ${outHits.map(h => ko[h]).join(", ")} 들어가 있어 표시하지 않습니다. 다시 시도해 주세요.`, categories: outHits, retryable: true });
    }
    return json(200, { image: out, model: "FLUX.2 klein", engine: "cloudflare", size: size.join("x"), plan: !!planImg, room: roomUse, door: doorUse, roomAuto: !(roomSel && roomSel !== "auto"), doorAuto: !(doorSel && doorSel !== "auto"), ms: Date.now() - t0, checks: { input: "pass", output: "pass" } });
  } catch (e) {
    if (e instanceof Fail) { console.error("[fail]", e.code, e.detail || e.message); return json(e.status, { code: e.code, error: e.message, retryable: !!e.retryable }); }
    console.error("[crash]", e);
    return json(500, { code: "crash", error: "서버 처리 중 오류가 났습니다. 다시 시도해 주세요.", retryable: true });
  }
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname === "/api/remodel" || url.pathname === "/") {
      // GitHub Pages(ijinsol61.github.io)에서 부를 수 있게 허용 (CORS)
      const origin = req.headers.get("Origin") || "";
      const ok = /^https:\/\/ijinsol61\.github\.io$|^http:\/\/localhost(:\d+)?$|\.workers\.dev$/.test(origin);
      const cors = ok ? { "Access-Control-Allow-Origin": origin, "Vary": "Origin", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, x-access-code", "Access-Control-Max-Age": "86400" } : {};
      if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
      const res = await api(req, env);
      Object.entries(cors).forEach(([k, v]) => res.headers.set(k, v));
      return res;
    }
    if (env.ASSETS) return env.ASSETS.fetch(req);
    return new Response("Not found", { status: 404 });
  }
};
