// src/LoginPage.tsx
import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { LogIn } from 'lucide-react';

const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('test@example.com'); 
    const [password, setPassword] = useState('password');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
        } catch (error) {
            // Ошибка обрабатывается в AuthContext
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-full p-10">
            <form onSubmit={handleSubmit} className="bg-zinc-900/90 p-10 rounded-xl shadow-2xl w-96 z-10 border border-indigo-900 backdrop-blur-sm">
                <h2 className="text-3xl font-bold text-indigo-400 mb-6 soft-text-shadow-indigo">Вход в SoundWave</h2>
                
                <div className="mb-4">
                    <label className="block text-sm font-medium text-indigo-300 mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 bg-zinc-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none placeholder-gray-500"
                        placeholder="user@example.com"
                        required
                    />
                </div>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-indigo-300 mb-2">Пароль</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 bg-zinc-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none placeholder-gray-500"
                        placeholder="********"
                        required
                    />
                </div>
                
                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white px-4 py-2.5 rounded-full font-bold hover:bg-indigo-700 transition flex items-center justify-center disabled:opacity-50 shadow-lg shadow-indigo-600/50"
                >
                    {loading ? 'Загрузка...' : <><LogIn size={20} className="mr-2" /> Войти</>}
                </button>
            </form>
        </div>
    );
};

export default LoginPage;