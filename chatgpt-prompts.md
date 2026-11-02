# ChatGPT로 사전 생성 예시 만들기

시연 전에 ChatGPT에서 미리 만든 결과를 사이트의 **사전 생성 예시**로 넣습니다. 실제 서비스와 같은 지시문을 써야 결과가 일관됩니다.

## 순서
1. ChatGPT 새 대화 → 방 사진 1장 첨부 (사람·가족사진·주소·브랜드 로고가 안 보이는 **직접 찍은 사진**만)
2. 아래에서 시나리오·스타일에 맞는 문장을 **그대로** 붙여넣고 보내기
3. 결과 이미지를 저장 → 파일 이름 예: `room1_nordic.jpg`
4. 같은 사진으로 세 스타일을 각각 새 대화에서 만들기 (앞 결과가 섞이지 않게)
5. 원본 + 결과 3장을 Claude에게 보내면 `examples` 폴더와 목록에 넣어 드립니다
   (또는 사이트의 [ChatGPT 결과 이미지로 비교 화면 점검]으로 바로 확인)

목표: 계획서의 "시나리오 특화 데모 케이스 3건 이상" → 방 3곳 × 스타일 3종

## 노후주택 리모델링 · 북유럽풍

```
Remodel the interior shown in this photo. Keep the exact same room: same wall positions, same window and door positions and sizes, same ceiling and ceiling height, same camera position, lens, angle and perspective, same framing. Only change wall and floor finishes, furniture, storage and lighting. Remove clutter, cables, clothes and any personal items. If any person or pet appears in the photo, remove it and show the empty room. Any surfaces must be plain: no printed words, signs or logos anywhere. Photorealistic interior photograph, natural daylight, realistic materials.
This is an old Korean house being renovated: apply fresh new wallpaper, new flooring, replaced lighting fixtures, and clean new baseboards and moldings.
Style: Scandinavian. White walls, light oak wood flooring, light grey fabric sofa with wooden legs, round oak coffee table, linen sheer curtains, green potted plants, warm 3000K pendant light, soft daylight.
Do not include or create any of the following: people, persons, human bodies, faces, hands, text, letters, logos, watermarks, signatures, brand names, paintings, posters, artwork, picture frames with images, any nudity or suggestive content, moved windows, removed walls, changed room shape, extra doors, distorted perspective.
```

## 노후주택 리모델링 · 미니멀

```
Remodel the interior shown in this photo. Keep the exact same room: same wall positions, same window and door positions and sizes, same ceiling and ceiling height, same camera position, lens, angle and perspective, same framing. Only change wall and floor finishes, furniture, storage and lighting. Remove clutter, cables, clothes and any personal items. If any person or pet appears in the photo, remove it and show the empty room. Any surfaces must be plain: no printed words, signs or logos anywhere. Photorealistic interior photograph, natural daylight, realistic materials.
This is an old Korean house being renovated: apply fresh new wallpaper, new flooring, replaced lighting fixtures, and clean new baseboards and moldings.
Style: minimalist. Matte white walls, pale ash wide plank flooring, low profile sofa, handleless built-in storage, recessed downlights, uncluttered surfaces, calm neutral palette.
Do not include or create any of the following: people, persons, human bodies, faces, hands, text, letters, logos, watermarks, signatures, brand names, paintings, posters, artwork, picture frames with images, any nudity or suggestive content, moved windows, removed walls, changed room shape, extra doors, distorted perspective.
```

## 노후주택 리모델링 · 한옥모던

```
Remodel the interior shown in this photo. Keep the exact same room: same wall positions, same window and door positions and sizes, same ceiling and ceiling height, same camera position, lens, angle and perspective, same framing. Only change wall and floor finishes, furniture, storage and lighting. Remove clutter, cables, clothes and any personal items. If any person or pet appears in the photo, remove it and show the empty room. Any surfaces must be plain: no printed words, signs or logos anywhere. Photorealistic interior photograph, natural daylight, realistic materials.
This is an old Korean house being renovated: apply fresh new wallpaper, new flooring, replaced lighting fixtures, and clean new baseboards and moldings.
Style: modern Korean hanok inspired. Hanji paper textured walls, exposed dark wood posts and beams, warm honey wood maru flooring, traditional Korean ttisal lattice window pattern with hanji paper, low wooden platform seating, Korean soban low table, hanji pendant lamp, warm 2700K light.
Do not include or create any of the following: people, persons, human bodies, faces, hands, text, letters, logos, watermarks, signatures, brand names, paintings, posters, artwork, picture frames with images, any nudity or suggestive content, moved windows, removed walls, changed room shape, extra doors, distorted perspective, Japanese style elements, tatami mats, shoji screens.
```

