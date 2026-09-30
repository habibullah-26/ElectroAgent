import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AiService, ChatResponse } from './services/ai.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule,FormsModule,MarkdownComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'AI Chat Assistant';

  message = '';

  answer = '';

  loading = false;

  error = '';

  constructor(
    private aiService: AiService
  ) {}

  askAI(): void {

    if (!this.message.trim()) {
      return;
    }

    this.loading = true;

    this.answer = '';

    this.error = '';

    this.aiService
      .chat(this.message.trim())
      .subscribe({

        next: (response: ChatResponse) => {

          this.loading = false;

          if (response.success) {

            this.answer = response.answer || '';

          } else {

            this.error =
              response.message ||
              'Something went wrong.';
          }

        },

        error: (error) => {

          console.error(error);

          this.loading = false;

          this.error =
            'Unable to connect to AI server.';

        }

      });

  }

  clear(): void {

    this.message = '';

    this.answer = '';

    this.error = '';

  }
}
