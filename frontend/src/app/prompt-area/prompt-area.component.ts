import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-prompt-area',
  imports: [CommonModule, FormsModule],
  templateUrl: './prompt-area.component.html',
  styleUrl: './prompt-area.component.css'
})
export class PromptAreaComponent {
  // jobName: string = ''; 
  // selectedOption: string = ''; // Selected option from dropdown
  // file: File | null = null; // File to upload
  // link: string = ''; // URL input field for the link (GitHub or LinkedIn)
  // formSubmitted: boolean = false; // To track if the form is submitted

  // // Handle the dropdown change event
  // onOptionChange(value: string) {
  //   this.selectedOption = value;
  //   this.file = null; // Reset file on option change
  //   this.link = ''; // Reset link on option change
  // }

  // // Handle file upload
  // onFileSelect(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.file = file;
  //   }
  // }

  // // Handle link input
  // onLinkInput(event: any) {
  //   this.link = event.target.value;
  // }

  // // Submit form
  // onSubmit() {
  //   if (this.jobName && this.selectedOption) {
  //     this.formSubmitted = true;
  //     // Log the form data to the console or perform your actual submission logic here
  //     console.log({
  //       dreamJob: this.jobName,
  //       selectedOption: this.selectedOption,
  //       file: this.file,
  //       link: this.link
  //     });
  //   } else {
  //     alert('Please fill all the required fields.');
  //   }
  // }
}
