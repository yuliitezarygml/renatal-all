import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FeaturedItems } from "@/components/home/FeaturedItems";

export const dynamic = "force-dynamic";

export default async function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
  let items = [];
  try {
    const res = await fetch(`${apiUrl}/items`, { cache: "no-store" });
    if (res.ok) items = await res.json();
  } catch (error) {
    console.error("Failed to fetch items:", error);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <HowItWorks />
      <FeaturedItems items={items} />
    </div>
  );
}
