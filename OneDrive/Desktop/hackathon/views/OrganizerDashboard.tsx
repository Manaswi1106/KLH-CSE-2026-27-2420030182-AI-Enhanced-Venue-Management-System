
import React from 'react';
import { Event, Registration, VolunteerRole, ClubJoinRequest } from '../types';
import { Users, IndianRupee, Coffee, BarChart3, Power, Eye, UserCheck, Shield, Check, X, Clock } from 'lucide-react';

interface OrganizerDashboardProps {
  events: Event[];
  registrations: Registration[];
  clubRequests: ClubJoinRequest[];
  onApproveClubRequest: (id: string) => void;
  onToggleStatus: (eventId: string) => void;
}

const OrganizerDashboard: React.FC<OrganizerDashboardProps> = ({ events, registrations, clubRequests, onApproveClubRequest, onToggleStatus }) => {
  const stats = {
    totalRegistrations: registrations.length,
    totalRevenue: registrations.reduce((acc, r) => {
      const event = events.find(e => e.id === r.eventId);
      return acc + (event?.isPaid ? event.price : 0) + (r.foodSelected && event?.foodCost ? event.foodCost : 0);
    }, 0),
    totalFoodRequirement: registrations.filter(r => r.foodSelected).length
  };

  const pendingClubRequests = clubRequests.filter(r => r.status === 'Pending');

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">CampusBuzz Manager</h1>
          <p className="text-slate-500 dark:text-slate-400">Real-time oversight of KLH campus events and clubs.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-5 py-2.5 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 text-green-700 dark:text-green-400 rounded-xl flex items-center gap-2 text-sm font-bold">
             <Shield size={16} /> Verified CampusBuzz Org
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl"><Users size={24} /></div>
            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Participants</div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{stats.totalRegistrations}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl"><IndianRupee size={24} /></div>
            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Demo Revenue</div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">₹{stats.totalRevenue}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl"><Coffee size={24} /></div>
            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Meals Needed</div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{stats.totalFoodRequirement}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-8 border-b dark:border-slate-800 flex items-center justify-between">
             <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
               <BarChart3 className="text-indigo-600" /> Event Activity
             </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Event</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {events.map(event => (
                  <tr key={event.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-6">
                      <div className="font-bold text-slate-900 dark:text-white">{event.title}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">{event.registeredCount}/{event.capacity} Slots</div>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${event.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                       <button onClick={() => onToggleStatus(event.id)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 hover:text-indigo-600">
                          <Power size={18} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
           <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
             <Clock className="text-indigo-600" /> Pending Club Requests
           </h2>
           <div className="space-y-4">
             {pendingClubRequests.length > 0 ? pendingClubRequests.map(req => (
               <div key={req.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">{req.userName.charAt(0)}</div>
                    <div>
                       <div className="text-sm font-bold text-slate-900 dark:text-white">{req.userName}</div>
                       <div className="text-[10px] text-slate-400 font-bold uppercase">{req.userEmail}</div>
                    </div>
                 </div>
                 <div className="flex items-center gap-2">
                    <button onClick={() => onApproveClubRequest(req.id)} className="p-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl hover:bg-green-200 transition-all"><Check size={18}/></button>
                    <button className="p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl hover:bg-red-200 transition-all"><X size={18}/></button>
                 </div>
               </div>
             )) : (
               <div className="text-center py-10 text-slate-400">No pending club requests.</div>
             )}
           </div>
        </section>
      </div>

      <section className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-sm border border-slate-200 dark:border-slate-800">
         <h2 className="text-xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
           <UserCheck className="text-indigo-600" /> Recent Participant Activity
         </h2>
         <div className="space-y-4">
           {registrations.slice(0, 5).map(reg => (
             <div key={reg.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center font-bold text-indigo-600">{reg.userName.charAt(0)}</div>
                  <div className="text-sm font-bold text-slate-800 dark:text-white">{reg.userName} registered for {events.find(e => e.id === reg.eventId)?.title}</div>
               </div>
             </div>
           ))}
         </div>
      </section>
    </div>
  );
};

export default OrganizerDashboard;
