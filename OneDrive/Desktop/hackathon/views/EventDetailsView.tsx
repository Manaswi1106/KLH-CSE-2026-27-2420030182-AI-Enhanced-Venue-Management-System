
import React, { useState, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Event, UserRole } from '../types';
import {
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  IndianRupee,
  Users,
  Share2,
  Navigation as NavIcon,
  CalendarPlus,
  Check,
  ExternalLink,
  Utensils,
  Zap,
  Ticket,
  Search,
  Coffee,
  Car,
  Loader2
} from 'lucide-react';

import { registerForEvent } from "../services/registrationService";
import { auth } from "../services/firebase";

interface EventDetailsViewProps {
  event: Event;
  onBack: () => void;
  isRegistered: boolean;
  role: UserRole;
  distance?: number;
}

const InfoCard: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex items-center space-x-4">
    <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
      {icon}
    </div>
    <div>
      <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{label}</p>
      <p className="text-slate-100 font-semibold">{value}</p>
    </div>
  </div>
);

const NearbyPlaces: React.FC<{ lat: number; lng: number; locationName: string }> = ({ lat, lng, locationName }) => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [links, setLinks] = useState<{ title: string; uri: string }[]>([]);

  const exploreArea = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `What are some highly-rated cafes, restaurants, and convenient parking spots near ${locationName}? Provide a brief summary for students attending an event here.`,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: lat,
                longitude: lng
              }
            }
          }
        },
      });

      setRecommendations(response.text || "No specific details found for this area.");
      
      // Extract grounding links as required by the API rules
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const extractedLinks = chunks
        .filter((chunk: any) => chunk.maps)
        .map((chunk: any) => ({
          title: chunk.maps.title,
          uri: chunk.maps.uri
        }));
      setLinks(extractedLinks);
    } catch (error) {
      console.error("Grounding error:", error);
      setRecommendations("Unable to fetch nearby details at the moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Search className="text-indigo-400" size={24} /> 
          Explore the Area
        </h2>
        {!recommendations && !loading && (
          <button 
            onClick={exploreArea}
            className="px-4 py-2 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-xl text-sm font-bold hover:bg-indigo-600/30 transition-all flex items-center gap-2"
          >
            <NavIcon size={14} /> Discover Nearby
          </button>
        )}
      </div>

      {loading && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 flex flex-col items-center justify-center space-y-4 animate-pulse">
          <Loader2 className="text-indigo-500 animate-spin" size={40} />
          <p className="text-slate-400 font-medium">Querying Google Maps for local spots...</p>
        </div>
      )}

      {recommendations && (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 shadow-xl">
          <div className="prose prose-invert max-w-none text-slate-400 leading-relaxed">
            {recommendations}
          </div>
          
          {links.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Verified Locations</p>
              <div className="flex flex-wrap gap-2">
                {links.map((link, i) => (
                  <a 
                    key={i}
                    href={link.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-sm font-semibold text-slate-200 transition-all"
                  >
                    <MapPin size={14} className="text-red-400" />
                    {link.title}
                    <ExternalLink size={12} className="opacity-50" />
                  </a>
                ))}
              </div>
            </div>
          )}

          <button 
            onClick={() => {setRecommendations(null); setLinks([]);}}
            className="text-slate-500 hover:text-slate-300 text-xs font-bold uppercase"
          >
            Clear Suggestions
          </button>
        </div>
      )}

      {!recommendations && !loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl flex items-center gap-4 group cursor-pointer hover:border-indigo-500/30 transition-colors" onClick={exploreArea}>
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 group-hover:scale-110 transition-transform">
              <Coffee size={20} />
            </div>
            <p className="text-slate-300 font-semibold">Best Study Cafes</p>
          </div>
          <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl flex items-center gap-4 group cursor-pointer hover:border-indigo-500/30 transition-colors" onClick={exploreArea}>
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform">
              <Car size={20} />
            </div>
            <p className="text-slate-300 font-semibold">Closest Parking</p>
          </div>
        </div>
      )}
    </div>
  );
};

