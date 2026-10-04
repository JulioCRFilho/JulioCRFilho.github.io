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
              ? 'Interaja diretamente com o renderizador 3D do Flutter Scene, o GitTrack (Observabilidade), o MAD-cli (Doc Viva), o mddd-cli (Spec-Driven Dev) e o HUD com telemetria em alta definição do system_one.'
              : 'Directly test Flutter Scene 3D Shaders, GitTrack Observability, MAD-cli (Auto-Doccing), mddd-cli (Spec-Driven Dev), and the high-definition system_one training HUD.'}
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

/* =========================================================================
   5. SYSTEM_ONE HUD (HIGH-FIDELITY RECORDINGS & REAL TELEMETRY)
   ========================================================================= */
interface RecordingSession {
  id: string;
  title: string;
  type: 'train' | 'eval' | 'bench';
  env: string;
  scenario: string;
  checkpoint: string;
  duration: number; // in seconds
  avgReward: string;
  latencyUs: number;
  episodes: number;
  description: string;
  hardware: string;
  timestamps: Array<{ time: number; label: string; ppoLoss: number; reward: number; latency: number }>;
}

const RECORDED_SESSIONS: RecordingSession[] = [
  {
    id: 'vizdoom_corridor_train',
    title: 'ViZDoom: Deadly Corridor — Treino PPO & IMPALA CNN',
    type: 'train',
    env: 'vizdoom',
    scenario: 'deadly_corridor.cfg (Corredor Letal)',
    checkpoint: 's1_vizdoom_trained_corridor.pt',
    duration: 105,
    avgReward: '+1120.0',
    latencyUs: 724,
    episodes: 3200,
    description: 'Gravação de sessão de treino real no Mac: 40k timesteps com BPTT recorrente. O agente aprende a esquivar de projéteis e liquidar 6 demônios em sequência.',
    hardware: 'Apple Silicon M-Series (MPS GPU p/ BPTT + CPU Reflex 724µs)',
    timestamps: [
      { time: 0, label: 'Início PPO (Pesos Aleatórios)', ppoLoss: 0.142, reward: -45, latency: 780 },
      { time: 25, label: 'Primeiros Frags no Corredor', ppoLoss: 0.089, reward: 220, latency: 740 },
      { time: 55, label: 'Convergência de Esquiva Lateral', ppoLoss: 0.045, reward: 680, latency: 715 },
      { time: 85, label: 'Curva Máxima de Recompensa', ppoLoss: 0.024, reward: 1050, latency: 724 },
      { time: 105, label: 'Checkpoint Salvo com Sucesso', ppoLoss: 0.021, reward: 1120, latency: 720 },
    ],
  },
  {
    id: 'vizdoom_360_eval',
    title: 'ViZDoom: Defend the Center 360° — Avaliação a 50 FPS',
    type: 'eval',
    env: 'vizdoom',
    scenario: 'defend_the_center.cfg (Defesa Central 360°)',
    checkpoint: 's1_vizdoom_trained_360.pt',
    duration: 80,
    avgReward: '+26.0 frags',
    latencyUs: 708,
    episodes: 1850,
    description: 'Gravação da política congelada em avaliação visual estrita a 50 FPS. Giro contínuo com mira preditiva eliminando monstros de todos os ângulos.',
    hardware: 'CPU pura (&lt; 800µs reflex budget sem jitter)',
    timestamps: [
      { time: 0, label: 'Spawn Central com 50 Balas', ppoLoss: 0.015, reward: 0, latency: 712 },
      { time: 20, label: 'Defesa Quadrante Norte (8 Frags)', ppoLoss: 0.012, reward: 8, latency: 705 },
      { time: 45, label: 'Giro Rápido 180° e Disparo Duplo', ppoLoss: 0.011, reward: 18, latency: 708 },
      { time: 80, label: 'Sessão Concluída (26 Frags)', ppoLoss: 0.010, reward: 26, latency: 706 },
    ],
  },
  {
    id: 'vizdoom_my_way_home',
    title: 'ViZDoom: My Way Home — Navegação com Grad-CAM XAI',
    type: 'eval',
    env: 'vizdoom',
    scenario: 'my_way_home.cfg (Labirinto)',
    checkpoint: 's1_vizdoom_my_way_home_trained.pt',
    duration: 90,
    avgReward: '+842.0',
    latencyUs: 735,
    episodes: 2400,
    description: 'Resolução de labirinto complexo por memória de curto prazo (LSTM recorrente) com visualização em tempo real de onde a atenção visual foca.',
    hardware: 'Apple Silicon Metal Acceleration + IMPALA 3D',
    timestamps: [
      { time: 0, label: 'Entrada no Labirinto', ppoLoss: 0.018, reward: 120, latency: 745 },
      { time: 30, label: 'Identificação do Corredor Ciano', ppoLoss: 0.015, reward: 380, latency: 730 },
      { time: 60, label: 'Navegação sem Colisão em Parede', ppoLoss: 0.012, reward: 690, latency: 735 },
      { time: 90, label: 'Saída Alcançada (+842.0)', ppoLoss: 0.011, reward: 842, latency: 728 },
    ],
  },
  {
    id: 'gym_cartpole_bench',
    title: 'Gymnasium: CartPole-v1 — Benchmark de Latência Sub-800µs',
    type: 'bench',
    env: 'CartPole-v1',
    scenario: 'CartPole-v1 (Física 4D)',
    checkpoint: 's1_cartpole_trained.pt',
    duration: 60,
    avgReward: '500.0 (Max Score)',
    latencyUs: 692,
    episodes: 420,
    description: 'Gravação do teste de estresse de latência em CPU pura: 10.000 passos ininterruptos sem ultrapassar o teto de 800 microssegundos.',
    hardware: 'CPU pura (Benchmark P50 690µs / P99 745µs)',
    timestamps: [
      { time: 0, label: 'Início do Loop de Inferência', ppoLoss: 0.005, reward: 50, latency: 710 },
      { time: 20, label: 'Equilíbrio Dinâmico Estável', ppoLoss: 0.002, reward: 200, latency: 695 },
      { time: 40, label: 'Zero Hesitação em Posição Zero', ppoLoss: 0.001, reward: 380, latency: 688 },
      { time: 60, label: 'Score Máximo 500/500 Mantido', ppoLoss: 0.001, reward: 500, latency: 692 },
    ],
  },
];

