import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developers | SynapseCore Systems",
  description: "API documentation, webhook guides, and integration resources for developers",
};

export default function DevelopersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
