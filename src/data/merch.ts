import type { MerchProduct } from "@/types";

export const merchProducts: MerchProduct[] = [
  {
    id: "hoodie",
    name: "Cook Different Hoodie",
    price: 65,
    image: "/images/merch/hoodie.jpg",
    description: "Heavyweight fleece. Embroidered logo. Flame colorway.",
    comingSoon: false,
  },
  {
    id: "apron",
    name: "Chef's Apron",
    price: 45,
    image: "/images/merch/apron.jpg",
    description: "Waxed canvas. Leather straps. Built for the kitchen.",
    comingSoon: false,
  },
  {
    id: "hat",
    name: "Clintyur Snapback",
    price: 35,
    image: "/images/merch/hat.jpg",
    description: "Structured crown. Embroidered flame logo. One size.",
    comingSoon: true,
  },
];
