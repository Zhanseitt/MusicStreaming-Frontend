// src/MusicPlayer.tsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, Heart, Search, Home, Library, SkipBack, SkipForward, 
  Volume2, Volume1, VolumeX, Shuffle, Repeat, Plus, Trash2, Edit2, 
  LogOut, Zap, X, Sparkles, Disc, Mic, Sun, Moon, Maximize2, 
  Users, ShoppingBag, Link, AudioWaveform, Instagram, Twitter, Facebook,
  TrendingUp // 🔥 ДОБАВИТЬ ЕСЛИ НЕТ
} from 'lucide-react';


import ProfilePage from './ProfilePage';
import AuthPage from './AuthPage';
import AdminPage from './AdminPage';
import ArtistProfilePage from './ArtistProfilePage';
import ChartsPage from './ChartsPage';
import AlbumPage from './AlbumPage';
import GenrePage from './GenrePage';
import SearchPage from './SearchPage';
import LandingPage from './LandingPage';
import SubscriptionPage from './SubscriptionPage';
import SongPage from './SongPage';
import MerchPage from './MerchPage';
import WrappedModal from './WrappedModal';
import OnboardingModal from './OnboardingModal';
import { useAuth } from './context/AuthContext';
import type { User } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';

import api from './api/axios';

export interface LyricLine {
  time: number;
  text: string;
}

export interface Song {
  id: number;
  title: string;
  artist: any;
  artist_id?: number;
  album?: string;
  duration: string;
  cover: string;
  audioUrl: string;
  lyrics?: LyricLine[];
  color?: string;
}

export interface MockTrack {
  title?: string;
  name?: string;
  artist: string;
  cover: string;
}

type PlaylistColor =
  | 'bg-red-600'
  | 'bg-blue-600'
  | 'bg-green-600'
  | 'bg-yellow-600'
  | 'bg-indigo-600'
  | 'bg-pink-600';

const availableColors: PlaylistColor[] = [
  'bg-red-600',
  'bg-blue-600',
  'bg-green-600',
  'bg-yellow-600',
  'bg-indigo-600',
  'bg-pink-600'
];

interface UserPlaylist {
  id: number;
  name: string;
  color: PlaylistColor;
  songs: (number | string)[];
  isCollaborative?: boolean;
}

// ======== ЖИВАЯ МУЗЫКАЛЬНАЯ АНИМАЦИЯ ФОНА (исправлено) ========
export const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      o: number;
      color: string;
      angle: number;
      pulseSpeed: number;
    }> = [];

    // Музыкальные цвета
    const colors = [
      'rgba(129, 140, 248, ', // indigo-400
      'rgba(167, 139, 250, ', // purple-400
      'rgba(196, 181, 253, ', // purple-300
      'rgba(147, 197, 253, ', // blue-300
    ];

    const createParticles = () => {
      particles.length = 0;
      const { width, height } = canvas;
      
      const count = Math.floor((width * height) / 20000);
      
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 2.5 + 0.8,
          o: Math.random() * 0.4 + 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
          angle: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.03
        });
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (particles.length === 0) {
        createParticles();
      }
    };

    resize();
    createParticles();
    window.addEventListener('resize', resize);

    let animationId: number;
    let time = 0;

    const draw = () => {
      const { width, height } = canvas;
      time += 0.01;

      // Более тёмный фон
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#010108');
      gradient.addColorStop(0.5, '#0a0a1a');
      gradient.addColorStop(1, '#010108');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Рисуем частицы с музыкальным эффектом
      for (const p of particles) {
        // Пульсация как звуковые волны
        const pulse = Math.sin(time * p.pulseSpeed + p.angle) * 0.5 + 0.5;
        const currentR = p.r * (1 + pulse * 0.3);
        const currentO = p.o * (0.7 + pulse * 0.3);

        p.x += p.vx;
        p.y += p.vy;

        // Зацикливание
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Свечение вокруг частицы
        const glowGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentR * 4);
        glowGradient.addColorStop(0, p.color + currentO + ')');
        glowGradient.addColorStop(0.4, p.color + (currentO * 0.4) + ')');
        glowGradient.addColorStop(1, p.color + '0)');

        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentR * 4, 0, Math.PI * 2);
        ctx.fill();

        // Яркое ядро
        ctx.fillStyle = p.color + (currentO + 0.2) + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentR, 0, Math.PI * 2);
        ctx.fill();
      }

      // Редкие тонкие связи (без эффекта ДНК)
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        let connectionCount = 0;
        
        for (let j = i + 1; j < particles.length; j++) {
          if (connectionCount >= 2) break;
          
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const alpha = 0.08 * (1 - dist / 120);
            
            ctx.strokeStyle = p1.color + alpha + ')';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            
            connectionCount++;
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{ background: '#010108' }}
    />
  );
};


