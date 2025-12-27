// src/GridPage.tsx
import React from 'react';
import { Card, type MockTrack } from './MusicPlayer'; // Импортируем Card и тип

interface GridPageProps {
  title: string;
  items: MockTrack[];
  renderType: 'artist' | 'album' | 'radio';
  onItemClick: (item: MockTrack) => void;
}

const GridPage: React.FC<GridPageProps> = ({ title, items, renderType, onItemClick }) => {
  const getCardProps = (item: MockTrack) => {
    switch (renderType) {
      case 'artist':
        return { name: item.name, subtitle: item.artist, isRound: true };
      case 'radio':
        return { name: item.name, subtitle: item.artist, isRound: true, isRadio: true };
      case 'album':
      default:
        return { title: item.title, subtitle: item.artist, isRound: false };
    }
  };

  return (
    <div className="p-8 animate-fade-in">
      <h1 className="text-4xl font-bold mb-8 text-indigo-400 soft-text-shadow-indigo">{title}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-6">
        {items.map((item, index) => (
          <Card
            key={index}
            cover={item.cover}
            {...getCardProps(item)}
            onClick={() => onItemClick(item)}
          />
        ))}
      </div>
    </div>
  );
};

export default GridPage;