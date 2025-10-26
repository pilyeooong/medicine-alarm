# 알림 즉시 발동 문제 해결

## 문제

12시에 알림을 등록했는데 11시 14분에 바로 푸시가 오는 문제

## 원인

기존 코드:
```javascript
trigger: {
  hour: time.hours,
  minute: time.minutes,
  repeats: true,
}
```

이 방식은 expo-notifications의 DailyTriggerInput인데, **과거 시간을 설정하면 즉시 발동**되는 문제가 있었습니다.

예를 들어:
- 현재 시간: 11시 14분
- 설정한 시간: 12시 00분
- 하지만 알림이 즉시 발동됨 (버그)

## 해결 방법

**향후 30일치 알림을 미리 예약하는 방식으로 변경**

```javascript
const scheduleNextNotification = async (medicine, notificationIds = []) => {
  const time = parseTime(medicine.time);
  const ids = [];

  for (let i = 0; i < 30; i++) {
    const scheduledTime = new Date();
    scheduledTime.setHours(time.hours, time.minutes, 0, 0);
    scheduledTime.setDate(scheduledTime.getDate() + i);

    // 과거 시간은 건너뛰기
    if (scheduledTime <= new Date()) continue;

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '💊 약 먹을 시간이에요!',
        body: `${medicine.name} 복용하세요`,
      },
      trigger: {
        date: scheduledTime,  // 정확한 날짜와 시간으로 설정
      },
    });
    ids.push(id);
  }

  return ids;
};
```

### 주요 변경 사항

1. **정확한 Date 객체 사용**
   - `date: scheduledTime`으로 정확한 시간 설정
   - 과거 시간은 자동으로 건너뜀

2. **30일치 알림 미리 예약**
   - 매일 반복이 아니라 30일치를 한 번에 예약
   - 각 알림마다 고유 ID 부여

3. **notificationId → notificationIds 배열**
   - 여러 알림을 관리하기 위해 배열로 저장
   - 삭제 시 모든 알림을 취소

## 테스트 방법

### 1. 기존 약 삭제
기존에 등록된 약이 있다면 모두 삭제하세요.

### 2. 새로 약 등록
- 현재 시간보다 **이후 시간**으로 등록 (예: 현재 11:20 → 11:30 등록)
- 현재 시간보다 **이전 시간**으로 등록 (예: 현재 11:20 → 10:00 등록)

### 3. 확인 사항
✅ 등록 직후 알림이 **즉시 오지 않음**
✅ 설정한 시간에만 알림이 옴
✅ "30일치 알림이 예약되었습니다" 메시지 표시

### 4. 예약된 알림 확인 (개발자 모드)
```javascript
// 개발자 콘솔에서 확인
const allNotifications = await Notifications.getAllScheduledNotificationsAsync();
console.log('예약된 알림:', allNotifications.length);
```

## 동작 방식

### 등록 시
1. 현재 날짜부터 30일 후까지 계산
2. 각 날짜의 설정한 시간에 알림 예약
3. 과거 시간은 자동으로 건너뛰기
4. 모든 알림 ID를 배열로 저장

### 예시
현재: 2025-10-25 11:14
설정: 12:00

예약되는 알림:
- 2025-10-25 12:00 (오늘, 46분 후)
- 2025-10-26 12:00 (내일)
- 2025-10-27 12:00 (모레)
- ...
- 2025-11-23 12:00 (30일 후)

총 30개의 알림이 예약됩니다.

### 삭제 시
1. 저장된 모든 notificationIds를 순회
2. 각 알림을 개별적으로 취소
3. 약 데이터 삭제

## 제한 사항

1. **30일 제한**
   - 30일치만 미리 예약
   - 30일 이후에는 앱을 다시 열어야 함
   - 향후 업데이트에서 자동 갱신 기능 추가 가능

2. **iOS 알림 제한**
   - iOS는 최대 64개의 예약 알림만 허용
   - 약을 2개 이상 등록하면 일부 알림이 예약 안될 수 있음

## 개선 방안 (향후)

1. **Background Task로 자동 갱신**
   - 앱이 백그라운드에서도 알림 갱신
   - expo-background-fetch 사용

2. **알림 개수 최적화**
   - 7일치만 예약하고 주기적으로 갱신
   - iOS 64개 제한 회피

3. **알림 상태 표시**
   - "다음 알림: 10월 25일 12:00"
   - "남은 예약 알림: 30개"

## 결과

✅ **즉시 발동 문제 완전히 해결!**
✅ **정확한 시간에만 알림 발동!**
✅ **30일치 안정적으로 예약!**