// ======== ВИЗУАЛИЗАТОР ========
const YandexVisualizer: React.FC<{
  isPlaying: boolean;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  variant?: 'mini' | 'full';
}> = ({ isPlaying, audioRef, variant = 'mini' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!audioRef.current || analyserRef.current) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioCtx();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaElementSource(audioRef.current);

      source.connect(analyser);
      analyser.connect(audioContext.destination);

      analyser.fftSize = variant === 'full' ? 512 : 128;
      analyser.smoothingTimeConstant = 0.8;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;
    } catch (e) {
      console.log('AudioContext error:', e);
    }
  }, [audioRef, variant]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;

    if (!canvas || !analyser || !dataArray) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;

      if (!isPlaying) {
        ctx.clearRect(0, 0, width, height);
        const barCount = variant === 'full' ? 100 : 40;
        const barWidth = width / barCount - 2;
        for (let i = 0; i < barCount; i++) {
          const barHeight = 4;
          const x = i * (barWidth + 2);
          const y = (height - barHeight) / 2;
          ctx.fillStyle = 'rgba(139, 92, 246, 0.3)';
          ctx.fillRect(x, y, barWidth, barHeight);
        }
        animationIdRef.current = requestAnimationFrame(draw);
        return;
      }

      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, width, height);

      const barCount = variant === 'full' ? 100 : 40;
      const barWidth = width / barCount - 2;

      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor(i * (dataArray.length / barCount));
        const value = dataArray[dataIndex];
        const barHeight = (value / 255) * height * 0.7;
        const x = i * (barWidth + 2);
        const y = (height - barHeight) / 2;

        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
        const intensity = value / 255;

        if (variant === 'full') {
          gradient.addColorStop(0, `rgba(139, 92, 246, ${0.8 + intensity * 0.2})`);
          gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.9)');
          gradient.addColorStop(1, `rgba(139, 92, 246, ${0.8 + intensity * 0.2})`);
        } else {
          gradient.addColorStop(0, 'rgba(139, 92, 246, 0.9)');
          gradient.addColorStop(1, 'rgba(168, 85, 247, 0.9)');
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);

        if (variant === 'full' && intensity > 0.5) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(168, 85, 247, 0.5)';
          ctx.fillRect(x, y, barWidth, barHeight);
          ctx.shadowBlur = 0;
        }
      }

      animationIdRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isPlaying, variant]);

  if (variant === 'full') {
    return (
      <canvas
        ref={canvasRef}
        width={1200}
        height={200}
        className="w-full h-full rounded-2xl"
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={48}
      className="w-50 h-12"
    />
  );
};

// Helper для имени артиста
const getArtistName = (artist: any): string => {
  if (typeof artist === 'string') return artist;
  if (artist && typeof artist === 'object' && artist.name) return artist.name;
  return 'Unknown Artist';
};

