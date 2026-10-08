import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatStoreService } from '../../services/chat-store.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Output() chatSelected = new EventEmitter<void>();
  @Output() openSettings = new EventEmitter<void>();

  constructor(public store: ChatStoreService) {}

  newChat(): void {
    this.store.newChat();
    this.chatSelected.emit();
  }

  select(id: string): void {
    this.store.select(id);
    this.chatSelected.emit();
  }

  delete(id: string, event: Event): void {
    event.stopPropagation();
    this.store.delete(id);
  }

  clearAll(): void {
    if (confirm('Delete all chat history?')) {
      this.store.clearAll();
    }
  }
}
