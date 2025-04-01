
import { createEvents } from 'ics';
import { format, parse, addDays } from 'date-fns';
import { DutyWithUser } from '@/types';

/**
 * Generate an iCalendar (.ics) file for a duty assignment
 * Duties are set to run from 6PM to 8AM the next day
 */
export const generateCalendarData = (duty: DutyWithUser): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Parse the date string to a Date object
    const dutyDate = parse(duty.date, 'yyyy-MM-dd', new Date());
    
    // Set start time to 6:00 PM on duty date
    const startDate = new Date(dutyDate);
    startDate.setHours(18, 0, 0, 0); // 6:00 PM
    
    // Set end time to 8:00 AM the next day
    const endDate = addDays(new Date(dutyDate), 1);
    endDate.setHours(8, 0, 0, 0); // 8:00 AM next day
    
    // Format dates for iCalendar format [year, month, day, hour, minute]
    const start: [number, number, number, number, number] = [
      startDate.getFullYear(),
      startDate.getMonth() + 1, // Months are 0-indexed in JS
      startDate.getDate(),
      startDate.getHours(),
      startDate.getMinutes()
    ];
    
    const end: [number, number, number, number, number] = [
      endDate.getFullYear(),
      endDate.getMonth() + 1,
      endDate.getDate(),
      endDate.getHours(),
      endDate.getMinutes()
    ];

    // Create the event
    createEvents([
      {
        start,
        end,
        title: `${duty.type} Duty`,
        description: `${duty.user.name} is on ${duty.type} duty from 6:00 PM to 8:00 AM the next morning`,
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
            trigger: { hours: 2, before: true }
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
 * 
 * Note: This is a simulation - in a real application, you would 
 * need a server-side component or email service integration
 */
export const sendCalendarInviteEmail = async (
  duty: DutyWithUser, 
  smtpConfig: {
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    from?: string;
  }
): Promise<boolean> => {
  try {
    // Check if all required SMTP configuration fields are present
    if (!smtpConfig.host || !smtpConfig.port || !smtpConfig.username || 
        !smtpConfig.password || !smtpConfig.from) {
      console.error('Incomplete SMTP configuration');
      return false;
    }
    
    // Generate the ICS data
    const icsData = await generateCalendarData(duty);
    
    // In a real implementation, you would:
    // 1. Make an API call to your backend service
    // 2. The backend would use a library like Nodemailer to send the email with the ICS attachment
    // 3. The email would be formatted as a calendar invitation
    
    console.log('SMTP Configuration:', smtpConfig);
    console.log(`Duty: ${duty.type} for ${duty.user.name} on ${duty.date} (6PM-8AM)`);
    console.log('ICS data generated successfully');
    
    // For this simulation, we'll return true after a delay to simulate sending
    return new Promise((resolve) => {
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
