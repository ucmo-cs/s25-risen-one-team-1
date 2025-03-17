import { fetchData } from './apiConfig';

export interface Project {
  ProjectID: number;
  ProjectName: string;
  EmployeesID: number[];
}

// Fetch all projects
export const getAllProjects = (): Promise<Project[]> => fetchData('/getAllProjects');

// Fetch a specific project by ID
export const getProjectById = (id: number): Promise<Project> => fetchData(`/getProject/${id}`);

// Fetch projects by Employee ID
export const getProjectsByEmployeeId = (employeeId: number): Promise<Project[]> => fetchData(`/getProjectsByEmployee/${employeeId}`);

// Fetch project by name
export const getProjectByName = (name: string): Promise<Project> => fetchData(`/getProjectByName/${name}`);

// Optional: Fetch employees for a specific project ID (only if your API supports it)
export const getEmployeesByProjectId = (projectId: number): Promise<number[]> => fetchData(`/getEmployeesByProject/${projectId}`);
