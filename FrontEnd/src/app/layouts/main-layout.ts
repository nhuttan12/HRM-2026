import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LibSidebarComponent } from '../components/libs/lib-side-bar/lib-sidebar.component';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, LibSidebarComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {}