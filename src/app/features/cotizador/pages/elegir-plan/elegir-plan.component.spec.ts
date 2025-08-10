
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElegirPlanComponent } from './elegir-plan.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('ElegirPlan', () => {
  let component: ElegirPlanComponent;
  let fixture: ComponentFixture<ElegirPlanComponent>;

  beforeEach(async () => {


    await TestBed.configureTestingModule({
      imports: [ElegirPlanComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: {} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElegirPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
