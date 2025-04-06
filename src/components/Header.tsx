
import React from 'react';
import { Button } from '@/components/ui/button';
import { useStore } from '../store';
import { CalendarCheck, LogOut, User, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const { logout, currentUser, viewMode, setViewMode, isAuthenticated } = useStore();

  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center space-x-4">
          <img 
            src="/lovable-uploads/2a839139-d303-4b85-b761-404de362fb3d.png" 
            alt="EMET DORCOM Logo" 
            className="h-8"
          />
          <div className="flex items-center space-x-2">
            <CalendarCheck className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Duty Calendar</h1>
          </div>
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
            
            {isAuthenticated && currentUser?.role === 'admin' ? (
              <Button
                variant={viewMode === 'admin' ? 'default' : 'ghost'}
                onClick={() => setViewMode('admin')}
                asChild
              >
                <Link to="/admin">Admin Panel</Link>
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={() => setViewMode('admin')}
                asChild
              >
                <Link to="/admin">Admin Panel</Link>
              </Button>
            )}
          </nav>
          
          {/* User Info & Login/Logout */}
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex items-center space-x-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{currentUser?.name ?? 'Guest'}</span>
                </div>
                
                <Button variant="outline" size="icon" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                className="flex items-center gap-1"
              >
                <Link to="/admin">
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
