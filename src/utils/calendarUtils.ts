
import { createEvents } from 'ics';
import { format, parse } from 'date-fns';
import { DutyWithUser } from '@/types';

/**
 * Generate an iCalendar (.ics) file for a duty assignment
 */
export const generateCalendarData = (duty: DutyWithUser): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Parse the date string to a Date object
    const dutyDate = parse(duty.date, 'yyyy-MM-dd', new Date());
    
    // Create an end date (24 hours later)
    const endDate = new Date(dutyDate);
    endDate.setDate(endDate.getDate() + 1);
    
    // Format dates for iCalendar format [year, month, day, hour, minute]
    const start: [number, number, number, number, number] = [
      dutyDate.getFullYear(),
      dutyDate.getMonth() + 1, // Months are 0-indexed in JS
      dutyDate.getDate(),
      0, 0 // Start at midnight
    ];
    
    const end: [number, number, number, number, number] = [
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
        reject(error);
        return;
      }
      resolve(value as string);
    });
  });
};

/**
 * Generate and download an iCalendar (.ics) file for a duty assignment
 */
export const downloadCalendarInvite = async (duty: DutyWithUser): Promise<void> => {
  try {
    const icsData = await generateCalendarData(duty);
    
    // Create and download the .ics file
    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${duty.type}_${duty.date}_${duty.user.name.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error generating calendar invitation:', error);
    throw error;
  }
};

/**
 * Send a calendar invitation via email
 */
export const sendCalendarInviteEmail = async (
  duty: DutyWithUser, 
  smtpConfig: {
    host: string;
    port: number;
    username: string;
    password: string;
    from: string;
  }
): Promise<boolean> => {
  try {
    // In a real app, you would use a server-side endpoint to send emails
    // We'll implement a mock function that simulates sending an email
    console.log('Sending calendar invite via email with config:', smtpConfig);
    console.log('Duty details:', duty);
    
    // Generate the ICS data
    const icsData = await generateCalendarData(duty);
    
    // Here, we would typically make an API call to a server endpoint that would send the email
    // For the frontend-only demo, we'll simulate a successful API call
    
    // Mock API call
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        // Simulate successful email sending
        resolve(true);
      }, 1500);
    });
  } catch (error) {
    console.error('Error sending calendar invitation email:', error);
    return false;
  }
};
