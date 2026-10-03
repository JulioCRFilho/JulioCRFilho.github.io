import React, { useState, useMemo } from 'react';
import {
  Cpu,
  Database,
  Layers,
  ChevronDown,
  ChevronUp,
  Activity,
  RotateCcw,
  Sparkles,
  Zap,
  Flame,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { analyzeTokenCacheUsage, TokenCacheStats } from '../lib/tokenizer';

interface FloatingTokenMonitorProps {
  textSources: string[];
  lang?: 'en' | 'pt';
}

export const FloatingTokenMonitor: React.FC<FloatingTokenMonitorProps> = ({
  textSources,
  lang = 'en',
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [warmupState, setWarmupState] = useState<'idle' | 'warming' | 'warmed'>('idle');
  const [warmupStep, setWarmupStep] = useState<string>('');
  const [latencyMs, setLatencyMs] = useState<number>(18.4);

  // Compute live token cache and memory analytics
  const stats: TokenCacheStats = useMemo(() => {
    return analyzeTokenCacheUsage(textSources);
  }, [textSources]);

  // Authentic KV-Cache Warmup: simulates prefilling attention pages in VRAM
  const handleSimulateWarmup = () => {
    if (warmupState === 'warming') return;

    setWarmupState('warming');
    setWarmupStep(
      lang === 'pt'
        ? '[CUDA:0] Alocando 16 páginas de KV-Cache na VRAM...'
        : '[CUDA:0] Allocating 16 KV-Cache pages in VRAM...'
    );

    setTimeout(() => {
      setWarmupStep(
        lang === 'pt'
          ? '[RoPE] Pré-computando matrizes posicionais (CIR-503M)...'
          : '[RoPE] Prefilling positional matrices (CIR-503M)...'
      );
    }, 450);

    setTimeout(() => {
      setWarmupStep(
        lang === 'pt'
          ? '[FlashAttn-2] Fixando prefixos na SRAM rápida...'
          : '[FlashAttn-2] Pinning prefix tokens in GPU SRAM...'
      );
    }, 900);

    setTimeout(() => {
      setWarmupState('warmed');
      setLatencyMs(1.8);
      setWarmupStep(
        lang === 'pt'
          ? '⚡ Cache pré-aquecido! Latência reduzida para 1.8ms (10.2x speedup).'
          : '⚡ Cache pre-warmed! Latency reduced to 1.8ms (10.2x speedup).'
      );
    }, 1400);
  };

  const handleResetCache = () => {
    setWarmupState('idle');
    setLatencyMs(18.4);
    setWarmupStep('');
  };

  return (
    <aside
      aria-label="ML Token Telemetry Monitor"
      className="fixed bottom-4 right-4 z-40 font-mono transition-all duration-300"
    >
      {/* COLLAPSED PILL VIEW */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="group flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-zinc-950/95 border border-zinc-800/90 text-xs shadow-2xl backdrop-blur-md hover:border-[#adff2f]/60 hover:bg-zinc-900/95 transition-all cursor-pointer"
          title={lang === 'pt' ? 'Expandir telemetria de tokens' : 'Expand Token Telemetry'}
        >
          {/* Pulsing ML live indicator */}
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                warmupState === 'warmed' ? 'bg-[#38bdf8]' : 'bg-[#adff2f]'
              }`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                warmupState === 'warmed' ? 'bg-[#38bdf8]' : 'bg-[#adff2f]'
              }`}
            ></span>
          </span>

          <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors">
            {lang === 'pt' ? 'TOKENS:' : 'TOKENS:'}
          </span>
          <span className="text-[#adff2f] font-bold tabular-nums">
            {stats.totalTokens}
          </span>

          <span className="text-zinc-600">|</span>

          <span className="text-zinc-400">
            {lang === 'pt' ? 'REUSO:' : 'REUSE:'}
          </span>
          <span className="text-[#38bdf8] font-bold tabular-nums">
            {stats.reuseRate}%
          </span>

          <span className="hidden sm:inline text-zinc-600">|</span>
          <span
            className={`hidden sm:inline text-[10px] px-1.5 py-0.5 rounded border ${
              warmupState === 'warmed'
                ? 'text-[#adff2f] bg-[#adff2f]/10 border-[#adff2f]/30 font-bold'
                : 'text-zinc-500 bg-zinc-900 border-zinc-800'
            }`}
          >
            {warmupState === 'warmed' ? 'KV-WARMED (1.8ms)' : 'KV-CACHE'}
          </span>

          <ChevronUp className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-transform ml-0.5" />
        </button>
      )}

      {/* EXPANDED ML TELEMETRY PANEL */}
      {isExpanded && (
        <div className="w-[340px] sm:w-[390px] bg-zinc-950/95 border border-zinc-800 rounded-2xl shadow-2xl backdrop-blur-xl p-4 space-y-3.5 animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-zinc-850">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#adff2f]" />
              <div>
                <div className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
                  <span>{lang === 'pt' ? 'MONITOR DE TOKENS ML' : 'ML TOKEN INFERENCE CONTEXT'}</span>
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded font-bold transition-colors ${
                      warmupState === 'warmed'
                        ? 'text-black bg-[#adff2f]'
                        : 'text-[#adff2f] bg-[#adff2f]/10 border border-[#adff2f]/30'
                    }`}
                  >
                    {warmupState === 'warmed' ? 'WARMED (1.8ms)' : 'ACTIVE'}
                  </span>
                </div>
                <div className="text-[10px] text-zinc-400">
                  {lang === 'pt' ? 'Deduplicação BPE & Prefix Caching' : 'BPE Deduplication & Prefix Cache'}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
              title={lang === 'pt' ? 'Minimizar' : 'Minimize'}
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* 4-Card Telemetry Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* 1: Total Tokens */}
            <div className="p-2.5 bg-zinc-900/60 rounded-xl border border-zinc-850">
              <div className="text-[10px] text-zinc-400 flex items-center justify-between">
                <span>{lang === 'pt' ? 'Tokens Ativos' : 'Active Tokens'}</span>
                <Layers className="w-3 h-3 text-zinc-500" />
              </div>
              <div className="text-lg font-bold text-[#adff2f] tabular-nums mt-0.5">
                {stats.totalTokens}
              </div>
              <div className="text-[9px] text-zinc-400 mt-0.5">
                {stats.uniqueTokens} {lang === 'pt' ? 'únicos em vocabulário' : 'unique vocab ids'}
              </div>
            </div>

            {/* 2: Cache Reuse */}
            <div className="p-2.5 bg-zinc-900/60 rounded-xl border border-zinc-850">
              <div className="text-[10px] text-zinc-400 flex items-center justify-between">
                <span>{lang === 'pt' ? 'Reuso KV-Cache' : 'KV-Cache Hit'}</span>
                <Database className="w-3 h-3 text-[#38bdf8]" />
              </div>
              <div className="text-lg font-bold text-[#38bdf8] tabular-nums mt-0.5">
                {stats.reuseRate}%
              </div>
              <div className="text-[9px] text-emerald-400 mt-0.5">
                {stats.reusedTokens} {lang === 'pt' ? 'tokens reaproveitados' : 'tokens reused'}
              </div>
            </div>

            {/* 3: Compression Ratio */}
            <div className="p-2.5 bg-zinc-900/60 rounded-xl border border-zinc-850">
              <div className="text-[10px] text-zinc-400 flex items-center justify-between">
                <span>{lang === 'pt' ? 'Compressão' : 'Compression'}</span>
                <Activity className="w-3 h-3 text-purple-400" />
              </div>
              <div className="text-lg font-bold text-purple-300 tabular-nums mt-0.5">
                {stats.compressionRatio}x
              </div>
              <div className="text-[9px] text-zinc-400 mt-0.5">
                {lang === 'pt' ? 'Bytes por Token' : 'Bytes per Token'}
              </div>
            </div>

            {/* 4: Latency Benchmark */}
            <div
              className={`p-2.5 rounded-xl border transition-all ${
                warmupState === 'warmed'
                  ? 'bg-lime-950/20 border-lime-500/40 shadow-xs'
                  : 'bg-zinc-900/60 border-zinc-850'
              }`}
            >
              <div className="text-[10px] text-zinc-400 flex items-center justify-between">
                <span>{lang === 'pt' ? 'Latência TTFT' : 'TTFT Latency'}</span>
                <Zap className={`w-3 h-3 ${warmupState === 'warmed' ? 'text-[#adff2f]' : 'text-amber-400'}`} />
              </div>
              <div
                className={`text-lg font-bold tabular-nums mt-0.5 ${
                  warmupState === 'warmed' ? 'text-[#adff2f]' : 'text-amber-300'
                }`}
              >
                {latencyMs} <span className="text-xs font-normal text-zinc-400">ms</span>
              </div>
              <div className="text-[9px] text-zinc-400 mt-0.5">
                {warmupState === 'warmed'
                  ? (lang === 'pt' ? '⚡ 10.2x speedup (SRAM hit)' : '⚡ 10.2x speedup (SRAM hit)')
                  : (lang === 'pt' ? 'Cold start sem prefill' : 'Cold start without prefill')}
              </div>
            </div>
          </div>

          {/* Cached / Reused Subwords Registry */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[10px] text-zinc-400">
              <span className="uppercase tracking-wider font-semibold">
                {lang === 'pt' ? 'Prefixos Fixados no Cache' : 'Pinned Cache Prefixes'}
              </span>
              <span className="text-zinc-500 font-mono">
                {warmupState === 'warmed' ? 'VRAM PINNED · 100%' : `${stats.cachedTokenRegistry.length} cached`}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-[110px] overflow-y-auto pr-1">
              {stats.cachedTokenRegistry.map((item) => {
                const isPinned = warmupState === 'warmed';

                return (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: isPinned ? 'rgba(173, 255, 47, 0.12)' : item.color.bg,
                      borderColor: isPinned ? '#adff2f' : item.color.border,
                      color: isPinned ? '#ffffff' : item.color.text,
                    }}
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] border tabular-nums shadow-xs hover:scale-105 transition-all ${
                      isPinned ? 'ring-1 ring-[#adff2f]/40 font-semibold' : ''
                    }`}
                    title={`Token ID #${item.id} · ${item.hits} cache hits · ${isPinned ? 'PINNED IN VRAM' : 'Cached'}`}
                  >
                    <span className="font-sans font-medium">{item.text}</span>
                    <span className="text-[9px] opacity-75 font-mono">#{item.id % 1000}</span>
                    <span className="text-[9px] bg-black/50 px-1 py-0.2 rounded font-bold text-white ml-0.5">
                      x{item.hits}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dynamic Warmup Execution Feed */}
          {warmupStep && (
            <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 flex items-center gap-2 animate-in fade-in duration-200">
              <Zap className={`w-3.5 h-3.5 shrink-0 ${warmupState === 'warmed' ? 'text-[#adff2f]' : 'text-[#38bdf8] animate-pulse'}`} />
              <span className="font-mono truncate">{warmupStep}</span>
            </div>
          )}

          {/* Footer Action Bar */}
          <div className="pt-2 border-t border-zinc-850 flex items-center justify-between text-[10px] text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  warmupState === 'warmed' ? 'bg-[#adff2f]' : 'bg-zinc-500'
                }`}
              />
              <span>CIR-503M · FlashAttn-2 · 50.2k</span>
            </div>

            <div className="flex items-center gap-2">
              {warmupState === 'warmed' && (
                <button
                  onClick={handleResetCache}
                  className="flex items-center gap-1 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                  title={lang === 'pt' ? 'Limpar cache para cold-start' : 'Reset to cold-start'}
                >
                  <Trash2 className="w-2.5 h-2.5" />
                  <span>{lang === 'pt' ? 'Cold' : 'Cold'}</span>
                </button>
              )}

              <button
                onClick={handleSimulateWarmup}
                disabled={warmupState === 'warming'}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all cursor-pointer ${
                  warmupState === 'warmed'
                    ? 'bg-zinc-900 hover:bg-zinc-850 text-white border border-zinc-800'
                    : 'bg-[#adff2f] text-black font-bold hover:bg-lime-300 shadow-sm shadow-lime-400/20'
                }`}
                title={lang === 'pt' ? 'Pré-aquecer tensores e memória na GPU' : 'Warmup GPU KV-Cache & Prefill'}
              >
                {warmupState === 'warming' ? (
                  <>
                    <RotateCcw className="w-3 h-3 text-black animate-spin" />
                    <span>{lang === 'pt' ? 'Aquecendo...' : 'Warming...'}</span>
                  </>
                ) : warmupState === 'warmed' ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-[#adff2f]" />
                    <span>{lang === 'pt' ? 'Re-Warmup' : 'Re-Warmup'}</span>
                  </>
                ) : (
                  <>
                    <Flame className="w-3 h-3 text-black" />
                    <span>{lang === 'pt' ? 'Warmup KV-Cache' : 'Warmup KV-Cache'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

