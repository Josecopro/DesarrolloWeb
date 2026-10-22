import { Footer } from "@/features/layout/components/Footer";
import { Header } from "@/features/layout/components/Header";
import { HelpButton } from "@/features/requests/components/HelpButton";
import { getAllCareers } from "@/features/careers/services/careers.cache";
import { getHeaderSearchItems } from "@/features/search/services/search.cache";
import { careerHref } from "@/features/common/lib/navigation";

// Agrupación del dropdown "Carreras" igual que legacy: 3 · 2 · 2.
const GROUP_SPLITS = [3, 5];

export async function PageLayout({ children }: { children: React.ReactNode }) {
  const [categories, searchItems] = await Promise.all([getAllCareers(), getHeaderSearchItems()]);
  const careers = categories.map((c) => ({ label: c.name, href: careerHref(c.id) }));
  const careerGroups = [
    [{ label: "Ver todas las áreas", href: "/carreras" }],
    careers.slice(0, GROUP_SPLITS[0]),
    careers.slice(GROUP_SPLITS[0], GROUP_SPLITS[1]),
    careers.slice(GROUP_SPLITS[1]),
  ].filter((g) => g.length);

  return (
    <div className="flex min-h-screen flex-col">
      <Header searchItems={searchItems} careerGroups={careerGroups} />
      <main className="flex-1">{children}</main>
      <Footer />
      <HelpButton />
    </div>
  );
}
