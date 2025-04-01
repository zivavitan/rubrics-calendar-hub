
import React from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useStore } from '../store';
import { RubricType } from '@/types';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';

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

  // Group duties by type for compact display
  const dutyGroups = duties.reduce((acc, duty) => {
    if (!acc[duty.type]) {
      acc[duty.type] = [];
    }
    acc[duty.type].push(duty);
    return acc;
  }, {} as Record<string, typeof duties>);

  return (
    <div 
      className={cn(
        "calendar-day border p-1 transition-colors min-h-[100px]",
        isToday ? "bg-calendar-today" : "",
        isCurrentMonth ? "" : "text-gray-400 bg-gray-50",
      )}
    >
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-semibold">
          {format(date, 'd')}
        </span>
        
        {/* Badge showing duty count if > 0 */}
        {duties.length > 0 && (
          <Badge variant="outline" className="text-[9px] h-4 px-1">
            {duties.length}
          </Badge>
        )}
      </div>
      
      {duties.length > 0 ? (
        <ScrollArea className="h-[70px]">
          <div className="space-y-1">
            {Object.entries(dutyGroups).map(([type, typeDuties]) => (
              <div key={type} className={cn("rounded-sm p-1", rubricColors[type as RubricType])}>
                <div className="text-white text-[10px] font-medium">
                  {type} ({typeDuties.length})
                </div>
                <div className="mt-0.5 space-y-0.5">
                  {typeDuties.map(duty => (
                    <div key={duty.id} className="text-white text-[9px] pl-1 truncate">
                      {duty.user.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : null}
    </div>
  );
};

export default CalendarDayCell;
