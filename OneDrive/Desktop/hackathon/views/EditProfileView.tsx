
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ChevronLeft, User, Mail, GraduationCap, MapPin, Save, Briefcase, BookOpen, Calendar } from 'lucide-react';

interface EditProfileViewProps {
  user: UserProfile;
  onUpdate: (user: UserProfile) => void;
  onBack: () => void;
}

const EditProfileView: React.FC<EditProfileViewProps> = ({ user, onUpdate, onBack }) => {
  const [formData, setFormData] = useState({ ...user });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="max-w-3xl mx-auto pb-20 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Edit Profile</h1>
          <p className="text-slate-500 dark:text-slate-400">Update your KLH campus profile details.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><User size={14}/> Full Name</label>
            <input 
              required
              className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-4 px-6 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Mail size={14}/> Email Address</label>
            <input 
              readOnly
              disabled
              className="w-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-6 text-slate-400 cursor-not-allowed"
              value={formData.email}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><GraduationCap size={14}/> College</label>
            <input 
              className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-4 px-6 text-slate-900 dark:text-white"
              value={formData.college}
              onChange={(e) => setFormData({...formData, college: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><MapPin size={14}/> Branch</label>
            <input 
              className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-4 px-6 text-slate-900 dark:text-white"
              value={formData.branch}
              onChange={(e) => setFormData({...formData, branch: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Calendar size={14}/> Current Year</label>
            <select 
              className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-4 px-6 text-slate-900 dark:text-white"
              value={formData.year}
              onChange={(e) => setFormData({...formData, year: e.target.value})}
            >
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Briefcase size={14}/> Skills (Comma separated)</label>
          <input 
            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-4 px-6 text-slate-900 dark:text-white"
            value={formData.skills.join(', ')}
            onChange={(e) => setFormData({...formData, skills: e.target.value.split(',').map(s => s.trim())})}
          />
        </div>

        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><BookOpen size={14}/> Interests (Comma separated)</label>
          <input 
            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-4 px-6 text-slate-900 dark:text-white"
            value={formData.interests.join(', ')}
            onChange={(e) => setFormData({...formData, interests: e.target.value.split(',').map(s => s.trim())})}
          />
        </div>

        <div className="pt-8 border-t dark:border-slate-800 flex items-center gap-4">
          <button type="button" onClick={onBack} className="flex-1 py-5 border-2 border-slate-100 dark:border-slate-800 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cancel</button>
          <button type="submit" className="flex-[2] py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
            <Save size={20} /> Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileView;
