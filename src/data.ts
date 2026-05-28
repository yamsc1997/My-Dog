import { Pet, CampaignFormat } from "./types";

export const INITIAL_PETS: Pet[] = [
  {
    id: "pet_1",
    name: "Rocky Bal-Ladra",
    species: "perro",
    emoji: "🐶",
    personality: "Chihuahua nervioso con ínfulas de boxeador y modelo fitness.",
    charisma: 45,
    style: 30,
    talent: 25,
    followers: 1200,
    activeOutfit: null,
    unlockedOutfits: ["Ninguno"]
  },
  {
    id: "pet_2",
    name: "Reina Cleopatra",
    species: "gato",
    emoji: "🐱",
    personality: "Gata persa hiper-presumida que juzga el 100% de la humanidad.",
    charisma: 60,
    style: 55,
    talent: 40,
    followers: 5400,
    activeOutfit: "Lazo de Seda de Vecindario",
    unlockedOutfits: ["Ninguno", "Lazo de Seda de Vecindario"]
  },
  {
    id: "pet_3",
    name: "DJ Loro Coco",
    species: "ave",
    emoji: "🦜",
    personality: "Loro ruidoso que imita bocinas de coche y baila reggaetón.",
    charisma: 50,
    style: 20,
    talent: 65,
    followers: 850,
    activeOutfit: null,
    unlockedOutfits: ["Ninguno"]
  },
  {
    id: "pet_4",
    name: "Hurón Veloz",
    species: "hurón",
    emoji: "🦦",
    personality: "Hurtador profesional de calcetines y as en carreras de pasillo.",
    charisma: 35,
    style: 15,
    talent: 50,
    followers: 320,
    activeOutfit: null,
    unlockedOutfits: ["Ninguno"]
  },
  {
    id: "pet_5",
    name: "Don Conejito",
    species: "conejo",
    emoji: "🐰",
    personality: "Masticador profesional de cables y rey de los saltos mortales.",
    charisma: 40,
    style: 35,
    talent: 30,
    followers: 610,
    activeOutfit: null,
    unlockedOutfits: ["Ninguno"]
  }
];

export const CAMPAIGN_FORMATS: CampaignFormat[] = [
  {
    id: "fmt_1",
    title: "🎥 Drama con un Calcetín Robado",
    platform: "TikTok",
    description: "Una escena dramática con música tensa donde la mascota se niega a devolver un calcetín de deporte.",
    statFocus: "charisma",
    multiplier: 1.2,
    minStatRequired: 10
  },
  {
    id: "fmt_2",
    title: "🎧 ASMR Crujiente de Croquetas",
    platform: "TikTok",
    description: "Sonido ultra nítido hiperfocalizado en la mascota saboreando sus chuches favoritas lentamen-te.",
    statFocus: "style",
    multiplier: 1.5,
    minStatRequired: 30
  },
  {
    id: "fmt_3",
    title: "💃 Baile Viral Canario (El Salto)",
    platform: "Instagram",
    description: "Coreografía rítmica imitando los bailes de moda en la Avenida de Canarias de Vecindario.",
    statFocus: "talent",
    multiplier: 1.8,
    minStatRequired: 20
  },
  {
    id: "fmt_4",
    title: "💄 Tutorial de Estilo y Peinado Extremo",
    platform: "YouTube",
    description: "Sesión de spa donde mostramos el cambio de look radical de la mascota usando coronas o lazos deluxe.",
    statFocus: "style",
    multiplier: 2.0,
    minStatRequired: 40
  },
  {
    id: "fmt_5",
    title: "⚠️ El Desafío de Ignorar a la Cámara",
    platform: "Instagram",
    description: "La mascota ignora por completo a su mánager mientras éste intenta llamar su atención con un peluche.",
    statFocus: "charisma",
    multiplier: 1.3,
    minStatRequired: 25
  },
  {
    id: "fmt_6",
    title: "🎹 Concierto de Piano Desafinado",
    platform: "YouTube",
    description: "Un solo musical improvisado pisando las teclas de un piano de juguete mientras emite quejidos dramáticos.",
    statFocus: "talent",
    multiplier: 2.2,
    minStatRequired: 50
  }
];

export interface OutfitItem {
  name: string;
  price: number;
  statBonus: { charisma?: number; style?: number; talent?: number };
  description: string;
  icon: string;
}

export const AVAILABLE_OUTFITS: OutfitItem[] = [
  {
    name: "Gafas de Sol de Mánager de Vecindario",
    price: 150,
    statBonus: { style: 15, charisma: 5 },
    description: "Gafas oscuras estilo aviador para blindarse de los paparazzis.",
    icon: "🕶️"
  },
  {
    name: "Corona de Emperador Viral",
    price: 500,
    statBonus: { style: 30, charisma: 20 },
    description: "Corona brillante de plástico dorado que grita realeza canina.",
    icon: "👑"
  },
  {
    name: "Pajarita de Gala Vecindario",
    price: 80,
    statBonus: { style: 10, talent: 5 },
    description: "Complemento elegante para bodas, bautizos y finales de realities.",
    icon: "🎀"
  },
  {
    name: "Gorra Rapera 'Can Canary'",
    price: 250,
    statBonus: { charisma: 15, talent: 15 },
    description: "Gorra de béisbol de medio lado para rimas caninas feroces.",
    icon: "🧢"
  },
  {
    name: "Collar de Oro Puro Flashero",
    price: 800,
    statBonus: { style: 40, charisma: 25 },
    description: "Cadena de eslabones gigantesca para deslumbrar en las miniaturas de YouTube.",
    icon: "📿"
  },
  {
    name: "Peluca de Flequillo Estrella",
    price: 350,
    statBonus: { talent: 25, style: 10 },
    description: "Para dar un aire misterioso ochentero ideal para videoclips.",
    icon: "💇"
  }
];
