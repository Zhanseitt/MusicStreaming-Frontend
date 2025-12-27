// src/LandingPage.tsx
import React from 'react';
import { 
    Play, Check, Zap, Shield, Smartphone, X, Headphones, Globe, Sparkles, Layers, 
    AudioWaveform, Instagram, Twitter, Facebook // <-- Добавлены новые иконки
} from 'lucide-react';

interface LandingPageProps {
    onSelectPlan: (plan: string) => void;
    onDirectLogin: () => void;
    currency: 'USD' | 'KZT';
    setCurrency: (c: 'USD' | 'KZT') => void;
}

export default function LandingPage({ onSelectPlan, onDirectLogin, currency, setCurrency }: LandingPageProps) {
    
    const prices = {
        USD: { 
            basic: '3.99 $',         
            premium_promo: '0.01 $', 
            premium_regular: '5.99 $',
            student: '2.99 $' 
        },
        KZT: { 
            basic: '1 690 ₸',        
            premium_promo: '1 ₸',    
            premium_regular: '2 390 ₸',
            student: '1 190 ₸' 
        }
    };

    return (
        <div className="min-h-screen w-full text-white overflow-y-auto custom-scrollbar relative z-10 pb-0">
            
            {/* --- HEADER --- */}
            <header className="flex justify-between items-center p-6 max-w-7xl mx-auto w-full animate-fade-in-up">
                <div className="flex items-center gap-3">
                    {/* НОВАЯ ИКОНКА ЛОГОТИПА */}
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                        <AudioWaveform size={20} strokeWidth={2.5} />
                    </div>
                    <span className="text-2xl font-bold tracking-tight">SoundWave</span>
                </div>
                <div className="flex gap-4 items-center">
                    <button onClick={onDirectLogin} className="text-gray-300 hover:text-white transition font-medium">Войти</button>
                    <button 
                        onClick={() => onSelectPlan('Free')} // Исправил на открытие регистрации
                        className="bg-white text-black px-5 py-2 rounded-full font-bold hover:scale-105 transition shadow-lg hover:shadow-white/20"
                    >
                        Регистрация
                    </button>
                </div>
            </header>

            {/* --- HERO SECTION --- */}
            <section className="flex flex-col items-center justify-center text-center px-4 mt-12 mb-32">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-6 backdrop-blur-md animate-fade-in-up delay-100">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span className="text-sm font-medium text-indigo-200">Первый месяц — за {prices[currency].premium_promo}</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight max-w-5xl animate-fade-in-up delay-200">
                    Слушай, чувствуй, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-indigo-400">живи в ритме.</span>
                </h1>
                <p className="text-lg text-gray-400 max-w-2xl mb-10 leading-relaxed animate-fade-in-up delay-300">
                    Откройте для себя миллионы треков в Hi-Fi качестве. Умные алгоритмы подберут музыку под ваше настроение, а живые обои создадут уникальную атмосферу.
                </p>
                <button 
                    onClick={() => onSelectPlan('Premium')}
                    className="group relative px-8 py-4 bg-indigo-600 rounded-full text-lg font-bold overflow-hidden shadow-2xl shadow-indigo-600/40 hover:scale-105 transition-transform duration-300 animate-fade-in-up delay-300"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-fuchsia-600 transition-opacity group-hover:opacity-80"></div>
                    <span className="relative flex items-center gap-2">
                        Попробовать за {prices[currency].premium_promo} <Play size={20} fill="currentColor" />
                    </span>
                </button>
            </section>

            {/* --- ОПИСАНИЕ И ПРЕИМУЩЕСТВА --- */}
            <section className="max-w-7xl mx-auto px-6 mb-32 animate-fade-in-up delay-100">
                <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-8 md:p-16 relative overflow-hidden backdrop-blur-sm">
                    {/* Фоновый декор */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        
                        {/* Текст */}
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                                Почему SoundWave <br/>
                                <span className="text-indigo-400">лучше других?</span>
                            </h2>
                            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                                Мы не просто проигрываем файлы. Мы создаем атмосферу. В отличие от конкурентов, SoundWave фокусируется на визуальном погружении и качестве звука без компромиссов.
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-indigo-400 flex-shrink-0">
                                        <Headphones size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg">Hi-Fi Звук</h4>
                                        <p className="text-gray-500 text-sm mt-1">Мы используем FLAC кодек для кристально чистого звучания.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-fuchsia-400 flex-shrink-0">
                                        <Sparkles size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg">Визуальное погружение</h4>
                                        <p className="text-gray-500 text-sm mt-1">Уникальные живые обои и частицы, реагирующие на музыку.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-green-400 flex-shrink-0">
                                        <Layers size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg">Умная "Моя Волна"</h4>
                                        <p className="text-gray-500 text-sm mt-1">Нейросеть анализирует ваши вкусы и предлагает треки.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Карточка сравнения */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl transform rotate-3 opacity-50 blur-lg"></div>
                            <div className="relative bg-black border border-white/10 rounded-2xl p-8 shadow-2xl">
                                <h3 className="text-xl font-bold text-center mb-6">Сравнение сервисов</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                        <span className="text-gray-400">Функция</span>
                                        <div className="flex gap-8">
                                            <span className="font-bold text-gray-500 text-sm">Другие</span>
                                            <span className="font-bold text-white text-sm">SoundWave</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300 font-medium">Качество звука</span>
                                        <div className="flex gap-10 text-sm">
                                            <span className="text-gray-500">MP3</span>
                                            <span className="text-indigo-400 font-bold">FLAC Lossless</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300 font-medium">Визуализация</span>
                                        <div className="flex gap-10 text-sm">
                                            <span className="text-gray-500">Нет</span>
                                            <span className="text-indigo-400 font-bold">Живой фон</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300 font-medium">Цена старта</span>
                                        <div className="flex gap-10 text-sm">
                                            <span className="text-gray-500">Полная</span>
                                            <span className="text-green-400 font-bold">{prices[currency].premium_promo}</span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => onSelectPlan('Premium')}
                                    className="w-full mt-8 py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition"
                                >
                                    Присоединиться сейчас
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* --- PRICING --- */}
            <section className="max-w-6xl mx-auto px-6 mb-32 animate-fade-in-up delay-200" id="plans">
                <div className="flex flex-col items-center mb-12">
                    <h2 className="text-4xl font-bold mb-6 text-center">Выберите свой план</h2>
                    
                    {/* Переключатель валют */}
                    <div className="flex items-center bg-white/10 rounded-full p-1 border border-white/10 backdrop-blur-md">
                        <button onClick={() => setCurrency('USD')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${currency === 'USD' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>$ USD</button>
                        <button onClick={() => setCurrency('KZT')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${currency === 'KZT' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>₸ KZT</button>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    
                    {/* BASIC */}
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/5 h-fit hover:border-white/20 transition">
                        <h3 className="text-xl font-bold text-gray-300 mb-2">Базовый</h3>
                        <div className="text-4xl font-bold mb-6">{prices[currency].basic} <span className="text-lg font-normal text-gray-500">/мес</span></div>
                        <ul className="space-y-4 mb-8 text-gray-400 text-sm">
                            <li className="flex gap-3"><Check size={18} className="text-green-500" /> Доступ ко всей библиотеке</li>
                            <li className="flex gap-3"><Check size={18} className="text-green-500" /> "Моя Волна"</li>
                            <li className="flex gap-3 opacity-50"><X size={18} /> Стандартное качество</li>
                            <li className="flex gap-3 opacity-50"><X size={18} /> Без офлайн режима</li>
                        </ul>
                        <button onClick={() => onSelectPlan('Basic')} className="w-full py-3 rounded-xl border border-white/20 hover:bg-white hover:text-black transition font-bold">Выбрать</button>
                    </div>

                    {/* PREMIUM */}
                    <div className="p-8 rounded-3xl bg-gradient-to-b from-indigo-900/80 to-black border border-indigo-500/50 relative shadow-2xl shadow-indigo-900/50 transform scale-105 z-10">
                        <div className="absolute top-0 right-0 bg-indigo-500 text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">ХИТ ПРОДАЖ</div>
                        <h3 className="text-xl font-bold text-indigo-300 mb-2">Премиум</h3>
                        
                        <div className="mb-6">
                            <div className="flex items-baseline gap-3">
                                <span className="text-5xl font-bold text-white">{prices[currency].premium_promo}</span>
                                <span className="text-xl font-bold text-gray-500 line-through decoration-red-500 decoration-2">{prices[currency].premium_regular}</span>
                            </div>
                            <div className="text-green-400 text-sm font-bold mt-2">Первый месяц — всего {prices[currency].premium_promo}</div>
                        </div>

                        <ul className="space-y-4 mb-8 text-gray-300 text-sm">
                            <li className="flex gap-3"><Check size={18} className="text-indigo-400" /> Всё из Базового</li>
                            <li className="flex gap-3"><Check size={18} className="text-indigo-400" /> Никакой рекламы</li>
                            <li className="flex gap-3"><Check size={18} className="text-indigo-400" /> Офлайн прослушивание</li>
                            <li className="flex gap-3"><Check size={18} className="text-indigo-400" /> Hi-Fi качество (FLAC)</li>
                        </ul>
                        <button onClick={() => onSelectPlan('Premium')} className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition font-bold shadow-lg shadow-indigo-600/40">Попробовать за {prices[currency].premium_promo}</button>
                        <p className="text-xs text-center mt-4 text-gray-500">Далее {prices[currency].premium_regular} в месяц</p>
                    </div>

                    {/* STUDENT */}
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/5 h-fit hover:border-white/20 transition">
                        <h3 className="text-xl font-bold text-gray-300 mb-2">Студенческий</h3>
                        <div className="text-4xl font-bold mb-6">{prices[currency].student} <span className="text-lg font-normal text-gray-500">/мес</span></div>
                        <ul className="space-y-4 mb-8 text-gray-400 text-sm">
                            <li className="flex gap-3"><Check size={18} className="text-green-500" /> Все функции Премиум</li>
                            <li className="flex gap-3"><Check size={18} className="text-green-500" /> Скидка ~50%</li>
                            <li className="flex gap-3 opacity-50"><X size={18} /> Требуется студ. билет</li>
                        </ul>
                        <button onClick={() => onSelectPlan('Student')} className="w-full py-3 rounded-xl border border-white/20 hover:bg-white hover:text-black transition font-bold">Выбрать</button>
                    </div>
                </div>
            </section>

            {/* --- FOOTER С СОЦСЕТЯМИ --- */}
            <footer className="border-t border-white/10 py-12 bg-black/40 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center">
                             <AudioWaveform size={18} />
                         </div>
                        <span className="font-bold text-lg tracking-tight">SoundWave</span>
                    </div>
                    
                    <div className="text-gray-500 text-sm text-center md:text-left">
                        &copy; 2025 SoundWave Music. Все права защищены.
                    </div>

                   
                    <div className="flex gap-6">
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-pink-500 transition transform hover:scale-110">
                            <Instagram size={22} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-400 transition transform hover:scale-110">
                            <Twitter size={22} />
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-600 transition transform hover:scale-110">
                            <Facebook size={22} />
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}