import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { firestoreService } from '../services/firestore';
import { where, orderBy } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MessageCircle, Clock, Search, Lock, MoreHorizontal, Filter, ChevronRight } from 'lucide-react';
import Loading from '../components/ui/Loading';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import DashboardLayout from '../components/layout/DashboardLayout';

export default function LeadDashboard() {
  const { user, profile } = useAuth();
  const [leads, setLeads] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState('all');

  React.useEffect(() => {
    const fetchLeads = async () => {
      if (!user) return;
      try {
        const constraints = [where('professionalId', '==', user.uid), orderBy('createdAt', 'desc')];
        const res = await firestoreService.getCollection('leads', constraints);
        setLeads(res || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, [user]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await firestoreService.updateDocument('leads', id, { status });
      setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Loading />;

  const isFree = profile?.subscriptionPlan === 'free';
  const filteredLeads = leads.filter(l => filter === 'all' || l.status === filter);

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
           <h1 className="text-5xl font-serif text-wellness-stone mb-4">Inquiries Sanctuary</h1>
           <div className="flex items-center space-x-4 text-xs font-bold uppercase tracking-widest text-gray-400">
             <span className="text-wellness-sage">{leads.length} Total</span>
             <span className="w-1 h-1 bg-gray-200 rounded-full" />
             <span>{profile?.leadsRemaining ?? 0} Capacity</span>
             <span className="w-1 h-1 bg-gray-200 rounded-full" />
             <span>Real Data Active</span>
           </div>
        </div>
        
        <div className="flex bg-white rounded-2xl p-1.5 border border-gray-100 shadow-sm shadow-gray-50 overflow-x-auto no-scrollbar max-w-full">
           {['all', 'new', 'contacted', 'closed'].map(f => (
             <button
               key={f}
               onClick={() => setFilter(f)}
               className={cn(
                 "px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                 filter === f 
                  ? "bg-wellness-sage text-white shadow-lg shadow-wellness-sage/20" 
                  : "text-gray-400 hover:text-wellness-stone"
               )}
             >
               {f}
             </button>
           ))}
        </div>
      </div>

      {isFree ? (
        <div className="bg-white p-20 text-center rounded-[40px] border-2 border-dashed border-wellness-sage/20 relative overflow-hidden group">
           <div className="absolute inset-0 bg-wellness-sage/5 opacity-0 group-hover:opacity-100 transition-opacity" />
           <div className="relative z-10">
              <div className="w-20 h-20 bg-wellness-sage/10 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:rotate-6 transition-transform">
                <Lock className="w-10 h-10 text-wellness-sage" />
              </div>
              <h2 className="text-4xl font-serif text-wellness-stone mb-6">Leads are currently dormant</h2>
              <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
                You have <span className="font-bold text-wellness-stone">{leads.length} potential students</span> waiting to connect! Upgrade to a premium plan to unlock their contact details.
              </p>
              <Link 
                to="/pricing"
                className="inline-flex items-center gap-3 bg-wellness-stone text-white px-10 py-5 rounded-2xl font-bold text-sm hover:scale-105 transition-all shadow-xl shadow-wellness-stone/20"
              >
                Unlock All Leads <ChevronRight className="w-4 h-4" />
              </Link>
           </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredLeads.length > 0 ? (
            filteredLeads.map((lead, idx) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white p-8 rounded-[32px] border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 group hover:border-wellness-sage/30 hover:shadow-xl shadow-gray-100/50 transition-all"
              >
                <div className="flex items-start space-x-6 flex-1">
                   <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center font-serif text-2xl text-wellness-sage border border-gray-100 group-hover:bg-wellness-sage group-hover:text-white transition-all">
                      {lead.studentName?.[0] || 'S'}
                   </div>
                   <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-2xl font-serif text-wellness-stone leading-none">{lead.studentName}</h3>
                        <span className={cn(
                          "px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest",
                          lead.status === 'new' ? "bg-wellness-sage/10 text-wellness-sage" : "bg-gray-100 text-gray-400"
                        )}>
                          {lead.status || 'new'}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm max-w-xl font-light italic mt-2 leading-relaxed">
                        "{lead.message || 'I am interested in your wellness sessions.'}"
                      </p>
                      <div className="flex items-center gap-6 pt-4">
                        <div className="flex items-center text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                           <Clock className="w-3.5 h-3.5 mr-2 text-wellness-sage/50" />
                           {lead.createdAt ? new Date(lead.createdAt?.toDate()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Just now'}
                        </div>
                        <div className="flex items-center text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                           <Filter className="w-3.5 h-3.5 mr-2 text-wellness-sage/50" />
                           Initial Inquiry
                        </div>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                   <div className="flex-1 md:flex-none grid grid-cols-3 gap-3">
                      <a 
                        href={`mailto:${lead.studentEmail}`} 
                        className="w-12 h-12 rounded-xl bg-gray-50 text-gray-400 hover:bg-wellness-sage hover:text-white transition-all flex items-center justify-center shadow-sm"
                        title="Email Student"
                      >
                         <Mail className="w-5 h-5" />
                      </a>
                      <a 
                        href={`tel:${lead.studentPhone}`} 
                        className="w-12 h-12 rounded-xl bg-gray-50 text-gray-400 hover:bg-wellness-sage hover:text-white transition-all flex items-center justify-center shadow-sm"
                        title="Call Student"
                      >
                         <Phone className="w-5 h-5" />
                      </a>
                      <button 
                        className="w-12 h-12 rounded-xl bg-gray-50 text-gray-400 hover:bg-wellness-sage hover:text-white transition-all flex items-center justify-center shadow-sm"
                        title="Chat Message"
                      >
                         <MessageCircle className="w-5 h-5" />
                      </button>
                   </div>
                   
                   <div className="relative group/menu">
                      <button className="w-12 h-12 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-wellness-stone hover:border-gray-200 transition-all flex items-center justify-center">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                      <div className="absolute right-0 top-full mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-20 scale-95 group-hover/menu:scale-100 origin-top-right">
                         <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-4 py-2">Update Status</p>
                         {['new', 'contacted', 'closed'].map(s => (
                           <button
                             key={s}
                             onClick={() => updateStatus(lead.id, s)}
                             className={cn(
                               "w-full text-left px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors",
                               lead.status === s ? "bg-wellness-sage/10 text-wellness-sage" : "hover:bg-gray-50 text-gray-500 hover:text-wellness-stone"
                             )}
                           >
                             {s}
                           </button>
                         ))}
                         <div className="h-[1px] bg-gray-50 my-2" />
                         <button className="w-full text-left px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors">
                            Delete Inquiry
                         </button>
                      </div>
                   </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-32 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100">
               <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Search className="w-8 h-8 text-gray-200" />
               </div>
               <p className="text-2xl font-serif text-wellness-stone mb-2">The sanctuary is still.</p>
               <p className="text-gray-400 text-sm">No inquiries matching your selected criteria yet.</p>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
