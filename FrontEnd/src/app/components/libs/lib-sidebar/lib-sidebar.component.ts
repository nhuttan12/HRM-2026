import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'lib-sidebar',
  standalone: true,
  imports: [RouterModule, PanelMenuModule],
  templateUrl: './lib-sidebar.component.html',
  styleUrl: './lib-sidebar.component.scss',
})
export class LibSidebarComponent {
  readonly menuItems: MenuItem[] = [
    {
      label: 'Ứng viên',
      icon: 'pi pi-user',
      routerLink: '/candidate-profile',
    },
    {
      label: 'Đợt tuyển dụng',
      icon: 'pi pi-briefcase',
      routerLink: '/recruitment-batch',
    },
    {
      label: 'Theo dõi tuyển dụng',
      icon: 'pi pi-chart-line',
      routerLink: '/recruitment-tracking',
    },
  ];
}