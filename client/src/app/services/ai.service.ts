import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  success: boolean;
  answer?: string;
  message?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiService {

  private apiUrl = 'http://localhost:3000/api/chat';

  constructor(
    private http: HttpClient
  ) {}

  chat(message: string): Observable<ChatResponse> {

    const request: ChatRequest = {
      message: message
    };

    return this.http.post<ChatResponse>(
      this.apiUrl,
      request
    );
  }
}