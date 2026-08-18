import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      [class]="extraClass"
      [ngSwitch]="name"
    >
      <!-- Dashboard -->
      <g *ngSwitchCase="'dashboard'">
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
      </g>

      <!-- Products / Box -->
      <g *ngSwitchCase="'package'">
        <path d="m7.5 4.27 9 5.15" />
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
      </g>

      <!-- Invoice / FileText -->
      <g *ngSwitchCase="'invoice'">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M10 9H8" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
      </g>

      <!-- Printer -->
      <g *ngSwitchCase="'printer'">
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect width="12" height="8" x="6" y="14" />
      </g>

      <!-- Plus -->
      <g *ngSwitchCase="'plus'">
        <path d="M5 12h14" />
        <path d="M12 5v14" />
      </g>

      <!-- Search -->
      <g *ngSwitchCase="'search'">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </g>

      <!-- Check Circle -->
      <g *ngSwitchCase="'check-circle'">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </g>

      <!-- Check -->
      <g *ngSwitchCase="'check'">
        <polyline points="20 6 9 17 4 12" />
      </g>

      <!-- Clock / Hourglass -->
      <g *ngSwitchCase="'clock'">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </g>

      <!-- Trash / Delete -->
      <g *ngSwitchCase="'trash'">
        <path d="M3 6h18" />
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        <line x1="10" x2="10" y1="11" y2="17" />
        <line x1="14" x2="14" y1="11" y2="17" />
      </g>

      <!-- Edit -->
      <g *ngSwitchCase="'edit'">
        <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
        <path d="m15 5 4 4" />
      </g>

      <!-- Eye / Preview -->
      <g *ngSwitchCase="'eye'">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </g>

      <!-- Code / Tech -->
      <g *ngSwitchCase="'code'">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </g>

      <!-- Alert Triangle -->
      <g *ngSwitchCase="'alert-triangle'">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <line x1="12" x2="12" y1="9" y2="13" />
        <line x1="12" x2="12.01" y1="17" y2="17" />
      </g>

      <!-- Info -->
      <g *ngSwitchCase="'info'">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </g>

      <!-- X / Close -->
      <g *ngSwitchCase="'close'">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </g>

      <!-- Arrow Right -->
      <g *ngSwitchCase="'arrow-right'">
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </g>

      <!-- Refresh / Rotate -->
      <g *ngSwitchCase="'refresh'">
        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
        <path d="M16 21h5v-5" />
      </g>

      <!-- Sparkles -->
      <g *ngSwitchCase="'sparkles'">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      </g>

      <!-- Shield / Security -->
      <g *ngSwitchCase="'shield'">
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      </g>

      <!-- Layers / Stack -->
      <g *ngSwitchCase="'layers'">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </g>

      <!-- Default Fallback Circle -->
      <g *ngSwitchDefault>
        <circle cx="12" cy="12" r="9" />
      </g>
    </svg>
  `,
})
export class IconComponent {
  @Input() name = 'package';
  @Input() size = 18;
  @Input() extraClass = '';
}
