import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { quizQuestions, paramoCards } from '../data';

interface ParamoQuizProps {
  unlockedCardIds: string[];
  setUnlockedCardIds: React.Dispatch<React.SetStateAction<string[]>>;
}

const questionToCardMap: Record<number, string> = {
  1: "card_01", 6: "card_01", 8: "card_01",
  2: "card_02", 9: "card_02",
  3: "card_03", 7: "card_03",
  4: "card_04",
  5: "card_05", 10: "card_05",
  11: "card_07", // Condor
  12: "card_06", // Oso
  13: "card_08", 14: "card_08", 15: "card_08", 16: "card_08", 19: "card_08", // Clima/Geo
  17: "card_09", 20: "card_09", // Lobo/Fauna
  18: "card_06" // Amphibians/Fauna
};

export default function ParamoQuiz({ unlockedCardIds, setUnlockedCardIds }: ParamoQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [newlyUnlockedCard, setNewlyUnlockedCard] = useState<any>(null);
  const [sessionQuestions, setSessionQuestions] = useState<typeof quizQuestions>([]);
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    startNewSession();
  }, []);

  useEffect(() => {
    if (isAnswered || quizFinished || sessionQuestions.length === 0) return;
    
    if (timeLeft === 0) {
      setIsAnswered(true); // Time's up!
      playWrongSound();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswered, quizFinished, sessionQuestions.length]);

  const playVictoryMusic = () => {
    const audio = new Audio("https://actions.google.com/sounds/v1/cartoon/cartoon_success_fanfare.ogg");
    audio.volume = 0.5;
    audio.play().catch(e => console.log("Audio autoplays prevented", e));
  };

  const playCorrectSound = () => {
    const audio = new Audio("https://actions.google.com/sounds/v1/cartoon/pop.ogg");
    audio.volume = 0.5;
    audio.play().catch(e => console.log(e));
  };

  const playWrongSound = () => {
    const audio = new Audio("https://actions.google.com/sounds/v1/cartoon/cartoon_cowbell_mallet_hit.ogg");
    audio.volume = 0.5;
    audio.play().catch(e => console.log(e));
  };

  const startNewSession = () => {
    const shuffled = [...quizQuestions].sort(() => 0.5 - Math.random());
    setSessionQuestions(shuffled.slice(0, 10));
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
    setNewlyUnlockedCard(null);
    setTimeLeft(15);
  };

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === sessionQuestions[currentQuestion].correctIndex;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      fireConfetti();
      playCorrectSound();
      
      const cardIdToUnlock = questionToCardMap[sessionQuestions[currentQuestion].id];
      if (cardIdToUnlock && !unlockedCardIds.includes(cardIdToUnlock)) {
        setUnlockedCardIds(prev => [...prev, cardIdToUnlock]);
        const cardObj = paramoCards.find(c => c.id === cardIdToUnlock);
        if (cardObj) {
          setNewlyUnlockedCard(cardObj);
        }
      }
    } else {
      playWrongSound();
    }
  };

  const fireConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#FBBF24', '#F8FAFC'] // Emerald, Gold, Slate-100
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < sessionQuestions.length) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setNewlyUnlockedCard(null);
      setTimeLeft(15);
    } else {
      setQuizFinished(true);
      playVictoryMusic();
    }
  };

  const resetQuiz = () => {
    startNewSession();
  };

  if (sessionQuestions.length === 0) return null;

  const question = sessionQuestions[currentQuestion];

  return (
    <div className="w-full max-w-3xl mx-auto p-6 md:p-8 bg-slate-900 border-2 border-amber-500/50 rounded-2xl text-slate-100 shadow-[0_0_30px_rgba(16,185,129,0.2)] font-sans mt-8 mb-16">
      
      {!quizFinished ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4 relative overflow-hidden text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-bold text-emerald-400">Páramo Survival Quiz</h2>
              <div className="flex gap-4 items-center">
                <span className={`font-mono font-bold px-3 py-1 rounded-lg border ${timeLeft <= 5 ? 'text-red-400 border-red-500/30 bg-red-900/20 animate-pulse' : 'text-emerald-400 border-emerald-500/30 bg-slate-800'}`}>
                  ⏱ {timeLeft}s
                </span>
                <span className="text-amber-400 font-mono font-bold bg-slate-800 px-3 py-1 rounded-lg border border-amber-500/30">
                  {currentQuestion + 1} / {sessionQuestions.length}
                </span>
              </div>
            </div>

            <h3 className="text-2xl md:text-3xl font-semibold mb-8 text-white leading-relaxed">
              {question.questionEn}
            </h3>

            <div className="space-y-4">
              {question.options.map((option, index) => {
                const isSelected = selectedOption === index;
                const isCorrect = index === question.correctIndex;
                const showCorrect = isAnswered && isCorrect;
                const showWrong = isAnswered && isSelected && !isCorrect;

                return (
                  <motion.button
                    whileHover={!isAnswered ? { scale: 1.01 } : {}}
                    whileTap={!isAnswered ? { scale: 0.98 } : {}}
                    key={index}
                    onClick={() => handleOptionClick(index)}
                    disabled={isAnswered}
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-300 font-medium text-lg leading-relaxed shadow-sm
                      ${!isAnswered ? 'border-slate-700 bg-slate-800 hover:border-emerald-500 hover:bg-slate-700' : ''}
                      ${showCorrect ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300' : ''}
                      ${showWrong ? 'border-red-500 bg-red-500/20 text-red-300' : ''}
                      ${isAnswered && !isSelected && !isCorrect ? 'border-slate-800 bg-slate-800/50 opacity-40' : ''}
                    `}
                  >
                    {option}
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  className="mt-8 overflow-hidden"
                >
                  <div className={`p-6 rounded-xl border ${
                    selectedOption === question.correctIndex 
                      ? 'bg-emerald-900/40 border-emerald-500/50' 
                      : 'bg-red-900/20 border-red-500/30'
                  }`}>
                    <p className="text-xl text-slate-200">
                      {timeLeft === 0 && selectedOption === null ? (
                        <span className="text-red-400 font-bold block mb-2">¡Tiempo Agotado!</span>
                      ) : null}
                      {question.explanationEs}
                    </p>
                  </div>

                  {newlyUnlockedCard && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ type: "spring", delay: 0.3 }}
                      className="mt-6 p-4 bg-slate-800 border-2 border-amber-500 rounded-xl flex items-center gap-4 shadow-[0_0_20px_rgba(245,158,11,0.3)] relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-emerald-500/10 animate-pulse" />
                      <div className="relative z-10 w-16 h-16 rounded-lg overflow-hidden border border-amber-400 shrink-0">
                        <img src={newlyUnlockedCard.image} alt="Card unlocked" className="w-full h-full object-cover" />
                      </div>
                      <div className="relative z-10">
                        <p className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-1">¡Carta Capturada!</p>
                        <p className="text-white font-bold text-lg">{newlyUnlockedCard.commonName}</p>
                        <p className="text-slate-400 text-xs">Visita la pestaña 'Cartas de Lore' para verla.</p>
                      </div>
                    </motion.div>
                  )}
                  
                  <button
                    onClick={handleNextQuestion}
                    className="mt-6 w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 text-slate-900 rounded-xl font-bold text-xl transition-colors shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                  >
                    {currentQuestion + 1 === sessionQuestions.length ? 'Ver Resultados' : 'Siguiente Pregunta'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </AnimatePresence>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="mb-8 inline-block p-8 rounded-full bg-slate-800 border-4 border-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.2)]">
            <span className="text-7xl text-emerald-400 font-bold">{score}</span>
            <span className="text-3xl text-slate-400">/{sessionQuestions.length}</span>
          </div>
          
          <h2 className="text-4xl font-bold mb-4 text-white">¡Quiz Completado!</h2>
          <p className="text-2xl text-slate-300 mb-10 max-w-md mx-auto">
            {score >= 8 ? '¡Eres un experto de la flora del ecosistema andino y de sus asombrosas adaptaciones!' : 
             score >= 5 ? '¡Buen trabajo! Conoces bastante de las alturas, pero el hielo aún te esconde secretos.' : 
             '¡Sigue explorando y aprendiendo sobre los misterios del páramo!'}
          </p>

          <button
            onClick={resetQuiz}
            className="px-10 py-5 bg-slate-800 border-2 border-emerald-500 hover:bg-emerald-900/40 text-emerald-400 rounded-xl font-bold text-xl transition-all shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            Aceptar el Reto de Nuevo
          </button>
        </motion.div>
      )}
    </div>
  );
}
