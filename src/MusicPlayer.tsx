import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, Heart, Search, Home, Library, SkipBack, SkipForward, 
  Volume2, Volume1, VolumeX, Shuffle, Repeat, Plus, Trash2, Edit2, 
  LogOut, Zap, X, Sparkles, Disc, Mic, Sun, Moon, Maximize2, 
  Users, ShoppingBag, Link, AudioWaveform, Instagram, Twitter, Facebook,
  TrendingUp 
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

// --- TYPES ---
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

// ======== ЖИВАЯ МУЗЫКАЛЬНАЯ АНИМАЦИЯ ФОНА ========
export const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      r: number; o: number; color: string; angle: number; pulseSpeed: number;
    }> = [];

    const colors = [
      'rgba(129, 140, 248, ',
      'rgba(167, 139, 250, ',
      'rgba(196, 181, 253, ',
      'rgba(147, 197, 253, ',
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
      createParticles();
    };

    resize();
    window.addEventListener('resize', resize);

    let animationId: number;
    let time = 0;

    const draw = () => {
      if (!ctx || !canvas) return;
      const { width, height } = canvas;
      time += 0.01;

      ctx.clearRect(0, 0, width, height);
      
      if (theme === 'dark') {
          const gradient = ctx.createLinearGradient(0, 0, width, height);
          gradient.addColorStop(0, '#010108');
          gradient.addColorStop(0.5, '#0a0a1a');
          gradient.addColorStop(1, '#010108');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, width, height);
      } else {
          const gradient = ctx.createLinearGradient(0, 0, width, height);
          gradient.addColorStop(0, '#f3f4f6');
          gradient.addColorStop(1, '#e5e7eb');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, width, height);
      }

      const opacityMultiplier = theme === 'dark' ? 1 : 0.4;
      
      for (const p of particles) {
        const pulse = Math.sin(time * p.pulseSpeed + p.angle) * 0.5 + 0.5;
        const currentR = p.r * (1 + pulse * 0.3);
        const currentO = p.o * (0.7 + pulse * 0.3) * opacityMultiplier;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const glowGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentR * 4);
        glowGradient.addColorStop(0, p.color + currentO + ')');
        glowGradient.addColorStop(1, p.color + '0)');

        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentR * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = p.color + (currentO + 0.2) + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentR, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-10" />;
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
  const { theme } = useTheme();

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
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;
    } catch (e) {
      console.log('AudioContext init error (safe to ignore if autoplay blocked):', e);
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
      
      const baseColor = theme === 'dark' ? '139, 92, 246' : '99, 102, 241';

      if (!isPlaying) {
        ctx.clearRect(0, 0, width, height);
        const barCount = variant === 'full' ? 100 : 40;
        const barWidth = width / barCount - 2;
        for (let i = 0; i < barCount; i++) {
          const barHeight = 4;
          const x = i * (barWidth + 2);
          const y = (height - barHeight) / 2;
          ctx.fillStyle = `rgba(${baseColor}, 0.3)`;
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
        gradient.addColorStop(0, `rgba(${baseColor}, 0.9)`);
        gradient.addColorStop(1, `rgba(${baseColor}, 0.4)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
      }
      animationIdRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    };
  }, [isPlaying, variant, theme]);

  return <canvas ref={canvasRef} width={variant === 'full' ? 1200 : 200} height={variant === 'full' ? 200 : 48} className={variant === 'full' ? "w-full h-full rounded-2xl" : "w-50 h-12"} />;
};

const getArtistName = (artist: any): string => {
  if (typeof artist === 'string') return artist;
  if (artist && typeof artist === 'object' && artist.name) return artist.name;
  return 'Unknown Artist';
};
// ======== ГЛАВНЫЙ КОМПОНЕНТ ========
export default function MusicPlayer() {
  const { isLoggedIn, logout, user, login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // State
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSong = (Array.isArray(songs) && songs.length > 0) ? songs[currentIndex] : null;
  const [isLoadingSongs, setIsLoadingSongs] = useState(true);

  // Pre-login State
  const [preLoginView, setPreLoginView] = useState<'landing' | 'auth' | 'subscription'>('landing');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [tempUser, setTempUser] = useState<User | null>(null);
  const [currency, setCurrency] = useState<'USD' | 'KZT'>('USD');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Player State
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

  // Playlist Management
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

  // Views
  const [currentArtistView, setCurrentArtistView] = useState<MockTrack | null>(null);
  const [currentAlbumView, setCurrentAlbumView] = useState<Song | null>(null);
  const [currentGenreView, setCurrentGenreView] = useState<string | null>(null);
  const [showWrapped, setShowWrapped] = useState(false);
  const [showJamModal, setShowJamModal] = useState(false);

  // --- MOCK DATA ---
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

  // --- EFFECTS & HANDLERS ---
  useEffect(() => {
    // Используем правильный метод API для загрузки песен
    api.getTracks()
      .then((tracks) => {
        // Маппим Track[] в Song[] формат
        const mappedSongs: Song[] = tracks.map((track) => ({
          id: track.id,
          title: track.title,
          artist: track.artist, // Уже строка из API
          artist_id: track.artist_id,
          album: track.album || '',
          duration: track.duration || '0:00',
          cover: track.cover || 'https://via.placeholder.com/300',
          audioUrl: track.audioUrl || '',
          lyrics: [],
          color: undefined
        }));
        setSongs(mappedSongs.length > 0 ? mappedSongs : mockSongs);
      })
      .catch((err) => {
        console.error("Failed to load songs:", err);
        setSongs(mockSongs);
      })
      .finally(() => setIsLoadingSongs(false));
  }, []);

  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    
    // Устанавливаем источник аудио только если URL изменился
    const newSrc = currentSong.audioUrl || '';
    if (audioRef.current.src !== newSrc && newSrc) {
      audioRef.current.src = newSrc;
      // Сбрасываем время воспроизведения при смене трека
      audioRef.current.currentTime = 0;
    }
    
    audioRef.current.volume = volume;
    
    if (isPlaying && newSrc) {
      audioRef.current.play().catch((err) => {
        console.error("Ошибка воспроизведения:", err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [currentSong, isPlaying, volume]);

  const handleTimeUpdate = () => { if (audioRef.current) setCurrentTime(audioRef.current.currentTime); };
  const handleLoadedMetadata = () => { if (audioRef.current) setDuration(audioRef.current.duration); };
  
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

  const playSong = (song: Song, newQueue?: Song[]) => {
    if (!song) return;
    setPlaylistQueue((prev) => {
      const queue = newQueue ?? (prev.length ? prev : songs);
      const idx = queue.findIndex(s => s.id === song.id);
      setCurrentIndex(idx >= 0 ? idx : 0);
      return queue;
    });
    setIsPlaying(true);
    setHistory(prev => (prev[0]?.id === song.id ? prev : [song, ...prev.slice(0, 20)]));
  };

  const playNext = () => {
    setCurrentIndex(prev => {
        const queue = playlistQueue.length ? playlistQueue : songs;
        if (!queue.length) return 0;
        if (isShuffle) return Math.floor(Math.random() * queue.length);
        const idx = queue.findIndex(s => s.id === (currentSong?.id || queue[prev]?.id));
        return (idx + 1) % queue.length;
    });
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentIndex(prev => {
        const queue = playlistQueue.length ? playlistQueue : songs;
        if (!queue.length) return 0;
        const idx = queue.findIndex(s => s.id === (currentSong?.id || queue[prev]?.id));
        return (idx - 1 + queue.length) % queue.length;
    });
    setIsPlaying(true);
  };

  const togglePlayPause = () => setIsPlaying(p => !p);
  const toggleLike = (id: number | string | 'current') => {
    if (!currentSong && id === 'current') return;
    const songId = id === 'current' ? String(currentSong!.id) : String(id);
    setLikedSongs(prev => {
        const s = new Set(prev);
        s.has(songId) ? s.delete(songId) : s.add(songId);
        return s;
    });
  };
  const toggleArtistLike = (name: string) => {
    setLikedArtists(prev => {
        const s = new Set(prev);
        s.has(name) ? s.delete(name) : s.add(name);
        return s;
    });
  };

  // Nav Handlers
  const handleDirectLogin = () => { setSelectedPlan(null); setAuthMode('login'); setPreLoginView('auth'); };
  const handlePlanSelect = (plan: string) => { setSelectedPlan(plan); setAuthMode('register'); setPreLoginView('auth'); };
  const handleAuthSuccess = (newUser: User) => {
    if (!selectedPlan || selectedPlan === 'free') {
        if (authMode === 'register') { setTempUser(newUser); setShowOnboarding(true); } else login(newUser);
    } else { setTempUser(newUser); setPreLoginView('subscription'); }
  };
  const handleSubscriptionComplete = () => { if (tempUser) login(tempUser); setShowOnboarding(true); };
  const handleOnboardingFinish = () => { if (tempUser && !isLoggedIn) login(tempUser); setShowOnboarding(false); };

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) return;
    const newPl: UserPlaylist = { id: Date.now(), name: newPlaylistName.trim(), color: availableColors[Math.floor(Math.random()*availableColors.length)], songs: [], isCollaborative };
    setUserPlaylists(prev => [...prev, newPl]); setShowPlaylistModal(false); setNewPlaylistName(''); setIsCollaborative(false); setActiveTab('library');
  };
  const handleDeletePlaylist = (id: number) => { if (window.confirm('Удалить плейлист?')) setUserPlaylists(prev => prev.filter(p => p.id !== id)); };
  const openEditModal = (pl: UserPlaylist) => { setEditingPlaylist(pl); setEditName(pl.name); setEditColor(pl.color); setShowEditModal(true); };
  const handleEditPlaylist = () => {
    if (!editingPlaylist || !editName.trim()) return;
    setUserPlaylists(prev => prev.map(p => p.id === editingPlaylist.id ? { ...p, name: editName.trim(), color: editColor } : p));
    setShowEditModal(false); setEditingPlaylist(null);
  };
  const openPlaylistView = (pl: UserPlaylist) => { setCurrentPlaylistView(pl); setActiveTab('playlistView'); };
  const addSongToPlaylist = (plId: number, songId: number | string) => {
    setUserPlaylists(prev => prev.map(p => p.id === plId && !p.songs.includes(songId) ? { ...p, songs: [...p.songs, songId] } : p));
    if (currentPlaylistView?.id === plId) setCurrentPlaylistView(prev => prev ? { ...prev, songs: [...prev.songs, songId] } : null);
  };
  const removeSongFromPlaylist = (plId: number, songId: number | string) => {
    setUserPlaylists(prev => prev.map(p => p.id === plId ? { ...p, songs: p.songs.filter(id => id !== songId) } : p));
    if (currentPlaylistView?.id === plId) setCurrentPlaylistView(prev => prev ? { ...prev, songs: prev.songs.filter(id => id !== songId) } : null);
  };

  const openArtistView = (a: MockTrack) => { setCurrentArtistView(a); setActiveTab('artistProfile'); };
  const openAlbumView = (s: Song) => { setCurrentAlbumView(s); setActiveTab('albumView'); };
  const handleProfileClick = () => { setIsProfileVisible(true); setActiveTab('profile'); };
  const handleHomeClick = () => { setActiveTab('home'); setIsProfileVisible(false); };
  const startListening = () => { setActiveTab('tracks'); setIsProfileVisible(false); };
  const startSearch = () => { if (activeTab !== 'search') { setActiveTab('search'); setIsProfileVisible(false); } };

  // --- RENDER HELPERS ---
  const Section: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        {icon && <div className="text-indigo-600 dark:text-indigo-400">{icon}</div>}
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">{title}</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">{children}</div>
    </section>
  );

  const Card: React.FC<{ title?: string; name?: string; subtitle: string; cover: string; isRound?: boolean; onClick?: () => void; onAuxClick?: (e: React.MouseEvent) => void }> = ({ title, name, subtitle, cover, isRound, onClick, onAuxClick }) => (
    <div className="flex-shrink-0 w-48 group cursor-pointer transition-all hover:bg-white/50 p-4 rounded-xl border border-transparent hover:border-gray-200 dark:hover:bg-white/5 dark:hover:border-white/10" onClick={onClick} onAuxClick={onAuxClick}>
      <div className={`relative ${isRound ? 'rounded-full' : 'rounded-lg'} overflow-hidden shadow-lg mb-4 aspect-square bg-gray-200 dark:bg-zinc-800`}>
        <img src={cover} alt={title || name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
            <Play size={20} fill="white" className="text-white ml-0.5" />
          </button>
        </div>
      </div>
      <div className="font-bold text-zinc-900 dark:text-white truncate mb-1">{title || name}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{subtitle}</div>
    </div>
  );

  const PlaylistViewComp: React.FC<{ playlist: UserPlaylist }> = ({ playlist }) => {
    const safeSongs = Array.isArray(songs) ? songs : [];
    const songsInPl = safeSongs.filter(s => playlist.songs.includes(s.id));
    return (
      <div className="p-8 animate-fade-in">
        <div className="flex items-end mb-8">
          <div className={`w-48 h-48 rounded-xl shadow-2xl mr-6 ${playlist.color} opacity-90`}></div>
          <div>
            <p className="text-sm text-indigo-500 font-semibold uppercase flex items-center gap-2">
               Плейлист {playlist.isCollaborative && <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full"><Users size={10} /></span>}
            </p>
            <h1 className="text-6xl font-extrabold mb-2 text-zinc-900 dark:text-white">{playlist.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">{playlist.songs.length} треков</p>
          </div>
        </div>
        <div className="flex gap-4 mb-8">
          <button onClick={() => songsInPl[0] && playSong(songsInPl[0], songsInPl)} className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold flex items-center hover:bg-indigo-700 transition shadow-lg">
            <Play fill="white" size={24} className="mr-2" /> Воспроизвести
          </button>
          <button onClick={() => setShowAddSongModal(true)} className="bg-white text-black border border-gray-300 hover:bg-gray-100 dark:bg-white/10 dark:text-white dark:border-white/10 dark:hover:bg-white/20 px-6 py-3 rounded-full flex items-center transition">
            <Plus size={20} className="mr-2" /> Добавить
          </button>
          <button onClick={() => openEditModal(playlist)} className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-white"><Edit2 size={20} /></button>
          <button onClick={() => handleDeletePlaylist(playlist.id)} className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"><Trash2 size={20} /></button>
        </div>
        <div className="space-y-2">
          {songsInPl.map((song, i) => (
            <div key={song.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition group cursor-pointer" onClick={() => playSong(song, songsInPl)}>
              <span className="w-4 text-indigo-600 dark:text-indigo-400">{i + 1}</span>
              <img src={song.cover} alt={song.title} className="w-12 h-12 rounded" />
              <div className="flex-1"><h3 className="font-medium text-zinc-900 dark:text-white">{song.title}</h3><p className="text-sm text-gray-500 dark:text-gray-400">{getArtistName(song.artist)}</p></div>
              <button onClick={(e) => { e.stopPropagation(); removeSongFromPlaylist(playlist.id, song.id); }} className="mr-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"><X size={20} /></button>
              <span className="text-sm text-gray-500 dark:text-gray-400 w-12 text-right">{song.duration}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // --- MAIN CONTENT LOGIC (С ЗАЩИТОЙ ОТ КРАША) ---
  let mainContent: React.ReactNode;
  
  if (user?.role === 'admin') {
    mainContent = <AdminPage />;
  }
  else if (user?.role === 'artist') {
    mainContent = <ArtistProfilePage artistName={user.name} cover="" />;
  }
  else if (isProfileVisible) {
    // ЗАЩИТА: Проверяем, что songs - массив
    const safeSongs = Array.isArray(songs) ? songs : [];
    const userLikedSongs = safeSongs.filter(s => likedSongs.has(String(s.id)));
    
    mainContent = (
      <ProfilePage 
        likedSongs={userLikedSongs} 
        likedArtists={Array.from(likedArtists)} 
        history={history} 
        playSong={playSong} 
      />
    );
  }
  else if (activeTab === 'home') {
    const greeting = new Date().getHours() < 12 ? 'Доброе утро' : new Date().getHours() < 18 ? 'Добрый день' : 'Добрый вечер';
    mainContent = (
      <div className="p-8 pb-24 animate-fade-in">
        <section className="mb-12">
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-900 dark:to-indigo-950 rounded-2xl p-10 flex items-center justify-between shadow-xl relative overflow-hidden">
            <div className="z-10 relative">
              <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white mb-3 backdrop-blur-sm">🔥 Персонально для тебя</div>
              <h2 className="text-5xl font-extrabold mb-3 text-white">{greeting}, {user?.name}!</h2>
              <p className="text-indigo-100 mb-8 text-lg max-w-md">Откройте для себя новую музыку</p>
              <div className="flex gap-4">
                <button onClick={startListening} className="bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition shadow-lg flex items-center gap-2"><Play size={20} fill="black" /> Слушать</button>
                <button onClick={() => setShowWrapped(true)} className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition shadow-lg flex items-center gap-2"><Sparkles size={20} /> Wrapped 2025</button>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {mockSongs.slice(0, 6).map((song) => (
              <div key={song.id} onClick={() => playSong(song, mockSongs)} className="group relative flex items-center w-full h-20 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md bg-white border border-gray-100 hover:border-gray-200 dark:bg-white/5 dark:border-transparent dark:hover:bg-white/10 pr-4">
                <img src={song.cover} className="w-20 h-20 object-cover" alt="" />
                <div className="flex flex-col justify-center px-4 flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-white">{song.title}</h4>
                  <p className="text-xs font-medium truncate text-zinc-500 dark:text-zinc-400 mt-0.5">{getArtistName(song.artist)}</p>
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 bg-indigo-600"><Play fill="white" size={18} className="text-white ml-1" /></div>
              </div>
            ))}
          </div>
        </section>

        <Section title="Для вас" icon={<Sparkles size={24} />}>
          {mockMixes.map((mix, idx) => (
            <div key={idx} className={`flex flex-col justify-end w-48 h-48 p-5 rounded-xl cursor-pointer hover:scale-105 transition shadow-lg bg-gradient-to-br ${mix.color} relative overflow-hidden`} onClick={() => playSong(mockSongs[0], mockSongs)}>
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="z-10 relative">
                <h3 className="text-xl font-bold text-white leading-tight mb-1">{mix.title}</h3>
                <p className="text-xs text-gray-100 line-clamp-2">{mix.desc}</p>
              </div>
            </div>
          ))}
        </Section>
        <Section title="Популярное" icon={<Zap size={24} />}>
          {mockSongs.slice(0, 8).map(s => <Card key={s.id} title={s.title} subtitle={getArtistName(s.artist)} cover={s.cover} onClick={() => playSong(s, mockSongs)} onAuxClick={(e) => {e.preventDefault(); openAlbumView(s);}} />)}
        </Section>
        <Section title="Новые релизы" icon={<Disc size={24} />}>
          {mockNewReleases.map(s => <Card key={s.id} title={s.title} subtitle={getArtistName(s.artist)} cover={s.cover} onClick={() => playSong(s, mockNewReleases)} />)}
        </Section>
        <Section title="Жанры">
          {mockGenres.map((g, i) => (
            <div key={i} onClick={() => { setCurrentGenreView(g.name); setActiveTab('genreView'); }} className={`w-56 h-32 p-5 rounded-xl shadow-lg cursor-pointer hover:scale-105 transition flex flex-col justify-start text-white font-bold bg-gradient-to-br ${g.gradient} relative overflow-hidden`}>
              <h3 className="text-2xl relative z-10">{g.name}</h3>
              <Disc className="absolute -bottom-4 -right-4 text-white/20 w-24 h-24 rotate-12" />
            </div>
          ))}
        </Section>
        <Section title="Подкасты" icon={<Mic size={24} />}>
            {mockPodcasts.map((p, i) => (
                <div key={i} className="flex-shrink-0 w-64 p-3 rounded-xl transition cursor-pointer border bg-white border-gray-100 hover:shadow-md dark:bg-white/5 dark:border-transparent dark:hover:bg-white/10">
                    <img src={p.cover} className="w-full aspect-video object-cover rounded-lg mb-3" alt={p.title}/>
                    <h3 className="text-zinc-900 dark:text-white font-bold truncate">{p.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{p.host}</p>
                </div>
            ))}
        </Section>
        <Section title="Популярные артисты">
            {mockArtists.map((a, i) => (
                <div key={i} className="relative group flex-shrink-0">
                    <Card name={a.name} subtitle={a.artist} cover={a.cover} isRound onClick={() => openArtistView(a)} />
                    <button onClick={() => toggleArtistLike(a.name!)} className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition hover:scale-110"><Heart size={18} className={likedArtists.has(a.name!) ? 'fill-red-500 text-red-500' : 'text-white'} /></button>
                </div>
            ))}
        </Section>
      </div>
    );
  } 
  else if (activeTab === 'tracks') {
    mainContent = (
      <div className="p-8">
        <h2 className="text-4xl font-bold mb-8 text-zinc-900 dark:text-white">Все треки</h2>
        <div className="space-y-2">
            {mockSongs.map(s => (
                <div key={s.id} className="flex items-center gap-4 p-3 rounded-xl transition cursor-pointer bg-white border border-gray-100 hover:shadow-md dark:bg-transparent dark:border-transparent dark:hover:bg-white/10" onClick={() => playSong(s, mockSongs)}>
                    <img src={s.cover} alt={s.title} className="w-14 h-14 rounded-lg"/>
                    <div className="flex-1"><h3 className="font-medium text-zinc-900 dark:text-white">{s.title}</h3><p className="text-sm text-indigo-600 dark:text-indigo-400">{getArtistName(s.artist)}</p></div>
                    <button onClick={(e)=>{e.stopPropagation(); toggleLike(s.id)}} className="mr-4 text-gray-400 hover:text-red-500"><Heart size={20} className={likedSongs.has(String(s.id)) ? 'fill-red-500 text-red-500' : ''}/></button>
                    <span className="text-sm text-gray-500 dark:text-gray-400 w-12 text-right">{s.duration}</span>
                </div>
            ))}
        </div>
      </div>
    );
  }
  else if (activeTab === 'library') {
    mainContent = (
      <div className="p-8">
        <h2 className="text-4xl font-bold mb-8 text-zinc-900 dark:text-white">Моя библиотека</h2>
        <button onClick={() => setShowPlaylistModal(true)} className="mb-8 bg-indigo-600 text-white px-6 py-3 rounded-full font-bold hover:bg-indigo-700 transition flex items-center gap-2 shadow-lg"><Plus size={20}/> Создать плейлист</button>
        {userPlaylists.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {userPlaylists.map(pl => (
                    <div key={pl.id} className={`relative p-4 rounded-xl shadow-lg cursor-pointer hover:scale-105 transition flex flex-col justify-end h-48 ${pl.color}`} onClick={() => openPlaylistView(pl)}>
                        <h3 className="text-xl font-bold mb-1 text-white">{pl.name}</h3>
                        <p className="text-xs text-white/80">{pl.songs.length} треков</p>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-20 rounded-xl bg-gray-50 border border-gray-200 dark:bg-white/5 dark:border-white/10">
                <Library size={64} className="mx-auto mb-4 text-gray-300 dark:text-gray-600"/>
                <p className="text-gray-500 dark:text-gray-400">Нет плейлистов</p>
            </div>
        )}
      </div>
    );
  }
  else if (activeTab === 'playlistView' && currentPlaylistView) mainContent = <PlaylistViewComp playlist={currentPlaylistView} />;
  else if (activeTab === 'artistProfile' && currentArtistView) mainContent = <ArtistProfilePage artistName={currentArtistView.name!} cover={currentArtistView.cover} />;
  else if (activeTab === 'charts') mainContent = <ChartsPage />;
  else if (activeTab === 'merch') mainContent = <MerchPage />;
  else if (activeTab === 'search') mainContent = <SearchPage searchTerm={searchTerm} playSong={playSong} openArtistView={openArtistView} openAlbumView={openAlbumView} />;
  else if (activeTab === 'albumView' && currentAlbumView) mainContent = <AlbumPage albumSong={currentAlbumView} onPlaySong={playSong} />;
  else if (activeTab === 'genreView' && currentGenreView) mainContent = <GenrePage genreName={currentGenreView} openAlbumView={openAlbumView} playSong={playSong} />;

  // --- PRE-LOGIN RETURN ---
  if (!isLoggedIn) {
    return (
      <div className="h-screen w-screen bg-transparent text-zinc-900 dark:text-white flex flex-col overflow-hidden relative">
        {preLoginView === 'auth' ? <AuthPage key={authMode} onBack={() => setPreLoginView('landing')} selectedPlan={selectedPlan} initialMode={authMode} onAuthSuccess={handleAuthSuccess} />
         : preLoginView === 'subscription' && tempUser ? <SubscriptionPage plan={selectedPlan || 'Premium'} tempUser={tempUser} currency={currency} onConfirm={handleSubscriptionComplete} onCancel={() => setPreLoginView('landing')} />
         : <LandingPage onSelectPlan={handlePlanSelect} onDirectLogin={handleDirectLogin} currency={currency} setCurrency={setCurrency} />}
      </div>
    );
  }

   // --- MAIN APP RETURN ---
  return (
    <div className="h-screen w-screen bg-transparent text-zinc-900 dark:text-white flex flex-col relative overflow-hidden font-sans">
      <Background />
      <audio ref={audioRef} src={currentSong?.audioUrl || undefined} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} onEnded={playNext} />
      {showOnboarding && <OnboardingModal onFinish={handleOnboardingFinish} />}
      {isFullScreen && currentSong && <SongPage song={currentSong} isPlaying={isPlaying} onPlayPause={togglePlayPause} onNext={playNext} onPrev={playPrev} onClose={() => setIsFullScreen(false)} currentTime={currentTime} duration={duration} onSeek={handleSeek} onSetTime={handleSetTime} volume={volume} onVolumeChange={setVolume} audioRef={audioRef} />}

      <div className="flex flex-1 overflow-hidden z-20 relative">
        {user?.role !== 'admin' && (
        <div className="w-64 h-full flex flex-col flex-shrink-0 transition-colors bg-white border-r border-gray-200 dark:bg-black/30 dark:border-white/10 backdrop-blur-xl">
          <div className="p-6 pb-8">
            <div className="flex items-center gap-3 cursor-pointer" onClick={handleHomeClick}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg text-white"><AudioWaveform size={20} strokeWidth={2.5} /></div>
              <span className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">SoundWave</span>
            </div>
          </div>
          <nav className="px-3 space-y-1">
            {[ {id:'home',label:'Главная',icon:Home}, {id:'search',label:'Поиск',icon:Search}, {id:'charts',label:'Чарты',icon:TrendingUp}, {id:'library',label:'Библиотека',icon:Library}, {id:'merch',label:'Мерч',icon:ShoppingBag} ].map(item => (
              <button key={item.id} onClick={() => { if(item.id==='search') startSearch(); else {setActiveTab(item.id); setIsProfileVisible(false);} }} className={`flex items-center gap-4 px-4 py-3 rounded-lg w-full text-left transition font-semibold ${activeTab===item.id && !isProfileVisible ? 'bg-indigo-50 text-indigo-600 dark:bg-white/10 dark:text-white' : 'text-zinc-500 hover:bg-gray-100 hover:text-zinc-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white'}`}>
                <item.icon size={20} strokeWidth={2.5} /> <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="mt-8 px-6 flex-1 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-4"><h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Плейлисты</h3><button onClick={() => setShowPlaylistModal(true)} className="text-gray-400 hover:text-indigo-600"><Plus size={18} /></button></div>
            <div className="overflow-y-auto space-y-1 pr-2 flex-1 pb-4 custom-scrollbar">
                <button onClick={() => {setActiveTab('tracks'); setIsProfileVisible(false);}} className="flex items-center gap-3 px-2 py-2 w-full text-left rounded-lg mb-2 transition text-zinc-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10">
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center shadow-md"><Heart size={12} fill="white" className="text-white"/></div>
                    <span className="text-sm font-medium truncate">Любимые</span>
                </button>
                {userPlaylists.map(pl => (
                    <button key={pl.id} onClick={() => openPlaylistView(pl)} className="w-full text-left py-2 px-2 text-sm rounded-lg transition truncate text-zinc-500 hover:bg-gray-100 hover:text-zinc-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white">{pl.name}</button>
                ))}
            </div>
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-transparent">
             <div className="flex justify-between items-center px-2 mb-4">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Тема</span>
                <button onClick={toggleTheme} className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition text-gray-600 dark:text-gray-300">{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
             </div>
             <button onClick={handleProfileClick} className={`flex items-center gap-3 w-full p-3 rounded-xl transition ${isProfileVisible ? 'bg-indigo-50 dark:bg-white/10' : 'hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md">{user?.initial || 'U'}</div>
                <div className="flex-1 text-left"><p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{user?.name}</p><p className="text-xs text-gray-500 dark:text-gray-400">Premium</p></div>
                <button onClick={(e) => {e.stopPropagation(); logout();}} className="text-gray-400 hover:text-red-500 transition"><LogOut size={18} /></button>
             </button>
          </div>
        </div>
        )}

        <main className="flex-1 overflow-y-auto relative custom-scrollbar">
          {activeTab === 'search' && (
            <div className="sticky top-0 z-30 p-4 backdrop-blur-md bg-white/70 dark:bg-black/70 border-b border-gray-100 dark:border-white/5">
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" placeholder="Артисты, треки или подкасты" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-11 pr-4 py-2.5 rounded-full bg-gray-100 dark:bg-white/10 border-transparent focus:bg-white dark:focus:bg-black focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium text-zinc-900 dark:text-white placeholder-zinc-400" autoFocus />
              </div>
            </div>
          )}
          {mainContent}
        </main>
      </div>

      {currentSong && user?.role !== 'admin' && (
        <footer className="w-full z-30 border-t border-gray-200 dark:border-white/10 bg-white/90 dark:bg-black/90 backdrop-blur-xl">
            <div className="h-20 grid grid-cols-3 items-center px-4 gap-4">
                <div className="flex items-center gap-3 min-w-[180px]">
                    <div className="relative cursor-pointer group rounded overflow-hidden flex-shrink-0" onClick={() => setIsFullScreen(true)}>
                        <img src={currentSong.cover} alt={currentSong.title} className="w-14 h-14 object-cover"/>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <Maximize2 className="text-white" size={14}/>
                        </div>
                    </div>
                    <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-zinc-900 dark:text-white truncate text-sm hover:underline cursor-pointer" onClick={() => setIsFullScreen(true)}>{currentSong.title}</h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate hover:underline cursor-pointer">{getArtistName(currentSong.artist)}</p>
                    </div>
                    <button onClick={() => toggleLike('current')} className="text-zinc-400 hover:text-red-500 transition">
                        <Heart size={18} className={likedSongs.has(String(currentSong.id)) ? 'fill-red-500 text-red-500' : ''} />
                    </button>
                </div>

                <div className="flex flex-col items-center gap-2 max-w-[722px] mx-auto w-full">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsShuffle(!isShuffle)} className={`transition hover:scale-110 ${isShuffle ? 'text-indigo-600' : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}>
                            <Shuffle size={16}/>
                        </button>
                        <button onClick={playPrev} className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition">
                            <SkipBack size={20}/>
                        </button>
                        <button onClick={togglePlayPause} className="w-9 h-9 rounded-full flex items-center justify-center bg-white dark:bg-white text-black hover:scale-105 transition shadow-md">
                            {isPlaying ? <Pause fill="currentColor" size={16}/> : <Play fill="currentColor" className="ml-0.5" size={16}/>}
                        </button>
                        <button onClick={playNext} className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition">
                            <SkipForward size={20}/>
                        </button>
                        <button onClick={() => setIsRepeat(!isRepeat)} className={`transition hover:scale-110 ${isRepeat ? 'text-indigo-600' : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}>
                            <Repeat size={16}/>
                        </button>
                    </div>
                    <div className="flex items-center gap-2 w-full">
                        <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono w-10 text-right">{formatTime(currentTime)}</span>
                        <div className="flex-1 h-1 bg-gray-300 dark:bg-white/20 rounded-full cursor-pointer group relative" onClick={handleSeek}>
                            <div className="h-full bg-zinc-900 dark:bg-white rounded-full group-hover:bg-indigo-600 transition-colors relative" style={{ width: `${(currentTime/duration)*100 || 0}%` }}>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-zinc-900 dark:bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition"></div>
                            </div>
                        </div>
                        <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono w-10">{currentSong.duration}</span>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 min-w-[180px]">
                    <button onClick={() => setShowJamModal(true)} className="text-zinc-400 hover:text-green-500 transition">
                        <Users size={18}/>
                    </button>
                    <div className="flex items-center gap-2 group">
                        <button onClick={() => setVolume(v => v === 0 ? 0.8 : 0)} className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition">
                            {volume === 0 ? <VolumeX size={18}/> : volume < 0.5 ? <Volume1 size={18}/> : <Volume2 size={18}/>}
                        </button>
                        <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.01" 
                            value={volume} 
                            onChange={(e) => setVolume(parseFloat(e.target.value))} 
                            className="w-20 h-1 bg-gray-300 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:accent-white opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                    </div>
                </div>
            </div>
        </footer>
      )}

      {showPlaylistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm animate-fade-in">
             <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 dark:border-white/5">
                 <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">Новый плейлист</h2>
                 <input type="text" value={newPlaylistName} onChange={(e)=>setNewPlaylistName(e.target.value)} placeholder="Название" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl mb-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-black dark:border-white/10 dark:text-white" autoFocus/>
                 <div className="flex gap-2">
                    <button onClick={handleCreatePlaylist} className="flex-1 bg-zinc-900 dark:bg-white dark:text-black text-white py-2.5 rounded-lg font-bold text-sm">Создать</button>
                    <button onClick={()=>setShowPlaylistModal(false)} className="flex-1 bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-white py-2.5 rounded-lg font-bold text-sm hover:bg-gray-200">Отмена</button>
                 </div>
             </div>
        </div>
      )}
      {showWrapped && <WrappedModal onClose={() => setShowWrapped(false)} topSongs={history.slice(0, 5)} topArtists={Array.from(new Set(history.map(s => getArtistName(s.artist)))).slice(0, 5)} totalMinutes={history.length * 3.5} userName={user?.name ?? 'Меломан'} />}
    </div>
  );
}