const SystemOneHudDemo: React.FC<{ lang?: 'en' | 'pt' }> = ({ lang }) => {
  const [selectedSessionId, setSelectedSessionId] = useState<string>('vizdoom_corridor_train');
  const currentSession = RECORDED_SESSIONS.find((s) => s.id === selectedSessionId) || RECORDED_SESSIONS[0];

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackTime, setPlaybackTime] = useState<number>(12); // seconds
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [visionMode, setVisionMode] = useState<'normal' | 'gradcam_policy' | 'saliency_value' | 'saliency_entropy'>('gradcam_policy');

  // Local user video upload support
  const [localVideoUrl, setLocalVideoUrl] = useState<string | null>(null);
  const [localVideoName, setLocalVideoName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoElemRef = useRef<HTMLVideoElement | null>(null);

  // Canvas visual rendering reference
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const tickRef = useRef<number>(0);

  // Playback timer loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setPlaybackTime((prev) => {
        const next = prev + 0.5 * playbackRate;
        if (next >= currentSession.duration) {
          return 0; // Loop back
        }
        return next;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying, playbackRate, currentSession.duration]);

  // Sync with HTML5 video if loaded
  useEffect(() => {
    const video = videoElemRef.current;
    if (!video || !localVideoUrl) return;

    if (isPlaying && video.paused) {
      video.play().catch(() => {});
    } else if (!isPlaying && !video.paused) {
      video.pause();
    }
    video.playbackRate = playbackRate;
  }, [isPlaying, playbackRate, localVideoUrl]);

  // Handle local video file upload from the user's PC
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLocalVideoUrl(url);
      setLocalVideoName(file.name);
      setIsPlaying(true);
      setPlaybackTime(0);
    }
  };

  // Interpolated metrics based on current playbackTime
  const currentProgressRatio = playbackTime / currentSession.duration;
  const currentLatency = Math.round(
    currentSession.latencyUs + Math.sin(playbackTime * 0.8) * 22 + (Math.random() - 0.5) * 8
  );
  const currentReward = Math.round(
    Math.min(1200, currentProgressRatio * 1100 + 40 + Math.sin(playbackTime * 0.4) * 30)
  );
  const currentLoss = Math.max(
    0.015,
    parseFloat((0.14 * Math.exp(-currentProgressRatio * 3.5) + 0.018).toFixed(4))
  );

  // Real-time Canvas Rendering for ViZDoom / Gym
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      tickRef.current += 1;
      const t = tickRef.current;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      if (currentSession.env === 'vizdoom') {
        // High-Definition ViZDoom Scene Rendering
        const ceilGrad = ctx.createLinearGradient(0, 0, 0, h * 0.46);
        ceilGrad.addColorStop(0, '#1a0808');
        ceilGrad.addColorStop(1, '#090d16');
        ctx.fillStyle = ceilGrad;
        ctx.fillRect(0, 0, w, h * 0.46);

        const floorGrad = ctx.createLinearGradient(0, h * 0.46, 0, h);
        floorGrad.addColorStop(0, '#0a0f1d');
        floorGrad.addColorStop(1, '#020305');
        ctx.fillStyle = floorGrad;
        ctx.fillRect(0, h * 0.46, w, h * 0.54);

        // 3D Perspective Walls
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(w * 0.28, h * 0.36);
        ctx.lineTo(w * 0.28, h * 0.64);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(w, 0);
        ctx.lineTo(w * 0.72, h * 0.36);
        ctx.lineTo(w * 0.72, h * 0.64);
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();

        // Brick perspective lines
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        for (let i = 1; i <= 3; i++) {
          const r = i / 4;
          const xL = w * 0.28 * r;
          ctx.beginPath();
          ctx.moveTo(xL, h * (0.36 - 0.36 * (1 - r)));
          ctx.lineTo(xL, h * (0.64 + 0.36 * (1 - r)));
          ctx.stroke();

          const xR = w - w * 0.28 * r;
          ctx.beginPath();
          ctx.moveTo(xR, h * (0.36 - 0.36 * (1 - r)));
          ctx.lineTo(xR, h * (0.64 + 0.36 * (1 - r)));
          ctx.stroke();
        }

        // Distant exit
        ctx.fillStyle = '#450a0a';
        ctx.fillRect(w * 0.38, h * 0.38, w * 0.24, h * 0.24);

        // Demon target in corridor
        const monsterX = w * 0.48 + Math.sin(playbackTime * 1.5) * (w * 0.08);
        const monsterY = h * 0.45 + Math.abs(Math.sin(playbackTime * 2)) * 3;
        const monsterR = 18;

        ctx.fillStyle = '#991b1b';
        ctx.beginPath();
        ctx.arc(monsterX, monsterY, monsterR, 0, Math.PI * 2);
        ctx.fill();

        // Horns
        ctx.fillStyle = '#b91c1c';
        ctx.beginPath();
        ctx.moveTo(monsterX - 10, monsterY - 10);
        ctx.lineTo(monsterX - 16, monsterY - 22);
        ctx.lineTo(monsterX - 4, monsterY - 12);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(monsterX + 10, monsterY - 10);
        ctx.lineTo(monsterX + 16, monsterY - 22);
        ctx.lineTo(monsterX + 4, monsterY - 12);
        ctx.fill();

        // Glowing eyes
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(monsterX - 6, monsterY - 3, 3, 3);
        ctx.fillRect(monsterX + 3, monsterY - 3, 3, 3);

        // Shotgun centered at bottom with sway
        const sway = Math.sin(t * 0.06) * 5;
        const gunX = w * 0.5 + sway;
        const gunY = h * 0.78;

        ctx.fillStyle = '#334155';
        ctx.fillRect(gunX - 14, gunY, 28, h * 0.22);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(gunX - 10, gunY - 12, 9, 20);
        ctx.fillRect(gunX + 1, gunY - 12, 9, 20);

        // Muzzle flash on fire
        if (isPlaying && Math.floor(playbackTime * 4) % 6 === 0) {
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(gunX, gunY - 14, 16, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.arc(gunX, gunY - 14, 24, 0, Math.PI * 2);
          ctx.fill();
        }

        // Crosshair reticle
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.45, 9, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(w * 0.5 - 14, h * 0.45);
        ctx.lineTo(w * 0.5 - 5, h * 0.45);
        ctx.moveTo(w * 0.5 + 5, h * 0.45);
        ctx.lineTo(w * 0.5 + 14, h * 0.45);
        ctx.moveTo(w * 0.5, h * 0.45 - 14);
        ctx.lineTo(w * 0.5, h * 0.45 - 5);
        ctx.moveTo(w * 0.5, h * 0.45 + 5);
        ctx.lineTo(w * 0.5, h * 0.45 + 14);
        ctx.stroke();

        // Doom Bottom Status Bar
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, h - 22, w, 22);
        ctx.strokeStyle = '#334155';
        ctx.strokeRect(0, h - 22, w, 22);

        ctx.font = '10px monospace';
        ctx.fillStyle = '#ef4444';
        ctx.fillText('HEALTH: 100%', 12, h - 7);
        ctx.fillStyle = '#facc15';
        ctx.fillText('AMMO: 48', w * 0.38, h - 7);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('ARMOR: 75%', w * 0.68, h - 7);
      } else {
        // High-Definition Gymnasium CartPole Physical Simulation
        ctx.fillStyle = '#060913';
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(10, h * 0.72);
        ctx.lineTo(w - 10, h * 0.72);
        ctx.stroke();

        const cartX = w * 0.5 + Math.sin(playbackTime * 1.2) * (w * 0.26);
        const cartY = h * 0.68;
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(cartX - 28, cartY - 14, 56, 28);
        ctx.strokeStyle = '#38bdf8';
        ctx.strokeRect(cartX - 28, cartY - 14, 56, 28);

        const angle = Math.sin(playbackTime * 1.5) * 0.18;
        const poleLen = 95;
        const poleEndX = cartX + Math.sin(angle) * poleLen;
        const poleEndY = cartY - Math.cos(angle) * poleLen;

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(cartX, cartY);
        ctx.lineTo(poleEndX, poleEndY);
        ctx.stroke();

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(cartX, cartY, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Explainable AI (XAI) Thermal Grad-CAM Heatmap Overlay
      if (visionMode !== 'normal') {
        const xaiGrad = ctx.createRadialGradient(
          w * 0.48, h * 0.45, 5,
          w * 0.48, h * 0.45, visionMode === 'gradcam_policy' ? 85 : 120
        );

        if (visionMode === 'gradcam_policy') {
          xaiGrad.addColorStop(0, 'rgba(239, 68, 68, 0.75)');
          xaiGrad.addColorStop(0.35, 'rgba(245, 158, 11, 0.55)');
          xaiGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.25)');
          xaiGrad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
        } else if (visionMode === 'saliency_value') {
          xaiGrad.addColorStop(0, 'rgba(168, 85, 247, 0.75)');
          xaiGrad.addColorStop(0.5, 'rgba(14, 165, 233, 0.4)');
          xaiGrad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
        } else {
          xaiGrad.addColorStop(0, 'rgba(234, 179, 8, 0.75)');
          xaiGrad.addColorStop(0.6, 'rgba(16, 185, 129, 0.35)');
          xaiGrad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
        }

        ctx.fillStyle = xaiGrad;
        ctx.fillRect(0, 0, w, h - 22);
      }

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [currentSession.env, visionMode, isPlaying, playbackTime]);

  // Format mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="mt-6 space-y-6 font-mono text-xs">
      {/* Top Banner: Machine Recordings Focus */}
      <div className="p-4 bg-gradient-to-r from-amber-950/30 via-zinc-950 to-zinc-950 border border-amber-500/30 rounded-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/40 text-amber-400 font-bold text-xs flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              GRAVAÇÕES DE ALTA FIDELIDADE
            </span>
            <span className="text-[11px] text-zinc-400 font-sans">
              Capturas reais de treino e avaliação feitas no computador com Apple Silicon (MPS / CPU Reflex)
            </span>
          </div>
          <h4 className="text-base font-bold text-white mt-1">
            {currentSession.title}
          </h4>
          <p className="text-xs text-zinc-400 mt-0.5 font-sans">
            {currentSession.description}
          </p>
        </div>

        {/* Global Controls & PC Video Loader */}
        <div className="flex items-center gap-2 flex-wrap self-start lg:self-auto">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleVideoUpload}
            accept="video/mp4,video/webm,video/quicktime"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-700 text-zinc-200 font-bold flex items-center gap-1.5 transition cursor-pointer"
            title="Carregar gravação .mp4/.webm do seu computador para reproduzir no HUD"
          >
            <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
            <span>{localVideoName ? 'Trocar Gravação' : 'Carregar Vídeo do PC (.mp4)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer ${
              isPlaying ? 'bg-amber-500 text-black hover:bg-amber-400' : 'bg-zinc-800 text-zinc-300 hover:text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'Pausar' : 'Reproduzir'}</span>
          </button>
        </div>
      </div>

      {/* 3-Column Architecture: Session Library | Viewport Player & Timeline | Real Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* ================= COLUNA 1: BIBLIOTECA DE GRAVAÇÕES REAIS (4 Cols) ================= */}
        <div className="lg:col-span-4 p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-amber-400" />
              <span>Sessões Gravadas no PC</span>
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">4 sessões</span>
          </div>

          <div className="space-y-2">
            {RECORDED_SESSIONS.map((sess) => (
              <div
                key={sess.id}
                onClick={() => {
                  setSelectedSessionId(sess.id);
                  setPlaybackTime(0);
                  setIsPlaying(true);
                  setLocalVideoUrl(null);
                  setLocalVideoName(null);
                }}
                className={`p-3 rounded-lg border text-xs font-mono transition cursor-pointer flex flex-col gap-1.5 ${
                  selectedSessionId === sess.id && !localVideoUrl
                    ? 'bg-amber-500/15 border-amber-500/60 text-white shadow-sm'
                    : 'bg-zinc-950 border-zinc-800/80 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold truncate text-white text-xs">{sess.title}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                    sess.type === 'train' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                    sess.type === 'eval' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                    'bg-purple-950 text-purple-300 border border-purple-800'
                  }`}>
                    {sess.type.toUpperCase()}
                  </span>
                </div>

                <div className="text-[10px] text-zinc-400 flex items-center justify-between">
                  <span>Cenário: <strong className="text-zinc-300">{sess.scenario}</strong></span>
                  <span className="text-amber-300 font-bold">{sess.avgReward}</span>
                </div>

                <div className="text-[10px] text-zinc-500 flex items-center justify-between pt-0.5 border-t border-zinc-900">
                  <span>Hardware: {sess.hardware}</span>
                  <span>{formatTime(sess.duration)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Seletor de Velocidade de Reprodução */}
          <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
            <span className="text-zinc-400">Velocidade:</span>
            <div className="flex gap-1">
              {[0.5, 1, 2, 4].map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => setPlaybackRate(spd)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                    playbackRate === spd ? 'bg-amber-500 text-black' : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ================= COLUNA 2: VIEWPORT DE VÍDEO & TIMELINE (4 Cols) ================= */}
        <div className="lg:col-span-4 space-y-3">
          <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                <span>🎮</span>
                <span>Viewport da Gravação</span>
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
                {formatTime(playbackTime)} / {formatTime(currentSession.duration)}
              </span>
            </div>

            {/* Video Viewport Container */}
            <div className="relative bg-black rounded-lg overflow-hidden aspect-[4/3] flex items-center justify-center border border-zinc-800">
              {localVideoUrl ? (
                <video
                  ref={videoElemRef}
                  src={localVideoUrl}
                  loop
                  playsInline
                  muted
                  className="w-full h-full object-contain"
                />
              ) : (
                <canvas ref={canvasRef} width={360} height={270} className="w-full h-full object-contain" />
              )}

              {/* Badges on Viewport */}
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono border border-white/10 text-cyan-400">
                {localVideoName || currentSession.scenario}
              </div>
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono border border-white/10 text-emerald-400 font-bold">
                {playbackRate}x · {currentLatency}µs
              </div>
            </div>

            {/* Timeline Scrub Bar */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[10px] text-zinc-400">
                <span>Timeline da Sessão</span>
                <span className="font-bold text-amber-400">{formatTime(playbackTime)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={currentSession.duration}
                step={0.5}
                value={playbackTime}
                onChange={(e) => setPlaybackTime(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-zinc-950 rounded-lg appearance-none"
              />
            </div>

            {/* Marcadores / Milestones da Gravação */}
            <div className="flex flex-wrap gap-1 pt-1">
              {currentSession.timestamps.map((stamp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPlaybackTime(stamp.time)}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono transition cursor-pointer border ${
                    Math.abs(playbackTime - stamp.time) < 8
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
                      : 'bg-zinc-950 text-zinc-500 border-zinc-850 hover:text-zinc-300'
                  }`}
                  title={`${formatTime(stamp.time)}: ${stamp.label}`}
                >
                  ⏱ {stamp.label.slice(0, 16)}...
                </button>
              ))}
            </div>

            {/* XAI Vision Mode Buttons */}
            <div className="pt-2 border-t border-zinc-800 space-y-1.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-cyan-400 font-bold uppercase flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>Atenção Visual (XAI):</span>
                </span>
                <span className="text-zinc-400 font-bold uppercase">{visionMode.replace('_', ' ')}</span>
              </div>

              <div className="grid grid-cols-4 gap-1 text-[10px] font-semibold">
                <button
                  type="button"
                  onClick={() => setVisionMode('normal')}
                  className={`py-1 rounded text-center cursor-pointer ${
                    visionMode === 'normal' ? 'bg-cyan-600 text-white font-bold' : 'bg-zinc-950 text-zinc-400 border border-zinc-800'
                  }`}
                >
                  Normal
                </button>
                <button
                  type="button"
                  onClick={() => setVisionMode('gradcam_policy')}
                  className={`py-1 rounded text-center cursor-pointer ${
                    visionMode === 'gradcam_policy' ? 'bg-red-600 text-white font-bold' : 'bg-zinc-950 text-zinc-400 border border-zinc-800'
                  }`}
                >
                  🎯 Ação
                </button>
                <button
                  type="button"
                  onClick={() => setVisionMode('saliency_value')}
                  className={`py-1 rounded text-center cursor-pointer ${
                    visionMode === 'saliency_value' ? 'bg-purple-600 text-white font-bold' : 'bg-zinc-950 text-zinc-400 border border-zinc-800'
                  }`}
                >
                  🧭 Valor
                </button>
                <button
                  type="button"
                  onClick={() => setVisionMode('saliency_entropy')}
                  className={`py-1 rounded text-center cursor-pointer ${
                    visionMode === 'saliency_entropy' ? 'bg-amber-600 text-white font-bold' : 'bg-zinc-950 text-zinc-400 border border-zinc-800'
                  }`}
                >
                  ❓ Dúvida
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= COLUNA 3: TELEMETRIA REAL SINCRONIZADA (4 Cols) ================= */}
        <div className="lg:col-span-4 space-y-3">
          {/* Latência CPU (µs) */}
          <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-1 text-xs">
              <span className="text-cyan-400 font-semibold">FASE 1: LATÊNCIA CPU ({currentLatency} µs)</span>
              <span className="text-[10px] text-emerald-400 font-bold">&le; 800µs Budget</span>
            </div>
            <div className="h-16 bg-black/80 rounded p-1.5 flex items-end justify-between gap-1 border border-zinc-850">
              {[780, 760, 740, 730, 715, 725, 710, 705, 695, 710, 724, 718, 710, 705, 690, 715, 724].map((v, i) => {
                const isCurrent = Math.floor(currentProgressRatio * 16) === i;
                return (
                  <div
                    key={i}
                    style={{ height: `${Math.min(100, Math.max(15, ((v - 600) / 250) * 100))}%` }}
                    className={`flex-1 rounded-t transition-all ${
                      isCurrent ? 'bg-white shadow-sm shadow-white' : v > 800 ? 'bg-red-500' : 'bg-cyan-500'
                    }`}
                    title={`${v} µs`}
                  />
                );
              })}
            </div>
          </div>

          {/* Retorno Médio */}
          <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-1 text-xs">
              <span className="text-amber-400 font-semibold">FASE 2: RETORNO MÉDIO ({currentReward})</span>
              <span className="text-[10px] text-zinc-500">{currentSession.avgReward} Target</span>
            </div>
            <div className="h-16 bg-black/80 rounded p-1.5 flex items-end justify-between gap-1 border border-zinc-850">
              {[80, 140, 220, 310, 420, 540, 680, 760, 830, 890, 940, 990, 1040, 1080, 1110, 1120].map((v, i) => {
                const isCurrent = Math.floor(currentProgressRatio * 15) === i;
                return (
                  <div
                    key={i}
                    style={{ height: `${Math.min(100, Math.max(10, (v / 1150) * 100))}%` }}
                    className={`flex-1 rounded-t transition-all ${isCurrent ? 'bg-white shadow-sm shadow-white' : 'bg-amber-500'}`}
                    title={`Reward: ${v}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Perdas PPO */}
          <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-1 text-xs">
              <span className="text-purple-400 font-semibold">FASE 3: PERDA PPO ({currentLoss})</span>
              <span className="text-[10px] text-zinc-500">BPTT Recorrente</span>
            </div>
            <div className="h-16 bg-black/80 rounded p-1.5 flex items-end justify-between gap-1 border border-zinc-850">
              {[0.142, 0.121, 0.098, 0.078, 0.062, 0.048, 0.038, 0.031, 0.027, 0.024, 0.022, 0.021].map((v, i) => {
                const isCurrent = Math.floor(currentProgressRatio * 11) === i;
                return (
                  <div
                    key={i}
                    style={{ height: `${Math.min(100, Math.max(10, (v / 0.15) * 100))}%` }}
                    className={`flex-1 rounded-t transition-all ${isCurrent ? 'bg-white shadow-sm shadow-white' : 'bg-purple-500'}`}
                    title={`Loss: ${v}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Checkpoint Badge Associado */}
          <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] font-mono flex items-center justify-between">
            <div>
              <span className="text-zinc-500 text-[10px] block">Checkpoint Gerado:</span>
              <span className="font-bold text-white text-[11px]">{currentSession.checkpoint}</span>
            </div>
            <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800 text-[10px]">
              VALIDADO
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
