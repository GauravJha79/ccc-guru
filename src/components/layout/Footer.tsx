"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Mail, ExternalLink } from "lucide-react";

const FOOTER_LINKS = {
  Platform: [
    { href: "/tests", label: "CCC Online Test" },
    { href: "/notes", label: "Study Notes" },
    { href: "/blogs", label: "Blogs" },
    { href: "/books", label: "Books" },
    { href: "/chapters", label: "Chapters" },
  ],
  "CCC Exam": [
    { href: "/ccc-syllabus", label: "CCC Syllabus" },
    { href: "/blogs", label: "Exam Tips" },
    { href: "/tests", label: "Online Mock Tests" },
  ],
  Company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

export function Footer() {
  const pathname = usePathname();
  const year = new Date().getFullYear();

  // Hide Footer completely on exam interface pages
  const isExamPage = pathname?.includes("/exam");
  if (isExamPage) {
    return null;
  }

  return (
    <footer className="border-t border-border bg-bg-subtle mt-16 pt-10">
      <div className="container-page py-12">
        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6610f2] to-[#1a8fe3] flex items-center justify-center shadow-sm">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-text-primary">
                CCC <span className="gradient-text">Guru</span>
              </span>
            </Link>
            <p className="text-sm text-text-muted leading-relaxed mb-4">
              India's trusted platform for NIELIT CCC exam preparation. Free
              mock tests, notes, and expert resources.
            </p>
            <a
              href="mailto:hello@cccguru.in"
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary-600 transition-colors"
            >
              <Mail className="w-4 h-4" />
              hello@cccguru.in
            </a>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-sm text-text-primary mb-3">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-text-muted hover:text-primary-600 transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-text-muted text-center sm:text-left">
            © {year} CCC Guru. All rights reserved. Not affiliated with NIELIT.
          </p>
          <p className="text-xs text-text-muted">
            Built for NIELIT CCC candidates across India 🇮🇳
          </p>
        </div>
      </div>
    </footer>
  );
}
