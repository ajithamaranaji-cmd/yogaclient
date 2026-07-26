import React from 'react';
import { motion } from 'motion/react';
import { Check, Zap, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

const plans = [
  {
    name: 'Starter',
    price: '$29',
    unit: '/mo',
    rawPrice: 29,
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
  },
  {
    name: 'Growth',
    price: '$59',
    unit: '/mo',
    rawPrice: 59,
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
  },
  {
    name: 'Pro',
    price: '$99',
    unit: '/mo',
    rawPrice: 99,
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
  }
];

export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSelectPlan = (planName: string) => {
    const checkoutUrl = `/checkout?plan=${planName}`;
    if (!user) {
      // Redirect to login, preserving intended checkout destination
      navigate('/login', {
        state: {
          planId: planName,
          redirect: checkoutUrl,
        },
      });
    } else {
      navigate(checkoutUrl);
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-36 pb-32 px-6 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-wellness-dawm/30 blur-[150px] rounded-full opacity-60 -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-wellness-lavender/20 blur-[120px] rounded-full opacity-40 translate-y-1/2 -translate-x-1/4" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white text-[10px] font-bold uppercase tracking-[0.4em] text-wellness-sage mb-6 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Membership Plans
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-serif text-wellness-stone mb-8 tracking-tighter leading-[0.9]"
          >
            Elevate your <br/><span className="italic font-light text-wellness-muted">Influence</span>.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-wellness-muted max-w-xl mx-auto italic font-serif opacity-80"
          >
            Join a collective of world-class practitioners. Select the plan tailored to your practice goals.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className={cn(
                "rounded-[48px] p-10 md:p-12 flex flex-col justify-between relative overflow-hidden backdrop-blur-2xl border transition-all duration-500",
                plan.highlight 
                  ? "bg-wellness-stone text-white border-wellness-stone shadow-2xl scale-105 z-20" 
                  : "bg-white/70 border-stone-100 shadow-xl hover:bg-white"
              )}
            >
              {plan.highlight && (
                <div className="absolute top-8 right-0">
                  <div className="bg-wellness-sage text-white text-[9px] px-6 py-1.5 rounded-l-full font-bold tracking-[0.25em] uppercase shadow-md">
                    Most Popular
                  </div>
                </div>
              )}

              <div>
                <div className="mb-8">
                  <h3 className={cn("text-3xl font-serif mb-4 tracking-tight", plan.highlight ? "text-white" : "text-wellness-stone")}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className={cn("text-6xl font-serif tracking-tighter", plan.highlight ? "text-wellness-dawn" : "text-wellness-stone")}>
                      {plan.price}
                    </span>
                    <span className={cn("text-xs font-bold uppercase tracking-widest opacity-60", plan.highlight ? "text-white" : "text-wellness-muted")}>
                      {plan.unit}
                    </span>
                  </div>
                  <div className={cn(
                    "inline-flex items-center text-[9px] font-bold uppercase tracking-[0.2em] px-4 py-2.5 rounded-xl",
                    plan.highlight ? "bg-white/10 text-white" : "bg-stone-100 text-wellness-stone"
                  )}>
                    <Zap className={cn("w-3.5 h-3.5 mr-2 fill-current", plan.highlight ? "text-wellness-dawm" : "text-wellness-sage")} />
                    {plan.leads}
                  </div>
                </div>

                <div className="space-y-4 mb-10">
                  {plan.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-4">
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center shrink-0 border",
                        plan.highlight ? "bg-white/10 border-white/20 text-wellness-dawm" : "bg-wellness-sage/10 border-wellness-sage/20 text-wellness-sage"
                      )}>
                        <Check className="w-3 h-3" />
                      </div>
                      <span className={cn("text-xs font-semibold tracking-wide uppercase opacity-80", plan.highlight ? "text-white" : "text-wellness-muted")}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleSelectPlan(plan.name)}
                className={cn(
                  "w-full py-5 rounded-2xl text-[11px] font-bold uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-2 shadow-md active:scale-98",
                  plan.highlight 
                    ? "bg-wellness-sage text-white hover:bg-emerald-600" 
                    : "bg-wellness-stone text-white hover:bg-black"
                )}
              >
                <span>Choose {plan.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Verification Guarantee Banner */}
        <div className="mt-28 rounded-[48px] p-12 md:p-16 bg-white/80 backdrop-blur-2xl border border-stone-100 shadow-xl flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-start gap-6 max-w-xl">
            <div className="w-16 h-16 bg-wellness-sage/10 rounded-2xl flex items-center justify-center text-wellness-sage shrink-0 border border-wellness-sage/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-serif text-wellness-stone font-bold mb-2">Verified Practitioner Seal</h3>
              <p className="text-xs text-stone-500 leading-relaxed font-light">
                All memberships include identity and certification review to ensure supreme trust across our global student network.
              </p>
            </div>
          </div>
          <button 
            onClick={() => handleSelectPlan('Growth')}
            className="shrink-0 bg-wellness-stone text-white px-8 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-wellness-sage transition-all shadow-md"
          >
            Select Growth Plan
          </button>
        </div>
      </div>
    </div>
  );
}
