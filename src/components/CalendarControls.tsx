
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../store';

const CalendarControls = () => {
  const { currentDate, goToPreviousMonth, goToNextMonth, setCurrentDate } = useStore();

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex space-x-1">
        <Button variant="outline" size="sm" onClick={handleToday}>
          Today
        </Button>
        <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={goToNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <h2 className="text-xl font-bold">
        {format(currentDate, 'MMMM yyyy')}
      </h2>
      
      <div className="invisible">
        {/* Spacer to balance the flex items */}
        <Button variant="outline" size="sm">
          Spacer
        </Button>
      </div>
    </div>
  );
};

export default CalendarControls;
