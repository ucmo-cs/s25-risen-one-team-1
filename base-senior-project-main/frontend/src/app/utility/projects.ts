import { fetchData } from './apiConfig';

export interface Project {
  ProjectID: number;
  ProjectName: string;
  EmployeesID: number[];
}

export const getAllProjects = (): Promise<Project[]> => fetchData('/getAllProjects');
export const getProjectById = (id: number): Promise<Project> => fetchData(`/getProject/${id}`);
export const getProjectsByEmployeeId = (employeeId: number): Promise<Project[]> => fetchData(`/getProjectsByEmployee/${employeeId}`);
export const getProjectByName = (name: string): Promise<Project> => fetchData(`/getProjectByName/${name}`);
