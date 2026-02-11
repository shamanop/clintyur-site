"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsDesktop } from "@/hooks/useMediaQuery";

function PanWithEgg({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Pan handle */}
      <rect
        x="44"
        y="28"
        width="20"
        height="6"
        rx="3"
        fill="#5C5C5C"
        transform="rotate(0)"
      />
      {/* Handle rivet */}
      <circle cx="46" cy="31" r="2" fill="#3A3A3A" />
      {/* Pan body */}
      <ellipse cx="28" cy="32" rx="24" ry="20" fill="#2A2A2A" />
      <ellipse cx="28" cy="32" rx="22" ry="18" fill="#333333" />
      {/* Pan inner surface */}
      <ellipse cx="28" cy="32" rx="19" ry="15" fill="#1A1A1A" />
      {/* Pan rim highlight */}
      <ellipse
        cx="28"
        cy="32"
        rx="22"
        ry="18"
        fill="none"
        stroke="#4A4A4A"
        strokeWidth="0.5"
      />
      {/* Egg white - irregular blob shape */}
      <path
        d="M20 28 C16 24, 12 26, 14 32 C12 36, 18 42, 24 40 C30 44, 38 40, 40 34 C42 28, 38 24, 34 26 C30 22, 24 22, 20 28Z"
        fill="#F5F0E8"
        opacity="0.95"
      />
      {/* Egg white edge highlight */}
      <path
        d="M20 28 C16 24, 12 26, 14 32 C12 36, 18 42, 24 40 C30 44, 38 40, 40 34 C42 28, 38 24, 34 26 C30 22, 24 22, 20 28Z"
        fill="none"
        stroke="#E8E0D0"
        strokeWidth="0.3"
      />
      {/* Egg yolk */}
      <ellipse cx="27" cy="32" rx="7" ry="6.5" fill="#F59E0B" />
      {/* Yolk highlight */}
      <ellipse cx="25" cy="30" rx="3" ry="2.5" fill="#FBBF24" opacity="0.6" />
      {/* Tiny yolk shine */}
      <ellipse cx="24" cy="29" rx="1.2" ry="1" fill="#FDE68A" opacity="0.5" />
    </svg>
  );
}

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  const rotationRef = useRef(0);
  const prevXRef = useRef(0);

  useEffect(() => {
    if (!isDesktop) return;
    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMouseMove = (e: MouseEvent) => {
      // Calculate rotation based on horizontal movement
      const deltaX = e.clientX - prevXRef.current;
      prevXRef.current = e.clientX;

      // Tilt the pan in the direction of movement
      const targetRotation = Math.max(-25, Math.min(25, deltaX * 2));
      rotationRef.current += (targetRotation - rotationRef.current) * 0.3;

      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        rotation: rotationRef.current,
        duration: 0.15,
        ease: "power2.out",
      });
    };

    const onMouseDown = () => {
      gsap.to(cursor, {
        scale: 0.85,
        duration: 0.12,
        ease: "power2.out",
      });
    };

    const onMouseUp = () => {
      gsap.to(cursor, {
        scale: 1,
        duration: 0.15,
        ease: "back.out(1.7)",
      });
    };

    const onMouseEnterInteractive = () => {
      gsap.to(cursor, {
        scale: 1.3,
        duration: 0.25,
        ease: "back.out(1.7)",
      });
    };

    const onMouseLeaveInteractive = () => {
      gsap.to(cursor, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      });
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);

    const interactiveElements = document.querySelectorAll(
      'a, button, input, textarea, select, [role="button"]'
    );
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", onMouseEnterInteractive);
      el.addEventListener("mouseleave", onMouseLeaveInteractive);
    });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnterInteractive);
        el.removeEventListener("mouseleave", onMouseLeaveInteractive);
      });
    };
  }, [isDesktop]);

  if (!isDesktop) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          marginLeft: "-20px",
          marginTop: "-20px",
          filter: "drop-shadow(0 2px 8px rgba(245, 158, 11, 0.3))",
        }}
      >
        <PanWithEgg size={40} />
      </div>
      <style jsx global>{`
        @media (min-width: 1024px) {
          * {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
}
