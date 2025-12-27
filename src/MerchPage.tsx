// src/MerchPage.tsx
import React from 'react';
import { ShoppingBag, Star, Tag } from 'lucide-react';

const mockMerch = [
    { id: 1, name: "Vintage Tee - The Weeknd", price: 35, category: "Oversize", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=500&auto=format&fit=crop" },
    { id: 2, name: "Vinyl: After Hours", price: 45, category: "Vinyl", image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=500&auto=format&fit=crop" },
    { id: 3, name: "Eminem Hoodie", price: 60, category: "Hoodie", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=500&auto=format&fit=crop" },
    { id: 4, name: "SoundWave Cap", price: 20, category: "Accessories", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=500&auto=format&fit=crop" },
];

export default function MerchPage() {
    return (
        <div className="p-8 pb-24 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                        <ShoppingBag className="text-indigo-500" size={32} /> Магазин Мерча
                    </h1>
                    <p className="text-gray-400">Официальный мерч от ваших любимых исполнителей</p>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-full text-white font-bold flex items-center gap-2">
                    <Tag size={16} /> Скидки до 30%
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mockMerch.map(item => (
                    <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:scale-[1.02] transition duration-300">
                        <div className="relative h-64 overflow-hidden">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold">
                                {item.category}
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-white leading-tight">{item.name}</h3>
                                <div className="flex items-center gap-1 text-yellow-500">
                                    <Star size={14} fill="currentColor" /> <span className="text-xs text-white">4.9</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <span className="text-2xl font-bold text-indigo-400">${item.price}</span>
                                <button className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-indigo-500 hover:text-white transition">
                                    Купить
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}