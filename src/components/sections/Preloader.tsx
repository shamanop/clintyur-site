"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const text = "CLINTYUR";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*";
    const el = textRef.current;
    if (!el) return;

    let iteration = 0;
    const scrambleInterval = setInterval(() => {
      el.textContent = text
        .split("")
        .map((char, index) => {
          if (index < iteration) return text[index];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      if (iteration >= text.length) {
        clearInterval(scrambleInterval);

        const tl = gsap.timeline({
          onComplete: () => {
            setIsComplete(true);
            document.body.style.overflow = "";
            window.dispatchEvent(new CustomEvent("preloader:complete"));
          },
        });

        tl.to(el, { scale: 1.1, duration: 0.3, ease: "power2.in" })
          .to(el, {
            opacity: 0,
            scale: 0.95,
            duration: 0.4,
            ease: "power2.inOut",
          })
          .to(containerRef.current, {
            yPercent: -100,
            duration: 0.8,
            ease: "power4.inOut",
          });
      }

      iteration += 1 / 3;
    }, 50);

    return () => clearInterval(scrambleInterval);
  }, []);

  if (isComplete) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0A0A0A]"
    >
      <span
        ref={textRef}
        className="text-[clamp(3rem,12vw,10rem)] font-bold text-text-primary tracking-widest"
        style={{ fontFamily: "var(--font-display)" }}
      >
        CLINTYUR
      </span>
    </div>
  );
}
