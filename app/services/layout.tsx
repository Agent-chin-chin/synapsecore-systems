import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | SynapseCore Systems",
  description:
    "Professional cybersecurity services including bug fixing, malware removal, incident response, and security audits",
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
