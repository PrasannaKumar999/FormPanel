import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { SubmissionService } from '../services/submission.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
userForm!: FormGroup;
  submittedData: any[] = [];
  username: string = '';
  photoPreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private submissionService: SubmissionService
  ) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username') || 'Guest';

    this.userForm = this.fb.group({
      name: [''],
      mobile: [''],
      address: [''],
      skills: [''],
      hobbies: [''],
      photo: [null],
    });

    // Load existing submissions
    this.submissionService.getSubmissions().subscribe({
      next: (data) => {
        this.submittedData = data;
      },
      error: (err) => {
        console.error('Error fetching submissions:', err);
      },
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.userForm.patchValue({ photo: file });

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => (this.photoPreview = reader.result);
      reader.readAsDataURL(file);
    } else {
      this.photoPreview = null;
    }
  }

  onSubmit(): void {
    if (!this.userForm.valid) return;

    const formValues = this.userForm.value;
    const formData = new FormData();

    formData.append('name', formValues.name);
    formData.append('mobile', formValues.mobile);
    formData.append('address', formValues.address);
    formData.append('skills', formValues.skills);
    formData.append('hobbies', formValues.hobbies);

    const file = this.userForm.get('photo')?.value;
    if (file) formData.append('photo', file);

    this.submissionService.submitForm(formData).subscribe({
      next: (res: any) => {
        console.log('Submitted successfully:', res);
        this.submittedData.push(res.data);
        this.userForm.reset();
        this.photoPreview = null;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Submission failed:', err.message);
      },
    });
  }

  onLogout() {
    localStorage.clear();
    location.href = '/login';
  }

  exportToExcel(): void {
  const worksheet = XLSX.utils.json_to_sheet(this.submittedData);
  const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
  const excelBuffer: any = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });
  const fileData: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  FileSaver.saveAs(fileData, 'submissions.xlsx');
}

}
