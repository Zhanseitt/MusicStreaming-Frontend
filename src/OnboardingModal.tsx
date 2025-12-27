import React, { useState } from 'react';
import { Check, Music, Disc, Sparkles, ArrowRight } from 'lucide-react';

// Мок-данные для выбора
const GENRES = [
    { id: 'pop', name: 'Pop', color: 'bg-pink-500' },
    { id: 'hiphop', name: 'Hip-Hop', color: 'bg-orange-500' },
    { id: 'rock', name: 'Rock', color: 'bg-red-600' },
    { id: 'indie', name: 'Indie', color: 'bg-green-500' },
    { id: 'jazz', name: 'Jazz', color: 'bg-blue-600' },
    { id: 'electronic', name: 'Electronic', color: 'bg-purple-600' },
    { id: 'classical', name: 'Classical', color: 'bg-yellow-600' },
    { id: 'rnb', name: 'R&B', color: 'bg-rose-600' },
    { id: 'metal', name: 'Metal', color: 'bg-zinc-700' },
];

const ARTISTS = [
    { id: 'weeknd', name: 'The Weeknd', img: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/The_Weeknd_at_TIFF_2019.png' },
    { id: 'drake', name: 'Drake', img: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Drake_July_2016.jpg' },
    { id: 'taylor', name: 'Taylor Swift', img: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png' },
    { id: 'eminem', name: 'Eminem', img: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Eminem_-_Concert_for_Valor_in_Washington%2C_D.C._Nov._11%2C_2014_%282%29_%28Cropped%29.jpg' },
    { id: 'dua', name: 'Dua Lipa', img: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Dua_Lipa_02_02_2018_-2_%28cropped%29.jpg' },
    { id: 'arctic', name: 'Arctic Monkeys', img: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Arctic_Monkeys_2018.jpg' },
    { id: 'bts', name: 'BTS', img: 'https://upload.wikimedia.org/wikipedia/commons/6/65/BTS_for_Dispatch_White_Day_Special%2C_27_February_2019_03.jpg' },
    { id: 'billie', name: 'Billie Eilish', img: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Billie_Eilish_2019_by_Glenn_Francis_%28cropped%29_2.jpg' },
];

interface OnboardingProps {
    onFinish: () => void;
}

export default function OnboardingModal({ onFinish }: OnboardingProps) {
    const [step, setStep] = useState(1); // 1: Genres, 2: Artists, 3: Loading
    const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set());
    const [selectedArtists, setSelectedArtists] = useState<Set<string>>(new Set());

    const toggleGenre = (id: string) => {
        const newSet = new Set(selectedGenres);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedGenres(newSet);
    };

    const toggleArtist = (id: string) => {
        const newSet = new Set(selectedArtists);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedArtists(newSet);
    };

    const handleNext = () => {
        if (step === 1) setStep(2);
        else if (step === 2) {
            setStep(3);
            // Имитация настройки профиля
            setTimeout(() => {
                onFinish();
            }, 2500);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                
                {/* Фоновые пятна */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-600/20 blur-[80px] rounded-full pointer-events-none" />

                {/* --- ШАГ 1: ЖАНРЫ --- */}
                {step === 1 && (
                    <div className="animate-fade-in flex flex-col h-full">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-extrabold text-white mb-2">Что вы любите слушать?</h2>
                            <p className="text-gray-400">Выберите жанры, чтобы мы могли подобрать музыку для вас.</p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4 mb-8">
                            {GENRES.map(genre => {
                                const isSelected = selectedGenres.has(genre.id);
                                return (
                                    <button
                                        key={genre.id}
                                        onClick={() => toggleGenre(genre.id)}
                                        className={`
                                            px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 border
                                            ${isSelected 
                                                ? `${genre.color} text-white border-transparent shadow-lg scale-105` 
                                                : 'bg-zinc-800 text-gray-300 border-white/10 hover:border-white/30'}
                                        `}
                                    >
                                        {genre.name}
                                        {isSelected && <Check size={16} />}
                                    </button>
                                )
                            })}
                        </div>

                        <div className="mt-auto flex justify-end">
                            <button 
                                onClick={handleNext} 
                                disabled={selectedGenres.size === 0}
                                className={`px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all ${selectedGenres.size > 0 ? 'bg-white text-black hover:bg-gray-200' : 'bg-zinc-800 text-gray-500 cursor-not-allowed'}`}
                            >
                                Далее <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {/* --- ШАГ 2: АРТИСТЫ --- */}
                {step === 2 && (
                    <div className="animate-fade-in flex flex-col h-full">
                         <div className="text-center mb-8">
                            <h2 className="text-3xl font-extrabold text-white mb-2">Выберите любимых артистов</h2>
                            <p className="text-gray-400">Мы добавим их новые релизы в вашу ленту.</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 max-h-[400px] overflow-y-auto custom-scrollbar p-2">
                            {ARTISTS.map(artist => {
                                const isSelected = selectedArtists.has(artist.id);
                                return (
                                    <div 
                                        key={artist.id} 
                                        onClick={() => toggleArtist(artist.id)}
                                        className="flex flex-col items-center gap-3 cursor-pointer group"
                                    >
                                        <div className={`
                                            w-24 h-24 rounded-full overflow-hidden border-4 transition-all duration-300 relative
                                            ${isSelected ? 'border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)] scale-110' : 'border-transparent group-hover:border-white/20'}
                                        `}>
                                            <img src={artist.img} alt={artist.name} className="w-full h-full object-cover" />
                                            {isSelected && (
                                                <div className="absolute inset-0 bg-indigo-500/40 flex items-center justify-center">
                                                    <Check size={32} className="text-white drop-shadow-md" />
                                                </div>
                                            )}
                                        </div>
                                        <span className={`text-sm font-medium transition ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                                            {artist.name}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="mt-auto flex justify-between items-center">
                            <button onClick={() => setStep(1)} className="text-gray-500 hover:text-white transition font-medium">
                                Назад
                            </button>
                            <button 
                                onClick={handleNext} 
                                className="px-8 py-3 rounded-full font-bold flex items-center gap-2 bg-white text-black hover:bg-gray-200 transition-all"
                            >
                                Готово <Sparkles size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {/* --- ШАГ 3: ЗАГРУЗКА --- */}
                {step === 3 && (
                    <div className="animate-fade-in flex flex-col items-center justify-center h-[400px] text-center">
                        <div className="relative mb-8">
                            <div className="w-24 h-24 rounded-full border-4 border-white/10 border-t-indigo-500 animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Music size={32} className="text-white animate-pulse" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-extrabold text-white mb-2">Создаем ваш профиль...</h2>
                        <p className="text-indigo-300">Подбираем лучшие плейлисты на основе вашего вкуса.</p>
                    </div>
                )}

                {/* Индикатор шагов */}
                {step < 3 && (
                    <div className="absolute top-8 right-8 flex gap-2">
                        <div className={`w-2 h-2 rounded-full transition ${step >= 1 ? 'bg-white' : 'bg-white/20'}`} />
                        <div className={`w-2 h-2 rounded-full transition ${step >= 2 ? 'bg-white' : 'bg-white/20'}`} />
                        <div className={`w-2 h-2 rounded-full transition ${step >= 3 ? 'bg-white' : 'bg-white/20'}`} />
                    </div>
                )}
            </div>
        </div>
    );
}