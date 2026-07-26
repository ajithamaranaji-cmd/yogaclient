import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { getDoc, doc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Leaf } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const redirectTarget = location.state?.redirect || null;
  const planId = location.state?.planId || null;

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      // Check if redirect is specified (e.g. from Pricing page checkout flow)
      if (redirectTarget) {
        navigate(redirectTarget);
        return;
      }
      if (planId) {
        navigate(`/checkout?plan=${planId}`);
        return;
      }

      // Default role based navigation
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === 'student') {
          navigate('/search');
          return;
        }
      }
      
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 bg-[#FAF9F6]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/80 backdrop-blur-md max-w-md w-full p-10 md:p-12 text-center rounded-[40px] border border-stone-200/50 shadow-xl"
      >
        <Leaf className="w-12 h-12 text-wellness-sage mx-auto mb-6" />
        <h1 className="text-4xl font-serif text-wellness-stone font-bold mb-3">Welcome Back</h1>
        <p className="text-stone-500 mb-8 text-xs leading-relaxed">
          {planId ? (
            <>Sign in to continue with your <strong>{planId}</strong> plan order.</>
          ) : (
            <>Sign in with your Google account to access your sanctuary dashboard.</>
          )}
        </p>
        
        {error && (
          <div className="bg-rose-50 text-rose-600 border border-rose-100 p-4 rounded-xl mb-6 text-xs text-left leading-relaxed font-bold">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          type="button"
          disabled={loading}
          className="w-full flex items-center justify-center space-x-3 bg-white border border-stone-200 py-4 rounded-2xl font-bold hover:bg-[#FAF9F6] transition-all mb-8 shadow-sm text-xs uppercase tracking-wider text-stone-700 h-14"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          <span>{loading ? 'Connecting...' : 'Continue with Google'}</span>
        </button>

        <div className="text-xs text-stone-400 space-y-4">
          <p>Don't have an account?</p>
          <div className="flex justify-center space-x-6">
            <Link 
              to="/signup/student" 
              state={{ redirect: redirectTarget, planId }}
              className="text-wellness-sage font-bold hover:underline"
            >
              Student Sign Up
            </Link>
            <Link 
              to="/signup/teacher" 
              state={{ redirect: redirectTarget, planId }}
              className="text-wellness-sage font-bold hover:underline"
            >
              Expert Sign Up
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
