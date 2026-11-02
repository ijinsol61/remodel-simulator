// =====================================================================
//  사전 생성 예시 목록 (ChatGPT에서 만들고 팀이 검수한 AI 리모델링 시안)
//  화면에는 항상 "AI 리모델링 시안 · 사전 생성 예시 · 실시간 생성 아님"이 표시됩니다.
//  실시간 변환(Cloudflare) 결과와는 따로 관리합니다.
//
//  스타일 표시명: nordic = 북유럽식, minimal = 현대식, hanok = 한옥식 (prompts.js의 name)
//  사례 추가: 아래 배열에 { ... } 하나를 더 넣고 이미지를 examples 폴더에 올리면 됩니다.
//  준비되지 않은 사례는 넣지 마세요 (세 번째 사례: 구축 소형주방은 나중에 추가).
//  이미지가 아직 안 올라간 경우 화면에 "이미지 준비 중"으로 표시됩니다.
// =====================================================================

// 사진 파일을 같은 이름으로 바꿔 올렸을 때 이 값을 바꾸면 브라우저가 새 사진을 불러옵니다
globalThis.EXAMPLES_VERSION = "20261103-0030b";

globalThis.PREGENERATED_EXAMPLES = [
  {
    id: "room1-bedroom",
    title: "1인가구 소형 공간(침실)",
    scenario: "single",
    type: "bedroom",
    status: "ready",
    // 직접 촬영한 사진에서 개인 물품만 정리 보정 (방 구조·시점·마감은 그대로)
    original: "examples/acc596eb-ae38-4b4d-aafc-f8e4b759016d.png",
    originalLabel: "직접 촬영 원본 (개인 물품 정리 보정)",
    styles: {
      nordic:  { image: "examples/room1_nordic.jpg",  summary: "밝은 목재와 다양한 컬러 포인트, 의자식 식사 공간과 별도의 공부 공간을 구성한 북유럽식 소형 침실 시안." },
      minimal: { image: "examples/room1_minimal.jpg", summary: "통합 수납과 접이식 기능을 활용해 중앙 바닥을 최대한 비우고 생활 기능을 정리한 현대식 소형 침실 시안." },
      hanok:   { image: "examples/room1_hanok.jpg",   summary: "낮은 생활 높이, 소반, 목재 짜임과 한국적 창호 비례를 현대적으로 해석한 한옥식 소형 침실 시안." }
    }
  },
  {
    id: "room2-bathroom",
    title: "1인가구 소형 공간(욕실)",
    scenario: "single",
    type: "bathroom",
    status: "ready",
    original: "examples/room2_bathroom_before.jpg",
    originalLabel: "직접 촬영 원본",
    conditions: [
      "원본 욕실 크기·벽 위치·천장 높이 유지",
      "문에서 보는 카메라 시점 유지",
      "공간을 뒤로 늘리거나 좌우로 넓히지 않음",
      "욕실 안 설비와 마감만 실제 크기에 맞게 재구성"
    ],
    styles: {
      nordic:  { image: "examples/room2_bathroom_nordic.png",       summary: "밝은 타일과 자연 목재, 부드러운 금속 마감을 사용해 좁은 욕실을 따뜻하고 실용적으로 구성한 북유럽식 욕실 시안." },
      minimal: { image: "examples/room2_bathroom_modern.png",       summary: "차분한 타일과 직선적인 설비, 얕은 수납을 적용해 제한된 공간의 시각적 복잡함을 줄인 현대식 욕실 시안." },
      hanok:   { image: "examples/room2_bathroom_hanok.png", summary: "목재 짜임, 미색 벽면, 짙은 바닥과 브론즈 계열 설비를 조합해 한옥의 재료감을 현대 욕실에 적용한 한옥식 욕실 시안." }
    }
  }
  // 세 번째 사례(구축 소형주방): 준비되면 위와 같은 형식으로 추가
];

// 화면 코드가 읽는 형식으로 변환 (고칠 필요 없음)
globalThis.EXAMPLES = globalThis.PREGENERATED_EXAMPLES
  .filter(e => e.status === "ready")
  .map(e => ({
    id: e.id, title: e.title, scenario: e.scenario, type: e.type, variant: "A", source: "ChatGPT",
    before: e.original, beforeLabel: e.originalLabel, conditions: e.conditions,
    after: Object.fromEntries(Object.entries(e.styles).map(([k, v]) => [k, v.image])),
    summary: Object.fromEntries(Object.entries(e.styles).map(([k, v]) => [k, v.summary]))
  }));
