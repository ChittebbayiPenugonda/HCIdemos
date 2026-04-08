import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EventItem, FRIEND_COLORS } from '../data/events';

type Props = {
  event: EventItem | null;
  visible: boolean;
  isBooked: boolean;
  onBook: (id: number) => void;
  onClose: () => void;
};

export default function EventDetailModal({ event, visible, isBooked, onBook, onClose }: Props) {
  const [justBooked, setJustBooked] = useState(false);

  const handleBook = () => {
    if (!event || isBooked) return;
    onBook(event.id);
    setJustBooked(true);
  };

  const handleClose = () => {
    setJustBooked(false);
    onClose();
  };

  if (!event) return null;

  const booked = isBooked || justBooked;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={s.overlay}>
        <View style={s.sheet}>
          {/* Colored header */}
          <View style={[s.header, { backgroundColor: event.color }]}>
            <View style={s.handle} />

            {/* OOC banner */}
            {event.outsideComfortZone && (
              <View style={s.oocBanner}>
                <Ionicons name="flash" size={14} color="#F97316" />
                <Text style={s.oocBannerTxt}>Outside Your Comfort Zone</Text>
              </View>
            )}

            <View style={s.headerRow}>
              <View style={s.headerIcon}>
                <Ionicons name={event.icon} size={28} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.headerTitle}>{event.title}</Text>
                <View style={s.headerBadges}>
                  <View style={s.typeBadge}>
                    <Text style={s.typeBadgeTxt}>{event.type}</Text>
                  </View>
                  <View style={s.catBadge}>
                    <Text style={s.catBadgeTxt}>{event.category}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.body}>
            {/* Meta */}
            <View style={s.metaCard}>
              <View style={s.metaRow}>
                <View style={s.metaIcon}>
                  <Ionicons name="calendar-outline" size={16} color={event.color} />
                </View>
                <Text style={s.metaTxt}>{event.dateLabel} · {event.startTime} – {event.endTime}</Text>
              </View>
              <View style={s.metaDivider} />
              <View style={s.metaRow}>
                <View style={s.metaIcon}>
                  <Ionicons name="location-outline" size={16} color={event.color} />
                </View>
                <Text style={s.metaTxt}>{event.location}</Text>
              </View>
              <View style={s.metaDivider} />
              <View style={s.metaRow}>
                <View style={s.metaIcon}>
                  <Ionicons name="navigate-outline" size={16} color={event.color} />
                </View>
                <Text style={s.metaTxt}>{event.distance} mi away · {event.neighborhood}</Text>
              </View>
              <View style={s.metaDivider} />
              <View style={s.metaRow}>
                <View style={s.metaIcon}>
                  <Ionicons name="people-outline" size={16} color={event.color} />
                </View>
                <Text style={s.metaTxt}>{event.attending} people attending</Text>
              </View>
            </View>

            {/* Description */}
            <Text style={s.desc}>{event.description}</Text>

            {/* Friends attending */}
            {event.friendsAttending.length > 0 && (
              <View style={s.friendsSection}>
                <Text style={s.sectionTitle}>Friends Going</Text>
                {event.friendsAttending.map((f) => (
                  <View key={f} style={s.friendRow}>
                    <View style={[s.friendAvatar, { backgroundColor: FRIEND_COLORS[f] ?? '#888' }]}>
                      <Text style={s.friendInitial}>{f[0]}</Text>
                    </View>
                    <Text style={s.friendName}>{f}</Text>
                    <View style={[s.goingBadge, { backgroundColor: (FRIEND_COLORS[f] ?? '#888') + '22' }]}>
                      <Ionicons name="checkmark-circle" size={13} color={FRIEND_COLORS[f] ?? '#888'} />
                      <Text style={[s.goingTxt, { color: FRIEND_COLORS[f] ?? '#888' }]}>Going</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Comfort zone call-out */}
            {event.outsideComfortZone && (
              <View style={s.oocCard}>
                <Ionicons name="flash" size={20} color="#F97316" />
                <View style={{ flex: 1 }}>
                  <Text style={s.oocTitle}>Outside Your Comfort Zone</Text>
                  <Text style={s.oocDesc}>This event is designed to push your boundaries and help you try something new.</Text>
                </View>
              </View>
            )}

            {/* Book button */}
            {booked ? (
              <View style={[s.bookedBox, { backgroundColor: event.color + '15', borderColor: event.color }]}>
                <Ionicons name="checkmark-circle" size={26} color={event.color} />
                <View>
                  <Text style={[s.bookedTitle, { color: event.color }]}>You're going!</Text>
                  <Text style={s.bookedSub}>Event booked successfully</Text>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={[s.bookBtn, { backgroundColor: event.color }]}
                onPress={handleBook}
                activeOpacity={0.85}
              >
                <Ionicons name="calendar-outline" size={20} color="#fff" />
                <Text style={s.bookBtnTxt}>
                  Book Event{event.price !== 'Free' ? ` — ${event.price}` : ' — Free'}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={s.closeBtn} onPress={handleClose}>
              <Text style={s.closeBtnTxt}>Close</Text>
            </TouchableOpacity>

            <View style={{ height: 16 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
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
    maxHeight: '92%',
  },
  header: { padding: 20, paddingTop: 10 },
  handle: {
    width: 38,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 14,
  },
  oocBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 12,
  },
  oocBannerTxt: { fontSize: 12, fontWeight: '800', color: '#F97316' },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  headerIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 8, flex: 1, flexWrap: 'wrap' },
  headerBadges: { flexDirection: 'row', gap: 7 },
  typeBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  typeBadgeTxt: { color: '#fff', fontSize: 11, fontWeight: '700' },
  catBadge: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  catBadgeTxt: { color: '#fff', fontSize: 11, fontWeight: '700' },

  body: { paddingHorizontal: 20, paddingTop: 18 },

  metaCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    paddingVertical: 4,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  metaIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  metaTxt: { fontSize: 14, color: '#333', flex: 1, fontWeight: '500' },
  metaDivider: { height: 1, backgroundColor: '#E9ECEF', marginHorizontal: 14 },

  desc: { fontSize: 14, color: '#555', lineHeight: 22, marginBottom: 20 },

  friendsSection: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  friendAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendInitial: { color: '#fff', fontWeight: '800', fontSize: 16 },
  friendName: { flex: 1, fontSize: 15, fontWeight: '600', color: '#333' },
  goingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  goingTxt: { fontSize: 11, fontWeight: '700' },

  oocCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#FFF7ED',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#FED7AA',
  },
  oocTitle: { fontSize: 14, fontWeight: '700', color: '#C2410C', marginBottom: 3 },
  oocDesc: { fontSize: 12, color: '#92400E', lineHeight: 18 },

  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 15,
    borderRadius: 16,
    marginBottom: 10,
  },
  bookBtnTxt: { color: '#fff', fontWeight: '800', fontSize: 17 },

  bookedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 16,
    padding: 18,
    marginBottom: 10,
    borderWidth: 2,
  },
  bookedTitle: { fontSize: 17, fontWeight: '800' },
  bookedSub: { fontSize: 12, color: '#888', marginTop: 2 },

  closeBtn: {
    paddingVertical: 13,
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
  },
  closeBtnTxt: { fontSize: 15, fontWeight: '600', color: '#666' },
});
