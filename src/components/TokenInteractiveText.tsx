import React, { useState } from 'react';
import {
  decomposeIntoAssemblyWords,
  WordAssemblyItem,
  SubwordItem,
} from '../lib/tokenizer';

export type TokenAssemblyStage = 'auto' | 'bytes' | 'semiwords' | 'words';

interface TokenInteractiveTextProps {
  text: string;
  progress?: number; // 0 (raw bytes) -> 0.5 (semi-words) -> 1.0 (full words)
  stage?: TokenAssemblyStage;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'div';
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  enableHoverInspection?: boolean;
  lang?: 'en' | 'pt';
}

export const TokenInteractiveText: React.FC<TokenInteractiveTextProps> = ({
  text,
  progress = 1,
  stage = 'auto',
  as: Component = 'span',
  size = 'md',
  className = '',
  enableHoverInspection = true,
  lang = 'en',
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const words = decomposeIntoAssemblyWords(text);

  // Proportional sizing styles for byte chips and semi-word badges
  const byteClasses =
    size === 'hero'
      ? 'text-xs sm:text-base lg:text-xl px-2 py-1'
      : size === 'lg'
      ? 'text-xs sm:text-sm px-2 py-0.5'
      : 'text-[10px] sm:text-xs px-1.5 py-0.5';

  const subwordClasses =
    size === 'hero'
      ? 'text-sm sm:text-lg lg:text-2xl px-2.5 py-1'
      : size === 'lg'
      ? 'text-xs sm:text-base px-2 py-0.5'
      : 'text-xs px-1.5 py-0.5';

  const subwordBadgeClasses =
    size === 'hero'
      ? 'text-xs ml-1 opacity-70'
      : 'text-[9px] ml-0.5 opacity-60';

  const totalWords = Math.max(1, words.length);

  return (
    <Component className={`inline-flex flex-wrap items-baseline transition-all ${className}`}>
      {words.map((item, idx) => {
        // Sequential word timeline: each word transforms one after the other in sequence
        // Word 0 transforms first, then Word 1, then Word 2, etc.
        const segmentWindow = 0.82 / totalWords;
        const wordStart = (idx / totalWords) * 0.82;
        const wordDuration = segmentWindow + 0.18;
        const wordProg = Math.min(1, Math.max(0, (progress - wordStart) / wordDuration));

        // Determine active assembly stage for this specific word:
        // 1: Bytes (wordProg < 0.28)
        // 2: Semi-words / Subwords (0.28 <= wordProg < 0.68)
        // 3: Full Assembled Word (wordProg >= 0.68)
        let activeStage: 'bytes' | 'semiwords' | 'words';
        if (stage === 'bytes') activeStage = 'bytes';
        else if (stage === 'semiwords') activeStage = 'semiwords';
        else if (stage === 'words') activeStage = 'words';
        else {
          if (wordProg < 0.28) activeStage = 'bytes';
          else if (wordProg < 0.68) activeStage = 'semiwords';
          else activeStage = 'words';
        }

        const isHovered = hoveredIndex === idx;

        // Spacing: In stage 1 and 2, chips have margin-right to separate badges.
        // In stage 3 (words), use natural typographic spacing with zero punctuation gaps!
        const wordMarginClass =
          item.trailingSpace
            ? activeStage === 'words'
              ? 'mr-[0.28em]'
              : 'mr-2 mb-1.5'
            : activeStage !== 'words'
            ? 'mb-1.5'
            : '';

        return (
          <span
            key={idx}
            onMouseEnter={() => enableHoverInspection && setHoveredIndex(idx)}
            onMouseLeave={() => enableHoverInspection && setHoveredIndex(null)}
            className={`relative inline-flex items-baseline transition-all duration-200 cursor-pointer group/word ${wordMarginClass}`}
          >
            {/* STAGE 1: RAW BYTES (0x4A 0x75...) */}
            {activeStage === 'bytes' && (
              <span
                style={{
                  backgroundColor: 'rgba(173, 255, 47, 0.08)',
                  borderColor: isHovered ? '#adff2f' : 'rgba(173, 255, 47, 0.30)',
                  color: '#adff2f',
                }}
                className={`inline-flex items-center gap-1 font-mono rounded border tracking-wider tabular-nums transition-all duration-300 delay-150 shadow-xs animate-in fade-in ${byteClasses}`}
                title="Stage 1: Raw Bytes"
              >
                {item.hexList.join(' ')}
              </span>
            )}

            {/* STAGE 2: SEMI-WORDS / BPE SUBWORDS ([Jul] [io]...) */}
            {activeStage === 'semiwords' && (
              <span className="inline-flex items-baseline gap-1 animate-in fade-in duration-300 delay-150">
                {item.subwords.map((sub, sIdx) => (
                  <span
                    key={sIdx}
                    style={{
                      backgroundColor: sub.color.bg,
                      borderColor: isHovered ? sub.color.accent : sub.color.border,
                      color: isHovered ? '#ffffff' : sub.color.text,
                    }}
                    className={`inline-block rounded font-mono border transition-all duration-300 delay-150 tabular-nums shadow-xs ${subwordClasses}`}
                    title={`Stage 2: Semi-word #${sub.id}`}
                  >
                    <span>{sub.text}</span>
                    <span className={`font-mono ${subwordBadgeClasses}`}>
                      #{sub.id % 1000}
                    </span>
                  </span>
                ))}
              </span>
            )}

            {/* STAGE 3: FULL ASSEMBLED WORDS */}
            {activeStage === 'words' && (
              <span
                className={`transition-all duration-300 delay-150 animate-in fade-in ${
                  isHovered ? 'text-[#adff2f] bg-[#adff2f]/10 rounded px-1' : ''
                }`}
                title="Stage 3: Full Assembled Word"
              >
                {item.word}
              </span>
            )}

            {/* Hover Tooltip: Inspect Byte & Subword Anatomy */}
            {enableHoverInspection && isHovered && (
              <span
                className="block absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-zinc-950/95 border border-zinc-700/80 rounded-xl shadow-2xl text-left pointer-events-none min-w-[220px] backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
                role="tooltip"
              >
                <span className="flex items-center justify-between border-b border-zinc-800 pb-1.5 mb-1.5">
                  <span className="text-[10px] font-mono text-[#adff2f] uppercase tracking-wider font-bold">
                    {lang === 'pt' ? 'Anatomia de Montagem' : 'Assembly Anatomy'}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {activeStage === 'bytes'
                      ? (lang === 'pt' ? 'Estágio 1: Bytes' : 'Stage 1: Bytes')
                      : activeStage === 'semiwords'
                      ? (lang === 'pt' ? 'Estágio 2: Sub-palavras' : 'Stage 2: Semi-words')
                      : (lang === 'pt' ? 'Estágio 3: Montado' : 'Stage 3: Assembled')}
                  </span>
                </span>
                <span className="block space-y-1.5 font-mono text-[11px]">
                  <span className="flex justify-between">
                    <span className="text-zinc-500">{lang === 'pt' ? 'Palavra Montada:' : 'Assembled Word:'}</span>
                    <span className="text-white font-bold font-sans text-xs">"{item.word}"</span>
                  </span>
                  <span className="flex justify-between">
                    <span className="text-zinc-500">{lang === 'pt' ? 'Sub-palavras:' : 'Semi-words:'}</span>
                    <span className="text-purple-300 font-semibold">
                      {item.subwords.map((s) => `[${s.text}]`).join(' ')}
                    </span>
                  </span>
                  <span className="flex justify-between">
                    <span className="text-zinc-500">{lang === 'pt' ? 'Contagem de Bytes:' : 'Bytes Count:'}</span>
                    <span className="text-zinc-300">{item.bytes.length} B</span>
                  </span>
                  <span className="flex justify-between">
                    <span className="text-zinc-500">{lang === 'pt' ? 'Fluxo Hexadecimal:' : 'Hex Stream:'}</span>
                    <span className="text-[#38bdf8] font-bold">{item.hexList.join(' ')}</span>
                  </span>
                  <span className="flex justify-between pt-1 border-t border-zinc-800 text-[10px]">
                    <span className="text-zinc-500">{lang === 'pt' ? 'IDs dos Tokens:' : 'Tokens IDs:'}</span>
                    <span className="text-emerald-400">
                      {item.subwords.map((s) => `#${s.id}`).join(', ')}
                    </span>
                  </span>
                </span>
                {/* Arrow */}
                <span className="block absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-zinc-800" />
              </span>
            )}
          </span>
        );
      })}
    </Component>
  );
};
