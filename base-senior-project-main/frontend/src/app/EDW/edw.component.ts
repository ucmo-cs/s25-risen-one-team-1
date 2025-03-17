import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { getAllProjects, Project } from '../utility/projects';
import { getAllEmployees, Employee } from '../utility/employee';
import { getAllDays, Day } from '../utility/days';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-edw',
  templateUrl: './edw.component.html',
  styleUrls: ['./edw.component.css']
})
export class EdwComponent implements OnInit {
  projects: Project[] = [];
  employees: Employee[] = [];
  days: Day[] = [];
  displayedColumns: string[] = ['projectName', 'employeeName', 'projectId'];
  dataSource = new MatTableDataSource<any>();
  sortBy: string = 'month'; // Default sort option

  @ViewChild('innerContainer', { static: false }) innerContainer!: ElementRef;

  constructor() {}

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    this.projects = await getAllProjects();
    this.employees = await getAllEmployees();
    this.days = await getAllDays();

    this.updateTableData();
  }

  updateTableData(): void {
    const now = new Date();
    const mergedData = this.projects.flatMap(project => {
      return project.EmployeesID.map(employeeId => {
        const employee = this.employees.find(e => e.EmployeeID === employeeId);
        return {
          projectName: project.ProjectName,
          projectId: project.ProjectID,
          employeeName: employee ? employee.EmployeeName : 'Unknown',
        };
      });
    });

    this.dataSource.data = mergedData;
  }

  onSortChange(): void {
    this.updateTableData();
  }

  public generatePDF(): void {
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
        pdf.save('EDW-Data.pdf');
      })
      .catch((error) => {
        console.error('Error generating PDF:', error);
      });
  }
}
