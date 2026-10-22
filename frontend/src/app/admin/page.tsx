import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminDashboard } from "@/features/admin/components/AdminDashboard";
import { RequireAuth } from "@/features/auth/components/RouteGuard";
import { SectionHeader } from "@/features/common/components/SectionHeader";

export const metadata: Metadata = { title: "Administración", robots: { index: false } };

export default function AdminPage() {
  return (
    <section aria-labelledby="admin-title" className="section">
      <div className="container">
        <SectionHeader as="h1" id="admin-title" title="Administración" subtitle="Gestiona las solicitudes, las universidades y las áreas de estudio" />
        <Suspense>
          <RequireAuth role="admin">
            <AdminDashboard />
          </RequireAuth>
        </Suspense>
      </div>
    </section>
  );
}
