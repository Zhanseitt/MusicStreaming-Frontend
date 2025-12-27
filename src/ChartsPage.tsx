// src/ChartsPage.tsx
import React, { useState, useEffect } from 'react';
import { Play, TrendingUp, TrendingDown, Minus, Globe, MapPin, Music2 } from 'lucide-react';
import type { Song } from './MusicPlayer';
import api from './api/axios';

interface ChartEntry extends Song {
  rank: number;
  trend: 'up' | 'down' | 'same';
  listeners: string;
}

export default function ChartsPage() {
  const [activeTab, setActiveTab] = useState<'global' | 'country' | 'genre'>('global');
  const [chartData, setChartData] = useState<ChartEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCharts = async () => {
      setIsLoading(true);
      try {
        let endpoint = '/charts/global';
        if (activeTab === 'country') endpoint = '/charts/country';
        if (activeTab === 'genre') endpoint = '/charts/genre';

        const res = await api.get(endpoint);
        const data = Array.isArray(res.data) ? res.data : [];
        
        // Преобразуем в ChartEntry
        const formatted: ChartEntry[] = data.map((song: any, index: number) => ({
          id: song.id,
          title: song.title,
          artist: song.artist,
          album: song.album || '',
          duration: song.duration || '0:00',
          cover: song.cover,
          audioUrl: song.audioUrl || '',
          rank: index + 1,
          listeners: song.listeners || `${Math.floor(Math.random() * 100)}k`,
          trend: song.trend || (['up', 'down', 'same'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'same')
        }));

        setChartData(formatted);
      } catch (error) {
        console.error('Failed to load charts:', error);
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCharts();
  }, [activeTab]);

  return (
    <div className="p-8 pb-32 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-2">
          {activeTab === 'global' && 'Топ-50 Мира'}
          {activeTab === 'country' && 'Топ по странам'}
          {activeTab === 'genre' && 'Топ по жанрам'}
        </h1>
        <p className="text-gray-400">Обновляется ежедневно</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('global')}
          className={`px-6 py-3 rounded-full font-semibold text-sm whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'global'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'bg-white dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10'
          }`}
        >
          <Globe size={18} />
          Глобальный
        </button>
        <button
          onClick={() => setActiveTab('country')}
          className={`px-6 py-3 rounded-full font-semibold text-sm whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'country'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'bg-white dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10'
          }`}
        >
          <MapPin size={18} />
          По странам
        </button>
        <button
          onClick={() => setActiveTab('genre')}
          className={`px-6 py-3 rounded-full font-semibold text-sm whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'genre'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'bg-white dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10'
          }`}
        >
          <Music2 size={18} />
          По жанрам
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-20">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Загрузка чартов...</p>
        </div>
      )}

      {/* No data */}
      {!isLoading && chartData.length === 0 && (
        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
          <Music2 size={64} className="mx-auto mb-4 text-gray-600" />
          <h3 className="text-xl font-bold text-white mb-2">Нет данных</h3>
          <p className="text-gray-400">Чарты ещё не загружены</p>
        </div>
      )}

      {/* Chart Table */}
      {!isLoading && chartData.length > 0 && (
        <div className="bg-zinc-900/50 rounded-3xl p-6 backdrop-blur-md border border-white/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-500 border-b border-white/5 text-xs uppercase tracking-wider">
                <th className="py-4 pl-4 w-12">#</th>
                <th className="py-4 w-12"></th>
                <th className="py-4">Трек</th>
                <th className="py-4 hidden sm:table-cell">Слушатели</th>
                <th className="py-4 text-right pr-4">Время</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((song) => (
                <tr key={song.id} className="group hover:bg-white/5 transition-colors duration-200 cursor-pointer">
                  <td className="py-3 pl-4 font-bold text-lg text-white w-12">{song.rank}</td>
                  <td className="py-3 text-center w-12">
                    {song.trend === 'up' ? (
                      <TrendingUp size={16} className="text-green-500" />
                    ) : song.trend === 'down' ? (
                      <TrendingDown size={16} className="text-red-500" />
                    ) : (
                      <Minus size={16} className="text-gray-500" />
                    )}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={song.cover} alt={song.title} className="w-12 h-12 rounded shadow" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded">
                          <Play size={16} fill="white" className="text-white" />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-white group-hover:text-indigo-400 transition">{song.title}</div>
                        <div className="text-sm text-gray-400">{song.artist}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 hidden sm:table-cell text-gray-500 text-sm">{song.listeners}</td>
                  <td className="py-3 text-right pr-4 text-gray-500 text-sm">{song.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
