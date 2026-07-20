import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources | SynapseCore Systems",
  description:
    "Knowledge hub featuring blog articles, whitepapers, threat intelligence, and security resources",
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
