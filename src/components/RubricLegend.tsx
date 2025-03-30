
import React from 'react';
import { RubricType } from '@/types';

// Define rubric colors (same as in CalendarDayCell)
const rubricColors: Record<RubricType, string> = {
  "Primary On-Call": "bg-red-500",
  "Secondary On-Call": "bg-orange-500",
  "Operations": "bg-blue-500",
  "Support": "bg-green-500",
  "Maintenance": "bg-purple-500"
};

const RubricLegend = () => {
  const rubrics: RubricType[] = [
    "Primary On-Call",
    "Secondary On-Call",
    "Operations",
    "Support",
    "Maintenance"
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {rubrics.map(rubric => (
        <div key={rubric} className="flex items-center">
          <span className={`inline-block w-3 h-3 rounded-full mr-1 ${rubricColors[rubric]}`}></span>
          <span className="text-sm">{rubric}</span>
        </div>
      ))}
    </div>
  );
};

export default RubricLegend;
