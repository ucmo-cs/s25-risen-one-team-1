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

// Fetch a specific day by date
export const getDayByDate = (date: string): Promise<Day> => fetchData(`/getDay/${date}`);

// Fetch days by EmployeeID
export const getDaysByEmployee = (employeeId: number): Promise<Day[]> => fetchData(`/getDaysByEmployee/${employeeId}`);

// Fetch days by ProjectID
export const getDaysByProject = (projectId: number): Promise<Day[]> => fetchData(`/getDaysByProject/${projectId}`);

// Fetch days by EmployeeID and ProjectID
export const getDaysByEmployeeAndProject = (employeeId: number, projectId: number): Promise<Day[]> =>
  fetchData(`/getDaysByEmployeeAndProject/${employeeId}/${projectId}`);
