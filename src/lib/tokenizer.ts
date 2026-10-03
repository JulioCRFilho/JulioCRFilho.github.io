/**
 * Byte-Level Tokenizer & LLM Inference Utilities
 * Emulates Byte-Pair Encoding (BPE) and UTF-8 byte stream operations
 * as utilized in modern Causal LLMs (CIR-Engine, GPT-4, LLaMA-3).
 */

export interface TokenItem {
  id: number;
  text: string;
  bytes: number[];
  hexList: string[];
  binaryList: string[];
  color: {
    bg: string;
    border: string;
    text: string;
    accent: string;
  };
}

export interface TokenizerStats {
  charCount: number;
  byteCount: number;
  tokenCount: number;
  bytesPerToken: number;
  compressionRatio: number;
  nonAsciiCount: number;
}

// Visual color palette for tokens (high-contrast, accessible dark-theme palette)
const TOKEN_PALETTES = [
  { bg: 'rgba(173, 255, 47, 0.12)', border: 'rgba(173, 255, 47, 0.35)', text: '#d9ff7a', accent: '#adff2f' }, // Cyber Lime
  { bg: 'rgba(139, 92, 246, 0.15)', border: 'rgba(139, 92, 246, 0.40)', text: '#c4b5fd', accent: '#8b5cf6' }, // Neural Violet
  { bg: 'rgba(56, 189, 248, 0.15)', border: 'rgba(56, 189, 248, 0.40)', text: '#7dd3fc', accent: '#38bdf8' }, // Sky
  { bg: 'rgba(251, 146, 60, 0.15)', border: 'rgba(251, 146, 60, 0.40)', text: '#fdba74', accent: '#fb923c' }, // Amber
  { bg: 'rgba(236, 72, 153, 0.15)', border: 'rgba(236, 72, 153, 0.40)', text: '#f472b6', accent: '#ec4899' }, // Rose/Pink
  { bg: 'rgba(52, 211, 153, 0.15)', border: 'rgba(52, 211, 153, 0.40)', text: '#6ee7b7', accent: '#34d399' }, // Emerald
  { bg: 'rgba(167, 139, 250, 0.15)', border: 'rgba(167, 139, 250, 0.40)', text: '#ddd6fe', accent: '#a78bfa' }, // Indigo
  { bg: 'rgba(250, 204, 21, 0.15)', border: 'rgba(250, 204, 21, 0.40)', text: '#fde047', accent: '#facc15' }, // Yellow
];

/**
 * Encodes a string into UTF-8 bytes using browser native TextEncoder
 */
export function encodeUtf8Bytes(text: string): number[] {
  const encoder = new TextEncoder();
  return Array.from(encoder.encode(text));
}

/**
 * Converts a byte integer (0-255) to hex representation (e.g. 0x4A)
 */
export function byteToHex(byte: number): string {
  return '0x' + byte.toString(16).toUpperCase().padStart(2, '0');
}

/**
 * Converts a byte integer to 8-bit binary representation
 */
export function byteToBinary(byte: number): string {
  return byte.toString(2).padStart(8, '0');
}

/**
 * Stable hash function to assign consistent token IDs and colors
 */
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(hash);
}

/**
 * Byte-level BPE Subword Tokenizer simulation
 * Segments input text into realistic subword/byte tokens with IDs
 */
export function tokenizeText(input: string): TokenItem[] {
  if (!input) return [];

  // Match special canonical grammar tokens first (e.g., [OP:QUERY], [OP:SOLVE], [VAL: ...])
  // Then match words with leading spaces, subwords, numbers, punctuation, or individual bytes
  const specialTokens = ['[OP:QUERY]', '[OP:SOLVE]', '[OP:RESULT]', '[OP:CALC]', '[VAL:'];
  const tokenRegex = /(\[OP:[A-Z]+\]|\[VAL:[^\]]*\]|\s+[a-zA-Z0-9]+|[a-zA-Z0-9]+|\s+|[^\s\w])/g;

  const rawMatches = input.match(tokenRegex) || [input];
  const tokens: TokenItem[] = [];

  let tokenCounter = 1000;

  for (let i = 0; i < rawMatches.length; i++) {
    const raw = rawMatches[i];
    
    // For longer words without spaces, sometimes split into subwords if > 6 chars to simulate BPE
    if (raw.length > 7 && !raw.startsWith(' ') && !raw.startsWith('[')) {
      const splitPoint = Math.floor(raw.length / 2);
      const sub1 = raw.slice(0, splitPoint);
      const sub2 = raw.slice(splitPoint);
      [sub1, sub2].forEach((sub) => {
        tokens.push(createTokenItem(sub, tokenCounter++));
      });
    } else {
      tokens.push(createTokenItem(raw, tokenCounter++));
    }
  }

  return tokens;
}

