# 앱 아이콘 만들기 가이드

## 빠른 방법: 온라인 도구 사용

### 1. 아이콘 디자인
https://www.canva.com/create/app-icons/ 또는 Figma에서 다음 디자인 생성:

**디자인 요소:**
- 배경색: `#5B9BD5` (파스텔 블루)
- 중앙에 흰색 알약 모양
- 우측 상단에 작은 시계/알람 아이콘
- 크기: 1024x1024px

### 2. 또는 이모지 아이콘 생성기 사용
https://icon.kitchen/

1. "Text" 선택
2. 이모지 입력: 💊⏰
3. 배경색: `#5B9BD5`
4. 다운로드 (1024x1024)

### 3. Expo 아이콘 생성기 사용
```bash
npx eas-cli init
npx eas-cli build:configure
```

## 아이콘 파일 생성 후:

1. 다운로드한 이미지를 `assets/icon.png`로 저장
2. `app.json` 파일은 이미 설정되어 있음
3. 앱 재시작:
```bash
npm start -- --clear
```

## 현재 상태:
- ✅ 앱 내 로고 컴포넌트: `assets/AppLogo.js`
- ✅ empty state에 로고 표시됨
- ⏳ 앱 아이콘 이미지: 수동 생성 필요

## 임시 아이콘:
현재는 Expo 기본 아이콘이 사용됩니다.
앱 스토어 배포 전에 반드시 교체하세요.
