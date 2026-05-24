import React from 'react';
import { motion } from 'motion/react';
import { Heart, ArrowLeft, Search, MapPin, Star, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSubscription } from '../contexts/SubscriptionContext';
import { EXPERT_DATA } from '../data/expertData';
import Loading from '../components/ui/Loading';

export default function SavedProfiles() {
  const { savedProfiles, isPremium } = useSubscription();
  const navigate = useNavigate();

  // Filter existing data based on saved IDs
  const savedData = React.useMemo(() => {
    return EXPERT_DATA.filter(pro => savedProfiles.includes(pro.id));
  }, [savedProfiles]);

  if (!isPremium) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-wellness-dawm rounded-full flex items-center justify-center mx-auto mb-8">
            <Heart className="w-10 h-10 text-wellness-stone opacity-20" />
          </div>
          <h2 className="text-4xl font-serif text-wellness-stone mb-4">Premium Feature</h2>
          <p className="text-wellness-muted italic mb-8">Saving profiles is reserved for our elite collective members. Join us to build your curated network of wellness masters.</p>
          <Link to="/pricing" className="button-primary inline-block">Explore Membership</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        {/* Header */}
        <div className="mb-20 flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-wellness-muted hover:text-wellness-sage transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <h1 className="text-6xl md:text-8xl font-serif text-wellness-stone tracking-tighter">
              Your <span className="italic font-light text-wellness-muted">Saved</span> Sanctuary
            </h1>
          </div>
          <div className="bg-white/60 backdrop-blur-xl px-10 py-6 rounded-[32px] border border-white shadow-xl shadow-stone-200/10 mb-2">
             <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-wellness-sage mb-1">Curated Network</div>
             <div className="text-4xl font-serif text-wellness-stone">{savedData.length} Masters</div>
          </div>
        </div>

        {savedData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {savedData.map((pro, idx) => (
              <motion.div
                key={pro.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => navigate(`/profile/${pro.id}`)}
                className="group cursor-pointer bg-white rounded-[48px] overflow-hidden border border-stone-100 hover:shadow-2xl transition-all duration-500"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img 
                    src={pro.image} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    alt={pro.name}
                  />
                  <div className="absolute top-6 right-6">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-wellness-sage shadow-xl">
                      <Heart className="w-6 h-6 fill-current" />
                    </div>
                  </div>
                </div>
                <div className="p-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-3xl font-serif text-wellness-stone group-hover:text-wellness-sage transition-colors mb-2">
                        {pro.name}
                      </h3>
                      <div className="flex items-center text-[10px] font-bold text-wellness-muted uppercase tracking-widest">
                        <MapPin className="w-3 h-3 mr-2 text-wellness-sage/40" />
                        {pro.city} • {pro.category}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-wellness-sage">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-sm font-bold">{pro.rating}</span>
                    </div>
                  </div>
                  <p className="text-wellness-muted italic text-sm line-clamp-2 opacity-80 mb-8 leading-relaxed">
                    "{pro.bio}"
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-stone-50">
                    <span className="text-wellness-stone font-serif text-xl italic">${pro.price}<span className="text-[10px] font-sans uppercase tracking-widest ml-2">/hr</span></span>
                    <ChevronRight className="w-5 h-5 text-wellness-muted" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-40 text-center">
             <div className="text-8xl mb-8 opacity-20">🍃</div>
             <h2 className="text-4xl font-serif text-wellness-stone mb-4">No masters saved yet</h2>
             <p className="text-wellness-muted italic mb-10 max-w-sm mx-auto">Explore our global collective and save the experts that align with your wellness journey.</p>
             <Link to="/search" className="button-secondary px-12">Search Marketplace</Link>
          </div>
        )}
      </div>
    </div>
  );
}
