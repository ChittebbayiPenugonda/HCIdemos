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

const EVENTS = [
  {
    id: 1,
    tag: 'Adventure Zone',
    category: 'Outdoor Sports',
    title: 'Rock Climbing Meetup',
    location: 'REI Co-op',
    distance: '0.8 mi',
    attending: 24,
    date: 'Sat, Mar 16 · 10:00 AM',
    price: 'Free',
    bg: '#FF6B6B',
    accent: '#FF8E53',
    avatars: ['#4ECDC4', '#45B7D1', '#A8A4E6'],
    cardIcon: 'fitness-outline' as const,
  },
  {
    id: 2,
    tag: 'Social Hub',
    category: 'Book Clubs',
    title: 'Fantasy & Sci-Fi Book Club',
    location: 'Little Shop of Stories',
    distance: '1.2 mi',
    attending: 8,
    date: 'Thu, Mar 14 · 7:00 PM',
    price: '$5',
    bg: '#4ECDC4',
    accent: '#2ECC71',
    avatars: ['#FF6B6B', '#FFA07A'],
    cardIcon: 'book-outline' as const,
  },
  {
    id: 3,
    tag: 'Wellness',
    category: 'Fitness',
    title: 'Sunset Yoga in the Park',
    location: 'Piedmont Park',
    distance: '0.4 mi',
    attending: 35,
    date: 'Sun, Mar 17 · 6:30 PM',
    price: 'Free',
    bg: '#6BCBA0',
    accent: '#3D9970',
    avatars: ['#FFD3B6', '#FFAAA5', '#FF8B94'],
    cardIcon: 'leaf-outline' as const,
  },
  {
    id: 4,
    tag: 'Nightlife',
    category: 'Music & Concerts',
    title: 'Jazz Night at Variety',
    location: 'Variety Playhouse',
    distance: '2.1 mi',
    attending: 150,
    date: 'Fri, Mar 15 · 8:00 PM',
    price: '$15',
    bg: '#2C3E50',
    accent: '#8E44AD',
    avatars: ['#E74C3C', '#3498DB'],
    cardIcon: 'musical-notes-outline' as const,
  },
  {
    id: 5,
    tag: 'Social Hub',
    category: 'Trivia',
    title: 'Trivia Night with Prizes!',
    location: "Manuel's Tavern",
    distance: '0.6 mi',
    attending: 42,
    date: 'Wed, Mar 13 · 8:00 PM',
    price: 'Free',
    bg: '#F39C12',
    accent: '#E67E22',
    avatars: ['#2ECC71', '#3498DB', '#9B59B6'],
    cardIcon: 'help-circle-outline' as const,
  },
  {
    id: 6,
    tag: 'Arts',
    category: 'Photography',
    title: 'Krog Street Photo Walk',
    location: 'Krog Street Market',
    distance: '0.9 mi',
    attending: 12,
    date: 'Sat, Mar 16 · 9:00 AM',
    price: 'Free',
    bg: '#8B5CF6',
    accent: '#6D28D9',
    avatars: ['#F59E0B', '#10B981'],
    cardIcon: 'camera-outline' as const,
  },
];

const TABS = ['All', 'Personal', 'Friends'];

export default function EventFeedScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
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
          <View style={[s.segBtn, s.segActive]}>
            <Text style={s.segTextActive}>Feed</Text>
          </View>
          <TouchableOpacity
            style={s.segBtn}
            onPress={() => navigation.navigate('EventMap' as never)}
          >
            <Text style={s.segText}>Map</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Feed */}
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <Text style={s.sectionLabel}>Personalized for you</Text>

        {EVENTS.map((ev) => (
          <TouchableOpacity key={ev.id} style={s.card} activeOpacity={0.92}>
            {/* Image area */}
            <View style={[s.imgArea, { backgroundColor: ev.bg }]}>
              <View
                style={[
                  s.imgOverlay,
                  { backgroundColor: ev.accent + '55' },
                ]}
              />
              {/* Top tags */}
              <View style={s.tagRow}>
                <View style={s.tag}>
                  <Text style={s.tagText}>{ev.tag}</Text>
                </View>
                <View style={s.catTag}>
                  <Text style={s.catTagText}>{ev.category}</Text>
                </View>
              </View>
              {/* Center icon */}
              <Ionicons name={ev.cardIcon} size={52} color="rgba(255,255,255,0.25)" />
              {/* Avatars */}
              <View style={s.avatarRow}>
                {ev.avatars.map((c, i) => (
                  <View
                    key={i}
                    style={[s.avatar, { backgroundColor: c, left: i * 18 }]}
                  />
                ))}
                <Text style={[s.avatarCount, { left: ev.avatars.length * 18 + 4 }]}>
                  +{ev.attending - ev.avatars.length} going
                </Text>
              </View>
            </View>

            {/* Info */}
            <View style={s.info}>
              <View style={s.infoTop}>
                <Text style={s.cardTitle} numberOfLines={1}>{ev.title}</Text>
                <Text style={[s.price, ev.price === 'Free' && { color: '#10B981' }]}>
                  {ev.price}
                </Text>
              </View>
              <View style={s.metaRow}>
                <Ionicons name="location-outline" size={12} color="#999" />
                <Text style={s.meta}> {ev.location} · {ev.distance}</Text>
              </View>
              <View style={s.infoBottom}>
                <View style={s.metaRow}>
                  <Ionicons name="people-outline" size={12} color="#999" />
                  <Text style={s.meta}> {ev.attending} attending</Text>
                </View>
                <View style={s.metaRow}>
                  <Ionicons name="calendar-outline" size={12} color="#999" />
                  <Text style={s.meta}> {ev.date}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 24 }} />
      </ScrollView>
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

  sectionLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 12,
  },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.09,
    shadowRadius: 10,
    elevation: 4,
  },
  imgArea: {
    height: 185,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  imgOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  tagRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  tagText: { fontSize: 11, fontWeight: '700', color: '#333' },
  catTag: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  catTagText: { fontSize: 11, fontWeight: '600', color: '#fff' },

  avatarRow: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    height: 28,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarCount: {
    position: 'absolute',
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
  },

  info: { padding: 14 },
  infoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#1A1A2E', flex: 1, marginRight: 8 },
  price: { fontSize: 15, fontWeight: '700', color: '#EF4444' },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  meta: { fontSize: 12, color: '#888' },
  infoBottom: { flexDirection: 'row', gap: 14, marginTop: 2 },
});
