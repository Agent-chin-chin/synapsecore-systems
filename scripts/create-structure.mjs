#!/usr/bin/env node
/**
 * SynapseCore Structure Migration Helper
 * Creates all necessary files for the new structure
 * 
 * Usage: node scripts/create-structure.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appDir = path.join(__dirname, '..', 'app');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✓ mkdir ${dirPath.replace(appDir, 'app')}`);
  }
}

function createFile(filePath, content) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`✓ create ${filePath.replace(appDir, 'app')}`);
  } else {
    console.log(`ℹ skip ${filePath.replace(appDir, 'app')} (exists)`);
  }
}

console.log('🚀 Creating SynapseCore structure...\n');

// Developers section
ensureDir(path.join(appDir, 'developers'));
ensureDir(path.join(appDir, 'developers', 'api'));
ensureDir(path.join(appDir, 'developers', 'webhooks'));

createFile(path.join(appDir, 'developers', 'layout.tsx'), `import type { Metadata } from "next";

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
`);

createFile(path.join(appDir, 'developers', 'page.tsx'), `import Link from 'next/link';

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
`);

createFile(path.join(appDir, 'developers', 'api', 'page.tsx'), `export default function APIDocsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">API Documentation</h1>
      <p className="text-gray-400">Complete API reference and integration guide will be available here.</p>
    </div>
  );
}
`);

createFile(path.join(appDir, 'developers', 'webhooks', 'page.tsx'), `export default function WebhooksPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Webhooks</h1>
      <p className="text-gray-400">Real-time event notifications and callback documentation will be available here.</p>
    </div>
  );
}
`);

// Resources section
ensureDir(path.join(appDir, 'resources'));
ensureDir(path.join(appDir, 'resources', 'whitepapers'));

createFile(path.join(appDir, 'resources', 'layout.tsx'), `import type { Metadata } from "next";

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
`);

createFile(path.join(appDir, 'resources', 'page.tsx'), `import Link from 'next/link';

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
`);

createFile(path.join(appDir, 'resources', 'whitepapers', 'page.tsx'), `export default function WhitepapersPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Whitepapers</h1>
      <p className="text-gray-400">In-depth technical documentation and security research will be available here.</p>
    </div>
  );
}
`);

console.log('\n✅ Structure creation complete!');
console.log('\nNew routes available:');
console.log('  /developers');
console.log('  /developers/api');
console.log('  /developers/webhooks');
console.log('  /resources');
console.log('  /resources/whitepapers');
console.log('\nNext steps:');
console.log('1. Update navbar.tsx with new links');
console.log('2. Test routes in dev server');
console.log('3. Set up redirects for moved content');
