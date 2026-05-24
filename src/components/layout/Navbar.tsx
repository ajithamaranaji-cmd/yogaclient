import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Leaf, User, Search, LogOut, Heart, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { auth } from '../../lib/firebase';
import { cn } from '../../lib/utils';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user } = useAuth();
  const { isPremium } = useSubscription();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  const navLinks = [
    { name: 'Find Teachers', href: '/search' },
    { name: 'For Teachers', href: '/signup/teacher' },
    { name: 'Membership', href: '/pricing' },
    { name: 'About Us', href: '/about' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-stone-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-wellness-sage flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-serif text-2xl font-bold text-wellness-stone tracking-tight">Yogaclientflow</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-wellness-stone/70 hover:text-wellness-sage transition-colors font-medium text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4 ml-8 pl-8 border-l border-stone-100">
              {user ? (
                <>
                  <Link to="/dashboard" className="text-sm font-semibold text-wellness-stone">Dashboard</Link>
                  <button onClick={handleLogout} className="text-wellness-stone/70 hover:text-wellness-stone transition-colors">
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-semibold text-wellness-stone hover:text-wellness-sage transition-colors">Log in</Link>
                  <Link
                    to="/signup/student"
                    className="bg-wellness-sage text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-wellness-stone transition-all shadow-lg shadow-wellness-sage/20"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-wellness-ink hover:text-wellness-olive"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-wellness-ink/5 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-wellness-ink/70 hover:text-wellness-olive py-2 font-medium"
                >
                  {link.name}
                </Link>
              ))}
              {isPremium && (
                <Link to="/saved-profiles" onClick={() => setIsOpen(false)} className="block py-2 font-medium text-wellness-sage">Saved Profiles</Link>
              )}
              <hr className="border-wellness-ink/5" />
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block py-2 font-medium">Dashboard</Link>
                  <button onClick={handleLogout} className="block py-2 font-medium text-red-500 w-full text-left">Sign Out</button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block bg-wellness-olive text-white text-center px-6 py-3 rounded-xl font-medium"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
