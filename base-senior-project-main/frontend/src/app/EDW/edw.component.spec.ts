import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EdwComponent } from './edw.component';
import { FormsModule } from '@angular/forms';

describe('EdwComponent', () => {
  let component: EdwComponent;
  let fixture: ComponentFixture<EdwComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EdwComponent ],
      imports: [ FormsModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
