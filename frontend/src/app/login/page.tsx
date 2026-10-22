import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { GuestOnly } from "@/features/auth/components/RouteGuard";

export const metadata: Metadata = { title: "Ingresar", robots: { index: false } };

export default function LoginPage() {
  return (
    <section className="section">
      <div className="container">
        <Suspense>
          <GuestOnly>
            <LoginForm />
          </GuestOnly>
        </Suspense>
      </div>
    </section>
  );
}
