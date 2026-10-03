import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { TokenInteractiveText, TokenAssemblyStage } from './components/TokenInteractiveText';
import { TokenizerPlayground } from './components/TokenizerPlayground';
import { CirEngineArchitecture } from './components/CirEngineArchitecture';
import { ProjectShowcase } from './components/ProjectShowcase';
import { InteractiveToolDemos } from './components/InteractiveToolDemos';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { TerminalModal } from './components/TerminalModal';
import { FloatingTokenMonitor } from './components/FloatingTokenMonitor';
import {
  Github,
  Mail,
  Linkedin,
  ExternalLink,
  Sliders,
  Terminal,
  Cpu,
  Binary,
  Play,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

/**
 * Progressive assembly timeline with an explicit 150ms delay between stages:
 * - 0ms to 500ms: Dwell on Stage 1 (Raw Bytes)
 * - 500ms to 650ms: 150ms transition delay between Bytes and Semi-words
 * - 650ms to 1250ms: Dwell on Stage 2 (BPE Semi-words)
 * - 1250ms to 1400ms: 150ms transition delay between Semi-words and Full Words
 * - 1400ms+: Stage 3 (Full Assembled Words) locked in
 */
function calculateAssemblyProgressWithDelay(elapsedMs: number, totalDuration = 1500): number {
  if (elapsedMs <= 0) return 0.10;
  if (elapsedMs < 500) return 0.10;
  if (elapsedMs < 650) {
    const t = (elapsedMs - 500) / 150;
    return 0.10 + t * (0.50 - 0.10);
  }
  if (elapsedMs < 1250) return 0.50;
  if (elapsedMs < 1400) {
    const t = (elapsedMs - 1250) / 150;
    return 0.50 + t * (1.00 - 0.50);
  }
  return 1.0;
}

/**
 * ScrollAssemblyHeading:
 * When triggered into the viewport reading zone, it smoothly executes a 1.5-second
 * progressive transformation with 150ms delay between each stage.
 */
const ScrollAssemblyHeading: React.FC<{
  text: string;
  stage: TokenAssemblyStage;
  globalProgress: number;
  as?: 'h2' | 'h3' | 'span';
  className?: string;
}> = ({ text, stage, globalProgress, as = 'h2', className = '' }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [localProgress, setLocalProgress] = useState<number>(0.10);
  const hasAnimatedRef = useRef<boolean>(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (stage !== 'auto') return;

    const startAnimation = () => {
      const startTime = performance.now();
      const duration = 2000; // 2.0s for sequential cascading across words

      const step = (now: number) => {
        const elapsed = now - startTime;
        const ratio = Math.min(1, elapsed / duration);
        setLocalProgress(ratio);

        if (ratio < 1) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          setLocalProgress(1.0);
        }
      };

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(step);
    };

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || 800;

      // Trigger zone: when heading reaches ~75% of viewport height (reading zone)
      const isInView = rect.top <= windowHeight * 0.75 && rect.bottom >= 0;
      const isFarBelow = rect.top > windowHeight * 0.98;

      if (isInView && !hasAnimatedRef.current) {
        hasAnimatedRef.current = true;
        startAnimation();
      } else if (isFarBelow && hasAnimatedRef.current) {
        // Reset when scrolled back above
        hasAnimatedRef.current = false;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        setLocalProgress(0.10);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [stage]);

  const effectiveProgress = stage === 'auto' ? localProgress : globalProgress;

  return (
    <div ref={containerRef} className="inline-block">
      <TokenInteractiveText
        text={text}
        progress={effectiveProgress}
        stage={stage}
        as={as}
        size="lg"
        className={className}
      />
    </div>
  );
};

export default function App() {
  const [assemblyStage, setAssemblyStage] = useState<TokenAssemblyStage>('auto');
  const [scrollProgress, setScrollProgress] = useState<number>(0.10); // Start at ~0.10 so bytes are clearly visible
  const [isReplaying, setIsReplaying] = useState<boolean>(false);
  const [lang, setLang] = useState<'en' | 'pt'>('en');
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);

  const heroAnimatedRef = useRef<boolean>(false);
  const heroRafRef = useRef<number | null>(null);

  // 2.2s Progressive Animation Engine for Hero: decodes each word sequentially one after the other
  const startHeroAnimation = () => {
    setIsReplaying(true);
    const startTime = performance.now();
    const duration = 2200; // 2.2s allows each word to sequentially transform

    const step = (now: number) => {
      const elapsed = now - startTime;
      const ratio = Math.min(1, elapsed / duration);
      setScrollProgress(ratio);

      if (ratio < 1) {
        heroRafRef.current = requestAnimationFrame(step);
      } else {
        setScrollProgress(1.0);
        setIsReplaying(false);
      }
    };

    if (heroRafRef.current) cancelAnimationFrame(heroRafRef.current);
    heroRafRef.current = requestAnimationFrame(step);
  };

  // On page mount: brief 400ms delay to display initial bytes, then sequentially assemble words
  useEffect(() => {
    const mountTimer = setTimeout(() => {
      if (!heroAnimatedRef.current && assemblyStage === 'auto') {
        heroAnimatedRef.current = true;
        startHeroAnimation();
      }
    }, 400);

    return () => clearTimeout(mountTimer);
  }, [assemblyStage]);

  // Manual Replay trigger
  const triggerReplayAnimation = () => {
    heroAnimatedRef.current = true;
    setAssemblyStage('auto');
    startHeroAnimation();
  };

  // Determine current active stage name for telemetry indicator
  const currentStageNum =
    assemblyStage === 'bytes'
      ? 1
      : assemblyStage === 'semiwords'
      ? 2
      : assemblyStage === 'words'
      ? 3
      : scrollProgress < 0.35
      ? 1
      : scrollProgress < 0.72
      ? 2
      : 3;

  // Sample texts evaluated by the floating ML token context telemetry
  const textSamplesForMonitor = useMemo(
    () => [
      'JULIO CESAR DA COSTA REIS FILHO',
      lang === 'pt'
        ? 'Arquiteto de Sistemas Sênior e Engenheiro de LLMs. Especialista em construir modelos de inferência causal do zero (CIR-Engine 503M), clusters distribuídos DDP em PyTorch e plataformas escaláveis em Go, Next.js e Flutter.'
        : 'Senior Systems Architect and Machine Learning Engineer. Specialist in training custom Causal Transformers from scratch (CIR-Engine 503M), orchestrating distributed DDP clusters in PyTorch, and architecting scalable enterprise systems in Go, Next.js, and Flutter.',
      'CIR-ENGINE 503M CAUSAL LLM ARCHITECTURE',
      'DISTRIBUTED DDP TRAINING IN PYTORCH CLUSTER',
      'ENTERPRISE ARCHITECTURE AND GO MICROSERVICES',
      'FULL STACK SYSTEMS WITH NEXTJS AND FLUTTER',
      'BENCHMARKS AND INFERENCE METRICS EVALUATION',
      'CONTACT AND ARCHITECTURE CONSULTATION',
    ],
    [lang]
  );

  return (
    <div className="min-h-screen bg-[#07080a] text-zinc-100 selection:bg-[#adff2f] selection:text-black">
      {/* Background Subtle Grid Texture */}
      <div className="fixed inset-0 pointer-events-none bg-grid-pattern opacity-40 z-0" />

      {/* Floating ML Token Telemetry Monitor */}
      <FloatingTokenMonitor textSources={textSamplesForMonitor} lang={lang} />

      {/* Navigation */}
      <Navbar
        assemblyStage={assemblyStage}
        setAssemblyStage={setAssemblyStage}
        lang={lang}
        setLang={setLang}
        onOpenTerminal={() => setIsTerminalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="relative z-10 pt-28 pb-24 px-6 lg:px-12 max-w-7xl mx-auto space-y-32">
        {/* HERO SECTION */}
        <section id="overview" className="pt-6 pb-12">
          {/* Unboxed Metadata Header (frontend-design skill compliant) */}
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-6 flex-wrap">
            <span className="text-[#adff2f]">STATUS: DECODING_LATENT_SPACE</span>
            <span aria-hidden="true">·</span>
            <span>SYSTEMS ARCHITECT & LLM ENGINEER</span>
            <span aria-hidden="true">·</span>
            <span>CURITIBA, BRAZIL</span>
          </div>

          {/* Hero Main Headline with 3-Stage Progressive Token Assembly */}
          <div className="space-y-4 mb-8">
            <div className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight min-h-[90px]">
              <TokenInteractiveText
                text="JULIO CESAR DA COSTA REIS FILHO"
                progress={scrollProgress}
                stage={assemblyStage}
                size="hero"
                as="span"
              />
            </div>
          </div>

          {/* Subtitle / Value Proposition with Token Assembly */}
          <div className="max-w-3xl border-l-2 border-[#adff2f]/40 pl-6 my-8 space-y-3">
            <div className="text-base sm:text-lg text-zinc-300 leading-relaxed font-sans">
              <TokenInteractiveText
                text={
                  lang === 'pt'
                    ? 'Arquiteto de Sistemas Sênior e Engenheiro de LLMs. Especialista em construir modelos de inferência causal do zero (CIR-Engine 503M), clusters distribuídos DDP em PyTorch e plataformas escaláveis em Go, Next.js e Flutter.'
                    : 'Senior Systems Architect and Machine Learning Engineer. Specialist in training custom Causal Transformers from scratch (CIR-Engine 503M), orchestrating distributed DDP clusters in PyTorch, and architecting scalable enterprise systems in Go, Next.js, and Flutter.'
                }
                progress={scrollProgress}
                stage={assemblyStage}
                size="sm"
                as="span"
              />
            </div>
          </div>

          {/* 3-STAGE TOKEN ASSEMBLY PIPELINE HUD */}
          <div className="my-8 p-5 bg-zinc-950/85 border border-zinc-800 rounded-2xl shadow-xl max-w-3xl backdrop-blur-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-850">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#adff2f]" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  {lang === 'pt' ? 'Pipeline de Montagem de Tokens por Scroll' : 'Scroll-Driven Token Assembly Pipeline'}
                </span>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-mono text-zinc-400">
                  {lang === 'pt' ? 'Progresso:' : 'Progress:'}
                </span>
                <span className="text-xs font-mono font-bold text-[#adff2f] tabular-nums bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
                  {Math.round(scrollProgress * 100)}%
                </span>
                <button
                  onClick={triggerReplayAnimation}
                  disabled={isReplaying}
                  className="flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 transition-colors disabled:opacity-50 cursor-pointer"
                  title="Watch the 3-stage assembly animation"
                >
                  <RotateCcw className={`w-3 h-3 text-[#adff2f] ${isReplaying ? 'animate-spin' : ''}`} />
                  <span>{isReplaying ? 'Assembling...' : 'Replay'}</span>
                </button>
              </div>
            </div>

            {/* 3 Step Visual Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
              {/* Step 1: Raw Bytes */}
              <button
                onClick={() => setAssemblyStage('bytes')}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  currentStageNum === 1
                    ? 'bg-lime-400/10 border-[#adff2f] text-white shadow-xs'
                    : 'bg-zinc-900/40 border-zinc-850 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#adff2f]">1. BYTES</span>
                  {currentStageNum === 1 && <span className="w-2 h-2 rounded-full bg-[#adff2f] animate-ping" />}
                </div>
                <div className="text-[11px] text-zinc-400 mt-1 truncate">
                  0x4A 0x75 0x6C 0x69 0x6F
                </div>
                <div className="text-[9px] text-zinc-500 mt-0.5">Stream UTF-8 em Memória</div>
              </button>

              {/* Step 2: Semi-words */}
              <button
                onClick={() => setAssemblyStage('semiwords')}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  currentStageNum === 2
                    ? 'bg-sky-400/10 border-[#38bdf8] text-white shadow-xs'
                    : 'bg-zinc-900/40 border-zinc-850 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#38bdf8]">2. SEMI-WORDS</span>
                  {currentStageNum === 2 && <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-ping" />}
                </div>
                <div className="text-[11px] text-zinc-400 mt-1 truncate">
                  [JUL#102] [IO#982]
                </div>
                <div className="text-[9px] text-zinc-500 mt-0.5">BPE Subword Tokens</div>
              </button>

              {/* Step 3: Full Words */}
              <button
                onClick={() => setAssemblyStage('words')}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  currentStageNum === 3
                    ? 'bg-white/10 border-white text-white shadow-xs'
                    : 'bg-zinc-900/40 border-zinc-850 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">3. PALAVRAS</span>
                  {currentStageNum === 3 && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </div>
                <div className="text-[11px] text-zinc-300 mt-1 truncate font-sans">
                  "JULIO CESAR"
                </div>
                <div className="text-[9px] text-zinc-500 mt-0.5 font-mono">Texto Montado Final</div>
              </button>
            </div>

            {/* Interactive Scrubber Slider */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                <span>{lang === 'pt' ? 'Role a página ou deslize:' : 'Scroll page or drag to scrub assembly:'}</span>
                <span className="text-[#adff2f]">
                  {currentStageNum === 1
                    ? 'Estágio 1 (Bytes)'
                    : currentStageNum === 2
                    ? 'Estágio 2 (Semi-words)'
                    : 'Estágio 3 (Palavras Completas)'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={scrollProgress}
                onChange={(e) => {
                  setScrollProgress(parseFloat(e.target.value));
                  if (assemblyStage !== 'auto') setAssemblyStage('auto');
                }}
                className="w-full accent-[#adff2f] bg-zinc-800 h-2 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Unboxed Key Proof Metrics (anti-slop clean text layout) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-y border-zinc-800/80 my-8">
            <div>
              <div className="text-3xl font-bold font-mono text-[#adff2f] tabular-nums">503M</div>
              <div className="text-xs text-zinc-400 mt-1">Causal Transformer Parameters</div>
            </div>
            <div>
              <div className="text-3xl font-bold font-mono text-[#38bdf8] tabular-nums">~6,200</div>
              <div className="text-xs text-zinc-400 mt-1">Tokens/sec DDP Throughput</div>
            </div>
            <div>
              <div className="text-3xl font-bold font-mono text-[#c4b5fd] tabular-nums">8+ Years</div>
              <div className="text-xs text-zinc-400 mt-1">Full-Stack & Systems Architecture</div>
            </div>
            <div>
              <div className="text-3xl font-bold font-mono text-emerald-400 tabular-nums">1M+</div>
              <div className="text-xs text-zinc-400 mt-1">Users Served in FinTech Mobile</div>
            </div>
          </div>

          {/* Hero Action Buttons & External Channels */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a
              href="#cir-engine"
              className="px-5 py-2.5 bg-[#adff2f] hover:bg-lime-300 text-black text-xs font-mono font-bold rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-lime-400/10 cursor-pointer"
            >
              <Cpu className="w-4 h-4" />
              <span>{lang === 'pt' ? 'Explorar CIR-Engine 503M' : 'Inspect CIR-Engine 503M'}</span>
            </a>

            <a
              href="#tokenizer-lab"
              className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-white text-xs font-mono rounded-lg border border-zinc-800 hover:border-zinc-700 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Binary className="w-4 h-4 text-[#38bdf8]" />
              <span>{lang === 'pt' ? 'Laboratório de Tokens' : 'Token & Byte Sandbox'}</span>
            </a>

            <button
              onClick={() => setIsTerminalOpen(true)}
              className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white text-xs font-mono rounded-lg border border-zinc-800 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-[#adff2f]" />
              <span>predict_contact_method()</span>
            </button>

            <a
              href="https://github.com/juliocrfilho"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg border border-zinc-800 transition-colors"
              title="GitHub Profile (juliocrfilho)"
            >
              <Github className="w-4 h-4" />
            </a>

            <a
              href="mailto:reisfilho1116@gmail.com"
              className="p-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-[#adff2f] rounded-lg border border-zinc-800 transition-colors"
              title="Send Direct Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* SECTION 1: CIR-ENGINE (CORE AI/ML ARCHITECTURE) */}
        <section id="cir-engine" className="space-y-6">
          <div className="flex items-end justify-between border-b border-zinc-800 pb-4">
            <div>
              <span className="text-xs font-mono text-[#adff2f] uppercase tracking-wider">
                01. Causal Intelligence Kernel
              </span>
              <div className="mt-1">
                <ScrollAssemblyHeading
                  text="CIR-Engine & Cir-Jev Architecture"
                  stage={assemblyStage}
                  globalProgress={scrollProgress}
                  className="text-3xl sm:text-4xl font-black text-white tracking-tight"
                />
              </div>
            </div>
            <a
              href="https://github.com/juliocrfilho/cir-engine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1"
            >
              <span>GitHub Repo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <CirEngineArchitecture lang={lang} />
        </section>

        {/* SECTION 2: INTERACTIVE TOKENIZER & ATTENTION SANDBOX */}
        <section id="tokenizer-lab" className="space-y-6">
          <div className="flex items-end justify-between border-b border-zinc-800 pb-4">
            <div>
              <span className="text-xs font-mono text-[#38bdf8] uppercase tracking-wider">
                02. Byte-Level BPE & Attention Mechanics
              </span>
              <div className="mt-1">
                <ScrollAssemblyHeading
                  text="Live Tokenizer & Causal Attention Matrix"
                  stage={assemblyStage}
                  globalProgress={scrollProgress}
                  className="text-3xl sm:text-4xl font-black text-white tracking-tight"
                />
              </div>
            </div>
            <span className="text-xs font-mono text-zinc-500 hidden sm:inline">
              UTF-8 · Subword Vocabulary · Causal Softmax
            </span>
          </div>

          <TokenizerPlayground lang={lang} />
        </section>

        {/* SECTION 3: REPOSITORIES MATRIX */}
        <section id="repositories" className="space-y-6">
          <div className="flex items-end justify-between border-b border-zinc-800 pb-4">
            <div>
              <span className="text-xs font-mono text-[#c4b5fd] uppercase tracking-wider">
                03. Open-Source Ecosystem & Tooling
              </span>
              <div className="mt-1">
                <ScrollAssemblyHeading
                  text="Latent Repositories & Developer Tools"
                  stage={assemblyStage}
                  globalProgress={scrollProgress}
                  className="text-3xl sm:text-4xl font-black text-white tracking-tight"
                />
              </div>
            </div>
            <a
              href="https://github.com/juliocrfilho"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1"
            >
              <span>github.com/juliocrfilho</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <ProjectShowcase lang={lang} />

          {/* Interactive Tool Workbenches */}
          <div className="pt-8">
            <InteractiveToolDemos lang={lang} />
          </div>
        </section>

        {/* SECTION 4: CAREER TIMELINE & COMPETENCIES */}
        <section id="experience" className="space-y-6">
          <div className="flex items-end justify-between border-b border-zinc-800 pb-4">
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                04. Engineering Trajectory
              </span>
              <div className="mt-1">
                <ScrollAssemblyHeading
                  text="System Logs & Career Experience"
                  stage={assemblyStage}
                  globalProgress={scrollProgress}
                  className="text-3xl sm:text-4xl font-black text-white tracking-tight"
                />
              </div>
            </div>
            <span className="text-xs font-mono text-zinc-500">
              8+ Years Experience · 2019 – Present
            </span>
          </div>

          <ExperienceTimeline lang={lang} />
        </section>

        {/* SECTION 5: CONTACT / CTA */}
        <section className="p-8 sm:p-12 bg-zinc-950/80 border border-zinc-800 rounded-3xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-6">
            <span className="text-xs font-mono text-[#adff2f] uppercase tracking-wider">
              [INITIATE_CONTACT_SEQUENCE]
            </span>
            <div className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              <ScrollAssemblyHeading
                text="Ready to architect scalable LLM inference and distributed systems."
                stage={assemblyStage}
                globalProgress={scrollProgress}
                className="font-black text-white tracking-tight"
              />
            </div>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              {lang === 'pt'
                ? 'Disponível para posições de liderança técnica, arquitetura de sistemas distribuídos e engenharia de LLMs/Transformers. Aberto para oportunidades remotas ou relocalização internacional.'
                : 'Available for Technical Leadership, Distributed Systems Architecture, and LLM/Transformer Engineering. Open to remote roles and international relocation.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setIsTerminalOpen(true)}
                className="px-6 py-3 bg-[#adff2f] text-black font-mono text-xs font-bold rounded-xl hover:bg-lime-300 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-lime-400/10"
              >
                <Terminal className="w-4 h-4" />
                <span>Launch Interactive Terminal</span>
              </button>

              <a
                href="mailto:reisfilho1116@gmail.com"
                className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-xs rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-[#38bdf8]" />
                <span>reisfilho1116@gmail.com</span>
              </a>

              <a
                href="https://linkedin.com/in/juliocrfilho"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white font-mono text-xs rounded-xl border border-zinc-800 hover:border-[#0a66c2]/50 transition-all flex items-center gap-2 group"
              >
                <Linkedin className="w-4 h-4 text-[#0a66c2] group-hover:text-[#38bdf8] transition-colors" />
                <span>LinkedIn /in/juliocrfilho</span>
              </a>

              <a
                href="https://github.com/juliocrfilho"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-mono text-xs rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                <span>GitHub @juliocrfilho</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900/80 py-8 px-6 lg:px-12 text-zinc-500 font-mono text-xs relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>© 2026 Julio Cesar da Costa Reis Filho</span>
            <span aria-hidden="true">·</span>
            <span>The Latent Architect</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://linkedin.com/in/juliocrfilho" target="_blank" rel="noopener noreferrer" className="hover:text-[#38bdf8] transition-colors flex items-center gap-1">
              <Linkedin className="w-3.5 h-3.5 text-[#0a66c2]" />
              <span>LinkedIn</span>
            </a>
            <a href="https://github.com/juliocrfilho" target="_blank" rel="noopener noreferrer" className="hover:text-[#adff2f] transition-colors">
              GitHub
            </a>
            <a href="mailto:reisfilho1116@gmail.com" className="hover:text-[#adff2f] transition-colors">
              Email
            </a>
            <button onClick={() => setIsTerminalOpen(true)} className="hover:text-white transition-colors cursor-pointer">
              Terminal
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Terminal Modal */}
      <TerminalModal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        lang={lang}
      />
    </div>
  );
}
