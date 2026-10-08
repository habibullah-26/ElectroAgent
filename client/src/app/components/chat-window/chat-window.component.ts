import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownComponent } from 'ngx-markdown';
import { ChatStoreService } from '../../services/chat-store.service';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [CommonModule, MarkdownComponent],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.css'
})
export class ChatWindowComponent implements OnDestroy {
  @ViewChild('scrollArea') scrollArea?: ElementRef<HTMLElement>;

  statuses = ['Thinking', 'Analyzing your question', 'Getting the answer', 'Preparing response'];
  statusIndex = 0;
  private timer = setInterval(() => {
    this.statusIndex = (this.statusIndex + 1) % this.statuses.length;
  }, 1800);

  constructor(public store: ChatStoreService) {}

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  scrollToBottom(): void {
    setTimeout(() => {
      const el = this.scrollArea?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    });
  }
}
