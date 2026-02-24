import { useState, FormEvent } from 'react';
import { ArrowLeft, Search, PlaneTakeoff, PlaneLanding, Calendar, Loader2, Plane, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function ManualSearchScreen() {
  const navigate = useNavigate();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState<any[] | null>(null);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!from || !to || !date) return;

    setLoading(true);
    setFlights(null);
    try {
      const { getFlights } = await import('../lib/gemini');
      const data = await getFlights(from, to, date);
      
      // 🛡️ SMART MAPPING: Handle arrays wrapped inside an object
      const flightsArray = Array.isArray(data) ? data : (data?.flights || []);
      setFlights(flightsArray);
    } catch (error) {
      console.error("Failed to fetch flights", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#1E293B] text-white overflow-hidden">
      <div className="px-6 py-6 flex items-center gap-4 bg-[#1E293B] z-10 sticky top-0">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-800 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Flight Search</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 backdrop-blur-sm mb-8"
        >
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <label className="text-xs text-slate-400 ml-4 mb-1 block">From</label>
                <div className="relative">
                  <PlaneTakeoff className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors" size={20} />
                  <input
                    type="text"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="Origin City"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="relative group">
                <label className="text-xs text-slate-400 ml-4 mb-1 block">To</label>
                <div className="relative">
                  <PlaneLanding className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors" size={20} />
                  <input
                    type="text"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="Destination City"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="relative group">
                <label className="text-xs text-slate-400 ml-4 mb-1 block">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors" size={20} />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all [color-scheme:dark]"
                    required
                  />
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-400 hover:bg-cyan-500 text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-400/20 transition-all disabled:opacity-70"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
              {loading ? 'Searching...' : 'Search Flights'}
            </motion.button>
          </form>
        </motion.div>

        <AnimatePresence>
          {flights && flights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-bold mb-4">Available Flights</h2>
              {flights.map((flight: any, index: number) => {
                 // Normalize price
                 const price = flight?.price || flight?.price_inr || 0;
                 return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-800 p-4 rounded-2xl border border-slate-700/50 flex flex-col gap-4"
                  >
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
                      <span className="text-xl font-bold">₹{price.toLocaleString()}</span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {flights && flights.length === 0 && !loading && (
           <div className="mt-8 text-center">
             <p className="text-slate-500 text-sm">No flights found for this route. Try a different date.</p>
           </div>
        )}
        
        {!flights && !loading && (
          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">Find the best deals for your journey ✈️</p>
          </div>
        )}
      </div>
    </div>
  );
}