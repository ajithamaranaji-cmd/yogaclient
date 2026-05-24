import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  Star, 
  ArrowRight, 
  CheckCircle2, 
  Calendar as CalendarIcon, 
  Globe, 
  Users, 
  Play, 
  Apple, 
  Leaf, 
  LogOut,
  BarChart2,
  Calendar,
  Lock,
  ChevronRight,
  ClipboardList,
  Heart,
  Smile
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import ProfileCarousel from '../components/ui/ProfileCarousel';
import { EXPERT_DATA, CATEGORIES, CITIES, TESTIMONIALS } from '../data/expertData';
import { useAuth } from '../contexts/AuthContext';

const WELLNESS_BRANDS = [
  { name: 'Yoga', logo: 'https://cdn.worldvectorlogo.com/logos/yoga-1.svg' },
  { name: 'Mindbody', logo: 'https://cdn.worldvectorlogo.com/logos/mindbody.svg' },
  { name: 'Yogateket', logo: 'https://www.yogateket.com/images/yogateket-logo.svg' },
  { name: 'Well+Good', logo: 'https://www.wellandgood.com/wp-content/themes/wellandgood/assets/images/well-and-good-logo.svg' },
  { name: 'Gaiam', logo: 'https://cdn.worldvectorlogo.com/logos/gaiam.svg' },
  { name: 'Alo', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Alo_Yoga_logo.svg' }
];

const VALUE_PROPS = [
  { icon: CheckCircle2, title: 'Verified Teachers', desc: 'All teachers are background-checked and verified.' },
  { icon: Calendar, title: 'Flexible Booking', desc: 'Book in-person, online, or at home on your schedule.' },
  { icon: Globe, title: 'Local & Global', desc: 'Find teachers near you or connect from anywhere.' },
  { icon: Star, title: 'Top Rated', desc: 'Loved by thousands of students worldwide with 4.9+ rating.' }
];

const POPULAR_CITIES = [
  { name: 'Miami, FL', count: '120+', image: 'https://images.unsplash.com/photo-1514249127356-ab76cda2f8f8?auto=format&fit=crop&q=80&w=600' },
  { name: 'New York, NY', count: '180+', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=600' },
  { name: 'Los Angeles, CA', count: '150+', image: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&q=80&w=600' },
  { name: 'Austin, TX', count: '90+', image: 'https://images.unsplash.com/photo-1531219432768-9f540ce91ef3?auto=format&fit=crop&q=80&w=600' },
  { name: 'Chicago, IL', count: '110+', image: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&q=80&w=600' },
];

export default function Home() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCity, setSelectedCity] = React.useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('category', searchQuery);
    if (selectedCity) params.set('location', selectedCity);
    navigate(`/search?${params.toString()}`);
  };

  const masters = EXPERT_DATA.filter(p => p.id.includes('master'));
  const trendingYoga = EXPERT_DATA.filter(p => p.category.includes('Yoga')).slice(0, 10);
  const topRated = EXPERT_DATA.sort((a, b) => b.rating - a.rating).slice(0, 10);
  const trendingMiami = EXPERT_DATA.filter(p => p.city === 'Miami').slice(0, 10);
  const breathworkExperts = EXPERT_DATA.filter(p => p.category.includes('Breathwork')).slice(0, 10);

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Side: Copy & Search */}
            <div className="relative z-10">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-stone-100 shadow-sm mb-8"
              >
                <div className="w-5 h-5 rounded-full bg-wellness-sage flex items-center justify-center mr-3">
                   <Leaf className="w-3 h-3 text-white" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-wellness-stone">The World's Trusted Yoga Platform</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl font-serif text-wellness-stone leading-[1.1] mb-8 tracking-tight"
              >
                Find your <br/> <span className="italic font-light text-wellness-sage">Center.</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-wellness-muted leading-relaxed mb-12 max-w-md"
              >
                Discover verified yoga teachers near you. Book in-person, online, or at home. Your practice. Your way.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-2 rounded-[24px] shadow-2xl shadow-stone-200/50 flex flex-col md:flex-row items-center gap-2 max-w-2xl"
              >
                <div className="flex-1 flex items-center px-6 py-4">
                  <MapPin className="w-4 h-4 text-wellness-sage mr-3" />
                  <input 
                    type="text" 
                    placeholder="Location"
                    className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-stone-300"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                  />
                </div>
                <div className="w-[1px] h-8 bg-stone-100 hidden md:block" />
                <div className="flex-1 flex items-center px-6 py-4">
                  <Search className="w-4 h-4 text-wellness-sage mr-3" />
                  <input 
                    type="text" 
                    placeholder="Yoga Style"
                    className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-stone-300"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button 
                  onClick={handleSearch}
                  className="px-10 py-4 bg-wellness-sage text-white rounded-full font-bold text-sm hover:bg-wellness-stone transition-all"
                >
                  Search
                </button>
              </motion.div>

              <div className="flex items-center gap-4 mt-12">
                <div className="flex -space-x-3">
                  {[
                    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100",
                    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100",
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100"
                  ].map((url, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-stone-100 overflow-hidden shadow-sm">
                      <img src={url} alt="User" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-wellness-sand text-wellness-sand" />)}
                  </div>
                  <p className="text-[10px] font-bold text-wellness-stone uppercase tracking-wider">
                    4.9/5 <span className="text-wellness-muted font-normal">from 2,000+ students</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side: Visual Composition */}
            <div className="relative h-[600px] hidden lg:block">
              {/* Main Image Plate */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="absolute top-0 right-0 w-[400px] h-[300px] rounded-[32px] overflow-hidden shadow-2xl z-0"
              >
                <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Yoga" />
              </motion.div>

              {/* Floating Card 1: Verified Teacher */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute top-20 right-[50px] w-64 bg-white p-6 rounded-3xl shadow-2xl z-20"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-4 h-4 rounded-full bg-wellness-sage flex items-center justify-center">
                    <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                  </div>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-wellness-muted">Verified Teacher</span>
                </div>
                <h4 className="font-serif text-lg mb-1">Home Yoga</h4>
                <p className="text-[10px] text-wellness-muted mb-2">From $45 / session</p>
                <p className="text-[10px] font-bold text-wellness-stone">Miami, FL</p>
              </motion.div>

              {/* Floating Card 2: Online Classes */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-10 right-[250px] w-64 bg-white p-6 rounded-3xl shadow-2xl z-20"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-4 h-4 rounded-full bg-wellness-sage flex items-center justify-center">
                    <Play className="w-2.5 h-2.5 text-white" />
                  </div>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-wellness-muted">Online Classes</span>
                </div>
                <h4 className="font-serif text-lg mb-1">Only $25 / class</h4>
                <p className="text-[10px] text-wellness-muted">Experience live flow anywhere.</p>
              </motion.div>

              {/* Secondary Image Plate */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: -50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute top-[150px] right-[250px] w-[350px] h-[250px] rounded-[32px] overflow-hidden shadow-2xl z-10 border-[8px] border-white"
              >
                <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Meditation" />
              </motion.div>

              {/* Background Leaf Decoration (placeholder or SVG) */}
              <div className="absolute -top-10 -right-20 opacity-10 blur-3xl w-96 h-96 bg-wellness-sage rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Teacher Workspace Command Center */}
      {profile?.role === 'professional' && (
        <section className="py-20 bg-white border-y border-stone-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-8">
              <div>
                <span className="text-wellness-sage font-bold uppercase tracking-widest text-[11px] block mb-2">Teacher Workspace</span>
                <h2 className="text-4xl font-serif text-wellness-stone font-bold tracking-tight">
                  Your Sanctuary Command Center
                </h2>
                <p className="text-stone-400 mt-1 text-sm font-light">
                  Manage your wellness practice, connect with seekers, and scale your impact.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  to="/dashboard"
                  className="bg-wellness-sage text-white px-6 py-3 rounded-xl text-xs font-bold hover:bg-wellness-stone transition-all shadow-lg shadow-wellness-sage/20 flex items-center gap-2"
                >
                  Go to Profile Dashboard
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Hub Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              
              {/* Card A: Leads Management */}
              <div className="bg-stone-50/50 p-8 rounded-3xl border border-stone-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 bg-emerald-50 rounded-2xl text-wellness-sage">
                      <ClipboardList className="w-6 h-6" />
                    </div>
                    <span className="bg-emerald-100/50 text-[#5D7A65] text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                      Leads Pipeline
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-wellness-stone mb-2">My Student Inquiries</h3>
                  <p className="text-stone-400 text-xs leading-relaxed mb-6">
                    View active seekers looking for classes. Connect through direct channels to unlock client relationships.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="p-4 bg-white rounded-xl border border-stone-100 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-wellness-stone">Sarah Jenkins</p>
                        <p className="text-stone-400 text-[10px]">Private Hatha • Miami, FL</p>
                      </div>
                      <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded text-[10px]">NEW</span>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-stone-100 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-wellness-stone">Marcus Vance</p>
                        <p className="text-stone-400 text-[10px]">Vinyasa Mastery • Online</p>
                      </div>
                      <span className="text-stone-400 font-bold bg-stone-50 px-2 py-0.5 rounded text-[10px]">CONTACTED</span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/leads"
                  className="w-full py-3 bg-wellness-stone hover:bg-wellness-sage text-white text-center rounded-xl text-xs font-bold uppercase tracking-widest transition-all block mt-4"
                >
                  Manage Leads
                </Link>
              </div>

              {/* Card B: Bookings and Registrations */}
              <div className="bg-stone-50/50 p-8 rounded-3xl border border-stone-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-500">
                      <Users className="w-6 h-6" />
                    </div>
                    <span className="bg-indigo-100/50 text-indigo-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                      Reservation Status
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-wellness-stone mb-2">Bookings Manager</h3>
                  <p className="text-stone-400 text-xs leading-relaxed mb-6">
                    Manage class attendance, set dynamic pricing structures, and view your upcoming course enrollments.
                  </p>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-stone-100 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center font-bold text-wellness-sage">A</div>
                        <div>
                          <p className="font-bold text-wellness-stone">Amanda Smith</p>
                          <p className="text-[10px] text-stone-400">Yin Yoga Restoration • $40.00</p>
                        </div>
                      </div>
                      <span className="text-blue-600 font-bold bg-blue-50 px-2.5 py-1 rounded text-[10px] uppercase">CONFIRMED</span>
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-stone-100 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center font-bold text-wellness-clay">B</div>
                        <div>
                          <p className="font-bold text-wellness-stone">Brian Lee</p>
                          <p className="text-[10px] text-stone-400">Yoga Nidra Block • $35.00</p>
                        </div>
                      </div>
                      <span className="text-amber-600 font-bold bg-amber-50 px-2.5 py-1 rounded text-[10px] uppercase">PENDING</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => alert("Bookings management loaded. All schedules are online!")}
                  className="w-full py-3 bg-white hover:bg-stone-100 text-wellness-stone text-center rounded-xl text-xs font-bold border border-stone-200 uppercase tracking-widest transition-all block mt-4"
                >
                  Manage Bookings
                </button>
              </div>

              {/* Card C: Interactive Studio Calendar */}
              <div className="bg-stone-50/50 p-8 rounded-3xl border border-stone-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-purple-50 rounded-2xl text-purple-500">
                    <CalendarIcon className="w-6 h-6" />
                  </div>
                  <span className="bg-purple-100/50 text-purple-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                    Studio Agenda
                  </span>
                </div>
                <h3 className="text-xl font-bold text-wellness-stone mb-2">Interactive Calendar Schedule</h3>
                <p className="text-stone-400 text-xs leading-relaxed mb-6">
                  Select available hours and block dates for holidays or master sessions.
                </p>

                <div className="p-4 bg-white rounded-2xl border border-stone-100 text-xs">
                  <div className="grid grid-cols-7 gap-1 text-center font-bold text-stone-400 mb-2 text-[10px]">
                    <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {[...Array(31)].map((_, i) => (
                      <button
                        key={i}
                        className={cn(
                          "py-2 rounded-lg font-medium transition-all hover:bg-stone-50",
                          i + 1 === 12 || i + 1 === 18 ? "bg-wellness-sage text-white font-bold" : "text-stone-600",
                          i + 1 === 15 ? "border-2 border-dashed border-wellness-sage" : ""
                        )}
                        onClick={() => alert(`Availability updated for May ${i + 1}, 2026!`)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-4 justify-center items-center text-[10px] text-stone-400">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-wellness-sage inline-block"></span> Active Classes</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full border border-dashed border-wellness-sage inline-block"></span> Draft Only</span>
                  </div>
                </div>
              </div>

              {/* Card D: Studio Analytics & Audience Insights */}
              <div className="bg-stone-50/50 p-8 rounded-3xl border border-stone-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 bg-amber-50 rounded-2xl text-amber-500">
                      <BarChart2 className="w-6 h-6" />
                    </div>
                    <span className="bg-amber-100/50 text-amber-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                      Performances
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-wellness-stone mb-2">Practice & Audience Analytics</h3>
                  <p className="text-stone-400 text-xs leading-relaxed mb-6">
                    Track profile interactions, monthly traffic metrics, and seeker conversion ratios securely.
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-center mb-4">
                    <div className="p-4 bg-white rounded-xl border border-stone-100">
                      <p className="text-xl font-bold text-wellness-stone">1,829</p>
                      <p className="text-[9px] text-stone-400 uppercase font-bold tracking-wider">Profile Views</p>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-stone-100">
                      <p className="text-xl font-bold text-green-600">82.4%</p>
                      <p className="text-[9px] text-stone-400 uppercase font-bold tracking-wider">Retention rate</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-stone-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-wellness-sage rounded-full" />
                    <span className="text-stone-500">Conversion Rate:</span>
                    <span className="font-bold text-wellness-stone">24.5%</span>
                  </div>
                  <span className="text-green-500 font-bold">↑ 2%</span>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* Trusted By Section */}
      <section className="py-12 border-t border-stone-100 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500 shrink-0">Trusted By Thousands</p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 items-center">
             {[
               { name: 'Mind', icon: Sparkles },
               { name: 'Body', icon: Leaf },
               { name: 'Yoga', icon: Heart },
               { name: 'Mental Wellness', icon: Smile }
             ].map((brand) => (
                <Link
                  key={brand.name}
                  to={`/search?category=${brand.name === 'Mental Wellness' ? 'Therapy' : brand.name}`}
                  className="group flex items-center gap-3 text-wellness-stone hover:text-wellness-sage font-serif italic text-2xl md:text-3xl transition-all duration-200 hover:scale-110 active:scale-95 px-2 cursor-pointer"
                >
                  <brand.icon className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" />
                  <span>{brand.name}</span>
                </Link>
             ))}
          </div>
        </div>
      </section>

      {/* Why Choose Yogaclientflow */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-serif text-wellness-stone mb-6">Why choose <br/> <span className="italic font-light text-wellness-sage">Yogaclientflow?</span></h2>
            <p className="text-lg text-wellness-muted max-w-lg mx-auto italic">A safe space to grow, heal and transform — with the best teachers by your side.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {VALUE_PROPS.map((prop, i) => (
              <motion.div 
                key={prop.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-stone-50 flex items-center justify-center mx-auto text-wellness-sage">
                  <prop.icon className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-serif font-bold text-wellness-stone">{prop.title}</h4>
                <p className="text-sm text-wellness-muted leading-relaxed">{prop.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Scroller overhaul */}
      <section className="py-12 border-y border-stone-100 bg-[#FAF9F6] overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap gap-16 items-center">
          {[...CATEGORIES, ...CATEGORIES].map((cat, i) => (
            <Link 
              key={`${cat}-${i}`}
              to={`/search?category=${cat}`}
              className="text-wellness-stone hover:text-wellness-sage font-serif italic text-3xl transition-all duration-200 hover:scale-110 active:scale-95 inline-block px-4"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Yoga Masters */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif text-wellness-stone mb-4">Featured Yoga Masters</h2>
            <p className="text-wellness-muted italic">Handpicked professionals to guide your wellness journey.</p>
          </div>
          <Link to="/search" className="text-[10px] font-bold uppercase tracking-[0.3em] text-wellness-stone flex items-center group">
            View all teachers <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <ProfileCarousel profiles={trendingYoga} />
      </section>
      
      {/* Visual Quote / Mission */}
      <section className="py-40 px-4 relative overflow-hidden bg-white">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-wellness-dawn/20 blur-[150px] rounded-full"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 items-center relative z-10">
          <div className="space-y-10 order-2 md:order-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-10 py-3 rounded-full bg-wellness-sage/5 text-[9px] font-bold uppercase tracking-[0.4em] text-wellness-sage border border-wellness-sage/10 mb-6"
            >
              The Collective Identity
            </motion.div>
            <h2 className="text-6xl md:text-8xl font-serif text-wellness-stone leading-[0.9] tracking-tighter">
              A Global <br/><span className="italic font-light text-wellness-sage">Sanctuary</span> of Transformation.
            </h2>
            <p className="text-xl text-wellness-muted italic leading-relaxed max-w-lg">
              We vet every practitioner for both certification and somatic excellence, ensuring your journey is as safe as it is powerful.
            </p>
            <div className="grid grid-cols-2 gap-12 pt-10">
               <div>
                  <div className="text-5xl font-serif text-wellness-sage mb-2">300+</div>
                  <div className="text-[9px] font-bold text-stone-300 uppercase tracking-widest leading-relaxed">Globally Vetted<br/>Wellness Experts</div>
               </div>
               <div>
                  <div className="text-5xl font-serif text-wellness-sage mb-2">12k</div>
                  <div className="text-[9px] font-bold text-stone-300 uppercase tracking-widest leading-relaxed">Active Members<br/>Daily Sanctuary</div>
               </div>
            </div>
            <button className="button-secondary border-none bg-stone-50 px-12 py-6 rounded-2xl hover:bg-wellness-sage hover:text-white mt-12">Read Our Manifesto</button>
          </div>
          
          <div className="grid grid-cols-2 gap-6 order-1 md:order-2">
             <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="space-y-6 pt-16">
               <div className="rounded-[40px] overflow-hidden aspect-[4/5] premium-card"><img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110" alt="Healing" /></div>
               <div className="rounded-[40px] overflow-hidden aspect-[1/1] premium-card shadow-wellness-dawn/20"><img src="https://images.unsplash.com/photo-1594751439417-df7a1d32c900?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110" alt="Healing" /></div>
             </motion.div>
             <motion.div initial={{ opacity: 0, y: -30 }} whileInView={{ opacity: 1, y: 0 }} className="space-y-6">
               <div className="rounded-[40px] overflow-hidden aspect-[1/1] premium-card shadow-wellness-sunset/20"><img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110" alt="Healing" /></div>
               <div className="rounded-[40px] overflow-hidden aspect-[4/5] premium-card"><img src="https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110" alt="Healing" /></div>
             </motion.div>
          </div>
        </div>
      </section>

      <ProfileCarousel 
        title="Top Rated Teachers" 
        subtitle="Highly rated by students for their expertise and care."
        profiles={topRated} 
      />

      {/* Find Wellness in Your City */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-wellness-stone">Find Wellness in Your City</h2>
            <Link to="/search" className="text-[10px] font-bold uppercase tracking-[0.3em] text-wellness-stone flex items-center group">
              View all cities <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {POPULAR_CITIES.map((city, i) => (
              <motion.div 
                key={city.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                onClick={() => navigate(`/search?location=${city.name.split(',')[0]}`)}
                className="relative h-[400px] rounded-[32px] overflow-hidden cursor-pointer group shadow-lg"
              >
                <img src={city.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={city.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h4 className="text-white text-xl font-bold mb-1">{city.name}</h4>
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{city.count} Teachers</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Marquee */}
      <section className="py-32 bg-[#FAF9F6] overflow-hidden border-t border-stone-100">
        <div className="max-w-7xl mx-auto px-4 mb-20 text-center">
          <h2 className="text-5xl md:text-6xl font-serif text-wellness-stone mb-6">
            Loved by our <span className="italic font-light text-wellness-sage">Community.</span>
          </h2>
          <p className="text-lg text-wellness-muted italic">Hear from thousands of students who found their center with Yogaclientflow.</p>
        </div>

        <div className="space-y-12">
          {/* Row 1: Left to Right */}
          <div className="flex overflow-hidden group">
            <div className="flex animate-marquee hover:[animation-play-state:paused] gap-8 py-4 whitespace-nowrap">
              {[...TESTIMONIALS.slice(0, 21), ...TESTIMONIALS.slice(0, 21)].map((t, i) => (
                <div 
                  key={i} 
                  className="w-[400px] shrink-0 p-8 rounded-[32px] bg-white border border-stone-100 shadow-sm transition-all hover:border-wellness-sage/20 hover:shadow-xl hover:shadow-wellness-sage/5"
                >
                  <p className="text-wellness-stone text-lg font-serif italic mb-8 leading-relaxed whitespace-normal line-clamp-3">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-stone-100">
                      <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-wellness-stone uppercase tracking-widest">{t.name}</h4>
                      <p className="text-[10px] text-wellness-muted font-bold uppercase tracking-[0.2em]">{t.city}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Right to Left */}
          <div className="flex overflow-hidden group">
            <div className="flex animate-marquee-reverse hover:[animation-play-state:paused] gap-8 py-4 whitespace-nowrap">
              {[...TESTIMONIALS.slice(21), ...TESTIMONIALS.slice(21)].map((t, i) => (
                <div 
                  key={i} 
                  className="w-[400px] shrink-0 p-8 rounded-[32px] bg-white border border-stone-100 shadow-sm transition-all hover:border-wellness-sage/20 hover:shadow-xl hover:shadow-wellness-sage/5"
                >
                  <p className="text-wellness-stone text-lg font-serif italic mb-8 leading-relaxed whitespace-normal line-clamp-3">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-stone-100">
                      <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-wellness-stone uppercase tracking-widest">{t.name}</h4>
                      <p className="text-[10px] text-wellness-muted font-bold uppercase tracking-[0.2em]">{t.city}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Teacher CTA Section */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto rounded-[40px] bg-wellness-sage p-12 md:p-24 relative overflow-hidden shadow-2xl shadow-wellness-sage/20">
          <div className="absolute inset-0 z-0">
             <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover opacity-10" alt="Background" />
          </div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-10">
              <h2 className="text-5xl md:text-7xl font-serif text-white leading-tight underline decoration-wellness-sunset/30 underline-offset-8">
                Are you a <br/> Yoga Teacher?
              </h2>
              <p className="text-xl text-white/60 italic leading-relaxed">
                Join our community of elite wellness professionals and grow your impact.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-8">
                 <div className="space-y-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white">
                       <Search className="w-6 h-6" />
                    </div>
                    <p className="text-[10px] font-bold text-white uppercase tracking-widest leading-relaxed">Get discovered by students near you</p>
                 </div>
                 <div className="space-y-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white">
                       <Calendar className="w-6 h-6" />
                    </div>
                    <p className="text-[10px] font-bold text-white uppercase tracking-widest leading-relaxed">Flexible classes on your terms</p>
                 </div>
                 <div className="space-y-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white">
                       <Globe className="w-6 h-6" />
                    </div>
                    <p className="text-[10px] font-bold text-white uppercase tracking-widest leading-relaxed">Grow your brand and your business</p>
                 </div>
              </div>
            </div>

            <div className="w-full lg:w-[400px]">
               <div className="bg-white p-10 rounded-[32px] text-center shadow-2xl">
                 <Link to="/signup/teacher" className="button-primary w-full py-8 text-sm tracking-[0.4em] mb-6 inline-block">Join as a Teacher</Link>
                 <p className="text-[10px] text-wellness-muted font-bold uppercase tracking-widest">Already a member? <Link to="/login" className="text-wellness-sage underline underline-offset-4">Log in</Link></p>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
