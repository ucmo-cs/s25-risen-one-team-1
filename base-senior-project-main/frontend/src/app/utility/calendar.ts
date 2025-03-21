import { fetchData } from './apiConfig';

export interface CalendarEvent {
  title: string;
  date: string;
  EmployeeID?: number;
  HoursWorked?: number;
  ProjectID?: number;
}

// Fetch all calendar events
export const getAllCalendarEvents = (): Promise<CalendarEvent[]> => fetchData('/getAllDays');

// Fetch events by Employee ID
export const getCalendarEventsByEmployee = (employeeId: number): Promise<CalendarEvent[]> => fetchData(`/getCalendarEventsByEmployee/${employeeId}`);

// Fetch events by Project ID
export const getCalendarEventsByProject = (projectId: number): Promise<CalendarEvent[]> => fetchData(`/getCalendarEventsByProject/${projectId}`);

// Fetch events for a specific date
export const getCalendarEventByDate = (date: string): Promise<CalendarEvent[]> => fetchData(`/getCalendarEventByDate/${date}`);
