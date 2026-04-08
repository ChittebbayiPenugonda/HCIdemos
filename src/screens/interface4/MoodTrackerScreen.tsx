import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import MoodHeatmapView from './MoodHeatmapView';

type TopView = 'journal' | 'heatmap';

type ActiveView = 'Daily' | 'Weekly' | 'Monthly';
type MoodType = 'Happy' | 'Sad' | 'Stressed' | 'Angry' | 'Other';
type TimeKey = 'morning' | 'afternoon' | 'evening';

const MOOD_CONFIG: { label: MoodType; color: string; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
  { label: 'Happy',   color: '#22C55E', icon: 'happy-outline' },
  { label: 'Sad',     color: '#3B82F6', icon: 'sad-outline' },
  { label: 'Stressed',color: '#EF4444', icon: 'thunderstorm-outline' },
  { label: 'Angry',   color: '#F97316', icon: 'flame-outline' },
  { label: 'Other',   color: '#94A3B8', icon: 'ellipsis-horizontal-circle-outline' },
];

const ACTIVITIES = ['Studying', 'Socializing', 'Exercise', 'Meal', 'Hobbies', 'Rest', 'Work', 'Class'];

const CHECK_INS: { id: TimeKey; label: string; time: string; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
  { id: 'morning',   label: 'Morning',   time: '10:00 AM', icon: 'sunny-outline' },
  { id: 'afternoon', label: 'Afternoon', time: '1:00 PM',  icon: 'partly-sunny-outline' },
  { id: 'evening',   label: 'Evening',   time: '10:00 PM', icon: 'moon-outline' },
];

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Week of Apr 7–13. Tue morning is pre-logged; afternoon logged live during task.
const MOCK_WEEK: Record<string, MoodType[]> = {
  Mon: ['Stressed', 'Happy', 'Happy'],
  Tue: ['Happy'],
  Wed: [],
  Thu: [],
  Fri: [],
  Sat: [],
  Sun: [],
};

const MOCK_MONTHS = [
  { week: 'Mar 3 – 9',    dominant: 'Happy'   as MoodType, color: '#22C55E', summary: 'Great week — lots of socializing and energy.' },
  { week: 'Mar 10 – 16',  dominant: 'Stressed'as MoodType, color: '#EF4444', summary: 'Midterm week — high stress, low sleep.' },
  { week: 'Mar 17 – 23',  dominant: 'Happy'   as MoodType, color: '#22C55E', summary: 'Spring break vibes, relaxed and recharged.' },
  { week: 'Mar 24 – 30',  dominant: 'Other'   as MoodType, color: '#94A3B8', summary: 'Mixed feelings returning from break.' },
];

function moodColor(m: MoodType) {
  return MOOD_CONFIG.find((c) => c.label === m)?.color ?? '#94A3B8';
}

interface CheckInState {
  moods: MoodType[];
  note: string;
  activities: string[];
}

const emptyCheckIn = (): CheckInState => ({ moods: [], note: '', activities: [] });

// ─── Sub-views ───────────────────────────────────────────────────────────────

