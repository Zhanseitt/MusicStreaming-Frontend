// src/AdminPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
    Users, Music, BarChart2, BarChart3, Trash2, Edit, 
    AlertTriangle, UploadCloud, Save, FileText, 
    Loader2, LogOut, Plus, ArrowLeft, Sun, Moon, AudioWaveform,
    Mic2, Disc, HardDrive, Ban, CheckCircle2, XCircle, Play
} from 'lucide-react';
import type { Song } from './MusicPlayer';
import { Background } from './MusicPlayer';
import api from './api/axios';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';

// --- ТИПЫ ---
interface LogEntry {
    id: number;
    time: string;
    action: string;
    user: string;
    type: 'info' | 'warning' | 'error' | 'success';
}

interface DashboardStats {
    active_users: number;
    total_songs: number;
    pending_reports: number;
    audit_logs: LogEntry[];
}

// --- ГЛАВНЫЙ КОМПОНЕНТ ---
export default function AdminPage() {
    const { logout, user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'songs' | 'add-song' | 'edit-song' | 'reports' | 'users' | 'artists' | 'genres' | 'analytics'>('dashboard');
    const [editingSongId, setEditingSongId] = useState<number | null>(null);

    // Состояния данных
    const [tracks, setTracks] = useState<Song[]>([]);
    const [artists, setArtists] = useState<{ id: number; name: string }[]>([]);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Загрузка данных
    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 30000); // Обновление каждые 30 секунд
        return () => clearInterval(interval);
    }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [tracksData, artistsData, statsData] = await Promise.all([
                api.getTracks(),
                api.getArtistsForUpload(),
                api.getAdminStats()
            ]);
            
            const mappedTracks: Song[] = tracksData.map((track) => ({
                id: track.id,
                title: track.title,
                artist: track.artist,
                artist_id: track.artist_id,
                album: track.album || '',
                duration: track.duration || '0:00',
                cover: track.cover || 'https://via.placeholder.com/300',
                audioUrl: track.audioUrl || '',
                lyrics: [],
                color: undefined
            }));
            
            setTracks(mappedTracks);
            setArtists(artistsData);
            setStats(statsData);
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteSong = async (id: number) => {
        if (!window.confirm('Удалить песню?')) return;
        try {
            await api.deleteSong(id);
            setTracks(tracks.filter(t => t.id !== id));
            loadData(); // Обновляем статистику
        } catch (error) {
            console.error('Ошибка удаления:', error);
            alert('Ошибка при удалении песни');
        }
    };

    const handleEditSong = (songId: number) => {
        setEditingSongId(songId);
        setActiveTab('edit-song');
    };

    // --- РЕНДЕР ---
    return (
        <div className="h-screen w-screen bg-transparent text-zinc-900 dark:text-white flex flex-col relative overflow-hidden font-sans">
            <Background />
            <div className="flex flex-1 overflow-hidden z-20 relative">
                {/* САЙДБАР */}
                <aside className="w-64 h-full flex flex-col flex-shrink-0 transition-colors bg-white border-r border-gray-200 dark:bg-black/30 dark:border-white/10 backdrop-blur-xl">
                    <div className="p-6 pb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg text-white">
                                <AudioWaveform size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <span className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight block">SoundWave</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</span>
                            </div>
                        </div>
                    </div>
                    
                    <nav className="px-3 space-y-1">
                        <button
                            onClick={() => { setActiveTab('dashboard'); setEditingSongId(null); }}
                            className={`flex items-center gap-4 px-4 py-3 rounded-lg w-full text-left transition font-semibold ${
                                activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-600 dark:bg-white/10 dark:text-white' : 'text-zinc-500 hover:bg-gray-100 hover:text-zinc-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white'
                            }`}
                        >
                            <BarChart2 size={20} strokeWidth={2.5} />
                            <span>Дашборд</span>
                        </button>
                        
                        <button
                            onClick={() => { setActiveTab('users'); setEditingSongId(null); }}
                            className={`flex items-center gap-4 px-4 py-3 rounded-lg w-full text-left transition font-semibold ${
                                activeTab === 'users' ? 'bg-indigo-50 text-indigo-600 dark:bg-white/10 dark:text-white' : 'text-zinc-500 hover:bg-gray-100 hover:text-zinc-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white'
                            }`}
                        >
                            <Users size={20} strokeWidth={2.5} />
                            <span>Пользователи</span>
                        </button>
                        
                        <button
                            onClick={() => { setActiveTab('artists'); setEditingSongId(null); }}
                            className={`flex items-center gap-4 px-4 py-3 rounded-lg w-full text-left transition font-semibold ${
                                activeTab === 'artists' ? 'bg-indigo-50 text-indigo-600 dark:bg-white/10 dark:text-white' : 'text-zinc-500 hover:bg-gray-100 hover:text-zinc-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white'
                            }`}
                        >
                            <Mic2 size={20} strokeWidth={2.5} />
                            <span>Артисты</span>
                        </button>
                        
                        <button
                            onClick={() => { setActiveTab('genres'); setEditingSongId(null); }}
                            className={`flex items-center gap-4 px-4 py-3 rounded-lg w-full text-left transition font-semibold ${
                                activeTab === 'genres' ? 'bg-indigo-50 text-indigo-600 dark:bg-white/10 dark:text-white' : 'text-zinc-500 hover:bg-gray-100 hover:text-zinc-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white'
                            }`}
                        >
                            <Disc size={20} strokeWidth={2.5} />
                            <span>Жанры</span>
                        </button>
                        
                        <button
                            onClick={() => { setActiveTab('songs'); setEditingSongId(null); }}
                            className={`flex items-center gap-4 px-4 py-3 rounded-lg w-full text-left transition font-semibold ${
                                activeTab === 'songs' ? 'bg-indigo-50 text-indigo-600 dark:bg-white/10 dark:text-white' : 'text-zinc-500 hover:bg-gray-100 hover:text-zinc-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white'
                            }`}
                        >
                            <Music size={20} strokeWidth={2.5} />
                            <span>Все песни</span>
                        </button>
                        
                        <button
                            onClick={() => { setActiveTab('add-song'); setEditingSongId(null); }}
                            className={`flex items-center gap-4 px-4 py-3 rounded-lg w-full text-left transition font-semibold ${
                                activeTab === 'add-song' ? 'bg-indigo-50 text-indigo-600 dark:bg-white/10 dark:text-white' : 'text-zinc-500 hover:bg-gray-100 hover:text-zinc-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white'
                            }`}
                        >
                            <Plus size={20} strokeWidth={2.5} />
                            <span>Добавить песню</span>
                        </button>
                        
                        <button
                            onClick={() => { setActiveTab('analytics'); setEditingSongId(null); }}
                            className={`flex items-center gap-4 px-4 py-3 rounded-lg w-full text-left transition font-semibold ${
                                activeTab === 'analytics' ? 'bg-indigo-50 text-indigo-600 dark:bg-white/10 dark:text-white' : 'text-zinc-500 hover:bg-gray-100 hover:text-zinc-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white'
                            }`}
                        >
                            <BarChart3 size={20} strokeWidth={2.5} />
                            <span>Аналитика</span>
                        </button>
                        
                        <button
                            onClick={() => { setActiveTab('reports'); setEditingSongId(null); }}
                            className={`flex items-center gap-4 px-4 py-3 rounded-lg w-full text-left transition font-semibold ${
                                activeTab === 'reports' ? 'bg-indigo-50 text-indigo-600 dark:bg-white/10 dark:text-white' : 'text-zinc-500 hover:bg-gray-100 hover:text-zinc-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white'
                            }`}
                        >
                            <AlertTriangle size={20} strokeWidth={2.5} />
                            <span>Жалобы</span>
                        </button>
                    </nav>

                    {/* Status Storage Widget */}
                    <div className="px-4 py-4 border-t border-gray-200 dark:border-white/10">
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-xl p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                                <HardDrive size={16} className="text-indigo-600 dark:text-indigo-400" />
                                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300">Хранилище (R2)</span>
                            </div>
                            <div className="text-sm font-extrabold text-indigo-900 dark:text-indigo-200 mb-2">12.4 GB / 1 TB</div>
                            <div className="w-full bg-indigo-200 dark:bg-indigo-900/30 rounded-full h-2 overflow-hidden">
                                <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: '15%' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto p-4 border-t border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-transparent">
                        <div className="flex justify-between items-center px-2 mb-4">
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Тема</span>
                            <button onClick={toggleTheme} className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition text-gray-600 dark:text-gray-300">
                                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            </button>
                        </div>
                        <button
                            onClick={logout}
                            className={`flex items-center gap-3 w-full p-3 rounded-xl transition hover:bg-gray-100 dark:hover:bg-white/5`}
                        >
                            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
                                {user?.name[0] || 'A'}
                    </div>
                            <div className="flex-1 text-left">
                                <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{user?.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Администратор</p>
                        </div>
                            <LogOut size={18} className="text-gray-400 hover:text-red-500 transition" />
                        </button>
                    </div>
                </aside>

                {/* ОСНОВНОЙ КОНТЕНТ */}
                <main className="flex-1 overflow-y-auto relative custom-scrollbar">
                {activeTab === 'dashboard' && <DashboardView stats={stats} isLoading={isLoading} />}
                {activeTab === 'songs' && (
                    <SongsView 
                        tracks={tracks} 
                        onEdit={handleEditSong}
                        onDelete={handleDeleteSong}
                        isLoading={isLoading}
                    />
                )}
                {activeTab === 'add-song' && (
                    <AddSongView 
                        artists={artists}
                        onSuccess={() => {
                            setActiveTab('songs');
                            loadData();
                        }}
                    />
                )}
                {activeTab === 'edit-song' && editingSongId && (
                    <EditSongView 
                        songId={editingSongId}
                        artists={artists}
                        onSuccess={() => {
                            setActiveTab('songs');
                            setEditingSongId(null);
                            loadData();
                        }}
                        onCancel={() => {
                            setActiveTab('songs');
                            setEditingSongId(null);
                        }}
                    />
                )}
                    {activeTab === 'reports' && <ReportsView />}
                {activeTab === 'users' && <UsersPage />}
                {activeTab === 'artists' && <ArtistsPage />}
                {activeTab === 'genres' && <GenresPage />}
                {activeTab === 'analytics' && <AnalyticsPage />}
                </main>
                </div>
        </div>
    );
}

