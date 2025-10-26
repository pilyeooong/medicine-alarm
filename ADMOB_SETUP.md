# AdMob 배너 광고 설정 가이드

## ✅ 완료된 작업

1. **react-native-google-mobile-ads 패키지 추가**
   - package.json에 추가됨
   - app.json에 플러그인 설정 완료

2. **배너 광고 코드 구현**
   - 모든 화면(Home, Detail, Edit)에 하단 배너 추가
   - 테스트 광고 ID 설정 (개발 중)
   - 실제 광고 ID 교체 준비 완료

3. **UI 조정**
   - 광고와 겹치지 않도록 레이아웃 조정
   - FAB 버튼 위치 조정
   - 리스트/폼 스크롤 영역 조정

## 🚀 실제 배포 전 설정

### 1. AdMob 계정 생성 및 앱 등록

**Step 1: AdMob 계정 만들기**
1. https://admob.google.com 접속
2. Google 계정으로 로그인
3. "시작하기" 클릭

**Step 2: 앱 추가**
1. AdMob 대시보드 → "앱" → "앱 추가"
2. "앱이 앱 스토어에 게시되어 있나요?" → "아니요" 선택 (처음 등록 시)
3. 앱 이름: "약먹을시간" 입력
4. 플랫폼: iOS 선택
5. "앱 추가" 클릭

**Step 3: App ID 확인**
- 앱이 추가되면 **App ID**가 생성됨
- 형식: `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX`
- 이 ID를 app.json에 이미 입력해뒀음 (테스트 ID)

### 2. 배너 광고 단위 생성

**Step 1: 광고 단위 만들기**
1. AdMob 대시보드 → 앱 선택 → "광고 단위" 탭
2. "광고 단위 추가" 클릭
3. "배너" 선택
4. 광고 단위 이름: "약먹을시간_배너" 입력
5. "광고 단위 만들기" 클릭

**Step 2: 광고 단위 ID 복사**
- 생성되면 **광고 단위 ID**가 표시됨
- 형식: `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX`
- 이 ID를 복사해두세요

### 3. App.js에서 광고 ID 교체

**현재 코드 (11-16번째 줄):**
```javascript
const BANNER_AD_UNIT_ID = __DEV__
  ? TestIds.ADAPTIVE_BANNER  // 개발 중 테스트 광고
  : Platform.select({
      ios: 'ca-app-pub-XXXXX/XXXXX',  // ← 여기에 iOS 배너 광고 단위 ID 입력
      android: 'ca-app-pub-XXXXX/XXXXX',  // ← 여기에 Android 배너 광고 단위 ID 입력
    });
```

**교체 방법:**
```javascript
const BANNER_AD_UNIT_ID = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : Platform.select({
      ios: 'ca-app-pub-1234567890123456/1234567890',  // ← AdMob에서 복사한 iOS 광고 단위 ID
      android: 'ca-app-pub-1234567890123456/0987654321',  // ← Android용 (나중에 추가)
    });
```

### 4. app.json에서 App ID 교체

**현재 설정 (19-20번째 줄):**
```json
"infoPlist": {
  "GADApplicationIdentifier": "ca-app-pub-3940256099942544~1458002511"
}
```

**교체 방법:**
```json
"infoPlist": {
  "GADApplicationIdentifier": "ca-app-pub-1234567890123456~1234567890"  // ← AdMob에서 복사한 App ID
}
```

**플러그인 설정 (31-35번째 줄):**
```json
"plugins": [
  [
    "react-native-google-mobile-ads",
    {
      "androidAppId": "ca-app-pub-3940256099942544~3347511713",  // ← Android App ID
      "iosAppId": "ca-app-pub-3940256099942544~1458002511"  // ← iOS App ID로 교체
    }
  ]
]
```

## 📝 교체 체크리스트

### 개발 중 (현재)
- ✅ TestIds.ADAPTIVE_BANNER 사용 (테스트 광고 표시)
- ✅ 앱에서 광고 영역 확인 가능
- ✅ 광고 레이아웃 정상 작동 확인

