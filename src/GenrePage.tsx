// src/GenrePage.tsx
import React from 'react';
import type { Song, MockTrack } from './MusicPlayer'; 
import { Zap, Play } from 'lucide-react';

// Локальные компоненты Card и Section
interface CardProps {
  title?: string;
  name?: string;
  subtitle: string;
  cover: string;
  isRound?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ title, name, subtitle, cover, isRound, onClick }) => (
  <div 
    className="flex-shrink-0 w-48 group cursor-pointer transition-all hover:bg-white/5 p-4 rounded-lg"
    onClick={onClick}
  >
    <div className={`relative ${isRound ? 'rounded-full' : 'rounded-lg'} overflow-hidden shadow-xl mb-4 aspect-square bg-zinc-900`}>
      <img 
        src={cover} 
        alt={title || name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <button className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
          <Play size={20} fill="white" className="text-white ml-0.5" />
        </button>
      </div>
    </div>
    <div className="font-bold text-white truncate mb-1">{title || name}</div>
    <div className="text-xs text-gray-400 truncate">{subtitle}</div>
  </div>
);

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
      {children}
    </div>
  </div>
);

interface GenrePageProps {
    genreName: string;
    openAlbumView: (song: Song) => void;
    playSong: (song: Song) => void;
}

// Локальные моковые данные
const mockGenres = [
  { name: 'Synthwave', gradient: 'from-purple-900 to-indigo-800' },
  { name: 'Rock', gradient: 'from-red-900 to-orange-800' },
  { name: 'Electronic', gradient: 'from-cyan-900 to-blue-800' },
  { name: 'Pop', gradient: 'from-pink-900 to-purple-800' },
  { name: 'Hip-Hop', gradient: 'from-yellow-900 to-orange-800' },
];

const mockArtists = [
  { name: 'Neon Dreams', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&fit=crop' },
  { name: 'The Weeknd', cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=200&fit=crop' },
];

const mockGenreSongs: Song[] = [
  {
    id: 1,
    title: "Midnight City",
    artist: "M83",
    album: "Hurry Up, We're Dreaming",
    duration: "4:04",
    cover: "https://images.unsplash.com/photo-1518544487467-3318f77d3f10?w=300&fit=crop",
    audioUrl: ""
  },
  {
    id: 2,
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: "3:20",
    cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&fit=crop",
    audioUrl: ""
  },
  {
    id: 3,
    title: "Starboy",
    artist: "The Weeknd",
    album: "Starboy",
    duration: "3:50",
    cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=300&fit=crop",
    audioUrl: ""
  },
  {
    id: 4,
    title: "Nightcall",
    artist: "Kavinsky",
    album: "OutRun",
    duration: "4:18",
    cover: "https://images.unsplash.com/photo-1508700938556-b08e5c3e6a0d?w=300&fit=crop",
    audioUrl: ""
  },
  {
    id: 5,
    title: "A Real Hero",
    artist: "College & Electric Youth",
    album: "Drive OST",
    duration: "4:42",
    cover: "https://images.unsplash.com/photo-1549424855-32e6b2d29b2b?w=300&fit=crop",
    audioUrl: ""
  },
];

const MOCK_GENRE_PLAYLISTS: { title: string; subtitle: string; cover: string }[] = [
    { title: "Best of Synthwave 80s", subtitle: "Плейлист", cover: "https://images.unsplash.com/photo-1518544487467-3318f77d3f10?w=100&h=100&fit=crop" },
    { title: "Chill & Focus", subtitle: "Плейлист", cover: "https://images.unsplash.com/photo-1508700938556-b08e5c3e6a0d?w=100&h=100&fit=crop" },
    { title: "Driving Vibes", subtitle: "Плейлист", cover: "https://images.unsplash.com/photo-1549424855-32e6b2d29b2b?w=100&h=100&fit=crop" },
];


const GenrePage: React.FC<GenrePageProps> = ({ genreName, openAlbumView, playSong }) => {

    // Фильтруем моковые данные, чтобы сделать страницу динамичной
    const genreColor = mockGenres.find(g => g.name === genreName)?.gradient || 'from-zinc-900 to-indigo-800/70';
    const popularArtist = mockArtists.find(a => a.name === 'Neon Dreams') || mockArtists[0];
    const topTracks = mockGenreSongs.slice(0, 5); // Для простоты


    return (
        <div className="p-8 pb-32 animate-fade-in">
            {/* Баннер Жанра */}
            <div 
                className={`rounded-xl p-10 mb-8 flex items-end shadow-2xl text-white relative overflow-hidden bg-gradient-to-r ${genreColor}`}
                style={{ minHeight: '200px' }} 
            >
                <Zap size={64} className="text-white/70 mr-4" />
                <div className="z-10">
                    <p className="text-sm font-semibold uppercase tracking-widest opacity-80">Жанр</p>
                    <h1 className="text-5xl font-extrabold mb-2 drop-shadow-lg">{genreName}</h1>
                    <p className="text-white/70">Лучшая подборка для вашего настроения.</p>
                </div>
            </div>


            {/* Популярные плейлисты */}
            <Section title={`Плейлисты в стиле ${genreName}`}>
                {MOCK_GENRE_PLAYLISTS.map((p, index) => (
                    <Card key={index} title={p.title} subtitle={p.subtitle} cover={p.cover} />
                ))}
            </Section>


            {/* Популярный Артист Жанра */}
            <Section title={`Популярный артист: ${popularArtist.name}`}>
                <Card 
                    name={popularArtist.name} 
                    subtitle="Исполнитель" 
                    cover={popularArtist.cover} 
                    isRound={true} 
                    onClick={() => console.log('Переход на страницу артиста')} 
                />
                 <Card 
                    title={mockGenreSongs[0].album} 
                    subtitle="Лучший альбом" 
                    cover={mockGenreSongs[0].cover} 
                    onClick={() => openAlbumView(mockGenreSongs[0])} 
                />
            </Section>

            {/* Топ-треки Жанра */}
            <h2 className="text-3xl font-bold mt-12 mb-6 text-white border-b border-zinc-800 pb-2">Топ-треки {genreName}</h2>
            <div className="space-y-2">
                {topTracks.map((song: Song, index: number) => (
                    <div 
                        key={song.id} 
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-800/70 transition cursor-pointer group"
                        onClick={() => playSong(song)}
                    >
                        <span className="w-8 text-indigo-400 font-bold text-center">{index + 1}</span>
                        <img src={song.cover} alt={song.title} className="w-12 h-12 rounded-lg shadow-lg group-hover:scale-105 transition-transform" />
                        <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-white truncate">{song.title}</h3>
                            <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                        </div>
                        <span className="text-sm text-gray-400 font-mono">{song.duration}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default GenrePage;
