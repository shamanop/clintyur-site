export const SITE_CONFIG = {
  name: "Clintyur",
  tagline: "Cook different.",
  description:
    "Hip-hop chef bringing soul to every plate. Recipes, catering, and vibes.",
  url: "https://clintyur.com",
  ogImage: "/images/og-image.jpg",
} as const;

export const NAV_ITEMS = [
  { label: "Recipes", href: "#recipes" },
  { label: "About", href: "#about" },
  { label: "Catering", href: "#catering" },
  { label: "Merch", href: "#merch" },
] as const;

export const SOCIAL_LINKS = [
  {
    platform: "Instagram",
    url: "https://instagram.com/clintyur",
    handle: "@clintyur",
  },
  {
    platform: "TikTok",
    url: "https://tiktok.com/@clintyur",
    handle: "@clintyur",
  },
  {
    platform: "YouTube",
    url: "https://youtube.com/@clintyur",
    handle: "@clintyur",
  },
  {
    platform: "Twitter",
    url: "https://twitter.com/clintyur",
    handle: "@clintyur",
  },
] as const;

export const SECTION_IDS = {
  hero: "hero",
  recipes: "recipes",
  about: "about",
  catering: "catering",
  merch: "merch",
  social: "social",
} as const;
