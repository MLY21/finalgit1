export function PerformanceBar({ value }: { value: number }) {
  return (
    <div className="flex min-w-[100px] items-center gap-2">
      <progress
        value={value}
        max={100}
        className="performance-bar flex-1"
        aria-label={`Performance ${value}%`}
      />
      <span className="w-8 text-end text-xs font-medium text-zinc-600 dark:text-zinc-400">
        {value}%
      </span>
    </div>
  );
}
