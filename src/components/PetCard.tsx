import React from "react";
import { Pet } from "../types";
import { TrendingUp, Sparkles, Award, Scissors, Activity } from "lucide-react";

export const PetCard: React.FC<{
  pet: Pet;
  isSelected: boolean;
  onSelect: () => void;
  onTrain: (stat: "charisma" | "style" | "talent") => void;
}> = ({ pet, isSelected, onSelect, onTrain }) => {
  // Helpers to assign colors to stats
  const getProgressColor = (val: number) => {
    if (val >= 80) return "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]";
    if (val >= 50) return "bg-cyan-500";
    return "bg-amber-500";
  };

  return (
    <div
      id={`pet-card-${pet.id}`}
      onClick={onSelect}
      className={`relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 cursor-pointer ${
        isSelected
          ? "border-amber-400 bg-amber-50/70 shadow-lg scale-[1.01]"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
      }`}
    >
      {/* Selection Glow Indicator */}
      {isSelected && (
        <div className="absolute top-0 right-0 h-10 w-10 bg-gradient-to-bl from-amber-400/20 to-transparent rounded-bl-3xl flex items-center justify-end pr-2 pt-1">
          <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
        </div>
      )}

      <div className="flex gap-4 items-start">
        {/* Giant Emoji/Avatar Box */}
        <div className="relative flex-shrink-0">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-gray-100 to-amber-50 flex items-center justify-center text-4xl shadow-inner border border-gray-100">
            {pet.emoji}
          </div>
          {pet.activeOutfit && (
            <span className="absolute -bottom-1 -right-1 bg-amber-400 text-white font-bold text-xs px-1.5 py-0.5 rounded-full border border-white shadow-sm flex items-center justify-center gap-0.5">
              <span>🕶️</span>
            </span>
          )}
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <h3 className="font-display font-bold text-gray-800 text-base truncate">
              {pet.name}
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 capitalize">
              {pet.species}
            </span>
          </div>
          <p className="text-xs text-gray-400 italic line-clamp-2 mt-0.5">
            "{pet.personality}"
          </p>

          <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600 font-semibold bg-amber-50 w-fit px-2 py-0.5 rounded-md border border-amber-100">
            <TrendingUp className="h-3 w-3" />
            <span>{pet.followers.toLocaleString()} seguidores</span>
          </div>
        </div>
      </div>

      {/* Stats Section with clean metric progress bars */}
      <div className="mt-4 pt-3 border-t border-gray-100 space-y-2.5">
        {/* Carisma */}
        <div>
          <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
            <span className="flex items-center gap-1">
              <Award className="h-3.5 w-3.5 text-amber-500" /> Carisma
            </span>
            <span>{pet.charisma}/100</span>
          </div>
          <div className="h-2 w-full bg-gray-150 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${getProgressColor(
                pet.charisma
              )}`}
              style={{ width: `${Math.min(pet.charisma, 100)}%` }}
            />
          </div>
        </div>

        {/* Estilo */}
        <div>
          <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
            <span className="flex items-center gap-1">
              <Scissors className="h-3.5 w-3.5 text-cyan-500" /> Estilo
            </span>
            <span>{pet.style}/100</span>
          </div>
          <div className="h-2 w-full bg-gray-150 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${getProgressColor(
                pet.style
              )}`}
              style={{ width: `${Math.min(pet.style, 100)}%` }}
            />
          </div>
        </div>

        {/* Talento */}
        <div>
          <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
            <span className="flex items-center gap-1">
              <Activity className="h-3.5 w-3.5 text-emerald-500" /> Talento
            </span>
            <span>{pet.talent}/100</span>
          </div>
          <div className="h-2 w-full bg-gray-150 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${getProgressColor(
                pet.talent
              )}`}
              style={{ width: `${Math.min(pet.talent, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Training Action Buttons (Quick actions directly on the card to make optimization fast!) */}
      <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-3 gap-1.5">
        <button
          id={`train-charisma-${pet.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onTrain("charisma");
          }}
          className="text-[10px] font-bold py-1.5 px-1 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 flex flex-col items-center justify-center gap-0.5 transition-colors"
          title="Consigue mimos y caricias (+5 Carisma)"
        >
          <span>🧸 Mimos</span>
          <span className="text-[9px] font-medium opacity-80">+5 Car</span>
        </button>

        <button
          id={`train-style-${pet.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onTrain("style");
          }}
          className="text-[10px] font-bold py-1.5 px-1 rounded-lg bg-cyan-50 text-cyan-700 hover:bg-cyan-100 border border-cyan-200 flex flex-col items-center justify-center gap-0.5 transition-colors"
          title="Grooming o sesión de peinado de estrellas (+5 Estilo)"
        >
          <span>💅 Spa VIP</span>
          <span className="text-[9px] font-medium opacity-80">+5 Est</span>
        </button>

        <button
          id={`train-talent-${pet.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onTrain("talent");
          }}
          className="text-[10px] font-bold py-1.5 px-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 flex flex-col items-center justify-center gap-0.5 transition-colors"
          title="Ensayo rítmico o vocal de talentos (+5 Talento)"
        >
          <span>💃 Ensayar</span>
          <span className="text-[9px] font-medium opacity-80">+5 Tal</span>
        </button>
      </div>

      {/* Fitted Outfit Label */}
      {pet.activeOutfit && (
        <div className="mt-2.5 text-[10px] bg-slate-100 text-slate-700 text-center font-semibold rounded px-2 py-0.5 truncate border border-slate-200">
          Accesorio: <span className="text-amber-600">{pet.activeOutfit}</span>
        </div>
      )}
    </div>
  );
};

export default PetCard;
