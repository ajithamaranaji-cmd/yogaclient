import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { firestoreService } from '../services/firestore';
import { motion, useScroll, useTransform } from 'motion/react';
import { 
  Star, 
  CheckCircle, 
  Sparkles, 
  Globe, 
  Zap, 
  TrendingUp, 
  Users, 
  Target, 
  ArrowRight,
  ShieldCheck,
  Search,
  MessageCircle,
  Layout,
  BarChart3,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

export default function TeacherSignup() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const { scrollYProgress } = useScroll();

  const redirectTarget = location.state?.redirect || null;
  const planId = location.state?.planId || null;

  const scrollToForm = () => {
    const card = document.getElementById('join-form-card');
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create base user
      await firestoreService.updateDocument('users', user.uid, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: 'professional',
        profileImage: user.photoURL,
      });

      // Create initial pro profile
      await firestoreService.updateDocument('professionals', user.uid, {
        userId: user.uid,
        category: 'Yoga', // Default
        isPremium: false,
        leadsRemaining: 0,
        name: user.displayName,
        image: user.photoURL,
        city: 'New York', // Default for demo
        bio: 'Yoga and Wellness Expert',
        rating: 5.0,
      });

      // Create secure private premium info
      await firestoreService.updateDocument(`professionals/${user.uid}/private`, 'premium', {
        price: 95
      });

      // Create secure private contact subcollection as per new firestore rules
      await firestoreService.updateDocument(`professionals/${user.uid}/private`, 'contact', {
        whatsappNumber: '+1 (555) 792-8888', // Demo data
        email: user.email,
        website: 'expert-wellness.global'
      });

      if (redirectTarget) {
        navigate(redirectTarget);
        return;
      }
      if (planId) {
        navigate(`/checkout?plan=${planId}`);
        return;
      }

      // Take user directly to pricing/payment
      navigate('/pricing');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google Auth Popup or Firestore write was refused/blocked in this browser context.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-wellness-dawm/30 blur-[150px] rounded-full opacity-60 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-wellness-lavender/20 blur-[120px] rounded-full opacity-40 translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-32 md:py-48 flex flex-col lg:flex-row items-start gap-16 md:gap-32 relative z-10">
        <div className="flex-1 w-full lg:sticky lg:top-36">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 text-wellness-sage font-bold uppercase tracking-[0.4em] text-[10px] mb-8">
              <div className="w-12 h-[1px] bg-wellness-sage" />
              Expert Sanctuary
            </div>
            <h1 className="text-7xl md:text-9xl font-serif text-wellness-stone mb-10 leading-[0.85] tracking-tighter">
              Transform <br /> <span className="italic font-light text-wellness-muted">Your Influence</span>
            </h1>
            <p className="text-xl md:text-2xl text-wellness-muted mb-16 leading-relaxed max-w-xl font-serif italic text-pretty">
              Join a curated collective of elite wellness masters. We provide the infrastructure; you provide the transformation. All membership details are charged in USD.
            </p>

            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-700 p-6 rounded-2xl mb-8 text-xs text-left leading-relaxed max-w-xl">
                <p className="font-bold mb-1">Registration Error:</p>
                <code className="block bg-white/60 p-2 rounded border border-rose-100 font-mono text-[10px] break-all text-red-600 font-bold">
                  {error}
                </code>
              </div>
            )}

            <div className="flex items-center gap-8 opacity-40">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#FAF9F6] bg-wellness-dawm" />
                ))}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest">Joined by 2,400+ Vetted Masters</div>
            </div>
          </motion.div>
        </div>

        {/* Signup Form Container */}
        <div className="flex-1 w-full max-w-md">
          <motion.div
            id="join-form-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 backdrop-blur-md p-10 rounded-[48px] border border-stone-200/60 shadow-2xl"
          >
            <div className="mb-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#5d7a65] block mb-2">Apply as Expert</span>
              <h2 className="text-3xl font-serif text-wellness-stone mb-4">Master Registration</h2>
              <p className="text-xs text-wellness-muted leading-relaxed">Join using your Google account to secure your profile and choose your membership tier instantly.</p>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-3 bg-white border border-stone-200 py-4 rounded-2xl font-bold hover:bg-[#FAF9F6] transition-colors shadow-sm text-sm text-stone-700 h-14"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              <span>{loading ? 'Connecting...' : 'Continue with Google'}</span>
            </button>

            <p className="text-center mt-8 text-xs text-wellness-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-wellness-olive font-bold hover:underline">
                Sign In Here
              </Link>
            </p>
          </motion.div>
        </div>

        <div className="flex-1 relative w-full hidden">
          <motion.div
             initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
             animate={{ opacity: 1, scale: 1, rotate: 0 }}
             transition={{ duration: 1, ease: "easeOut" }}
             className="relative z-10"
          >
             <div className="relative group">
                <div className="absolute -inset-4 bg-wellness-sage/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-full" />
                <img 
                  src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200" 
                  alt="Wellness Expert" 
                  className="rounded-[80px] shadow-[0_80px_160px_rgba(93,122,101,0.15)] relative z-10 w-full object-cover aspect-[4/5] grayscale hover:grayscale-0 transition-all duration-1000"
                />
             </div>
             
             <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -top-12 -right-6 md:-right-12 bg-white/80 backdrop-blur-2xl p-10 rounded-[48px] shadow-3xl z-20 border border-white flex flex-col items-center text-center max-w-[280px]"
             >
                <div className="flex items-center space-x-1 mb-4 text-wellness-sage">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                </div>
                <div className="text-xl font-serif text-wellness-stone italic">"My business grew 4x in six months. The leads are highly qualified and ready to transform."</div>
                <div className="h-[1px] w-12 bg-wellness-sage/30 my-6" />
                <div className="text-[10px] text-wellness-muted font-bold uppercase tracking-widest">— Maya, Yoga Artisan</div>
             </motion.div>
          </motion.div>
        </div>
      </div>

      {/* The Growth Sanctuary Section */}
      <section id="how-it-works" className="py-40 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-32">
            <div className="label-caps mb-6 !text-wellness-sage">The Business Opportunity</div>
            <h2 className="text-6xl md:text-8xl font-serif text-wellness-stone mb-8 tracking-tighter">Sophisticated <span className="italic font-light text-wellness-muted">Growth</span>.</h2>
            <p className="text-xl text-wellness-muted italic max-w-2xl mx-auto font-serif">
              We've engineered the perfect ecosystem for wellness experts to flourish without the friction of digital marketing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-16">
              <GrowthPillar 
                icon={<Layout className="w-8 h-8" />}
                title="1. Divine Architecture"
                description="Your sanctuary profile is more than a resume. It's a high-converting digital portal that captures your essence, certifications, and previous transformations to build instant trust with seekers."
              />
              <GrowthPillar 
                icon={<Search className="w-8 h-8" />}
                title="2. Intelligent Discovery"
                description="Our resonance engine analyzes user intent, location, and vibration to feature you precisely when a seeker is ready. We don't just match keywords; we match intentions."
              />
              <GrowthPillar 
                icon={<MessageCircle className="w-8 h-8" />}
                title="3. Lead Alchemy & Conversion"
                description="Seamless connection through integrated WhatsApp, direct messaging, and booking portals. We reduce the cycle from discovery to session, ensuring higher conversion rates for your practice."
              />
            </div>
            
            <div className="relative">
              <div className="absolute -inset-10 bg-wellness-dawm/30 blur-[100px] rounded-full opacity-50" />
              <div className="bg-[#FAF9F6] rounded-[64px] p-12 border border-stone-100 shadow-2xl relative z-10 overflow-hidden group">
                 <div className="flex items-center justify-between mb-10">
                    <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-wellness-sage">Growth Dashboard</div>
                    <BarChart3 className="w-5 h-5 text-wellness-muted" />
                 </div>
                 
                 <div className="bg-white rounded-3xl p-8 mb-8 border border-stone-50">
                    <div className="flex items-center justify-between mb-6">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-wellness-muted">Lead Conversion Flow</span>
                       <span className="text-wellness-sage font-bold text-xs">+24% MoM</span>
                    </div>
                    <div className="flex items-end gap-2 h-32">
                       {[40, 65, 45, 90, 70, 85, 100].map((h, i) => (
                         <motion.div 
                           key={i}
                           initial={{ height: 0 }}
                           whileInView={{ height: `${h}%` }}
                           className="flex-1 bg-wellness-sage/20 hover:bg-wellness-sage rounded-t-lg transition-all cursor-pointer"
                         />
                       ))}
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="p-6 bg-wellness-sage text-white rounded-2xl flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <Users className="w-5 h-5" />
                          <span className="text-[11px] font-bold uppercase tracking-widest">Warm Leads This Month</span>
                       </div>
                       <span className="text-2xl font-serif tracking-tighter">48</span>
                    </div>
                    <div className="p-6 bg-wellness-stone text-white rounded-2xl flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <Target className="w-5 h-5" />
                          <span className="text-[11px] font-bold uppercase tracking-widest">Conversion Rate</span>
                       </div>
                       <span className="text-2xl font-serif tracking-tighter">32%</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step by Step Path */}
      <section className="py-40 bg-[#FAF9F6] relative border-y border-stone-100">
        <div className="max-w-7xl mx-auto px-6">
           <div className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-32">
              <div className="max-w-2xl">
                 <div className="label-caps mb-6">The Success Lifecycle</div>
                 <h2 className="text-6xl md:text-8xl font-serif text-wellness-stone tracking-tighter">Your Path to <br/><span className="italic font-light text-wellness-muted">Transformation</span></h2>
              </div>
              <p className="text-xl text-wellness-muted italic lg:text-right max-w-sm mb-4">A seamless journey from registration to consistent client growth.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
              {/* Connector Line */}
              <div className="hidden lg:block absolute top-[60px] left-20 right-20 h-[1px] bg-stone-200 z-0" />
              
              <Step 
                num="01" 
                title="Initiation" 
                desc="Apply and build your artisan profile. Every detail is vetted for excellence." 
              />
              <Step 
                num="02" 
                title="Discovery" 
                desc="Our resonance engine features you to thousands of seekers globally." 
              />
              <Step 
                num="03" 
                title="Connection" 
                desc="Receive high-quality leads directly to your sanctuary dashboard." 
              />
              <Step 
                num="04" 
                title="Fulfillment" 
                desc="Convert leads and grow your practice with recurring transformations." 
              />
           </div>
        </div>
      </section>

      {/* Subscription Benefits */}
      <section className="py-40 bg-wellness-stone text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-wellness-sage/10 blur-[150px] rounded-full translate-x-1/3 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                 <div className="flex items-center gap-4 text-wellness-dawm font-bold uppercase tracking-[0.4em] text-[10px] mb-8">
                    <Zap className="w-4 h-4 fill-current" />
                    Scaling Visibility
                 </div>
                 <h2 className="text-6xl md:text-8xl font-serif mb-10 tracking-tighter leading-[0.9]">Elevate Your <br/><span className="italic font-light text-stone-400">Resonance</span>.</h2>
                 <p className="text-xl text-stone-300 mb-12 leading-relaxed italic max-w-xl">
                   Subscription tiers are designed to match your growth phase. From emerging masters to global sanctuaries, we scale your reach.
                 </p>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16">
                    <BenefitCard 
                      icon={<ShieldCheck className="w-5 h-5" />} 
                      title="Elite Verification" 
                      desc="Boost trust by 45% with our vetted professional badge." 
                    />
                    <BenefitCard 
                      icon={<BarChart3 className="w-5 h-5" />} 
                      title="Deep Insights" 
                      desc="See exactly who is viewing your sanctuary and why." 
                    />
                    <BenefitCard 
                      icon={<Globe className="w-5 h-5" />} 
                      title="Top Placement" 
                      desc="Appear at the peak of search results for your city." 
                    />
                    <BenefitCard 
                      icon={<Calendar className="w-5 h-5" />} 
                      title="Active Booking" 
                      desc="Streamline your schedule with our integrated systems." 
                    />
                 </div>

                 <Link to="/pricing" className="inline-flex items-center gap-6 group text-white">
                    <span className="text-[11px] font-bold uppercase tracking-[0.4em]">View Pricing Tiers</span>
                    <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-wellness-stone transition-all duration-500">
                       <ArrowRight className="w-6 h-6" />
                    </div>
                 </Link>
              </div>

              <div className="relative flex justify-center">
                 <div className="absolute inset-0 bg-wellness-sage/20 blur-[120px] rounded-full scale-150 animate-pulse" />
                 <div className="bg-white/5 backdrop-blur-3xl p-16 rounded-[64px] border border-white/10 max-w-sm w-full text-center shadow-3xl">
                    <div className="w-24 h-24 bg-wellness-sage rounded-[32px] flex items-center justify-center text-white mx-auto mb-10 shadow-2xl">
                       <Sparkles className="w-10 h-10" />
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-wellness-dawm mb-4">Elite Choice</div>
                    <h3 className="text-4xl font-serif mb-6 text-white tracking-widest">PRO LEVEL</h3>
                    <div className="text-7xl font-serif mb-4">$99<span className="text-xs text-stone-400 font-sans tracking-widest ml-2">/mo</span></div>
                    <p className="text-xs text-stone-400 mb-12 uppercase tracking-[0.2em] leading-relaxed">Unlimited Discovery • Featured Status • Full Analytics</p>
                    <button 
                      onClick={scrollToForm}
                      className="w-full py-7 bg-white text-wellness-stone rounded-3xl text-[10px] font-bold uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-xl"
                    >
                      Enter the Sanctuary
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Final CTA Container */}
      <section className="py-40 bg-[#FAF9F6]">
        <div className="max-w-5xl mx-auto px-6">
           <motion.div 
             initial={{ opacity: 0, y: 40 }}
             whileInView={{ opacity: 1, y: 0 }}
             className="bg-white rounded-[72px] p-24 md:p-32 text-center border border-stone-100 shadow-2xl shadow-stone-200/20 relative overflow-hidden"
           >
              <div className="absolute top-0 right-0 w-64 h-64 bg-wellness-dawm/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-wellness-sage/10 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />
              
              <Sparkles className="w-16 h-16 text-wellness-sage mx-auto mb-12 animate-pulse" />
              <h2 className="text-6xl md:text-8xl font-serif text-wellness-stone mb-10 tracking-tighter">Ready to <br/><span className="italic font-light text-wellness-muted">Expand?</span></h2>
              <p className="text-2xl text-wellness-muted italic mb-16 max-w-xl mx-auto leading-relaxed">
                Your journey as a global wellness master begins with a single application.
              </p>
              
              <div className="flex flex-col items-center gap-8">
                <button
                  onClick={scrollToForm}
                  className="bg-wellness-stone text-white px-16 py-8 rounded-[40px] font-bold text-[12px] uppercase tracking-[0.5em] hover:bg-wellness-sage transition-all shadow-3xl hover:scale-105 active:scale-95"
                >
                  Apply as Expert Now
                </button>
                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-wellness-sage/60">
                   <ShieldCheck className="w-4 h-4" />
                   Fully Vetted Network
                </div>
              </div>
           </motion.div>
        </div>
      </section>
    </div>
  );
}

