export const CATEGORIES = [
  "Yoga",
  "Yoga Therapy",
  "Kids Yoga",
  "Therapy",
  "Hatha Yoga", 
  "Prenatal Yoga", 
  "Meditation", 
  "Corporate Yoga", 
  "Power Yoga", 
  "Vinyasa Yoga", 
  "Ashtanga Yoga", 
  "Yin Yoga", 
  "Breathwork", 
  "Wellness Coaching", 
  "Mindfulness Training", 
  "Sound Healing",
  "Holistic Therapy",
  "Zen Mindfulness",
  "Acupuncture",
  "Forest Bathing",
  "Nutritional Wellness",
  "Bio-hacking",
  "Somatic Experiencing"
];

export const CITIES = [
  "New York", "Los Angeles", "Chicago", "Houston", "Miami", 
  "San Francisco", "Seattle", "Boston", "Austin", "Denver",
  "London", "Toronto", "Sydney", "Berlin", "Paris", "Tokyo", "Vancouver"
];

const IMAGES = [
  "https://images.unsplash.com/photo-1599447421416-3414500d18a5",
  "https://images.unsplash.com/photo-1528319725582-ddc0b6125f18",
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
  "https://images.unsplash.com/photo-1545389336-cf090694435e",
  "https://images.unsplash.com/photo-1594751439417-df7a1d32c900",
  "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04",
  "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b",
  "https://images.unsplash.com/photo-1512290923902-8a9f81dc2069",
  "https://images.unsplash.com/photo-1511497584788-876760111969",
  "https://images.unsplash.com/photo-1614859324967-b860361fb5cc",
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
  "https://images.unsplash.com/photo-1518611012118-696072aa579a",
  "https://images.unsplash.com/photo-1588282322699-3915599d81df",
  "https://images.unsplash.com/photo-1524863322182-70c85e270d4d",
  "https://images.unsplash.com/photo-1591228127791-8e2eaef098d3",
  "https://images.unsplash.com/photo-1545208393-2160291ba894",
  "https://images.unsplash.com/photo-1517130591727-4bf6900ee949",
  "https://images.unsplash.com/photo-1532798442725-41036acc7489",
  "https://images.unsplash.com/photo-1536640712247-c4547476f827",
  "https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539"
];

// Helper to generate realistic-looking data
const generateProfiles = () => {
  const data: any[] = [];
  let idCounter = 1;

  // Add 10 specific masters first to ensure high-quality featured data
  const masterNames = [
    { name: "Elena Vance", cat: "Vinyasa Yoga", city: "Santa Monica", yr: 12 },
    { name: "Marcus Thorne", cat: "Sound Healing", city: "Miami", yr: 15 },
    { name: "Sienna Rivers", cat: "Breathwork", city: "Austin", yr: 8 },
    { name: "Julian Gray", cat: "Meditation", city: "New York", yr: 10 },
    { name: "Aria Moon", cat: "Holistic Therapy", city: "Santa Monica", yr: 14 },
    { name: "Kaito Hiro", cat: "Zen Mindfulness", city: "Seattle", yr: 20 },
    { name: "Sofia Rossi", cat: "Power Yoga", city: "Chicago", yr: 9 },
    { name: "Liam Chen", cat: "Acupuncture", city: "Miami", yr: 18 },
    { name: "Nora Wilde", cat: "Forest Bathing", city: "Savannah", yr: 6 },
    { name: "Zoe Bloom", cat: "Nutrition", city: "Austin", yr: 11 }
  ];

  masterNames.forEach((m, idx) => {
    data.push({
      id: `master-${idx + 1}`,
      name: m.name,
      rating: 4.9,
      reviewCount: 300 + idx * 10,
      category: m.cat,
      city: m.city,
      address: `Studio ${idx + 1}, ${m.city}`,
      image: `${IMAGES[idx % IMAGES.length]}?auto=format&fit=crop&q=80&w=800`,
      bio: `Lead ${m.cat} expert with over ${m.yr} years of experience in ${m.city}. Dedicated to transformative wellness.`,
      isPremium: true,
      price: 120 + idx * 5,
      availability: "Full-time",
      languages: ["English", "Spanish"]
    });
  });

  CITIES.forEach(city => {
    for (let i = 1; i <= 20; i++) {
        const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
        const firstName = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Quinn", "Skyler", "Avery", "Parker"][Math.floor(Math.random() * 10)];
        const lastName = ["Smith", "Doe", "Johnson", "Brown", "Wilson", "Garcia", "Martine", "Lee", "Kim", "Chen"][Math.floor(Math.random() * 10)];
        const rating = (4.5 + Math.random() * 0.5).toFixed(1);

        data.push({
            id: `pro-${idCounter++}`,
            name: `${firstName} ${lastName}`,
            rating: parseFloat(rating),
            reviewCount: Math.floor(Math.random() * 200) + 20,
            category: category,
            city: city,
            address: `${Math.floor(Math.random() * 900) + 100} ${city.split(' ')[0]} Blvd, ${city}`,
            image: `${IMAGES[Math.floor(Math.random() * IMAGES.length)]}?auto=format&fit=crop&q=80&w=800`,
            bio: `Dedicated ${category} practitioner with over ${Math.floor(Math.random() * 15) + 3} years of experience in ${city}.`,
            isPremium: parseFloat(rating) >= 4.9,
            price: Math.floor(Math.random() * 100) + 60,
            availability: i % 3 === 0 ? "Weekends" : "Weekdays",
            languages: ["English"]
        });
    }
  });
  return data;
};

