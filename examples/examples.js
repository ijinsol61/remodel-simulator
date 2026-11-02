// =====================================================================
//  사전 생성 예시 목록 (ChatGPT에서 만들고 팀이 검수한 이미지)
//  화면에는 항상 "AI 리모델링 시안 · 사전 생성 예시 · 실시간 생성 아님"이 표시됩니다.
//  실시간 변환(Cloudflare) 결과와는 따로 관리합니다.
//
//  사례 추가 방법: 아래 배열에 { ... } 하나를 더 넣고, 이미지 4장을 examples 폴더에 올리면 됩니다.
//  준비되지 않은 사례는 넣지 마세요 (빈 카드·임의 이미지 금지).
//  이미지가 아직 안 올라간 경우 화면에 "이미지 준비 중"으로 표시됩니다.
//  scenario 값: "single" = 1인가구 소형공간 활용 (노후주택 시나리오는 출품 범위에서 제외)
// =====================================================================
globalThis.PREGENERATED_EXAMPLES = [
  {
    id: "room1-bedroom",
    title: "1인 가구 소형 침실",
    scenario: "single",
    type: "bedroom",
    status: "ready",
    // 원본은 개인 물건을 모자이크한 사진입니다 (공개 저장소)
    original: "examples/room1_before.jpg",
    styles: {
      nordic:  { image: "examples/room1_nordic.jpg",  summary: "색채를 활용한 북유럽형 소형 침실. 의자식 식사, 별도 공부 공간, 밝은 목재와 컬러 포인트를 사용." },
      minimal: { image: "examples/room1_minimal.jpg", summary: "통합 수납과 접이식 기능을 중심으로 바닥을 비운 미니멀 소형 침실." },
      hanok:   { image: "examples/room1_hanok.jpg",   summary: "낮은 생활 높이, 소반, 목재 가구와 절제된 한국적 창호 디테일을 적용한 한옥모던 침실." }
    }
  }
  // 다음 사례: 1인가구 소형공간 사진이 준비되면 위와 같은 형식으로 추가
];

// 화면 코드가 읽는 형식으로 변환 (고칠 필요 없음)
globalThis.EXAMPLES = globalThis.PREGENERATED_EXAMPLES
  .filter(e => e.status === "ready")
  .map(e => ({
    id: e.id, title: e.title, scenario: e.scenario, type: e.type, variant: "A", source: "ChatGPT",
    before: e.original,
    after: Object.fromEntries(Object.entries(e.styles).map(([k, v]) => [k, v.image])),
    summary: Object.fromEntries(Object.entries(e.styles).map(([k, v]) => [k, v.summary]))
  }));
