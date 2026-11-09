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
    door: "테라코타색 문, 밝은 오크 문틀, 금속 레버",
    furn: "다리 있는 오크 싱글 침대, 서랍 달린 120cm 오크 책상 + 등받이 있는 쿠션 의자, 오크·밝은색 옷장",
    meal: "책상을 식탁 겸용으로 사용 (코발트블루 의자)",
    prompt: "CONCEPT — SCANDINAVIAN: comfortable everyday life, light functional furniture on slender legs, natural materials and a thoughtful varied palette, not an all-beige room. Sleeping on a light-oak single bed on raised legs with plain ivory bedding, one ochre and one dusty-blue cushion. A sturdy light-oak study desk about 120 cm wide and 60 cm deep with a drawer unit and a desk lamp, near daylight, with a comfortable upholstered desk chair with a full backrest in matte cobalt blue (about #2851A3); the desk also serves as the chair-seated meal spot. No floor dining, no soban, no floor cushions. A compact freestanding warm-white and light-oak clothes cupboard with small wood pulls, not a wall of grey built-ins. Warm ivory walls (about #F2EEE5) with one soft sage-green wall (about #A9B7A0); pale matte oak floor. Replace the entrance door leaf, frame and handle with a smooth matte terracotta slab (about #AF654D), slim oak jamb and a short brushed-nickel lever. Plain linen sheer curtain drawn aside, a plain wool rug, one or two small plants, a soft-white pendant over the dining spot, a reading light and a desk lamp, balanced with clean natural daylight so the colours stay distinct. No sofa, no patterned textiles, no famous designer-chair silhouettes"
  },
  minimal: {
    name: "현대식",  // 내부 ID는 minimal 유지
    desc: "닫힌 수납, 기능 통합, 필요할 때 펼치는 가구",
    sw: ["#efeee9", "#cfc8bd", "#d9d4cb", "#3c3c3a"],
    wall: "무광 아이보리·따뜻한 회색, 걸레받이 최소화",
    floor: "연한 웜그레이 무광 바닥 또는 저대비 애쉬 광폭 마루",
    light: "선형 천장등 + 수납부·작업 선반 조명",
    window: "얇은 창틀, 무지 롤 블라인드",
    door: "옅은 애쉬 목재 문, 차콜 문틀, 검정 레버 (수납장과 다른 색으로 구분)",
    furn: "낮은 수납 받침 일체형 침대, 닫힌 수납벽, 서랍 달린 120cm 붙박이 책상 + 팔걸이 있는 작업 의자",
    meal: "책상을 식탁 겸용으로 사용",
    prompt: "CONCEPT — MINIMALIST: fewer separate objects, functions integrated into closed furniture, generous clear floor. A limited palette of warm grey, matte ivory, pale ash and a little charcoal; do not simply bleach Scandinavian furniture white. A continuous wall of flush closed full-height storage in matte warm greige with aligned seams and concealed handles. A single bed integrated with a low storage plinth, placed so the centre of the floor stays clear and never in front of the storage doors. A solid built-in study desk about 120 cm wide and 60 cm deep with drawers and restrained task lighting, with a comfortable cushioned charcoal task chair with backrest and armrests on casters; the desk also serves as the meal spot. No folding chairs, no flimsy wall ledges. If the entrance door is visible, keep it a working door in place and restyle it as a pale-ash wood door in a slim charcoal frame with a short matte black lever, clearly different from the storage wall; storage never covers or replaces a door. Very slim window frames with a plain roller blind. Flat unpatterned walls, thin baseboards or shadow gaps, a pale warm-grey matte mineral-look floor or very low-contrast pale ash planks. A slim linear ceiling luminaire close to the ceiling and compact integrated task lights, no pendant. Plain white bedding with one smooth charcoal throw. No sofa, no patterned rug, no decorative cushions, no display shelving, no ornamental trim"
  },
  hanok: {
    name: "한옥식",
    desc: "좌식 생활과 목재 창호에서 착안한 현대적 공간",
    sw: ["#f1ebdf", "#9a6b45", "#6b4a2e", "#33415c"],
    wall: "미색 한지 느낌 벽 마감",
    floor: "중간 갈색 목재 마루, 얇은 목재 걸레받이",
    light: "얇은 현대식 천장등, 간접조명, 금속 작업등 (종이등 없음)",
    window: "얇은 목재 살 내창(세로살 + 간격 둔 가로띠), 종이 느낌 반투명 판",
    door: "중간 갈색 목재 문, 더 진한 목재 문틀, 어두운 금속 레버",
    furn: "낮은 목재 침상, 서랍 달린 110cm 좌식 책상 + 등받이 좌식 의자, 목재 옷장",
    meal: "옮겨 쓰는 소반",
    prompt: "CONCEPT — CONTEMPORARY KOREAN, inspired by Korean floor-seated living and timber windows: a low living horizon, quiet timber furniture and fine hanji-like wall texture. This is a practical contemporary room, not a traditional house reconstruction and not Japanese. A low timber bed with a slim plain wooden head panel, plain white bedding and a folded muted-indigo quilt. A solid low timber writing desk about 110 cm wide and 35 cm high with a drawer and knee space near the window, with a padded Korean floor chair with a backrest. A small movable Korean soban with restrained chamfered corners and simple legs, one floor cushion and plain white ceramic bowls, spoon, chopsticks and a water cup; clearly different from a modern coffee table. A slim timber clothes cabinet with small dark metal bar pulls; a low chest only if needed. Plain warm off-white hanji-like walls, medium natural brown timber floor and slim timber skirting. Reinterpret the window with thin Korean timber lattice inner shutters: narrow vertical members with spaced horizontal bands and paper-like translucent panels, one leaf partly open. Replace the entrance door leaf, frame and handle with a medium-brown flat wood veneer slab, thin matching jamb and a small matte dark-bronze straight lever. Lighting: a slim modern warm-white flush ceiling luminaire, a concealed linear glow, a small matte dark-metal linear LED desk light and a tiny plain cylinder reading light. Neutral soft daylight with gentle local warmth, not an orange heritage-hotel cast. No paper lanterns or paper-shaded lamps, no heavy posts or deep ceiling beams, no carved ornament"
  }
};

