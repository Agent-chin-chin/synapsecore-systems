import type { Metadata } from "next";
import NavbarWrapper from "@/components/navbar-wrapper";
import Footer from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://synapsecoresystems.com"),
  title: "SynapseCore Systems - AI Automation & Cybersecurity Solutions",
  description: "Reduce security incidents by 73% with AI-powered defense. Enterprise cybersecurity, web development, and training for modern businesses.",
  keywords: ["cybersecurity", "AI automation", "enterprise security", "incident response", "security training"],
  alternates: {
    canonical: "https://synapsecoresystems.com",
  },
  openGraph: {
    title: "SynapseCore Systems - Enterprise Cybersecurity",
    description: "Reduce security incidents by 73% with AI-powered defense.",
    type: "website",
    url: "https://synapsecoresystems.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "SynapseCore Systems",
            "url": "https://synapsecore.com",
            "logo": "https://synapsecore.com/logo.png",
            "description": "Enterprise cybersecurity and AI automation solutions",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "NG"
            }
          })
        }} />
      </head>
      <body className="min-h-full flex flex-col bg-black text-white font-sans pt-16">
        <NavbarWrapper />
        {children}
        <Footer />
      </body>
    </html>
  );
}
