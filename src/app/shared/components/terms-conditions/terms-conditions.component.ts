import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terms-conditions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss']
})
export class TermsConditionsComponent {
  lastUpdated = signal('2 de Agosto de 2025');

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/']);
  }
}