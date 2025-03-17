import { fetchData } from './apiConfig';

export interface CalendarEvent {
  title: string;
  date: string;
}

// Fetch all calendar events
export const getAllCalendarEvents = (): Promise<CalendarEvent[]> => fetchData('/getAllDays');
