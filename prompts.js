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
  old: {
    name: "노후주택 리모델링",
    desc: "노후 마감 교체와 안전한 동선 중심",
    prompt: "This is a room in an old Korean house being renovated: replace stained or discoloured wallpaper, worn flooring, old fluorescent lights and old moldings; keep a wide clear route of about 1.2 m from the door and a step-free floor",
    row: ["노후 마감 정리", "얼룩·변색 벽면 재마감, 바닥·걸레받이·몰딩 교체, 형광등 철거, 문턱 없는 바닥과 넓은 동선"]
  },
  single: {
    name: "1인가구 소형공간 활용",
    desc: "수면·작업·수납·식사를 작은 방 안에서 해결",
    prompt: "This is a small room for one person: include sleeping, working/studying, clothes storage and eating in a practical compact one-person arrangement at believable compact sizes, keep a clear route from the door through the middle, and do not add more furniture than the room can hold",
    row: ["소형공간 활용", "수면·작업·수납·식사 4가지 기능을 한 방에 배치, 문에서 이어지는 통로 확보, 방 크기를 무리하게 키우지 않음"]
  }
};

const STYLES = {
  nordic: {
    name: "북유럽",
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
    name: "미니멀",
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
    name: "한옥모던",
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
  "Create an original photorealistic remodeling proposal for the room in the attached photo. The shared comparison constraint is the exact VIEWPOINT: same camera location and height, same lens and perspective, same framing and slight camera roll, same aspect ratio and composition. Do not move the camera, zoom, straighten the view into a different composition or convert it into a wide-angle showroom. Keep the real room size, wall positions, window and door openings and ceiling height; do not enlarge the room. Furniture types, positions and proportions, lighting, wall and floor finishes, molding, storage, the entrance door leaf, frame and handle, and the window treatment may all be redesigned according to the concept below; do not keep the original furniture arrangement just because it is in the photo. Remove personal photographs, clothes racks, fans, cables, clutter, personal objects, branding, writing and figurines. Use generic independently designed furniture, believable materials and joints, grounded contact shadows and soft natural daylight. Output one complete photorealistic interior photograph only";

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

globalThis.REMODEL = { SCENARIOS, STYLES, BASE_PROMPT, NEG_PROMPT, NEG_HANOK, buildPrompt, buildRenderPrompt };
})();
