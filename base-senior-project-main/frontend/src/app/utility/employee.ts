import { fetchData } from './apiConfig';

export interface Employee {
  EmployeeID: number;
  EmployeeName: string;
  ProjectID: number;
}

// Fetch all employees
export const getAllEmployees = (): Promise<Employee[]> => fetchData('/getAllEmployees');
