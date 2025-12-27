
import React from 'react';
import { Event, UserRole } from '../types';
import { MapPin, Calendar, Clock, IndianRupee, Users, CheckCircle, Navigation, Heart, CalendarPlus } from 'lucide-react';

interface EventCardProps {
  event: Event;
  onRegister?: () => void;
  onSave?: (id: string) => void;
  onClick?: () => void;
  isRegistered?: boolean;
  isSaved?: boolean;
  isRecommended?: boolean;
  role?: UserRole;
  distance?: number;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onRegister, 
  onSave, 
  onClick,
  isRegistered, 
  isSaved, 
  isRecommended, 
  role, 
  distance 
}) => {
  const addToCalendar = (e: React.MouseEvent) => {
    e.stopPropagation();
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(event.description);
    const location = encodeURIComponent(event.location);
    const dateStr = event.date.replace(/-/g, '');
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dateStr}T090000Z/${dateStr}T180000Z`;
    window.open(url, '_blank');
  };

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRegister?.();
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave?.(event.id);
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 relative flex flex-col h-full group cursor-pointer ${isRecommended ? 'border-indigo-400 ring-1 ring-indigo-400' : 'border-slate-200'}`}
    >
      {isRecommended && (
        <div className="absolute top-4 right-4 bg-indigo-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-full z-10 shadow-lg">
          AI Pick
        </div>
      )}
      
      <div className="h-48 overflow-hidden relative shrink-0">
        <img src={event.posterUrl} alt={event.title} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="bg-white/95 backdrop-blur px-3 py-1 rounded-full text-[10px] uppercase font-bold text-indigo-600 shadow-sm self-start">
            {event.category}
          </span>
          {distance !== undefined && (
            <span className="bg-amber-400 text-slate-900 px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center self-start">
              <Navigation size={10} className="mr-1" />
              {distance.toFixed(1)} km
            </span>
          )}
        </div>

        {role === UserRole.STUDENT && (
          <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
            <button 
              onClick={handleSaveClick}
              className={`p-2 rounded-xl backdrop-blur-md transition-all ${isSaved ? 'bg-red-500 text-white' : 'bg-white/30 text-white hover:bg-white/50'}`}
              title={isSaved ? "Saved" : "Save Event"}
            >
              <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
            </button>
            <button 
              onClick={addToCalendar}
              className="p-2 bg-white/30 backdrop-blur-md text-white rounded-xl hover:bg-white/50 transition-all"
              title="Add to Calendar"
            >
              <CalendarPlus size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">{event.title}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-slate-500 text-sm">
            <Calendar size={14} className="mr-2 text-indigo-500" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center text-slate-500 text-sm">
            <Clock size={14} className="mr-2 text-indigo-500" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center text-slate-500 text-sm">
            <MapPin size={14} className="mr-2 text-indigo-500" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
          <div className="flex flex-col">
            <div className="flex items-center text-slate-800 font-bold">
              <IndianRupee size={16} />
              <span>{event.isPaid ? event.price : 'Free'}</span>
            </div>
            <div className="flex items-center text-slate-400 text-[10px] font-medium uppercase tracking-wider mt-0.5">
              <Users size={10} className="mr-1" />
              <span>{event.registeredCount}/{event.capacity} Slots</span>
            </div>
          </div>

          {role === UserRole.STUDENT && (
            <button
              disabled={isRegistered || event.status !== 'Open'}
              onClick={handleRegisterClick}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${
                isRegistered 
                  ? 'bg-green-100 text-green-700 cursor-default flex items-center'
                  : event.status !== 'Open'
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 hover:shadow-indigo-100'
              }`}
            >
              {isRegistered ? (
                <>
                  <CheckCircle size={14} className="mr-1" />
                  Registered
                </>
              ) : event.status !== 'Open' ? 'Closed' : 'Register'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
