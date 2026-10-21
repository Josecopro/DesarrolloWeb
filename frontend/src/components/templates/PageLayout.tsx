import { Footer } from "@/components/organisms/Footer";
import { Header } from "@/components/organisms/Header";
import { HelpButton } from "@/components/organisms/HelpButton";
import { getCareerCategories, getSearchItems } from "@/lib/data";
import { careerHref } from "@/lib/navigation";

// Agrupación del dropdown "Carreras" igual que legacy: 3 · 2 · 2.
const GROUP_SPLITS = [3, 5];

export async function PageLayout({ children }: { children: React.ReactNode }) {
  const [categories, searchItems] = await Promise.all([getCareerCategories(), getSearchItems()]);
  const careers = categories.map((c) => ({ label: c.name, href: careerHref(c.id) }));
  const careerGroups = [careers.slice(0, GROUP_SPLITS[0]), careers.slice(GROUP_SPLITS[0], GROUP_SPLITS[1]), careers.slice(GROUP_SPLITS[1])];

  return (
    <div className="flex min-h-screen flex-col">
      <Header searchItems={searchItems} careerGroups={careerGroups} />
      <main className="flex-1">{children}</main>
      <Footer />
      <HelpButton />
    </div>
  );
}
