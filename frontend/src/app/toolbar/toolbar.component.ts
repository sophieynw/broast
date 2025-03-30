import { Component } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { SidenavService } from '../sidenav.service';
@Component({
  selector: 'app-toolbar',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {

  constructor(private sidenavService: SidenavService) {}

  onMenuClick() {
    this.sidenavService.toggleSidenav(); // Trigger sidenav toggle
  }

  //TODO: login pop up
  // onLoginClick(){

  //   this.loginService.toggleLogin();
  // }
}
