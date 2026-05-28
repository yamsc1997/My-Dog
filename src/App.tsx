import React, { useState, useEffect, useRef } from "react";
import { Pet, CampaignFormat, ViralResult } from "./types";
import { INITIAL_PETS, CAMPAIGN_FORMATS, AVAILABLE_OUTFITS, OutfitItem } from "./data";
import PetCard from "./components/PetCard";
import PhonePreview from "./components/PhonePreview";
import OutfitStore from "./components/OutfitStore";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  TrendingUp,
  Video,
  Award,
  ShoppingBag,
  Coins,
  Users,
  Eye,
  CheckCircle,
  MapPin,
  Flame,
  Tv,
  HelpCircle,
  RefreshCw,
  Plus,
  Compass,
  Check
} from "lucide-react";

// Web Audio API Retro synthesizer
const playSound = (type: "boop" | "success" | "viral" | "click" | "levelUp") => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "click") {
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === "boop") {
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === "levelUp") {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === "viral") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(261.63, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.6);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.65);
      osc.start();
      osc.stop(ctx.currentTime + 0.65);
    } else if (type === "success") {
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch (e) {
    // browser blocked audio node initially
  }
};

const HUMOROUS_LOADING_MESSAGES = [
  "Mariama Kujabi está peinando a la fiera...",
  "Ajustando los focos de neón en el estudio...",
  "Intentando que no se coman el micrófono de ambiente...",
  "Añadiendo filtros de purpurina hiperrealistas...",
  "Sobornando a los jueces con deliciosos snacks de ternera...",
  "Simulando el algoritmo de TikTok de Vecindario...",
  "Generando millones de comentarios cariñosos en directo...",
  "Limpiando las babas de la lente de la cámara principal..."
];

const BACKDROPS = [
  { id: "neon", label: "Estudio Neón 🪩", css: "bg-gradient-to-tr from-purple-900 via-slate-900 to-pink-900" },
  { id: "plaza", label: "Avenida Canarias 🌴", css: "bg-gradient-to-tr from-sky-400 via-amber-200 to-cyan-300 text-slate-800" },
  { id: "cozy", label: "Guardería Relax 🛋️", css: "bg-gradient-to-tr from-amber-900/60 via-amber-950 to-orange-950" },
  { id: "matrix", label: "Código Matrix de Gatitos 👾", css: "bg-gradient-to-b from-black via-zinc-950 to-green-950" }
];

interface Achievement {
  id: string;
  title: string;
  description: string;
  reward: number;
  conditionMsg: string;
  isUnlocked: boolean;
}

