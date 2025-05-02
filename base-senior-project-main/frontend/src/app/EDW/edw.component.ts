import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { getAllProjects, Project } from '../utility/projects';
import { getAllEmployees, Employee } from '../utility/employee';
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
    weekends: Set<number>;
    timeSheet: {
      employeeName: string;
      dailyHours: number[];
      total: number;
    }[];
  }[] = [];

  selectedProject: string = '';
  selectedMonth: string = '';
  signatureText: string = '';

  @ViewChild('innerContainer', { static: false }) innerContainer!: ElementRef;

  constructor() {}

  async ngOnInit(): Promise<void> {
    this.projects = await getAllProjects();
    const allEmployees = await getAllEmployees();

    for (const project of this.projects) {
      const employees = allEmployees.filter(e =>
        project.EmployeesID.map(String).includes(String(e.EmployeeID))
      );

      for (const month of this.months) {
        const [monthName, yearStr] = month.split(' ');
        const year = parseInt(yearStr, 10);
        const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
        const days = new Date(year, monthIndex + 1, 0).getDate();
        const daysInMonth = Array.from({ length: days }, (_, i) => i + 1);

        const weekends = new Set<number>(
          daysInMonth.filter(day => {
            const d = new Date(year, monthIndex, day);
            return d.getDay() === 0 || d.getDay() === 6;
          })
        );

        const timeSheet = [];

        for (const emp of employees) {
          const daily = daysInMonth.map(day => {
            const dateObj = new Date(year, monthIndex, day);
            const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
            return isWeekend ? 0 : Math.floor(Math.random() * 9); // Hours 0-8
          });

          const total = daily.reduce((sum, h) => sum + h, 0);

          timeSheet.push({
            employeeName: emp.EmployeeName,
            dailyHours: daily,
            total
          });
        }

        this.groupedTimeSheets.push({
          projectName: project.ProjectName,
          month,
          daysInMonth,
          weekends,
          timeSheet
        });
      }
    }
  }

  get filteredGroupedTimeSheets() {
    return this.groupedTimeSheets.filter(sheet => {
      const projectMatch = this.selectedProject ? sheet.projectName === this.selectedProject : true;
      const monthMatch = this.selectedMonth ? sheet.month === this.selectedMonth : true;
      return projectMatch && monthMatch;
    });
  }

  generatePDF(): void {
    const containerElement = this.innerContainer.nativeElement;

    if (!containerElement) {
      console.error('Error: EDW inner container element not found.');
      return;
    }

    html2canvas(containerElement, {
      scale: 2,
      scrollX: 0,
      scrollY: -window.scrollY,
      useCORS: true,
      windowWidth: containerElement.scrollWidth,
      windowHeight: containerElement.scrollHeight
    })
      .then((canvas) => {
        const imageData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('landscape', 'mm', 'a4');

        const pdfWidth = pdf.internal.pageSize.getWidth() * 0.7;
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imageData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imageData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;
        }

        pdf.save('EDW-Timesheet.pdf');
      })
      .catch((error) => {
        console.error('Error generating PDF:', error);
      });
  }
}
