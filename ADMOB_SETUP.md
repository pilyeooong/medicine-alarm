# AdMob 배너 광고 설정 가이드

**최종 업데이트:** 2025-10-28
**프로젝트:** 약먹을시간 (medicine-alarm)
**버전:** 1.0.4

## ✅ 완료된 작업

1. **react-native-google-mobile-ads 패키지 추가**
   - package.json에 추가됨 (v15.8.1)
   - app.json에 플러그인 설정 완료

2. **배너 광고 코드 구현**
   - `components/AdBanner.js` 컴포넌트 생성
   - App.js 하단에 AdBanner 추가
   - 개발/프로덕션 환경 분리
   - 실제 광고 ID 적용 완료

3. **UI 조정**
   - 광고와 겹치지 않도록 레이아웃 조정
   - FAB 버튼 위치 조정 (광고 위로)
   - 리스트/폼 스크롤 영역 조정

4. **프로덕션 배포 완료**
   - 실제 광고 단위 ID 적용
   - TestFlight 테스트 완료
   - App Store 배포 준비 완료

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

## 🔧 문제 해결 (Troubleshooting)

### 문제 1: TestFlight에서 광고가 표시되지 않음

**증상**:
- 개발 환경에서는 테스트 광고가 정상 표시
- TestFlight 배포 후 실제 광고가 표시되지 않음
- 광고 영역이 비어있거나 "광고 로딩 중..." 텍스트만 표시

**원인**:
`AdBanner.js` 컴포넌트에서 초기화 상태를 확인할 때 로딩 텍스트를 표시하면, `BannerAd` 컴포넌트가 렌더링되지 않아 광고가 로드되지 않음.

**잘못된 코드**:
```javascript
// ❌ 이렇게 하면 광고가 안 나옴
if (!isInitialized) {
  return (
    <View>
      <Text>광고 로딩 중...</Text>
    </View>
  );
}

if (!BannerAd) {
  return null;
}

return (
  <View>
    <BannerAd unitId={adUnitId} ... />
  </View>
);
```

**올바른 코드**:
```javascript
// ✅ 이렇게 해야 광고가 나옴
if (!isInitialized || !BannerAd) {
  return null;  // 아무것도 표시하지 않음
}

return (
  <View style={{
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingVertical: 10,
    minHeight: 70,
    justifyContent: 'center'
  }}>
    <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      onAdLoaded={() => {
        console.log('✅ 광고 로드 성공');
        setIsAdLoaded(true);
      }}
      onAdFailedToLoad={(error) => {
        console.log('⚠️ 광고 로드 실패:', error.message);
      }}
    />
  </View>
);
```

**핵심 포인트**:
- 초기화 전에는 **아무것도 렌더링하지 않아야** `BannerAd`가 정상 로드됨
- 로딩 텍스트나 다른 UI를 표시하면 광고 컴포넌트가 마운트되지 않음
- `isInitialized`와 `BannerAd` 체크를 하나의 조건으로 합쳐서 `null` 반환

### 문제 2: 시뮬레이터에서 테스트 광고 네트워크 에러

**증상**:
- iOS 시뮬레이터에서 "cannot parse response" 에러
- 광고 영역은 있지만 광고가 로드되지 않음

**원인**:
iOS 시뮬레이터의 네트워크 제한으로 인한 정상적인 현상. 실제 기기에서는 문제없이 작동함.

**해결 방법**:
- **개발 중**: 시뮬레이터 에러는 무시하고 실제 기기나 TestFlight에서 테스트
- **테스트 광고 ID 사용 확인**: `__DEV__` 플래그가 올바르게 설정되어 있는지 확인
```javascript
const adUnitId = __DEV__
  ? 'ca-app-pub-3940256099942544/2934735716'  // Google 공식 테스트 ID
  : Platform.select({
      ios: 'ca-app-pub-2370970221825852/4848317827',
    });
```

### 문제 3: 개발 환경과 프로덕션 환경 구분

**확인 방법**:
```javascript
// App.js 또는 AdBanner.js에서
console.log('🔧 개발 모드:', __DEV__);
console.log('📱 플랫폼:', Platform.OS);
console.log('🎯 광고 ID:', adUnitId);
```

**올바른 설정**:
- **개발 중 (`__DEV__ === true`)**: 테스트 광고 ID 사용
- **프로덕션 (`__DEV__ === false`)**: 실제 광고 단위 ID 사용
- **app.json**: 실제 App ID 설정 필요

### 문제 4: AdMob 초기화 실패

**증상**:
- 콘솔에 "❌ AdMob 초기화 실패" 메시지
- 광고가 전혀 표시되지 않음

**확인 사항**:
1. **app.json 설정 확인**:
```json
{
  "expo": {
    "ios": {
      "config": {
        "googleMobileAdsAppId": "ca-app-pub-XXXXX~XXXXX"
      },
      "infoPlist": {
        "GADApplicationIdentifier": "ca-app-pub-XXXXX~XXXXX"
      }
    },
    "plugins": [
      [
        "react-native-google-mobile-ads",
        {
          "iosAppId": "ca-app-pub-XXXXX~XXXXX"
        }
      ]
    ]
  }
}
```

2. **Info.plist 동기화 확인**:
```bash
npx expo prebuild --clean
```

3. **패키지 재설치**:
```bash
rm -rf node_modules
npm install
```

### 디버깅 체크리스트

프로덕션 배포 전 반드시 확인:

- [ ] `__DEV__` 플래그가 올바르게 작동하는지 확인
- [ ] 테스트 광고가 개발 환경에서 표시되는지 확인
- [ ] App ID와 광고 단위 ID가 올바르게 설정되었는지 확인
- [ ] `AdBanner.js`에서 초기화 체크 로직이 올바른지 확인 (로딩 텍스트 제거)
- [ ] Info.plist가 app.json과 동기화되었는지 확인
- [ ] TestFlight 빌드에서 실제 광고가 표시되는지 확인
- [ ] 콘솔 로그에서 "✅ 광고 로드 성공" 메시지 확인

### 참고: kr-running-schedule-app 패턴

검증된 작동 패턴은 다음 프로젝트에서 확인 가능:
- `kr-running-schedule-app/components/AdBanner.tsx`
- 핵심: 초기화 실패 시 `null` 반환, 로딩 UI 없음

---

## ✅ 결과

- **개발 중**: 테스트 광고가 모든 화면 하단에 표시됨
- **배포 후**: 위 가이드대로 ID만 교체하면 실제 광고 게시됨
- **Key 교체 위치**:
  1. App.js 11-16번째 줄
  2. app.json 19-20번째 줄
  3. app.json 34번째 줄
