import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Settings({ setRoute, theme, setTheme }) {
  const [settings, setSettings] = useState({ poll_interval_seconds: 300, min_deal_score: 70, email_to: '', webhook_url: '' });
  useEffect(() => { fetch('/api/v1/settings').then((res) => (res.ok ? res.json() : settings)).then(setSettings).catch(() => {}); }, []);
  const update = (key, value) => setSettings((current) => ({ ...current, [key]: value }));
  return (
    <main className="app-shell min-h-screen p-4 sm:p-6">
      <button onClick={() => setRoute('/')} className="ghost-button mb-8"><ArrowLeft size={16} />Dashboard</button>
      <section className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold text-primary">Settings</h1>
        <div className="card mt-6 space-y-4 p-5">
          <label className="field">Email address<input className="control mt-2 w-full" value={settings.email_to || ''} onChange={(event) => update('email_to', event.target.value)} /></label>
          <label className="field">Webhook URL<input className="control mt-2 w-full" value={settings.webhook_url || ''} onChange={(event) => update('webhook_url', event.target.value)} /></label>
          <label className="field">Polling interval<input className="control mt-2 w-full" type="number" value={settings.poll_interval_seconds} onChange={(event) => update('poll_interval_seconds', Number(event.target.value))} /></label>
          <label className="field">Minimum alert score<input className="control mt-2 w-full" type="number" value={settings.min_deal_score} onChange={(event) => update('min_deal_score', Number(event.target.value))} /></label>
          <label className="field">Theme<select className="control mt-2 w-full" value={theme} onChange={(event) => setTheme(event.target.value)}><option value="dark">Dark</option><option value="light">Light</option></select></label>
          <button className="primary-button">Save settings</button>
        </div>
      </section>
    </main>
  );
}
