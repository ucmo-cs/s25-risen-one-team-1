import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { getAllProjects, Project } from '../utility/projects';
import { getAllEmployees, Employee } from '../utility/employee';
import { getDaysByEmployeeAndProject } from '../utility/days';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-edw',
  templateUrl: './edw.component.html',
  styleUrls: ['./edw.component.css']
})
export class EdwComponent implements OnInit {
  months = ['January 2024', 'February 2024', 'March 2024', 'April 2024'];
  projects: Project[] = [];
  groupedTimeSheets: {
    projectName: string;
    month: string;
    daysInMonth: number[];
    timeSheet: {
      employeeName: string;
      dailyHours: number[];
      total: number;
    }[];
  }[] = [];

  @ViewChild('innerContainer', { static: false }) innerContainer!: ElementRef;

  constructor() {}

  async ngOnInit(): Promise<void> {
    this.projects = await getAllProjects();
    const allEmployees = await getAllEmployees();

    for (const project of this.projects) {
      const employees = allEmployees.filter(e =>
        project.EmployeesID.includes(e.EmployeeID)
      );

      for (const month of this.months) {
        const [monthName, yearStr] = month.split(' ');
        const year = parseInt(yearStr, 10);
        const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
        const days = new Date(year, monthIndex + 1, 0).getDate();
        const daysInMonth = Array.from({ length: days }, (_, i) => i + 1);

        const timeSheet = [];

        for (const emp of employees) {
          const logs = await getDaysByEmployeeAndProject(emp.EmployeeID, project.ProjectID);

          const daily = daysInMonth.map((day) => {
            const dateStr = `${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}-${year}`;
            const match = logs.find((d) => d.date === dateStr);
            return match ? match.HoursWorked : 0;
          });

          const total = daily.reduce((a, b) => a + b, 0);
          timeSheet.push({ employeeName: emp.EmployeeName, dailyHours: daily, total });
        }

        this.groupedTimeSheets.push({
          projectName: project.ProjectName,
          month,
          daysInMonth,
          timeSheet
        });
      }
    }
  }

  generatePDF(): void {
    const containerElement = this.innerContainer.nativeElement;
    if (!containerElement) {
      console.error('Error: EDW inner container element not found.');
      return;
    }

    html2canvas(containerElement, {
      scale: 2,
      scrollX: -window.scrollX,
      scrollY: -window.scrollY,
      useCORS: true
    })
      .then((canvas) => {
        const image = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(image, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('EDW-Timesheet.pdf');
      })
      .catch((error) => {
        console.error('Error generating PDF:', error);
      });
  }
}
