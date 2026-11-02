// =====================================================================
//  사전 생성 예시 목록
//  화면에 "AI 리모델링 시안 · 사전 생성 예시 · 실시간 생성 아님"이 표시됩니다.
//  원본(room1_before.jpg)은 개인 물건을 모자이크한 사진입니다 (공개 저장소).
// =====================================================================
globalThis.EXAMPLES = [
  { id: "room1", variant: "A", title: "원본과 3가지 스타일 비교", scenario: "single",
    before: "examples/room1_before.jpg",
    after: { nordic: "examples/room1_nordic.jpg", minimal: "examples/room1_minimal.jpg", hanok: "examples/room1_hanok.jpg" },
    source: "ChatGPT" }
];
