"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { SOCIAL_LINKS } from "@/lib/constants";

const socialPosts = [
  {
    id: "1",
    platform: "instagram" as const,
    imageUrl: "/images/recipes/jerk-chicken.jpg",
    postUrl: "https://instagram.com/clintyur",
    caption: "Jerk chicken hits different at midnight",
  },
  {
    id: "2",
    platform: "tiktok" as const,
    imageUrl: "/images/recipes/smoked-brisket.jpg",
    postUrl: "https://tiktok.com/@clintyur",
    caption: "12 hour brisket timelapse",
  },
  {
    id: "3",
    platform: "instagram" as const,
    imageUrl: "/images/recipes/lobster-mac.jpg",
    postUrl: "https://instagram.com/clintyur",
    caption: "Lobster mac for the culture",
  },
  {
    id: "4",
    platform: "instagram" as const,
    imageUrl: "/images/recipes/truffle-ramen.jpg",
    postUrl: "https://instagram.com/clintyur",
    caption: "When east meets heat",
  },
  {
    id: "5",
    platform: "tiktok" as const,
    imageUrl: "/images/timeline/milestone-2.jpg",
    postUrl: "https://tiktok.com/@clintyur",
    caption: "POV: You hired a private chef",
  },
  {
    id: "6",
    platform: "instagram" as const,
    imageUrl: "/images/timeline/milestone-3.jpg",
    postUrl: "https://instagram.com/clintyur",
    caption: "Behind the scenes",
  },
];

export default function SocialFeed() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>(".social-item");
      items.forEach((item, i) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: "top 90%",
          },
          opacity: 0,
          scale: 0.9,
          duration: 0.6,
          delay: i * 0.1,
          ease: "power3.out",
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="social"
      className="relative py-[var(--spacing-section)] px-6 md:px-12"
    >
      <div className="text-center mb-16">
        <p className="text-flame uppercase tracking-[0.3em] text-sm mb-4">
          @clintyur
        </p>
        <h2
          className="text-[clamp(2rem,4vw,3.5rem)] font-bold text-text-primary mb-6"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Follow the Heat
        </h2>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
        {socialPosts.map((post) => (
          <a
            key={post.id}
            href={post.postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="social-item group relative overflow-hidden rounded-lg aspect-square"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.imageUrl}
              alt={post.caption}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.background =
                  "linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 50%, #1A1A1A 100%)";
              }}
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-[#0A0A0A]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
              <p className="text-text-primary text-sm text-center">
                {post.caption}
              </p>
            </div>
            {/* Platform badge */}
            <div className="absolute top-3 right-3 bg-[#0A0A0A]/50 backdrop-blur-sm rounded-full px-2 py-1">
              <span className="text-text-primary text-xs font-medium">
                {post.platform === "instagram" ? "IG" : "TT"}
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* Social links */}
      <div className="flex justify-center gap-6 mt-12">
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.platform}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-amber transition-colors text-sm"
          >
            {link.platform}
          </a>
        ))}
      </div>
    </section>
  );
}