export default function App() {
  // Game states loading from local storage
  const [pets, setPets] = useState<Pet[]>(() => {
    const local = localStorage.getItem("pet_daycare_stars_pets");
    return local ? JSON.parse(local) : INITIAL_PETS;
  });

  const [selectedPetId, setSelectedPetId] = useState<string>(pets[0]?.id || "");
  const [selectedFormatId, setSelectedFormatId] = useState<string>(CAMPAIGN_FORMATS[0].id);
  const [famePoints, setFamePoints] = useState<number>(() => {
    const local = localStorage.getItem("pet_daycare_stars_fame");
    return local ? parseInt(local) : 300; // Gift 300 Fame Points for easy starting!
  });

  const [unlockedOutfits, setUnlockedOutfits] = useState<string[]>(() => {
    const local = localStorage.getItem("pet_daycare_stars_outfits");
    return local ? JSON.parse(local) : ["Ninguno", "Lazo de Seda de Vecindario"];
  });

  const [globalViews, setGlobalViews] = useState<number>(() => {
    const local = localStorage.getItem("pet_daycare_stars_views");
    return local ? parseInt(local) : 18500;
  });

  const [viralCount, setViralCount] = useState<number>(() => {
    const local = localStorage.getItem("pet_daycare_stars_count");
    return local ? parseInt(local) : 2;
  });

  // UI state
  const [filter, setFilter] = useState<"todos" | "perro" | "gato" | "otros">("todos");
  const [activeBackdropId, setActiveBackdropId] = useState<string>("neon");
  const [isViralizing, setIsViralizing] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(HUMOROUS_LOADING_MESSAGES[0]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [viralResult, setViralResult] = useState<ViralResult | null>(null);
  const [lastNotification, setLastNotification] = useState<string | null>(null);
  const [customPetName, setCustomPetName] = useState("");
  const [customPetSpecies, setCustomPetSpecies] = useState<"perro" | "gato" | "ave" | "hurón" | "conejo">("perro");
  const [customPetPersonality, setCustomPetPersonality] = useState("");
  const [showAddPet, setShowAddPet] = useState(false);

  // Auto-save game loop
  useEffect(() => {
    localStorage.setItem("pet_daycare_stars_pets", JSON.stringify(pets));
    localStorage.setItem("pet_daycare_stars_fame", famePoints.toString());
    localStorage.setItem("pet_daycare_stars_outfits", JSON.stringify(unlockedOutfits));
    localStorage.setItem("pet_daycare_stars_views", globalViews.toString());
    localStorage.setItem("pet_daycare_stars_count", viralCount.toString());
  }, [pets, famePoints, unlockedOutfits, globalViews, viralCount]);

  // Handle active pet selection helper
  const activePet = pets.find((p) => p.id === selectedPetId) || pets[0];
  const selectedFormat = CAMPAIGN_FORMATS.find((f) => f.id === selectedFormatId) || CAMPAIGN_FORMATS[0];

  // Train a pet (no cooldown, just boop animation with floating sparkles)
  const handleTrainPet = (stat: "charisma" | "style" | "talent") => {
    playSound("click");
    setPets((prev) =>
      prev.map((p) => {
        if (p.id === selectedPetId) {
          const currentVal = p[stat];
          if (currentVal >= 100) {
            setLastNotification(`¡${p.name} tiene la estadística de ${stat} al máximo (100)!`);
            setTimeout(() => setLastNotification(null), 3000);
            return p;
          }
          const bonus = 5;
          const newVal = Math.min(currentVal + bonus, 100);
          
          if (newVal === 100) {
            playSound("levelUp");
            setLastNotification(`¡LOGRO SENSACIONAL INDIVIDUAL! ${p.name} ha alcanzado 100 en ${stat}!`);
            setTimeout(() => setLastNotification(null), 5000);
          } else {
            playSound("boop");
          }

          return { ...p, [stat]: newVal };
        }
        return p;
      })
    );
  };

  // Create customized pet
  const handleCreatePet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPetName.trim()) return;

    const emojiMap = {
      perro: "🐶",
      gato: "🐱",
      ave: "🦜",
      hurón: "🦦",
      conejo: "🐰"
    };

    const newPet: Pet = {
      id: "custom_" + Date.now(),
      name: customPetName.trim(),
      species: customPetSpecies,
      emoji: emojiMap[customPetSpecies],
      personality: customPetPersonality.trim() || "Mascota alegre criada en las calles de Vecindario.",
      charisma: Math.floor(Math.random() * 25) + 20,
      style: Math.floor(Math.random() * 25) + 15,
      talent: Math.floor(Math.random() * 25) + 20,
      followers: 100,
      activeOutfit: null,
      unlockedOutfits: ["Ninguno"]
    };

    setPets((prev) => [...prev, newPet]);
    setSelectedPetId(newPet.id);
    setCustomPetName("");
    setCustomPetPersonality("");
    setShowAddPet(false);
    playSound("success");
    setLastNotification(`¡Bienvenido/a a la guardería, ${newPet.name}! Que empiece el entrenamiento.`);
    setTimeout(() => setLastNotification(null), 4000);
  };

  // Buy accessory item
  const handleBuyOutfit = (outfit: OutfitItem) => {
    if (famePoints >= outfit.price) {
      playSound("success");
      setFamePoints((prev) => prev - outfit.price);
      setUnlockedOutfits((prev) => [...prev, outfit.name]);
      
      // Update the active pet's available wardrobe list
      setPets((prev) =>
        prev.map((p) => {
          if (p.id === selectedPetId) {
            const currentUnlocked = [...p.unlockedOutfits];
            if (!currentUnlocked.includes(outfit.name)) {
              currentUnlocked.push(outfit.name);
            }
            return { ...p, unlockedOutfits: currentUnlocked };
          }
          return p;
        })
      );

      setLastNotification(`💥 ¡COMPRADO! Adquiriste ${outfit.name}. Ya puedes equiparlo.`);
      setTimeout(() => setLastNotification(null), 4500);
    }
  };

  // Equip unlocked Accessory
  const handleEquipOutfit = (outfitName: string) => {
    playSound("boop");
    
    // Find outfit bonus
    const outfitObj = AVAILABLE_OUTFITS.find((o) => o.name === outfitName);
    const charismaBonus = outfitObj?.statBonus.charisma || 0;
    const styleBonus = outfitObj?.statBonus.style || 0;
    const talentBonus = outfitObj?.statBonus.talent || 0;

    setPets((prev) =>
      prev.map((p) => {
        if (p.id === selectedPetId) {
          // If already has an outfit, we unequip it first safely to avoid infinite stats piling
          const basePet = INITIAL_PETS.find((bp) => bp.name === p.name) || p;
          
          return {
            ...p,
            activeOutfit: outfitName,
            charisma: Math.min(basePet.charisma + charismaBonus + 10, 100), // add bonus to training value but limit to 100
            style: Math.min(basePet.style + styleBonus + 10, 100),
            talent: Math.min(basePet.talent + talentBonus + 10, 100)
          };
        }
        return p;
      })
    );

    setLastNotification(`🕶️ ${activePet.name} ahora viste "${outfitName}" (+Bonus Estilazo).`);
    setTimeout(() => setLastNotification(null), 4000);
  };

  // Unequip Accessory
  const handleUnequipOutfit = () => {
    playSound("click");
    setPets((prev) =>
      prev.map((p) => {
        if (p.id === selectedPetId) {
          return {
            ...p,
            activeOutfit: null,
            style: Math.max(p.style - 15, 10) // shrink back standard bonus safely
          };
        }
        return p;
      })
    );
  };

  // Record video, calculate viral reach through Gemini API proxy
  const handleViralize = async () => {
    if (isViralizing) return;
    setIsViralizing(true);
    setLoadingProgress(5);
    setLoadingMsg(HUMOROUS_LOADING_MESSAGES[0]);

    // Simulated camera record status interval
    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        // Change humorous messages along the track
        if (prev % 25 === 0) {
          const randomIndex = Math.floor(Math.random() * HUMOROUS_LOADING_MESSAGES.length);
          setLoadingMsg(HUMOROUS_LOADING_MESSAGES[randomIndex]);
        }
        return prev + 5;
      });
    }, 180);

    try {
      // Call Express server-side Gemini generation route
      const response = await fetch("/api/viralizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pet: {
            name: activePet.name,
            species: activePet.species,
            personality: activePet.personality,
            charisma: activePet.charisma,
            style: activePet.style,
            talent: activePet.talent
          },
          format: {
            title: selectedFormat.title,
            platform: selectedFormat.platform,
            description: selectedFormat.description
          },
          ownerName: "Mariama Kujabi",
          location: "Vecindario",
          currentFollowers: activePet.followers
        })
      });

      if (!response.ok) {
        throw new Error("La producción se detuvo debido a un problema de iluminación (Error backend).");
      }

      const rawResult = await response.json();
      clearInterval(progressInterval);
      setLoadingProgress(100);

      // Successfully viralized! Update state metrics
      setTimeout(() => {
        setViralResult(rawResult);
        setIsViralizing(false);
        setGlobalViews((prev) => prev + rawResult.views);
        setViralCount((prev) => prev + 1);

        // Update active pet followers & reward points
        setPets((prev) =>
          prev.map((p) => {
            if (p.id === selectedPetId) {
              return { ...p, followers: p.followers + rawResult.followersGained };
            }
            return p;
          })
        );

        // Fame Points awarded matches 25% of gained followers
        const rewardBonus = Math.round(rawResult.followersGained * 0.25);
        setFamePoints((prev) => prev + rewardBonus);
      }, 500);

    } catch (err: any) {
      clearInterval(progressInterval);
      setIsViralizing(false);
      console.error(err);
      
      // Fallback robust offline/mock generation in case fetch or remote endpoints fail
      const randomViews = Math.floor(Math.random() * 8000) + 1500;
      const randomLikes = Math.round(randomViews * 0.12);
      const randomShares = Math.round(randomLikes * 0.22);
      const randomFollowers = Math.round(randomViews * 0.04);

      const localFallbackResult: ViralResult = {
        title: `🔥 ¡${activePet.name} causa sensación en Vecindario con su baile! 🌟`,
        script: `Se ve a ${activePet.name} luciendo un carisma asombroso de ${activePet.charisma}% en un video tomado en el local de Mariama en Vecindario. La audiencia estalló en corazones.`,
        views: randomViews,
        likes: randomLikes,
        shares: randomShares,
        followersGained: randomFollowers,
        comments: [
          { user: "@vecindario_fan", text: "¡Qué maravilla, siempre voy a esa guardería!" },
          { user: "@influencer_canino", text: "¡Alucinante ese flow que tiene! 🐶❤️" },
          { user: "@miau_stars", text: "Mucha elegancia y estilo." }
        ],
        academyReport: `📝 Mariama Kujabi evalúa: "¡Buen esfuerzo! El talento de ${activePet.name} va en la dirección perfecta. Sigue ensayando cotidianamente."`
      };

      setViralResult(localFallbackResult);
      setGlobalViews((prev) => prev + localFallbackResult.views);
      setViralCount((prev) => prev + 1);
      
      setPets((prev) =>
        prev.map((p) => {
          if (p.id === selectedPetId) {
            return { ...p, followers: p.followers + localFallbackResult.followersGained };
          }
          return p;
        })
      );
      setFamePoints((prev) => prev + Math.round(localFallbackResult.followersGained * 0.25));
    }
  };

  // Filter local pet list matches sidebar selection
  const filteredPets = pets.filter((pet) => {
    if (filter === "todos") return true;
    if (filter === "otros") return pet.species !== "perro" && pet.species !== "gato";
    return pet.species === filter;
  });

  // Calculate global stats of current academy
  const totalFollowers = pets.reduce((sum, p) => sum + p.followers, 0);

  // Compute game achievements live based on state
  const achievementsList: Achievement[] = [
    {
      id: "ach_1",
      title: "Estrella de Barrio 🏆",
      description: "Logra acumular más de 10,000 seguidores en total en tu guardería.",
      reward: 300,
      conditionMsg: `${totalFollowers.toLocaleString()}/10,000`,
      isUnlocked: totalFollowers >= 10000
    },
    {
      id: "ach_2",
      title: "Colección de Gala Vecindario 👗",
      description: "Adquiere un total de 4 accesorios o más en la Boutique.",
      reward: 150,
      conditionMsg: `${unlockedOutfits.length - 1}/3 accesorios`,
      isUnlocked: unlockedOutfits.length >= 4
    },
    {
      id: "ach_3",
      title: "Éxito Arrollador 🌟",
      description: "Supera las 25,000 visualizaciones totales estimadas.",
      reward: 500,
      conditionMsg: `${globalViews.toLocaleString()}/25,000 vistas`,
      isUnlocked: globalViews >= 25000
    },
    {
      id: "ach_4",
      title: "Academia Élite ⭐",
      description: "Sube cualquier estadística de una mascota a 100 de puntuación.",
      reward: 250,
      conditionMsg: "Sube Carisma, Estilo o Talento a 100",
      isUnlocked: pets.some((p) => p.charisma >= 100 || p.style >= 100 || p.talent >= 100)
    }
  ];

  const backdropDetails = BACKDROPS.find((b) => b.id === activeBackdropId) || BACKDROPS[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col antialiased">
      {/* Interactive top notification bar */}
      <AnimatePresence>
        {lastNotification && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-amber-300/30 text-amber-200 px-6 py-3 rounded-full shadow-2xl flex items-center gap-2.5 font-sans font-semibold text-xs text-center"
          >
            <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
            <span>{lastNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Academy Header */}
      <header className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-indigo-900 py-6 px-4 sm:px-8 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo & Founder Presentation tag */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-amber-400/10 text-amber-300 font-bold px-3 py-1 rounded-full text-xs border border-amber-300/20 mb-2">
              <MapPin className="h-3.5 w-3.5" />
              <span>Sede Central: Vecindario, Gran Canaria</span>
            </div>
            
            <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-indigo-200 flex items-center justify-center md:justify-start gap-2.5">
              <span>Guardería Mascotas Estrellas 🐾</span>
            </h1>

            <p className="text-xs sm:text-sm text-gray-300 font-medium mt-1">
              Directora de Estilo y Academia: <strong className="text-white">Mariama Kujabi</strong>. El hogar definitivo de los nuevos influencers de internet.
            </p>
          </div>

          {/* Quick Academy Stats Panel */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            
            {/* Total Followers across state */}
            <div className="bg-black/35 rounded-2xl border border-white/5 px-4 py-2.5 text-center min-w-[110px]">
              <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Seguidores</span>
              <span className="text-lg font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 flex items-center justify-center gap-1">
                <Users className="h-4.5 w-4.5 text-emerald-400" /> {totalFollowers.toLocaleString()}
              </span>
            </div>

            {/* Global simulated views */}
            <div className="bg-black/35 rounded-2xl border border-white/5 px-4 py-2.5 text-center min-w-[110px]">
              <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Visualizaciones</span>
              <span className="text-lg font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300 flex items-center justify-center gap-1">
                <Eye className="h-4.5 w-4.5 text-cyan-400" /> {globalViews.toLocaleString()}
              </span>
            </div>

            {/* Career Coins Wallet display */}
            <div className="bg-amber-400 text-slate-900 rounded-2xl px-5 py-2 text-center min-w-[120px] shadow-lg shadow-amber-400/10">
              <span className="block text-[9px] uppercase font-black tracking-widest text-slate-800">Fame Points</span>
              <span className="text-xl font-mono font-black flex items-center justify-center gap-1 text-slate-950">
                <Coins className="h-5 w-5" /> {famePoints.toLocaleString()}
              </span>
            </div>

          </div>
        </div>
      </header>

      {/* Main Panel Content Workspace - Grid of columns */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* 1. Pet Training Academy Showcase - Left Side Column (Col-4) */}
        <section className="lg:col-span-4 flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <h2 className="font-display font-black text-xl text-slate-800 flex items-center gap-2">
              🐾 Mascotas en Guardería
            </h2>
            <div className="flex bg-gray-100 rounded-lg p-0.5 text-xs text-gray-500">
              <button
                onClick={() => setFilter("todos")}
                className={`px-2 py-1 rounded-md font-semibold transition-colors ${filter === "todos" ? "bg-white text-slate-900 shadow-sm" : "hover:text-slate-800"}`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilter("perro")}
                className={`px-2 py-1 rounded-md font-semibold transition-colors ${filter === "perro" ? "bg-white text-slate-900 shadow-sm" : "hover:text-slate-800"}`}
              >
                🐶
              </button>
              <button
                onClick={() => setFilter("gato")}
                className={`px-2 py-1 rounded-md font-semibold transition-colors ${filter === "gato" ? "bg-white text-slate-900 shadow-sm" : "hover:text-slate-800"}`}
              >
                🐱
              </button>
              <button
                onClick={() => setFilter("otros")}
                className={`px-2 py-1 rounded-md font-semibold transition-colors ${filter === "otros" ? "bg-white text-slate-900 shadow-sm" : "hover:text-slate-800"}`}
              >
                Otros
              </button>
            </div>
          </div>

          {/* Quick Pet List Column */}
          <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1">
            {filteredPets.length > 0 ? (
              filteredPets.map((pet) => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  isSelected={pet.id === selectedPetId}
                  onSelect={() => {
                    playSound("click");
                    setSelectedPetId(pet.id);
                  }}
                  onTrain={(stat) => handleTrainPet(stat)}
                />
              ))
            ) : (
              <div className="bg-white border text-center p-8 rounded-2xl text-gray-400 text-sm">
                No hay mascotas en esta categoría de guardería.
              </div>
            )}
          </div>

          {/* Add Custom Pet Form panel toggler */}
          <div className="bg-slate-100/50 rounded-2xl border border-slate-200/60 p-4">
            {!showAddPet ? (
              <button
                id="toggle-add-pet"
                onClick={() => {
                  playSound("click");
                  setShowAddPet(true);
                }}
                className="w-full bg-white hover:bg-slate-50 text-slate-800 border-2 border-dashed border-gray-300 hover:border-amber-400 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-xs"
              >
                <Plus className="h-4 w-4" /> Registrar Nueva Mascota
              </button>
            ) : (
              <form onSubmit={handleCreatePet} className="space-y-3.5 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-700 font-display">Ingreso a la Academia</span>
                  <button
                    type="button"
                    onClick={() => setShowAddPet(false)}
                    className="text-xs text-gray-400 hover:text-gray-600 block bg-slate-200 px-2 py-0.5 rounded"
                  >
                    Cancelar
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Nombre de la Mascota</label>
                  <input
                    type="text"
                    required
                    value={customPetName}
                    onChange={(e) => setCustomPetName(e.target.value)}
                    placeholder="Ej. Mimi Bombón, Tedy El Travieso..."
                    className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Especie</label>
                    <select
                      value={customPetSpecies}
                      onChange={(e: any) => setCustomPetSpecies(e.target.value)}
                      className="w-full text-xs px-2.5 py-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-amber-400 select-none"
                    >
                      <option value="perro">🐶 Perro</option>
                      <option value="gato">🐱 Gato</option>
                      <option value="ave">🦜 Ave</option>
                      <option value="hurón">🦦 Hurón</option>
                      <option value="conejo">🐰 Conejo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Personalidad</label>
                    <input
                      type="text"
                      value={customPetPersonality}
                      onChange={(e) => setCustomPetPersonality(e.target.value)}
                      placeholder="Ej. Bailarina tímida"
                      className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-lg text-xs transition-colors"
                >
                  Confirmar Admisión
                </button>
              </form>
            )}
          </div>
        </section>

        {/* 2. Recording Camera & Campaign Studio - Center Column (Col-5) */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex-1 flex flex-col justify-between">
            
            {/* Camera Frame Preview Top Info */}
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2.5">
                <div>
                  <h3 className="font-display font-bold text-gray-800 text-lg flex items-center gap-2">
                    <Video className="h-5 w-5 text-indigo-600 animate-pulse" /> Estudio de Grabación Viral
                  </h3>
                  <p className="text-[10px] text-gray-400">Canal Directo de {activePet.name} en Vecindario</p>
                </div>
                <div className="flex bg-slate-100 rounded-lg p-0.5 text-[10px] font-bold text-slate-600">
                  <span className="px-1.5 py-0.5 bg-indigo-600 text-white rounded">Live Feed</span>
                </div>
              </div>

              {/* Live Styled Camcorder Frame box */}
              <div className={`relative h-64 rounded-xl overflow-hidden border border-slate-700 flex flex-col justify-between p-3 ${backdropDetails.css} shadow-inner`}>
                
                {/* Simulated Lens Coordinates lines (Humor-Free & fully polished) */}
                <div className="absolute inset-0 border border-white/5 pointer-events-none rounded-xl" />

                {/* Camcorder Status Tag line */}
                <div className="flex justify-between items-center text-[10px] font-semibold text-white/80 z-10 select-none">
                  <span className="flex items-center gap-1.5 font-mono">
                    <span className="h-2 w-2 bg-red-500 rounded-full inline-block animate-ping" />
                    CAM-2 INFLUENCER
                  </span>
                  <span className="bg-black/40 backdrop-blur px-2 py-0.5 rounded text-[9px] uppercase font-bold border border-white/10">
                    Sede Vecindario
                  </span>
                </div>

                {/* Selected Pet Giant Bouncing Animated Emoji in Studio backdrop */}
                <div className="flex-1 flex flex-col justify-center items-center relative gap-2">
                  <motion.div
                    animate={{
                      y: [0, -15, 0],
                      scale: [1, 1.12, 1],
                      rotate: [-5, 5, -5]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.8,
                      ease: "easeInOut"
                    }}
                    className="text-8 shadow-2xl relative select-none cursor-pointer text-7xl select-none"
                    title={`¡Da un toque de mimos a ${activePet.name}!`}
                    onClick={() => handleTrainPet("charisma")}
                  >
                    {activePet.emoji}
                  </motion.div>

                  {/* Equipped Outfit overlay look inside the live camera feed */}
                  {activePet.activeOutfit && (
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ repeat: Infinity, duration: 1.8 }}
                      className="text-[10px] font-extrabold bg-amber-400 text-slate-900 border border-white/40 px-3 py-1.5 rounded-full select-none shadow animate-pulse -mt-1.5"
                    >
                      ⭐ Vistiendo: {activePet.activeOutfit}
                    </motion.div>
                  )}
                </div>

                {/* Canvas Background toggle selectors */}
                <div className="flex gap-1.5 justify-center z-10 w-full flex-wrap">
                  {BACKDROPS.map((backdrop) => (
                    <button
                      key={backdrop.id}
                      onClick={() => {
                        playSound("click");
                        setActiveBackdropId(backdrop.id);
                      }}
                      className={`text-[9px] font-bold px-2 py-1.5 rounded transition-all border ${
                        activeBackdropId === backdrop.id
                          ? "bg-white text-slate-900 border-white shadow-sm scale-102"
                          : "bg-black/60 text-white/80 border-white/10 hover:bg-black/80"
                      }`}
                    >
                      {backdrop.label.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Campaign Video Idea Pick Form List */}
              <div className="mt-5 text-left">
                <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">
                  📋 Selecciona el Contenido del Show
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                  {CAMPAIGN_FORMATS.map((fmt) => {
                    const isFocusMatch = activePet[fmt.statFocus] >= fmt.minStatRequired;

                    return (
                      <div
                        key={fmt.id}
                        onClick={() => {
                          playSound("click");
                          setSelectedFormatId(fmt.id);
                        }}
                        className={`p-3 rounded-xl border-2 transition-all cursor-pointer text-left flex flex-col justify-between ${
                          selectedFormatId === fmt.id
                            ? "border-indigo-600 bg-indigo-50/60 shadow-inner"
                            : "border-gray-150 bg-slate-50 hover:bg-slate-100"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 text-left mb-1">
                            <span className="bg-indigo-100 text-indigo-800 px-1.5 rounded uppercase leading-none py-0.5">
                              {fmt.platform}
                            </span>
                            <span className="capitalize text-slate-500">
                              Enfoque: {fmt.statFocus === "charisma" ? "Carisma" : fmt.statFocus === "style" ? "Estilo" : "Talento"}
                            </span>
                          </div>
                          <h4 className="font-bold text-gray-800 text-xs leading-tight">{fmt.title}</h4>
                          <p className="text-[10px] text-gray-500 leading-snug mt-1 italic block line-clamp-2">
                            "{fmt.description}"
                          </p>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-gray-200/50 flex items-center justify-between">
                          <span className="text-[9px] text-gray-400 font-mono">
                            Multiplicador de Fama: <strong className="text-slate-700">{fmt.multiplier}x</strong>
                          </span>
                          <span
                            className={`text-[9.5px] font-extrabold px-1.5 rounded ${
                              isFocusMatch
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {isFocusMatch ? "¡Óptimo!" : "Arriesgado"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Simulated Recording Production CTA Button */}
            <div className="mt-6 border-t border-gray-100 pt-4">
              {isViralizing ? (
                <div className="space-y-3.5 py-4 px-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-center animate-pulse">
                  <div className="flex items-center justify-center gap-2 text-indigo-800 text-xs font-bold">
                    <RefreshCw className="h-4 w-4 text-indigo-600 animate-spin" />
                    <span>PRODUCIENDO CONTENIDO VIRAL...</span>
                  </div>
                  <p className="text-xs text-indigo-700 font-medium italic">"{loadingMsg}"</p>
                  
                  {/* Real-time bar percentage */}
                  <div className="h-2 w-full bg-indigo-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 transition-all duration-200 rounded-full"
                      style={{ width: `${loadingProgress}%` }}
                    />
                  </div>
                  <span className="block text-[10px] text-indigo-400 font-bold font-mono">{loadingProgress}% Completado</span>
                </div>
              ) : (
                <button
                  id="record-video-cta"
                  onClick={handleViralize}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/10 active:scale-[0.99] text-white font-extrabold py-4 px-6 rounded-2xl text-base tracking-wide shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Video className="h-5 w-5 fill-white" />
                  <span>¡GRABAR & VIRALIZAR A {activePet.name.toUpperCase()}! ✨</span>
                </button>
              )}
            </div>

          </div>
        </section>

        {/* 3. Luxury Boutique Store & Career Goals - Right Side Column (Col-3) */}
        <section className="lg:col-span-3 flex flex-col gap-6">
          {/* Outfitters shop integration */}
          <OutfitStore
            unlockedOutfits={unlockedOutfits}
            famePoints={famePoints}
            activePet={activePet}
            onBuyOutfit={handleBuyOutfit}
            onEquipOutfit={handleEquipOutfit}
            onUnequipOutfit={handleUnequipOutfit}
          />

          {/* Quick achievements Board list */}
          <div id="achievements-card" className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="font-display font-bold text-gray-800 text-base mb-3 border-b border-gray-100 pb-2 flex items-center gap-1.5">
              <Award className="h-5 w-5 text-indigo-650" /> Logros de la Academia
            </h3>

            <div className="space-y-3.5">
              {achievementsList.map((ach) => (
                <div key={ach.id} className="text-left text-xs bg-slate-55 border border-slate-100 rounded-xl p-3">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className={`font-bold text-[11.5px] ${ach.isUnlocked ? "text-emerald-700 line-through" : "text-gray-800"}`}>
                      {ach.title}
                    </h4>
                    {ach.isUnlocked && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.3 rounded border border-emerald-200 flex items-center gap-0.5 whitespace-nowrap">
                        <Check className="h-3 w-3" /> Reclamado
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 leading-snug mt-0.5">{ach.description}</p>
                  
                  <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-500">Progreso: <strong>{ach.conditionMsg}</strong></span>
                    <span className="font-bold text-amber-600 bg-amber-50 px-1 rounded">+{ach.reward} ⭐</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* Simulated Smartphone Popup overlay modal once viral completes */}
      <AnimatePresence>
        {viralResult && (
          <PhonePreview
            result={viralResult}
            pet={activePet}
            platform={selectedFormat.platform}
            onClose={() => {
              playSound("success");
              setViralResult(null);
            }}
            playWinSound={() => playSound("viral")}
          />
        )}
      </AnimatePresence>

      {/* Humble professional academy footer (No Margin Clutter, only clean layout) */}
      <footer className="mt-auto py-8 bg-slate-100 border-t border-gray-200 text-center text-xs text-gray-400 font-sans max-w-7xl w-full mx-auto px-4">
        <p className="mb-1 leading-normal">
          © {new Date().getFullYear()} Escuela & Guardería Mascotas Estrellas Vecindario. Todos los derechos reservados.
        </p>
        <p className="font-medium text-gray-400 max-w-lg mx-auto leading-relaxed">
          Dirigido oficialmente por <strong>Mariama Kujabi</strong> en Vecindario, Gran Canaria. Optimizamos e impulsamos la carrera influencer de caninos y felinos mediante entrenamiento personalizado e Inteligencia Artificial.
        </p>
      </footer>
    </div>
  );
}
