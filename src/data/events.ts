import { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

type IconName = ComponentProps<typeof Ionicons>['name'];

export type EventItem = {
  id: number;
  title: string;
  description: string;
  category: string;
  type: 'Social' | 'Personal';
  neighborhood: string;
  distance: number;
  daysFromNow: number;
  dateLabel: string;
  dateISO: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  location: string;
  attending: number;
  friendsAttending: string[];
  price: string;
  outsideComfortZone: boolean;
  color: string;
  icon: IconName;
  mapX: number; // 0–100
  mapY: number; // 0–100
};

export type FilterState = {
  maxDistance: number | null;
  neighborhood: string | null;
  type: 'Social' | 'Personal' | null;
  categories: string[];
  dateMonth: string; // MM
  dateDay: string;   // DD
  dateYear: string;  // YYYY
  outsideComfortZone: boolean;
};

export const EMPTY_FILTER: FilterState = {
  maxDistance: null,
  neighborhood: null,
  type: null,
  categories: [],
  dateMonth: '',
  dateDay: '',
  dateYear: '',
  outsideComfortZone: false,
};

export const CATEGORY_COLORS: Record<string, string> = {
  Sports:         '#FF6B6B',
  Fitness:        '#10B981',
  Music:          '#8B5CF6',
  'Book Clubs':   '#4ECDC4',
  Games:          '#F97316',
  Art:            '#F59E0B',
  Dance:          '#EC4899',
  'Food & Drink': '#06B6D4',
  Tech:           '#3B82F6',
  Comedy:         '#84CC16',
};

export const FRIEND_COLORS: Record<string, string> = {
  Alex:   '#4ECDC4',
  Jordan: '#FF6B9D',
  Sam:    '#F59E0B',
  Taylor: '#8B5CF6',
  Morgan: '#3B82F6',
  Chris:  '#10B981',
  Riley:  '#F97316',
};

export const ALL_EVENTS: EventItem[] = [
  {
    id: 1,
    title: 'Rock Climbing Intro Night',
    description: "Never climbed before? Perfect. This beginner session at Atlanta Rocks covers top-rope fundamentals, safety systems, and basic movement. All gear provided. Huge social mix — most attendees are first-timers. Great way to push past your limits.",
    category: 'Sports',
    type: 'Social',
    neighborhood: 'Old Fourth Ward',
    distance: 1.2,
    daysFromNow: 1,
    dateLabel: 'Tue, Apr 8',
    dateISO: '2026-04-08',
    startTime: '6:00 PM',
    endTime: '8:30 PM',
    location: 'Atlanta Rocks, Old Fourth Ward',
    attending: 18,
    friendsAttending: ['Alex', 'Jordan'],
    price: '$12',
    outsideComfortZone: true,
    color: '#FF6B6B',
    icon: 'fitness-outline',
    mapX: 55,
    mapY: 48,
  },
  {
    id: 2,
    title: 'Sunset Yoga in Piedmont Park',
    description: 'Wind down with a peaceful flow session as the sun sets over Midtown. All levels welcome. Bring your own mat. Instructor leads a 60-min all-levels vinyasa practice.',
    category: 'Fitness',
    type: 'Personal',
    neighborhood: 'Midtown',
    distance: 0.4,
    daysFromNow: 0,
    dateLabel: 'Today',
    dateISO: '2026-04-08',
    startTime: '6:30 PM',
    endTime: '7:30 PM',
    location: 'Piedmont Park East Lawn',
    attending: 35,
    friendsAttending: ['Sam'],
    price: 'Free',
    outsideComfortZone: false,
    color: '#10B981',
    icon: 'leaf-outline',
    mapX: 48,
    mapY: 35,
  },
  {
    id: 3,
    title: 'Jazz Night at Variety Playhouse',
    description: "Live jazz from local and touring artists in one of Atlanta's most beloved music venues. Full bar, great acoustics, and an eclectic crowd. Doors open at 7:30.",
    category: 'Music',
    type: 'Social',
    neighborhood: 'Little Five Points',
    distance: 2.1,
    daysFromNow: 2,
    dateLabel: 'Wed, Apr 9',
    dateISO: '2026-04-09',
    startTime: '8:00 PM',
    endTime: '11:00 PM',
    location: 'Variety Playhouse',
    attending: 142,
    friendsAttending: ['Morgan', 'Taylor'],
    price: '$15',
    outsideComfortZone: false,
    color: '#8B5CF6',
    icon: 'musical-notes-outline',
    mapX: 60,
    mapY: 65,
  },
  {
    id: 4,
    title: 'Sci-Fi & Fantasy Book Club',
    description: "This month: Dune Messiah. Drop in even if you haven't finished — great discussion guaranteed. Meets at the back coffee bar. Casual, no pressure.",
    category: 'Book Clubs',
    type: 'Personal',
    neighborhood: 'Little Five Points',
    distance: 0.8,
    daysFromNow: 3,
    dateLabel: 'Thu, Apr 10',
    dateISO: '2026-04-10',
    startTime: '7:00 PM',
    endTime: '9:00 PM',
    location: 'Little Shop of Stories',
    attending: 9,
    friendsAttending: ['Riley'],
    price: 'Free',
    outsideComfortZone: false,
    color: '#4ECDC4',
    icon: 'book-outline',
    mapX: 52,
    mapY: 70,
  },
  {
    id: 5,
    title: 'Trivia Night with Prizes',
    description: "Weekly trivia at Manuel's with rotating categories — pop culture, sports, science, and more. Teams of up to 6. Winner gets a \$50 bar tab. Sign-in starts at 7:30.",
    category: 'Games',
    type: 'Social',
    neighborhood: 'Virginia-Highland',
    distance: 0.6,
    daysFromNow: 0,
    dateLabel: 'Tonight',
    dateISO: '2026-04-08',
    startTime: '8:00 PM',
    endTime: '10:00 PM',
    location: "Manuel's Tavern",
    attending: 48,
    friendsAttending: ['Alex', 'Chris'],
    price: 'Free',
    outsideComfortZone: false,
    color: '#F97316',
    icon: 'help-circle-outline',
    mapX: 70,
    mapY: 44,
  },
  {
    id: 6,
    title: 'Krog Street Photo Walk',
    description: 'Explore murals and architecture of Inman Park and Krog Street Tunnel with fellow photographers. All skill levels and gear welcome. Bring your phone or camera.',
    category: 'Art',
    type: 'Personal',
    neighborhood: 'Old Fourth Ward',
    distance: 0.9,
    daysFromNow: 1,
    dateLabel: 'Tue, Apr 8',
    dateISO: '2026-04-08',
    startTime: '9:00 AM',
    endTime: '11:00 AM',
    location: 'Krog Street Tunnel',
    attending: 14,
    friendsAttending: ['Jordan'],
    price: 'Free',
    outsideComfortZone: false,
    color: '#F59E0B',
    icon: 'camera-outline',
    mapX: 58,
    mapY: 52,
  },
  {
    id: 7,
    title: 'Pickup Basketball at CRC',
    description: "Casual pickup games at Georgia Tech's Campus Recreation Center. Show up ready to run — competitive but welcoming. Great if you haven't played in a while and want to get back out there.",
    category: 'Sports',
    type: 'Social',
    neighborhood: 'GT Campus',
    distance: 0.3,
    daysFromNow: 0,
    dateLabel: 'Today',
    dateISO: '2026-04-08',
    startTime: '5:00 PM',
    endTime: '7:00 PM',
    location: 'GT Campus Rec Center',
    attending: 22,
    friendsAttending: ['Chris', 'Sam', 'Alex'],
    price: 'Free',
    outsideComfortZone: true,
    color: '#FF6B6B',
    icon: 'basketball-outline',
    mapX: 22,
    mapY: 32,
  },
  {
    id: 8,
    title: 'Salsa Dancing for Beginners',
    description: 'No partner needed, no experience required. This intro class breaks down basic salsa steps and turns in a fun, no-judgment environment. Amazing social mix of ages and backgrounds.',
    category: 'Dance',
    type: 'Social',
    neighborhood: 'Buckhead',
    distance: 1.5,
    daysFromNow: 2,
    dateLabel: 'Wed, Apr 9',
    dateISO: '2026-04-09',
    startTime: '7:30 PM',
    endTime: '9:30 PM',
    location: 'Havana Club, Buckhead',
    attending: 30,
    friendsAttending: ['Morgan'],
    price: '$10',
    outsideComfortZone: true,
    color: '#EC4899',
    icon: 'musical-notes-outline',
    mapX: 75,
    mapY: 20,
  },
  {
    id: 9,
    title: 'Piedmont Farmers Market',
    description: 'Local produce, artisan food, live music, and community. Rain or shine, every Saturday at Piedmont Park. Best brunch ingredients in Atlanta plus local vendors.',
    category: 'Food & Drink',
    type: 'Social',
    neighborhood: 'Midtown',
    distance: 0.7,
    daysFromNow: 5,
    dateLabel: 'Sat, Apr 12',
    dateISO: '2026-04-12',
    startTime: '9:00 AM',
    endTime: '1:00 PM',
    location: 'Piedmont Park, 14th St Entrance',
    attending: 200,
    friendsAttending: ['Taylor', 'Riley'],
    price: 'Free',
    outsideComfortZone: false,
    color: '#06B6D4',
    icon: 'storefront-outline',
    mapX: 45,
    mapY: 30,
  },
  {
    id: 10,
    title: 'HackGT Weekend Hackathon',
    description: "36-hour team hackathon hosted by Georgia Tech. Build something wild, meet brilliant people, eat free food, and win prizes. Even if you've never done a hackathon, just show up — teams form on-site.",
    category: 'Tech',
    type: 'Social',
    neighborhood: 'GT Campus',
    distance: 1.8,
    daysFromNow: 5,
    dateLabel: 'Sat, Apr 12',
    dateISO: '2026-04-12',
    startTime: '9:00 AM',
    endTime: '9:00 PM',
    location: 'Clough Commons, Georgia Tech',
    attending: 400,
    friendsAttending: ['Alex', 'Jordan', 'Chris'],
    price: 'Free',
    outsideComfortZone: true,
    color: '#3B82F6',
    icon: 'code-slash-outline',
    mapX: 18,
    mapY: 40,
  },
  {
    id: 11,
    title: '5K Morning Run Club',
    description: 'Every Tuesday morning — meet at the Piedmont Park Visitors Center for a social 5K loop around the park. All paces welcome. Coffee run at Dancing Goats after.',
    category: 'Sports',
    type: 'Social',
    neighborhood: 'Midtown',
    distance: 0.5,
    daysFromNow: 1,
    dateLabel: 'Tue, Apr 8',
    dateISO: '2026-04-08',
    startTime: '7:00 AM',
    endTime: '8:30 AM',
    location: 'Piedmont Park Visitors Center',
    attending: 27,
    friendsAttending: ['Sam', 'Taylor'],
    price: 'Free',
    outsideComfortZone: false,
    color: '#FF6B6B',
    icon: 'walk-outline',
    mapX: 52,
    mapY: 28,
  },
  {
    id: 12,
    title: 'Pottery Wheel Workshop',
    description: "First time at the wheel? This guided 2-hour session takes you from zero to your first bowl. Surprisingly meditative. Clay, glaze, and kiln firing all included in the price.",
    category: 'Art',
    type: 'Personal',
    neighborhood: 'Buckhead',
    distance: 2.8,
    daysFromNow: 3,
    dateLabel: 'Thu, Apr 10',
    dateISO: '2026-04-10',
    startTime: '6:00 PM',
    endTime: '8:00 PM',
    location: 'Callanwolde Fine Arts Center',
    attending: 12,
    friendsAttending: ['Morgan'],
    price: '$25',
    outsideComfortZone: true,
    color: '#F59E0B',
    icon: 'color-palette-outline',
    mapX: 78,
    mapY: 25,
  },
  {
    id: 13,
    title: 'Beltline Pub Crawl',
    description: 'Walk the Beltline Eastside Trail stopping at 5 bars with drink specials at each. Wristband includes first drink free at every stop. Great way to meet new people.',
    category: 'Food & Drink',
    type: 'Social',
    neighborhood: 'Old Fourth Ward',
    distance: 1.1,
    daysFromNow: 4,
    dateLabel: 'Fri, Apr 11',
    dateISO: '2026-04-11',
    startTime: '7:00 PM',
    endTime: '11:00 PM',
    location: 'Beltline @ Irwin St Market',
    attending: 75,
    friendsAttending: ['Jordan', 'Alex', 'Morgan'],
    price: '$8',
    outsideComfortZone: false,
    color: '#06B6D4',
    icon: 'beer-outline',
    mapX: 62,
    mapY: 56,
  },
  {
    id: 14,
    title: 'Chess Club Open Play',
    description: 'Casual rated and unrated games at Highland Bakery. Beginners welcome, clocks optional. Show up anytime during the session, grab a coffee, and find a board.',
    category: 'Games',
    type: 'Personal',
    neighborhood: 'Virginia-Highland',
    distance: 3.2,
    daysFromNow: 4,
    dateLabel: 'Fri, Apr 11',
    dateISO: '2026-04-11',
    startTime: '6:00 PM',
    endTime: '9:00 PM',
    location: 'Highland Bakery, N. Highland Ave',
    attending: 16,
    friendsAttending: ['Chris'],
    price: 'Free',
    outsideComfortZone: false,
    color: '#F97316',
    icon: 'game-controller-outline',
    mapX: 72,
    mapY: 50,
  },
  {
    id: 15,
    title: 'Intro to Bouldering',
    description: "Stone Summit's intro session teaches the basics of bouldering — no ropes, no experience needed. Instructors guide you through movement, technique, and safety. Shoe rental included in price.",
    category: 'Sports',
    type: 'Social',
    neighborhood: 'West Midtown',
    distance: 1.4,
    daysFromNow: 2,
    dateLabel: 'Wed, Apr 9',
    dateISO: '2026-04-09',
    startTime: '6:00 PM',
    endTime: '8:00 PM',
    location: 'Stone Summit Westside',
    attending: 20,
    friendsAttending: ['Riley', 'Sam'],
    price: '$20',
    outsideComfortZone: true,
    color: '#FF6B6B',
    icon: 'fitness-outline',
    mapX: 28,
    mapY: 55,
  },
  {
    id: 16,
    title: 'Improv Comedy Workshop',
    description: "Learn the basics of improv in a supportive, hilarious environment. No acting experience needed — just willingness to look silly and laugh at yourself. Perfect for breaking out of your shell.",
    category: 'Comedy',
    type: 'Social',
    neighborhood: 'Midtown',
    distance: 2.3,
    daysFromNow: 6,
    dateLabel: 'Sun, Apr 13',
    dateISO: '2026-04-13',
    startTime: '2:00 PM',
    endTime: '4:00 PM',
    location: "Dad's Garage Theatre",
    attending: 18,
    friendsAttending: ['Taylor'],
    price: '$15',
    outsideComfortZone: true,
    color: '#84CC16',
    icon: 'mic-outline',
    mapX: 40,
    mapY: 42,
  },
];

export const ALL_CATEGORIES = [...new Set(ALL_EVENTS.map((e) => e.category))].sort();
export const ALL_NEIGHBORHOODS = [...new Set(ALL_EVENTS.map((e) => e.neighborhood))].sort();

export function applyFilters(
  events: EventItem[],
  filters: FilterState,
  query: string
): EventItem[] {
  return events.filter((ev) => {
    if (query.trim()) {
      const q = query.toLowerCase();
      const hit =
        ev.title.toLowerCase().includes(q) ||
        ev.category.toLowerCase().includes(q) ||
        ev.location.toLowerCase().includes(q) ||
        ev.neighborhood.toLowerCase().includes(q) ||
        ev.description.toLowerCase().includes(q) ||
        ev.friendsAttending.some((f) => f.toLowerCase().includes(q));
      if (!hit) return false;
    }
    if (filters.maxDistance !== null && ev.distance > filters.maxDistance) return false;
    if (filters.dateMonth || filters.dateDay || filters.dateYear) {
      // Build a partial ISO string from whatever fields are filled
      const [evY, evM, evD] = ev.dateISO.split('-');
      const mMatch = !filters.dateMonth || evM === filters.dateMonth.padStart(2, '0');
      const dMatch = !filters.dateDay   || evD === filters.dateDay.padStart(2, '0');
      const yMatch = !filters.dateYear  || evY === filters.dateYear;
      if (!mMatch || !dMatch || !yMatch) return false;
    }
    if (filters.type && ev.type !== filters.type) return false;
    if (filters.neighborhood && ev.neighborhood !== filters.neighborhood) return false;
    if (filters.categories.length > 0 && !filters.categories.includes(ev.category)) return false;
    if (filters.outsideComfortZone && !ev.outsideComfortZone) return false;
    return true;
  });
}

export function countActiveFilters(f: FilterState): number {
  return (
    (f.maxDistance !== null ? 1 : 0) +
    (f.neighborhood ? 1 : 0) +
    (f.type ? 1 : 0) +
    (f.categories.length > 0 ? 1 : 0) +
    (f.dateMonth || f.dateDay || f.dateYear ? 1 : 0) +
    (f.outsideComfortZone ? 1 : 0)
  );
}
