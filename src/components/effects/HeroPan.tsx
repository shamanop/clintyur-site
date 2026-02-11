"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsDesktop } from "@/hooks/useMediaQuery";

interface FriedEgg {
  id: string;
  x: number;
  y: number;
  rotation: number;
  pathVariant: number;
}

const MAX_EGGS = 5;
const PAN_RADIUS = 170;
const SIZZLE_COLORS = ["#F59E0B", "#FBBF24", "#EA580C", "#FCD34D"];

const EGG_WHITE_PATHS = [
  "M0 -22 C15 -25 28 -12 25 0 C28 15 12 28 0 25 C-14 28 -27 14 -25 0 C-28 -13 -14 -25 0 -22Z",
  "M0 -24 C18 -22 26 -8 24 3 C26 18 10 26 -2 27 C-16 26 -26 12 -24 -2 C-26 -16 -16 -24 0 -24Z",
  "M2 -20 C16 -24 30 -10 26 2 C30 16 14 30 0 26 C-12 30 -28 16 -26 2 C-30 -12 -12 -22 2 -20Z",
  "M-2 -23 C14 -26 27 -14 24 -1 C27 14 14 27 1 24 C-13 27 -26 14 -24 1 C-27 -12 -15 -24 -2 -23Z",
];

function createSizzleBurst(
  cx: number,
  cy: number,
  svgEl: SVGSVGElement
) {
  const count = 8 + Math.floor(Math.random() * 5);
  const tl = gsap.timeline();

  for (let i = 0; i < count; i++) {
    const angle = ((Math.PI * 2) / count) * i + (Math.random() - 0.5) * 0.5;
    const dist = 20 + Math.random() * 25;
    const size = 1.5 + Math.random() * 2;
    const dur = 0.3 + Math.random() * 0.3;

    const particle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    particle.setAttribute("cx", String(cx));
    particle.setAttribute("cy", String(cy));
    particle.setAttribute("r", String(size));
    particle.setAttribute("fill", SIZZLE_COLORS[i % 4]);
    particle.setAttribute("opacity", "0");
    svgEl.appendChild(particle);

    tl.fromTo(
      particle,
      {
        attr: { cx: cx, cy: cy },
        opacity: 1,
      },
      {
        attr: {
          cx: cx + Math.cos(angle) * dist,
          cy: cy + Math.sin(angle) * dist,
        },
        opacity: 0,
        duration: dur,
        ease: "power2.out",
        onComplete: () => particle.remove(),
      },
      Math.random() * 0.1
    );
  }

  return tl;
}

