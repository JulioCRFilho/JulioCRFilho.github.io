import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Layers,
  Box,
  GitBranch,
  Play,
  Pause,
  Check,
  FileText,
  Terminal,
  Lock,
  Globe,
  GitCommit,
  Table,
  Activity,
  RefreshCw,
  Zap,
  Crosshair,
  Cpu,
  Gauge,
  Sliders,
  Eye,
  X,
  Search,
  CheckCircle2,
  Flame,
  Award,
  HardDrive,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { SystemOneHudDemo } from './SystemOneHudDemo';

interface InteractiveToolDemosProps {
  lang?: 'en' | 'pt';
}

export const InteractiveToolDemos: React.FC<InteractiveToolDemosProps> = ({ lang = 'en' }) => {
  const [activeTab, setActiveTab] = useState<'flutter_scene' | 'gittrack' | 'mad' | 'mddd' | 'system_one'>('flutter_scene');

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-6 lg:p-8 backdrop-blur-xl shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="text-[#adff2f] font-mono text-sm">[LIVE_LAB]</span>
            {lang === 'pt' ? 'Bancada Interativa de Ferramentas Open Source' : 'Interactive Open-Source Tool Workbenches'}
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            {lang === 'pt'
              ? 'Interaja diretamente com o renderizador 3D do Flutter Scene, o GitTrack (Observabilidade), o MAD-cli (Doc Viva), o mddd-cli (Spec-Driven Dev) e a avaliação neural em tempo real do system_one (ONNX Runtime Web / Wasm SIMD).'
              : 'Directly test Flutter Scene 3D Shaders, GitTrack Observability, MAD-cli (Auto-Doccing), mddd-cli (Spec-Driven Dev), and real-time neural evaluation of system_one (ONNX Runtime Web / Wasm SIMD).'}
          </p>
        </div>

        {/* Tab Switcher - Ordered: Flutter_scene, GitTrack, MAD-cli, mddd-cli, system_one */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab('flutter_scene')}
            className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors cursor-pointer ${
              activeTab === 'flutter_scene' ? 'bg-zinc-800 text-[#38bdf8] font-bold shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Flutter Scene (3D)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('gittrack')}
            className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors cursor-pointer ${
              activeTab === 'gittrack' ? 'bg-zinc-800 text-[#c4b5fd] font-bold shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {lang === 'pt' ? 'GitTrack (Telemetria)' : 'GitTrack (Telemetry)'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mad')}
            className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors cursor-pointer ${
              activeTab === 'mad' ? 'bg-zinc-800 text-[#34d399] font-bold shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {lang === 'pt' ? 'MAD-cli (Doc Viva)' : 'MAD-cli (Auto-Doccing)'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mddd')}
            className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors cursor-pointer ${
              activeTab === 'mddd' ? 'bg-zinc-800 text-[#adff2f] font-bold shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {lang === 'pt' ? 'mddd-cli (Spec-Driven Dev)' : 'mddd-cli (Spec-Driven Dev)'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('system_one')}
            className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'system_one' ? 'bg-zinc-800 text-amber-400 font-bold shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>system_one (HUD)</span>
          </button>
        </div>
      </div>

      {/* Tab 1: flutter_scene 3D Canvas */}
      {activeTab === 'flutter_scene' && <FlutterSceneDemo lang={lang} />}

      {/* Tab 2: GitTrack Telemetry */}
      {activeTab === 'gittrack' && <GitTrackDemo lang={lang} />}

      {/* Tab 3: MAD-cli Mermaid Auto-Doccing with MAD Tags */}
      {activeTab === 'mad' && <MadCliDemo lang={lang} />}

      {/* Tab 4: mddd-cli Spec-Driven Development (Diagram + Decision Matrix) */}
      {activeTab === 'mddd' && <MdddCliDemo lang={lang} />}

      {/* Tab 5: system_one High-Definition HUD & Real Telemetry */}
      {activeTab === 'system_one' && <SystemOneHudDemo lang={lang} />}
    </div>
  );
};

/* =========================================================================
   1. FLUTTER_SCENE 3D SHADER DEMO
   ========================================================================= */
