// src/AdminPage.tsx
import React, { useState, useEffect } from 'react';
import { 
    Users, Music, DollarSign, BarChart2, Search, Trash2, 
    Edit, Shield, AlertTriangle, CheckCircle, X, 
    Play, TrendingUp, Activity, Server, UploadCloud, Save, FileText 
} from 'lucide-react';
// Импорт только типа из плеера
import type { Song } from './MusicPlayer';


// --- ТИПЫ ---
interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'artist' | 'admin';
    status: 'active' | 'banned';
    joined: string;
    spent: string;
}


interface LogEntry {
    id: number;
    time: string;
    action: string;
    user: string;
    type: 'info' | 'warning' | 'error' | 'success';
}


// --- ДАННЫЕ ---
const initialUsers: AdminUser[] = [
    { id: 1, name: "Арсен", email: "arsen@example.com", role: "admin", status: "active", joined: "15.01.2023", spent: "-" },
    { id: 2, name: "The Weeknd", email: "abel@xo.com", role: "artist", status: "active", joined: "20.02.2023", spent: "-" },
    { id: 3, name: "Иван Иванов", email: "ivan@mail.ru", role: "user", status: "active", joined: "10.05.2023", spent: "12 450 ₸" },
    { id: 4, name: "Spam Bot", email: "bot@spam.net", role: "user", status: "banned", joined: "01.06.2023", spent: "0 ₸" },
    { id: 5, name: "Анна Смит", email: "anna@gmail.com", role: "user", status: "active", joined: "15.06.2023", spent: "4 780 ₸" },
    { id: 6, name: "Dua Lipa", email: "dua@lipa.com", role: "artist", status: "active", joined: "12.03.2023", spent: "-" },
];


const initialLogs: LogEntry[] = [
    { id: 1, time: "10:42", action: "Новая подписка Premium", user: "Иван Иванов", type: "success" },
    { id: 2, time: "10:38", action: "Ошибка оплаты", user: "Spam Bot", type: "error" },
    { id: 3, time: "10:15", action: "Загружен новый трек", user: "The Weeknd", type: "info" },
    { id: 4, time: "09:50", action: "Вход в систему", user: "Арсен", type: "info" },
];


// Моковые треки для админ панели (независимые от MusicPlayer)
const mockTracksForAdmin: Song[] = [
    {
        id: 1,
        title: "Blinding Lights",
        artist: "The Weeknd",
        album: "After Hours",
        duration: "3:20",
        cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop",
        audioUrl: ""
    },
    {
        id: 2,
        title: "Levitating",
        artist: "Dua Lipa",
        album: "Future Nostalgia",
        duration: "3:23",
        cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=300&auto=format&fit=crop",
        audioUrl: ""
    },
    {
        id: 3,
        title: "Save Your Tears",
        artist: "The Weeknd",
        album: "After Hours",
        duration: "3:35",
        cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop",
        audioUrl: ""
    }
];


