import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { GuestOnly } from "@/features/auth/components/RouteGuard";

export const metadata: Metadata = { title: "Crear cuenta", robots: { index: false } };

export default function RegistroPage() {
  return (
    <section className="section">
      <div className="container">
        <Suspense>
          <GuestOnly>
            <RegisterForm />
          </GuestOnly>
        </Suspense>
      </div>
    </section>
  );
}
