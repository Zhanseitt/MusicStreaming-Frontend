// src/EditProfileModal.tsx
import React, { useState } from 'react';
import { User, X, Mail, Edit2 } from 'lucide-react';
import type { User as AuthUser } from './context/AuthContext'; // ИСПРАВЛЕНО: корректный импорт типа

interface EditProfileModalProps {
    user: AuthUser;
    onClose: () => void;
    onSave: (name: string, status: string) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onClose, onSave }) => {
    const [name, setName] = useState(user.name);
    // Примечание: статус в реальном приложении, вероятно, хранился бы в базе
    const [status, setStatus] = useState(user.role === 'user' ? 'Премиум-подписка активна' : 'Артист SoundWave');

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() === '') return;
        onSave(name.trim(), status.trim());
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
            <div className="bg-zinc-900 p-8 rounded-xl w-full max-w-lg shadow-2xl border border-indigo-900 relative">
                
                <h3 className="text-2xl font-bold mb-6 text-indigo-400 flex items-center gap-2">
                    <Edit2 size={24} /> Редактировать профиль
                </h3>

                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition p-1 rounded-full hover:bg-zinc-800"
                >
                    <X size={24} />
                </button>
                
                <form onSubmit={handleSave}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-indigo-300 mb-2" htmlFor="user-name">Имя пользователя</label>
                        <div className="relative">
                            <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <input
                                id="user-name"
                                type="text"
                                className="w-full pl-10 pr-4 py-2 bg-zinc-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-indigo-300 mb-2" htmlFor="user-status">Статус</label>
                        <input
                            id="user-status"
                            type="text"
                            className="w-full px-4 py-2 bg-zinc-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        />
                    </div>
                    
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-indigo-300 mb-2">Email (Не редактируется)</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <input
                                type="email"
                                className="w-full pl-10 pr-4 py-2 bg-zinc-700/50 rounded-lg text-gray-400 cursor-not-allowed"
                                value={user.email}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button 
                            type="button"
                            onClick={onClose} 
                            className="text-gray-400 hover:text-white px-6 py-2 rounded-full transition border border-zinc-700 hover:border-white/50"
                        >
                            Отмена
                        </button>
                        <button 
                            type="submit"
                            className="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold hover:bg-indigo-700 transition disabled:opacity-50 shadow-lg shadow-indigo-600/50"
                            disabled={name.trim() === ''}
                        >
                            Сохранить
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;