function createTokenItem(text: string, fallbackId: number): TokenItem {
  const bytes = encodeUtf8Bytes(text);
  const hash = hashString(text);
  const tokenId = (hash % 48000) + 256;
  const paletteIndex = hash % TOKEN_PALETTES.length;

  return {
    id: tokenId,
    text,
    bytes,
    hexList: bytes.map(byteToHex),
    binaryList: bytes.map(byteToBinary),
    color: TOKEN_PALETTES[paletteIndex],
  };
}

/**
 * Calculates compression and token statistics
 */
export function calculateTokenizerStats(input: string, tokens: TokenItem[]): TokenizerStats {
  const bytes = encodeUtf8Bytes(input);
  const charCount = input.length;
  const byteCount = bytes.length;
  const tokenCount = tokens.length || 1;
  const bytesPerToken = +(byteCount / tokenCount).toFixed(2);
  const compressionRatio = +(charCount / tokenCount).toFixed(2);
  const nonAsciiCount = bytes.filter((b) => b > 127).length;

  return {
    charCount,
    byteCount,
    tokenCount: tokens.length,
    bytesPerToken,
    compressionRatio,
    nonAsciiCount,
  };
}

export interface SubwordItem {
  id: number;
  text: string;
  bytes: number[];
  hexList: string[];
  binaryList: string[];
  color: {
    bg: string;
    border: string;
    text: string;
    accent: string;
  };
}

export interface WordAssemblyItem {
  word: string;
  isWhitespace: boolean;
  trailingSpace?: boolean;
  bytes: number[];
  hexList: string[];
  subwords: SubwordItem[];
}

/**
 * Segments a text chunk into BPE subwords, cleanly isolating punctuation
 * e.g. "systems." -> ["sys", "tems", "."]
 * e.g. "CIR-Engine" -> ["CIR", "-", "Eng", "ine"]
 * e.g. "503M:" -> ["503", "M", ":"]
 */
export function segmentIntoBpeSubwords(chunk: string): string[] {
  if (!chunk) return [];
  if (chunk.length <= 1) return [chunk];

  // Separate word into alphanumeric sequences and punctuation sequences
  const parts = chunk.match(/([a-zA-Z0-9À-ÿ_]+|[^\s\w])/g) || [chunk];
  const result: string[] = [];

  for (const part of parts) {
    // If it's punctuation or short (1-2 chars), keep as an intact token
    if (/^[^\s\w]+$/.test(part) || part.length <= 2) {
      result.push(part);
      continue;
    }

    const len = part.length;
    if (len === 3) {
      result.push(part);
    } else if (len === 4) {
      result.push(part.slice(0, 2), part.slice(2));
    } else if (len === 5) {
      result.push(part.slice(0, 3), part.slice(3));
    } else if (len === 6) {
      result.push(part.slice(0, 3), part.slice(3));
    } else if (len <= 9) {
      const p1 = Math.ceil(len / 3);
      const p2 = p1 * 2;
      result.push(part.slice(0, p1), part.slice(p1, p2), part.slice(p2));
    } else {
      for (let i = 0; i < len; i += 4) {
        result.push(part.slice(i, i + 4));
      }
    }
  }

  return result.filter(Boolean);
}

/**
 * Decomposes text into word units with explicit 3-stage assembly data:
 * Preserves correct punctuation binding and typography spacing.
 * Stage 1: Raw Bytes (0x4A, 0x75...)
 * Stage 2: Semi-words / BPE Subwords ([Jul], [io]...)
 * Stage 3: Full Assembled Word ("JULIO")
 */
export function decomposeIntoAssemblyWords(text: string): WordAssemblyItem[] {
  if (!text) return [];

  // Split text by whitespace sequences while preserving trailing spaces
  const rawParts = text.split(/(\s+)/);
  const tokenList: { raw: string; trailingSpace: boolean }[] = [];

  for (let i = 0; i < rawParts.length; i++) {
    const part = rawParts[i];
    if (!part) continue;

    if (/^\s+$/.test(part)) {
      if (tokenList.length > 0) {
        tokenList[tokenList.length - 1].trailingSpace = true;
      }
      continue;
    }

    tokenList.push({
      raw: part,
      trailingSpace: false,
    });
  }

  return tokenList.map(({ raw: chunk, trailingSpace }) => {
    const bytes = encodeUtf8Bytes(chunk);
    const hexList = bytes.map(byteToHex);

    // Segment into realistic BPE semi-words while preserving punctuation attachment
    const subwordStrings = segmentIntoBpeSubwords(chunk);

    const subwords: SubwordItem[] = subwordStrings.map((sub) => {
      const subBytes = encodeUtf8Bytes(sub);
      const subHash = hashString(sub);
      return {
        id: (subHash % 48000) + 256,
        text: sub,
        bytes: subBytes,
        hexList: subBytes.map(byteToHex),
        binaryList: subBytes.map(byteToBinary),
        color: TOKEN_PALETTES[subHash % TOKEN_PALETTES.length],
      };
    });

    return {
      word: chunk,
      isWhitespace: false,
      trailingSpace,
      bytes,
      hexList,
      subwords,
    };
  });
}

