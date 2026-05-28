import React from "react";
import { AVAILABLE_OUTFITS, OutfitItem } from "../data";
import { Pet } from "../types";
import { ShoppingBag, Coins, Check, HelpCircle, Scissors, Award, Activity } from "lucide-react";

interface OutfitStoreProps {
  unlockedOutfits: string[];
  famePoints: number;
  activePet: Pet;
  onBuyOutfit: (outfit: OutfitItem) => void;
  onEquipOutfit: (outfitName: string) => void;
  onUnequipOutfit: () => void;
}

export default function OutfitStore({
  unlockedOutfits,
  famePoints,
  activePet,
  onBuyOutfit,
  onEquipOutfit,
  onUnequipOutfit
}: OutfitStoreProps) {
  return (
    <div id="boutique-container" className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
        <h3 className="font-display font-bold text-gray-800 text-lg flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-amber-500" /> Boutique Estelar
        </h3>
        <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
          <Coins className="h-4 w-4" />
          <span>{famePoints.toLocaleString()} ⭐</span>
        </div>
      </div>

      <div className="mb-4 bg-slate-50 border border-slate-100 p-3 rounded-xl text-xs text-slate-600 text-left">
        <p className="font-semibold text-slate-800 mb-0.5">👗 Probador de Mascota:</p>
        <p>
          Viste a <strong>{activePet.name}</strong> para aumentar permanentemente un 100% sus estadísticas de Estilo o Talento. ¡Cuanto más brille, más fácil se hará viral!
        </p>
      </div>

      {/* Outfits List Grid */}
      <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
        {AVAILABLE_OUTFITS.map((outfit) => {
          const isUnlocked = unlockedOutfits.includes(outfit.name);
          const isEquippedOnActive = activePet.activeOutfit === outfit.name;
          const canAfford = famePoints >= outfit.price;

          return (
            <div
              key={outfit.name}
              className={`rounded-xl p-3 border transition-colors ${
                isEquippedOnActive
                  ? "border-amber-400 bg-amber-50/40"
                  : "border-gray-100 bg-slate-50/50 hover:bg-slate-50"
              }`}
            >
              <div className="flex gap-3 text-left">
                {/* Accessory Icon */}
                <div className="h-11 w-11 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-2xl shadow-sm flex-shrink-0">
                  {outfit.icon}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-800 text-xs truncate">{outfit.name}</h4>
                  <p className="text-[10px] text-gray-400 leading-tight mt-0.5">{outfit.description}</p>
                  
                  {/* Stats bonus preview */}
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {outfit.statBonus.style && (
                      <span className="text-[9px] font-semibold bg-cyan-50 text-cyan-600 px-1.5 py-0.2 rounded border border-cyan-100 flex items-center gap-0.5">
                        <Scissors className="h-2.5 w-2.5" /> +{outfit.statBonus.style} Estilo
                      </span>
                    )}
                    {outfit.statBonus.charisma && (
                      <span className="text-[9px] font-semibold bg-amber-50 text-amber-600 px-1.5 py-0.2 rounded border border-amber-100 flex items-center gap-0.5">
                        <Award className="h-2.5 w-2.5" /> +{outfit.statBonus.charisma} Carisma
                      </span>
                    )}
                    {outfit.statBonus.talent && (
                      <span className="text-[9px] font-semibold bg-emerald-50 text-emerald-600 px-1.5 py-0.2 rounded border border-emerald-100 flex items-center gap-0.5">
                        <Activity className="h-2.5 w-2.5" /> +{outfit.statBonus.talent} Talento
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Purchase and equipping buttons */}
              <div className="mt-3 pt-2.5 border-t border-gray-200/50 flex items-center justify-between gap-2">
                {!isUnlocked ? (
                  <>
                    <span className="text-[11px] text-gray-500 font-mono flex items-center gap-0.5">
                      Precio: <span className="font-bold text-amber-600">{outfit.price} ⭐</span>
                    </span>
                    <button
                      id={`buy-${outfit.name.replace(/\s+/g, "-")}`}
                      disabled={!canAfford}
                      onClick={() => onBuyOutfit(outfit)}
                      className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                        canAfford
                          ? "bg-amber-400 text-slate-900 border-amber-400 hover:bg-amber-500 hover:border-amber-500 active:scale-95"
                          : "bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed"
                      }`}
                    >
                      Comprar
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5">
                      <Check className="h-3.5 w-3.5" /> Desbloqueado
                    </span>

                    {isEquippedOnActive ? (
                      <button
                        id={`unequip-${outfit.name.replace(/\s+/g, "-")}`}
                        onClick={onUnequipOutfit}
                        className="text-[10px] font-extrabold px-3 py-1 bg-red-50 text-red-650 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
                      >
                        Quitar
                      </button>
                    ) : (
                      <button
                        id={`equip-${outfit.name.replace(/\s+/g, "-")}`}
                        onClick={() => onEquipOutfit(outfit.name)}
                        className="text-[10px] font-extrabold px-3 py-1 bg-slate-900 text-white hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        Poner
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
