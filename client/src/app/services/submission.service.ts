import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SubmissionService {
  private API_URL = 'http://localhost:5000/api/submissions';

  constructor(private http: HttpClient) {}

  submitForm(data: FormData) {
    return this.http.post(this.API_URL, data);
  }
  getSubmissions() {
    return this.http.get<any[]>(this.API_URL);
  }
}
