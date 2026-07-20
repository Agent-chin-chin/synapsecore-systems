#!/usr/bin/env node

/**
 * SynapseCore Page Structure Restructure Script
 * Creates new directory structure and moves pages
 * Run with: node scripts/migrate-structure.js
 */

const fs = require("fs");
const path = require("path");

const appDir = path.join(__dirname, "..", "app");

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✓ Created directory: ${dirPath}`);
  }
}

function createFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`✓ Created file: ${filePath}`);
  }
}

console.log("🚀 Starting SynapseCore page structure migration...\n");

// Create directory structure
const dirs = [
  path.join(appDir, "developers"),
  path.join(appDir, "developers", "api"),
  path.join(appDir, "developers", "webhooks"),
  path.join(appDir, "resources"),
  path.join(appDir, "resources", "blog"),
  path.join(appDir, "resources", "whitepapers"),
];

dirs.forEach((dir) => ensureDir(dir));

console.log("\n✓ Directory structure created\n");

// Create layout files
const developersLayout = `import type { Metadata } from "next";

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
`;

const resourcesLayout = `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources | SynapseCore Systems",
  description: "Knowledge hub featuring blog articles, whitepapers, threat intelligence, and security resources",
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
`;

const servicesLayout = `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | SynapseCore Systems",
  description: "Professional cybersecurity services including bug fixing, malware removal, incident response, and security audits",
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
`;

createFile(path.join(appDir, "developers", "layout.tsx"), developersLayout);
createFile(path.join(appDir, "resources", "layout.tsx"), resourcesLayout);
createFile(path.join(appDir, "services", "layout.tsx"), servicesLayout);

console.log("\n✓ Layout files created\n");

// Create page files
const developersPage = `import Link from 'next/link';

export default function DevelopersPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-6">Developer Portal</h1>
        <p className="text-lg text-gray-400 mb-8">
          Integrate SynapseCore's powerful cybersecurity APIs and webhooks into your applications.
        </p>
        <div className="grid gap-6">
          <Link href="/developers/api" className="p-6 border border-gray-700 rounded-lg hover:border-blue-500 transition">
            <h3 className="text-xl font-semibold mb-2">API Documentation</h3>
            <p className="text-gray-400">Complete API reference and integration guide</p>
          </Link>
          <Link href="/developers/webhooks" className="p-6 border border-gray-700 rounded-lg hover:border-blue-500 transition">
            <h3 className="text-xl font-semibold mb-2">Webhooks</h3>
            <p className="text-gray-400">Real-time event notifications and callbacks</p>
          </Link>
          <Link href="/integrations" className="p-6 border border-gray-700 rounded-lg hover:border-blue-500 transition">
            <h3 className="text-xl font-semibold mb-2">Integrations</h3>
            <p className="text-gray-400">Pre-built connectors for popular tools</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
`;

const resourcesPage = `import Link from 'next/link';

export default function ResourcesPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-6">Resources & Knowledge Base</h1>
        <p className="text-lg text-gray-400 mb-8">
          Learn from our security experts and stay informed about the latest threats and best practices.
        </p>
        <div className="grid gap-6">
          <Link href="/resources/blog" className="p-6 border border-gray-700 rounded-lg hover:border-blue-500 transition">
            <h3 className="text-xl font-semibold mb-2">Blog</h3>
            <p className="text-gray-400">Articles, guides, and industry insights</p>
          </Link>
          <Link href="/resources/whitepapers" className="p-6 border border-gray-700 rounded-lg hover:border-blue-500 transition">
            <h3 className="text-xl font-semibold mb-2">Whitepapers</h3>
            <p className="text-gray-400">In-depth technical documentation</p>
          </Link>
          <Link href="/threat-feed" className="p-6 border border-gray-700 rounded-lg hover:border-blue-500 transition">
            <h3 className="text-xl font-semibold mb-2">Threat Intelligence</h3>
            <p className="text-gray-400">Real-time threat feed and analytics</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
`;

const apiDocsPage = `export default function APIDocsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">API Documentation</h1>
      <p className="text-gray-400">Complete API reference and integration guide will be available here.</p>
    </div>
  );
}
`;

const webhooksPage = `export default function WebhooksPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Webhooks</h1>
      <p className="text-gray-400">Real-time event notifications and callback documentation will be available here.</p>
    </div>
  );
}
`;

createFile(path.join(appDir, "developers", "page.tsx"), developersPage);
createFile(path.join(appDir, "developers", "api", "page.tsx"), apiDocsPage);
createFile(
  path.join(appDir, "developers", "webhooks", "page.tsx"),
  webhooksPage,
);
createFile(path.join(appDir, "resources", "page.tsx"), resourcesPage);

console.log("\n✓ Page files created\n");

console.log("✅ Migration complete! New structure:");
console.log("   /developers");
console.log("   /developers/api");
console.log("   /developers/webhooks");
console.log("   /resources");
console.log("   /resources/blog (existing)");
console.log("   /resources/whitepapers");
console.log("\nNext steps:");
console.log("1. Update navigation components with new routes");
console.log("2. Set up 301 redirects for old URLs");
console.log("3. Test all routes");
