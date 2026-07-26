import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { 
  Star, 
  MapPin, 
  ShieldCheck, 
  Globe, 
  MessageCircle, 
  Calendar, 
  CheckCircle2, 
  Lock, 
  Award,
  ArrowRight,
  ArrowLeft,
  Phone,
  Mail,
  ExternalLink,
  X,
  ChevronRight,
  Heart,
  Zap,
  Layout,
  StarOff
} from 'lucide-react';
import { firestoreService } from '../services/firestore';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/ui/Loading';
import { EXPERT_DATA } from '../data/expertData';
import RazorpayButton from '../components/payment/RazorpayButton';

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    subscription, 
    isPremium, 
    unlockProfileContact, 
    saveProfile, 
    removeSavedProfile,
    purchasePremium,
    purchaseCredits 
  } = useSubscription();
  
  const [pro, setPro] = React.useState<any>(null);
  const [contactInfo, setContactInfo] = React.useState<any>(null);
  const [premiumInfo, setPremiumInfo] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = React.useState(false);
  const [showCreditsModal, setShowCreditsModal] = React.useState(false);
  const [isUnlocking, setIsUnlocking] = React.useState(false);

  const isUnlocked = subscription.unlockedProfiles.includes(id || '');
  const isSaved = subscription.savedProfiles.includes(id || '');

  React.useEffect(() => {
    const fetchPro = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const firebasePro = await firestoreService.getDocument('professionals', id);
        if (firebasePro) {
          const userDoc = await firestoreService.getDocument('users', id);
          setPro({ ...firebasePro, user: userDoc });
        } else {
          const localPro = EXPERT_DATA.find(p => p.id === id);
          if (localPro) {
            setPro({
              ...localPro,
              user: {
                displayName: localPro.name,
                profileImage: localPro.image,
                city: localPro.city,
                country: 'USA'
              }
            });
          }
        }
      } catch (err) {
        const localPro = EXPERT_DATA.find(p => p.id === id);
        if (localPro) {
          setPro({
            ...localPro,
            user: {
              displayName: localPro.name,
              profileImage: localPro.image,
              city: localPro.city,
              country: 'USA'
            }
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPro();
  }, [id]);

  React.useEffect(() => {
    const fetchProtectedData = async () => {
      if (!id || !user) {
        setContactInfo(null);
        setPremiumInfo(null);
        return;
      }
      
      // Fetch Premium Info (Pricing) if Premium
      if (isPremium) {
        try {
          const pInfo = await firestoreService.getDocument<any>(`professionals/${id}/private`, 'premium');
          if (pInfo) setPremiumInfo(pInfo);
          else {
            const localPro = EXPERT_DATA.find(p => p.id === id);
            if (localPro) setPremiumInfo({ price: localPro.price });
          }
        } catch (e) {
          setPremiumInfo(null);
        }
      }

      // Fetch Contact Info if Unlocked
      if (isUnlocked) {
        try {
          const info = await firestoreService.getDocument<any>(`professionals/${id}/private`, 'contact');
          if (info) {
            setContactInfo(info);
          } else {
            // Fallback for local data demo
            const localPro = EXPERT_DATA.find(p => p.id === id);
            if (localPro) {
              setContactInfo({
                whatsappNumber: localPro.whatsappNumber || '+1 (555) 792-8888',
                email: `${localPro.name.toLowerCase().replace(" ", ".")}@wellness.global`,
                website: localPro.website || 'elite-healing.org'
              });
            }
          }
        } catch (error) {
          setContactInfo(null);
        }
      } else {
        setContactInfo(null);
      }
    };
    fetchProtectedData();
  }, [id, user, isUnlocked, isPremium]);

  const handleUnlock = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!isPremium) {
      setShowUpgradeModal(true);
      return;
    }
    if (subscription.credits <= 0) {
      setShowCreditsModal(true);
      return;
    }

    setIsUnlocking(true);
    const success = await unlockProfileContact(id!);
    setIsUnlocking(false);
  };

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || !isPremium) {
      setShowUpgradeModal(true);
      return;
    }
    if (isSaved) {
      await removeSavedProfile(id!);
    } else {
      await saveProfile(id!);
    }
  };

  if (loading) return <Loading />;
  if (!pro) return <div className="p-20 text-center font-serif text-2xl">Expert not found.</div>;

  return (
    <div className="bg-[#FAF9F6] min-h-screen relative">
      {/* Back Button */}
      <div className="fixed top-24 left-8 z-[60] hidden lg:block">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 bg-white/80 backdrop-blur-md border border-stone-100 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105"
        >
          <div className="w-8 h-8 rounded-full bg-wellness-stone text-white flex items-center justify-center transition-transform group-hover:-translate-x-1">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-wellness-stone pr-2">Back</span>
        </button>
      </div>
      {/* Cover Profile */}
      <div className="h-[45vh] w-full relative overflow-hidden">
        <img 
          src={pro.image || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=2000"} 
          className="w-full h-full object-cover"
          alt="Cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] via-[#FAF9F6]/20 to-transparent" />
        <div className="absolute inset-0 bg-[#E0EBF1]/30 backdrop-blur-[2px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-64 relative z-10 pb-32">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Column */}
          <div className="flex-1 space-y-12">
            {/* Header Info */}
            <div className="bg-white/80 backdrop-blur-2xl rounded-[48px] p-10 md:p-16 border border-white shadow-2xl shadow-stone-200/40">
              <div className="flex flex-col md:flex-row gap-12 items-center md:items-start text-center md:text-left">
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-[56px] overflow-hidden border-8 border-white shadow-2xl flex-shrink-0 -mt-20 md:-mt-32 relative group">
                  <img src={pro.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={pro.name} />
                  <div className="absolute inset-x-0 bottom-0 p-6 flex justify-center translate-y-full group-hover:translate-y-0 transition-all duration-500">
                     <button 
                       onClick={handleSaveToggle}
                       className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center shadow-xl backdrop-blur-xl transition-all",
                        isSaved ? "bg-wellness-sage text-white" : "bg-white/80 text-wellness-muted hover:bg-white"
                       )}
                     >
                       <Heart className={cn("w-6 h-6", isSaved && "fill-current")} />
                     </button>
                  </div>
                </div>
                <div className="flex-1 w-full">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 w-full">
                    <div>
                      <h1 className="text-6xl md:text-8xl font-serif text-wellness-stone tracking-tighter mb-4">{pro.name}</h1>
                      <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-[10px] font-bold uppercase tracking-[0.3em] text-wellness-muted">
                        <span className="text-wellness-sage">{pro.category}</span>
                        <span className="w-1 h-1 bg-stone-200 rounded-full" />
                        <span className="flex items-center"><MapPin className="w-3 h-3 mr-2" />{pro.city}</span>
                        {pro.rating >= 4.9 && <span className="bg-wellness-dawn text-wellness-stone px-3 py-1 rounded-full border border-white">Elite Verified</span>}
                      </div>
                    </div>
                    <div className="flex items-center justify-center md:justify-end gap-3 px-8 py-5 bg-[#FAF9F6] rounded-3xl border border-stone-100">
                      <Star className="w-5 h-5 fill-wellness-sage text-wellness-sage" />
                      <span className="text-3xl font-serif text-wellness-stone">{pro.rating}</span>
                      <span className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">/ 5.0</span>
                    </div>
                  </div>

                  <p className="text-wellness-muted text-2xl leading-relaxed italic mb-12 font-serif opacity-80">
                    "{pro.bio}"
                  </p>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-10 border-t border-stone-50">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-stone-300 uppercase tracking-[0.3em]">Experience</span>
                      <p className="text-xl font-serif text-wellness-stone">{pro.experience || 10}+ Years</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-stone-300 uppercase tracking-[0.3em]">Session Fee</span>
                      <p className={cn("text-xl font-serif text-wellness-stone transition-all duration-700", !premiumInfo && "blur-xl select-none")}>
                        {premiumInfo ? `$${premiumInfo.price || 95}` : "$***"}<span className="text-xs font-sans italic">/hr</span>
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-stone-300 uppercase tracking-[0.3em]">Language</span>
                      <div className="flex gap-2">
                        {pro.languages?.map((l: string) => <span key={l} className="text-sm font-serif">{l}</span>) || <span className="text-sm font-serif">English</span>}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-stone-300 uppercase tracking-[0.3em]">Vetting</span>
                      <p className="text-sm font-serif text-wellness-sage">Vetted Global Master</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Tabs / Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-white/60 backdrop-blur-xl rounded-[40px] p-12 border border-white shadow-xl shadow-stone-200/20">
                <h3 className="text-2xl font-serif text-wellness-stone mb-8 flex items-center">
                  <Award className="w-6 h-6 mr-4 text-wellness-sage" />
                  Master Credentials
                </h3>
                <ul className="space-y-6">
                  {['Registered Yogaclientflow Master', 'Advanced Somatic Practice Certification', 'Ethical Standards Vetted by Collective'].map((c, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-wellness-sage/10 flex items-center justify-center shrink-0 mt-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-wellness-sage" />
                      </div>
                      <span className="text-wellness-muted leading-relaxed italic">{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/60 backdrop-blur-xl rounded-[40px] p-12 border border-white shadow-xl shadow-stone-200/20">
                <h3 className="text-2xl font-serif text-wellness-stone mb-8 flex items-center">
                  <Globe className="w-6 h-6 mr-4 text-wellness-sage" />
                  Elite Methodology
                </h3>
                <p className="text-wellness-muted italic leading-relaxed mb-8">
                  Integrating ancient traditions with modern neuroscience for profound physical and mental transformation.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Holistic', 'Vedic', 'Binaural', 'Somatic', 'Vetted'].map(tag => (
                    <span key={tag} className="px-5 py-2 bg-white rounded-full text-[9px] font-bold uppercase tracking-widest text-wellness-stone/40 border border-stone-50 transition-all hover:border-wellness-sage/20 hover:text-wellness-sage">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Protected Contact Section overhauled to light glass */}
            <div className="bg-[#E0EBF1]/40 backdrop-blur-3xl rounded-[48px] p-12 md:p-20 border border-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-1/2 h-full bg-wellness-sage/10 blur-[120px] rounded-full translate-x-1/2" />
               <div className="absolute bottom-0 left-0 w-1/2 h-full bg-wellness-sunset/20 blur-[120px] rounded-full -translate-x-1/2" />
               
               <h3 className="text-4xl md:text-5xl font-serif mb-12 flex items-center relative z-10 text-wellness-stone tracking-tighter">
                 <Lock className="w-8 h-8 mr-6 text-wellness-sage" />
                 Elite Connection
               </h3>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
                 <div className="space-y-10">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-[24px] bg-white flex items-center justify-center shadow-xl shadow-wellness-dawn/20">
                        <Phone className="w-6 h-6 text-wellness-sage" />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-wellness-muted uppercase tracking-[0.3em] mb-1">Secure Line</p>
                        <p className={cn("text-2xl font-serif tracking-widest text-wellness-stone transition-all duration-700", !contactInfo && "blur-xl select-none")}>
                          {contactInfo ? contactInfo.whatsappNumber : "************"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-[24px] bg-white flex items-center justify-center shadow-xl shadow-wellness-dawn/20">
                        <Mail className="w-6 h-6 text-wellness-sage" />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-wellness-muted uppercase tracking-[0.3em] mb-1">Encrypted Email</p>
                        <p className={cn("text-2xl font-serif tracking-tight text-wellness-stone transition-all duration-700", !contactInfo && "blur-xl select-none")}>
                          {contactInfo ? contactInfo.email : "****************"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-[24px] bg-white flex items-center justify-center shadow-xl shadow-wellness-dawn/20">
                        <ExternalLink className="w-6 h-6 text-wellness-sage" />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-wellness-muted uppercase tracking-[0.3em] mb-1">Private Channel</p>
                        <p className={cn("text-2xl font-serif text-wellness-stone transition-all duration-700", !contactInfo && "blur-xl select-none")}>
                          {contactInfo ? contactInfo.website : "***********"}
                        </p>
                      </div>
                    </div>
                 </div>

                 {/* Messaging Interface */}
                 <div className={cn(
                    "p-12 rounded-[40px] border flex flex-col items-center justify-center text-center transition-all duration-1000",
                    contactInfo ? "bg-white border-white shadow-2xl" : "bg-white/40 border-white shadow-xl"
                 )}>
                    {contactInfo ? (
                      <>
                        <div className="w-20 h-20 bg-wellness-sage/10 rounded-full flex items-center justify-center mb-8 text-wellness-sage">
                          <MessageCircle className="w-10 h-10" />
                        </div>
                        <h4 className="text-3xl font-serif mb-4 text-wellness-stone">Secure Messaging</h4>
                        <p className="text-md text-wellness-muted mb-10 leading-relaxed italic">You are now part of the inner circle. Send a direct inquiry below.</p>
                        <button className="button-primary w-full py-6">Open Concierge Chat</button>
                      </>
                    ) : !isPremium ? (
                      <>
                        <div className="w-20 h-20 bg-wellness-dawm/20 rounded-full flex items-center justify-center mb-8 text-wellness-stone">
                          <Lock className="w-10 h-10" />
                        </div>
                        <h4 className="text-3xl font-serif mb-4 text-wellness-stone tracking-tighter">Premium Access Only</h4>
                        <p className="text-md text-wellness-muted mb-10 italic">Protected contact channels are reserved for our premium collective members.</p>
                        <button 
                          onClick={() => setShowUpgradeModal(true)}
                          className="button-primary w-full py-6 flex items-center justify-center gap-3"
                        >
                          <Star className="w-5 h-5 fill-current" />
                          Upgrade to Premium
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="w-20 h-20 bg-[#FAF9F6] rounded-full flex items-center justify-center mb-8">
                          <Lock className="w-10 h-10 text-stone-200" />
                        </div>
                        <h4 className="text-3xl font-serif mb-4 text-wellness-stone">Identity Guarded</h4>
                        <p className="text-md text-wellness-muted mb-10 italic">Use one of your 30 profile credits to initiate direct dialogue with this master.</p>
                        <button 
                          onClick={handleUnlock}
                          disabled={isUnlocking}
                          className="button-primary w-full py-6 flex items-center justify-center gap-3"
                        >
                          {isUnlocking ? (
                            "Unlocking..."
                          ) : (
                            <>
                              <Zap className="w-5 h-5 fill-current" />
                              Unlock Contact — 1 Credit
                            </>
                          )}
                        </button>
                        <div className="mt-6 flex items-center justify-center gap-2">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-wellness-muted italic">Balance:</span>
                           <span className="text-sm font-serif text-wellness-sage">{subscription.credits} Credits</span>
                        </div>
                        {subscription.credits <= 0 && (
                          <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl">
                             <p className="text-xs text-red-600 font-bold mb-2 uppercase tracking-widest">Out of Credits</p>
                             <button onClick={() => setShowCreditsModal(true)} className="text-wellness-sage text-xs font-bold underline uppercase tracking-widest">Buy 10 More Credits — $10</button>
                          </div>
                        )}
                      </>
                    )}
                 </div>
               </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-[420px] space-y-12">
            <div className="bg-white/60 backdrop-blur-2xl rounded-[48px] p-12 border border-white shadow-2xl shadow-stone-200/30 sticky top-28 overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-wellness-dawm opacity-40 blur-[60px] rounded-full" />
               
               <h3 className="text-4xl font-serif mb-10 text-center text-wellness-stone tracking-tighter">Reserve Studio</h3>
               <div className="space-y-10 mb-12">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#FAF9F6] flex items-center justify-center text-wellness-sage border border-stone-50"><Calendar className="w-6 h-6" /></div>
                    <div>
                      <span className="text-[10px] font-bold text-stone-300 uppercase tracking-widest block mb-1">Availability</span>
                      <span className="text-lg font-serif">Varies by alignment</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#FAF9F6] flex items-center justify-center text-wellness-sage border border-stone-50"><Globe className="w-6 h-6" /></div>
                    <div>
                      <span className="text-[10px] font-bold text-stone-300 uppercase tracking-widest block mb-1">Experience Type</span>
                      <span className="text-lg font-serif">Private • Live • Hybrid</span>
                    </div>
                  </div>
               </div>
               
               <button 
                onClick={() => {
                  if (!contactInfo) handleUnlock();
                  else alert("Reserve session flow coming soon!");
                }}
                className="button-primary w-full py-8 !rounded-3xl flex items-center justify-center group"
               >
                 <span className="text-sm tracking-[0.4em]">
                   {contactInfo ? 'Secure Session' : 'Unlock to Reserve'}
                 </span>
                 <ArrowRight className="ml-4 w-5 h-5 transition-transform group-hover:translate-x-2" />
               </button>
               {isPremium && (
                 <div className="mt-8 pt-8 border-t border-stone-50 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-wellness-muted">Credits Remaining</span>
                    <span className="text-xl font-serif text-wellness-sage">{subscription.credits}</span>
                 </div>
               )}
               <p className="text-center text-[9px] font-bold uppercase tracking-[0.3em] text-wellness-muted mt-8">Elite certification ensured by the collective</p>
            </div>

            {/* Vetted Badge */}
            <div className="bg-white rounded-[40px] p-10 border border-stone-100/50 shadow-xl shadow-stone-200/20 flex items-center gap-8 relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-r from-wellness-dawn/20 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-1000" />
               <div className="w-20 h-20 rounded-full bg-wellness-sage/10 flex items-center justify-center text-wellness-sage shrink-0 z-10">
                 <ShieldCheck className="w-10 h-10" />
               </div>
               <div className="relative z-10">
                  <h4 className="font-serif text-2xl text-wellness-stone">Verified Professional</h4>
                  <p className="text-[10px] font-bold text-stone-300 uppercase tracking-[0.3em] mt-2">Certified & Ethics-Vetted</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUpgradeModal(false)}
              className="absolute inset-0 bg-wellness-stone/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[48px] max-w-lg w-full max-h-[90vh] overflow-y-auto p-12 md:p-16 relative z-10 shadow-2xl scrollbar-thin"
            >
              <div className="absolute top-10 right-10">
                <button onClick={() => setShowUpgradeModal(false)} className="p-2 hover:bg-stone-50 rounded-full transition-colors">
                  <X className="w-6 h-6 text-stone-300" />
                </button>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-wellness-sage/10 rounded-[32px] flex items-center justify-center text-wellness-sage mx-auto mb-10">
                  <ShieldCheck className="w-12 h-12" />
                </div>
                <h2 className="text-4xl font-serif text-wellness-stone mb-6">Unlock Expert Access</h2>
                <p className="text-wellness-muted italic mb-12 leading-relaxed">
                  Join our elite collective for 28 days of access. Connect with verified professionals, view hidden pricing, and unlock 30 profile credits.
                </p>

                <div className="space-y-6">
                  <div className="bg-[#FAF9F6] p-10 rounded-3xl border border-stone-50 text-center">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-wellness-muted mb-2">Standard Premium Plan</p>
                     <div className="text-6xl font-serif text-wellness-stone mb-4">$29<span className="text-xs font-sans tracking-widest ml-2">/28 DAYS</span></div>
                     <ul className="text-left space-y-3 mb-10">
                        {[
                          "Unlock 30 Master Profiles",
                          "Detailed Contact Access",
                          "Hidden Pricing Revealed",
                          "Save Profiles for Later",
                          "Direct Concierge Messaging"
                        ].map(f => (
                          <li key={f} className="flex items-center gap-3 text-xs text-wellness-muted italic">
                             <CheckCircle2 className="w-4 h-4 text-wellness-sage" />
                             {f}
                          </li>
                        ))}
                     </ul>
                     <div className="pt-4 flex flex-col gap-4">
                       <RazorpayButton
                         amount={29}
                         planId="starter"
                         label="Pay with Razorpay ($29)"
                         onSuccess={async () => {
                           await purchasePremium('starter');
                           setShowUpgradeModal(false);
                         }}
                         className="bg-wellness-sage text-white w-full"
                       />
                     </div>
                  </div>
                  
                  <button 
                    onClick={() => setShowUpgradeModal(false)}
                    className="w-full text-wellness-muted text-[10px] font-bold uppercase tracking-[0.5em] hover:text-wellness-stone transition-colors py-4 uppercase"
                  >
                    Not right now
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Credits Modal */}
      <AnimatePresence>
        {showCreditsModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreditsModal(false)}
              className="absolute inset-0 bg-wellness-stone/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[48px] max-w-sm w-full max-h-[90vh] overflow-y-auto p-12 relative z-10 shadow-2xl scrollbar-thin"
            >
              <div className="absolute top-10 right-10">
                <button onClick={() => setShowCreditsModal(false)} className="p-2 hover:bg-stone-50 rounded-full transition-colors">
                  <X className="w-5 h-5 text-stone-300" />
                </button>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-wellness-sage/10 rounded-full flex items-center justify-center text-wellness-sage mx-auto mb-8">
                  <Zap className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-serif text-wellness-stone mb-4">Add-On Credits</h2>
                <p className="text-sm text-wellness-muted italic mb-10">
                  Your premium access limit has been reached. Purchase 10 additional profile unlock credits to continue your journey.
                </p>

                <div className="bg-[#FAF9F6] p-8 rounded-3xl border border-stone-50 mb-10 text-center">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-wellness-muted mb-2">Additional Credit Pack</p>
                   <div className="text-4xl font-serif text-wellness-stone mb-1">$10</div>
                   <p className="text-[10px] text-wellness-muted uppercase tracking-widest">+ 10 PROFILE CREDITS</p>
                </div>

                <div className="pt-4 flex flex-col gap-4">
                  <RazorpayButton
                    amount={10}
                    planId="credits"
                    label="Pay with Razorpay ($10)"
                    onSuccess={async () => {
                      await purchaseCredits();
                      setShowCreditsModal(false);
                    }}
                    className="bg-wellness-stone text-white w-full"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
