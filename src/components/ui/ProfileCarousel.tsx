import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, MapPin, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileCarouselProps {
  title?: string;
  subtitle?: string;
  profiles: any[];
}

export default function ProfileCarousel({ title, subtitle, profiles }: ProfileCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 px-4 overflow-hidden">
      {(title || subtitle) && (
        <div className="max-w-7xl mx-auto mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl md:text-5xl font-serif text-wellness-stone mb-4">{title}</h2>
            {subtitle && <p className="text-wellness-muted italic">{subtitle}</p>}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => scroll('left')}
              className="p-3 rounded-full border border-stone-200 hover:bg-stone-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-3 rounded-full border border-stone-200 hover:bg-stone-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div 
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 md:px-[calc((100%-1280px)/2)] pb-8"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {profiles.map((pro, idx) => (
          <motion.div
            key={pro.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => navigate(`/profile/${pro.id}`)}
            className="flex-shrink-0 w-[280px] snap-start group cursor-pointer"
          >
            <div className="aspect-[3/4] rounded-2xl overflow-hidden relative mb-6 shadow-sm">
              <img 
                src={pro.image} 
                alt={pro.name}
                className="w-full h-full object-cover transition-all duration-200 group-hover:scale-[1.05]"
                referrerPolicy="no-referrer"
              />
              {/* Heart Icon */}
              <button className="absolute top-4 right-4 p-2 rounded-full bg-black/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-red-500 transition-all">
                <Heart className="w-4 h-4" />
              </button>
              
              {/* Star Rating Overlay */}
              <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1 bg-white rounded-full shadow-lg">
                <Star className="w-3 h-3 fill-wellness-sand text-wellness-sand" />
                <span className="text-xs font-bold text-wellness-stone">{pro.rating}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-wellness-stone group-hover:text-wellness-sage transition-all">{pro.name}</h3>
              <p className="text-sm text-wellness-stone/60">{pro.category}</p>
              <p className="text-xs text-wellness-muted">From ${pro.price} / session</p>
              <p className="text-xs font-bold text-wellness-muted">{pro.city}, FL</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
