import { fetchData } from './apiConfig';

export interface Employee {
  EmployeeID: number;
  EmployeeName: string;
  ProjectID: number;
}

export const getAllEmployees = (): Promise<Employee[]> => fetchData('/getAllEmployees');
export const getEmployeeById = (id: number): Promise<Employee> => fetchData(`/getEmployee/${id}`);
