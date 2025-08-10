
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosPersonalesComponent } from './datos-personales.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('DatosPersonalesComponent', () => {
  let component: DatosPersonalesComponent;
  let fixture: ComponentFixture<DatosPersonalesComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [DatosPersonalesComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: {} }
      ]
    })
    .compileComponents();

  fixture = TestBed.createComponent(DatosPersonalesComponent);
  component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
