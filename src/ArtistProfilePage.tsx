import React, { useState } from 'react';
import { 
    Play, MoreHorizontal, CheckCircle, Disc, Users, Calendar, Heart, 
    Share2, ArrowRight, ShoppingBag, Radio, Mic2, Layers, Music2, Clock 
} from 'lucide-react';

// Импортируем только тип
import type { MockTrack } from './MusicPlayer'; 

// Создаём компонент Card локально
interface CardProps {
  title: string;
  subtitle: string;
  cover: string;
}

const Card: React.FC<CardProps> = ({ title, subtitle, cover }) => (
  <div className="flex-shrink-0 w-48 group cursor-pointer transition-all hover:bg-white/5 p-4 rounded-lg">
    <div className="relative rounded-lg overflow-hidden shadow-xl mb-4 aspect-square bg-zinc-900">
      <img 
        src={cover} 
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <button className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
          <Play size={20} fill="white" className="text-white ml-0.5" />
        </button>
      </div>
    </div>
    <div className="font-bold text-white truncate mb-1">{title}</div>
    <div className="text-xs text-gray-400 truncate">{subtitle}</div>
  </div>
);

interface ArtistProfilePageProps {
  artistName: string;
  cover: string;
}

// --- ИСПРАВЛЕННАЯ БАЗА ДАННЫХ (С РАБОЧИМИ КАРТИНКАМИ) ---
const artistsDb: Record<string, any> = {
    "The Weeknd": {
        monthlyListeners: "120,195,728",
        verified: true,
        // Надежная картинка с Wikimedia
        bgImage: "https://upload.wikimedia.org/wikipedia/commons/e/e8/The_Weeknd_at_TIFF_2019.png",
        bio: "The Weeknd (Abel Tesfaye) redefined R&B and pop music on his own terms. The multi-platinum, three-time GRAMMY Award winner has emerged as one of the most successful and significant artists of the 21st century.",
        colorHex: "#7f1d1d", // Красный
        colorClass: "from-red-900/50", // Полупрозрачный для плавного перехода
        buttonColor: "bg-red-600 hover:bg-red-500",
        popularTracks: [
            { id: 1, title: 'One Of The Girls', plays: '7,113,980,301', duration: '4:04', cover: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=200&fit=crop' },
            { id: 2, title: 'Starboy', plays: '4,796,985,377', duration: '3:50', cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=200&fit=crop' },
            { id: 3, title: 'Blinding Lights', plays: '5,159,747,111', duration: '3:20', cover: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=200&fit=crop' },
        ],
        albums: [
            { title: 'After Hours', type: '2020 • Альбом', cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&fit=crop' },
            { title: 'Dawn FM', type: '2022 • Альбом', cover: 'https://images.unsplash.com/photo-1621360841012-d7688de68a26?w=300&fit=crop' },
        ]
    },
    "Eminem": {
        monthlyListeners: "76,543,210",
        verified: true,
        // Надежная картинка
        bgImage: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Eminem_-_Concert_for_Valor_in_Washington%2C_D.C._Nov._11%2C_2014_%282%29_%28Cropped%29.jpg",
        bio: "Eminem is one of the best-selling music artists of all time. Known for his technical prowess and controversial lyrics, he is a cultural icon.",
        colorHex: "#3f3f46", 
        colorClass: "from-zinc-800",
        buttonColor: "bg-white text-black hover:bg-gray-200",
        popularTracks: [
            { id: 1, title: 'Mockingbird', plays: '1,859,726,382', duration: '4:11', cover: 'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=200&fit=crop' },
            { id: 2, title: 'Lose Yourself', plays: '2,193,078,962', duration: '5:26', cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&fit=crop' },
            { id: 3, title: 'Without Me', plays: '1,923,508,362', duration: '4:50', cover: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=200&fit=crop' },
        ],
        albums: [
            { title: 'The Eminem Show', type: '2002 • Альбом', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&fit=crop' },
            { title: 'Encore', type: '2004 • Альбом', cover: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?w=300&fit=crop' },
        ]
    },
    // ДЕФОЛТНЫЙ ВАРИАНТ (Если артист не найден)
    "default": {
        monthlyListeners: "1,000,000",
        verified: false,
        bgImage: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070", // Красивая заглушка
        bio: "Исполнитель.",
        colorHex: "#18181b",
        colorClass: "from-zinc-900",
        buttonColor: "bg-indigo-600 hover:bg-indigo-500",
        popularTracks: [],
        albums: []
    }
};


const ArtistProfilePage: React.FC<ArtistProfilePageProps> = ({ artistName, cover }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  // Получаем данные или дефолт
  const data = artistsDb[artistName] || artistsDb["default"];

  // Используем картинку из БД или обложку из пропсов, или дефолтную
  const heroImage = data.bgImage || cover || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200";
  const accentColorClass = data.colorClass;


  return (
    <div className="pb-32 relative z-10 w-full overflow-hidden bg-[#121212] min-h-screen text-white font-sans animate-fade-in custom-scrollbar">

        {/* --- 1. HERO BANNER (ОБНОВЛЕННЫЙ) --- */}
        <div className="relative w-full h-[50vh] min-h-[400px] flex flex-col justify-end p-8 md:p-12 overflow-hidden group">
            {/* Фоновое изображение */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20s] ease-in-out group-hover:scale-110"
                style={{ 
                    backgroundImage: `url(${heroImage})`,
                    backgroundPosition: 'center 20%' 
                }}
            >
                 {/* Градиент затемнения снизу, чтобы текст читался */}
                 <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/30 to-transparent"></div>
            </div>


            {/* Контент (Текст поверх картинки) - Z-INDEX 20 чтобы быть выше фона */}
            <div className="relative z-20 animate-fade-in-up">
                {data.verified && (
                    <div className="flex items-center gap-2 text-white mb-2 backdrop-blur-sm bg-black/30 w-fit px-3 py-1 rounded-full border border-white/10">
                        <div className="bg-blue-500 rounded-full p-0.5"><CheckCircle size={14} fill="white" className="text-blue-500" /></div>
                        <span className="text-xs font-bold uppercase tracking-widest">Подтвержденный</span>
                    </div>
                )}

                <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight mb-4 drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] leading-[0.9]">
                    {artistName}
                </h1>

                <p className="text-gray-100 font-medium text-lg drop-shadow-md flex items-center gap-3">
                    <span className="bg-white text-black p-1 rounded-full"><Users size={16}/></span>
                    {data.monthlyListeners} слушателей за месяц
                </p>
            </div>
        </div>


        {/* --- 2. ГРАДИЕНТНЫЙ ПЕРЕХОД И КНОПКИ --- */}
        {/* Используем gradient-to-b для плавного перехода от цвета артиста к черному */}
        <div className={`relative bg-gradient-to-b ${accentColorClass} to-[#121212] pt-8 px-8 md:px-12`}>

            {/* Панель кнопок */}
            <div className="flex items-center gap-6 mb-10">
                <button className={`w-14 h-14 rounded-full flex items-center justify-center hover:scale-105 transition shadow-lg ${data.buttonColor}`}>
                    <Play fill="currentColor" size={28} className="ml-1" />
                </button>
                <button 
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`px-6 py-2 rounded-full border-2 text-xs font-extrabold uppercase tracking-widest transition shadow-md
                    ${isFollowing ? 'border-green-500 text-green-500' : 'border-white/30 text-white hover:border-white hover:scale-105'}`}
                >
                    {isFollowing ? 'В библиотеке' : 'Подписаться'}
                </button>
                <button className="text-gray-400 hover:text-white transition hover:scale-110">
                    <MoreHorizontal size={32} />
                </button>
            </div>


            <div className="flex flex-col lg:flex-row gap-12">

                {/* === ЛЕВАЯ КОЛОНКА (Треки) === */}
                <div className="flex-1 min-w-0 space-y-12">

                    {/* ПОПУЛЯРНЫЕ ТРЕКИ */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6">Популярные треки</h2>
                        <div className="space-y-1">
                            {(data.popularTracks.length > 0 ? data.popularTracks : artistsDb["default"].popularTracks).map((track: any, index: number) => (
                                <div 
                                    key={track.id} 
                                    className="grid grid-cols-[24px_auto_1fr_auto_auto] gap-5 items-center p-3 rounded-lg hover:bg-white/10 group cursor-pointer transition border border-transparent"
                                >
                                    <div className="text-gray-400 text-base font-medium w-6 text-center">
                                        <span className="group-hover:hidden">{index + 1}</span>
                                        <Play size={16} fill="white" className="hidden group-hover:block text-white animate-pulse" />
                                    </div>
                                    <img src={track.cover} alt={track.title} className="w-12 h-12 rounded-md shadow-lg object-cover group-hover:scale-110 transition duration-300" />
                                    <div className="min-w-0">
                                        <div className="text-white font-bold text-base truncate pr-4">{track.title}</div>
                                        <div className="text-xs text-gray-400 font-medium">{track.plays ? `${parseInt(track.plays.replace(/,/g, '')).toLocaleString()} прослушиваний` : 'Популярный трек'}</div>
                                    </div>
                                    <div className="flex items-center gap-6 w-20 justify-end">
                                        <button className="opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-green-500 scale-0 group-hover:scale-100 duration-300"><Heart size={20}/></button>
                                        <span className="text-gray-400 text-sm font-mono">{track.duration}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="mt-6 text-xs font-bold text-gray-400 hover:text-white uppercase tracking-wider pl-4 transition hover:underline">Показать еще</button>
                    </div>


                    {/* ДИСКОГРАФИЯ (Слайдер) */}
                    <div>
                        <div className="flex justify-between items-end mb-6">
                            <h2 className="text-2xl font-bold text-white">Дискография</h2>
                            <span className="text-xs font-bold text-gray-400 hover:text-white cursor-pointer uppercase transition">Показать все</span>
                        </div>
                        <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
                            {(data.albums.length > 0 ? data.albums : artistsDb["default"].albums).map((album: any, idx: number) => (
                                <Card key={idx} title={album.title} subtitle={album.type} cover={album.cover} />
                            ))}
                        </div>
                    </div>
                </div>


                {/* === ПРАВАЯ КОЛОНКА (Сайдбар) === */}
                <div className="w-full lg:w-[360px] flex-shrink-0 space-y-8">

                    {/* БИОГРАФИЯ */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-6">Об исполнителе</h3>
                        <div className="relative rounded-2xl overflow-hidden group cursor-pointer h-[450px] shadow-2xl transition hover:shadow-white/5 border border-white/5 bg-[#18181b]">
                            <img src={heroImage} className="w-full h-full object-cover transition duration-700 group-hover:scale-105 filter brightness-90 group-hover:brightness-100" alt="Bio" />

                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-6 flex flex-col justify-end">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black font-black text-lg shadow-lg">
                                        #{Math.floor(Math.random() * 10) + 1}
                                    </div>
                                    <span className="text-sm font-bold uppercase tracking-widest text-white drop-shadow-md">В мире</span>
                                </div>
                                <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 hover:bg-white/20 transition group-hover:-translate-y-1 duration-300">
                                    <p className="text-gray-100 text-sm line-clamp-4 leading-relaxed font-medium">
                                        {data.bio}
                                    </p>
                                    <div className="mt-3 flex items-center gap-2 text-white font-bold text-sm hover:underline">
                                        Читать <ArrowRight size={14}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* МЕРЧ */}
                    {data.merch && data.merch.length > 0 && (
                         <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><ShoppingBag size={18}/> Мерч</h3>
                            <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                                {data.merch.map((m: any, i: number) => (
                                    <div key={i} className="flex-shrink-0 w-28 group cursor-pointer">
                                        <div className="aspect-square bg-black rounded-lg mb-2 overflow-hidden">
                                            <img src={m.img} className="w-full h-full object-cover group-hover:scale-110 transition" alt=""/>
                                        </div>
                                        <div className="text-xs text-gray-300 truncate">{m.name}</div>
                                    </div>
                                ))}
                            </div>
                         </div>
                    )}


                </div>
            </div>
        </div>
    </div>
  );
};


export default ArtistProfilePage;
