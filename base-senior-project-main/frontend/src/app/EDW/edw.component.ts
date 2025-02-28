import { Component } from '@angular/core';

@Component({
selector: 'app-edw',
templateUrl: './edw.component.html',
styleUrls: ['./edw.component.css']
})
export class EdwComponent {
selectedMonth: string = new Date().toISOString().slice(0, 7); // Default to current month

// Preset project data (mock database)
projects = [
{ name: "Rizen-One-Project", date: "2025-03-05", employees: [
{ name: "Tanner", hours: 20, role: "Scrum Peasant" },
{ name: "Austin", hours: 15, role: "Scrum Lord" },
{ name: "Strazzinator", hours: 30, role: "DAWG" } ,
{ name: "Mason", hours: 25, role: "" }
]
},
{ name: "Project Alpha", date: "2025-02-28", employees: [
{ name: "Alice", hours: 20, role: "Developer" },
{ name: "Bob", hours: 15, role: "Designer" }
]
},
{ name: "Project Beta", date: "2025-03-15", employees: [
{ name: "Alice", hours: 25, role: "Project Manager" },
{ name: "Bob", hours: 10, role: "Tester" }
]
},
{ name: "Project Gamma", date: "2025-04-10", employees: [
{ name: "Eve", hours: 30, role: "Lead Engineer" },
{ name: "Frank", hours: 20, role: "Analyst" }
]
},
{ name: "Project Delta", date: "2025-03-22", employees: [
{ name: "Grace", hours: 40, role: "UX Designer" },
{ name: "Henry", hours: 18, role: "Backend Developer" }
]
}
];

// Filter projects based on the selected month
getFilteredProjects() {
    return this.projects.filter(proj => proj.date.startsWith(this.selectedMonth));
  }

  // Allow HomeComponent to access all projects
  getAllProjects() {
    return this.projects;
  }
}
