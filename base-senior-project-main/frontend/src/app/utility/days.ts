export interface Day {
  EmployeeID: number;
  date: string;  // Ensure lowercase 'date'
  HoursWorked: number;
  ProjectID: number;
}

export async function getAllDays(): Promise<Day[]> {
  const response = await fetch('API_ENDPOINT_HERE');
  return await response.json();
}
