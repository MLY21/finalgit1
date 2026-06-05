"use client";

import { FilterSelect } from "@/components/client/filter-select";
import { DashboardCard } from "@/components/dashboard/dashboard-card";

export interface ReportsFilterValue {
  dateRange: string;
  platform: string;
  status: string;
}

interface ClientReportsFilterProps {
  value: ReportsFilterValue;
  onChange: (value: ReportsFilterValue) => void;
}

const dateRangeOptions = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "year", label: "This year" },
];

const platformOptions = [
  { value: "all", label: "All platforms" },
  { value: "meta", label: "Meta Ads" },
  { value: "tiktok", label: "TikTok Ads" },
  { value: "google", label: "Google Ads" },
];

const statusOptions = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "completed", label: "Completed" },
];

export function ClientReportsFilter({
  value,
  onChange,
}: ClientReportsFilterProps) {
  return (
    <DashboardCard className="p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <FilterSelect
          label="Date range"
          value={value.dateRange}
          options={dateRangeOptions}
          onChange={(dateRange) => onChange({ ...value, dateRange })}
        />
        <FilterSelect
          label="Platform"
          value={value.platform}
          options={platformOptions}
          onChange={(platform) => onChange({ ...value, platform })}
        />
        <FilterSelect
          label="Status"
          value={value.status}
          options={statusOptions}
          onChange={(status) => onChange({ ...value, status })}
        />
      </div>
    </DashboardCard>
  );
}
