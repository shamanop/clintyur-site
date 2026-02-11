"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { featuredRecipes } from "@/data/recipes";
import { Badge } from "@/components/ui/badge";

export default function FeaturedRecipes() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".recipe-card");
      cards.forEach((card) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            end: "top 30%",
            scrub: 1,
          },
          opacity: 0,
          y: 100,
          scale: 0.95,
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="recipes" className="relative py-[var(--spacing-section)]">
      {/* Section header */}
      <div className="text-center mb-16 px-6">
        <p
          className="text-amber uppercase tracking-[0.3em] text-sm mb-4"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Featured
        </p>
        <h2
          className="text-[clamp(2rem,4vw,3.5rem)] font-bold text-text-primary"
          style={{ fontFamily: "var(--font-display)" }}
        >
          The Menu
        </h2>
      </div>

      {/* Recipe stack */}
      <div className="space-y-8 md:space-y-0">
        {featuredRecipes.map((recipe, index) => (
          <div
            key={recipe.id}
            className="recipe-card min-h-screen flex items-center justify-center px-6 md:px-12"
          >
            <div className="w-full max-w-5xl bg-surface border border-[#333333] rounded-2xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 group hover:border-amber/30 transition-colors duration-500">
              {/* Image */}
              <div className="w-full overflow-hidden rounded-xl relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-[300px] md:h-[400px] object-cover rounded-xl transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.background =
                      "linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 50%, #1A1A1A 100%)";
                    target.style.minHeight = "300px";
                  }}
                />
                {/* Gradient overlay on image */}
                <div className="absolute inset-0 bg-gradient-to-t from-surface/60 to-transparent rounded-xl" />
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center">
                <p className="text-amber text-sm uppercase tracking-wider mb-2">
                  {recipe.subtitle}
                </p>
                <h3
                  className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-text-primary mb-4"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {recipe.title}
                </h3>
                <p className="text-text-secondary leading-relaxed mb-6">
                  {recipe.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {recipe.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="border-amber/30 text-amber text-xs bg-transparent"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-6 text-text-muted text-sm">
                  <span>{recipe.cookTime}</span>
                  <span className="w-1 h-1 rounded-full bg-text-muted" />
                  <span>{recipe.difficulty}</span>
                  <span className="w-1 h-1 rounded-full bg-text-muted" />
                  <span>{recipe.cuisine}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
