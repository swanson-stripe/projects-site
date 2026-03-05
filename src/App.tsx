import { Desktop } from '@/components/desktop/Desktop';
import { AudioProvider } from '@/components/ui/AudioContext';
import { ThemeProvider } from '@/components/ui/ThemeContext';
import { useDynamicFavicon } from '@/hooks/useDynamicFavicon';
import { PasswordGate } from '@/components/PasswordGate';

function AppInner() {
  useDynamicFavicon();
  return <Desktop />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AudioProvider>
        <PasswordGate>
          <AppInner />
        </PasswordGate>
      </AudioProvider>
    </ThemeProvider>
  );
}
