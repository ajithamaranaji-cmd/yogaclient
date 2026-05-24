import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { 
  Users, 
  Calendar as CalendarIcon, 
  DollarSign, 
  Search, 
  ChevronRight, 
  Crown,
  TrendingUp,
  Star,
  Leaf,
  LogOut,
  CreditCard,
  Video,
  Play,
  Share2,
  MapPin,
  Compass,
  CheckCircle,
  Clock,
  ExternalLink,
  Edit2,
  UserCheck
} from 'lucide-react';
import { firestoreService } from '../services/firestore';
import { getDoc, doc, updateDoc, where, orderBy, limit } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import Loading from '../components/ui/Loading';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import RazorpayButton from '../components/payment/RazorpayButton';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { 
  DASHBOARD_STATS, 
  LEAD_CHART_DATA, 
  UPCOMING_BOOKINGS, 
  TOP_SERVICES, 
  RECENT_REVIEWS, 
  LEAD_SOURCE_DATA, 
  ANALYTICS_TREND_DATA 
} from '../data/dashboardData';

const COLORS = ['#5D7A65', '#E6A071', '#918B76', '#D1D5DB'];

export default function Dashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Custom states for Teacher Premium & Profiling
  const [proProfile, setProProfile] = useState<any>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');

  // Profile Form States
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    bio: '',
    city: '',
    category: 'Yoga',
    location: ''
  });

  // Fetch pro-profile from database
  const fetchProProfile = async () => {
    if (!user) return;
    try {
      const docSnap = await getDoc(doc(db, 'professionals', user.uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProProfile(data);
        setVideoUrl(data.videoIntroUrl || '');
        setFormData({
          name: data.name || user.displayName || '',
          image: data.image || user.photoURL || '',
          bio: data.bio || '',
          city: data.city || '',
          category: data.category || 'Yoga',
          location: data.location || ''
        });
      }
    } catch (err) {
      console.error('Error fetching professional profile:', err);
    }
  };

  useEffect(() => {
    const initData = async () => {
      if (!user) return;
      try {
        await fetchProProfile();
        const res = await firestoreService.getCollection('leads', [
          where('professionalId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(5)
        ]);
        setLeads(res || []);
      } catch (err) {
        console.error('Error fetching leads:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) initData();
  }, [user]);

  if (authLoading || loading) return <Loading />;

  // 1. Block access if Student
  if (profile?.role === 'student') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FAF9F6] text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md bg-white p-10 rounded-[32px] border border-stone-100 shadow-2xl"
        >
          <Leaf className="w-12 h-12 text-wellness-sage mx-auto mb-6" />
          <h1 className="text-3xl font-serif text-wellness-stone mb-4 font-bold">Access Denied</h1>
          <p className="text-stone-400 text-sm mb-8 leading-relaxed">
            The teacher workspace dashboard is exclusively reserved for professional instructors. Students are not permitted to log in.
          </p>
          <button 
            onClick={async () => {
              await auth.signOut();
              navigate('/');
            }} 
            className="w-full py-4 bg-wellness-stone hover:bg-wellness-sage text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all"
          >
            Return to Homepage
          </button>
        </motion.div>
      </div>
    );
  }

  // 2. Validate Payment status (Only available after payment)
  const isPaid = profile?.isPremium === true || proProfile?.isPremium === true;

  const handlePaymentSuccess = async (response: any) => {
    if (!user) return;
    try {
      // Update both documents to fully synchronize payment
      await updateDoc(doc(db, 'users', user.uid), {
        isPremium: true,
        subscriptionExpiresAt: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
        credits: 30
      });
      await updateDoc(doc(db, 'professionals', user.uid), {
        isPremium: true
      });
      // Force reload page to fetch fresh credentials
      window.location.reload();
    } catch (err) {
      console.error('Error updating records after payment:', err);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  // Profile Complete/Update Action handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess('');
    setSaveError('');

    if (!user) return;
    try {
      await updateDoc(doc(db, 'professionals', user.uid), {
        name: formData.name,
        image: formData.image,
        bio: formData.bio,
        city: formData.city,
        category: formData.category,
        location: formData.location,
        profileSetupCompleted: true
      });

      setSaveSuccess('Your professional profile setup is successfully completed and updated!');
      await fetchProProfile();
      // Wait shortly then hide editing form (if already completions occurred)
      setTimeout(() => {
        setIsEditingProfile(false);
      }, 1500);
    } catch (err: any) {
      setSaveError(err.message || 'Operation failed. Verify security criteria.');
    }
  };

  // Video pasting link action
  const handleVideoLinkSave = async () => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'professionals', user.uid), {
        videoIntroUrl: videoUrl
      });
      setSaveSuccess('Video intro URL successfully saved!');
      
      // Auto play Drive or non-youtube link in new tab when pasted/saved
      const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') || videoUrl.includes('youtube-nocookie.com');
      if (videoUrl && !isYouTube) {
        window.open(videoUrl, '_blank');
      }

      await fetchProProfile();
    } catch (err) {
      console.error('Error saving video url:', err);
    }
  };

  // YouTube checker
  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') || videoUrl.includes('youtube-nocookie.com');

  const getYouTubeEmbedId = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  // If NOT paid, show gorgeous Paywall
  if (!isPaid) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-between">
        {/* Simple Premium Topnav Header */}
        <header className="px-6 md:px-12 py-6 bg-white border-b border-stone-100 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-wellness-sage flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-serif text-xl font-bold text-wellness-stone tracking-tight">Yogaclientflow</span>
          </Link>
          <button onClick={handleLogout} className="flex items-center space-x-2 text-stone-400 hover:text-red-500 transition-colors text-xs font-bold uppercase tracking-widest">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </header>

        {/* Outer Grid to display no data until payment */}
        <main className="flex-1 max-w-4xl mx-auto px-6 py-20 flex flex-col items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-white p-12 md:p-16 rounded-[48px] border border-stone-100 shadow-3xl text-center"
          >
            <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center text-wellness-sage mx-auto mb-10 border border-stone-100">
              <Crown className="w-10 h-10 animate-pulse" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif text-wellness-stone font-bold mb-4 tracking-tight">
              Unlock Your <span className="italic font-light text-wellness-sage">Teacher Sanctuary</span>
            </h1>
            <p className="text-stone-400 text-sm max-w-lg mx-auto mb-10 leading-relaxed font-light">
              Complete your one-time professional pass purchase. Until payment is completed, dashboard telemetry, customization controls, and client databases remain hidden.
            </p>

            {/* List key perks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mx-auto mb-12 text-left text-xs bg-stone-50 p-8 rounded-3xl border border-stone-100">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-wellness-sage" />
                <span className="font-medium text-stone-600">Infinite Student Leads Stream</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-wellness-sage" />
                <span className="font-medium text-stone-600">Video Demonstration Embedding</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-wellness-sage" />
                <span className="font-medium text-stone-600">Top Rank Search Placement</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-wellness-sage" />
                <span className="font-medium text-stone-600">Complete Profile Customization</span>
              </div>
            </div>

            <RazorpayButton 
              amount={2499} 
              planId="master_teacher_pass"
              label="Purchase Teacher Sanctuary Pass (₹2,499)"
              onSuccess={handlePaymentSuccess}
              className="w-full max-w-md mx-auto py-5 bg-wellness-stone hover:bg-wellness-sage rounded-2xl font-bold font-sans uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-stone-200"
            />
          </motion.div>
        </main>

        <footer className="py-8 text-center text-[10px] text-stone-300 uppercase tracking-widest border-t border-stone-50">
          Curated with peace and devotion © 2026 Yogaclientflow
        </footer>
      </div>
    );
  }

  // 3. User is Paid! Check if Profile Setup is Completed
  const isFirstTimeUser = !proProfile?.profileSetupCompleted;

  // Render Setup Or Edit Wizard
  const renderProfileSetupForm = () => {
    return (
      <div className="max-w-3xl mx-auto bg-white p-10 md:p-14 rounded-[36px] border border-stone-100 shadow-2xl">
        <div className="mb-8 border-b border-stone-50 pb-6 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-serif text-wellness-stone font-bold">
              {isFirstTimeUser ? 'Create Your Professional Sanctuary Profile' : 'Update Your Live Professional Profile'}
            </h2>
            <p className="text-stone-400 mt-1 text-xs">
              This info tells seekers who you are, what styles you guide, and where they can find you.
            </p>
          </div>
          {!isFirstTimeUser && (
            <button 
              onClick={() => setIsEditingProfile(false)}
              className="text-stone-400 hover:text-stone-600 text-xs font-bold uppercase tracking-widest"
            >
              Cancel
            </button>
          )}
        </div>

        {saveSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            {saveSuccess}
          </div>
        )}

        {saveError && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold rounded-xl">
            {saveError}
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Display/Name Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block">Expert Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full p-4 rounded-xl border border-stone-200 text-xs focus:ring-1 focus:ring-wellness-sage outline-none"
                placeholder="e.g. Guru Maya"
              />
            </div>

            {/* Profile image URL */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block">Profile Picture URL</label>
              <input 
                type="text" 
                required
                value={formData.image}
                onChange={e => setFormData({...formData, image: e.target.value})}
                className="w-full p-4 rounded-xl border border-stone-200 text-xs focus:ring-1 focus:ring-wellness-sage outline-none"
                placeholder="https://images.unsplash.com/photo-..."
              />
              <p className="text-[9px] text-stone-400">Pasting dynamic online URLs is fully supported.</p>
            </div>

            {/* Category dropdown */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block">Primary Style Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full p-4 rounded-xl border border-stone-200 bg-white text-xs focus:ring-1 focus:ring-wellness-sage outline-none"
              >
                <option value="Yoga">Yoga (Asana, Vinyasa, Flow)</option>
                <option value="Breathwork">Breathwork (Somatic Rebirthing)</option>
                <option value="Meditation">Zen Meditation & Mindfulness</option>
                <option value="Sound Healing">Vibrational Sound Bath</option>
              </select>
            </div>

            {/* City location */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block">Primary Service City</label>
              <input 
                type="text" 
                required
                value={formData.city}
                onChange={e => setFormData({...formData, city: e.target.value})}
                className="w-full p-4 rounded-xl border border-stone-200 text-xs focus:ring-1 focus:ring-wellness-sage outline-none"
                placeholder="e.g. Miami, New York, Online"
              />
            </div>
          </div>

          {/* Location details */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block">Workspace Studio Location Address</label>
            <input 
              type="text" 
              required
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
              className="w-full p-4 rounded-xl border border-stone-200 text-xs focus:ring-1 focus:ring-wellness-sage outline-none"
              placeholder="e.g. 102 Collins Ave Suite C, Miami Beach, FL"
            />
          </div>

          {/* Bio Description */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block">Bio (Somatic Bio Description & Approach)</label>
            <textarea 
              required
              rows={4}
              value={formData.bio}
              onChange={e => setFormData({...formData, bio: e.target.value})}
              className="w-full p-4 rounded-xl border border-stone-200 text-xs focus:ring-1 focus:ring-wellness-sage outline-none resize-none"
              placeholder="Add your story, background, focus styles, and the essence of your wellness practice..."
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-wellness-sage hover:bg-wellness-stone text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
          >
            {isFirstTimeUser ? 'Publish Sanctuary Profile' : 'Save and Update Changes'}
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA]">
      
      {/* 4. Single-Page Top Header Navigation Bar (NO SIDEBAR MENU) */}
      <nav className="sticky top-0 z-40 bg-white border-b border-stone-100 px-6 md:px-12 py-5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-wellness-sage flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-serif text-2xl font-bold text-wellness-stone tracking-tight">Yogaclientflow</span>
          </Link>

          {/* User profile quick reference & Sign Out */}
          <div className="flex items-center space-x-6">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-bold text-wellness-stone leading-tight">
                {proProfile?.name || user?.displayName}
              </span>
              <span className="text-[9px] text-stone-400 font-semibold uppercase tracking-wider mt-0.5">
                {proProfile?.category || 'Yoga'} Expert • Vetted Sanctuary
              </span>
            </div>
            <div className="relative">
              <img 
                src={proProfile?.image || user?.photoURL || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=150'} 
                className="w-10 h-10 rounded-xl object-cover border border-stone-100" 
                alt="Avatar" 
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <button 
              onClick={handleLogout} 
              className="text-stone-400 hover:text-red-500 transition-colors flex items-center gap-1.5"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        
        {/* State-Based Visual Form rendering */}
        {isFirstTimeUser ? (
          <div className="space-y-12">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="bg-emerald-50 text-wellness-sage px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Sanctuary Active
              </span>
              <h1 className="text-4xl font-serif text-wellness-stone font-bold mt-4 mb-2">First Time Activation</h1>
              <p className="text-stone-400 text-xs font-light">
                Your subscription is active. Complete your professional credentials to display your sanctuary in the index search and access the telemetry controls.
              </p>
            </div>
            {renderProfileSetupForm()}
          </div>
        ) : isEditingProfile ? (
          <div>
            {renderProfileSetupForm()}
          </div>
        ) : (
          /* Normal Dashboard displays gracefully */
          <div className="space-y-12">
            
            {/* Welcome banner + Edit profile clicker */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-8 md:p-10 rounded-[32px] border border-stone-100 shadow-sm">
               <div>
                  <h1 className="text-4xl font-serif text-wellness-stone flex items-center gap-3">
                    Warm welcome, {proProfile?.name?.split(' ')[0] || user?.displayName?.split(' ')[0]} <span className="text-wellness-sage">🌿</span>
                  </h1>
                  <p className="text-stone-400 mt-2 text-sm leading-relaxed max-w-lg">
                    Check your traffic stats, update your instructional videos, and analyze client resonance.
                  </p>
               </div>
               
               <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <button 
                    onClick={() => setIsEditingProfile(true)}
                    className="bg-stone-50 border border-stone-200 font-bold hover:bg-stone-100 text-wellness-stone rounded-xl px-5 py-3 text-xs flex items-center justify-center gap-2 shadow-sm"
                  >
                     <Edit2 className="w-4 h-4 text-wellness-sage" />
                     <span>Edit Profile Details</span>
                  </button>
                  <div className="bg-wellness-sage/5 border border-wellness-sage/10 rounded-xl px-5 py-3 flex items-center justify-center gap-3 shadow-none">
                     <span className="text-xs font-bold text-wellness-sage">Active Premium Teacher Sanctuary 🌟</span>
                  </div>
               </div>
            </div>

            {/* Video pastures segment (Paste video link from YouTube or Drive) */}
            <div className="bg-white p-8 md:p-10 rounded-[32px] border border-stone-100 shadow-sm">
               <div className="flex items-center gap-3 mb-6">
                  <Video className="w-6 h-6 text-wellness-sage" />
                  <h3 className="text-xl font-bold font-serif text-wellness-stone">Featured Video Introduction</h3>
               </div>
               <p className="text-stone-400 text-xs mb-8 max-w-2xl">
                 Educate seekers with a quick guide. Paste your video presentation link from <strong>YouTube</strong> or <strong>Google Drive</strong>. YouTube videos will stream natively inside the app, and Drive intros will open smoothly in a new tab. Files cannot be direct-uploaded.
               </p>

               <div className="flex flex-col md:flex-row gap-4 mb-8">
                  <input 
                    type="text" 
                    placeholder="Paste YouTube or Google Drive URL (e.g. https://www.youtube.com/watch?v=...)"
                    value={videoUrl}
                    onChange={e => setVideoUrl(e.target.value)}
                    className="flex-1 p-4 rounded-xl border border-stone-200 text-xs focus:ring-1 focus:ring-wellness-sage outline-none font-medium text-wellness-stone placeholder:text-stone-300"
                  />
                  <button 
                    onClick={handleVideoLinkSave}
                    className="px-8 py-4 bg-wellness-stone hover:bg-wellness-sage text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap shadow-md"
                  >
                     Save Link
                  </button>
               </div>

               {/* Stream inline if YouTube */}
               {videoUrl && isYouTube && getYouTubeEmbedId(videoUrl) ? (
                 <div className="max-w-2xl mx-auto overflow-hidden rounded-2xl bg-black shadow-lg">
                    <iframe 
                      width="100%" 
                      height="315" 
                      src={`https://www.youtube.com/embed/${getYouTubeEmbedId(videoUrl)}`} 
                      title="YouTube presentation" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      allowFullScreen
                      className="w-full aspect-video"
                    />
                 </div>
               ) : videoUrl ? (
                 <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between text-xs max-w-2xl mx-auto">
                    <div className="flex items-center gap-3">
                       <Play className="w-5 h-5 text-indigo-500 fill-indigo-500" />
                       <div>
                          <p className="font-bold text-stone-600">Google Drive / General Video Saved</p>
                          <p className="text-stone-400 text-[10px] truncate max-w-md">{videoUrl}</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => window.open(videoUrl, '_blank')}
                      className="px-4 py-2 bg-white hover:bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg font-bold flex items-center gap-2"
                    >
                       <span>Watch Video</span>
                       <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                 </div>
               ) : (
                 <div className="text-center py-10 bg-stone-50/50 rounded-2xl border border-stone-50 text-stone-400 text-xs italic">
                    No intro video link provided yet. Paste a link to inspire your visitors!
                 </div>
               )}
            </div>

            {/* Core telemetry details (Displayed exactly as it currently does) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               <StatGridCard label="Total Leads" value={DASHBOARD_STATS.totalLeads} trend={DASHBOARD_STATS.leadsTrend} icon={<Users className="w-6 h-6" />} color="bg-white" />
               <StatGridCard label="Bookings" value={DASHBOARD_STATS.bookings} trend={DASHBOARD_STATS.bookingsTrend} icon={<CalendarIcon className="w-6 h-6" />} color="bg-white" />
               <StatGridCard label="Earnings" value={`$${DASHBOARD_STATS.earnings.toLocaleString()}`} trend={DASHBOARD_STATS.earningsTrend} icon={<DollarSign className="w-6 h-6" />} color="bg-white" />
               <StatGridCard label="Profile Views" value={DASHBOARD_STATS.profileViews} trend={DASHBOARD_STATS.viewsTrend} icon={<Search className="w-6 h-6" />} color="bg-white" />
            </div>

            {/* Charts overview & Membership */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
               {/* Leads overview chart */}
               <div className="lg:col-span-9 bg-white p-10 rounded-[36px] border border-stone-100 shadow-sm">
                  <div className="flex justify-between items-center mb-10">
                     <h3 className="text-xl font-bold font-serif text-wellness-stone">Leads Overview</h3>
                     <span className="text-xs font-bold text-stone-400 uppercase bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-100">Performance</span>
                  </div>
                  <div className="h-[300px]">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={LEAD_CHART_DATA}>
                           <defs>
                              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#5D7A65" stopOpacity={0.1}/>
                                 <stop offset="95%" stopColor="#5D7A65" stopOpacity={0}/>
                              </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ECEBE7" />
                           <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} dy={15} />
                           <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
                           <Tooltip 
                             contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                             cursor={{ stroke: '#5D7A65', strokeWidth: 2 }}
                           />
                           <Area 
                             type="monotone" 
                             dataKey="leads" 
                             stroke="#5D7A65" 
                             strokeWidth={4} 
                             fillOpacity={1}
                             fill="url(#colorLeads)"
                             dot={{ r: 6, fill: '#5D7A65', strokeWidth: 3, stroke: '#fff' }} 
                            activeDot={{ r: 8, stroke: '#5D7A65', strokeWidth: 2 }}
                           />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-12 border-t border-stone-100 text-center">
                     <MiniStat label="New Leads" value="128" trend="+ 18%" />
                     <MiniStat label="Converted" value="27" trend="+ 12%" />
                     <MiniStat label="Conversion Rate" value="21%" trend="+ 3%" />
                     <MiniStat label="Response Rate" value="85%" trend="+ 5%" />
                  </div>
               </div>

               {/* Membership tier information */}
               <div className="lg:col-span-3 bg-[#1B3022] p-8 rounded-[36px] text-white flex flex-col justify-between relative overflow-hidden group shadow-xl">
                  <div className="absolute top-0 right-0 p-8">
                     <Crown className="w-8 h-8 text-amber-300 opacity-40 group-hover:scale-125 transition-transform duration-500" />
                  </div>
                  
                  <div>
                     <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-6 font-serif">Membership Tier</p>
                     <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-2xl font-bold">Premium Sanctuary</h3>
                        <span className="bg-emerald-500/30 text-emerald-300 text-[8px] font-bold uppercase px-2.5 py-1 rounded-md">Paid</span>
                     </div>
                     <p className="text-xs opacity-60 mb-8 leading-relaxed">Active Pass Subscription is dynamic and unlocked.</p>
                     
                     <div className="h-2 bg-white/15 rounded-full mb-10 overflow-hidden">
                        <div className="h-full bg-wellness-sage w-full rounded-full animate-pulse" />
                     </div>

                     <ul className="space-y-4 mb-10">
                        <BenefitItem text="Infinite leads contact" />
                        <BenefitItem text="Priority category listing" />
                        <BenefitItem text="Video embed integrations" />
                        <BenefitItem text="Full dashboard metrics" />
                     </ul>
                  </div>

                  <button 
                    onClick={() => alert("Sanctuary membership status is safe and active!")}
                    className="w-full py-4 bg-white text-wellness-stone rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-stone-100 transition-all shadow-md"
                  >
                     Active Membership <ChevronRight className="w-4 h-4" />
                  </button>
               </div>
            </div>

            {/* Bottom details grids (Upcoming bookings, services, analytics layout, reviews) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
               
               {/* Upcoming bookings and services */}
               <div className="lg:col-span-8 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     
                     {/* Upcoming Bookings */}
                     <div className="bg-white p-8 md:p-10 rounded-[36px] border border-stone-100 shadow-sm">
                        <div className="flex justify-between items-center mb-10">
                           <h3 className="text-xl font-bold font-serif text-wellness-stone">Upcoming Bookings</h3>
                           <span className="text-[9px] font-bold uppercase text-stone-400">Total 4</span>
                        </div>
                        <div className="space-y-6">
                           {UPCOMING_BOOKINGS.map(booking => (
                              <div key={booking.id} className="flex items-center justify-between group">
                                 <div className="flex items-center gap-4">
                                    <img src={booking.studentAvatar} className="w-12 h-12 rounded-xl object-cover border border-stone-50" alt={booking.studentName} />
                                    <div>
                                       <p className="text-sm font-bold text-wellness-stone leading-none">{booking.studentName}</p>
                                       <p className="text-[10px] text-stone-400 font-medium mt-1 uppercase tracking-wider">{booking.serviceName}</p>
                                       <p className="text-[8px] text-stone-400 mt-0.5">{booking.date} • {booking.time}</p>
                                    </div>
                                 </div>
                                 <span className={cn(
                                   "px-3 py-1 rounded-lg text-[8px] font-bold uppercase tracking-widest",
                                   booking.status === 'Confirmed' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                 )}>
                                    {booking.status}
                                 </span>
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* Top Services */}
                     <div className="bg-white p-8 md:p-10 rounded-[36px] border border-stone-100 shadow-sm">
                        <div className="flex justify-between items-center mb-10">
                           <h3 className="text-xl font-bold font-serif text-wellness-stone">Top Services</h3>
                           <span className="text-[9px] font-bold uppercase text-stone-400">Active</span>
                        </div>
                        <div className="space-y-6">
                           {TOP_SERVICES.map((service, i) => (
                              <div key={i} className="flex items-center gap-4 group">
                                 <img src={service.image} className="w-12 h-12 rounded-xl object-cover border border-stone-50" alt={service.name} />
                                 <div className="flex-1">
                                    <p className="text-sm font-bold text-wellness-stone leading-none">{service.name}</p>
                                    <p className="text-[10px] text-stone-400 font-medium mt-1">{service.bookings} bookings</p>
                                 </div>
                                 <div className="h-1 flex-1 bg-stone-100 rounded-full overflow-hidden ml-4">
                                    <div 
                                      className="h-full bg-wellness-sage rounded-full" 
                                      style={{ width: `${(service.bookings / 60) * 100}%` }} 
                                    />
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* Profile analytics visualizer */}
                  <div className="bg-white p-8 md:p-10 rounded-[36px] border border-stone-100 shadow-sm">
                     <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-bold font-serif text-wellness-stone">Profile Performance Analytics</h3>
                        <span className="text-[9px] font-bold uppercase text-stone-400">Metrics Breakdown</span>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="flex items-center gap-8">
                           <div className="w-36 h-36 flex-shrink-0">
                              <ResponsiveContainer width="100%" height="100%">
                                 <PieChart>
                                    <Pie
                                      data={LEAD_SOURCE_DATA}
                                      innerRadius={50}
                                      outerRadius={70}
                                      paddingAngle={5}
                                      dataKey="value"
                                    >
                                      {LEAD_SOURCE_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                      ))}
                                    </Pie>
                                    <Tooltip />
                                 </PieChart>
                              </ResponsiveContainer>
                           </div>
                           <div className="space-y-3">
                              <p className="text-[9px] font-bold text-stone-300 uppercase tracking-widest mb-4">Traffic Referral</p>
                              {LEAD_SOURCE_DATA.map((item, i) => (
                                 <div key={i} className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    <span className="text-[10px] font-bold text-stone-400">{item.name}</span>
                                    <span className="text-[10px] font-bold text-wellness-stone ml-auto">{item.value}%</span>
                                 </div>
                              ))}
                           </div>
                        </div>
                        <div>
                           <div className="flex justify-between items-center mb-6">
                              <p className="text-[9px] font-bold text-stone-300 uppercase tracking-widest">Resonance Trends</p>
                              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">↑ 18% weekly growth</span>
                           </div>
                           <div className="h-36">
                              <ResponsiveContainer width="100%" height="100%">
                                 <BarChart data={ANALYTICS_TREND_DATA}>
                                    <Bar 
                                      dataKey="value" 
                                      fill="#5D7A65" 
                                      radius={[4, 4, 0, 0]}
                                      barSize={12}
                                    />
                                 </BarChart>
                              </ResponsiveContainer>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Recent Reviews sidebar element */}
               <div className="lg:col-span-4 bg-white p-8 md:p-10 rounded-[36px] border border-stone-100 shadow-sm h-full flex flex-col justify-between">
                  <div>
                     <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-bold font-serif text-wellness-stone">Recent Reviews</h3>
                        <span className="text-[9px] font-bold uppercase text-stone-400">All Stars</span>
                     </div>
                     <div className="space-y-8">
                        {RECENT_REVIEWS.map(review => (
                           <div key={review.id} className="space-y-3 pb-6 border-b border-stone-50 last:border-0 last:pb-0">
                              <div className="flex items-center gap-3">
                                 <img src={review.avatar} className="w-10 h-10 rounded-full border border-stone-100" alt={review.author} />
                                 <div className="flex-1">
                                    <p className="text-xs font-bold text-wellness-stone leading-none">{review.author}</p>
                                    <div className="flex gap-0.5 mt-1">
                                       {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />)}
                                    </div>
                                 </div>
                                 <p className="text-[8px] text-stone-400 font-bold uppercase tracking-widest">{review.date}</p>
                              </div>
                              <p className="text-xs text-stone-400 leading-relaxed italic">"{review.comment}"</p>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

          </div>
        )}
      </main>

      <footer className="py-12 text-center text-stone-300 border-t border-stone-50 bg-white mt-20 text-xs">
         Managed with serenity & mindfulness. Yogaclientflow © 2026. All rights preserved.
      </footer>
    </div>
  );
}

function StatGridCard({ label, value, trend, icon, color }: any) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className={cn("p-8 rounded-[28px] transition-all hover:shadow-lg shadow-sm border border-stone-100 bg-white hover:border-wellness-sage/25 group", color)}
    >
       <div className="w-12 h-12 bg-stone-50 rounded-xl flex items-center justify-center text-stone-400 mb-8 transition-all group-hover:bg-wellness-sage group-hover:text-white">
          {icon}
       </div>
       <div className="space-y-2">
          <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">{label}</p>
          <p className="text-3xl font-bold text-wellness-stone tracking-tight">{value}</p>
          <p className="text-[10px] font-bold text-emerald-500 flex items-center gap-2">
             <TrendingUp className="w-3 h-3" /> {trend}
          </p>
       </div>
    </motion.div>
  );
}

function MiniStat({ label, value, trend }: any) {
  return (
    <div className="text-center group">
       <p className="text-[9px] font-bold text-stone-300 uppercase tracking-widest mb-1.5 group-hover:text-wellness-sage transition-colors">{label}</p>
       <p className="text-xl font-bold text-wellness-stone mb-1">{value}</p>
       <p className="text-[8px] font-bold text-emerald-500">{trend}</p>
    </div>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3 text-xs opacity-85 group">
       <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-all">
          <ChevronRight className="w-3 h-3 text-white" />
       </div>
       <span className="group-hover:translate-x-1 transition-all">{text}</span>
    </li>
  );
}
