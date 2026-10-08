import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ChatWindowComponent } from './components/chat-window/chat-window.component';
import { ChatInputComponent } from './components/chat-input/chat-input.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ChatStoreService } from './services/chat-store.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    ChatWindowComponent,
    ChatInputComponent,
    SettingsComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  @ViewChild(ChatWindowComponent) chatWindow?: ChatWindowComponent;

  sidebarOpen = true;
  settingsOpen = false;

  // ThemeService is injected so the saved theme is applied at startup.
  constructor(public store: ChatStoreService, private theme: ThemeService) {}

  send(text: string): void {
    this.store.send(text, () => this.chatWindow?.scrollToBottom());
  }
}
