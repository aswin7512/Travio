import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { generateTripPlan, TripData } from '../lib/gemini';

export default function LoadingScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { destination, budget } = location.state || { destination: 'Paris', budget: '100000' };
  const [loadingText, setLoadingText] = useState('Analyzing destination...');

  useEffect(() => {
    const messages = [
      "Analyzing destination...",
      "Optimizing budget...",
      "Finding best flights...",
      "Searching hotels...",
      "Generating itinerary..."
    ];
    let msgIndex = 0;

    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % messages.length;
      setLoadingText(messages[msgIndex]);
    }, 1500);

    const fetchData = async () => {
      try {
        const data: TripData = await generateTripPlan(destination, budget);
        // Add a small delay to ensure the user sees the loading animation
        setTimeout(() => {
            navigate('/results', { state: { data, destination, budget } });
        }, 1000);
      } catch (error) {
        console.error("Failed to fetch trip plan:", error);
        // Handle error (maybe navigate back or show error)
        alert("Failed to generate plan. Please try again.");
        navigate('/home');
      }
    };

    fetchData();

    return () => clearInterval(interval);
  }, [destination, budget, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#1E293B] text-white">
      <div className="relative w-24 h-24 mb-8">
        <motion.div
          className="absolute inset-0 border-4 border-slate-700 rounded-full"
        />
        <motion.div
          className="absolute inset-0 border-4 border-cyan-400 rounded-full border-t-transparent border-l-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      <motion.p
        key={loadingText}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-cyan-400 font-medium text-lg tracking-wide"
      >
        {loadingText}
      </motion.p>
    </div>
  );
}
