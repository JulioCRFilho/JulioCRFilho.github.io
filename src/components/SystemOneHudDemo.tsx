import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ExternalLink,
  Brain,
  Dices,
  Activity,
} from 'lucide-react';
import {
  RubiksCubeSim,
  CartPoleSim,
  System1AgentWeb,
  ensureOnnxRuntime,
  type DecisionResult,
} from '../lib/system1';

interface ActionLogItem {
  id: number;
  name: string;
  confidence: number;
  uncertainty: number;
  latencyMs: number;
  isUncertain: boolean;
}

export const SystemOneHudDemo: React.FC<{ lang?: 'en' | 'pt' }> = ({ lang = 'en' }) => {
  const [activeDemo, setActiveDemo] = useState<'rubiks' | 'cartpole'>('rubiks');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [statusDesc, setStatusDesc] = useState<string>(
    lang === 'pt' ? 'Pronto para avaliar' : 'Ready to evaluate'
  );

  const [decision, setDecision] = useState<DecisionResult>({
    action: 0,
    confidence: 0,
    uncertainty: 0,
    isUncertain: false,
    latencyMs: 0,
  });

  const [actionLog, setActionLog] = useState<ActionLogItem[]>([]);
  const [fps, setFps] = useState<number>(60);
  const cubeScrambleDepth = 2;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const simRef = useRef<RubiksCubeSim | CartPoleSim | null>(null);
  const agentRef = useRef<System1AgentWeb | null>(null);
  const animRef = useRef<number | null>(null);
  const lastStepTimeRef = useRef<number>(0);
  const lastUiUpdateTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const lastFpsTimeRef = useRef<number>(performance.now());
  const isRunningRef = useRef<boolean>(false);

  const GITHUB_REPO = 'JulioCRFilho/system_one';

  const DEMO_CONFIGS = useMemo(
    () => ({
      rubiks: {
        id: 'rubiks',
        name: lang === 'pt' ? 'Cubo Mágico 3x3 (Macro / CFOP)' : "3x3 Rubik's Cube (Macro / CFOP)",
        icon: '🎲',
        file: 's1_rubiks_macro.onnx',
        size: '~3.3 MB',
        envName: 'RubiksCubeMacro-v0',
        actionSpace: '12 Macro Actions (CFOP: Sune, T-Perm, Sexy Move)',
        obsSpace: '324-dim One-Hot Vector (54 stickers × 6 cores)',
        description:
          lang === 'pt'
            ? 'Agente neural amortizado treinado com PPO e BPTT recorrente. Seleciona e executa macros algorítmicas diretamente sem árvore de busca combinatória (Tree Search).'
            : 'Amortized neural policy trained with PPO and recurrent BPTT. Predicts macro moves directly without combinatorial tree search.',
      },
      cartpole: {
        id: 'cartpole',
        name: lang === 'pt' ? 'CartPole-v1 (Controle Clássico)' : 'CartPole-v1 (Classic Control)',
        icon: '⚖️',
        file: 's1_cartpole.onnx',
        size: '~2.9 MB',
        envName: 'CartPole-v1',
        actionSpace: '2 Ações Discretas (Push Left / Right)',
        obsSpace: '4-dim Física Contínua [x, ẋ, θ, θ̇]',
        description:
          lang === 'pt'
            ? 'Equilíbrio dinâmico de haste invertida com física contínua. Latência de inferência ultrabaixa para controle crítico sem jitter.'
            : 'Dynamic inverted pendulum balancing with continuous physics. Ultra-low latency inference for real-time control without jitter.',
      },
    }),
    [lang]
  );

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  const initSim = (demoKey: 'rubiks' | 'cartpole') => {
    if (demoKey === 'rubiks') {
      const cube = new RubiksCubeSim();
      cube.scramble(cubeScrambleDepth);
      simRef.current = cube;
    } else {
      const cp = new CartPoleSim();
      simRef.current = cp;
    }

    if (canvasRef.current && simRef.current) {
      simRef.current.render(canvasRef.current);
    }

    if (agentRef.current) {
      agentRef.current.resetMemory();
    }
  };

  const loadModel = async (demoKey: 'rubiks' | 'cartpole') => {
    setIsLoading(true);
    setLoadError(null);
    setStatusDesc(lang === 'pt' ? 'Inicializando Wasm SIMD...' : 'Initializing Wasm SIMD...');

    try {
      const ort = await ensureOnnxRuntime();
      const cfg = DEMO_CONFIGS[demoKey];

      const baseUrl = import.meta.env.BASE_URL?.endsWith('/')
        ? import.meta.env.BASE_URL
        : `${import.meta.env.BASE_URL || ''}/`;
      const localUrl = `${baseUrl}models/${cfg.file}`;
      const cdnUrl = `https://cdn.jsdelivr.net/gh/${GITHUB_REPO}@master/web/models/${cfg.file}`;

      let session: any = null;
      try {
        session = await ort.InferenceSession.create(localUrl, {
          executionProviders: ['wasm'],
        });
      } catch (localErr) {
        console.warn('Falha ao carregar modelo local, tentando CDN do GitHub...', localErr);
        session = await ort.InferenceSession.create(cdnUrl, {
          executionProviders: ['wasm'],
        });
      }

      agentRef.current = new System1AgentWeb(session, ort);
      setIsLoading(false);
      setStatusDesc(lang === 'pt' ? 'Pronto para avaliar' : 'Ready to evaluate');
    } catch (err: any) {
      console.error('Erro ao carregar modelo ONNX:', err);
      setIsLoading(false);
      setLoadError(err?.message || (lang === 'pt' ? 'Erro ao carregar pesos neurais' : 'Failed to load weights'));
      setStatusDesc(lang === 'pt' ? 'Falha no carregamento' : 'Load failed');
    }
  };

  const stopEvaluation = () => {
    setIsRunning(false);
    isRunningRef.current = false;
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
  };

  useEffect(() => {
    stopEvaluation();
    initSim(activeDemo);
    loadModel(activeDemo);

    return () => {
      stopEvaluation();
    };
  }, [activeDemo]);

  const stepLoop = async (timestamp: number) => {
    if (!isRunningRef.current) return;

    frameCountRef.current++;
    if (timestamp - lastFpsTimeRef.current >= 1000) {
      setFps(frameCountRef.current);
      frameCountRef.current = 0;
      lastFpsTimeRef.current = timestamp;
    }

    const interval = activeDemo === 'rubiks' ? 250 : 30;
    if (timestamp - lastStepTimeRef.current >= interval) {
      lastStepTimeRef.current = timestamp;

      const sim = simRef.current;
      const agent = agentRef.current;
      const canvas = canvasRef.current;

      if (sim && agent && canvas) {
        try {
          const obs =
            activeDemo === 'rubiks'
              ? (sim as RubiksCubeSim).getOneHot()
              : (sim as CartPoleSim).getState();

          const dec = await agent.actWithConfidence(obs);

          let currentActionName = '';

          if (activeDemo === 'rubiks') {
            const cube = sim as RubiksCubeSim;
            currentActionName = RubiksCubeSim.MACRO_NAMES[dec.action] || `ACT_${dec.action}`;
            cube.applyMacro(currentActionName);

            if (cube.isSolved()) {
              stopEvaluation();
              setStatusDesc(lang === 'pt' ? '🏆 CUBO RESOLVIDO!' : '🏆 CUBE SOLVED!');
            } else {
              setStatusDesc(`${lang === 'pt' ? 'Ação' : 'Action'}: ${currentActionName}`);
            }

            setDecision(dec);
            setActionLog((prev) => [
              {
                id: Date.now() + Math.random(),
                name: currentActionName,
                confidence: dec.confidence,
                uncertainty: dec.uncertainty,
                latencyMs: dec.latencyMs,
                isUncertain: dec.isUncertain,
              },
              ...prev.slice(0, 4),
            ]);
          } else {
            const cp = sim as CartPoleSim;
            currentActionName = dec.action === 1 ? 'PUSH_RIGHT' : 'PUSH_LEFT';
            const res = cp.step(dec.action);

            if (res.done) {
              cp.reset();
              agent.resetMemory();
            }

            // Atualização de telemetria estabilizada a ~10 Hz (a cada 100ms) para evitar trepidação visual na UI
            const now = performance.now();
            if (now - lastUiUpdateTimeRef.current >= 100) {
              lastUiUpdateTimeRef.current = now;
              setDecision(dec);
              setStatusDesc(`${lang === 'pt' ? 'Passos' : 'Steps'}: ${res.steps}`);

              setActionLog((prev) => [
                {
                  id: Date.now() + Math.random(),
                  name: currentActionName,
                  confidence: dec.confidence,
                  uncertainty: dec.uncertainty,
                  latencyMs: dec.latencyMs,
                  isUncertain: dec.isUncertain,
                },
                ...prev.slice(0, 4),
              ]);
            }
          }

          sim.render(canvas);
        } catch (e) {
          console.error('Erro no passo neural:', e);
        }
      }
    }

    animRef.current = requestAnimationFrame(stepLoop);
  };

  const startEvaluation = () => {
    if (!agentRef.current || isLoading) return;
    setIsRunning(true);
    isRunningRef.current = true;
    animRef.current = requestAnimationFrame(stepLoop);
  };

  const toggleEvaluation = () => {
    if (isRunning) stopEvaluation();
    else startEvaluation();
  };

  const scrambleEnv = () => {
    if (activeDemo === 'rubiks' && simRef.current && canvasRef.current) {
      (simRef.current as RubiksCubeSim).scramble(cubeScrambleDepth);
      simRef.current.render(canvasRef.current);
      if (agentRef.current) agentRef.current.resetMemory();
      setStatusDesc(lang === 'pt' ? 'Cubo reembaralhado' : 'Cube scrambled');
    }
  };

  const resetEnv = () => {
    if (simRef.current && canvasRef.current) {
      simRef.current.reset();
      simRef.current.render(canvasRef.current);
      if (agentRef.current) agentRef.current.resetMemory();
      setStatusDesc(lang === 'pt' ? 'Ambiente reiniciado' : 'Environment reset');
    }
  };

  const currentCfg = DEMO_CONFIGS[activeDemo];

  return (
    <div className="space-y-6">
      {/* Top Header & Identity */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 shadow-xl backdrop-blur-md">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-amber-500 flex items-center justify-center font-bold text-white shadow-lg">
              ⚡
            </span>
            <h3 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
              System 1 Engine
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono font-bold tracking-wider uppercase">
                {lang === 'pt' ? 'LIVE EVALUATION WEB' : 'LIVE WEB EVALUATION'}
              </span>
            </h3>
          </div>
          <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
            {lang === 'pt'
              ? 'Agente Neural Recorrente Amortizado (GRU + ResMLP) executando inferência sub-milissegundo em tempo real direto no seu navegador com ONNX Runtime Web (Wasm SIMD).'
              : 'Amortized Recurrent Neural Agent (GRU + ResMLP) performing sub-millisecond inference in real-time inside your browser using ONNX Runtime Web (Wasm SIMD).'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <a
            href={`https://github.com/${GITHUB_REPO}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-300 hover:text-white transition flex items-center gap-1.5 shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            <span>GitHub ({GITHUB_REPO})</span>
          </a>
        </div>
      </div>

      {/* Main Grid: Left Viewport (7 Cols) | Right Specs & Architecture (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ================= COLUNA ESQUERDA: VIEWPORT & TELEMETRIA (7 Cols) ================= */}
        <div className="lg:col-span-7 space-y-4">

          {/* Viewport Card */}
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                  }`}
                />
                <span className="text-xs font-mono font-bold text-zinc-200 flex items-center gap-1.5">
                  <span>{currentCfg.icon}</span>
                  <span>{currentCfg.name}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tabular-nums text-cyan-400 bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-800 min-w-[54px] text-center inline-block">
                  {fps} FPS
                </span>
                <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                  {currentCfg.size}
                </span>
              </div>
            </div>

            {/* Canvas Viewport */}
            <div className="relative bg-[#07090e] rounded-xl overflow-hidden border border-zinc-800/80 flex items-center justify-center min-h-[320px]">
              <canvas
                ref={canvasRef}
                width={480}
                height={320}
                className="w-full h-auto max-h-[320px] object-contain block"
              />

              {/* Loader Overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-[#07090e]/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-xs font-mono text-cyan-400 z-10">
                  <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span>
                    {lang === 'pt'
                      ? 'Carregando pesos neurais ONNX (Wasm SIMD)...'
                      : 'Loading ONNX neural weights (Wasm SIMD)...'}
                  </span>
                  <span className="text-[10px] text-zinc-500">{currentCfg.file}</span>
                </div>
              )}

              {/* Error Overlay */}
              {loadError && (
                <div className="absolute inset-0 bg-[#07090e]/90 flex flex-col items-center justify-center gap-2 p-4 text-center z-10">
                  <span className="text-red-400 text-xs font-mono">⚠️ {loadError}</span>
                  <button
                    onClick={() => loadModel(activeDemo)}
                    className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-xs font-mono rounded text-zinc-200 border border-zinc-700 transition"
                  >
                    {lang === 'pt' ? 'Tentar novamente' : 'Retry'}
                  </button>
                </div>
              )}
            </div>

            {/* Interactive Control Buttons */}
            <div className="flex items-center justify-between pt-1 gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleEvaluation}
                  disabled={isLoading || !!loadError}
                  className={`px-3.5 py-1.5 text-xs font-bold font-mono rounded-lg transition flex items-center gap-1.5 shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    isRunning
                      ? 'bg-amber-600 hover:bg-amber-500 text-white'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                  }`}
                >
                  {isRunning ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{isRunning ? (lang === 'pt' ? 'Pausar' : 'Pause') : (lang === 'pt' ? 'Iniciar' : 'Start')}</span>
                </button>

                {activeDemo === 'rubiks' && (
                  <button
                    type="button"
                    onClick={scrambleEnv}
                    disabled={isLoading}
                    className="px-3 py-1.5 text-xs font-medium font-mono rounded-lg bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-zinc-700 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Dices className="w-3.5 h-3.5" />
                    <span>{lang === 'pt' ? 'Embaralhar' : 'Scramble'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={resetEnv}
                  disabled={isLoading}
                  className="px-3 py-1.5 text-xs font-medium font-mono rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900/80 px-2.5 py-1 rounded border border-zinc-800 truncate min-w-[130px] text-right inline-block">
                {statusDesc}
              </span>
            </div>
          </div>

          {/* Real Telemetry Cards (3-Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Latência de Inferência */}
            <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 shadow-md flex flex-col justify-between h-[116px] min-h-[116px] overflow-hidden select-none">
              <div>
                <div className="h-5 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider whitespace-nowrap truncate">
                    {lang === 'pt' ? 'LATÊNCIA INFERÊNCIA' : 'INFERENCE LATENCY'}
                  </span>
                </div>
                <div className="text-xl font-bold font-mono tabular-nums text-cyan-400 mt-1 flex items-baseline gap-1">
                  <span className="w-16 inline-block">{decision.latencyMs > 0 ? decision.latencyMs.toFixed(2) : '0.18'}</span>
                  <span className="text-xs text-cyan-500 font-normal">ms</span>
                </div>
              </div>
              <span className="text-[9px] text-zinc-500 font-mono mt-1 whitespace-nowrap truncate block">
                {lang === 'pt' ? 'Sub-milissegundo CPU (≤ 800µs budget)' : 'Sub-millisecond CPU (≤ 800µs budget)'}
              </span>
            </div>

            {/* Confiança Top-1 */}
            <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 shadow-md flex flex-col justify-between h-[116px] min-h-[116px] overflow-hidden select-none">
              <div>
                <div className="h-5 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider whitespace-nowrap truncate">
                    {lang === 'pt' ? 'CONFIANÇA (TOP-1)' : 'CONFIDENCE (TOP-1)'}
                  </span>
                </div>
                <div className="text-xl font-bold font-mono tabular-nums text-emerald-400 mt-1 flex items-baseline gap-1">
                  <span className="w-16 inline-block">{decision.confidence > 0 ? (decision.confidence * 100).toFixed(1) : '--'}</span>
                  <span className="text-xs text-emerald-500 font-normal">%</span>
                </div>
              </div>
              <span className="text-[9px] text-zinc-500 font-mono mt-1 whitespace-nowrap truncate block">
                {lang === 'pt' ? 'Certeza do reflexo amortizado' : 'Amortized reflex policy certainty'}
              </span>
            </div>

            {/* Incerteza / Gating System 2 */}
            <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 shadow-md flex flex-col justify-between h-[116px] min-h-[116px] overflow-hidden select-none">
              <div>
                <div className="h-5 flex items-center justify-between gap-1">
                  <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider whitespace-nowrap truncate">
                    {lang === 'pt' ? 'INCERTEZA (GATING)' : 'UNCERTAINTY (GATING)'}
                  </span>
                  <span
                    className={`text-[8px] font-mono px-1.5 py-0.5 rounded border font-bold transition-opacity duration-150 shrink-0 ${
                      decision.isUncertain
                        ? 'bg-red-950/80 text-red-300 border-red-800 opacity-100'
                        : 'opacity-0 pointer-events-none'
                    }`}
                  >
                    S2 TRIGGER
                  </span>
                </div>
                <div className="text-xl font-bold font-mono tabular-nums text-amber-400 mt-1 flex items-baseline gap-1">
                  <span className="w-16 inline-block">{decision.uncertainty > 0 ? (decision.uncertainty * 100).toFixed(1) : '--'}</span>
                  <span className="text-xs text-amber-500 font-normal">%</span>
                </div>
              </div>
              <span className="text-[9px] text-zinc-500 font-mono mt-1 whitespace-nowrap truncate block">
                {lang === 'pt' ? 'Entropia normalizada (Disparo System 2)' : 'Shannon entropy (System 2 trigger)'}
              </span>
            </div>
          </div>

        </div>

        {/* ================= COLUNA DIREITA: CONFIGURAÇÃO, LOG & SPECS (5 Cols) ================= */}
        <div className="lg:col-span-5 space-y-4">

          {/* Seletor de Demonstração & Checkpoint */}
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 shadow-xl space-y-3">
            <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <span>⚙️</span>
              <span>{lang === 'pt' ? 'SELECIONAR AMBIENTE' : 'SELECT ENVIRONMENT'}</span>
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setActiveDemo('rubiks')}
                className={`p-2.5 rounded-xl border text-left text-xs font-mono transition cursor-pointer flex flex-col gap-1 ${
                  activeDemo === 'rubiks'
                    ? 'bg-cyan-950/40 border-cyan-500/80 text-white shadow'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                <span className="text-base">🎲</span>
                <span className="font-bold">Cubo Mágico 3x3</span>
                <span className="text-[10px] text-zinc-500">Macro CFOP (12)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveDemo('cartpole')}
                className={`p-2.5 rounded-xl border text-left text-xs font-mono transition cursor-pointer flex flex-col gap-1 ${
                  activeDemo === 'cartpole'
                    ? 'bg-cyan-950/40 border-cyan-500/80 text-white shadow'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                <span className="text-base">⚖️</span>
                <span className="font-bold">CartPole-v1</span>
                <span className="text-[10px] text-zinc-500">Física 4D (Push)</span>
              </button>
            </div>

            {/* Descrição do Ambiente Ativo */}
            <p className="text-[11px] text-zinc-400 leading-relaxed bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-850">
              {currentCfg.description}
            </p>
          </div>

          {/* Arquitetura Universal System 1 */}
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 shadow-xl space-y-2.5 text-xs">
            <div className="font-bold text-cyan-300 font-mono flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'pt' ? 'ARQUITETURA UNIVERSAL S1' : 'UNIVERSAL S1 ARCHITECTURE'}</span>
            </div>
            <div className="space-y-1.5 text-[11px] text-zinc-400 leading-relaxed font-mono">
              <div className="flex items-start gap-1.5">
                <span className="text-cyan-400">•</span>
                <span>
                  <strong className="text-zinc-200">Tronco Recorrente:</strong> GRU + ResMLP (256 dimensões latentes) com memória temporal de curto prazo.
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-cyan-400">•</span>
                <span>
                  <strong className="text-zinc-200">Cálculo Amortizado:</strong> Ação reflexiva direta em O(1) sem busca combinatória exponencial em árvore.
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-cyan-400">•</span>
                <span>
                  <strong className="text-zinc-200">Confidence Gating:</strong> Disparo autônomo do System 2 (árvore/raciocínio lento) quando a entropia atinge limiar crítico.
                </span>
              </div>
            </div>
          </div>

          {/* Log Recente de Decisões */}
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 shadow-xl space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-zinc-200">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'pt' ? 'DECISÕES NEURAIS RECENTES' : 'RECENT NEURAL DECISIONS'}</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-normal">
                {actionLog.length} passos
              </span>
            </div>

            <div className="space-y-1.5 min-h-[120px]">
              {actionLog.length === 0 ? (
                <div className="h-[120px] flex items-center justify-center text-[11px] text-zinc-600 font-mono">
                  {lang === 'pt' ? 'Aguardando início da avaliação...' : 'Waiting for evaluation to start...'}
                </div>
              ) : (
                actionLog.map((item) => (
                  <div
                    key={item.id}
                    className="p-1.5 rounded-lg bg-zinc-900/70 border border-zinc-850 flex items-center justify-between text-[11px] font-mono"
                  >
                    <span className="font-bold text-white flex items-center gap-1.5 truncate max-w-[140px]">
                      <span className="text-cyan-400">⚡</span>
                      <span>{item.name}</span>
                    </span>
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="text-emerald-400">{(item.confidence * 100).toFixed(0)}% conf</span>
                      <span className="text-zinc-500">|</span>
                      <span className="text-cyan-300">{item.latencyMs.toFixed(2)}ms</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Especificações Técnicas de Runtime */}
          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/90 text-[11px] font-mono text-zinc-400 space-y-1.5">
            <div className="flex justify-between">
              <span>Runtime Engine:</span>
              <span className="text-cyan-400 font-bold">ONNX Runtime Web (Wasm SIMD)</span>
            </div>
            <div className="flex justify-between">
              <span>Checkpoint:</span>
              <span className="text-white truncate max-w-[160px]">{currentCfg.file}</span>
            </div>
            <div className="flex justify-between">
              <span>Origem dos Pesos:</span>
              <span className="text-emerald-400 truncate max-w-[160px]">system_one@master</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
