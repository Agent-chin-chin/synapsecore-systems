import FAQ from "@/components/faq";
import ScrollReveal from "@/components/ui/scroll-reveal";

export default function FAQPage() {
  return (
    <div className="min-h-screen">
      <ScrollReveal direction="up" delay={0}>
        <FAQ />
      </ScrollReveal>
    </div>
  );
}
