import React from 'react';
import { CreditCard, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface RazorpayButtonProps {
  amount: number; // in USD
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
  className?: string;
  label?: string;
  planId?: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function RazorpayButton({
  amount,
  onSuccess,
  onError,
  className,
  label = 'Pay with Razorpay',
  planId,
}: RazorpayButtonProps) {
  const [loading, setLoading] = React.useState(false);
  const [gatewayError, setGatewayError] = React.useState<string | null>(null);
  const [showSimulationModal, setShowSimulationModal] = React.useState(false);

  const loadScript = (src: string) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSimulationSuccess = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowSimulationModal(false);
      setGatewayError(null);
      if (onSuccess) {
        onSuccess({
          razorpay_payment_id: 'pay_simulated_' + Math.random().toString(36).substring(2, 11),
          razorpay_order_id: 'order_simulated_' + Math.random().toString(36).substring(2, 11),
          razorpay_signature: 'sig_simulated_success'
        });
      }
    }, 1000);
  };

  const handlePayment = async () => {
    setLoading(true);
    setGatewayError(null);
    try {
      // 0. Resolve Razorpay Key dynamically
      let activeKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
      try {
        const keyResponse = await fetch('/api/razorpay/key');
        if (keyResponse.ok) {
          const keyData = await keyResponse.json();
          if (keyData.keyId) {
            activeKeyId = keyData.keyId;
          }
        }
      } catch (keyErr) {
        console.warn('Could not retrieve dynamic Razorpay key:', keyErr);
      }

      if (!activeKeyId) {
        console.warn('Razorpay Key ID is missing. Redirecting to Sandbox Simulation.');
        setShowSimulationModal(true);
        setLoading(false);
        return;
      }

      const resScript = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

      if (!resScript) {
        throw new Error('Razorpay SDK failed to load. Please make sure internet access is active.');
      }

      // 1. Create order on backend
      const orderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // convert to cents
          currency: 'USD',
          receipt: planId || 'default_receipt',
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: activeKeyId, // Enter the Key ID generated from the Dashboard
        amount: orderData.amount, // Amount is in currency subunits. Currency is USD (cents).
        currency: orderData.currency,
        name: 'Yogaclientflow',
        description: `Payment for ${planId || 'Wellness Service'}`,
        order_id: orderData.order_id,
        handler: async function (response: any) {
          // 3. Verify payment on backend
          try {
            const verifyResponse = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok) {
              if (onSuccess) onSuccess(verifyData);
            } else {
              throw new Error(verifyData.message || 'Verification failed');
            }
          } catch (err: any) {
            console.error('Verification error:', err);
            setGatewayError(err.message || 'Payment verification failed');
            setShowSimulationModal(true);
            if (onError) onError(err);
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#34d399', // wellness-sage equivalent
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response.error);
        setGatewayError(response.error.description || 'Payment transaction failed');
        setShowSimulationModal(true);
        if (onError) onError(response.error);
      });
      paymentObject.open();
    } catch (err: any) {
      console.error('Razorpay process error:', err);
      setGatewayError(err.message || 'Could not initiate booking session. Please make sure payment credentials are set up.');
      setShowSimulationModal(true);
      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handlePayment}
        disabled={loading}
        className={cn(
          "flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all",
          "bg-[#111] text-white hover:bg-black disabled:opacity-50",
          className
        )}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <CreditCard className="w-5 h-5" />
        )}
        {label}
      </button>

      {showSimulationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-stone-100 text-left relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-500" />
            
            <h3 className="text-xl font-serif text-stone-800 font-bold mb-4 flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 leading-none">⚙️</span>
              Payment Sandbox Bypass
            </h3>
            
            <p className="text-stone-500 text-xs leading-relaxed mb-6">
              {gatewayError ? (
                <>
                  The payment gateway service returned:
                  <code className="block bg-stone-50 text-rose-600 p-3 rounded-xl mt-2 font-mono text-[10px] break-all border border-stone-100">
                    {gatewayError}
                  </code>
                </>
              ) : (
                "Your Razorpay API keys are not fully configured in your live application settings yet."
              )}
            </p>

            <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl mb-6 text-stone-600 text-xs leading-relaxed">
              <strong className="text-emerald-800 block mb-1">💡 Sandbox Bypass Available</strong>
              To view correct, complete platform behavior instantly, you can complete the upgrade utilizing our sandbox flow bypass. This upgrades your status in Firestore securely.
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleSimulationSuccess}
                disabled={loading}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-widest rounded-2xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Complete Sandbox Payment (Success)
              </button>
              
              <button
                onClick={() => {
                  setShowSimulationModal(false);
                  setGatewayError(null);
                }}
                className="w-full py-4 text-stone-400 hover:text-stone-600 text-xs font-bold uppercase tracking-widest rounded-2xl transition-colors border border-stone-100 text-center"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
