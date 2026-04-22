import { useState } from 'react';
import ParamoQuiz from './components/ParamoQuiz';
import LoreCards from './components/LoreCards';



function App() {
  const [activeTab, setActiveTab] = useState<'quiz' | 'lore'>('quiz');
  const [unlockedCardIds, setUnlockedCardIds] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans noselect">
      {/* Header and Nav */}
      <header className="fixed top-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md border-b border-emerald-900/50 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-xl md:text-2xl font-black bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent italic truncate">
            Survivor Paramo
          </div>
          <nav className="flex space-x-2">
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                activeTab === 'quiz'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Quiz Interactivo
            </button>
            <button
              onClick={() => setActiveTab('lore')}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                activeTab === 'lore'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Cartas de Lore
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 shadow-[inset_0_0_100px_rgba(16,185,129,0.02)] min-h-screen">
        {activeTab === 'quiz' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8 max-w-2xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Páramo Survival Quiz</h1>
              <p className="text-lg text-slate-400">
                Pon a prueba tus conocimientos sobre cómo sobreviven las plantas en uno de los climas más extremos de la Tierra.
              </p>
            </div>
            <ParamoQuiz 
              unlockedCardIds={unlockedCardIds} 
              setUnlockedCardIds={setUnlockedCardIds} 
            />
          </div>
        )}
        
        {activeTab === 'lore' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <LoreCards unlockedCardIds={unlockedCardIds} />
          </div>
        )}
      </main>
      
      <footer className="w-full py-8 border-t border-slate-800/50 bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-medium">Desarrollado por</span>
            <a 
              href="https://www.linkedin.com/in/jamar-masias-26b430254/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-bold group"
              title="Visitar perfil de LinkedIn"
            >
              Jamar Masias
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 group-hover:scale-110 transition-transform"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>
          
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Visitas Totales</span>
            <img 
              src="https://profile-counter.glitch.me/jamar-paramo-quiz/count.svg" 
              alt="Contador de Visitas" 
              className="h-6 rounded bg-slate-800/50 p-0.5"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
