import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  MapPin,
  User,
  Settings,
  LogOut,
  Calendar,
  BarChart3,
  CreditCard,
  Bell,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [expandedSections, setExpandedSections] = useState({});
  const [navigationItems, setNavigationItems] = useState([]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Generate dynamic navigation based on user permissions and features
  useEffect(() => {
    const dynamicNavigation = generateNavigationItems();
    const dynamicBottomItems = generateBottomItems();
    setNavigationItems(dynamicNavigation);
    setBottomItems(dynamicBottomItems);
  }, [user, location.pathname]);

  // Helper state for bottom items
  const [bottomItems, setBottomItems] = useState([]);

  // Generate navigation items based on user role, permissions, and available features
  const generateNavigationItems = () => {
    const baseItems = [
      {
        id: 'overview',
        title: 'Overview',
        icon: Home,
        path: '/dashboard',
        active: location.pathname === '/dashboard',
        visible: true
      }
    ];

    // Trip management - always available for authenticated users
    const tripManagement = {
      id: 'trips',
      title: 'Trip Management',
      icon: MapPin,
      path: '/dashboard/trips',
      active: location.pathname.startsWith('/dashboard/trips'),
      visible: !!user,
      children: getTripSubNavigation()
    };

    // Dynamic feature-based navigation
    const featureItems = [];

    // Expenses - show if user has trips or is premium
    if (user && (hasUserTrips() || isPremiumUser())) {
      featureItems.push({
        id: 'expenses',
        title: 'Expenses',
        icon: CreditCard,
        path: '/dashboard/expenses',
        active: location.pathname.startsWith('/dashboard/expenses'),
        badge: hasUserTrips() ? null : 'Coming Soon',
        disabled: !hasUserTrips(),
        visible: true
      });
    }

    // Analytics - show for users with multiple trips
    if (user && getUserTripCount() > 1) {
      featureItems.push({
        id: 'analytics',
        title: 'Analytics',
        icon: BarChart3,
        path: '/dashboard/analytics',
        active: location.pathname.startsWith('/dashboard/analytics'),
        badge: getUserTripCount() > 5 ? 'Premium' : 'New',
        disabled: false,
        visible: true
      });
    } else if (user) {
      // Show disabled analytics for users with few trips
      featureItems.push({
        id: 'analytics',
        title: 'Analytics',
        icon: BarChart3,
        path: '/dashboard/analytics',
        active: location.pathname.startsWith('/dashboard/analytics'),
        badge: 'Coming Soon',
        disabled: true,
        visible: true
      });
    }

    // Filter by visibility
    return [...baseItems, tripManagement, ...featureItems]
      .filter(item => item.visible);
  };

  // Generate bottom navigation items
  const generateBottomItems = () => {
    const items = [];

    // Notifications - show if user has them enabled
    if (user && hasNotificationsEnabled()) {
      items.push({
        id: 'notifications',
        title: 'Notifications',
        icon: Bell,
        path: '/dashboard/notifications',
        active: location.pathname === '/dashboard/notifications',
        badge: getNotificationCount()
      });
    }

    // Profile - always show for authenticated users
    if (user) {
      items.push({
        id: 'profile',
        title: 'Profile',
        icon: User,
        path: '/dashboard/profile',
        active: location.pathname === '/dashboard/profile'
      });
    }

    return items;
  };

  // Dynamic trip sub-navigation based on user's trip data
  const getTripSubNavigation = () => {
    const subItems = [];
    
    if (hasUpcomingTrips()) {
      subItems.push({ id: 'upcoming', title: 'Upcoming Trips', path: '/dashboard/trips/upcoming' });
    }
    
    if (hasOngoingTrips()) {
      subItems.push({ id: 'ongoing', title: 'Ongoing Trips', path: '/dashboard/trips/ongoing' });
    }
    
    if (hasCompletedTrips()) {
      subItems.push({ id: 'completed', title: 'Completed Trips', path: '/dashboard/trips/completed' });
    }

    // Always show create option
    subItems.push({ id: 'create-trip', title: 'Create New Trip', path: '/dashboard/trips/create' });

    return subItems;
  };

  // Helper functions to determine user capabilities dynamically
  const hasUserTrips = () => {
    return user?.tripCount > 0 || false;
  };

  const isPremiumUser = () => {
    return user?.subscription === 'premium' || user?.role === 'premium';
  };

  const getUserTripCount = () => {
    return user?.tripCount || 0;
  };

  const hasNotificationsEnabled = () => {
    return user?.preferences?.notifications !== false;
  };

  const getNotificationCount = () => {
    const count = user?.unreadNotifications || 0;
    return count > 0 ? count.toString() : null;
  };

  const hasUpcomingTrips = () => {
    return user?.upcomingTrips > 0 || false;
  };

  const hasOngoingTrips = () => {
    return user?.ongoingTrips > 0 || false;
  };

  const hasCompletedTrips = () => {
    return user?.completedTrips > 0 || false;
  };

  const handleNavigation = (item) => {
    if (item.disabled) return;
    
    if (item.expandable) {
      toggleSection(item.id);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const renderNavItem = (item, isChild = false) => {
    const isExpanded = expandedSections[item.id];
    const Icon = item.icon;
    
    return (
      <div key={item.id}>
        <button
          onClick={() => handleNavigation(item)}
          disabled={item.disabled}
          className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-all duration-200 ease-in-out group relative ${
            isChild ? 'ml-6 text-sm' : 'text-base'
          } ${
            item.active
              ? 'bg-blue-50 text-blue-700 shadow-sm border-l-4 border-blue-600 pl-2'
              : item.disabled
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm hover:scale-[1.02]'
          }`}
        >
          <Icon className={`flex-shrink-0 ${isChild ? 'h-4 w-4' : 'h-5 w-5'} mr-3`} />
          <span className="flex-1 truncate">{item.title}</span>
          
          {/* Badge */}
          {item.badge && (
            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
              item.badge === 'Coming Soon'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {item.badge}
            </span>
          )}
          
          {/* Expand/Collapse icon */}
          {item.expandable && (
            <span className="ml-2 transition-transform duration-200 ease-in-out">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 transform rotate-0" />
              ) : (
                <ChevronRight className="h-4 w-4 transform rotate-0" />
              )}
            </span>
          )}
        </button>
        
        {/* Expandable children */}
        {item.expandable && item.children && (
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="mt-1 space-y-1 pb-1">
              {item.children.map(child => renderNavItem({
                ...child,
                active: location.pathname === child.path,
                icon: () => <div className="h-2 w-2 bg-gray-400 rounded-full" />
              }, true))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Sidebar Content */}
      <div className="h-full bg-white shadow-xl flex flex-col">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Itinify</h1>
                <p className="text-xs text-gray-500">Travel Planner</p>
              </div>
            </div>
          </div>

          {/* User Profile Section */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <div className="space-y-1">
              {navigationItems.map(item => renderNavItem(item))}
            </div>
            
            {/* Divider */}
            <hr className="my-4 border-gray-200" />
            
            {/* Bottom Navigation */}
            <div className="space-y-1">
              {bottomItems.map(item => renderNavItem(item))}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 ease-in-out hover:shadow-sm hover:scale-[1.02] active:scale-95"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
