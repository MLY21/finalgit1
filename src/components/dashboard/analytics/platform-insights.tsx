import { cn } from "@/lib/utils";

interface PlatformInsight {
  title: string;
  value: string;
  type: "best" | "highest" | "most";
}

interface PlatformInsightsProps {
  insights: PlatformInsight[];
}

export function PlatformInsights({ insights }: PlatformInsightsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {insights.map((insight, index) => (
        <div
          key={index}
          className="rounded-xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "mt-0.5 size-8 shrink-0 rounded-lg flex items-center justify-center",
                insight.type === "best" && "bg-emerald-100 dark:bg-emerald-950/30",
                insight.type === "highest" && "bg-blue-100 dark:bg-blue-950/30",
                insight.type === "most" && "bg-amber-100 dark:bg-amber-950/30"
              )}
            >
              {insight.type === "best" && (
                <svg className="size-4 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              )}
              {insight.type === "highest" && (
                <svg className="size-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
              )}
              {insight.type === "most" && (
                <svg className="size-4 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              )}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {insight.title}
              </h4>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                {insight.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
