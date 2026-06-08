import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronRight, Clock, User, Heart, MessageSquare, ArrowRight, Mail, Sparkles, Leaf, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { 
  BLOG_POSTS, 
  BLOG_CATEGORIES, 
  getPostCountByCategory, 
  getPostsByCategory, 
  getRelatedPosts,
  BlogPost 
} from '../data/blogData';

const POPULAR_POSTS = BLOG_POSTS.slice(0, 5);

export default function Blog() {
  const [filterCategory, setFilterCategory] = useState('All');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 30;

  const featuredPosts = useMemo(() => BLOG_POSTS.filter(p => p.featured), []);
  
  const displayPosts = useMemo(() => {
    if (activePost) {
      return getRelatedPosts(activePost.id);
    }
    let posts = getPostsByCategory(filterCategory).filter(p => !p.featured);
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      posts = posts.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.desc.toLowerCase().includes(query) || 
        p.tag.toLowerCase().includes(query)
      );
    }
    return posts;
  }, [filterCategory, activePost, searchQuery]);

  const totalPages = Math.ceil(displayPosts.length / postsPerPage);

  const currentPagePosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return displayPosts.slice(startIndex, startIndex + postsPerPage);
  }, [displayPosts, currentPage, postsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [displayPosts, totalPages, currentPage]);

  const toggleCategory = (cat: string) => {
    setActivePost(null);
    setFilterCategory(prev => prev === cat ? 'All' : cat);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handlePostClick = (post: BlogPost) => {
    setActivePost(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      {/* Category Selection Filter Info */}
      {filterCategory !== 'All' && !activePost && (
        <div className="bg-wellness-sage/5 py-4 border-b border-stone-100">
           <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-bold text-wellness-stone uppercase tracking-widest">Showing category:</span>
                 <span className="bg-wellness-sage text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{filterCategory}</span>
              </div>
              <button 
                onClick={() => setFilterCategory('All')}
                className="text-[10px] font-bold text-wellness-muted uppercase tracking-widest hover:text-wellness-stone transition-colors flex items-center gap-1"
              >
                Clear filter <X className="w-3 h-3" />
              </button>
           </div>
        </div>
      )}

      {/* Hero Section / Active Post Detail */}
      <AnimatePresence mode="wait">
        {activePost ? (
          <motion.section 
            key="active-post"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pt-32 pb-20 bg-white"
          >
            <div className="max-w-7xl mx-auto px-4 lg:px-8">
              <button 
                onClick={() => setActivePost(null)}
                className="flex items-center gap-2 text-[10px] font-bold text-wellness-muted uppercase tracking-widest mb-12 group hover:text-wellness-sage transition-colors"
              >
                <ChevronRight className="w-4 h-4 rotate-180" /> Back to blog
              </button>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                <div>
                  <span className="text-[10px] font-bold text-wellness-sage uppercase tracking-widest mb-4 inline-block">{activePost.tag}</span>
                  <h1 className="text-4xl md:text-6xl font-serif text-wellness-stone leading-tight mb-8">{activePost.title}</h1>
                  <div className="flex items-center gap-4 mb-12">
                    <img src={activePost.authorAvatar} className="w-12 h-12 rounded-full border border-stone-100" alt={activePost.author} />
                    <div>
                      <h4 className="text-sm font-bold text-wellness-stone uppercase tracking-widest">{activePost.author}</h4>
                      <p className="text-[10px] text-wellness-muted font-bold uppercase tracking-widest">{activePost.date} • {activePost.readTime}</p>
                    </div>
                  </div>
                  <div className="prose prose-stone max-w-none">
                    <p className="text-xl text-wellness-muted leading-relaxed font-serif italic mb-12 border-l-4 border-wellness-sage/30 pl-6 py-1">
                      {activePost.desc}
                    </p>
                    
                    {activePost.content ? (
                      <div className="space-y-6 text-stone-800">
                        {activePost.content.map((paragraph, index) => {
                          if (paragraph.startsWith('### ')) {
                            return (
                              <h3 key={index} className="text-xl font-bold font-serif text-wellness-stone mt-8 mb-4">
                                {paragraph.replace('### ', '')}
                              </h3>
                            );
                          }
                          if (paragraph.startsWith('## ')) {
                            return (
                              <h2 key={index} className="text-2xl font-serif text-wellness-stone mt-12 mb-6 border-b pb-3 border-stone-100 font-medium">
                                {paragraph.replace('## ', '')}
                              </h2>
                            );
                          }
                          if (paragraph.startsWith('- ')) {
                            return (
                              <ul key={index} className="list-disc pl-6 space-y-1 my-3">
                                <li className="text-wellness-stone leading-relaxed text-base">
                                  {paragraph.replace('- ', '')}
                                </li>
                              </ul>
                            );
                          }
                          return (
                            <p key={index} className="text-base text-stone-700/90 leading-relaxed font-sans mb-6">
                              {paragraph}
                            </p>
                          );
                        })}
                      </div>
                    ) : (
                      <>
                        <p className="text-wellness-stone leading-relaxed mb-6">
                          Yoga is more than just physical exercise; it's a profound system for holistic well-being. By focusing on the connection between breath, body, and mind, practitioners can unlock a sense of tranquility that extends far beyond the mat.
                        </p>
                        <p className="text-wellness-stone leading-relaxed font-sans">
                          In today's fast-paced world, finding moments of stillness is essential. Whether it's through a five-minute morning flow or an hour-long deep meditation, these practices serve as anchors, helping us navigate life's challenges with greater ease and resilience.
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <div className="rounded-[40px] overflow-hidden shadow-2xl h-[400px] lg:h-[600px]">
                  <img src={activePost.image} className="w-full h-full object-cover" alt={activePost.title} />
                </div>
              </div>
            </div>
          </motion.section>
        ) : (
          <section key="blog-hero" className="relative bg-white pt-32 pb-20 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 lg:px-8">
              <div className="flex flex-col lg:flex-row items-center justify-between">
                <div className="max-w-xl relative z-10">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-wellness-muted uppercase tracking-widest mb-8">
                    <Link to="/" className="hover:text-wellness-sage transition-colors">Home</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-wellness-sage">Blog</span>
                  </div>
                  
                  <h1 className="text-5xl md:text-7xl font-serif text-wellness-stone leading-tight mb-6">
                    Wellness Insights <br />
                    <span className="italic font-light text-wellness-sage">for a Better You</span>
                  </h1>
                  <p className="text-lg text-wellness-muted leading-relaxed mb-10 max-w-md">
                    Expert tips, inspiring stories, and mindful practices to help you live a healthier, more balanced life.
                  </p>
                  
                  <div className="relative max-w-md">
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Search articles..."
                      className="w-full bg-[#FAF9F6] border border-stone-100 rounded-full py-4 px-8 focus:outline-none focus:ring-2 focus:ring-wellness-sage/20 transition-all text-stone-800"
                    />
                    {searchQuery ? (
                      <button 
                        onClick={() => {
                          setSearchQuery('');
                          setCurrentPage(1);
                        }}
                        className="absolute right-16 top-4 text-wellness-muted hover:text-stone-800 transition-colors cursor-pointer"
                        title="Clear search"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    ) : null}
                    <button className="absolute right-2 top-2 w-12 h-12 bg-wellness-stone text-white rounded-full flex items-center justify-center hover:bg-wellness-sage transition-all">
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="hidden lg:block relative w-[500px] h-[400px]">
                   <div className="absolute inset-0 rounded-[40px] overflow-hidden shadow-2xl">
                     <img 
                       src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1000" 
                       className="w-full h-full object-cover" 
                       alt="Yoga Inspiration" 
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                   </div>
                   <div className="absolute -top-10 -right-10 opacity-10 blur-3xl w-64 h-64 bg-wellness-sage rounded-full" />
                </div>
              </div>
            </div>
          </section>
        )}
      </AnimatePresence>

      {/* Categories Scroller */}
      <section className="py-12 bg-white border-y border-stone-100">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
          <div className="flex gap-4 md:justify-between items-center min-w-max">
            {BLOG_CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => toggleCategory(cat.name)}
                className={cn(
                  "p-4 rounded-3xl border flex flex-col items-center gap-2 w-32 cursor-pointer transition-all group shrink-0",
                  filterCategory === cat.name 
                    ? "bg-wellness-sage text-white border-wellness-sage" 
                    : "bg-[#FAF9F6] border-stone-50 hover:bg-wellness-sage/5 hover:border-wellness-sage/20"
                )}
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                <div className="text-center">
                  <h4 className={cn(
                    "text-[10px] font-bold uppercase tracking-widest",
                    filterCategory === cat.name ? "text-white" : "text-wellness-stone"
                  )}>{cat.name}</h4>
                  <p className={cn(
                    "text-[9px] font-bold mt-0.5",
                    filterCategory === cat.name ? "text-white/60" : "text-wellness-muted"
                  )}>{getPostCountByCategory(cat.name)} Articles</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles - Hidden when active post or filtering */}
      {!activePost && filterCategory === 'All' && (
        <section className="py-24 px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl md:text-4xl font-serif text-wellness-stone">Featured Articles</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPosts.map((post, i) => (
                <motion.div 
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  onClick={() => handlePostClick(post)}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[16/10] rounded-[32px] overflow-hidden mb-6 relative shadow-lg">
                    <img src={post.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={post.title} />
                    <div className="absolute top-6 left-6">
                      <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold text-wellness-sage uppercase tracking-widest border border-wellness-sage/20">
                        {post.tag}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-serif text-wellness-stone mb-4 group-hover:text-wellness-sage transition-colors leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-wellness-muted text-sm leading-relaxed mb-6 line-clamp-2">
                    {post.desc}
                  </p>
                  <div className="flex items-center gap-3">
                    <img src={post.authorAvatar} className="w-8 h-8 rounded-full border border-stone-100" alt={post.author} />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-wellness-stone uppercase tracking-widest">{post.author}</span>
                      <div className="flex items-center gap-2 text-[9px] text-wellness-muted font-bold uppercase tracking-widest">
                         <span>{post.date}</span>
                         <span className="w-1 h-1 bg-stone-300 rounded-full" />
                         <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                         </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Content or Related Content */}
      <section id="latest-section" className={cn(
        "py-24 border-t border-stone-100 transition-colors duration-500",
        activePost ? "bg-white" : "bg-[#FAF9F6]"
      )}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left Content Column */}
            <div className="lg:col-span-9 space-y-12">
               <div className="flex items-center justify-between">
                 <h2 className="text-3xl font-serif text-wellness-stone">
                   {activePost ? `Related to "${activePost.tag}"` : (searchQuery ? `Search Results for "${searchQuery}"` : 'Latest Articles')}
                 </h2>
               </div>
               
               {currentPagePosts.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                   {currentPagePosts.map((post, i) => (
                     <motion.div 
                       key={post.id}
                       initial={{ opacity: 0, scale: 0.95 }}
                       whileInView={{ opacity: 1, scale: 1 }}
                       transition={{ delay: i * 0.05 }}
                       viewport={{ once: true }}
                       onClick={() => handlePostClick(post)}
                       className="bg-white p-6 rounded-[32px] border border-stone-100 shadow-sm hover:shadow-xl hover:border-wellness-sage/20 transition-all group cursor-pointer flex flex-col justify-between"
                     >
                       <div>
                         <div className="aspect-video rounded-2xl overflow-hidden mb-6">
                            <img src={post.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={post.title} />
                         </div>
                         <span className="text-[9px] font-bold text-wellness-sage uppercase tracking-widest">{post.tag}</span>
                         <h4 className="text-lg font-bold text-wellness-stone mt-2 mb-4 group-hover:text-wellness-sage transition-colors leading-tight line-clamp-2">
                           {post.title}
                         </h4>
                       </div>
                       <div className="flex items-center gap-4 text-[10px] text-wellness-muted font-bold uppercase tracking-widest pt-2 border-t border-stone-50">
                         <span>{post.date}</span>
                         <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                         </div>
                       </div>
                     </motion.div>
                   ))}
                 </div>
               ) : (
                 <div className="text-center py-16 bg-white rounded-[40px] border border-stone-100 p-8">
                   <div className="w-16 h-16 rounded-full bg-wellness-sage/10 flex items-center justify-center mx-auto text-wellness-sage mb-4">
                     <Search className="w-6 h-6" />
                   </div>
                   <h3 className="text-xl font-serif text-wellness-stone mb-2">No articles found</h3>
                   <p className="text-wellness-muted text-sm max-w-sm mx-auto mb-6">
                     We couldn't find any articles matching "{searchQuery}". Try selecting a different category or refining your search query.
                   </p>
                   <button 
                     onClick={() => {
                       setSearchQuery('');
                       setFilterCategory('All');
                       setCurrentPage(1);
                     }}
                     className="bg-wellness-stone text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-wellness-sage transition-all cursor-pointer"
                   >
                     Reset Filters
                   </button>
                 </div>
               )}
               
               <div className="flex justify-center pt-8">
                 {!activePost && totalPages > 1 && (
                   <div className="flex items-center gap-2">
                     <button
                       onClick={() => {
                         setCurrentPage(prev => Math.max(prev - 1, 1));
                         document.getElementById('latest-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                       }}
                       disabled={currentPage === 1}
                       className="p-3 rounded-full bg-white border border-stone-100 text-wellness-stone hover:bg-wellness-sage hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-wellness-stone transition-all cursor-pointer"
                       title="Previous Page"
                     >
                       <ChevronRight className="w-4 h-4 rotate-180" />
                     </button>
                     
                     {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                       <button
                         key={p}
                         onClick={() => {
                           setCurrentPage(p);
                           document.getElementById('latest-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                         }}
                         className={cn(
                           "w-10 h-10 rounded-full font-bold text-xs transition-all cursor-pointer",
                           currentPage === p
                             ? "bg-wellness-sage text-white shadow-md shadow-wellness-sage/20"
                             : "bg-white border border-stone-100 text-wellness-stone hover:bg-wellness-sage/10"
                         )}
                       >
                         {p}
                       </button>
                     ))}
                     
                     <button
                       onClick={() => {
                         setCurrentPage(prev => Math.min(prev + 1, totalPages));
                         document.getElementById('latest-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                       }}
                       disabled={currentPage === totalPages}
                       className="p-3 rounded-full bg-white border border-stone-100 text-wellness-stone hover:bg-wellness-sage hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-wellness-stone transition-all cursor-pointer"
                       title="Next Page"
                     >
                       <ChevronRight className="w-4 h-4" />
                     </button>
                   </div>
                 )}
               </div>

               {/* Write for Yogaclientflow CTA */}
               <div className="relative rounded-[40px] overflow-hidden mt-16 group">
                 <img 
                   src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1200" 
                   className="w-full h-48 object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000" 
                   alt="Share your story" 
                 />
                 <div className="absolute inset-0 bg-wellness-sage/80 backdrop-blur-sm p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
                   <div>
                     <h3 className="text-3xl font-serif text-white mb-2">Share Your Story</h3>
                     <p className="text-white/80 italic">Are you a wellness expert or yoga teacher? <br/> Contribute to our blog and inspire thousands.</p>
                   </div>
                   <button className="whitespace-nowrap bg-white text-wellness-sage px-10 py-4 rounded-full font-bold text-sm hover:bg-wellness-stone hover:text-white transition-all shadow-xl">
                      Write for Yogaclientflow
                   </button>
                 </div>
               </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-3 space-y-12">
               {/* About Sidebar Card */}
               <div className="bg-white p-10 rounded-[40px] border border-stone-100 shadow-sm space-y-8">
                 <h4 className="text-xl font-serif text-wellness-stone">About the Blog</h4>
                 <p className="text-sm text-wellness-muted leading-relaxed italic">
                   Our mission is to share authentic, evidence-based content to inspire and support your wellness journey.
                 </p>
                 <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
                    <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Blog Purpose" />
                 </div>
                 <div className="grid grid-cols-3 gap-4 border-t border-stone-100 pt-8">
                    <div className="text-center">
                      <p className="text-xl font-bold text-wellness-stone">{BLOG_POSTS.length}</p>
                      <p className="text-[8px] font-bold text-wellness-muted uppercase tracking-widest">Articles</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-wellness-stone">12</p>
                      <p className="text-[8px] font-bold text-wellness-muted uppercase tracking-widest">Expert Writers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-wellness-stone">1M+</p>
                      <p className="text-[8px] font-bold text-wellness-muted uppercase tracking-widest">Readers</p>
                    </div>
                 </div>
               </div>

               {/* Popular Posts */}
               <div className="bg-white p-10 rounded-[40px] border border-stone-100 shadow-sm">
                 <h4 className="text-xl font-serif text-wellness-stone mb-8">Popular Posts</h4>
                 <div className="space-y-8">
                   {POPULAR_POSTS.map((post, i) => (
                     <div key={i} className="flex gap-4 group cursor-pointer items-center">
                        <div className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden shadow-sm">
                           <img src={post.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={post.title} />
                        </div>
                        <div className="space-y-1">
                           <h5 className="text-sm font-bold text-wellness-stone group-hover:text-wellness-sage transition-colors line-clamp-2 leading-snug">
                              {post.title}
                           </h5>
                           <p className="text-[9px] text-wellness-muted font-bold uppercase tracking-widest">{post.date}</p>
                        </div>
                     </div>
                   ))}
                 </div>
               </div>

               {/* Sidebar Newsletter */}
               <div className="bg-wellness-stone p-10 rounded-[40px] text-center space-y-8 text-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-wellness-sage/20 blur-3xl rounded-full" />
                 <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto text-wellness-sage backdrop-blur-md">
                   <Mail className="w-8 h-8" />
                 </div>
                 <div className="space-y-2">
                   <h4 className="text-2xl font-serif">Subscribe to Our Newsletter</h4>
                   <p className="text-xs text-white/60">Get the latest wellness tips, new articles, and exclusive offers.</p>
                 </div>
                 <div className="space-y-4">
                   <input 
                     type="email" 
                     placeholder="Enter your email" 
                     className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 text-sm placeholder:text-white/20 focus:outline-none focus:border-wellness-sage transition-all"
                   />
                   <button className="w-full py-4 bg-wellness-sage text-white rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-white hover:text-wellness-stone transition-all shadow-lg">
                      Subscribe
                   </button>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stay Inspired / Bottom Newsletter duplicated visually from image */}
      <section className="py-20 bg-white border-t border-stone-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-[#FAF9F6] rounded-[40px] p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-12">
             <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-wellness-sage/10 flex items-center justify-center text-wellness-sage">
                   <Leaf className="w-8 h-8" />
                </div>
                <div>
                   <h4 className="text-xl font-bold text-wellness-stone">Stay inspired</h4>
                   <p className="text-sm text-wellness-muted">Get wellness tips, new teachers, and exclusive offers.</p>
                </div>
             </div>
             
             <div className="flex-1 max-w-xl w-full flex flex-col sm:flex-row gap-4">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 bg-white border border-stone-100 rounded-full px-8 py-4 focus:outline-none focus:ring-2 focus:ring-wellness-sage/20 transition-all"
                />
                <button className="bg-wellness-stone text-white px-10 py-4 rounded-full font-bold text-sm hover:bg-wellness-sage transition-all">
                   Subscribe
                </button>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
