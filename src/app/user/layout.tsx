import { ClientAccessGuard } from "@/components/client/client-access-guard";
import { ClientShell } from "@/components/client/client-shell";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientAccessGuard>
      <ClientShell>{children}</ClientShell>
    </ClientAccessGuard>
  );
}
