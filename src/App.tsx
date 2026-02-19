import { Desktop } from '@/components/desktop/Desktop';
import { AudioProvider } from '@/components/ui/AudioContext';
import { ThemeProvider } from '@/components/ui/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <AudioProvider>
        <Desktop />
      </AudioProvider>
    </ThemeProvider>
  );
}
