import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  Utensils, 
  ShoppingCart, 
  Languages, 
  MessageCircle,
  Sparkles,
  User,
  Users
} from 'lucide-react';
import { CardData, Player, GameMode } from './types.ts';
import { soundManager } from './sound.ts';

interface PaperSlipProps {
  mode: GameMode;
  card: CardData;
  activePlayer: Player;
  onNextTurn: () => void;
  cardIndex: number;
  totalCards: number;
}

export const PaperSlip: React.FC<PaperSlipProps> = ({
  mode,
  card,
  activePlayer,
  onNextTurn,
  cardIndex,
  totalCards
}) => {
  const isSolo = mode === 'solo';
  const isGayane = activePlayer === 'Gayane';
  const playerLevel = card.level || (isGayane ? 'A2' : 'A1');
  const nextPlayer = isGayane ? 'Razmik' : 'Gayane';

  const playerTheme = isGayane 
    ? {
        name: 'Gayane',
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-300',
        accent: 'from-rose-500 to-pink-500',
        activeRing: 'ring-rose-400'
      }
    : {
        name: 'Razmik',
        bg: 'bg-amber-50',
        text: 'text-amber-800',
        border: 'border-amber-300',
        accent: 'from-amber-500 to-orange-500',
        activeRing: 'ring-amber-400'
      };

  const [isQuestionArmOpen, setIsQuestionArmOpen] = useState(false);
  const [areOptionsVisible, setAreOptionsVisible] = useState(false);
  const [openOptionArm, setOpenOptionArm] = useState<Record<number, boolean>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  const toggleQuestionArm = () => {
    soundManager.playClickTone();
    setIsQuestionArmOpen(prev => !prev);
  };

  const handleShowOptions = () => {
    soundManager.playRevealChime();
    setAreOptionsVisible(true);
  };

  const toggleOptionArm = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playClickTone();
    setOpenOptionArm(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleSpeak = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSpeakingText(text);
    soundManager.speakSpanish(text, () => {
      setSpeakingText(null);
    });
  };

  const isRestaurante = card.topic === 'restaurante';

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-3 sm:py-5">
      {/* Top Banner with Player & Level */}
      <div className="flex items-center justify-between mb-3.5">
        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border ${playerTheme.bg} ${playerTheme.border} ${playerTheme.text} font-bold text-xs sm:text-sm shadow-xs`}>
          <span className={`w-2.5 h-2.5 rounded-full ${isGayane ? 'bg-rose-500' : 'bg-amber-500'} ${isSolo ? '' : 'animate-pulse'}`} />
          {isSolo ? (
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-stone-500" />
              <span>{activePlayer}</span>
              <span className="text-stone-300 font-normal">|</span>
              <span className="text-[11px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-white/90 border border-stone-200">
                Nivel {playerLevel}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-stone-500" />
              <span>Turno de {activePlayer}</span>
              <span className="text-[11px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-white/90 border border-stone-200">
                {playerLevel}
              </span>
              <span className="text-stone-300 font-normal">|</span>
              <span className="text-xs font-medium text-stone-500">
                {isGayane ? 'Գայանեի հերթը' : 'Ռազմիկի հերթը'}
              </span>
            </div>
          )}
        </div>

        <div className="text-xs font-semibold text-stone-500 bg-white/80 px-3 py-1.5 rounded-full border border-stone-200">
          Թերթիկ #{cardIndex} / {totalCards}
        </div>
      </div>

      {/* The Unfolding Paper Slip */}
      <motion.div
        initial={{ scale: 0.65, opacity: 0, rotateX: 40, y: -30 }}
        animate={{ scale: 1, opacity: 1, rotateX: 0, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 125 }}
        className="relative bg-[#fffdf9] rounded-2xl border-2 border-stone-300/80 paper-slip-shadow overflow-hidden p-5 sm:p-7"
      >
        {/* Subtle horizontal fold crease marks */}
        <div className="absolute top-1/3 left-0 right-0 h-[2px] paper-crease pointer-events-none" />
        <div className="absolute top-2/3 left-0 right-0 h-[2px] paper-crease pointer-events-none" />
        
        {/* Top Paper Header: Topic Tag & Audio button */}
        <div className="flex items-center justify-between border-b border-stone-200/80 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className={`p-1.5 rounded-lg ${isRestaurante ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
              {isRestaurante ? <Utensils className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
            </span>
            <div>
              <span className="text-xs font-bold text-stone-700 block uppercase tracking-wide">
                {isRestaurante ? 'En el restaurante' : 'En el supermercado'}
              </span>
              <span className="text-[11px] text-stone-400 block font-medium">
                {isRestaurante ? 'Ռեստորանում' : 'Սուպերմարկետում'} · {card.titleArm}
              </span>
            </div>
          </div>

          <button
            onClick={() => handleSpeak(card.situation)}
            title="Լսել իսպաներեն արտասանությունը"
            className={`p-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
              speakingText === card.situation 
                ? 'bg-amber-500 text-white shadow-md' 
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            <Volume2 className={`w-4 h-4 ${speakingText === card.situation ? 'animate-bounce' : ''}`} />
            <span className="hidden sm:inline">Escuchar</span>
          </button>
        </div>

        {/* The Question / Situation in Spanish */}
        <div className="mb-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700/80 mb-1.5 flex items-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{playerLevel === 'A1' ? 'Pregunta · Հարց (A1)' : 'Situación · Իրավիճակ (A2)'}</span>
          </div>

          {/* Clickable Question Text to toggle Armenian translation */}
          <div
            onClick={toggleQuestionArm}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleQuestionArm(); }}
            className="group cursor-pointer rounded-xl p-3.5 transition-colors border border-transparent hover:border-amber-200 hover:bg-amber-50/50"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
                {card.situation}
              </p>
              <div className="shrink-0 mt-1 text-stone-400 group-hover:text-amber-600 transition-colors">
                {isQuestionArmOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </div>

            <div className="mt-2 flex items-center gap-1 text-[11px] text-stone-400 group-hover:text-amber-700">
              <Languages className="w-3.5 h-3.5" />
              <span>
                {isQuestionArmOpen ? 'Սեղմեք՝ հայերեն թարգմանությունը թաքցնելու համար' : 'Սեղմեք տեքստին՝ հայերեն թարգմանությունը տեսնելու համար'}
              </span>
            </div>
          </div>

          {/* Armenian Translation of the Question (Revealed smoothly) */}
          <AnimatePresence>
            {isQuestionArmOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-2.5 p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/90 text-stone-800 text-sm sm:text-base leading-relaxed flex items-start gap-2.5">
                  <span className="text-base select-none">🇦🇲</span>
                  <div className="flex-1 font-medium">
                    <span className="text-[11px] uppercase tracking-wide text-amber-800/80 font-bold block mb-0.5">
                      Թարգմանություն
                    </span>
                    {card.situationArm}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Prompt to speak aloud first */}
        <div className="py-2.5 px-3.5 rounded-xl bg-stone-100/70 border border-stone-200 text-xs text-stone-600 flex items-center gap-2 mb-5">
          <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Նախ փորձեք պատասխանել <strong>ինքնուրույն բարձրաձայն</strong>։ Եթե օգնություն է պետք, բացեք պատասխանի տարբերակները։
          </span>
        </div>

        {/* Hidden / Revealed Options Section */}
        {!areOptionsVisible ? (
          <div className="text-center py-2">
            <button
              onClick={handleShowOptions}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer hover:scale-[1.02] active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Mostrar opciones</span>
              <span className="text-xs text-stone-300 font-normal pl-1 border-l border-stone-700">
                Ցույց տալ տարբերակները
              </span>
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3 pt-2 border-t border-stone-200/80"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Opciones de respuesta · Պատասխանի տարբերակներ
              </span>
              <span className="text-[11px] text-stone-400">
                Ընտրեք կամ ասեք ձեր տարբերակը
              </span>
            </div>

            {/* The 4 conversational response options */}
            <div className="grid grid-cols-1 gap-2.5">
              {card.options.map((option, idx) => {
                const isArmOpen = !!openOptionArm[idx];
                const isSelected = selectedOption === idx;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    onClick={() => setSelectedOption(idx)}
                    className={`rounded-xl border p-3.5 transition-all cursor-pointer ${
                      isSelected
                        ? `bg-amber-50/90 border-amber-300 ring-2 ${playerTheme.activeRing} shadow-sm`
                        : 'bg-white hover:bg-stone-50/90 border-stone-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-start gap-2.5 flex-1">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                          isSelected ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-600'
                        }`}>
                          {idx + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-stone-900 font-semibold text-sm sm:text-base leading-snug">
                            {option.es}
                          </p>

                          {/* Armenian translation for this specific option */}
                          <AnimatePresence>
                            {isArmOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.15 }}
                                className="overflow-hidden"
                              >
                                <p className="mt-2 text-xs sm:text-sm text-stone-600 bg-amber-50/60 p-2 rounded-lg border border-amber-100/80 leading-normal">
                                  🇦🇲 {option.arm}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Action buttons: Armenian toggle and Audio speaker */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Audio button for option */}
                        <button
                          type="button"
                          onClick={(e) => handleSpeak(option.es, e)}
                          title="Լսել իսպաներեն"
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            speakingText === option.es 
                              ? 'bg-amber-500 text-white' 
                              : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
                          }`}
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>

                        {/* Separate small «Հայերեն» toggle button */}
                        <button
                          type="button"
                          onClick={(e) => toggleOptionArm(idx, e)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                            isArmOpen
                              ? 'bg-amber-600 text-white border-amber-600'
                              : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                          }`}
                        >
                          Հայերեն
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Action Button: Siguiente tarjeta (Solo) or Siguiente turno (Duo) */}
        <div className="mt-6 pt-4 border-t border-stone-200/80 flex items-center justify-between gap-4">
          <div className="text-xs text-stone-400">
            {isSolo
              ? 'Պատասխանելուց հետո անցեք հաջորդ հարցին'
              : `Պատասխանելուց հետո հերթը կանցնի ${nextPlayer}-ին`}
          </div>

          <button
            onClick={() => {
              soundManager.stopSpeaking();
              onNextTurn();
            }}
            className={`px-5 py-3 rounded-xl text-white font-bold text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer bg-gradient-to-r ${playerTheme.accent} hover:brightness-105 active:scale-95`}
          >
            {isSolo ? (
              <>
                <span>Siguiente tarjeta</span>
                <span className="text-xs opacity-80 border-l border-white/30 pl-2">
                  Հաջորդ հարցը
                </span>
              </>
            ) : (
              <>
                <span>Siguiente turno</span>
                <span className="text-xs opacity-80 border-l border-white/30 pl-2">
                  Հաջորդ քայլը
                </span>
              </>
            )}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
