
import { createEvents } from 'ics';
import { format, parse } from 'date-fns';
import { DutyWithUser } from '@/types';

/**
 * Generate an iCalendar (.ics) file for a duty assignment and trigger download
 */
export const generateCalendarInvite = (duty: DutyWithUser): void => {
  // Parse the date string to a Date object
  const dutyDate = parse(duty.date, 'yyyy-MM-dd', new Date());
  
  // Create an end date (24 hours later)
  const endDate = new Date(dutyDate);
  endDate.setDate(endDate.getDate() + 1);
  
  // Format dates for iCalendar format [year, month, day, hour, minute]
  const start = [
    dutyDate.getFullYear(),
    dutyDate.getMonth() + 1, // Months are 0-indexed in JS
    dutyDate.getDate(),
    0, 0 // Start at midnight
  ];
  
  const end = [
    endDate.getFullYear(),
    endDate.getMonth() + 1,
    endDate.getDate(),
    0, 0 // End at midnight
  ];

  // Create the event
  createEvents([
    {
      start,
      end,
      title: `${duty.type} Duty`,
      description: `${duty.user.name} is on ${duty.type} duty`,
      organizer: { name: 'Duty Calendar', email: 'duty@example.com' },
      attendees: [
        {
          name: duty.user.name,
          email: duty.user.email,
          rsvp: true,
          partstat: 'ACCEPTED',
          role: 'REQ-PARTICIPANT'
        }
      ],
      status: 'CONFIRMED',
      busyStatus: 'BUSY',
      categories: ['Duty Calendar'],
      alarms: [
        {
          action: 'display',
          description: `${duty.type} Duty Reminder`,
          trigger: { hours: 24, before: true }
        }
      ]
    }
  ], (error, value) => {
    if (error) {
      console.error(error);
      return;
    }
    
    // Create and download the .ics file
    const blob = new Blob([value as string], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${duty.type}_${duty.date}_${duty.user.name.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
};
