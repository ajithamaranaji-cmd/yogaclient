import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { Users, CreditCard, Shield, BarChart3, Database, AlertCircle, CheckCircle } from 'lucide-react';
import Loading from '../components/ui/Loading';
import { cn } from '../lib/utils';
import DashboardLayout from '../components/layout/DashboardLayout';

export default function AdminDashboard() {
  const { isAdmin, loading } = useAuth();

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
