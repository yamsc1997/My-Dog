import React, { useState, useEffect } from "react";
import { ViralResult, Pet } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { Heart, MessageSquare, Share2, Eye, Award, X, Sparkles, User, BadgeCheck } from "lucide-react";

interface PhonePreviewProps {
  result: ViralResult;
  pet: Pet;
  platform: string;
  onClose: () => void;
  playWinSound: () => void;
}

export default function PhonePreview({ result, pet, platform, onClose, playWinSound }: PhonePreviewProps) {
  const [activeTab, setActiveTab] = useState<"video" | "report">("video");
  const [heartsCount, setHeartsCount] = useState(0);
  const [likesCount, setLikesCount] = useState(result.likes);
  const [floatingHearts, setFloatingHearts] = useState<Array<{ id: number; x: number }>>([]);

  // Trigger win sound when mounting
  useEffect(() => {
    playWinSound();
  }, [playWinSound]);

  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Spawn floating heart
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newHeart = { id: Date.now(), x };
    setFloatingHearts((prev) => [...prev, newHeart]);
    setLikesCount((prev) => prev + 1);
    setHeartsCount((prev) => prev + 1);

    // Remove after 1 second
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1000);
  };

  // Assign look feel depending on selected platform
  const getPlatformColors = () => {
    switch (platform) {
      case "TikTok":
        return {
          bg: "bg-slate-950 text-white",
          accent: "text-rose-500",
          headerBg: "bg-black/40",
          tagBg: "bg-white/10 hover:bg-white/20",
          commentsBg: "bg-slate-900 border-slate-800"
        };
      case "Instagram":
        return {
          bg: "bg-neutral-900 text-white",
          accent: "text-pink-500",
          headerBg: "bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-amber-900/40",
          tagBg: "bg-pink-500/20 text-pink-300 hover:bg-pink-500/30",
          commentsBg: "bg-neutral-800 border-neutral-700"
        };
      default: // YouTube
        return {
          bg: "bg-zinc-900 text-white",
          accent: "text-red-500",
          headerBg: "bg-red-950/40",
          tagBg: "bg-red-500/20 text-red-350 hover:bg-red-500/30",
          commentsBg: "bg-zinc-800 border-zinc-700"
        };
    }
  };

  const colors = getPlatformColors();

  return (
    <div
      id="phone-preview-modal"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="w-full max-w-sm md:max-w-2xl bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Left Side: Simulated Phone */}
        <div className="flex-1 max-w-sm mx-auto bg-black p-3 relative flex flex-col min-h-[500px] md:min-h-0">
          
          {/* Simulated Notch / Phone Shell Header */}
          <div className="flex justify-between items-center text-[10px] text-gray-400 px-4 py-1 font-mono">
            <span>17:09 📲</span>
            <div className="w-20 h-4 bg-zinc-800 rounded-full mx-auto" />
            <span className="flex items-center gap-1">5G 🔋 98%</span>
          </div>

          <div className={`flex-1 rounded-2xl ${colors.bg} overflow-hidden flex flex-col relative`}>
            
            {/* Live blinking tag */}
            <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-red-600 text-[10px] font-bold tracking-wider text-white px-2 py-0.5 rounded shadow-lg animate-pulse">
              <span className="h-1.5 w-1.5 bg-white rounded-full" />
              <span>[REC] VIRAL</span>
            </div>

            {/* Platform Tag */}
            <div className="absolute top-2 right-2 z-10 bg-black/60 backdrop-blur text-[10px] font-bold text-amber-300 border border-amber-300/30 px-2 py-0.5 rounded-full shadow">
              🚀 {platform} Mode
            </div>

            {/* Video preview / Pet simulation area */}
            <div
              onClick={handleScreenClick}
              className="relative h-48 bg-gradient-to-tr from-indigo-900 via-purple-900 to-amber-900 flex items-center justify-center cursor-pointer overflow-hidden touch-none"
            >
              <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/30 pointer-events-none" />

              {/* Floating Hearts Animation */}
              <AnimatePresence>
                {floatingHearts.map((heart) => (
                  <motion.div
                    key={heart.id}
                    initial={{ y: 80, opacity: 1, scale: 0.8 }}
                    animate={{ y: -120, opacity: 0, scale: 1.5, rotate: (heart.id % 2 === 0 ? 15 : -15) }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute text-rose-500 font-bold text-3xl pointer-events-none select-none"
                    style={{ left: heart.x - 15 }}
                  >
                    ❤️
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Bouncing pet giant emoji with sparkles */}
              <div className="text-center relative select-none">
                <motion.div
                  animate={{
                    y: [12, -12, 12],
                    scale: [1, 1.05, 1],
                    rotate: [-3, 3, -3]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.2,
                    ease: "easeInOut"
                  }}
                  className="text-7xl drop-shadow-[0_10px_20px_rgba(251,191,36,0.6)] relative z-10"
                >
                  {pet.emoji}
                </motion.div>
                <div className="text-xs bg-black/60 rounded-full px-2.5 py-0.5 mt-2 inline-block font-bold items-center gap-1 border border-white/20">
                  💖 {pet.name}
                </div>
              </div>

              {/* Double click instruction info */}
              <div className="absolute bottom-1 right-2 text-[9px] text-white/50 bg-black/30 px-1.5 rounded pointer-events-none">
                Haz clic para dar ❤️
              </div>
            </div>

            {/* Interactive Tab bar Inside Phone */}
            <div className="flex border-b border-white/10 text-xs text-center font-bold bg-black/20">
              <button
                onClick={() => setActiveTab("video")}
                className={`flex-1 py-2.5 transition-colors ${activeTab === "video" ? "border-b-2 border-amber-400 text-amber-300" : "text-gray-400"}`}
              >
                📹 El Vídeo
              </button>
              <button
                onClick={() => setActiveTab("report")}
                className={`flex-1 py-2.5 transition-colors ${activeTab === "report" ? "border-b-2 border-amber-400 text-amber-300" : "text-gray-400"}`}
              >
                📝 Reporte Mariama
              </button>
            </div>

            {/* Phone Screen body */}
            <div className="flex-1 overflow-y-auto p-3 flex flex-col">
              {activeTab === "video" ? (
                <div className="flex-1 flex flex-col space-y-3">
                  {/* Video Title & Bio */}
                  <div>
                    <h4 className="font-display font-bold text-amber-300 text-sm leading-tight text-left">
                      {result.title}
                    </h4>
                    <p className="text-xs text-left text-gray-300 mt-1 pl-1 border-l border-amber-400/50 italic">
                      {result.script}
                    </p>
                  </div>

                  {/* Viral statistics bar */}
                  <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 text-center font-mono">
                    <div>
                      <span className="block text-gray-400 text-[9px] uppercase tracking-wider">Vistas</span>
                      <span className="text-sm font-bold flex items-center justify-center gap-0.5 text-blue-300">
                        <Eye className="h-3.5 w-3.5 text-blue-400" /> {result.views.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="block text-gray-400 text-[9px] uppercase tracking-wider">Likes</span>
                      <span className="text-xs font-bold flex items-center justify-center gap-0.5 text-rose-300">
                        <Heart className="h-3.5 w-3.5 text-rose-400 fill-rose-500" /> {likesCount.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="block text-gray-400 text-[9px] uppercase tracking-wider">Shares</span>
                      <span className="text-xs font-bold flex items-center justify-center gap-0.5 text-emerald-300">
                        <Share2 className="h-3.5 w-3.5 text-emerald-400" /> {result.shares.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Comments Box */}
                  <div className={`flex-1 rounded-xl p-2.5 border ${colors.commentsBg} flex flex-col`}>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-1.5 flex items-center gap-1 pl-1">
                      <MessageSquare className="h-3 w-3" /> Chat de la Comunidad ({result.comments.length})
                    </p>
                    <div className="space-y-1.5 flex-1 overflow-y-auto text-xs">
                      {result.comments.map((comment, idx) => (
                        <div key={idx} className="bg-black/25 rounded p-1.5 text-left border border-white/5">
                          <span className="font-semibold text-rose-300 text-[11px] block">{comment.user}</span>
                          <span className="text-gray-200">{comment.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col space-y-3 justify-between">
                  {/* Mariama's Official Evaluation Grade card */}
                  <div className="bg-slate-900 border border-amber-300/30 rounded-xl p-4 text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-lg">
                        🌴
                      </div>
                      <div>
                        <h5 className="font-display font-medium text-xs text-amber-300 uppercase tracking-wide">
                          Mascotas Estrellas Vecindario
                        </h5>
                        <p className="text-[10px] text-gray-400">Firmado por Mariama Kujabi</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-200 leading-relaxed bg-black/30 p-3 rounded-lg border border-white/5">
                      "{result.academyReport}"
                    </p>
                  </div>

                  {/* Highlights and levels */}
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-left space-y-2">
                    <h6 className="text-[11px] uppercase tracking-wider font-bold text-gray-400 flex items-center gap-1">
                      <Award className="h-3.5 w-3.5 text-amber-400" /> Beneficios del Éxito
                    </h6>
                    <div className="text-xs space-y-1 bg-black/20 p-2 rounded border border-white/5">
                      <div className="flex justify-between items-center text-emerald-400 font-bold">
                        <span>Seguidores ganados:</span>
                        <span>+{result.followersGained.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-amber-400 font-bold">
                        <span>Puntos de Fama extra:</span>
                        <span>+{(result.followersGained * 0.25).toFixed(0)} ⭐</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-gray-400 text-center uppercase tracking-wide">
                    Guardería situada en Vecindario (Gran Canaria)
                  </div>
                </div>
              )}
            </div>

            {/* Bottom notification indicator */}
            <div className="bg-amber-400 text-slate-900 font-bold text-xs py-2 text-center select-none shadow">
              🚀 Ganado: <strong>+{result.followersGained.toLocaleString()} seguidores</strong>
            </div>

          </div>
        </div>

        {/* Right Side: Desktop Presentation, summary scorecard and buttons */}
        <div className="flex-1 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-700 bg-slate-950/80">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 rounded text-[10px] bg-amber-400 text-slate-900 uppercase font-black tracking-widest">
                ¡Éxito Viral!
              </span>
              <span className="text-gray-400 text-xs">Mánager: Mariama</span>
            </div>

            <h3 className="font-display font-bold text-2xl text-white mr-4 leading-tight mb-2">
              ¡{pet.name} ha reventado las redes!
            </h3>

            <p className="text-sm text-gray-300 leading-relaxed mb-4">
              La campaña de <strong>{platform}</strong> grabada en las instalaciones de Vecindario alcanzó grandes picos de popularidad. Los vecinos y la comunidad de internet están reaccionando con entusiasmo.
            </p>

            {/* Detailed numeric scorecard */}
            <div className="space-y-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-sm">
                <span className="text-gray-400">Mascota Académica:</span>
                <span className="font-bold text-amber-300 flex items-center gap-1 font-display">
                  {pet.emoji} {pet.name}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Formato del Video:</span>
                <span className="font-bold text-gray-200">{result.title}</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-2">
                <span className="text-gray-400">Total de visitas en Vecindario:</span>
                <span className="text-cyan-400 font-mono font-bold text-lg">{result.views.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Directora de la Obra:</span>
                <span className="font-bold text-emerald-400 flex items-center gap-0.5">
                  <BadgeCheck className="h-4 w-4 text-emerald-400" /> Mariama Kujabi
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="bg-amber-400/10 text-amber-300 rounded-lg p-3 text-xs border border-amber-300/20 text-center">
              ⭐ Se han acreditado los seguidores nuevos a {pet.name} y recibido <strong>+{Math.round(result.followersGained * 0.25)} Fame Points</strong> de patrocinador.
            </div>

            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 active:scale-95 text-slate-900 font-bold py-3 px-5 rounded-xl shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 transition-all text-base flex items-center justify-center gap-2"
            >
              <Sparkles className="h-5 w-5 text-slate-900" />
              <span>Cerrar y Reclamar Recompensa</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
