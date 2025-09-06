import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { TripProvider } from '../context/TripContext';
import ModernTripManager from '../components/ModernTripManager';
import TripDashboard from '../components/TripDashboard';

const TripsPage = () => {
  const location = useLocation();
  const [initialView, setInitialView] = useState('dashboard');
  const [initialFilter, setInitialFilter] = useState('all');
  const [useModernUI, setUseModernUI] = useState(true); // Toggle for modern vs classic UI

  useEffect(() => {
    // Determine initial view based on route
    if (location.pathname.includes('/create')) {
      setInitialView('create');
    } else if (location.pathname.includes('/upcoming')) {
      setInitialView('trips');
      setInitialFilter('upcoming');
    } else if (location.pathname.includes('/ongoing')) {
      setInitialView('trips');
      setInitialFilter('ongoing');
    } else if (location.pathname.includes('/completed')) {
      setInitialView('trips');
      setInitialFilter('completed');
    } else if (location.pathname.includes('/dashboard')) {
      setInitialView('dashboard');
      setInitialFilter('all');
    } else {
      setInitialView('dashboard');
      setInitialFilter('all');
    }
  }, [location.pathname]);

  return (
    <TripProvider>
      <div className="h-full">
        {useModernUI ? (
          <TripDashboard />
        ) : (
          <ModernTripManager 
            initialView={initialView} 
            initialFilter={initialFilter}
          />
        )}
      </div>
    </TripProvider>
  );
};

export default TripsPage;