// --- ГЛАВНЫЙ КОМПОНЕНТ ---
export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'content'>('dashboard');

    // Состояния данных
    const [users, setUsers] = useState<AdminUser[]>(initialUsers);
    const [tracks, setTracks] = useState<Song[]>(mockTracksForAdmin);
    const [logs, setLogs] = useState<LogEntry[]>(initialLogs);

    // Состояния интерфейса
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState<'all' | 'user' | 'artist' | 'admin'>('all');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);


    // Форма добавления трека
    const [newTrack, setNewTrack] = useState({ title: '', artist: '', album: '' });


    // Симуляция живых данных (CPU/RAM)
    const [serverLoad, setServerLoad] = useState({ cpu: 34, ram: 62 });


    useEffect(() => {
        const interval = setInterval(() => {
            setServerLoad({
                cpu: Math.floor(Math.random() * 30) + 20,
                ram: Math.floor(Math.random() * 10) + 60
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);


    // --- ФУНКЦИИ ---


    const addLog = (action: string, user: string, type: 'info' | 'warning' | 'error' | 'success') => {
        const newLog: LogEntry = {
            id: Date.now(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            action,
            user,
            type
        };
        setLogs(prev => [newLog, ...prev]);
    };


    // Управление пользователями
    const toggleUserStatus = (id: number) => {
        setUsers(users.map(u => {
            if (u.id === id) {
                const newStatus = u.status === 'active' ? 'banned' : 'active';
                addLog(`Статус изменен: ${newStatus}`, u.name, 'warning');
                return { ...u, status: newStatus };
            }
            return u;
        }));
    };


    const handleDeleteUser = (id: number) => {
        const userToDelete = users.find(u => u.id === id);
        if (window.confirm(`Удалить пользователя ${userToDelete?.name}?`)) {
            setUsers(users.filter(u => u.id !== id));
            addLog('Пользователь удален', userToDelete?.name || 'Unknown', 'error');
        }
    };


    const handleSaveUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
            addLog('Данные обновлены', editingUser.name, 'info');
            setEditingUser(null);
        }
    };


    // Управление контентом
    const handleDeleteTrack = (id: number | string) => {
        if (window.confirm('Удалить трек?')) {
            setTracks(tracks.filter(t => t.id !== id));
            addLog('Трек удален', 'Admin', 'warning');
        }
    };


    const handleUploadTrack = (e: React.FormEvent) => {
        e.preventDefault();
        const track: Song = {
            id: Date.now(),
            title: newTrack.title,
            artist: newTrack.artist,
            album: newTrack.album,
            duration: "3:00",
            cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop",
            audioUrl: ""
        };
        setTracks([track, ...tracks]);
        addLog('Новый трек загружен', 'Admin', 'success');
        setIsUploadModalOpen(false);
        setNewTrack({ title: '', artist: '', album: '' });
    };


    // Фильтрация
    const filteredUsers = users.filter(u => 
        (filterRole === 'all' || u.role === filterRole) &&
        (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
         u.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );


    // --- РЕНДЕР КОМПОНЕНТЫ ---


    // 1. ДАШБОРД
    const renderDashboard = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Основная статистика (2/3 ширины) */}
            <div className="lg:col-span-2 space-y-6">
                {/* Карточки */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-zinc-900/50 border border-white/10 p-5 rounded-2xl">
                        <div className="flex justify-between mb-2">
                            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg"><Users size={20}/></div>
                            <span className="text-green-400 text-xs font-bold flex items-center">+12% <TrendingUp size={12} className="ml-1"/></span>
                        </div>
                        <div className="text-2xl font-bold text-white">{users.length * 142}</div>
                        <div className="text-xs text-gray-500">Активных юзеров</div>
                    </div>
                    <div className="bg-zinc-900/50 border border-white/10 p-5 rounded-2xl">
                        <div className="flex justify-between mb-2">
                            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg"><DollarSign size={20}/></div>
                            <span className="text-green-400 text-xs font-bold flex items-center">+8% <TrendingUp size={12} className="ml-1"/></span>
                        </div>
                        <div className="text-2xl font-bold text-white">$12,450</div>
                        <div className="text-xs text-gray-500">Выручка (мес)</div>
                    </div>
                    <div className="bg-zinc-900/50 border border-white/10 p-5 rounded-2xl">
                        <div className="flex justify-between mb-2">
                            <div className="p-2 bg-fuchsia-500/20 text-fuchsia-400 rounded-lg"><Music size={20}/></div>
                            <span className="text-gray-500 text-xs font-bold">0%</span>
                        </div>
                        <div className="text-2xl font-bold text-white">{tracks.length}</div>
                        <div className="text-xs text-gray-500">Всего треков</div>
                    </div>
                    <div className="bg-zinc-900/50 border border-white/10 p-5 rounded-2xl">
                        <div className="flex justify-between mb-2">
                            <div className="p-2 bg-orange-500/20 text-orange-400 rounded-lg"><AlertTriangle size={20}/></div>
                            <span className="text-red-400 text-xs font-bold">2</span>
                        </div>
                        <div className="text-2xl font-bold text-white">5</div>
                        <div className="text-xs text-gray-500">Жалобы</div>
                    </div>
                </div>


                {/* График активности */}
                <div className="bg-zinc-900/50 border border-white/10 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Activity size={20} className="text-indigo-500"/> Трафик в реальном времени
                    </h3>
                    <div className="h-48 flex items-end justify-between gap-1">
                        {[...Array(30)].map((_, i) => {
                            const h = Math.floor(Math.random() * 80) + 20;
                            return (
                                <div 
                                    key={i} 
                                    className="w-full bg-indigo-500/30 hover:bg-indigo-500 transition-all rounded-t-sm" 
                                    style={{ height: `${h}%` }}
                                ></div>
                            )
                        })}
                    </div>
                </div>
            </div>


            {/* Правая колонка (Логи и Сервер) */}
            <div className="space-y-6">
                {/* Статус сервера */}
                <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 p-6 rounded-2xl">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Server size={16}/> Server Status
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs mb-1 text-gray-400"><span>CPU Usage</span><span>{serverLoad.cpu}%</span></div>
                            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 transition-all duration-1000" style={{width: `${serverLoad.cpu}%`}}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-1 text-gray-400"><span>RAM Usage</span><span>{serverLoad.ram}%</span></div>
                            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 transition-all duration-1000" style={{width: `${serverLoad.ram}%`}}></div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Лог активности */}
                <div className="bg-zinc-900/50 border border-white/10 p-6 rounded-2xl h-80 overflow-hidden flex flex-col">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <FileText size={16}/> Audit Log
                    </h3>
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                        {logs.map(log => (
                            <div key={log.id} className="flex gap-3 text-sm border-b border-white/5 pb-2 last:border-0">
                                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                                    log.type === 'success' ? 'bg-green-500' : 
                                    log.type === 'error' ? 'bg-red-500' : 
                                    log.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                                }`}></div>
                                <div>
                                    <div className="text-white font-medium">{log.action}</div>
                                    <div className="text-xs text-gray-500">{log.user} • {log.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );


    // 2. ПОЛЬЗОВАТЕЛИ
    const renderUsers = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex gap-2 bg-zinc-900 p-1 rounded-xl border border-white/10">
                    {['all', 'user', 'artist', 'admin'].map(role => (
                        <button 
                            key={role}
                            onClick={() => setFilterRole(role as any)}
                            className={`px-4 py-2 rounded-lg text-sm capitalize transition ${filterRole === role ? 'bg-white text-black font-bold' : 'text-gray-400 hover:text-white'}`}
                        >
                            {role === 'all' ? 'Все' : role}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                        type="text" 
                        placeholder="Поиск пользователя..." 
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>


            <div className="bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-gray-400 text-xs uppercase font-bold">
                        <tr>
                            <th className="p-4">User</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Spent</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="hover:bg-white/5 transition text-gray-300 text-sm">
                                <td className="p-4 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                                        {user.name[0]}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white">{user.name}</div>
                                        <div className="text-xs text-gray-500">{user.email}</div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                        user.role === 'admin' ? 'bg-red-500/10 text-red-400' : 
                                        user.role === 'artist' ? 'bg-purple-500/10 text-purple-400' : 
                                        'bg-blue-500/10 text-blue-400'
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className={`flex items-center gap-1.5 text-xs font-bold ${user.status === 'active' ? 'text-green-400' : 'text-red-400'}`}>
                                        <div className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                                        {user.status === 'active' ? 'Active' : 'Banned'}
                                    </span>
                                </td>
                                <td className="p-4 font-mono text-gray-400">{user.spent}</td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => toggleUserStatus(user.id)} className="p-2 hover:bg-white/10 rounded-lg transition text-gray-400 hover:text-white">
                                            {user.status === 'active' ? <Shield size={16} /> : <CheckCircle size={16} className="text-green-500"/>}
                                        </button>
                                        <button onClick={() => setEditingUser(user)} className="p-2 hover:bg-white/10 rounded-lg transition text-blue-400"><Edit size={16}/></button>
                                        <button onClick={() => handleDeleteUser(user.id)} className="p-2 hover:bg-red-500/20 rounded-lg transition text-red-500"><Trash2 size={16}/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );


    // 3. КОНТЕНТ
    const renderContent = () => (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Библиотека треков</h2>
                <button 
                    onClick={() => setIsUploadModalOpen(true)} 
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition shadow-lg"
                >
                    <UploadCloud size={18}/> Загрузить трек
                </button>
            </div>


            <div className="bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-gray-400 text-xs uppercase font-bold">
                        <tr>
                            <th className="p-4 w-12">#</th>
                            <th className="p-4">Трек</th>
                            <th className="p-4">Артист</th>
                            <th className="p-4">Альбом</th>
                            <th className="p-4 text-right">Действия</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {tracks.map((track) => (
                            <tr key={track.id} className="hover:bg-white/5 transition group text-gray-300 text-sm">
                                <td className="p-4">
                                    <div className="relative w-10 h-10 rounded overflow-hidden group-hover:opacity-90 cursor-pointer">
                                        <img src={track.cover} className="w-full h-full object-cover" alt="" />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                            <Play size={16} fill="white" className="text-white" />
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 font-bold text-white">{track.title}</td>
                                <td className="p-4">{track.artist}</td>
                                <td className="p-4 text-gray-500">{track.album}</td>
                                <td className="p-4 text-right">
                                    <button onClick={() => handleDeleteTrack(track.id)} className="p-2 hover:bg-red-500/20 rounded-lg text-red-500 transition"><Trash2 size={16}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );


    return (
        <div className="p-8 w-full min-h-screen relative overflow-hidden text-white bg-transparent">

            {/* Заголовок и Табы */}
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Панель Администратора</h1>
                    <p className="text-gray-500 text-sm mt-1">SoundWave v2.5 • <span className="text-green-500">Online</span></p>
                </div>
                <div className="flex gap-1 bg-black/40 p-1 rounded-xl border border-white/10 backdrop-blur-sm">
                    {[
                        { id: 'dashboard', label: 'Дашборд', icon: BarChart2 },
                        { id: 'users', label: 'Пользователи', icon: Users },
                        { id: 'content', label: 'Контент', icon: Music },
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                activeTab === tab.id 
                                ? 'bg-indigo-600 text-white shadow-lg' 
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </header>


            {/* Контент вкладок */}
            <div className="relative z-10 pb-20">
                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'users' && renderUsers()}
                {activeTab === 'content' && renderContent()}
            </div>


            {/* МОДАЛКА: Загрузка трека */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl w-96 shadow-2xl">
                        <h3 className="text-xl font-bold mb-4">Загрузить новый трек</h3>
                        <div className="space-y-4">
                            <input type="text" placeholder="Название трека" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white" value={newTrack.title} onChange={e => setNewTrack({...newTrack, title: e.target.value})} />
                            <input type="text" placeholder="Артист" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white" value={newTrack.artist} onChange={e => setNewTrack({...newTrack, artist: e.target.value})} />
                            <input type="text" placeholder="Альбом" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white" value={newTrack.album} onChange={e => setNewTrack({...newTrack, album: e.target.value})} />
                            <div className="border-2 border-dashed border-white/20 p-6 text-center rounded-lg text-gray-400 text-sm cursor-pointer hover:border-indigo-500 hover:text-indigo-400 transition">
                                <UploadCloud className="mx-auto mb-2"/> Перетащите MP3 файл
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setIsUploadModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">Отмена</button>
                            <button onClick={handleUploadTrack} className="px-4 py-2 bg-green-600 rounded-lg text-white font-bold hover:bg-green-500">Загрузить</button>
                        </div>
                    </div>
                </div>
            )}


            {/* МОДАЛКА: Редактирование юзера */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl w-96 shadow-2xl">
                        <h3 className="text-xl font-bold mb-4">Редактировать пользователя</h3>
                        <form onSubmit={handleSaveUser} className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Имя</label>
                                <input type="text" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white" value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Email</label>
                                <input type="text" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white" value={editingUser.email} onChange={e => setEditingUser({...editingUser, email: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Роль</label>
                                <select 
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white"
                                    value={editingUser.role}
                                    onChange={e => setEditingUser({...editingUser, role: e.target.value as any})}
                                >
                                    <option value="user">User</option>
                                    <option value="artist">Artist</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 text-gray-400 hover:text-white">Отмена</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 rounded-lg text-white font-bold hover:bg-indigo-500 flex items-center gap-2"><Save size={16}/> Сохранить</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
