import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EdwComponent } from './edw.component';
import { FormsModule } from '@angular/forms';
import * as projectApi from '../utility/projects';

describe('EdwComponent', () => {
  let component: EdwComponent;
  let fixture: ComponentFixture<EdwComponent>;

  beforeEach(async () => {
    spyOn(projectApi, 'getAllProjects').and.returnValue(Promise.resolve([
      { name: 'Mock Project', date: '2025-03-01', employees: [] }
    ]));

    await TestBed.configureTestingModule({
      declarations: [ EdwComponent ],
      imports: [ FormsModule ],
    }).compileComponents();

    fixture = TestBed.createComponent(EdwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load projects from utility API', async () => {
    await component.loadProjects();
    expect(component.projects.length).toBe(1);
  });
});
