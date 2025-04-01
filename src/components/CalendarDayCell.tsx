
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

  // For better spacing when there are multiple duties
  const shouldScroll = duties.length > 2;

  return (
    <div 
      className={cn(
        "calendar-day border p-1 transition-colors min-h-[80px]",
        isToday ? "bg-calendar-today" : "",
        isCurrentMonth ? "" : "text-gray-400 bg-gray-50",
      )}
    >
      <div className="text-xs font-semibold mb-1">
        {format(date, 'd')}
      </div>
      
      <div className={cn(
        "space-y-1", 
        shouldScroll ? "max-h-[50px] overflow-y-auto scrollbar-thin" : ""
      )}>
        {duties.map((duty) => (
          <div 
            key={duty.id}
            className={cn(
              "text-xs p-1 rounded-sm",
              rubricColors[duty.type]
            )}
          >
            <div className="text-white truncate text-[10px]">
              {duty.type}
            </div>
            <div className="text-white truncate text-[10px] font-medium">
              {duty.user.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarDayCell;
