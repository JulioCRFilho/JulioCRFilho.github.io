import React, { useState } from 'react';
import { Cpu, Zap, Activity, CheckCircle2, Play, Terminal, Layers } from 'lucide-react';

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
      title: lang === 'pt' ? 'Consulta Canônica de Entrada' : 'Canonical Input Query',
      code: '[OP:QUERY] Compute causal graph probability given P(A) = 0.85 and P(B|A) = 0.92',
      explanation:
        lang === 'pt'
          ? 'O modelo recebe um prompt estritamente formatado no padrão canônico, eliminando divagações conversacionais e desvios de persona.'
          : 'The model receives a strictly formatted canonical prompt, eliminating conversational fluff and persona drift.',
    },
    {
      label: '[OP:SOLVE]',
      title: lang === 'pt' ? 'Cadeia de Raciocínio com Mascaramento de Loss SFT' : 'Chain-of-Thought with SFT Prompt Loss Masking',
      code: '[OP:SOLVE] Joint probability P(A ∩ B) = P(A) * P(B|A). Subroutine calculation required.',
      explanation:
        lang === 'pt'
          ? 'O mascaramento de loss SFT (labels = -100) garante que os gradientes penalizem apenas tokens de raciocínio, prevenindo overfitting em templates.'
          : 'SFT loss masking (labels = -100) ensures gradients only penalize reasoning tokens, avoiding prompt overfitting.',
    },
    {
      label: '[OP:CALC]',
      title: lang === 'pt' ? 'Interceptador Autônomo de Ferramentas Acionado' : 'Autonomous Tool-Use Interceptor Triggered',
      code: '[OP:CALC] 0.85 * 0.92',
      explanation:
        lang === 'pt'
          ? 'O kernel neural emite uma chamada estruturada de cálculo. O interceptor do runtime pausa a autorregressão e invoca a execução determinística em Python.'
          : 'The neural kernel emits a structured calculation call. The runtime interceptor pauses autoregression and invokes deterministic Python execution.',
    },
    {
      label: '[OP:RESULT]',
      title: lang === 'pt' ? 'Retorno Determinístico O(1) em Python' : 'Deterministic O(1) Python Return',
      code: '[OP:RESULT] [VAL: 0.7820] [CALC_LATENCY: 0.42ms]',
      explanation:
        lang === 'pt'
          ? 'O loop em Python retorna o resultado verificado com 100% de exatidão matemática, injetado diretamente no KV-cache sem qualquer alucinação.'
          : 'The Python loop returns verified result with 100% mathematical accuracy, injected directly into the KV-cache without hallucinations.',
    },
    {
      label: '[OP:VERIFY]',
      title: lang === 'pt' ? 'Sequência Determinística Concluída' : 'Completed Deterministic Sequence',
      code: '[OP:QUERY_COMPLETE] [STATUS: VERIFIED] Format compliance: 100%',
      explanation:
        lang === 'pt'
          ? 'A saída final alcança 98-100% de conformidade de formato gramatical com zero desvio antropomórfico.'
          : 'Final output achieves 98-100% grammar compliance with zero anthropomorphic drift.',
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
            <span className="text-xs font-mono text-zinc-500">
              {lang === 'pt' ? 'Arquitetura Causal em PyTorch' : 'PyTorch Causal Architecture'}
            </span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-white">
            CIR-Engine (Causal Inference & Reasoning) — 503M
          </h3>
          <p className="text-sm text-zinc-400 mt-1 max-w-3xl">
            {lang === 'pt'
              ? 'Transformer causal autorregressivo proprietário de 503M parâmetros treinado do zero em PyTorch com RoPE, RMSNorm, GQA e interceptação autônoma de ferramentas.'
              : 'Proprietary 503M-parameter causal autoregressive Transformer trained from scratch in PyTorch featuring RoPE, RMSNorm, GQA, and autonomous runtime tool interception.'}
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-lg self-start lg:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'architecture' ? 'bg-zinc-800 text-[#adff2f]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {lang === 'pt' ? 'Especificações de Arquitetura' : 'Architecture Specs'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('grammar_simulation')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'grammar_simulation' ? 'bg-zinc-800 text-[#38bdf8]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {lang === 'pt' ? 'Gramática & Interceptor' : 'Grammar & Tool Interceptor'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ddp_benchmarks')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'ddp_benchmarks' ? 'bg-zinc-800 text-[#c4b5fd]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {lang === 'pt' ? 'Telemetria Distribuída DDP' : 'DDP Distributed Telemetry'}
          </button>
        </div>
      </div>

      {/* Tab 1: Architecture Specifications */}
      {activeTab === 'architecture' && (
        <div className="mt-6 space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-zinc-900/60 border border-zinc-800/80 rounded-xl">
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                {lang === 'pt' ? 'Parâmetros' : 'Parameters'}
              </span>
              <div className="text-2xl font-bold font-mono text-[#adff2f] mt-1 tabular-nums">503M</div>
              <span className="text-[11px] text-zinc-400 mt-1 block">
                {lang === 'pt' ? 'Pesos próprios do zero' : 'Full weights from scratch'}
              </span>
            </div>
            <div className="p-4 bg-zinc-900/60 border border-zinc-800/80 rounded-xl">
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                {lang === 'pt' ? 'Dimensão Oculta' : 'Hidden Dimension'}
              </span>
              <div className="text-2xl font-bold font-mono text-[#38bdf8] mt-1 tabular-nums">1536</div>
              <span className="text-[11px] text-zinc-400 mt-1 block">
                {lang === 'pt' ? '16 Camadas Transformer' : '16 Transformer Layers'}
              </span>
            </div>
            <div className="p-4 bg-zinc-900/60 border border-zinc-800/80 rounded-xl">
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                {lang === 'pt' ? 'Cabeças de Atenção' : 'Attention Heads'}
              </span>
              <div className="text-2xl font-bold font-mono text-[#c4b5fd] mt-1 tabular-nums">12 / 4 KV</div>
              <span className="text-[11px] text-zinc-400 mt-1 block">
                Grouped-Query Attention (GQA)
              </span>
            </div>
            <div className="p-4 bg-zinc-900/60 border border-zinc-800/80 rounded-xl">
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                {lang === 'pt' ? 'Throughput DDP' : 'DDP Throughput'}
              </span>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">~6.200 t/s</div>
              <span className="text-[11px] text-zinc-400 mt-1 block">
                {lang === 'pt' ? 'Cluster NVIDIA Tesla T4 & L4' : 'NVIDIA Tesla T4 & L4 cluster'}
              </span>
            </div>
          </div>

          {/* Interactive Pipeline Diagram */}
          <div className="p-5 bg-zinc-900/40 border border-zinc-800 rounded-xl">
            <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#adff2f]" />
              <span>{lang === 'pt' ? 'Forward Pass Neural de Tensores (CIR-Engine):' : 'CIR-Engine Neural Tensor Forward Pass:'}</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center font-mono text-xs">
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg flex flex-col justify-center items-center">
                <span className="text-zinc-500 text-[10px]">{lang === 'pt' ? 'ENTRADA' : 'INPUT'}</span>
                <span className="font-bold text-[#adff2f] mt-1">{lang === 'pt' ? 'Tokens Byte-BPE' : 'Byte-BPE Tokens'}</span>
                <span className="text-[10px] text-zinc-400 mt-1">{lang === 'pt' ? 'Vocab: 48.256' : 'Vocab: 48,256'}</span>
              </div>

              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg flex flex-col justify-center items-center relative">
                <span className="text-zinc-500 text-[10px]">{lang === 'pt' ? 'POSIÇÃO' : 'POSITION'}</span>
                <span className="font-bold text-[#38bdf8] mt-1">RoPE Embeddings</span>
                <span className="text-[10px] text-zinc-400 mt-1">{lang === 'pt' ? 'Rotações Complexas' : 'Rotary Complex Rotations'}</span>
              </div>

              <div className="p-3 bg-zinc-900 border border-lime-400/30 rounded-lg flex flex-col justify-center items-center relative shadow-lg shadow-lime-400/5">
                <span className="text-[#adff2f] text-[10px] font-semibold">{lang === 'pt' ? '16x BLOCO REPETIDO' : '16x REPEATED BLOCK'}</span>
                <span className="font-bold text-white mt-1">RMSNorm + GQA</span>
                <span className="text-[10px] text-zinc-300 mt-1">SDPA FlashAttention + SwiGLU</span>
              </div>

              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg flex flex-col justify-center items-center">
                <span className="text-zinc-500 text-[10px]">{lang === 'pt' ? 'NORMALIZAÇÃO' : 'NORMALIZATION'}</span>
                <span className="font-bold text-[#c4b5fd] mt-1">{lang === 'pt' ? 'RMSNorm Final' : 'Final RMSNorm'}</span>
                <span className="text-[10px] text-zinc-400 mt-1">{lang === 'pt' ? 'Escala de Variância' : 'Variance Scaling'}</span>
              </div>

              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg flex flex-col justify-center items-center">
                <span className="text-zinc-500 text-[10px]">{lang === 'pt' ? 'CABEÇA LM' : 'HEAD'}</span>
                <span className="font-bold text-emerald-400 mt-1">LM Head (Logits)</span>
                <span className="text-[10px] text-zinc-400 mt-1">{lang === 'pt' ? 'Predição Causal' : 'Causal Token Predict'}</span>
              </div>
            </div>
          </div>

          {/* Architectural Innovations List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4 text-[#adff2f]" />
                <span>Rotary Position Embeddings (RoPE) & RMSNorm</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {lang === 'pt'
                  ? 'Substitui embeddings posicionais aprendidos absolutos por multiplicações rotacionais relativas no plano complexo diretamente sobre os vetores de Query e Key. Combinado com RMSNorm para eliminar a centralização de média, acelerando as passagens direta e reversa em 18%.'
                  : 'Replaces absolute learnable position embeddings with relative rotational complex multiplications directly on Query and Key vectors. Paired with RMSNorm to eliminate mean-centering overhead, accelerating forward/backward passes by 18%.'}
              </p>
            </div>

            <div className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4 text-[#38bdf8]" />
                <span>Grouped-Query Attention (GQA) & FlashAttention</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {lang === 'pt'
                  ? 'Utiliza 12 cabeças de Query e 4 cabeças de Key/Value (razão 3:1), reduzindo a largura de banda de memória do KV-cache em 66% durante a geração autorregressiva, acoplado ao scaled dot-product attention do PyTorch (SDPA/FlashAttention).'
                  : 'Utilizes 12 Query heads and 4 Key/Value heads (3:1 ratio), shrinking KV-cache memory bandwidth requirement by 66% during autoregressive generation, coupled with PyTorch scaled dot-product attention (SDPA/FlashAttention).'}
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
                <span>{lang === 'pt' ? 'Gramática Canônica Estrita & Interceptor O(1)' : 'Strict Canonical Grammar & O(1) Tool Interceptor'}</span>
              </h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                {lang === 'pt'
                  ? 'Elimina conversas antropomórficas e alucinações vinculando a saída do modelo a uma gramática de execução determinística em máquina.'
                  : 'Eliminates anthropomorphic chatter by binding model outputs to an exact machine execution grammar.'}
              </p>
            </div>
            <button
              type="button"
              onClick={runSimulation}
              disabled={isSimulating}
              className="flex items-center gap-2 px-4 py-2 bg-[#adff2f] text-black font-mono text-xs font-bold rounded-lg hover:bg-lime-300 disabled:opacity-50 transition-all self-start sm:self-auto cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>
                {isSimulating
                  ? (lang === 'pt' ? 'Simulando Passo...' : 'Simulating Pass...')
                  : (lang === 'pt' ? 'Executar Passo do Kernel' : 'Run Kernel Step')}
              </span>
            </button>
          </div>

          {/* Interactive Step Navigator */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {SIMULATION_STEPS.map((step, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => setSimulationStep(idx)}
                className={`p-2.5 rounded-lg text-left font-mono text-xs border transition-all cursor-pointer ${
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
                {lang === 'pt' ? 'Passo' : 'Step'} {simulationStep + 1} {lang === 'pt' ? 'de' : 'of'} {SIMULATION_STEPS.length}: {SIMULATION_STEPS[simulationStep].label}
              </span>
              <span className="text-xs font-mono text-zinc-500">
                {simulationStep === 2
                  ? (lang === 'pt' ? '⚡ Interceptação Python Autônoma' : '⚡ Autonomous Python Interception')
                  : (lang === 'pt' ? 'Passo de Raciocínio do Kernel' : 'Kernel Reasoning Pass')}
              </span>
            </div>

            {/* Code Box */}
            <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-lg font-mono text-sm text-[#adff2f]">
              {SIMULATION_STEPS[simulationStep].code}
            </div>

            {/* Explanation */}
            <div className="text-xs text-zinc-300 leading-relaxed font-sans bg-zinc-900/30 p-3 rounded-md border border-zinc-850">
              <strong className="text-white">
                {lang === 'pt' ? 'Mecanismo de Engenharia: ' : 'Engineering Mechanism: '}
              </strong>
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
                <span>{lang === 'pt' ? 'Tempo de Treinamento / Época' : 'Training Runtime'}</span>
                <span className="text-[#adff2f] font-bold">-66% {lang === 'pt' ? 'corte' : 'cut'}</span>
              </div>
              <div className="text-3xl font-bold font-mono text-white tabular-nums">61 min</div>
              <p className="text-xs text-zinc-400">
                {lang === 'pt'
                  ? 'Reduzido de 180 min para 61 min por época via precisão mista FP16/AMP e DistributedDataParallel.'
                  : 'Down from 180 min per epoch via mixed-precision FP16/AMP and DistributedDataParallel.'}
              </p>
            </div>

            <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>{lang === 'pt' ? 'Throughput em Cluster' : 'Throughput'}</span>
                <span className="text-[#38bdf8] font-bold">+226% {lang === 'pt' ? 'ganho' : 'boost'}</span>
              </div>
              <div className="text-3xl font-bold font-mono text-white tabular-nums">~6.200 t/s</div>
              <p className="text-xs text-zinc-400">
                {lang === 'pt'
                  ? 'Throughput de cluster utilizando multi-GPU NVIDIA Tesla T4 e L4 com orquestração via torchrun.'
                  : 'Cluster throughput utilizing multi-GPU NVIDIA Tesla T4 and L4 with torchrun.'}
              </p>
            </div>

            <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>{lang === 'pt' ? 'Inferência Local MPS' : 'Local MPS Inference'}</span>
                <span className="text-[#c4b5fd] font-bold">Apple Silicon</span>
              </div>
              <div className="text-3xl font-bold font-mono text-white tabular-nums">~0,19s</div>
              <p className="text-xs text-zinc-400">
                {lang === 'pt'
                  ? 'Loop de validação local com Metal Performance Shaders (MPS) em Apple Silicon para prototipagem rápida sub-segundo.'
                  : 'Metal Performance Shaders (MPS) local validation loop for sub-second rapid prototyping.'}
              </p>
            </div>
          </div>

          {/* Comparative Progress Bars */}
          <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl space-y-4">
            <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
              {lang === 'pt'
                ? 'Comparação de Throughput de Treinamento Distribuído (Tokens por Segundo):'
                : 'Distributed Training Throughput Comparison (Tokens per Second):'}
            </h4>

            {/* Baseline Single GPU */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">
                  {lang === 'pt' ? 'Linha de Base com GPU Única (FP32, sem DDP):' : 'Single GPU Baseline (FP32, no DDP):'}
                </span>
                <span className="text-zinc-400 tabular-nums">1.900 tokens/s</span>
              </div>
              <div className="w-full bg-zinc-850 h-3 rounded-full overflow-hidden">
                <div className="bg-zinc-600 h-full rounded-full" style={{ width: '30%' }} />
              </div>
            </div>

            {/* Distributed DDP + FP16/AMP */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#adff2f] font-semibold">
                  {lang === 'pt' ? 'CIR-Engine DDP Multi-GPU (FP16/AMP + torchrun):' : 'CIR-Engine DDP Multi-GPU (FP16/AMP + torchrun):'}
                </span>
                <span className="text-[#adff2f] font-bold tabular-nums">6.200 tokens/s</span>
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
