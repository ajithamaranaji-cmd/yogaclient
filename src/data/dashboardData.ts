export interface DashboardStats {
  totalLeads: number;
  bookings: number;
  earnings: number;
  profileViews: number;
  leadsTrend: string;
  bookingsTrend: string;
  earningsTrend: string;
  viewsTrend: string;
}

export interface Booking {
  id: string;
  studentName: string;
  studentAvatar: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Pending' | 'Canceled';
}

export interface LeadActivity {
  day: string;
  leads: number;
}

export interface TopService {
  name: string;
  bookings: number;
  image: string;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export const DASHBOARD_STATS: DashboardStats = {
  totalLeads: 128,
  bookings: 27,
  earnings: 1240,
  profileViews: 342,
  leadsTrend: '+18% from last week',
  bookingsTrend: '+12% from last week',
  earningsTrend: '+16% from last week',
  viewsTrend: '+22% from last week',
};

export const LEAD_CHART_DATA: LeadActivity[] = [
  { day: 'May 12', leads: 22 },
  { day: 'May 13', leads: 35 },
  { day: 'May 14', leads: 52 },
  { day: 'May 15', leads: 42 },
  { day: 'May 16', leads: 38 },
  { day: 'May 17', leads: 58 },
  { day: 'May 18', leads: 48 },
];

export const UPCOMING_BOOKINGS: Booking[] = [
  {
    id: '1',
    studentName: 'Sarah Johnson',
    studentAvatar: 'https://i.pravatar.cc/150?u=sarahj',
    serviceName: 'Hatha Yoga - Private Session',
    date: 'May 20, 2024',
    time: '7:00 AM',
    status: 'Confirmed'
  },
  {
    id: '2',
    studentName: 'Michael Davis',
    studentAvatar: 'https://i.pravatar.cc/150?u=michaeld',
    serviceName: 'Vinyasa Flow - Group Session',
    date: 'May 21, 2024',
    time: '6:30 PM',
    status: 'Confirmed'
  },
  {
    id: '3',
    studentName: 'Emily Wilson',
    studentAvatar: 'https://i.pravatar.cc/150?u=emilyw',
    serviceName: 'Meditation - Private Session',
    date: 'May 23, 2024',
    time: '8:00 AM',
    status: 'Pending'
  }
];

export const TOP_SERVICES: TopService[] = [
  { name: 'Hatha Yoga Session', bookings: 54, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=150' },
  { name: 'Vinyasa Flow', bookings: 32, image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=150' },
  { name: 'Meditation & Breathwork', bookings: 28, image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=150' },
  { name: 'Online Yoga Class', bookings: 18, image: 'https://images.unsplash.com/photo-1594751439417-df7a1d32c900?auto=format&fit=crop&q=80&w=150' },
  { name: 'Yoga for Flexibility', bookings: 12, image: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&q=80&w=150' }
];

export const RECENT_REVIEWS: Review[] = [
  {
    id: '1',
    author: 'Priya Sharma',
    avatar: 'https://i.pravatar.cc/150?u=priyas',
    rating: 5,
    comment: 'Amazing session! Ajith\'s guidance and positive energy are truly transformative.',
    date: 'May 10, 2024'
  },
  {
    id: '2',
    author: 'David Brown',
    avatar: 'https://i.pravatar.cc/150?u=davidb',
    rating: 5,
    comment: 'Great experience! I feel more relaxed and focused after every session.',
    date: 'May 8, 2024'
  }
];

export const LEAD_SOURCE_DATA = [
  { name: 'Search', value: 45 },
  { name: 'Direct', value: 25 },
  { name: 'Social Media', value: 20 },
  { name: 'Other', value: 10 }
];

export const ANALYTICS_TREND_DATA = [
  { day: 'Mon', value: 20 },
  { day: 'Tue', value: 35 },
  { day: 'Wed', value: 42 },
  { day: 'Thu', value: 30 },
  { day: 'Fri', value: 55 },
  { day: 'Sat', value: 48 },
  { day: 'Sun', value: 65 }
];
