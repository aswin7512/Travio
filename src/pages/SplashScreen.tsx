import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plane } from 'lucide-react';

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#1E293B] text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center"
      >
        <div className="relative mb-6">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1, type: "spring" }}
          >
            <Plane size={64} className="text-cyan-400 transform -rotate-45" />
          </motion.div>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 100 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="h-1 bg-cyan-400 mt-2 rounded-full"
          />
        </div>
        
        <h1 className="text-5xl font-bold tracking-wider mb-2">TRAVIO</h1>
        <p className="text-slate-400 text-sm tracking-widest uppercase">Plan smarter. Travel better.</p>
      </motion.div>
    </div>
  );
}
