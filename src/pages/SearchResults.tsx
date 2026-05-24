import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Filter, Star, ShieldCheck, ChevronRight, Lock, X, MessageCircle, ChevronLeft } from 'lucide-react';
import Loading from '../components/ui/Loading';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useNavigate } from 'react-router-dom';
import { EXPERT_DATA, CATEGORIES, CITIES } from '../data/expertData';
import { cn } from '../lib/utils';
import { firestoreService } from '../services/firestore';

const ResultCard: React.FC<{ pro: any, idx: number, isPremium: boolean, onClick: (id: string) => void }> = ({ pro, idx, isPremium, onClick }) => {
  const [price, setPrice] = React.useState<number | string>('***');
  const [loadingPrice, setLoadingPrice] = React.useState(false);

  React.useEffect(() => {
    const fetchPrice = async () => {
      if (!isPremium) {
        setPrice('***');
        return;
      }

      setLoadingPrice(true);
      try {
        const pInfo = await firestoreService.getDocument<any>(`professionals/${pro.id}/private`, 'premium');
        if (pInfo && pInfo.price) {
          setPrice(pInfo.price);
        } else {
          // Fallback for demo data which might still have it in pro or EXPERT_DATA
          setPrice(pro.price || 95);
        }
      } catch (e) {
        setPrice('***');
      } finally {
        setLoadingPrice(false);
      }
    };

    fetchPrice();
  }, [pro.id, isPremium]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (idx % 10) * 0.05 }}
      onClick={() => onClick(pro.id)}
      className="group cursor-pointer bg-white rounded-[48px] overflow-hidden border border-stone-100 hover:shadow-[0_40px_80px_rgba(93,122,101,0.08)] transition-all duration-200 hover:scale-[1.03] active:scale-[0.99] h-full flex flex-col"
    >
      <div className="aspect-[4/5] overflow-hidden relative">
        <img 
          src={pro.image} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
          alt={pro.name}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-wellness-stone/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <div className="absolute bottom-6 left-6 right-6 translate-y-6 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-700">
           <div className="flex items-center justify-between gap-4">
             <span className="text-white text-[10px] font-bold uppercase tracking-[0.4em] bg-white/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 flex-1 text-center">
               Access Master
             </span>
             <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-wellness-sage hover:scale-110 transition-all shadow-xl">
               <ChevronRight className="w-5 h-5" />
             </div>
           </div>
        </div>

        <div className="absolute top-6 left-6 flex flex-col gap-2">
          {pro.rating >= 4.9 && (
            <div className="bg-wellness-sage text-white px-4 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-[0.3em] shadow-xl backdrop-blur-md border border-white/20">
              Elite Master
            </div>
          )}
          <div className="bg-white/90 backdrop-blur-md text-wellness-stone px-3 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest self-start">
            #{pro.category.split(' ')[0]}
          </div>
        </div>
      </div>
      
      <div className="p-8 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-serif text-wellness-stone group-hover:text-wellness-sage transition-all duration-300 mb-1 tracking-tight leading-tight">
              {pro.name}
            </h3>
            <div className="flex items-center text-[9px] font-bold text-wellness-muted uppercase tracking-[0.3em]">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-wellness-sage/40" />
              {pro.city}
            </div>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 bg-wellness-sage/5 rounded-full text-wellness-sage border border-wellness-sage/10">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-xs font-bold">{pro.rating}</span>
          </div>
        </div>
        
        <p className="text-wellness-muted text-sm line-clamp-2 italic mb-8 leading-relaxed font-serif opacity-80 flex-1">
          "{pro.bio}"
        </p>

        <div className="flex items-center justify-between pt-6 border-t border-stone-50">
          <div className={cn("text-wellness-stone font-serif italic text-xl transition-all", !isPremium && "blur-xl select-none")}>
            ${price}<span className="text-[10px] text-wellness-muted font-sans uppercase tracking-[0.2em] ml-2">/hour</span>
          </div>
          <div className="flex -space-x-2">
            {[1, 2].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-wellness-dawn text-[8px] flex items-center justify-center font-bold text-wellness-stone shadow-sm">
                 {i === 1 ? 'EN' : 'SP'}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function NoResults({ onClear }: { onClear: () => void }) {
  return (
    <div className="col-span-full py-60 text-center">
       <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-9xl mb-12 opacity-30 drop-shadow-2xl">🌿</motion.div>
       <h2 className="text-5xl md:text-7xl font-serif text-wellness-stone mb-8 tracking-tighter">Your path is still <br/><span className="italic font-light text-wellness-muted">Waiting</span> to be discovered.</h2>
       <p className="text-xl text-wellness-muted italic max-w-lg mx-auto">Try widening your search lens to find the perfect master for your journey.</p>
       <button onClick={onClear} className="mt-12 button-secondary border-wellness-sage/20 text-wellness-sage hover:bg-wellness-sage px-12">Clear Intentions</button>
    </div>
  );
}

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { 
    isPremium, 
    subscription, 
    purchasePremium 
  } = useSubscription();

  const [loading, setLoading] = React.useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = React.useState(false);

  // Filter States
  const category = searchParams.get('category') || '';
  const location = searchParams.get('location') || '';
  const searchTerm = searchParams.get('q') || '';
  const minRating = parseFloat(searchParams.get('minRating') || '0');
  const maxPrice = parseInt(searchParams.get('maxPrice') || '1000');
  const currentPage = parseInt(searchParams.get('page') || '1');
  const pageSize = 30;

  const isSearching = !!(category || location || searchTerm || minRating > 0 || maxPrice < 1000);

  const handleCardClick = (id: string) => {
    navigate(`/profile/${id}`);
  };

  const handleFilterChange = (key: string, value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) nextParams.set(key, value);
    else nextParams.delete(key);
    nextParams.set('page', '1'); // Reset to page 1 on filter
    setSearchParams(nextParams);
  };

  const handleSubscribe = async () => {
    await purchasePremium();
    setShowUpgradeModal(false);
  };

  // Logic: Filter, Rank and Paginate EXPERT_DATA
  const filteredResults = React.useMemo(() => {
    // 1. Initial broad filtering (hard constraints)
    let candidates = EXPERT_DATA.filter(pro => {
      const matchesRating = pro.rating >= minRating;
      const matchesPrice = (pro.price || 80) <= maxPrice;
      return matchesRating && matchesPrice;
    });

    // 2. Scoring phase
    let results = candidates.map(pro => {
      let score = 0;
      
      const lowerSearch = searchTerm.toLowerCase();
      const lowerCat = category.toLowerCase();
      const lowerCity = (location || '').toLowerCase();

      const nameMatch = searchTerm && pro.name.toLowerCase().includes(lowerSearch);
      const bioMatch = searchTerm && pro.bio.toLowerCase().includes(lowerSearch);
      const categoryMatch = (category || searchTerm) && pro.category.toLowerCase().includes(lowerCat || lowerSearch);
      const exactLocationMatch = location && pro.city.toLowerCase() === lowerCity;
      
      // Calculate relevance
      if (exactLocationMatch) score += 500; // Priority
      if (categoryMatch) score += 300;
      if (nameMatch) score += 200;
      if (bioMatch) score += 100;
      
      // Quality signals
      if (pro.isPremium) score += 100;
      score += pro.rating * 50;
      score += Math.min(pro.reviewCount / 2, 100);

      // Filtering out completely irrelevant results if searching
      const isIrrelevant = isSearching && !exactLocationMatch && !categoryMatch && !nameMatch && !bioMatch;
      
      return { ...pro, score: isIrrelevant ? -1 : score };
    }).filter(p => !isSearching || p.score > 0);

    // 3. Fallback: If no results found with filters, show top featured masters regardless of search
    if (results.length === 0 && isSearching) {
      results = EXPERT_DATA.map(pro => ({
        ...pro,
        score: (pro.rating * 10) + (pro.isPremium ? 50 : 0)
      })).slice(0, 12);
      (results as any).isFallback = true;
    }

    return results.sort((a, b) => (b as any).score - (a as any).score);
  }, [category, location, searchTerm, minRating, maxPrice, isSearching]);

  const groupedByCity = React.useMemo(() => {
    if (isSearching) return null;
    const groups: Record<string, any[]> = {};
    EXPERT_DATA.forEach(pro => {
      if (!groups[pro.city]) groups[pro.city] = [];
      if (groups[pro.city].length < 6) {
        groups[pro.city].push(pro);
      }
    });
    // Sort cities by number of premium masters
    return Object.entries(groups)
      .sort((a, b) => b[1].filter(p => p.isPremium).length - a[1].filter(p => p.isPremium).length)
      .slice(0, 6);
  }, [isSearching]);

  const totalPages = Math.ceil(filteredResults.length / pageSize);
  const paginatedResults = filteredResults.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading) return <Loading />;

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
        
        {/* Header & Advanced Filters */}
        <div className="mb-24">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-16 px-4">
            <div className="max-w-3xl">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-wellness-sage mb-6"
              >
                <div className="w-12 h-[1px] bg-wellness-sage" />
                Collective Network
              </motion.div>
              <h1 className="text-7xl md:text-9xl font-serif text-wellness-stone leading-[0.9] mb-8 tracking-tighter">
                Find <span className="italic font-light text-wellness-muted">{category || 'Excellence'}</span>
                {location && <span className="block text-4xl md:text-6xl text-wellness-sage italic font-light tracking-tight mt-6">near {location}</span>}
              </h1>
              <p className="text-xl text-wellness-muted italic border-l-4 border-wellness-dawm pl-8 py-2 max-w-xl">
                Discover {isSearching ? filteredResults.length : 'thousands of'} masters dedicated to your transformation. Globally vetted, locally accessible.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 p-10 bg-white/40 backdrop-blur-3xl rounded-[48px] border border-white shadow-2xl shadow-stone-200/20">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-stone-600 uppercase tracking-widest px-1">Focus</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input 
                  type="text"
                  placeholder="Sanctuary name or keyword..."
                  value={searchTerm}
                  onChange={(e) => handleFilterChange('q', e.target.value)}
                  className="w-full bg-white border border-stone-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-serif italic focus:outline-none focus:border-wellness-sage/20 transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-stone-600 uppercase tracking-widest px-1">Sanctuary</label>
              <select 
                value={location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full bg-white border border-stone-100 rounded-2xl px-6 py-4 text-sm font-serif italic appearance-none cursor-pointer hover:border-wellness-sage/20 transition-all shadow-sm"
              >
                <option value="">Global Network</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-stone-600 uppercase tracking-widest px-1">Modality</label>
              <select 
                value={category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full bg-white border border-stone-50 rounded-2xl px-6 py-4 text-sm font-serif italic appearance-none cursor-pointer hover:border-wellness-sage/20 transition-all shadow-sm"
              >
                <option value="">Any Practice</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-stone-600 uppercase tracking-widest px-1">Experience</label>
              <select 
                value={minRating.toString()}
                onChange={(e) => handleFilterChange('minRating', e.target.value)}
                className="w-full bg-white border border-stone-50 rounded-2xl px-6 py-4 text-sm font-serif italic appearance-none cursor-pointer hover:border-wellness-sage/20 transition-all shadow-sm"
              >
                <option value="0">All Ratings</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.8">4.8+ Stars</option>
                <option value="4.9">Elite (4.9+)</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-stone-600 uppercase tracking-widest px-1">Engagement</label>
              <select 
                value={maxPrice.toString()}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="w-full bg-white border border-stone-50 rounded-2xl px-6 py-4 text-sm font-serif italic appearance-none cursor-pointer hover:border-wellness-sage/20 transition-all shadow-sm"
              >
                <option value="1000">Any Tier</option>
                <option value="80">Classic (Under $80)</option>
                <option value="120">Premium ($80 - $120)</option>
                <option value="500">Elite (Above $150)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Grid - Smart Switch */}
        {isSearching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(filteredResults as any).isFallback && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-full mb-12 bg-white/60 backdrop-blur-xl p-12 rounded-[48px] border border-white shadow-xl shadow-stone-200/10"
              >
                <div className="flex items-center gap-4 text-wellness-sage mb-2">
                   <Filter className="w-5 h-5" />
                   <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Discovery Alternative</span>
                </div>
                <h3 className="text-3xl font-serif text-wellness-stone mb-4">No exact paths found in <span className="italic">{location || 'your search'}</span>.</h3>
                <p className="text-wellness-muted italic border-l-2 border-wellness-dawm pl-6">However, these revered masters from our global sanctuary might resonate with your intention.</p>
              </motion.div>
            )}
            {paginatedResults.length > 0 ? (
              paginatedResults.map((pro, idx) => (
                <ResultCard key={pro.id} pro={pro} idx={idx} isPremium={isPremium} onClick={handleCardClick} />
              ))
            ) : (
              <NoResults onClear={() => navigate('/search')} />
            )}
          </div>
        ) : (
          <div className="space-y-32">
            {groupedByCity?.map(([city, masters], cityIdx) => (
              <motion.div 
                key={city}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: cityIdx * 0.1 }}
              >
                <div className="flex items-end justify-between mb-12 px-4">
                  <div>
                    <h2 className="text-5xl md:text-7xl font-serif text-wellness-stone tracking-tighter">
                      Masters in <span className="italic font-light text-wellness-muted">{city}</span>
                    </h2>
                    <p className="text-wellness-sage font-bold text-[10px] uppercase tracking-[0.4em] mt-4">Curated Collection • {masters.length} Experts</p>
                  </div>
                  <button 
                    onClick={() => handleFilterChange('location', city)}
                    className="group flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-wellness-muted hover:text-wellness-sage transition-colors"
                  >
                    Explore all in {city}
                    <div className="w-10 h-10 rounded-full border border-stone-100 flex items-center justify-center group-hover:bg-wellness-sage group-hover:text-white transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {masters.map((pro, idx) => (
                    <ResultCard key={pro.id} pro={pro} idx={idx} isPremium={isPremium} onClick={handleCardClick} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination overhauled to premium */}
        {totalPages > 1 && (
          <div className="mt-32 flex justify-center items-center gap-8">
            <button 
              disabled={currentPage === 1}
              onClick={() => handleFilterChange('page', (currentPage - 1).toString())}
              className="w-16 h-16 rounded-full border border-stone-100 bg-white shadow-xl shadow-stone-200/20 disabled:opacity-20 hover:bg-wellness-stone hover:text-white transition-all flex items-center justify-center"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="flex gap-4">
              {[...Array(totalPages)].map((_, i) => {
                const p = i + 1;
                if (p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1)) {
                  return (
                    <button 
                      key={p}
                      onClick={() => handleFilterChange('page', p.toString())}
                      className={`w-16 h-16 rounded-2xl font-serif text-2xl transition-all duration-200 flex items-center justify-center ${
                        currentPage === p ? 'bg-wellness-sage text-white shadow-2xl scale-110' : 'hover:bg-white bg-white/40 text-stone-700 hover:text-wellness-sage hover:scale-105 active:scale-95'
                      }`}
                    >
                      {p}
                    </button>
                  );
                }
                if (p === currentPage - 2 || p === currentPage + 2) return <span key={p} className="flex items-end pb-4 opacity-30 text-2xl">...</span>;
                return null;
              })}
            </div>

            <button 
              disabled={currentPage === totalPages}
              onClick={() => handleFilterChange('page', (currentPage + 1).toString())}
              className="w-16 h-16 rounded-full border border-stone-100 bg-white shadow-xl shadow-stone-200/20 disabled:opacity-20 hover:bg-wellness-stone hover:text-white transition-all flex items-center justify-center"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUpgradeModal(false)}
              className="absolute inset-0 bg-wellness-stone/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[48px] max-w-lg w-full max-h-[90vh] overflow-y-auto p-12 md:p-16 relative z-10 shadow-2xl scrollbar-thin"
            >
              <div className="absolute top-10 right-10">
                <button onClick={() => setShowUpgradeModal(false)} className="p-2 hover:bg-stone-50 rounded-full transition-colors">
                  <X className="w-6 h-6 text-stone-300" />
                </button>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-wellness-sage/10 rounded-[32px] flex items-center justify-center text-wellness-sage mx-auto mb-10">
                  <ShieldCheck className="w-12 h-12" />
                </div>
                <h2 className="text-4xl font-serif text-wellness-stone mb-6">Unlock Expert Access</h2>
                <p className="text-wellness-muted italic mb-12 leading-relaxed">
                  Join our elite collective for 28 days of access. Connect with verified professionals, view hidden pricing, and unlock 30 profile credits.
                </p>

                <div className="space-y-6">
                  <div className="bg-[#FAF9F6] p-10 rounded-3xl border border-stone-50 text-center">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-wellness-muted mb-2">Standard Premium Plan</p>
                     <div className="text-6xl font-serif text-wellness-stone mb-4">$29<span className="text-xs font-sans tracking-widest ml-2">/28 DAYS</span></div>
                     <button 
                      onClick={handleSubscribe}
                      className="button-primary w-full py-7"
                    >
                      Get Premium Access
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => setShowUpgradeModal(false)}
                    className="w-full text-wellness-muted text-[10px] font-bold uppercase tracking-[0.5em] hover:text-wellness-stone transition-colors py-4 uppercase"
                  >
                    Not right now
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
