import { Injectable } from '@angular/core';

// Define WorkSession type
interface WorkSession {
date: string;
hours: number;
}

// Define Employee type
interface Employee {
name: string;
role: string;
workSessions: WorkSession[];
}

// Define Project type
interface Project {
name: string;
employees: Employee[];
}

@Injectable({
providedIn: 'root'
})
export class MockDatabaseService {
private projects: Project[] = [
{
name: "Project Alpha",
employees: [
{
name: "Alice",
role: "Developer",
workSessions: [
{ date: "2025-02-05", hours: 8 },
{ date: "2025-02-12", hours: 7 },
{ date: "2025-02-19", hours: 9 },
{ date: "2025-03-04", hours: 8 },
{ date: "2025-03-11", hours: 7 },
{ date: "2025-04-02", hours: 10 }
]
},
{
name: "Bob",
role: "Designer",
workSessions: [
{ date: "2025-02-06", hours: 9 },
{ date: "2025-02-13", hours: 8 },
{ date: "2025-03-05", hours: 7 },
{ date: "2025-03-18", hours: 6 },
{ date: "2025-04-10", hours: 9 }
]
}
]
},
{
name: "Project Beta",
employees: [
{
name: "Charlie",
role: "Project Manager",
workSessions: [
{ date: "2025-02-07", hours: 10 },
{ date: "2025-02-14", hours: 12 },
{ date: "2025-03-06", hours: 11 },
{ date: "2025-04-08", hours: 8 },
{ date: "2025-05-05", hours: 9 }
]
},
{
name: "David",
role: "Tester",
workSessions: [
{ date: "2025-02-08", hours: 8 },
{ date: "2025-02-15", hours: 7 },
{ date: "2025-03-07", hours: 10 },
{ date: "2025-04-15", hours: 6 },
{ date: "2025-05-10", hours: 7 }
]
}
]
},
{
name: "Project Gamma",
employees: [
{
name: "Eve",
role: "Lead Engineer",
workSessions: [
{ date: "2025-02-09", hours: 9 },
{ date: "2025-02-16", hours: 10 },
{ date: "2025-03-08", hours: 8 },
{ date: "2025-04-12", hours: 9 },
{ date: "2025-05-14", hours: 10 }
]
},
{
name: "Frank",
role: "Analyst",
workSessions: [
{ date: "2025-02-10", hours: 7 },
{ date: "2025-02-17", hours: 6 },
{ date: "2025-03-09", hours: 8 },
{ date: "2025-04-18", hours: 9 },
{ date: "2025-05-20", hours: 10 }
]
}
]
},
{
name: "Project Delta",
employees: [
{
name: "Grace",
role: "Software Engineer",
workSessions: [
{ date: "2025-02-11", hours: 8 },
{ date: "2025-03-12", hours: 9 },
{ date: "2025-04-15", hours: 10 },
{ date: "2025-05-22", hours: 7 }
]
},
{
name: "Hank",
role: "QA Engineer",
workSessions: [
{ date: "2025-02-12", hours: 9 },
{ date: "2025-03-13", hours: 8 },
{ date: "2025-04-16", hours: 9 },
{ date: "2025-05-25", hours: 8 }
]
}
]
}
];

constructor() {}

  getProjects(): Project[] {
    return this.projects;
  }

  addProject(project: Project) {
    this.projects.push(project);
  }
}