// --- КОМПОНЕНТЫ ВИДОВ ---

// Дашборд
function DashboardView({ stats, isLoading }: { stats: DashboardStats | null; isLoading: boolean }) {
    if (isLoading) {
                            return (
            <div className="p-8 flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-indigo-500" size={32} />
                    </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="p-8 pb-24 animate-fade-in">
            <h2 className="text-4xl font-extrabold mb-8 text-zinc-900 dark:text-white">Дашборд</h2>
            
            {/* Статистика */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white/90 dark:bg-black/30 border border-gray-200 dark:border-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
                            <Users size={24} />
                </div>
                        <span className="text-green-500 text-xs font-bold flex items-center">+12%</span>
                    </div>
                    <div className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-1">{stats.active_users}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Активных пользователей</div>
            </div>

                <div className="bg-white/90 dark:bg-black/30 border border-gray-200 dark:border-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400 rounded-xl">
                            <Music size={24} />
                            </div>
                        </div>
                    <div className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-1">{stats.total_songs}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Всего песен</div>
                            </div>

                <div className="bg-white/90 dark:bg-black/30 border border-gray-200 dark:border-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-xl">
                            <AlertTriangle size={24} />
                        </div>
                        {stats.pending_reports > 0 && (
                            <span className="text-red-500 text-xs font-bold">{stats.pending_reports}</span>
                        )}
                    </div>
                    <div className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-1">{stats.pending_reports}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Жалоб на рассмотрении</div>
                    </div>
                </div>

            {/* Аудит лог */}
            <div className="bg-white/90 dark:bg-black/30 border border-gray-200 dark:border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-zinc-900 dark:text-white">
                    <div className="p-2 bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
                        <FileText size={20} />
                    </div>
                    Аудит лог
                    </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                    {stats.audit_logs.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            Нет записей
                        </div>
                    ) : (
                        stats.audit_logs.map((log) => (
                            <div key={log.id} className="flex gap-3 text-sm border-b border-gray-200 dark:border-white/5 pb-3 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 p-2 rounded-lg transition">
                                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                    log.type === 'success' ? 'bg-green-500' : 
                                    log.type === 'error' ? 'bg-red-500' : 
                                    log.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                                }`}></div>
                                <div className="flex-1">
                                    <div className="text-zinc-900 dark:text-white font-medium">{log.action}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{log.user} • {log.time}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

// Список песен
function SongsView({ 
    tracks, 
    onEdit, 
    onDelete, 
    isLoading 
}: { 
    tracks: Song[]; 
    onEdit: (id: number) => void; 
    onDelete: (id: number) => void;
    isLoading: boolean;
}) {
    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-indigo-500" size={32} />
            </div>
        );
    }

    return (
        <div className="p-8 pb-24 animate-fade-in">
            <h2 className="text-4xl font-extrabold mb-8 text-zinc-900 dark:text-white">Все песни</h2>
            
            <div className="bg-white/90 dark:bg-black/30 border border-gray-200 dark:border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs uppercase font-bold">
                        <tr>
                            <th className="p-4 w-12">#</th>
                            <th className="p-4">Трек</th>
                            <th className="p-4">Артист</th>
                            <th className="p-4">Альбом</th>
                            <th className="p-4 text-right">Действия</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                        {tracks.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-gray-500 dark:text-gray-400">
                                    Нет песен. Добавьте первую песню!
                                </td>
                            </tr>
                        ) : (
                            tracks.map((track, index) => (
                                <tr key={track.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition group text-zinc-900 dark:text-gray-300 text-sm">
                                    <td className="p-4 text-gray-500 dark:text-gray-400">{index + 1}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative group/cover">
                                                <img src={track.cover} className="w-14 h-14 rounded-lg object-cover shadow-md" alt="" />
                                                <button 
                                                    className="absolute inset-0 bg-black/60 dark:bg-black/80 rounded-lg flex items-center justify-center opacity-0 group-hover/cover:opacity-100 transition-all duration-200 hover:bg-black/80"
                                                    onClick={() => {
                                                        // Здесь можно добавить логику воспроизведения
                                                        const audio = new Audio(track.audioUrl);
                                                        audio.play();
                                                    }}
                                                >
                                                    <Play className="text-white" size={20} />
                                                </button>
                                            </div>
                                            <div>
                                                <div className="font-bold text-zinc-900 dark:text-white">{track.title}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{track.duration}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-zinc-900 dark:text-white">{typeof track.artist === 'string' ? track.artist : track.artist?.name || 'Unknown'}</td>
                                    <td className="p-4 text-gray-500 dark:text-gray-400">{track.album}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => onEdit(track.id)} 
                                                className="p-2 hover:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400 transition opacity-0 group-hover:opacity-100"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => onDelete(track.id)} 
                                                className="p-2 hover:bg-red-500/20 rounded-lg text-red-600 dark:text-red-400 transition opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Добавление песни
function AddSongView({ 
    artists, 
    onSuccess 
}: { 
    artists: { id: number; name: string }[]; 
    onSuccess: () => void;
}) {
    const [formData, setFormData] = useState({
        title: '',
        artist_id: '',
        album: '',
        duration: '0:00'
    });
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!audioFile || !formData.artist_id) {
            alert('Заполните все обязательные поля');
            return;
        }

        setIsUploading(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('artist_id', formData.artist_id);
            data.append('album', formData.album || '');
            data.append('duration', formData.duration || '0:00');
            data.append('audio_file', audioFile);
            if (coverFile) data.append('cover_file', coverFile);

            await api.uploadSong(data);
            alert('Песня успешно загружена!');
            onSuccess();
        } catch (error: any) {
            alert('Ошибка: ' + (error.response?.data?.error || error.message));
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="p-8 pb-24 animate-fade-in">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-4xl font-extrabold mb-2 text-zinc-900 dark:text-white">Добавить новую песню</h2>
                    <p className="text-gray-500 dark:text-gray-400">Загрузите аудио файл и обложку для новой композиции</p>
                </div>
                
                <div className="bg-white/90 dark:bg-black/30 border border-gray-200 dark:border-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-2">Название *</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            placeholder="Введите название песни"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-2">Артист *</label>
                        <select
                            required
                            value={formData.artist_id}
                            onChange={e => setFormData({...formData, artist_id: e.target.value})}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        >
                            <option value="">Выберите артиста</option>
                            {artists.map(a => (
                                <option key={a.id} value={a.id}>{a.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-2">Альбом</label>
                        <input
                            type="text"
                            value={formData.album}
                            onChange={e => setFormData({...formData, album: e.target.value})}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            placeholder="Название альбома (необязательно)"
                        />
                </div>

                    <div>
                        <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-2">Длительность</label>
                        <input
                            type="text"
                            placeholder="3:20"
                            value={formData.duration}
                            onChange={e => setFormData({...formData, duration: e.target.value})}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        />
                    </div>

                    <div
                        onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                        onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            setDragActive(false);
                            if (e.dataTransfer.files[0]) setAudioFile(e.dataTransfer.files[0]);
                        }}
                        className={`border-2 border-dashed p-8 rounded-xl text-center transition ${
                            dragActive 
                                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' 
                                : 'border-gray-300 dark:border-white/20 hover:border-indigo-400 dark:hover:border-indigo-500'
                        }`}
                    >
                        <UploadCloud className="mx-auto mb-3 text-gray-400 dark:text-gray-500" size={32} />
                        <p className="text-gray-600 dark:text-gray-400 mb-2 font-medium">
                            {audioFile ? (
                                <span className="text-indigo-600 dark:text-indigo-400">{audioFile.name}</span>
                            ) : (
                                'Перетащите MP3 файл или'
                            )}
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="audio/*"
                            onChange={e => e.target.files?.[0] && setAudioFile(e.target.files[0])}
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 underline font-semibold"
                        >
                            выберите файл
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-2">Обложка (необязательно)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => e.target.files?.[0] && setCoverFile(e.target.files[0])}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-zinc-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-500/20 dark:file:text-indigo-300 transition"
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={isUploading}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    Загрузка...
                                </>
                            ) : (
                                <>
                                    <UploadCloud size={18} />
                                    Загрузить на сервер
                                </>
                            )}
                        </button>
                    </div>
                </form>
                </div>
            </div>
        </div>
    );
}

// Редактирование песни
function EditSongView({
    songId,
    artists,
    onSuccess,
    onCancel
}: {
    songId: number;
    artists: { id: number; name: string }[];
    onSuccess: () => void;
    onCancel: () => void;
}) {
    const [formData, setFormData] = useState({
        title: '',
        artist_id: '',
        album: '',
        duration: '0:00'
    });
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadSong();
    }, [songId]);

    const loadSong = async () => {
        try {
            const track = await api.getTrack(songId);
            setFormData({
                title: track.title,
                artist_id: String(track.artist_id),
                album: track.album || '',
                duration: track.duration || '0:00'
            });
        } catch (error) {
            console.error('Ошибка загрузки:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('artist_id', formData.artist_id);
            data.append('album', formData.album || '');
            data.append('duration', formData.duration || '0:00');
            if (audioFile) data.append('audio_file', audioFile);
            if (coverFile) data.append('cover_file', coverFile);

            await api.updateSong(songId, data);
            alert('Песня успешно обновлена!');
            onSuccess();
        } catch (error: any) {
            alert('Ошибка: ' + (error.response?.data?.error || error.message));
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-indigo-500" size={32} />
            </div>
        );
    }

    return (
        <div className="p-8 pb-24 max-w-3xl animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
                        <button 
                    onClick={onCancel} 
                    className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition text-zinc-900 dark:text-white"
                        >
                    <ArrowLeft size={20} />
                        </button>
                <h2 className="text-4xl font-extrabold text-zinc-900 dark:text-white">Редактировать песню</h2>
            </div>
            
            <div className="bg-white/90 dark:bg-black/30 border border-gray-200 dark:border-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-2">Название *</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-2">Артист *</label>
                        <select
                            required
                            value={formData.artist_id}
                            onChange={e => setFormData({...formData, artist_id: e.target.value})}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        >
                            <option value="">Выберите артиста</option>
                            {artists.map(a => (
                                <option key={a.id} value={a.id}>{a.name}</option>
                            ))}
                        </select>
                </div>

                    <div>
                        <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-2">Альбом</label>
                    <input 
                        type="text" 
                            value={formData.album}
                            onChange={e => setFormData({...formData, album: e.target.value})}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                </div>

                    <div>
                        <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-2">Длительность</label>
                        <input
                            type="text"
                            value={formData.duration}
                            onChange={e => setFormData({...formData, duration: e.target.value})}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        />
            </div>

                    <div>
                        <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-2">Новый аудио файл (оставьте пустым, чтобы не менять)</label>
                        <input
                            type="file"
                            accept="audio/*"
                            onChange={e => e.target.files?.[0] && setAudioFile(e.target.files[0])}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-zinc-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-500/20 dark:file:text-indigo-300 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-2">Новая обложка (оставьте пустым, чтобы не менять)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => e.target.files?.[0] && setCoverFile(e.target.files[0])}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-zinc-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-500/20 dark:file:text-indigo-300 transition"
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-zinc-900 dark:text-white px-6 py-3 rounded-xl font-bold transition"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    Сохранение...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Сохранить изменения
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Жалобы
function ReportsView() {
    const [reports, setReports] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            const data = await api.getReports();
            setReports(data);
        } catch (error) {
            console.error('Ошибка загрузки жалоб:', error);
            // Моки для демонстрации
            setReports([
                { id: 1, user: { name: 'Иван Иванов' }, song: { title: 'Blinding Lights' }, type: 'complaint', content: 'Нарушение авторских прав', status: 'pending', created_at: new Date().toISOString() },
                { id: 2, user: { name: 'Анна Смит' }, song: null, type: 'complaint', content: 'Спам в комментариях', status: 'pending', created_at: new Date().toISOString() },
                { id: 3, user: { name: 'Петр Петров' }, song: { title: 'Starboy' }, type: 'complaint', content: 'Оскорбление в тексте', status: 'resolved', created_at: new Date().toISOString() },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (reportId: number, status: string) => {
        try {
            await api.updateReportStatus(reportId, status);
            loadReports();
        } catch (error) {
            console.error('Ошибка обновления:', error);
            // Обновляем локально для демо
            setReports(reports.map(r => r.id === reportId ? { ...r, status } : r));
        }
    };

    const getReasonLabel = (content: string) => {
        if (content.includes('Спам')) return 'Спам';
        if (content.includes('Авторские')) return 'Авторские права';
        if (content.includes('Оскорбление')) return 'Оскорбление';
        return 'Другое';
    };

    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-indigo-500" size={32} />
            </div>
        );
    }

    return (
        <div className="p-8 pb-24 animate-fade-in">
            <h2 className="text-4xl font-extrabold mb-8 text-zinc-900 dark:text-white">Жалобы и предложения</h2>
            
            <div className="bg-white/90 dark:bg-black/30 border border-gray-200 dark:border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs uppercase font-bold">
                        <tr>
                            <th className="p-4">ID</th>
                            <th className="p-4">На кого/что</th>
                            <th className="p-4">Причина</th>
                            <th className="p-4">Статус</th>
                            <th className="p-4 text-right">Действия</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                        {reports.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-gray-500 dark:text-gray-400">
                                    Нет жалоб
                                </td>
                            </tr>
                        ) : (
                            reports.map((report) => (
                                <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition group text-zinc-900 dark:text-gray-300 text-sm">
                                    <td className="p-4 text-gray-500 dark:text-gray-400 font-mono">#{report.id}</td>
                                    <td className="p-4">
                                    <div>
                                            <div className="font-semibold text-zinc-900 dark:text-white">
                                                {report.song ? report.song.title : report.user?.name || 'Unknown'}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {report.song ? 'Песня' : 'Пользователь'}
                                            </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                            getReasonLabel(report.content) === 'Спам' ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400' :
                                            getReasonLabel(report.content) === 'Авторские права' ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400' :
                                            getReasonLabel(report.content) === 'Оскорбление' ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400' :
                                            'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400'
                                        }`}>
                                            {getReasonLabel(report.content)}
                                    </span>
                                </td>
                                <td className="p-4">
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                            report.status === 'pending' ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400' :
                                            report.status === 'resolved' ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400' :
                                            'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400'
                                        }`}>
                                            {report.status === 'pending' ? 'Новая' : 'Решено'}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                        {report.status === 'pending' && (
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                                                <button
                                                    onClick={() => handleUpdateStatus(report.id, 'resolved')}
                                                    className="p-2 hover:bg-green-500/20 rounded-lg text-green-600 dark:text-green-400 transition"
                                                    title="Принять"
                                                >
                                                    <CheckCircle2 size={18} />
                                        </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(report.id, 'dismissed')}
                                                    className="p-2 hover:bg-red-500/20 rounded-lg text-red-600 dark:text-red-400 transition"
                                                    title="Отклонить"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                    </div>
                                        )}
                                </td>
                            </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Пользователи
function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        loadUsers();
    }, [currentPage]);

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            const response = await api.getAdminUsers(currentPage, 20);
            setUsers(response.data);
            setTotalPages(response.last_page);
        } catch (error) {
            console.error('Ошибка загрузки пользователей:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBan = async (userId: number) => {
        if (!window.confirm('Забанить/разбанить пользователя?')) return;
        try {
            const response = await api.banUser(userId);
            setUsers(users.map(u => u.id === userId ? { ...u, is_banned: response.user.is_banned } : u));
        } catch (error) {
            console.error('Ошибка бана пользователя:', error);
            alert('Ошибка при изменении статуса пользователя');
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-indigo-500" size={32} />
            </div>
        );
    }

    return (
        <div className="p-8 pb-24 animate-fade-in">
            <h2 className="text-4xl font-extrabold mb-8 text-zinc-900 dark:text-white">Пользователи</h2>
            
            <div className="bg-white/90 dark:bg-black/30 border border-gray-200 dark:border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs uppercase font-bold">
                        <tr>
                            <th className="p-4">ID</th>
                            <th className="p-4">Пользователь</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Подписка</th>
                            <th className="p-4">Статус</th>
                            <th className="p-4">Дата регистрации</th>
                            <th className="p-4 text-right">Действия</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition group text-zinc-900 dark:text-gray-300 text-sm">
                                <td className="p-4 text-gray-500 dark:text-gray-400 font-mono">#{user.id}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-md">
                                            {user.name[0]}
                                        </div>
                                        <span className="font-semibold text-zinc-900 dark:text-white">{user.name}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                                <td className="p-4">
                                    <span className="px-3 py-1 rounded-lg text-xs font-bold bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400">
                                        {user.role === 'artist' ? 'Artist' : 'User'}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 w-fit ${
                                        !user.is_banned 
                                            ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400' 
                                            : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                                    }`}>
                                        <div className={`w-2 h-2 rounded-full ${!user.is_banned ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        {!user.is_banned ? 'Активен' : 'Бан'}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-500 dark:text-gray-400">
                                    {new Date(user.created_at).toLocaleDateString('ru-RU')}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                <button 
                                            onClick={() => {}}
                                            className="p-2 hover:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400 transition opacity-0 group-hover:opacity-100"
                                            title="Редактировать"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleBan(user.id)}
                                            className="p-2 hover:bg-red-500/20 rounded-lg text-red-600 dark:text-red-400 transition opacity-0 group-hover:opacity-100"
                                            title="Бан"
                                        >
                                            <Ban size={18} />
                </button>
            </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {totalPages > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-zinc-900 dark:text-white transition"
                    >
                        Назад
                    </button>
                    <span className="px-4 py-2 text-zinc-900 dark:text-white font-bold">
                        Страница {currentPage} из {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-zinc-900 dark:text-white transition"
                    >
                        Вперед
                    </button>
                </div>
            )}
        </div>
    );
}

// Артисты
function ArtistsPage() {
    const [artists, setArtists] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadArtists();
    }, []);

    const loadArtists = async () => {
        try {
            setIsLoading(true);
            const data = await api.getArtists();
            setArtists(data.map((artist: any) => ({
                id: artist.id,
                name: artist.name,
                songs_count: artist.songs_count || 0,
                followers: 0 // Пока нет поля followers
            })));
        } catch (error) {
            console.error('Ошибка загрузки артистов:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (artistId: number) => {
        if (!window.confirm('Удалить артиста?')) return;
        try {
            await api.deleteArtist(artistId);
            setArtists(artists.filter(a => a.id !== artistId));
        } catch (error) {
            console.error('Ошибка удаления артиста:', error);
            alert('Ошибка при удалении артиста');
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-indigo-500" size={32} />
            </div>
        );
    }

    return (
        <div className="p-8 pb-24 animate-fade-in">
            <h2 className="text-4xl font-extrabold mb-8 text-zinc-900 dark:text-white">Артисты</h2>
            
            <div className="bg-white/90 dark:bg-black/30 border border-gray-200 dark:border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs uppercase font-bold">
                        <tr>
                            <th className="p-4">ID</th>
                            <th className="p-4">Артист</th>
                            <th className="p-4">Песен</th>
                            <th className="p-4">Подписчиков</th>
                            <th className="p-4 text-right">Действия</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                        {artists.map((artist) => (
                            <tr key={artist.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition group text-zinc-900 dark:text-gray-300 text-sm">
                                <td className="p-4 text-gray-500 dark:text-gray-400 font-mono">#{artist.id}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white shadow-md">
                                            {artist.name[0]}
                                        </div>
                                        <span className="font-semibold text-zinc-900 dark:text-white">{artist.name}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-gray-600 dark:text-gray-400">{artist.songs_count}</td>
                                <td className="p-4 text-gray-600 dark:text-gray-400">-</td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                                        <button className="p-2 hover:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400 transition">
                                            <Edit size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(artist.id)}
                                            className="p-2 hover:bg-red-500/20 rounded-lg text-red-600 dark:text-red-400 transition"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Жанры
function GenresPage() {
    const [genres, setGenres] = useState<any[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newGenreName, setNewGenreName] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadGenres();
    }, []);

    const loadGenres = async () => {
        try {
            setIsLoading(true);
            const data = await api.getGenres();
            const colors = ['from-red-500 to-orange-500', 'from-pink-500 to-purple-500', 'from-yellow-500 to-orange-500', 'from-cyan-500 to-blue-500', 'from-indigo-500 to-purple-500', 'from-green-500 to-emerald-500'];
            setGenres(data.map((genre, index) => ({
                id: genre.id,
                name: genre.name,
                color: colors[index % colors.length]
            })));
        } catch (error) {
            console.error('Ошибка загрузки жанров:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddGenre = async () => {
        if (!newGenreName.trim()) return;
        try {
            const response = await api.createGenre(newGenreName.trim());
            const colors = ['from-red-500 to-orange-500', 'from-pink-500 to-purple-500', 'from-yellow-500 to-orange-500', 'from-cyan-500 to-blue-500', 'from-indigo-500 to-purple-500', 'from-green-500 to-emerald-500'];
            setGenres([...genres, {
                id: response.data.id,
                name: response.data.name,
                color: colors[genres.length % colors.length]
            }]);
            setNewGenreName('');
            setShowAddModal(false);
        } catch (error: any) {
            console.error('Ошибка создания жанра:', error);
            alert(error.response?.data?.message || 'Ошибка при создании жанра');
        }
    };

    const handleDeleteGenre = async (id: number) => {
        if (!window.confirm('Удалить жанр?')) return;
        try {
            await api.deleteGenre(id);
            setGenres(genres.filter(g => g.id !== id));
        } catch (error) {
            console.error('Ошибка удаления жанра:', error);
            alert('Ошибка при удалении жанра');
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-indigo-500" size={32} />
            </div>
        );
    }

    return (
        <div className="p-8 pb-24 animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-4xl font-extrabold text-zinc-900 dark:text-white">Жанры</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition"
                >
                    <Plus size={20} />
                    Добавить жанр
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {genres.map((genre) => (
                    <div key={genre.id} className={`relative bg-gradient-to-br ${genre.color} rounded-2xl p-6 shadow-lg hover:shadow-xl transition group overflow-hidden`}>
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition"></div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-2xl font-extrabold text-white">{genre.name}</h3>
                        <button 
                                    onClick={() => handleDeleteGenre(genre.id)}
                                    className="p-2 hover:bg-white/20 rounded-lg text-white opacity-0 group-hover:opacity-100 transition"
                                >
                                    <Trash2 size={18} />
                        </button>
                            </div>
                            <div className="text-white/80 text-sm">12 песен</div>
                        </div>
                    </div>
                    ))}
                </div>

            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-2xl p-6 w-96 shadow-2xl">
                        <h3 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">Добавить жанр</h3>
                        <input
                            type="text"
                            value={newGenreName}
                            onChange={e => setNewGenreName(e.target.value)}
                            placeholder="Название жанра"
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-zinc-900 dark:text-white mb-4 focus:ring-2 focus:ring-indigo-500"
                            autoFocus
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={handleAddGenre}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold"
                            >
                                Добавить
                            </button>
                            <button
                                onClick={() => { setShowAddModal(false); setNewGenreName(''); }}
                                className="flex-1 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-zinc-900 dark:text-white px-4 py-2 rounded-xl font-bold"
                            >
                                Отмена
                            </button>
            </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Аналитика
function AnalyticsPage() {
    return (
        <div className="p-8 pb-24 animate-fade-in">
            <h2 className="text-4xl font-extrabold mb-8 text-zinc-900 dark:text-white">Аналитика</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/90 dark:bg-black/30 border border-gray-200 dark:border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg">
                    <h3 className="text-lg font-bold mb-4 text-zinc-900 dark:text-white">Популярные треки</h3>
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">#{i}</span>
                                    <div>
                                        <div className="font-semibold text-zinc-900 dark:text-white">Трек {i}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Артист {i}</div>
                            </div>
                        </div>
                                <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{1000 - i * 100} прослушиваний</div>
                        </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white/90 dark:bg-black/30 border border-gray-200 dark:border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg">
                    <h3 className="text-lg font-bold mb-4 text-zinc-900 dark:text-white">Активность по дням</h3>
                    <div className="h-48 flex items-end justify-between gap-2">
                        {[...Array(7)].map((_, i) => {
                            const h = Math.floor(Math.random() * 80) + 20;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                    <div 
                                        className="w-full bg-indigo-500 rounded-t-lg hover:bg-indigo-600 transition" 
                                        style={{ height: `${h}%` }}
                                    ></div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">День {i + 1}</span>
                            </div>
                            );
                        })}
                            </div>
                            </div>
                            </div>

            <div className="bg-white/90 dark:bg-black/30 border border-gray-200 dark:border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold mb-4 text-zinc-900 dark:text-white">Статистика по жанрам</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Rock', 'Pop', 'Hip-Hop', 'Electronic'].map((genre, i) => (
                        <div key={i} className="text-center p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                            <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-1">{25 + i * 5}%</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{genre}</div>
                    </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
