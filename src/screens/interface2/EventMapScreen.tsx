import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  ALL_EVENTS,
  FilterState,
  EMPTY_FILTER,
  CATEGORY_COLORS,
  applyFilters,
  countActiveFilters,
  EventItem,
} from '../../data/events';
import FilterModal from '../../components/FilterModal';
import EventDetailModal from '../../components/EventDetailModal';

const TABS = ['All', 'Personal', 'Friends'];

export default function EventMapScreen() {
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

  // Active filter chips
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

  // Unique categories in filtered results for legend
  const legendCategories = [...new Set(filtered.map((e) => e.category))].slice(0, 5);

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
        <TouchableOpacity
          style={[s.filtersBtn, filterCount > 0 && { backgroundColor: '#1A1A2E', borderColor: '#1A1A2E' }]}
          onPress={() => setFilterVisible(true)}
        >
          <Ionicons name="options-outline" size={15} color={filterCount > 0 ? '#fff' : '#555'} />
          <Text style={[s.filtersBtnTxt, filterCount > 0 && { color: '#fff' }]}>Filters</Text>
          {filterCount > 0 && (
            <View style={s.filterBadge}>
              <Text style={s.filterBadgeTxt}>{filterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Active chips */}
      {chips.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.chipRow}
        >
          {chips.map((c, i) => (
            <TouchableOpacity key={i} style={s.chip} onPress={c.clear}>
              <Text style={s.chipTxt}>{c.label}</Text>
              <Ionicons name="close" size={12} color="#fff" />
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
          <TouchableOpacity
            style={s.segBtn}
            onPress={() => navigation.navigate('EventFeed' as never)}
          >
            <Text style={s.segTxt}>Feed</Text>
          </TouchableOpacity>
          <View style={[s.segBtn, s.segActive]}>
            <Text style={s.segTxtActive}>Map</Text>
          </View>
        </View>
        <Text style={s.resultCount}>
          {filtered.length} of {ALL_EVENTS.length} events
        </Text>
      </View>

      {/* MAP */}
      <View style={s.mapOuter}>
        {/* Decorative map background */}
        <View style={StyleSheet.absoluteFill}>
          <View style={[s.mapBg, StyleSheet.absoluteFill]}>
            <View style={[s.road, s.roadH, { top: '35%' }]} />
            <View style={[s.road, s.roadH, { top: '55%' }]} />
            <View style={[s.road, s.roadH, { top: '18%' }]} />
            <View style={[s.road, s.roadH, { top: '73%' }]} />
            <View style={[s.road, s.roadV, { left: '28%' }]} />
            <View style={[s.road, s.roadV, { left: '55%' }]} />
            <View style={[s.road, s.roadV, { left: '75%' }]} />
            <View style={[s.road, { position: 'absolute', width: 8, height: '75%', top: '12%', left: '42%', transform: [{ rotate: '20deg' }] }]} />
            <View style={[s.park, { top: '36%', left: '38%', width: 88, height: 56 }]} />
            <View style={[s.park, { top: '10%', left: '58%', width: 66, height: 44 }]} />
            <View style={[s.park, { top: '56%', left: '0%', width: 58, height: 48 }]} />
            <View style={[s.bldg, { top: '5%', left: '4%',  width: 54, height: 44 }]} />
            <View style={[s.bldg, { top: '20%', left: '5%', width: 36, height: 55 }]} />
            <View style={[s.bldg, { top: '38%', left: '58%', width: 60, height: 42 }]} />
            <View style={[s.bldg, { top: '56%', left: '56%', width: 54, height: 46 }]} />
            <View style={[s.bldg, { top: '18%', left: '77%', width: 42, height: 38 }]} />
            <View style={[s.bldg, { top: '74%', left: '58%', width: 62, height: 40 }]} />
            <View style={s.campusOverlay} />
          </View>
        </View>

        {/* Dynamic markers */}
        {filtered.map((ev) => {
          const color = CATEGORY_COLORS[ev.category] ?? ev.color;
          const isSelected = selectedEvent?.id === ev.id;
          return (
            <TouchableOpacity
              key={ev.id}
              style={[
                s.markerWrap,
                { left: `${ev.mapX}%` as any, top: `${ev.mapY}%` as any },
              ]}
              onPress={() => setSelectedEvent(ev)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  s.marker,
                  { backgroundColor: color },
                  isSelected && s.markerSelected,
                  bookedIds.has(ev.id) && s.markerBooked,
                ]}
              >
                {ev.outsideComfortZone ? (
                  <Ionicons name="flash" size={12} color="#fff" />
                ) : bookedIds.has(ev.id) ? (
                  <Ionicons name="checkmark" size={12} color="#fff" />
                ) : (
                  <View style={s.markerDot} />
                )}
              </View>
              <View style={[s.markerTail, { borderTopColor: color }]} />
              {isSelected && (
                <View style={[s.markerLabel, { backgroundColor: color }]}>
                  <Text style={s.markerLabelTxt} numberOfLines={1}>{ev.title}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Empty state on map */}
        {filtered.length === 0 && (
          <View style={s.mapEmpty}>
            <Ionicons name="search-outline" size={36} color="#aaa" />
            <Text style={s.mapEmptyTxt}>No events match your filters</Text>
            <TouchableOpacity style={s.mapEmptyBtn} onPress={() => { setFilters(EMPTY_FILTER); setSearch(''); }}>
              <Text style={s.mapEmptyBtnTxt}>Clear Filters</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Legend */}
        {legendCategories.length > 0 && (
          <View style={s.legend}>
            {legendCategories.map((cat) => (
              <View key={cat} style={s.legendRow}>
                <View style={[s.legendDot, { backgroundColor: CATEGORY_COLORS[cat] ?? '#888' }]} />
                <Text style={s.legendTxt}>{cat}</Text>
              </View>
            ))}
            {filtered.some((e) => e.outsideComfortZone) && (
              <View style={s.legendRow}>
                <Ionicons name="flash" size={10} color="#F97316" />
                <Text style={s.legendTxt}>Comfort Zone</Text>
              </View>
            )}
          </View>
        )}

        {/* Location chip */}
        <View style={s.locChip}>
          <Ionicons name="location" size={12} color="#555" />
          <Text style={s.locChipTxt}>Atlanta & Georgia Tech</Text>
        </View>

        {/* Result count badge on map */}
        <View style={s.countBadge}>
          <Text style={s.countBadgeTxt}>{filtered.length} events</Text>
        </View>

        {/* Zoom buttons */}
        <View style={s.zoomCol}>
          <TouchableOpacity style={s.zoomBtn}><Text style={s.zoomTxt}>+</Text></TouchableOpacity>
          <TouchableOpacity style={s.zoomBtn}><Text style={s.zoomTxt}>−</Text></TouchableOpacity>
        </View>

        {/* Selected event quick-card */}
        {selectedEvent && (
          <View style={s.detailCard}>
            <View style={[s.detailBar, { backgroundColor: CATEGORY_COLORS[selectedEvent.category] ?? selectedEvent.color }]} />
            <View style={s.detailBody}>
              <View style={s.detailTop}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <Text style={s.detailTitle}>{selectedEvent.title}</Text>
                    {selectedEvent.outsideComfortZone && (
                      <Ionicons name="flash" size={14} color="#F97316" />
                    )}
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Ionicons name="location-outline" size={11} color="#888" />
                    <Text style={s.detailLoc}>{selectedEvent.distance} mi · {selectedEvent.neighborhood}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 }}>
                    <Ionicons name="calendar-outline" size={11} color="#888" />
                    <Text style={s.detailLoc}>{selectedEvent.dateLabel} · {selectedEvent.startTime}</Text>
                  </View>
                  {selectedEvent.friendsAttending.length > 0 && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 }}>
                      <Ionicons name="people-outline" size={11} color="#888" />
                      <Text style={s.detailLoc}>{selectedEvent.friendsAttending.join(', ')} going</Text>
                    </View>
                  )}
                </View>
                <Text style={[s.detailPrice, selectedEvent.price === 'Free' && { color: '#10B981' }]}>
                  {selectedEvent.price}
                </Text>
              </View>
              <View style={s.detailActions}>
                <TouchableOpacity
                  style={[s.viewBtn, { backgroundColor: CATEGORY_COLORS[selectedEvent.category] ?? selectedEvent.color }]}
                  onPress={() => setSelectedEvent(selectedEvent)}
                >
                  <Text style={s.viewBtnTxt}>View & Book</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.closeBtn} onPress={() => setSelectedEvent(null)}>
                  <Ionicons name="close" size={18} color="#888" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>

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

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },

  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 10,
  },
  headerBtn: { padding: 4, position: 'relative' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#1A1A2E' },
  notifDot: {
    position: 'absolute', top: 3, right: 3,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#EF4444', borderWidth: 1.5, borderColor: '#F8F9FA',
  },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', marginHorizontal: 16,
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11,
    gap: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#333' },

  tabRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10, gap: 8,
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
    borderRadius: 20, borderWidth: 1.5, borderColor: '#E5E7EB', gap: 5,
  },
  filtersBtnTxt: { fontSize: 13, fontWeight: '600', color: '#555' },
  filterBadge: {
    backgroundColor: '#EF4444', width: 18, height: 18,
    borderRadius: 9, justifyContent: 'center', alignItems: 'center', marginLeft: 2,
  },
  filterBadgeTxt: { color: '#fff', fontSize: 10, fontWeight: '800' },

  chipRow: { paddingHorizontal: 16, paddingBottom: 8, gap: 7 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#1A1A2E', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  chipTxt: { fontSize: 12, fontWeight: '700', color: '#fff' },
  clearAllChip: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1.5, borderColor: '#E5E7EB',
  },
  clearAllTxt: { fontSize: 12, fontWeight: '600', color: '#888' },

  toggleRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingBottom: 8, gap: 12,
  },
  segmented: {
    flexDirection: 'row', backgroundColor: '#E9ECEF',
    borderRadius: 12, padding: 3,
  },
  segBtn: { paddingHorizontal: 22, paddingVertical: 7, borderRadius: 10 },
  segActive: {
    backgroundColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 3, elevation: 2,
  },
  segTxt: { fontSize: 14, fontWeight: '600', color: '#888' },
  segTxtActive: { fontSize: 14, fontWeight: '700', color: '#1A1A2E' },
  resultCount: { fontSize: 12, color: '#888', fontWeight: '500' },

  // MAP
  mapOuter: { flex: 1, position: 'relative' },
  mapBg: { backgroundColor: '#E8E3D8' },
  road: { position: 'absolute', backgroundColor: '#fff' },
  roadH: { left: 0, right: 0, height: 9 },
  roadV: { top: 0, bottom: 0, width: 9 },
  park: { position: 'absolute', backgroundColor: '#C5DDB8', borderRadius: 6 },
  bldg: { position: 'absolute', backgroundColor: '#CFC7B8', borderRadius: 3 },
  campusOverlay: {
    position: 'absolute', top: '16%', left: '6%', width: '32%', height: '36%',
    borderWidth: 2, borderColor: '#3B82F6', borderStyle: 'dashed',
    borderRadius: 12, backgroundColor: 'rgba(59,130,246,0.04)',
  },

  markerWrap: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -17 }, { translateY: -44 }],
    zIndex: 10,
  },
  marker: {
    width: 34, height: 34, borderRadius: 17,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2.5, borderColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 4, elevation: 5,
  },
  markerSelected: { transform: [{ scale: 1.25 }], borderWidth: 3 },
  markerBooked: { borderColor: '#10B981', borderWidth: 3 },
  markerDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  markerTail: {
    width: 0, height: 0,
    borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 8,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    marginTop: -1,
  },
  markerLabel: {
    position: 'absolute',
    top: -28,
    paddingHorizontal: 7, paddingVertical: 3,
    borderRadius: 8, maxWidth: 120,
  },
  markerLabelTxt: { color: '#fff', fontSize: 10, fontWeight: '700' },

  mapEmpty: {
    position: 'absolute', top: '35%', left: 0, right: 0,
    alignItems: 'center', gap: 10,
  },
  mapEmptyTxt: { fontSize: 15, fontWeight: '600', color: '#666' },
  mapEmptyBtn: {
    backgroundColor: '#1A1A2E',
    paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12,
  },
  mapEmptyBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },

  legend: {
    position: 'absolute', top: 12, left: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12, padding: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 6, elevation: 4,
    gap: 4,
  },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendTxt: { fontSize: 11, fontWeight: '600', color: '#333' },

  locChip: {
    position: 'absolute', top: 12, right: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 6, elevation: 4,
  },
  locChipTxt: { fontSize: 12, fontWeight: '600', color: '#333' },

  countBadge: {
    position: 'absolute', top: 12,
    alignSelf: 'center', left: '50%', transform: [{ translateX: -40 }],
    backgroundColor: '#1A1A2E',
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6,
  },
  countBadgeTxt: { color: '#fff', fontSize: 12, fontWeight: '700' },

  zoomCol: { position: 'absolute', right: 12, bottom: 130, gap: 4 },
  zoomBtn: {
    width: 38, height: 38, backgroundColor: '#fff',
    borderRadius: 9, justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  zoomTxt: { fontSize: 22, color: '#444', lineHeight: 26 },

  detailCard: {
    position: 'absolute', bottom: 16, left: 16, right: 16,
    backgroundColor: '#fff', borderRadius: 18,
    flexDirection: 'row', overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15, shadowRadius: 14, elevation: 8,
  },
  detailBar: { width: 6 },
  detailBody: { flex: 1, padding: 14 },
  detailTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  detailTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A2E' },
  detailLoc: { fontSize: 11, color: '#888' },
  detailPrice: { fontSize: 14, fontWeight: '800', color: '#EF4444' },
  detailActions: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  viewBtn: {
    flex: 1, paddingVertical: 9, borderRadius: 11, alignItems: 'center',
  },
  viewBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },
  closeBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center',
  },
});
