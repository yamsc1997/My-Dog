export interface Pet {
  id: string;
  name: string;
  species: "perro" | "gato" | "ave" | "hurón" | "conejo";
  emoji: string;
  personality: string;
  charisma: number;
  style: number;
  talent: number;
  followers: number;
  activeOutfit: string | null;
  unlockedOutfits: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: string | null;
  condition: string;
}

export interface ViralResult {
  title: string;
  script: string;
  views: number;
  likes: number;
  shares: number;
  followersGained: number;
  comments: Array<{ user: string; text: string }>;
  academyReport: string;
}

export interface CampaignFormat {
  id: string;
  title: string;
  platform: "TikTok" | "Instagram" | "YouTube";
  description: string;
  statFocus: "charisma" | "style" | "talent";
  multiplier: number;
  minStatRequired: number;
}
