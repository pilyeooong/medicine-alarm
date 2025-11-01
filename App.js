import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Alert, ScrollView, Platform, Image } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AdBanner } from './components/AdBanner';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { t } from './translations';
import { SettingsScreen } from './components/SettingsScreen';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const STORAGE_KEY = '@medicines';

export default function App() {
  return (
    <LanguageProvider>
      <MedicineApp />
    </LanguageProvider>
  );
}

function MedicineApp() {
  const { language } = useLanguage();
  const [currentScreen, setCurrentScreen] = useState('home');
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    // 언어 변경 시 모든 알림 재예약
    if (isInitialized && medicines.length > 0) {
      rescheduleAllNotifications();
    }
  }, [language]);


  const initializeApp = async () => {
    await requestPermissions();
    await loadMedicines();
    setIsInitialized(true);
  };

  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('confirm', language), t('permissionRequired', language));
    }
  };

  const loadMedicines = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        setMedicines(JSON.parse(jsonValue));
      }
    } catch (error) {
      console.error('Error loading medicines:', error);
    }
  };

  const saveMedicines = async (newMedicines) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newMedicines));
      setMedicines(newMedicines);
    } catch (error) {
      console.error('Error saving medicines:', error);
    }
  };

  const scheduleNextNotification = async (medicine) => {
    const time = parseTime(medicine.time);
    if (!time) return null;

    try {
      console.log(`💊 ${medicine.name} 매일 ${medicine.time}에 알림 예약`);

      // ✅ DAILY 타입으로 매일 반복 (공식 문서 권장)
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: t('notificationTitle', language),
          body: `${t('notificationBody', language)}${medicine.name}`,
          data: {
            medicineId: medicine.id,
          },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: time.hours,
          minute: time.minutes,
        },
      });

      console.log(`✅ 매일 반복 알림 예약 완료 (ID: ${id.substring(0, 8)}...)\n`);
      return id;
    } catch (error) {
      console.error('❌ 스케줄링 오류:', error);
      return null;
    }
  };

  const addMedicine = async (medicine) => {
    // 최대 개수 체크
    if (medicines.length >= 20) {
      Alert.alert(t('maxLimitTitle', language), t('maxLimitMessage', language));
      return;
    }

    const time = parseTime(medicine.time);
    if (!time) {
      Alert.alert(t('confirm', language), t('invalidTimeFormat', language));
      return;
    }

    try {
      const notificationId = await scheduleNextNotification(medicine);

      if (!notificationId) {
        Alert.alert(t('confirm', language), t('scheduleError', language));
        return;
      }

      const newMedicine = {
        id: Date.now().toString(),
        ...medicine,
        notificationId: notificationId,  // 단일 ID로 변경
        createdAt: new Date().toISOString(),
      };

      const updatedMedicines = [...medicines, newMedicine];
      await saveMedicines(updatedMedicines);
      setCurrentScreen('home');
      Alert.alert(t('confirm', language), `${medicine.name}${t('addSuccess', language)}${medicine.time}${t('addSuccessTime', language)}`);
    } catch (error) {
      console.error('Error adding medicine:', error);
      Alert.alert(t('confirm', language), t('addError', language));
    }
  };

  const deleteMedicine = async (id) => {
    const medicine = medicines.find(m => m.id === id);
    if (medicine?.notificationId) {
      try {
        await Notifications.cancelScheduledNotificationAsync(medicine.notificationId);
        console.log(`🗑️ ${medicine.name} 알림 취소됨`);
      } catch (error) {
        console.error('Error canceling notification:', error);
      }
    }
    const updatedMedicines = medicines.filter(m => m.id !== id);
    await saveMedicines(updatedMedicines);
  };

  const updateMedicine = async (id, updatedData) => {
    const medicine = medicines.find(m => m.id === id);
    if (!medicine) return;

    const time = parseTime(updatedData.time);
    if (!time) {
      Alert.alert(t('confirm', language), t('invalidTimeFormat', language));
      return;
    }

    try {
      // 기존 알림 취소
      if (medicine.notificationId) {
        try {
          await Notifications.cancelScheduledNotificationAsync(medicine.notificationId);
        } catch (error) {
          console.error('Error canceling notification:', error);
        }
      }

      // 새로운 알림 예약
      const notificationId = await scheduleNextNotification(updatedData);

      if (!notificationId) {
        Alert.alert(t('confirm', language), t('scheduleError', language));
        return;
      }

      // 약 정보 업데이트
      const updatedMedicine = {
        ...medicine,
        ...updatedData,
        notificationId: notificationId,
      };

      const updatedMedicines = medicines.map(m => m.id === id ? updatedMedicine : m);
      await saveMedicines(updatedMedicines);
      setCurrentScreen('home');
      setSelectedMedicine(null);
      Alert.alert(t('confirm', language), `${updatedData.name}${t('updateSuccess', language)}`);
    } catch (error) {
      console.error('Error updating medicine:', error);
      Alert.alert(t('confirm', language), t('updateError', language));
    }
  };

  const parseTime = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(num => parseInt(num, 10));
    if (isNaN(hours) || isNaN(minutes)) {
      return null;
    }
    return { hours, minutes };
  };

  const rescheduleAllNotifications = async () => {
    console.log('🔄 언어 변경 감지: 모든 알림 재예약 시작');

    try {
      const updatedMedicines = await Promise.all(
        medicines.map(async (medicine) => {
          // 기존 알림 취소
          if (medicine.notificationId) {
            try {
              await Notifications.cancelScheduledNotificationAsync(medicine.notificationId);
              console.log(`🗑️ ${medicine.name} 기존 알림 취소`);
            } catch (error) {
              console.error('Error canceling notification:', error);
            }
          }

          // 새 언어로 알림 재예약
          const newNotificationId = await scheduleNextNotification(medicine);

          return {
            ...medicine,
            notificationId: newNotificationId,
          };
        })
      );

      await saveMedicines(updatedMedicines);
      console.log('✅ 모든 알림 재예약 완료');
    } catch (error) {
      console.error('❌ 알림 재예약 실패:', error);
    }
  };

  if (currentScreen === 'settings') {
    return <SettingsScreen onBack={() => setCurrentScreen('home')} />;
  }

  if (currentScreen === 'add') {
    return <AddScreen onAdd={addMedicine} onBack={() => setCurrentScreen('home')} language={language} />;
  }

  if (currentScreen === 'edit' && selectedMedicine) {
    return (
      <AddScreen
        medicine={selectedMedicine}
        onAdd={(data) => updateMedicine(selectedMedicine.id, data)}
        onBack={() => {
          setCurrentScreen('home');
          setSelectedMedicine(null);
        }}
        isEdit={true}
        language={language}
      />
    );
  }

  if (currentScreen === 'detail' && selectedMedicine) {
    return (
      <DetailScreen
        medicine={selectedMedicine}
        onEdit={() => setCurrentScreen('edit')}
        onDelete={async () => {
          await deleteMedicine(selectedMedicine.id);
          setCurrentScreen('home');
          setSelectedMedicine(null);
        }}
        onBack={() => {
          setCurrentScreen('home');
          setSelectedMedicine(null);
        }}
        language={language}
      />
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>{t('appTitle', language)}</Text>
            <Text style={styles.headerSubtitle}>
              {medicines.length > 0
                ? `${medicines.length}/20`
                : t('medicineCount', language)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setCurrentScreen('settings')}
            style={styles.settingsButton}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {medicines.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Image
              source={require('./assets/app-icon.png')}
              style={styles.appLogo}
              resizeMode="contain"
            />
            <Text style={styles.emptyTitle}>{t('emptyTitle', language)}</Text>
            <Text style={styles.emptyText}>{t('emptyText', language)}</Text>
            <View style={styles.noticeBox}>
              <Text style={styles.noticeTitle}>{t('noticeTitle', language)}</Text>
              <Text style={styles.noticeText}>
                {t('noticeText', language)}
              </Text>
            </View>
          </View>
        ) : (
          <FlatList
            data={medicines}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.medicineCard}
                activeOpacity={0.7}
                onPress={() => {
                  setSelectedMedicine(item);
                  setCurrentScreen('detail');
                }}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.medicineName}>{item.name}</Text>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      Alert.alert(
                        t('deleteConfirmTitle', language),
                        `"${item.name}"${t('deleteConfirmMessage', language)}`,
                        [
                          { text: t('cancel', language), style: 'cancel' },
                          {
                            text: t('delete', language),
                            style: 'destructive',
                            onPress: () => deleteMedicine(item.id),
                          },
                        ]
                      );
                    }}
                  >
                    <Text style={styles.deleteIcon}>🗑️</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.timeContainer}>
                  <Text style={styles.timeIcon}>⏰</Text>
                  <Text style={styles.timeText}>{item.time}</Text>
                </View>
                {item.dosage ? <Text style={styles.dosageText}>{t('dosage', language)}: {item.dosage}</Text> : null}
                {item.memo ? <Text style={styles.memoText}>{t('memo', language)}: {item.memo}</Text> : null}
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}

        <TouchableOpacity
          style={[styles.fab, medicines.length >= 20 && styles.fabDisabled]}
          onPress={() => {
            if (medicines.length >= 20) {
              Alert.alert(t('maxLimitTitle', language), t('maxLimitMessage', language));
            } else {
              setCurrentScreen('add');
            }
          }}
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>

        <AdBanner />

        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function AddScreen({ onAdd, onBack, medicine, isEdit, language }) {
  const [name, setName] = useState(medicine?.name || '');
  const [dosage, setDosage] = useState(medicine?.dosage || '');
  const [memo, setMemo] = useState(medicine?.memo || '');

  // 시간을 Date 객체로 관리
  const [selectedTime, setSelectedTime] = useState(() => {
    const date = new Date();
    if (medicine?.time) {
      const [hours, minutes] = medicine.time.split(':').map(Number);
      date.setHours(hours, minutes, 0, 0);
    } else {
      date.setHours(9, 0, 0, 0); // 기본값 9시
    }
    return date;
  });

  const handleTimeChange = (event, selected) => {
    if (selected) {
      setSelectedTime(selected);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert(t('confirm', language), t('enterMedicineName', language));
      return;
    }

    const hours = selectedTime.getHours();
    const minutes = selectedTime.getMinutes();
    const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    onAdd({
      name: name.trim(),
      time: time,
      dosage: dosage.trim(),
      memo: memo.trim(),
    });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{isEdit ? t('editMedicine', language) : t('addMedicine', language)}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.formContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('medicineName', language)} {t('required', language)}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('medicineNamePlaceholder', language)}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('medicineTime', language)} {t('required', language)}</Text>
            <View style={styles.timePickerContainer}>
              <DateTimePicker
                value={selectedTime}
                mode="time"
                display="spinner"
                onChange={handleTimeChange}
                locale="ko-KR"
                style={styles.timePicker}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('medicineDosage', language)}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('medicineDosagePlaceholder', language)}
              value={dosage}
              onChangeText={setDosage}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('medicineMemo', language)}</Text>
            <TextInput
              style={[styles.input, styles.memoInput]}
              placeholder={t('medicineMemoPlaceholder', language)}
              value={memo}
              onChangeText={setMemo}
              multiline
              numberOfLines={3}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>{isEdit ? t('updateButton', language) : t('saveButton', language)}</Text>
          </TouchableOpacity>
        </View>

        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function DetailScreen({ medicine, onEdit, onDelete, onBack, language }) {
  const getTimeIcon = (time) => {
    if (!time || !time.includes(':')) return '⏰';
    const hour = parseInt(time.split(':')[0]);
    if (isNaN(hour)) return '⏰';
    if (hour >= 6 && hour < 11) return '🌅';
    if (hour >= 11 && hour < 14) return '🌞';
    if (hour >= 14 && hour < 18) return '☀️';
    if (hour >= 18 && hour < 22) return '🌙';
    return '✨';
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('detailTitle', language)}</Text>
          <TouchableOpacity onPress={onEdit} style={styles.backButton}>
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.detailContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.detailCard}>
            <View style={styles.detailIconContainer}>
              <Text style={styles.detailPillIcon}>💊</Text>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>{t('medicineName', language)}</Text>
              <Text style={styles.detailValue}>{medicine.name}</Text>
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>{t('medicineTime', language)}</Text>
              <View style={styles.detailTimeRow}>
                <Text style={styles.detailTimeIcon}>{getTimeIcon(medicine.time)}</Text>
                <Text style={styles.detailTimeValue}>{medicine.time}</Text>
              </View>
            </View>

            {medicine.dosage ? (
              <>
                <View style={styles.detailDivider} />
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>{t('dosage', language)}</Text>
                  <Text style={styles.detailValue}>{medicine.dosage}</Text>
                </View>
              </>
            ) : null}

            {medicine.memo ? (
              <>
                <View style={styles.detailDivider} />
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>{t('memo', language)}</Text>
                  <Text style={styles.detailMemoValue}>{medicine.memo}</Text>
                </View>
              </>
            ) : null}

            <View style={styles.detailDivider} />

            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>{t('notificationStatus', language)}</Text>
              <View style={styles.notificationStatusRow}>
                <Text style={styles.notificationStatusIcon}>🔔</Text>
                <Text style={styles.notificationStatusText}>
                  {medicine.notificationId
                    ? t('notificationEnabled', language)
                    : t('notificationDisabled', language)}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.deleteDetailButton}
            onPress={() => {
              Alert.alert(
                t('deleteConfirmTitle', language),
                `"${medicine.name}"${t('deleteConfirmMessage', language)}`,
                [
                  { text: t('cancel', language), style: 'cancel' },
                  {
                    text: t('delete', language),
                    style: 'destructive',
                    onPress: onDelete,
                  },
                ]
              );
            }}
          >
            <Text style={styles.deleteDetailButtonText}>{t('deleteButton', language)}</Text>
          </TouchableOpacity>
        </ScrollView>

        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFB',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3748',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#718096',
    marginTop: 4,
  },
  settingsButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: '#F0F4F8',
  },
  settingsIcon: {
    fontSize: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 28,
    color: '#2D3748',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  appLogo: {
    width: 160,
    height: 160,
    marginBottom: 24,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 30,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 24,
  },
  noticeBox: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
    maxWidth: 320,
  },
  noticeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E65100',
    marginBottom: 8,
  },
  noticeText: {
    fontSize: 13,
    color: '#E65100',
    lineHeight: 20,
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  medicineCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  medicineName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    flex: 1,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    fontSize: 18,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  timeIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  timeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5B9BD5',
  },
  dosageText: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 4,
  },
  memoText: {
    fontSize: 14,
    color: '#718096',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#5B9BD5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabDisabled: {
    backgroundColor: '#CBD5E0',
    opacity: 0.6,
  },
  fabIcon: {
    fontSize: 32,
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 16,
    color: '#2D3748',
  },
  memoInput: {
    minHeight: 80,
  },
  timePickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  timePicker: {
    width: '100%',
    height: 200,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  saveButton: {
    backgroundColor: '#5B9BD5',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  editIcon: {
    fontSize: 20,
  },
  detailContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  detailIconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  detailPillIcon: {
    fontSize: 64,
  },
  detailSection: {
    marginVertical: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#718096',
    marginBottom: 8,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
  },
  detailMemoValue: {
    fontSize: 16,
    color: '#2D3748',
    lineHeight: 24,
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  detailTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
  },
  detailTimeIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  detailTimeValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#5B9BD5',
  },
  notificationStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
  },
  notificationStatusIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  notificationStatusText: {
    fontSize: 14,
    color: '#2D3748',
    flex: 1,
  },
  deleteDetailButton: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#F56565',
  },
  deleteDetailButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F56565',
  },
  adContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
});
