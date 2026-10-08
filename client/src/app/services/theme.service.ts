import { Injectable } from '@angular/core';

export type Theme = 'light' | 'dark';

const THEME_KEY = 'elector-ai-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  theme: Theme = 'light';

  constructor() {
    const saved = localStorage.getItem(THEME_KEY);
    this.set(saved === 'dark' ? 'dark' : 'light');
  }

  set(theme: Theme): void {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }
}
