import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function LoginScreen() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (phone.length > 0) {
      navigate('/home');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#1E293B] px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex flex-col justify-center"
      >
        <h1 className="text-4xl font-bold mb-2 text-white">Welcome to <span className="text-cyan-400">TRAVIO</span> ✈️</h1>
        <p className="text-slate-400 mb-10">Your journey begins with a single tap.</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-slate-300 ml-1">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter Phone Number"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-cyan-400 hover:bg-cyan-500 text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            Continue
            <ArrowRight size={20} />
          </motion.button>
        </form>
      </motion.div>
      
      <p className="text-center text-slate-500 text-xs mt-auto">
        By continuing, you agree to our Terms & Privacy Policy.
      </p>
    </div>
  );
}
