import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width: SW, height: SH } = Dimensions.get('window');

const TYPES = {
  personal: { color: '#3B82F6', label: 'Personal' },
  social: { color: '#8B5CF6', label: 'Social' },
  third: { color: '#10B981', label: 'Third Space' },
} as const;
type MarkerType = keyof typeof TYPES;

const MARKERS: {
  id: number;
  type: MarkerType;
  x: string;
  y: string;
  count: number;
  featured: boolean;
  title: string;
  location: string;
}[] = [
  { id: 1, type: 'personal', x: '22%', y: '28%', count: 1, featured: false, title: 'Rock Climbing', location: 'REI Co-op' },
  { id: 2, type: 'social', x: '52%', y: '22%', count: 3, featured: true, title: 'Jazz Night', location: 'Variety Playhouse' },
  { id: 3, type: 'third', x: '72%', y: '42%', count: 1, featured: false, title: 'Study Group', location: 'GT Library' },
  { id: 4, type: 'personal', x: '32%', y: '54%', count: 2, featured: false, title: 'Yoga Session', location: 'Piedmont Park' },
  { id: 5, type: 'social', x: '62%', y: '64%', count: 1, featured: true, title: 'Trivia Night', location: "Manuel's Tavern" },
  { id: 6, type: 'third', x: '18%', y: '70%', count: 4, featured: false, title: 'Art Fair', location: 'Krog Street Market' },
  { id: 7, type: 'personal', x: '82%', y: '28%', count: 1, featured: false, title: 'Tennis', location: 'GT Tennis Courts' },
  { id: 8, type: 'social', x: '44%', y: '76%', count: 2, featured: false, title: 'Board Games', location: 'Joystick Game Bar' },
];

const TABS = ['All', 'Personal', 'Friends'];

