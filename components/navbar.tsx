"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import ThemeToggle from "@/components/theme-toggle";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <Image
                src="/logo.png"
                alt="SynapseCore Systems Logo"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
              />
              <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
                SYNAPSECORE
              </div>
            </Link>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-1">
            <Link
              href="/"
              className="px-3 py-2 text-gray-300 hover:text-green-400 transition-colors font-medium rounded"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="px-3 py-2 text-gray-300 hover:text-green-400 transition-colors font-medium rounded"
            >
              About
            </Link>

            {/* Services Dropdown */}
            <div className="relative group">
              <button className="px-3 py-2 text-gray-300 hover:text-green-400 transition-colors font-medium rounded flex items-center gap-1">
                Services
                <span className="text-xs">▼</span>
              </button>
              <div className="absolute left-0 mt-0 w-48 bg-gray-800/90 backdrop-blur-md border border-green-400/30 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <Link
                  href="/services"
                  className="block px-4 py-2 text-gray-300 hover:text-green-400 hover:bg-gray-700/50"
                >
                  All Services
                </Link>
                <Link
                  href="/services/web-dev"
                  className="block px-4 py-2 text-gray-300 hover:text-green-400 hover:bg-gray-700/50"
                >
                  Website Development
                </Link>
                <Link
                  href="/services/bug-fixing"
                  className="block px-4 py-2 text-gray-300 hover:text-green-400 hover:bg-gray-700/50"
                >
                  Bug Fixing & Support
                </Link>
                <Link
                  href="/services/team-training"
                  className="block px-4 py-2 text-gray-300 hover:text-green-400 hover:bg-gray-700/50"
                >
                  Team Training
                </Link>
              </div>
            </div>

            {/* Resources Dropdown */}
            <div className="relative group">
              <button className="px-3 py-2 text-gray-300 hover:text-green-400 transition-colors font-medium rounded flex items-center gap-1">
                Resources
                <span className="text-xs">▼</span>
              </button>
              <div className="absolute left-0 mt-0 w-48 bg-gray-800/90 backdrop-blur-md border border-green-400/30 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <Link
                  href="/resources"
                  className="block px-4 py-2 text-gray-300 hover:text-green-400 hover:bg-gray-700/50"
                >
                  Resources Hub
                </Link>
                <Link
                  href="/blog"
                  className="block px-4 py-2 text-gray-300 hover:text-green-400 hover:bg-gray-700/50"
                >
                  Blog
                </Link>
                <Link
                  href="/faq"
                  className="block px-4 py-2 text-gray-300 hover:text-green-400 hover:bg-gray-700/50"
                >
                  FAQ
                </Link>
                <Link
                  href="/threat-feed"
                  className="block px-4 py-2 text-gray-300 hover:text-green-400 hover:bg-gray-700/50"
                >
                  Threat Feed
                </Link>
              </div>
            </div>

            {/* Developers Dropdown */}
            <div className="relative group">
              <button className="px-3 py-2 text-gray-300 hover:text-green-400 transition-colors font-medium rounded flex items-center gap-1">
                Developers
                <span className="text-xs">▼</span>
              </button>
              <div className="absolute left-0 mt-0 w-48 bg-gray-800/90 backdrop-blur-md border border-green-400/30 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <Link
                  href="/developers"
                  className="block px-4 py-2 text-gray-300 hover:text-green-400 hover:bg-gray-700/50"
                >
                  Developer Hub
                </Link>
                <Link
                  href="/developers/api"
                  className="block px-4 py-2 text-gray-300 hover:text-green-400 hover:bg-gray-700/50"
                >
                  API Docs
                </Link>
                <Link
                  href="/webhooks"
                  className="block px-4 py-2 text-gray-300 hover:text-green-400 hover:bg-gray-700/50"
                >
                  Webhooks
                </Link>
                <Link
                  href="/integrations"
                  className="block px-4 py-2 text-gray-300 hover:text-green-400 hover:bg-gray-700/50"
                >
                  Integrations
                </Link>
              </div>
            </div>

            <Link
              href="/pricing"
              className="px-3 py-2 text-gray-300 hover:text-green-400 transition-colors font-medium rounded"
            >
              Pricing
            </Link>
            <Link
              href="/contact"
              className="px-3 py-2 text-gray-300 hover:text-green-400 transition-colors font-medium rounded"
            >
              Contact
            </Link>
            <Link
              href="/learner/login"
              className="px-3 py-2 text-green-400 hover:text-green-300 transition-colors font-medium rounded"
            >
              Learner Portal
            </Link>
            <Link
              href="/login"
              className="px-3 py-2 text-gray-300 hover:text-green-400 transition-colors font-medium rounded"
            >
              Client Login
            </Link>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-green-400 transition-colors"
            >
              {isMenuOpen ? "✕" : "☰"}
            </button>
          </div>
          {/* Theme Toggle */}
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={isMenuOpen ? "md:hidden block" : "hidden"}>
          <div className="pt-2 pb-3 space-y-1 border-t border-green-400/30">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-green-400 hover:bg-gray-800 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-green-400 hover:bg-gray-800 transition-colors"
            >
              About
            </Link>

            {/* Mobile Services Dropdown */}
            <div>
              <button
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === "services" ? null : "services",
                  )
                }
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-green-400 hover:bg-gray-800 transition-colors flex justify-between items-center"
              >
                Services{" "}
                <span
                  className={`text-xs transition-transform ${openDropdown === "services" ? "rotate-180" : ""}`}
                >
                  ▼
                </span>
              </button>
              {openDropdown === "services" && (
                <div className="pl-4 space-y-1">
                  <Link
                    href="/services"
                    className="block px-3 py-2 text-sm text-gray-300 hover:text-green-400"
                  >
                    All Services
                  </Link>
                  <Link
                    href="/services/web-dev"
                    className="block px-3 py-2 text-sm text-gray-300 hover:text-green-400"
                  >
                    Website Development
                  </Link>
                  <Link
                    href="/services/bug-fixing"
                    className="block px-3 py-2 text-sm text-gray-300 hover:text-green-400"
                  >
                    Bug Fixing
                  </Link>
                  <Link
                    href="/services/team-training"
                    className="block px-3 py-2 text-sm text-gray-300 hover:text-green-400"
                  >
                    Team Training
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Resources Dropdown */}
            <div>
              <button
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === "resources" ? null : "resources",
                  )
                }
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-green-400 hover:bg-gray-800 transition-colors flex justify-between items-center"
              >
                Resources{" "}
                <span
                  className={`text-xs transition-transform ${openDropdown === "resources" ? "rotate-180" : ""}`}
                >
                  ▼
                </span>
              </button>
              {openDropdown === "resources" && (
                <div className="pl-4 space-y-1">
                  <Link
                    href="/blog"
                    className="block px-3 py-2 text-sm text-gray-300 hover:text-green-400"
                  >
                    Blog
                  </Link>
                  <Link
                    href="/faq"
                    className="block px-3 py-2 text-sm text-gray-300 hover:text-green-400"
                  >
                    FAQ
                  </Link>
                  <Link
                    href="/threat-feed"
                    className="block px-3 py-2 text-sm text-gray-300 hover:text-green-400"
                  >
                    Threat Feed
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Developers Dropdown */}
            <div>
              <button
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === "developers" ? null : "developers",
                  )
                }
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-green-400 hover:bg-gray-800 transition-colors flex justify-between items-center"
              >
                Developers{" "}
                <span
                  className={`text-xs transition-transform ${openDropdown === "developers" ? "rotate-180" : ""}`}
                >
                  ▼
                </span>
              </button>
              {openDropdown === "developers" && (
                <div className="pl-4 space-y-1">
                  <Link
                    href="/developers/api"
                    className="block px-3 py-2 text-sm text-gray-300 hover:text-green-400"
                  >
                    API Docs
                  </Link>
                  <Link
                    href="/webhooks"
                    className="block px-3 py-2 text-sm text-gray-300 hover:text-green-400"
                  >
                    Webhooks
                  </Link>
                  <Link
                    href="/integrations"
                    className="block px-3 py-2 text-sm text-gray-300 hover:text-green-400"
                  >
                    Integrations
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/pricing"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-green-400 hover:bg-gray-800 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-green-400 hover:bg-gray-800 transition-colors"
            >
              Contact
            </Link>
            {/* Theme Toggle in Mobile Menu */}
            <div className="pt-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
