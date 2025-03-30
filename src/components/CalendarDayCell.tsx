
import React from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useStore } from '../store';
import { RubricType } from '@/types';

interface CalendarDayCellProps {
  date: Date;
  isToday: boolean;
  isCurrentMonth: boolean;
}

// Define rubric colors
const rubricColors: Record<RubricType, string> = {
  "Primary On-Call": "bg-red-500",
  "Secondary On-Call": "bg-orange-500",
  "Operations": "bg-blue-500",
  "Support": "bg-green-500",
  "Maintenance": "bg-purple-500"
};

const CalendarDayCell: React.FC<CalendarDayCellProps> = ({ date, isToday, isCurrentMonth }) => {
  const { getDutiesForDate, viewMode } = useStore();
  const dateString = format(date, 'yyyy-MM-dd');
  const duties = getDutiesForDate(dateString);

  return (
    <div 
      className={cn(
        "calendar-day border p-1 transition-colors",
        isToday ? "bg-calendar-today" : "",
        isCurrentMonth ? "" : "text-gray-400 bg-gray-50",
      )}
    >
      <div className="text-xs font-semibold mb-1">
        {format(date, 'd')}
      </div>
      
      <div className="space-y-1">
        {duties.map((duty) => (
          <div 
            key={duty.id}
            className={cn(
              "rubric rounded-sm",
              rubricColors[duty.type]
            )}
          >
            <span className="text-white truncate">
              {duty.type}: {duty.user.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarDayCell;
