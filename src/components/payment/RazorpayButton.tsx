import React from 'react';
import { CreditCard, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface RazorpayButtonProps {
  amount: number; // in rupees
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

  const loadScript = (src: string) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const resScript = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

      if (!resScript) {
        throw new Error('Razorpay SDK failed to load. Are you online?');
      }

      // 1. Create order on backend
      const orderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount * 100, // convert to paise
          currency: 'INR',
          receipt: planId || 'default_receipt',
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
        amount: orderData.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
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
          } catch (err) {
            console.error('Verification error:', err);
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
        if (onError) onError(response.error);
      });
      paymentObject.open();
    } catch (err) {
      console.error('Razorpay process error:', err);
      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
}
