// src/WrappedModal.tsx
import React, { useState, useEffect } from 'react';
import { X, ChevronRight, Music, TrendingUp, Award } from 'lucide-react';
import type { Song } from './MusicPlayer'; // или правильный путь к типу Song

interface WrappedModalProps {
    onClose: () => void;
    userName: string;
    topSongs: Song[];
    topArtists: string[];
    totalMinutes: number;
}

export default function WrappedModal({
    onClose,
    userName,
    topSongs,
    topArtists,
    totalMinutes
}: WrappedModalProps) {
    const [slide, setSlide] = useState(0);
    const totalSlides = 3;

    useEffect(() => {
        const timer = setTimeout(() => {
            if (slide < totalSlides - 1) setSlide(s => s + 1);
        }, 5000);
        return () => clearTimeout(timer);
    }, [slide]);

    const nextSlide = () => {
        if (slide < totalSlides - 1) setSlide(s => s + 1);
        else onClose();
    };

    const topArtistName = topArtists[0] ?? 'The Weeknd';
    const minutes = Math.round(totalMinutes) || 42000;

    const slides = [
        // Слайд 1
        <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gradient-to-br from-indigo-600 to-purple-800">
            <Music size={80} className="text-white mb-6 animate-bounce" />
            <h2 className="text-4xl font-black text-white mb-4">
                Твой 2024 год <br /> в музыке
            </h2>
            <p className="text-xl text-indigo-200">
                Привет, {userName}! Давай посмотрим, что ты слушал.
            </p>
        </div>,

        // Слайд 2: топ-артист
        <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gradient-to-br from-red-600 to-orange-600">
            <Award size={80} className="text-white mb-6 animate-pulse" />
            <h3 className="text-2xl font-bold text-white uppercase tracking-widest mb-2">
                Твой топ артист
            </h3>
            <div className="w-48 h-48 rounded-full border-4 border-white overflow-hidden mb-6 shadow-2xl">
                <img
                    src={topSongs[0]?.cover || 'https://upload.wikimedia.org/wikipedia/commons/e/e8/The_Weeknd_at_TIFF_2019.png'}
                    className="w-full h-full object-cover"
                    alt={topArtistName}
                />
            </div>
            <h1 className="text-5xl font-black text-white">{topArtistName}</h1>
            <p className="text-white/80 mt-2">Ты слушал его {minutes.toLocaleString()} минут!</p>
        </div>,

        // Слайд 3: статистика
        <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gradient-to-br from-green-500 to-teal-700">
            <TrendingUp size={80} className="text-white mb-6" />
            <h2 className="text-4xl font-black text-white mb-8">Ты музыкальный маньяк!</h2>
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 w-full max-w-sm">
                <div className="flex justify-between text-white text-lg font-bold border-b border-white/20 pb-2 mb-2">
                    <span>Всего минут</span>
                    <span>{minutes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white text-lg font-bold border-b border-white/20 pb-2 mb-2">
                    <span>Топ трек</span>
                    <span>{topSongs[0]?.title ?? 'Unknown'}</span>
                </div>
                <div className="flex justify-between text-white text-lg font-bold">
                    <span>Новых треков</span>
                    <span>{topSongs.length}</span>
                </div>
            </div>
            <button
                onClick={onClose}
                className="mt-8 bg-white text-teal-700 px-8 py-3 rounded-full font-bold hover:scale-105 transition"
            >
                Круто!
            </button>
        </div>
    ];

    return (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center animate-fade-in">
            {/* Прогресс бар */}
            <div className="absolute top-4 left-0 w-full px-4 flex gap-2 z-20">
                {[...Array(totalSlides)].map((_, i) => (
                    <div key={i} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                        <div
                            className={`h-full bg-white transition-all duration-[5000ms] ease-linear ${
                                i === slide ? 'w-full' : i < slide ? 'w-full duration-0' : 'w-0'
                            }`}
                        />
                    </div>
                ))}
            </div>

            <button
                onClick={onClose}
                className="absolute top-6 right-6 text-white/50 hover:text-white z-20"
            >
                <X size={32} />
            </button>

            <div
                className="w-full h-full md:w-[400px] md:h-[80vh] md:rounded-3xl overflow-hidden relative shadow-2xl"
                onClick={nextSlide}
            >
                {slides[slide]}
            </div>
        </div>
    );
}