## 1인가구 소형공간 활용 · 북유럽풍

```
Remodel the interior shown in this photo. Keep the exact same room: same wall positions, same window and door positions and sizes, same ceiling and ceiling height, same camera position, lens, angle and perspective, same framing. Only change wall and floor finishes, furniture, storage and lighting. Remove clutter, cables, clothes and any personal items. If any person or pet appears in the photo, remove it and show the empty room. Any surfaces must be plain: no printed words, signs or logos anywhere. Photorealistic interior photograph, natural daylight, realistic materials.
This is a small room for one person: use space-saving multifunctional furniture, a storage bed with drawers, wall-mounted shelves, built-in storage, and bright colors that make the room feel larger.
Style: Scandinavian. White walls, light oak wood flooring, light grey fabric sofa with wooden legs, round oak coffee table, linen sheer curtains, green potted plants, warm 3000K pendant light, soft daylight.
Do not include or create any of the following: people, persons, human bodies, faces, hands, text, letters, logos, watermarks, signatures, brand names, paintings, posters, artwork, picture frames with images, any nudity or suggestive content, moved windows, removed walls, changed room shape, extra doors, distorted perspective.
```

## 1인가구 소형공간 활용 · 미니멀

```
Remodel the interior shown in this photo. Keep the exact same room: same wall positions, same window and door positions and sizes, same ceiling and ceiling height, same camera position, lens, angle and perspective, same framing. Only change wall and floor finishes, furniture, storage and lighting. Remove clutter, cables, clothes and any personal items. If any person or pet appears in the photo, remove it and show the empty room. Any surfaces must be plain: no printed words, signs or logos anywhere. Photorealistic interior photograph, natural daylight, realistic materials.
This is a small room for one person: use space-saving multifunctional furniture, a storage bed with drawers, wall-mounted shelves, built-in storage, and bright colors that make the room feel larger.
Style: minimalist. Matte white walls, pale ash wide plank flooring, low profile sofa, handleless built-in storage, recessed downlights, uncluttered surfaces, calm neutral palette.
Do not include or create any of the following: people, persons, human bodies, faces, hands, text, letters, logos, watermarks, signatures, brand names, paintings, posters, artwork, picture frames with images, any nudity or suggestive content, moved windows, removed walls, changed room shape, extra doors, distorted perspective.
```

## 1인가구 소형공간 활용 · 한옥모던

```
Remodel the interior shown in this photo. Keep the exact same room: same wall positions, same window and door positions and sizes, same ceiling and ceiling height, same camera position, lens, angle and perspective, same framing. Only change wall and floor finishes, furniture, storage and lighting. Remove clutter, cables, clothes and any personal items. If any person or pet appears in the photo, remove it and show the empty room. Any surfaces must be plain: no printed words, signs or logos anywhere. Photorealistic interior photograph, natural daylight, realistic materials.
This is a small room for one person: use space-saving multifunctional furniture, a storage bed with drawers, wall-mounted shelves, built-in storage, and bright colors that make the room feel larger.
Style: modern Korean hanok inspired. Hanji paper textured walls, exposed dark wood posts and beams, warm honey wood maru flooring, traditional Korean ttisal lattice window pattern with hanji paper, low wooden platform seating, Korean soban low table, hanji pendant lamp, warm 2700K light.
Do not include or create any of the following: people, persons, human bodies, faces, hands, text, letters, logos, watermarks, signatures, brand names, paintings, posters, artwork, picture frames with images, any nudity or suggestive content, moved windows, removed walls, changed room shape, extra doors, distorted perspective, Japanese style elements, tatami mats, shoji screens.
```

