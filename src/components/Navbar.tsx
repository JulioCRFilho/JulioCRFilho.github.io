import React from 'react';
import { Terminal, Globe, Sliders } from 'lucide-react';
import { TokenAssemblyStage } from './TokenInteractiveText';

interface NavbarProps {
  assemblyStage: TokenAssemblyStage;
  setAssemblyStage: (stage: TokenAssemblyStage) => void;
  lang: 'en' | 'pt';
  setLang: (lang: 'en' | 'pt') => void;
  onOpenTerminal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  assemblyStage,
  setAssemblyStage,
  lang,
  setLang,
  onOpenTerminal,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#07080a]/85 backdrop-blur-xl border-b border-zinc-800/80 px-6 lg:px-12 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="font-mono font-bold tracking-tight text-white hover:text-[#adff2f] transition-colors text-base flex items-center gap-1.5"
        >
          <span>JULIO_CESAR</span>
          <span className="text-[#adff2f] animate-pulse">_</span>
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono font-medium text-zinc-400">
          <a href="#overview" className="hover:text-white transition-colors">
            {lang === 'pt' ? 'Visão Geral' : 'Overview'}
          </a>
          <a href="#cir-engine" className="hover:text-white transition-colors">
            CIR-Engine 503M
          </a>
          <a href="#tokenizer-lab" className="hover:text-white transition-colors">
            {lang === 'pt' ? 'Laboratório de Tokens' : 'Tokenizer Lab'}
          </a>
          <a href="#repositories" className="hover:text-white transition-colors">
            {lang === 'pt' ? 'Repositórios' : 'Repositories'}
          </a>
          <a href="#experience" className="hover:text-white transition-colors">
            {lang === 'pt' ? 'Trajetória' : 'Experience'}
          </a>
        </nav>

        {/* Zone 3: Primary interactive controls */}
        <div className="flex items-center gap-2.5">
          {/* 3-Stage Token Assembly Segmented Control */}
          <div className="hidden sm:flex items-center p-0.5 bg-zinc-900 border border-zinc-800 rounded-lg text-[11px] font-mono">
            <button
              onClick={() => setAssemblyStage('auto')}
              className={`px-2 py-1 rounded transition-colors ${
                assemblyStage === 'auto' ? 'bg-zinc-800 text-[#adff2f] font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
              title="Auto Assembly via Scroll"
            >
              Scroll Auto
            </button>
            <button
              onClick={() => setAssemblyStage('bytes')}
              className={`px-2 py-1 rounded transition-colors ${
                assemblyStage === 'bytes' ? 'bg-zinc-800 text-[#adff2f] font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
              title="Stage 1: Raw Bytes"
            >
              1. Bytes
            </button>
            <button
              onClick={() => setAssemblyStage('semiwords')}
              className={`px-2 py-1 rounded transition-colors ${
                assemblyStage === 'semiwords' ? 'bg-zinc-800 text-[#38bdf8] font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
              title="Stage 2: BPE Semi-words / Subwords"
            >
              2. Semi-words
            </button>
            <button
              onClick={() => setAssemblyStage('words')}
              className={`px-2 py-1 rounded transition-colors ${
                assemblyStage === 'words' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
              title="Stage 3: Full Assembled Words"
            >
              3. Words
            </button>
          </div>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'pt' : 'en')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-mono text-zinc-300 transition-colors cursor-pointer"
            title="Switch Language (PT / EN)"
          >
            <Globe className="w-3.5 h-3.5 text-zinc-400" />
            <span className="font-semibold">{lang.toUpperCase()}</span>
          </button>

          {/* Contact / Terminal Action */}
          <button
            onClick={onOpenTerminal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#adff2f] text-black font-mono text-xs font-bold hover:bg-lime-300 transition-all cursor-pointer whitespace-nowrap"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Terminal</span>
          </button>
        </div>
      </div>
    </header>
  );
};
