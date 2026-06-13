import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider } from './contexts/AuthContext';
import { SubscriptionProvider, useSubscription } from './contexts/SubscriptionContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import Profile from './pages/Profile';
import Pricing from './pages/Pricing';
import TeacherSignup from './pages/TeacherSignup';
import About from './pages/About';
import StudentSignup from './pages/StudentSignup';
import Blog from './pages/Blog';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LeadDashboard from './pages/LeadDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SavedProfiles from './pages/SavedProfiles';
import BangorYogaInstructorWebsite from './pages/BangorYogaInstructorWebsite';

import ScrollToTop from './components/layout/ScrollToTop';

import { cn } from './lib/utils';

function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isDashboardPage = ['/dashboard', '/leads', '/admin'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {!isDashboardPage && <Navbar />}
      <main className={cn("flex-grow", !isDashboardPage && "pt-20")}>
        {children}
      </main>
      {!isDashboardPage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <BrowserRouter>
          <ScrollToTop />
          <MainLayout>
            <PageTransition>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/about" element={<About />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<Blog />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/signup/teacher" element={<TeacherSignup />} />
                <Route path="/signup/student" element={<StudentSignup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/leads" element={<LeadDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/saved-profiles" element={<SavedProfiles />} />
                <Route path="/bangor-yoga-instructor-website" element={<BangorYogaInstructorWebsite />} />
                <Route path="/bangor-yoga-instructor-website/:topicSlug" element={<BangorYogaInstructorWebsite />} />
                <Route path="/checkout/success" element={<CheckoutSuccess />} />
              </Routes>
            </PageTransition>
          </MainLayout>
        </BrowserRouter>
      </SubscriptionProvider>
    </AuthProvider>
  );
}

function CheckoutSuccess() {
  const { purchasePremium } = useSubscription();
  const navigate = useNavigate();

  React.useEffect(() => {
    // In a real app, this would be handled by a webhook, but for demo we trigger it here
    purchasePremium();
    const timer = setTimeout(() => navigate('/search'), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-[60vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-20 h-20 bg-wellness-sage rounded-full flex items-center justify-center text-white mb-8 animate-bounce">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
      </div>
      <h1 className="text-4xl font-serif mb-4">Access Unlocked</h1>
      <p className="text-wellness-muted">Thank you for joining. Redirecting you to the experts...</p>
    </div>
  );
}

// Quick links for footer
import { Link as ScrollLink } from 'react-router-dom';
