import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss']
})
export class FooterComponent {
  currentYear = signal(new Date().getFullYear());
}
