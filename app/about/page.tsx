import TeamSection from "@/components/team-section";
import MissionSection from "@/components/mission-section";
import VisionSection from "@/components/vision-section";
import ScrollReveal from "@/components/ui/scroll-reveal";

export default function About() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      <ScrollReveal direction="up" delay={0}>
        <MissionSection />
      </ScrollReveal>
      <ScrollReveal direction="up" delay={0.15}>
        <TeamSection />
      </ScrollReveal>
      <ScrollReveal direction="up" delay={0.3}>
        <VisionSection />
      </ScrollReveal>
    </div>
  );
}