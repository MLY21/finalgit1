"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Save, X, CheckCircle2, Copy, Check, Loader2 } from "lucide-react";

import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

const textareaClass =
  "min-h-[120px] rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600 dark:focus:ring-zinc-600 transition-colors w-full resize-y leading-relaxed";

export default function AddClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    businessType: "E-commerce" as const,
    status: "active" as const,
    notes: "",
  });

  const [unlinkedPages, setUnlinkedPages] = useState<{ id: string; name: string; externalPageId: string | null }[]>([]);
  const [pagesLoading, setPagesLoading]     = useState(false);
  const [selectedPageId, setSelectedPageId] = useState("");

  useEffect(() => {
    setPagesLoading(true);
    fetch("/api/social-pages/unlinked")
      .then((r) => r.json())
      .then((d) => { if (d.success) setUnlinkedPages(d.data); })
      .finally(() => setPagesLoading(false));
  }, []);

  const handleChange = (
    key: keyof typeof form,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    setLoading(true);
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          socialPageId: selectedPageId || undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Failed to create client.");
        return;
      }

      setCredentials({
        email: form.email,
        password: data.data.temporaryPassword,
      });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Breadcrumb and Page Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          <Link href="/dashboard" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/dashboard/clients" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Clients
          </Link>
          <span>/</span>
          <span className="text-zinc-900 dark:text-zinc-100 font-semibold">Add Client</span>
        </div>
        <PageHeader
          title="Add New Client"
          description="Create and manage client information for marketing campaigns."
        />
      </div>

      {credentials && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 space-y-4 dark:border-emerald-900/50 dark:bg-emerald-950/30 animate-in fade-in zoom-in duration-200">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="size-5 shrink-0" />
            <span className="text-sm font-semibold">Client Created Successfully</span>
          </div>

          <div className="rounded-lg border border-emerald-200 bg-white dark:border-emerald-900/40 dark:bg-zinc-900 p-4 space-y-3">
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Email</p>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{credentials.email}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Temporary Password</p>
              <p className="text-sm font-mono font-bold text-zinc-900 dark:text-zinc-100 tracking-wide">{credentials.password}</p>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="h-9 rounded-lg text-sm"
              render={<Link href="/dashboard/clients" />}
            >
              Go to Clients
            </Button>
            <Button
              type="button"
              className="h-9 rounded-lg text-sm bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => {
                navigator.clipboard.writeText(`Email: ${credentials.email}\nPassword: ${credentials.password}`);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied ? <Check className="size-4 mr-1.5" /> : <Copy className="size-4 mr-1.5" />}
              {copied ? "Copied!" : "Copy Credentials"}
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
          {error}
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit}>
        <DashboardCard className="p-5 sm:p-6 space-y-6">
          <div className="space-y-4">
            {/* Section Header */}
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                Basic Information
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Enter contact and business details to set up the client profile.
              </p>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Client Name" required>
                <Input
                  type="text"
                  placeholder="e.g. Ali Al-Faturi"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                  className="h-10 rounded-lg border-zinc-200 bg-zinc-50 text-sm dark:border-zinc-800 dark:bg-zinc-900 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600"
                />
              </Field>

              <Field label="Company Name" required>
                <Input
                  type="text"
                  placeholder="e.g. Tripoli Tech Shop"
                  value={form.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                  required
                  className="h-10 rounded-lg border-zinc-200 bg-zinc-50 text-sm dark:border-zinc-800 dark:bg-zinc-900 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600"
                />
              </Field>

              <Field label="Email Address" required>
                <Input
                  type="email"
                  placeholder="ali@tripolitech.ly"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  className="h-10 rounded-lg border-zinc-200 bg-zinc-50 text-sm dark:border-zinc-800 dark:bg-zinc-900 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600"
                />
              </Field>

              <Field label="Phone Number">
                <Input
                  type="tel"
                  placeholder="e.g. +218 91 123 4567"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="h-10 rounded-lg border-zinc-200 bg-zinc-50 text-sm dark:border-zinc-800 dark:bg-zinc-900 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600"
                />
              </Field>

              <Field label="Business Type">
                <select
                  value={form.businessType}
                  onChange={(e) => handleChange("businessType", e.target.value)}
                  className={selectClass}
                >
                  <option value="E-commerce">E-commerce</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Clinic">Clinic</option>
                  <option value="Education">Education</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Other">Other</option>
                </select>
              </Field>

              <Field label="Status">
                <select
                  value={form.status}
                  onChange={(e) => handleChange("status", e.target.value as any)}
                  className={selectClass}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </Field>
            </div>

            {/* Facebook Page — above Notes */}
            <div className="pt-2">
              <Field label="Facebook Page">
                {pagesLoading ? (
                  <div className="flex items-center gap-2 h-10 text-xs text-zinc-400">
                    <Loader2 className="size-3.5 animate-spin" />
                    Loading pages...
                  </div>
                ) : (
                  <select
                    value={selectedPageId}
                    onChange={(e) => setSelectedPageId(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">-- None --</option>
                    {unlinkedPages.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}{p.externalPageId ? ` (${p.externalPageId})` : ""}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
              {unlinkedPages.length === 0 && !pagesLoading && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  No unlinked Facebook pages found. Seed them first via the dev endpoint.
                </p>
              )}
            </div>

            {/* Notes Section */}
            <div className="pt-2">
              <Field label="Notes">
                <textarea
                  placeholder="Prefers Meta Ads campaigns. Monthly budget is around 5,000 USD."
                  value={form.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  className={textareaClass}
                />
              </Field>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-4 border-t border-zinc-100 dark:border-zinc-800 pt-5">
            <Button
              type="button"
              variant="outline"
              render={<Link href="/dashboard/clients" />}
              disabled={loading || !!credentials}
              className="h-10 rounded-lg text-sm font-semibold w-full sm:w-auto"
            >
              <X className="size-4 mr-1.5" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !!credentials}
              className="h-10 rounded-lg text-sm font-semibold w-full sm:w-auto bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 shadow-sm"
            >
              <Save className="size-4 mr-1.5" />
              {loading ? "Saving Client..." : "Save Client"}
            </Button>
          </div>
        </DashboardCard>
      </form>
    </div>
  );
}
