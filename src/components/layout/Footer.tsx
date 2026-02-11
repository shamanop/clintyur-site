"use client";

import { SOCIAL_LINKS, SITE_CONFIG } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="relative border-t border-[#1F1F1F] bg-[#0A0A0A] py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div>
          <h3
            className="text-2xl font-bold text-text-primary mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            CLINTYUR
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            {SITE_CONFIG.description}
          </p>
        </div>

        {/* Socials */}
        <div>
          <h4
            className="text-sm uppercase tracking-[0.3em] text-text-muted mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Follow
          </h4>
          <div className="flex flex-col gap-3">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-amber transition-colors text-sm"
              >
                {link.platform} &middot; {link.handle}
              </a>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4
            className="text-sm uppercase tracking-[0.3em] text-text-muted mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Contact
          </h4>
          <a
            href="mailto:hello@clintyur.com"
            className="text-text-secondary hover:text-amber transition-colors text-sm"
          >
            hello@clintyur.com
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[#1F1F1F] flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-text-muted text-xs">
          &copy; {new Date().getFullYear()} Clintyur. All rights reserved.
        </p>
        <p
          className="text-text-muted text-xs tracking-wider"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Cook different.
        </p>
      </div>
    </footer>
  );
}
