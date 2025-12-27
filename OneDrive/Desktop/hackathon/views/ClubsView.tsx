
import React from 'react';
import { Club, UserProfile, ClubJoinRequest } from '../types';
import { Users, Search, CheckCircle2, Loader2, ChevronRight, Plus } from 'lucide-react';

interface ClubsViewProps {
  clubs: Club[];
  user: UserProfile;
  onJoin: (clubId: string) => void;
  activeRequests: ClubJoinRequest[];
}

const ClubsView: React.FC<ClubsViewProps> = ({ clubs, user, onJoin, activeRequests }) => {
  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-black mb-3 tracking-tight">Campus Communities</h1>
          <p className="text-indigo-100 font-medium">Join clubs that match your passion and build your legacy at KLH.</p>
        </div>
        <Users size={180} className="absolute -bottom-10 -right-10 opacity-10 rotate-12" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {clubs.map(club => {
          const isJoined = user.joinedClubIds.includes(club.id);
          const request = activeRequests.find(r => r.clubId === club.id);
          const isPending = request?.status === 'Pending';

          return (
            <div key={club.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm hover:shadow-xl transition-all group flex flex-col">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700">
                  <img src={club.logoUrl} alt={club.name} className="w-full h-full object-cover" />
                </div>
                <span className="bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">{club.category}</span>
              </div>
              
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 transition-colors">{club.name}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 flex-1">{club.description}</p>
              
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                  <Users size={14} /> {club.membersCount} Members
                </div>
                
                {isJoined ? (
                  <div className="flex items-center gap-1.5 text-green-600 font-black text-xs uppercase tracking-widest">
                    <CheckCircle2 size={16} /> Joined
                  </div>
                ) : isPending ? (
                  <div className="flex items-center gap-1.5 text-amber-600 font-black text-xs uppercase tracking-widest">
                    <Loader2 size={16} className="animate-spin" /> Pending
                  </div>
                ) : (
                  <button 
                    onClick={() => onJoin(club.id)}
                    className="flex items-center gap-1 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100 dark:shadow-none"
                  >
                    <Plus size={14} /> Request Access
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClubsView;
