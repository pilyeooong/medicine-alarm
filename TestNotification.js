import * as Notifications from 'expo-notifications';

// 초 단위 알림 테스트
export async function testNotificationInSeconds(seconds) {
  console.log(`\n🧪 테스트: ${seconds}초 후 알림 예약`);

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: '테스트 알림',
      body: `${seconds}초 후에 예약된 알림입니다`,
    },
    trigger: {
      seconds: seconds,
    },
  });

  console.log(`✅ 예약 ID: ${id}`);

  // 확인
  const all = await Notifications.getAllScheduledNotificationsAsync();
  const found = all.find(n => n.identifier === id);

  if (found) {
    console.log(`✓ 시스템에서 확인됨`);
    console.log(`  trigger:`, JSON.stringify(found.trigger, null, 2));
  } else {
    console.log(`❌ 시스템에서 찾을 수 없음`);
  }

  return id;
}

// Date 방식 알림 테스트
export async function testNotificationWithDate(minutesFromNow) {
  console.log(`\n🧪 테스트: ${minutesFromNow}분 후 알림 예약 (Date 방식)`);

  const targetDate = new Date();
  targetDate.setMinutes(targetDate.getMinutes() + minutesFromNow);

  console.log(`목표 시간: ${targetDate.toLocaleString('ko-KR')}`);

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: '테스트 알림 (Date)',
      body: `${minutesFromNow}분 후에 예약된 알림입니다`,
    },
    trigger: targetDate,
  });

  console.log(`✅ 예약 ID: ${id}`);

  const all = await Notifications.getAllScheduledNotificationsAsync();
  const found = all.find(n => n.identifier === id);

  if (found) {
    console.log(`✓ 시스템에서 확인됨`);
    console.log(`  trigger:`, JSON.stringify(found.trigger, null, 2));
  } else {
    console.log(`❌ 시스템에서 찾을 수 없음`);
  }

  return id;
}

// CalendarTrigger 방식 테스트
export async function testNotificationCalendar(minutesFromNow) {
  console.log(`\n🧪 테스트: ${minutesFromNow}분 후 알림 예약 (Calendar 방식)`);

  const targetDate = new Date();
  targetDate.setMinutes(targetDate.getMinutes() + minutesFromNow);

  const hour = targetDate.getHours();
  const minute = targetDate.getMinutes();

  console.log(`목표 시간: ${hour}:${minute}`);

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: '테스트 알림 (Calendar)',
      body: `${minutesFromNow}분 후에 예약된 알림입니다`,
    },
    trigger: {
      hour: hour,
      minute: minute,
      repeats: false,
    },
  });

  console.log(`✅ 예약 ID: ${id}`);

  const all = await Notifications.getAllScheduledNotificationsAsync();
  const found = all.find(n => n.identifier === id);

  if (found) {
    console.log(`✓ 시스템에서 확인됨`);
    console.log(`  trigger:`, JSON.stringify(found.trigger, null, 2));
  } else {
    console.log(`❌ 시스템에서 찾을 수 없음`);
  }

  return id;
}
