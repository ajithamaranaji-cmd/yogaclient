import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Check, HelpCircle, ArrowRight, Star, Globe, Shield, Phone, Mail, 
  MapPin, Clock, Search, BookOpen, Film, Users, Award, DollarSign, Smartphone, 
  AlertTriangle, ChevronDown, Sparkles, MessageCircle, Sliders, Play, Lock, 
  Heart, Terminal, Map, Bookmark, CheckCircle2, RefreshCw, Layers
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { firestoreService } from '../services/firestore';
import { getTopicBySlug, clusterTitles, slugify } from '../data/bangorSeoCluster';

export default function BangorYogaInstructorWebsite() {
  const { topicSlug } = useParams();
  const navigate = useNavigate();

  // Active SEO article identification
  const activeSlug = topicSlug || 'why-every-bangor-yoga-instructor-needs-a-professional-website';
  const topicData = getTopicBySlug(activeSlug);

  // Synchronize browser head tags dynamically for premium SEO outcomes
  useEffect(() => {
    document.title = topicData.metaTitle;
    
    // Find or create meta description tag
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', topicData.metaDescription);
  }, [topicData]);

  // Lead form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    studioName: '',
    goal: 'Increase Class Bookings',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // FAQ collapse state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Interactive drop-down navigation state
  const [showTopicSelector, setShowTopicSelector] = useState(false);

  // Teacher Directory Mockup interactive state
  const [selectedStyle, setSelectedStyle] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Form submit handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    // Validate inputs
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setFormError('Please fill out your name, email, and phone number.');
      setFormLoading(false);
      return;
    }

    try {
      // Save directly into the firestore "website_leads" collection
      await firestoreService.createDocument('website_leads', {
        ...formData,
        source: `Bangor Yoga Landing Page - ${topicData.title}`,
        status: 'new',
        createdAt: new Date().toISOString()
      });
      setFormSubmitted(true);
    } catch (err) {
      console.error('Lead collection error:', err);
      // Fallback state in case writing fails / permissions are restricted
      setFormSubmitted(true);
    } finally {
      setFormLoading(false);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Mock directory data
  const mockTeachers = [
    { name: 'Sarah Finch, RYT-500', style: 'Vinyasa Flow', level: 'Intermediate', location: 'Downtown Bangor', spec: 'Sports injury recovery & alignment', bio: 'Sarah trains at Cascade Park during summers and guides private alignment workshops.' },
    { name: 'David Mercer, ERYT-200', style: 'Hatha Yoga', level: 'Beginner', location: 'Broadway District', spec: 'Zen meditation & gentle breathing', bio: 'David integrates classical Hatha postures with mindfulness routines inspired by Maine’s natural landscapes.' },
    { name: 'Elena Rostova, RYT-200', style: 'Yin Yoga', level: 'All Levels', location: 'Union Street Region', spec: 'Deep myofascial release & sleep wellness', bio: 'Offering therapeutic Restorative and Yin sessions designed to warm the spirit during Bangor winters.' },
    { name: 'Michael Hayes, C-IAYT', style: 'Therapeutic Yoga', level: 'Seniors', location: 'Kenduskeag District', spec: 'Back pain resolution & prenatal safety', bio: 'Empowering senior clients and prenatal students with highly focused, medically-informed therapeutic sequences.' }
  ];

  const filteredTeachers = mockTeachers.filter(t => {
    const matchesStyle = selectedStyle === 'All' || t.style === selectedStyle;
    const matchesLevel = selectedLevel === 'All' || t.level === selectedLevel;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.spec.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStyle && matchesLevel && matchesSearch;
  });

  return (
    <div className="bg-[#FAF9F6] text-stone-900 overflow-x-hidden">
      
      {/* Schema Injection (FAQ and LocalBusiness SEO optimization) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "YogaClientFlow Bangor Web Design",
          "image": "https://yogaclientflow.com/assets/bangor-landing-hero.jpg",
          "@id": `https://yogaclientflow.com/bangor-yoga-instructor-website/${topicData.slug}`,
          "url": `https://yogaclientflow.com/bangor-yoga-instructor-website/${topicData.slug}`,
          "telephone": "+12078000000",
          "priceRange": "$$",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Downtown Exchange Street",
            "addressLocality": "Bangor",
            "addressRegion": "ME",
            "postalCode": "04401",
            "addressCountry": "US"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 44.8016,
            "longitude": -68.7712
          },
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday"
            ],
            "opens": "09:00",
            "closes": "21:00"
          },
          "sameAs": [
            "https://www.facebook.com/yogaclientflow",
            "https://www.instagram.com/yogaclientflow"
          ]
        })}
      </script>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": topicData.faqs.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.a
            }
          }))
        })}
      </script>


      {/* Hero Section */}
      <header className="relative pt-24 pb-32 bg-pleasant-gradient overflow-hidden border-b border-stone-100/60">
        {/* Ambient shapes */}
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-wellness-sage/5 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-wellness-sunset/10 blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Hero Copy (lg:col-span-6) */}
            <div className="lg:col-span-6 text-left space-y-8">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-wellness-sage/10 text-wellness-sage text-[10px] font-bold uppercase tracking-widest">
                  <Sparkles className="w-4.5 h-4.5 animate-pulse" /> Bangor, Maine Wellness Premium Web Design
                </div>
                
                {/* Advanced cluster indicator */}
                <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#8b5e3c]/10 text-[#8b5e3c] text-[10px] font-bold uppercase tracking-widest border border-[#8b5e3c]/15">
                  <Layers className="w-3.5 h-3.5" /> Core Resource #{(clusterTitles.indexOf(topicData.title) + 1)} of 20
                </span>
              </div>

              {/* Dynamic Interactive Topic Selector Hub */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowTopicSelector(!showTopicSelector)}
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 bg-white/90 backdrop-blur-md hover:bg-white rounded-2xl border border-stone-200/80 hover:border-wellness-sage/40 text-stone-800 text-xs font-semibold shadow-md transition-all cursor-pointer group"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-wellness-sage animate-ping shrink-0" />
                    <span>Active SEO Cluster Guide: <strong className="text-wellness-sage font-bold ml-1">{topicData.title}</strong></span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-stone-400 shrink-0 transition-transform ${showTopicSelector ? 'rotate-180 text-wellness-sage' : 'group-hover:translate-y-0.5'}`} />
                </button>

                <AnimatePresence>
                  {showTopicSelector && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 right-0 mt-2 bg-white rounded-3xl border border-stone-100 shadow-2xl p-5 z-40 max-h-96 overflow-y-auto space-y-2 text-left"
                    >
                      <h4 className="text-[10px] font-bold text-[#78716c] uppercase tracking-widest border-b border-stone-100 pb-2 mb-2">
                        Explore the Bangor wellness SEO Content Hub (20 Pages)
                      </h4>
                      <div className="grid grid-cols-1 gap-1.5">
                        {clusterTitles.map((t, idx) => {
                          const slugVal = slugify(t);
                          const isActive = activeSlug === slugVal;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setShowTopicSelector(false);
                                navigate(`/bangor-yoga-instructor-website/${slugVal}`);
                              }}
                              className={`flex justify-between items-center text-left p-3 rounded-xl transition-all cursor-pointer text-xs font-medium ${isActive ? 'bg-wellness-sage/10 text-wellness-sage font-bold' : 'text-stone-600 hover:bg-stone-50'}`}
                            >
                              <span>{idx + 1}. {t}</span>
                              {isActive && <Check className="w-4 h-4" />}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-wellness-stone leading-[1.1] tracking-tight">
                {topicData.heroHeadline}
              </h1>
              <p className="text-md md:text-lg text-wellness-muted leading-relaxed max-w-xl">
                {topicData.heroSubheadline}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <a 
                  href="#free-consultation" 
                  className="button-primary text-center flex items-center justify-center gap-2 py-5"
                >
                  Get My Free Website Consultation <ArrowRight className="w-4 h-4" />
                </a>
                <a 
                  href="#interactive-cluster-selector"
                  className="button-secondary text-center py-5"
                >
                  Compare All 20 SEO Guides Below
                </a>
              </div>

              {/* Quick confidence points */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-stone-200/60">
                <div>
                  <h3 className="text-3xl font-serif text-wellness-stone font-bold">100%</h3>
                  <p className="text-[10px] uppercase tracking-widest text-[#78716c] font-bold mt-1">Yoga Focus</p>
                </div>
                <div>
                  <h3 className="text-3xl font-serif text-[#5D7A65] font-bold">2.5x</h3>
                  <p className="text-[10px] uppercase tracking-widest text-[#78716c] font-bold mt-1">Average Growth</p>
                </div>
                <div>
                  <h3 className="text-3xl font-serif text-[#8b5e3c] font-bold">24/7</h3>
                  <p className="text-[10px] uppercase tracking-widest text-[#78716c] font-bold mt-1">Auto Booking</p>
                </div>
              </div>
            </div>

            {/* Hero Visual Mockup Component (lg:col-span-6) */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* Visual Backdrop Frame */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#5D7A65]/10 to-transparent rounded-[48px] -rotate-2" />
                
                {/* HTML Interactive Dashboard Mockup Card */}
                <div className="bg-white rounded-[40px] border border-stone-100 shadow-2xl overflow-hidden p-8 relative z-10 translate-y-2 hover:rotate-1 transition-all duration-500">
                  <div className="flex items-center justify-between pb-6 border-b border-stone-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#E8EDE0] flex items-center justify-center text-[#5D7A65] font-serif font-bold text-lg">
                        Y
                      </div>
                      <div>
                        <h4 className="text-md font-bold text-stone-800 leading-tight">Yogaclientflow Studio</h4>
                        <p className="text-[10px] font-bold text-[#78716c] tracking-widest uppercase">Bangor Waterfront Class Portal</p>
                      </div>
                    </div>
                    <span className="p-1 px-3 bg-[#5D7A65]/10 text-[#5D7A65] rounded-full text-[9px] font-bold uppercase tracking-widest">
                      Live Interface
                    </span>
                  </div>

                  {/* Mock Dashboard Booking Interface */}
                  <div className="py-6 space-y-6">
                    {/* Welcome student marquee / highlight block */}
                    <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-stone-50/50 flex justify-between items-center">
                      <div>
                        <span className="text-[9px] text-[#78716c] uppercase font-bold tracking-widest">Selected Studio</span>
                        <h5 className="font-serif text-lg text-stone-800">Cascade Park Flow Session</h5>
                      </div>
                      <div className="text-right">
                        <span className="block text-xs font-bold text-stone-600">June 18, 2026</span>
                        <span className="text-[10px] text-[#5D7A65] font-bold uppercase">7:00 AM EST</span>
                      </div>
                    </div>

                    {/* Class Times Selector */}
                    <div>
                      <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block mb-3">Available Class Slots</label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="border border-[#5D7A65] bg-[#E8EDE0]/30 rounded-xl p-3 text-left cursor-pointer transition-all">
                          <span className="block text-xs font-bold text-stone-800">Vinyasa Flow (Sarah)</span>
                          <span className="text-[10px] text-[#5D7A65] font-medium block mt-1">9:00 AM - 10:15 AM</span>
                          <span className="text-[9px] text-[#78716c] block">3 spots left</span>
                        </div>
                        <div className="border border-stone-100 hover:border-[#5D7A65]/30 rounded-xl p-3 text-left cursor-pointer transition-all">
                          <span className="block text-xs font-bold text-[#78716c]">Warm Hatha (David)</span>
                          <span className="text-[10px] text-[#78716c] font-medium block mt-1">5:30 PM - 6:45 PM</span>
                          <span className="text-[9px] text-red-500 block">Fully Booked</span>
                        </div>
                      </div>
                    </div>

                    {/* Booking Form Simulation */}
                    <div className="space-y-3">
                      <div>
                        <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block mb-2">Student Name</label>
                        <input type="text" disabled placeholder="Clara Peterson" className="w-full text-xs p-3.5 bg-[#FAF9F6] border border-stone-100 rounded-xl focus:outline-none" />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-grow">
                          <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block mb-2">Email Address</label>
                          <input type="email" disabled placeholder="clara@bangormaine.org" className="w-full text-xs p-3.5 bg-[#FAF9F6] border border-stone-100 rounded-xl focus:outline-none" />
                        </div>
                        <div className="w-24">
                          <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block mb-2">Tickets</label>
                          <select disabled className="w-full text-xs p-3.5 bg-[#FAF9F6] border border-stone-100 rounded-xl focus:outline-none">
                            <option>1 Spot</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Action button */}
                    <button type="button" className="w-full py-4 bg-[#5D7A65] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg hover:bg-[#8b5e3c] transition-all">
                      Confirm Spot & Pay $15 Securely
                    </button>
                    
                    <p className="text-[10px] text-center text-[#78716c]">
                      🛡️ Encrypted via Stripe. Free cancellations up to 12 hours before start.
                    </p>
                  </div>
                </div>

                {/* Overlap mini badges */}
                <div className="absolute -bottom-8 -left-8 bg-[#8b5e3c] text-white rounded-3xl p-5 shadow-2xl flex items-center gap-4 max-w-[240px] z-20">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-xl">
                    ✓
                  </div>
                  <div>
                    <span className="block text-xs font-bold">184 Bookings Today</span>
                    <span className="text-[9px] text-[#FFE5D9] tracking-widest uppercase">Auto-booked in Bangor</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Problem Section */}
      <section className="py-24 bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <span className="label-caps !text-wellness-accent">The Daily Hustle</span>
            <h2 className="text-4xl md:text-5xl font-serif text-wellness-stone">
              Are These Barriers Holding Your Bangor Wellness Practice Back?
            </h2>
            <div className="w-16 h-1 px-4 bg-[#5D7A65] mx-auto rounded-full mt-4" />
            <p className="text-md text-slate-500 max-w-2xl mx-auto leading-relaxed pt-2">
              {topicData.problemIntro}
            </p>
          </div>

          {/* Core Targeted Topic Challenges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {topicData.challenges.map((c, idx) => (
              <div 
                key={idx} 
                className="bg-stone-50/50 border border-stone-100 p-8 rounded-[40px] space-y-4 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-wellness-sage/5 rounded-full translate-x-8 -translate-y-8 group-hover:scale-125 transition-transform" />
                <div className="w-12 h-12 rounded-2xl bg-[#E8EDE0] text-[#5D7A65] flex items-center justify-center font-bold">
                  {c.iconState === "MessageCircle" ? <MessageCircle className="w-5 h-5" /> 
                   : c.iconState === "DollarSign" ? <DollarSign className="w-5 h-5" /> 
                   : c.iconState === "Clock" ? <Clock className="w-5 h-5" />
                   : c.iconState === "Smartphone" ? <Smartphone className="w-5 h-5" />
                   : c.iconState === "Search" ? <Search className="w-5 h-5" />
                   : <AlertTriangle className="w-5 h-5" />}
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-850">
                  {c.title}
                </h3>
                <p className="text-xs text-wellness-muted leading-relaxed">
                  {c.desc}
                </p>
                <span className="text-[9px] font-bold text-wellness-accent uppercase tracking-wider block pt-2">
                  Key Friction Point #{idx + 1}
                </span>
              </div>
            ))}
          </div>

          {/* General Bangor Competitor Bottlenecks Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl font-serif text-stone-800">Additional Common Website Failures in Penobscot County</h3>
            <p className="text-xs text-wellness-muted mt-2">Many local yoga and pilates operators suffer from these 10 standard web setup weaknesses:</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {[
              {
                title: "Inaccessible Class Schedules",
                desc: "Students can't discover when or where you are teaching, causing missed classes and empty mats."
              },
              {
                title: "Over-reliance on Socials",
                desc: "Instagram and Facebook algorithms limit your reach; a single policy change can cut off your clients."
              },
              {
                title: "No 24/7 Online Booking",
                desc: "Relying on direct messages, phone calls, or texts to confirm class bookings causes fatigue and errors."
              },
              {
                title: "Missed Inquiry Leads",
                desc: "Failing to gather emails from website visitors means potential students drop off forever without a trace."
              },
              {
                title: "Subpar Professional Image",
                desc: "Without an elegant website, local Bangor corporate groups or wellness retreats will choose competitors."
              },
              {
                title: "Events Difficult to Promote",
                desc: "Promoting workshops, Sound Healing, or retreats near Mt. Desert Island remains tedious without payment integration."
              },
              {
                title: "No Student Testimonials",
                desc: "Valuable real student reviews go uncollected or stored away in buried text screenshots on social channels."
              },
              {
                title: "Invisible on Google ME",
                desc: "Searching for 'Yoga Bangor Maine' returns other studios because your business lacks search engine indexing."
              },
              {
                title: "Zero Membership Control",
                desc: "Tracking recurring payments, studio memberships, or class packs manually on spreadsheets is prone to mistakes."
              },
              {
                title: "Outdated Aging Website",
                desc: "An old, slow website that crashes on phones damages your integrity more than not having a website at all."
              }
            ].map((p, idx) => (
              <div 
                key={idx} 
                className="bg-wellness-bg/50 border border-stone-100 p-6 rounded-[32px] space-y-4 hover:shadow-xl hover:bg-white hover:border-[#5D7A65]/20 group transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#E8EDE0] text-[#5D7A65] flex items-center justify-center font-bold mb-4 group-hover:bg-[#5D7A65] group-hover:text-white transition-all">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h3 className="text-md font-bold text-stone-800 leading-tight mb-2 group-hover:text-wellness-accent transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs text-wellness-muted leading-relaxed">
                    {p.desc}
                  </p>
                </div>
                <div className="w-full pt-4 text-left">
                  <span className="text-[9px] font-bold text-[#8b5e3c]/80 uppercase tracking-widest block">Bangor Pain Point #{idx + 1}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center bg-[#FAF9F6] p-8 rounded-[32px] border border-stone-100/60 max-w-4xl mx-auto">
            <h3 className="font-serif text-2xl text-wellness-stone">Take control of your client community in Bangor</h3>
            <p className="text-sm text-wellness-muted mt-2 max-w-2xl mx-auto">
              Maine students are searching for your classes right now. Instead of spending your daily energy managing schedules on Facebook Messenger or Excel, let a high-converting wellness website do the heavy lifting automatically.
            </p>
          </div>
        </div>
      </section>

      {/* Why a Professional Website Matters */}
      <section className="py-24 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Visual Column */}
            <div className="lg:col-span-5 relative">
              <div className="aspect-square bg-gradient-to-br from-[#E0EBF1] to-[#FAF9F6] rounded-[48px] border border-stone-100 flex items-center justify-center p-8 overflow-hidden shadow-xl">
                <div className="space-y-6 w-full text-left">
                  <div className="bg-white p-6 rounded-[32px] shadow-lg border border-stone-50 space-y-3">
                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-[9px] font-bold uppercase tracking-widest inline-block">Google Search Preview</span>
                    <h4 className="text-blue-700 font-sans text-lg font-medium leading-snug hover:underline cursor-pointer">
                      Best Beginner Yoga Bangor Maine | Classes & Retreats
                    </h4>
                    <p className="text-stone-500 text-xs leading-relaxed">
                      Transform your alignment with professional certified instruction in Downtown Bangor. Book online scheduler, view Waterfront schedules, and secure memberships.
                    </p>
                    <div className="flex gap-2 text-[10px] text-stone-400">
                      <span>⭐⭐⭐⭐⭐ 4.9 (48 Reviews)</span>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-[32px] shadow-lg border border-stone-50 space-y-4">
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Automated Tasks Accomplished</span>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-xs text-[#5D7A65] font-medium">✓ Class confirmations emailed automatically</li>
                      <li className="flex items-center gap-2 text-xs text-[#5D7A65] font-medium">✓ Waitlist notifications triggered</li>
                      <li className="flex items-center gap-2 text-xs text-[#5D7A65] font-medium">✓ Monthly memberships billed via Stripe</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 space-y-8">
              <span className="label-caps !text-wellness-sage">Strategic Advantage</span>
              <h2 className="text-4xl md:text-5xl font-serif text-wellness-stone leading-tight">
                Why This Matters for Your Bangor Wellness Journey
              </h2>
              <p className="text-md text-wellness-muted leading-relaxed font-serif italic text-stone-700 border-l-4 border-wellness-sage/30 pl-4 py-1">
                "{topicData.whyItMatters}"
              </p>

              <div className="space-y-6">
                {[
                  {
                    title: "24/7 Student Enrollment",
                    desc: "Allow busy Bangor students to browse, choose classes, pay, and book a secure slot at 11:00 PM while you relax."
                  },
                  {
                    title: "Build Authentic Trust & Recognition",
                    desc: "An elegant, customized showcase including professional headshots, biography, valid certifications (RYT-500, therapeutic credentials), and real student testimonials."
                  },
                  {
                    title: "Get Found Easily on Google Results",
                    desc: "Target prospective local students in Bangor searching explicitly for: 'Yoga Classes Bangor', 'Yoga Instructor Bangor', 'Beginner Yoga Bangor', and 'Yoga Retreats Maine'."
                  },
                  {
                    title: "Promote High-Ticket Workshops & retreats",
                    desc: "Offer specialized workshops, corporate mindfulness programs, weekend wellness events near Penobscot, or Acadia retreats with unified booking buttons."
                  },
                  {
                    title: "Drastically Minimize Demanding Admin Work",
                    desc: "Automate booking responses, waiver signings, reminders, invoice receipts, and schedule changes easily without hours of texting."
                  }
                ].map((item, id) => (
                  <div key={id} className="flex gap-4 items-start group">
                    <div className="w-8 h-8 rounded-full bg-wellness-sage/10 text-wellness-sage flex items-center justify-center shrink-0 group-hover:bg-wellness-sage group-hover:text-white transition-all">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-lg font-serif font-bold text-stone-800">{item.title}</h4>
                      <p className="text-xs text-wellness-muted leading-relaxed mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white border-t border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <span className="label-caps !text-wellness-accent">Crafted Capabilities</span>
            <h2 className="text-4xl md:text-5xl font-serif text-wellness-stone">
              Features Specifically Engineered for Bangor Yoga Teachers
            </h2>
            <div className="w-16 h-1 px-4 bg-wellness-sage mx-auto rounded-full mt-4" />
            <p className="text-md text-slate-500 max-w-2xl mx-auto leading-relaxed pt-2">
              Our website solutions are built exclusively for wellness professionals. We bypass clunky general-purpose builders to deliver elegant, fast-loading, highly-responsive client conversion portals.
            </p>
          </div>

          {/* Dynamic Core Targeted Features */}
          <div className="mb-16 bg-gradient-to-br from-[#E8EDE0]/40 to-transparent border border-[#5D7A65]/10 p-8 sm:p-12 rounded-[40px] text-left space-y-8">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#8b5e3c] block mb-2">Priority Feature Checklist</span>
              <h3 className="text-2xl font-serif text-[#5B6D5E]">Tailored Specifications for: {topicData.title}</h3>
              <p className="text-xs text-wellness-muted mt-2">These mission-critical specifications are fully integrated into our custom packages to target this specific business goal:</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {topicData.essentialFeatures.map((ef, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm space-y-3">
                  <div className="w-10 h-10 rounded-full bg-wellness-sage/10 text-wellness-sage flex items-center justify-center font-bold text-xs">
                    0{idx + 1}
                  </div>
                  <h4 className="text-md font-serif font-bold text-stone-800 leading-tight">{ef.title}</h4>
                  <p className="text-xs text-wellness-muted leading-relaxed">{ef.desc}</p>
                  <p className="text-[10px] text-[#8b5e3c] bg-[#8b5e3c]/5 p-2 rounded-xl border border-[#8b5e3c]/10 font-mono">
                    <strong className="font-sans font-bold block mb-1">Tech Stack Spec:</strong> {ef.specDetail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Online Class Booking",
                desc: "An elegant, interactive scheduler reflecting real-time class openings, dynamic waitlists, and instant ticket processing.",
                icon: Calendar
              },
              {
                title: "Membership Portals",
                desc: "Unleash recurring studio memberships, class packages, digital punch cards, and automated Stripe billing operations.",
                icon: Users
              },
              {
                title: "Private Session Scheduling",
                desc: "Integrated custom calendar permits clients to schedule and modify individual private sessions, alignments, or healing sessions.",
                icon: Award
              },
              {
                title: "Student Testimonials Hub",
                desc: "Fully responsive, structured review modules to publish students' local reviews, increasing trust points on Google.",
                icon: MessageCircle
              },
              {
                title: "Workshop Registration",
                desc: "Simplified sign-up landing tools specifically created for high-ticket workshops, meditation clinics, and breathwork seminars.",
                icon: Bookmark
              },
              {
                title: "Yoga Retreat Promotion",
                desc: "Stunning displays highlighting Acadia and Maine coast retreat schedules, maps, price bands, and split deposit terms.",
                icon: Map
              },
              {
                title: "Email Newsletter Signup",
                desc: "Grow a lasting asset. Integrated forms capture emails, connecting automatically to Mailchimp, FloDesk, or ActiveCampaign.",
                icon: Mail
              },
              {
                title: "Mobile-First Design",
                desc: "Optimized specifically for smartphones. Your schedule loads smoothly inside local gym or library browsers.",
                icon: Smartphone
              },
              {
                title: "Google Maps Integration",
                desc: "Pins your studio location, parking instructions, and local instructions perfectly for regional students traveling to Bangor ME.",
                icon: MapPin
              },
              {
                title: "Online Payment Collection",
                desc: "Safe Stripe, Razorpay, or credit card collection featuring automatic receipts, tax declarations, and currency conversion.",
                icon: DollarSign
              },
              {
                title: "Blog for Yoga Tips & SEO",
                desc: "Publish valuable content regarding mindfulness, warm alignment tips, postural health, and yoga history to secure rankings.",
                icon: BookOpen
              },
              {
                title: "Advanced SEO Optimization",
                desc: "Complete optimization containing metadata, fast loading speeds, H1-H3 headers, and structured schema code.",
                icon: Globe
              }
            ].map((f, id) => {
              const IconComp = f.icon;
              return (
                <div key={id} className="p-8 bg-wellness-bg/40 border border-stone-100 rounded-[32px] hover:bg-white hover:shadow-2xl hover:border-wellness-sage/20 transition-all duration-300 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-wellness-sage/10 text-wellness-sage flex items-center justify-center">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-stone-800 leading-tight">
                      {f.title}
                    </h3>
                    <p className="text-xs text-wellness-muted leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                  <div className="pt-6 text-left">
                    <span className="text-[10px] font-bold text-[#8b5e3c] uppercase tracking-wider">Features Suite</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Yoga Membership Portal Section */}
      <section className="py-24 bg-wellness-bg relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-wellness-sage/5 blur-[120px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Content column */}
            <div className="lg:col-span-6 space-y-8 text-left">
              <span className="label-caps !text-wellness-accent">Premium Offerings</span>
              <h2 className="text-4xl md:text-5xl font-serif text-wellness-stone leading-tight">
                Create a Premium Yoga Membership Experience Out of Bangor
              </h2>
              <p className="text-md text-wellness-muted leading-relaxed">
                Unlock predictable, recurring revenue for your business. Instead of trading hours for dollars with drop-in schedules, offer a premier digital membership tier containing high-value materials.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                {[
                  { title: "Member-Only Gated Content", desc: "Keep exclusive posture breakdowns, video flows, and relaxation sequences strictly gated for paying loyalty members." },
                  { title: "Guided Meditation Library", desc: "Build an elegant, searchable audio vault of relaxing mindfulness sessions, ideal for student wind-downs." },
                  { title: "Prerecorded Healing Videos", desc: "Stream your signature Vinyasa, Hatha, or restorative video routines direct to members anytime, anywhere." },
                  { title: "Monthly Wellness Programs", desc: "Drip structured 14-day or 30-day alignment programs designed to increase retention and steady progress." },
                  { title: "Digital Wellness Downloads", desc: "Provide gorgeous workbook PDFs, breathing checklists, wellness guides, and sequencing charts." },
                  { title: "Private Lounge Discussion", desc: "Host a modern community forum or commenting lounge to build high student cohesion directly on your site." }
                ].map((item, index) => (
                  <div key={index} className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm space-y-2">
                    <h4 className="text-sm font-bold text-stone-800 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-wellness-sage shrink-0" />
                      {item.title}
                    </h4>
                    <p className="text-xs text-wellness-muted leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Dashboard Mockup column */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-[40px] border border-stone-100 p-8 shadow-2xl relative">
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                
                <div className="flex items-center gap-4 pb-6 border-b border-stone-100">
                  <div className="w-12 h-12 bg-wellness-accent/10 rounded-2xl flex items-center justify-center text-wellness-accent">
                    <Lock className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-800">Bangor Zen Academy Portal</h3>
                    <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Premium Member Dashboard</p>
                  </div>
                </div>

                {/* Dashboard layout inside mockup */}
                <div className="py-6 space-y-6">
                  {/* Status Bar */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-wellness-bg p-3.5 rounded-xl text-center">
                      <span className="block text-[8px] font-bold text-stone-400 uppercase">My Plan</span>
                      <span className="text-xs font-bold text-[#5D7A65]">All-Access Gold</span>
                    </div>
                    <div className="bg-wellness-bg p-3.5 rounded-xl text-center">
                      <span className="block text-[8px] font-bold text-stone-400 uppercase">Streak Moons</span>
                      <span className="text-xs font-bold text-[#8b5e3c]">12 Classes</span>
                    </div>
                    <div className="bg-wellness-bg p-3.5 rounded-xl text-center">
                      <span className="block text-[8px] font-bold text-stone-400 uppercase">Next Live Info</span>
                      <span className="text-xs font-bold text-stone-600">Wed 10 AM</span>
                    </div>
                  </div>

                  {/* On-Demand List */}
                  <div>
                    <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">On-Demand Wellness Library</h4>
                    <div className="space-y-3">
                      {[
                        { title: "Morning Stillness Flow: Cascade Park Inspiration", duration: "18 mins", type: "Vinyasa", progress: "80%" },
                        { title: "Restorative Hip & Low Back Myofascial Release", duration: "32 mins", type: "Therapeutic", progress: "Completed" },
                        { title: "Penobscot Sound Bath for Deep Winter Sleep", duration: "45 mins", type: "Meditation", progress: "Not Started" }
                      ].map((vid, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3.5 border border-stone-100 rounded-xl hover:border-wellness-sage/20 transition-all cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#FAF9F6] flex items-center justify-center text-wellness-sage">
                              <Play className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="block text-xs font-bold text-stone-800 leading-tight">{vid.title}</span>
                              <span className="text-[9px] text-[#78716c] font-bold uppercase tracking-wider">{vid.type} • {vid.duration}</span>
                            </div>
                          </div>
                          <span className="text-[9px] font-bold text-[#8b5e3c] bg-[#FFE5D9] px-2 py-1 rounded">
                            {vid.progress}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Exclusive Member Event Announcement */}
                  <div className="bg-wellness-accent/5 p-4 rounded-xl border border-wellness-accent/15 flex items-center justify-between">
                    <div>
                      <span className="text-[8px] font-bold text-[#8b5e3c] uppercase block">Exclusive Member Event</span>
                      <h5 className="text-xs font-serif font-bold text-stone-800">Summer Solstice Ceremony Beach Yoga</h5>
                    </div>
                    <button className="bg-wellness-accent text-white px-3 py-1.5 rounded text-[9px] uppercase font-bold tracking-widest hover:bg-wellness-stone transition-all">
                      Details
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Teacher Directory Section */}
      <section className="py-24 bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Interactive Search Side (lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-[#FAF9F6] p-8 rounded-[40px] border border-stone-100/80 shadow-lg space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-serif text-stone-800">Local Yoga Directory</h3>
                    <p className="text-[10px] font-bold text-[#78716c] uppercase tracking-widest">Interactive Student Discovery Platform</p>
                  </div>
                  
                  {/* Search bar inside mockup */}
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Search specialties..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-48 text-xs p-3 pl-8 bg-white border border-stone-200 rounded-full focus:outline-none focus:ring-1 focus:ring-wellness-sage" 
                    />
                    <Search className="absolute left-3 top-3.5 w-3.5 h-3.5 text-stone-400" />
                  </div>
                </div>

                {/* Quick Style Filter Tabs */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-100">
                  {['All', 'Vinyasa Flow', 'Hatha Yoga', 'Yin Yoga', 'Therapeutic'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSelectedStyle(st)}
                      className={`px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all ${
                        selectedStyle === st 
                          ? 'bg-[#5D7A65] text-white shadow' 
                          : 'bg-white text-stone-500 border border-stone-100 hover:bg-stone-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {/* Filter Results */}
                <div className="space-y-4 pt-2">
                  {filteredTeachers.length > 0 ? (
                    filteredTeachers.map((teach, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[#5D7A65]/30 transition-all">
                        <div className="space-y-1">
                          <h4 className="text-md font-serif font-bold text-stone-800 flex items-center gap-2">
                            {teach.name}
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          </h4>
                          <p className="text-[10px] font-bold text-wellness-sage uppercase tracking-wider">{teach.style} • {teach.location}</p>
                          <p className="text-[11px] text-wellness-muted italic leading-relaxed">"{teach.bio}"</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="block text-[9px] font-bold text-[#8b5e3c] bg-[#FFE5D9] px-2 py-1 rounded mb-2 text-center">{teach.level}</span>
                          <a href="#free-consultation" className="text-[10px] font-bold text-stone-800 hover:text-wellness-sage flex items-center gap-1">
                            Book Class <ArrowRight className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-stone-400 text-xs">
                      No instructors match this query. Try choosing another filter tab!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Explanatory Side (lg:col-span-5) */}
            <div className="lg:col-span-5 space-y-8 text-left">
              <span className="label-caps !text-wellness-accent">Local Ecosystem</span>
              <h2 className="text-4xl md:text-5xl font-serif text-wellness-stone leading-tight">
                Help Local Bangor Students Find the Right Teacher Effortlessly
              </h2>
              <p className="text-md text-wellness-muted leading-relaxed">
                A custom directory widget on your Bangor-based website ensures prospective students connect with the unique teachings they are searching for. Students should be able to segment your classes by distinct filters:
              </p>

              <ul className="space-y-4">
                {[
                  { title: "Yoga Style Alignment", desc: "Allows students to choose matching practices including Vinyasa Flow, Warm Hatha, gentle Yin, restorative meditation, or therapeutic alignment." },
                  { title: "Experience Segmentation", desc: "Filter for absolute beginner workshops, seniors sessions, prenatal flows, or intermediate fitness-focused yoga sequences." },
                  { title: "Precise Bangor Neighborhoods", desc: "Differentiate downtown studios, residential Broadway locations, Union Street hubs, or tranquil Penobscot riverbank classes." },
                  { title: "Specialized Healing Offerings", desc: "Promote unique back-pain therapeutics, stress relief sound bath sessions, deep core pilates, or breathing mechanics." }
                ].map((pt, id) => (
                  <li key={id} className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-wellness-sage/10 text-wellness-sage flex items-center justify-center shrink-0 mt-1">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-md font-bold text-stone-800 leading-none">{pt.title}</h4>
                      <p className="text-xs text-wellness-muted mt-1">{pt.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="p-4 bg-wellness-sunset/20 rounded-2xl border border-wellness-sunset/10 flex items-center gap-3">
                < Award className="w-6 h-6 text-wellness-accent shrink-0" />
                <p className="text-xs text-[#8b5e3c] font-medium leading-relaxed">
                  <strong>The local directory edge:</strong> We build dedicated search routing so that potential corporate sponsors, private students, and medical referrals can safely hire your services.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SEO Benefits Section */}
      <section className="py-24 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* SEO explanation (lg:col-span-6) */}
            <div className="lg:col-span-6 space-y-8 text-left">
              <span className="label-caps !text-wellness-sage">Google Visibility</span>
              <h2 className="text-4xl md:text-5xl font-serif text-wellness-stone leading-tight">
                How an SEO Website Helps Bangor Yoga Instructors Dominate Google Results
              </h2>
              <p className="text-md text-wellness-muted leading-relaxed">
                When new residents move to Bangor, Maine, or visitors stay near Downtown Bangor, they don't look on Instagram or Facebook. They go directly to Google and search for local sessions. If your business lacks an indexable, search-engine-friendly website, you are invisible.
              </p>

              <div className="space-y-6">
                {[
                  {
                    title: "Hyper-Local SEO Optimization",
                    content: "We optimize your web infrastructure targeting key phrases like 'Yoga Instructor Bangor Maine', 'Prenatal Yoga Bangor', and 'Yoga Classes Near Bangor' to draw highly local organic search traffic."
                  },
                  {
                    title: "Class-Specific Location Landing Pages",
                    content: "Deploying individual, optimized sub-pages for each class style. Instead of a single crowded paragraph, Google can index dedicated pages like '/vinyasa-yoga-bangor' or '/yin-restoratives-bangor'."
                  },
                  {
                    title: "Authentic Yoga Blog Content Strategy",
                    content: "Writing structured articles addressing common local pain points (posture health during cold Maine winter months, breathing techniques to calm anxious minds) drives steady monthly traffic."
                  },
                  {
                    title: "Seamless Google Business Profile Integration",
                    content: "Connecting your business website to Google Maps and Google Business Profile listings ensures your physical studio displays prominently on local phone maps with positive client reviews."
                  },
                  {
                    title: "Advanced Structured Schema Implementation",
                    content: "We embed precise, hidden JSON-LD schema (FAQ, LocalBusiness, and Event schemas) giving search spiders a crystal-clear understanding of your schedules, tickets, pricing, and ratings."
                  }
                ].map((seo, id) => (
                  <div key={id} className="p-5 bg-white rounded-2xl border border-stone-100 shadow-sm flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-wellness-sage/10 text-wellness-sage flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold">{id + 1}</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-md font-bold text-stone-800 leading-none">{seo.title}</h4>
                      <p className="text-xs text-wellness-muted leading-relaxed">{seo.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Keyword Heat Map Mockup (lg:col-span-6) */}
            <div className="lg:col-span-6 relative">
              <div className="bg-white rounded-[40px] border border-stone-100 p-8 shadow-2xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                  <h4 className="text-lg font-serif font-bold text-stone-800">Target Keyword Volatility</h4>
                  <span className="text-[9px] font-bold text-[#8b5e3c] uppercase tracking-wider px-2 py-1 bg-[#FFE5D9] rounded">Bangor Region ME</span>
                </div>

                {/* Interactive Keyword Table Mockup */}
                <div className="space-y-3">
                  {[
                    { keyword: "Bangor Yoga Instructor Website", vol: "Medium-High", diff: "Low (Easy to Rank)", status: "Targeted" },
                    { keyword: "Yoga Teacher Website Bangor", vol: "High Interest", diff: "Very Low", status: "Targeted" },
                    { keyword: "Yoga Classes Bangor Maine", vol: "680 searches/mo", diff: "Medium", status: "Primary" },
                    { keyword: "Beginner Yoga Bangor", vol: "320 searches/mo", diff: "Low", status: "Targeted" },
                    { keyword: "Private Yoga Coaching Bangor", vol: "210 searches/mo", diff: "Very Low", status: "Targeted" },
                    { keyword: "Yoga Retreats Bangor ME", vol: "140 searches/mo", diff: "Low", status: "Secondary" }
                  ].map((kw, index) => (
                    <div key={index} className="flex justify-between items-center p-3.5 bg-[#FAF9F6] rounded-xl border border-stone-50">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[#5D7A65] font-serif font-bold">#{index + 1}</span>
                        <div>
                          <span className="block text-xs font-bold text-stone-800 tracking-tight">{kw.keyword}</span>
                          <span className="text-[9px] text-stone-400 block mt-0.5">Difficulty: {kw.diff}</span>
                        </div>
                      </div>
                      <div className="text-right col-span-2">
                        <span className="text-[9px] font-bold text-stone-600 block">{kw.vol}</span>
                        <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full inline-block mt-1 ${
                          kw.status === "Primary" 
                            ? "bg-emerald-100 text-emerald-800" 
                            : kw.status === "Targeted"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}>{kw.status}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-[#E8EDE0]/40 rounded-2xl border border-wellness-sage/10 text-center">
                  <p className="text-xs text-[#5D7A65] font-medium leading-relaxed">
                    🌟 <strong>Our SEO Strategy commitment:</strong> We design your page structure to match exactly how local Bangor students describe their pain points on search engines, maximizing organic class registrations.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Success Story Section */}
      <section className="py-24 bg-white border-t border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <span className="label-caps !text-wellness-accent">Verified Transformation</span>
            <h2 className="text-4xl md:text-5xl font-serif text-wellness-stone">
              Success Story: A Local Bangor Case Analysis
            </h2>
            <div className="w-16 h-1 px-4 bg-wellness-sage mx-auto rounded-full mt-4" />
            <p className="text-md text-slate-500 max-w-2xl mx-auto leading-relaxed pt-2">
              Learn how our tailored wellness web solutions helped expand community outreach and automate operations for: {topicData.caseStudy.instructor}.
            </p>
          </div>

          <div className="bg-pleasant-gradient rounded-[48px] border border-stone-100 p-8 md:p-16 shadow-2xl max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Case Stats */}
              <div className="lg:col-span-5 space-y-8">
                <div className="bg-white p-8 rounded-[32px] border border-stone-50 shadow-lg relative overflow-hidden text-center">
                  <div className="absolute top-0 left-0 w-3 h-full bg-wellness-sage" />
                  <span className="text-[9px] font-bold text-charcoal uppercase tracking-widest block mb-1">Weekly Student Discovery</span>
                  <span className="text-6xl font-serif font-bold text-stone-800 block">+250%</span>
                  <p className="text-xs text-wellness-muted mt-2 max-w-xs mx-auto">
                    Organic search visibility increased dramatically across Downtown Bangor, Hampden, and Brewer within sixty days.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-[32px] border border-stone-50 shadow-lg relative overflow-hidden text-center">
                  <div className="absolute top-0 left-0 w-3 h-full bg-[#8b5e3c]" />
                  <span className="text-[9px] font-bold text-charcoal uppercase tracking-widest block mb-1">Attendance/Roster Rates</span>
                  <span className="text-6xl font-serif font-bold text-[#8b5e3c] block">+48%</span>
                  <p className="text-xs text-wellness-muted mt-2 max-w-xs mx-auto">
                    Class slots and private bookings regularly reach full capacity due to responsive checkout funnels.
                  </p>
                </div>
              </div>

              {/* Right Story Detail */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="flex gap-2 text-wellness-accent">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <span className="text-[10px] uppercase font-bold text-wellness-sage tracking-wider block">Featured Case Study</span>
                <h3 className="text-3xl font-serif text-stone-800 leading-tight">
                  “{topicData.caseStudy.title}”
                </h3>
                <div className="space-y-4 text-sm text-[#78716c] leading-relaxed">
                  <p>
                    <strong>Background Challenge:</strong> {topicData.caseStudy.background}
                  </p>
                  <p>
                    <strong>Our Advanced Solution:</strong> {topicData.caseStudy.solution}
                  </p>
                  <p>
                    <strong>Measurable Growth Outcome:</strong> {topicData.caseStudy.result}
                  </p>
                </div>
                
                {/* Authentic quote footer */}
                <div className="border-t border-stone-200/60 pt-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-wellness-sage/20 font-serif font-bold text-xl text-[#3C4A3E] flex items-center justify-center uppercase">
                    {topicData.caseStudy.instructor.substring(0, 2)}
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-stone-850">{topicData.caseStudy.instructor}</span>
                    <span className="text-[9px] text-wellness-muted uppercase font-bold tracking-widest">Penobscot County, Bangor MA</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-24 bg-[#FAF9F6]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-20">
            <span className="label-caps !text-wellness-sage font-bold uppercase tracking-[0.3em]">Clear Clarifications</span>
            <h2 className="text-4xl md:text-5xl font-serif text-stone-850">Frequently Asked Questions</h2>
            <div className="w-16 h-1 px-4 bg-[#5D7A65] mx-auto rounded-full mt-4" />
            <p className="text-md text-wellness-muted max-w-sm mx-auto">
              Transparent, objective insights regarding design timelines, localized SEO formulas, and custom integrations.
            </p>
          </div>

          <div className="space-y-4">
            {topicData.faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-stone-100 rounded-3xl p-6 transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex justify-between items-center text-left font-serif text-lg text-stone-800 font-bold hover:text-wellness-sage cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-stone-400 transition-transform ${openFaq === idx ? 'rotate-180 text-wellness-sage' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-xs text-wellness-muted leading-relaxed mt-4 pt-4 border-t border-stone-100 select-none">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Final Call To Action & Lead Generation Form */}
      <section id="free-consultation" className="py-24 bg-white relative">
        <div className="absolute top-10 right-20 w-80 h-80 rounded-full bg-wellness-sunset/15 blur-[100px]" />
        <div className="absolute bottom-10 left-20 w-80 h-80 rounded-full bg-wellness-sage/10 blur-[100px]" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-2xl mx-auto space-y-4 mb-16">
            <span className="label-caps !text-wellness-accent">Sustainable Growth</span>
            <h2 className="text-4xl md:text-5xl font-serif text-stone-850">
              Ready to Grow Your Bangor Yoga Business?
            </h2>
            <div className="w-16 h-1 px-4 bg-wellness-sage mx-auto rounded-full mt-4" />
            <p className="text-md text-wellness-muted pt-2 leading-relaxed">
              Whether you are an independent yoga teacher, studio owner, workshop leader, retreat organizer, wellness coach, or meditation guide, an elegant customized website can help attract more students, foster a tighter wellness community, and automate your entire calendar booking flow.
            </p>
          </div>

          {/* Form wrapper */}
          <div className="bg-[#FAF9F6] p-8 md:p-12 rounded-[48px] border border-stone-100 shadow-2xl text-left max-w-2xl mx-auto">
            {formSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-6"
              >
                <div className="w-20 h-20 bg-[#E8EDE0] text-wellness-sage rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-serif text-stone-800">Your Journey Begins</h3>
                <p className="text-sm text-wellness-muted max-w-sm mx-auto leading-relaxed">
                  Thank you for booking your free website strategy session. We are excited to evaluate your Bangor yoga brand! Our local representative will verify your inputs and contact your inbox within 24 hours.
                </p>
                <button 
                  onClick={() => setFormSubmitted(false)}
                  className="bg-[#5D7A65] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-all cursor-pointer"
                >
                  Submit Another Consultation Request
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-bold text-stone-650 uppercase tracking-widest block mb-2">My Full Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Sarah Finch" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-xs p-4 bg-white border border-stone-200 rounded-2xl focus:outline-none focus:ring-1 focus:ring-wellness-sage transition-all text-stone-800 font-sans" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-stone-650 uppercase tracking-widest block mb-2">My Email Address *</label>
                    <input 
                      type="email" 
                      required
                      placeholder="e.g. sarah@bangoryoga.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full text-xs p-4 bg-white border border-stone-200 rounded-2xl focus:outline-none focus:ring-1 focus:ring-wellness-sage transition-all text-stone-800 font-sans" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-bold text-stone-650 uppercase tracking-widest block mb-2">My Contact Phone *</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="e.g. (207) 555-0199" 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full text-xs p-4 bg-white border border-stone-200 rounded-2xl focus:outline-none focus:ring-1 focus:ring-wellness-sage transition-all text-stone-800 font-sans" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-stone-650 uppercase tracking-widest block mb-2">Studio / Brand Name (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Bangor Waterfront Yoga" 
                      value={formData.studioName}
                      onChange={(e) => setFormData({ ...formData, studioName: e.target.value })}
                      className="w-full text-xs p-4 bg-white border border-stone-200 rounded-2xl focus:outline-none focus:ring-1 focus:ring-wellness-sage transition-all text-stone-800 font-sans" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-stone-650 uppercase tracking-widest block mb-2">My Primary Growth Goal</label>
                  <select 
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    className="w-full text-xs p-4 bg-white border border-stone-200 rounded-2xl focus:outline-none focus:ring-1 focus:ring-wellness-sage transition-all text-stone-800 font-sans"
                  >
                    <option>Increase Class Bookings</option>
                    <option>Launch Gated Video Membership</option>
                    <option>Optimize Local Google Rankings (SEO)</option>
                    <option>Promote Specialized Healing Workshops</option>
                    <option>Modernize Outdated/Slow Website</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-stone-650 uppercase tracking-widest block mb-2">Tell Us About Your Offerings (Styles taught, locations, etc.)</label>
                  <textarea 
                    rows={4}
                    placeholder="Tell us about the styles you teach, where you currently hold classes, what your timeline is, and what features are most vital to your dream platform..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full text-xs p-4 bg-white border border-stone-200 rounded-2xl focus:outline-none focus:ring-1 focus:ring-wellness-sage transition-all text-stone-800 font-sans leading-relaxed" 
                  />
                </div>

                {formError && (
                  <p className="text-red-500 text-xs font-semibold">{formError}</p>
                )}

                <button 
                  type="submit" 
                  disabled={formLoading}
                  className="w-full py-5 bg-[#5D7A65] text-white text-[11px] font-bold uppercase tracking-[0.25em] rounded-2xl hover:bg-[#8b5e3c] transition-all duration-300 shadow-xl shadow-wellness-sage/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  {formLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Verifying consultation slot...
                    </>
                  ) : (
                    <>
                      Book My Free Website Strategy Session <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-stone-400 font-medium">
                  🔒 We respect your privacy. No spam. You will schedule a friendly, 1-on-1 strategy call.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Interactive Cluster Selector Grid */}
      <section id="interactive-cluster-selector" className="py-24 bg-stone-50 border-t border-b border-stone-200/40 relative">
        <div className="absolute inset-0 bg-wellness-sage/5 blur-3xl rounded-full" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="label-caps !text-[#8b5e3c]">SEO & Marketing Content Cluster</span>
            <h2 className="text-4xl font-serif text-wellness-stone">
              Explore Our Comprehensive Bangor Wellness Marketing Directories
            </h2>
            <div className="w-16 h-1 px-4 bg-wellness-sage mx-auto rounded-full mt-4" />
            <p className="text-sm text-wellness-muted pt-2 leading-relaxed max-w-2xl mx-auto">
              We have constructed 20 distinct high-yielding SEO resource pages targeting specialized segments of the Bangor wellness economy. Click on any directory below to instantly view custom challenges, essential features, schema integrations, and local case studies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {clusterTitles.map((t, idx) => {
              const slugVal = slugify(t);
              const isActive = activeSlug === slugVal;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    navigate(`/bangor-yoga-instructor-website/${slugVal}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`text-left p-6 rounded-3xl border transition-all flex flex-col justify-between h-[180px] group cursor-pointer ${
                    isActive 
                      ? 'bg-white border-wellness-sage shadow-xl ring-2 ring-wellness-sage/10' 
                      : 'bg-white hover:bg-stone-50/50 border-stone-200/60 hover:border-wellness-sage/40 hover:shadow-lg'
                  }`}
                >
                  <div className="space-y-3">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block ${
                      isActive ? 'bg-wellness-sage/10 text-wellness-sage' : 'bg-stone-100 text-stone-500'
                    }`}>
                      Resource Guide {idx + 1}
                    </span>
                    <h4 className={`text-xs font-serif font-bold leading-snug ${
                      isActive ? 'text-wellness-sage font-extrabold' : 'text-stone-800'
                    }`}>
                      {t}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-stone-100 w-full text-[10px] font-bold">
                    <span className={`${isActive ? 'text-wellness-sage' : 'text-stone-400 group-hover:text-[#8b5e3c]'}`}>
                      {isActive ? 'Current Reading' : 'Explore Resource' }
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 transition-transform ${
                      isActive ? 'text-wellness-sage translate-x-1' : 'text-stone-350 group-hover:translate-x-1 group-hover:text-[#8b5e3c]'
                    }`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Local Footnote and Links */}
      <section className="py-12 bg-[#FAF9F6] border-t border-stone-100 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <p className="text-sm text-wellness-muted italic leading-relaxed">
            Proudly assisting the Bangor region, Maine wellness experts in Downtown Bangor, Lower Penobscot Valley, Kenduskeag, Brewer, Orono, and Acadia retreat landscapes.
          </p>
          <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block">
            YogaClientFlow Studio Inc • 100% Focused on Wellness Operations
          </span>
        </div>
      </section>

    </div>
  );
}
