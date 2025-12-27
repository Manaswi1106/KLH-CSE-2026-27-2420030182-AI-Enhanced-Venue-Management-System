
import React, { useState } from 'react';
import { UserProfile, Event, Registration, FoodOrder, Activity } from '../types';
import { User, MapPin, GraduationCap, Mail, Star, History, Coffee, Award, Shield, ChevronRight, CheckCircle2, Package, Clock, Heart, Edit3 } from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile;
  events: Event[];
  registrations: Registration[];
  savedEvents: Event[];
  foodOrders: FoodOrder[];
  activities: Activity[];
  onEditProfile: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, events, registrations, savedEvents, foodOrders, activities, onEditProfile }) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'volunteer' | 'food'>('timeline');

  const attendedEvents = events.filter(e => registrations.some(r => r.eventId === e.id && r.checkedIn));
  const upcomingEvents = events.filter(e => registrations.some(r => r.eventId === e.id && !r.checkedIn));

  const badges = [
    { name: 'Elite Member', icon: Shield, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400', level: 'Level 5' },
    { name: 'Impact Pro', icon: Star, color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400', level: 'High Engagement' },
    { name: 'Safe Citizen', icon: CheckCircle2, color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400', level: 'Verified' },
  ];

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl opacity-50" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative">
            <div className="w-32 h-32 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-indigo-200 dark:shadow-indigo-900/50">
              {user.name.charAt(0)}
            </div>
            {user.isVerified && (
              <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-full border-4 border-white dark:border-slate-900">
                <CheckCircle2 size={20} />
              </div>
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{user.name}</h1>
              <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-xs font-bold uppercase tracking-widest">
                {user.role}
              </span>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-y-2 gap-x-6 text-slate-500 dark:text-slate-400 font-medium text-sm">
              <span className="flex items-center gap-1.5"><GraduationCap size={16} className="text-indigo-500" /> {user.college}</span>
              <span className="flex items-center gap-1.5"><MapPin size={16} className="text-indigo-500" /> {user.branch}, {user.year}</span>
              <span className="flex items-center gap-1.5"><Mail size={16} className="text-indigo-500" /> {user.email}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={onEditProfile}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold rounded-2xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all active:scale-95"
            >
              <Edit3 size={18} /> Edit Profile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {[
            { label: 'Events Attended', value: attendedEvents.length, icon: History },
            { label: 'Impact Points', value: user.points, icon: Star },
            { label: 'Saved Items', value: savedEvents.length, icon: Heart },
            { label: 'Achievements', value: badges.length, icon: Award },
          ].map((stat, i) => (
            <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 hover:scale-105 transition-transform">
              <div className="flex items-center gap-2 mb-1 text-slate-400 dark:text-slate-500">
                <stat.icon size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{stat.label}</span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="flex border-b dark:border-slate-800">
              {(['timeline', 'volunteer', 'food'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-5 font-black text-sm tracking-tight transition-all relative ${
                    activeTab === tab ? 'text-indigo-600' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
                  }`}
                >
                  {tab === 'timeline' && 'Activity Timeline'}
                  {tab === 'volunteer' && 'Volunteer History'}
                  {tab === 'food' && 'Food & Orders'}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />}
                </button>
              ))}
            </div>

            <div className="p-8">
              {activeTab === 'timeline' && (
                <div className="space-y-8 relative">
                  <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-800" />
                  {activities.map(activity => (
                    <div key={activity.id} className="relative pl-12">
                      <div className="absolute left-0 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-4 border-indigo-600 flex items-center justify-center shadow-sm z-10" />
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">{activity.time}</span>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">{activity.title}</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{activity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'volunteer' && (
                <div className="space-y-4">
                  {registrations.length > 0 ? registrations.map(reg => {
                    const event = events.find(e => e.id === reg.eventId);
                    return (
                      <div key={reg.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-between group hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
                            <GraduationCap size={24} />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">{event?.title || 'Unknown Event'}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Assigned Role: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{reg.role}</span></p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                           {reg.checkedIn ? <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold rounded-full uppercase">Completed</span> : <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-[10px] font-bold rounded-full uppercase">Pending</span>}
                           <ChevronRight size={18} className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-600" />
                        </div>
                      </div>
                    );
                  }) : <div className="text-center py-12 text-slate-400">No volunteer history yet.</div>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
