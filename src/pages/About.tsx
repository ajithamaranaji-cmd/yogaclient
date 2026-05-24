import React from 'react';
import { motion } from 'motion/react';
import { Leaf, CheckCircle2, Users, Globe, Star, ShieldCheck, MapPin, Calendar, Play, Heart, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const STATS = [
  { icon: Users, value: '10,000+', label: 'Verified Yoga Teachers' },
  { icon: Globe, value: '150+', label: 'Cities Worldwide' },
  { icon: Users, value: '2M+', label: 'Students Connected' },
  { icon: Star, value: '4.9/5', label: 'Average Rating' },
  { icon: ShieldCheck, value: '100%', label: 'Secure & Trusted' },
];

const TIMELINE = [
  { year: '2018', title: 'The Beginning', desc: 'Yogaclientflow started with a simple idea — make it easy for people to find authentic yoga teachers they can trust.', icon: Leaf },
  { year: '2020', title: 'Growing Together', desc: 'We expanded to new cities and helped thousands of teachers and students connect and grow.', icon: Users },
  { year: '2022', title: 'Going Global', desc: 'Yogaclientflow became a global community, bringing yoga closer to home — anywhere in the world.', icon: Globe },
  { year: 'Today & Beyond', title: 'The Future', desc: 'We continue to innovate, support our community, and inspire a healthier, happier world.', icon: Star },
];

const WHY_US = [
  { icon: ShieldCheck, title: 'Trusted & Verified', desc: 'Every teacher is carefully verified for authenticity, experience, and credentials.' },
  { icon: Calendar, title: 'Flexible & Convenient', desc: 'Book in-person, online, or at home — on your schedule.' },
  { icon: MapPin, title: 'Local & Global', desc: 'Find teachers near you or connect with experts around the world.' },
  { icon: Heart, title: 'Community First', desc: "We're more than a platform — we're a supportive wellness community." },
];

const IMPACT_STATS = [
  { value: '250K+', label: 'Classes Booked', icon: Play },
  { value: '95%', label: 'Customer Satisfaction', icon: Heart },
  { value: '500K+', label: 'Lives Impacted', icon: MapPin },
  { value: '1M+', label: 'Hours of Wellness', icon: ShieldCheck },
];

export default function About() {
  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative z-10">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-stone-50 border border-stone-100 mb-8"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-wellness-stone">About Yogaclientflow</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-serif text-wellness-stone leading-tight mb-8"
              >
                Our Mission is to <br />
                <span className="italic font-light text-wellness-sage">Elevate Wellness, Together.</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-wellness-muted leading-relaxed mb-12 max-w-lg"
              >
                Yogaclientflow is the world's trusted platform to discover, connect, and grow through yoga. We empower students to find the right teachers, and help teachers build thriving, purpose-driven careers.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Link to="/signup/student" className="bg-wellness-stone text-white px-10 py-4 rounded-full font-bold text-sm hover:bg-wellness-sage transition-all inline-block">
                  Join Our Community
                </Link>
              </motion.div>
            </div>
            
            <div className="relative h-[400px] md:h-[600px] rounded-[40px] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200" 
                className="w-full h-full object-cover" 
                alt="Meditation" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-white border-y border-stone-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center space-y-2">
                <div className="flex justify-center text-wellness-sage/40">
                  <stat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-wellness-stone">{stat.value}</h3>
                <p className="text-[10px] font-bold text-wellness-muted uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
             <div className="space-y-10">
               <div className="space-y-4">
                 <p className="text-[10px] font-bold text-wellness-sage uppercase tracking-[0.3em]">Our Mission</p>
                 <h2 className="text-5xl md:text-6xl font-serif text-wellness-stone leading-tight">
                   Making Wellness <br /> Accessible to <span className="italic font-light text-wellness-sage">Everyone.</span>
                 </h2>
               </div>
               
               <p className="text-lg text-wellness-muted leading-relaxed italic">
                 We believe yoga is more than a practice — it's a way of life. Our mission is to make authentic yoga accessible to all by connecting students with trusted teachers anytime, anywhere.
               </p>
               
               <div className="space-y-6">
                 {[
                   'Promote physical, mental & emotional well-being',
                   'Support yoga teachers in growing their impact',
                   'Build a global community rooted in trust & care'
                 ].map((text, i) => (
                   <div key={i} className="flex items-center gap-4">
                     <div className="w-6 h-6 rounded-full bg-wellness-sage flex items-center justify-center">
                       <CheckCircle2 className="w-4 h-4 text-white" />
                     </div>
                     <span className="text-sm font-semibold text-wellness-stone">{text}</span>
                   </div>
                 ))}
               </div>
             </div>
             
             <div className="rounded-[40px] overflow-hidden shadow-2xl h-[500px]">
               <img 
                 src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200" 
                 className="w-full h-full object-cover" 
                 alt="Yoga Studio" 
               />
             </div>
          </div>
        </div>
      </section>

      {/* Our Story Timeline */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-24">
            <p className="text-[10px] font-bold text-wellness-sage uppercase tracking-[0.3em] mb-4">Our Story</p>
            <h2 className="text-5xl md:text-6xl font-serif text-wellness-stone">
              Built with <span className="italic font-light text-wellness-sage">Passion.</span> Guided by <span className="italic font-light text-wellness-stone">Purpose.</span>
            </h2>
            <div className="w-24 h-px bg-stone-200 mx-auto mt-8" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            <div className="hidden md:block absolute top-[44px] left-0 right-0 h-px bg-stone-100 -z-10" />
            
            {TIMELINE.map((item, i) => (
              <div key={i} className="text-center space-y-8 group">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-white border border-stone-100 flex items-center justify-center mx-auto shadow-sm group-hover:bg-wellness-sage group-hover:text-white transition-all duration-500">
                    <item.icon className="w-8 h-8" />
                  </div>
                </div>
                <div className="space-y-4">
                   <div>
                     <h4 className="text-xl font-bold text-wellness-stone">{item.title}</h4>
                     <p className="text-sm font-bold text-wellness-sage mt-1">{item.year}</p>
                   </div>
                   <p className="text-sm text-wellness-muted leading-relaxed px-4">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Yogaclientflow */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
             <div className="lg:col-span-1 space-y-10">
               <div className="space-y-4">
                 <p className="text-[10px] font-bold text-wellness-sage uppercase tracking-[0.3em]">Why Yogaclientflow</p>
                 <h2 className="text-5xl font-serif text-wellness-stone leading-tight">
                   More Than a Platform. <br /> It's a <span className="italic font-light text-wellness-sage">Movement.</span>
                 </h2>
               </div>
               <p className="text-lg text-wellness-muted leading-relaxed">
                 We're building the future of wellness by combining technology, trust, and community.
               </p>
               <button className="bg-wellness-stone text-white px-10 py-4 rounded-full font-bold text-sm hover:bg-wellness-sage transition-all">
                 Join the Movement
               </button>
             </div>
             
             <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
               {WHY_US.map((item, i) => (
                 <div key={i} className="bg-white p-10 rounded-[32px] border border-stone-100 shadow-sm space-y-6 hover:shadow-xl hover:border-wellness-sage/20 transition-all">
                   <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center text-wellness-sage">
                     <item.icon className="w-6 h-6" />
                   </div>
                   <div className="space-y-3">
                     <h4 className="text-xl font-bold text-wellness-stone">{item.title}</h4>
                     <p className="text-sm text-wellness-muted leading-relaxed">{item.desc}</p>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </section>

      {/* Our Impact Section */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto rounded-[40px] bg-wellness-stone p-12 md:p-24 relative overflow-hidden text-white">
          <div className="absolute inset-0 z-0">
             <img 
               src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=2000" 
               className="w-full h-full object-cover opacity-10 grayscale" 
               alt="Background" 
             />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-16">
            <div className="max-w-md space-y-8">
              <h2 className="text-5xl font-serif leading-tight">Our Impact <br /> So Far</h2>
              <p className="text-white/60 italic leading-relaxed text-lg">Together, we're creating a healthier, more mindful world.</p>
              <button className="bg-white text-wellness-stone px-8 py-3 rounded-full font-bold text-sm hover:bg-wellness-sage hover:text-white transition-all">
                 See Our Impact
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-12 md:gap-20">
               {IMPACT_STATS.map((stat, i) => (
                 <div key={i} className="space-y-3 text-center md:text-left">
                   <div className="text-wellness-sage mb-4 flex justify-center md:justify-start">
                     <stat.icon className="w-8 h-8" />
                   </div>
                   <h3 className="text-4xl font-bold">{stat.value}</h3>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">{stat.label}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Community Says Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
             <p className="text-[10px] font-bold text-wellness-sage uppercase tracking-[0.3em] mb-4">What Our Community Says</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sarah L */}
            <div className="bg-[#FAF9F6] p-12 rounded-[40px] relative">
               <span className="absolute top-10 left-10 text-6xl font-serif text-wellness-sage/10 leading-none">“</span>
               <p className="text-xl md:text-2xl font-serif italic text-wellness-stone leading-relaxed relative z-10 mb-10">
                 Yogaclientflow helped me find the perfect teacher who understands my needs and supports my journey.
               </p>
               <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg">
                   <img 
                     src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" 
                     alt="Sarah L" 
                     className="w-full h-full object-cover" 
                     referrerPolicy="no-referrer"
                   />
                 </div>
                 <div>
                   <h4 className="font-bold text-wellness-stone">Sarah L.</h4>
                   <p className="text-xs text-wellness-muted">Miami, FL</p>
                   <div className="flex gap-0.5 mt-1">
                     {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-wellness-sage text-wellness-sage" />)}
                   </div>
                 </div>
               </div>
            </div>
            
            {/* Jason M */}
            <div className="bg-[#FAF9F6] p-12 rounded-[40px] relative">
               <span className="absolute top-10 left-10 text-6xl font-serif text-wellness-sage/10 leading-none">“</span>
               <p className="text-xl md:text-2xl font-serif italic text-wellness-stone leading-relaxed relative z-10 mb-10">
                 As a teacher, Yogaclientflow has transformed my career. I'm able to reach more students and do what I love.
               </p>
               <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg">
                   <img 
                     src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150" 
                     alt="Jason M" 
                     className="w-full h-full object-cover" 
                     referrerPolicy="no-referrer"
                   />
                 </div>
                 <div>
                   <h4 className="font-bold text-wellness-stone">Jason M.</h4>
                   <p className="text-xs text-wellness-muted">Austin, TX</p>
                   <div className="flex gap-0.5 mt-1">
                     {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-wellness-sage text-wellness-sage" />)}
                   </div>
                 </div>
               </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-12 gap-4">
             <button className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-wellness-stone hover:bg-wellness-sage hover:text-white hover:border-wellness-sage transition-all">
                <ChevronLeft className="w-5 h-5" />
             </button>
             <button className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-wellness-stone hover:bg-wellness-sage hover:text-white hover:border-wellness-sage transition-all">
                <ChevronRight className="w-5 h-5" />
             </button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto rounded-[40px] bg-wellness-stone p-12 md:p-24 relative overflow-hidden text-center">
          <div className="absolute inset-0 z-0 opacity-50">
             <img 
               src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=2000" 
               className="w-full h-full object-cover" 
               alt="Background" 
             />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-12">
            <h2 className="text-4xl md:text-6xl font-serif text-white leading-tight">
              Whether you’re a student or a teacher, you belong here.
            </h2>
            <p className="text-xl text-white/60 italic">Let's grow, heal and thrive — together.</p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/signup/student" className="bg-white text-wellness-stone px-12 py-5 rounded-full font-bold text-sm hover:bg-wellness-sage hover:text-white transition-all w-full sm:w-auto text-center">
                 Join as a Student
              </Link>
              <Link to="/signup/teacher" className="bg-transparent border-2 border-white/20 text-white px-12 py-[18px] rounded-full font-bold text-sm hover:border-white transition-all w-full sm:w-auto text-center">
                 Join as a Teacher
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Strip */}
      <section className="py-20 bg-white border-t border-stone-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-[#FAF9F6] rounded-[40px] p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-12">
             <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-wellness-sage/10 flex items-center justify-center text-wellness-sage">
                   <Leaf className="w-8 h-8" />
                </div>
                <div>
                   <h4 className="text-xl font-bold text-wellness-stone">Stay inspired</h4>
                   <p className="text-sm text-wellness-muted">Get wellness tips, new teachers, and exclusive offers.</p>
                </div>
             </div>
             
             <div className="flex-1 max-w-xl w-full flex flex-col sm:flex-row gap-4">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 bg-white border border-stone-100 rounded-full px-8 py-4 focus:outline-none focus:ring-2 focus:ring-wellness-sage/20 transition-all"
                />
                <button className="bg-wellness-stone text-white px-10 py-4 rounded-full font-bold text-sm hover:bg-wellness-sage transition-all">
                   Subscribe
                </button>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
