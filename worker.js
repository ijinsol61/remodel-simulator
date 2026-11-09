// 붙여넣기용 한 파일 버전: prompts.js + cloudflare/worker.js (2026-11-09)
(function () {
// =====================================================================
//  프롬프트·스타일 설정 파일  (기준: room1-comparison-v5, 2026-11-02)
//  화면(index.html)과 서버(api/remodel.js)가 모두 이 파일 하나를 씁니다.
//
//  비교 기준: "문에서 방 안을 보는 카메라 시점"만 공통으로 고정합니다.
//  가구 종류·배치·생활 높이·식사 방식·입구 문·창호·조명·마감은 스타일마다 다르게 설계합니다.
//  (세 스타일에 같은 침대·책상·좌식 상을 강제하던 이전 조건은 폐기)
//
//  주의: 브랜드명, 디자이너·작가 이름, 특정 제품명은 넣지 마세요(카피 위험).
// =====================================================================

const SCENARIOS = {
  // 노후주택 리모델링 시나리오는 출품 범위에서 제외 (2026-11-02, 1인가구 소형공간 전용)
  single: {
    name: "1인가구 소형공간 활용",
    desc: "수면·작업·수납·식사를 작은 방 안에서 해결",
    prompt: "This is a small room for one person: include sleeping, working/studying, clothes storage and eating in a practical compact one-person arrangement at believable compact sizes, keep a clear route from the door through the middle, and do not add more furniture than the room can hold",
    row: ["소형공간 활용", "수면·작업·수납·식사 4가지 기능을 한 방에 배치, 문에서 이어지는 통로 확보, 방 크기를 무리하게 키우지 않음"]
  }
};

const STYLES = {
  nordic: {
    name: "북유럽식",
    desc: "다양한 색, 자연 소재, 일상에 맞는 가벼운 가구",
    sw: ["#f2eee5", "#a9b7a0", "#af654d", "#2851a3"],
    wall: "아이보리 벽 + 세이지그린 포인트 벽",
    floor: "밝은 오크 무광 마루",
    light: "식사 자리 펜던트, 독서등, 책상 조명",
    window: "밝은 창틀, 린넨 쉬어 커튼",
    door: "테라코타색 평판 문, 오크 문틀, 금속 레버",
    furn: "다리 있는 오크 데이베드, 독립 책상과 작업 의자, 오크·밝은색 옷장",
    meal: "의자식 드롭리프 식탁 + 코발트블루 의자",
    prompt: "CONCEPT — SCANDINAVIAN: comfortable everyday life, light functional furniture on slender legs, natural materials and a thoughtful varied palette, not an all-beige room. Chair-seated dining: a small chair-height light-oak drop-leaf dining table with one generic wooden dining chair painted matte cobalt blue (about #2851A3); no floor dining, no soban, no floor cushions. Sleeping on a slim light-oak daybed or bed on raised legs with plain ivory bedding, one ochre and one dusty-blue cushion. A separate small study desk with its own quiet chair near daylight, so studying and eating do not share one tabletop. A compact freestanding warm-white and light-oak clothes cupboard with small wood pulls, not a wall of grey built-ins. Warm ivory walls (about #F2EEE5) with one soft sage-green wall (about #A9B7A0); pale matte oak floor. Replace the entrance door leaf, frame and handle with a smooth matte terracotta slab (about #AF654D), slim oak jamb and a short brushed-nickel lever. Plain linen sheer curtain drawn aside, a plain wool rug, one or two small plants, a soft-white pendant over the dining spot, a reading light and a desk lamp, balanced with clean natural daylight so the colours stay distinct. No sofa, no patterned textiles, no famous designer-chair silhouettes"
  },
  minimal: {
    name: "현대식",  // 내부 ID는 minimal 유지
    desc: "닫힌 수납, 기능 통합, 필요할 때 펼치는 가구",
    sw: ["#efeee9", "#cfc8bd", "#d9d4cb", "#3c3c3a"],
    wall: "무광 아이보리·따뜻한 회색, 걸레받이 최소화",
    floor: "연한 웜그레이 무광 바닥 또는 저대비 애쉬 광폭 마루",
    light: "선형 천장등 + 수납부·작업 선반 조명",
    window: "얇은 창틀, 무지 롤 블라인드",
    door: "밝은 무광 평판 문, 검정 일자 레버",
    furn: "낮은 수납 받침 일체형 침대, 연속된 닫힌 수납벽, 얇은 벽부착 작업 선반",
    meal: "수납벽에 결합한 펼침 식사판 + 접이식 의자",
    prompt: "CONCEPT — MINIMALIST: fewer separate objects, functions integrated into closed furniture, generous clear floor. A limited palette of warm grey, matte ivory, pale ash and a little charcoal; do not simply bleach Scandinavian furniture white. A continuous wall of flush closed full-height storage in matte warm greige with aligned seams and concealed handles. A chair-height fold-down dining panel built into that storage wall, shown open with one light charcoal folding chair and a modest single-place meal. A single bed integrated with a low storage plinth, placed so the centre of the floor stays clear. A separate slim wall-mounted study ledge with restrained task lighting. Replace the entrance door leaf, frame and handle with a smooth matte warm-greige flush slab, a narrow same-colour jamb and a short matte black straight lever on a small rosette. Very slim window frames with a plain roller blind. Flat unpatterned walls, thin baseboards or shadow gaps, a pale warm-grey matte mineral-look floor or very low-contrast pale ash planks. A slim linear ceiling luminaire close to the ceiling and compact integrated task lights, no pendant. Plain white bedding with one smooth charcoal throw. No sofa, no patterned rug, no decorative cushions, no display shelving, no ornamental trim"
  },
  hanok: {
    name: "한옥식",
    desc: "좌식 생활과 목재 창호에서 착안한 현대적 공간",
    sw: ["#f1ebdf", "#9a6b45", "#6b4a2e", "#33415c"],
    wall: "미색 한지 느낌 벽 마감",
    floor: "중간 갈색 목재 마루, 얇은 목재 걸레받이",
    light: "얇은 현대식 천장등, 간접조명, 금속 작업등 (종이등 없음)",
    window: "얇은 목재 살 내창(세로살 + 간격 둔 가로띠), 종이 느낌 반투명 판",
    door: "중간 갈색 목재 평판 문, 어두운 금속 레버",
    furn: "낮은 목재 침상, 좌식 책상과 방석, 목재 옷장",
    meal: "옮겨 쓰는 소반 + 바닥 방석",
    prompt: "CONCEPT — CONTEMPORARY KOREAN, inspired by Korean floor-seated living and timber windows: a low living horizon, quiet timber furniture and fine hanji-like wall texture. This is a practical contemporary room, not a traditional house reconstruction and not Japanese. A low timber bed with a slim plain wooden head panel, plain white bedding and a folded muted-indigo quilt. A low writing desk about 30-35 cm high with knee space and a thin floor cushion near the window. A small movable Korean soban with restrained chamfered corners and simple legs, one floor cushion and plain white ceramic bowls, spoon, chopsticks and a water cup; clearly different from a modern coffee table. A slim timber clothes cabinet with small dark metal bar pulls; a low chest only if needed. Plain warm off-white hanji-like walls, medium natural brown timber floor and slim timber skirting. Reinterpret the window with thin Korean timber lattice inner shutters: narrow vertical members with spaced horizontal bands and paper-like translucent panels, one leaf partly open. Replace the entrance door leaf, frame and handle with a medium-brown flat wood veneer slab, thin matching jamb and a small matte dark-bronze straight lever. Lighting: a slim modern warm-white flush ceiling luminaire, a concealed linear glow, a small matte dark-metal linear LED desk light and a tiny plain cylinder reading light. Neutral soft daylight with gentle local warmth, not an orange heritage-hotel cast. No paper lanterns or paper-shaded lamps, no heavy posts or deep ceiling beams, no carved ornament"
  }
};

// 모든 스타일 공통: 시점만 고정, 나머지는 스타일에 맞게 재설계
const BASE_PROMPT =
  "Create an original photorealistic remodeling proposal for the room in the attached photo. The shared comparison constraint is the exact VIEWPOINT: same camera location and height, same lens and perspective, same framing and slight camera roll, same aspect ratio and composition. Do not move the camera, zoom, straighten the view into a different composition or convert it into a wide-angle showroom. Keep the real room size, wall positions, window and door openings and ceiling height; do not enlarge the room. Furniture types, positions and proportions, lighting, wall and floor finishes, molding, storage, the entrance door leaf, frame and handle, and the window treatment may all be redesigned according to the concept below; do not keep the original furniture arrangement just because it is in the photo. Restyle the entrance door only if a door is actually visible in the photo, in its existing position; if no door is visible, add none, and never turn wardrobes, cabinets, the fridge or tall panels into doors. Remove personal photographs, clothes racks, fans, cables, clutter, personal objects, branding, writing and figurines. Use generic independently designed furniture, believable materials and joints, grounded contact shadows and soft natural daylight. Output one complete photorealistic interior photograph only";

const NEG_PROMPT =
  "people, persons, faces, bodies, hands, pets, text, letters, readable writing, logos, watermarks, signatures, captions, UI, collage, brand names, copied branded products, named designer furniture, paintings, posters, artwork, pictures, calligraphy, characters, any nudity or suggestive content, moved windows, removed walls, enlarged room, changed camera position, distorted perspective";

const NEG_HANOK = ", Japanese style elements, tatami mats, shoji-room layout, paper lanterns, shrine motifs";

// AI에 실제로 보내는 최종 문장
function buildPrompt(scenario, style) {
  const neg = NEG_PROMPT + (style === "hanok" ? NEG_HANOK : "");
  return `${BASE_PROMPT}.\n${SCENARIOS[scenario].prompt}.\n${STYLES[style].prompt}.\nDo not include or create any of the following: ${neg}.`;
}

// 3D 렌더 → 실사 사진 (보조용)
const RENDER_BASE =
  "The attached image is a simple 3D massing render of a remodeled room. Turn it into a photorealistic interior photograph. Keep exactly the same camera, room shape, openings and the position and size of every piece of furniture. Replace the boxy placeholder shapes with realistic furniture of the same footprint, natural materials and soft daylight. Do not add or remove furniture";
function buildRenderPrompt(scenario, style) {
  const neg = NEG_PROMPT + (style === "hanok" ? NEG_HANOK : "");
  return `${RENDER_BASE}.\n${SCENARIOS[scenario].prompt}.\n${STYLES[style].prompt}.\nDo not include: ${neg}.`;
}


// ---------------------------------------------------------------------
//  짧은 지시문 (Cloudflare FLUX.2 klein용: 이 모델은 약 512토큰까지만 읽습니다)
//  같은 v5 기준을 압축한 것. 금지어를 나열하면 오히려 그려 넣는 모델이라 "있어야 할 것"만 씁니다.
// ---------------------------------------------------------------------
const BASE_SHORT =
  "Photorealistic remodeling proposal of the room in image 1. Keep the exact camera position, lens, framing and aspect ratio, the real room size, wall positions, window and door openings and ceiling height. Redesign furniture, finishes, lighting, the entrance door and window treatment for the concept below; clear away clutter, cables and personal items";
const SHORT = {
  nordic: "Scandinavian concept, varied natural palette: warm ivory walls with one sage-green wall, pale matte oak floor. Slim light-oak daybed on legs with ivory bedding, one ochre and one dusty-blue cushion. Small chair-height light-oak drop-leaf dining table with one matte cobalt-blue wooden chair. Separate small study desk with its own chair near the window. Compact warm-white and oak clothes cupboard. Entrance door replaced by a matte terracotta slab with slim oak jamb and short brushed-nickel lever. Plain linen sheer curtain, plain wool rug, one or two plants, soft-white pendant over the dining spot, reading lamp, clean daylight",
  minimal: "Minimalist concept, limited palette of warm grey, matte ivory, pale ash and a little charcoal, generous clear floor. Continuous wall of flush full-height closed storage in matte warm greige with concealed handles; a chair-height fold-down dining panel built into it, shown open with one light charcoal folding chair. Single bed on a low storage plinth. Slim wall-mounted study ledge with a small task light. Entrance door replaced by a flush matte warm-greige slab with a short matte black lever. Very slim window frame with a plain roller blind. Flat plain walls, pale warm-grey matte floor, slim linear ceiling luminaire, plain white bedding with a charcoal throw",
  hanok: "Contemporary Korean concept with a low floor-seated living horizon, a practical modern room. Low timber bed with plain wooden head panel, white bedding and a folded muted-indigo quilt. Low writing desk with a thin floor cushion near the window. Small movable Korean soban with simple legs, one floor cushion and plain white ceramic bowls. Slim timber clothes cabinet with small dark metal pulls. Warm off-white hanji-textured walls, medium natural brown timber floor, slim timber skirting. Window fitted with thin Korean timber lattice inner shutters with translucent paper-like panels, one leaf partly open. Entrance door replaced by a medium-brown wood veneer slab with a small dark-bronze lever. Slim modern flush ceiling light, concealed linear glow, small dark-metal LED desk light, neutral soft daylight"
};
const SC_SHORT = {
  single: "Small one-person room: sleeping, studying, storage and a small meal all fit, with a clear walking route from the door"
};
const END_SHORT = "The photo shows only the quiet interior: plain unmarked surfaces, plain fabrics, generic unbranded furniture, soft natural light";

// ---------------------------------------------------------------------
//  공간 종류·입구 문 위치 (2026-11-09 추가)
//  문제: 사진에 문이 안 보이는데 "입구 문을 바꿔라"라고 하면, AI가 옷장·수납장을 문으로 바꿔 그림.
//       주방·욕실 사진에도 침대·책상·식탁을 넣으라고 해서 엉뚱한 가구가 생김.
//  해결: 공간 종류(방/주방/욕실)와 문 위치(없음/왼쪽/오른쪽/정면)를 지시문에 넣고,
//       "문은 그 한 곳뿐, 나머지 키 큰 가구는 가구로 둔다"를 항상 붙입니다.
// ---------------------------------------------------------------------
const ROOMS = {
  auto:     { name: "자동 인식" },
  bedroom:  { name: "방(침실)" },
  kitchen:  { name: "주방" },
  bathroom: { name: "욕실" }
};
const DOORS = {
  auto:  { name: "자동 인식" },
  none:  { name: "사진에 문 없음", en: "" },
  left:  { name: "왼쪽 벽", en: "on the left wall" },
  right: { name: "오른쪽 벽", en: "on the right wall" },
  back:  { name: "정면(안쪽) 벽", en: "on the far back wall" }
};

// 스타일별 마감만(가구 제외) — 주방·욕실에 침대·책상이 들어가지 않게
const FINISH_SHORT = {
  nordic: "Scandinavian concept, varied natural palette: warm ivory walls with one sage-green accent, pale matte oak and warm-white surfaces, small wood pulls, brushed-nickel fittings, one or two plants, soft-white light and clean daylight",
  minimal: "Minimalist concept, limited palette of warm grey, matte ivory, pale ash and a little charcoal: flush handleless fronts with aligned seams, flat plain surfaces, slim linear lighting, very slim frames, nothing on display",
  hanok: "Contemporary Korean concept: warm off-white hanji-textured walls, medium natural brown timber with fine chamfered edges, small dark-bronze pulls, thin timber lattice with translucent paper-like panels at the window, slim modern ceiling light and concealed linear glow, neutral soft daylight; not Japanese"
};
const ROOM_SHORT = {
  kitchen: "Small one-person kitchen: keep the sink, cooktop, gas and water pipe positions; compact upper and lower cabinets, a clear prep counter, a fridge space and a small eating ledge only if there is room. No bed, no desk, no sofa",
  bathroom: "Small one-person bathroom: keep the toilet, washbasin, shower and floor drain positions; slip-resistant floor tiles, wall tiles, a compact vanity with closed storage, a mirror cabinet with plain glass and a towel rail. No bed, no desk, no dining table, no sofa"
};
const DOOR_STYLE = {
  nordic: "a matte terracotta slab with slim oak jamb and short brushed-nickel lever",
  minimal: "a flush matte warm-greige slab with a short matte black lever",
  hanok: "a medium-brown wood veneer slab with a small dark-bronze lever"
};
// 문 지시: 문이 보이는 곳만, 나머지는 절대 문으로 바꾸지 않음
function doorClause(style, door) {
  const keepFurn = "Wardrobes, cabinets, the fridge, tall storage and wall panels stay furniture: never turn them into doors and never add a new door";
  if (door === "none") return `No door is visible in image 1, so draw no door at all. ${keepFurn}`;
  if (DOORS[door] && DOORS[door].en) return `The only door is the existing opening ${DOORS[door].en}; keep it exactly there and restyle just that door as ${DOOR_STYLE[style]}. ${keepFurn}`;
  return `Keep any existing door exactly where it is and restyle it as ${DOOR_STYLE[style]}; if no door is clearly visible, draw none. ${keepFurn}`;
}
// 스타일 문장에서 "Entrance door replaced ..." 문장을 빼고 doorClause로 대신함
const stripDoor = s => s.replace(/\s*Entrance door replaced[^.]*\./, "");

function buildShortPrompt(scenario, style, hasPlan, opts) {
  const o = opts || {};
  const room = ROOM_SHORT[o.room] ? o.room : "bedroom";
  const plan = hasPlan ? ". Image 2 is the floor plan of this same room: place the furniture where the plan shows it, seen from the camera of image 1" : "";
  const base = BASE_SHORT.replace(", the entrance door and window treatment", " and window treatment");
  const body = room === "bedroom" ? `${SC_SHORT[scenario]}. ${stripDoor(SHORT[style])}` : `${ROOM_SHORT[room]}. ${FINISH_SHORT[style]}`;
  return `${base}. ${body}. ${doorClause(style, o.door)}${plan}. ${END_SHORT}.`;
}

globalThis.REMODEL = { SCENARIOS, STYLES, ROOMS, DOORS, BASE_PROMPT, NEG_PROMPT, NEG_HANOK, buildPrompt, buildRenderPrompt, buildShortPrompt, doorClause };
})();
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
  if (req.method === "GET") return json(200, { ready: Boolean(env.AI), needsCode: Boolean(env.ACCESS_CODE), engine: "cloudflare", model: "FLUX.2 klein", maxInput: 504, plan: true, roomDoor: true });
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
