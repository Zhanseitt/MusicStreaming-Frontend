// src/SongPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronDown,
  Heart,
  MoreHorizontal,
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Info,
  Disc,
  Send,
  Share2,
  X,
  Download,
  User,
  Volume2,
  Volume1,
  VolumeX,
} from 'lucide-react';
import type { Song } from './MusicPlayer';

interface SongPageProps {
  song: Song;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  currentTime: number;
  duration: number;
  onSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
  onSetTime: (time: number) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

interface LyricLine {
  time: number;
  text: string;
}

type TabView = 'lyrics' | 'info' | 'comments';

export default function SongPage({
  song,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  onClose,
  currentTime,
  duration,
  onSeek,
  onSetTime,
  volume,
  onVolumeChange,
}: SongPageProps) {
  const [activeTab, setActiveTab] = useState<TabView>('lyrics');
  const [isLiked, setIsLiked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const [comments, setComments] = useState<{ user: string; text: string }[]>([
    { user: 'Alice', text: 'Этот трек просто огонь! 🔥' },
    { user: 'Bob', text: 'Классика, никогда не надоест.' },
    { user: 'MusicLover', text: 'Eminem как всегда на высоте.' },
  ]);
  const [newComment, setNewComment] = useState('');

  const activeLineRef = useRef<HTMLParagraphElement | null>(null);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollTimeout = useRef<any>(null);

  const lyricsData: LyricLine[] =
    song.lyrics && song.lyrics.length
      ? (song.lyrics as LyricLine[])
      : [
          { time: 0, text: 'Текст для этой песни пока не добавлен...' },
          { time: 5, text: 'Наслаждайтесь музыкой 🎵' },
        ];

  const activeIndex = lyricsData.findIndex((line, index) => {
    const nextLine = lyricsData[index + 1];
    return (
      currentTime >= line.time &&
      (!nextLine || currentTime < nextLine.time)
    );
  });

  useEffect(() => {
    if (activeTab === 'lyrics' && activeLineRef.current && !isUserScrolling) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeIndex, activeTab, isUserScrolling]);

  const handleUserScroll = () => {
    setIsUserScrolling(true);
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      setIsUserScrolling(false);
    }, 2000);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments([...comments, { user: 'You', text: newComment }]);
      setNewComment('');
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-zinc-950/95 text-white overflow-hidden animate-fade-in backdrop-blur-3xl">
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none overflow-hidden">
        <img
          src={song.cover}
          className="w-full h-full object-cover blur-[120px] scale-150 brightness-75"
          alt=""
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative z-10 flex items-center justify-between px-6 py-8 md:px-12 flex-shrink-0">
        <button
          onClick={onClose}
          className="p-3 bg-white/5 hover:bg-white/20 rounded-full transition transform hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronDown size={28} className="text-white" />
        </button>
        <div className="flex flex-col items-center opacity-80 pointer-events-none">
          <span className="text-xs font-bold tracking-widest text-gray-300 uppercase">
            Сейчас играет
          </span>
          <span className="text-sm font-bold text-white shadow-sm">
            {song.album || 'Сингл'}
          </span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowShareModal(true)}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition hover:scale-110"
          >
            <Share2 size={24} />
          </button>
          <button className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition hover:scale-110">
            <MoreHorizontal size={24} />
          </button>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 px-6 pb-12 overflow-hidden">
        <div className="flex flex-col w-full max-w-md lg:max-w-lg flex-shrink-0 h-full justify-center">
          <div className="w-full aspect-square rounded-3xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] mb-8 transform transition-all duration-700 border border-white/10">
            <img
              src={song.cover}
              alt={song.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2 leading-tight tracking-tight">
                {song.title}
              </h1>
              <p className="text-xl text-gray-300 font-medium opacity-90">
                {song.artist}
              </p>
            </div>
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`transition-all duration-300 transform active:scale-75 hover:scale-110 ${
                isLiked
                  ? 'text-red-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Heart
                size={36}
                fill={isLiked ? 'currentColor' : 'none'}
              />
            </button>
          </div>
          <div
            className="mb-3 group cursor-pointer py-2"
            onClick={onSeek}
          >
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden relative">
              <div
                className="absolute h-full bg-white rounded-full transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              ></div>
              <div
                className="absolute h-4 w-4 bg-white rounded-full top-1/2 -translate-y-1/2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ left: `${progress}%` }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-400 font-mono font-medium mb-10">
            <span>{formatTime(currentTime)}</span>
            <span>{song.duration}</span>
          </div>

          <div className="flex items-center justify-between px-2 mb-6">
            <button className="text-gray-400 hover:text-white transition hover:scale-110">
              <Shuffle size={24} />
            </button>
            <button
              onClick={onPrev}
              className="text-white hover:scale-110 transition active:scale-95"
            >
              <SkipBack size={42} fill="currentColor" />
            </button>
            <button
              onClick={onPlayPause}
              className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-white/20"
            >
              {isPlaying ? (
                <Pause size={32} fill="black" />
              ) : (
                <Play size={32} fill="black" className="ml-1" />
              )}
            </button>
            <button
              onClick={onNext}
              className="text-white hover:scale-110 transition active:scale-95"
            >
              <SkipForward size={42} fill="currentColor" />
            </button>
            <button className="text-gray-400 hover:text-white transition hover:scale-110">
              <Repeat size={24} />
            </button>
          </div>

          <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl border border-white/10">
            <button
              onClick={() => onVolumeChange(volume > 0 ? 0 : 0.8)}
              className="text-white hover:scale-110 transition"
            >
              {volume === 0 ? (
                <VolumeX size={24} />
              ) : volume < 0.5 ? (
                <Volume1 size={24} />
              ) : (
                <Volume2 size={24} />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) =>
                onVolumeChange(parseFloat(e.target.value))
              }
              className="flex-1 accent-white cursor-pointer"
            />
            <span className="text-xs text-gray-400 font-mono w-12 text-right">
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>

        <div className="hidden lg:flex flex-col w-full max-w-xl h-[650px] bg-white/5 backdrop-blur-xl rounded-[40px] border border-white/10 overflow-hidden shadow-2xl relative">
          <div className="flex border-b border-white/10 bg-black/20 backdrop-blur-md absolute top-0 left-0 w-full z-20 flex-shrink-0">
            <button
              onClick={() => setActiveTab('lyrics')}
              className={`flex-1 py-5 text-sm font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'lyrics'
                  ? 'text-white bg-white/10'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Текст
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 py-5 text-sm font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'info'
                  ? 'text-white bg-white/10'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Инфо
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`flex-1 py-5 text-sm font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'comments'
                  ? 'text-white bg-white/10'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Чат
            </button>
          </div>

          <div
            className="flex-1 overflow-y-auto custom-scrollbar relative scroll-smooth"
            ref={lyricsContainerRef}
            onScroll={
              activeTab === 'lyrics' ? handleUserScroll : undefined
            }
          >
            {activeTab === 'lyrics' && (
              <div className="py-24 px-10 flex flex-col items-start space-y-6">
                {lyricsData.map((line, i) => {
                  const isActive = i === activeIndex;
                  return (
                    <p
                      key={i}
                      ref={isActive ? activeLineRef : null}
                      onClick={() => onSetTime(line.time)}
                      className={`
                        cursor-pointer w-full text-left leading-relaxed whitespace-pre-wrap break-words
                        transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
                        ${
                          isActive
                            ? 'text-3xl md:text-4xl font-extrabold text-white scale-105 opacity-100 pl-6 border-l-4 border-fuchsia-500 translate-x-2 blur-0 drop-shadow-lg'
                            : 'text-xl md:text-2xl font-medium text-gray-500 opacity-30 blur-[1.5px] hover:opacity-80 hover:blur-0 hover:text-gray-300 scale-95'
                        }
                      `}
                    >
                      {line.text}
                    </p>
                  );
                })}
                <div className="h-48"></div>
              </div>
            )}

            {activeTab === 'info' && (
              <div className="space-y-8 animate-fade-in pt-24 px-10 pb-10">
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-full bg-gray-700 overflow-hidden mb-4 shadow-xl border-4 border-white/10">
                    <img
                      src={song.cover}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </div>
                  <h2 className="text-3xl font-bold">{song.artist}</h2>
                  <p className="text-indigo-400 font-medium">
                    Исполнитель
                  </p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3 mb-4 text-gray-300 font-bold uppercase tracking-widest text-xs">
                    <Disc size={16} /> Альбом
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {song.album}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Released 2004 • Interscope Records
                  </div>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3 mb-4 text-gray-300 font-bold uppercase tracking-widest text-xs">
                    <Info size={16} /> О песне
                  </div>
                  <p className="text-base text-gray-300 leading-relaxed">
                    Это один из самых популярных треков исполнителя.
                    Текст песни отражает личные переживания и имеет
                    глубокий смысл для фанатов по всему миру.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="p-8 pt-24 h-full flex flex-col animate-fade-in">
                <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2 mb-4">
                  {comments.map((c, i) => (
                    <div
                      key={i}
                      className="bg-white/5 p-4 rounded-xl border border-white/5 flex gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
                        <User size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-indigo-400 mb-1">
                          {c.user}
                        </div>
                        <div className="text-sm text-gray-200 leading-snug">
                          {c.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <form
                  onSubmit={handleAddComment}
                  className="relative mt-auto"
                >
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Оставьте комментарий..."
                    className="w-full bg-black/30 border border-white/20 rounded-full py-3 pl-4 pr-12 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none transition"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 p-1.5 bg-indigo-600 rounded-full text-white hover:bg-indigo-500 transition shadow-lg"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            )}
          </div>

          {activeTab === 'lyrics' && (
            <>
              <div className="absolute top-[60px] left-0 w-full h-16 bg-gradient-to-b from-black/40 to-transparent pointer-events-none z-10"></div>
              <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10"></div>
            </>
          )}
        </div>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in px-4">
          <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl w-full max-w-sm shadow-2xl relative">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            >
              <X size={24} />
            </button>
            <h3 className="text-xl font-bold text-center mb-6">
              Поделиться треком
            </h3>

            <div className="bg-gradient-to-br from-indigo-500 to-fuchsia-600 p-6 rounded-2xl shadow-lg mb-6 transform hover:scale-105 transition duration-300 cursor-default">
              <img
                src={song.cover}
                className="w-full aspect-square rounded-xl shadow-md mb-4 object-cover"
                alt=""
              />
              <h4 className="font-black text-2xl text-white leading-none">
                {song.title}
              </h4>
              <p className="text-white/80 text-sm font-medium mt-1">
                {song.artist}
              </p>
              <div className="mt-4 flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-widest">
                <Disc size={12} /> SoundWave App
              </div>
            </div>

            <button className="w-full bg-white text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition">
              <Download size={18} />
              Скачать открытку
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
