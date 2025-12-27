
import React, { useState } from 'react';
import { Event, EventCategory, FoodType } from '../types';
import { ChevronLeft, Image, MapPin, IndianRupee, Clock, Calendar, Users, Coffee, PlusCircle } from 'lucide-react';
 import { createEvent } from "../services/eventService";
 import { uploadPoster } from "../services/storageService";
interface CreateEventViewProps {
  onCreated: (event: Event) => void;
  onBack: () => void;
}

const CreateEventView: React.FC<CreateEventViewProps> = ({ onCreated, onBack }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: EventCategory.TECH,
    date: '',
    time: '',
    location: '',
    lat: 17.4447,
    lng: 78.3788,
    isPaid: false,
    price: 0,
    capacity: 50,
    foodOption: false,
    foodType: FoodType.SNACKS,
    foodCost: 0,
    posterUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800'
  });

 

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  console.log("Submit button clicked");
  console.log("Calling backend createEvent");

  const eventData = {
    ...formData,
    organizerId: "org1",
    registeredCount: 0,
    status: "Open",
  };

  try {
    await createEvent(eventData);
    console.log("Firestore write success");
    alert("Event created successfully!");
    onBack();
  } catch (error) {
    console.error("Firestore error:", error);
  }
};


  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Campus Event</h1>
          <p className="text-slate-500">Publish a new experience for KLH students.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Event Visuals</label>
          <div className="h-48 rounded-3xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-200 relative group cursor-pointer">
            <img src={formData.posterUrl} className="w-full h-full object-cover group-hover:opacity-70 transition-opacity" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="p-3 bg-white rounded-2xl shadow-xl flex items-center gap-2 text-sm font-bold text-indigo-600">
                 <Image size={18} /> Update Poster Link
               </div>
            </div>
            <input 
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => {
                const url = prompt("Enter Image URL:", formData.posterUrl);
                if (url) setFormData({...formData, posterUrl: url});
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Event Title</label>
            <input 
              required
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
              placeholder="e.g. Annual Tech Symposium"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
            <select 
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value as EventCategory})}
            >
              {Object.values(EventCategory).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Detailed Description</label>
          <textarea 
            required
            rows={4}
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all resize-none"
            placeholder="Tell participants what to expect, skills needed, and objectives..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1"><Calendar size={14}/> Date</label>
            <input type="date" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1"><Clock size={14}/> Time</label>
            <input type="text" placeholder="09:00 AM" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6" required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1"><Users size={14}/> Max Capacity</label>
            <input type="number" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6" required value={formData.capacity} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1"><MapPin size={14}/> Campus Venue</label>
          <input className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6" placeholder="e.g. Block C Auditorium" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6">
           <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                 <h3 className="font-bold flex items-center gap-2"><IndianRupee size={18} className="text-indigo-600"/> Payment Config</h3>
                 <input type="checkbox" className="w-5 h-5 accent-indigo-600" checked={formData.isPaid} onChange={e => setFormData({...formData, isPaid: e.target.checked})} />
              </div>
              {formData.isPaid && (
                <input type="number" placeholder="Entry Price (INR)" className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm" value={formData.price} onChange={e => setFormData({...formData, price: parseInt(e.target.value)})} />
              )}
              <p className="text-[10px] text-slate-400 font-medium">Use simulated mode for hackathon demonstrations.</p>
           </div>

           <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                 <h3 className="font-bold flex items-center gap-2"><Coffee size={18} className="text-indigo-600"/> Food Arrangement</h3>
                 <input type="checkbox" className="w-5 h-5 accent-indigo-600" checked={formData.foodOption} onChange={e => setFormData({...formData, foodOption: e.target.checked})} />
              </div>
              {formData.foodOption && (
                <div className="space-y-2">
                   <select className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm" value={formData.foodType} onChange={e => setFormData({...formData, foodType: e.target.value as FoodType})}>
                      {Object.values(FoodType).map(t => <option key={t} value={t}>{t}</option>)}
                   </select>
                   <input type="number" placeholder="Food Cost (if extra)" className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm" value={formData.foodCost} onChange={e => setFormData({...formData, foodCost: parseInt(e.target.value)})} />
                </div>
              )}
           </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex items-center gap-4">
          <button type="button" onClick={onBack} className="flex-1 py-5 border-2 border-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-all">
            Discard
          </button>
          <button type="submit" className="flex-[2] py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
            <PlusCircle size={20} /> Launch Campus Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEventView;
