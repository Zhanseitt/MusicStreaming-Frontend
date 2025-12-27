// src/ProfilePage.tsx
import React, { useState, useMemo } from 'react';
import { 
    Settings, Share2, Music, Clock, Heart, Award, Play, 
    Flame, Disc, MoreHorizontal, User, TrendingUp, ChevronRight, 
    Radio, Calendar, Headphones, Star, Trophy, Zap, Activity
} from 'lucide-react';
import { useAuth } from './context/AuthContext';
import type { Song, MockTrack } from './MusicPlayer';

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

    // Защита от undefined и проверка что это массив
    const safeLikedSongs = Array.isArray(likedSongs) ? likedSongs : [];
    const safeHistory = Array.isArray(history) ? history : [];
    const safeLikedArtists = Array.isArray(likedArtists) ? likedArtists : [];

    // Вычисления статистики
    const totalMinutes = useMemo(() => Math.floor(safeHistory.length * 3.5), [safeHistory]);
    const totalHours = Math.floor(totalMinutes / 60);
    const topArtist = safeHistory.length > 0 ? safeHistory[0].artist : "Неизвестно";

    // Топ артисты из истории
    const topArtistsStats = useMemo(() => {
        const artistCount: { [key: string]: number } = {};
        safeHistory.forEach(song => {
            artistCount[song.artist] = (artistCount[song.artist] || 0) + 1;
        });
        return Object.entries(artistCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 6);
    }, [safeHistory]);

    // Топ жанры (примерная логика)
    const topGenres = useMemo(() => {
        const genres = ['Pop', 'Rock', 'Hip-Hop', 'Electronic', 'Jazz', 'Classical'];
        return genres.slice(0, 4).map((genre, idx) => ({
            name: genre,
            count: Math.floor(Math.random() * 50) + 10,
            percentage: Math.floor(Math.random() * 30) + 10
        }));
    }, []);

    // Недавние альбомы
    const recentAlbums = useMemo(() => {
        const albums: { [key: string]: { cover: string; artist: string; count: number } } = {};
        safeHistory.slice(0, 20).forEach(song => {
            const album = song.album || 'Unknown Album';
            if (!albums[album]) {
                albums[album] = { cover: song.cover, artist: song.artist, count: 0 };
            }
            albums[album].count++;
        });
        return Object.entries(albums)
            .sort(([, a], [, b]) => b.count - a.count)
            .slice(0, 6);
    }, [safeHistory]);

    // Время прослушивания по дням недели
    const listeningByDay = useMemo(() => {
        const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        return days.map(day => ({
            day,
            hours: Math.floor(Math.random() * 5) + 1
        }));
    }, []);

    return (
        <div className="w-full min-h-screen pb-32 relative overflow-hidden">
            
            {/* ANIMATED BACKGROUND */}
            <div className="fixed inset-0 -z-10">
                {/* Основной градиент */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-zinc-50 to-stone-50 dark:from-zinc-950 dark:via-slate-950 dark:to-neutral-950"></div>
                
                {/* Анимированные blob'ы */}
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-200/20 to-indigo-200/20 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-gradient-to-br from-purple-200/20 to-pink-200/20 dark:from-purple-900/10 dark:to-pink-900/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/3 w-[550px] h-[550px] bg-gradient-to-br from-rose-200/20 to-orange-200/20 dark:from-rose-900/10 dark:to-orange-900/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            {/* HEADER */}
            <div className="relative z-10 p-8">
                <div className="flex items-end gap-6 mb-8">
                    {/* Avatar */}
                    <div className="w-48 h-48 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl border-4 border-white dark:border-white/10 relative overflow-hidden group">
                        <span className="text-7xl font-black text-white relative z-10">{user?.initial || 'U'}</span>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>

                    <div className="flex-1">
                        <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-2 flex items-center gap-2">
                            <Star size={16} className="fill-indigo-600 dark:fill-indigo-400" />
                            Профиль Premium
                        </p>
                        <h1 className="text-6xl font-black mb-4 text-zinc-900 dark:text-white">{user?.name || 'Пользователь'}</h1>
                        <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                            <span className="font-semibold flex items-center gap-1">
                                <Heart size={14} className="fill-red-500 text-red-500" />
                                {safeLikedSongs.length} любимых
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <User size={14} />
                                {topArtistsStats.length} артистов
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {totalHours}ч прослушано
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button className="p-3 rounded-full bg-white dark:bg-white/10 hover:bg-zinc-100 dark:hover:bg-white/20 transition border border-gray-200 dark:border-white/10 shadow-sm">
                            <Share2 size={20} className="text-zinc-700 dark:text-zinc-300" />
                        </button>
                        <button className="p-3 rounded-full bg-white dark:bg-white/10 hover:bg-zinc-100 dark:hover:bg-white/20 transition border border-gray-200 dark:border-white/10 shadow-sm">
                            <MoreHorizontal size={20} className="text-zinc-700 dark:text-zinc-300" />
                        </button>
                        <button className="p-3 rounded-full bg-white dark:bg-white/10 hover:bg-zinc-100 dark:hover:bg-white/20 transition border border-gray-200 dark:border-white/10 shadow-sm">
                            <Settings size={20} className="text-zinc-700 dark:text-zinc-300" />
                        </button>
                    </div>
                </div>

                {/* STATS CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-3">
                            <Clock className="text-indigo-600 dark:text-indigo-400" size={24} />
                            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Прослушано</span>
                        </div>
                        <p className="text-3xl font-black text-zinc-900 dark:text-white mb-1">{totalHours}ч {totalMinutes % 60}м</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{safeHistory.length} треков</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-3">
                            <Flame className="text-orange-500" size={24} />
                            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Топ артист</span>
                        </div>
                        <p className="text-2xl font-black text-zinc-900 dark:text-white mb-1 truncate">{topArtist}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {topArtistsStats.length > 0 ? `${topArtistsStats[0][1]} прослушиваний` : 'Нет данных'}
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-3">
                            <Trophy className="text-yellow-500" size={24} />
                            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Достижения</span>
                        </div>
                        <p className="text-3xl font-black text-zinc-900 dark:text-white mb-1">12</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Открыто наград</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-3">
                            <TrendingUp className="text-green-500" size={24} />
                            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Стрик</span>
                        </div>
                        <p className="text-3xl font-black text-zinc-900 dark:text-white mb-1">7 дней</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Ежедневное прослушивание</p>
                    </div>
                </div>

                {/* TABS */}
                <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-white/10 overflow-x-auto">
                    {(['library', 'playlists', 'artists', 'stats'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 font-bold text-sm transition border-b-2 whitespace-nowrap ${
                                activeTab === tab
                                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                                    : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                            }`}
                        >
                            {tab === 'library' && '📚 Библиотека'}
                            {tab === 'playlists' && '🎵 Плейлисты'}
                            {tab === 'artists' && '🎤 Артисты'}
                            {tab === 'stats' && '📊 Статистика'}
                        </button>
                    ))}
                </div>

                {/* CONTENT */}
                {activeTab === 'library' && (
                    <div className="space-y-2">
                        {safeLikedSongs.length === 0 ? (
                            <div className="text-center py-20 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                                <Heart className="mx-auto mb-4 text-gray-400 dark:text-gray-600" size={64} />
                                <p className="text-zinc-500 dark:text-zinc-400 text-lg font-semibold mb-2">Нет любимых треков</p>
                                <p className="text-zinc-400 dark:text-zinc-500 text-sm">Нажмите ❤️ на треке, чтобы добавить его сюда</p>
                            </div>
                        ) : (
                            safeLikedSongs.map((song, index) => (
                                <div
                                    key={song.id}
                                    onClick={() => playSong(song)}
                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white dark:hover:bg-white/10 border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition cursor-pointer group"
                                >
                                    <span className="w-8 text-center text-sm font-bold text-zinc-500 dark:text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                        {index + 1}
                                    </span>
                                    <img src={song.cover} alt={song.title} className="w-14 h-14 rounded-lg shadow-sm" />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-zinc-900 dark:text-white truncate">{song.title}</h3>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">{song.artist}</p>
                                    </div>
                                    <button className="p-2 rounded-full bg-indigo-600 text-white opacity-0 group-hover:opacity-100 transition hover:scale-110 shadow-lg">
                                        <Play size={16} fill="white" />
                                    </button>
                                    <span className="text-sm text-zinc-500 dark:text-zinc-400 w-16 text-right">{song.duration}</span>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'playlists' && (
                    <div className="text-center py-20 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                        <Disc className="mx-auto mb-4 text-gray-400 dark:text-gray-600" size={64} />
                        <p className="text-zinc-500 dark:text-zinc-400 text-lg font-semibold mb-2">Нет плейлистов</p>
                        <p className="text-zinc-400 dark:text-zinc-500 text-sm">Создайте свой первый плейлист</p>
                    </div>
                )}

                {activeTab === 'artists' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white flex items-center gap-2">
                            <Music size={24} />
                            Ваши топ артисты
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {topArtistsStats.map(([artist, count], index) => (
                                <div
                                    key={artist}
                                    className="p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:shadow-md dark:hover:bg-white/10 transition cursor-pointer text-center group"
                                >
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition shadow-lg">
                                        <span className="text-3xl font-black text-white">#{index + 1}</span>
                                    </div>
                                    <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-1 truncate">{artist}</h3>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{count} треков</p>
                                </div>
                            ))}
                        </div>

                        {/* Недавние альбомы */}
                        <h2 className="text-2xl font-bold mb-6 mt-12 text-zinc-900 dark:text-white flex items-center gap-2">
                            <Disc size={24} />
                            Недавние альбомы
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {recentAlbums.map(([album, data]) => (
                                <div
                                    key={album}
                                    className="p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:shadow-md transition cursor-pointer group"
                                >
                                    <img src={data.cover} alt={album} className="w-full aspect-square rounded-lg mb-3 shadow-md group-hover:scale-105 transition" />
                                    <h3 className="font-bold text-xs text-zinc-900 dark:text-white mb-1 truncate">{album}</h3>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{data.artist}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'stats' && (
                    <div>
                        {/* Топ жанры */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white flex items-center gap-2">
                                <Zap size={24} />
                                Топ жанры
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {topGenres.map((genre) => (
                                    <div
                                        key={genre.name}
                                        className="p-6 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md transition"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="font-bold text-lg text-zinc-900 dark:text-white">{genre.name}</h3>
                                            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{genre.percentage}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden mb-2">
                                            <div 
                                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                                                style={{ width: `${genre.percentage}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{genre.count} треков прослушано</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Активность по дням недели */}
                        <div>
                            <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white flex items-center gap-2">
                                <Activity size={24} />
                                Активность по дням
                            </h2>
                            <div className="p-6 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm">
                                <div className="flex items-end justify-between gap-4 h-48">
                                    {listeningByDay.map((day) => (
                                        <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                                            <div className="w-full flex flex-col justify-end flex-1">
                                                <div 
                                                    className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-lg transition-all duration-500 hover:from-indigo-500 hover:to-purple-400 cursor-pointer"
                                                    style={{ height: `${(day.hours / 5) * 100}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{day.day}</p>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400">{day.hours}ч</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