export default function EventMapScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('All');
  const [selected, setSelected] = useState<(typeof MARKERS)[0] | null>(null);

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header — identical to Feed */}
      <View style={s.header}>
        <TouchableOpacity style={s.headerBtn}>
          <Ionicons name="menu" size={24} color="#1A1A2E" />
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
          placeholder="Search activities..."
          placeholderTextColor="#aaa"
        />
      </View>

      {/* Tabs */}
      <View style={s.tabRow}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t}
            style={[s.tab, activeTab === t && s.tabActive]}
            onPress={() => setActiveTab(t)}
          >
            <Text style={[s.tabText, activeTab === t && s.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={s.filtersBtn}>
          <Ionicons name="options-outline" size={15} color="#555" />
          <Text style={s.filtersBtnText}>Filters</Text>
        </TouchableOpacity>
      </View>

      {/* Feed / Map toggle */}
      <View style={s.toggleRow}>
        <View style={s.segmented}>
          <TouchableOpacity
            style={s.segBtn}
            onPress={() => navigation.navigate('EventFeed' as never)}
          >
            <Text style={s.segText}>Feed</Text>
          </TouchableOpacity>
          <View style={[s.segBtn, s.segActive]}>
            <Text style={s.segTextActive}>Map</Text>
          </View>
        </View>
      </View>

      {/* MAP */}
      <View style={s.mapOuter}>
        {/* Map background — styled to feel like a real map */}
        <View style={s.mapBg}>
          {/* Road grid */}
          <View style={[s.road, s.roadH, { top: '35%' }]} />
          <View style={[s.road, s.roadH, { top: '55%' }]} />
          <View style={[s.road, s.roadH, { top: '15%' }]} />
          <View style={[s.road, s.roadH, { top: '75%' }]} />
          <View style={[s.road, s.roadV, { left: '28%' }]} />
          <View style={[s.road, s.roadV, { left: '58%' }]} />
          <View style={[s.road, s.roadV, { left: '78%' }]} />

          {/* Diagonal road */}
          <View
            style={{
              position: 'absolute',
              width: 8,
              height: '80%',
              top: '10%',
              left: '42%',
              backgroundColor: '#fff',
              transform: [{ rotate: '20deg' }],
            }}
          />

          {/* Parks */}
          <View style={[s.park, { top: '36%', left: '29%', width: 90, height: 55 }]} />
          <View style={[s.park, { top: '8%', left: '59%', width: 70, height: 45 }]} />
          <View style={[s.park, { top: '56%', left: '0%', width: 60, height: 50 }]} />

          {/* Buildings */}
          <View style={[s.bldg, { top: '5%', left: '5%', width: 55, height: 45 }]} />
          <View style={[s.bldg, { top: '5%', left: '8%', width: 38, height: 58 }]} />
          <View style={[s.bldg, { top: '38%', left: '59%', width: 60, height: 42 }]} />
          <View style={[s.bldg, { top: '56%', left: '29%', width: 55, height: 48 }]} />
          <View style={[s.bldg, { top: '18%', left: '79%', width: 40, height: 35 }]} />
          <View style={[s.bldg, { top: '76%', left: '59%', width: 60, height: 40 }]} />

          {/* GT Campus highlight */}
          <View style={s.campusOverlay} />

          {/* Markers */}
          {MARKERS.map((m) => {
            const type = TYPES[m.type];
            return (
              <TouchableOpacity
                key={m.id}
                style={[s.markerWrap, { left: m.x as any, top: m.y as any }]}
                onPress={() => setSelected(selected?.id === m.id ? null : m)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    s.marker,
                    { backgroundColor: type.color },
                    selected?.id === m.id && s.markerSelected,
                  ]}
                >
                  {m.count > 1 ? (
                    <Text style={s.markerCount}>{m.count}</Text>
                  ) : m.featured ? (
                    <Ionicons name="star" size={11} color="#fff" />
                  ) : (
                    <View style={s.markerDot} />
                  )}
                </View>
                <View style={[s.markerTail, { borderTopColor: type.color }]} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Legend */}
        <View style={s.legend}>
          {Object.entries(TYPES).map(([k, v]) => (
            <View key={k} style={s.legendRow}>
              <View style={[s.legendDot, { backgroundColor: v.color }]} />
              <Text style={s.legendText}>{v.label}</Text>
            </View>
          ))}
        </View>

        {/* Location chip */}
        <View style={s.locChip}>
          <Ionicons name="location" size={12} color="#555" />
          <Text style={s.locChipText}>Atlanta & Georgia Tech</Text>
        </View>

        {/* Zoom */}
        <View style={s.zoomCol}>
          <TouchableOpacity style={s.zoomBtn}>
            <Text style={s.zoomTxt}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.zoomBtn}>
            <Text style={s.zoomTxt}>−</Text>
          </TouchableOpacity>
        </View>

        {/* Event detail card */}
        {selected && (
          <View style={s.detailCard}>
            <View style={[s.detailBar, { backgroundColor: TYPES[selected.type].color }]} />
            <View style={s.detailBody}>
              <View style={s.detailTop}>
                <View>
                  <Text style={s.detailTitle}>{selected.title}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                    <Ionicons name="location-outline" size={12} color="#888" />
                    <Text style={s.detailLoc}> {selected.location}</Text>
                  </View>
                </View>
                <View style={[s.typeBadge, { backgroundColor: TYPES[selected.type].color + '22' }]}>
                  <Text style={[s.typeBadgeTxt, { color: TYPES[selected.type].color }]}>
                    {TYPES[selected.type].label}
                  </Text>
                </View>
              </View>
              <View style={s.detailActions}>
                <TouchableOpacity
                  style={[s.detailBtn, { backgroundColor: TYPES[selected.type].color }]}
                >
                  <Text style={s.detailBtnTxt}>View Details</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={s.closeBtn}
                  onPress={() => setSelected(null)}
                >
                  <Ionicons name="close" size={18} color="#888" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

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
    position: 'absolute',
    top: 3,
    right: 3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#F8F9FA',
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
  searchInput: { flex: 1, fontSize: 15, color: '#333' },

  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  tabActive: { backgroundColor: '#1A1A2E', borderColor: '#1A1A2E' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#555' },
  tabTextActive: { color: '#fff' },
  filtersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    gap: 5,
  },
  filtersBtnText: { fontSize: 13, fontWeight: '600', color: '#555' },

  toggleRow: { paddingHorizontal: 16, paddingBottom: 8 },
  segmented: {
    flexDirection: 'row',
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    padding: 3,
    alignSelf: 'flex-start',
  },
  segBtn: { paddingHorizontal: 24, paddingVertical: 7, borderRadius: 10 },
  segActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  segText: { fontSize: 14, fontWeight: '600', color: '#888' },
  segTextActive: { fontSize: 14, fontWeight: '700', color: '#1A1A2E' },

  // MAP
  mapOuter: { flex: 1, position: 'relative' },
  mapBg: {
    flex: 1,
    backgroundColor: '#E8E3D8',
    overflow: 'hidden',
    position: 'relative',
  },

  road: { position: 'absolute', backgroundColor: '#fff' },
  roadH: { left: 0, right: 0, height: 9 },
  roadV: { top: 0, bottom: 0, width: 9 },

  park: { position: 'absolute', backgroundColor: '#C5DDB8', borderRadius: 6 },
  bldg: { position: 'absolute', backgroundColor: '#CFC7B8', borderRadius: 3 },

  campusOverlay: {
    position: 'absolute',
    top: '16%',
    left: '14%',
    width: '46%',
    height: '38%',
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: 'rgba(59,130,246,0.04)',
  },

  markerWrap: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -17 }, { translateY: -42 }],
  },
  marker: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerSelected: {
    transform: [{ scale: 1.2 }],
    borderWidth: 3,
    borderColor: '#fff',
  },
  markerDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  markerCount: { color: '#fff', fontSize: 12, fontWeight: '800' },
  markerTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },

  legend: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  legendRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 3 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 7 },
  legendText: { fontSize: 12, fontWeight: '500', color: '#333' },

  locChip: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  locChipText: { fontSize: 12, fontWeight: '600', color: '#333' },

  zoomCol: {
    position: 'absolute',
    right: 12,
    bottom: 120,
    gap: 4,
  },
  zoomBtn: {
    width: 38,
    height: 38,
    backgroundColor: '#fff',
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  zoomTxt: { fontSize: 22, color: '#444', lineHeight: 26 },

  detailCard: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 18,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 8,
  },
  detailBar: { width: 6 },
  detailBody: { flex: 1, padding: 14 },
  detailTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  detailTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A2E' },
  detailLoc: { fontSize: 12, color: '#888' },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  typeBadgeTxt: { fontSize: 11, fontWeight: '700' },
  detailActions: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  detailBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 11,
    alignItems: 'center',
  },
  detailBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
