import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import {
  AiService,
  ApiConversation,
  ApiMessage,
  ChatResponse
} from './ai.service';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  error?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  messages: ChatMessage[];
}

@Injectable({ providedIn: 'root' })
export class ChatStoreService {
  conversations: Conversation[] = [];
  activeId: string | null = null;
  loading = false;
  typing = false;
  historyLoading = false;

  get busy(): boolean {
    return this.loading || this.typing;
  }

  constructor(private aiService: AiService) {
    this.loadConversations();
  }

  get active(): Conversation | undefined {
    return this.conversations.find(c => c.id === this.activeId);
  }

  loadConversations(): void {
    this.historyLoading = true;
    this.aiService.getConversations().subscribe({
      next: response => {
        this.conversations = (response.conversations || []).map(item =>
          this.mapConversation(item)
        );
        this.historyLoading = false;
      },
      error: error => {
        console.error('Unable to load conversations from the server.', error);
        this.historyLoading = false;
      }
    });
  }

  newChat(): void {
    this.activeId = null;
  }

  select(id: string): void {
    this.activeId = id;

    // Load the complete message history when a conversation is selected.
    this.aiService.getConversation(id).subscribe({
      next: response => {
        if (this.activeId !== id) {
          return;
        }

        const loaded = this.mapConversation(response.conversation);
        const index = this.conversations.findIndex(item => item.id === id);
        if (index >= 0) {
          this.conversations[index] = loaded;
        } else {
          this.conversations.unshift(loaded);
        }
      },
      error: error => {
        console.error('Unable to load this conversation.', error);
      }
    });
  }

  delete(id: string): void {
    this.aiService.deleteConversation(id).subscribe({
      next: () => {
        this.conversations = this.conversations.filter(c => c.id !== id);
        if (this.activeId === id) {
          this.activeId = null;
        }
      },
      error: error => {
        console.error('Unable to delete conversation.', error);
      }
    });
  }

  clearAll(): void {
    if (!this.conversations.length) {
      this.activeId = null;
      return;
    }

    const ids = this.conversations.map(conversation => conversation.id);
    forkJoin(ids.map(id => this.aiService.deleteConversation(id))).subscribe({
      next: () => {
        this.conversations = [];
        this.activeId = null;
      },
      error: error => {
        console.error('Unable to clear conversation history.', error);
        this.loadConversations();
      }
    });
  }

  /** Calls onUpdate after every change so the UI can scroll. */
  send(text: string, onUpdate: () => void): void {
    text = text.trim();
    if (!text || this.busy) {
      return;
    }

    this.loading = true;
    const existingConversation = this.active;

    if (existingConversation) {
      this.sendToConversation(existingConversation, text, onUpdate);
      return;
    }

    // A conversation is created on the server only when the first message is sent.
    const title = text.length > 40 ? text.substring(0, 40) + '...' : text;
    this.aiService.createConversation(title).subscribe({
      next: response => {
        const conversation = this.mapConversation(response.conversation);
        this.conversations.unshift(conversation);
        this.activeId = conversation.id;
        this.sendToConversation(conversation, text, onUpdate);
      },
      error: error => {
        console.error('Unable to create conversation.', error);
        this.loading = false;
        onUpdate();
      }
    });
  }

  private sendToConversation(
    target: Conversation,
    text: string,
    onUpdate: () => void
  ): void {
    target.messages.push({ role: 'user', content: text });
    this.loading = true;
    onUpdate();

    this.aiService.chat(text, target.id).subscribe({
      next: (response: ChatResponse) => {
        this.loading = false;
        if (response.success && response.answer) {
          this.typeOut(target, response.answer, onUpdate);
          this.loadConversations();
        } else {
          target.messages.push({
            role: 'assistant',
            content: response.message || response.error || 'Something went wrong.',
            error: true
          });
          onUpdate();
        }
      },
      error: error => {
        console.error(error);
        this.loading = false;
        target.messages.push({
          role: 'assistant',
          content: 'Unable to connect to AI server. Please try again.',
          error: true
        });
        onUpdate();
      }
    });
  }

  private typeOut(target: Conversation, full: string, onUpdate: () => void): void {
    const message: ChatMessage = { role: 'assistant', content: '' };
    target.messages.push(message);
    this.typing = true;

    // Longer answers reveal faster so they finish in a few seconds.
    const step = Math.max(2, Math.ceil(full.length / 150));
    const timer = setInterval(() => {
      message.content = full.substring(0, message.content.length + step);
      onUpdate();

      if (message.content.length >= full.length) {
        clearInterval(timer);
        this.typing = false;
        this.loadConversations();
      }
    }, 20);
  }

  private mapConversation(item: ApiConversation): Conversation {
    return {
      id: item.id,
      title: item.title,
      createdAt: Date.parse(item.created_at) || Date.now(),
      messages: (item.messages || []).map(message => this.mapMessage(message))
    };
  }

  private mapMessage(message: ApiMessage): ChatMessage {
    return {
      role: message.role,
      content: message.content
    };
  }
}
