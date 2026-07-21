interface AnalyticsCardProps {
  title: string;
  value: number | string;
}

export default function AnalyticsCard({
  title,
  value,
}: AnalyticsCardProps) {
  return (
    <div
      className="
      rounded-2xl
      border
      border-slate-700
      bg-slate-900
      p-6
      shadow-lg
      "
    >
      <p className="text-sm text-slate-400">
        {title}
      </p>

      <h2 className="mt-3 text-4xl font-bold text-white">
        {value}
      </h2>
    </div>
  );
}