export interface Recipe {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cookTime: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Chef Level";
  cuisine: string;
  tags: string[];
  featured: boolean;
}

export interface TimelineMilestone {
  id: string;
  year: string;
  title: string;
  description: string;
  image: string;
}

export interface MerchProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  comingSoon: boolean;
}

export interface CateringInquiry {
  name: string;
  email: string;
  phone: string;
  eventType:
    | "Private Dinner"
    | "Corporate Event"
    | "Wedding"
    | "Birthday"
    | "Other";
  eventDate: string;
  guestCount: number;
  message: string;
}

export interface SocialPost {
  id: string;
  platform: "instagram" | "tiktok";
  imageUrl: string;
  postUrl: string;
  caption: string;
}
