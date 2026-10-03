import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Database, Eye, EyeOff, Layers, Sliders, Waves, Plus, Minus, Zap, Cpu } from 'lucide-react';
import { RopePhaseCanvas } from './RopePhaseCanvas';

interface AmbientTensorCanvasProps {
  lang?: 'en' | 'pt';
}

interface KvPage {
  id: number;
  address: string;
  status: 'pinned' | 'active' | 'cached' | 'free';
  tokens: string[];
  keysCount: number;
  heat: number;
}

/**
 * High-performance pointer-draggable slider supporting mouse drag, touch drag, and click-to-position
 */
const PointerSlider: React.FC<{
  value: number; // 0.0 to 1.0
  onChange: (val: number) => void;
  widthClass?: string;
  lang?: 'en' | 'pt';
}> = ({ value, onChange, widthClass = 'w-20 sm:w-28', lang = 'en' }) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);

  const updatePosition = (clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    onChange(ratio);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (dragging) {
      updatePosition(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  return (
    <div
      ref={trackRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`relative h-6 flex items-center cursor-pointer select-none touch-none ${widthClass}`}
      role="slider"
      aria-valuenow={Math.round(value * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={lang === 'pt' ? 'Ajuste de translucidez das ondas RoPE' : 'RoPE wave translucency slider'}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault();
          onChange(Math.min(1, value + 0.05));
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault();
          onChange(Math.max(0, value - 0.05));
        }
      }}
    >
      {/* Background Track */}
      <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700/50">
        {/* Filled Active Track */}
        <div
          className="h-full bg-[#adff2f] transition-none rounded-full"
          style={{ width: `${Math.round(value * 100)}%` }}
        />
      </div>

      {/* Draggable Thumb */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#adff2f] border-2 border-black shadow-lg pointer-events-none transition-transform ${
          dragging ? 'scale-125 ring-2 ring-[#adff2f]/50' : 'hover:scale-110'
        }`}
        style={{ left: `${Math.round(value * 100)}%` }}
      />
    </div>
  );
};

export const AmbientTensorCanvas: React.FC<AmbientTensorCanvasProps> = ({ lang = 'en' }) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [watermarksVisible, setWatermarksVisible] = useState<boolean>(true);
  const [ropeOpacity, setRopeOpacity] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('rope_translucency');
      return saved !== null ? Number(saved) : 0.22;
    } catch {
      return 0.22;
    }
  });
  const [isRopeControlOpen, setIsRopeControlOpen] = useState<boolean>(false);
  const [activeHead, setActiveHead] = useState<number>(4);
  const [clock, setClock] = useState<number>(0);
  const [hoveredPageId, setHoveredPageId] = useState<number | null>(null);

  const handleOpacityChange = (newVal: number) => {
    const clamped = Math.max(0, Math.min(1, newVal));
    setRopeOpacity(clamped);
    try {
      localStorage.setItem('rope_translucency', clamped.toString());
    } catch {}
  };

  // Subtle clock animation for live tensor pulse
  useEffect(() => {
    const timer = setInterval(() => {
      setClock((prev) => (prev + 1) % 360);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  // Simulated VRAM KV-Cache page tables (PagedAttention memory architecture) - Stable memory pages
  const kvPages: KvPage[] = useMemo(() => {
    const statuses: ('pinned' | 'active' | 'cached' | 'free')[] = [
      'pinned', 'pinned', 'active', 'active', 'active',
      'cached', 'cached', 'cached', 'cached', 'cached',
      'free', 'free', 'free', 'free', 'free', 'free'
    ];
    const prefixTokens = ['[JUL]', '[ENG]', '[LLM]', '[SYS]', '[CIR]', '[DDP]', '[ROPE]', '[SFT]', '[GQA]', '[BPE]'];

    return statuses.map((status, idx) => ({
      id: idx,
      address: `0x${(0x7f20 + idx * 0x14).toString(16).toUpperCase()}`,
      status,
      tokens: status === 'free' ? [] : [prefixTokens[idx % prefixTokens.length], prefixTokens[(idx + 3) % prefixTokens.length]],
      keysCount: status === 'free' ? 0 : 64,
      heat: status === 'pinned' ? 0.95 : status === 'active' ? 0.75 : status === 'cached' ? 0.45 : 0.05,
    }));
  }, []);

  const activeHoveredPage = useMemo(() => {
    return hoveredPageId !== null ? kvPages.find((p) => p.id === hoveredPageId) || null : null;
  }, [hoveredPageId, kvPages]);

  // Causal Attention Matrix (Lower Triangular)
  const attentionMatrix = useMemo(() => {
    const size = 8;
    const matrix: { val: number; masked: boolean }[][] = [];

    for (let i = 0; i < size; i++) {
      const row: { val: number; masked: boolean }[] = [];
      let rowSum = 0;

      for (let j = 0; j < size; j++) {
        if (j > i) {
          row.push({ val: 0, masked: true });
        } else {
          const dist = i - j;
          const phase = Math.sin((clock * 0.1) + dist * 0.6 + (activeHead * 0.3));
          const weight = Math.exp(-dist * 0.4) + Math.abs(phase) * 0.25;
          row.push({ val: weight, masked: false });
          rowSum += weight;
        }
      }

      const normalizedRow = row.map((cell) => ({
        val: cell.masked ? 0 : +(cell.val / (rowSum || 1)).toFixed(2),
        masked: cell.masked,
      }));
      matrix.push(normalizedRow);
    }

    return matrix;
  }, [clock, activeHead]);

  if (!isVisible) {
    return (
      <div className="fixed top-20 right-4 sm:right-6 z-50 pointer-events-auto">
        <button
          type="button"
          onClick={() => setIsVisible(true)}
          className="px-3 py-1.5 rounded-full bg-zinc-950/90 border border-zinc-800 text-[11px] font-mono text-zinc-400 hover:text-[#adff2f] transition-colors flex items-center gap-2 shadow-2xl backdrop-blur-md cursor-pointer"
          title={lang === 'pt' ? 'Ativar substrato de tensores' : 'Enable Tensor Substrate'}
        >
          <Eye className="w-3.5 h-3.5 text-[#adff2f]" />
          <span>{lang === 'pt' ? 'Tensores & RoPE' : 'Tensors & RoPE'}</span>
        </button>
      </div>
    );
  }

  return (
    <>
      {/* 1. AMBIENT BACKGROUND SUBSTRATE (CANVAS, SVG, VRAM TABLE, ATTENTION MATRIX) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden font-mono text-zinc-600">
        
        {/* MATHEMATICAL TENSOR WATERMARKS (High Visibility & Legibility) */}
        {watermarksVisible && (
          <>
            {/* Watermark 1: Upper-Left Negative Space (Tensor Shape & Attention Formulation) */}
            <div
              aria-hidden="true"
              className="absolute top-24 left-3 sm:left-8 z-0 max-w-[280px] sm:max-w-xs p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 shadow-2xl backdrop-blur-md select-none text-[10px] sm:text-xs leading-relaxed transition-all duration-300 pointer-events-auto hover:opacity-100 hover:border-[#adff2f]/50"
            >
              <div className="text-[#adff2f] font-bold tracking-wider mb-1 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>{lang === 'pt' ? 'ARQUITETURA TENSORIAL CIR-503M' : 'CIR-503M TENSOR ARCHITECTURE'}</span>
              </div>
              <div className="text-zinc-200 font-semibold">
                Attention(Q,K,V) = softmax(QKᵀ / √dₖ + M) · V
              </div>
              <div className="text-zinc-400 mt-1">
                {lang === 'pt' ? 'Frequência Base RoPE:' : 'RoPE Frequency Base:'}{' '}
                <strong className="text-white">Θ = 10.000</strong> · dₖ = 64
              </div>
              <div className="text-[#38bdf8] text-[9px] sm:text-[10px] mt-0.5">
                {lang === 'pt'
                  ? 'RadixAttention Caching de Prefixos · TamBloco: 16 tok/p'
                  : 'RadixAttention Prefix Caching · BlockSize: 16 tok/p'}
              </div>
            </div>

            {/* Watermark 2: Upper-Right Negative Space (VRAM Allocation & Distributed DDP) */}
            <div
              aria-hidden="true"
              className="absolute top-36 right-3 sm:right-8 z-0 max-w-[260px] sm:max-w-xs p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 shadow-2xl backdrop-blur-md select-none text-[10px] sm:text-xs text-right leading-relaxed transition-all duration-300 pointer-events-auto hover:opacity-100 hover:border-[#38bdf8]/50"
            >
              <div className="text-[#38bdf8] font-bold tracking-wider mb-1 flex items-center justify-end gap-1.5">
                <span>{lang === 'pt' ? 'ALOCAÇÃO VRAM: 128 MB' : 'VRAM ALLOCATION: 128 MB'}</span>
                <Database className="w-3.5 h-3.5" />
              </div>
              <div className="text-zinc-200 font-semibold">
                DDP Ring-AllReduce: <span className="text-[#adff2f]">~6.200 tok/s</span>
              </div>
              <div className="text-zinc-400 mt-1">
                {lang === 'pt' ? 'Alvo: CUDA 12.4 + Apple Metal MPS' : 'Target: CUDA 12.4 + Apple Metal MPS'}
              </div>
              <div className="text-purple-300 text-[9px] sm:text-[10px] mt-0.5">
                FlashAttention-2 Kernel: Online Softmax Tiling
              </div>
            </div>

            {/* Watermark 3: Ambient Center Backdrop Formulas */}
            <div
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none text-center opacity-25 hidden sm:block"
            >
              <div className="text-3xl sm:text-5xl font-extrabold tracking-widest text-[#adff2f]/25 font-mono">
                e^(i·mθ) ⊗ softmax(QKᵀ/√d)
              </div>
              <div className="text-xs font-mono text-zinc-500 tracking-widest mt-2 uppercase">
                {lang === 'pt'
                  ? 'Substrato Tensorial Autorregressivo Causal CIR-503M · PyTorch DDP'
                  : 'CIR-503M Causal Autoregressive Tensor Substrate · PyTorch DDP'}
              </div>
            </div>

            {/* Background Substrate Left Margin: KV-Cache VRAM Page Table Watermark (Visible on Laptops >= 1024px) */}
            <div
              aria-hidden="true"
              className="absolute left-3 xl:left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-2 p-2.5 rounded-xl bg-zinc-950/30 border border-zinc-800/40 opacity-30 pointer-events-none select-none w-[200px]"
            >
              <div className="flex items-center justify-between pb-1 border-b border-zinc-850/60 text-[9px]">
                <div className="flex items-center gap-1.5 text-zinc-400 font-bold">
                  <Database className="w-3 h-3 text-[#38bdf8]" />
                  <span>{lang === 'pt' ? 'SUBSTRATO KV-CACHE' : 'KV-CACHE SUBSTRATE'}</span>
                </div>
                <span className="text-[8px] text-[#adff2f] bg-[#adff2f]/10 px-1 rounded font-bold">128MB</span>
              </div>

              <div className="grid grid-cols-4 gap-1 py-0.5">
                {kvPages.map((page) => {
                  const isPinned = page.status === 'pinned';
                  const isActive = page.status === 'active';
                  const isCached = page.status === 'cached';

                  return (
                    <div
                      key={page.id}
                      className={`h-6 rounded border flex flex-col items-center justify-center text-[8px] ${
                        isPinned
                          ? 'bg-[#adff2f]/10 border-[#adff2f]/30 text-[#adff2f]'
                          : isActive
                          ? 'bg-sky-500/10 border-sky-500/30 text-[#38bdf8]'
                          : isCached
                          ? 'bg-purple-500/10 border-purple-500/20 text-purple-300'
                          : 'bg-zinc-900/30 border-zinc-850/40 text-zinc-600'
                      }`}
                    >
                      <span className="font-bold">P{page.id}</span>
                    </div>
                  );
                })}
              </div>

              <div className="text-[8px] pt-1 border-t border-zinc-850/60 leading-tight text-zinc-500 space-y-0.5">
                <div className="flex justify-between text-zinc-400 font-semibold">
                  <span>{lang === 'pt' ? 'Alocação PagedAttn' : 'PagedAttn Alloc'}</span>
                  <span className="text-[#adff2f]">{lang === 'pt' ? '10/16 Págs' : '10/16 Pgs'}</span>
                </div>
                <div className="text-zinc-600 truncate font-mono">
                  {lang === 'pt' ? 'Bloco: 16 tok/p · Radix Caching' : 'Block: 16 tok/p · Radix Caching'}
                </div>
              </div>
            </div>

            {/* Background Substrate Right Margin: Causal Attention Matrix Watermark (Visible on Laptops >= 1024px) */}
            <div
              aria-hidden="true"
              className="absolute right-3 xl:right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-2 p-2.5 rounded-xl bg-zinc-950/30 border border-zinc-800/40 opacity-30 pointer-events-none select-none max-w-[200px]"
            >
              <div className="flex items-center justify-between pb-1 border-b border-zinc-850/60 text-[9px]">
                <div className="flex items-center gap-1.5 text-zinc-400 font-bold">
                  <Layers className="w-3 h-3 text-[#adff2f]" />
                  <span>{lang === 'pt' ? 'CABEÇA ATENÇÃO H#0' : 'CAUSAL ATTN HEAD H#0'}</span>
                </div>
                <span className="text-[8px] text-[#38bdf8] bg-sky-950/30 px-1 rounded font-bold">8x8</span>
              </div>

              <div className="grid grid-cols-8 gap-0.5 py-0.5">
                {attentionMatrix.map((row, rIdx) =>
                  row.map((cell, cIdx) => (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      style={{
                        backgroundColor: cell.masked
                          ? 'transparent'
                          : `rgba(173, 255, 47, ${Math.max(0.1, cell.val * 0.7)})`,
                        borderColor: cell.masked
                          ? 'rgba(39, 39, 42, 0.4)'
                          : `rgba(173, 255, 47, ${Math.max(0.15, cell.val * 0.5)})`,
                      }}
                      className={`w-3.5 h-3.5 rounded-xs border text-[6px] flex items-center justify-center ${
                        cell.masked ? 'opacity-20' : 'text-lime-300 font-bold'
                      }`}
                    >
                      {!cell.masked && cell.val > 0.35 ? (
                        <span className="scale-75">{(cell.val * 10).toFixed(0)}</span>
                      ) : null}
                    </div>
                  ))
                )}
              </div>

              <div className="flex items-center justify-between text-[8px] text-zinc-600 pt-1 border-t border-zinc-850/60">
                <span>Softmax(QKᵀ/√d)</span>
                <span className="text-[#38bdf8]/70">{lang === 'pt' ? 'Causal Msk' : 'Causal Msk'}</span>
              </div>
            </div>
          </>
        )}

        {/* 60FPS High-Performance RoPE Phase Canvas */}
        <RopePhaseCanvas opacityLevel={ropeOpacity} />
      </div>

      {/* 2. FOREGROUND TOP-LEVEL CONTROLLER (Z-50, FULL POINTER DRAG & CLICK ACCESS) */}
      <aside aria-label="Ajustes de Tensores e RoPE" className="fixed top-20 right-4 sm:right-6 z-50 pointer-events-auto flex items-center gap-2 font-mono">
        {/* Toggle Watermarks Button */}
        <button
          type="button"
          onClick={() => setWatermarksVisible((prev) => !prev)}
          className={`px-2.5 py-1.5 rounded-full border text-[10px] transition-colors flex items-center gap-1.5 shadow-xl backdrop-blur-xl cursor-pointer ${
            watermarksVisible
              ? 'bg-zinc-950/90 border-[#adff2f]/40 text-[#adff2f]'
              : 'bg-zinc-950/90 border-zinc-800 text-zinc-500 hover:text-zinc-300'
          }`}
          title={lang === 'pt' ? "Alternar visibilidade das marcas d'água" : 'Toggle Watermarks'}
        >
          <Zap className="w-3 h-3" />
          <span className="hidden sm:inline">
            {watermarksVisible
              ? (lang === 'pt' ? "Marcas d'Água: On" : 'Watermarks: On')
              : (lang === 'pt' ? "Marcas d'Água: Off" : 'Watermarks: Off')}
          </span>
        </button>

        {/* RoPE Translucency Slider Control Pill */}
        <div className="relative">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-950/90 border border-zinc-800 text-[11px] text-zinc-200 shadow-2xl backdrop-blur-xl">
            {/* RoPE Icon & Label */}
            <button
              type="button"
              onClick={() => setIsRopeControlOpen((prev) => !prev)}
              className="flex items-center gap-1.5 hover:text-[#adff2f] transition-colors cursor-pointer group"
              title={lang === 'pt' ? 'Configurar translucidez RoPE' : 'Configure RoPE Translucency'}
            >
              <Waves className="w-3.5 h-3.5 text-[#adff2f] group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-xs hidden sm:inline">RoPE</span>
            </button>

            {/* Quick Minus Button */}
            <button
              type="button"
              onClick={() => handleOpacityChange(ropeOpacity - 0.05)}
              className="w-5 h-5 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
              title={lang === 'pt' ? 'Diminuir 5%' : 'Decrease 5%'}
            >
              <Minus className="w-2.5 h-2.5" />
            </button>

            {/* Pointer-Draggable Custom Slider */}
            <PointerSlider
              value={ropeOpacity}
              onChange={handleOpacityChange}
              widthClass="w-20 sm:w-28"
              lang={lang}
            />

            {/* Quick Plus Button */}
            <button
              type="button"
              onClick={() => handleOpacityChange(ropeOpacity + 0.05)}
              className="w-5 h-5 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
              title={lang === 'pt' ? 'Aumentar 5%' : 'Increase 5%'}
            >
              <Plus className="w-2.5 h-2.5" />
            </button>

            {/* Percentage Display */}
            <span className="tabular-nums text-[#adff2f] font-bold text-[11px] w-8 text-right">
              {Math.round(ropeOpacity * 100)}%
            </span>

            {/* Popover Presets Button */}
            <button
              type="button"
              onClick={() => setIsRopeControlOpen((prev) => !prev)}
              className={`p-1 rounded-md transition-colors cursor-pointer ${
                isRopeControlOpen ? 'text-[#adff2f] bg-[#adff2f]/10' : 'text-zinc-500 hover:text-white'
              }`}
              title={lang === 'pt' ? 'Predefinições de translucidez' : 'Translucency Presets'}
            >
              <Sliders className="w-3 h-3" />
            </button>
          </div>

          {/* Quick Presets Popover Panel */}
          {isRopeControlOpen && (
            <div className="absolute right-0 top-11 w-64 p-3.5 rounded-2xl bg-zinc-950/98 border border-zinc-800 shadow-2xl backdrop-blur-2xl space-y-3 animate-in fade-in zoom-in-95 duration-150 z-50">
              <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-850 pb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Waves className="w-3.5 h-3.5 text-[#adff2f]" />
                  <span>{lang === 'pt' ? 'Translucidez RoPE' : 'RoPE Translucency'}</span>
                </span>
                <span className="text-[#adff2f] font-bold tabular-nums">
                  {Math.round(ropeOpacity * 100)}%
                </span>
              </div>

              {/* Large Draggable Slider in Popover */}
              <div className="space-y-1.5">
                <PointerSlider
                  value={ropeOpacity}
                  onChange={handleOpacityChange}
                  widthClass="w-full"
                  lang={lang}
                />
                <div className="flex justify-between text-[9px] text-zinc-500 font-mono">
                  <span>0% ({lang === 'pt' ? 'Off' : 'Off'})</span>
                  <span className="text-[#adff2f]">22% ({lang === 'pt' ? 'Ideal' : 'Opt'})</span>
                  <span>100% ({lang === 'pt' ? 'Sólido' : 'Solid'})</span>
                </div>
              </div>

              {/* Instant One-Click Preset Chips */}
              <div className="grid grid-cols-4 gap-1.5 pt-1 text-[9px] font-mono">
                {[
                  { label: '0%', val: 0, title: lang === 'pt' ? 'Deslig' : 'Off' },
                  { label: '12%', val: 0.12, title: lang === 'pt' ? 'Suave' : 'Faint' },
                  { label: '22%', val: 0.22, title: lang === 'pt' ? 'Ideal' : 'Ideal' },
                  { label: '45%', val: 0.45, title: lang === 'pt' ? 'Média' : 'Medium' },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleOpacityChange(preset.val)}
                    className={`py-1.5 px-1 rounded-lg border text-center transition-all cursor-pointer ${
                      Math.abs(ropeOpacity - preset.val) < 0.05
                        ? 'bg-[#adff2f]/20 border-[#adff2f] text-[#adff2f] font-bold shadow-xs'
                        : 'bg-zinc-900 border-zinc-850 text-zinc-400 hover:text-white hover:bg-zinc-850'
                    }`}
                  >
                    <div className="font-bold">{preset.label}</div>
                    <div className="text-[8px] opacity-75">{preset.title}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Global Substrate Visibility Toggle */}
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="px-2.5 py-1.5 rounded-full bg-zinc-950/90 border border-zinc-800 text-[10px] text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 shadow-xl backdrop-blur-xl cursor-pointer group"
          title={lang === 'pt' ? 'Ocultar substrato de tensores' : 'Hide Tensor Substrate'}
        >
          <EyeOff className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
          <span className="hidden sm:inline">{lang === 'pt' ? 'Tensores' : 'Tensors'}</span>
        </button>
      </aside>
    </>
  );
};
