import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatRequest {
  message: string;
  conversationId?: string;
}

export interface ChatResponse {
  success: boolean;
  answer?: string;
  message?: string;
  error?: string;
}

export interface ApiConversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count?: number;
  messages?: ApiMessage[];
}

export interface ApiMessage {
  id: number;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface ConversationResponse {
  success: boolean;
  conversation: ApiConversation;
}

interface ConversationsResponse {
  success: boolean;
  conversations: ApiConversation[];
}

@Injectable({
  providedIn: 'root'
})
export class AiService {
  // Local backend is used during development. Change this base URL when deploying
  // the API that includes the SQLite conversation endpoints.
  private readonly apiBaseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  chat(message: string, conversationId: string): Observable<ChatResponse> {
    const request: ChatRequest = { message, conversationId };
    return this.http.post<ChatResponse>(`${this.apiBaseUrl}/chat`, request);
  }

  createConversation(title: string): Observable<ConversationResponse> {
    return this.http.post<ConversationResponse>(
      `${this.apiBaseUrl}/conversations`,
      { title }
    );
  }

  getConversations(): Observable<ConversationsResponse> {
    return this.http.get<ConversationsResponse>(
      `${this.apiBaseUrl}/conversations`
    );
  }

  getConversation(id: string): Observable<ConversationResponse> {
    return this.http.get<ConversationResponse>(
      `${this.apiBaseUrl}/conversations/${encodeURIComponent(id)}`
    );
  }

  deleteConversation(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(
      `${this.apiBaseUrl}/conversations/${encodeURIComponent(id)}`
    );
  }
}
