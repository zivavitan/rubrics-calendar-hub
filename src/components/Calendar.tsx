
import React, { useEffect } from 'react';
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
import { Calendar as CalendarIcon, User } from 'lucide-react';

const Calendar = () => {
  const { currentDate, getDutiesForDate } = useStore();
  
  // Get today's duties
  const todayString = format(new Date(), 'yyyy-MM-dd');
  const todayDuties = getDutiesForDate(todayString);
  
  // Log data to help diagnose issues
  useEffect(() => {
    console.log("Calendar component rendered", {
      currentDate,
      todayString,
      todayDuties
    });
  }, [currentDate, todayString, todayDuties]);
  
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
    <div className="space-y-4">
      {/* On Duty Today Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-2 mb-3">
          <CalendarIcon className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold">On Duty Today</h2>
        </div>
        
        {todayDuties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {todayDuties.map(duty => (
              <div 
                key={duty.id} 
                className="flex items-center gap-2 p-2 border rounded-md bg-muted/20"
              >
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">{duty.user.name}</div>
                  <div className="text-xs text-muted-foreground">{duty.type}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No engineers on duty today</p>
        )}
      </div>

      {/* Calendar Section */}
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
    </div>
  );
};

export default Calendar;
