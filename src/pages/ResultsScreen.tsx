import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Plane, Bed, MapPin, Cloud, AlertTriangle, ArrowLeft, Star, Clock, AlertCircle, Phone, Shield, Plus } from 'lucide-react';
import clsx from 'clsx';
import { TripData } from '../lib/gemini';

export default function ResultsScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  // Using 'any' here temporarily because the AI broke our strict TripData interface
  const { data, destination } = location.state as { data: any; destination: string } || {};
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels' | 'places' | 'weather' | 'emergency'>('flights');

  console.log("AI Returned This Data: ", data);

  useEffect(() => {
    if (!data) {
      navigate('/home');
    }
  }, [data, navigate]);

  if (!data) return null;

  // --- SMART MAPPING: Extract data using either the strict schema OR the AI's custom keys ---
  const flightsList = data?.flights || [];
  const hotelsList = data?.hotels || [];
  const placesList = data?.places || data?.places_to_visit || [];
  const weatherData = data?.weather || data?.current_typical_weather_forecast || {};
  const emergencyData = data?.emergency || data?.emergency_info || {};
  
  // Handle the obstruction whether the AI returned an object or a flat string
  let hasIssue = false;
  let issueMessage = "";
  const obsData = data?.obstruction || data?.travel_obstruction;
  if (typeof obsData === 'string') {
     hasIssue = !obsData.toLowerCase().includes('no currently') && !obsData.toLowerCase().includes('no major');
     issueMessage = obsData;
  } else {
     hasIssue = obsData?.hasObstruction || false;
     issueMessage = obsData?.message || "";
  }

  const tabs = [
    { id: 'flights', label: 'Flights', icon: Plane },
    { id: 'hotels', label: 'Hotels', icon: Bed },
    { id: 'places', label: 'Places', icon: MapPin },
    { id: 'weather', label: 'Weather', icon: Cloud },
    { id: 'emergency', label: 'Emergency', icon: AlertTriangle },
  ] as const;

  return (
    <div className="flex flex-col h-full bg-[#1E293B] text-white pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center gap-4 bg-[#1E293B] z-10 sticky top-0">
        <button onClick={() => navigate('/home')} className="p-2 -ml-2 rounded-full hover:bg-slate-800 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold">Trip to {destination}</h1>
          <p className="text-slate-400 text-xs">Generated Itinerary</p>
        </div>
      </div>

      {/* Obstruction Alert */}
      {hasIssue && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-6 mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3"
        >
          <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-bold text-red-400 text-sm mb-1">Travel Alert</h3>
            <p className="text-red-200 text-xs leading-relaxed">{issueMessage}</p>
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="px-6 mb-6 overflow-x-auto hide-scrollbar flex gap-6 border-b border-slate-700/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              "pb-3 text-sm font-medium whitespace-nowrap relative transition-colors",
              activeTab === tab.id ? "text-white" : "text-slate-400 hover:text-slate-200"
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-6 flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* FLIGHTS */}
            {activeTab === 'flights' && (
              <div className="space-y-4">
                {flightsList.length > 0 ? (
                  flightsList.map((flight: any, index: number) => (
                    <div key={index} className="bg-slate-800 p-4 rounded-2xl border border-slate-700/50 flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                            <Plane size={20} className="text-cyan-400" />
                          </div>
                          <div>
                            <h3 className="font-bold">{flight?.airline || "Unknown Airline"}</h3>
                            <p className="text-slate-400 text-xs">{flight?.flightNumber || flight?.flight_number || "N/A"}</p>
                          </div>
                        </div>
                        <span className="bg-slate-700/50 text-cyan-400 text-xs font-medium px-2 py-1 rounded-md max-w-[100px] text-center truncate">
                          {flight?.type || "Standard"}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2 border-t border-slate-700/50">
                        <div className="flex items-center gap-2 text-slate-300 text-sm">
                          <Clock size={16} />
                          <span>{flight?.duration || "--"}</span>
                        </div>
                        <span className="text-xl font-bold">₹{(flight?.price || flight?.price_inr)?.toLocaleString() || "N/A"}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-center py-8">No flight information available.</p>
                )}
              </div>
            )}

            {/* HOTELS */}
            {activeTab === 'hotels' && (
              <div className="space-y-4">
                {hotelsList.length > 0 ? (
                  hotelsList.map((hotel: any, index: number) => {
                    // The AI returned amenities as a single comma-separated string instead of an array! We fix it here:
                    const amenitiesArray = Array.isArray(hotel?.amenities) 
                      ? hotel.amenities 
                      : (typeof hotel?.amenities === 'string' ? hotel.amenities.split(',') : []);

                    return (
                      <div key={index} className="bg-slate-800 p-4 rounded-2xl border border-slate-700/50">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg">{hotel?.name || "Hotel Option"}</h3>
                          <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-md">
                            <Star size={14} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-yellow-400 text-xs font-bold">{hotel?.rating || "N/A"}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {amenitiesArray.slice(0, 3).map((amenity: string, i: number) => (
                            <span key={i} className="text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded-md">
                              {amenity.trim()}
                            </span>
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-slate-700/50">
                          <span className="text-slate-400 text-xs">per night</span>
                          <span className="text-xl font-bold">₹{(hotel?.pricePerNight || hotel?.price_per_night_inr)?.toLocaleString() || "N/A"}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                   <p className="text-slate-400 text-center py-8">No hotel information available.</p>
                )}
              </div>
            )}

            {/* PLACES */}
            {activeTab === 'places' && (
              <div className="space-y-4">
                {placesList.length > 0 ? (
                  placesList.map((place: any, index: number) => (
                    <div key={index} className="bg-slate-800 p-4 rounded-2xl border border-slate-700/50 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4">
                        <div className="w-8 h-8 bg-cyan-400/10 rounded-full flex items-center justify-center">
                          <MapPin size={16} className="text-cyan-400" />
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-lg mb-1 pr-10">{place?.name || "Location"}</h3>
                      <div className="flex items-center gap-1 mb-3">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-slate-300 text-xs">{place?.rating || "N/A"} / 5</span>
                      </div>
                      
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {place?.description || "No description available."}
                      </p>
                    </div>
                  ))
                ) : (
                   <p className="text-slate-400 text-center py-8">No places information available.</p>
                )}
              </div>
            )}

            {/* WEATHER */}
            {activeTab === 'weather' && (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                <div className="w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center relative">
                  <Cloud size={64} className="text-cyan-400" />
                  <div className="absolute top-0 right-0 w-10 h-10 bg-yellow-400 rounded-full blur-xl opacity-20" />
                </div>
                
                <div>
                  <h2 className="text-4xl font-bold mb-2">{weatherData?.temperature || "--°C"}</h2>
                  <p className="text-xl text-cyan-400 font-medium">{weatherData?.condition || weatherData?.conditions || "Unknown"}</p>
                  <p className="text-slate-400 mt-2 max-w-xs mx-auto">{weatherData?.summary || weatherData?.wind || "Weather data unavailable"}</p>
                </div>
              </div>
            )}

            {/* EMERGENCY */}
            {activeTab === 'emergency' && (
              <div className="space-y-4">
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700/50 flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center shrink-0">
                    <Plus size={24} className="text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Nearest Hospital</h3>
                    <p className="text-slate-400 text-sm">{emergencyData?.hospital || emergencyData?.major_hospital || "Information unavailable"}</p>
                  </div>
                </div>

                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700/50 flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
                    <Shield size={24} className="text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Police Station</h3>
                    <p className="text-slate-400 text-sm">{emergencyData?.police || emergencyData?.police_station || "Information unavailable"}</p>
                  </div>
                </div>

                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700/50 flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center shrink-0">
                    <Phone size={24} className="text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Emergency Helpline</h3>
                    {/* Maps AI's nested helplines object if the normal string isn't there */}
                    <p className="text-slate-400 text-sm">{emergencyData?.helpline || emergencyData?.helplines?.general_european_emergency || emergencyData?.helplines?.police || "112"}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}