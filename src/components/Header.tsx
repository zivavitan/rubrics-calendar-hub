
import React from 'react';
import { Button } from '@/components/ui/button';
import { useStore } from '../store';
import { CalendarCheck, LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const { logout, currentUser, viewMode, setViewMode } = useStore();

  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center space-x-2">
          <CalendarCheck className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Duty Calendar</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Navigation */}
          <nav className="hidden md:flex space-x-1">
            <Button
              variant={viewMode === 'user' ? 'default' : 'ghost'}
              onClick={() => setViewMode('user')}
              asChild
            >
              <Link to="/">Calendar</Link>
            </Button>
            
            {currentUser?.role === 'admin' && (
              <Button
                variant={viewMode === 'admin' ? 'default' : 'ghost'}
                onClick={() => setViewMode('admin')}
                asChild
              >
                <Link to="/admin">Admin Panel</Link>
              </Button>
            )}
          </nav>
          
          {/* User Info & Logout */}
          <div className="flex items-center space-x-2">
            <div className="hidden md:flex items-center space-x-1">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{currentUser?.name ?? 'Guest'}</span>
            </div>
            
            <Button variant="outline" size="icon" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
