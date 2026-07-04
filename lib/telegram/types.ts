export interface TelegramPost {
  id: number;
  messageId: number;
  date: string;
  text: string;
  caption: string;
  hasMedia: boolean;
  mediaGroupId?: string;
  links: string[];
}

export interface TelegramFetchResult {
  posts: TelegramPost[];
  nextOffset: number | null;
  total: number;
}

export interface SyncResult {
  added: number;
  updated: number;
  skipped: number;
  errors: number;
  total: number;
  durationMs: number;
  details: SyncDetail[];
}

export interface SyncDetail {
  messageId: number;
  status: "added" | "updated" | "skipped" | "error";
  title?: string;
  error?: string;
}

export interface StoredPost {
  id: string;
  messageId: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  dateOriginal: string;
  image: string;
  links: string[];
  source: "telegram";
  createdAt: string;
  updatedAt: string;
}

export interface NormalizedPost {
  messageId: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  dateOriginal: string;
  image: string;
  links: string[];
  hasMedia: boolean;
}
