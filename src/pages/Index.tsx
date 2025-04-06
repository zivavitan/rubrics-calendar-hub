
import React, { useEffect } from 'react';
import Calendar from '@/components/Calendar';
import CalendarControls from '@/components/CalendarControls';
import RubricLegend from '@/components/RubricLegend';
import Header from '@/components/Header';
import { useStore } from '@/store';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { 
    isAuthenticated, 
    fetchDuties, 
    fetchUsers, 
    fetchRubrics,
    isLoading
  } = useStore();

  // Fetch data when component mounts
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchDuties(),
        fetchUsers(),
        fetchRubrics()
      ]);
    };
    
    loadData();
  }, [fetchDuties, fetchUsers, fetchRubrics]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="container py-6 flex-1">
        <div className="max-w-5xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading calendar data...</span>
            </div>
          ) : (
            <>
              <CalendarControls />
              <RubricLegend />
              <Calendar />
            </>
          )}
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
