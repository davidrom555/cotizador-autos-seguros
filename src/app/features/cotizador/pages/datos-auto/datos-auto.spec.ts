
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosAutoComponent } from './datos-auto';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('DatosAuto', () => {
  let component: DatosAutoComponent;
  let fixture: ComponentFixture<DatosAutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosAutoComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
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
