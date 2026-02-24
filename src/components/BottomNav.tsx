import { Home, Plane, Bed, Compass, AlertTriangle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Plane, label: 'Flights', path: '/manual-search' },
    { icon: Bed, label: 'Hotels', path: '/hotels' },
    { icon: Compass, label: 'Places', path: '/places' },
    { icon: AlertTriangle, label: 'Emergency', path: '/emergency' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1E293B] border-t border-slate-700 px-6 py-4 flex justify-between items-center z-50">
      {navItems.map((item, index) => {
        const isActive = location.pathname === item.path;
        return (
          <Link key={index} to={item.path} className="flex flex-col items-center gap-1">
            <item.icon 
              size={24} 
              className={clsx(
                "transition-colors duration-200",
                isActive ? "text-cyan-400" : "text-slate-400"
              )} 
            />
          </Link>
        );
      })}
    </div>
  );
}