export interface TokenCacheStats {
  totalTokens: number;
  uniqueTokens: number;
  reusedTokens: number;
  reuseRate: number; // e.g. 42.5 (%)
  rawBytes: number;
  compressionRatio: number; // e.g. 3.4x
  cachedTokenRegistry: Array<{
    id: number;
    text: string;
    hits: number;
    bytes: number;
    color: { bg: string; border: string; text: string; accent: string };
  }>;
}

/**
 * Analyzes token usage and BPE / KV-Cache reuse across text samples
 * Demonstrates real ML memory optimization via token deduplication & prefix caching.
 */
export function analyzeTokenCacheUsage(textSamples: string[]): TokenCacheStats {
  const tokenFrequency = new Map<number, { text: string; count: number; bytes: number; color: any }>();
  let totalTokens = 0;
  let rawBytes = 0;

  textSamples.forEach((sample) => {
    rawBytes += encodeUtf8Bytes(sample).length;
    const words = decomposeIntoAssemblyWords(sample);
    words.forEach((w) => {
      if (!w.isWhitespace) {
        w.subwords.forEach((sub) => {
          totalTokens++;
          const existing = tokenFrequency.get(sub.id);
          if (existing) {
            existing.count++;
          } else {
            tokenFrequency.set(sub.id, {
              text: sub.text,
              count: 1,
              bytes: sub.bytes.length,
              color: sub.color,
            });
          }
        });
      }
    });
  });

  const uniqueTokens = tokenFrequency.size;
  const reusedTokens = Math.max(0, totalTokens - uniqueTokens);
  const reuseRate = totalTokens > 0 ? (reusedTokens / totalTokens) * 100 : 0;
  const compressionRatio = totalTokens > 0 ? rawBytes / Math.max(1, totalTokens) : 1;

  const cachedTokenRegistry = Array.from(tokenFrequency.entries())
    .filter(([_, data]) => data.count > 1)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10)
    .map(([id, data]) => ({
      id,
      text: data.text,
      hits: data.count,
      bytes: data.bytes,
      color: data.color,
    }));

  return {
    totalTokens,
    uniqueTokens,
    reusedTokens,
    reuseRate: +reuseRate.toFixed(1),
    rawBytes,
    compressionRatio: +compressionRatio.toFixed(2),
    cachedTokenRegistry,
  };
}

/**
 * Simulated Causal Self-Attention Matrix for tokens
 * Returns a 2D array of normalized attention scores [target_pos][source_pos]
 */
export function computeAttentionMatrix(
  tokens: TokenItem[],
  headType: 'causal_recency' | 'semantic' | 'positional_rope' = 'causal_recency'
): number[][] {
  const n = tokens.length;
  if (n === 0) return [];
  const matrix: number[][] = [];

  for (let i = 0; i < n; i++) {
    const row: number[] = [];
    let rowSum = 0;

    for (let j = 0; j < n; j++) {
      if (j > i) {
        // Causal mask: cannot attend to future tokens
        row.push(0);
      } else {
        let weight = 0;
        const dist = i - j;

        if (headType === 'causal_recency') {
          // Attends strongly to immediate previous tokens and self
          weight = Math.exp(-dist * 0.45) + (j === 0 ? 0.3 : 0);
        } else if (headType === 'positional_rope') {
          // Rotary position embedding periodic attention decay
          const theta = dist * 0.35;
          weight = (Math.cos(theta) * 0.5 + 0.5) * Math.exp(-dist * 0.2) + 0.1;
        } else {
          // Semantic: token text similarity hash
          const sim = Math.abs(Math.sin((tokens[i].id ^ tokens[j].id) * 0.01));
          weight = sim * 0.7 + (dist === 0 ? 0.5 : 0.2);
        }

        row.push(weight);
        rowSum += weight;
      }
    }

    // Softmax normalization across valid causal tokens
    const normalized = row.map((val) => (rowSum > 0 ? +(val / rowSum).toFixed(3) : 0));
    matrix.push(normalized);
  }

  return matrix;
}
