
import React from 'react';
import Calendar from '@/components/Calendar';
import CalendarControls from '@/components/CalendarControls';
import RubricLegend from '@/components/RubricLegend';
import Header from '@/components/Header';
import { useStore } from '@/store';

const Index = () => {
  const { isAuthenticated } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="container py-6 flex-1">
        <div className="max-w-5xl mx-auto">
          <CalendarControls />
          <RubricLegend />
          <Calendar />
        </div>
      </main>
      
      <footer className="bg-white border-t py-4">
        <div className="container text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} EMET DORCOM Duty Calendar - All rights reserved
        </div>
      </footer>
    </div>
  );
};

export default Index;
