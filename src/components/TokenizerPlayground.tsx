import React, { useState, useMemo } from 'react';
import {
  tokenizeText,
  calculateTokenizerStats,
  computeAttentionMatrix,
  TokenItem,
  byteToHex,
} from '../lib/tokenizer';
import { Sparkles, Terminal, Cpu, Layers, RefreshCw, Eye, Hash, Binary } from 'lucide-react';

interface TokenizerPlaygroundProps {
  initialPrompt?: string;
  lang?: 'en' | 'pt';
}

const PRESET_PROMPTS = [
  {
    label: 'CIR-Engine Query',
    text: '[OP:QUERY] Optimize RoPE attention head projection across multi-GPU DDP cluster.',
  },
  {
    label: 'Subroutine Calcs',
    text: '[OP:SOLVE] Calculate throughput: [OP:CALC] 503000000 / 6200 [VAL: 81129.03]',
  },
  {
    label: 'mddd-cli Architecture',
    text: 'classDiagram DomainModel <|-- RepositoryInterface : implements Clean Architecture',
  },
  {
    label: 'Flutter Scene 3D',
    text: 'FragmentShader sceneShader = loadShader("shaders/spatial_viewport.frag");',
  },
  {
    label: 'Julio Cesar Profile',
    text: 'Julio Cesar da Costa Reis Filho · Senior Systems Architect & LLM Engineer',
  },
];

