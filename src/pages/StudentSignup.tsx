import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { firestoreService } from '../services/firestore';
import { motion } from 'motion/react';
import { Compass, Sparkles, Smile, ShieldCheck } from 'lucide-react';

export default function StudentSignup() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const handleSignup = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create student user record
      await firestoreService.updateDocument('users', user.uid, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: 'student',
        profileImage: user.photoURL,
        city: '', // To be filled later
        country: '',
      });

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-32 flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl"
      >
        <span className="text-wellness-sage font-bold uppercase tracking-widest text-sm mb-6 block">Your journey begins here</span>
        <h1 className="text-6xl md:text-8xl font-serif text-wellness-olive mb-10 leading-tight">Finding Your <br /> <span className="italic">Inner Balance</span></h1>
        <p className="text-xl text-wellness-ink/60 mb-12 leading-relaxed">
          Create an account to save your favorite experts, track your progress, and connect directly with world-class wellness practitioners.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
           <div className="p-8 premium-card">
              <Compass className="w-8 h-8 text-wellness-sage mx-auto mb-4" />
              <div className="font-bold text-sm uppercase tracking-widest text-wellness-olive">Direct Discovery</div>
           </div>
           <div className="p-8 premium-card border-wellness-clay/20">
              <Sparkles className="w-8 h-8 text-wellness-clay mx-auto mb-4" />
              <div className="font-bold text-sm uppercase tracking-widest text-wellness-olive">Premium Access</div>
           </div>
           <div className="p-8 premium-card">
              <ShieldCheck className="w-8 h-8 text-wellness-sage mx-auto mb-4" />
              <div className="font-bold text-sm uppercase tracking-widest text-wellness-olive">Secure Inquiry</div>
           </div>
        </div>

        <button
          onClick={handleSignup}
          disabled={loading}
          className="bg-wellness-olive text-white px-12 py-6 rounded-full font-bold text-xl hover:bg-wellness-ink transition-all shadow-xl shadow-wellness-ink/20 flex items-center mx-auto group"
        >
          {loading ? 'Entering Sanctuary...' : 'Join us to enter'}
          <Smile className="ml-3 w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
        
        <p className="mt-10 text-wellness-ink/40 text-sm italic">"A community of seekers and guides dedicated to the art of living well."</p>
      </motion.div>

      {/* Aesthetic floaters */}
      <div className="absolute top-1/4 -left-[10%] w-64 h-64 bg-wellness-sage/10 rounded-full blur-[80px] -z-10" />
      <div className="absolute bottom-1/4 -right-[10%] w-96 h-96 bg-wellness-clay/5 rounded-full blur-[100px] -z-10" />
    </div>
  );
}
