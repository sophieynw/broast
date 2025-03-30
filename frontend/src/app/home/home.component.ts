import { Component } from '@angular/core';
import { BearComponent } from "../bear/bear.component";
import { PromptAreaComponent } from "../prompt-area/prompt-area.component";

@Component({
  selector: 'app-home',
  imports: [BearComponent, PromptAreaComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  formSubmitted: boolean = false;


  onFormSubmit(status: boolean) {
    this.formSubmitted = status;
  }

}
