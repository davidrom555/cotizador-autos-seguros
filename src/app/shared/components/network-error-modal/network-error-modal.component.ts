import { Component, Input, Output, EventEmitter } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-network-error-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './network-error-modal.component.html',
  styleUrls: ['./network-error-modal.component.scss']
})
export class NetworkErrorModalComponent {
  @Input() show: boolean = false;
  @Input() message: string = '';
  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }
}
