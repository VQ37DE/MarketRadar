import { Clock3, Repeat2, TrendingDown } from 'lucide-react';

export default function RelistBadge({ listing }) {
  const badges = [];
  if (listing.relist_count > 0) badges.push({ icon: Repeat2, label: `Relisted ${listing.relist_count}x` });
  if (listing.price_drop_amount > 0) badges.push({ icon: TrendingDown, label: `Dropped $${listing.price_drop_amount} (${listing.price_drop_percent}%)` });
  if (listing.days_sitting > 0) badges.push({ icon: Clock3, label: `${listing.days_sitting} days sitting` });
  if (!badges.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {badges.map(({ icon: Icon, label }) => (
        <span key={label} className="inline-flex min-h-7 items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium surface-soft text-secondary"><Icon size={12} />{label}</span>
      ))}
    </div>
  );
}
