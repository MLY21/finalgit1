interface AnalyticsFilterBarProps {
  dateRange: string;
  onDateRangeChange: (value: string) => void;
  client: string;
  onClientChange: (value: string) => void;
  platform: string;
  onPlatformChange: (value: string) => void;
}

export function AnalyticsFilterBar({
  dateRange,
  onDateRangeChange,
  client,
  onClientChange,
  platform,
  onPlatformChange,
}: AnalyticsFilterBarProps) {
  return (
    <div className="flex flex-col gap-4 p-4 border-b border-zinc-200 dark:border-zinc-800 sm:flex-row sm:items-center sm:p-5">
      {/* Date Range Filter */}
      <div className="w-full sm:w-44">
        <select
          value={dateRange}
          onChange={(e) => onDateRangeChange(e.target.value)}
          className="h-10 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600 dark:focus:ring-zinc-600 transition-colors w-full cursor-pointer font-medium"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
          <option value="thisYear">This Year</option>
        </select>
      </div>

      {/* Client Filter */}
      <div className="w-full sm:w-44">
        <select
          value={client}
          onChange={(e) => onClientChange(e.target.value)}
          className="h-10 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600 dark:focus:ring-zinc-600 transition-colors w-full cursor-pointer font-medium"
        >
          <option value="all">All Clients</option>
          <option value="tech-solutions">Tech Solutions Ltd</option>
          <option value="fashion-hub">Fashion Hub</option>
          <option value="real-estate">Real Estate Pro</option>
          <option value="ecommerce-plus">E-Commerce Plus</option>
          <option value="retail-giant">Retail Giant</option>
        </select>
      </div>

      {/* Platform Filter */}
      <div className="w-full sm:w-44">
        <select
          value={platform}
          onChange={(e) => onPlatformChange(e.target.value)}
          className="h-10 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600 dark:focus:ring-zinc-600 transition-colors w-full cursor-pointer font-medium"
        >
          <option value="all">All Platforms</option>
          <option value="meta">Meta Ads</option>
          <option value="google">Google Ads</option>
          <option value="tiktok">TikTok Ads</option>
        </select>
      </div>
    </div>
  );
}
