import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Switch,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  FilterState,
  EMPTY_FILTER,
  ALL_CATEGORIES,
  ALL_NEIGHBORHOODS,
  CATEGORY_COLORS,
} from '../data/events';

const DISTANCES: { label: string; value: number | null }[] = [
  { label: '< 0.5 mi', value: 0.5 },
  { label: '< 1 mi',   value: 1   },
  { label: '< 2 mi',   value: 2   },
  { label: '< 5 mi',   value: 5   },
  { label: 'Any',      value: null },
];


const TYPES: { label: string; value: FilterState['type'] }[] = [
  { label: 'All',      value: null       },
  { label: 'Social',   value: 'Social'   },
  { label: 'Personal', value: 'Personal' },
];

type Props = {
  visible: boolean;
  filters: FilterState;
  onApply: (f: FilterState) => void;
  onClose: () => void;
};

export default function FilterModal({ visible, filters, onApply, onClose }: Props) {
  const [draft, setDraft] = useState<FilterState>(filters);

  useEffect(() => {
    if (visible) setDraft(filters);
  }, [visible]);

  const toggleCategory = (cat: string) => {
    setDraft((p) => ({
      ...p,
      categories: p.categories.includes(cat)
        ? p.categories.filter((c) => c !== cat)
        : [...p.categories, cat],
    }));
  };

  const toggleNeighborhood = (n: string) => {
    setDraft((p) => ({ ...p, neighborhood: p.neighborhood === n ? null : n }));
  };

  const activeCount =
    (draft.maxDistance !== null ? 1 : 0) +
    (draft.neighborhood ? 1 : 0) +
    (draft.type ? 1 : 0) +
    (draft.categories.length > 0 ? 1 : 0) +
    (draft.dateMonth || draft.dateDay || draft.dateYear ? 1 : 0) +
    (draft.outsideComfortZone ? 1 : 0);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.sheet}>
          {/* Handle + Header */}
          <View style={s.handle} />
          <View style={s.header}>
            <Text style={s.title}>Filters</Text>
            <TouchableOpacity onPress={() => setDraft(EMPTY_FILTER)} style={s.resetBtn}>
              <Text style={s.resetTxt}>Reset All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
            {/* Distance */}
            <Text style={s.sectionLabel}>Distance</Text>
            <View style={s.pillRow}>
              {DISTANCES.map((d) => {
                const active = draft.maxDistance === d.value;
                return (
                  <TouchableOpacity
                    key={String(d.value)}
                    style={[s.pill, active && s.pillActive]}
                    onPress={() => setDraft((p) => ({ ...p, maxDistance: d.value }))}
                  >
                    <Text style={[s.pillTxt, active && s.pillTxtActive]}>{d.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Date */}
            <Text style={s.sectionLabel}>Date</Text>
            <View style={s.dateRow}>
              <View style={s.dateField}>
                <Text style={s.dateFieldLabel}>MM</Text>
                <TextInput
                  style={s.dateBox}
                  placeholder="04"
                  placeholderTextColor="#ccc"
                  keyboardType="number-pad"
                  maxLength={2}
                  value={draft.dateMonth}
                  onChangeText={(t) => setDraft((p) => ({ ...p, dateMonth: t.replace(/\D/g, '') }))}
                />
              </View>
              <Text style={s.dateSep}>/</Text>
              <View style={s.dateField}>
                <Text style={s.dateFieldLabel}>DD</Text>
                <TextInput
                  style={s.dateBox}
                  placeholder="10"
                  placeholderTextColor="#ccc"
                  keyboardType="number-pad"
                  maxLength={2}
                  value={draft.dateDay}
                  onChangeText={(t) => setDraft((p) => ({ ...p, dateDay: t.replace(/\D/g, '') }))}
                />
              </View>
              <Text style={s.dateSep}>/</Text>
              <View style={[s.dateField, { flex: 2 }]}>
                <Text style={s.dateFieldLabel}>YYYY</Text>
                <TextInput
                  style={s.dateBox}
                  placeholder="2026"
                  placeholderTextColor="#ccc"
                  keyboardType="number-pad"
                  maxLength={4}
                  value={draft.dateYear}
                  onChangeText={(t) => setDraft((p) => ({ ...p, dateYear: t.replace(/\D/g, '') }))}
                />
              </View>
              {(draft.dateMonth || draft.dateDay || draft.dateYear) && (
                <TouchableOpacity
                  style={s.dateClear}
                  onPress={() => setDraft((p) => ({ ...p, dateMonth: '', dateDay: '', dateYear: '' }))}
                >
                  <Ionicons name="close-circle" size={20} color="#ccc" />
                </TouchableOpacity>
              )}
            </View>

            {/* Activity Type */}
            <Text style={s.sectionLabel}>Activity Type</Text>
            <View style={s.segmented}>
              {TYPES.map((t) => {
                const active = draft.type === t.value;
                return (
                  <TouchableOpacity
                    key={String(t.value)}
                    style={[s.segBtn, active && s.segBtnActive]}
                    onPress={() => setDraft((p) => ({ ...p, type: t.value }))}
                  >
                    <Text style={[s.segTxt, active && s.segTxtActive]}>{t.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Outside Comfort Zone */}
            <View style={s.switchRow}>
              <View style={s.switchLeft}>
                <View style={s.switchIcon}>
                  <Ionicons name="flash" size={16} color="#F97316" />
                </View>
                <View>
                  <Text style={s.switchLabel}>Outside Comfort Zone</Text>
                  <Text style={s.switchSub}>Only show challenging events</Text>
                </View>
              </View>
              <Switch
                value={draft.outsideComfortZone}
                onValueChange={(v) => setDraft((p) => ({ ...p, outsideComfortZone: v }))}
                trackColor={{ false: '#E5E7EB', true: '#FED7AA' }}
                thumbColor={draft.outsideComfortZone ? '#F97316' : '#fff'}
              />
            </View>

            {/* Neighborhood */}
            <Text style={s.sectionLabel}>Neighborhood</Text>
            <View style={s.pillRow}>
              {ALL_NEIGHBORHOODS.map((n) => {
                const active = draft.neighborhood === n;
                return (
                  <TouchableOpacity
                    key={n}
                    style={[s.pill, active && s.pillActive]}
                    onPress={() => toggleNeighborhood(n)}
                  >
                    <Text style={[s.pillTxt, active && s.pillTxtActive]}>{n}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Category */}
            <Text style={s.sectionLabel}>Category</Text>
            <View style={s.pillRow}>
              {ALL_CATEGORIES.map((cat) => {
                const active = draft.categories.includes(cat);
                const color = CATEGORY_COLORS[cat] ?? '#888';
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      s.pill,
                      active && { backgroundColor: color, borderColor: color },
                    ]}
                    onPress={() => toggleCategory(cat)}
                  >
                    <View style={[s.catDot, { backgroundColor: active ? '#fff' : color }]} />
                    <Text style={[s.pillTxt, active && s.pillTxtActive]}>{cat}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={{ height: 8 }} />
          </ScrollView>

          {/* Apply */}
          <View style={s.footer}>
            <TouchableOpacity style={s.cancelBtn} onPress={onClose}>
              <Text style={s.cancelTxt}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.applyBtn}
              onPress={() => { onApply(draft); onClose(); }}
            >
              <Text style={s.applyTxt}>
                Apply{activeCount > 0 ? ` (${activeCount})` : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: { fontSize: 18, fontWeight: '800', color: '#1A1A2E' },
  resetBtn: { padding: 6 },
  resetTxt: { fontSize: 14, fontWeight: '600', color: '#EF4444' },

  scroll: { paddingHorizontal: 20, paddingTop: 14 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 18,
  },

  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    gap: 5,
  },
  pillActive: { backgroundColor: '#1A1A2E', borderColor: '#1A1A2E' },
  pillTxt: { fontSize: 13, fontWeight: '600', color: '#555' },
  pillTxtActive: { color: '#fff' },
  catDot: { width: 8, height: 8, borderRadius: 4 },

  dateRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  dateField: { flex: 1, alignItems: 'center' },
  dateFieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#aaa',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  dateBox: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingVertical: 10,
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    textAlign: 'center',
    backgroundColor: '#F9FAFB',
    width: '100%',
  },
  dateSep: { fontSize: 22, color: '#ccc', fontWeight: '300', paddingBottom: 8 },
  dateClear: { paddingBottom: 6 },

  dateInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  dateInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A2E',
  },
  suggestionRow: { flexDirection: 'row', gap: 8, paddingVertical: 2 },
  suggestionPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  suggestionTxt: { fontSize: 13, fontWeight: '600', color: '#555' },

  segmented: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 3,
  },
  segBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
  },
  segBtnActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  segTxt: { fontSize: 14, fontWeight: '600', color: '#888' },
  segTxtActive: { fontSize: 14, fontWeight: '700', color: '#1A1A2E' },

  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF7ED',
    borderRadius: 14,
    padding: 14,
    marginTop: 18,
    borderWidth: 1.5,
    borderColor: '#FED7AA',
  },
  switchLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  switchIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchLabel: { fontSize: 14, fontWeight: '700', color: '#1A1A2E' },
  switchSub: { fontSize: 11, color: '#888', marginTop: 2 },

  footer: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelTxt: { fontSize: 15, fontWeight: '700', color: '#555' },
  applyBtn: {
    flex: 2,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
  },
  applyTxt: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
