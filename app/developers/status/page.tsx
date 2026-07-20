export const metadata = {
  title: "System Status | SynapseCore",
  description: "Real-time SynapseCore system status and uptime information.",
};

import StatusPageClient from './page-client';

export default function StatusPage() {
  return <StatusPageClient />;
}
