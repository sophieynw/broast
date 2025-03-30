import { Component } from '@angular/core';


import { ToolbarComponent } from "./toolbar/toolbar.component";

import { SidenavComponent } from "./sidenav/sidenav.component";

@Component({
  selector: 'app-root',
  imports: [ ToolbarComponent, SidenavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend';

  // TODO: FIX auth leter
  // isAuthenticated: boolean = false; // You can set this based on your authentication logic

  // login() {
  //   // Logic for logging in
  //   this.isAuthenticated = true;
  // }

  // logout() {
  //   // Logic for logging out
  //   this.isAuthenticated = false;
  // }
}