function GrowthPillar({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex gap-8 group">
       <div className="w-20 h-20 rounded-[32px] bg-wellness-sage/5 flex items-center justify-center text-wellness-sage border border-wellness-sage/10 group-hover:bg-wellness-sage group-hover:text-white transition-all duration-700 shrink-0 shadow-lg">
          {icon}
       </div>
       <div>
          <h3 className="text-3xl font-serif text-wellness-stone mb-4 group-hover:text-wellness-sage transition-colors duration-500">{title}</h3>
          <p className="text-lg text-wellness-muted leading-relaxed italic opacity-80">{description}</p>
       </div>
    </div>
  );
}

function Step({ num, title, desc }: { num: string, title: string, desc: string }) {
  return (
    <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
       <div className="w-32 h-32 rounded-full bg-white border border-stone-100 flex items-center justify-center mb-10 shadow-2xl relative">
          <div className="absolute inset-2 border border-dashed border-stone-200 rounded-full" />
          <span className="text-4xl font-serif text-wellness-stone italic">{num}</span>
       </div>
       <h3 className="text-2xl font-serif text-wellness-stone mb-4 tracking-[0.1em]">{title}</h3>
       <p className="text-sm text-wellness-muted leading-relaxed italic font-serif px-4 lg:px-0">
          {desc}
       </p>
    </div>
  );
}

function BenefitCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
       <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-wellness-dawm mb-6 group-hover:scale-110 transition-transform">
          {icon}
       </div>
       <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-2">{title}</h4>
       <p className="text-xs text-stone-400 leading-relaxed italic">{desc}</p>
    </div>
  );
}
