"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { merchProducts } from "@/data/merch";
import { Badge } from "@/components/ui/badge";

export default function MerchTeaser() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".merch-card");
      cards.forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
          opacity: 0,
          y: 40,
          duration: 0.8,
          delay: i * 0.15,
          ease: "power3.out",
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="merch"
      className="relative py-[var(--spacing-section)] px-6 md:px-12"
    >
      <div className="text-center mb-16">
        <p className="text-ember uppercase tracking-[0.3em] text-sm mb-4">
          Merch
        </p>
        <h2
          className="text-[clamp(2rem,4vw,3.5rem)] font-bold text-text-primary mb-6"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Wear the Heat
        </h2>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {merchProducts.map((product) => (
          <div
            key={product.id}
            className="merch-card group bg-surface border border-[#333333] rounded-2xl overflow-hidden hover:border-amber/30 transition-colors duration-500"
          >
            {/* Product image */}
            <div className="relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.background =
                    "linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 50%, #1A1A1A 100%)";
                  target.style.minHeight = "288px";
                }}
              />
              {product.comingSoon && (
                <Badge className="absolute top-4 right-4 bg-amber text-[#0A0A0A] border-none">
                  Coming Soon
                </Badge>
              )}
            </div>

            {/* Product info */}
            <div className="p-6">
              <h3
                className="text-lg font-bold text-text-primary mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {product.name}
              </h3>
              <p className="text-text-secondary text-sm mb-3">
                {product.description}
              </p>
              <p
                className="text-amber font-bold text-lg"
                style={{ fontFamily: "var(--font-display)" }}
              >
                ${product.price}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <a
          href="#"
          className="inline-flex items-center gap-2 text-amber hover:text-amber-light transition-colors tracking-wide"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Shop All
          <span className="text-lg">&rarr;</span>
        </a>
      </div>
    </section>
  );
}
