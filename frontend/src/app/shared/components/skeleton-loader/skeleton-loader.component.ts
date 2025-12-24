import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton-loader.component.html',
  styleUrl: './skeleton-loader.component.scss'
})
export class SkeletonLoaderComponent {
  @Input() type: 'text' | 'circle' | 'rect' | 'card' | 'event-card' = 'text';
  @Input() width: string = '100%';
  @Input() height: string = '1rem';
  @Input() count: number = 1;
  @Input() borderRadius: string = '0.25rem';

  get items(): number[] {
    return Array(this.count).fill(0);
  }

  getStyle(): any {
    const baseStyle: any = {
      width: this.width,
      height: this.height,
      borderRadius: this.borderRadius
    };

    if (this.type === 'circle') {
      baseStyle.borderRadius = '50%';
      baseStyle.width = this.height;
    }

    return baseStyle;
  }
}
