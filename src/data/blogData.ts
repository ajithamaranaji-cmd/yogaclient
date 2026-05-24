
export interface BlogPost {
  id: number;
  tag: string;
  title: string;
  desc: string;
  image: string;
  authorAvatar: string;
  author: string;
  date: string;
  readTime: string;
  featured?: boolean;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    tag: 'Mind & Body',
    title: 'The Power of Daily Yoga: Small Steps, Big Transformation',
    desc: 'Discover how just a few minutes of daily practice can improve your physical, mental, and emotional well-being.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
    authorAvatar: 'https://i.pravatar.cc/150?u=wellzent1',
    author: 'WellZen Team',
    date: 'May 12, 2024',
    readTime: '8 min read',
    featured: true
  },
  {
    id: 2,
    tag: 'Yoga Practice',
    title: 'Morning Yoga Poses to Start Your Day',
    desc: '7 beginner-friendly poses to energize your body, clear your mind, and set a positive tone for the day.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
    authorAvatar: 'https://i.pravatar.cc/150?u=wellzent2',
    author: 'WellZen Team',
    date: 'May 5, 2024',
    readTime: '6 min read',
    featured: true
  },
  {
    id: 3,
    tag: 'Nutrition',
    title: 'Foods That Nourish Your Body & Mind',
    desc: 'A guide to mindful eating and the best foods to support your yoga practice and overall wellness.',
    image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&q=80&w=800',
    authorAvatar: 'https://i.pravatar.cc/150?u=wellzent3',
    author: 'WellZen Team',
    date: 'Apr 28, 2024',
    readTime: '7 min read',
    featured: true
  },
  {
    id: 4,
    tag: 'Meditation',
    title: 'Breathwork 101: Simple Techniques for Calm',
    desc: 'Calm your mind and center your focus with these basic breathing exercises anyone can do.',
    image: 'https://images.unsplash.com/photo-1499209974431-9dac3adaf477?auto=format&fit=crop&q=80&w=600',
    authorAvatar: 'https://i.pravatar.cc/150?u=wellzent4',
    author: 'WellZen Team',
    date: 'Apr 20, 2024',
    readTime: '6 min read'
  },
  {
    id: 5,
    tag: 'Wellness Tips',
    title: 'How to Build a Sustainable Wellness Routine',
    desc: 'Success in wellness comes from consistency. Learn how to create a routine that actually sticks.',
    image: 'https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?auto=format&fit=crop&q=80&w=600',
    authorAvatar: 'https://i.pravatar.cc/150?u=wellzent5',
    author: 'WellZen Team',
    date: 'Apr 18, 2024',
    readTime: '7 min read'
  },
  {
    id: 6,
    tag: 'Mind & Body',
    title: 'How Yoga Helps Reduce Stress & Anxiety',
    desc: 'Scientific insights into how physical movement and focus can lower cortisol and improve mood.',
    image: 'https://images.unsplash.com/photo-1507120410856-1f35574c3b45?auto=format&fit=crop&q=80&w=600',
    authorAvatar: 'https://i.pravatar.cc/150?u=wellzent6',
    author: 'WellZen Team',
    date: 'Apr 15, 2024',
    readTime: '5 min read'
  },
  {
    id: 7,
    tag: 'Nutrition',
    title: 'The Best Pre & Post Yoga Meals',
    desc: 'Fuel your practice correctly. What to eat before you flow and how to recover after.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600',
    authorAvatar: 'https://i.pravatar.cc/150?u=wellzent7',
    author: 'WellZen Team',
    date: 'Apr 12, 2024',
    readTime: '6 min read'
  },
  {
    id: 8,
    tag: 'Yoga Practice',
    title: "Beginner's Guide to Sun Salutations",
    desc: 'Master the foundation of most yoga classes with this step-by-step guide to Surya Namaskar.',
    image: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&q=80&w=600',
    authorAvatar: 'https://i.pravatar.cc/150?u=wellzent8',
    author: 'WellZen Team',
    date: 'Apr 10, 2024',
    readTime: '6 min read'
  },
  {
    id: 9,
    tag: 'Lifestyle',
    title: 'Digital Detox: Reconnect with What Matters',
    desc: 'Why putting down your phone is the best thing you can do for your mental health this weekend.',
    image: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&q=80&w=600',
    authorAvatar: 'https://i.pravatar.cc/150?u=wellzent9',
    author: 'WellZen Team',
    date: 'Apr 8, 2024',
    readTime: '5 min read'
  },
  {
    id: 10,
    tag: 'Teacher Stories',
    title: "A Teacher's Journey: Finding Purpose Through Yoga",
    desc: 'From a corporate cubicle to a yoga studio. An inspiring story of total career pivot.',
    image: 'https://images.unsplash.com/photo-1518314916381-77537a28c14e?auto=format&fit=crop&q=80&w=600',
    authorAvatar: 'https://i.pravatar.cc/150?u=wellzent10',
    author: 'WellZen Team',
    date: 'Apr 5, 2024',
    readTime: '8 min read'
  },
  {
    id: 11,
    tag: 'Wellness Tips',
    title: '5 Minutes Journaling for a Clearer Mind',
    desc: 'How writing down your thoughts for just five minutes a day can revolutionize your clarity.',
    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=600',
    authorAvatar: 'https://i.pravatar.cc/150?u=wellzent11',
    author: 'WellZen Team',
    date: 'Apr 3, 2024',
    readTime: '4 min read'
  },
  {
    id: 12,
    tag: 'Mind & Body',
    title: 'Sleep Hygiene: The Foundation of Wellness',
    desc: 'Discover the nightly rituals that ensure deep, restorative sleep every single night.',
    image: 'https://images.unsplash.com/photo-1511295742364-9031f0101c27?auto=format&fit=crop&q=80&w=600',
    readTime: '6 min read',
    author: 'WellZen Team',
    authorAvatar: 'https://i.pravatar.cc/150?u=wellzent1',
    date: 'Mar 30, 2024'
  },
  {
    id: 13,
    tag: 'Yoga Practice',
    title: 'Yoga for Pelvic Floor Health',
    desc: 'Expert-led poses and focus points for strengthening and releasing the pelvic floor.',
    image: 'https://images.unsplash.com/photo-1499721852963-2a73286980ca?auto=format&fit=crop&q=80&w=600',
    readTime: '7 min read',
    author: 'WellZen Team',
    authorAvatar: 'https://i.pravatar.cc/150?u=wellzent2',
    date: 'Mar 25, 2024'
  },
  {
    id: 14,
    tag: 'Nutrition',
    title: 'Hydration Hacks for Active People',
    desc: 'Why water alone isn’t enough and how to stay optimally hydrated for your practice.',
    image: 'https://images.unsplash.com/photo-1548919973-5cdf5916ad52?auto=format&fit=crop&q=80&w=600',
    readTime: '5 min read',
    author: 'WellZen Team',
    authorAvatar: 'https://i.pravatar.cc/150?u=wellzent3',
    date: 'Mar 20, 2024'
  },
  {
    id: 15,
    tag: 'Meditation',
    title: 'Vipassana for Beginners: A Gentle Intro',
    desc: 'Exploring the roots of insight meditation and how to start your own silent practice.',
    image: 'https://images.unsplash.com/photo-1518241353349-9b5718ef6e3a?auto=format&fit=crop&q=80&w=600',
    readTime: '10 min read',
    author: 'WellZen Team',
    authorAvatar: 'https://i.pravatar.cc/150?u=wellzent4',
    date: 'Mar 15, 2024'
  },
  {
    id: 16,
    tag: 'Lifestyle',
    title: 'Minimalism and Mental Space',
    desc: 'How decluttering your physical surroundings leads to a decluttered mental state.',
    image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=600',
    readTime: '6 min read',
    author: 'WellZen Team',
    authorAvatar: 'https://i.pravatar.cc/150?u=wellzent9',
    date: 'Mar 10, 2024'
  },
  // Adding more to reach higher counts as requested
  ...Array.from({ length: 20 }, (_, i) => ({
    id: 100 + i,
    tag: 'Mind & Body',
    title: `Mind & Body Insight #${i + 1}`,
    desc: 'Deep dive into wellness techniques for holistic health.',
    image: `https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600&sig=${i}`,
    author: 'WellZen Team',
    authorAvatar: 'https://i.pravatar.cc/150?u=wellzent1',
    date: 'Feb 15, 2024',
    readTime: '5 min read'
  })),
  ...Array.from({ length: 25 }, (_, i) => ({
    id: 200 + i,
    tag: 'Yoga Practice',
    title: `Yoga Mastery Tutorial #${i + 1}`,
    desc: 'Master your flow with these detailed technical breakdowns.',
    image: `https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600&sig=${i}`,
    author: 'WellZen Team',
    authorAvatar: 'https://i.pravatar.cc/150?u=wellzent2',
    date: 'Jan 10, 2024',
    readTime: '7 min read'
  })),
  ...Array.from({ length: 15 }, (_, i) => ({
    id: 300 + i,
    tag: 'Beginner Tips',
    title: `Beginner Wellness Guide #${i + 1}`,
    desc: 'Everything you need to know to start your wellness journey.',
    image: `https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?auto=format&fit=crop&q=80&w=600&sig=${i}`,
    author: 'WellZen Team',
    authorAvatar: 'https://i.pravatar.cc/150?u=wellzent5',
    date: 'Dec 5, 2023',
    readTime: '4 min read'
  }))
];

export const BLOG_CATEGORIES = [
  { name: 'Mind & Body', icon: '🧠' },
  { name: 'Yoga Practice', icon: '🧘' },
  { name: 'Beginner Tips', icon: '✨' },
  { name: 'Nutrition', icon: '🥗' },
  { name: 'Meditation', icon: '⏳' },
  { name: 'Teacher Stories', icon: '👥' },
  { name: 'Lifestyle', icon: '🌿' },
];

export function getPostCountByCategory(categoryName: string): number {
  return BLOG_POSTS.filter(post => post.tag === categoryName).length;
}

export function getPostsByCategory(categoryName: string): BlogPost[] {
  if (categoryName === 'All') return BLOG_POSTS;
  return BLOG_POSTS.filter(post => post.tag === categoryName);
}

export function getRelatedPosts(postId: number): BlogPost[] {
  const currentPost = BLOG_POSTS.find(p => p.id === postId);
  if (!currentPost) return [];
  return BLOG_POSTS.filter(p => p.tag === currentPost.tag && p.id !== postId).slice(0, 3);
}
