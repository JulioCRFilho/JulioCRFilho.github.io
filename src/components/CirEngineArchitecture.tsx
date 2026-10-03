import React, { useState } from 'react';
import { Cpu, Zap, Activity, CheckCircle2, Play, Terminal, ArrowRight, Layers, Gauge } from 'lucide-react';

interface CirEngineArchitectureProps {
  lang?: 'en' | 'pt';
}

export const CirEngineArchitecture: React.FC<CirEngineArchitectureProps> = ({ lang = 'en' }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'grammar_simulation' | 'ddp_benchmarks'>('architecture');
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const SIMULATION_STEPS = [
    {
      label: '[OP:QUERY]',
      title: 'Canonical Input Query',
      code: '[OP:QUERY] Compute causal graph probability given P(A) = 0.85 and P(B|A) = 0.92',
      explanation:
        'The model receives a strictly formatted canonical prompt, eliminating conversational fluff and persona drift.',
    },
    {
      label: '[OP:SOLVE]',
      title: 'Chain-of-Thought with SFT Prompt Loss Masking',
      code: '[OP:SOLVE] Joint probability P(A ∩ B) = P(A) * P(B|A). Subroutine calculation required.',
      explanation:
        'SFT loss masking (labels = -100) ensures gradients only penalize reasoning tokens, avoiding prompt overfitting.',
    },
    {
      label: '[OP:CALC]',
      title: 'Autonomous Tool-Use Interceptor Triggered',
      code: '[OP:CALC] 0.85 * 0.92',
      explanation:
        'The neural kernel emits a structured calculation call. The runtime interceptor pauses autoregression and invokes deterministic Python execution.',
    },
    {
      label: '[OP:RESULT]',
      title: 'Deterministic O(1) Python Return',
      code: '[OP:RESULT] [VAL: 0.7820] [CALC_LATENCY: 0.42ms]',
      explanation:
        'The Python loop returns verified result with 100% mathematical accuracy, injected directly into the KV-cache without halluncinations.',
    },
    {
      label: '[OP:VERIFY]',
      title: 'Completed Deterministic Sequence',
      code: '[OP:QUERY_COMPLETE] [STATUS: VERIFIED] Format compliance: 100%',
      explanation:
        'Final output achieves 98-100% grammar compliance with zero anthropomorphic drift.',
    },
  ];

  const runSimulation = () => {
    setIsSimulating(true);
    setSimulationStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < SIMULATION_STEPS.length) {
        setSimulationStep(step);
      } else {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 1200);
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 lg:p-8 backdrop-blur-xl shadow-2xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-lime-400/10 text-[#adff2f] border border-lime-400/20">
              CIR-ENGINE-503M CHECKPOINT
            </span>
            <span className="text-xs font-mono text-zinc-500">PyTorch Causal Architecture</span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-white">
            CIR-Engine (Causal Inference & Reasoning) — 503M
          </h3>
          <p className="text-sm text-zinc-400 mt-1 max-w-3xl">
            {lang === 'pt'
              ? 'Transformer causal autoregressivo proprietário de 503M parâmetros treinado do zero em PyTorch com RoPE, RMSNorm, GQA e interceptação autônoma de ferramentas.'
              : 'Proprietary 503M-parameter causal autoregressive Transformer trained from scratch in PyTorch featuring RoPE, RMSNorm, GQA, and autonomous runtime tool interception.'}
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-lg self-start lg:self-auto">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'architecture' ? 'bg-zinc-800 text-[#adff2f]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Architecture Specs
          </button>
          <button
            onClick={() => setActiveTab('grammar_simulation')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'grammar_simulation' ? 'bg-zinc-800 text-[#38bdf8]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Grammar & Tool Interceptor
          </button>
          <button
            onClick={() => setActiveTab('ddp_benchmarks')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'ddp_benchmarks' ? 'bg-zinc-800 text-[#c4b5fd]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            DDP Distributed Telemetry
          </button>
        </div>
      </div>

      {/* Tab 1: Architecture Specifications */}
      {activeTab === 'architecture' && (
        <div className="mt-6 space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-zinc-900/60 border border-zinc-800/80 rounded-xl">
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Parameters</span>
              <div className="text-2xl font-bold font-mono text-[#adff2f] mt-1 tabular-nums">503M</div>
              <span className="text-[11px] text-zinc-400 mt-1 block">Full weights from scratch</span>
            </div>
            <div className="p-4 bg-zinc-900/60 border border-zinc-800/80 rounded-xl">
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Hidden Dimension</span>
              <div className="text-2xl font-bold font-mono text-[#38bdf8] mt-1 tabular-nums">1536</div>
              <span className="text-[11px] text-zinc-400 mt-1 block">16 Transformer Layers</span>
            </div>
            <div className="p-4 bg-zinc-900/60 border border-zinc-800/80 rounded-xl">
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Attention Heads</span>
              <div className="text-2xl font-bold font-mono text-[#c4b5fd] mt-1 tabular-nums">12 / 4 KV</div>
              <span className="text-[11px] text-zinc-400 mt-1 block">Grouped-Query Attention (GQA)</span>
            </div>
            <div className="p-4 bg-zinc-900/60 border border-zinc-800/80 rounded-xl">
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">DDP Throughput</span>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">~6,200 t/s</div>
              <span className="text-[11px] text-zinc-400 mt-1 block">NVIDIA Tesla T4 & L4 cluster</span>
            </div>
          </div>

          {/* Interactive Pipeline Diagram */}
          <div className="p-5 bg-zinc-900/40 border border-zinc-800 rounded-xl">
            <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#adff2f]" />
              CIR-Engine Neural Tensor Forward Pass:
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center font-mono text-xs">
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg flex flex-col justify-center items-center">
                <span className="text-zinc-500 text-[10px]">INPUT</span>
                <span className="font-bold text-[#adff2f] mt-1">Byte-BPE Tokens</span>
                <span className="text-[10px] text-zinc-400 mt-1">Vocab: 48,256</span>
              </div>

              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg flex flex-col justify-center items-center relative">
                <span className="text-zinc-500 text-[10px]">POSITION</span>
                <span className="font-bold text-[#38bdf8] mt-1">RoPE Embeddings</span>
                <span className="text-[10px] text-zinc-400 mt-1">Rotary Complex Rotations</span>
              </div>

              <div className="p-3 bg-zinc-900 border border-lime-400/30 rounded-lg flex flex-col justify-center items-center relative shadow-lg shadow-lime-400/5">
                <span className="text-[#adff2f] text-[10px] font-semibold">16x REPEATED BLOCK</span>
                <span className="font-bold text-white mt-1">RMSNorm + GQA</span>
                <span className="text-[10px] text-zinc-300 mt-1">SDPA FlashAttention + SwiGLU</span>
              </div>

              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg flex flex-col justify-center items-center">
                <span className="text-zinc-500 text-[10px]">NORMALIZATION</span>
                <span className="font-bold text-[#c4b5fd] mt-1">Final RMSNorm</span>
                <span className="text-[10px] text-zinc-400 mt-1">Variance Scaling</span>
              </div>

              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg flex flex-col justify-center items-center">
                <span className="text-zinc-500 text-[10px]">HEAD</span>
                <span className="font-bold text-emerald-400 mt-1">LM Head (Logits)</span>
                <span className="text-[10px] text-zinc-400 mt-1">Causal Token Predict</span>
              </div>
            </div>
          </div>

          {/* Architectural Innovations List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4 text-[#adff2f]" />
                Rotary Position Embeddings (RoPE) & RMSNorm
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Replaces absolute learnable position embeddings with relative rotational complex multiplications directly on Query and Key vectors. Paired with RMSNorm to eliminate mean-centering overhead, accelerating forward/backward passes by 18%.
              </p>
            </div>

            <div className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4 text-[#38bdf8]" />
                Grouped-Query Attention (GQA) & FlashAttention
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Utilizes 12 Query heads and 4 Key/Value heads (3:1 ratio), shrinking KV-cache memory bandwidth requirement by 66% during autoregressive generation, coupled with PyTorch scaled dot-product attention (SDPA/FlashAttention).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Canonical Grammar Simulation */}
      {activeTab === 'grammar_simulation' && (
        <div className="mt-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#adff2f]" />
                Strict Canonical Grammar & O(1) Tool Interceptor
              </h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Eliminates anthropomorphic chatter by binding model outputs to an exact machine execution grammar.
              </p>
            </div>
            <button
              onClick={runSimulation}
              disabled={isSimulating}
              className="flex items-center gap-2 px-4 py-2 bg-[#adff2f] text-black font-mono text-xs font-bold rounded-lg hover:bg-lime-300 disabled:opacity-50 transition-all self-start sm:self-auto cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              {isSimulating ? 'Simulating Pass...' : 'Run Kernel Step'}
            </button>
          </div>

          {/* Interactive Step Navigator */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {SIMULATION_STEPS.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setSimulationStep(idx)}
                className={`p-2.5 rounded-lg text-left font-mono text-xs border transition-all ${
                  simulationStep === idx
                    ? 'bg-zinc-800 border-[#adff2f] text-white shadow-xs'
                    : 'bg-zinc-900/40 border-zinc-850 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <div className="text-[10px] text-[#adff2f] font-semibold">{step.label}</div>
                <div className="truncate mt-0.5 font-sans">{step.title}</div>
              </button>
            ))}
          </div>

          {/* Active Step Details */}
          <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#adff2f] uppercase tracking-wider">
                Step {simulationStep + 1} of {SIMULATION_STEPS.length}: {SIMULATION_STEPS[simulationStep].label}
              </span>
              <span className="text-xs font-mono text-zinc-500">
                {simulationStep === 2 ? '⚡ Autonomous Python Interception' : 'Kernel Reasoning Pass'}
              </span>
            </div>

            {/* Code Box */}
            <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-lg font-mono text-sm text-[#adff2f]">
              {SIMULATION_STEPS[simulationStep].code}
            </div>

            {/* Explanation */}
            <div className="text-xs text-zinc-300 leading-relaxed font-sans bg-zinc-900/30 p-3 rounded-md border border-zinc-850">
              <strong className="text-white">Engineering Mechanism: </strong>
              {SIMULATION_STEPS[simulationStep].explanation}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: DDP Distributed Benchmarks */}
      {activeTab === 'ddp_benchmarks' && (
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Training Runtime</span>
                <span className="text-[#adff2f] font-bold">-66% cut</span>
              </div>
              <div className="text-3xl font-bold font-mono text-white tabular-nums">61 min</div>
              <p className="text-xs text-zinc-400">Down from 180 min per epoch via mixed-precision FP16/AMP and DistributedDataParallel.</p>
            </div>

            <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Throughput</span>
                <span className="text-[#38bdf8] font-bold">+226% boost</span>
              </div>
              <div className="text-3xl font-bold font-mono text-white tabular-nums">~6,200 t/s</div>
              <p className="text-xs text-zinc-400">Cluster throughput utilizing multi-GPU NVIDIA Tesla T4 and L4 with torchrun.</p>
            </div>

            <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Local MPS Inference</span>
                <span className="text-[#c4b5fd] font-bold">Apple Silicon</span>
              </div>
              <div className="text-3xl font-bold font-mono text-white tabular-nums">~0.19s</div>
              <p className="text-xs text-zinc-400">Metal Performance Shaders (MPS) local validation loop for sub-second rapid prototyping.</p>
            </div>
          </div>

          {/* Comparative Progress Bars */}
          <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl space-y-4">
            <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
              Distributed Training Throughput Comparison (Tokens per Second):
            </h4>

            {/* Baseline Single GPU */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Single GPU Baseline (FP32, no DDP):</span>
                <span className="text-zinc-450 tabular-nums">1,900 tokens/s</span>
              </div>
              <div className="w-full bg-zinc-850 h-3 rounded-full overflow-hidden">
                <div className="bg-zinc-600 h-full rounded-full" style={{ width: '30%' }} />
              </div>
            </div>

            {/* Distributed DDP + FP16/AMP */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#adff2f] font-semibold">CIR-Engine DDP Multi-GPU (FP16/AMP + torchrun):</span>
                <span className="text-[#adff2f] font-bold tabular-nums">6,200 tokens/s</span>
              </div>
              <div className="w-full bg-zinc-850 h-3 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-lime-500 to-[#adff2f] h-full rounded-full shadow-sm shadow-[#adff2f]/50" style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
