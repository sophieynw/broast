import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { RoastApiService } from '../roast-api.service';

@Component({
  selector: 'app-prompt-area',
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule],
  templateUrl: './prompt-area.component.html',
  styleUrl: './prompt-area.component.css'
})
export class PromptAreaComponent  implements OnInit{
  

  constructor(private roastApiService: RoastApiService) { }
  // Better handle in application component
  // constructor( private http: HttpClient) { } 

  jobName!: string; //Selected Job Name
  selectedOption!: string; // Selected option from dropdown
  file!: File | null; // File to upload (Resume, CoverLetter)
  link!: string; // URL input field for the link (GitHub, LinkedIn)
  formSubmitted: boolean = false; // to track if the form is submitted
  apiResponseText!: string; // to store the API response text

  // Handle the dropdown change event
  onOptionChange(value: string) {
    this.selectedOption = value;
    this.file = null; 
    this.link = ''; 
  }

  // Handle file upload
  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.file = file;
    }
  }

  // Handle link input
  onLinkInput(event: any) {
    this.link = event.target.value;
  }

  // Submit form
  onSubmit() {
    if (this.jobName && this.selectedOption) {
      this.formSubmitted = true;
      // Data to sent to the API
      const formData = {
        dreamJob: this.jobName,
        selectedOption: this.selectedOption,
        file: this.file,
        link: this.link
      };

      // Change to actual api
      const apiUrl = 'http://127.0.0.1:5000/uploadresume';


      // API call
      // this.http.post(apiUrl, formData).subscribe(
      //   (response: any) => {

      //     this.apiResponseText = response.text; 
      //   }
      // );
    } 
  }


  ngOnInit() {

  }
}
