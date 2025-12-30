export interface User {
    name: string;
    email: string;
    initial: string;
    role: 'user' | 'admin' | 'artist';
}

export interface Song {
  id: number;
  title: string;
  // Артист может прийти как строка или как объект, обрабатываем это в коде
  artist: string | { name: string }; 
  artist_id?: number;
  album: string;
  duration: string;
  
  // ВАЖНО: API возвращает cover и audioUrl (не cover_url и audio_url)
  cover: string; 
  audioUrl: string; 
  
  // Опциональные поля для логики фронта
  lyrics?: { time: number; text: string }[];
  color?: string;
}

export interface Artist {
    id: number;
    name: string;
    // Поддержка разных вариантов ответа
    cover_url?: string; 
    cover?: string;
    artist?: string; 
}

export type PlaylistColor = 'bg-red-600' | 'bg-blue-600' | 'bg-green-600' | 'bg-yellow-600' | 'bg-indigo-600' | 'bg-pink-600';
export const availableColors: PlaylistColor[] = ['bg-red-600', 'bg-blue-600', 'bg-green-600', 'bg-yellow-600', 'bg-indigo-600', 'bg-pink-600'];

export interface UserPlaylist {
    id: number;
    name: string;
    color: PlaylistColor; 
    songs: (number | string)[]; // ID песен
    isCollaborative?: boolean;
}

// Для совместимости со старыми компонентами
export interface MockTrack {
    title?: string;
    name?: string; 
    artist: string; 
    cover: string;
}

// Админ-панель типы
export interface AdminStats {
    total_users: number;
    total_songs: number;
    total_artists: number;
    active_users: number;
}

export interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'admin' | 'artist';
    is_banned: boolean;
    created_at: string;
}

export interface Genre {
    id: number;
    name: string;
    created_at?: string;
}