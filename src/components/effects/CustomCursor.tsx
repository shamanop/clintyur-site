"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "@/lib/gsap";
import { useIsDesktop } from "@/hooks/useMediaQuery";

const SIZZLE_COLORS = ["#F59E0B", "#FBBF24", "#EA580C", "#FCD34D"];
const SIZZLE_COUNT = 8;

export default function CustomCursor() {
  const yolkRef = useRef<HTMLDivElement>(null);
  const whiteRef = useRef<HTMLDivElement>(null);
  const panRef = useRef<HTMLDivElement>(null);
  const handleWrapRef = useRef<HTMLDivElement>(null);
  const sizzleRef = useRef<HTMLDivElement>(null);
  const steamRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();

  const angleRef = useRef(0);
  const prevPos = useRef({ x: 0, y: 0 });
  const sizzleIdx = useRef(0);
  const frameCount = useRef(0);
  const steamTlRef = useRef<gsap.core.Timeline | null>(null);
  const steamVisible = useRef(true);

  useEffect(() => {
    if (!isDesktop) return;
    const yolk = yolkRef.current;
    const white = whiteRef.current;
    const pan = panRef.current;
    const handleWrap = handleWrapRef.current;
    const sizzle = sizzleRef.current;
    const steam = steamRef.current;
    if (!yolk || !white || !pan || !handleWrap || !sizzle || !steam) return;

    // Build steam wisp timeline
    const steamPaths = steam.querySelectorAll(".steam-wisp");
    const steamTl = gsap.timeline({ repeat: -1, paused: false });
    steamPaths.forEach((path, i) => {
      steamTl.fromTo(
        path,
        { opacity: 0, y: 0, scaleX: 0.8 },
        {
          opacity: 0.12,
          y: -16,
          scaleX: 1.3,
          duration: 2.5,
          ease: "power1.out",
          repeat: -1,
          repeatDelay: 1.5,
        },
        i * 0.8
      );
    });
    steamTlRef.current = steamTl;

    const onMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - prevPos.current.x;
      const dy = e.clientY - prevPos.current.y;
      prevPos.current = { x: e.clientX, y: e.clientY };
      frameCount.current++;

      const speed = Math.sqrt(dx * dx + dy * dy);

      // Handle rotation - points AWAY from movement
      if (speed > 2) {
        const moveAngle = Math.atan2(dy, dx) * (180 / Math.PI);
        angleRef.current = moveAngle + 180;
      }

      // === Position tracking (original dual-element system) ===

      // Yolk: tightest follow
      gsap.to(yolk, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out",
      });

      // Egg white: slight delay
      gsap.to(white, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: "power2.out",
      });

      // Steam follows white
      gsap.to(steam, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: "power2.out",
      });

      // Pan ring: satisfying trail
      gsap.to(pan, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: "power2.out",
      });

      // Handle follows pan position + rotates
      gsap.to(handleWrap, {
        x: e.clientX,
        y: e.clientY,
        rotation: angleRef.current,
        duration: 0.35,
        ease: "power2.out",
      });

      // Sizzle follows pan
      gsap.to(sizzle, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.2,
        ease: "power2.out",
      });

      // === Yolk wobble ===
      if (speed > 8) {
        const wobble = Math.min(speed * 0.015, 0.25);
        const moveAngle = Math.atan2(dy, dx) * (180 / Math.PI);
        gsap.to(yolk.querySelector("svg"), {
          scaleX: 1 + wobble,
          scaleY: 1 - wobble * 0.6,
          rotation: moveAngle,
          duration: 0.08,
          ease: "none",
          overwrite: true,
        });
        gsap.to(yolk.querySelector("svg"), {
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          duration: 0.4,
          ease: "elastic.out(1.2, 0.4)",
          delay: 0.05,
          overwrite: false,
        });
      }

      // === Sizzle particles ===
      if (speed > 5 && frameCount.current % 4 === 0) {
        const particles = sizzle.children;
        const p = particles[sizzleIdx.current % SIZZLE_COUNT] as HTMLElement;
        if (p) {
          const randX = (Math.random() - 0.5) * 12;
          const randY = -(8 + Math.random() * 10);
          gsap
            .timeline()
            .set(p, {
              x: randX,
              y: 0,
              opacity: 1,
              scale: 1,
            })
            .to(p, {
              x: randX + (Math.random() - 0.5) * 12,
              y: randY,
              opacity: 0,
              scale: 0.3,
              duration: 0.3 + Math.random() * 0.2,
              ease: "power2.out",
            });
          sizzleIdx.current++;
        }
      }

      // === Steam visibility (show when still, hide when fast) ===
      if (speed > 5 && steamVisible.current) {
        steamVisible.current = false;
        gsap.to(steam, { opacity: 0, duration: 0.3 });
      } else if (speed < 2 && !steamVisible.current) {
        steamVisible.current = true;
        gsap.to(steam, { opacity: 1, duration: 0.5 });
      }
    };

    const onMouseDown = () => {
      gsap.to(pan, { scale: 0.8, duration: 0.15 });
      gsap.to(handleWrap, { scale: 0.8, duration: 0.15 });
      gsap.to(white, { scale: 1.2, duration: 0.15 });
    };

    const onMouseUp = () => {
      gsap.to(pan, { scale: 1, duration: 0.15, ease: "back.out(1.7)" });
      gsap.to(handleWrap, { scale: 1, duration: 0.15 });
      gsap.to(white, { scale: 1, duration: 0.15 });
    };

    const onMouseEnterInteractive = () => {
      gsap.to(pan, { scale: 1.4, opacity: 0.6, duration: 0.2 });
      gsap.to(handleWrap, { scale: 1.4, opacity: 0.6, duration: 0.2 });
      gsap.to(yolk, { scale: 0.6, duration: 0.2 });
      gsap.to(white, { scale: 0.8, duration: 0.2 });
    };

    const onMouseLeaveInteractive = () => {
      gsap.to(pan, { scale: 1, opacity: 1, duration: 0.2 });
      gsap.to(handleWrap, { scale: 1, opacity: 1, duration: 0.2 });
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
      steamTl.kill();
    };
  }, [isDesktop]);

  if (!isDesktop) return null;

  return (
    <>
      {/* Pan ring - detailed SVG */}
      <div
        ref={panRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2"
      >
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <defs>
            <radialGradient id="cur-pan-surface" cx="50%" cy="45%" r="50%">
              <stop offset="0%" stopColor="#1A1A1A" stopOpacity="0.7" />
              <stop offset="70%" stopColor="#2A2520" />
              <stop offset="100%" stopColor="#3D3428" />
            </radialGradient>
            <radialGradient id="cur-pan-rim" cx="50%" cy="30%" r="55%">
              <stop offset="80%" stopColor="transparent" />
              <stop offset="90%" stopColor="rgba(245,158,11,0.15)" />
              <stop offset="100%" stopColor="rgba(245,158,11,0.05)" />
            </radialGradient>
          </defs>
          {/* Pan base */}
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="url(#cur-pan-surface)"
            stroke="#D97706"
            strokeWidth="2"
            strokeOpacity="0.6"
          />
          {/* Inner rim for depth */}
          <circle
            cx="24"
            cy="24"
            r="17"
            fill="none"
            stroke="#B45309"
            strokeWidth="0.5"
            strokeOpacity="0.3"
          />
          {/* Top highlight arc */}
          <path
            d="M 10 18 A 18 18 0 0 1 38 18"
            fill="none"
            stroke="rgba(245,158,11,0.2)"
            strokeWidth="1"
            strokeLinecap="round"
          />
          {/* Rim highlight overlay */}
          <circle cx="24" cy="24" r="20" fill="url(#cur-pan-rim)" />
        </svg>
      </div>

      {/* Handle - SVG with wood grain */}
      <div
        ref={handleWrapRef}
        className="fixed top-0 left-0 pointer-events-none z-[9997] -translate-x-1/2 -translate-y-1/2"
        style={{ transformOrigin: "center center" }}
      >
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <defs>
            <linearGradient
              id="cur-wood"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#8B7355" />
              <stop offset="30%" stopColor="#7A6548" />
              <stop offset="50%" stopColor="#6B5A42" />
              <stop offset="70%" stopColor="#7A6548" />
              <stop offset="100%" stopColor="#5C4D38" />
            </linearGradient>
          </defs>
          <g transform="translate(24,24)">
            {/* Main bar */}
            <rect
              x="18"
              y="-3"
              width="22"
              height="6"
              rx="2"
              fill="url(#cur-wood)"
            />
            {/* Rivet */}
            <circle cx="20" cy="0" r="2.5" fill="#4A3F30" stroke="#5C4D38" strokeWidth="0.5" />
            {/* Rivet shine */}
            <circle cx="19.5" cy="-0.5" r="0.8" fill="rgba(255,255,255,0.08)" />
            {/* End cap */}
            <rect
              x="38"
              y="-2"
              width="4"
              height="4"
              rx="1.5"
              fill="#3D3020"
            />
          </g>
        </svg>
      </div>

      {/* Egg white - organic SVG */}
      <div
        ref={whiteRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <defs>
            <radialGradient id="cur-egg-white" cx="45%" cy="40%">
              <stop offset="0%" stopColor="#F5F0E8" />
              <stop offset="70%" stopColor="#E8E0D0" />
              <stop offset="100%" stopColor="rgba(232,224,208,0.5)" />
            </radialGradient>
          </defs>
          {/* Irregular egg white blob */}
          <path
            d="M12 2 C17 1.5, 22 5, 22.5 10 C23 15, 20 21, 14 22.5 C8 24, 2 20, 1.5 14 C1 8, 4 3, 8 2 C10 1.5, 11 1.8, 12 2Z"
            fill="url(#cur-egg-white)"
            opacity="0.92"
          />
          {/* Crispy edge */}
          <path
            d="M12 2 C17 1.5, 22 5, 22.5 10 C23 15, 20 21, 14 22.5 C8 24, 2 20, 1.5 14 C1 8, 4 3, 8 2 C10 1.5, 11 1.8, 12 2Z"
            fill="none"
            stroke="#C4A36A"
            strokeWidth="0.6"
            strokeOpacity="0.35"
          />
        </svg>
      </div>

      {/* Steam wisps - follow the egg white */}
      <div
        ref={steamRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ marginTop: "-16px" }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" overflow="visible">
          <path
            className="steam-wisp"
            d="M10 16 Q11 12 10 9 Q9 6 10.5 3"
            stroke="rgba(200,190,170,0.1)"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
            opacity="0"
          />
          <path
            className="steam-wisp"
            d="M12 16 Q11 13 12.5 10 Q13.5 7 12 4"
            stroke="rgba(200,190,170,0.08)"
            strokeWidth="0.8"
            strokeLinecap="round"
            fill="none"
            opacity="0"
          />
          <path
            className="steam-wisp"
            d="M8 17 Q9 13 7.5 10 Q8 7 9 4"
            stroke="rgba(200,190,170,0.06)"
            strokeWidth="0.8"
            strokeLinecap="round"
            fill="none"
            opacity="0"
          />
        </svg>
      </div>

      {/* Egg yolk - detailed SVG */}
      <div
        ref={yolkRef}
        className="fixed top-0 left-0 pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <defs>
            <radialGradient id="cur-yolk" cx="40%" cy="35%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </radialGradient>
          </defs>
          <circle cx="7" cy="7" r="6" fill="url(#cur-yolk)" />
          {/* Specular highlight */}
          <ellipse
            cx="5"
            cy="5"
            rx="2"
            ry="1.5"
            fill="rgba(255,255,255,0.15)"
            transform="rotate(-20 5 5)"
          />
          {/* Tiny shine */}
          <circle cx="4.5" cy="4.2" r="0.7" fill="rgba(255,255,255,0.2)" />
        </svg>
      </div>

      {/* Sizzle particle pool */}
      <div
        ref={sizzleRef}
        className="fixed top-0 left-0 pointer-events-none z-[10001] -translate-x-1/2 -translate-y-1/2"
      >
        {Array.from({ length: SIZZLE_COUNT }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-0"
            style={{
              width: "3px",
              height: "3px",
              background: SIZZLE_COLORS[i % 4],
              boxShadow: `0 0 4px ${SIZZLE_COLORS[i % 4]}60`,
            }}
          />
        ))}
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
