import React, { useState, useEffect, useRef } from 'react';
import { Layers, Box, GitBranch, Play, Check, FileText, ArrowRightLeft, Terminal } from 'lucide-react';

interface InteractiveToolDemosProps {
  lang?: 'en' | 'pt';
}

export const InteractiveToolDemos: React.FC<InteractiveToolDemosProps> = ({ lang = 'en' }) => {
  const [activeTab, setActiveTab] = useState<'mddd' | 'mad' | 'flutter_scene' | 'gittrack'>('mddd');

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 lg:p-8 backdrop-blur-xl shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="text-[#adff2f] font-mono text-sm">[LIVE_LAB]</span>
            {lang === 'pt' ? 'Demonstração Interativa das Ferramentas' : 'Interactive Open-Source Tool Workbenches'}
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            {lang === 'pt'
              ? 'Interaja diretamente com o gerador mddd-cli, o extrator MAD-cli (Mermaid Auto-Doccing), o renderizador 3D do Flutter Scene e o GitTrack.'
              : 'Directly test mddd-cli (Diagram-to-Code), MAD-cli (Mermaid Auto-Doccing with MAD tags), Flutter Scene 3D, and GitTrack.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab('mddd')}
            className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors cursor-pointer ${
              activeTab === 'mddd' ? 'bg-zinc-800 text-[#adff2f]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {lang === 'pt' ? 'mddd-cli (Diagrama-para-Código)' : 'mddd-cli (Diagram-to-Code)'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mad')}
            className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors cursor-pointer ${
              activeTab === 'mad' ? 'bg-zinc-800 text-[#34d399]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {lang === 'pt' ? 'MAD-cli (Doc Viva)' : 'MAD-cli (Auto-Doccing)'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('flutter_scene')}
            className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors cursor-pointer ${
              activeTab === 'flutter_scene' ? 'bg-zinc-800 text-[#38bdf8]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            flutter_scene (3D)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('gittrack')}
            className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors cursor-pointer ${
              activeTab === 'gittrack' ? 'bg-zinc-800 text-[#c4b5fd]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            GitTrack (Telemetria)
          </button>
        </div>
      </div>

      {/* Demo 1: mddd-cli Diagram-to-Code */}
      {activeTab === 'mddd' && <MdddCliDemo lang={lang} />}

      {/* Demo 2: MAD-cli Mermaid Auto-Doccing with MAD Tags */}
      {activeTab === 'mad' && <MadCliDemo lang={lang} />}

      {/* Demo 3: flutter_scene 3D Canvas */}
      {activeTab === 'flutter_scene' && <FlutterSceneDemo lang={lang} />}

      {/* Demo 4: GitTrack Telemetry */}
      {activeTab === 'gittrack' && <GitTrackDemo lang={lang} />}
    </div>
  );
};

/* --- MDDD-CLI DEMO --- */
const MdddCliDemo: React.FC<{ lang?: 'en' | 'pt' }> = ({ lang }) => {
  const [selectedPreset, setSelectedPreset] = useState<'clean_arch' | 'event_driven'>('clean_arch');
  const [isGenerating, setIsGenerating] = useState(false);

  const PRESETS = {
    clean_arch: {
      mermaid: `classDiagram
  direction TB
  class UserEntity {
    +UUID id
    +String email
    +validate()
  }
  class UserRepository {
    <<interface>>
    +findById(id)
    +save(user)
  }
  class CreateUserUseCase {
    -UserRepository repo
    +execute(dto)
  }
  CreateUserUseCase --> UserRepository
  UserRepository ..> UserEntity`,
      tree: [
        'src/domain/entities/user.entity.ts',
        'src/domain/repositories/user.repository.interface.ts',
        'src/application/use-cases/create-user.use-case.ts',
        'src/infrastructure/repositories/pg-user.repository.ts',
        'src/presentation/controllers/user.controller.ts',
      ],
      codeSample: `// Generated via mddd-cli from Mermaid diagram
export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>;
  save(user: UserEntity): Promise<void>;
}

export class CreateUserUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(dto: CreateUserDTO): Promise<UserEntity> {
    const user = new UserEntity(dto);
    await this.userRepo.save(user);
    return user;
  }
}`,
    },
    event_driven: {
      mermaid: `flowchart LR
  IngestService[Event Ingest] -->|Kafka Event| StreamWorker[Stream Worker]
  StreamWorker -->|gRPC| InferenceEngine[CIR-Engine 503M]
  InferenceEngine -->|Verified Log| Storage[(Postgres / S3)]`,
      tree: [
        'services/ingest/kafka_producer.go',
        'services/worker/stream_consumer.go',
        'pkg/grpc/inference_client.pb.go',
        'pkg/domain/contracts/events.go',
      ],
      codeSample: `// Generated via mddd-cli: Microservices gRPC event contract
syntax = "proto3";
package inference.v1;

service CIRInferenceService {
  rpc DispatchReasoningPass (QueryRequest) returns (VerifiedResult);
}`,
    },
  };

  const [compilationLogs, setCompilationLogs] = useState<string[]>([]);
  const [lastCompiledAt, setLastCompiledAt] = useState<string | null>(null);

  const handleRegenerate = () => {
    setIsGenerating(true);
    setCompilationLogs([
      lang === 'pt'
        ? '$ mddd compile --input architecture.mmd --target clean-arch'
        : '$ mddd compile --input architecture.mmd --target clean-arch',
      lang === 'pt'
        ? '[0.04s] 🔍 Lexer & Parser: Analisando AST do diagrama Mermaid...'
        : '[0.04s] 🔍 Lexer & Parser: Parsing Mermaid diagram AST...',
    ]);

    setTimeout(() => {
      setCompilationLogs((prev) => [
        ...prev,
        lang === 'pt'
          ? '[0.14s] 📐 Validador de Arquitetura: Mapeando entidades, use cases e interfaces...'
          : '[0.14s] 📐 Architecture Engine: Mapping domain entities, use-cases, and ports...',
      ]);
    }, 180);

    setTimeout(() => {
      setCompilationLogs((prev) => [
        ...prev,
        lang === 'pt'
          ? '[0.26s] 📁 Scaffolding: Gerando arquivos de produção em ./src...'
          : '[0.26s] 📁 Scaffolding: Emitting production artifacts into ./src...',
        lang === 'pt'
          ? '✓ Concluído em 0.32s! Todos os artefatos foram sincronizados com sucesso.'
          : '✓ Completed in 0.32s! All artifacts compiled and synced successfully.',
      ]);
      setIsGenerating(false);
      setLastCompiledAt(new Date().toLocaleTimeString());
    }, 420);
  };

  const current = PRESETS[selectedPreset];

  return (
    <div className="mt-6 space-y-6">
      {/* Explanatory Banner: What is MDDD and what does this compilation do? */}
      <div className="p-3.5 bg-zinc-950/80 border border-zinc-800/80 rounded-xl text-xs font-mono space-y-1">
        <div className="text-[#adff2f] font-bold flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5" />
          <span>
            {lang === 'pt'
              ? 'O que faz a compilação mddd-cli?'
              : 'What does mddd-cli compilation do?'}
          </span>
        </div>
        <p className="text-zinc-300 leading-relaxed">
          {lang === 'pt'
            ? 'O mddd-cli (Mermaid Diagram-Driven Development) analisa a AST de diagramas Mermaid (.mmd) à esquerda e compila automaticamente toda a arquitetura de software de produção (entidades de Clean Architecture, casos de uso, interfaces de repositório e contratos gRPC/TypeScript) à direita.'
            : 'mddd-cli (Mermaid Diagram-Driven Development) parses Mermaid diagram ASTs (.mmd) on the left and automatically compiles full production Clean Architecture code (domain entities, use cases, repository interfaces, and gRPC/TypeScript contracts) on the right.'}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-zinc-400">
            {lang === 'pt' ? 'Preset de Esquema:' : 'Schema Preset:'}
          </span>
          <button
            type="button"
            onClick={() => {
              setSelectedPreset('clean_arch');
              handleRegenerate();
            }}
            className={`px-2.5 py-1 text-xs font-mono rounded cursor-pointer transition-colors ${
              selectedPreset === 'clean_arch' ? 'bg-[#adff2f]/20 text-[#adff2f] border border-[#adff2f]/40' : 'bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            Clean Architecture
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedPreset('event_driven');
              handleRegenerate();
            }}
            className={`px-2.5 py-1 text-xs font-mono rounded cursor-pointer transition-colors ${
              selectedPreset === 'event_driven' ? 'bg-[#adff2f]/20 text-[#adff2f] border border-[#adff2f]/40' : 'bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            {lang === 'pt' ? 'Microsserviços a Eventos' : 'Event-Driven Microservices'}
          </button>
        </div>

        <div className="flex items-center gap-2">
          {lastCompiledAt && !isGenerating && (
            <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">
              {lang === 'pt' ? `Compilado às ${lastCompiledAt}` : `Compiled at ${lastCompiledAt}`}
            </span>
          )}
          <button
            type="button"
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#adff2f]/10 hover:bg-[#adff2f]/20 border border-[#adff2f]/40 text-xs font-mono text-[#adff2f] rounded cursor-pointer transition-all self-start sm:self-auto disabled:opacity-50"
            title={lang === 'pt' ? 'Compilar diagrama Mermaid em código real' : 'Compile Mermaid diagram into real code'}
          >
            <Play className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>
              {isGenerating
                ? (lang === 'pt' ? 'Compilando AST...' : 'Compiling AST...')
                : (lang === 'pt' ? 'Executar compilação mddd' : 'Run mddd compilation')}
            </span>
          </button>
        </div>
      </div>

      {/* Live Terminal Compilation Logs */}
      {compilationLogs.length > 0 && (
        <div className="p-3 bg-black/90 border border-zinc-800 rounded-xl font-mono text-[11px] space-y-1 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-zinc-500 text-[10px] pb-1 border-b border-zinc-850">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <Terminal className="w-3 h-3 text-[#adff2f]" />
              <span>{lang === 'pt' ? 'Log de Compilação do CLI (AST Engine)' : 'CLI Compilation Log (AST Engine)'}</span>
            </span>
            <span className="text-[#adff2f]">mddd-cli v1.4.2</span>
          </div>
          <div className="space-y-0.5 pt-1">
            {compilationLogs.map((log, idx) => (
              <div
                key={idx}
                className={
                  log.startsWith('✓')
                    ? 'text-[#adff2f] font-bold'
                    : log.startsWith('$')
                    ? 'text-zinc-400'
                    : 'text-zinc-300'
                }
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Mermaid Source */}
        <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl font-mono text-xs">
          <div className="flex items-center justify-between text-zinc-400 pb-2 mb-2 border-b border-zinc-800">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#38bdf8]" />
              {lang === 'pt' ? 'Definição de Diagrama Mermaid (.mmd)' : 'Mermaid Diagram Definition (.mmd)'}
            </span>
            <span className="text-[10px] text-zinc-500">
              {lang === 'pt' ? 'Entrada Fonte' : 'Source Input'}
            </span>
          </div>
          <pre className="text-zinc-300 overflow-x-auto whitespace-pre leading-relaxed p-2 bg-zinc-950/80 rounded border border-zinc-850">
            {current.mermaid}
          </pre>
        </div>

        {/* Right: Generated Output Structure & Code */}
        <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl font-mono text-xs">
          <div className="flex items-center justify-between text-zinc-400 pb-2 mb-2 border-b border-zinc-800">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#adff2f]" />
              {lang === 'pt' ? 'Artefatos de Sistema Gerados' : 'Scaffolded System Artifacts'}
            </span>
            <span className="text-[10px] text-[#adff2f]">
              {lang === 'pt' ? 'Árvore de Clean Architecture' : 'Clean Architecture Tree'}
            </span>
          </div>

          <div className="space-y-1 mb-3 p-2 bg-zinc-950/80 rounded border border-zinc-850">
            {current.tree.map((file, idx) => (
              <div key={idx} className="flex items-center gap-2 text-zinc-300 text-[11px]">
                <span className="text-zinc-600">📁</span>
                <span className="text-[#38bdf8]">{file}</span>
              </div>
            ))}
          </div>

          <pre className="text-[11px] text-zinc-400 overflow-x-auto whitespace-pre p-2 bg-zinc-950/80 rounded border border-zinc-850 max-h-[120px]">
            {current.codeSample}
          </pre>
        </div>
      </div>
    </div>
  );
};

/* --- MAD-CLI (MERMAID AUTO-DOCCING) DEMO --- */
const MadCliDemo: React.FC<{ lang?: 'en' | 'pt' }> = ({ lang }) => {
  const [selectedExample, setSelectedExample] = useState<'system_one_router' | 'native_ipc'>('system_one_router');

  const EXAMPLES = {
    system_one_router: {
      title: lang === 'pt' ? 'Camada Cognitiva: Roteamento system_one -> CIR-Engine' : 'Cognitive Layer: system_one -> CIR-Engine Routing',
      filename: 'pkg/router/cognitive_dispatcher.go',
      sourceCodeWithMadTags: `package router

// <!-- MAD:SEQUENCE CognitiveDispatcher -->
// autogenerated by MAD-cli: extracts live execution flow
// participant Client as User Client
// participant Router as Cognitive Router
// participant S1 as system_one (Fast-Path <10ms)
// participant CIR as CIR-Engine 503M (Deep CoT)
//
// Client ->> Router: Dispatch(query)
// Router ->> S1: HeuristicEval(embeddings)
// alt Confidence >= 0.95 (System 1 Fast-Path)
//   S1 -->> Client: Return verified heuristic result [<10ms]
// else Complex Multi-Hop Reasoning (System 2)
//   Router ->> CIR: ForwardToTransformer()
//   CIR -->> Client: [OP:RESULT] with 100% precision
// end
// <!-- /MAD:SEQUENCE -->

func (r *CognitiveRouter) Dispatch(ctx context.Context, q Query) (*Result, error) {
    // Execution loop monitored by MAD-cli tags
    heuristics := r.systemOne.Evaluate(q)
    if heuristics.Confidence >= 0.95 {
        return heuristics.ToResult(), nil
    }
    return r.cirEngine.Deliberate(ctx, q)
}`,
      extractedMermaid: `sequenceDiagram
  autonumber
  participant Client as User Client
  participant Router as Cognitive Router
  participant S1 as system_one (Fast-Path <10ms)
  participant CIR as CIR-Engine 503M (Deep CoT)

  Client->>Router: Dispatch(query)
  Router->>S1: HeuristicEval(embeddings)
  alt Confidence >= 0.95 (System 1 Fast-Path)
    S1-->>Client: Return verified heuristic result [<10ms]
  else Complex Multi-Hop Reasoning (System 2)
    Router->>CIR: ForwardToTransformer()
    CIR-->>Client: [OP:RESULT] with 100% precision
  end`,
      syncedDocPath: 'docs/architecture/cognitive_routing.md',
    },
    native_ipc: {
      title: lang === 'pt' ? 'Ponte IPC Nativa Flutter & Fluxo de Teclado Seguro' : 'Flutter Native IPC & Secure Keyboard Flow',
      filename: 'lib/core/native_keyboard_channel.dart',
      sourceCodeWithMadTags: `import 'package:flutter/services.dart';

// <!-- MAD:FLOWCHART NativeKeyboardBridge -->
// graph TD
//   FlutterUI[Flutter Banking Front-End] -->|PlatformChannel| NativePlugin[Native Android/iOS Plugin]
//   NativePlugin -->|IPC Pipe| SecureKeyboardSDK[Custom Native Keyboard SDK]
//   SecureKeyboardSDK -->|Encrypted Buffer| MemorySpace[(Kernel Secure Memory)]
// <!-- /MAD:FLOWCHART -->

class NativeKeyboardChannel {
  static const MethodChannel _channel = MethodChannel('com.fintech/keyboard');
  // Auto-docced via MAD-cli tags into living README.md
}`,
      extractedMermaid: `graph TD
  FlutterUI[Flutter Banking Front-End] -->|PlatformChannel| NativePlugin[Native Android/iOS Plugin]
  NativePlugin -->|IPC Pipe| SecureKeyboardSDK[Custom Native Keyboard SDK]
  SecureKeyboardSDK -->|Encrypted Buffer| MemorySpace[(Kernel Secure Memory)]`,
      syncedDocPath: 'docs/architecture/keyboard_ipc.md',
    },
  };

  const handleToggle = (key: 'system_one_router' | 'native_ipc') => {
    setSelectedExample(key);
  };

  const current = EXAMPLES[selectedExample];

  return (
    <div className="mt-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-400">
            {lang === 'pt' ? 'Exemplo de Tag na Base de Código:' : 'Codebase Tag Example:'}
          </span>
          <button
            type="button"
            onClick={() => handleToggle('system_one_router')}
            className={`px-2.5 py-1 text-xs font-mono rounded cursor-pointer ${
              selectedExample === 'system_one_router'
                ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/40'
                : 'bg-zinc-900 text-zinc-400'
            }`}
          >
            system_one ➔ CIR-Engine Routing
          </button>
          <button
            type="button"
            onClick={() => handleToggle('native_ipc')}
            className={`px-2.5 py-1 text-xs font-mono rounded cursor-pointer ${
              selectedExample === 'native_ipc'
                ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/40'
                : 'bg-zinc-900 text-zinc-400'
            }`}
          >
            Flutter Native IPC Bridge
          </button>
        </div>

        <div className="text-xs font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 rounded">
          {lang === 'pt' ? 'Motor de Sincronia MAD-cli: Ativo' : 'MAD-cli Sync Engine: Active'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Source Code with MAD Tags */}
        <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl font-mono text-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-zinc-400 pb-2 mb-2 border-b border-zinc-800">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>{current.filename}</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">MAD Tag Annotations</span>
            </div>
            <pre className="text-zinc-300 overflow-x-auto whitespace-pre leading-relaxed p-3 bg-zinc-950/80 rounded border border-zinc-850 max-h-[300px]">
              {current.sourceCodeWithMadTags}
            </pre>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2 font-sans">
            {lang === 'pt'
              ? 'O MAD-cli monitora continuamente as bases de código em busca de tags <!-- MAD:... --> e as extrai para documentação viva.'
              : 'MAD-cli continuously monitors codebases for <!-- MAD:... --> tags and extracts them into living documentation.'}
          </p>
        </div>

        {/* Right: Living Mermaid Diagram & Markdown Output */}
        <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl font-mono text-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-zinc-400 pb-2 mb-2 border-b border-zinc-800">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>{lang === 'pt' ? 'Diagrama Mermaid Vivo Extraído' : 'Living Mermaid Diagram Extracted'}</span>
              </span>
              <span className="text-[10px] text-zinc-500">{current.syncedDocPath}</span>
            </div>

            <div className="p-3 bg-zinc-950/90 rounded border border-zinc-850 mb-3 space-y-2">
              <span className="text-[10px] uppercase font-mono text-zinc-500 block">
                {lang === 'pt' ? 'Bloco Markdown Sincronizado:' : 'Synchronized Markdown Document Block:'}
              </span>
              <pre className="text-emerald-300 text-[11px] overflow-x-auto whitespace-pre leading-relaxed max-h-[240px]">
                {current.extractedMermaid}
              </pre>
            </div>
          </div>

          <div className="p-2.5 bg-emerald-950/20 border border-emerald-500/20 rounded-lg text-[11px] text-emerald-200/90 font-sans">
            <strong>{lang === 'pt' ? 'Garantia de Documentação Viva:' : 'Living Documentation Guarantee:'}</strong>{' '}
            {lang === 'pt'
              ? 'Conforme os métodos de código evoluem, rodar mad-cli sync atualiza automaticamente os diagramas nos repositórios git sem necessidade de manutenção manual.'
              : 'As code methods evolve, running mad-cli sync updates repository Markdown diagrams in git with zero manual maintenance.'}
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- FLUTTER SCENE 3D CANVAS DEMO --- */
const FlutterSceneDemo: React.FC<{ lang?: 'en' | 'pt' }> = ({ lang }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [wireframeColor, setWireframeColor] = useState<'#adff2f' | '#38bdf8' | '#c4b5fd'>('#adff2f');
  const [rotationSpeed, setRotationSpeed] = useState<number>(0.015);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angleX = 0.5;
    let angleY = 0.5;

    const vertices = [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1],
    ];

    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const scale = Math.min(width, height) * 0.22;

      angleX += rotationSpeed * 0.7;
      angleY += rotationSpeed;

      const projected = vertices.map(([x, y, z]) => {
        let x1 = x * Math.cos(angleY) - z * Math.sin(angleY);
        let z1 = z * Math.cos(angleY) + x * Math.sin(angleY);

        let y2 = y * Math.cos(angleX) - z1 * Math.sin(angleX);
        let z2 = z1 * Math.cos(angleX) + y * Math.sin(angleX);

        const fov = 3.5;
        const pz = fov / (fov + z2);
        return [cx + x1 * scale * pz, cy + y2 * scale * pz];
      });

      ctx.strokeStyle = wireframeColor;
      ctx.lineWidth = 1.5;
      edges.forEach(([i, j]) => {
        ctx.beginPath();
        ctx.moveTo(projected[i][0], projected[i][1]);
        ctx.lineTo(projected[j][0], projected[j][1]);
        ctx.stroke();
      });

      projected.forEach(([px, py]) => {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [wireframeColor, rotationSpeed]);

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      {/* 3D Canvas Viewport */}
      <div className="relative aspect-video sm:aspect-4/3 w-full bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden flex items-center justify-center">
        <canvas ref={canvasRef} width={400} height={300} className="w-full h-full object-contain" />
        <div className="absolute top-3 left-3 text-[10px] font-mono text-zinc-500 bg-zinc-900/80 px-2 py-1 rounded border border-zinc-800">
          Flutter_Scene Metal/Vulkan Framebuffer · 60 FPS
        </div>
      </div>

      {/* Controls & Specs */}
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Box className="w-4 h-4 text-[#38bdf8]" />
            <span>
              {lang === 'pt'
                ? 'Otimização de Memória & Shaders de Baixa Latência'
                : 'Low-Latency Shader & Memory Optimization'}
            </span>
          </h4>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            {lang === 'pt'
              ? 'Pipelines otimizados do grafo de cena 3D do Flutter Scene usando shaders customizados e framebuffers nativos com IPC. Integra computação gráfica C++ a aplicações mobile.'
              : 'Optimized Flutter Scene 3D graph pipelines using custom vertex/fragment shaders and native IPC framebuffers. Seamlessly integrates C++ graphics computing into high-level mobile applications.'}
          </p>
        </div>

        {/* Shader Color Switcher */}
        <div className="space-y-1.5">
          <span className="text-xs font-mono text-zinc-500">
            {lang === 'pt' ? 'Luminescência do Wireframe:' : 'Shader Wireframe Luminescence:'}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setWireframeColor('#adff2f')}
              className={`px-3 py-1 text-xs font-mono rounded border cursor-pointer ${
                wireframeColor === '#adff2f' ? 'bg-[#adff2f]/20 border-[#adff2f] text-[#adff2f]' : 'border-zinc-800 text-zinc-400'
              }`}
            >
              Cyber Lime
            </button>
            <button
              type="button"
              onClick={() => setWireframeColor('#38bdf8')}
              className={`px-3 py-1 text-xs font-mono rounded border cursor-pointer ${
                wireframeColor === '#38bdf8' ? 'bg-[#38bdf8]/20 border-[#38bdf8] text-[#38bdf8]' : 'border-zinc-800 text-zinc-400'
              }`}
            >
              {lang === 'pt' ? 'Azul Céu' : 'Sky Blue'}
            </button>
            <button
              type="button"
              onClick={() => setWireframeColor('#c4b5fd')}
              className={`px-3 py-1 text-xs font-mono rounded border cursor-pointer ${
                wireframeColor === '#c4b5fd' ? 'bg-[#c4b5fd]/20 border-[#c4b5fd] text-[#c4b5fd]' : 'border-zinc-800 text-zinc-400'
              }`}
            >
              {lang === 'pt' ? 'Violeta Neural' : 'Neural Violet'}
            </button>
          </div>
        </div>

        {/* Speed Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono text-zinc-400">
            <span>{lang === 'pt' ? 'Velocidade de Rotação:' : 'Rotation Velocity:'}</span>
            <span className="tabular-nums">{(rotationSpeed * 1000).toFixed(0)} rad/s</span>
          </div>
          <input
            type="range"
            min="0.005"
            max="0.04"
            step="0.005"
            value={rotationSpeed}
            onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
            className="w-full accent-[#38bdf8] bg-zinc-800 h-1.5 rounded cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

/* --- GITTRACK TELEMETRY DEMO --- */
const GitTrackDemo: React.FC<{ lang?: 'en' | 'pt' }> = ({ lang }) => {
  const days = Array.from({ length: 28 }, (_, i) => ({
    day: i + 1,
    commits: Math.floor(Math.sin(i * 0.7) * 4 + 5),
  }));

  return (
    <div className="mt-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[#c4b5fd]" />
            <span>
              {lang === 'pt'
                ? 'Observabilidade GitTrack & Velocidade de CI Headless'
                : 'GitTrack Observability & Headless CI Velocity'}
            </span>
          </h4>
          <p className="text-xs text-zinc-400 mt-0.5">
            {lang === 'pt'
              ? 'Observa frequência de commits, rotatividade de branches e despachos automatizados de treinamento.'
              : 'Observes commit frequency, branch churn, and headless automated training dispatches.'}
          </p>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded border border-emerald-400/20">
          {lang === 'pt' ? 'Rastreamento: Daemon Git Ativo' : 'Tracking: Active Git Headless Daemon'}
        </span>
      </div>

      {/* 28-day Commit Matrix */}
      <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
        <div className="flex justify-between text-xs font-mono text-zinc-400">
          <span>{lang === 'pt' ? 'Fluxo das Últimas 4 Semanas' : 'Recent 4-Week Activity Stream'}</span>
          <span className="text-zinc-500">
            {lang === 'pt' ? '142 Commits & Despachos Headless' : '142 Headless Commits & Dispatches'}
          </span>
        </div>
        <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5">
          {days.map((d) => (
            <div
              key={d.day}
              style={{
                backgroundColor: `rgba(139, 92, 246, ${Math.min(d.commits * 0.12 + 0.1, 0.9)})`,
              }}
              className="h-7 rounded flex items-center justify-center font-mono text-[10px] text-zinc-200 border border-zinc-800 hover:border-white transition-colors cursor-default"
              title={`${lang === 'pt' ? 'Dia' : 'Day'} ${d.day}: ${d.commits} ${lang === 'pt' ? 'commits/execuções' : 'commits/runs'}`}
            >
              {d.commits}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
