"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Import, X, CheckCircle2, ChevronRight, Globe, AlertCircle } from "lucide-react";

import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { mockClients } from "@/data/clients";
import { mockExternalCampaigns } from "@/data/campaigns";
import { formatLyd } from "@/lib/format";

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </span>
      {children}
    </label>
  );
}

const selectClass =
  "h-10 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600 dark:focus:ring-zinc-600 transition-colors w-full cursor-pointer";

export default function ImportCampaignsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    clientId: mockClients[0]?.id || "",
    platform: "Meta Ads" as "Meta Ads" | "Google Ads" | "TikTok Ads",
    externalCampaignId: "",
  });

  const availableExternalCampaigns = useMemo(() => {
    return mockExternalCampaigns.filter((camp) => camp.platform === form.platform);
  }, [form.platform]);

  // Set the first available external campaign as selected when platform changes
  const handlePlatformChange = (val: "Meta Ads" | "Google Ads" | "TikTok Ads") => {
    const filtered = mockExternalCampaigns.filter((camp) => camp.platform === val);
    setForm((prev) => ({
      ...prev,
      platform: val,
      externalCampaignId: filtered[0]?.id || "",
    }));
  };

  // Set initial campaign if not selected
  useMemo(() => {
    if (availableExternalCampaigns.length > 0 && !form.externalCampaignId) {
      setForm((prev) => ({
        ...prev,
        externalCampaignId: availableExternalCampaigns[0].id,
      }));
    }
  }, [availableExternalCampaigns, form.externalCampaignId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientId || !form.externalCampaignId) {
      alert("Please select a client and an external campaign to import.");
      return;
    }

    setLoading(true);
    // Simulate API connection and data sync
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    setSuccess(true);

    // Redirect to All Campaigns after showing success animation
    setTimeout(() => {
      router.push("/dashboard/campaigns");
    }, 2000);
  };

  const selectedCampaignInfo = useMemo(() => {
    return mockExternalCampaigns.find((c) => c.id === form.externalCampaignId);
  }, [form.externalCampaignId]);

  return (
    <div className="space-y-5 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Breadcrumbs and Page Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          <Link href="/dashboard" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/dashboard/campaigns" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Campaigns
          </Link>
          <span>/</span>
          <span className="text-zinc-900 dark:text-zinc-100 font-semibold">Import Campaigns</span>
        </div>
        <PageHeader
          title="Import Campaigns"
          description="Connect advertising campaigns to clients and synchronize campaign data."
        />
      </div>

      {success && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400 animate-in fade-in zoom-in duration-200">
          <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div className="text-sm font-medium">
            Campaign successfully synchronized and connected to client! Redirecting...
          </div>
        </div>
      )}

      {/* Import Form Card */}
      <form onSubmit={handleSubmit}>
        <DashboardCard className="p-5 sm:p-6 space-y-6">
          <div className="space-y-5">
            {/* Form Section Header */}
            <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div className="p-2 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-lg shrink-0">
                <Globe className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                  Platform Integration
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Select the advertising account, target client, and active campaigns to import.
                </p>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Target Client" required>
                <select
                  value={form.clientId}
                  onChange={(e) => setForm((prev) => ({ ...prev, clientId: e.target.value }))}
                  className={selectClass}
                  required
                >
                  <option value="" disabled>Select Client Profile...</option>
                  {mockClients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} ({client.company})
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Advertising Platform" required>
                <select
                  value={form.platform}
                  onChange={(e) => handlePlatformChange(e.target.value as any)}
                  className={selectClass}
                  required
                >
                  <option value="Meta Ads">Meta Ads (Facebook & Instagram)</option>
                  <option value="Google Ads">Google Ads (Search & Display)</option>
                  <option value="TikTok Ads">TikTok Ads (Video Commerce)</option>
                </select>
              </Field>
            </div>

            <div className="pt-2">
              <Field label="Available External Campaigns" required>
                {availableExternalCampaigns.length > 0 ? (
                  <select
                    value={form.externalCampaignId}
                    onChange={(e) => setForm((prev) => ({ ...prev, externalCampaignId: e.target.value }))}
                    className={selectClass}
                    required
                  >
                    {availableExternalCampaigns.map((camp) => (
                      <option key={camp.id} value={camp.id}>
                        {camp.name} (ID: {camp.externalCampaignId} — Budget: {formatLyd(camp.budget)})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 text-xs border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                    <AlertCircle className="size-4 text-amber-500 shrink-0" />
                    No unimported campaigns found on this platform. Try shifting platforms.
                  </div>
                )}
              </Field>
            </div>

            {/* Selected Campaign Detailed Parameters Info Sheet (Mock sync preview) */}
            {selectedCampaignInfo && (
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/20 p-4 space-y-3 animate-in slide-in-from-top-1 duration-200">
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
                  Synchronization Preview
                </span>
                <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs sm:grid-cols-4">
                  <div>
                    <span className="text-zinc-400 dark:text-zinc-500 font-medium">Remote Campaign ID</span>
                    <code className="text-zinc-900 dark:text-zinc-100 font-bold font-mono block mt-0.5">
                      {selectedCampaignInfo.externalCampaignId}
                    </code>
                  </div>
                  <div>
                    <span className="text-zinc-400 dark:text-zinc-500 font-medium">Ad Account ID</span>
                    <code className="text-zinc-900 dark:text-zinc-100 font-bold font-mono block mt-0.5">
                      {selectedCampaignInfo.externalAdAccountId}
                    </code>
                  </div>
                  <div>
                    <span className="text-zinc-400 dark:text-zinc-500 font-medium">Retrieved Budget</span>
                    <p className="text-zinc-900 dark:text-zinc-100 font-bold block mt-0.5">
                      {formatLyd(selectedCampaignInfo.budget)}
                    </p>
                  </div>
                  <div>
                    <span className="text-zinc-400 dark:text-zinc-500 font-medium">Sync Interval</span>
                    <p className="text-zinc-900 dark:text-zinc-100 font-bold block mt-0.5">
                      Real-time webhook (Web)
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-4 border-t border-zinc-100 dark:border-zinc-800 pt-5">
            <Button
              type="button"
              variant="outline"
              render={<Link href="/dashboard/campaigns" />}
              disabled={loading || success}
              className="h-10 rounded-lg text-sm font-semibold w-full sm:w-auto"
            >
              <X className="size-4 mr-1.5" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || success || availableExternalCampaigns.length === 0}
              className="h-10 rounded-lg text-sm font-semibold w-full sm:w-auto bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 shadow-sm flex items-center justify-center gap-1.5"
            >
              <Import className="size-4" />
              {loading ? "Synchronizing Platform..." : "Import Campaign"}
            </Button>
          </div>

        </DashboardCard>
      </form>
    </div>
  );
}
