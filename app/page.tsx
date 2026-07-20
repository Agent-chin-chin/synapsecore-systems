import CTASection from "@/components/homepage/CTASection";
import Hero from "@/components/homepage/Hero";
import MetricsBar from "@/components/homepage/MetricsBar";
import ServicesGrid from "@/components/homepage/ServicesGrid";
import SolutionsOverview from "@/components/homepage/SolutionsOverview";
import Testimonials from "@/components/homepage/Testimonials";
import TrainingPromo from "@/components/homepage/TrainingPromo";
import TrustStrip from "@/components/homepage/TrustStrip";
import LearnerEnrollmentPromo from "@/components/homepage/LearnerEnrollmentPromo";
import WebDevPromo from "@/components/homepage/WebDevPromo";
import SectionDivider from "@/components/ui/section-divider";

export const metadata = {
  title: "SynapseCore Systems - Enterprise AI Automation & Cybersecurity",
  description: "Build, secure, and scale with AI-powered automation, cybersecurity solutions, and enterprise training programs.",
  keywords: ["AI automation", "cybersecurity", "web development", "enterprise solutions", "technical training"],
  openGraph: {
    title: "SynapseCore Systems - Enterprise Solutions",
    description: "Build, secure, and scale with AI-powered automation and cybersecurity.",
    type: "website",
  },
};

export default function Home() {
  return (
    <main className="bg-[#070B14] text-white relative">
      {/* Global gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 -left-48 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-48 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <Hero />
      <TrustStrip />
      <SectionDivider />
      <ServicesGrid />
      <SolutionsOverview />
      <SectionDivider />
      <MetricsBar />
      <TrainingPromo />
      <LearnerEnrollmentPromo />
      <WebDevPromo />
      <SectionDivider />
      <Testimonials />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CTASection />
      </div>
    </main>
  );
}
