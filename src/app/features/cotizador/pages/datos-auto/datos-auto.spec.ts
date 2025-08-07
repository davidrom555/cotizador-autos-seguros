import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosAutoComponent } from './datos-auto';

describe('DatosAuto', () => {
  let component: DatosAutoComponent;
  let fixture: ComponentFixture<DatosAutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosAutoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosAutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
