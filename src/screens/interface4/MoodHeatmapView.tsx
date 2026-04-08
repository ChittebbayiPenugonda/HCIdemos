import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: SW } = Dimensions.get('window');

// ─── Types ────────────────────────────────────────────────────────────────────

type HeatMood = 'Happy' | 'Neutral' | 'Stressed' | 'Overwhelmed' | null;

type CellData = {
  mood: HeatMood;
  activities: string[];
  note: string;
};

type HeatmapData = Record<string, CellData>;

// ─── Constants ────────────────────────────────────────────────────────────────

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TODAY = 'Thu'; // Apr 8 2026 is a Tuesday in real life but task scenario uses Thu

const HOURS = Array.from({ length: 18 }, (_, i) => i + 7); // 7am–midnight (24)

const MOODS: { label: HeatMood; color: string; bg: string }[] = [
  { label: 'Happy',      color: '#22C55E', bg: '#DCFCE7' },
  { label: 'Neutral',    color: '#60A5FA', bg: '#DBEAFE' },
  { label: 'Stressed',   color: '#FBBF24', bg: '#FEF3C7' },
  { label: 'Overwhelmed',color: '#EF4444', bg: '#FEE2E2' },
];

const ACTIVITIES = ['Studying', 'Class', 'Socializing', 'Exercise', 'Meal', 'Rest', 'Hobbies'];

function moodColor(mood: HeatMood): string {
  if (!mood) return '#E5E7EB';
  return MOODS.find((m) => m.label === mood)?.color ?? '#E5E7EB';
}
function moodBg(mood: HeatMood): string {
  if (!mood) return '#F3F4F6';
  return MOODS.find((m) => m.label === mood)?.bg ?? '#F3F4F6';
}

function fmtHour(h: number) {
  if (h === 0) return '12am';
  if (h === 12) return '12pm';
  return h > 12 ? `${h - 12}pm` : `${h}am`;
}

// ─── Seed data ────────────────────────────────────────────────────────────────

