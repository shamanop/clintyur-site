"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsDesktop } from "@/hooks/useMediaQuery";

export default function CustomCursor() {
  const yolkRef = useRef<HTMLDivElement>(null);
  const whiteRef = useRef<HTMLDivElement>(null);
  const panRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  const angleRef = useRef(0);
  const prevPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!isDesktop) return;
    const yolk = yolkRef.current;
    const white = whiteRef.current;
    const pan = panRef.current;
    const handle = handleRef.current;
    if (!yolk || !white || !pan || !handle) return;

    const onMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - prevPos.current.x;
      const dy = e.clientY - prevPos.current.y;
      prevPos.current = { x: e.clientX, y: e.clientY };

      // Calculate handle angle - points AWAY from movement direction
      const speed = Math.sqrt(dx * dx + dy * dy);
      if (speed > 2) {
        const moveAngle = Math.atan2(dy, dx) * (180 / Math.PI);
        // Handle points opposite to movement (trailing behind)
        angleRef.current = moveAngle + 180;
      }

      // Egg yolk - follows mouse tightly
      gsap.to(yolk, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out",
      });

      // Egg white - follows just slightly behind yolk
      gsap.to(white, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: "power2.out",
      });

      // Pan ring - trails behind with satisfying delay
      gsap.to(pan, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: "power2.out",
      });

      // Handle rotates to trail behind movement
      gsap.to(handle, {
        rotation: angleRef.current,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    const onMouseDown = () => {
      gsap.to(pan, { scale: 0.8, duration: 0.15 });
      gsap.to(handle, { scale: 0.8, duration: 0.15 });
      gsap.to(white, { scale: 1.2, duration: 0.15 });
    };

    const onMouseUp = () => {
      gsap.to(pan, { scale: 1, duration: 0.15 });
      gsap.to(handle, { scale: 1, duration: 0.15 });
      gsap.to(white, { scale: 1, duration: 0.15 });
    };

    const onMouseEnterInteractive = () => {
      gsap.to(pan, { scale: 1.4, opacity: 0.6, duration: 0.2 });
      gsap.to(handle, { scale: 1.4, opacity: 0.6, duration: 0.2 });
      gsap.to(yolk, { scale: 0.6, duration: 0.2 });
      gsap.to(white, { scale: 0.8, duration: 0.2 });
    };

    const onMouseLeaveInteractive = () => {
      gsap.to(pan, { scale: 1, opacity: 1, duration: 0.2 });
      gsap.to(handle, { scale: 1, opacity: 1, duration: 0.2 });
      gsap.to(yolk, { scale: 1, duration: 0.2 });
      gsap.to(white, { scale: 1, duration: 0.2 });
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
      {/* Pan ring (trails behind like original ring) */}
      <div
        ref={panRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2"
      >
        <div
          className="w-10 h-10 rounded-full border-[2.5px] border-amber/80"
          style={{
            background:
              "radial-gradient(circle, rgba(26,26,26,0.6) 0%, rgba(26,26,26,0.3) 100%)",
            boxShadow:
              "0 0 12px rgba(245, 158, 11, 0.15), inset 0 0 8px rgba(245, 158, 11, 0.05)",
          }}
        />
      </div>

      {/* Handle (follows the pan ring, rotates to trail movement) */}
      <div
        ref={handleRef}
        className="fixed top-0 left-0 pointer-events-none z-[9997] -translate-x-1/2 -translate-y-1/2"
        style={{ transformOrigin: "center center" }}
      >
        {/* Handle bar extending from the ring edge */}
        <div
          className="relative w-10 h-10"
          style={{ transformOrigin: "center center" }}
        >
          <div
            className="absolute top-1/2 left-1/2 -translate-y-1/2"
            style={{
              width: "22px",
              height: "5px",
              borderRadius: "0 3px 3px 0",
              background:
                "linear-gradient(90deg, #8B7355 0%, #6B5A42 50%, #5C4D38 100%)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
            }}
          />
          {/* Handle rivet */}
          <div
            className="absolute top-1/2 -translate-y-1/2"
            style={{
              left: "20px",
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: "#4A3F30",
              boxShadow: "inset 0 1px 1px rgba(255,255,255,0.1)",
            }}
          />
          {/* Handle tip */}
          <div
            className="absolute top-1/2 -translate-y-1/2"
            style={{
              left: "38px",
              width: "6px",
              height: "3px",
              borderRadius: "0 2px 2px 0",
              background: "#4A3F30",
            }}
          />
        </div>
      </div>

      {/* Egg white (slightly behind yolk) */}
      <div
        ref={whiteRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
      >
        <div
          className="w-4 h-4 rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at 40% 40%, #F5F0E8 0%, #E8E0D0 60%, rgba(232,224,208,0.6) 100%)",
            filter: "blur(0.5px)",
          }}
        />
      </div>

      {/* Egg yolk (the tight-following dot) */}
      <div
        ref={yolkRef}
        className="fixed top-0 left-0 pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2"
      >
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at 35% 35%, #FBBF24 0%, #F59E0B 60%, #D97706 100%)",
            boxShadow: "0 0 6px rgba(245, 158, 11, 0.4)",
          }}
        />
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
