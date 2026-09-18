"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, Search, X, BookOpen, Smartphone } from "lucide-react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { MobileDrawer } from "./MobileDrawer";
import { SearchModal } from "./SearchModal";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/tests", label: "Online Tests" },
  { href: "/notes", label: "Notes" },
  { href: "/blogs", label: "Blogs" },
  { href: "/books", label: "Books" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close drawer on navigation
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Hide Navbar completely on exam interface pages
  const isExamPage = pathname?.includes("/exam");
  if (isExamPage) {
    return null;
  }

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-40 transition-all duration-300
          ${
            scrolled
              ? "bg-surface/95 backdrop-blur-md border-b border-border shadow-card"
              : "bg-surface border-b border-border-subtle"
          }
        `}
      >
        <div className="container-page">
          <div className="flex items-center h-16 gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 shrink-0"
              aria-label="CCC Guru Home"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6610f2] to-[#1a8fe3] flex items-center justify-center shadow-sm">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-text-primary">
                CCC <span className="gradient-text">Guru</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav
              className="hidden lg:flex items-center gap-6 ml-4"
              aria-label="Main navigation"
            >
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`nav-link ${pathname === href || (href !== "/" && pathname.startsWith(href)) ? "active" : ""}`}
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/ccc-syllabus"
                className={`nav-link ${pathname === "/ccc-syllabus" ? "active" : ""}`}
              >
                Syllabus
              </Link>
            </nav>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="btn-ghost"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
                <span className="text-xs text-text-muted border border-border rounded px-1.5 py-0.5">
                  ⌘K
                </span>
              </button>
              <ThemeSwitcher />
              <Link href="/download" className="btn-primary text-sm ml-2">
                <Smartphone className="w-4 h-4" />
                Download App
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="btn-ghost p-2"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <ThemeSwitcher />
              <button
                onClick={() => setDrawerOpen(true)}
                className="btn-ghost p-2"
                aria-label="Open menu"
                aria-expanded={drawerOpen}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16" aria-hidden="true" />

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        pathname={pathname}
      />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
