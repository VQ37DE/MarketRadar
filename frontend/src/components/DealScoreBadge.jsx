export default function DealScoreBadge({ score }) {
  const tone = score >= 70 ? 'bg-radar-green/15 text-radar-green ring-radar-green/35' : score >= 40 ? 'bg-radar-amber/15 text-radar-amber ring-radar-amber/35' : 'bg-radar-red/15 text-radar-red ring-radar-red/35';
  const label = score >= 70 ? 'Strong' : score >= 40 ? 'Decent' : 'Weak';
  return (
    <div className={`inline-flex min-w-[76px] items-center justify-center rounded-md px-2.5 py-1 text-sm font-bold ring-1 ${tone}`} aria-label={`${label} deal score ${score}`}>
      {score}
    </div>
  );
}
