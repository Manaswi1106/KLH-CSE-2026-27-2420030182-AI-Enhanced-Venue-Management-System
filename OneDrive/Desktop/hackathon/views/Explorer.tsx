
import React, { useState, useEffect, useMemo } from 'react';
import { Event, UserProfile, EventCategory } from '../types';
import EventCard from '../components/EventCard';
import { Search, Filter, Sparkles, AlertCircle, MapPin, Loader2, Navigation as NavIcon, Ghost } from 'lucide-react';
import { getAIRecommendations } from '../services/geminiService';
import { calculateDistance } from '../utils/geoUtils';

interface ExplorerProps {
  user: UserProfile;
  events: Event[];
  onRegister: (eventId: string) => void;
  onSave: (eventId: string) => void;
  onViewDetails: (eventId: string) => void;
  registeredEventIds: string[];
  savedEventIds: string[];
  initialLocation?: {lat: number, lng: number} | null;
}

const Explorer: React.FC<ExplorerProps> = ({ 
  user, 
  events, 
  onRegister, 
  onSave, 
  onViewDetails,
  registeredEventIds, 
  savedEventIds,
  initialLocation
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [recommendedIds, setRecommendedIds] = useState<string[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(initialLocation || null);
  const [isNearMeActive, setIsNearMeActive] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const NEARBY_THRESHOLD_KM = 10;

  useEffect(() => {
    if (initialLocation) setUserLocation(initialLocation);
  }, [initialLocation]);

  useEffect(() => {
    const fetchAI = async () => {
      setIsAiLoading(true);
      const ids = await getAIRecommendations(user, events, userLocation);
      setRecommendedIds(ids);
      setIsAiLoading(false);
    };
    fetchAI();
  }, [user, events, userLocation]);

  const toggleNearMe = () => {
    if (isNearMeActive) {
      setIsNearMeActive(false);
      return;
    }
    if (userLocation) {
      setIsNearMeActive(true);
      return;
    }
    setIsLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
        setUserLocation(loc);
        setIsNearMeActive(true);
        setIsLocating(false);
      },
      (error) => {
        console.error("Location error:", error);
        setLocationError("Please enable location permissions.");
        setIsLocating(false);
        setIsNearMeActive(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const filteredEvents = useMemo(() => {
    let list = events.filter(e => {
      const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            e.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
      
      let matchesLocation = true;
      if (isNearMeActive && userLocation) {
        const dist = calculateDistance(userLocation.lat, userLocation.lng, e.lat, e.lng);
        matchesLocation = dist <= NEARBY_THRESHOLD_KM;
      }
      return matchesSearch && matchesCategory && matchesLocation;
    });

    if (userLocation && !searchTerm && selectedCategory === 'All') {
      list = [...list].sort((a, b) => {
        const distA = calculateDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
        const distB = calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
        return distA - distB;
      });
    }

    return list;
  }, [events, searchTerm, selectedCategory, isNearMeActive, userLocation]);

  const categories = ['All', ...Object.values(EventCategory)];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-800 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="relative z-10 max-w-4xl">
          <h1 className="text-4xl font-black mb-3 tracking-tight">Discover Impact, {user.name.split(' ')[0]}! 🌟</h1>
          <p className="text-indigo-100 mb-8 font-medium">Join 500+ students contributing to social change today.</p>
          
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300 group-focus-within:text-white transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Find hackathons, workshops, or drives..."
                className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-2xl px-4 py-4 group hover:bg-white/20 transition-all cursor-pointer">
                <Filter className="text-indigo-200" size={18} />
                <select 
                  className="bg-transparent text-white focus:outline-none cursor-pointer font-bold text-sm"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(c => <option key={c} value={c} className="bg-slate-800">{c}</option>)}
                </select>
              </div>

              <button
                onClick={toggleNearMe}
                disabled={isLocating}
                className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-black text-sm transition-all shrink-0 shadow-lg ${
                  isNearMeActive 
                    ? 'bg-amber-400 text-slate-900 shadow-amber-400/20 scale-105' 
                    : 'bg-white text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                {isLocating ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <MapPin size={18} />
                )}
                {isNearMeActive ? `Within ${NEARBY_THRESHOLD_KM}km` : (userLocation ? 'Ranked by Proximity' : 'Near Me')}
              </button>
            </div>
          </div>
          {locationError && (
            <p className="mt-4 text-xs font-bold text-amber-300 bg-amber-500/10 px-4 py-2 rounded-xl inline-block border border-amber-500/20">{locationError}</p>
          )}
          {userLocation && !isNearMeActive && !searchTerm && (
            <div className="mt-4 flex items-center gap-2 text-indigo-100/80 text-xs font-bold uppercase tracking-widest">
              <NavIcon size={12} className="text-indigo-300" /> Live Location Detected • Priority feed enabled
            </div>
          )}
        </div>
      </div>

      {recommendedIds.length > 0 && !searchTerm && !isNearMeActive && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-xl">
              <Sparkles className="text-indigo-600" size={20} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Personalized Picks</h2>
            {isAiLoading && <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.filter(e => recommendedIds.includes(e.id)).map(e => (
              <EventCard 
                key={e.id} 
                event={e} 
                isRecommended={true} 
                onRegister={() => onRegister(e.id)}
                onSave={() => onSave(e.id)}
                onClick={() => onViewDetails(e.id)}
                isRegistered={registeredEventIds.includes(e.id)}
                isSaved={savedEventIds.includes(e.id)}
                role={user.role}
                distance={userLocation ? calculateDistance(userLocation.lat, userLocation.lng, e.lat, e.lng) : undefined}
              />
            ))}
          </div>
        </section>
      )}

      <section className="space-y-6 pb-20">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {isNearMeActive ? 'Local Opportunities' : (searchTerm || selectedCategory !== 'All' ? 'Matched Events' : 'Explore All Experiences')}
            </h2>
            {userLocation && !searchTerm && selectedCategory === 'All' && (
              <span className="text-xs font-bold text-indigo-500 mt-1">Sorted by nearest venues first</span>
            )}
          </div>
        </div>
        
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map(e => (
              <EventCard 
                key={e.id} 
                event={e} 
                onRegister={() => onRegister(e.id)}
                onSave={() => onSave(e.id)}
                onClick={() => onViewDetails(e.id)}
                isRegistered={registeredEventIds.includes(e.id)}
                isSaved={savedEventIds.includes(e.id)}
                role={user.role}
                distance={userLocation ? calculateDistance(userLocation.lat, userLocation.lng, e.lat, e.lng) : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 animate-in zoom-in duration-300">
            <div className="relative mb-8">
                <Ghost size={80} className="text-slate-200 animate-bounce duration-[2000ms]" />
                <AlertCircle size={24} className="absolute -bottom-2 -right-2 text-indigo-400 bg-white rounded-full" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">No events found nearby.</h3>
            <p className="text-slate-500 font-medium mt-3 max-w-xs text-center leading-relaxed">
              We couldn't find any matches. Try expanding your search radius or adjusting your filters.
            </p>
            <div className="flex gap-4 mt-10">
                {(isNearMeActive || searchTerm || selectedCategory !== 'All') && (
                  <button 
                    onClick={() => { setIsNearMeActive(false); setSearchTerm(''); setSelectedCategory('All'); }}
                    className="px-8 py-3.5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95"
                  >
                    Reset All Filters
                  </button>
                )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Explorer;
