import React, { useState, useEffect, useRef } from "react";
import { Venue } from "../types";
import { INITIAL_VENUES } from "../constants";
import {
  ListFilter,
  ChevronLeft,
  ChevronRight,
  Heart,
  LocateFixed,
  Search as SearchIcon,
} from "lucide-react";
import { calculateDistance } from "../utils/geoUtils";

interface VenuesViewProps {
  onBack: () => void;
}

const VenuesView: React.FC<VenuesViewProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [venues] = useState<Venue[]>(INITIAL_VENUES);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 17.4447,
    lng: 78.3788,
  });
  const [isLocating, setIsLocating] = useState(false);
  const watchId = useRef<number | null>(null);

  // Locate user
  const handleLocateUser = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        setMapCenter(loc);
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    handleLocateUser();
    return () => {
      if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
    };
  }, []);

  const handleVenueClick = (venue: Venue) => {
    setMapCenter({ lat: venue.lat, lng: venue.lng });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredVenues = venues
    .filter(
      (v) =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.address.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!userLocation) return 0;
      return (
        calculateDistance(userLocation.lat, userLocation.lng, a.lat, a.lng) -
        calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng)
      );
    });

  return (
    <div className="bg-white min-h-screen flex flex-col animate-in slide-in-from-right duration-300">
      {/* HEADER */}
      <div className="bg-white px-4 py-4 flex items-center justify-between border-b sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-1 hover:bg-slate-100 rounded-full">
            <ChevronLeft size={28} />
          </button>
          <h1 className="text-xl font-medium text-slate-800">Event Venues</h1>
        </div>
        <ListFilter size={24} />
      </div>

      {/* SEARCH */}
      <div className="px-4 py-3">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input
            type="text"
            placeholder="Search venues"
            className="w-full bg-slate-50 rounded-lg py-2.5 pl-11 pr-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* ✅ REAL GOOGLE MAP (SINGLE, CLEAN) */}
      <div className="w-full h-72 relative border-b">
        <iframe
          title="Google Maps"
          src={`https://www.google.com/maps?q=${mapCenter.lat},${mapCenter.lng}&z=16&output=embed`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
        />

        {/* Locate button */}
        <button
          onClick={handleLocateUser}
          className={`absolute bottom-5 right-5 p-3 bg-white rounded-full shadow-xl border ${
            isLocating ? "animate-pulse text-indigo-600" : ""
          }`}
        >
          <LocateFixed size={26} />
        </button>
      </div>

      {/* VENUE LIST */}
      <div className="flex-1 bg-white">
        {filteredVenues.map((venue) => {
          const distance =
            userLocation &&
            calculateDistance(userLocation.lat, userLocation.lng, venue.lat, venue.lng);

          return (
            <div
              key={venue.id}
              onClick={() => handleVenueClick(venue)}
              className="border-b px-4 py-5 flex gap-4 hover:bg-slate-50 cursor-pointer"
            >
              <Heart size={26} className="text-slate-400 hover:text-red-500" />

              <div className="flex-1">
                <h3 className="text-lg font-medium text-slate-900">
                  {venue.name}: {venue.city}
                </h3>
                <p className="text-sm text-slate-400">{venue.address}</p>
                <div className="mt-3">
                  <span className="bg-slate-100 px-3 py-1 rounded text-xs font-bold">
                    {distance ? `${distance.toFixed(1)} KM` : "... KM"}
                  </span>
                </div>
              </div>

              <ChevronRight size={28} className="text-slate-300" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VenuesView;