// 모든 스타일 공통: 시점만 고정, 나머지는 스타일에 맞게 재설계
const BASE_PROMPT =
  "Create an original photorealistic remodeling proposal for the room in the attached photo. The shared comparison constraint is the exact VIEWPOINT: same camera location and height, same lens and perspective, same framing and slight camera roll, same aspect ratio and composition. Do not move the camera, zoom, straighten the view into a different composition or convert it into a wide-angle showroom. Keep the real room size, wall positions, window and door openings and ceiling height; do not enlarge the room. Furniture types, positions and proportions, lighting, wall and floor finishes, molding, storage, the entrance door leaf, frame and handle, and the window treatment may all be redesigned according to the concept below; do not keep the original furniture arrangement just because it is in the photo. Plan the layout like an architect: every piece stands on the floor in its own zone with no overlapping furniture, the bed never blocks or overlaps wardrobe doors, and about 60 cm stays clear in front of storage. Restyle the entrance door only if a door is actually visible in the photo, in its existing position; if no door is visible, add none, and never turn wardrobes, cabinets, the fridge or tall panels into doors. Remove personal photographs, clothes racks, fans, cables, clutter, personal objects, branding, writing and figurines. Use generic independently designed furniture, believable materials and joints, grounded contact shadows and soft natural daylight. Output one complete photorealistic interior photograph only";

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
// 2026-11-10 개정 (desk3): 1인가구가 실제로 사는 방을 기준으로 다시 설계
//  - 순서: ① 시점·구조 고정 → ② 문(가장 먼저, 가장 분명하게) → ③ 1인 생활 배치 → ④ 스타일 → ⑤ 마무리
//  - 문은 수납장과 다른 색·문틀·레버로 그려 옷장과 섞이지 않게 함 (현대식에서 문이 옷장으로 바뀐 문제)
//  - 사진에 문이 안 보인다고 AI가 판단해도 "문 없음"으로 단정하지 않음. "있는 문은 그대로, 없으면 추가 안 함"
//  - 가구는 적게, 제 크기로: 싱글 침대·옷장 하나·120cm 책상과 바퀴 의자, 책상이 식탁 겸용
const BASE_SHORT =
  "Photorealistic remodeling proposal of the room in image 1, from the same camera position, lens, framing and aspect ratio. Keep the real room size, walls, ceiling height and every window and door opening exactly where they are. Redesign furniture, finishes, lighting and window treatment; remove clutter and personal items";
