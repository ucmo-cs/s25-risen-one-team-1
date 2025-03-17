import { fetchData } from './apiConfig';

export interface Employee {
  EmployeeID: number;
  EmployeeName: string;
  ProjectID: number;
}

// Fetch all employees
export const getAllEmployees = (): Promise<Employee[]> => fetchData('/getAllEmployees');

// Fetch a specific employee by ID
export const getEmployeeById = (id: number): Promise<Employee> => fetchData(`/getEmployee/${id}`);

// Fetch employees by Project ID
export const getEmployeesByProjectId = (projectId: number): Promise<Employee[]> => fetchData(`/getEmployeesByProject/${projectId}`);

// Fetch employee by name
export const getEmployeeByName = (name: string): Promise<Employee> => fetchData(`/getEmployeeByName/${name}`);
