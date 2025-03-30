
import React from 'react';
import { RubricType } from '@/types';
import { useStore } from '@/store';

// Define a fixed set of colors to cycle through
const colorClasses = [
  "bg-red-500",
  "bg-orange-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-yellow-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-cyan-500"
];

// Helper to get a color based on the rubric name
export const getRubricColor = (rubric: string, index: number): string => {
  // Use index to get a color from our palette, or fall back to a hash-based color
  return colorClasses[index % colorClasses.length];
};

// Export rubric colors for use in other components
export const getRubricColors = (rubrics: RubricType[]): Record<string, string> => {
  return rubrics.reduce((acc, rubric, index) => {
    acc[rubric] = getRubricColor(rubric, index);
    return acc;
  }, {} as Record<string, string>);
};

const RubricLegend = () => {
  const { rubrics } = useStore();
  const rubricColors = getRubricColors(rubrics);

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {rubrics.map((rubric, index) => (
        <div key={rubric} className="flex items-center">
          <span className={`inline-block w-3 h-3 rounded-full mr-1 ${rubricColors[rubric]}`}></span>
          <span className="text-sm">{rubric}</span>
        </div>
      ))}
    </div>
  );
};

export default RubricLegend;
