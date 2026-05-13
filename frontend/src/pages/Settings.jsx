import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Settings({ theme, setTheme }) {
  const [settings, setSettings] = useState({ poll_interval_seconds: 300, min_deal_score: 70, email_to: '', webhook_url: '' });
  useEffect(() => { fetch('/api/v1/settings').then((res) => (res.ok ? res.json() : settings)).then(setSettings).catch(() => {}); }, []);
  const update = (key, value) => setSettings((current) => ({ ...current, [key]: value }));
  return (
    <main className="min-h-screen bg-radar-bg p-6 text-zinc-100">
      <a href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"><ArrowLeft size={16} />Dashboard</a>
      <section className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <div className="mt-6 space-y-4 rounded-lg bg-radar-panel p-5 ring-1 ring-zinc-800">
          <label className="field">Email address<input className="control mt-2 w-full" value={settings.email_to || ''} onChange={(event) => update('email_to', event.target.value)} /></label>
          <label className="field">Webhook URL<input className="control mt-2 w-full" value={settings.webhook_url || ''} onChange={(event) => update('webhook_url', event.target.value)} /></label>
          <label className="field">Polling interval<input className="control mt-2 w-full" type="number" value={settings.poll_interval_seconds} onChange={(event) => update('poll_interval_seconds', Number(event.target.value))} /></label>
          <label className="field">Minimum alert score<input className="control mt-2 w-full" type="number" value={settings.min_deal_score} onChange={(event) => update('min_deal_score', Number(event.target.value))} /></label>
          <label className="field">Theme<select className="control mt-2 w-full" value={theme} onChange={(event) => setTheme(event.target.value)}><option value="dark">Dark</option><option value="light">Light</option></select></label>
          <button className="rounded-md bg-white px-4 py-2 text-sm font-bold text-zinc-950 hover:bg-zinc-200">Save settings</button>
        </div>
      </section>
    </main>
  );
}