const EventDetailsView: React.FC<EventDetailsViewProps> = ({
  event,
  onBack,
  isRegistered,
  role,
  distance
}) => {
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    try {
      setIsSubmitting(true);
      const user = auth.currentUser;

      if (!user) {
        alert("Please login first");
        return;
      }

      await registerForEvent(event.id, user.uid);
      alert("Registered successfully!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addToCalendar = () => {
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(event.description);
    const location = encodeURIComponent(event.location);
    const dateStr = event.date.replace(/-/g, '');
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dateStr}T090000Z/${dateStr}T180000Z`;
    window.open(url, '_blank');
  };

  const handleShare = () => {
    const shareLink = `https://campusbuzz.klh.edu.in/events/${event.id}`;
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${event.lat},${event.lng}`;
    window.open(url, '_blank');
  };

  const capacityPercentage = Math.min(Math.round((event.registeredCount / event.capacity) * 100), 100);
  
  const staticMapUrl = useMemo(() => 
    `https://maps.googleapis.com/maps/api/staticmap?center=${event.lat},${event.lng}&zoom=16&size=800x400&markers=color:red%7C${event.lat},${event.lng}&style=feature:all|element:labels.text.fill|color:0x746855&style=feature:all|element:labels.text.stroke|color:0x242f3e&style=feature:administrative.locality|element:labels.text.fill|color:0xd59563&style=feature:poi|element:labels.text.fill|color:0xd59563&style=feature:poi.park|element:geometry|color:0x263c3f&style=feature:poi.park|element:labels.text.fill|color:0x6b9a76&style=feature:road|element:geometry|color:0x38414e&style=feature:road|element:geometry.stroke|color:0x212a37&style=feature:road|element:labels.text.fill|color:0x9ca5b3&style=feature:road.highway|element:geometry|color:0x746855&style=feature:road.highway|element:geometry.stroke|color:0x1f2835&style=feature:road.highway|element:labels.text.fill|color:0xf3d19c&style=feature:transit|element:geometry|color:0x2f3948&style=feature:transit.station|element:labels.text.fill|color:0xd59563&style=feature:water|element:geometry|color:0x17263c&style=feature:water|element:labels.text.fill|color:0x515c6d&style=feature:water|element:labels.text.stroke|color:0x17263c`,
  [event.lat, event.lng]);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100">
      {/* Hero Section */}
      <div className="relative h-[55vh] min-h-[450px] overflow-hidden">
        <img 
          src={event.posterUrl} 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
          alt={event.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        
        {/* Navigation Overlays */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
          <button
            onClick={onBack}
            className="p-3 bg-slate-950/40 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-white/10 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="flex gap-3">
            <button 
              onClick={handleShare}
              className="px-5 py-2.5 bg-slate-950/40 backdrop-blur-md border border-white/10 rounded-full text-white flex items-center gap-2 hover:bg-white/10 transition-colors text-sm font-semibold"
            >
              {copied ? <Check size={18} className="text-green-400" /> : <Share2 size={18} />}
              {copied ? "Copied" : "Share"}
            </button>
          </div>
        </div>

        {/* Hero Title Container */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-12 max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="px-4 py-1.5 bg-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-indigo-500/30">
              Campus Event
            </span>
            {event.foodAvailable && (
              <span className="px-4 py-1.5 bg-emerald-600 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-emerald-500/20">
                <Utensils size={14} /> Refreshements
              </span>
            )}
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight max-w-4xl text-white">
            {event.title}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12 -mt-10 relative z-20">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-16">
          
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoCard icon={<Calendar size={20} />} label="Date" value={event.date} />
            <InfoCard icon={<Clock size={20} />} label="Time" value={event.time} />
            <InfoCard icon={<IndianRupee size={20} />} label="Entry Fee" value={event.fee === 0 ? "FREE" : `₹${event.fee}`} />
            <InfoCard icon={<Users size={20} />} label="Available Slots" value={`${event.capacity - event.registeredCount} Left`} />
          </div>

          {/* Description Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Zap className="text-indigo-400" size={24} /> 
              About the Event
            </h2>
            <div className="prose prose-invert max-w-none text-slate-400 leading-relaxed text-lg">
              {event.description}
            </div>
          </section>

          {/* Location & Venue Section */}
          <section className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <MapPin className="text-indigo-400" size={24} /> 
                Location & Venue
              </h2>
              <button 
                onClick={openInGoogleMaps}
                className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold flex items-center gap-1"
              >
                Open in Maps <ExternalLink size={14} />
              </button>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6 shadow-xl">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-800 rounded-lg">
                  <NavIcon size={18} className="text-slate-400" />
                </div>
                <div>
                  <p className="font-bold text-lg">{event.location}</p>
                  <p className="text-slate-400">Main Campus, Tech University</p>
                </div>
              </div>

              <div 
                className="relative h-72 rounded-2xl overflow-hidden cursor-pointer group shadow-inner" 
                onClick={openInGoogleMaps}
              >
                <img 
                  src={staticMapUrl} 
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" 
                  alt="Static Map"
                />
                <div className="absolute inset-0 bg-indigo-500/10 pointer-events-none group-hover:bg-transparent transition-colors" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 p-4 rounded-full border border-slate-800 shadow-2xl group-hover:scale-110 transition-transform">
                   <MapPin className="text-red-500 fill-red-500/20" size={32} />
                </div>
              </div>
            </div>
          </section>

          {/* Grounded Google Maps Explore Section */}
          <NearbyPlaces lat={event.lat} lng={event.lng} locationName={event.location} />

          {/* Itinerary Section */}
          {event.itinerary && event.itinerary.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl font-bold">Event Itinerary</h2>
              <div className="space-y-4">
                {event.itinerary.map((item, idx) => (
                  <div key={idx} className="flex gap-6 group">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-indigo-500/20" />
                      {idx !== event.itinerary.length - 1 && (
                        <div className="w-0.5 h-full bg-slate-800 my-2" />
                      )}
                    </div>
                    <div className="pb-8">
                      <p className="text-indigo-400 font-mono text-sm font-bold mb-1">{item.time}</p>
                      <p className="text-slate-200 font-semibold text-lg">{item.activity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* Sidebar Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] sticky top-24 shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest">Secure Entry</p>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${event.status === 'Open' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-red-500'}`} />
                  <span className="font-bold text-xl">{event.status === 'Open' ? 'Status: Open' : 'Status: Closed'}</span>
                </div>
              </div>
              <Ticket className="text-indigo-500" size={32} />
            </div>

            <div className="space-y-6">
              {/* Capacity Progress */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-slate-400">Capacity Utilization</span>
                  <span className={capacityPercentage > 85 ? 'text-red-400' : 'text-slate-200'}>
                    {event.registeredCount} / {event.capacity}
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out ${
                      capacityPercentage > 90 ? 'bg-red-500' : capacityPercentage > 70 ? 'bg-amber-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${capacityPercentage}%` }}
                  />
                </div>
                {capacityPercentage > 80 && (
                  <p className="text-amber-400 text-xs font-semibold animate-pulse">
                    ⚠️ Limited spots remaining! Book fast.
                  </p>
                )}
              </div>

              {/* Action Button */}
              {role === UserRole.STUDENT && (
                <button
                  disabled={
                    isRegistered ||
                    event.status !== "Open" ||
                    event.registeredCount >= event.capacity ||
                    isSubmitting
                  }
                  onClick={handleRegister}
                  className={`w-full py-5 rounded-2xl font-black text-xl shadow-xl transition-all active:scale-[0.98] ${
                    isRegistered
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-default"
                      : event.registeredCount >= event.capacity
                        ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                        : "bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-indigo-500/20 ring-4 ring-indigo-500/10"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                       Processing...
                    </span>
                  ) : isRegistered ? (
                    <span className="flex items-center justify-center gap-2">
                       <Check size={24} /> Registered
                    </span>
                  ) : event.registeredCount >= event.capacity ? (
                    "Event Full"
                  ) : (
                    "Reserve Spot"
                  )}
                </button>
              )}

              {/* Secondary Actions */}
              <div className="grid grid-cols-1 gap-3 pt-2">
                <button 
                  onClick={addToCalendar} 
                  className="py-4 border border-slate-800 bg-slate-800/30 hover:bg-slate-800 rounded-2xl flex items-center justify-center gap-2 transition-colors font-bold text-slate-300"
                >
                  <CalendarPlus size={20} className="text-indigo-400" /> 
                  Add to Calendar
                </button>
              </div>

              <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-4">
                 <p className="text-slate-500 text-xs leading-relaxed">
                   * Secure entry requires a valid student ID. Registration is non-transferable.
                 </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EventDetailsView;
