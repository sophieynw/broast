import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SidenavService } from '../sidenav.service';
import { Subscription } from 'rxjs';
import {MatSidenavModule} from '@angular/material/sidenav';

import {MatListModule} from '@angular/material/list'; 
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  imports: [MatSidenavModule, MatListModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav: MatSidenav | undefined;
  private sidenavSubscription: Subscription | undefined;

  constructor(private sidenavService: SidenavService) {}

  ngOnInit() {
    this.sidenavSubscription = this.sidenavService.sidenavToggle$.subscribe(() => {
      this.sidenav?.toggle(); // Toggle the sidenav when the event is received
    });
  }

  ngOnDestroy() {
    if (this.sidenavSubscription) {
      this.sidenavSubscription.unsubscribe();
    }
  }
}