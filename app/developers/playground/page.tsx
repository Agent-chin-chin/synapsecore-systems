export const metadata = {
  title: "API Playground | SynapseCore",
  description: "Interactive API playground to test SynapseCore endpoints in real-time.",
};

import PlaygroundPageClient from './page-client';

export default function Page() {
  return <PlaygroundPageClient />;
}