// ======== ОСНОВНОЙ КОМПОНЕНТ ========
export default function MusicPlayer() {
  const { isLoggedIn, logout, user, login } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [songs, setSongs] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSong = songs[currentIndex] || null;

  const [isLoadingSongs, setIsLoadingSongs] = useState(true);

  useEffect(() => {
    api
      .get('/songs')
      .then((res: any) => {
        const data = Array.isArray(res.data) ? res.data : res;
        setSongs(data as Song[]);
      })
      .catch(console.error)
      .finally(() => setIsLoadingSongs(false));
  }, []);
  // Pre-login
  const [preLoginView, setPreLoginView] = useState<'landing' | 'auth' | 'subscription'>('landing');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [tempUser, setTempUser] = useState<User | null>(null);
  const [currency, setCurrency] = useState<'USD' | 'KZT'>('USD');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleDirectLogin = () => {
    setSelectedPlan(null);
    setAuthMode('login');
    setPreLoginView('auth');
  };

  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan);
    setAuthMode('register');
    setPreLoginView('auth');
  };

  const handleAuthSuccess = (newUser: User) => {
    if (!selectedPlan || selectedPlan === 'free') {
      if (authMode === 'register') {
        setTempUser(newUser);
        setShowOnboarding(true);
      } else {
        login(newUser);
      }
    } else {
      setTempUser(newUser);
      setPreLoginView('subscription');
    }
  };

  const handleSubscriptionComplete = () => {
    if (tempUser) login(tempUser);
    setShowOnboarding(true);
  };

  const handleOnboardingFinish = () => {
    if (tempUser && !isLoggedIn) login(tempUser);
    setShowOnboarding(false);
  };

  // Плеер
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlistQueue, setPlaylistQueue] = useState<Song[]>([]);
  const [history, setHistory] = useState<Song[]>([]);
  const [activeTab, setActiveTab] = useState('home');
  const [likedSongs, setLikedSongs] = useState<Set<number | string>>(new Set());
  const [likedArtists, setLikedArtists] = useState<Set<string>>(new Set());
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [volume, setVolume] = useState(0.8);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCollaborative, setIsCollaborative] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState<UserPlaylist[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<UserPlaylist | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState<PlaylistColor>(availableColors[0]);
  const [currentPlaylistView, setCurrentPlaylistView] = useState<UserPlaylist | null>(null);
  const [showAddSongModal, setShowAddSongModal] = useState(false);

  const [currentArtistView, setCurrentArtistView] = useState<MockTrack | null>(null);
  const [currentAlbumView, setCurrentAlbumView] = useState<Song | null>(null);
  const [currentGenreView, setCurrentGenreView] = useState<string | null>(null);
  const [showWrapped, setShowWrapped] = useState(false);
  const [showJamModal, setShowJamModal] = useState(false);

  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    audioRef.current.src = currentSong.audioUrl || '';
    audioRef.current.volume = volume;

    if (isPlaying) {
      audioRef.current.play().catch((e) => console.log('Audio play error:', e));
    } else {
      audioRef.current.pause();
    }
  }, [currentSong, isPlaying, volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSetTime = (t: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = t;
      setCurrentTime(t);
      setIsPlaying(true);
    }
  };

  const formatTime = (t: number) => {
    if (isNaN(t)) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const getIndexInQueue = (song: Song, queue: Song[]) =>
    queue.findIndex((s) => s.id === song.id);

  const playSong = (song: Song, newQueue?: Song[]) => {
    if (!song) return;
    setPlaylistQueue((prevQueue) => {
      const queue = newQueue ?? (prevQueue.length ? prevQueue : songs);
      const idx = getIndexInQueue(song, queue);
      setCurrentIndex(idx >= 0 ? idx : 0);
      return queue;
    });
    setIsPlaying(true);
    setHistory((prev) => {
      if (prev[0]?.id === song.id) return prev;
      return [song, ...prev.slice(0, 20)];
    });
  };

  const playNext = () => {
    setCurrentIndex((prevIndex) => {
      const queue = playlistQueue.length ? playlistQueue : songs;
      if (!queue.length) return 0;
      if (isShuffle) {
        return Math.floor(Math.random() * queue.length);
      }
      const idx = getIndexInQueue(currentSong ?? queue[prevIndex], queue);
      return (idx + 1) % queue.length;
    });
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentIndex((prevIndex) => {
      const queue = playlistQueue.length ? playlistQueue : songs;
      if (!queue.length) return 0;
      const idx = getIndexInQueue(currentSong ?? queue[prevIndex], queue);
      return (idx - 1 + queue.length) % queue.length;
    });
    setIsPlaying(true);
  };

  const togglePlayPause = () => setIsPlaying((p) => !p);

  const toggleLike = (id: number | string | 'current') => {
    if (!currentSong && id === 'current') return;
    const songId = id === 'current' ? String(currentSong!.id) : String(id);
    setLikedSongs((prev) => {
      const s = new Set(prev);
      s.has(songId) ? s.delete(songId) : s.add(songId);
      return s;
    });
  };

  const toggleArtistLike = (name: string) => {
    setLikedArtists((prev) => {
      const s = new Set(prev);
      s.has(name) ? s.delete(name) : s.add(name);
      return s;
    });
  };

  const handleProfileClick = () => {
    setIsProfileVisible(true);
    setActiveTab('profile');
  };

  const handleHomeClick = () => {
    setActiveTab('home');
    setIsProfileVisible(false);
  };

  const startListening = () => {
    setActiveTab('tracks');
    setIsProfileVisible(false);
  };

  const openArtistView = (artist: MockTrack) => {
    setCurrentArtistView(artist);
    setActiveTab('artistProfile');
  };

  const openAlbumView = (song: Song) => {
    setCurrentAlbumView(song);
    setActiveTab('albumView');
  };

  const openGenreView = (name: string) => {
    setCurrentGenreView(name);
    setActiveTab('genreView');
  };



  const startSearch = () => {
    if (activeTab !== 'search') {
      setActiveTab('search');
      setIsProfileVisible(false);
    }
  };

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) return;
    const newPlaylist: UserPlaylist = {
      id: Date.now(),
      name: newPlaylistName.trim(),
      color: availableColors[Math.floor(Math.random() * availableColors.length)],
      songs: [],
      isCollaborative
    };
    setUserPlaylists((prev) => [...prev, newPlaylist]);
    setShowPlaylistModal(false);
    setNewPlaylistName('');
    setIsCollaborative(false);
    setActiveTab('library');
  };

  const handleDeletePlaylist = (id: number) => {
    if (!window.confirm('Удалить плейлист?')) return;
    setUserPlaylists((prev) => prev.filter((p) => p.id !== id));
  };

  const openEditModal = (pl: UserPlaylist) => {
    setEditingPlaylist(pl);
    setEditName(pl.name);
    setEditColor(pl.color);
    setShowEditModal(true);
  };

  const handleEditPlaylist = () => {
    if (!editingPlaylist || !editName.trim()) return;
    setUserPlaylists((prev) =>
      prev.map((p) =>
        p.id === editingPlaylist.id ? { ...p, name: editName.trim(), color: editColor } : p
      )
    );
    setShowEditModal(false);
    setEditingPlaylist(null);
  };

  const openPlaylistView = (pl: UserPlaylist) => {
    setCurrentPlaylistView(pl);
    setActiveTab('playlistView');
  };

  const addSongToPlaylist = (playlistId: number, songId: number | string) => {
    setUserPlaylists((prev) =>
      prev.map((p) =>
        p.id === playlistId && !p.songs.includes(songId) ? { ...p, songs: [...p.songs, songId] } : p
      )
    );
    if (currentPlaylistView?.id === playlistId) {
      setCurrentPlaylistView((prev) =>
        prev ? { ...prev, songs: [...prev.songs, songId] } : null
      );
    }
  };

  const removeSongFromPlaylist = (playlistId: number, songId: number | string) => {
    setUserPlaylists((prev) =>
      prev.map((p) =>
        p.id === playlistId ? { ...p, songs: p.songs.filter((id) => id !== songId) } : p
      )
    );
    if (currentPlaylistView?.id === playlistId) {
      setCurrentPlaylistView((prev) =>
        prev ? { ...prev, songs: prev.songs.filter((id) => id !== songId) } : null
      );
    }
  };
  // MOCK данные
  const mockSongs: Song[] = [
    { id: 1, title: "Blinding Lights", artist: "The Weeknd", album: "After Hours", duration: "3:20", cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&fit=crop", audioUrl: "" },
    { id: 2, title: "Starboy", artist: "The Weeknd", album: "Starboy", duration: "3:50", cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=300&fit=crop", audioUrl: "" },
    { id: 3, title: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia", duration: "3:23", cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&fit=crop", audioUrl: "" },
    { id: 4, title: "Save Your Tears", artist: "The Weeknd", album: "After Hours", duration: "3:35", cover: "https://images.unsplash.com/photo-1619983081563-430f63602796?w=300&fit=crop", audioUrl: "" },
    { id: 5, title: "Peaches", artist: "Justin Bieber", album: "Justice", duration: "3:18", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&fit=crop", audioUrl: "" },
    { id: 6, title: "Good 4 U", artist: "Olivia Rodrigo", album: "SOUR", duration: "2:58", cover: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?w=300&fit=crop", audioUrl: "" },
  ];

  const mockArtists: MockTrack[] = [
    { name: "The Weeknd", artist: "Pop", cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&fit=crop" },
    { name: "Dua Lipa", artist: "Pop", cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&fit=crop" },
    { name: "Justin Bieber", artist: "Pop", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&fit=crop" },
  ];

  const mockGenres = [
    { name: 'Rock', gradient: 'from-red-900 to-orange-800' },
    { name: 'Pop', gradient: 'from-pink-900 to-purple-800' },
    { name: 'Hip-Hop', gradient: 'from-yellow-900 to-orange-800' },
    { name: 'Electronic', gradient: 'from-cyan-900 to-blue-800' },
  ];

  const mockMixes = [
    { title: 'Daily Mix 1', desc: 'The Weeknd, Dua Lipa и другие', color: 'from-indigo-600 to-purple-600', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&fit=crop' },
    { title: 'Chill Hits', desc: 'Расслабься и наслаждайся', color: 'from-green-600 to-teal-600', img: '' },
  ];

  const mockNewReleases: Song[] = mockSongs.slice(0, 4);

  const mockPodcasts = [
    { title: 'Tech Talk', host: 'John Doe', cover: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=300&fit=crop' },
    { title: 'Music Matters', host: 'Jane Smith', cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&fit=crop' },
  ];

  // Компоненты
  const Section: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        {icon && <div className="text-indigo-600 dark:text-indigo-400">{icon}</div>}
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">{title}</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
        {children}
      </div>
    </section>
  );

  const Card: React.FC<{
    title?: string;
    name?: string;
    subtitle: string;
    cover: string;
    isRound?: boolean;
    onClick?: () => void;
    onAuxClick?: (e: React.MouseEvent) => void;
  }> = ({ title, name, subtitle, cover, isRound, onClick, onAuxClick }) => (
    <div
      className="flex-shrink-0 w-48 group cursor-pointer transition-all hover:bg-white/5 p-4 rounded-lg"
      onClick={onClick}
      onAuxClick={onAuxClick}
    >
      <div className={`relative ${isRound ? 'rounded-full' : 'rounded-lg'} overflow-hidden shadow-xl mb-4 aspect-square bg-zinc-900`}>
        <img
          src={cover}
          alt={title || name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
            <Play size={20} fill="white" className="text-white ml-0.5" />
          </button>
        </div>
      </div>
      <div className="font-bold text-white truncate mb-1">{title || name}</div>
      <div className="text-xs text-gray-400 truncate">{subtitle}</div>
    </div>
  );

  const PlaylistView: React.FC<{ playlist: UserPlaylist }> = ({ playlist }) => {
    const songsInPlaylist = songs.filter((song) => playlist.songs.includes(song.id));

    return (
      <div className="p-8 animate-fade-in">
        <div className="flex items-end mb-8">
          <div className={`w-48 h-48 rounded-xl shadow-2xl mr-6 ${playlist.color} opacity-90`}></div>
          <div>
            <p className="text-sm text-indigo-500 dark:text-indigo-300 font-semibold uppercase flex items-center gap-2">
              {playlist.isCollaborative && (
                <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Users size={10} />
                  Совместный
                </span>
              )}
              Плейлист
            </p>
            <h1 className="text-6xl font-extrabold mb-2 text-zinc-900 dark:text-white">{playlist.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">{playlist.songs.length} треков</p>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => songsInPlaylist[0] && playSong(songsInPlaylist[0], songsInPlaylist)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold flex items-center hover:bg-indigo-700 transition shadow-lg"
          >
            <Play fill="white" size={24} className="mr-2" />
            Воспроизвести
          </button>
          <button
            onClick={() => setShowAddSongModal(true)}
            className="bg-white text-black border border-gray-300 hover:bg-gray-100 dark:bg-white/10 dark:text-white dark:border-white/10 dark:hover:bg-white/20 px-6 py-3 rounded-full flex items-center transition"
          >
            <Plus size={20} className="mr-2" />
            Добавить треки
          </button>
          <button
            onClick={() => openEditModal(playlist)}
            className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-white"
          >
            <Edit2 size={20} />
          </button>
          <button
            onClick={() => handleDeletePlaylist(playlist.id)}
            className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
          >
            <Trash2 size={20} />
          </button>
        </div>

        <div className="space-y-2">
          {songsInPlaylist.map((song, index) => (
            <div
              key={song.id}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-100 border border-transparent hover:border-gray-200 dark:hover:bg-white/10 dark:hover:border-white/10 transition group cursor-pointer"
              onClick={() => playSong(song, songsInPlaylist)}
            >
              <span className="w-4 text-indigo-600 dark:text-indigo-400">{index + 1}</span>
              <img src={song.cover} alt={song.title} className="w-12 h-12 rounded" />
              <div className="flex-1">
                <h3 className="font-medium text-zinc-900 dark:text-white">{song.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{getArtistName(song.artist)}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeSongFromPlaylist(playlist.id, song.id);
                }}
                className="mr-4 text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
              >
                <X size={20} />
              </button>
              <span className="text-sm text-gray-500 dark:text-gray-400 w-12 text-right">{song.duration}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

// MAIN CONTENT LOGIC (исправлено: добавлен let mainContent)
let mainContent: React.ReactNode;

if (user?.role === 'admin') {
  mainContent = <AdminPage />;
} else if (user?.role === 'artist') {
  mainContent = <ArtistProfilePage artistName={user.name} cover="" />;
} else if (isProfileVisible) {
  // 🔥 ИСПРАВЛЕНИЕ: Защита от undefined и songs.filter is not a function
  const safeSongs = Array.isArray(songs) ? songs : [];
  const safeHistory = Array.isArray(history) ? history : [];
  
  mainContent = (
    <ProfilePage
      likedSongs={safeSongs.filter((s) => likedSongs.has(String(s.id)))}
      likedArtists={Array.from(likedArtists)}
      history={safeHistory}
      playSong={(song) => playSong(song, safeSongs)}
    />
  );
} else if (activeTab === 'home') {
  const greeting =
    new Date().getHours() < 12
      ? 'Доброе утро'
      : new Date().getHours() < 18
      ? 'Добрый день'
      : 'Добрый вечер';

  mainContent = (
    <div className="p-8 pb-24 animate-fade-in">
      <section className="mb-12">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-900/80 dark:to-red-900/80 rounded-2xl p-10 flex items-center justify-between shadow-2xl relative overflow-hidden backdrop-blur-md border border-white/10 group">
          <div className="absolute inset-0 bg-[url(https://www.transparenttextures.com/patterns/cubes.png)] opacity-10"></div>
          <div className="z-10 relative">
            <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white mb-3 backdrop-blur-sm">
              🔥 Персонально для тебя
            </div>
            <h2 className="text-5xl font-extrabold mb-3 text-white soft-text-shadow leading-tight">
              {greeting}, {user?.name}!
            </h2>
            <p className="text-indigo-100 mb-8 text-lg max-w-md">
              Откройте для себя новую музыку и наслаждайтесь любимыми треками
            </p>
            <div className="flex gap-4">
              <button
                onClick={startListening}
                className="bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition transform shadow-xl hover:shadow-white/20 flex items-center gap-2"
              >
                <Play size={20} fill="black" />
                Начать слушать
              </button>
              <button
                onClick={() => setShowWrapped(true)}
                className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition shadow-lg flex items-center gap-2"
              >
                <Sparkles size={20} />
                Wrapped 2025
              </button>
            </div>
          </div>
        </div>
      </section>

  
 


        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {mockSongs.slice(0, 6).map((song) => (
              <div
                key={song.id}
                onClick={() => playSong(song, mockSongs)}
                className="group relative flex items-center w-full h-20 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md bg-white hover:bg-zinc-50 border border-gray-200 hover:border-gray-300 dark:bg-white/5 dark:hover:bg-white/20 dark:border-white/5 dark:hover:border-white/20 dark:shadow-none pr-4"
              >
                <img src={song.cover} className="w-20 h-20 object-cover" alt="" />
                <div className="flex flex-col justify-center px-4 flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-white/90 transition">
                    {song.title}
                  </h4>
                  <p className="text-xs font-medium truncate text-zinc-500 dark:text-zinc-400 mt-0.5">{getArtistName(song.artist)}</p>
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 bg-indigo-600 hover:bg-indigo-500">
                  <Play fill="white" size={18} className="text-white ml-1" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <Section title="Для вас" icon={<Sparkles size={24} />}>
          {mockMixes.map((mix, idx) => (
            <div
              key={idx}
              className={`flex flex-col justify-end w-48 h-48 p-5 rounded-xl cursor-pointer hover:scale-1.03 transition shadow-xl bg-gradient-to-br ${mix.color} border border-white/10 group flex-shrink-0 relative overflow-hidden`}
              onClick={() => playSong(mockSongs[0], mockSongs)}
            >
              {mix.img && (
                <img
                  src={mix.img}
                  className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition duration-700"
                  alt=""
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="z-10 relative">
                <h3 className="text-xl font-bold text-white leading-tight mb-1">{mix.title}</h3>
                <p className="text-xs text-gray-300 line-clamp-2">{mix.desc}</p>
              </div>
            </div>
          ))}
        </Section>

        <Section title="Популярное" icon={<Zap size={24} />}>
          {mockSongs.slice(0, 8).map((song) => (
            <Card
              key={song.id}
              title={song.title}
              subtitle={getArtistName(song.artist)}
              cover={song.cover}
              onClick={() => playSong(song, mockSongs)}
              onAuxClick={(e) => {
                e.preventDefault();
                openAlbumView(song);
              }}
            />
          ))}
        </Section>

        <Section title="Новые релизы" icon={<Disc size={24} />}>
          {mockNewReleases.map((song) => (
            <Card
              key={song.id}
              title={song.title}
              subtitle={getArtistName(song.artist)}
              cover={song.cover}
              onClick={() => playSong(song, mockNewReleases)}
            />
          ))}
        </Section>

        <Section title="Жанры">
          {mockGenres.map((genre, index) => (
            <div
              key={index}
              onClick={() => {
                setCurrentGenreView(genre.name);
                setActiveTab('genreView');
              }}
              className={`w-56 h-32 p-5 rounded-xl shadow-lg cursor-pointer hover:scale-1.03 transition duration-200 flex flex-col justify-start text-white font-bold bg-gradient-to-br ${genre.gradient} border border-transparent hover:border-white/20 flex-shrink-0 relative overflow-hidden`}
            >
              <h3 className="text-2xl relative z-10">{genre.name}</h3>
              <Disc className="absolute -bottom-4 -right-4 text-white/20 w-24 h-24 rotate-12" />
            </div>
          ))}
        </Section>

        <Section title="Подкасты" icon={<Mic size={24} />}>
          {mockPodcasts.map((pod, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-64 p-3 rounded-xl transition cursor-pointer group border bg-white shadow-sm hover:shadow-md border-gray-200 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/5 dark:shadow-none"
            >
              <img
                src={pod.cover}
                className="w-full aspect-video object-cover rounded-lg mb-3 shadow-md"
                alt={pod.title}
              />
              <h3 className="text-zinc-900 dark:text-white font-bold truncate">{pod.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{pod.host}</p>
            </div>
          ))}
        </Section>

        <Section title="Популярные артисты">
          {mockArtists.map((artist, index) => (
            <div key={index} className="relative group flex-shrink-0">
              <Card
                name={artist.name}
                subtitle={artist.artist}
                cover={artist.cover}
                isRound={true}
                onClick={() => openArtistView(artist)}
              />
              <button
                onClick={() => toggleArtistLike(artist.name!)}
                className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition hover:scale-110 hover:bg-black/70"
              >
                <Heart
                  size={18}
                  className={
                    likedArtists.has(artist.name!) ? 'fill-red-500 text-red-500' : 'text-white'
                  }
                />
              </button>
            </div>
          ))}
        </Section>
      </div>
    );
  } else if (activeTab === 'tracks') {
    mainContent = (
      <div className="p-8">
        <h2 className="text-4xl font-bold mb-8 text-zinc-900 dark:text-white">Все треки</h2>
        <div className="space-y-2">
          {mockSongs.map((song) => (
            <div
              key={song.id}
              className="flex items-center gap-4 p-3 rounded-xl transition group cursor-pointer border border-transparent hover:bg-white hover:border-gray-200 hover:shadow-sm dark:hover:bg-white/10 dark:hover:border-white/10 dark:hover:shadow-none"
              onClick={() => playSong(song, mockSongs)}
            >
              <img src={song.cover} alt={song.title} className="w-14 h-14 rounded-lg" />
              <div className="flex-1">
                <h3 className="font-medium text-zinc-900 dark:text-white">{song.title}</h3>
                <p className="text-sm text-indigo-600 dark:text-indigo-300">{getArtistName(song.artist)}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(song.id);
                }}
                className="mr-4 opacity-0 group-hover:opacity-100 transition"
              >
                <Heart
                  size={20}
                  className={`transition ${
                    likedSongs.has(String(song.id))
                      ? 'fill-red-500 text-red-500'
                      : 'text-gray-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                />
              </button>
              <span className="text-sm text-gray-500 dark:text-gray-400 w-12 text-right">{song.duration}</span>
            </div>
          ))}
        </div>
      </div>
    );
  } else if (activeTab === 'library') {
    mainContent = (
      <div className="p-8">
        <h2 className="text-4xl font-bold mb-8 text-zinc-900 dark:text-white">Моя библиотека</h2>
        <button
          onClick={() => setShowPlaylistModal(true)}
          className="mb-8 bg-indigo-600 text-white px-6 py-3 rounded-full font-bold hover:bg-indigo-700 transition flex items-center gap-2 shadow-lg"
        >
          <Plus size={20} />
          Создать плейлист
        </button>

        {userPlaylists.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {userPlaylists.map((playlist) => (
              <div
                key={playlist.id}
                className="relative p-4 rounded-xl shadow-xl cursor-pointer hover:scale-1.03 transition duration-200 group flex flex-col justify-end h-48 border border-transparent hover:border-white/20"
                style={{
                  backgroundColor: playlist.color
                    .replace('bg-', '')
                    .replace('red-600', '#dc2626')
                    .replace('blue-600', '#2563eb')
                    .replace('green-600', '#16a34a')
                    .replace('yellow-600', '#ca8a04')
                    .replace('indigo-600', '#4f46e5')
                    .replace('pink-600', '#db2777')
                }}
                onClick={() => openPlaylistView(playlist)}
              >
                <h3 className="text-xl font-bold mb-1 text-white">{playlist.name}</h3>
                <p className="text-xs text-gray-200">{playlist.songs.length} треков</p>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition backdrop-blur-sm bg-black/30 rounded-full p-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(playlist);
                    }}
                    className="p-1 text-white hover:text-indigo-300"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePlaylist(playlist.id);
                    }}
                    className="p-1 text-white hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-xl border bg-white border-gray-200 dark:bg-white/5 dark:border-white/10">
            <Library size={64} className="mx-auto mb-4 text-gray-400 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400">Пока нет плейлистов</p>
          </div>
        )}
      </div>
    );
  } else if (activeTab === 'playlistView' && currentPlaylistView) {
    mainContent = <PlaylistView playlist={currentPlaylistView} />;
  } else if (activeTab === 'artistProfile' && currentArtistView) {
    mainContent = <ArtistProfilePage artistName={currentArtistView.name!} cover={currentArtistView.cover} />;
  } else if (activeTab === 'charts') {
    mainContent = <ChartsPage />;
  } else if (activeTab === 'merch') {
    mainContent = <MerchPage />;
  } else if (activeTab === 'search') {
    mainContent = (
      <SearchPage
        searchTerm={searchTerm}
        playSong={playSong}
        openArtistView={openArtistView}
        openAlbumView={openAlbumView}
      />
    );
  } else if (activeTab === 'albumView' && currentAlbumView) {
    mainContent = <AlbumPage albumSong={currentAlbumView} onPlaySong={playSong} />;
  } else if (activeTab === 'genreView' && currentGenreView) {
    mainContent = (
      <GenrePage
        genreName={currentGenreView}
        openAlbumView={openAlbumView}
        playSong={playSong}
      />
    );
  } else if (activeTab === 'radio') {
    mainContent = <RadioPage playSong={playSong} />;
  }
  // === PRE-LOGIN ===
  if (!isLoggedIn) {
    return (
      <div className="h-screen w-screen bg-transparent text-zinc-900 dark:text-white flex flex-col overflow-hidden relative">
        {preLoginView === 'auth' ? (
          <AuthPage
            key={authMode}
            onBack={() => setPreLoginView('landing')}
            selectedPlan={selectedPlan}
            initialMode={authMode}
            onAuthSuccess={handleAuthSuccess}
          />
        ) : preLoginView === 'subscription' && tempUser ? (
          <SubscriptionPage
            plan={selectedPlan || 'Premium'}
            tempUser={tempUser}
            currency={currency}
            onConfirm={handleSubscriptionComplete}
            onCancel={() => setPreLoginView('landing')}
          />
        ) : (
          <LandingPage
            onSelectPlan={handlePlanSelect}
            onDirectLogin={handleDirectLogin}
            currency={currency}
            setCurrency={setCurrency}
          />
        )}
      </div>
    );
  }

  // === MAIN APP ===
  return (
    <div className="h-screen w-screen bg-transparent text-zinc-900 dark:text-white flex flex-col relative overflow-hidden font-sans">
      <audio
        ref={audioRef}
        src={currentSong?.audioUrl || undefined}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={playNext}
      />

      {showOnboarding && <OnboardingModal onFinish={handleOnboardingFinish} />}

      {isFullScreen && currentSong && (
        <SongPage
          song={currentSong}
          isPlaying={isPlaying}
          onPlayPause={togglePlayPause}
          onNext={playNext}
          onPrev={playPrev}
          onClose={() => setIsFullScreen(false)}
          currentTime={currentTime}
          duration={duration}
          onSeek={handleSeek}
          onSetTime={handleSetTime}
          volume={volume}
          onVolumeChange={setVolume}
          audioRef={audioRef}
        />
      )}

      <div className="flex flex-1 overflow-hidden z-20 relative">
        {/* SIDEBAR */}
        <div className="w-64 h-full flex flex-col flex-shrink-0 transition-colors backdrop-blur-xl border-r bg-white/80 border-gray-200 dark:bg-black/30 dark:border-white/10">
          <div className="p-6 pb-8">
            <div className="flex items-center gap-3 cursor-pointer" onClick={handleHomeClick}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white animate-fade-in">
                <AudioWaveform size={20} strokeWidth={2.5} />
              </div>
              <span className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">SoundWave</span>
            </div>
          </div>

          <nav className="px-3 space-y-2">
            {[
              { id: 'home', label: 'Главная', icon: Home },
              { id: 'search', label: 'Поиск', icon: Search },
              { id: 'charts', label: 'Чарты', icon: TrendingUp }, // 🔥 ДОБАВИТЬ
              { id: 'library', label: 'Библиотека', icon: Library },
              { id: 'merch', label: 'Мерч', icon: ShoppingBag },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'search') startSearch();
                  else {
                    setActiveTab(item.id);
                    setIsProfileVisible(false);
                  }
                }}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl w-full text-left transition-all duration-200 font-semibold ${
                  activeTab === item.id && !isProfileVisible
                    ? 'bg-zinc-200 text-zinc-900 dark:bg-white/20 dark:text-white'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-black dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white'
                }`}
              >
                <item.icon size={22} strokeWidth={2.5} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-8 px-6 flex-1 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-4 group">
              <h3 className="text-xs font-bold text-zinc-500 dark:text-gray-400 uppercase tracking-wider">Плейлисты</h3>
              <button
                onClick={() => setShowPlaylistModal(true)}
                className="text-gray-400 hover:text-indigo-600 dark:hover:text-white"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="overflow-y-auto space-y-1 pr-2 flex-1 pb-4 custom-scrollbar">
              <button
                onClick={() => {
                  setActiveTab('tracks');
                  setIsProfileVisible(false);
                }}
                className="flex items-center gap-3 px-2 py-2 w-full text-left rounded-lg mb-2 transition text-zinc-600 hover:bg-zinc-100 hover:text-black dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center shadow-md">
                  <Heart size={12} fill="white" className="text-white" />
                </div>
                <span className="text-sm font-medium truncate">Любимые треки</span>
              </button>

              {userPlaylists.map((playlist) => (
                <button
                  key={playlist.id}
                  onClick={() => openPlaylistView(playlist)}
                  className="w-full text-left py-2 px-2 text-sm rounded-lg transition truncate text-zinc-600 hover:bg-zinc-100 hover:text-black dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  {playlist.name}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t gap-2 flex flex-col bg-white/50 border-gray-200 dark:bg-black/20 dark:border-white/10">
            <div className="flex justify-center gap-6 pb-2 border-b border-gray-200 dark:border-white/10 mb-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-pink-600 dark:hover:text-pink-500 transition transform hover:scale-110"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-blue-400 dark:hover:text-blue-400 transition transform hover:scale-110"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-blue-700 dark:hover:text-blue-600 transition transform hover:scale-110"
              >
                <Facebook size={18} />
              </a>
            </div>

            <div className="flex justify-between items-center px-2">
              <span className="text-xs font-bold text-zinc-500 dark:text-gray-400">Тема</span>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full transition text-zinc-700 hover:bg-zinc-200 dark:text-gray-300 dark:hover:bg-white/10"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>

            <button
              onClick={handleProfileClick}
              className={`flex items-center gap-3 w-full p-2 rounded-lg transition hover:bg-zinc-200 dark:hover:bg-white/10 ${
                isProfileVisible ? 'bg-zinc-200 dark:bg-white/10' : ''
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm shadow-md text-white">
                {user?.initial || 'U'}
              </div>
              <div className="text-left overflow-hidden flex-1">
                <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{user?.name}</p>
                <p className="text-xs text-zinc-500 dark:text-gray-400">Premium</p>
              </div>
              <LogOut
                size={16}
                className="text-gray-400 hover:text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  logout();
                }}
              />
            </button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto bg-transparent relative custom-scrollbar">
          {activeTab === 'search' && (
            <div className="sticky top-0 z-30 p-6 backdrop-blur-xl border-b bg-white/80 border-gray-200 dark:bg-black/60 dark:border-white/10">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Что хотите послушать?"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 bg-white dark:bg-white/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-white text-zinc-900 dark:text-white placeholder-gray-400"
                  autoFocus
                />
              </div>
            </div>
          )}
          {mainContent}
        </main>
      </div>

      {/* FOOTER PLAYER */}
      {currentSong && (
        <footer className="w-full z-30 backdrop-blur-xl transition-colors h-24 flex flex-col justify-center px-6 py-4 border-t bg-white/90 border-gray-200 dark:bg-black/60 dark:border-white/10">
          <div className="flex items-center justify-between">
            {/* Left section - Song Info */}
            <div className="flex items-center gap-4 w-1/4">
              <div className="group">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <YandexVisualizer isPlaying={isPlaying} audioRef={audioRef} variant="mini" />
                  </div>

                  <div className="relative cursor-pointer" onClick={() => setIsFullScreen(true)}>
                    <img
                      src={currentSong.cover}
                      alt={currentSong.title}
                      className="w-14 h-14 rounded-md shadow-lg object-cover border border-gray-200 dark:border-white/5 group-hover:brightness-75 transition"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <Maximize2 className="text-white" size={20} />
                    </div>
                  </div>
                </div>

                <div className="overflow-hidden cursor-pointer" onClick={() => setIsFullScreen(true)}>
                  <h4 className="font-semibold text-zinc-900 dark:text-white truncate pr-2 text-sm hover:underline">
                    {currentSong.title}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-gray-400 truncate">{getArtistName(currentSong.artist)}</p>
                </div>

                <button onClick={() => toggleLike('current')}>
                  <Heart
                    size={20}
                    className={`transition ${
                      likedSongs.has(String(currentSong.id))
                        ? 'fill-red-500 text-red-500'
                        : 'text-zinc-400 hover:text-black dark:text-gray-400 dark:hover:text-white'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Center section - Controls */}
            <div className="flex flex-col items-center gap-2 w-2/4">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setIsShuffle(!isShuffle)}
                  className={`text-zinc-400 hover:text-black dark:text-gray-400 dark:hover:text-white transition ${
                    isShuffle ? 'text-indigo-600 dark:text-indigo-500' : ''
                  }`}
                >
                  <Shuffle size={18} />
                </button>

                <button
                  onClick={playPrev}
                  className="text-zinc-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition hover:scale-110"
                >
                  <SkipBack size={22} />
                </button>

                <button
                  onClick={togglePlayPause}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-105 transition shadow-lg bg-zinc-900 text-white dark:bg-white dark:text-black"
                >
                  {isPlaying ? (
                    <Pause fill="currentColor" size={20} />
                  ) : (
                    <Play fill="currentColor" className="ml-1" size={20} />
                  )}
                </button>

                <button
                  onClick={playNext}
                  className="text-zinc-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition hover:scale-110"
                >
                  <SkipForward size={22} />
                </button>

                <button
                  onClick={() => setIsRepeat(!isRepeat)}
                  className={`text-zinc-400 hover:text-black dark:text-gray-400 dark:hover:text-white transition ${
                    isRepeat ? 'text-indigo-600 dark:text-indigo-500' : ''
                  }`}
                >
                  <Repeat size={18} />
                </button>
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-3 w-full max-w-lg">
                <span className="text-xs text-zinc-500 dark:text-gray-400 font-mono w-8 text-right">
                  {formatTime(currentTime)}
                </span>
                <div
                  className="flex-1 h-1 bg-zinc-300 dark:bg-white/20 rounded-full overflow-hidden cursor-pointer group relative"
                  onClick={handleSeek}
                >
                  <div className="absolute inset-0 rounded-full bg-transparent group-hover:bg-black/5 dark:group-hover:bg-white/10"></div>
                  <div
                    className="h-full bg-indigo-600 dark:bg-white group-hover:bg-indigo-500 dark:group-hover:bg-indigo-400 transition-colors shadow relative"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <span className="text-xs text-zinc-500 dark:text-gray-400 font-mono w-8">{currentSong.duration}</span>
              </div>
            </div>

            {/* Right section - Volume & extras */}
            <div className="flex items-center gap-2 w-1/4 justify-end">
              <button
                onClick={() => setShowJamModal(true)}
                className="text-zinc-400 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-500 transition mr-2"
              >
                <Users size={20} />
              </button>

              <button onClick={() => setVolume((v) => (v === 0 ? 0.5 : 0))}>
                {volume === 0 ? (
                  <VolumeX size={20} className="text-zinc-400 hover:text-black dark:text-gray-400 dark:hover:text-white" />
                ) : volume < 0.5 ? (
                  <Volume1 size={20} className="text-zinc-400 hover:text-black dark:text-gray-400 dark:hover:text-white" />
                ) : (
                  <Volume2 size={20} className="text-zinc-400 hover:text-black dark:text-gray-400 dark:hover:text-white" />
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-24 h-1 bg-zinc-300 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-white"
              />
            </div>
          </div>
        </footer>
      )}

      {/* MODALS */}
      {showPlaylistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-200 dark:border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Создать плейлист</h2>
              <button
                onClick={() => setShowPlaylistModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition"
              >
                <X size={24} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Название плейлиста"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-xl mb-4 bg-white dark:bg-white/5 text-zinc-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              autoFocus
            />
            <label className="flex items-center gap-3 mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={isCollaborative}
                onChange={(e) => setIsCollaborative(e.target.checked)}
                className="w-5 h-5 rounded accent-indigo-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Совместный плейлист</span>
            </label>
            <div className="flex gap-3">
              <button
                onClick={handleCreatePlaylist}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-full font-bold hover:bg-indigo-700 transition"
              >
                Создать
              </button>
              <button
                onClick={() => setShowPlaylistModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 dark:bg-white/10 dark:text-white py-3 rounded-full font-bold hover:bg-gray-300 dark:hover:bg-white/20 transition"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingPlaylist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-200 dark:border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Редактировать</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition"
              >
                <X size={24} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Название"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-xl mb-4 bg-white dark:bg-white/5 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <div className="mb-6">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">Цвет</p>
              <div className="flex gap-3">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setEditColor(color)}
                    className={`w-10 h-10 rounded-full transition ${color} ${
                      editColor === color ? 'ring-4 ring-indigo-600 scale-110' : ''
                    }`}
                  ></button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleEditPlaylist}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-full font-bold hover:bg-indigo-700 transition"
              >
                Сохранить
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 dark:bg-white/10 dark:text-white py-3 rounded-full font-bold hover:bg-gray-300 dark:hover:bg-white/20 transition"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddSongModal && currentPlaylistView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl border border-gray-200 dark:border-white/10 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Добавить треки</h2>
              <button
                onClick={() => setShowAddSongModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition"
              >
                <X size={24} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              {mockSongs.map((song) => (
                <div
                  key={song.id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition"
                >
                  <img src={song.cover} alt={song.title} className="w-12 h-12 rounded" />
                  <div className="flex-1">
                    <h3 className="font-medium text-zinc-900 dark:text-white">{song.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{getArtistName(song.artist)}</p>
                  </div>
                  {currentPlaylistView.songs.includes(song.id) ? (
                    <button className="px-4 py-2 bg-gray-200 text-gray-500 dark:bg-white/10 dark:text-gray-400 rounded-full text-sm font-medium cursor-not-allowed">
                      Добавлено
                    </button>
                  ) : (
                    <button
                      onClick={() => addSongToPlaylist(currentPlaylistView.id, song.id)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 transition"
                    >
                      Добавить
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showJamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-200 dark:border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Jam Session</h2>
              <button
                onClick={() => setShowJamModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition"
              >
                <X size={24} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={40} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Слушайте вместе</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Пригласите друзей в совместную сессию</p>

              <div className="bg-gray-100 dark:bg-white/5 p-4 rounded-xl mb-6">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Код сессии</p>
                <p className="text-2xl font-black text-zinc-900 dark:text-white tracking-wider">
                  JAM-{Math.random().toString(36).substr(2, 6).toUpperCase()}
                </p>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setShowJamModal(false);
                }}
                className="w-full bg-green-600 text-white py-3 rounded-full font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
              >
                <Link size={20} />
                Скопировать ссылку
              </button>
            </div>
          </div>
        </div>
      )}

      {showWrapped && (
        <WrappedModal
          onClose={() => setShowWrapped(false)}
          topSongs={history.slice(0, 5)}
          topArtists={Array.from(new Set(history.map((s) => getArtistName(s.artist)))).slice(0, 5)}
          totalMinutes={history.length * 3.5}
          userName={user?.name ?? 'Меломан'}
        />
      )}
    </div>
  );
}