function seed(): HeatmapData {
  const d: HeatmapData = {};
  const fill = (day: string, hour: number, mood: HeatMood, acts: string[] = [], note = '') => {
    d[`${day}-${hour}`] = { mood, activities: acts, note };
  };

  // Monday
  fill('Mon', 8,  'Stressed',   ['Class'],              'Big exam this morning, feel tense');
  fill('Mon', 9,  'Stressed',   ['Class']);
  fill('Mon', 10, 'Neutral',    ['Class']);
  fill('Mon', 12, 'Neutral',    ['Meal']);
  fill('Mon', 13, 'Neutral',    ['Studying']);
  fill('Mon', 14, 'Stressed',   ['Studying'],            'Can\'t focus on problem sets');
  fill('Mon', 15, 'Stressed',   ['Studying']);
  fill('Mon', 18, 'Happy',      ['Meal', 'Socializing'], 'Dinner with friends helped a lot');
  fill('Mon', 20, 'Neutral',    ['Rest']);

  // Tuesday
  fill('Tue', 9,  'Happy',      ['Class'],              'Professor dropped the lowest grade!');
  fill('Tue', 10, 'Happy',      ['Class']);
  fill('Tue', 11, 'Neutral',    ['Studying']);
  fill('Tue', 12, 'Happy',      ['Meal', 'Socializing']);
  fill('Tue', 13, 'Neutral',    ['Class']);
  fill('Tue', 14, 'Neutral',    ['Class']);
  fill('Tue', 16, 'Stressed',   ['Studying']);
  fill('Tue', 17, 'Stressed',   ['Studying']);
  fill('Tue', 19, 'Happy',      ['Exercise'],           'Evening run cleared my head');
  fill('Tue', 21, 'Neutral',    ['Rest']);

  // Wednesday — most stressful
  fill('Wed', 8,  'Neutral',    ['Meal']);
  fill('Wed', 9,  'Stressed',   ['Class']);
  fill('Wed', 10, 'Overwhelmed',['Class', 'Studying'],  'Group project fell apart, panicking');
  fill('Wed', 11, 'Overwhelmed',['Studying']);
  fill('Wed', 12, 'Stressed',   ['Studying']);
  fill('Wed', 13, 'Stressed',   ['Meal']);
  fill('Wed', 14, 'Overwhelmed',['Studying'],           'Three deadlines at once');
  fill('Wed', 15, 'Stressed',   ['Studying']);
  fill('Wed', 16, 'Stressed',   ['Class']);
  fill('Wed', 19, 'Neutral',    ['Meal', 'Rest']);
  fill('Wed', 21, 'Neutral',    ['Rest']);

  // Thursday
  fill('Thu', 9,  'Neutral',    ['Class']);
  fill('Thu', 10, 'Happy',      ['Class'],              'Made progress on project');
  fill('Thu', 11, 'Neutral',    ['Studying']);
  fill('Thu', 12, 'Happy',      ['Meal', 'Socializing']);
  fill('Thu', 14, 'Neutral',    ['Studying']);
  fill('Thu', 16, 'Happy',      ['Exercise'],           'Bouldering after class, felt great');
  fill('Thu', 18, 'Happy',      ['Socializing', 'Meal']);
  fill('Thu', 20, 'Happy',      ['Hobbies'],            'Watched a movie, nice wind-down');

  // Friday
  fill('Fri', 10, 'Happy',      ['Class']);
  fill('Fri', 11, 'Happy',      ['Socializing'],        'Coffee run with friends');
  fill('Fri', 12, 'Happy',      ['Meal', 'Socializing']);
  fill('Fri', 14, 'Neutral',    ['Studying']);
  fill('Fri', 17, 'Happy',      ['Exercise']);
  fill('Fri', 19, 'Happy',      ['Socializing', 'Hobbies'], 'Movie night!');
  fill('Fri', 21, 'Happy',      ['Rest']);

  // Saturday
  fill('Sat', 10, 'Happy',      ['Exercise'],           'Morning yoga at Piedmont Park');
  fill('Sat', 11, 'Happy',      ['Exercise']);
  fill('Sat', 12, 'Happy',      ['Meal', 'Socializing']);
  fill('Sat', 14, 'Happy',      ['Hobbies', 'Socializing']);
  fill('Sat', 16, 'Neutral',    ['Rest']);
  fill('Sat', 19, 'Happy',      ['Meal', 'Socializing'], 'Great dinner out');
  fill('Sat', 21, 'Neutral',    ['Rest']);

  // Sunday
  fill('Sun', 10, 'Neutral',    ['Meal', 'Rest']);
  fill('Sun', 12, 'Neutral',    ['Studying']);
  fill('Sun', 13, 'Stressed',   ['Studying'],           'Sunday scaries kicking in');
  fill('Sun', 14, 'Stressed',   ['Studying']);
  fill('Sun', 16, 'Neutral',    ['Rest']);
  fill('Sun', 18, 'Neutral',    ['Meal']);
  fill('Sun', 20, 'Happy',      ['Hobbies'],            'Gaming helped me unwind');

  return d;
}

const SEED = seed();

// ─── Cell size ────────────────────────────────────────────────────────────────

const LABEL_W = 36;
const CELL_W = Math.floor((SW - LABEL_W - 32) / 7);
const CELL_H = CELL_W - 2;

// ─── Insights helpers ─────────────────────────────────────────────────────────

const MOOD_SCORE: Record<string, number> = {
  Happy: 2, Neutral: 1, Stressed: -1, Overwhelmed: -2,
};

function buildInsights(data: HeatmapData) {
  // Most stressful day
  const dayStress: Record<string, number> = {};
  DAYS.forEach((d) => { dayStress[d] = 0; });
  Object.entries(data).forEach(([key, cell]) => {
    if (!cell.mood) return;
    const day = key.split('-')[0];
    dayStress[day] = (dayStress[day] ?? 0) + (MOOD_SCORE[cell.mood] ?? 0);
  });
  const mostStressfulDay = Object.entries(dayStress).sort((a, b) => a[1] - b[1])[0][0];

  // Happiest activity
  const actScores: Record<string, { total: number; count: number }> = {};
  ACTIVITIES.forEach((a) => { actScores[a] = { total: 0, count: 0 }; });
  Object.values(data).forEach((cell) => {
    if (!cell.mood) return;
    cell.activities.forEach((act) => {
      if (actScores[act]) {
        actScores[act].total += MOOD_SCORE[cell.mood!] ?? 0;
        actScores[act].count += 1;
      }
    });
  });
  const actAvg = Object.entries(actScores)
    .filter(([, v]) => v.count > 0)
    .map(([k, v]) => ({ act: k, avg: v.total / v.count, count: v.count }))
    .sort((a, b) => b.avg - a.avg);
  const happiestActivity = actAvg[0]?.act ?? 'Exercise';

  // Stress streak (consecutive days with net-negative score)
  let streak = 0;
  for (let i = DAYS.length - 1; i >= 0; i--) {
    if (dayStress[DAYS[i]] < 0) streak++;
    else break;
  }

  // This week mood distribution
  const thisWeekCounts: Record<string, number> = { Happy: 0, Neutral: 0, Stressed: 0, Overwhelmed: 0 };
  Object.values(data).forEach((c) => { if (c.mood) thisWeekCounts[c.mood] = (thisWeekCounts[c.mood] ?? 0) + 1; });

  // Last week mock
  const lastWeekCounts = { Happy: 8, Neutral: 14, Stressed: 10, Overwhelmed: 5 };

  // Notes
  const notes: { day: string; hour: number; mood: HeatMood; note: string }[] = [];
  Object.entries(data).forEach(([key, cell]) => {
    if (cell.note) {
      const [day, hour] = key.split('-');
      notes.push({ day, hour: Number(hour), mood: cell.mood, note: cell.note });
    }
  });
  // Order by day index, then hour
  notes.sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day) || a.hour - b.hour);

  return { mostStressfulDay, happiestActivity, streak, actAvg, thisWeekCounts, lastWeekCounts, notes };
}

