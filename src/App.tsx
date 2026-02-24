import { useRoutes, useLocation, HashRouter as Router } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { cloneElement } from 'react';
import SplashScreen from './pages/SplashScreen';
import LoginScreen from './pages/LoginScreen';
import HomeScreen from './pages/HomeScreen';
import LoadingScreen from './pages/LoadingScreen';
import ResultsScreen from './pages/ResultsScreen';
import ManualSearchScreen from './pages/ManualSearchScreen';
import HotelsScreen from './pages/HotelsScreen';
import PlacesScreen from './pages/PlacesScreen';
import EmergencyScreen from './pages/EmergencyScreen';
import BottomNav from './components/BottomNav';

function AnimatedRoutes() {
  const location = useLocation();
  
  const element = useRoutes([
    { path: '/', element: <SplashScreen /> },
    { path: '/login', element: <LoginScreen /> },
    { path: '/home', element: <HomeScreen /> },
    { path: '/loading', element: <LoadingScreen /> },
    { path: '/results', element: <ResultsScreen /> },
    { path: '/manual-search', element: <ManualSearchScreen /> },
    { path: '/hotels', element: <HotelsScreen /> },
    { path: '/places', element: <PlacesScreen /> },
    { path: '/emergency', element: <EmergencyScreen /> },
  ]);

  // Hide bottom nav on Splash, Login, and Loading screens
  const hideNav = ['/', '/login', '/loading'].includes(location.pathname);

  if (!element) return null;

  return (
    <div className="min-h-screen bg-[#1E293B] text-white font-sans relative overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto pb-20">
        <AnimatePresence mode="wait">
          {cloneElement(element, { key: location.pathname })}
        </AnimatePresence>
      </div>
      {!hideNav && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}
