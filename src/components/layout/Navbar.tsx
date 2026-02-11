"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onPreloaderDone = () => setVisible(true);
    window.addEventListener("preloader:complete", onPreloaderDone);

    const onScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("preloader:complete", onPreloaderDone);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          "flex items-center justify-between px-6 md:px-12 h-16",
          visible
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0",
          scrolled
            ? "bg-[#0A0A0A]/80 backdrop-blur-md border-b border-[#1F1F1F]"
            : "bg-transparent"
        )}
      >
        <a
          href="#hero"
          className="font-[var(--font-display)] text-xl font-bold tracking-wider text-text-primary hover:text-amber transition-colors"
          style={{ fontFamily: "var(--font-display)" }}
        >
          CLINTYUR
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-text-secondary hover:text-amber transition-colors tracking-wide uppercase"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-text-primary z-60"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile overlay menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-lg flex flex-col items-center justify-center gap-8 transition-all duration-500",
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="text-3xl font-bold text-text-primary hover:text-amber transition-colors tracking-wider uppercase"
            style={{ fontFamily: "var(--font-display)" }}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </div>
    </>
  );
}
