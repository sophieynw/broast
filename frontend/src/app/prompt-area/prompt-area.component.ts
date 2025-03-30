import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RoastApiService } from '../roast-api.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-prompt-area',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './prompt-area.component.html',
  styleUrl: './prompt-area.component.css',
})
export class PromptAreaComponent implements OnInit {
  constructor(
    private roastApiService: RoastApiService,
    private http: HttpClient
  ) {}

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

      const formData = new FormData();
      formData.append('dreamJob', this.jobName);
      formData.append('selectedOption', this.selectedOption);

      if (
        this.file &&
        (this.selectedOption === 'resume' ||
          this.selectedOption === 'coverLetter')
      ) {
        formData.append('file', this.file);
      }

      if (
        this.link &&
        (this.selectedOption === 'github' || this.selectedOption === 'linkedin')
      ) {
        formData.append('link', this.link);
      }

      const apiUrl = 'http://127.0.0.1:5000/upload';

      this.http.post(apiUrl, formData).subscribe({
        next: (response: any) => {
          this.apiResponseText =
            response.response || response.text || 'No response text';
        },
        error: (error) => {
          console.error('API error:', error);
          this.apiResponseText =
            'Error: Unable to get a response from the server.';
        },
      });
    }
  }

  ngOnInit() {}
}
