import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { firestoreService } from '../services/firestore';
import { motion } from 'motion/react';
import { Compass, Sparkles, ShieldCheck } from 'lucide-react';

export default function StudentSignup() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const redirectTarget = location.state?.redirect || null;
  const planId = location.state?.planId || null;

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await firestoreService.updateDocument('users', user.uid, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: 'student',
        profileImage: user.photoURL,
        city: '', 
        country: '',
      });

      if (redirectTarget) {
        navigate(redirectTarget);
        return;
      }
      if (planId) {
        navigate(`/checkout?plan=${planId}`);
        return;
      }

      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google Auth Popup or Firestore write failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-32 flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <span className="text-wellness-sage font-bold uppercase tracking-widest text-xs mb-6 block">Your journey begins here</span>
        <h1 className="text-5xl md:text-7xl font-serif text-wellness-stone mb-8 leading-tight font-bold">Finding Your <br /> <span className="italic font-light text-wellness-muted">Inner Balance</span></h1>
        
        <p className="text-base text-stone-500 mb-10 leading-relaxed max-w-lg mx-auto font-light">
          Create an account to connect directly with world-class wellness practitioners.
        </p>

        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-2xl mb-8 text-xs text-left leading-relaxed max-w-md mx-auto font-bold">
            {error}
          </div>
        )}

        {/* Signup Form */}
        <div className="bg-white/80 backdrop-blur-md p-10 rounded-[40px] border border-stone-200/50 shadow-xl max-w-md mx-auto text-center mb-10">
          <h2 className="text-2xl font-serif text-wellness-stone font-bold mb-3">Join with Google</h2>
          <p className="text-xs text-stone-400 mb-6">
            {planId ? `Sign up to continue with your ${planId} plan subscription.` : 'Access our sanctuary instantly using your Google account.'}
          </p>

          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 bg-white border border-stone-200 py-4 rounded-2xl font-bold hover:bg-[#FAF9F6] transition-all shadow-sm text-xs uppercase tracking-wider text-stone-700 h-14"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            <span>{loading ? 'Connecting...' : 'Continue with Google'}</span>
          </button>
        </div>

        <p className="text-xs text-stone-400">
          Already have an account?{' '}
          <Link to="/login" state={{ redirect: redirectTarget, planId }} className="text-wellness-sage font-bold hover:underline">
            Sign In Here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
