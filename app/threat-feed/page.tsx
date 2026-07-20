export const metadata = {
  title: "Threat Feed | SynapseCore",
  description: "Live cybersecurity threat intelligence feed with latest vulnerabilities, exploits, and security alerts.",
};

import ThreatFeedPageClient from './page-client';

export default function Page() {
  return <ThreatFeedPageClient />;
}