### 실제 배포 전
- [ ] AdMob 계정 생성
- [ ] AdMob에 앱 등록
- [ ] 배너 광고 단위 생성 (iOS용)
- [ ] App.js의 BANNER_AD_UNIT_ID 교체
- [ ] app.json의 GADApplicationIdentifier 교체
- [ ] app.json의 plugins iosAppId 교체

## 🔧 설치 및 실행

### 1. 패키지 설치
```bash
npm install
```

### 2. 앱 실행
```bash
npm start
```

### 3. 테스트 광고 확인
- iOS 시뮬레이터에서 실행
- 화면 하단에 테스트 광고 배너 표시 확인
- "Test Ad" 또는 "Google Test Ads" 문구 확인

## 📱 화면별 광고 위치

### 1. Home 화면 (약 리스트)
```
┌─────────────────────────┐
│  💊 약먹을시간          │
├─────────────────────────┤
│  약 리스트              │
│  ...                    │
│  ...                    │
│                    [+]  │ ← FAB 버튼 (광고 위에 위치)
├─────────────────────────┤
│  [  AdMob 배너 광고  ]  │ ← 하단 고정
└─────────────────────────┘
```

### 2. Detail 화면 (약 상세)
```
┌─────────────────────────┐
│  ← 약 상세 정보      ✏️ │
├─────────────────────────┤
│  상세 정보              │
│  ...                    │
│  🗑️ 약 삭제            │
├─────────────────────────┤
│  [  AdMob 배너 광고  ]  │ ← 하단 고정
└─────────────────────────┘
```

### 3. Edit 화면 (약 수정/등록)
```
┌─────────────────────────┐
│  ← 새 약 등록           │
├─────────────────────────┤
│  입력 폼                │
│  ...                    │
├─────────────────────────┤
│  [ 등록하기 ]           │ ← 광고 위에 위치
├─────────────────────────┤
│  [  AdMob 배너 광고  ]  │ ← 하단 고정
└─────────────────────────┘
```

## ⚠️ 주의 사항

### 1. 테스트 광고 vs 실제 광고
- **개발 중 (`__DEV__ === true`)**: 자동으로 테스트 광고 표시
- **배포 후 (`__DEV__ === false`)**: 실제 광고 ID 사용

### 2. 광고 정책 준수
- 자신의 광고 클릭 금지
- 광고 클릭 유도 금지
- 허위 노출 방지
- AdMob 정책: https://support.google.com/admob/answer/6128543

### 3. 수익 발생 조건
- 앱이 App Store에 게시되어야 함
- 실제 사용자가 광고를 봐야 함
- 광고 클릭 시 수익 발생 (CPC)
- 광고 노출 시 수익 발생 (CPM)

## 🎯 빠른 시작 (개발 중)

```bash
# 1. 패키지 설치
npm install

# 2. 앱 실행
npm start

# 3. iOS 시뮬레이터에서 확인
터미널에서 'i' 키 입력

# 4. 테스트 광고 확인
하단에 "Test Ad" 배너 표시되는지 확인
```

## 📊 수익 확인

1. AdMob 대시보드 접속
2. "수익" 탭 확인
3. 일별/월별 수익 확인
4. 최소 지급 금액: $100 (한국 기준)

## 🔗 유용한 링크

- AdMob 공식 사이트: https://admob.google.com
- AdMob 시작 가이드: https://developers.google.com/admob/ios/quick-start
- react-native-google-mobile-ads 문서: https://docs.page/invertase/react-native-google-mobile-ads

---

## ✅ 결과

- **개발 중**: 테스트 광고가 모든 화면 하단에 표시됨
- **배포 후**: 위 가이드대로 ID만 교체하면 실제 광고 게시됨
- **Key 교체 위치**:
  1. App.js 11-16번째 줄
  2. app.json 19-20번째 줄
  3. app.json 34번째 줄
