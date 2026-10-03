import React, { useState, useRef, useEffect } from 'react';
import { PORTFOLIO_INFO, PROJECTS } from '../data/portfolio-data';
import { tokenizeText } from '../lib/tokenizer';
import { Terminal, Send, X, Copy, Check } from 'lucide-react';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: 'en' | 'pt';
}

interface CommandLog {
  type: 'input' | 'output' | 'system' | 'error';
  text: string;
}

export const TerminalModal: React.FC<TerminalModalProps> = ({ isOpen, onClose, lang = 'en' }) => {
  const [inputVal, setInputVal] = useState('');
  const [copied, setCopied] = useState(false);
  const [logs, setLogs] = useState<CommandLog[]>([
    {
      type: 'system',
      text: 'Julio Cesar Reis Filho — Causal Reasoning & Systems Kernel v2.4 initialized.',
    },
    {
      type: 'system',
      text: "Type 'help' to view available operations, or 'contact' to initiate contact sequence.",
    },
  ]);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  if (!isOpen) return null;

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    const newLogs: CommandLog[] = [...logs, { type: 'input', text: `$ ${cmd}` }];
    const lower = cmd.toLowerCase();

    if (lower === 'help') {
      newLogs.push({
        type: 'output',
        text: `Available Kernel Commands:
  contact            - Print official contact coordinates & email
  cir-engine         - Print 503M Causal Transformer architecture specs
  system_one         - Print fast-path heuristic inference engine specs
  mad-cli            - Print Mermaid Auto-Doccing living tags documentation
  projects           - List all repositories (mddd-cli, MAD-cli, system_one...)
  tokenize <text>    - Deconstruct arbitrary string into Byte-BPE tokens
  skills             - Display core ML and fullstack engineering proficiencies
  clear              - Purge terminal output buffer
  exit               - Terminate terminal session`,
      });
    } else if (lower === 'system_one') {
      newLogs.push({
        type: 'output',
        text: `[SYSTEM_ONE HEURISTIC INFERENCE KERNEL]
  Role:           Fast-Path Heuristic Engine (Dual-Process Cognitive Layer)
  Latency:        < 10ms local evaluation loop
  Quantization:   INT8 / FP8 optimized tensor execution
  Routing:        Dynamic classifier routing between System 1 fast heuristics and System 2 CIR-Engine
  Architecture:   Direct integration with CIR-Engine KV-cache and canonical grammar loops`,
      });
    } else if (lower === 'mad-cli') {
      newLogs.push({
        type: 'output',
        text: `[MAD-CLI: MERMAID AUTO-DOCCING]
  Function:       Extracts living Mermaid diagrams from codebase comment tags
  Supported Tags: <!-- MAD:SEQUENCE -->, <!-- MAD:FLOWCHART -->, @mad:class
  Ecosystem:      Bidirectional loop with mddd-cli (Diagram-to-Code + Code-to-Diagram)
  Languages:      Go, Dart, TypeScript, Python`,
      });
    } else if (lower === 'contact' || lower === 'predict_contact_method()') {
      newLogs.push({
        type: 'output',
        text: `[PREDICT_CONTACT_METHOD() RESULT]
  Candidate:  ${PORTFOLIO_INFO.name}
  Email:      ${PORTFOLIO_INFO.email}
  Phone:      ${PORTFOLIO_INFO.phone}
  Location:   ${PORTFOLIO_INFO.location}
  GitHub:     ${PORTFOLIO_INFO.github}
  Status:     Open to Remote & International Relocation`,
      });
    } else if (lower === 'cir-engine') {
      newLogs.push({
        type: 'output',
        text: `[CIR-ENGINE-503M ARCHITECTURE SPECIFICATIONS]
  Parameters:     503,316,480 (16 layers, 1536 dim, 12 Q heads, 4 KV heads)
  Attention:      Grouped-Query Attention (GQA) + RoPE + SDPA FlashAttention
  Distributed:    torchrun DDP on NVIDIA Tesla T4/L4 (~6,200 tokens/sec)
  Optimization:   Mixed-Precision FP16/AMP, -66% epoch runtime reduction
  Grammar:        [OP:QUERY] -> [OP:SOLVE] -> [OP:CALC] -> [OP:RESULT]
  Tool Intercept: Deterministic O(1) Python subroutine executor (100% precision)`,
      });
    } else if (lower === 'projects') {
      const projList = PROJECTS.map((p) => `  - ${p.title} (${p.category}): ${p.summary}`).join('\n');
      newLogs.push({
        type: 'output',
        text: `[ACTIVE OPEN-SOURCE & RESEARCH REPOSITORIES]\n${projList}`,
      });
    } else if (lower.startsWith('tokenize ')) {
      const query = cmd.slice(9);
      const tokens = tokenizeText(query);
      const summary = tokens
        .map((t) => `[Token ID: #${t.id} | Text: "${t.text}" | Hex: ${t.hexList.join(' ')}]`)
        .join('\n');
      newLogs.push({
        type: 'output',
        text: `[TOKENIZER DECONSTRUCTION]\nInput: "${query}"\nToken count: ${tokens.length}\n${summary}`,
      });
    } else if (lower === 'skills') {
      newLogs.push({
        type: 'output',
        text: `[CORE PROFICIENCIES]
  Machine Learning:  Transformers, RoPE, RMSNorm, GQA, PyTorch, DDP, SFT Masking
  Languages:         Python, Go, Dart/Flutter, TypeScript, C++, Java/Kotlin, SQL
  Systems & Cloud:   GCP, Docker, Multi-Agent AI (Cursor/Cline/LiteLLM), Microservices
  Mobile & Web:      Flutter (Mobile/Desktop/Web), Next.js (SSR/ISR), Technical SEO/AEO`,
      });
    } else if (lower === 'clear') {
      setLogs([]);
      setInputVal('');
      return;
    } else if (lower === 'exit' || lower === 'quit') {
      onClose();
      return;
    } else {
      newLogs.push({
        type: 'error',
        text: `Unrecognized command: '${cmd}'. Type 'help' for instructions.`,
      });
    }

    setLogs(newLogs);
    setInputVal('');
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(PORTFOLIO_INFO.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-750 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[560px]">
        {/* Title Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/90 border-b border-zinc-800 select-none">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <button
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 transition-colors"
                title="Close"
              />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-xs font-mono text-zinc-400 ml-2">
              julio_cesar@latent-kernel:~ (bash)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyEmail}
              className="text-[11px] font-mono text-zinc-400 hover:text-[#adff2f] flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-[#adff2f]" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy Email'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Output Stream */}
        <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-2 select-text">
          {logs.map((log, i) => (
            <div
              key={i}
              className={`leading-relaxed whitespace-pre-wrap ${
                log.type === 'input'
                  ? 'text-white font-bold'
                  : log.type === 'system'
                  ? 'text-zinc-500'
                  : log.type === 'error'
                  ? 'text-red-400'
                  : 'text-[#adff2f]'
              }`}
            >
              {log.text}
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleCommand} className="flex items-center gap-2 p-3 bg-zinc-900 border-t border-zinc-800">
          <span className="text-[#adff2f] font-mono text-sm pl-2">❯</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type 'contact', 'cir-engine', 'tokenize <text>', or 'help'..."
            className="flex-1 bg-transparent font-mono text-xs text-white placeholder-zinc-600 focus:outline-hidden"
          />
          <button
            type="submit"
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
