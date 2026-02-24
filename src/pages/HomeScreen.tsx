import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, Calendar, DollarSign, Search } from 'lucide-react';

export default function HomeScreen() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState('');

  const handlePlanTrip = (e: FormEvent) => {
    e.preventDefault();
    if (destination && budget) {
      navigate('/loading', { state: { destination, budget } });
    }
  };

  const popularDestinations = [
    { name: 'Paris', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80' },
    { name: 'Dubai', image: 'https://images.unsplash.com/photo-1512453979798-5ea932a23644?auto=format&fit=crop&w=800&q=80' },
    { name: 'Tokyo', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80' },
    { name: 'New York', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#1E293B] pb-20">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-2xl font-bold text-white">Where to next? 🌍</h1>
        <p className="text-slate-400 text-sm">Discover your next adventure</p>
      </div>

      {/* Carousel */}
      <div className="pl-6 pb-8 overflow-x-auto hide-scrollbar flex gap-4 snap-x snap-mandatory">
        {popularDestinations.map((dest, index) => (
          <motion.div
            key={index}
            whileTap={{ scale: 0.95 }}
            className="snap-center shrink-0 w-64 h-40 rounded-2xl overflow-hidden relative cursor-pointer shadow-lg"
            onClick={() => setDestination(dest.name)}
          >
            <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
              <span className="text-white font-bold text-lg">{dest.name}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Form */}
      <div className="px-6 flex-1 flex flex-col">
        <form onSubmit={handlePlanTrip} className="space-y-6 bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 backdrop-blur-sm">
          <div className="space-y-4">
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors" size={20} />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter Destination"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                required
              />
            </div>

            <div className="relative group">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors" size={20} />
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Enter Budget (INR)"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                required
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-cyan-400 hover:bg-cyan-500 text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-400/20 transition-all"
          >
            <Search size={20} />
            Plan My Trip
          </motion.button>
        </form>
        
        <div className="mt-auto pt-8 pb-4 text-center">
          <p className="text-slate-500 text-sm">Your journey begins here 🌍</p>
        </div>
      </div>
    </div>
  );
}
