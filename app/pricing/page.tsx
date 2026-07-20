import PricingPlans from "@/components/pricing-plans";
import CTA from "@/components/cta";
import ScrollReveal from "@/components/ui/scroll-reveal";

export default function Pricing() {
  return (
    <div className="min-h-[calc(100vh-64px)] py-12">
      <ScrollReveal direction="up" delay={0}>
        <PricingPlans />
      </ScrollReveal>
      <ScrollReveal direction="up" delay={0.2}>
        <CTA />
      </ScrollReveal>
    </div>
  );
}