export default function HeroPan() {
  const isDesktop = useIsDesktop();
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const panGroupRef = useRef<SVGGElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const oilTlRef = useRef<gsap.core.Timeline | null>(null);
  const [eggs, setEggs] = useState<FriedEgg[]>([]);
  const [isReady, setIsReady] = useState(false);
  const hasInteracted = useRef(false);

  // Listen for preloader:complete
  useEffect(() => {
    const onReady = () => setIsReady(true);
    window.addEventListener("preloader:complete", onReady);
    return () => window.removeEventListener("preloader:complete", onReady);
  }, []);

  // Entrance animation
  useEffect(() => {
    if (!isReady || !panGroupRef.current) return;

    gsap.fromTo(
      panGroupRef.current,
      { opacity: 0, scale: 0.85, y: 30 },
      {
        opacity: isDesktop ? 0.5 : 0.2,
        scale: 1,
        y: 0,
        duration: 1.4,
        delay: 0.8,
        ease: "power3.out",
      }
    );

    // Start ambient oil bubbles
    if (isDesktop && svgRef.current) {
      startOilBubbles();
    }
  }, [isReady, isDesktop]);

  // Hint text timer
  useEffect(() => {
    if (!isReady || !isDesktop || !hintRef.current) return;
    const timer = setTimeout(() => {
      if (!hasInteracted.current && hintRef.current) {
        gsap.to(hintRef.current, {
          opacity: 0.4,
          duration: 1,
          ease: "power2.out",
        });
        gsap.to(hintRef.current, {
          opacity: 0,
          duration: 1,
          delay: 5,
          ease: "power2.in",
        });
      }
    }, 3500);
    return () => clearTimeout(timer);
  }, [isReady, isDesktop]);

  // Scroll parallax
  useEffect(() => {
    if (!containerRef.current) return;
    const st = ScrollTrigger.create({
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        if (containerRef.current) {
          gsap.set(containerRef.current, { y: self.progress * -100 });
        }
      },
    });
    return () => st.kill();
  }, []);

  // Egg crack animations
  useEffect(() => {
    if (eggs.length === 0 || !svgRef.current) return;
    const latestEgg = eggs[eggs.length - 1];
    const svg = svgRef.current;

    // Find the egg group that was just added
    const eggGroups = svg.querySelectorAll(".fried-egg");
    const eggGroup = eggGroups[eggGroups.length - 1] as SVGGElement;
    if (!eggGroup) return;

    const whitePath = eggGroup.querySelector(".egg-white-path") as SVGElement;
    const yolkCircle = eggGroup.querySelector(".egg-yolk") as SVGElement;
    const crispyEdge = eggGroup.querySelector(".egg-crispy") as SVGElement;
    const cookBubbles = eggGroup.querySelectorAll(".cook-bubble");

    // Crack animation timeline
    const crackTl = gsap.timeline();

    // Egg white expands
    crackTl.fromTo(
      whitePath,
      { scale: 0, opacity: 0, transformOrigin: "center center" },
      { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(1.5)" }
    );

    // Yolk drops in
    crackTl.fromTo(
      yolkCircle,
      { scale: 0, transformOrigin: "center center" },
      { scale: 1, duration: 0.3, ease: "bounce.out" },
      "-=0.15"
    );

    // Sizzle burst
    crackTl.add(
      createSizzleBurst(latestEgg.x, latestEgg.y, svg),
      "-=0.2"
    );

    // Start cooking: edge browns over time
    gsap.to(crispyEdge, {
      strokeOpacity: 0.5,
      duration: 6,
      delay: 1,
      ease: "power1.in",
    });

    // Cooking bubbles loop
    cookBubbles.forEach((bubble, i) => {
      gsap.timeline({ repeat: -1, delay: 0.5 + i * 0.7 })
        .fromTo(
          bubble,
          { attr: { r: 0 }, opacity: 0.3 },
          {
            attr: { r: 2 + Math.random() * 1.5 },
            opacity: 0,
            duration: 0.7 + Math.random() * 0.4,
            ease: "power1.out",
          }
        );
    });

    // Done state: golden glow pulse after 8s
    const doneTimer = setTimeout(() => {
      gsap.to(yolkCircle, {
        filter: "drop-shadow(0 0 6px rgba(245,158,11,0.6))",
        duration: 0.5,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      });
    }, 8000);

    return () => clearTimeout(doneTimer);
  }, [eggs]);

  const startOilBubbles = useCallback(() => {
    if (!svgRef.current) return;
    const svg = svgRef.current;

    const createBubble = () => {
      const rx = (Math.random() - 0.5) * 280 + 250;
      const ry = (Math.random() - 0.5) * 280 + 250;
      // Check if within cooking surface
      const dx = rx - 250;
      const dy = ry - 250;
      if (Math.sqrt(dx * dx + dy * dy) > PAN_RADIUS) {
        return;
      }

      const bubble = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      bubble.setAttribute("cx", String(rx));
      bubble.setAttribute("cy", String(ry));
      bubble.setAttribute("r", "0");
      bubble.setAttribute("fill", "rgba(245,158,11,0.12)");
      bubble.setAttribute("opacity", "0");

      const oilGroup = svg.querySelector(".oil-bubbles");
      if (oilGroup) oilGroup.appendChild(bubble);

      gsap.fromTo(
        bubble,
        { attr: { r: 0 }, opacity: 0.3 },
        {
          attr: { r: 1.5 + Math.random() * 2.5 },
          opacity: 0,
          duration: 0.6 + Math.random() * 0.5,
          ease: "power1.out",
          onComplete: () => bubble.remove(),
        }
      );
    };

    // Spawn oil bubbles on interval
    const interval = setInterval(createBubble, 600 + Math.random() * 400);
    return () => clearInterval(interval);
  }, []);

  // Pan hover handlers
  const onPanEnter = useCallback(() => {
    if (!panGroupRef.current || !isDesktop) return;
    gsap.to(panGroupRef.current, {
      opacity: 0.75,
      duration: 0.5,
      ease: "power2.out",
    });
  }, [isDesktop]);

  const onPanLeave = useCallback(() => {
    if (!panGroupRef.current || !isDesktop) return;
    gsap.to(panGroupRef.current, {
      opacity: 0.5,
      duration: 0.5,
      ease: "power2.out",
    });
  }, [isDesktop]);

  // Click handler: crack an egg
  const handlePanClick = useCallback(
    (e: React.MouseEvent<SVGCircleElement>) => {
      if (!isDesktop || eggs.length >= MAX_EGGS || !svgRef.current) return;

      // Dismiss hint
      if (!hasInteracted.current) {
        hasInteracted.current = true;
        if (hintRef.current) {
          gsap.to(hintRef.current, { opacity: 0, duration: 0.3 });
        }
      }

      const svg = svgRef.current;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const svgPt = pt.matrixTransform(ctm.inverse());

      // Check within cooking surface
      const dx = svgPt.x - 250;
      const dy = svgPt.y - 250;
      if (Math.sqrt(dx * dx + dy * dy) > PAN_RADIUS) return;

      const newEgg: FriedEgg = {
        id: `egg-${Date.now()}`,
        x: svgPt.x,
        y: svgPt.y,
        rotation: (Math.random() - 0.5) * 30,
        pathVariant: Math.floor(Math.random() * 4),
      };

      setEggs((prev) => [...prev, newEgg]);
    },
    [isDesktop, eggs.length]
  );

  // Egg hover handler
  const onEggHover = useCallback(
    (e: React.MouseEvent<SVGGElement>) => {
      if (!isDesktop) return;
      const group = e.currentTarget;
      const yolk = group.querySelector(".egg-yolk");
      if (!yolk) return;

      gsap
        .timeline()
        .to(yolk, { x: 2, y: -1, duration: 0.1 })
        .to(yolk, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.3)",
        });

      // Mini sizzle on hover
      if (svgRef.current) {
        const rect = group.getBoundingClientRect();
        const svgRect = svgRef.current.getBoundingClientRect();
        const scale = 500 / svgRect.width;
        const cx =
          (rect.left + rect.width / 2 - svgRect.left) * scale;
        const cy =
          (rect.top + rect.height / 2 - svgRect.top) * scale;

        for (let i = 0; i < 3; i++) {
          const particle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
          );
          particle.setAttribute("cx", String(cx));
          particle.setAttribute("cy", String(cy));
          particle.setAttribute("r", "1.5");
          particle.setAttribute("fill", SIZZLE_COLORS[i]);
          svgRef.current.appendChild(particle);

          const angle = Math.random() * Math.PI * 2;
          gsap.fromTo(
            particle,
            { attr: { cx: cx, cy: cy }, opacity: 0.8 },
            {
              attr: {
                cx: cx + Math.cos(angle) * 15,
                cy: cy + Math.sin(angle) * 15,
              },
              opacity: 0,
              duration: 0.4,
              ease: "power2.out",
              onComplete: () => particle.remove(),
            }
          );
        }
      }
    },
    [isDesktop]
  );

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-[15] flex items-center justify-center pointer-events-none"
      style={{ paddingTop: "8vh" }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 500 500"
        className="pointer-events-auto"
        style={{
          width: "clamp(280px, 35vw, 480px)",
          height: "clamp(280px, 35vw, 480px)",
        }}
      >
        <defs>
          {/* Pan surface gradient */}
          <radialGradient id="hero-pan-surface" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#1A1A1A" />
            <stop offset="60%" stopColor="#222018" />
            <stop offset="85%" stopColor="#2A2520" />
            <stop offset="100%" stopColor="#3D3428" />
          </radialGradient>
          {/* Oil sheen */}
          <radialGradient id="hero-oil-sheen" cx="40%" cy="35%" r="30%">
            <stop offset="0%" stopColor="rgba(245,158,11,0.08)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          {/* Handle wood grain */}
          <linearGradient id="hero-wood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8B7355" />
            <stop offset="30%" stopColor="#7A6548" />
            <stop offset="50%" stopColor="#6B5A42" />
            <stop offset="70%" stopColor="#7A6548" />
            <stop offset="100%" stopColor="#5C4D38" />
          </linearGradient>
          {/* Egg white gradient */}
          <radialGradient id="hero-egg-white" cx="45%" cy="40%">
            <stop offset="0%" stopColor="#F5F0E8" />
            <stop offset="70%" stopColor="#E8E0D0" />
            <stop offset="100%" stopColor="rgba(232,224,208,0.5)" />
          </radialGradient>
          {/* Yolk gradient */}
          <radialGradient id="hero-yolk" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </radialGradient>
        </defs>

        <g ref={panGroupRef} opacity="0">
          {/* Drop shadow */}
          <ellipse
            cx="255"
            cy="260"
            rx="210"
            ry="215"
            fill="rgba(0,0,0,0.3)"
            filter="blur(15px)"
          />

          {/* Pan body */}
          <circle
            cx="250"
            cy="250"
            r="200"
            fill="url(#hero-pan-surface)"
            stroke="#D97706"
            strokeWidth="3"
            strokeOpacity="0.3"
          />

          {/* Inner cooking surface rim */}
          <circle
            cx="250"
            cy="250"
            r="180"
            fill="none"
            stroke="#B45309"
            strokeWidth="1"
            strokeOpacity="0.15"
          />

          {/* Oil sheen layer */}
          <circle cx="250" cy="250" r="178" fill="url(#hero-oil-sheen)" />

          {/* Top rim highlight arc */}
          <path
            d="M 80 180 A 200 200 0 0 1 420 180"
            fill="none"
            stroke="rgba(245,158,11,0.12)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Handle */}
          <g transform="translate(250,250) rotate(-30)">
            <rect
              x="195"
              y="-16"
              width="140"
              height="32"
              rx="8"
              fill="url(#hero-wood)"
            />
            {/* Rivet */}
            <circle
              cx="205"
              cy="0"
              r="7"
              fill="#4A3F30"
              stroke="#5C4D38"
              strokeWidth="1"
            />
            {/* Rivet shine */}
            <circle cx="203" cy="-2" r="2" fill="rgba(255,255,255,0.06)" />
            {/* End cap */}
            <rect
              x="330"
              y="-10"
              width="14"
              height="20"
              rx="5"
              fill="#3D3020"
            />
          </g>

          {/* Oil bubbles group (populated dynamically) */}
          <g className="oil-bubbles" />

          {/* Rendered eggs */}
          {eggs.map((egg) => (
            <g
              key={egg.id}
              className="fried-egg"
              transform={`translate(${egg.x}, ${egg.y}) rotate(${egg.rotation})`}
              onMouseEnter={onEggHover}
              style={{ cursor: "pointer" }}
            >
              {/* Egg white blob */}
              <path
                className="egg-white-path"
                d={EGG_WHITE_PATHS[egg.pathVariant]}
                fill="url(#hero-egg-white)"
                opacity="0"
              />
              {/* Crispy edge (browns over time) */}
              <path
                className="egg-crispy"
                d={EGG_WHITE_PATHS[egg.pathVariant]}
                fill="none"
                stroke="#C4A36A"
                strokeWidth="1.5"
                strokeOpacity="0"
              />
              {/* Yolk */}
              <circle
                className="egg-yolk"
                cx="2"
                cy="-1"
                r="10"
                fill="url(#hero-yolk)"
              />
              {/* Yolk highlight */}
              <ellipse
                cx="-1"
                cy="-4"
                rx="4"
                ry="3"
                fill="rgba(255,255,255,0.12)"
                transform="rotate(-15)"
              />
              {/* Yolk tiny shine */}
              <circle cx="-2" cy="-5" r="1.5" fill="rgba(255,255,255,0.18)" />
              {/* Cooking bubbles */}
              <circle
                className="cook-bubble"
                cx="18"
                cy="5"
                r="0"
                fill="rgba(245,158,11,0.2)"
              />
              <circle
                className="cook-bubble"
                cx="-15"
                cy="12"
                r="0"
                fill="rgba(245,158,11,0.15)"
              />
              <circle
                className="cook-bubble"
                cx="8"
                cy="20"
                r="0"
                fill="rgba(245,158,11,0.18)"
              />
            </g>
          ))}

          {/* Clickable surface (transparent, catches events) */}
          <circle
            cx="250"
            cy="250"
            r="180"
            fill="transparent"
            onClick={handlePanClick}
            onMouseEnter={onPanEnter}
            onMouseLeave={onPanLeave}
            style={{ cursor: "none" }}
          />
        </g>
      </svg>

      {/* Hint text */}
      {isDesktop && (
        <p
          ref={hintRef}
          className="absolute text-text-muted text-xs tracking-[0.2em] uppercase opacity-0"
          style={{
            fontFamily: "var(--font-body)",
            bottom: "18%",
          }}
        >
          Click the pan to crack an egg
        </p>
      )}
    </div>
  );
}