// ─── Donut component ──────────────────────────────────────────────────────────

function DonutChart({
  counts,
  label,
}: {
  counts: Record<string, number>;
  label: string;
}) {
  const total = Object.values(counts).reduce((s, n) => s + n, 0) || 1;
  const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const pct = Math.round((dominant[1] / total) * 100);
  const color = MOODS.find((m) => m.label === dominant[0])?.color ?? '#888';

  return (
    <View style={ins.donutWrap}>
      <Text style={ins.donutLabel}>{label}</Text>
      <View style={[ins.donutOuter, { borderColor: color }]}>
        <View style={ins.donutInner}>
          <Text style={[ins.donutPct, { color }]}>{pct}%</Text>
          <Text style={ins.donutMoodTxt}>{dominant[0]}</Text>
        </View>
      </View>
      <View style={ins.donutLegend}>
        {MOODS.map((m) => (
          <View key={m.label} style={ins.donutLegRow}>
            <View style={[ins.donutLegDot, { backgroundColor: m.color }]} />
            <Text style={ins.donutLegTxt}>
              {Math.round(((counts[m.label!] ?? 0) / total) * 100)}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Heatmap grid ─────────────────────────────────────────────────────────────

function HeatmapView({ data, onUpdate }: { data: HeatmapData; onUpdate: (d: HeatmapData) => void }) {
  const [modalKey, setModalKey] = useState<string | null>(null);
  const [draftMood, setDraftMood] = useState<HeatMood>(null);
  const [draftActs, setDraftActs] = useState<string[]>([]);
  const [draftNote, setDraftNote] = useState('');

  const openCell = (day: string, hour: number) => {
    const key = `${day}-${hour}`;
    const cell = data[key];
    setModalKey(key);
    setDraftMood(cell?.mood ?? null);
    setDraftActs(cell?.activities ?? []);
    setDraftNote(cell?.note ?? '');
  };

  const saveCell = () => {
    if (!modalKey) return;
    onUpdate({ ...data, [modalKey]: { mood: draftMood, activities: draftActs, note: draftNote } });
    setModalKey(null);
  };

  const toggleAct = (act: string) => {
    setDraftActs((p) => p.includes(act) ? p.filter((a) => a !== act) : [...p, act]);
  };

  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      {/* Instruction hint */}
      <View style={hm.hintBanner}>
        <Ionicons name="finger-print-outline" size={16} color={PURPLE} />
        <Text style={hm.hintTxt}>Tap any cell to log your mood for that hour</Text>
      </View>

      {/* Legend */}
      <View style={hm.legendRow}>
        <Text style={hm.legendTitle}>This Week</Text>
        <View style={hm.legendItems}>
          {[...MOODS, { label: null as HeatMood, color: '#9CA3AF', bg: '#F3F4F6' }].map((m) => (
            <View key={String(m.label)} style={hm.legendItem}>
              <View style={[hm.legendSwatch, { backgroundColor: m.color }]} />
              <Text style={hm.legendTxt}>{m.label ?? 'Unlogged'}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Grid */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={hm.gridWrap}>
          {/* Day headers */}
          <View style={hm.dayHeaderRow}>
            <View style={{ width: LABEL_W }} />
            {DAYS.map((d) => (
              <View
                key={d}
                style={[
                  hm.dayHeader,
                  { width: CELL_W },
                  d === TODAY && hm.dayHeaderToday,
                ]}
              >
                <Text style={[hm.dayHeaderTxt, d === TODAY && hm.dayHeaderTodayTxt]}>{d}</Text>
                {d === TODAY && <Text style={hm.todaySubLabel}>today</Text>}
              </View>
            ))}
          </View>

          {/* Hour rows */}
          {HOURS.map((h) => (
            <View key={h} style={hm.hourRow}>
              <View style={[hm.hourLabel, { width: LABEL_W }]}>
                <Text style={hm.hourTxt}>{fmtHour(h)}</Text>
              </View>
              {DAYS.map((d) => {
                const key = `${d}-${h}`;
                const cell = data[key];
                const bg = moodColor(cell?.mood ?? null);
                const isToday = d === TODAY;
                return (
                  <TouchableOpacity
                    key={d}
                    style={[
                      hm.cell,
                      { width: CELL_W - 3, height: CELL_H, backgroundColor: bg },
                      isToday && hm.cellToday,
                    ]}
                    onPress={() => openCell(d, h)}
                    activeOpacity={0.75}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={{ height: 24 }} />

      {/* Cell edit modal */}
      <Modal visible={!!modalKey} transparent animationType="fade" onRequestClose={() => setModalKey(null)}>
        <View style={hm.modalOverlay}>
          <View style={hm.modalCard}>
            <Text style={hm.modalTitle}>
              {modalKey ? `${modalKey.split('-')[0]} · ${fmtHour(Number(modalKey.split('-')[1]))}` : ''}
            </Text>

            {/* Mood selection */}
            <Text style={hm.modalLabel}>Mood</Text>
            <View style={hm.moodRow}>
              {MOODS.map((m) => (
                <TouchableOpacity
                  key={String(m.label)}
                  style={[
                    hm.moodBtn,
                    { borderColor: m.color, backgroundColor: draftMood === m.label ? m.color : '#fff' },
                  ]}
                  onPress={() => setDraftMood(m.label)}
                >
                  <Text style={[hm.moodBtnTxt, { color: draftMood === m.label ? '#fff' : m.color }]}>
                    {m.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Activity tags */}
            <Text style={hm.modalLabel}>Activities</Text>
            <View style={hm.actRow}>
              {ACTIVITIES.map((act) => (
                <TouchableOpacity
                  key={act}
                  style={[hm.actTag, draftActs.includes(act) && hm.actTagActive]}
                  onPress={() => toggleAct(act)}
                >
                  <Text style={[hm.actTagTxt, draftActs.includes(act) && hm.actTagTxtActive]}>
                    {act}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Note */}
            <Text style={hm.modalLabel}>Note (optional)</Text>
            <TextInput
              style={hm.noteInput}
              placeholder="How are you feeling?"
              placeholderTextColor="#ccc"
              value={draftNote}
              onChangeText={setDraftNote}
              multiline
            />

            {/* Buttons */}
            <View style={hm.modalBtns}>
              <TouchableOpacity style={hm.cancelBtn} onPress={() => setModalKey(null)}>
                <Text style={hm.cancelBtnTxt}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[hm.saveBtn, { backgroundColor: draftMood ? moodColor(draftMood) : '#7C6FA0' }]}
                onPress={saveCell}
              >
                <Text style={hm.saveBtnTxt}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

// ─── Insights view ────────────────────────────────────────────────────────────

function InsightsView({ data }: { data: HeatmapData }) {
  const { mostStressfulDay, happiestActivity, streak, actAvg, thisWeekCounts, lastWeekCounts, notes } =
    buildInsights(data);

  const maxAvg = Math.max(...actAvg.map((a) => Math.abs(a.avg)), 1);

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={ins.scroll} showsVerticalScrollIndicator={false}>
      <Text style={ins.pageTitle}>Your Patterns</Text>

      {/* Stat cards */}
      <View style={ins.statRow}>
        <View style={ins.statCard}>
          <Ionicons name="calendar-outline" size={20} color="#EF4444" />
          <Text style={ins.statVal}>{mostStressfulDay}</Text>
          <Text style={ins.statLbl}>Most Stressful Day</Text>
        </View>
        <View style={ins.statCard}>
          <Ionicons name="happy-outline" size={20} color="#22C55E" />
          <Text style={ins.statVal}>{happiestActivity}</Text>
          <Text style={ins.statLbl}>Happiest Activity</Text>
        </View>
        <View style={ins.statCard}>
          <Ionicons name="flame-outline" size={20} color="#F97316" />
          <Text style={ins.statVal}>{streak} day{streak !== 1 ? 's' : ''}</Text>
          <Text style={ins.statLbl}>Stress Streak</Text>
        </View>
      </View>

      {/* Bar chart */}
      <View style={ins.section}>
        <Text style={ins.sectionTitle}>Mood by Activity</Text>
        <Text style={ins.sectionSub}>Average mood score when activity was logged</Text>
        {actAvg.map(({ act, avg, count }) => {
          const isPositive = avg >= 0;
          const pct = (Math.abs(avg) / maxAvg) * 100;
          const barColor = avg >= 1.2
            ? '#22C55E'
            : avg >= 0
            ? '#86EFAC'
            : avg >= -1
            ? '#FBBF24'
            : '#EF4444';
          return (
            <View key={act} style={ins.barRow}>
              <Text style={ins.barLabel}>{act}</Text>
              <View style={ins.barTrack}>
                <View
                  style={[
                    ins.bar,
                    { width: `${pct}%` as any, backgroundColor: barColor },
                    !isPositive && { alignSelf: 'flex-end' },
                  ]}
                />
              </View>
              <Text style={[ins.barScore, { color: barColor }]}>
                {avg > 0 ? '+' : ''}{avg.toFixed(1)}
              </Text>
              <Text style={ins.barCount}>({count})</Text>
            </View>
          );
        })}
      </View>

      {/* Donut charts */}
      <View style={ins.section}>
        <Text style={ins.sectionTitle}>This Week vs Last Week</Text>
        <View style={ins.donutRow}>
          <DonutChart counts={thisWeekCounts} label="This Week" />
          <DonutChart counts={lastWeekCounts} label="Last Week" />
        </View>
      </View>

      {/* Notes */}
      <View style={ins.section}>
        <Text style={ins.sectionTitle}>Your Notes This Week</Text>
        {notes.length === 0 ? (
          <Text style={ins.emptyNotes}>No notes logged yet.</Text>
        ) : (
          notes.map((n, i) => (
            <View key={i} style={ins.noteCard}>
              <View style={[ins.noteDot, { backgroundColor: moodColor(n.mood) }]} />
              <View style={{ flex: 1 }}>
                <Text style={ins.noteMeta}>
                  {n.day} · {fmtHour(n.hour)}
                  <Text style={{ color: moodColor(n.mood) }}>{n.mood ? `  ${n.mood}` : ''}</Text>
                </Text>
                <Text style={ins.noteText}>{n.note}</Text>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function MoodHeatmapView() {
  const [subView, setSubView] = useState<'heatmap' | 'insights'>('heatmap');
  const [data, setData] = useState<HeatmapData>(SEED);

  return (
    <View style={{ flex: 1 }}>
      {/* Sub-toggle */}
      <View style={top.toggleWrap}>
        <View style={top.segmented}>
          <TouchableOpacity
            style={[top.segBtn, subView === 'heatmap' && top.segActive]}
            onPress={() => setSubView('heatmap')}
          >
            <Ionicons name="grid-outline" size={14} color={subView === 'heatmap' ? '#3D3260' : '#A99CC0'} />
            <Text style={[top.segTxt, subView === 'heatmap' && top.segTxtActive]}>Heatmap</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[top.segBtn, subView === 'insights' && top.segActive]}
            onPress={() => setSubView('insights')}
          >
            <Ionicons name="bar-chart-outline" size={14} color={subView === 'insights' ? '#3D3260' : '#A99CC0'} />
            <Text style={[top.segTxt, subView === 'insights' && top.segTxtActive]}>Insights</Text>
          </TouchableOpacity>
        </View>
      </View>

      {subView === 'heatmap'
        ? <HeatmapView data={data} onUpdate={setData} />
        : <InsightsView data={data} />
      }
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const PURPLE = '#7C6FA0';
const LAVENDER = '#E8E4F3';

const top = StyleSheet.create({
  toggleWrap: { paddingHorizontal: 16, paddingBottom: 8 },
  segmented: {
    flexDirection: 'row',
    backgroundColor: LAVENDER,
    borderRadius: 12,
    padding: 3,
  },
  segBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
    borderRadius: 10,
  },
  segActive: {
    backgroundColor: '#fff',
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  segTxt: { fontSize: 13, fontWeight: '600', color: '#A99CC0' },
  segTxtActive: { color: '#3D3260', fontWeight: '700' },
});

const hm = StyleSheet.create({
  hintBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: '#EDE9FA',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  hintTxt: { fontSize: 12, fontWeight: '600', color: PURPLE },

  legendRow: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  legendTitle: { fontSize: 20, fontWeight: '800', color: '#3D3260', marginBottom: 8 },
  legendItems: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendSwatch: { width: 11, height: 11, borderRadius: 3 },
  legendTxt: { fontSize: 10, color: '#888', fontWeight: '500' },

  gridWrap: { paddingLeft: 16, paddingRight: 8 },
  dayHeaderRow: { flexDirection: 'row', marginBottom: 4 },
  dayHeader: {
    alignItems: 'center',
    paddingVertical: 4,
    marginRight: 3,
  },
  dayHeaderToday: {
    backgroundColor: '#EDE9FA',
    borderRadius: 8,
  },
  dayHeaderTxt: { fontSize: 11, fontWeight: '700', color: '#888' },
  dayHeaderTodayTxt: { color: PURPLE },
  todaySubLabel: { fontSize: 8, fontWeight: '700', color: PURPLE, textTransform: 'uppercase', letterSpacing: 0.5 },
  hourRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  hourLabel: { alignItems: 'flex-end', paddingRight: 5 },
  hourTxt: { fontSize: 9, color: '#bbb', fontWeight: '500' },
  cell: {
    borderRadius: 5,
    marginRight: 3,
  },
  cellToday: {
    borderWidth: 1.5,
    borderColor: PURPLE,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: { fontSize: 17, fontWeight: '800', color: '#3D3260', marginBottom: 16 },
  modalLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#888',
    marginTop: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  moodRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  moodBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  moodBtnTxt: { fontSize: 13, fontWeight: '700' },
  actRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  actTag: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F3F0FA',
    borderWidth: 1.5,
    borderColor: '#E0D9EF',
  },
  actTagActive: { backgroundColor: LAVENDER, borderColor: PURPLE },
  actTagTxt: { fontSize: 12, fontWeight: '600', color: '#A99CC0' },
  actTagTxtActive: { color: PURPLE },
  noteInput: {
    backgroundColor: '#F8F7FC',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E0D9EF',
    padding: 10,
    fontSize: 14,
    color: '#3D3260',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  modalBtns: { flexDirection: 'row', gap: 10, marginTop: 18 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelBtnTxt: { fontSize: 15, fontWeight: '600', color: '#666' },
  saveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveBtnTxt: { fontSize: 15, fontWeight: '700', color: '#fff' },
});

const ins = StyleSheet.create({
  scroll: { paddingHorizontal: 16 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: '#3D3260', marginBottom: 16 },

  statRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 4,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  statVal: { fontSize: 14, fontWeight: '800', color: '#3D3260', textAlign: 'center' },
  statLbl: { fontSize: 10, color: '#aaa', textAlign: 'center', fontWeight: '500' },

  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#3D3260', marginBottom: 4 },
  sectionSub: { fontSize: 11, color: '#aaa', marginBottom: 14 },

  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
  },
  barLabel: { width: 80, fontSize: 12, fontWeight: '600', color: '#555' },
  barTrack: {
    flex: 1,
    height: 14,
    backgroundColor: '#F3F0FA',
    borderRadius: 7,
    overflow: 'hidden',
  },
  bar: { height: 14, borderRadius: 7, minWidth: 8 },
  barScore: { width: 30, fontSize: 11, fontWeight: '700', textAlign: 'right' },
  barCount: { width: 24, fontSize: 10, color: '#ccc' },

  donutRow: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 8 },
  donutWrap: { alignItems: 'center', gap: 10 },
  donutLabel: { fontSize: 13, fontWeight: '700', color: '#555' },
  donutOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  donutInner: { alignItems: 'center' },
  donutPct: { fontSize: 20, fontWeight: '800' },
  donutMoodTxt: { fontSize: 10, color: '#888', fontWeight: '600' },
  donutLegend: { gap: 3 },
  donutLegRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  donutLegDot: { width: 8, height: 8, borderRadius: 4 },
  donutLegTxt: { fontSize: 10, color: '#888' },

  emptyNotes: { fontSize: 13, color: '#bbb', textAlign: 'center', paddingVertical: 16 },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F0FA',
  },
  noteDot: { width: 12, height: 12, borderRadius: 6, marginTop: 3 },
  noteMeta: { fontSize: 11, fontWeight: '700', color: '#888', marginBottom: 3 },
  noteText: { fontSize: 13, color: '#444', lineHeight: 18 },
});
