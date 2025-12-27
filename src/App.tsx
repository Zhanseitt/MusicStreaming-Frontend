import MusicPlayer, { Background } from './MusicPlayer';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Background />
        <MusicPlayer />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
