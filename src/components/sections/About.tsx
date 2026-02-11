"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { timelineMilestones } from "@/data/timeline";
import ParallaxImage from "@/components/effects/ParallaxImage";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Animate timeline line drawing
      const line = sectionRef.current?.querySelector(
        ".timeline-line"
      ) as HTMLElement;
      if (line) {
        gsap.from(line, {
          scaleY: 0,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "bottom 80%",
            scrub: true,
          },
        });
      }

      // Animate milestones
      const milestones = gsap.utils.toArray<HTMLElement>(".milestone-item");
      milestones.forEach((milestone, i) => {
        const isLeft = i % 2 === 0;
        gsap.from(milestone, {
          scrollTrigger: {
            trigger: milestone,
            start: "top 85%",
            end: "top 50%",
            scrub: 1,
          },
          opacity: 0,
          x: isLeft ? -60 : 60,
          duration: 1,
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-[var(--spacing-section)] px-6 md:px-12"
    >
      {/* Section header */}
      <div className="text-center mb-20">
        <p className="text-burnt-orange uppercase tracking-[0.3em] text-sm mb-4">
          The Journey
        </p>
        <h2
          className="text-[clamp(2rem,4vw,3.5rem)] font-bold text-text-primary"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Every Chef Has a Story
        </h2>
      </div>

      {/* Timeline */}
      <div className="relative max-w-5xl mx-auto">
        {/* Vertical line */}
        <div className="timeline-line absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-amber via-burnt-orange to-deep-red" />

        {timelineMilestones.map((milestone, index) => {
          const isLeft = index % 2 === 0;

          return (
            <div
              key={milestone.id}
              className={`milestone-item relative flex flex-col md:flex-row items-start md:items-center mb-24 last:mb-0 ${
                !isLeft ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Center dot */}
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber border-4 border-[#0A0A0A] z-10" />

              {/* Content side */}
              <div
                className={`w-full md:w-1/2 pl-12 md:pl-0 ${
                  isLeft
                    ? "md:pr-12 md:text-right"
                    : "md:pl-12 md:text-left"
                }`}
              >
                <span
                  className="text-amber text-lg font-bold"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {milestone.year}
                </span>
                <h3
                  className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-text-primary mt-2 mb-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {milestone.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {milestone.description}
                </p>
              </div>

              {/* Image side */}
              <div
                className={`w-full md:w-1/2 mt-6 md:mt-0 pl-12 md:pl-0 ${
                  isLeft ? "md:pl-12" : "md:pr-12"
                }`}
              >
                <ParallaxImage
                  src={milestone.image}
                  alt={milestone.title}
                  className="rounded-xl h-64 md:h-80"
                  speed={0.3}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
