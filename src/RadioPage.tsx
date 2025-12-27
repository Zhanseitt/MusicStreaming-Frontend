// src/RadioPage.tsx
import React from 'react';
import { Play, Radio, Zap, Coffee, Moon, Sun } from 'lucide-react';
// ИСПРАВЛЕНИЕ: Только импорт типа
import type { Song } from './MusicPlayer';


interface RadioPageProps {
    playSong: (song: Song) => void;
}

// Локальные моковые данные для радиостанций
const mockRadioSongs: Song[] = [
    {
        id: 1,
        title: "Energy Mix",
        artist: "Various Artists",
        album: "Workout Hits",
        duration: "3:20",
        cover: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=300&auto=format&fit=crop",
        audioUrl: ""
    },
    {
        id: 2,
        title: "Chill Vibes",
        artist: "Lo-Fi Beats",
        album: "Relax & Focus",
        duration: "3:45",
        cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=300&auto=format&fit=crop",
        audioUrl: ""
    },
    {
        id: 3,
        title: "Night Drive",
        artist: "Synthwave Dreams",
        album: "Midnight City",
        duration: "4:12",
        cover: "https://images.unsplash.com/photo-1518544487467-3318f77d3f10?q=80&w=300&auto=format&fit=crop",
        audioUrl: ""
    },
    {
        id: 4,
        title: "Pop Radio",
        artist: "Top 40 Hits",
        album: "Chart Toppers",
        duration: "3:30",
        cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=300&auto=format&fit=crop",
        audioUrl: ""
    }
];


export default function RadioPage({ playSong }: RadioPageProps) {
    const stations = [
        { name: "Энергия", icon: Zap, color: "from-yellow-400 to-orange-600", desc: "Для тренировок и драйва" },
        { name: "Релакс", icon: Coffee, color: "from-green-400 to-teal-600", desc: "Спокойствие и уют" },
        { name: "Ночной вайб", icon: Moon, color: "from-indigo-400 to-purple-600", desc: "Дип-хаус и лоу-фай" },
        { name: "Поп-хиты", icon: Sun, color: "from-pink-400 to-rose-600", desc: "Только популярное" },
    ];


    return (
        <div className="p-8 pb-32 animate-fade-in">
            {/* Баннер */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-900 p-10 shadow-2xl mb-10 group cursor-pointer border border-white/10"
                 onClick={() => playSong(mockRadioSongs[0])}>

                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2 text-indigo-200 uppercase tracking-widest text-sm font-bold">
                            <Radio size={18} />
                            <span>Персональный поток</span>
                        </div>
                        <h1 className="text-5xl font-extrabold text-white mb-4 drop-shadow-lg">Моя Волна</h1>
                        <p className="text-indigo-100 text-lg">Бесконечный микс под твое настроение.</p>
                    </div>
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg text-indigo-600 group-hover:scale-110 transition">
                        <Play size={28} fill="currentColor" className="ml-1" />
                    </div>
                </div>
            </div>


            {/* Станции */}
            <h2 className="text-2xl font-bold text-white mb-6">Выбрать настроение</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stations.map((station, idx) => (
                    <div 
                        key={idx}
                        onClick={() => playSong(mockRadioSongs[idx % mockRadioSongs.length])}
                        className="relative overflow-hidden rounded-2xl p-6 cursor-pointer hover:scale-[1.02] transition-all border border-white/5 bg-zinc-900/40 group shadow-lg hover:shadow-xl"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${station.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                        <station.icon size={32} className="mb-4 text-gray-300 group-hover:text-white transition-colors relative z-10" />
                        <h3 className="text-xl font-bold text-white mb-1 relative z-10">{station.name}</h3>
                        <p className="text-sm text-gray-400 relative z-10">{station.desc}</p>
                    </div>
                ))}
            </div>

            {/* Дополнительная информация */}
            <div className="mt-12 p-8 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl border border-white/5">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <Radio size={24} className="text-indigo-400" />
                    Радио работает 24/7
                </h3>
                <p className="text-gray-400">
                    Персонализированный поток музыки, который подстраивается под твои предпочтения. 
                    Без рекламы, без перерывов — только твои любимые треки.
                </p>
            </div>
        </div>
    );
}
