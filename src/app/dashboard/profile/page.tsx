"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";

import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { SectionHeader } from "@/components/dashboard/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/providers/auth-provider";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "h-10 rounded-lg border-zinc-200 bg-zinc-50 text-sm dark:border-zinc-800 dark:bg-zinc-900";

export default function AdminProfilePage() {
  const { user } = useAuth();
  
  const [form, setForm] = useState({
    name: user?.name || "Mohammed Khalid",
    email: user?.email || "mohammed@agency.com",
    phone: "+218 91 123 4567",
    company: "CampaignHub Agency",
  });

  const update = (key: keyof typeof form) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your personal and account information."
      />

      {/* Personal Information */}
      <DashboardCard className="p-5 sm:p-6">
        <SectionHeader
          title="Personal Information"
          description="Update your contact details."
          className="mb-5"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Full Name">
            <Input value={form.name} onChange={update("name")} className={inputClass} />
          </Field>
          <Field label="Email">
            <Input type="email" value={form.email} onChange={update("email")} className={inputClass} />
          </Field>
          <Field label="Phone">
            <Input value={form.phone} onChange={update("phone")} className={inputClass} />
          </Field>
          <Field label="Company / Business Name">
            <Input value={form.company} onChange={update("company")} className={inputClass} />
          </Field>
        </div>
        <div className="mt-6 flex justify-end">
          <Button className="h-9 rounded-lg px-4 text-sm font-medium">
            Save changes
          </Button>
        </div>
      </DashboardCard>

      {/* Account Information */}
      <DashboardCard className="p-5 sm:p-6">
        <SectionHeader
          title="Account Information"
          description="Details about your account."
          className="mb-5"
        />
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Role</dt>
            <dd className="mt-1.5">
              <Badge variant="secondary" className="rounded-lg capitalize">
                {user?.role || "admin"}
              </Badge>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Account status
            </dt>
            <dd className="mt-1.5">
              <Badge
                variant="outline"
                className="rounded-lg border-emerald-200 bg-emerald-50 font-medium capitalize text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400"
              >
                Active
              </Badge>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Created date
            </dt>
            <dd className="mt-1.5 text-sm font-medium text-zinc-900 dark:text-zinc-100">
              June 1, 2025
            </dd>
          </div>
        </dl>
      </DashboardCard>

      {/* Security */}
      <DashboardCard className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SectionHeader
            title="Security"
            description="Keep your account secure by updating your password regularly."
          />
          <Button
            variant="outline"
            className="h-9 shrink-0 rounded-lg px-4 text-sm font-medium"
          >
            <KeyRound className="size-4" />
            Change password
          </Button>
        </div>
      </DashboardCard>
    </div>
  );
}
