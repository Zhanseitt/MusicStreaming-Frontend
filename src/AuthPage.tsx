// src/AuthPage.tsx
import React, { useState, useEffect } from 'react';
import {
    Mail,
    Lock,
    User as UserIcon,
    ArrowRight,
    Eye,
    EyeOff,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import { useAuth } from './context/AuthContext';

interface AuthPageProps {
    onBack: () => void;
    selectedPlan: string | null;
    initialMode?: 'login' | 'register';
}

export default function AuthPage({
    onBack,
    selectedPlan,
    initialMode = 'register'
}: AuthPageProps) {
    const { loginWithCredentials, register } = useAuth();

    const [isRegister, setIsRegister] = useState(initialMode === 'register');
    useEffect(() => {
        setIsRegister(initialMode === 'register');
    }, [initialMode]);

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            if (isRegister) {
                if (formData.password !== formData.confirmPassword) {
                    setError('Пароли не совпадают');
                    setIsLoading(false);
                    return;
                }
                if (formData.password.length < 4) {
                    setError('Пароль слишком короткий');
                    setIsLoading(false);
                    return;
                }

                await register(
                    formData.name,
                    formData.email,
                    formData.password,
                    formData.confirmPassword
                );
            } else {
                await loginWithCredentials(formData.email, formData.password);
            }
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.errors?.email?.[0] ||
                err.message ||
                'Ошибка авторизации';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative z-20 overflow-y-auto custom-scrollbar">
            <div className="w-full max-w-4xl bg-black/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col md:flex-row relative animate-fade-in my-10">
                {/* ЛЕВАЯ ЧАСТЬ */}
                <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-900 via-violet-900 to-black p-12 flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-4xl font-extrabold text-white mb-6 leading-tight">
                            {isRegister ? 'Начни своё звучание' : 'Добро пожаловать домой'}
                        </h2>
                        <p className="text-indigo-200 text-lg leading-relaxed">
                            {selectedPlan && selectedPlan !== 'Free'
                                ? `Вы выбрали план ${selectedPlan}. Остался один шаг!`
                                : 'Твоя коллекция, плейлисты и история прослушиваний ждут тебя.'}
                        </p>
                    </div>
                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-3 text-indigo-300 bg-white/5 p-3 rounded-xl backdrop-blur-md border border-white/5">
                            <CheckCircle size={20} className="text-green-400" />
                            <span className="font-medium">Персональные рекомендации</span>
                        </div>
                    </div>
                </div>

                {/* ПРАВАЯ ЧАСТЬ */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-zinc-900/40">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2">
                            {isRegister ? 'Создать аккаунт' : 'Вход'}
                        </h2>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 text-red-200 text-sm rounded-lg flex items-center gap-2">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {isRegister && (
                            <div className="relative">
                                <UserIcon
                                    className="absolute left-4 top-3.5 text-gray-500"
                                    size={20}
                                />
                                <input
                                    type="text"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-indigo-500 focus:outline-none"
                                    placeholder="Ваше имя"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                />
                            </div>
                        )}

                        <div className="relative">
                            <Mail
                                className="absolute left-4 top-3.5 text-gray-500"
                                size={20}
                            />
                            <input
                                type="email"
                                required
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-indigo-500 focus:outline-none"
                                placeholder="Email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                            />
                        </div>

                        <div className="relative">
                            <Lock
                                className="absolute left-4 top-3.5 text-gray-500"
                                size={20}
                            />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white focus:border-indigo-500 focus:outline-none"
                                placeholder="Пароль"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-3.5 text-gray-500 hover:text-white"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {isRegister && (
                            <div className="relative">
                                <Lock
                                    className="absolute left-4 top-3.5 text-gray-500"
                                    size={20}
                                />
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-indigo-500 focus:outline-none"
                                    placeholder="Повторите пароль"
                                    value={formData.confirmPassword}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            confirmPassword: e.target.value
                                        })
                                    }
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading
                                ? 'Обработка...'
                                : isRegister
                                ? 'Продолжить'
                                : 'Войти'}
                            <ArrowRight size={20} />
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => {
                                setIsRegister(!isRegister);
                                setError(null);
                            }}
                            className="text-sm text-gray-400 hover:text-white transition"
                        >
                            {isRegister
                                ? 'Уже есть аккаунт? Войти'
                                : 'Нет аккаунта? Регистрация'}
                        </button>
                    </div>

                    <button
                        onClick={onBack}
                        className="w-full mt-4 text-sm text-gray-600 hover:text-gray-400"
                    >
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
}
