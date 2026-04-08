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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// ─── Types ───────────────────────────────────────────────────────────────────

type EventItem = {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  friendsAttending: string[];
  color: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
};

// ─── Mock data ────────────────────────────────────────────────────────────────
// Task 1A target: Saturday afternoon with Alex + Jordan → Piedmont Park Picnic
// Task 1B target: Sunday morning with Taylor            → Sunday Morning Yoga

const MOCK_EVENTS: EventItem[] = [
  {
    id: 1,
    title: 'Piedmont Park Picnic',
    date: 'Saturday',
    startTime: '14:00',
    endTime: '16:30',
    location: 'Main Pavilion, Piedmont Park',
    friendsAttending: ['Alex', 'Jordan', 'Sam'],
    color: '#10B981',
    icon: 'sunny-outline',
  },
  {
    id: 2,
    title: 'Movie Night: Dune 2',
    date: 'Friday',
    startTime: '19:00',
    endTime: '21:30',
    location: 'Regal Cinemas on Ponce',
    friendsAttending: ['Taylor', 'Morgan'],
    color: '#8B5CF6',
    icon: 'film-outline',
  },
  {
    id: 3,
    title: 'Bouldering Session',
    date: 'Saturday',
    startTime: '10:00',
    endTime: '12:00',
    location: 'Stone Summit Westside',
    friendsAttending: ['Alex', 'Chris'],
    color: '#F59E0B',
    icon: 'fitness-outline',
  },
  {
    id: 4,
    title: 'Sunday Morning Yoga',
    date: 'Sunday',
    startTime: '09:00',
    endTime: '10:30',
    location: 'Piedmont Park East Lawn',
    friendsAttending: ['Taylor', 'Jordan'],
    color: '#EC4899',
    icon: 'leaf-outline',
  },
  {
    id: 5,
    title: 'GT Study Group',
    date: 'Monday',
    startTime: '15:00',
    endTime: '17:00',
    location: 'Clough Commons Rm 152',
    friendsAttending: ['Morgan', 'Alex', 'Sam'],
    color: '#3B82F6',
    icon: 'book-outline',
  },
  {
    id: 6,
    title: 'Trivia Night',
    date: 'Wednesday',
    startTime: '20:00',
    endTime: '22:00',
    location: "Manuel's Tavern",
    friendsAttending: ['Jordan', 'Chris', 'Morgan'],
    color: '#EF4444',
    icon: 'help-circle-outline',
  },
  {
    id: 7,
    title: 'Farmers Market',
    date: 'Saturday',
    startTime: '09:00',
    endTime: '11:00',
    location: 'Piedmont Park Entrance',
    friendsAttending: ['Sam', 'Taylor'],
    color: '#06B6D4',
    icon: 'storefront-outline',
  },
  {
    id: 8,
    title: 'Jazz Open Mic',
    date: 'Thursday',
    startTime: '18:00',
    endTime: '20:00',
    location: 'Variety Playhouse',
    friendsAttending: ['Morgan', 'Taylor', 'Alex'],
    color: '#F97316',
    icon: 'musical-notes-outline',
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAYS_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 9); // 9 AM – 10 PM
const HOUR_H = 66;
const DAY_W = 90;
const TIME_W = 54;
const DAY_HEADER_H = 38;
const GRID_H = HOURS.length * HOUR_H;

const FRIEND_COLORS: Record<string, string> = {
  Alex:   '#4ECDC4',
  Jordan: '#FF6B9D',
  Sam:    '#F59E0B',
  Taylor: '#8B5CF6',
  Morgan: '#3B82F6',
  Chris:  '#10B981',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseTime(t: string) {
  const [h, m] = t.split(':').map(Number);
  return h + m / 60;
}

function fmtTime(t: string) {
  const [h, m] = t.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hr = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hr}:${m.toString().padStart(2, '0')} ${suffix}`;
}

function fmtHour(h: number) {
  if (h === 12) return '12 PM';
  if (h > 12) return `${h - 12} PM`;
  return `${h} AM`;
}

// ─── Calendar view ───────────────────────────────────────────────────────────

function CalendarView({
  joined,
  onSelectEvent,
}: {
  joined: Set<number>;
  onSelectEvent: (e: EventItem) => void;
}) {
  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <View style={{ flexDirection: 'row' }}>
        {/* Fixed time-label column */}
        <View style={{ width: TIME_W }}>
          <View style={{ height: DAY_HEADER_H }} />
          {HOURS.map((h) => (
            <View key={h} style={[cal.timeCell, { height: HOUR_H }]}>
              <Text style={cal.timeTxt}>{fmtHour(h)}</Text>
            </View>
          ))}
        </View>

        {/* Horizontally scrollable day columns */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
          <View>
            {/* Day header row */}
            <View style={{ flexDirection: 'row', height: DAY_HEADER_H }}>
              {DAYS_SHORT.map((d, di) => (
                <View key={d} style={[cal.dayHeader, { width: DAY_W }]}>
                  <Text style={cal.dayHeaderTxt}>{d}</Text>
                  <Text style={cal.dayDateTxt}>{10 + di}</Text>
                </View>
              ))}
            </View>

            {/* Grid */}
            <View style={{ flexDirection: 'row' }}>
              {DAYS_FULL.map((dayFull, di) => {
                const dayEvents = MOCK_EVENTS.filter((e) => e.date === dayFull);
                return (
                  <View
                    key={dayFull}
                    style={[
                      cal.dayCol,
                      { width: DAY_W, height: GRID_H },
                      di > 0 && { borderLeftWidth: 1, borderLeftColor: '#E9ECEF' },
                    ]}
                  >
                    {/* Hour grid lines */}
                    {HOURS.map((_, hi) => (
                      <View
                        key={hi}
                        style={[
                          cal.hourLine,
                          { top: hi * HOUR_H },
                          hi % 2 === 0 && { backgroundColor: '#F3F4F6' },
                        ]}
                      />
                    ))}

                    {/* Event blocks */}
                    {dayEvents.map((ev) => {
                      const top = (parseTime(ev.startTime) - 9) * HOUR_H;
                      const height = Math.max(
                        (parseTime(ev.endTime) - parseTime(ev.startTime)) * HOUR_H - 4,
                        34
                      );
                      const isJoined = joined.has(ev.id);
                      return (
                        <TouchableOpacity
                          key={ev.id}
                          style={[
                            cal.eventBlock,
                            {
                              top: top + 2,
                              height,
                              backgroundColor: ev.color,
                              borderColor: isJoined ? '#fff' : 'transparent',
                              borderWidth: isJoined ? 2 : 0,
                            },
                          ]}
                          onPress={() => onSelectEvent(ev)}
                          activeOpacity={0.85}
                        >
                          {isJoined && (
                            <Ionicons
                              name="checkmark-circle"
                              size={12}
                              color="#fff"
                              style={{ marginBottom: 2 }}
                            />
                          )}
                          <Text style={cal.blockTitle} numberOfLines={2}>
                            {ev.title}
                          </Text>
                          <Text style={cal.blockSub}>
                            {ev.friendsAttending.length} friend
                            {ev.friendsAttending.length !== 1 ? 's' : ''}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
}

// ─── List view ────────────────────────────────────────────────────────────────

function ListView({
  joined,
  onJoin,
}: {
  joined: Set<number>;
  onJoin: (id: number) => void;
}) {
  const DAY_ORDER: Record<string, number> = {
    Monday: 0, Tuesday: 1, Wednesday: 2, Thursday: 3,
    Friday: 4, Saturday: 5, Sunday: 6,
  };
  const sorted = [...MOCK_EVENTS].sort(
    (a, b) =>
      DAY_ORDER[a.date] - DAY_ORDER[b.date] ||
      parseTime(a.startTime) - parseTime(b.startTime)
  );

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={lv.scroll}
      showsVerticalScrollIndicator={false}
    >
      {sorted.map((ev) => {
        const isJoined = joined.has(ev.id);
        return (
          <View
            key={ev.id}
            style={[lv.card, isJoined && { borderColor: ev.color, borderWidth: 2 }]}
          >
            {/* Color bar */}
            <View style={[lv.colorBar, { backgroundColor: ev.color }]} />

            <View style={lv.cardBody}>
              {/* Title row */}
              <View style={lv.titleRow}>
                <View style={[lv.iconWrap, { backgroundColor: ev.color + '22' }]}>
                  <Ionicons name={ev.icon} size={20} color={ev.color} />
                </View>
                <Text style={lv.title} numberOfLines={1}>{ev.title}</Text>
                {isJoined && (
                  <View style={[lv.joinedBadge, { backgroundColor: ev.color + '22' }]}>
                    <Ionicons name="checkmark-circle" size={14} color={ev.color} />
                    <Text style={[lv.joinedBadgeTxt, { color: ev.color }]}>Joined</Text>
                  </View>
                )}
              </View>

              {/* Meta */}
              <View style={lv.metaRow}>
                <Ionicons name="calendar-outline" size={13} color="#888" />
                <Text style={lv.metaTxt}>{ev.date}</Text>
                <Ionicons name="time-outline" size={13} color="#888" style={{ marginLeft: 10 }} />
                <Text style={lv.metaTxt}>{fmtTime(ev.startTime)} – {fmtTime(ev.endTime)}</Text>
              </View>
              <View style={lv.metaRow}>
                <Ionicons name="location-outline" size={13} color="#888" />
                <Text style={lv.metaTxt}>{ev.location}</Text>
              </View>

              {/* Friends going */}
              <View style={lv.friendsSection}>
                <Text style={lv.friendsLabel}>Friends Going:</Text>
                <View style={lv.pillRow}>
                  {ev.friendsAttending.map((f) => (
                    <View
                      key={f}
                      style={[
                        lv.pill,
                        { backgroundColor: (FRIEND_COLORS[f] ?? '#888') + '22' },
                      ]}
                    >
                      <View
                        style={[
                          lv.pillDot,
                          { backgroundColor: FRIEND_COLORS[f] ?? '#888' },
                        ]}
                      />
                      <Text
                        style={[
                          lv.pillTxt,
                          { color: FRIEND_COLORS[f] ?? '#888' },
                        ]}
                      >
                        {f}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Join button */}
              <TouchableOpacity
                style={[
                  lv.joinBtn,
                  isJoined
                    ? { backgroundColor: ev.color + '22' }
                    : { backgroundColor: ev.color },
                ]}
                onPress={() => !isJoined && onJoin(ev.id)}
                activeOpacity={isJoined ? 1 : 0.8}
              >
                <Ionicons
                  name={isJoined ? 'checkmark-circle' : 'add-circle-outline'}
                  size={18}
                  color={isJoined ? ev.color : '#fff'}
                />
                <Text
                  style={[
                    lv.joinBtnTxt,
                    isJoined && { color: ev.color },
                  ]}
                >
                  {isJoined ? 'Joined!' : 'Join Event'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

// ─── Event detail modal ───────────────────────────────────────────────────────

function EventModal({
  event,
  joined,
  onJoin,
  onClose,
}: {
  event: EventItem | null;
  joined: Set<number>;
  onJoin: (id: number) => void;
  onClose: () => void;
}) {
  if (!event) return null;
  const isJoined = joined.has(event.id);

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={md.overlay} activeOpacity={1} onPress={onClose}>
        <View style={md.sheet}>
          {/* Header */}
          <View style={[md.sheetHeader, { backgroundColor: event.color }]}>
            <View style={md.handle} />
            <View style={md.headerRow}>
              <View style={md.headerIcon}>
                <Ionicons name={event.icon} size={26} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={md.headerTitle}>{event.title}</Text>
                <Text style={md.headerDay}>{event.date}</Text>
              </View>
              {isJoined && (
                <View style={md.joinedPill}>
                  <Ionicons name="checkmark-circle" size={14} color="#fff" />
                  <Text style={md.joinedPillTxt}>Joined</Text>
                </View>
              )}
            </View>
          </View>

          {/* Body */}
          <View style={md.body}>
            <View style={md.metaRow}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={md.metaTxt}>
                {fmtTime(event.startTime)} – {fmtTime(event.endTime)}
              </Text>
            </View>
            <View style={md.metaRow}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={md.metaTxt}>{event.location}</Text>
            </View>

            <Text style={md.friendsLabel}>Friends Attending</Text>
            <View style={md.friendsList}>
              {event.friendsAttending.map((f) => (
                <View key={f} style={md.friendRow}>
                  <View
                    style={[
                      md.friendAvatar,
                      { backgroundColor: FRIEND_COLORS[f] ?? '#888' },
                    ]}
                  >
                    <Text style={md.friendInitial}>{f[0]}</Text>
                  </View>
                  <Text style={md.friendName}>{f}</Text>
                  <Ionicons name="checkmark-circle" size={16} color={FRIEND_COLORS[f] ?? '#888'} />
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={[
                md.joinBtn,
                isJoined
                  ? { backgroundColor: event.color + '22' }
                  : { backgroundColor: event.color },
              ]}
              onPress={() => {
                if (!isJoined) {
                  onJoin(event.id);
                }
              }}
              activeOpacity={isJoined ? 1 : 0.8}
            >
              <Ionicons
                name={isJoined ? 'checkmark-circle' : 'add-circle-outline'}
                size={20}
                color={isJoined ? event.color : '#fff'}
              />
              <Text style={[md.joinBtnTxt, isJoined && { color: event.color }]}>
                {isJoined ? 'You\'re Going!' : 'Join Event'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={md.closeBtn} onPress={onClose}>
              <Text style={md.closeBtnTxt}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function FriendAvailabilityScreen() {
  const navigation = useNavigation();
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [joined, setJoined] = useState<Set<number>>(new Set());
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const handleJoin = (id: number) => {
    setJoined((prev) => new Set([...prev, id]));
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#1A1A2E" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Friend Events</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Toggle */}
      <View style={s.toggleWrap}>
        <View style={s.segmented}>
          <TouchableOpacity
            style={[s.segBtn, view === 'calendar' && s.segActive]}
            onPress={() => setView('calendar')}
          >
            <Ionicons
              name="calendar-outline"
              size={15}
              color={view === 'calendar' ? '#1A1A2E' : '#888'}
            />
            <Text style={[s.segTxt, view === 'calendar' && s.segTxtActive]}>
              Calendar View
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.segBtn, view === 'list' && s.segActive]}
            onPress={() => setView('list')}
          >
            <Ionicons
              name="list-outline"
              size={15}
              color={view === 'list' ? '#1A1A2E' : '#888'}
            />
            <Text style={[s.segTxt, view === 'list' && s.segTxtActive]}>
              List View
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {view === 'calendar' ? (
        <CalendarView joined={joined} onSelectEvent={setSelectedEvent} />
      ) : (
        <ListView joined={joined} onJoin={handleJoin} />
      )}

      {/* Modal */}
      <EventModal
        event={selectedEvent}
        joined={joined}
        onJoin={handleJoin}
        onClose={() => setSelectedEvent(null)}
      />
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A2E' },
  toggleWrap: { paddingHorizontal: 16, paddingBottom: 10 },
  segmented: {
    flexDirection: 'row',
    backgroundColor: '#E9ECEF',
    borderRadius: 14,
    padding: 4,
  },
  segBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 11,
  },
  segActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  segTxt: { fontSize: 14, fontWeight: '600', color: '#888' },
  segTxtActive: { color: '#1A1A2E', fontWeight: '700' },
});

const cal = StyleSheet.create({
  timeCell: {
    width: TIME_W,
    paddingTop: 4,
    paddingRight: 6,
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  timeTxt: { fontSize: 10, color: '#bbb', fontWeight: '600' },
  dayHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    backgroundColor: '#fff',
    gap: 1,
  },
  dayHeaderTxt: { fontSize: 11, fontWeight: '700', color: '#888', textTransform: 'uppercase' },
  dayDateTxt: { fontSize: 17, fontWeight: '800', color: '#1A1A2E' },
  dayCol: { position: 'relative' },
  hourLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: HOUR_H,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  eventBlock: {
    position: 'absolute',
    left: 3,
    right: 3,
    borderRadius: 8,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  blockTitle: { color: '#fff', fontSize: 10, fontWeight: '700', textAlign: 'center' },
  blockSub: { color: 'rgba(255,255,255,0.85)', fontSize: 9, marginTop: 2 },
});

const lv = StyleSheet.create({
  scroll: { paddingHorizontal: 16, paddingTop: 4 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: 14,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  colorBar: { width: 5 },
  cardBody: { flex: 1, padding: 14 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { flex: 1, fontSize: 16, fontWeight: '700', color: '#1A1A2E' },
  joinedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  joinedBadgeTxt: { fontSize: 11, fontWeight: '700' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4 },
  metaTxt: { fontSize: 12, color: '#666' },
  friendsSection: { marginTop: 10, marginBottom: 12 },
  friendsLabel: { fontSize: 12, fontWeight: '700', color: '#888', marginBottom: 6 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  pillDot: { width: 7, height: 7, borderRadius: 4 },
  pillTxt: { fontSize: 12, fontWeight: '700' },
  joinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 11,
    borderRadius: 12,
  },
  joinBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 15 },
});

const md = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    overflow: 'hidden',
  },
  sheetHeader: { padding: 20, paddingTop: 14 },
  handle: {
    width: 38,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  headerIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#fff' },
  headerDay: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  joinedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  joinedPillTxt: { color: '#fff', fontWeight: '700', fontSize: 12 },
  body: { padding: 20 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  metaTxt: { fontSize: 15, color: '#444' },
  friendsLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#888',
    marginTop: 8,
    marginBottom: 10,
  },
  friendsList: { gap: 10, marginBottom: 20 },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8F9FA',
    padding: 10,
    borderRadius: 12,
  },
  friendAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendInitial: { color: '#fff', fontWeight: '800', fontSize: 15 },
  friendName: { flex: 1, fontSize: 15, fontWeight: '600', color: '#333' },
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
  closeBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
  },
  closeBtnTxt: { fontSize: 15, fontWeight: '600', color: '#666' },
});
