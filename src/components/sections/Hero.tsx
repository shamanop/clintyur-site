"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import SmokeParticles from "@/components/effects/SmokeParticles";
import HeroPan from "@/components/effects/HeroPan";
import ScrollIndicator from "@/components/effects/ScrollIndicator";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!headingRef.current || !taglineRef.current) return;

    const onReady = () => {
      // Animate heading characters
      const heading = headingRef.current!;
      const text = heading.textContent || "";
      heading.innerHTML = text
        .split("")
        .map((char) => `<span class="inline-block">${char}</span>`)
        .join("");

      const chars = heading.querySelectorAll("span");

      const tl = gsap.timeline({ delay: 0.2 });

      tl.from(chars, {
        opacity: 0,
        y: 80,
        rotateX: -90,
        stagger: 0.04,
        duration: 0.8,
        ease: "back.out(1.7)",
      });

      // Animate tagline
      tl.from(
        taglineRef.current!,
        {
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.3"
      );

      // Parallax on scroll
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          if (headingRef.current) {
            gsap.set(headingRef.current, { y: self.progress * -150 });
          }
          if (taglineRef.current) {
            gsap.set(taglineRef.current, { y: self.progress * -80 });
          }
        },
      });
    };

    window.addEventListener("preloader:complete", onReady);
    return () => window.removeEventListener("preloader:complete", onReady);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-40"
        poster="/images/clintyur-portrait.jpg"
      >
        <source src="/videos/hero-loop.mp4" type="video/mp4" />
      </video>

      {/* Dark gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/60 via-[#0A0A0A]/40 to-[#0A0A0A] z-[1]" />

      {/* Smoke particles */}
      <SmokeParticles />

      {/* Interactive pan (z-15, between smoke and content) */}
      <HeroPan />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-6">
        <h1
          ref={headingRef}
          className="text-[clamp(3rem,8vw,8rem)] font-bold text-text-primary leading-none tracking-tight"
          style={{
            fontFamily: "var(--font-display)",
            perspective: "600px",
          }}
        >
          CLINTYUR
        </h1>
        <p
          ref={taglineRef}
          className="mt-6 text-[clamp(1.5rem,3vw,2rem)] text-amber tracking-wide"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Cook different.
        </p>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator />

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent z-20" />
    </section>
  );
}
