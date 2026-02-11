"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useIsMobile } from "@/hooks/useMediaQuery";

export default function SmokeParticles() {
  const isMobile = useIsMobile();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  const options = useMemo(
    () => ({
      fullScreen: false as const,
      fpsLimit: 60,
      particles: {
        number: {
          value: isMobile ? 10 : 30,
          density: { enable: true, width: 1920, height: 1080 },
        },
        color: {
          value: ["#F59E0B", "#EA580C", "#DC2626", "#B45309"],
        },
        opacity: {
          value: { min: 0.05, max: 0.2 },
          animation: {
            enable: true,
            speed: 0.5,
            startValue: "random" as const,
            destroy: "min" as const,
          },
        },
        size: {
          value: { min: isMobile ? 40 : 80, max: isMobile ? 100 : 200 },
          animation: {
            enable: true,
            speed: 3,
            startValue: "random" as const,
          },
        },
        move: {
          enable: true,
          speed: { min: 0.3, max: 1 },
          direction: "top" as const,
          outModes: { default: "out" as const },
          random: true,
        },
        shape: { type: "circle" },
      },
      detectRetina: true,
      style: { filter: `blur(${isMobile ? 20 : 40}px)` },
    }),
    [isMobile]
  );

  if (!ready) return null;

  return (
    <Particles
      id="hero-smoke"
      className="absolute inset-0 z-10 pointer-events-none"
      options={options}
    />
  );
}
