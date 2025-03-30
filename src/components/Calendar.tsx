
import React from 'react';
import { 
  addDays, 
  endOfMonth, 
  endOfWeek, 
  format, 
  isSameDay, 
  isSameMonth, 
  isToday, 
  startOfMonth, 
  startOfWeek 
} from 'date-fns';
import { useStore } from '../store';
import { cn } from '@/lib/utils';
import CalendarDayCell from './CalendarDayCell';

const Calendar = () => {
  const { currentDate } = useStore();
  
  // Generate the days of the month to display
  const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    const rows = [];
    let days = [];
    let day = startDate;
    
    // Create day cells for the calendar
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const dateString = format(day, 'yyyy-MM-dd');
        const isCurrentMonth = isSameMonth(day, monthStart);
        
        days.push(
          <CalendarDayCell 
            key={dateString}
            date={day}
            isToday={isToday(day)}
            isCurrentMonth={isCurrentMonth}
          />
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toISOString()} className="calendar-grid">
          {days}
        </div>
      );
      days = [];
    }
    return rows;
  };

  // Day labels for the calendar header
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
    <div key={day} className="p-2 text-center text-sm font-medium">
      {day}
    </div>
  ));

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-center">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
      </div>
      
      <div className="calendar-grid mb-2">
        {dayLabels}
      </div>
      
      {generateCalendarDays()}
    </div>
  );
};

export default Calendar;
