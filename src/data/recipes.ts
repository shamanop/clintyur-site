import type { Recipe } from "@/types";

export const featuredRecipes: Recipe[] = [
  {
    id: "jerk-chicken",
    title: "Smoked Jerk Chicken",
    subtitle: "Caribbean Soul",
    description:
      "24-hour marinated, hickory-smoked jerk chicken with charred pineapple salsa and coconut rice. The scotch bonnet heat hits different.",
    image: "/images/recipes/jerk-chicken.jpg",
    cookTime: "4 hours",
    difficulty: "Medium",
    cuisine: "Caribbean",
    tags: ["Smoked", "Spicy", "Signature"],
    featured: true,
  },
  {
    id: "smoked-brisket",
    title: "12-Hour Brisket",
    subtitle: "Low & Slow",
    description:
      "Oak-smoked brisket with a coffee-chili bark crust, served with bourbon peach glaze and smoked mac. Twelve hours of patience, zero regrets.",
    image: "/images/recipes/smoked-brisket.jpg",
    cookTime: "12 hours",
    difficulty: "Chef Level",
    cuisine: "Southern",
    tags: ["Smoked", "BBQ", "Signature"],
    featured: true,
  },
  {
    id: "lobster-mac",
    title: "Lobster Mac & Cheese",
    subtitle: "Elevated Comfort",
    description:
      "Butter-poached lobster tail over four-cheese bechamel with truffle breadcrumb crust. Comfort food that put on a suit.",
    image: "/images/recipes/lobster-mac.jpg",
    cookTime: "45 min",
    difficulty: "Medium",
    cuisine: "Fusion",
    tags: ["Seafood", "Comfort", "Signature"],
    featured: true,
  },
  {
    id: "truffle-ramen",
    title: "Truffle Tonkotsu Ramen",
    subtitle: "East Meets Heat",
    description:
      "48-hour pork bone broth, chashu pork belly, black truffle oil, soft-boiled soy egg, and hand-pulled noodles. Every bowl tells a story.",
    image: "/images/recipes/truffle-ramen.jpg",
    cookTime: "48 hours",
    difficulty: "Chef Level",
    cuisine: "Japanese Fusion",
    tags: ["Soup", "Fusion", "Signature"],
    featured: true,
  },
];
