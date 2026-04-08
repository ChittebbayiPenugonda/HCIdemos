import React, { useState, useMemo } from 'react';
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
import {
  ALL_EVENTS,
  FilterState,
  EMPTY_FILTER,
  FRIEND_COLORS,
  CATEGORY_COLORS,
  applyFilters,
  countActiveFilters,
  EventItem,
} from '../../data/events';
import FilterModal from '../../components/FilterModal';
import EventDetailModal from '../../components/EventDetailModal';

const TABS = ['All', 'Personal', 'Friends'];

export default function EventFeedScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTER);
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [bookedIds, setBookedIds] = useState<Set<number>>(new Set());

  const filtered = useMemo(() => {
    let results = applyFilters(ALL_EVENTS, filters, search);
    if (activeTab === 'Personal') results = results.filter((e) => e.type === 'Personal');
    if (activeTab === 'Friends') results = results.filter((e) => e.friendsAttending.length > 0);
    return results;
  }, [filters, search, activeTab]);

  const filterCount = countActiveFilters(filters);

  // Build active filter chips
  const chips: { label: string; clear: () => void }[] = [];
  if (filters.maxDistance !== null)
    chips.push({ label: `< ${filters.maxDistance} mi`, clear: () => setFilters((f) => ({ ...f, maxDistance: null })) });
  const dateChipLabel = [filters.dateMonth, filters.dateDay, filters.dateYear].filter(Boolean).join('/');
  if (dateChipLabel)
    chips.push({ label: dateChipLabel, clear: () => setFilters((f) => ({ ...f, dateMonth: '', dateDay: '', dateYear: '' })) });
  if (filters.type)
    chips.push({ label: filters.type, clear: () => setFilters((f) => ({ ...f, type: null })) });
  if (filters.outsideComfortZone)
    chips.push({ label: '⚡ Comfort Zone', clear: () => setFilters((f) => ({ ...f, outsideComfortZone: false })) });
  if (filters.neighborhood)
    chips.push({ label: filters.neighborhood, clear: () => setFilters((f) => ({ ...f, neighborhood: null })) });
  filters.categories.forEach((cat) =>
    chips.push({ label: cat, clear: () => setFilters((f) => ({ ...f, categories: f.categories.filter((c) => c !== cat) })) })
  );

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.headerBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#1A1A2E" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Discover</Text>
        <TouchableOpacity style={s.headerBtn}>
          <Ionicons name="notifications-outline" size={23} color="#1A1A2E" />
          <View style={s.notifDot} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={s.searchWrap}>
        <Ionicons name="search-outline" size={18} color="#aaa" />
        <TextInput
          style={s.searchInput}
          placeholder="Search activities, neighborhoods, friends…"
          placeholderTextColor="#aaa"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color="#ccc" />
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs + Filters */}
      <View style={s.tabRow}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t}
            style={[s.tab, activeTab === t && s.tabActive]}
            onPress={() => setActiveTab(t)}
          >
            <Text style={[s.tabTxt, activeTab === t && s.tabTxtActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={s.filtersBtn} onPress={() => setFilterVisible(true)}>
          <Ionicons name="options-outline" size={15} color={filterCount > 0 ? '#fff' : '#555'} />
          <Text style={[s.filtersBtnTxt, filterCount > 0 && { color: '#fff' }]}>Filters</Text>
          {filterCount > 0 && (
            <View style={s.filterBadge}>
              <Text style={s.filterBadgeTxt}>{filterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Active filter chips */}
      {chips.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.chipRow}
        >
          {chips.map((c, i) => (
            <TouchableOpacity key={i} style={s.chip} onPress={c.clear}>
              <Text style={s.chipTxt}>{c.label}</Text>
              <Ionicons name="close" size={12} color="#1A1A2E" />
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={s.clearAllChip} onPress={() => setFilters(EMPTY_FILTER)}>
            <Text style={s.clearAllTxt}>Clear all</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Feed/Map toggle */}
      <View style={s.toggleRow}>
        <View style={s.segmented}>
          <View style={[s.segBtn, s.segActive]}>
            <Text style={s.segTxtActive}>Feed</Text>
          </View>
          <TouchableOpacity
            style={s.segBtn}
            onPress={() => navigation.navigate('EventMap' as never)}
          >
            <Text style={s.segTxt}>Map</Text>
          </TouchableOpacity>
        </View>
        <Text style={s.resultCount}>
          {filtered.length} of {ALL_EVENTS.length} events
        </Text>
      </View>

      {/* Event list */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={s.sectionLabel}>
          {filterCount > 0 || search ? 'Filtered Results' : 'Personalized for you'}
        </Text>

        {filtered.length === 0 ? (
          <View style={s.empty}>
            <Ionicons name="search-outline" size={48} color="#ddd" />
            <Text style={s.emptyTitle}>No events match</Text>
            <Text style={s.emptySub}>Try adjusting your filters or search</Text>
            <TouchableOpacity style={s.emptyBtn} onPress={() => { setFilters(EMPTY_FILTER); setSearch(''); }}>
              <Text style={s.emptyBtnTxt}>Clear Filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filtered.map((ev) => (
            <EventCard
              key={ev.id}
              event={ev}
              booked={bookedIds.has(ev.id)}
              onPress={() => setSelectedEvent(ev)}
            />
          ))
        )}
        <View style={{ height: 24 }} />
      </ScrollView>

      <FilterModal
        visible={filterVisible}
        filters={filters}
        onApply={setFilters}
        onClose={() => setFilterVisible(false)}
      />
      <EventDetailModal
        event={selectedEvent}
        visible={!!selectedEvent}
        isBooked={selectedEvent ? bookedIds.has(selectedEvent.id) : false}
        onBook={(id) => setBookedIds((p) => new Set([...p, id]))}
        onClose={() => setSelectedEvent(null)}
      />
    </SafeAreaView>
  );
}

// ─── Event Card ───────────────────────────────────────────────────────────────

function EventCard({ event: ev, booked, onPress }: { event: EventItem; booked: boolean; onPress: () => void }) {
  const catColor = CATEGORY_COLORS[ev.category] ?? ev.color;
  return (
    <TouchableOpacity style={[s.card, booked && { borderColor: ev.color, borderWidth: 2 }]} onPress={onPress} activeOpacity={0.92}>
      {/* Image area */}
      <View style={[s.imgArea, { backgroundColor: ev.color }]}>
        {/* OOC badge */}
        {ev.outsideComfortZone && (
          <View style={s.oocBadge}>
            <Ionicons name="flash" size={11} color="#F97316" />
            <Text style={s.oocBadgeTxt}>Outside Comfort Zone</Text>
          </View>
        )}
        {/* Category tag top-left */}
        <View style={s.catTagWrap}>
          <View style={[s.catTag, { backgroundColor: catColor + 'CC' }]}>
            <Text style={s.catTagTxt}>{ev.category}</Text>
          </View>
        </View>
        {/* Center icon */}
        <Ionicons name={ev.icon} size={54} color="rgba(255,255,255,0.22)" />
        {/* Friend avatars */}
        {ev.friendsAttending.length > 0 && (
          <View style={s.avatarRow}>
            {ev.friendsAttending.slice(0, 3).map((f, i) => (
              <View key={f} style={[s.avatar, { backgroundColor: FRIEND_COLORS[f] ?? '#888', left: i * 19 }]} />
            ))}
            <Text style={[s.avatarLabel, { left: Math.min(ev.friendsAttending.length, 3) * 19 + 5 }]}>
              {ev.friendsAttending.length === 1 ? ev.friendsAttending[0] : `${ev.friendsAttending.length} friends`}
            </Text>
          </View>
        )}
        {booked && (
          <View style={s.bookedOverlay}>
            <Ionicons name="checkmark-circle" size={18} color="#fff" />
            <Text style={s.bookedTxt}>Booked</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={s.info}>
        <View style={s.infoTop}>
          <Text style={s.cardTitle} numberOfLines={1}>{ev.title}</Text>
          <Text style={[s.price, ev.price === 'Free' && { color: '#10B981' }]}>{ev.price}</Text>
        </View>
        <View style={s.metaRow}>
          <Ionicons name="location-outline" size={12} color="#999" />
          <Text style={s.meta}> {ev.location} · {ev.distance} mi</Text>
        </View>
        <View style={s.infoBottom}>
          <View style={s.metaRow}>
            <Ionicons name="people-outline" size={12} color="#999" />
            <Text style={s.meta}> {ev.attending} attending</Text>
          </View>
          <View style={s.metaRow}>
            <Ionicons name="calendar-outline" size={12} color="#999" />
            <Text style={s.meta}> {ev.dateLabel} · {ev.startTime}</Text>
          </View>
        </View>
        <View style={[s.tapHint]}>
          <Text style={s.tapHintTxt}>Tap to view details & book →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerBtn: { padding: 4, position: 'relative' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#1A1A2E' },
  notifDot: {
    position: 'absolute', top: 3, right: 3,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#EF4444', borderWidth: 1.5, borderColor: '#F8F9FA',
  },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#333' },

  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16, paddingVertical: 7,
    borderRadius: 20, backgroundColor: '#fff',
    borderWidth: 1.5, borderColor: '#E5E7EB',
  },
  tabActive: { backgroundColor: '#1A1A2E', borderColor: '#1A1A2E' },
  tabTxt: { fontSize: 13, fontWeight: '600', color: '#555' },
  tabTxtActive: { color: '#fff' },
  filtersBtn: {
    flexDirection: 'row', alignItems: 'center',
    marginLeft: 'auto', backgroundColor: '#fff',
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 20, borderWidth: 1.5, borderColor: '#E5E7EB',
    gap: 5,
  },
  filtersBtnTxt: { fontSize: 13, fontWeight: '600', color: '#555' },
  filterBadge: {
    backgroundColor: '#EF4444',
    width: 18, height: 18, borderRadius: 9,
    justifyContent: 'center', alignItems: 'center', marginLeft: 2,
  },
  filterBadgeTxt: { color: '#fff', fontSize: 10, fontWeight: '800' },

  chipRow: { paddingHorizontal: 16, paddingBottom: 8, gap: 7 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#1A1A2E',
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20,
  },
  chipTxt: { fontSize: 12, fontWeight: '700', color: '#fff' },
  clearAllChip: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1.5, borderColor: '#E5E7EB',
  },
  clearAllTxt: { fontSize: 12, fontWeight: '600', color: '#888' },

  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 12,
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: '#E9ECEF',
    borderRadius: 12, padding: 3,
  },
  segBtn: { paddingHorizontal: 22, paddingVertical: 7, borderRadius: 10 },
  segActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 3, elevation: 2,
  },
  segTxt: { fontSize: 14, fontWeight: '600', color: '#888' },
  segTxtActive: { fontSize: 14, fontWeight: '700', color: '#1A1A2E' },
  resultCount: { fontSize: 12, color: '#888', fontWeight: '500' },

  sectionLabel: {
    fontSize: 18, fontWeight: '700', color: '#1A1A2E',
    paddingHorizontal: 16, paddingTop: 4, paddingBottom: 12,
  },

  empty: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginTop: 16 },
  emptySub: { fontSize: 14, color: '#888', marginTop: 6, textAlign: 'center' },
  emptyBtn: {
    marginTop: 20, backgroundColor: '#1A1A2E',
    paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14,
  },
  emptyBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 15 },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16, marginBottom: 16,
    borderRadius: 20, overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.09, shadowRadius: 10, elevation: 4,
  },
  imgArea: {
    height: 178, justifyContent: 'center', alignItems: 'center',
    position: 'relative',
  },
  catTagWrap: { position: 'absolute', top: 12, left: 12 },
  catTag: {
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  catTagTxt: { fontSize: 11, fontWeight: '700', color: '#fff' },
  oocBadge: {
    position: 'absolute', top: 12, right: 12,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 9, paddingVertical: 5, borderRadius: 20,
  },
  oocBadgeTxt: { fontSize: 10, fontWeight: '800', color: '#F97316' },
  avatarRow: {
    position: 'absolute', bottom: 12, left: 12,
    flexDirection: 'row', alignItems: 'center', height: 28,
  },
  avatar: {
    width: 28, height: 28, borderRadius: 14,
    position: 'absolute', borderWidth: 2, borderColor: '#fff',
  },
  avatarLabel: {
    position: 'absolute',
    fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.95)',
  },
  bookedOverlay: {
    position: 'absolute', top: 12, right: 12,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  bookedTxt: { color: '#fff', fontSize: 12, fontWeight: '700' },

  info: { padding: 14 },
  infoTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 5,
  },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#1A1A2E', flex: 1, marginRight: 8 },
  price: { fontSize: 15, fontWeight: '700', color: '#EF4444' },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  meta: { fontSize: 12, color: '#888' },
  infoBottom: { flexDirection: 'row', gap: 14, marginTop: 2 },
  tapHint: { marginTop: 8, borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 7 },
  tapHintTxt: { fontSize: 11, color: '#bbb', fontWeight: '500' },
});
