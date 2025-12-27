import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';

// ==================== TYPESCRIPT ТИПЫ ====================
export interface Track {
  id: number;
  title: string;
  artist: string;
  artist_id: number;
  album?: string;
  cover: string;
  audioUrl: string;
  duration: string;
  is_liked?: boolean;
}

export interface Artist {
  id: number;
  name: string;
  cover: string;
  bio?: string;
  genre?: string;
}

export interface Album {
  id: number;
  title: string;
  cover: string;
  release_date?: string;
  artist_id: number;
}

export interface Playlist {
  id: number;
  name: string;
  description?: string;
  cover: string;
  user_id: number;
  songs?: Track[];
  songs_count: number;
  created_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role?: 'user' | 'artist' | 'admin';
  avatar_url?: string;
  plan?: 'free' | 'premium';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface SearchResponse {
  data: Track[];
}

// ==================== API CLIENT ====================

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      withCredentials: true
    });

    // Добавляем токен в каждый запрос
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Обработка ошибок
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
        }
        return Promise.reject(error);
      }
    );
  }

  // ==================== AUTH ====================

  async register(
    name: string,
    email: string,
    password: string,
    password_confirmation: string
  ): Promise<AuthResponse> {
    const { data } = await this.client.post<AuthResponse>('/register', {
      name,
      email,
      password,
      password_confirmation
    });
    localStorage.setItem('auth_token', data.token);
    return data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await this.client.post<AuthResponse>('/login', {
      email,
      password
    });
    localStorage.setItem('auth_token', data.token);
    return data;
  }

  async logout(): Promise<void> {
    try {
      await this.client.post('/logout');
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }

  async getMe(): Promise<User> {
    const { data } = await this.client.get<User>('/user');
    return data;
  }

  // ==================== TRACKS ====================

  async getTracks(): Promise<Track[]> {
    const { data } = await this.client.get<{ data: Track[] }>('/songs');
    return data.data;
  }

  async getTrack(id: number): Promise<Track> {
    const { data } = await this.client.get<Track>(`/songs/${id}`);
    return data;
  }

  async getTrending(): Promise<Track[]> {
    const { data } = await this.client.get<{ data: Track[] }>('/songs/trending');
    return data.data;
  }

  // ==================== ARTISTS ====================

  async getArtists(): Promise<Artist[]> {
    const { data } = await this.client.get<{ data: Artist[] }>('/artists');
    return data.data;
  }

  async getArtist(artistId: number): Promise<Artist> {
    const { data } = await this.client.get<Artist>(`/artists/${artistId}`);
    return data;
  }

  // ==================== SEARCH ====================

  async searchSongs(query: string): Promise<Track[]> {
    const { data } = await this.client.get<{ data: Track[] }>(
      `/songs/search?q=${encodeURIComponent(query)}`
    );
    return data.data;
  }

  async searchArtists(query: string): Promise<Artist[]> {
    const { data } = await this.client.get<{ data: Artist[] }>(
      `/artists/search?q=${encodeURIComponent(query)}`
    );
    return data.data;
  }

  async searchAlbums(query: string): Promise<Album[]> {
    const { data } = await this.client.get<{ data: Album[] }>(
      `/albums/search?q=${encodeURIComponent(query)}`
    );
    return data.data;
  }

  // ==================== LIKES ====================

  async toggleLike(songId: number): Promise<{ success: boolean; liked: boolean }> {
    const { data } = await this.client.post(`/songs/${songId}/like`);
    return data;
  }

  async getLikedSongs(): Promise<Track[]> {
    const { data } = await this.client.get<{ data: Track[] }>('/user/liked-songs');
    return data.data;
  }

  // ==================== PLAYLISTS ====================

  async getPlaylists(): Promise<Playlist[]> {
    const { data } = await this.client.get<{ data: Playlist[] }>('/playlists');
    return data.data;
  }

  async createPlaylist(name: string, description?: string): Promise<Playlist> {
    const { data } = await this.client.post<{ success: boolean; playlist: Playlist }>(
      '/playlists',
      { name, description }
    );
    return data.playlist;
  }

  async getPlaylist(playlistId: number): Promise<Playlist> {
    const { data } = await this.client.get<Playlist>(`/playlists/${playlistId}`);
    return data;
  }

  async updatePlaylist(playlistId: number, name: string, description?: string): Promise<Playlist> {
    const { data } = await this.client.put<{ success: boolean; playlist: Playlist }>(
      `/playlists/${playlistId}`,
      { name, description }
    );
    return data.playlist;
  }

  async deletePlaylist(playlistId: number): Promise<void> {
    await this.client.delete(`/playlists/${playlistId}`);
  }

  async addTrackToPlaylist(playlistId: number, song_id: number): Promise<void> {
    await this.client.post(`/playlists/${playlistId}/songs`, { song_id });
  }

  async removeTrackFromPlaylist(playlistId: number, songId: number): Promise<void> {
    await this.client.delete(`/playlists/${playlistId}/songs/${songId}`);
  }

  // ==================== HISTORY ====================

  async addToHistory(song_id: number): Promise<void> {
    await this.client.post('/user/history', { song_id });
  }

  async getHistory(): Promise<{ played_at: string; song: Track }[]> {
    const { data } = await this.client.get<{ data: { played_at: string; song: Track }[] }>(
      '/user/history'
    );
    return data.data;
  }

  async clearHistory(): Promise<void> {
    await this.client.delete('/user/history');
  }

  // ==================== STATS ====================

  async getUserStats(): Promise<{
    total_listens: number;
    liked_songs_count: number;
    playlists_count: number;
    top_artist: string;
    favorite_genre: string;
  }> {
    const { data } = await this.client.get('/user/stats');
    return data;
  }

  // ==================== DISCOVER ====================

  async getDailyMixes(): Promise<any[]> {
    const { data } = await this.client.get<{ data: any[] }>('/discover/daily-mixes');
    return data.data;
  }

  async getNewReleases(): Promise<Track[]> {
    const { data } = await this.client.get<{ data: Track[] }>('/discover/new-releases');
    return data.data;
  }

  async getForYou(): Promise<Track[]> {
    const { data } = await this.client.get<{ data: Track[] }>('/discover/for-you');
    return data.data;
  }

  async getAroundWorld(): Promise<Track[]> {
    const { data } = await this.client.get<{ data: Track[] }>('/discover/around-world');
    return data.data;
  }

  async getHiddenGems(): Promise<Track[]> {
    const { data } = await this.client.get<{ data: Track[] }>('/discover/hidden-gems');
    return data.data;
  }

  // ==================== CHARTS ====================

  async getGlobalCharts(): Promise<Track[]> {
    const { data } = await this.client.get<{ data: Track[] }>('/charts/global');
    return data.data;
  }

  // ==================== RAW METHODS ====================

  async get(url: string, config?: any) {
    return this.client.get(url, config);
  }

  async post(url: string, data?: any, config?: any) {
    return this.client.post(url, data, config);
  }

  async put(url: string, data?: any, config?: any) {
    return this.client.put(url, data, config);
  }

  async delete(url: string, config?: any) {
    return this.client.delete(url, config);
  }
}

const api = new ApiClient();
export default api;
