import { fetchData } from './apiConfig';

export interface Project {
  ProjectID: number;
  ProjectName: string;
  EmployeesID: number[];
}

// Fetch all projects
export const getAllProjects = (): Promise<Project[]> => fetchData('/getAllProjects');

// Optional: Fetch employees for a specific project ID (only if your API supports it)
export const getEmployeesByProjectId = (projectId: number): Promise<number[]> => fetchData(`/getEmployeesByProject/${projectId}`);
