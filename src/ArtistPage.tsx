import React from 'react';
import { Play, MoreHorizontal, CheckCircle, Disc, Users, Calendar } from 'lucide-react';
import { Card, Section, type MockTrack } from './MusicPlayer'; 

// --- Интерфейсы ---
interface ArtistProfilePageProps {
  artistName: string;
  cover: string;
}

// --- БАЗА ДАННЫХ АРТИСТОВ (РАСШИРЕННАЯ) ---
const artistsDb: Record<string, any> = {
    "The Weeknd": {
        monthlyListeners: "114,324,543",
        bio: "The Weeknd (Abel Tesfaye) redefined R&B and pop music on his own terms. The multi-platinum, three-time GRAMMY Award winner has emerged as one of the most successful and significant artists of the 21st century.",
        popularTracks: [
            { id: 1, title: 'Blinding Lights', plays: '4,159,726,382', duration: '3:20', cover: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36' },
            { id: 2, title: 'Starboy', plays: '3,193,078,962', duration: '3:50', cover: 'https://upload.wikimedia.org/wikipedia/ru/3/39/The_Weeknd_-_Starboy.png' },
            { id: 3, title: 'Die For You', plays: '2,023,508,362', duration: '4:20', cover: 'https://i.scdn.co/image/ab67616d0000b273e21543e39c8646b8915e8550' },
            { id: 4, title: 'Save Your Tears', plays: '1,987,123,456', duration: '3:35', cover: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36' },
        ],
        albums: [
            { title: 'After Hours', subtitle: '2020 • Альбом', cover: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36' },
            { title: 'Dawn FM', subtitle: '2022 • Альбом', cover: 'https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526' },
            { title: 'Starboy', subtitle: '2016 • Альбом', cover: 'https://i.scdn.co/image/ab67616d0000b2734718e28d24527d97fe6405e9' },
        ]
    },
    "Eminem": {
        monthlyListeners: "76,543,210",
        bio: "Eminem is one of the best-selling music artists of all time, with estimated worldwide sales of over 220 million records. He is credited with popularizing hip hop in middle America.",
        popularTracks: [
            { id: 1, title: 'Mockingbird', plays: '1,859,726,382', duration: '4:11', cover: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Encore_%28Eminem_album%29_coverart.jpg' },
            { id: 2, title: 'Lose Yourself', plays: '2,193,078,962', duration: '5:26', cover: 'https://i.scdn.co/image/ab67616d0000b273968da85f248a7e7747767801' },
            { id: 3, title: 'Without Me', plays: '1,923,508,362', duration: '4:50', cover: 'https://i.scdn.co/image/ab67616d0000b2736ca5c90113b30c3c43ffb8f4' },
        ],
        albums: [
            { title: 'The Eminem Show', subtitle: '2002 • Альбом', cover: 'https://i.scdn.co/image/ab67616d0000b2736ca5c90113b30c3c43ffb8f4' },
            { title: 'Encore', subtitle: '2004 • Альбом', cover: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Encore_%28Eminem_album%29_coverart.jpg' },
            { title: 'Recovery', subtitle: '2010 • Альбом', cover: 'https://i.scdn.co/image/ab67616d0000b273523f46f33d79044d03998782' },
        ]
    },
    // Дефолтные данные для остальных
    "default": {
        monthlyListeners: "54,210,000",
        bio: "This artist is making waves in the music industry with their unique sound and style. Stay tuned for more releases and tour dates.",
        popularTracks: [
            { id: 1, title: 'Top Hit Song', plays: '859,726,382', duration: '3:20', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=200&auto=format&fit=crop' },
            { id: 2, title: 'Another Banger', plays: '193,078,962', duration: '2:50', cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=200&auto=format&fit=crop' },
            { id: 3, title: 'Chill Vibes', plays: '923,508,362', duration: '4:05', cover: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=200&auto=format&fit=crop' },
        ],
        albums: [
            { title: 'Greatest Hits', subtitle: '2023 • Альбом', cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200&auto=format&fit=crop' },
            { title: 'Live in London', subtitle: '2021 • Live', cover: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=200&auto=format&fit=crop' },
        ]
    }
};

const ArtistProfilePage: React.FC<ArtistProfilePageProps> = ({ artistName, cover }) => {
  // Получаем данные для конкретного артиста или дефолтные
  const data = artistsDb[artistName] || artistsDb["default"];

  return (
    <div className="animate-fade-in pb-20 relative z-10 w-full overflow-hidden">
        
        {/* --- HERO BANNER --- */}
        <div className="relative h-[450px] w-full flex flex-col justify-end p-10 overflow-hidden group">
            {/* Фон (Картинка артиста) */}
            <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] ease-in-out group-hover:scale-105"
                style={{ backgroundImage: `url(${cover})` }}
            >
                 <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/60 to-transparent"></div>
            </div>

            {/* Контент */}
            <div className="relative z-10 animate-fade-in-up">
                <div className="flex items-center gap-2 text-blue-400 mb-2">
                    <CheckCircle size={20} fill="currentColor" className="text-white" />
                    <span className="text-sm font-bold uppercase tracking-wider text-white">Подтвержденный исполнитель</span>
                </div>
                <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter mb-4 drop-shadow-2xl">
                    {artistName}
                </h1>
                <p className="text-gray-300 font-medium text-lg flex items-center gap-2">
                    <Users size={20} /> {data.monthlyListeners} слушателей за месяц
                </p>
            </div>
        </div>

        {/* --- ОСНОВНОЙ КОНТЕНТ --- */}
        <div className="px-10 -mt-10 relative z-20">
            
            {/* Кнопки управления */}
            <div className="flex items-center gap-6 mb-12">
                <button className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition shadow-[0_0_30px_rgba(34,197,94,0.4)] text-black">
                    <Play fill="black" size={32} className="ml-2" />
                </button>
                <button className="px-8 py-3 rounded-full border border-gray-500 text-white font-bold hover:border-white hover:bg-white/10 transition uppercase tracking-widest text-xs">
                    Подписаться
                </button>
                <button className="text-gray-400 hover:text-white transition">
                    <MoreHorizontal size={32} />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* ЛЕВАЯ КОЛОНКА (Треки) */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold text-white mb-6">Популярные треки</h2>
                    <div className="space-y-1">
                        {data.popularTracks.map((track: any, index: number) => (
                            <div 
                                key={track.id} 
                                className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 transition group cursor-pointer"
                            >
                                <span className="text-gray-500 font-mono w-6 text-center text-sm group-hover:text-white">{index + 1}</span>
                                <div className="relative w-12 h-12">
                                    <img src={track.cover} alt={track.title} className="w-full h-full rounded object-cover" />
                                    <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center rounded">
                                        <Play size={16} fill="white" className="text-white"/>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-white font-bold">{track.title}</h4>
                                    {track.plays && <span className="text-xs text-gray-500">{track.plays} plays</span>}
                                </div>
                                <span className="text-sm text-gray-500 font-mono group-hover:text-white">{track.duration}</span>
                            </div>
                        ))}
                    </div>

                     {/* АЛЬБОМЫ */}
                    <div className="mt-12">
                        <Section title="Дискография">
                            {data.albums.map((album: any, idx: number) => (
                                <Card key={idx} title={album.title} subtitle={album.subtitle} cover={album.cover} />
                            ))}
                        </Section>
                    </div>
                </div>

                {/* ПРАВАЯ КОЛОНКА (Инфо) */}
                <div className="space-y-8">
                    {/* ОБ ИСПОЛНИТЕЛЕ */}
                    <div className="relative rounded-3xl overflow-hidden group cursor-pointer h-[400px]">
                        <img src={cover} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt="About" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-8 flex flex-col justify-end">
                            <h3 className="text-2xl font-bold text-white mb-4">Об исполнителе</h3>
                            <p className="text-gray-300 text-sm line-clamp-4 leading-relaxed font-medium">
                                {data.bio}
                            </p>
                        </div>
                    </div>

                     {/* В ТУРЕ */}
                     <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                             <Calendar size={20} className="text-indigo-500"/> Концерты
                        </h3>
                        <div className="space-y-4">
                            <div className="flex gap-4 items-center">
                                <div className="bg-zinc-800 rounded-lg p-2 text-center min-w-[50px]">
                                    <div className="text-xs font-bold text-gray-400">ОКТ</div>
                                    <div className="text-xl font-black text-white">24</div>
                                </div>
                                <div>
                                    <div className="text-white font-bold">Los Angeles, CA</div>
                                    <div className="text-xs text-gray-500">SoFi Stadium</div>
                                </div>
                            </div>
                            <div className="flex gap-4 items-center">
                                <div className="bg-zinc-800 rounded-lg p-2 text-center min-w-[50px]">
                                    <div className="text-xs font-bold text-gray-400">НОЯ</div>
                                    <div className="text-xl font-black text-white">05</div>
                                </div>
                                <div>
                                    <div className="text-white font-bold">London, UK</div>
                                    <div className="text-xs text-gray-500">Wembley Stadium</div>
                                </div>
                            </div>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ArtistProfilePage;