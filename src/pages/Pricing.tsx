import React from 'react';
import { motion } from 'motion/react';
import { Check, Zap, Sparkles, Trophy, Star, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useAuth } from '../contexts/AuthContext';
import RazorpayButton from '../components/payment/RazorpayButton';

const plans = [
  {
    name: 'Starter',
    price: '$29',
    unit: '/mo',
    leads: '15 Lead Capacity',
    features: [
      'Full profile visibility',
      'Contact details access',
      'WhatsApp button integration',
      'Profile photo & Bio',
      'Basic analytics dashboard',
      'Certifications display'
    ],
    highlight: false,
    color: 'bg-white'
  },
  {
    name: 'Growth',
    price: '$59',
    unit: '/mo',
    leads: '30 Lead Capacity',
    features: [
      'Everything in Starter',
      'Higher ranking in search',
      'Priority profile display',
      'Premium verification badge',
      'Email lead alerts',
      'Availability schedule'
    ],
    highlight: true,
    color: 'bg-wellness-olive text-white'
  },
  {
    name: 'Pro',
    price: '$99',
    unit: '/mo',
    leads: '45 Lead Capacity',
    features: [
      'Everything in Growth',
      'Top search placement',
      'Advanced predictive analytics',
      'Multiple profile media uploads',
      'Video introduction',
      'Instant push notifications'
    ],
    highlight: false,
    color: 'bg-white'
  }
];

