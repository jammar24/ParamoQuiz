import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { paramoCards } from '../data';

interface LoreCardsProps {
  unlockedCardIds: string[];
}

const typeColors: Record<string, string> = {
  planta: 'from-emerald-300 via-green-400 to-emerald-600',
  fauna: 'from-amber-300 via-orange-400 to-amber-600',
  clima: 'from-cyan-300 via-blue-400 to-cyan-600',
};

const typeIcons: Record<string, string> = {
  planta: '🌿',
  fauna: '🐾',
  clima: '❄️',
};

const PokemonCard = ({ card, isUnlocked, onClick }: { card: typeof paramoCards[0], isUnlocked: boolean, onClick?: () => void }) => {
  const bgGradient = typeColors[card.type] || typeColors.planta;
  const icon = typeIcons[card.type] || '🌿';

  return (
    <div
      onClick={onClick}
      className={`
        relative p-[8px] rounded-2xl shadow-2xl mx-auto w-full max-w-sm h-full flex flex-col
        bg-gradient-to-br ${bgGradient}
        ${!isUnlocked ? 'grayscale opacity-60 hover:opacity-80 transition-opacity blur-[1px]' : 'hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(250,204,21,0.4)] cursor-pointer'}
      `}
    >
      <div className="bg-slate-50 h-full rounded-xl p-3 flex flex-col border-2 border-slate-900/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
        
        <div className="flex justify-between items-center mb-2 px-1 relative z-10">
          <h3 className="text-xl font-black text-slate-800 drop-shadow-sm tracking-tight truncate">{card.commonName}</h3>
          <div className="flex items-center text-red-600 font-black text-lg shrink-0 ml-2">
            <span className="text-xs mr-1 text-slate-600">HP</span> 120
            <div className="ml-1 w-5 h-5 rounded-full border-2 border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
              <div className={`w-full h-full bg-gradient-to-br ${bgGradient} flex items-center justify-center text-[10px]`}>{icon}</div>
            </div>
          </div>
        </div>

        <div className="relative w-full pb-[75%] border-4 border-slate-200 rounded shadow-inner bg-slate-200 overflow-hidden z-10">
          <img 
            src={card.image} 
            alt={card.commonName} 
            className="absolute inset-0 w-full h-full object-cover"
          />
          {!isUnlocked && (
            <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center backdrop-blur-[2px]">
              <span className="text-4xl">❓</span>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-slate-200 to-slate-300 text-slate-600 text-[10px] font-bold py-1 px-2 italic text-center border-y border-slate-400 my-2 z-10">
          {card.scientificName} • Páramo {card.type.charAt(0).toUpperCase() + card.type.slice(1)}
        </div>

        <div className="flex-grow flex flex-col z-10">
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">✨</span>
              <h4 className="font-bold text-slate-800 text-sm leading-tight">{card.specialAbility}</h4>
              <span className="ml-auto font-bold text-slate-600">40</span>
            </div>
            <p className="text-slate-700 text-xs leading-relaxed">
              {isUnlocked ? card.descriptionEs : "Captura esta carta en el Quiz para revelar sus secretos."}
            </p>
          </div>
          
          {isUnlocked && (
            <div className="mt-auto pt-2 border-t border-slate-300">
              <p className="text-slate-500 text-[10px] italic leading-tight">
                {card.descriptionEn}
              </p>
            </div>
          )}
        </div>

        <div className="mt-3 flex justify-between text-[10px] font-bold text-slate-500 border-t border-slate-200 pt-1 z-10">
          <span>weakness: 🔥 x2</span>
          <span>resistance: ❄️ -20</span>
          <span>retreat: ☆☆</span>
        </div>
      </div>
      
      {!isUnlocked && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="bg-slate-900/80 px-6 py-3 rounded-full text-amber-400 font-black border-2 border-amber-400 rotate-[-10deg] tracking-widest shadow-xl">
            LOCKED
          </div>
        </div>
      )}
    </div>
  );
};

export default function LoreCards({ unlockedCardIds }: LoreCardsProps) {
  const [selectedCard, setSelectedCard] = useState<typeof paramoCards[0] | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = (card: typeof paramoCards[0], isUnlocked: boolean) => {
    if (isUnlocked) {
      setSelectedCard(card);
      setIsFlipped(false);
    }
  };

  const closeModal = () => {
    setSelectedCard(null);
    setIsFlipped(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-emerald-400 mb-4 tracking-tight shadow-sm">Misterios del Páramo</h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Descubre las increíbles habilidades de supervivencia de las plantas y animales en el extremo clima andino.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
        {paramoCards.map((card, idx) => {
          const isUnlocked = unlockedCardIds.includes(card.id);
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <PokemonCard 
                card={card} 
                isUnlocked={isUnlocked} 
                onClick={() => handleCardClick(card, isUnlocked)} 
              />
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md"
            onClick={closeModal}
          >
            <motion.div 
              className="relative w-full max-w-sm cursor-pointer"
              style={{ perspective: "1000px" }}
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(!isFlipped);
              }}
            >
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
                style={{ transformStyle: "preserve-3d" }}
                className="relative w-full"
              >
                {/* Front Face */}
                <div 
                  className="w-full relative" 
                  style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                >
                  <PokemonCard card={selectedCard} isUnlocked={true} />
                </div>
                
                {/* Back Face */}
                <div 
                  className="absolute inset-0 bg-slate-800 border-[12px] border-amber-500 rounded-2xl shadow-[0_0_40px_rgba(245,158,11,0.5)] flex flex-col items-center justify-center overflow-hidden"
                  style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                >
                   {/* Background pattern */}
                   <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-200 via-amber-600 to-slate-900"></div>
                   
                   {/* Paramo "Pokeball" */}
                   <div className="w-32 h-32 rounded-full border-[8px] border-amber-500 bg-slate-800 flex flex-col overflow-hidden relative z-10 shadow-2xl">
                     <div className="flex-1 bg-emerald-600"></div>
                     <div className="flex-1 bg-slate-200"></div>
                     <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-10 h-10 rounded-full bg-slate-800 border-[6px] border-amber-500 shadow-inner z-10"></div>
                       <div className="w-full h-[8px] bg-amber-500 absolute"></div>
                     </div>
                   </div>
                   
                   <h3 className="mt-8 text-3xl font-black text-amber-400 tracking-widest z-10 drop-shadow-lg uppercase text-center px-4">
                     Survivor<br/>Paramo
                   </h3>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
