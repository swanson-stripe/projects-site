import { Routes, Route } from 'react-router-dom';
import { Desktop } from '@/components/desktop/Desktop';
import { AudioProvider } from '@/components/ui/AudioContext';
import { ThemeProvider, useTheme } from '@/components/ui/ThemeContext';
import { useDynamicFavicon } from '@/hooks/useDynamicFavicon';
import { PasswordGate } from '@/components/PasswordGate';
import { StackPage } from '@/pages/StackPage';

function AppInner() {
  useDynamicFavicon();
  const { theme } = useTheme();
  // Key on theme so Desktop fully remounts on every theme switch.
  // This guarantees the useState initializer reruns with the correct
  // theme config, giving each theme its own fresh window layout.
  return <Desktop key={theme} />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AudioProvider>
        <Routes>
          <Route path="/:code" element={<StackPage />} />
          <Route
            path="*"
            element={
              <PasswordGate>
                <AppInner />
              </PasswordGate>
            }
          />
        </Routes>
      </AudioProvider>
    </ThemeProvider>
  );
}
