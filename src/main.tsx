import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
// Импортируем твои контексты
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* 1. ThemeProvider снаружи, чтобы тема была доступна везде */}
    <ThemeProvider>
      {/* 2. AuthProvider внутри */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