export const TokenizerPlayground: React.FC<TokenizerPlaygroundProps> = ({
  initialPrompt = '[OP:QUERY] Causal Transformer 503M parameters with RoPE and FlashAttention.',
  lang = 'en',
}) => {
  const [inputText, setInputText] = useState(initialPrompt);
  const [selectedToken, setSelectedToken] = useState<TokenItem | null>(null);
  const [activeAttentionHead, setActiveAttentionHead] = useState<'causal_recency' | 'positional_rope' | 'semantic'>('causal_recency');
  const [activeTab, setActiveTab] = useState<'tokens' | 'bytes' | 'attention'>('tokens');

  const tokens = useMemo(() => tokenizeText(inputText), [inputText]);
  const stats = useMemo(() => calculateTokenizerStats(inputText, tokens), [inputText, tokens]);
  const attentionMatrix = useMemo(
    () => computeAttentionMatrix(tokens, activeAttentionHead),
    [tokens, activeAttentionHead]
  );

  return (
    <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-6 lg:p-8 backdrop-blur-xl shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Cpu className="w-5 h-5 text-[#adff2f]" />
            <h3 className="text-xl font-bold tracking-tight text-white">
              {lang === 'pt' ? 'Laboratório Interativo de Tokens & Bytes' : 'Interactive Byte-Level Tokenizer & Attention Sandbox'}
            </h3>
          </div>
          <p className="text-sm text-zinc-400">
            {lang === 'pt'
              ? 'Observe como modelos de grande porte (LLMs) decompõem texto em sequências de bytes e pesos de atenção causal.'
              : 'Explore how large language models segment raw UTF-8 bytes into BPE tokens and compute causal self-attention matrices.'}
          </p>
        </div>

        {/* View mode segmented tabs */}
        <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-lg self-start md:self-auto">
          <button
            onClick={() => setActiveTab('tokens')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'tokens' ? 'bg-zinc-800 text-[#adff2f] shadow-xs' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Tokens ({tokens.length})
          </button>
          <button
            onClick={() => setActiveTab('bytes')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'bytes' ? 'bg-zinc-800 text-[#38bdf8] shadow-xs' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Bytes ({stats.byteCount})
          </button>
          <button
            onClick={() => setActiveTab('attention')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'attention' ? 'bg-zinc-800 text-[#c4b5fd] shadow-xs' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Attention Heatmap
          </button>
        </div>
      </div>

      {/* Preset Prompts Pills (Interactive buttons with click handlers) */}
      <div className="pt-4 pb-3 flex flex-wrap items-center gap-2">
        <span className="text-xs text-zinc-500 font-mono flex items-center gap-1 mr-1">
          <Sparkles className="w-3 h-3 text-[#adff2f]" />
          {lang === 'pt' ? 'Exemplos:' : 'Presets:'}
        </span>
        {PRESET_PROMPTS.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => {
              setInputText(preset.text);
              setSelectedToken(null);
            }}
            className="text-xs font-mono px-2.5 py-1 rounded bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 transition-colors"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Input Textarea */}
      <div className="relative mt-2">
        <textarea
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            setSelectedToken(null);
          }}
          rows={3}
          placeholder="Type or paste any text to inspect real-time byte tokenization..."
          className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-[#adff2f]/50 rounded-xl p-3.5 text-sm font-mono text-zinc-100 placeholder-zinc-600 focus:outline-hidden focus:ring-1 focus:ring-[#adff2f]/30 transition-all resize-none"
        />
        {inputText && (
          <button
            onClick={() => {
              setInputText('');
              setSelectedToken(null);
            }}
            className="absolute top-3 right-3 text-xs text-zinc-500 hover:text-zinc-300 font-mono px-2 py-0.5 rounded bg-zinc-850 border border-zinc-800"
          >
            Clear
          </button>
        )}
      </div>

      {/* Live Telemetry Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 p-3 bg-zinc-900/40 border border-zinc-850 rounded-xl">
        <div className="flex flex-col">
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Tokens</span>
          <span className="text-lg font-bold font-mono text-[#adff2f] tabular-nums">{stats.tokenCount}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">UTF-8 Bytes</span>
          <span className="text-lg font-bold font-mono text-[#38bdf8] tabular-nums">{stats.byteCount} B</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Compression</span>
          <span className="text-lg font-bold font-mono text-[#c4b5fd] tabular-nums">{stats.compressionRatio} chars/tok</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Density</span>
          <span className="text-lg font-bold font-mono text-emerald-400 tabular-nums">{stats.bytesPerToken} B/tok</span>
        </div>
      </div>

      {/* Tab 1: Tokenizer View */}
      {activeTab === 'tokens' && (
        <div className="mt-4">
          <div className="text-xs font-mono text-zinc-500 mb-2 flex items-center justify-between">
            <span>Click any token to inspect its low-level representation:</span>
            <span className="text-zinc-600">Vocabulary Size: ~48,256</span>
          </div>

          <div className="min-h-[140px] p-4 bg-zinc-950 border border-zinc-850 rounded-xl flex flex-wrap gap-1.5 items-center content-start">
            {tokens.length === 0 ? (
              <span className="text-zinc-600 font-mono text-sm italic">Type something in the box above...</span>
            ) : (
              tokens.map((token, i) => {
                const isSelected = selectedToken?.id === token.id && selectedToken.text === token.text;
                return (
                  <button
                    key={`${token.id}-${i}`}
                    onClick={() => setSelectedToken(token)}
                    style={{
                      backgroundColor: token.color.bg,
                      borderColor: isSelected ? '#adff2f' : token.color.border,
                      color: token.color.text,
                    }}
                    className={`group/tok relative px-2 py-1 rounded text-xs font-mono border transition-all hover:scale-105 active:scale-95 ${
                      isSelected ? 'ring-2 ring-[#adff2f]/50 shadow-md shadow-[#adff2f]/10' : ''
                    }`}
                  >
                    <span>{token.text.replace(/ /g, '␣')}</span>
                    <span className="ml-1 text-[9px] opacity-60 font-mono">#{token.id}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Raw Byte Stream View */}
      {activeTab === 'bytes' && (
        <div className="mt-4">
          <div className="text-xs font-mono text-zinc-500 mb-2 flex items-center justify-between">
            <span>Continuous UTF-8 Byte Stream Matrix (0x00 - 0xFF):</span>
            <span className="text-zinc-600">Direct Memory Representation</span>
          </div>

          <div className="p-4 bg-zinc-950 border border-zinc-850 rounded-xl max-h-[220px] overflow-y-auto font-mono text-xs">
            <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 gap-1.5">
              {tokens.flatMap((t, tIdx) =>
                t.bytes.map((b, bIdx) => (
                  <div
                    key={`${tIdx}-${bIdx}`}
                    className="p-1.5 bg-zinc-900 border border-zinc-800 hover:border-[#38bdf8] rounded text-center transition-colors cursor-default group"
                    title={`Byte: ${b} | Char: "${String.fromCharCode(b)}" | Hex: ${byteToHex(b)}`}
                  >
                    <div className="text-[#38bdf8] font-bold text-[11px]">{byteToHex(b)}</div>
                    <div className="text-[10px] text-zinc-400 truncate">
                      {b >= 32 && b <= 126 ? String.fromCharCode(b) : '·'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Attention Matrix Heatmap */}
      {activeTab === 'attention' && (
        <div className="mt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="text-xs font-mono text-zinc-400">
              Causal Attention Weight Matrix (A[i, j] = softmax(Q·Kᵀ / √d))
            </div>
            {/* Attention Head Selector */}
            <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
              <span className="text-[10px] font-mono text-zinc-500 px-1">Head:</span>
              <button
                onClick={() => setActiveAttentionHead('causal_recency')}
                className={`px-2 py-0.5 text-[11px] font-mono rounded ${
                  activeAttentionHead === 'causal_recency' ? 'bg-zinc-800 text-[#adff2f]' : 'text-zinc-400'
                }`}
              >
                0: Recency
              </button>
              <button
                onClick={() => setActiveAttentionHead('positional_rope')}
                className={`px-2 py-0.5 text-[11px] font-mono rounded ${
                  activeAttentionHead === 'positional_rope' ? 'bg-zinc-800 text-[#38bdf8]' : 'text-zinc-400'
                }`}
              >
                1: RoPE Decay
              </button>
              <button
                onClick={() => setActiveAttentionHead('semantic')}
                className={`px-2 py-0.5 text-[11px] font-mono rounded ${
                  activeAttentionHead === 'semantic' ? 'bg-zinc-800 text-[#c4b5fd]' : 'text-zinc-400'
                }`}
              >
                2: Semantic
              </button>
            </div>
          </div>

          {/* Attention Grid */}
          <div className="p-4 bg-zinc-950 border border-zinc-850 rounded-xl overflow-x-auto">
            {tokens.length === 0 ? (
              <span className="text-zinc-600 font-mono text-xs">Enter text to compute attention...</span>
            ) : tokens.length > 20 ? (
              <div className="text-zinc-400 text-xs font-mono py-4 text-center">
                Attention heatmap displayed for the first 20 tokens to maintain visual clarity. (Total tokens: {tokens.length})
              </div>
            ) : (
              <div className="min-w-fit">
                {/* Column Headers */}
                <div className="flex items-center mb-1">
                  <div className="w-16 shrink-0 text-[10px] font-mono text-zinc-600 text-right pr-2">Tokens</div>
                  {tokens.slice(0, 16).map((t, idx) => (
                    <div
                      key={idx}
                      className="w-8 shrink-0 text-[9px] font-mono text-zinc-400 truncate text-center"
                      title={t.text}
                    >
                      {t.text.trim() || '␣'}
                    </div>
                  ))}
                </div>

                {/* Rows */}
                {attentionMatrix.slice(0, 16).map((row, rowIdx) => (
                  <div key={rowIdx} className="flex items-center mb-1">
                    <div
                      className="w-16 shrink-0 text-[10px] font-mono text-zinc-400 truncate text-right pr-2"
                      title={tokens[rowIdx]?.text}
                    >
                      {tokens[rowIdx]?.text.trim() || '␣'}
                    </div>
                    {row.slice(0, 16).map((score, colIdx) => {
                      const isCausalMasked = colIdx > rowIdx;
                      return (
                        <div
                          key={colIdx}
                          style={{
                            backgroundColor: isCausalMasked
                              ? '#090a0f'
                              : `rgba(173, 255, 47, ${Math.max(score * 1.3, 0.06)})`,
                          }}
                          className={`w-8 h-7 shrink-0 rounded-xs flex items-center justify-center text-[9px] font-mono border border-zinc-900 transition-colors ${
                            isCausalMasked ? 'text-zinc-800' : 'text-zinc-200'
                          }`}
                          title={`Row [${tokens[rowIdx]?.text}] attends to Col [${tokens[colIdx]?.text}]: ${(score * 100).toFixed(1)}%`}
                        >
                          {isCausalMasked ? '—' : `${Math.round(score * 100)}`}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Selected Token Inspector Card */}
      {selectedToken && (
        <div className="mt-4 p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-500 uppercase">Selected Token:</span>
              <span className="font-mono text-sm font-bold text-white bg-zinc-800 px-2 py-0.5 rounded">
                "{selectedToken.text}"
              </span>
              <span className="text-xs font-mono text-[#adff2f]">ID #{selectedToken.id}</span>
            </div>
            <div className="text-xs font-mono text-zinc-400 flex flex-wrap gap-x-4 gap-y-1 pt-1">
              <span>Hex: <strong className="text-[#38bdf8]">{selectedToken.hexList.join(' ')}</strong></span>
              <span>Dec: <strong className="text-purple-300">{selectedToken.bytes.join(', ')}</strong></span>
              <span>Bytes: <strong className="text-zinc-200">{selectedToken.bytes.length}</strong></span>
              <span>Binary: <strong className="text-emerald-400">{selectedToken.binaryList[0]}</strong></span>
            </div>
          </div>
          <button
            onClick={() => setSelectedToken(null)}
            className="self-start md:self-auto text-xs font-mono text-zinc-400 hover:text-white px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};
