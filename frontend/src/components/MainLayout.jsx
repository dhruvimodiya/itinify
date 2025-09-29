import React from 'react';
import { Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Bell, Search, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';

const MainLayout = () => {
  const { user } = useAuth();

  return (
    <div className="h-screen bg-gray-50">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="flex-shrink-0 w-64">
          <div className="w-64 h-full">
            <Sidebar />
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Enhanced Header with Shadcn Components */}
          <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0 px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left section */}
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-travel-brown-800">
                  Welcome back, {user?.first_name || 'Traveler'}!
                </h1>
                <Badge variant="secondary" className="bg-travel-brown-100 text-travel-brown-800">
                  Premium Plan
                </Badge>
              </div>
              
              {/* Right section */}
              <div className="flex items-center space-x-4">
                {/* Search Button */}
                <Button variant="outline" size="sm" className="border-travel-brown-200 hover:bg-travel-brown-50">
                  <Search size={16} className="mr-2" />
                  Search
                </Button>
                
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative hover:bg-travel-brown-50">
                  <Bell size={20} />
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs">
                    3
                  </Badge>
                </Button>
                
                {/* User Avatar */}
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={user?.profile_picture} />
                    <AvatarFallback className="bg-travel-brown-600 text-white">
                      {user?.first_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="h-full">
            <Outlet />
          </div>
        </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
