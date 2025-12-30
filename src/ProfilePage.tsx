import React, { useState, useMemo } from 'react';
import { 
    Settings, Share2, Music, Clock, Heart, Play, 
    Flame, Disc, MoreHorizontal, User, TrendingUp, 
    Star, Trophy, Zap, Activity
} from 'lucide-react';
import { useAuth } from './context/AuthContext';

// --- ТИПЫ (Дублируем локально, чтобы избежать циклической зависимости) ---
export interface Song {
  id: number;
  title: string;
  artist: any;
  album?: string;
  duration: string;
  cover: string;
  audioUrl: string;
  color?: string;
}

export interface MockTrack {
  title?: string;
  name?: string;
  artist: string;
  cover: string;
}

interface ProfilePageProps {
    likedSongs?: Song[];
    likedArtists?: MockTrack[];
    history?: Song[];
    playSong?: (song: Song) => void;
}

export default function ProfilePage({ 
    likedSongs = [], 
    likedArtists = [], 
    history = [], 
    playSong = () => {} 
}: ProfilePageProps) {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'library' | 'playlists' | 'artists' | 'stats'>('library');

    // Безопасные данные
    const safeLikedSongs = Array.isArray(likedSongs) ? likedSongs : [];
    const safeHistory = Array.isArray(history) ? history : [];
    const safeLikedArtists = Array.isArray(likedArtists) ? likedArtists : [];

    // Вычисления
    const totalMinutes = useMemo(() => Math.floor(safeHistory.length * 3.5), [safeHistory]);
    const totalHours = Math.floor(totalMinutes / 60);
    const topArtist = safeHistory.length > 0 ? (typeof safeHistory[0].artist === 'string' ? safeHistory[0].artist : safeHistory[0].artist?.name) : "Неизвестно";

    // Топ артисты
    const topArtistsStats = useMemo(() => {
        const artistCount: { [key: string]: number } = {};
        safeHistory.forEach(song => {
            const name = typeof song.artist === 'string' ? song.artist : song.artist?.name || 'Unknown';
            artistCount[name] = (artistCount[name] || 0) + 1;
        });
        return Object.entries(artistCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 6);
    }, [safeHistory]);

    // Топ жанры (фейковые данные для UI)
    const topGenres = useMemo(() => {
        const genres = ['Pop', 'Rock', 'Hip-Hop', 'Electronic', 'Jazz'];
        return genres.slice(0, 4).map(genre => ({
            name: genre,
            count: Math.floor(Math.random() * 50) + 10,
            percentage: Math.floor(Math.random() * 30) + 10
        }));
    }, []);

    // Недавние альбомы
    const recentAlbums = useMemo(() => {
        const albums: { [key: string]: { cover: string; artist: string; count: number } } = {};
        safeHistory.slice(0, 20).forEach(song => {
            const albumName = song.album || 'Single';
            const artistName = typeof song.artist === 'string' ? song.artist : song.artist?.name || 'Unknown';
            if (!albums[albumName]) {
                albums[albumName] = { cover: song.cover, artist: artistName, count: 0 };
            }
            albums[albumName].count++;
        });
        return Object.entries(albums).sort(([, a], [, b]) => b.count - a.count).slice(0, 6);
    }, [safeHistory]);

    // Активность по дням
    const listeningByDay = useMemo(() => {
        const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        return days.map(day => ({ day, hours: Math.floor(Math.random() * 5) + 1 }));
    }, []);

    return (
        <div className="w-full min-h-screen pb-32 animate-fade-in relative">
            
            {/* ФОНОВЫЙ ГРАДИЕНТ (Мягкий) */}
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto p-8">
                {/* HEADER */}
                <div className="flex flex-col md:flex-row items-end gap-8 mb-12">
                    {/* Аватар */}
                    <div className="relative group">
                        <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl border-4 border-white dark:border-white/10 overflow-hidden">
                            <span className="text-6xl md:text-7xl font-black text-white">{user?.initial || 'U'}</span>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white dark:border-zinc-900" title="Online"></div>
                    </div>

                    <div className="flex-1 w-full text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-bold uppercase mb-3">
                            <Star size={12} fill="currentColor" /> Premium
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black mb-4 text-zinc-900 dark:text-white tracking-tight leading-none">
                            {user?.name || 'Меломан'}
                        </h1>
                        
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                            <span className="flex items-center gap-2">
                                <Heart size={16} className="text-red-500 fill-red-500" />
                                {safeLikedSongs.length} любимых
                            </span>
                            <span className="flex items-center gap-2">
                                <User size={16} />
                                {topArtistsStats.length} артистов
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock size={16} />
                                {totalHours}ч прослушано
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button className="p-3 rounded-full bg-white dark:bg-white/10 hover:bg-zinc-50 dark:hover:bg-white/20 border border-gray-200 dark:border-white/10 transition shadow-sm">
                            <Share2 size={20} className="text-zinc-700 dark:text-zinc-300" />
                        </button>
                        <button className="p-3 rounded-full bg-white dark:bg-white/10 hover:bg-zinc-50 dark:hover:bg-white/20 border border-gray-200 dark:border-white/10 transition shadow-sm">
                            <Settings size={20} className="text-zinc-700 dark:text-zinc-300" />
                        </button>
                    </div>
                </div>

                {/* STATS SUMMARY (Cards) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    <div className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400"><Clock size={20}/></div>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase">Всего</span>
                        </div>
                        <p className="text-2xl font-black text-zinc-900 dark:text-white">{totalHours}ч <span className="text-lg text-zinc-400 font-medium">{totalMinutes % 60}м</span></p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400"><Flame size={20}/></div>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase">Любимый артист</span>
                        </div>
                        <p className="text-xl font-black text-zinc-900 dark:text-white truncate">{topArtist}</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"><Trophy size={20}/></div>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase">Награды</span>
                        </div>
                        <p className="text-2xl font-black text-zinc-900 dark:text-white">12 <span className="text-sm text-zinc-400 font-normal">получено</span></p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-500/20 text-green-600 dark:text-green-400"><TrendingUp size={20}/></div>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase">Стрик</span>
                        </div>
                        <p className="text-2xl font-black text-zinc-900 dark:text-white">7 <span className="text-sm text-zinc-400 font-normal">дней</span></p>
                    </div>
                </div>

                {/* TABS NAVIGATION */}
                <div className="flex gap-1 mb-8 border-b border-gray-200 dark:border-white/10 overflow-x-auto no-scrollbar">
                    {([
                        { id: 'library', label: 'Библиотека', icon: Heart },
                        { id: 'playlists', label: 'Плейлисты', icon: Disc },
                        { id: 'artists', label: 'Артисты', icon: Music },
                        { id: 'stats', label: 'Статистика', icon: Activity }
                    ] as const).map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition border-b-2 whitespace-nowrap ${
                                activeTab === tab.id
                                    ? 'border-indigo-600 text-indigo-600 dark:border-white dark:text-white'
                                    : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                            }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* TAB CONTENT */}
                <div className="animate-fade-in">
                    {activeTab === 'library' && (
                        <div className="space-y-1">
                            {safeLikedSongs.length === 0 ? (
                                <div className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-2xl border-dashed border-2 border-gray-200 dark:border-white/10">
                                    <Heart className="mx-auto mb-4 text-gray-300 dark:text-gray-600" size={48} />
                                    <p className="text-zinc-500 dark:text-zinc-400 font-medium">Список любимых треков пуст</p>
                                </div>
                            ) : (
                                safeLikedSongs.map((song, index) => (
                                    <div key={song.id} onClick={() => playSong(song)} className="group flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition cursor-pointer border-b border-gray-50 dark:border-white/5 last:border-0">
                                        <span className="w-8 text-center text-sm font-medium text-zinc-400 group-hover:text-indigo-600">{index + 1}</span>
                                        <img src={song.cover} alt="" className="w-12 h-12 rounded-md shadow-sm object-cover" />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-zinc-900 dark:text-white truncate">{song.title}</h3>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{typeof song.artist === 'string' ? song.artist : song.artist?.name}</p>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition mr-4">
                                            <div className="p-2 rounded-full bg-indigo-600 text-white shadow-lg transform scale-90 hover:scale-100"><Play size={14} fill="white"/></div>
                                        </div>
                                        <span className="text-xs text-zinc-400 font-mono w-12 text-right">{song.duration}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'playlists' && (
                        <div className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-2xl border-dashed border-2 border-gray-200 dark:border-white/10">
                            <Disc className="mx-auto mb-4 text-gray-300 dark:text-gray-600" size={48} />
                            <p className="text-zinc-500 dark:text-zinc-400 font-medium">Нет публичных плейлистов</p>
                        </div>
                    )}

                    {activeTab === 'artists' && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {topArtistsStats.map(([artist, count], index) => (
                                <div key={artist} className="p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:shadow-md transition text-center group cursor-pointer">
                                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-zinc-700 dark:to-zinc-800 mb-3 flex items-center justify-center text-xl font-bold text-gray-500 dark:text-gray-400 shadow-inner">
                                        {index + 1}
                                    </div>
                                    <h3 className="font-bold text-sm text-zinc-900 dark:text-white truncate">{artist}</h3>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">{count} треков</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'stats' && (
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">Топ жанры</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {topGenres.map(g => (
                                        <div key={g.name} className="p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                            <div className="flex justify-between mb-2">
                                                <span className="font-bold text-zinc-700 dark:text-zinc-200">{g.name}</span>
                                                <span className="font-bold text-indigo-600">{g.percentage}%</span>
                                            </div>
                                            <div className="h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-indigo-500 rounded-full" style={{width: `${g.percentage}%`}}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">Активность</h3>
                                <div className="h-48 flex items-end gap-2 p-6 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                    {listeningByDay.map(day => (
                                        <div key={day.day} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                                            <div className="w-full bg-indigo-100 dark:bg-indigo-500/20 rounded-t-md relative h-32 flex items-end overflow-hidden">
                                                <div 
                                                    className="w-full bg-indigo-500 group-hover:bg-indigo-600 transition-all duration-500 rounded-t-md" 
                                                    style={{height: `${(day.hours/5)*100}%`}}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-bold text-zinc-400">{day.day}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
