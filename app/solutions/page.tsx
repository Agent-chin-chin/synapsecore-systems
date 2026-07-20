import SolutionsOverview from "@/components/homepage/SolutionsOverview";
import ScrollReveal from "@/components/ui/scroll-reveal";

export const metadata = {
  title: "Solutions — SynapseCore",
  description: "Business outcomes and solution patterns for automation, cyber defense, and scalable infrastructure.",
};

export default function SolutionsPage() {
  return (
    <main className="min-h-screen bg-[#070B14] text-white">
      <ScrollReveal direction="up" delay={0}>
        <SolutionsOverview />
      </ScrollReveal>
    </main>
  );
}
