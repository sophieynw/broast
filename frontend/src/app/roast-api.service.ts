import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoastApiService {
  constructor(private http: HttpClient) {}

  uploadResume(formData: FormData): Observable<any> {
    const apiUrl = 'http://127.0.0.1:5000/uploadresume';
    return this.http.post(apiUrl, formData);
  }
}
