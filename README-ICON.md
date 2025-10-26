# 앱 아이콘 설정 가이드

## 1. 아이콘 이미지 생성

### 방법 1: HTML 생성기 사용 (추천)
```bash
open generate-icon.html
```

1. 브라우저에서 파일 열기
2. "1024x1024 다운로드" 버튼 클릭
3. 다운로드된 파일 이름 확인: `medicine-alarm-icon-1024.png`

### 방법 2: 직접 디자인
- Canva, Figma 등에서 1024x1024px 이미지 생성
- 디자인 요소:
  - 배경색: `#5B9BD5` (파스텔 블루)
  - 중앙에 흰색 알약 모양
  - 우측 상단에 작은 시계/알람 아이콘

## 2. 파일 저장

다운로드한 파일을 다음 위치에 저장:
```bash
mv ~/Downloads/medicine-alarm-icon-1024.png assets/app-icon.png
```

## 3. 앱 재빌드

아이콘이 변경되면 앱을 다시 빌드해야 합니다:
```bash
npx expo run:ios
```

## 현재 설정

- **앱 아이콘**: `assets/app-icon.png`
- **스플래시 화면**: `assets/app-icon.png` (같은 파일 사용)
- **앱 내 로고**: `assets/app-icon.png` (empty state에서 표시)

## 주의사항

- 파일명은 반드시 `app-icon.png`여야 합니다
- 크기는 1024x1024px (정사각형)
- PNG 형식
- 투명 배경 가능하지만 권장하지 않음