const FlutterSceneDemo: React.FC<{ lang?: 'en' | 'pt' }> = ({ lang }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [wireframe, setWireframe] = useState<boolean>(true);
  const [bloom, setBloom] = useState<boolean>(true);
  const [rotSpeed, setRotSpeed] = useState<number>(1.2);
  const [colorMode, setColorMode] = useState<'cyan' | 'matrix' | 'sunset'>('cyan');
  const animFrameRef = useRef<number | null>(null);
  const angleRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      angleRef.current += 0.015 * rotSpeed;
      const a = angleRef.current;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.fillStyle = '#060913';
      ctx.fillRect(0, 0, w, h);

      // Grid background
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < w; x += 24) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 24) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 3D Cube Vertices
      const size = 68;
      const vertices = [
        [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
        [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
      ];

      // Rotation matrix
      const cosY = Math.cos(a);
      const sinY = Math.sin(a);
      const cosX = Math.cos(a * 0.7);
      const sinX = Math.sin(a * 0.7);

      const projected = vertices.map(([vx, vy, vz]) => {
        // Rot Y
        const x1 = vx * cosY + vz * sinY;
        const z1 = -vx * sinY + vz * cosY;
        // Rot X
        const y2 = vy * cosX - z1 * sinX;
        const z2 = vy * sinX + z1 * cosX;
        // Project
        const fov = 200;
        const scale = fov / (fov + z2 * size * 0.7 + 140);
        return {
          x: cx + x1 * size * scale,
          y: cy + y2 * size * scale,
          z: z2,
        };
      });

      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7],
      ];

      // Bloom glow
      if (bloom) {
        const glowColor =
          colorMode === 'cyan' ? '#38bdf8' : colorMode === 'matrix' ? '#adff2f' : '#f43f5e';
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 18;
      } else {
        ctx.shadowBlur = 0;
      }

      // Draw wireframe
      ctx.lineWidth = 2;
      ctx.strokeStyle =
        colorMode === 'cyan' ? '#38bdf8' : colorMode === 'matrix' ? '#adff2f' : '#fb7185';

      edges.forEach(([i, j]) => {
        const p1 = projected[i];
        const p2 = projected[j];
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      // Reset shadow
      ctx.shadowBlur = 0;

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [wireframe, bloom, rotSpeed, colorMode]);

  return (
    <div className="mt-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: 3D Canvas Viewport */}
        <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col items-center">
          <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-zinc-800 text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1.5 text-[#38bdf8] font-bold">
              <Box className="w-4 h-4" />
              <span>Flutter Scene Mesh Viewport</span>
            </span>
            <span className="text-emerald-400 font-bold">60 FPS · Metal/Vulkan</span>
          </div>

          <div className="relative w-full aspect-video max-h-72 rounded-lg overflow-hidden bg-[#060913] border border-zinc-800 flex items-center justify-center">
            <canvas ref={canvasRef} width={480} height={280} className="w-full h-full object-contain" />
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] font-mono text-zinc-400">
              FragmentShader: spatial_viewport.frag
            </div>
          </div>

          {/* Interactive controls */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 text-xs font-mono">
            <button
              type="button"
              onClick={() => setWireframe(!wireframe)}
              className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                wireframe ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' : 'bg-zinc-950 border-zinc-800 text-zinc-400'
              }`}
            >
              Wireframe: {wireframe ? 'ON' : 'OFF'}
            </button>
            <button
              type="button"
              onClick={() => setBloom(!bloom)}
              className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                bloom ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' : 'bg-zinc-950 border-zinc-800 text-zinc-400'
              }`}
            >
              Bloom: {bloom ? 'ON' : 'OFF'}
            </button>
            <button
              type="button"
              onClick={() => setRotSpeed((s) => (s >= 2.5 ? 0.5 : s + 0.7))}
              className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-center transition-all cursor-pointer"
            >
              Speed: {rotSpeed.toFixed(1)}x
            </button>
            <button
              type="button"
              onClick={() => setColorMode((c) => (c === 'cyan' ? 'matrix' : c === 'matrix' ? 'sunset' : 'cyan'))}
              className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-center transition-all cursor-pointer"
            >
              Palette: {colorMode.toUpperCase()}
            </button>
          </div>
        </div>

        {/* Right: Technical Explanation */}
        <div className="lg:col-span-5 space-y-4 font-mono text-xs">
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-[#38bdf8]">▹</span>
              <span>{lang === 'pt' ? 'Motor 3D Nativo para Flutter' : 'Native 3D Engine for Flutter'}</span>
            </h4>
            <p className="text-zinc-300 font-sans leading-relaxed text-xs">
              {lang === 'pt'
                ? 'Fork de alta performance trazendo renderização 3D nativa sobre Impeller (Metal no iOS/macOS e Vulkan no Android/Linux). Elimina sobrecargas de ponte entre o código Dart e shaders GLSL/MSL compilados em tempo real.'
                : 'High-performance fork bringing native 3D mesh rendering atop Impeller (Metal on iOS/macOS and Vulkan on Android/Linux), avoiding bridge overheads between Dart code and compiled GLSL/MSL shaders.'}
            </p>
            <div className="p-2.5 rounded bg-black/80 border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
              <div className="text-cyan-400 font-bold">// Dart + Impeller Pipeline:</div>
              <div>Scene scene = Scene();</div>
              <div>Node meshNode = Node.mesh(cubeMesh);</div>
              <div>scene.root.add(meshNode);</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   2. GITTRACK TELEMETRY DEMO
   ========================================================================= */
const GitTrackDemo: React.FC<{ lang?: 'en' | 'pt' }> = ({ lang }) => {
  const [filterPrivacy, setFilterPrivacy] = useState<'all' | 'public' | 'private'>('all');

  const commits = [
    { hash: 'e89a12c', message: 'feat(ast): Implement invariant token validation in System 1', isPrivate: false, date: '2h ago' },
    { hash: '•••••••', message: '🔒 NDA Client Enterprise Microservice refactor', isPrivate: true, date: '1d ago' },
    { hash: '4f2910b', message: 'perf(impeller): Optimize memory buffer allocation for Metal 3D shaders', isPrivate: false, date: '2d ago' },
    { hash: '•••••••', message: '🔒 NDA Proprietary Financial Event-Driven Core', isPrivate: true, date: '3d ago' },
    { hash: '9b772c1', message: 'docs(mddd): Add decision matrix compilation to Mermaid CLI spec', isPrivate: false, date: '4d ago' },
  ];

  const filtered = commits.filter((c) => {
    if (filterPrivacy === 'public') return !c.isPrivate;
    if (filterPrivacy === 'private') return c.isPrivate;
    return true;
  });

  return (
    <div className="mt-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Commit Stream */}
        <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <span className="text-xs font-mono font-bold text-white flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-[#c4b5fd]" />
              <span>{lang === 'pt' ? 'Fluxo de Commits & Máscara de NDA' : 'Commit Stream & NDA Masking'}</span>
            </span>
            <div className="flex gap-1 text-[11px] font-mono">
              {(['all', 'public', 'private'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setFilterPrivacy(mode)}
                  className={`px-2 py-0.5 rounded cursor-pointer transition ${
                    filterPrivacy === mode
                      ? 'bg-[#c4b5fd] text-black font-bold'
                      : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  {mode.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {filtered.map((c, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg border text-xs font-mono flex items-center justify-between gap-3 ${
                  c.isPrivate ? 'bg-amber-950/20 border-amber-500/30 text-amber-200' : 'bg-zinc-950 border-zinc-800 text-zinc-300'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {c.isPrivate ? <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" /> : <GitBranch className="w-3.5 h-3.5 text-[#c4b5fd] shrink-0" />}
                  <span className="text-zinc-500 font-bold shrink-0">{c.hash}</span>
                  <span className="truncate">{c.message}</span>
                </div>
                <span className="text-[10px] text-zinc-500 shrink-0">{c.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Metrics Deck */}
        <div className="lg:col-span-5 space-y-3 font-mono text-xs">
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-[#c4b5fd]">▹</span>
              <span>{lang === 'pt' ? 'Observabilidade Git sem Vazamento' : 'Leak-Free Git Observability'}</span>
            </h4>
            <p className="text-zinc-300 font-sans text-xs leading-relaxed">
              {lang === 'pt'
                ? 'Permite comprovar consistência e velocidade técnica em repositórios privados corporativos mantendo sigilo contratual estrito através de mascaramento criptográfico de metadados e diffs.'
                : 'Proves engineering velocity in private corporate repositories while preserving strict contractual secrecy via cryptographic masking of metadata and diffs.'}
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="p-2 rounded bg-zinc-950 border border-zinc-850">
                <div className="text-[10px] text-zinc-500">Commits / Semana</div>
                <div className="text-base font-bold text-white">42.8</div>
              </div>
              <div className="p-2 rounded bg-zinc-950 border border-zinc-850">
                <div className="text-[10px] text-zinc-500">PR Lead Time</div>
                <div className="text-base font-bold text-emerald-400">&lt; 4.2h</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   3. MAD-CLI (AUTO-DOCCING) DEMO
   ========================================================================= */
const MadCliDemo: React.FC<{ lang?: 'en' | 'pt' }> = ({ lang }) => {
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [docState, setDocState] = useState<'synced' | 'pending'>('synced');

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setDocState('synced');
    }, 700);
  };

  return (
    <div className="mt-6 space-y-6 font-mono text-xs">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Living Documentation Markdown View */}
        <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <span className="font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#34d399]" />
              <span>README.md (com Tags MAD Vivas)</span>
            </span>
            <button
              type="button"
              onClick={handleSync}
              disabled={isSyncing}
              className="px-2.5 py-1 rounded bg-[#34d399]/20 hover:bg-[#34d399]/30 text-[#34d399] border border-[#34d399]/40 font-bold transition cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Sincronizando...' : 'mad-cli sync'}</span>
            </button>
          </div>

          <div className="p-3 rounded-lg bg-black/80 border border-zinc-800 text-[11px] text-zinc-300 space-y-1.5 font-mono">
            <span className="text-zinc-500">&lt;!-- MAD:ARCHITECTURE:START --&gt;</span>
            <div className="pl-3 border-l border-[#34d399]/40 text-emerald-300">
              ```mermaid<br />
              graph LR<br />
              &nbsp;&nbsp;AST_Parser --&gt; FastPath_Kernel<br />
              &nbsp;&nbsp;FastPath_Kernel --&gt;|Sub-800µs| System_1<br />
              &nbsp;&nbsp;FastPath_Kernel --&gt;|Causal| CIR_503M<br />
              ```
            </div>
            <span className="text-zinc-500">&lt;!-- MAD:ARCHITECTURE:END --&gt;</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
            <span>Status: <strong className="text-emerald-400">100% Sincronizado com o Código</strong></span>
            <span>CLI: v1.4.2</span>
          </div>
        </div>

        {/* Right: Technical Explanation */}
        <div className="lg:col-span-5 space-y-3">
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-[#34d399]">▹</span>
              <span>{lang === 'pt' ? 'Documentação Viva com Markdown Tags' : 'Living Documentation with Markdown Tags'}</span>
            </h4>
            <p className="text-zinc-300 font-sans text-xs leading-relaxed">
              {lang === 'pt'
                ? 'O MAD-cli garante que a arquitetura no README nunca fique defasada em relação ao código real. Ele analisa o AST dos arquivos TypeScript/Dart e regera os diagramas Mermaid nos blocos demarcados a cada commit.'
                : 'MAD-cli ensures README architectures never drift from reality. It parses TypeScript/Dart ASTs and regenerates Mermaid diagrams inside bounded comment blocks on every commit.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   4. MDDD-CLI (SPEC-DRIVEN DEV) DEMO
   ========================================================================= */
const MdddCliDemo: React.FC<{ lang?: 'en' | 'pt' }> = ({ lang }) => {
  const [specTab, setSpecTab] = useState<'diagram' | 'matrix'>('diagram');

  return (
    <div className="mt-6 space-y-6 font-mono text-xs">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <span className="font-bold text-white flex items-center gap-2">
              <Table className="w-4 h-4 text-[#adff2f]" />
              <span>mddd-cli Spec Engine</span>
            </span>
            <div className="flex gap-1 text-[11px]">
              <button
                type="button"
                onClick={() => setSpecTab('diagram')}
                className={`px-2.5 py-1 rounded cursor-pointer transition ${
                  specTab === 'diagram' ? 'bg-[#adff2f] text-black font-bold' : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                Diagrama Mermaid
              </button>
              <button
                type="button"
                onClick={() => setSpecTab('matrix')}
                className={`px-2.5 py-1 rounded cursor-pointer transition ${
                  specTab === 'matrix' ? 'bg-[#adff2f] text-black font-bold' : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                Matriz de Decisão
              </button>
            </div>
          </div>

          {specTab === 'diagram' ? (
            <div className="p-3 rounded-lg bg-black/80 border border-zinc-800 text-[11px] text-[#adff2f] space-y-1">
              <div>classDiagram</div>
              <div>&nbsp;&nbsp;direction TB</div>
              <div>&nbsp;&nbsp;class UserEntity &#123;</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;+UUID id</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;+String email</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;+validatePolicy() bool</div>
              <div>&nbsp;&nbsp;&#125;</div>
              <div>&nbsp;&nbsp;class OrderService --&gt; UserEntity : requires</div>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-black/80 border border-zinc-800 text-[11px] text-zinc-300 space-y-1">
              <div className="text-zinc-500 font-bold">| Decisão Arquitetural | Alternativa Avaliada | Veredito | Justificativa Técnica |</div>
              <div className="text-white">| PagedAttention | Sparse Attention | Aprovado | Reduz VRAM em 4.2x sem perda de contexto |</div>
              <div className="text-white">| BPTT Recorrente | Feed-Forward Puro | Aprovado | Mantém memória temporal em jogos Gym |</div>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-3">
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-[#adff2f]">▹</span>
              <span>{lang === 'pt' ? 'Desenvolvimento Orientado a Especificação' : 'Spec-Driven Development'}</span>
            </h4>
            <p className="text-zinc-300 font-sans text-xs leading-relaxed">
              {lang === 'pt'
                ? 'O mddd-cli compila especificações arquiteturais e diagramas de classe diretamente em boilerplate estruturado, interfaces e testes unitários com conformidade garantida.'
                : 'mddd-cli compiles architectural specs and class diagrams directly into verified boilerplates, interfaces, and unit tests.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
