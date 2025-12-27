// src/AlbumPage.tsx
import React from 'react';
import { Clock, Play, Heart, MoreHorizontal } from 'lucide-react';
import type { Song } from './MusicPlayer'; 


interface AlbumPageProps {
  albumSong: Song; // <-- пропс назван albumSong
  onPlaySong: (song: Song) => void;
}


const AlbumPage: React.FC<AlbumPageProps> = ({ albumSong, onPlaySong }) => {
    // Генерируем список треков альбома на основе переданной песни
    const allAlbumTracks: Song[] = [
        albumSong,
        ...Array(9).fill(null).map((_, i) => ({ // Добавляем 9 "фиктивных" треков для полного альбома
            ...albumSong,
            id: Number(albumSong.id) + i + 1000,
            title: `${albumSong.album} - Track ${i + 2}`,
            duration: `3:${String(Math.floor(Math.random() * 50) + 10).padStart(2, '0')}`,
            audioUrl: albumSong.audioUrl,
        })),
    ];


  return (
    <div className="p-8 pb-32 text-white animate-fade-in">
      <header className="flex items-end gap-6 mb-8 bg-gradient-to-t from-zinc-900/50 to-transparent p-6 rounded-xl">
        <img 
          src={albumSong.cover} 
          alt={albumSong.album} 
          className="w-64 h-64 rounded-lg shadow-2xl shadow-indigo-900/50 border-4 border-indigo-600/50 object-cover" 
        />
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-indigo-300 text-sm uppercase tracking-widest">Альбом</p>
          <h1 className="text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
            {albumSong.album}
          </h1>
          <p className="text-gray-300 font-medium mt-2 text-lg">
            {albumSong.artist} • 2023 • {allAlbumTracks.length} треков
          </p>
        </div>
      </header>

      <div className="flex items-center gap-6 mb-8">
        <button 
          onClick={() => onPlaySong(albumSong)} 
          className="bg-indigo-600 rounded-full p-4 hover:scale-105 transition-transform shadow-lg shadow-indigo-600/50 hover:bg-indigo-500"
        >
            <Play fill="white" size={28} className="ml-1" />
        </button>
        <button className="text-gray-400 hover:text-red-500 transition">
          <Heart size={24} />
        </button>
        <button className="text-gray-400 hover:text-white transition">
          <MoreHorizontal size={24} />
        </button>
      </div>

      {/* Заголовок таблицы */}
      <div className="text-indigo-400 border-b border-zinc-700 px-4 py-2 grid grid-cols-[40px_4fr_2fr_80px] gap-4 items-center mb-4 font-semibold text-sm uppercase tracking-wider">
        <span>#</span>
        <span>Название</span>
        <span>Прослушивания</span>
        <div className="flex items-center justify-end gap-2">
          <Clock size={16} />
        </div>
      </div>

      {/* Список треков */}
      <div className="space-y-1">
        {allAlbumTracks.map((track, index) => (
            <div 
                key={track.id} 
                className="grid grid-cols-[40px_4fr_2fr_80px] gap-4 items-center p-4 rounded-xl hover:bg-zinc-800/70 cursor-pointer group transition" 
                onClick={() => onPlaySong(track)}
            >
                <span className="group-hover:hidden text-gray-400 text-center">{index + 1}</span>
                <span className="hidden group-hover:flex text-indigo-400 justify-center items-center">
                  <Play size={16} fill="currentColor" />
                </span>

                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-white font-medium">{track.title}</p>
                    <p className="text-sm text-indigo-300">{track.artist}</p>
                  </div>
                </div>

                <span className="text-gray-400 text-sm">
                  {(Math.random() * 500 + 10).toFixed(1)}M
                </span>

                <span className="text-gray-400 text-sm text-right">
                  {track.duration}
                </span>
            </div>
        ))}
      </div>
    </div>
  );
};


export default AlbumPage;
