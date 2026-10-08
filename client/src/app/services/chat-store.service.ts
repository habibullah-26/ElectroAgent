import { Injectable } from '@angular/core';
import { AiService, ChatResponse } from './ai.service';

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

const STORAGE_KEY = 'ai-chat-history';

@Injectable({ providedIn: 'root' })
export class ChatStoreService {
  conversations: Conversation[] = [];
  activeId: string | null = null;
  loading = false;
  typing = false;

  get busy(): boolean {
    return this.loading || this.typing;
  }
  constructor(private aiService: AiService) {
    try {
      this.conversations = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      this.conversations = [];
    }
  }

  get active(): Conversation | undefined {
    return this.conversations.find(c => c.id === this.activeId);
  }

  newChat(): void {
    this.activeId = null;
  }

  select(id: string): void {
    this.activeId = id;
  }

  delete(id: string): void {
    this.conversations = this.conversations.filter(c => c.id !== id);
    if (this.activeId === id) {
      this.activeId = null;
    }
    this.save();
  }

  clearAll(): void {
    this.conversations = [];
    this.activeId = null;
    this.save();
  }

  /** Calls onUpdate after every change so the UI can scroll. */
  send(text: string, onUpdate: () => void): void {
    text = text.trim();
    if (!text || this.busy) {
      return;
    }

    let convo = this.active;
    if (!convo) {
      convo = {
        id: Date.now().toString(),
        title: text.length > 40 ? text.substring(0, 40) + '...' : text,
        createdAt: Date.now(),
        messages: []
      };
      this.conversations.unshift(convo);
      this.activeId = convo.id;
    }

    const target = convo;
    target.messages.push({ role: 'user', content: text });
    this.loading = true;
    this.save();
    onUpdate();

    const reply = (content: string, error = false) => {
      this.loading = false;
      if (error) {
        target.messages.push({ role: 'assistant', content, error });
        this.save();
        onUpdate();
        return;
      }
      this.typeOut(target, content, onUpdate);
    };

    this.aiService.chat(text).subscribe({
      next: (res: ChatResponse) =>
        res.success
          ? reply(res.answer || '')
          : reply(res.message || 'Something went wrong.', true),
      error: (err) => {
        console.error(err);
        reply('Unable to connect to AI server.', true);
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
        this.save();
      }
    }, 20);
  }

  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.conversations));
  }
}
