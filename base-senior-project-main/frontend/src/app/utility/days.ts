import { fetchData } from './apiConfig';

export interface Day {
  DayID?: number;
  EmployeeID: number;
  date: string;
  HoursWorked: number;
  ProjectID: number;
}

// Fetch all days
export const getAllDays = (): Promise<Day[]> => fetchData('/getAllDays');

// Fetch days by EmployeeID and ProjectID
export const getDaysByEmployeeAndProject = (employeeId: number, projectId: number): Promise<Day[]> =>
  fetchData(`/getDaysByEmployeeAndProject/${employeeId}/${projectId}`);

export function parseDateParts(dateStr: string): { day: number; month: number; year: number } {
  const [month, day, year] = dateStr.split('-').map(Number);
  return { day, month, year };
}