export default function Pricing() {
  const { user } = useAuth();
  const { purchasePremium } = useSubscription();
  const navigate = useNavigate();

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-40 pb-32 px-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-wellness-dawm/30 blur-[150px] rounded-full opacity-60 -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-wellness-lavender/20 blur-[120px] rounded-full opacity-40 translate-y-1/2 -translate-x-1/4" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white text-[10px] font-bold uppercase tracking-[0.4em] text-wellness-sage mb-8 shadow-xl shadow-stone-200/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Selection of Paths
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-9xl font-serif text-wellness-stone mb-10 tracking-tighter leading-[0.9]"
          >
            Elevate your <br/><span className="italic font-light text-wellness-muted">Influence</span>.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-wellness-muted max-w-2xl mx-auto italic font-serif opacity-80"
          >
            Join a collective of world-class practitioners. Choose a resonance that matches your ambition.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className={cn(
                "rounded-[64px] p-16 flex flex-col relative overflow-hidden backdrop-blur-3xl border transition-all duration-700",
                plan.highlight 
                  ? "bg-wellness-stone text-white border-wellness-stone shadow-[0_80px_160px_rgba(26,26,26,0.12)] scale-105 z-20" 
                  : "bg-white/40 border-white shadow-2xl shadow-stone-200/20 hover:bg-white/60"
              )}
            >
              {plan.highlight && (
                <div className="absolute top-12 right-0">
                  <div className="bg-wellness-sage text-white text-[9px] px-8 py-2 rounded-l-full font-bold tracking-[0.3em] uppercase shadow-2xl">Elite Choice</div>
                </div>
              )}

              <div className="mb-12">
                <h3 className={cn("text-4xl font-serif mb-6 tracking-tight", plan.highlight ? "text-white" : "text-wellness-stone")}>{plan.name}</h3>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className={cn("text-7xl font-serif tracking-tighter", plan.highlight ? "text-wellness-dawn" : "text-wellness-stone")}>{plan.price}</span>
                  <span className={cn("text-sm font-bold uppercase tracking-widest opacity-40", plan.highlight ? "text-white" : "text-wellness-muted")}>{plan.unit}</span>
                </div>
                <div className={cn(
                  "inline-flex items-center text-[9px] font-bold uppercase tracking-[0.3em] px-6 py-3 rounded-2xl",
                  plan.highlight ? "bg-white/10 text-white" : "bg-stone-50 text-wellness-stone"
                )}>
                  <Zap className={cn("w-3.5 h-3.5 mr-3 fill-current", plan.highlight ? "text-wellness-dawm" : "text-wellness-sage")} />
                  {plan.leads}
                </div>
              </div>

              <div className="flex-1 space-y-6 mb-16">
                {plan.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-6">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center shrink-0 border",
                      plan.highlight ? "bg-white/5 border-white/20" : "bg-white border-stone-100"
                    )}>
                      <Check className={cn("w-3.5 h-3.5", plan.highlight ? "text-wellness-dawm" : "text-wellness-sage")} />
                    </div>
                    <span className={cn("text-xs font-bold tracking-[0.1em] uppercase opacity-70", plan.highlight ? "text-white" : "text-wellness-muted")}>{feature}</span>
                  </div>
                ))}
              </div>

              {user ? (
                <div className="pt-4 flex flex-col gap-4">
                  {user.email === 'ajithamaran1999@gmail.com' && (
                    <div className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center animate-pulse">
                      ✨ Special Offer: $5 Deducted for ajithamaran1999@gmail.com!
                    </div>
                  )}
                  <RazorpayButton
                    amount={
                      user.email === 'ajithamaran1999@gmail.com'
                        ? (plan.name === 'Starter' ? 24 : plan.name === 'Growth' ? 54 : 94)
                        : (plan.name === 'Starter' ? 29 : plan.name === 'Growth' ? 59 : 99)
                    }
                    planId={plan.name}
                    label={
                      user.email === 'ajithamaran1999@gmail.com'
                        ? `Pay with Razorpay ($${plan.name === 'Starter' ? 24 : plan.name === 'Growth' ? 54 : 94})`
                        : `Pay with Razorpay ($${plan.name === 'Starter' ? 29 : plan.name === 'Growth' ? 59 : 99})`
                    }
                    onSuccess={async () => {
                      await purchasePremium();
                      navigate('/search');
                    }}
                    className={plan.highlight ? "bg-wellness-sage text-white" : "bg-wellness-stone text-white"}
                  />
                </div>
              ) : (
                <Link
                  to="/signup/student"
                  className={cn(
                    "w-full text-center py-8 rounded-[32px] text-[11px] font-bold uppercase tracking-[0.4em] transition-all relative overflow-hidden group",
                    plan.highlight 
                      ? "bg-wellness-sage text-white shadow-2xl shadow-wellness-sage/20 hover:scale-[1.05]" 
                      : "bg-white text-wellness-stone border border-stone-100 hover:border-wellness-sage/20 hover:shadow-xl"
                  )}
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  Initiate {plan.name}
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-40 max-w-6xl mx-auto rounded-[72px] p-20 md:p-32 bg-white/60 backdrop-blur-3xl border border-white shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-wellness-dawm/30 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
            
            <div className="text-left max-w-xl relative z-10">
                <div className="flex items-center gap-6 mb-12">
                   <div className="w-20 h-20 bg-wellness-sage/10 rounded-[32px] flex items-center justify-center text-wellness-sage border border-wellness-sage/20">
                      <ShieldCheck className="w-10 h-10" />
                   </div>
                   <div className="label-caps !text-wellness-sage !tracking-[0.5em]">Seal of Excellence</div>
                </div>
                <h2 className="text-6xl md:text-8xl font-serif text-wellness-stone mb-10 leading-[0.9] tracking-tighter">The <span className="italic font-light text-wellness-muted">Verified</span> Sanctuary.</h2>
                <p className="text-xl text-wellness-muted leading-relaxed italic font-serif">"Authenticity is the highest form of resonance. Our vetting process elevates your digital footprint into a trusted beacon of transformation."</p>
            </div>
            
            <div className="shrink-0 relative z-10 bg-wellness-stone p-16 rounded-[64px] shadow-3xl text-center min-w-[320px]">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-wellness-dawm/60 block mb-4">Investment</span>
                <div className="text-8xl font-serif text-white mb-12 tracking-tighter">$199</div>
                <button className="w-full bg-white text-wellness-stone px-12 py-7 rounded-[32px] text-[11px] font-bold uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-xl">Apply for Seal</button>
            </div>
        </div>
      </div>
    </div>
  );
}
