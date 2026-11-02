(function () {
// =====================================================================
//  프롬프트·스타일 설정 파일
//  화면(index.html)과 서버(api/remodel.js)가 모두 이 파일 하나를 씁니다.
//  스타일 이름, 설명, AI에 보내는 문장을 바꾸고 싶으면 이 파일만 고치면 됩니다.
//  (내 컴퓨터에서 index.html을 더블클릭해 열어도 동작하도록 일반 스크립트로 작성)
//  주의: 브랜드명, 디자이너·작가 이름, 특정 제품명은 넣지 마세요(카피 위험).
// =====================================================================

const SCENARIOS = {
  old: {
    name: "노후주택 리모델링",
    desc: "도배·바닥·조명 교체와 노후 마감 정리 중심",
    prompt: "This is an old Korean house being renovated: apply fresh new wallpaper, new flooring, replaced lighting fixtures, and clean new baseboards and moldings",
    row: ["노후 마감 정리", "얼룩·변색 벽면 재도배, 걸레받이·몰딩 교체, 형광등 철거"]
  },
  single: {
    name: "1인가구 소형공간 활용",
    desc: "수납 보강과 다기능 가구 중심",
    prompt: "This is a small room for one person: use space-saving multifunctional furniture, a storage bed with drawers, wall-mounted shelves, built-in storage, and bright colors that make the room feel larger",
    row: ["수납 보강", "벽 선반, 수납형 침대·스툴, 붙박이장, 벽부착 책상으로 바닥 면적 확보"]
  }
};

const STYLES = {
  nordic: {
    name: "북유럽풍",
    desc: "밝은 오크와 화이트, 패브릭의 따뜻한 질감",
    sw: ["#f3f1ec", "#d8b88a", "#bfc1bd", "#93a58a"],
    wall: "화이트 톤 실크 벽지",
    floor: "라이트 오크 강마루",
    light: "패브릭 펜던트 조명, 전구색 3000K",
    window: "화이트 프레임 필름 마감, 린넨 쉬어 커튼",
    furn: "원목 다리 패브릭 소파, 원형 원목 테이블, 실내 식물",
    prompt: "Style: Scandinavian. White walls, light oak wood flooring, light grey fabric sofa with wooden legs, round oak coffee table, linen sheer curtains, green potted plants, warm 3000K pendant light, soft daylight"
  },
  minimal: {
    name: "미니멀",
    desc: "화이트와 연한 목재, 가구를 줄인 정돈된 공간",
    sw: ["#f6f6f3", "#e6d9c3", "#e7e3db", "#b7b2a8"],
    wall: "무광 화이트 도장",
    floor: "애쉬 톤 광폭 강마루",
    light: "매입 다운라이트, 주백색 4000K",
    window: "화이트 프레임, 롤 블라인드",
    furn: "다리 없는 로우 소파, 손잡이 없는 붙박이 수납",
    prompt: "Style: minimalist. Matte white walls, pale ash wide plank flooring, low profile sofa, handleless built-in storage, recessed downlights, uncluttered surfaces, calm neutral palette"
  },
  hanok: {
    name: "한옥모던",
    desc: "한지 톤 벽, 목재 기둥·보, 마루와 창호 문양",
    sw: ["#efe5d0", "#b07c48", "#7a5233", "#3f5f63"],
    wall: "한지 톤 벽지, 목재 기둥·중방 몰딩",
    floor: "짙은 마루 톤 강마루",
    light: "한지 펜던트 조명, 2700K",
    window: "목재 프레임, 띠살 창호 문양 필름",
    furn: "낮은 평상형 좌식 가구, 소반, 반닫이 수납장",
    prompt: "Style: modern Korean hanok inspired. Hanji paper textured walls, exposed dark wood posts and beams, warm honey wood maru flooring, traditional Korean ttisal lattice window pattern with hanji paper, low wooden platform seating, Korean soban low table, hanji pendant lamp, warm 2700K light"
  }
};

const BASE_PROMPT =
  "Remodel the interior shown in this photo. Keep the exact same room: same wall positions, same window and door positions and sizes, same ceiling and ceiling height, same camera position, lens, angle and perspective, same framing. Only change wall and floor finishes, furniture, storage and lighting. Remove clutter, cables, clothes and any personal items. If any person or pet appears in the photo, remove it and show the empty room. Any surfaces must be plain: no printed words, signs or logos anywhere. Photorealistic interior photograph, natural daylight, realistic materials";

const NEG_PROMPT =
  "people, persons, human bodies, faces, hands, text, letters, logos, watermarks, signatures, brand names, paintings, posters, artwork, picture frames with images, any nudity or suggestive content, moved windows, removed walls, changed room shape, extra doors, distorted perspective";

const NEG_HANOK = ", Japanese style elements, tatami mats, shoji screens";

// AI에 실제로 보내는 최종 문장
function buildPrompt(scenario, style) {
  const neg = NEG_PROMPT + (style === "hanok" ? NEG_HANOK : "");
  return `${BASE_PROMPT}.\n${SCENARIOS[scenario].prompt}.\n${STYLES[style].prompt}.\nDo not include or create any of the following: ${neg}.`;
}


// 3D 렌더 → 실사 사진 (Gemini 앱 등 이미지 AI에 붙여넣는 문장)
const RENDER_BASE =
  "The attached image is a simple 3D massing render of a remodeled room. Turn it into a photorealistic interior photograph taken with a full-frame camera. Keep EXACTLY the same camera angle, perspective, room shape, wall, window and door positions, ceiling height, and the same position, size and colour of every piece of furniture. Replace the boxy placeholder shapes with realistic, well-made furniture of the same footprint, adding natural detail: wood grain, fabric texture and soft folds on bedding and cushions, subtle reflections on the floor, realistic soft daylight from the window and warm light from the lamps, soft shadows. Do not add or remove furniture";
const RENDER_NEG =
  "people, persons, faces, hands, text, letters, logos, watermarks added to the scene, brand names, recognizable branded products, copies of famous paintings or photographs (a framed print may only show simple abstract colour blocks), any nudity or suggestive content, moved windows, changed room shape, extra doors, distorted perspective, cartoon or illustration look";
function buildRenderPrompt(scenario, style) {
  const neg = RENDER_NEG + (style === "hanok" ? NEG_HANOK : "");
  return `${RENDER_BASE}.\n${SCENARIOS[scenario].prompt}.\n${STYLES[style].prompt}.\nDo not include: ${neg}.`;
}

globalThis.REMODEL = { SCENARIOS, STYLES, BASE_PROMPT, NEG_PROMPT, NEG_HANOK, buildPrompt, buildRenderPrompt };
})();
