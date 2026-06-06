import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { APP_NAME } from "@/lib/constants";
import { Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-lg">
              <span className="text-lg font-bold">AD</span>
            </div>
            <span className="text-2xl font-bold text-foreground">
              {APP_NAME}
            </span>
          </div>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
          {/* Sign In Title */}
          <h1 className="mb-2 text-center text-2xl font-semibold text-foreground">
            Sign In
          </h1>
          <p className="mb-8 text-center text-sm text-muted-foreground">
            Welcome back to {APP_NAME}
          </p>

          {/* Form */}
          <form className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="pl-10"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="pl-10"
                />
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <a
                href="#"
                className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
              >
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <Button type="submit" className="w-full" size="lg">
              Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          © 2024 {APP_NAME}. All rights reserved.
        </p>
      </div>
    </div>
  );
}
