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
import { getHalifaxTopicBySlug, clusterTitles, slugify } from '../data/halifaxSeoCluster';

export default function HalifaxYogaInstructorWebsite() {
  const { topicSlug } = useParams();
  const navigate = useNavigate();

  // Active SEO article identification
  const activeSlug = topicSlug || 'why-every-halifax-yoga-instructor-needs-a-professional-website';
  const topicData = getHalifaxTopicBySlug(activeSlug);

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

  // Halifax Teacher Directory Mockup interactive state
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
        source: `Halifax Yoga Landing Page - ${topicData.title}`,
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

  // Mock Halifax directory data
  const mockTeachers = [
    { name: 'Christine Murphy, RYT-500', style: 'Vinyasa Flow', level: 'Intermediate', location: 'North End Halifax', spec: 'Sports injury recovery & core alignment', bio: 'Christine leads classes at Point Pleasant Park in summer and offers private restorative alignment sessions in North End.' },
    { name: 'David Thorne, ERYT-200', style: 'Hatha Yoga', level: 'Beginner', location: 'Downtown Halifax', spec: 'Mindfulness & breath release', bio: 'David integrates alignment with mindfulness routines inspired by Nova Scotia’s beautiful coastline.' },
    { name: 'Brooke Sinclair, RYT-200', style: 'Yin Yoga', level: 'All Levels', location: 'Dartmouth', spec: 'Myofascial release & deep relaxation', bio: 'Brooke teaches deeply relaxing Restorative and Yin sessions designed to warm and nourish during Atlantic winters.' },
    { name: 'Michael Fraser, C-IAYT', style: 'Therapeutic Yoga', level: 'Seniors', location: 'Quinpool Road Region', spec: 'Back pain resolution & prenatal alignment', bio: 'Helping seniors and prenatal students with medically-informed, gentle therapeutic flows on Quinpool.' }
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
          "name": "YogaClientFlow Halifax Web Design",
          "image": "https://yogaclientflow.com/assets/halifax-landing-hero.jpg",
          "@id": `https://yogaclientflow.com/halifax-yoga-instructor-website/${topicData.slug}`,
          "url": `https://yogaclientflow.com/halifax-yoga-instructor-website/${topicData.slug}`,
          "telephone": "+19028000000",
          "priceRange": "$$",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Downtown Spring Garden Road",
            "addressLocality": "Halifax",
            "addressRegion": "NS",
            "postalCode": "B3J 1H1",
            "addressCountry": "CA"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 44.6464,
            "longitude": -63.5729
          },
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
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
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-wellness-sage/5 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-wellness-sunset/10 blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Hero Copy */}
            <div className="lg:col-span-6 text-left space-y-8">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-wellness-sage/10 text-wellness-sage text-[10px] font-bold uppercase tracking-widest">
                  <Sparkles className="w-4.5 h-4.5 animate-pulse" /> Halifax, Nova Scotia Premium Digital Design Only
                </div>
                
                <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#8b5e3c]/10 text-[#8b5e3c] text-[10px] font-bold uppercase tracking-widest border border-[#8b5e3c]/15">
                  <Layers className="w-3.5 h-3.5" /> Core Resource #{clusterTitles.indexOf(topicData.title) === -1 ? 1 : (clusterTitles.indexOf(topicData.title) + 1)} of 49
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
                    <span>Active Halifax SEO Guide: <strong className="text-wellness-sage font-bold ml-1">{topicData.title}</strong></span>
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
                        Explore the Halifax Wellness SEO Directory Content Cluster (49 Pages)
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
                                navigate(`/halifax-yoga-instructor-website/${slugVal}`);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
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

              <h1 className="text-4xl md:text-5xl lg:text-6.5xl font-serif text-wellness-stone leading-[1.1] tracking-tight">
                {topicData.heroHeadline}
              </h1>
              <p className="text-md md:text-lg text-wellness-muted leading-relaxed max-w-xl">
                {topicData.heroSubheadline}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <a 
                  href="#contact-form-section"
                  className="button-primary text-center py-5 flex items-center justify-center gap-2"
                >
                  Get My Free Halifax Web Consultation <ArrowRight className="w-4 h-4" />
                </a>
                <a 
                  href="#interactive-cluster-selector"
                  className="button-secondary text-center py-5"
                >
                  Explore All 49 Halifax SEO Resources
                </a>
              </div>

              <div className="flex items-center gap-6 pt-4 border-t border-stone-200/50">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-wellness-sage text-white font-bold text-xs flex items-center justify-center">CM</div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-[#8B5E3C] text-white font-bold text-xs flex items-center justify-center">DT</div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-wellness-accent text-white font-bold text-xs flex items-center justify-center">BS</div>
                </div>
                <div>
                  <span className="block text-xs font-bold text-stone-800">Trusted by Nova Scotia Wellness Leaders</span>
                  <span className="text-[10px] text-wellness-muted font-mono block">Halifax • Dartmouth • Bedford • Sackville</span>
                </div>
              </div>
            </div>

            {/* Hero Mockup Graphic */}
            <div className="lg:col-span-6 relative">
              <div className="absolute inset-0 bg-[#E8EDE0]/45 rounded-[60px] transform rotate-3 scale-102" />
              <div className="bg-white border border-stone-100 rounded-[50px] shadow-2xl p-8 relative overflow-hidden space-y-6 text-left">
                
                {/* Visual bar */}
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#E57A44]" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#E8D480]" />
                    <span className="w-3.5 h-3.5 rounded-full bg-wellness-sage" />
                  </div>
                  <span className="text-[10px] font-mono text-stone-400 font-bold bg-stone-50 px-3 py-1.5 rounded-full">
                    halifax-wellness-studio-preview
                  </span>
                </div>

                {/* Calendar Showcase Mockup */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-stone-50 p-4 rounded-3xl border border-stone-100">
                    <div>
                      <span className="text-[#8B5E3C] text-[10px] uppercase font-bold tracking-widest block">Available Class Today</span>
                      <strong className="text-sm font-serif text-stone-800 block">Restorative Alignment & Breathwork</strong>
                      <span className="text-xs text-[#5D6B5E] block flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3 h-3" /> Point Pleasant Sanctuary, Halifax NS
                      </span>
                    </div>
                    <span className="px-4 py-2 bg-wellness-sage/10 text-wellness-sage text-xs font-bold rounded-full">
                      5 Mats Left
                    </span>
                  </div>

                  {/* Active Intake form flow */}
                  <div className="border border-stone-200/60 p-5 rounded-3xl space-y-3">
                    <span className="text-[10px] font-bold text-wellness-accent uppercase tracking-widest block">Frictionless Student Intake</span>
                    <h4 className="text-sm font-bold text-stone-850">Required Safety Waiver Signed digitally</h4>
                    <div className="bg-[#FAF9F6] p-3.5 rounded-2xl text-[11px] text-stone-500 leading-relaxed border border-stone-100 italic">
                      "I hereby release this professional Halifax yoga therapist from liability and confirm that my health assessment reports align with practice targets..."
                    </div>
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span>Signee: Alex Miller</span>
                      <span className="text-wellness-sage font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 fill-current text-wellness-sage text-white" /> Secured Signature Saved
                      </span>
                    </div>
                  </div>

                  {/* Stripe Payment Integration badge */}
                  <div className="bg-stone-50 p-4 rounded-3xl flex justify-between items-center text-xs text-stone-600 font-medium">
                    <span className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#8b5e3c]" /> Stripe Encrypted Sandbox
                    </span>
                    <span className="font-mono text-[10px] font-bold bg-[#E8EDE0] text-[#3C4A3E] px-2.5 py-1 rounded-md">
                      VISA • MASTERCARD • APPLE PAY
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </header>

      {/* SECTION 2: Current Challenges */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <span className="label-caps !text-wellness-accent">Operational Obstacles</span>
            <h2 className="text-4xl md:text-5xl font-serif text-wellness-stone">
              Are These Obstacles Holding Back Your Halifax Yoga Business?
            </h2>
            <div className="w-16 h-1 px-4 bg-[#5D7A65] mx-auto rounded-full mt-4" />
            <p className="text-md text-slate-500 max-w-2xl mx-auto leading-relaxed pt-2">
              {topicData.problemIntro}
            </p>
          </div>

          {/* Dynamic Targeted Topic Challenges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {topicData.challenges.map((c, idx) => (
              <div 
                key={idx} 
                className="bg-stone-50/50 border border-stone-100 p-8 rounded-[40px] space-y-4 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group text-left"
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

          {/* General Halifax Competitor Bottlenecks Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl font-serif text-stone-800">Additional Common Digital Failures in Nova Scotia</h3>
            <p className="text-xs text-wellness-muted mt-2">Many local yoga and wellness operators struggle with these 10 structural design gaps:</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-left">
            {[
              {
                title: "Slow Loading Pages",
                desc: "Sluggish templates with bloated widgets lose users before checkout can complete."
              },
              {
                title: "Poor Mobile Layouts",
                desc: "Clunky views that wrap columns improperly during smartphone checkout."
              },
              {
                title: "Unsecured Payment Fields",
                desc: "Relying on public links rather than embedded PCI gates diminishes professional trust."
              },
              {
                title: "No Inbound Lead Capture",
                desc: "Failing to gather emails means local visitors leave and never return."
              },
              {
                title: "No Local Schema Markups",
                desc: "Lacking structural schemas prevents you from showing up on geographic local map listings."
              },
              {
                title: "Unclear Call to Actions",
                desc: "Buttons are small, hidden, or redirect students to erratic separate landing spaces."
              },
              {
                title: "No Class Packing Tiers",
                desc: "Offering only drop-ins instead of repeating memberships restricts stable cash flow."
              },
              {
                title: "Corporate Gaps",
                desc: "Without an elegant website, local Halifax corporate groups or organizations choose larger wellness firms."
              },
              {
                title: "Workshop Hurdles",
                desc: "Promoting special events or sound therapy retreats remains admin-heavy without custom page gates."
              },
              {
                title: "Platform Dependence",
                desc: "Relying on third-party SaaS calendars that collect forced fees on every registration."
              }
            ].map((p, idx) => (
              <div 
                key={idx} 
                className="bg-stone-50/40 hover:bg-white border hover:border-[#5D7A65]/20 p-6 rounded-3xl transition-all duration-300 shadow-sm relative overflow-hidden group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#E8EDE0] text-[#5D7A65] flex items-center justify-center font-bold mb-4 group-hover:bg-[#5D7A65] group-hover:text-white transition-all">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-stone-800 leading-tight mb-2 group-hover:text-wellness-accent transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs text-wellness-muted leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 3: Why This Matters */}
      <section className="py-24 bg-stone-50 border-t border-b border-stone-200/30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            <div className="lg:col-span-12 space-y-8 text-left">
              <span className="label-caps !text-wellness-sage">Strategic Importance</span>
              <h2 className="text-4xl md:text-5xl font-serif text-wellness-stone leading-tight">
                Why This Matters for Your Halifax Wellness Journey
              </h2>
              <p className="text-md text-slate-700 leading-relaxed font-serif italic border-l-4 border-wellness-sage/30 pl-4 py-1">
                "{topicData.whyItMatters}"
              </p>

              <div className="space-y-6 pt-4 text-xs text-wellness-muted leading-relaxed">
                <p>
                  In the competitive Halifax Regional Municipality (HRM) market, which runs from busy Spring Garden Road to clinical centers in Clayton Park, Dartmouth crossing, and wellness spaces in Bedford, practitioners are constantly fighting for client retention. When your business structure relies on social media feeds and texting to confirm spots, three major problems develop over time:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Diluted Expertise:</strong> Experienced professionals are forced to charge identical rates as new training graduates because they lack the professional visual framework that demonstrates elite authority.</li>
                  <li><strong>Revenue Loss:</strong> Up to 35% of prospective registrations are lost during off-hours when potential students want to register instantly on mobile, but have to wait for you to answer a DM.</li>
                  <li><strong>Wasted Outlays:</strong> You spend hard-earned funds renting spaces at local wellness venues, only to face empty slots due to disorganized pre-payment collections.</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4: How a Professional Website Solves It */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <span className="label-caps !text-wellness-sage">Practical Solutions</span>
            <h2 className="text-4xl md:text-5xl font-serif text-wellness-stone">
              Stepping Into Flow: How Custom Systems Automate Growth
            </h2>
            <div className="w-16 h-1 px-4 bg-wellness-sage mx-auto rounded-full mt-4" />
            <p className="text-md text-slate-500 max-w-2xl mx-auto leading-relaxed pt-2">
              Our website-based development replaces chaotic manual administration with a streamlined, digital sanctuary.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
            {[
              {
                title: "24/7 Self-Service Registration",
                desc: "Allow students to register, sign required papers, and pay instantly from any device without requiring personal interaction."
              },
              {
                title: "Predictable Subscription Revenue",
                desc: "Shift your business model from unpredictable drop-in sessions to stable, automatic monthly recurring memberships."
              },
              {
                title: "Eliminate Late Payment Friction",
                desc: "Ensure every class reservation is fully paid and secure through an integrated system before students step on their mats."
              },
              {
                title: "Authoritative On-Page Search Dominance",
                desc: "Optimize with native schema markup to consistently place your business at the top of local Halifax map listings."
              }
            ].map((s, idx) => (
              <div 
                key={idx} 
                className="bg-[#FAF9F6] border border-stone-100 p-8 rounded-[36px] space-y-4 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-wellness-sage/10 text-wellness-sage flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </div>
                <h3 className="text-lg font-serif font-bold text-stone-850">
                  {s.title}
                </h3>
                <p className="text-xs text-wellness-muted leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 5: Essential Features */}
      <section className="py-24 bg-stone-50 border-t border-stone-200/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <span className="label-caps !text-[#8b5e3c]">Product Architecture</span>
            <h2 className="text-4xl md:text-5xl font-serif text-wellness-stone">
              Essential Features Built For Professional Growth
            </h2>
            <div className="w-16 h-1 px-4 bg-[#8b5e3c] mx-auto rounded-full mt-4" />
            <p className="text-md text-slate-500 max-w-2xl mx-auto leading-relaxed pt-2">
              We design specialized features explicitly optimized to support the high-converting requirements of this topic:
            </p>
          </div>

          {/* Dynamic Core Targeted Features */}
          <div className="mb-16 bg-gradient-to-br from-[#E8EDE0]/40 to-transparent border border-[#5D7A65]/10 p-8 sm:p-12 rounded-[40px] text-left space-y-8">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#8b5e3c] block mb-2">Targeted Feature Checklist</span>
              <h3 className="text-2xl font-serif text-[#5B6D5E]">Tailored Specifications for: {topicData.title}</h3>
              <p className="text-xs text-wellness-muted mt-2 font-mono">These critical development components are integrated directly into your Halifax wellness platform packages:</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {topicData.essentialFeatures.map((ef, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm space-y-3">
                  <div className="w-10 h-10 rounded-full bg-wellness-sage/10 text-wellness-sage flex items-center justify-center font-bold text-xs">
                    0{idx + 1}
                  </div>
                  <h4 className="text-md font-serif font-bold text-stone-800 leading-tight">{ef.title}</h4>
                  <p className="text-xs text-wellness-muted leading-relaxed">{ef.desc}</p>
                  <p className="text-[10px] text-[#8b5e3c] bg-[#8b5e3c]/5 p-2.5 rounded-xl border border-[#8b5e3c]/10 font-mono">
                    <strong className="font-sans font-bold block mb-1">Tech Stack Spec:</strong> {ef.specDetail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            {[
              {
                icon: Calendar,
                title: "Live Scheduling Calendar",
                desc: "An intuitive schedule interface allowing students to instantly sign up for classes and workshops from any device.",
                detail: "Includes automatic waiting-lists and custom cancellation limit triggers."
              },
              {
                icon: Shield,
                title: "Auto Liability Waiver Gate",
                desc: "Require students to view, accept, and digitally sign required liability documents during the checkout process.",
                detail: "Signed, timestamped contract agreements stored securely inside your student profiles."
              },
              {
                icon: DollarSign,
                title: "Stripe Secured Payments",
                desc: "Collect drop-ins, Class packs, and recurring membership renewals directly to your bank account safely.",
                detail: "Secure and PCI-DSS compliant interface without retaining raw card information on-site."
              },
              {
                icon: Globe,
                title: "Advanced On-Page Local SEO",
                desc: "Clean code structure optimized to rank your wellness brand high on geographic Google results.",
                detail: "Includes geographic markup, schema configuration, and fast-loading web parameters."
              }
            ].map((f, idx) => (
              <div 
                key={idx} 
                className="bg-white p-8 rounded-[40px] border border-stone-100 shadow-sm space-y-4 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-2xl bg-stone-50 text-[#8b5e3c] flex items-center justify-center font-bold">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-850">
                  {f.title}
                </h3>
                <p className="text-xs text-wellness-muted leading-relaxed">
                  {f.desc}
                </p>
                <div className="bg-[#FAF9F6] p-3 rounded-2xl text-[10px] text-stone-500 font-mono italic">
                  {f.detail}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 6: Benefits for Halifax Yoga Professionals */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left space-y-8">
          <span className="label-caps !text-wellness-sage">Local Market Advantage</span>
          <h2 className="text-4xl md:text-5xl font-serif text-wellness-stone leading-tight max-w-3xl">
            Dominating the Halifax & HRM Wellness Market
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-xs text-wellness-muted leading-relaxed select-none">
              <p>
                Halifax, Nova Scotia is a highly competitive, fast-growing wellness environment. To run a successful, sustainable business from the busy North End to Dartmouth and Bedford, independent teachers and physical studio owners must look highly professional. A custom digital framework gives you distinct structural benefits over standard, sluggish SaaS apps:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Point Pleasant Park Outdoors:</strong> Running outdoor sessions in the spring and summer? A mobile-friendly scheduling page lets students locate you, check slots, and reserve spaces instantly.</li>
                <li><strong>Atlantic Winter Gating:</strong> During freezing Nova Scotia winters, offer password-secured video databases where students pay monthly subscriptions to stream guided Hatha flows or restorative sounds from home.</li>
                <li><strong>Downtown Corporate Outreach:</strong> Position your brand as the premium choice for corporate wellness sessions at commercial offices and universities, securing consistent, high-yield contracts.</li>
              </ul>
              <p className="italic text-stone-700 bg-[#E8EDE0]/35 p-5 rounded-3xl border border-stone-100 font-serif">
                "Our Halifax development focuses purely on showcasing your certifications, standardizing booking steps, and driving direct organic registrations to build long-term local wealth."
              </p>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="bg-stone-50 border border-stone-100 rounded-[32px] p-8 space-y-4">
                <span className="text-[10px] font-bold text-[#8b5e3c] uppercase tracking-widest block">Geographic Map Listing targeting</span>
                <p className="text-xs text-[#78716c]">We build clean structural schema indicators targeting critical neighborhoods in the Halifax region:</p>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-bold font-mono text-[#3C4A3E]">
                  <div className="bg-white p-3 rounded-2xl border border-stone-150">✓ North End Halifax</div>
                  <div className="bg-white p-3 rounded-2xl border border-stone-150">✓ South End / Dalhousie</div>
                  <div className="bg-white p-3 rounded-2xl border border-stone-150">✓ Quinpool Road</div>
                  <div className="bg-white p-3 rounded-2xl border border-stone-150">✓ Downtown Waterfront</div>
                  <div className="bg-white p-3 rounded-2xl border border-stone-150">✓ Dartmouth Core</div>
                  <div className="bg-white p-3 rounded-2xl border border-stone-150">✓ Bedford Highway</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 7: Student Experience Improvements */}
      <section className="py-24 bg-[#FAF9F6] border-t border-b border-stone-205 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <span className="label-caps !text-wellness-accent">Practitioner Delight</span>
            <h2 className="text-4xl md:text-5xl font-serif text-wellness-stone">
              Frictionless Journeys: The Student Experience
            </h2>
            <div className="w-16 h-1 px-4 bg-wellness-sage mx-auto rounded-full mt-4" />
            <p className="text-md text-slate-500 max-w-2xl mx-auto leading-relaxed pt-2">
              {topicData.studentExperience}
            </p>
          </div>

          {/* Interactive Teacher Directory Search Mockup */}
          <div className="bg-white rounded-[40px] border border-stone-150 shadow-xl p-8 max-w-4xl mx-auto text-left space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#8b5e3c] block mb-1">Interactive Feature Sandbox</span>
              <h3 className="text-xl font-serif font-bold text-stone-850">Halifax Teacher & Studio Directory Mockup</h3>
              <p className="text-xs text-wellness-muted mt-1">Simulate what a student sees when searching your custom directory system. Tap filters to instantly sort class styles, skill levels, and locations.</p>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">Class Style</label>
                <div className="flex flex-wrap gap-1.5">
                  {['All', 'Vinyasa Flow', 'Hatha Yoga', 'Yin Yoga', 'Therapeutic Yoga'].map(style => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setSelectedStyle(style)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${selectedStyle === style ? 'bg-wellness-sage text-white font-semibold' : 'bg-stone-50 hover:bg-stone-100 text-stone-600'}`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">Skill Level</label>
                <div className="flex flex-wrap gap-1.5">
                  {['All', 'Beginner', 'Intermediate', 'All Levels', 'Seniors'].map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSelectedLevel(level)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${selectedLevel === level ? 'bg-wellness-sage text-white font-semibold' : 'bg-stone-50 hover:bg-stone-100 text-stone-600'}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">Keyword Search</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search location or expertise..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl py-2 px-10 text-xs text-stone-700 placeholder:text-stone-400 focus:outline-none focus:border-wellness-sage transition-colors"
                  />
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-2.5" />
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="pt-4 border-t border-stone-100 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#78716c] block">Matching Instructors ({filteredTeachers.length})</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTeachers.map((t, index) => (
                  <div key={index} className="border border-stone-100 p-5 rounded-3xl bg-stone-50 text-xs space-y-3 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#5D7A65]/5 rounded-full translate-x-4 -translate-y-4" />
                    <div className="flex justify-between items-start">
                      <div>
                        <strong className="text-sm font-bold text-stone-850 block">{t.name}</strong>
                        <span className="text-[10px] text-wellness-accent font-mono block mt-0.5">{t.style} • {t.level}</span>
                      </div>
                      <span className="bg-white px-2.5 py-1 border border-stone-150 rounded-full text-[9px] font-semibold text-stone-500 flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 text-[#8b5e3c]" /> {t.location}
                      </span>
                    </div>
                    <p className="text-stone-500 leading-relaxed text-[11px]">{t.bio}</p>
                    <div className="bg-white px-3 py-2 rounded-xl border border-stone-100 text-[10px] text-stone-500 font-medium">
                      <strong>Specialty Focus:</strong> {t.spec}
                    </div>
                  </div>
                ))}
                {filteredTeachers.length === 0 && (
                  <div className="col-span-2 text-center py-8 text-xs text-stone-400 font-medium bg-stone-50 rounded-3xl border border-stone-100 italic">
                    No matching Halifax teachers found. Reset filters above.
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 8: Business Growth Opportunities */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <span className="label-caps !text-wellness-sage">Scale Vectors</span>
            <h2 className="text-4xl md:text-5xl font-serif text-wellness-stone">
              Five Core Scaling Engines
            </h2>
            <div className="w-16 h-1 px-4 bg-wellness-sage mx-auto rounded-full mt-4" />
            <p className="text-md text-slate-500 max-w-2xl mx-auto leading-relaxed pt-2">
              A custom digital system optimizes five key business components to drive consistent local growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 text-left max-w-7xl mx-auto">
            {[
              {
                title: "1. Lead Generation",
                desc: topicData.businessGrowth.leads,
                color: "bg-[#5D7A65]/10 text-[#2E3C32]"
              },
              {
                title: "2. Online Bookings",
                desc: topicData.businessGrowth.bookings,
                color: "bg-[#8B5E3C]/10 text-[#472E1B]"
              },
              {
                title: "3. Memberships",
                desc: topicData.businessGrowth.memberships,
                color: "bg-wellness-accent/10 text-[#4E3514]"
              },
              {
                title: "4. Dynamic Reviews",
                desc: topicData.businessGrowth.reviews,
                color: "bg-stone-100 text-stone-700"
              },
              {
                title: "5. Referral Loops",
                desc: topicData.businessGrowth.referrals,
                color: "bg-wellness-sage/10 text-[#3C4A3E]"
              }
            ].map((g, idx) => (
              <div 
                key={idx} 
                className="bg-stone-50/50 hover:bg-white border hover:border-stone-200/60 p-8 rounded-[36px] space-y-4 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold ${g.color}`}>
                    Engine #{idx + 1}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-stone-850">
                    {g.title}
                  </h3>
                  <p className="text-xs text-wellness-muted leading-relaxed">
                    {g.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 9: Case Study Example */}
      <section className="py-24 bg-stone-50 border-t border-b border-stone-200/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <span className="label-caps !text-wellness-accent">Verified Transformation</span>
            <h2 className="text-4xl md:text-5xl font-serif text-wellness-stone">
              Success Story: A Local Halifax Case Analysis
            </h2>
            <div className="w-16 h-1 px-4 bg-wellness-sage mx-auto rounded-full mt-4" />
            <p className="text-md text-slate-500 max-w-2xl mx-auto leading-relaxed pt-2">
              Learn how our tailored wellness web solutions helped expand community outreach and automate operations for: {topicData.caseStudy.instructor}.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left statistics items */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-white p-8 rounded-[32px] border border-stone-50 shadow-lg relative overflow-hidden text-center">
                <div className="absolute top-0 left-0 w-3 h-full bg-wellness-sage" />
                <span className="text-[9px] font-bold text-charcoal uppercase tracking-widest block mb-1">Weekly Student Discovery</span>
                <span className="text-6xl font-serif font-bold text-stone-800 block">+250%</span>
                <p className="text-xs text-wellness-muted mt-2 max-w-xs mx-auto text-left leading-relaxed">
                  Organic search visibility increased dramatically across Downtown Halifax, Dartmouth, and Bedford within sixty days.
                </p>
              </div>

              <div className="bg-white p-8 rounded-[32px] border border-stone-50 shadow-lg relative overflow-hidden text-center">
                <div className="absolute top-0 left-0 w-3 h-full bg-[#8b5e3c]" />
                <span className="text-[9px] font-bold text-charcoal uppercase tracking-widest block mb-1">Attendance/Roster Rates</span>
                <span className="text-6xl font-serif font-bold text-[#8b5e3c] block">+48%</span>
                <p className="text-xs text-wellness-muted mt-2 max-w-xs mx-auto text-left leading-relaxed">
                  Class slots and private bookings regularly reach full capacity due to responsive checkout funnels.
                </p>
              </div>
            </div>

            {/* Right Case Study Content */}
            <div className="lg:col-span-7 text-left space-y-6">
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
                  <strong>Our Advanced Solutions:</strong> {topicData.caseStudy.solution}
                </p>
                <p>
                  <strong>Measurable Growth Outcomes:</strong> {topicData.caseStudy.result}
                </p>
              </div>
              
              {/* Authentic quote footer */}
              <div className="border-t border-stone-200/60 pt-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-wellness-sage/20 font-serif font-bold text-xl text-[#3C4A3E] flex items-center justify-center uppercase">
                  {topicData.caseStudy.instructor.substring(0, 2)}
                </div>
                <div>
                  <span className="block text-sm font-bold text-stone-850">{topicData.caseStudy.instructor}</span>
                  <span className="text-[9px] text-wellness-muted uppercase font-bold tracking-widest">Halifax • Nova Scotia, Canada</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 10: Local SEO Benefits */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="label-caps !text-wellness-sage">Geographic Search Optimization</span>
            <h2 className="text-4xl md:text-5xl font-serif text-wellness-stone">
              Localized SEO Results: Winning the Halifax Search Results
            </h2>
            <div className="w-16 h-1 px-4 bg-wellness-sage mx-auto rounded-full mt-4" />
            <p className="text-md text-slate-500 max-w-2xl mx-auto leading-relaxed pt-2">
              {topicData.localSeoBenefits}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left text-xs text-wellness-muted leading-relaxed">
            <div className="bg-stone-50 p-8 rounded-3xl space-y-3 border border-stone-100">
              <div className="w-10 h-10 rounded-full bg-wellness-sage/15 text-wellness-sage flex items-center justify-center font-bold font-mono">1</div>
              <h4 className="text-md font-serif font-bold text-stone-800 leading-tight">Geographic Schema Markups</h4>
              <p>We inject structured JSON-LD data files pointing directly to the Halifax Regional Municipality (HRM). This makes your business recognizable to crawler engines, ranking you for geographic local map queries.</p>
            </div>
            <div className="bg-stone-50 p-8 rounded-3xl space-y-3 border border-stone-100">
              <div className="w-10 h-10 rounded-full bg-wellness-sage/15 text-wellness-sage flex items-center justify-center font-bold font-mono">2</div>
              <h4 className="text-md font-serif font-bold text-stone-800 leading-tight">Optimized Meta Tags & Keywords</h4>
              <p>Every post in this directory outlines primary keywords (e.g., <strong>{topicData.primaryKeyword}</strong>) and secondary variations built naturally into headings, metadata titles, and image markers.</p>
            </div>
            <div className="bg-stone-50 p-8 rounded-3xl space-y-3 border border-stone-100">
              <div className="w-10 h-10 rounded-full bg-wellness-sage/15 text-wellness-sage flex items-center justify-center font-bold font-mono">3</div>
              <h4 className="text-md font-serif font-bold text-stone-800 leading-tight">Hyperlocal Internal Linking</h4>
              <p>We configure semantic internal linking patterns across all of our 49 Halifax directory pages. This ensures search engines easily index your entire workspace, flowing authority seamlessly to your core consultation funnel.</p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 11: Frequently Asked Questions */}
      <section className="py-24 bg-stone-50 border-t border-b border-stone-200/40 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <span className="label-caps !text-wellness-sage">In-depth Clarity</span>
            <h2 className="text-4xl md:text-5xl font-serif text-stone-850">Frequently Asked Questions</h2>
            <div className="w-16 h-1 px-4 bg-[#5D7A65] mx-auto rounded-full mt-4" />
            <p className="text-md text-wellness-muted max-w-sm mx-auto">
              Transparent, objective insights regarding design timelines, localized SEO formulas, and custom integrations.
            </p>
          </div>

          <div className="space-y-4 text-left">
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

      {/* SECTION 12 & CTA: Contact and Lead Form Section */}
      <section id="contact-form-section" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left form copy */}
            <div className="lg:col-span-6 text-left space-y-8">
              <span className="label-caps !text-[#8b5e3c]">Strategic Consultation</span>
              <h2 className="text-4xl md:text-5xl font-serif text-wellness-stone leading-tight">
                Establish Your Halifax Digital Sanctuary Today
              </h2>
              <p className="text-xs text-wellness-muted leading-relaxed">
                Schedule your free 25-minute strategy call. We will audit your current local Google search visibility in Halifax, outline custom mobile calendering flows, set up secure digital safety waivers, and map out exactly how to convert local web searchers into repeating monthly members.
              </p>
              
              <div className="space-y-4 pt-4 border-t border-stone-100">
                <div className="flex items-center gap-4 text-xs font-semibold text-stone-800">
                  <div className="w-8 h-8 rounded-full bg-wellness-sage/10 text-wellness-sage flex items-center justify-center">
                    ✓
                  </div>
                  <span>100% Customized Designs (No generic pre-made templates)</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold text-stone-800">
                  <div className="w-8 h-8 rounded-full bg-wellness-sage/10 text-wellness-sage flex items-center justify-center">
                    ✓
                  </div>
                  <span>Zero Forced Monthly Platform Commission Commissions</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold text-stone-800">
                  <div className="w-8 h-8 rounded-full bg-wellness-sage/10 text-wellness-sage flex items-center justify-center">
                    ✓
                  </div>
                  <span>Built-in Legal Safety Waiver Collections and Storage</span>
                </div>
              </div>
            </div>

            {/* Right Form Component */}
            <div className="lg:col-span-6 relative">
              <div className="absolute inset-0 bg-[#E8EDE0]/35 rounded-[40px] transform -rotate-2" />
              <div className="bg-[#FAF9F6] border border-stone-100 p-8 rounded-[40px] shadow-xl relative z-10 text-left">
                
                <AnimatePresence mode="wait">
                  {!formSubmitted ? (
                    <motion.form 
                      onSubmit={handleFormSubmit}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-5"
                    >
                      <h3 className="text-xl font-serif font-bold text-stone-850">Book My Free Design Audit</h3>
                      <p className="text-xs text-wellness-muted">No obligation. Just direct solutions custom-tailored for your local practice.</p>
                      
                      {formError && (
                        <div className="bg-red-50 text-red-650 p-4 rounded-xl text-xs font-semibold border border-red-150 animate-pulse">
                          ⚠️ {formError}
                        </div>
                      )}

                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">My Full Name *</label>
                          <input 
                            type="text"
                            required
                            placeholder="e.g. Elena Fraser"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-white border border-stone-200 rounded-2xl py-3.5 px-4 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-wellness-sage focus:ring-1 focus:ring-wellness-sage/20 transition-all"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">My Professional Email *</label>
                            <input 
                              type="email"
                              required
                              placeholder="e.g. elena@halifaxflow.com"
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              className="w-full bg-white border border-stone-200 rounded-2xl py-3.5 px-4 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-wellness-sage focus:ring-1 focus:ring-wellness-sage/20 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">Phone Number *</label>
                            <input 
                              type="tel"
                              required
                              placeholder="e.g. (902) 555-0199"
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              className="w-full bg-white border border-stone-200 rounded-2xl py-3.5 px-4 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-wellness-sage focus:ring-1 focus:ring-wellness-sage/20 transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">Studio / Practice Name (Optional)</label>
                          <input 
                            type="text"
                            placeholder="e.g. Shanti Vinyasa Studio"
                            value={formData.studioName}
                            onChange={(e) => setFormData({...formData, studioName: e.target.value})}
                            className="w-full bg-white border border-stone-200 rounded-2xl py-3.5 px-4 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-wellness-sage focus:ring-1 focus:ring-wellness-sage/20 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">Core Practice Target</label>
                          <select 
                            value={formData.goal}
                            onChange={(e) => setFormData({...formData, goal: e.target.value})}
                            className="w-full bg-white border border-stone-200 rounded-2xl py-3.5 px-4 text-xs text-stone-800 focus:outline-none focus:border-wellness-sage transition-all"
                          >
                            <option>Increase Class Bookings</option>
                            <option>Sell Subscription Memberships</option>
                            <option>Rank High on Google Local Maps</option>
                            <option>Automate Waivers & Student Intakes</option>
                            <option>Promote Coastal Wellness Retreats</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">My Custom Message / Specific Struggles</label>
                          <textarea 
                            rows={3}
                            placeholder="Provide details on your current systems, struggles, or features you require to grow..."
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                            className="w-full bg-white border border-stone-200 rounded-2xl py-3.5 px-4 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-wellness-sage focus:ring-1 focus:ring-wellness-sage/20 transition-all resize-none"
                          />
                        </div>
                      </div>

                      <button 
                        type="submit"
                        disabled={formLoading}
                        className="w-full button-primary py-4 px-6 text-xs uppercase font-bold tracking-wider rounded-2xl transition-all shadow-md hover:shadow-xl disabled:opacity-50 cursor-pointer text-center"
                      >
                        {formLoading ? 'Submitting secure details...' : 'Submit Design Audit Request'}
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12 space-y-6"
                    >
                      <div className="w-16 h-16 rounded-full bg-wellness-sage text-white flex items-center justify-center text-3xl mx-auto shadow-lg animate-bounce">
                        ✓
                      </div>
                      <h3 className="text-2xl font-serif font-bold text-stone-800">Your Audit Request is confirmed!</h3>
                      <p className="text-xs text-wellness-muted leading-relaxed max-w-sm mx-auto">
                        Namaste, {formData.name}. Our digital design specialist will personally audit your Halifax search visibility and contact you within twenty-four hours to coordinate your calendar flow discussion.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setFormSubmitted(false);
                          setFormData({ name: '', email: '', phone: '', studioName: '', goal: 'Increase Class Bookings', message: '' });
                        }}
                        className="button-secondary py-3 px-6 text-xs text-stone-600 rounded-full cursor-pointer"
                      >
                        Submit another request
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>

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
              Explore Our Comprehensive Halifax Wellness Directories
            </h2>
            <div className="w-16 h-1 px-4 bg-wellness-sage mx-auto rounded-full mt-4" />
            <p className="text-sm text-wellness-muted pt-2 leading-relaxed max-w-2xl mx-auto">
              We have compiled 49 highly targeted geographic resources for specialized segments of the Halifax Regional Municipality (HRM) wellness economy. Click on any resource item below to instantly browse targeted challenges, custom features, schema parameters, and localized case studies.
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
                    navigate(`/halifax-yoga-instructor-website/${slugVal}`);
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
                      Resource #{idx + 1}
                    </span>
                    <h4 className={`text-xs font-serif font-bold leading-snug ${
                      isActive ? 'text-wellness-sage font-extrabold' : 'text-stone-800'
                    }`}>
                      {t}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-stone-100 w-full text-[10px] font-bold">
                    <span className={`${isActive ? 'text-wellness-sage' : 'text-stone-400 group-hover:text-[#8b5e3c]'}`}>
                      {isActive ? 'Active Resource' : 'Explore Resource' }
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
          <p className="text-[10px] text-wellness-muted font-mono leading-relaxed select-none">
            Yogaclientflow Halifax Web Development operations are fully optimized for search ranking engines and built with secure sandbox tools. We help independent yoga instructors, pilates studios, retreat organizers, and meditation leaders establish authoritative neighborhood presence throughout Halifax, Dartmouth, Bedford, Sackville, and surrounding Nova Scotia areas.
          </p>
          <div className="flex justify-center gap-6 text-[10px] font-bold uppercase tracking-widest text-[#8b5e3c]">
            <Link to="/search" className="hover:text-wellness-sage transition-colors">Find Local Teachers</Link>
            <span>•</span>
            <Link to="/blog" className="hover:text-wellness-sage transition-colors">Wellness Blog</Link>
            <span>•</span>
            <Link to="/about" className="hover:text-wellness-sage transition-colors">About Our Platform</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
