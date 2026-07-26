import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { Users, CreditCard, Shield, BarChart3, Database, AlertCircle, CheckCircle } from 'lucide-react';
import Loading from '../components/ui/Loading';
import { cn } from '../lib/utils';
import DashboardLayout from '../components/layout/DashboardLayout';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function AdminDashboard() {
  const { isAdmin, loading } = useAuth();
  const [logs, setLogs] = React.useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = React.useState(true);

  React.useEffect(() => {
    async function fetchPlatformLogs() {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const allLogs: any[] = [];
        
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          const email = userData.email || 'unknown@user.com';
          
          // 1. Extract payment history
          if (Array.isArray(userData.paymentHistory)) {
            userData.paymentHistory.forEach((p: any) => {
              allLogs.push({
                date: p.date || new Date().toISOString(),
                email: email,
                planId: p.planId || 'Premium Pass',
                amount: p.amount || 'Standard USD Price',
                status: p.status || 'success'
              });
            });
          }
        });
        
        // Sort logs desc by date
        allLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setLogs(allLogs);
      } catch (err) {
        console.error("Error loading activity logs:", err);
      } finally {
        setLoadingLogs(false);
      }
    }
    
    if (isAdmin) {
      fetchPlatformLogs();
    }
  }, [isAdmin]);

  if (loading) return <Loading />;
  if (!isAdmin) return <div className="p-20 text-center font-serif text-2xl">Unauthorized. Admin access only.</div>;

  return (
    <DashboardLayout>
      <div className="mb-12">
        <h1 className="text-5xl font-serif text-wellness-stone mb-4">Command Center</h1>
        <div className="flex items-center space-x-4 text-xs font-bold uppercase tracking-widest text-gray-400">
           <span>Platform Administration</span>
           <span className="w-1 h-1 bg-gray-200 rounded-full" />
           <span className="text-wellness-sage flex items-center gap-1">
             <Shield className="w-3 h-3" /> Secure Access
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
         <AdminStat label="Total Professionals" value="1,284" sub="24 pending verification" icon={<Users className="w-6 h-6" />} color="bg-wellness-stone text-white" />
         <AdminStat label="Monthly Revenue" value="$42,850" sub="+18% from last month" icon={<CreditCard className="w-6 h-6" />} color="bg-white border border-gray-100" />
         <AdminStat label="Leads Generated" value="8,492" sub="Across all categories" icon={<BarChart3 className="w-6 h-6" />} color="bg-white border border-gray-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-8 bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm shadow-gray-50/50">
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-2xl font-serif text-wellness-stone flex items-center">
                  <AlertCircle className="w-6 h-6 mr-3 text-wellness-sunset" />
                  Pending Verifications
               </h3>
               <button className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-wellness-sage">View all inquiries</button>
            </div>
            <div className="space-y-4">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-gray-50 border border-gray-100 group hover:shadow-lg transition-all">
                    <div className="flex items-center space-x-4">
                       <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center font-bold text-wellness-stone text-xl shadow-sm">P</div>
                       <div>
                          <p className="font-bold text-wellness-stone">Professional Name {i}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Yoga • 8 Years Exp</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <button className="px-6 py-2.5 bg-wellness-stone text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-wellness-sage transition-all">Verify</button>
                       <button className="px-6 py-2.5 bg-white border border-gray-100 text-gray-400 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all">Reject</button>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="lg:col-span-4 bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm shadow-gray-50/50">
            <h3 className="text-2xl font-serif text-wellness-stone mb-10 flex items-center">
               <Database className="w-6 h-6 mr-3 text-wellness-sage" />
               System Integrity
            </h3>
            <div className="space-y-8">
                <HealthBar label="Database Uptime" value="99.9%" percent={99.9} icon={<CheckCircle className="w-4 h-4 text-green-500" />} />
                <HealthBar label="API Response Time" value="124ms" percent={82} icon={<CheckCircle className="w-4 h-4 text-green-500" />} />
                <HealthBar label="Storage Capacity" value="42%" percent={42} icon={<CheckCircle className="w-4 h-4 text-green-500" />} />
                <HealthBar label="Error Rate" value="0.02%" percent={2} icon={<AlertCircle className="w-4 h-4 text-wellness-sunset" />} />
                
                <div className="pt-8 border-t border-gray-50">
                   <div className="p-6 bg-wellness-sage/5 rounded-3xl border border-wellness-sage/10">
                      <p className="text-[10px] font-bold text-wellness-stone uppercase tracking-widest mb-2">Backups Status</p>
                      <p className="text-xs text-gray-500 mb-4 leading-relaxed">Last successful backup was completed 4 hours ago at 04:22 AM UTC.</p>
                      <button className="w-full py-3 bg-white border border-wellness-sage/20 text-wellness-sage rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-wellness-sage hover:text-white transition-all">Run Manual Backup</button>
                   </div>
                </div>
            </div>
         </div>
      </div>

      {/* Platform Audit & Payment Activity Logs Section */}
      <div className="mt-12 bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm shadow-gray-50/50">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-10">
          <h3 className="text-2xl font-serif text-wellness-stone flex items-center">
             <Shield className="w-6 h-6 mr-3 text-wellness-sage" />
             Platform Audit & Payment Activity Logs
          </h3>
          <span className="text-[10px] bg-wellness-sage/10 text-wellness-sage font-bold uppercase tracking-widest px-4 py-1.5 rounded-full self-start sm:self-auto">Secure Audit Logs</span>
        </div>
        
        {loadingLogs ? (
          <div className="py-12 text-center text-xs text-gray-400 italic">Retrieving secure logs from Firestore...</div>
        ) : logs.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-400 italic">No payment logs found on platform yet.</div>
        ) : (
          <div className="overflow-x-auto w-full">
             <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                   <tr className="border-b border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      <th className="pb-4 w-1/4">Timestamp</th>
                      <th className="pb-4 w-2/5">User Identity</th>
                      <th className="pb-4 w-1/5">Plan Item</th>
                      <th className="pb-4 font-mono w-1/10">Amount</th>
                      <th className="pb-4 text-right w-1/10">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-stone-600">
                   {logs.map((log, index) => (
                      <tr key={index} className="text-sm">
                         <td className="py-4 font-mono text-xs text-gray-400">{new Date(log.date).toLocaleString()}</td>
                         <td className="py-4 font-medium text-wellness-stone">
                           <div className="flex items-center gap-2 flex-wrap">
                             <span>{log.email}</span>
                             {log.isTestPayment && (
                               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                 Test Payment Account
                               </span>
                             )}
                           </div>
                         </td>
                         <td className="py-4 text-stone-500 capitalize">{log.planId.replace(/_/g, ' ')}</td>
                         <td className="py-4 font-mono text-wellness-stone font-bold">{log.amount}</td>
                         <td className="py-4 text-right">
                           <span className={cn(
                             "inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border",
                             log.status === 'active' 
                               ? "bg-blue-50 text-blue-700 border-blue-100"
                               : "bg-emerald-50 text-emerald-700 border-emerald-100"
                           )}>
                             {log.status === 'active' ? 'Eligible' : 'Success'}
                           </span>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function AdminStat({ label, value, sub, icon, color }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={cn("p-10 rounded-[32px] shadow-sm transition-all hover:shadow-xl", color)}
    >
       <div className="mb-8 opacity-40">{icon}</div>
       <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">{label}</div>
       <div className="text-4xl font-serif mb-2 tracking-tight">{value}</div>
       <div className="text-[10px] opacity-40 italic font-medium">{sub}</div>
    </motion.div>
  );
}

function HealthBar({ label, value, percent, icon }: any) {
  return (
    <div className="space-y-3">
       <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
          <span className="flex items-center gap-2">{icon} {label}</span>
          <span className="text-wellness-stone">{value}</span>
       </div>
       <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-1000",
              percent > 90 ? "bg-green-500" : percent > 40 ? "bg-wellness-sage" : "bg-wellness-sunset"
            )} 
            style={{ width: `${percent}%` }} 
          />
       </div>
    </div>
  );
}
