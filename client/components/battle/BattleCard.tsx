interface BattleCardProps {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function BattleCard({
  title,
  icon,
  children,
  className = "",
}: BattleCardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-800 bg-slate-900/70 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/40 hover:shadow-indigo-500/10 ${className}`}
    >
      {(title || icon) && (
        <div className="flex items-center gap-3 border-b border-slate-800 px-6 py-4">
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
              {icon}
            </div>
          )}

          {title && (
            <h2 className="text-xl font-semibold text-white">
              {title}
            </h2>
          )}
        </div>
      )}

      <div className="p-6">
        {children}
      </div>
    </div>
  );
}