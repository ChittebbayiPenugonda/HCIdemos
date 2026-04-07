import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Modal,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const DAYS = [
  { label: 'Mon', num: 10 },
  { label: 'Tue', num: 11 },
  { label: 'Wed', num: 12 },
  { label: 'Thu', num: 13 },
  { label: 'Fri', num: 14 },
  { label: 'Sat', num: 15 },
  { label: 'Sun', num: 16 },
];

const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
const HOUR_W = 62;
const ROW_H = 68;
const LABEL_W = 80;
const TIME_HEADER_H = 30;
const TIMELINE_START = 8;
const TOTAL_W = HOURS.length * HOUR_W; // 868

type IconName = React.ComponentProps<typeof Ionicons>['name'];
interface Block {
  start: number;
  end: number;
  title: string;
  desc: string;
  icon: IconName;
}
type DayKey = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
interface Friend {
  id: number;
  name: string;
  initials: string;
  color: string;
  schedule: Record<DayKey, Block[]>;
}

const FRIENDS: Friend[] = [
  {
    id: 1, name: 'Alex', initials: 'AL', color: '#4ECDC4',
    schedule: {
      Mon: [{ start: 9, end: 11, title: 'Study Group', desc: 'CS1332 review at Clough Commons — grab a seat and dive in!', icon: 'book-outline' }],
      Tue: [{ start: 10, end: 12, title: 'Design Class', desc: 'ARCH2400 at College of Architecture', icon: 'school-outline' }],
      Wed: [{ start: 15, end: 17, title: 'Coffee Chat', desc: "Tiff's Treats on 10th — catching up over espresso", icon: 'cafe-outline' }],
      Thu: [{ start: 14, end: 16, title: 'Rock Climbing', desc: 'REI Co-op bouldering — beginners totally welcome!', icon: 'fitness-outline' }],
      Fri: [{ start: 20, end: 22, title: 'Jazz Night', desc: 'Variety Playhouse — cool jazz vibes, $15 at door', icon: 'musical-notes-outline' }],
      Sat: [{ start: 10, end: 12, title: 'Yoga Class', desc: 'Sunrise flow at Piedmont Park — bring a mat!', icon: 'leaf-outline' }],
      Sun: [],
    },
  },
  {
    id: 2, name: 'Sarah', initials: 'SR', color: '#FF6B9D',
    schedule: {
      Mon: [{ start: 9, end: 11, title: 'MATH 2551', desc: 'Multivariable Calc at Skiles Building', icon: 'school-outline' }],
      Tue: [{ start: 13, end: 15, title: 'Book Club', desc: 'Bibliotheca Coffee — discussing fantasy novels', icon: 'book-outline' }],
      Wed: [{ start: 11, end: 13, title: 'Chem Lab', desc: 'CHEM 1212 lab at Boggs Building', icon: 'flask-outline' }],
      Thu: [{ start: 14, end: 16, title: 'Trivia Night', desc: "Manuel's Tavern weekly trivia — prizes for winners!", icon: 'help-circle-outline' }],
      Fri: [],
      Sat: [{ start: 13, end: 15, title: 'Farmers Market', desc: 'Piedmont Park Farmers Market — fresh everything', icon: 'leaf-outline' }],
      Sun: [{ start: 11, end: 13, title: 'Brunch', desc: "Murphy's on Virginia — bottomless brunch vibes", icon: 'restaurant-outline' }],
    },
  },
  {
    id: 3, name: 'Marcus', initials: 'MC', color: '#3B82F6',
    schedule: {
      Mon: [],
      Tue: [{ start: 10, end: 12, title: 'Study Session', desc: 'CRC group study room B — open to join!', icon: 'book-outline' }],
      Wed: [{ start: 14, end: 16, title: 'Photo Walk', desc: 'Krog Street Market photography tour', icon: 'camera-outline' }],
      Thu: [{ start: 19, end: 21, title: 'Board Games', desc: 'Joystick game bar — bring quarters!', icon: 'game-controller-outline' }],
      Fri: [{ start: 18, end: 20, title: 'Fox Theatre', desc: 'Live performance downtown — limited seats left', icon: 'musical-notes-outline' }],
      Sat: [],
      Sun: [{ start: 14, end: 16, title: 'HackGT Demo', desc: 'Final project demos at Clough Commons', icon: 'code-slash-outline' }],
    },
  },
  {
    id: 4, name: 'Jamie', initials: 'JM', color: '#F59E0B',
    schedule: {
      Mon: [{ start: 18, end: 19, title: 'Evening Yoga', desc: 'CRC yoga flow class — super chill', icon: 'leaf-outline' }],
      Tue: [],
      Wed: [{ start: 12, end: 14, title: 'Beltline Lunch', desc: 'Walking the Beltline from Ponce to Krog', icon: 'walk-outline' }],
      Thu: [],
      Fri: [{ start: 20, end: 22, title: 'Game Night', desc: 'House board games at 5th & Spring — BYOB', icon: 'game-controller-outline' }],
      Sat: [{ start: 15, end: 17, title: 'Stone Summit', desc: 'Bouldering at Stone Summit Westside', icon: 'fitness-outline' }],
      Sun: [],
    },
  },
  {
    id: 5, name: 'Riley', initials: 'RL', color: '#8B5CF6',
    schedule: {
      Mon: [{ start: 11, end: 14, title: 'BioChem Lab', desc: 'EBB building lab — long session today', icon: 'flask-outline' }],
      Tue: [{ start: 19, end: 21, title: 'Sci-Fi Book Club', desc: 'Little Shop of Stories — reading Dune', icon: 'book-outline' }],
      Wed: [],
      Thu: [{ start: 10, end: 12, title: 'Career Workshop', desc: 'Resume + interview prep at CRC', icon: 'briefcase-outline' }],
      Fri: [{ start: 20, end: 22, title: 'Jazz Night', desc: 'Variety Playhouse — going with Alex!', icon: 'musical-notes-outline' }],
      Sat: [{ start: 11, end: 14, title: 'Art Walk', desc: 'Castleberry Hill Art Stroll — galleries & street art', icon: 'color-palette-outline' }],
      Sun: [],
    },
  },
];

