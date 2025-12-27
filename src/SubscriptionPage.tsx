// src/SubscriptionPage.tsx
import React, { useState, useEffect } from 'react';
import { Check, X, CreditCard, Shield, Zap, Lock, Music, Download, GraduationCap, Upload, Sparkles, Loader2 } from 'lucide-react';
import type { User } from './context/AuthContext';

interface SubscriptionPageProps {
    plan: string;
    tempUser: User;
    currency: 'USD' | 'KZT'; 
    onConfirm: () => void;
    onCancel: () => void;
}

export default function SubscriptionPage({ plan, tempUser, currency, onConfirm, onCancel }: SubscriptionPageProps) {
    const [step, setStep] = useState<'verify' | 'pay'>(plan === 'Student' ? 'verify' : 'pay');
    
    // Состояния
    const [isProcessing, setIsProcessing] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60); // Визуально: 1 минута
    const [purchaseComplete, setPurchaseComplete] = useState(false);

    // Данные карты
    const [cardData, setCardData] = useState({
        number: '',
        expiry: '',
        cvc: ''
    });

    // --- ЛОГИКА ФОРМАТИРОВАНИЯ ---
    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '').substring(0, 16);
        const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
        setCardData({ ...cardData, number: formatted });
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        setCardData({ ...cardData, expiry: value });
    };

    const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '').substring(0, 3);
        setCardData({ ...cardData, cvc: value });
    };

    // --- ЦЕНЫ ---
    const pricing: any = {
        'Basic': { 
            name: "Базовый", regular: currency === 'USD' ? '3.99' : '1 690', promo: currency === 'USD' ? '3.99' : '1 690', symbol: currency === 'USD' ? '$' : '₸' 
        },
        'Premium': { 
            name: "Премиум", regular: currency === 'USD' ? '5.99' : '2 390', promo: currency === 'USD' ? '0.01' : '1', symbol: currency === 'USD' ? '$' : '₸' 
        },
        'Student': { 
            name: "Студенческий", regular: currency === 'USD' ? '2.99' : '1 190', promo: currency === 'USD' ? '2.99' : '1 190', symbol: currency === 'USD' ? '$' : '₸' 
        },
        'Family': { 
            name: "Семейный", regular: currency === 'USD' ? '8.99' : '3 590', promo: currency === 'USD' ? '8.99' : '3 590', symbol: currency === 'USD' ? '$' : '₸' 
        }
    };

    const currentPlan = pricing[plan] || pricing['Premium'];
    const priceToday = plan === 'Premium' ? currentPlan.promo : currentPlan.regular;
    const priceNextMonth = currentPlan.regular;

    // --- ЛОГИКА ТАЙМЕРА (Визуальная) ---
    useEffect(() => {
        let interval: number | null = null;
        if (isProcessing && timeLeft > 0 && !purchaseComplete) {
            interval = window.setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        }
        return () => { if (interval) clearInterval(interval); };
    }, [isProcessing, timeLeft, purchaseComplete]);

    const formatTimer = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // --- ОБРАБОТЧИКИ ---
    const handleStudentVerification = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setStep('pay');
            setTimeLeft(60); // Сброс таймера для следующего шага
        }, 1500);
    };

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (cardData.number.length < 19 || cardData.expiry.length < 5 || cardData.cvc.length < 3) {
            alert("Заполните данные карты корректно");
            return;
        }
        
        // 1. Запускаем "процесс"
        setIsProcessing(true);
        setTimeLeft(60); // Ставим 60 секунд для вида

        // 2. Но завершаем успешно через 2.5 секунды (быстрая оплата)
        setTimeout(() => {
            setPurchaseComplete(true);
            setIsProcessing(false);
        }, 2500); 
    };

    return (
        <div className="min-h-screen w-full flex justify-center items-center p-4 relative z-20 overflow-y-auto custom-scrollbar">
            <div className="w-full max-w-5xl bg-black/80 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden flex flex-col md:flex-row shadow-2xl animate-fade-in">
                
                {/* ЛЕВАЯ КОЛОНКА */}
                <div className="w-full md:w-1/2 p-8 md:p-12 bg-zinc-900/50 border-b md:border-b-0 md:border-r border-white/10">
                    <div className="flex items-center gap-3 mb-8">
                         <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">{tempUser.initial}</div>
                         <div className="text-white font-medium">{tempUser.name}</div>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-2">Подписка {currentPlan.name}</h2>
                    
                    <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-5 mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-300">К оплате сегодня:</span>
                            <span className="text-3xl font-extrabold text-white tracking-tight">{priceToday} {currentPlan.symbol}</span>
                        </div>
                        {plan === 'Premium' && (
                            <div className="text-xs text-gray-400 border-t border-white/10 pt-3 mt-2">
                                Акция: 1-й месяц. Далее: <span className="text-white font-bold">{priceNextMonth} {currentPlan.symbol}</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 mb-8">
                        <h4 className="text-white font-bold flex items-center gap-2"><Zap size={18} className="text-yellow-400"/> Возможности:</h4>
                        <ul className="space-y-3 pl-2">
                            <li className="flex items-center gap-3 text-sm text-gray-300"><Check size={16} className="text-green-500"/> Музыка без рекламы</li>
                            <li className="flex items-center gap-3 text-sm text-gray-300"><Music size={16} className="text-green-500"/> Hi-Fi качество (FLAC)</li>
                            <li className="flex items-center gap-3 text-sm text-gray-300"><Download size={16} className="text-green-500"/> Офлайн режим</li>
                        </ul>
                    </div>
                </div>

                {/* ПРАВАЯ КОЛОНКА */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative min-h-[500px]">
                    
                    {purchaseComplete ? (
                        // ЭКРАН УСПЕХА
                        <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in-up">
                            <div className="relative w-24 h-24 flex items-center justify-center mb-6 animate-success animate-pulse-ring">
                                <div className="absolute inset-0 bg-green-500 rounded-full opacity-20"></div>
                                <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/40 z-10">
                                    <Check size={48} className="text-white" strokeWidth={4} />
                                </div>
                            </div>
                            <h3 className="text-3xl font-extrabold text-white mb-2">Оплата прошла!</h3>
                            <p className="text-gray-400 mb-8">Добро пожаловать в мир музыки без границ.</p>
                            
                            {/* ИСПРАВЛЕННАЯ КНОПКА: ВЫЗЫВАЕТ onConfirm */}
                            <button onClick={onConfirm} className="w-full mt-8 py-4 bg-white text-black font-extrabold rounded-xl hover:bg-gray-200 hover:scale-[1.02] transition shadow-xl flex items-center justify-center gap-2 cursor-pointer">
                                <Sparkles size={20} className="text-yellow-600"/> Начать слушать
                            </button>
                        </div>
                    ) : isProcessing ? (
                        // ЭКРАН ОБРАБОТКИ (Визуальный таймер 60сек, но пройдет быстрее)
                        <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                            <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
                                <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                <div className="text-3xl font-mono font-bold text-white relative z-10">
                                    {formatTimer(timeLeft)}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Связь с банком...</h3>
                            <p className="text-sm text-gray-400 max-w-xs mx-auto mb-6">Пожалуйста, подождите, не закрывайте страницу.</p>
                        </div>
                    ) : (
                        // ФОРМЫ ВВОДА
                        <>
                            {step === 'verify' && (
                                <div className="animate-fade-in">
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><GraduationCap size={24} className="text-indigo-500"/> Подтверждение</h3>
                                    <form onSubmit={handleStudentVerification} className="space-y-5">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">ВУЗ</label>
                                            <input type="text" placeholder="Например: КазНУ" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-indigo-500 focus:outline-none" required />
                                        </div>
                                        <div className="border-2 border-dashed border-white/20 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-indigo-500 transition cursor-pointer bg-white/5">
                                            <Upload size={24} className="mb-2"/><span className="text-xs">Загрузить фото студенческого</span>
                                        </div>
                                        <button type="submit" className="w-full mt-4 bg-white text-black font-extrabold py-4 rounded-xl hover:bg-gray-200 transition shadow-xl">Подтвердить</button>
                                    </form>
                                </div>
                            )}

                            {step === 'pay' && (
                                <div className="animate-fade-in">
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Lock size={20} className="text-indigo-500"/> Оплата картой</h3>
                                    <form onSubmit={handlePayment} className="space-y-5">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Номер карты</label>
                                            <div className="relative">
                                                <CreditCard className="absolute left-4 top-3.5 text-gray-400" size={20}/>
                                                <input 
                                                    type="text" 
                                                    placeholder="0000 0000 0000 0000" 
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-indigo-500 focus:outline-none font-mono" 
                                                    required 
                                                    value={cardData.number}
                                                    onChange={handleCardNumberChange}
                                                    maxLength={19}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Срок</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="MM/YY" 
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-indigo-500 focus:outline-none text-center font-mono" 
                                                    required 
                                                    value={cardData.expiry}
                                                    onChange={handleExpiryChange}
                                                    maxLength={5}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">CVC</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="123" 
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-indigo-500 focus:outline-none text-center font-mono" 
                                                    required 
                                                    value={cardData.cvc}
                                                    onChange={handleCvcChange}
                                                    maxLength={3}
                                                />
                                            </div>
                                        </div>
                                        <div className="pt-4">
                                            <button type="submit" className="w-full bg-white text-black font-extrabold py-4 rounded-xl hover:bg-gray-200 transition shadow-xl flex justify-center items-center gap-2">
                                                Оплатить {priceToday} {currentPlan.symbol}
                                            </button>
                                        </div>
                                        <p className="text-center text-xs text-gray-500 mt-4 leading-relaxed">
                                            Нажимая оплатить, вы соглашаетесь с условиями.
                                        </p>
                                    </form>
                                </div>
                            )}

                            <button onClick={onCancel} className="absolute top-6 right-6 text-gray-500 hover:text-white transition"><X size={24} /></button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}