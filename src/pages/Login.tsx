import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { getDoc, doc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Leaf, LogIn } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = React.useState('');

  const handleGoogleLogin = async () => {
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      // Verify role
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === 'student') {
          await signOut(auth);
          setError('Access Denied: The dashboard is exclusively for teachers. Students are not permitted to log in.');
          return;
        }
      }
      
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="premium-card max-w-md w-full p-12 text-center"
      >
        <Leaf className="w-12 h-12 text-wellness-sage mx-auto mb-8" />
        <h1 className="text-4xl font-serif text-wellness-olive mb-4">Welcome Back</h1>
        <p className="text-wellness-ink/60 mb-10">Sign in to access your wellness dashboard and manage your connections.</p>
        
        {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm">{error}</div>}

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center space-x-3 bg-white border border-wellness-ink/10 py-4 rounded-2xl font-bold hover:bg-wellness-bg transition-colors mb-8 shadow-sm"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
          <span>Continue with Google</span>
        </button>

        <div className="text-sm text-wellness-ink/40 space-y-4">
          <p>Don't have an account?</p>
          <div className="flex justify-center space-x-6">
            <Link to="/signup/student" className="text-wellness-olive font-bold hover:underline">Student Sign Up</Link>
            <Link to="/signup/teacher" className="text-wellness-olive font-bold hover:underline">Expert Sign Up</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
