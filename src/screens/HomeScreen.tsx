import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const INTERFACES = [
  {
    id: 1,
    title: 'Event Feed',
    subtitle: 'TikTok-style discovery list',
    icon: 'list' as const,
    color: '#FF6B6B',
    screen: 'EventFeed',
  },
  {
    id: 2,
    title: 'Event Map',
    subtitle: 'Spatial event exploration',
    icon: 'map' as const,
    color: '#10B981',
    screen: 'EventMap',
  },
  {
    id: 3,
    title: 'Friend Availability',
    subtitle: 'Social calendar & join plans',
    icon: 'people' as const,
    color: '#3B82F6',
    screen: 'FriendAvailability',
  },
  {
    id: 4,
    title: 'Mood Tracker',
    subtitle: 'Daily journal for students',
    icon: 'happy' as const,
    color: '#8B5CF6',
    screen: 'MoodTracker',
  },
];

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>HCI Demos</Text>
        <Text style={styles.subtitle}>Tap an interface to demo</Text>
      </View>
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {INTERFACES.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.card, { borderLeftColor: item.color }]}
            onPress={() => navigation.navigate(item.screen as never)}
            activeOpacity={0.75}
          >
            <View style={[styles.iconWrap, { backgroundColor: item.color + '1A' }]}>
              <Ionicons name={item.icon} size={28} color={item.color} />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardNumber}>Interface {item.id}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSub}>{item.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 16 },
  title: { fontSize: 34, fontWeight: '800', color: '#1A1A2E', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: '#888', marginTop: 4 },
  list: { padding: 16, gap: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  iconWrap: {
    width: 54,
    height: 54,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardText: { flex: 1 },
  cardNumber: {
    fontSize: 10,
    fontWeight: '700',
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A2E', marginTop: 2 },
  cardSub: { fontSize: 12, color: '#888', marginTop: 3 },
});
