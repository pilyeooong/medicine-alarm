export const translations = {
  ko: {
    // Home Screen
    appTitle: '💊 약먹을시간',
    medicineCount: '복약 알림을 시작해보세요',
    emptyTitle: '등록된 약이 없어요',
    emptyText: '+ 버튼을 눌러 복용할 약을 등록해보세요',
    noticeTitle: '📌 알림 안내',
    noticeText: '약을 등록하면 매일 같은 시간에\n자동으로 알림이 반복됩니다.',

    // Medicine Card
    dosage: '용량',
    memo: '메모',

    // Add/Edit Screen
    addMedicine: '새 약 등록',
    editMedicine: '약 수정',
    medicineName: '약 이름',
    medicineNamePlaceholder: '약 이름을 입력하세요',
    medicineTime: '복용 시간',
    medicineTimePlaceholder: '예: 09:00',
    medicineDosage: '용량 (선택)',
    medicineDosagePlaceholder: '예: 1정, 5ml',
    medicineMemo: '메모 (선택)',
    medicineMemoPlaceholder: '식후 30분, 물과 함께 등',
    saveButton: '등록하기',
    updateButton: '수정하기',
    required: '*',

    // Detail Screen
    detailTitle: '약 상세 정보',
    notificationStatus: '알림 상태',
    notificationEnabled: '매일 알림이 설정되어 있어요',
    notificationDisabled: '알림이 설정되지 않았어요',
    deleteButton: '🗑️ 약 삭제',

    // Settings Screen
    settings: '설정',
    language: '언어',
    languageDescription: '앱 언어를 선택하세요',
    korean: '한국어',
    english: 'English',

    // Alerts
    deleteConfirmTitle: '약 삭제',
    deleteConfirmMessage: '을(를) 삭제하시겠습니까?',
    cancel: '취소',
    delete: '삭제',
    confirm: '확인',

    // Notifications
    notificationTitle: '💊 약 먹을 시간이에요!',
    notificationBody: '복용하세요',

    // Errors & Alerts
    permissionRequired: '알림 권한이 필요합니다.',
    enterMedicineName: '약 이름을 입력해주세요.',
    invalidTimeFormat: '시간 형식이 올바르지 않습니다. (예: 09:00)',
    scheduleError: '알림 예약에 실패했습니다.',
    addError: '약 등록에 실패했습니다.',
    updateError: '약 수정에 실패했습니다.',
    addSuccess: '이(가) 등록되었어요!\n매일 ',
    addSuccessTime: '에 알림이 울립니다.',
    updateSuccess: '이(가) 수정되었어요!',
    maxLimitTitle: '등록 제한',
    maxLimitMessage: '최대 20개까지만 등록할 수 있습니다.\n기존 약을 삭제한 후 다시 시도해주세요.',
  },
  en: {
    // Home Screen
    appTitle: '💊 Medicine Time',
    medicineCount: 'Start your medication reminder',
    emptyTitle: 'No medicines registered',
    emptyText: 'Tap the + button to add your medicine',
    noticeTitle: '📌 Notification Info',
    noticeText: 'Once registered, you will receive\nautomatic daily reminders.',

    // Medicine Card
    dosage: 'Dosage',
    memo: 'Memo',

    // Add/Edit Screen
    addMedicine: 'Add Medicine',
    editMedicine: 'Edit Medicine',
    medicineName: 'Medicine Name',
    medicineNamePlaceholder: 'Enter medicine name',
    medicineTime: 'Reminder Time',
    medicineTimePlaceholder: 'e.g., 09:00',
    medicineDosage: 'Dosage (Optional)',
    medicineDosagePlaceholder: 'e.g., 1 pill, 5ml',
    medicineMemo: 'Memo (Optional)',
    medicineMemoPlaceholder: '30 min after meal, with water, etc.',
    saveButton: 'Save',
    updateButton: 'Update',
    required: '*',

    // Detail Screen
    detailTitle: 'Medicine Details',
    notificationStatus: 'Notification Status',
    notificationEnabled: 'Daily reminder is set',
    notificationDisabled: 'No reminder is set',
    deleteButton: '🗑️ Delete Medicine',

    // Settings Screen
    settings: 'Settings',
    language: 'Language',
    languageDescription: 'Select app language',
    korean: '한국어',
    english: 'English',

    // Alerts
    deleteConfirmTitle: 'Delete Medicine',
    deleteConfirmMessage: 'Do you want to delete ',
    cancel: 'Cancel',
    delete: 'Delete',
    confirm: 'OK',

    // Notifications
    notificationTitle: '💊 Time to take your medicine!',
    notificationBody: 'Please take ',

    // Errors & Alerts
    permissionRequired: 'Notification permission is required.',
    enterMedicineName: 'Please enter medicine name.',
    invalidTimeFormat: 'Invalid time format. (e.g., 09:00)',
    scheduleError: 'Failed to schedule notification.',
    addError: 'Failed to add medicine.',
    updateError: 'Failed to update medicine.',
    addSuccess: ' has been registered!\nDaily reminder at ',
    addSuccessTime: '.',
    updateSuccess: ' has been updated!',
    maxLimitTitle: 'Registration Limit',
    maxLimitMessage: 'You can register up to 20 medicines.\nPlease delete existing ones before adding new.',
  }
};

export const t = (key, language) => {
  return translations[language]?.[key] || translations['ko'][key] || key;
};