function fmtHour(h: number) {
  if (h === 12) return '12pm';
  return h > 12 ? `${h - 12}pm` : `${h}am`;
}

export default function FriendAvailabilityScreen() {
  const navigation = useNavigation();
  const [day, setDay] = useState<DayKey>('Thu');
  const [picked, setPicked] = useState<(Block & { friend: string; color: string }) | null>(null);
  const [joined, setJoined] = useState<string[]>([]);

  const handleJoin = (title: string) => {
    if (!joined.includes(title)) setJoined((p) => [...p, title]);
    setPicked(null);
  };

  const handleShare = () => {
    if (!picked) return;
    Share.share({
      message: `Hey! I'm joining "${picked.title}" — want to come? Check it out!`,
    }).catch(() => {});
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#1A1A2E" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Friend Availability</Text>
        <TouchableOpacity style={s.iconBtn}>
          <Ionicons name="person-add-outline" size={22} color="#1A1A2E" />
        </TouchableOpacity>
      </View>

      {/* Day selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.dayRow}
      >
        {DAYS.map((d) => (
          <TouchableOpacity
            key={d.label}
            style={[s.dayTab, day === d.label && s.dayTabActive]}
            onPress={() => setDay(d.label as DayKey)}
          >
            <Text style={[s.dayLabel, day === d.label && s.dayLabelActive]}>{d.label}</Text>
            <Text style={[s.dayNum, day === d.label && s.dayNumActive]}>{d.num}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Legend */}
      <View style={s.legendRow}>
        <View style={s.legendItem}>
          <View style={[s.legendSwatch, { backgroundColor: '#DCFCE7' }]} />
          <Text style={s.legendTxt}>Available</Text>
        </View>
        <View style={s.legendItem}>
          <View style={[s.legendSwatch, { backgroundColor: '#4ECDC4' }]} />
          <Text style={s.legendTxt}>Activity — tap to join</Text>
        </View>
        <Text style={s.legendDate}>Mar {DAYS.find((d) => d.label === day)?.num}, 2025</Text>
      </View>

      {/* Calendar body */}
      <View style={s.calBody}>
        {/* Left: friend labels (fixed) */}
        <View style={[s.labelsCol, { width: LABEL_W }]}>
          <View style={{ height: TIME_HEADER_H }} />
          {FRIENDS.map((f) => (
            <View key={f.id} style={[s.friendLabel, { height: ROW_H }]}>
              <View style={[s.avatar, { backgroundColor: f.color }]}>
                <Text style={s.avatarTxt}>{f.initials}</Text>
              </View>
              <Text style={s.friendName} numberOfLines={1}>{f.name}</Text>
            </View>
          ))}
        </View>

        {/* Right: scrollable timeline */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
          <View style={{ width: TOTAL_W }}>
            {/* Time header */}
            <View style={[s.timeHeader, { height: TIME_HEADER_H }]}>
              {HOURS.map((h) => (
                <View key={h} style={[s.timeCell, { width: HOUR_W }]}>
                  <Text style={s.timeTxt}>{fmtHour(h)}</Text>
                </View>
              ))}
            </View>

            {/* Friend rows */}
            {FRIENDS.map((f) => {
              const blocks = f.schedule[day] ?? [];
              const busySet = new Set<number>();
              blocks.forEach((b) => {
                for (let h = b.start; h < b.end; h++) busySet.add(h);
              });

              return (
                <View key={f.id} style={[s.timeRow, { height: ROW_H, width: TOTAL_W }]}>
                  {/* Background hour cells */}
                  {HOURS.map((h) => (
                    <View
                      key={h}
                      style={[
                        s.hourCell,
                        { width: HOUR_W },
                        !busySet.has(h) && s.hourFree,
                      ]}
                    />
                  ))}
                  {/* Event blocks */}
                  {blocks.map((b, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[
                        s.eventBlock,
                        {
                          left: (b.start - TIMELINE_START) * HOUR_W + 2,
                          width: (b.end - b.start) * HOUR_W - 4,
                          backgroundColor: f.color,
                        },
                      ]}
                      onPress={() =>
                        setPicked({ ...b, friend: f.name, color: f.color })
                      }
                      activeOpacity={0.85}
                    >
                      <Ionicons name={b.icon} size={13} color="rgba(255,255,255,0.9)" />
                      <Text style={s.blockTitle} numberOfLines={2}>{b.title}</Text>
                      {joined.includes(b.title) && (
                        <View style={s.joinedBadge}>
                          <Ionicons name="checkmark-circle" size={14} color="#fff" />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Activity detail sheet */}
      <Modal visible={!!picked} transparent animationType="slide" onRequestClose={() => setPicked(null)}>
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => setPicked(null)}>
          <View style={s.sheet}>
            {/* Colored header */}
            <View style={[s.sheetHeader, { backgroundColor: picked?.color ?? '#ccc' }]}>
              <View style={s.sheetHandle} />
              <View style={s.sheetHeaderRow}>
                <View style={s.sheetIconWrap}>
                  <Ionicons name={(picked?.icon ?? 'star') as IconName} size={26} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.sheetTitle}>{picked?.title}</Text>
                  <Text style={s.sheetFriend}>with {picked?.friend}</Text>
                </View>
              </View>
            </View>

            <View style={s.sheetBody}>
              <Text style={s.sheetDesc}>{picked?.desc}</Text>

              <View style={s.sheetMeta}>
                <Ionicons name="time-outline" size={15} color="#888" />
                <Text style={s.sheetMetaTxt}>
                  {picked ? `${fmtHour(picked.start)} – ${fmtHour(picked.end)}` : ''}
                </Text>
              </View>

              {joined.includes(picked?.title ?? '') ? (
                <View style={s.joinedRow}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={s.joinedTxt}>
                    You're going! {picked?.friend} has been notified.
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={[s.joinBtn, { backgroundColor: picked?.color }]}
                  onPress={() => handleJoin(picked?.title ?? '')}
                >
                  <Ionicons name="add-circle-outline" size={20} color="#fff" />
                  <Text style={s.joinBtnTxt}>Join {picked?.friend}</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={s.shareBtn} onPress={handleShare}>
                <Ionicons name="share-social-outline" size={18} color="#555" />
                <Text style={s.shareBtnTxt}>Share invite link with a personal message</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backBtn: { padding: 4 },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '800', color: '#1A1A2E', textAlign: 'center' },
  iconBtn: { padding: 4 },

  dayRow: { paddingHorizontal: 14, paddingVertical: 10, gap: 8 },
  dayTab: {
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#fff',
    minWidth: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  dayTabActive: { backgroundColor: '#1A1A2E' },
  dayLabel: { fontSize: 10, fontWeight: '700', color: '#aaa', textTransform: 'uppercase' },
  dayLabelActive: { color: '#888' },
  dayNum: { fontSize: 19, fontWeight: '700', color: '#1A1A2E', marginTop: 1 },
  dayNumActive: { color: '#fff' },

  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 14,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendSwatch: { width: 14, height: 14, borderRadius: 4 },
  legendTxt: { fontSize: 11, color: '#888', fontWeight: '500' },
  legendDate: { marginLeft: 'auto', fontSize: 11, fontWeight: '600', color: '#aaa' },

  calBody: { flex: 1, flexDirection: 'row' },

  labelsCol: {
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  friendLabel: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 4,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarTxt: { color: '#fff', fontWeight: '700', fontSize: 12 },
  friendName: { fontSize: 10, fontWeight: '600', color: '#555', textAlign: 'center' },

  timeHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  timeCell: { justifyContent: 'center', borderRightWidth: 1, borderRightColor: '#F3F4F6' },
  timeTxt: { fontSize: 10, color: '#bbb', fontWeight: '600', textAlign: 'center' },

  timeRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    position: 'relative',
  },
  hourCell: {
    borderRightWidth: 1,
    borderRightColor: '#F3F4F6',
    backgroundColor: '#FAFAFA',
  },
  hourFree: { backgroundColor: 'rgba(16,185,129,0.07)' },

  eventBlock: {
    position: 'absolute',
    top: 5,
    bottom: 5,
    borderRadius: 10,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    gap: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  blockTitle: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
  joinedBadge: { position: 'absolute', top: 4, right: 4 },

  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    overflow: 'hidden',
  },
  sheetHeader: { padding: 20, paddingTop: 12 },
  sheetHandle: {
    width: 38,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 14,
  },
  sheetHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  sheetIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetTitle: { fontSize: 20, fontWeight: '800', color: '#fff' },
  sheetFriend: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },

  sheetBody: { padding: 20 },
  sheetDesc: { fontSize: 15, color: '#444', lineHeight: 23 },
  sheetMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    marginBottom: 16,
  },
  sheetMetaTxt: { fontSize: 14, color: '#666' },

  joinedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#ECFDF5',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  joinedTxt: { fontSize: 14, color: '#065F46', fontWeight: '600', flex: 1 },

  joinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  joinBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 16 },

  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
  },
  shareBtnTxt: { fontSize: 14, fontWeight: '600', color: '#555' },
});
