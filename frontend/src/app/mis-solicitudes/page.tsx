import type { Metadata } from "next";
import { Suspense } from "react";
import { RequireAuth } from "@/features/auth/components/RouteGuard";
import { SectionHeader } from "@/features/common/components/SectionHeader";
import { MyRequests } from "@/features/requests/components/MyRequests";

export const metadata: Metadata = { title: "Mis solicitudes", robots: { index: false } };

export default function MisSolicitudesPage() {
  return (
    <section aria-labelledby="my-requests-title" className="section">
      <div className="container max-w-[900px]">
        <SectionHeader as="h1" id="my-requests-title" title="Mis solicitudes" subtitle="Las peticiones, quejas, reclamos y sugerencias que has enviado y su estado" />
        <Suspense>
          <RequireAuth>
            <MyRequests />
          </RequireAuth>
        </Suspense>
      </div>
    </section>
  );
}
