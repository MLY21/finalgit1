"use client";

import { useState, useEffect, useRef } from "react";
import { KeyRound, AlertTriangle, CheckCircle2, Eye, EyeOff } from "lucide-react";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { SectionHeader } from "@/components/dashboard/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/format";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarInitials: string | null;
  mustChangePassword: boolean;
  createdAt: string;
  client: {
    phone: string;
    company: string;
    status: string;
  } | null;
}

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

export default function UserProfilePage() {
  const securityRef = useRef<HTMLDivElement>(null);

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mustChangePwd, setMustChangePwd] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "" });
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [showPwdForm, setShowPwdForm] = useState(false);
  const [pwdForm, setPwdForm] = useState({ current: "", newPwd: "", confirm: "" });
  const [showPwdValues, setShowPwdValues] = useState({ current: false, newPwd: false, confirm: false });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [pwdError, setPwdError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const d: ProfileData = data.data;
          setProfile(d);
          setMustChangePwd(d.mustChangePassword);
          setForm({
            name: d.name,
            email: d.email,
            phone: d.client?.phone ?? "",
            company: d.client?.company ?? "",
          });
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleScrollToSecurity = () => {
    setShowPwdForm(true);
    setTimeout(() => {
      securityRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleSaveProfile = async () => {
    setSaveLoading(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setSaveError(data.message ?? "Failed to save."); return; }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setSaveError("Something went wrong.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setPwdError(null);
    if (!pwdForm.current || !pwdForm.newPwd || !pwdForm.confirm) {
      setPwdError("All fields are required.");
      return;
    }
    if (pwdForm.newPwd !== pwdForm.confirm) {
      setPwdError("New passwords do not match.");
      return;
    }
    setPwdLoading(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: pwdForm.current, newPassword: pwdForm.newPwd }),
      });
      const data = await res.json();
      if (!res.ok) { setPwdError(data.message ?? "Failed to change password."); return; }
      setPwdSuccess(true);
      setMustChangePwd(false);
      setPwdForm({ current: "", newPwd: "", confirm: "" });
    } catch {
      setPwdError("Something went wrong.");
    } finally {
      setPwdLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-zinc-500 dark:text-zinc-400">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      <PageHeader
        title="Profile"
        description="Manage your personal and account information."
      />

      {/* First-login alert */}
      {mustChangePwd && (
        <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              You are using a temporary password. Please change your password before using the system.
            </p>
          </div>
          <Button
            size="sm"
            className="h-8 shrink-0 rounded-lg px-4 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white"
            onClick={handleScrollToSecurity}
          >
            Change Password
          </Button>
        </div>
      )}

      {/* Personal Information */}
      <DashboardCard className="p-5 sm:p-6">
        <SectionHeader
          title="Personal Information"
          description="Update your contact details."
          className="mb-5"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Full Name">
            <Input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className={inputClass}
            />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className={inputClass}
            />
          </Field>
          <Field label="Phone">
            <Input
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              className={inputClass}
            />
          </Field>
          <Field label="Company / Business Name">
            <Input
              value={form.company}
              onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
              className={inputClass}
            />
          </Field>
        </div>
        {saveError && (
          <p className="mt-3 text-xs text-rose-600 dark:text-rose-400">{saveError}</p>
        )}
        {saveSuccess && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-3.5" />
            Profile updated successfully.
          </div>
        )}
        <div className="mt-6 flex justify-end">
          <Button
            className="h-9 rounded-lg px-4 text-sm font-medium"
            onClick={handleSaveProfile}
            disabled={saveLoading}
          >
            {saveLoading ? "Saving..." : "Save changes"}
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
                {profile?.role?.toLowerCase() ?? "client"}
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
                {profile?.client?.status ?? "active"}
              </Badge>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Created date
            </dt>
            <dd className="mt-1.5 text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {profile?.createdAt ? formatDate(profile.createdAt) : "—"}
            </dd>
          </div>
        </dl>
      </DashboardCard>

      {/* Security */}
      <div ref={securityRef}>
      <DashboardCard className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SectionHeader
            title="Security"
            description="Keep your account secure by updating your password regularly."
          />
          {!showPwdForm && (
            <Button
              variant="outline"
              className="h-9 shrink-0 rounded-lg px-4 text-sm font-medium"
              onClick={() => setShowPwdForm(true)}
            >
              <KeyRound className="size-4" />
              Change password
            </Button>
          )}
        </div>

        {showPwdForm && (
          <div className="mt-5 space-y-4 border-t border-zinc-100 dark:border-zinc-800 pt-5">
            {pwdSuccess ? (
              <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-4 shrink-0" />
                Password changed successfully. You can now use the system normally.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {(["current", "newPwd", "confirm"] as const).map((key) => {
                    const labels = { current: "Current Password", newPwd: "New Password", confirm: "Confirm New Password" };
                    return (
                      <Field key={key} label={labels[key]}>
                        <div className="relative">
                          <Input
                            type={showPwdValues[key] ? "text" : "password"}
                            value={pwdForm[key]}
                            onChange={(e) => setPwdForm((p) => ({ ...p, [key]: e.target.value }))}
                            className={`${inputClass} pr-9`}
                          />
                          <button
                            type="button"
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                            onClick={() => setShowPwdValues((p) => ({ ...p, [key]: !p[key] }))}
                          >
                            {showPwdValues[key] ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </button>
                        </div>
                      </Field>
                    );
                  })}
                </div>
                {pwdError && (
                  <p className="text-xs text-rose-600 dark:text-rose-400">{pwdError}</p>
                )}
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    className="h-9 rounded-lg px-4 text-sm"
                    onClick={() => { setShowPwdForm(false); setPwdError(null); setPwdForm({ current: "", newPwd: "", confirm: "" }); }}
                    disabled={pwdLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="h-9 rounded-lg px-4 text-sm font-medium"
                    onClick={handleChangePassword}
                    disabled={pwdLoading}
                  >
                    {pwdLoading ? "Saving..." : "Update Password"}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </DashboardCard>
      </div>
    </div>
  );
}
