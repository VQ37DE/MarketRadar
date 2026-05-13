import { useMemo, useState } from 'react';
import Dashboard from './pages/Dashboard.jsx';
import Settings from './pages/Settings.jsx';
import Watchlists from './pages/Watchlists.jsx';

export default function App() {
  const [route, setRoute] = useState(window.location.pathname);
  const [theme, setTheme] = useState('dark');
  const page = useMemo(() => {
    if (route === '/settings') return <Settings theme={theme} setTheme={setTheme} />;
    if (route === '/watchlists') return <Watchlists />;
    return <Dashboard setRoute={setRoute} theme={theme} setTheme={setTheme} />;
  }, [route, theme]);
  return <div className={theme === 'dark' ? 'dark' : ''}>{page}</div>;
}
