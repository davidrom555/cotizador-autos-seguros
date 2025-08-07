import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElegirPlanComponent } from './elegir-plan';

describe('ElegirPlan', () => {
  let component: ElegirPlanComponent;
  let fixture: ComponentFixture<ElegirPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ElegirPlanComponent]
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
