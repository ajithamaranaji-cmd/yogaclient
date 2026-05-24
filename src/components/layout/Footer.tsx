import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Instagram, Twitter, Linkedin, ArrowUpRight, Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-wellness-stone pt-32 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 pb-16 border-b border-white/10">
          <div className="space-y-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-wellness-sage flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="font-serif text-2xl font-bold text-white tracking-tight">Yogaclientflow</span>
            </Link>
            <p className="text-stone-400 text-lg italic leading-relaxed">The world's trusted yoga and wellness platform. Find your center, anywhere.</p>
            <div className="flex space-x-4">
              {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-stone-400 hover:text-white hover:border-white/20 transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.3em] mb-8">Platform</h4>
            <ul className="space-y-4">
              {['Find Teachers', 'For Teachers', 'Membership', 'How it works', 'Success Stories'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-stone-400 hover:text-wellness-sage transition-colors text-sm">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.3em] mb-8">Resources</h4>
            <ul className="space-y-4">
              {['About Us', 'Our Mission', 'Wellness Blog', 'Help Center', 'Safety & Trust'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-stone-400 hover:text-wellness-sage transition-colors text-sm">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.3em] mb-8">Stay Centered</h4>
            <p className="text-stone-400 text-sm mb-6">Join 12,000+ students and get the best wellness tips in your inbox.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 text-sm text-white placeholder:text-stone-600 focus:outline-none focus:border-wellness-sage transition-all"
              />
              <button className="absolute right-2 top-2 p-2 rounded-full bg-wellness-sage text-white shadow-lg hover:bg-white hover:text-wellness-sage transition-all">
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-stone-500 font-bold uppercase tracking-[0.2em]">© {new Date().getFullYear()} Yogaclientflow. All rights reserved.</p>
          <div className="flex gap-8 text-[10px] text-stone-500 font-bold uppercase tracking-[0.2em]">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
