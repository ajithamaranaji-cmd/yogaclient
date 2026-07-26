import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Check, 
  Lock, 
  Zap, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Leaf, 
  ArrowLeft,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import RazorpayButton from '../components/payment/RazorpayButton';
import { cn } from '../lib/utils';

interface PlanDetail {
  id: string;
  name: string;
  price: number;
  period: string;
  leads: string;
  features: string[];
  recommended?: boolean;
}

const PLAN_DETAILS: Record<string, PlanDetail> = {
  Starter: {
    id: 'Starter',
    name: 'Starter Sanctuary',
    price: 29,
    period: '/month',
    leads: '15 Lead Capacity',
    features: [
      'Full profile visibility in search index',
      'Direct contact details access',
      'WhatsApp messaging button integration',
      'Profile photo & custom bio',
      'Basic analytics dashboard',
      'Certifications display'
    ]
  },
  Growth: {
    id: 'Growth',
    name: 'Growth Sanctuary',
    price: 59,
    period: '/month',
    leads: '30 Lead Capacity',
    recommended: true,
    features: [
      'Everything in Starter',
      'Priority ranking in search results',
      'Featured instructor badge',
      'Premium verification seal',
      'Email lead alerts',
      'Availability schedule management'
    ]
  },
  Pro: {
    id: 'Pro',
    name: 'Pro Sanctuary',
    price: 99,
    period: '/month',
    leads: '45 Lead Capacity',
    features: [
      'Everything in Growth',
      'Top tier search placement',
      'Advanced predictive analytics',
      'Video introduction embedding',
      'Multiple profile media uploads',
      'Instant push notifications'
    ]
  }
};

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { purchasePremium } = useSubscription();

  const initialPlanId = searchParams.get('plan') || 'Growth';
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    PLAN_DETAILS[initialPlanId] ? initialPlanId : 'Growth'
  );
  
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const plan = PLAN_DETAILS[selectedPlanId] || PLAN_DETAILS.Growth;

  const handlePaymentSuccess = async (response: any) => {
    try {
      await purchasePremium(selectedPlanId);
      setPaymentSuccess(true);
    } catch (err) {
      console.error('Error activating subscription:', err);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md bg-white p-12 rounded-[40px] border border-stone-100 shadow-2xl space-y-6"
        >
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-200">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Subscription Active
            </span>
            <h1 className="text-3xl font-serif text-wellness-stone font-bold">Welcome to the Sanctuary!</h1>
            <p className="text-xs text-stone-400 leading-relaxed font-light">
              Your payment of <strong className="text-stone-700 font-semibold">${plan.price}.00 USD</strong> was successful. Your <strong>{plan.name}</strong> membership is activated.
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 text-left text-xs space-y-2">
            <div className="flex justify-between text-stone-500">
              <span>Plan:</span>
              <span className="font-bold text-stone-800">{plan.name}</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>Account:</span>
              <span className="font-bold text-stone-800 truncate max-w-[180px]">{user?.email}</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>Status:</span>
              <span className="font-bold text-emerald-600">Active</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-4 bg-wellness-stone hover:bg-wellness-sage text-white rounded-2xl text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-2"
          >
            <span>Proceed to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-12 pb-28 px-6 relative">
      {/* Header back button */}
      <div className="max-w-6xl mx-auto mb-10">
        <Link
          to="/pricing"
          className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-600 text-xs font-bold uppercase tracking-widest transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Pricing</span>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-stone-100 text-[10px] font-bold uppercase tracking-[0.3em] text-wellness-sage mb-4 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            Secure Order Checkout
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-wellness-stone font-bold tracking-tight mb-3">
            Complete Your Membership
          </h1>
          <p className="text-sm text-stone-400 max-w-md mx-auto font-light">
            Review your order details below to activate your professional sanctuary pass.
          </p>
        </div>

        {/* Plan Selector Switcher */}
        <div className="flex justify-center gap-3 mb-12">
          {Object.values(PLAN_DETAILS).map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPlanId(p.id)}
              className={cn(
                "px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all border",
                selectedPlanId === p.id
                  ? "bg-wellness-stone text-white border-wellness-stone shadow-md"
                  : "bg-white text-stone-500 border-stone-200 hover:border-wellness-sage"
              )}
            >
              {p.id} (${p.price})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Plan Overview & Features */}
          <div className="lg:col-span-7 bg-white p-8 md:p-12 rounded-[40px] border border-stone-100 shadow-xl space-y-8">
            <div className="flex justify-between items-start border-b border-stone-100 pb-8">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-wellness-sage block mb-1">Selected Tier</span>
                <h2 className="text-3xl font-serif text-wellness-stone font-bold">{plan.name}</h2>
                <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 bg-stone-50 rounded-lg text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                  <Zap className="w-3 h-3 text-wellness-sage" />
                  {plan.leads}
                </div>
              </div>
              <div className="text-right">
                <span className="text-4xl font-serif font-bold text-wellness-stone">${plan.price}</span>
                <span className="text-xs text-stone-400 font-sans tracking-widest block">{plan.period}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400">Included Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-wellness-sage/10 text-wellness-sage flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-xs text-stone-600 font-medium leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Guarantees Box */}
            <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-700 mb-0.5">SSL Encrypted</p>
                <p className="text-[9px] text-stone-400">256-bit bank level security</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-700 mb-0.5">Cancel Anytime</p>
                <p className="text-[9px] text-stone-400">No lock-in commitments</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-700 mb-0.5">Instant Activation</p>
                <p className="text-[9px] text-stone-400">Immediate access to features</p>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Payment Button */}
          <div className="lg:col-span-5 bg-white p-8 md:p-10 rounded-[40px] border border-stone-100 shadow-xl space-y-8">
            <h3 className="text-xl font-serif text-wellness-stone font-bold border-b border-stone-100 pb-4">
              Order Summary
            </h3>

            {/* Subscriber Info */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-2 text-xs">
              <div className="flex justify-between text-stone-500">
                <span>Subscriber:</span>
                <span className="font-bold text-stone-800">{user?.displayName || 'Member'}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Email Address:</span>
                <span className="font-bold text-stone-800 truncate max-w-[180px]">{user?.email}</span>
              </div>
            </div>

            {/* Pricing Calculation */}
            <div className="space-y-3 text-xs border-b border-stone-100 pb-6">
              <div className="flex justify-between text-stone-500">
                <span>{plan.name} ({plan.period})</span>
                <span className="font-bold text-stone-800">${plan.price}.00 USD</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Processing & Setup Fees</span>
                <span className="font-bold text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Applicable Taxes</span>
                <span className="font-bold text-stone-800">$0.00</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-wellness-stone pt-3 border-t border-stone-100">
                <span>Total Amount Due</span>
                <span>${plan.price}.00 USD</span>
              </div>
            </div>

            {/* Payment Button */}
            <div className="space-y-4">
              <RazorpayButton
                amount={plan.price}
                planId={plan.id}
                label={`Pay $${plan.price}.00 USD & Activate`}
                onSuccess={handlePaymentSuccess}
                className="w-full py-5 bg-wellness-stone hover:bg-wellness-sage text-white text-xs font-bold uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl"
              />

              <p className="text-[10px] text-center text-stone-400 leading-relaxed">
                By clicking pay, you authorize Yogaclientflow to charge your card <strong className="text-stone-600">${plan.price}.00 USD</strong>.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