// 1인가구 방: 실제로 살 수 있는 배치
const SC_SHORT = {
  single: "Livable plan for one person, each item in its own floor zone with nothing overlapping: a single bed against a solid wall away from the door; one wardrobe on a wall without a door or window, its doors free to open; a desk beside or under the window for daylight, with room to pull out the chair, also used for meals; a clear 80 cm path from the door into the room. Fewer, well-sized pieces rather than filling every wall"
};
const SHORT = {
  nordic: "Scandinavian concept: warm ivory walls with one sage-green wall, pale matte oak floor, plain linen sheer curtain, plain wool rug, one or two plants. Light-oak single bed on legs, ivory bedding with one ochre and one dusty-blue cushion. Freestanding light-oak desk on four legs, 120 cm wide, with a drawer unit and a desk lamp, and a padded cobalt-blue office chair with a high backrest on a five-star caster base. Freestanding warm-white and oak wardrobe with small wood pulls. Soft-white pendant over the desk, reading lamp, clean daylight",
  minimal: "Minimalist concept in warm grey, matte ivory, pale ash and a little charcoal, generous clear floor. One run of flush full-height warm-greige wardrobe with concealed handles, ending well clear of the door. Single bed on a low storage plinth, white bedding and a charcoal throw. Freestanding pale-ash desk on the floor, 120 cm wide, with a three-drawer pedestal and a slim task lamp, and a padded charcoal office chair with a high backrest, armrests and a five-star caster base. Plain roller blind, flat plain walls, pale warm-grey matte floor, slim linear ceiling light",
  hanok: "Contemporary Korean concept with a low floor-seated living horizon, practical and modern, not Japanese. Low timber bed with a plain wooden head panel, white bedding and a folded muted-indigo quilt. Solid low timber writing desk on the floor by the window, 110 cm wide with a drawer, and a padded floor chair with a tall backrest; a small movable soban with white ceramic bowls. Timber wardrobe with small dark-bronze pulls. Off-white hanji-textured walls, medium brown timber floor, thin timber lattice inner shutters with paper-like panels at the window. Slim flush ceiling light, concealed linear glow, small dark-metal desk lamp"
};
const END_SHORT = "Plain unmarked surfaces, generic unbranded furniture, soft natural light";

// ---------------------------------------------------------------------
//  공간 종류·입구 문 위치 (2026-11-09 추가, 11-10 개정)
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
// 문은 수납장과 다른 색 + 눈에 띄는 문틀 + 레버 → 옷장과 섞이지 않음
const DOOR_STYLE = {
  nordic: "a matte terracotta door in a light-oak frame with a brushed-nickel lever",
  minimal: "a pale-ash wood door in a slim charcoal frame with a matte black lever",
  hanok: "a medium-brown wood door in a darker timber frame with a dark-bronze lever"
};
// 문 지시 (지시문 앞쪽에 둠)
//  - 위치를 아는 경우: 그 문은 실제로 여닫는 문으로 유지, 앞은 비움, 수납장이 덮거나 대신하지 않음
//  - "문 없음"은 사용자가 직접 고른 경우만. 자동 인식이 "없음"이어도 서버가 auto(신중 모드)로 보냄
function doorClause(style, door) {
  const ds = DOOR_STYLE[style];
  if (door === "none") return "No door is in view, so add none; wardrobes and cabinets stay furniture";
  if (DOORS[door] && DOORS[door].en) return `The room's door is ${DOORS[door].en}: it stays a real working door in the same place, ${ds}, clearly different from the storage, with clear floor in front of it. Storage never covers or replaces it, and no new doors are added elsewhere`;
  return `Every existing door stays a real working door in the same place, ${ds}, clearly different from the storage, with clear floor in front of it; storage never covers or replaces a door. Where there is no door, add none; wardrobes stay furniture`;
}

function buildShortPrompt(scenario, style, hasPlan, opts) {
  const o = opts || {};
  const room = ROOM_SHORT[o.room] ? o.room : "bedroom";
  const plan = hasPlan ? ". Image 2 is this room's floor plan: place the furniture as drawn, seen from the camera of image 1" : "";
  const body = room === "bedroom" ? `${SC_SHORT[scenario]}. ${SHORT[style]}` : `${ROOM_SHORT[room]}. ${FINISH_SHORT[style]}`;
  return `${BASE_SHORT}. ${doorClause(style, o.door)}. ${body}${plan}. ${END_SHORT}.`;
}

// 지시문 버전: 서버 주소(/api/remodel)에 표시되어 배포 여부를 확인할 수 있음
const PROMPT_VERSION = "20261110-desk3";
globalThis.REMODEL = { PROMPT_VERSION, SCENARIOS, STYLES, ROOMS, DOORS, BASE_PROMPT, NEG_PROMPT, NEG_HANOK, buildPrompt, buildRenderPrompt, buildShortPrompt, doorClause };
})();
