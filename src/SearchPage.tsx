// src/SearchPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import type { Song, MockTrack } from './MusicPlayer'; 
import { Search, Music, Play, Clock, X, TrendingUp, Sparkles, Globe, Gem, Zap, Disc } from 'lucide-react';
import api from './api/axios';

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
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, icon, children }) => (
  <div className="mb-10">
    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
      {icon}
      {title}
    </h2>
    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
      {children}
    </div>
  </div>
);

interface SearchPageProps {
    searchTerm: string;
    playSong: (song: Song) => void;
    openArtistView: (artist: MockTrack) => void;
    openAlbumView: (song: Song) => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ searchTerm, playSong, openArtistView, openAlbumView }) => {
    const [tracks, setTracks] = useState<Song[]>([]);
    const [artists, setArtists] = useState<MockTrack[]>([]);
    const [albums, setAlbums] = useState<Song[]>([]);
    
    // Discover sections
    const [dailyMixes, setDailyMixes] = useState<any[]>([]);
    const [newReleases, setNewReleases] = useState<Song[]>([]);
    const [trending, setTrending] = useState<Song[]>([]);
    const [forYou, setForYou] = useState<Song[]>([]);
    const [aroundWorld, setAroundWorld] = useState<Song[]>([]);
    const [hiddenGems, setHiddenGems] = useState<Song[]>([]);
    
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDiscoverLoading, setIsDiscoverLoading] = useState(true);

    // Загрузка Discover контента при монтировании
    useEffect(() => {
        const loadDiscoverContent = async () => {
            setIsDiscoverLoading(true);
            try {
                const [
                    dailyMixesRes,
                    newReleasesRes,
                    trendingRes,
                    forYouRes,
                    aroundWorldRes,
                    hiddenGemsRes
                ] = await Promise.all([
                    api.get('/discover/daily-mixes'),
                    api.get('/discover/new-releases'),
                    api.get('/songs/trending'),
                    api.get('/discover/for-you'),
                    api.get('/discover/around-world'),
                    api.get('/discover/hidden-gems')
                ]);

                setDailyMixes(Array.isArray(dailyMixesRes.data) ? dailyMixesRes.data : []);
                setNewReleases(Array.isArray(newReleasesRes.data) ? newReleasesRes.data : []);
                setTrending(Array.isArray(trendingRes.data) ? trendingRes.data : []);
                setForYou(Array.isArray(forYouRes.data) ? forYouRes.data : []);
                setAroundWorld(Array.isArray(aroundWorldRes.data) ? aroundWorldRes.data : []);
                setHiddenGems(Array.isArray(hiddenGemsRes.data) ? hiddenGemsRes.data : []);
            } catch (error) {
                console.error('Failed to load discover content:', error);
            } finally {
                setIsDiscoverLoading(false);
            }
        };

        // Загрузка недавних поисков
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setRecentSearches(Array.isArray(parsed) ? parsed : []);
            } catch (error) {
                console.error('Failed to parse recent searches:', error);
            }
        }

        loadDiscoverContent();
    }, []);

    // Поиск при изменении searchTerm
    useEffect(() => {
        if (!searchTerm || searchTerm.trim().length < 2) {
            setTracks([]);
            setArtists([]);
            setAlbums([]);
            return;
        }

        const performSearch = async () => {
            setIsLoading(true);
            try {
                const [tracksRes, artistsRes, albumsRes] = await Promise.all([
                    api.get(`/songs/search?q=${encodeURIComponent(searchTerm)}`),
                    api.get(`/artists/search?q=${encodeURIComponent(searchTerm)}`),
                    api.get(`/albums/search?q=${encodeURIComponent(searchTerm)}`)
                ]);

                setTracks(Array.isArray(tracksRes.data) ? tracksRes.data : []);
                setArtists(Array.isArray(artistsRes.data) ? artistsRes.data : []);
                setAlbums(Array.isArray(albumsRes.data) ? albumsRes.data : []);

                if (searchTerm.trim()) {
                    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 10);
                    setRecentSearches(updated);
                    localStorage.setItem('recentSearches', JSON.stringify(updated));
                }
            } catch (error) {
                console.error('Search failed:', error);
                setTracks([]);
                setArtists([]);
                setAlbums([]);
            } finally {
                setIsLoading(false);
            }
        };

        const debounce = setTimeout(performSearch, 300);
        return () => clearTimeout(debounce);
    }, [searchTerm]);

    const topResult = useMemo(() => {
        if (tracks.length > 0) return { type: 'track', data: tracks[0] };
        if (artists.length > 0) return { type: 'artist', data: artists[0] };
        if (albums.length > 0) return { type: 'album', data: albums[0] };
        return null;
    }, [tracks, artists, albums]);

    const hasResults = tracks.length > 0 || artists.length > 0 || albums.length > 0;

    const clearRecentSearch = (term: string) => {
        const updated = recentSearches.filter(t => t !== term);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
    };

    // DISCOVER PAGE (когда поиск пустой)
    if (!searchTerm || searchTerm.trim().length < 2) {
        return (
            <div className="p-8 pb-32">
                <h1 className="text-4xl font-extrabold mb-8 text-white">
                    🎯 Открывайте новое
                </h1>

                {/* Loading Discover */}
                {isDiscoverLoading && (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-400">Загрузка контента...</p>
                    </div>
                )}

                {!isDiscoverLoading && (
                    <>
                        {/* Recent Searches */}
                        {recentSearches.length > 0 && (
                            <section className="mb-12">
                                <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                                    <Clock size={24} />
                                    Недавние поиски
                                </h2>
                                <div className="flex gap-3 flex-wrap">
                                    {recentSearches.slice(0, 6).map((term, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition group cursor-pointer"
                                        >
                                            <span className="text-sm font-medium text-white">{term}</span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    clearRecentSearch(term);
                                                }}
                                                className="p-1 rounded-full hover:bg-white/20 transition"
                                            >
                                                <X size={14} className="text-gray-400" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Daily Mixes */}
                        {dailyMixes.length > 0 && (
                            <section className="mb-12">
                                <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                                    <Sparkles size={24} className="text-yellow-400" />
                                    Daily Mix
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                    {dailyMixes.map((mix, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => mix.songs?.[0] && playSong(mix.songs[0])}
                                            className="p-4 rounded-xl cursor-pointer hover:scale-[1.02] transition group bg-white/5 hover:bg-white/10 border border-white/10"
                                        >
                                            <div className="aspect-square mb-3 rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-purple-600 to-pink-600">
                                                {mix.cover ? (
                                                    <img src={mix.cover} alt={mix.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Sparkles size={48} className="text-white/50" />
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="font-bold text-sm text-white truncate">{mix.name}</h3>
                                            <p className="text-xs text-gray-400 truncate">{mix.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* New Releases */}
                        {newReleases.length > 0 && (
                            <Section title="Новые релизы" icon={<Disc size={24} className="text-green-400" />}>
                                {newReleases.map((song) => (
                                    <Card 
                                        key={song.id} 
                                        title={song.title} 
                                        subtitle={song.artist} 
                                        cover={song.cover} 
                                        onClick={() => playSong(song)} 
                                    />
                                ))}
                            </Section>
                        )}

                        {/* Trending Now */}
                        {trending.length > 0 && (
                            <Section title="В тренде" icon={<TrendingUp size={24} className="text-red-400" />}>
                                {trending.map((song) => (
                                    <Card 
                                        key={song.id} 
                                        title={song.title} 
                                        subtitle={song.artist} 
                                        cover={song.cover} 
                                        onClick={() => playSong(song)} 
                                    />
                                ))}
                            </Section>
                        )}

                        {/* For You */}
                        {forYou.length > 0 && (
                            <Section title="Для вас" icon={<Zap size={24} className="text-purple-400" />}>
                                {forYou.map((song) => (
                                    <Card 
                                        key={song.id} 
                                        title={song.title} 
                                        subtitle={song.artist} 
                                        cover={song.cover} 
                                        onClick={() => playSong(song)} 
                                    />
                                ))}
                            </Section>
                        )}

                        {/* Around the World */}
                        {aroundWorld.length > 0 && (
                            <Section title="Популярно в мире" icon={<Globe size={24} className="text-blue-400" />}>
                                {aroundWorld.map((song) => (
                                    <Card 
                                        key={song.id} 
                                        title={song.title} 
                                        subtitle={song.artist} 
                                        cover={song.cover} 
                                        onClick={() => playSong(song)} 
                                    />
                                ))}
                            </Section>
                        )}

                        {/* Hidden Gems */}
                        {hiddenGems.length > 0 && (
                            <Section title="Скрытые жемчужины" icon={<Gem size={24} className="text-pink-400" />}>
                                {hiddenGems.map((song) => (
                                    <Card 
                                        key={song.id} 
                                        title={song.title} 
                                        subtitle={song.artist} 
                                        cover={song.cover} 
                                        onClick={() => playSong(song)} 
                                    />
                                ))}
                            </Section>
                        )}

                        {/* Empty State */}
                        {!isDiscoverLoading && 
                         dailyMixes.length === 0 && 
                         newReleases.length === 0 && 
                         trending.length === 0 && 
                         forYou.length === 0 && 
                         aroundWorld.length === 0 && 
                         hiddenGems.length === 0 && 
                         recentSearches.length === 0 && (
                            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                                <Search size={64} className="mx-auto mb-4 text-indigo-500 opacity-50" />
                                <h3 className="text-xl font-bold text-white mb-2">Начните искать музыку</h3>
                                <p className="text-gray-400">Используйте поиск выше, чтобы найти треки, артистов и альбомы</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    }

    // Loading Search
    if (isLoading) {
        return (
            <div className="p-8 text-center py-20">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Поиск...</p>
            </div>
        );
    }

    // SEARCH RESULTS (когда есть запрос)
    return (
        <div className="p-8 pb-32 animate-fade-in">
            <h1 className="text-4xl font-bold mb-8 text-white">
                Результаты для: <span className="text-indigo-400">"{searchTerm}"</span>
            </h1>

            {!hasResults && (
                <div className="p-10 text-center text-gray-500 text-lg border border-zinc-800 rounded-lg bg-zinc-900/50">
                    <Music size={48} className="mx-auto mb-4 text-indigo-500" />
                    <h3 className="text-xl font-bold text-white mb-2">Ничего не найдено</h3>
                    <p className="text-gray-400">По запросу "{searchTerm}" ничего не найдено</p>
                </div>
            )}

            {topResult && (
                <section className="mb-10">
                    <h2 className="text-3xl font-bold mb-4 text-white">Топ-результат</h2>
                    <div 
                        className="p-6 bg-zinc-800/70 rounded-xl max-w-sm flex items-center gap-4 cursor-pointer hover:bg-zinc-700 transition border border-indigo-800 shadow-lg"
                        onClick={() => {
                            if (topResult.type === 'track') playSong(topResult.data as Song);
                            if (topResult.type === 'artist') openArtistView(topResult.data as MockTrack);
                            if (topResult.type === 'album') openAlbumView(topResult.data as Song);
                        }}
                    >
                        <img 
                            src={topResult.data.cover} 
                            alt="Cover" 
                            className={`w-20 h-20 shadow-md object-cover ${topResult.type === 'artist' ? 'rounded-full' : 'rounded-lg'}`} 
                        />
                        <div>
                            <p className="text-xl font-bold text-white truncate max-w-[200px]">
                                {topResult.type === 'track' ? (topResult.data as Song).title : (topResult.data as MockTrack).name}
                            </p>
                            <p className="text-sm text-indigo-300 capitalize font-medium">
                                {topResult.type} • {(topResult.data as any).artist || 'Unknown'}
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {tracks.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-3xl font-bold mb-4 text-white">Треки</h2>
                    <div className="space-y-2">
                        {tracks.slice(0, 10).map((song: Song) => (
                            <div 
                                key={song.id} 
                                className="flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-800 transition cursor-pointer border border-transparent hover:border-white/10"
                                onClick={() => playSong(song)}
                            >
                                <img src={song.cover} alt={song.title} className="w-12 h-12 rounded-lg object-cover" />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-white truncate">{song.title}</h3>
                                    <p className="text-sm text-indigo-300 truncate">{song.artist}</p>
                                </div>
                                <span className="text-sm text-gray-400 font-mono">{song.duration}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {artists.length > 0 && (
                <Section title="Артисты">
                    {artists.map((artist: MockTrack, index: number) => (
                        <Card 
                            key={index} 
                            name={artist.name} 
                            subtitle={artist.artist} 
                            cover={artist.cover} 
                            isRound={true} 
                            onClick={() => openArtistView(artist)} 
                        />
                    ))}
                </Section>
            )}

            {albums.length > 0 && (
                <Section title="Альбомы">
                    {albums.map((albumTrack: Song, index: number) => (
                        <Card 
                            key={index} 
                            title={albumTrack.album} 
                            subtitle={albumTrack.artist} 
                            cover={albumTrack.cover} 
                            isRound={false} 
                            onClick={() => openAlbumView(albumTrack)} 
                        />
                    ))}
                </Section>
            )}
        </div>
    );
};

export default SearchPage;