export const EXPERT_DATA = generateProfiles();

const TESTIMONIAL_AVATARS = [
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1489980508314-941910ded1f4?auto=format&fit=crop&q=80&w=150"
];

export const TESTIMONIALS = [
  { name: "Sarah L.", city: "Miami, FL", quote: "Yogaclientflow helped me find the perfect teacher who understands my needs and supports my journey.", avatar: TESTIMONIAL_AVATARS[0] },
  { name: "Michael R.", city: "Austin, TX", quote: "The meditation sessions are a game-changer for my daily stress management. Highly recommend the teachers here.", avatar: TESTIMONIAL_AVATARS[1] },
  { name: "Elena V.", city: "New York, NY", quote: "Finding a verified Ayurveda expert was so easy. The platform is beautiful and trustworthy.", avatar: TESTIMONIAL_AVATARS[2] },
  { name: "David P.", city: "Chicago, IL", quote: "Breathwork techniques I learned here helped me improve my recovery time significantly. Professional experts.", avatar: TESTIMONIAL_AVATARS[3] },
  { name: "Julian M.", city: "Los Angeles, CA", quote: "Wellness coaching has completely transformed my stress management approach. Pure gold platform.", avatar: TESTIMONIAL_AVATARS[4] },
  { name: "Aria K.", city: "Miami, FL", quote: "Sound healing sessions have become my weekly sanctuary. The practitioners are incredible and kind.", avatar: TESTIMONIAL_AVATARS[5] },
  { name: "Robert J.", city: "Seattle, WA", quote: "Highly professional service. I recommend this platform to all my colleagues seeking balance.", avatar: TESTIMONIAL_AVATARS[6] },
  { name: "Sophie C.", city: "Vancouver, BC", quote: "As a professional, I appreciate the vetting process. It brings quality leads to my doorstep.", avatar: TESTIMONIAL_AVATARS[7] },
  { name: "Zoe B.", city: "Austin, TX", quote: "Ayurvedic nutrition guidance helped me fix issues I've had for years. Truly holistic and deep.", avatar: TESTIMONIAL_AVATARS[8] },
  { name: "Liam O.", city: "London, UK", quote: "The mindfulness sessions are my secret weapon for high-pressure work days. Perfect for busy execs.", avatar: TESTIMONIAL_AVATARS[9] },
  { name: "Maya S.", city: "Berlin, DE", quote: "I never knew sound could heal until I tried the sessions here. Simply life-changing experience.", avatar: TESTIMONIAL_AVATARS[10] },
  { name: "Avery T.", city: "Sydney, AU", quote: "The best yoga platform I have used. The interface is clean and the teachers are top-notch.", avatar: TESTIMONIAL_AVATARS[11] },
  { name: "James K.", city: "Paris, FR", quote: "Wellness at your fingertips. I found a great therapist within minutes. Excellent service.", avatar: TESTIMONIAL_AVATARS[12] },
  { name: "Olivia W.", city: "Tokyo, JP", quote: "Yoga therapy has helped my posture more than any physical therapy session ever did.", avatar: TESTIMONIAL_AVATARS[13] },
  { name: "Noah G.", city: "Denver, CO", quote: "The forest bathing experience was unique. Yogaclientflow curators really know their stuff.", avatar: TESTIMONIAL_AVATARS[14] },
  { name: "Isabella D.", city: "Boston, MA", quote: "Vinyasa flow classes are high energy and perfectly paced. Found my regular instructor here.", avatar: TESTIMONIAL_AVATARS[0] },
  { name: "Ethan H.", city: "San Francisco, CA", quote: "Bio-hacking tips from experts here are backed by science. Very impressed with the quality.", avatar: TESTIMONIAL_AVATARS[1] },
  { name: "Mia L.", city: "Toronto, ON", quote: "The prenatal yoga classes were exactly what I needed. Safe, supportive, and empowering.", avatar: TESTIMONIAL_AVATARS[2] },
  { name: "Lucas M.", city: "Seattle, WA", quote: "Meditation has helped my focus at work. This platform makes it easy to stay consistent.", avatar: TESTIMONIAL_AVATARS[3] },
  { name: "Charlotte S.", city: "London, UK", quote: "Finding a zen mindfulness coach changed my outlook on everything. Forever grateful to Yogaclientflow.", avatar: TESTIMONIAL_AVATARS[4] },
  { name: "Benjamin F.", city: "Sydney, AU", quote: "Sound healing in the park was a highlight of my month. Great community events.", avatar: TESTIMONIAL_AVATARS[5] },
  { name: "Amelia P.", city: "Vancouver, BC", quote: "Hatha yoga at sunrise is my new favorite ritual. Thank you for connecting me to such talent.", avatar: TESTIMONIAL_AVATARS[6] },
  { name: "Alexander J.", city: "Berlin, DE", quote: "Professional, vetted, and convenient. The booking system is flawless and easy to use.", avatar: TESTIMONIAL_AVATARS[7] },
  { name: "Emma B.", city: "Paris, FR", quote: "The teachers here are more than just instructors, they are mentors. Found a great bond.", avatar: TESTIMONIAL_AVATARS[8] },
  { name: "William T.", city: "Tokyo, JP", quote: "I recommend Yogaclientflow to everyone I know. It's the gold standard for wellness markets.", avatar: TESTIMONIAL_AVATARS[9] },
  { name: "Sophia M.", city: "Houston, TX", quote: "Yin yoga has helped my flexibility immensely. The teachers are patient and knowledgeable.", avatar: TESTIMONIAL_AVATARS[10] },
  { name: "Daniel V.", city: "Miami, FL", quote: "Power yoga sessions are intense and rewarding. The best workout for mind and body.", avatar: TESTIMONIAL_AVATARS[11] },
  { name: "Emily K.", city: "New York, NY", quote: "The kids yoga classes are brilliant. My daughter loves them and shows more focus.", avatar: TESTIMONIAL_AVATARS[12] },
  { name: "Matthew G.", city: "Chicago, IL", quote: "Corporate yoga for my team was a hit. Boosted morale and reduced stress levels.", avatar: TESTIMONIAL_AVATARS[13] },
  { name: "Abigail H.", city: "Los Angeles, CA", quote: "Somatic experiencing was a new concept for me, but it worked wonders for my anxiety.", avatar: TESTIMONIAL_AVATARS[14] },
  { name: "Joseph C.", city: "San Francisco, CA", quote: "Acupuncture experts here are top-tier. My chronic pain has seen significant improvement.", avatar: TESTIMONIAL_AVATARS[0] },
  { name: "Grace W.", city: "Seattle, WA", quote: "Forest bathing sessions were a needed escape from the city hustle. Refreshing.", avatar: TESTIMONIAL_AVATARS[1] },
  { name: "Samuel R.", city: "Austin, TX", quote: "Nutritional wellness guidance was easy to follow and very effective. Feeling great.", avatar: TESTIMONIAL_AVATARS[2] },
  { name: "Chloe F.", city: "Denver, CO", quote: "Holistic therapy has balanced my lifestyle. I highly recommend exploration on Yogaclientflow.", avatar: TESTIMONIAL_AVATARS[3] },
  { name: "David S.", city: "Miami, FL", quote: "Yogaclientflow is the best investment I've made in myself this year. Top quality professionals.", avatar: TESTIMONIAL_AVATARS[4] },
  { name: "Victoria L.", city: "London, UK", quote: "Finding a teacher who aligns with my values was key. Yogaclientflow made that match possible.", avatar: TESTIMONIAL_AVATARS[5] },
  { name: "Jackson P.", city: "New York, NY", quote: "The interface is so smooth. Finding and booking a teacher takes less than 2 minutes.", avatar: TESTIMONIAL_AVATARS[6] },
  { name: "Mila K.", city: "Los Angeles, CA", quote: "The meditation series for beginners is excellent. Eased me into a habit I now love.", avatar: TESTIMONIAL_AVATARS[7] },
  { name: "Scarlett R.", city: "Chicago, IL", quote: "Sound healing at home was a luxury I didn't know I needed. Simply transcendent.", avatar: TESTIMONIAL_AVATARS[8] },
  { name: "Henry B.", city: "Austin, TX", quote: "Breathwork is the ultimate tool for clarity. The instructors here are world-class.", avatar: TESTIMONIAL_AVATARS[9] },
  { name: "Lily G.", city: "Miami, FL", quote: "The yoga therapy sessions solved my hip issues. I can't thank my teacher enough.", avatar: TESTIMONIAL_AVATARS[10] },
  { name: "Leo T.", city: "Toronto, ON", quote: "Wellness coaching provided the roadmap I needed to fix my sleep and energy levels.", avatar: TESTIMONIAL_AVATARS[11] }
];

