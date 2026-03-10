import { Routes, Route } from 'react-router-dom';
import { Desktop } from '@/components/desktop/Desktop';
import { AudioProvider } from '@/components/ui/AudioContext';
import { ThemeProvider } from '@/components/ui/ThemeContext';
import { useDynamicFavicon } from '@/hooks/useDynamicFavicon';
import { PasswordGate } from '@/components/PasswordGate';
import { StackPage } from '@/pages/StackPage';

function AppInner() {
  useDynamicFavicon();
  return <Desktop />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AudioProvider>
        <Routes>
          <Route path="/STACK-:id" element={<StackPage />} />
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
