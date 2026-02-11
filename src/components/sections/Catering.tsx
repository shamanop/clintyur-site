"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import CateringForm from "@/components/forms/CateringForm";

export default function Catering() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".catering-content", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
        opacity: 0,
        y: 60,
        duration: 1,
        ease: "power3.out",
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="catering"
      className="relative py-[var(--spacing-section)] px-6 md:px-12 overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="catering-content relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-deep-red uppercase tracking-[0.3em] text-sm mb-4">
            Private Chef
          </p>
          <h2
            className="text-[clamp(2rem,4vw,3.5rem)] font-bold text-text-primary mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Let Clintyur Cook For You
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto leading-relaxed">
            From intimate private dinners to full-scale events. Every plate is
            personal, every meal is an experience.
          </p>
        </div>

        <CateringForm />
      </div>
    </section>
  );
}