function DailyView({ onViewWeekly }: { onViewWeekly: () => void }) {
  // Default to Afternoon open — task scenario is Tuesday afternoon
  const [expanded, setExpanded] = useState<TimeKey>('afternoon');
  const [data, setData] = useState<Record<TimeKey, CheckInState>>({
    // Pre-seed morning so weekly grid looks lived-in
    morning: { moods: ['Happy'], activities: ['Meal', 'Class'], note: 'Good start, felt energized for morning lecture.' },
    afternoon: emptyCheckIn(),
    evening: emptyCheckIn(),
  });
  const [saved, setSaved] = useState<TimeKey[]>(['morning']);
  const [lastSaved, setLastSaved] = useState<TimeKey | null>(null);

  const toggleMood = (key: TimeKey, mood: MoodType) => {
    setData((p) => {
      const cur = p[key].moods;
      return {
        ...p,
        [key]: {
          ...p[key],
          moods: cur.includes(mood) ? cur.filter((m) => m !== mood) : [...cur, mood],
        },
      };
    });
  };

  const toggleActivity = (key: TimeKey, act: string) => {
    setData((p) => {
      const cur = p[key].activities;
      return {
        ...p,
        [key]: {
          ...p[key],
          activities: cur.includes(act) ? cur.filter((a) => a !== act) : [...cur, act],
        },
      };
    });
  };

  const setNote = (key: TimeKey, note: string) => {
    setData((p) => ({ ...p, [key]: { ...p[key], note } }));
  };

  const handleSave = (key: TimeKey) => {
    setSaved((p) => (p.includes(key) ? p : [...p, key]));
    setLastSaved(key);
  };

  return (
    <>
      <Text style={ds.dateHeader}>Tuesday, April 8</Text>
      {CHECK_INS.map((ci) => {
        const open = expanded === ci.id;
        const d = data[ci.id];
        const isSaved = saved.includes(ci.id);
        return (
          <View key={ci.id} style={ds.section}>
            <TouchableOpacity
              style={ds.sectionHeader}
              onPress={() => setExpanded(open ? ('' as TimeKey) : ci.id)}
              activeOpacity={0.8}
            >
              <View style={ds.sectionHeaderLeft}>
                <Ionicons name={ci.icon} size={18} color='#7C6FA0' />
                <Text style={ds.sectionTitle}>{ci.label}</Text>
                <Text style={ds.sectionTime}>{ci.time}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                {isSaved && (
                  <View style={ds.savedBadge}>
                    <Ionicons name="checkmark-circle" size={14} color='#22C55E' />
                    <Text style={ds.savedTxt}>Saved</Text>
                  </View>
                )}
                {d.moods.length > 0 && !open && (
                  <View style={{ flexDirection: 'row', gap: 4 }}>
                    {d.moods.slice(0, 3).map((m) => (
                      <View key={m} style={[ds.moodDot, { backgroundColor: moodColor(m) }]} />
                    ))}
                  </View>
                )}
                <Ionicons
                  name={open ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color='#B0A8C8'
                />
              </View>
            </TouchableOpacity>

            {open && (
              <View style={ds.sectionBody}>
                {/* Mood buttons */}
                <Text style={ds.fieldLabel}>How are you feeling?</Text>
                <View style={ds.moodRow}>
                  {MOOD_CONFIG.map((mc) => {
                    const sel = d.moods.includes(mc.label);
                    return (
                      <TouchableOpacity
                        key={mc.label}
                        style={[ds.moodBtn, sel && { backgroundColor: mc.color, borderColor: mc.color }]}
                        onPress={() => toggleMood(ci.id, mc.label)}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name={mc.icon}
                          size={18}
                          color={sel ? '#fff' : mc.color}
                        />
                        <Text style={[ds.moodBtnTxt, sel && { color: '#fff' }]}>
                          {mc.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Note */}
                <Text style={ds.fieldLabel}>Why do you feel this way?</Text>
                <TextInput
                  style={ds.noteInput}
                  placeholder="Write a little about your day..."
                  placeholderTextColor="#C4B8D8"
                  value={d.note}
                  onChangeText={(t) => setNote(ci.id, t)}
                  multiline
                  numberOfLines={3}
                />

                {/* Activity tags */}
                <Text style={ds.fieldLabel}>What were you doing?</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={ds.actRow}>
                    {ACTIVITIES.map((act) => {
                      const sel = d.activities.includes(act);
                      return (
                        <TouchableOpacity
                          key={act}
                          style={[ds.actTag, sel && ds.actTagActive]}
                          onPress={() => toggleActivity(ci.id, act)}
                        >
                          <Text style={[ds.actTagTxt, sel && ds.actTagTxtActive]}>
                            {act}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>

                {isSaved ? (
                  <View style={ds.savedConfirmBox}>
                    <View style={ds.savedConfirmLeft}>
                      <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
                      <View>
                        <Text style={ds.savedConfirmTitle}>Check-in saved!</Text>
                        <Text style={ds.savedConfirmSub}>
                          {d.moods.join(', ') || 'Logged'} · {d.activities.slice(0, 2).join(', ') || 'No activities'}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity style={ds.weekLinkBtn} onPress={onViewWeekly}>
                      <Text style={ds.weekLinkTxt}>See week →</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={ds.saveBtn} onPress={() => handleSave(ci.id)}>
                    <Ionicons name="save-outline" size={17} color="#fff" />
                    <Text style={ds.saveBtnTxt}>Save {ci.label} Check-in</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        );
      })}
    </>
  );
}

function WeeklyView({ tueSavedMoods }: { tueSavedMoods: MoodType[] }) {
  const [highs, setHighs] = useState('');
  const [lows, setLows] = useState('');
  const [goals, setGoals] = useState('');
  const [weeklySaved, setWeeklySaved] = useState(false);

  // Merge live-saved Tuesday moods into the grid
  const liveWeek: Record<string, MoodType[]> = {
    ...MOCK_WEEK,
    Tue: tueSavedMoods.length > 0 ? tueSavedMoods.slice(0, 3) : MOCK_WEEK['Tue'],
  };

  return (
    <>
      <Text style={ds.dateHeader}>Week of Apr 7 – 13</Text>

      {/* Day grid */}
      <View style={ds.section}>
        <Text style={ds.sectionTitle2}>Daily Moods</Text>
        <View style={ds.weekGrid}>
          {WEEK_DAYS.map((d) => {
            const moods = liveWeek[d] as MoodType[] | [];
            const isToday = d === 'Tue';
            return (
              <View key={d} style={[ds.weekCol, isToday && ds.weekColToday]}>
                <Text style={[ds.weekDayLabel, isToday && { color: PURPLE }]}>{d}</Text>
                {isToday && <Text style={ds.weekTodayLabel}>today</Text>}
                {moods.length > 0 ? (
                  (moods as MoodType[]).map((m, i) => (
                    <View key={i} style={[ds.moodDotLg, { backgroundColor: moodColor(m) }]} />
                  ))
                ) : (
                  <View style={[ds.moodDotLg, { backgroundColor: '#E2E8F0' }]} />
                )}
              </View>
            );
          })}
        </View>
        <View style={ds.weekLegend}>
          {MOOD_CONFIG.map((mc) => (
            <View key={mc.label} style={ds.weekLegendItem}>
              <View style={[ds.weekLegendDot, { backgroundColor: mc.color }]} />
              <Text style={ds.weekLegendTxt}>{mc.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Reflection */}
      <View style={ds.section}>
        <Text style={ds.sectionTitle2}>Weekly Reflection</Text>

        <Text style={ds.fieldLabel}>Weekly Highs</Text>
        <TextInput
          style={ds.reflectInput}
          placeholder="What went well this week?"
          placeholderTextColor="#C4B8D8"
          value={highs}
          onChangeText={setHighs}
          multiline
          numberOfLines={3}
        />

        <Text style={ds.fieldLabel}>Weekly Lows</Text>
        <TextInput
          style={ds.reflectInput}
          placeholder="What was challenging?"
          placeholderTextColor="#C4B8D8"
          value={lows}
          onChangeText={setLows}
          multiline
          numberOfLines={3}
        />

        <Text style={ds.fieldLabel}>Goals for Next Week</Text>
        <TextInput
          style={ds.reflectInput}
          placeholder="What do you want to improve?"
          placeholderTextColor="#C4B8D8"
          value={goals}
          onChangeText={setGoals}
          multiline
          numberOfLines={3}
        />

        {weeklySaved ? (
          <View style={ds.savedConfirmBox}>
            <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
            <Text style={ds.savedConfirmTitle}>Weekly review saved!</Text>
          </View>
        ) : (
          <TouchableOpacity style={ds.saveBtn} onPress={() => setWeeklySaved(true)}>
            <Ionicons name="save-outline" size={17} color="#fff" />
            <Text style={ds.saveBtnTxt}>Save Weekly Review</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}

function MonthlyView() {
  const [highs, setHighs] = useState('');
  const [lows, setLows] = useState('');
  const [goals, setGoals] = useState('');

  return (
    <>
      <Text style={ds.dateHeader}>March 2026</Text>

      {/* Week rows */}
      <View style={ds.section}>
        <Text style={ds.sectionTitle2}>Weekly Snapshots</Text>
        {MOCK_MONTHS.map((wk, i) => (
          <View key={i} style={ds.monthRow}>
            <View style={{ flex: 1 }}>
              <Text style={ds.monthWeekLabel}>{wk.week}</Text>
              <Text style={ds.monthSummary}>{wk.summary}</Text>
            </View>
            <View style={[ds.dominantBadge, { backgroundColor: wk.color + '22' }]}>
              <Text style={[ds.dominantTxt, { color: wk.color }]}>{wk.dominant}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Reflection */}
      <View style={ds.section}>
        <Text style={ds.sectionTitle2}>Monthly Reflection</Text>

        <Text style={ds.fieldLabel}>Monthly Highs</Text>
        <TextInput
          style={ds.reflectInput}
          placeholder="Best moments this month..."
          placeholderTextColor="#C4B8D8"
          value={highs}
          onChangeText={setHighs}
          multiline
          numberOfLines={3}
        />

        <Text style={ds.fieldLabel}>Monthly Lows</Text>
        <TextInput
          style={ds.reflectInput}
          placeholder="What was tough this month?"
          placeholderTextColor="#C4B8D8"
          value={lows}
          onChangeText={setLows}
          multiline
          numberOfLines={3}
        />

        <Text style={ds.fieldLabel}>Goals for Next Month</Text>
        <TextInput
          style={ds.reflectInput}
          placeholder="What will you focus on?"
          placeholderTextColor="#C4B8D8"
          value={goals}
          onChangeText={setGoals}
          multiline
          numberOfLines={3}
        />
      </View>
    </>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function MoodTrackerScreen() {
  const navigation = useNavigation();
  const [topView, setTopView] = useState<TopView>('journal');
  const [view, setView] = useState<ActiveView>('Daily');
  // Lift Tuesday afternoon moods up so WeeklyView can reflect live saves
  const [tueSavedMoods, setTueSavedMoods] = useState<MoodType[]>(['Happy']); // morning pre-seeded

  return (
    <SafeAreaView style={ds.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={ds.header}>
        <TouchableOpacity style={ds.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#5B4F7C" />
        </TouchableOpacity>
        <Text style={ds.headerTitle}>Mood Tracker</Text>
        <TouchableOpacity style={ds.iconBtn}>
          <Ionicons name="settings-outline" size={22} color="#5B4F7C" />
        </TouchableOpacity>
      </View>

      {/* Top-level toggle: Journal | Heatmap */}
      <View style={ds.topToggleWrap}>
        <View style={ds.topToggle}>
          <TouchableOpacity
            style={[ds.topToggleBtn, topView === 'journal' && ds.topToggleBtnActive]}
            onPress={() => setTopView('journal')}
          >
            <Ionicons name="journal-outline" size={15} color={topView === 'journal' ? '#3D3260' : '#A99CC0'} />
            <Text style={[ds.topToggleTxt, topView === 'journal' && ds.topToggleTxtActive]}>Journal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[ds.topToggleBtn, topView === 'heatmap' && ds.topToggleBtnActive]}
            onPress={() => setTopView('heatmap')}
          >
            <Ionicons name="grid-outline" size={15} color={topView === 'heatmap' ? '#3D3260' : '#A99CC0'} />
            <Text style={[ds.topToggleTxt, topView === 'heatmap' && ds.topToggleTxtActive]}>Heatmap</Text>
          </TouchableOpacity>
        </View>
      </View>

      {topView === 'heatmap' ? (
        <MoodHeatmapView />
      ) : (
        <>
          {/* Journal sub-tabs */}
          <View style={ds.tabBar}>
            {(['Daily', 'Weekly', 'Monthly'] as ActiveView[]).map((v) => (
              <TouchableOpacity
                key={v}
                style={[ds.tabItem, view === v && ds.tabItemActive]}
                onPress={() => setView(v)}
              >
                <Text style={[ds.tabItemTxt, view === v && ds.tabItemTxtActive]}>{v}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={ds.scroll}
          >
            {view === 'Daily'   && (
              <DailyView onViewWeekly={() => setView('Weekly')} />
            )}
            {view === 'Weekly'  && <WeeklyView tueSavedMoods={tueSavedMoods} />}
            {view === 'Monthly' && <MonthlyView />}
            <View style={{ height: 32 }} />
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const LAVENDER = '#E8E4F3';
const PURPLE   = '#7C6FA0';
const LILAC    = '#F3F0FA';

const ds = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },

  topToggleWrap: { paddingHorizontal: 16, paddingBottom: 8 },
  topToggle: {
    flexDirection: 'row',
    backgroundColor: '#E8E4F3',
    borderRadius: 14,
    padding: 4,
  },
  topToggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 11,
  },
  topToggleBtnActive: {
    backgroundColor: '#fff',
    shadowColor: '#7C6FA0',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  topToggleTxt: { fontSize: 14, fontWeight: '600', color: '#A99CC0' },
  topToggleTxtActive: { color: '#3D3260', fontWeight: '700' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backBtn: { padding: 4 },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    color: '#3D3260',
    textAlign: 'center',
  },
  iconBtn: { padding: 4 },

  tabBar: {
    flexDirection: 'row',
    backgroundColor: LAVENDER,
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 4,
    marginBottom: 12,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 11,
    alignItems: 'center',
  },
  tabItemActive: {
    backgroundColor: '#fff',
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  tabItemTxt: { fontSize: 14, fontWeight: '600', color: '#A99CC0' },
  tabItemTxtActive: { color: PURPLE, fontWeight: '700' },

  scroll: { paddingHorizontal: 16 },

  dateHeader: {
    fontSize: 22,
    fontWeight: '800',
    color: '#3D3260',
    marginBottom: 16,
  },

  section: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle2: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3D3260',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#3D3260' },
  sectionTime: { fontSize: 12, color: '#B0A8C8', marginLeft: 4 },
  moodDot: { width: 8, height: 8, borderRadius: 4 },
  savedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  savedTxt: { fontSize: 11, color: '#22C55E', fontWeight: '600' },

  savedConfirmBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    gap: 10,
  },
  savedConfirmLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  savedConfirmTitle: { fontSize: 13, fontWeight: '700', color: '#065F46' },
  savedConfirmSub: { fontSize: 11, color: '#6EE7B7', marginTop: 1 },
  weekLinkBtn: {
    backgroundColor: PURPLE,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  weekLinkTxt: { color: '#fff', fontWeight: '700', fontSize: 12 },

  weekColToday: {
    backgroundColor: '#EDE9FA',
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  weekTodayLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: PURPLE,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  sectionBody: { paddingHorizontal: 16, paddingBottom: 16 },

  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B5E8C',
    marginTop: 14,
    marginBottom: 8,
  },

  moodRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  moodBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E0D9EF',
    backgroundColor: LILAC,
  },
  moodBtnTxt: { fontSize: 13, fontWeight: '600', color: '#7C6FA0' },

  noteInput: {
    backgroundColor: LILAC,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#3D3260',
    borderWidth: 1.5,
    borderColor: '#E0D9EF',
    minHeight: 80,
    textAlignVertical: 'top',
  },

  actRow: { flexDirection: 'row', gap: 8, paddingVertical: 4 },
  actTag: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E0D9EF',
    backgroundColor: LILAC,
  },
  actTagActive: { backgroundColor: LAVENDER, borderColor: PURPLE },
  actTagTxt: { fontSize: 13, fontWeight: '600', color: '#A99CC0' },
  actTagTxtActive: { color: PURPLE },

  saveBtn: {
    backgroundColor: PURPLE,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 18,
  },
  saveBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 15 },

  // Weekly
  weekGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    justifyContent: 'space-between',
  },
  weekCol: { alignItems: 'center', gap: 5 },
  weekDayLabel: { fontSize: 11, fontWeight: '700', color: '#B0A8C8', textTransform: 'uppercase' },
  moodDotLg: { width: 12, height: 12, borderRadius: 6 },
  weekLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 10,
  },
  weekLegendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  weekLegendDot: { width: 10, height: 10, borderRadius: 5 },
  weekLegendTxt: { fontSize: 11, color: '#888', fontWeight: '500' },

  reflectInput: {
    backgroundColor: LILAC,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#3D3260',
    borderWidth: 1.5,
    borderColor: '#E0D9EF',
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 4,
    marginHorizontal: 16,
  },

  // Monthly
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F0FA',
    gap: 12,
  },
  monthWeekLabel: { fontSize: 12, fontWeight: '700', color: '#6B5E8C', marginBottom: 3 },
  monthSummary: { fontSize: 13, color: '#888', lineHeight: 18 },
  dominantBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 72,
    alignItems: 'center',
  },
  dominantTxt: { fontSize: 12, fontWeight: '700' },
});
