/**
 * Dual Telemetry Service: Real Human vs AI Agent Ingestion Counter
 * Tracks and distinguishes interactive human visitors from automated LLM agents,
 * answer engine crawlers (Perplexity, GPTBot, ClaudeBot), and llms.txt ingestions.
 * 
 * Powered by persistent live global telemetry with local session deduplication.
 */

export interface TelemetryEvent {
  id: string;
  type: 'human' | 'agent';
  label: string;
  timestamp: string;
  detail: string;
}

export interface TelemetryData {
  humanViews: number;
  agentViews: number;
  lastAgent: string;
  lastSeen: string;
  recentEvents: TelemetryEvent[];
  isLoading?: boolean;
}

const STORAGE_KEY = 'jcrf_telemetry_real_v2';
const SESSION_KEY = 'jcrf_session_counted_v2';

const API_BASE = 'https://countapi.mileshilliard.com/api/v1';
const KEY_HUMANS = 'byteod-portfolio-humans';
const KEY_AGENTS = 'byteod-portfolio-agents';

// Known AI agent / crawler user agents & signatures
const AGENT_SIGNATURES = [
  { match: 'gptbot', name: 'GPTBot (OpenAI)' },
  { match: 'chatgpt', name: 'ChatGPT-User' },
  { match: 'claudebot', name: 'ClaudeBot (Anthropic)' },
  { match: 'claude-web', name: 'Claude Web Scraper' },
  { match: 'perplexity', name: 'PerplexityBot (Search AI)' },
  { match: 'anthropic', name: 'Anthropic AI' },
  { match: 'google-extended', name: 'Google Gemini Crawler' },
  { match: 'cursor', name: 'Cursor IDE Agent' },
  { match: 'bytespider', name: 'ByteDance AI Spider' },
  { match: 'amazonbot', name: 'Amazon Bedrock Bot' },
  { match: 'headlesschrome', name: 'Headless Synthetic Agent' },
  { match: 'python-requests', name: 'Python Agent Script' },
  { match: 'curl', name: 'Developer CLI / cURL' },
  { match: 'wget', name: 'Wget Automated Ingest' },
];

function detectVisitorType(): { type: 'human' | 'agent'; name: string } {
  if (typeof window === 'undefined') return { type: 'human', name: 'Direct Ingest' };

  // 1. Headless / automated driver check
  if (navigator.webdriver) {
    return { type: 'agent', name: 'Headless Synthetic Runner' };
  }

  // 2. Query param inspection
  const search = window.location.search.toLowerCase();
  if (search.includes('agent') || search.includes('bot') || search.includes('llm')) {
    return { type: 'agent', name: 'Synthetic Agent (URL Flagged)' };
  }

  // 3. User agent inspection
  const ua = (navigator.userAgent || '').toLowerCase();
  for (const sig of AGENT_SIGNATURES) {
    if (ua.includes(sig.match)) {
      return { type: 'agent', name: sig.name };
    }
  }

  // 4. Default to human visitor
  return { type: 'human', name: 'Navegador Interativo' };
}

function loadInitialData(): TelemetryData {
  if (typeof window === 'undefined') {
    return {
      humanViews: 1,
      agentViews: 1,
      lastAgent: 'Aguardando telemetria',
      lastSeen: 'Em tempo real',
      recentEvents: [],
      isLoading: true,
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        humanViews: typeof parsed.humanViews === 'number' ? parsed.humanViews : 1,
        agentViews: typeof parsed.agentViews === 'number' ? parsed.agentViews : 1,
        lastAgent: parsed.lastAgent || 'Aguardando telemetria',
        lastSeen: parsed.lastSeen || 'Em tempo real',
        recentEvents: Array.isArray(parsed.recentEvents) ? parsed.recentEvents : [],
        isLoading: false,
      };
    }
  } catch {
    // Fallback
  }

  return {
    humanViews: 1,
    agentViews: 1,
    lastAgent: 'Aguardando telemetria',
    lastSeen: 'Em tempo real',
    recentEvents: [],
    isLoading: true,
  };
}

class TelemetryStore {
  private data: TelemetryData;
  private listeners: Set<(data: TelemetryData) => void> = new Set();
  private hasRecordedInitialView = false;

  constructor() {
    this.data = loadInitialData();
  }

  public getData(): TelemetryData {
    return this.data;
  }

  public subscribe(listener: (data: TelemetryData) => void): () => void {
    this.listeners.add(listener);
    listener(this.data);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch {
      // ignore
    }
    this.listeners.forEach((fn) => fn(this.data));
  }

  /**
   * Consulta os números reais da API global remota
   */
  private async fetchRemoteCount(key: string, isHit: boolean): Promise<number | null> {
    try {
      const action = isHit ? 'hit' : 'get';
      const res = await fetch(`${API_BASE}/${action}/${key}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) return null;
      const json = await res.json();
      if (typeof json.value === 'number') {
        return json.value;
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Sincroniza a contagem com o servidor global de telemetria
   */
  public async syncWithRemote() {
    try {
      const [remoteHumans, remoteAgents] = await Promise.all([
        this.fetchRemoteCount(KEY_HUMANS, false),
        this.fetchRemoteCount(KEY_AGENTS, false),
      ]);

      let changed = false;
      const next = { ...this.data, isLoading: false };

      if (remoteHumans !== null && remoteHumans > 0) {
        next.humanViews = remoteHumans;
        changed = true;
      }

      if (remoteAgents !== null && remoteAgents > 0) {
        next.agentViews = remoteAgents;
        changed = true;
      }

      if (changed) {
        this.data = next;
        this.notify();
      }
    } catch (e) {
      console.warn('Falha na sincronização remota de telemetria:', e);
    }
  }

  /**
   * Registra a primeira visita real da sessão
   */
  public async recordInitialVisit() {
    if (this.hasRecordedInitialView || typeof window === 'undefined') return;
    this.hasRecordedInitialView = true;

    const isSessionAlreadyRecorded = sessionStorage.getItem(SESSION_KEY) === 'true';
    const detection = detectVisitorType();
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (!isSessionAlreadyRecorded) {
      sessionStorage.setItem(SESSION_KEY, 'true');

      if (detection.type === 'agent') {
        const newRemoteVal = await this.fetchRemoteCount(KEY_AGENTS, true);
        const newEvent: TelemetryEvent = {
          id: `a-${Date.now()}`,
          type: 'agent',
          label: `${detection.name} Ingest`,
          timestamp: nowTimeStr,
          detail: 'Ingestão automatizada de contexto',
        };

        this.data = {
          ...this.data,
          agentViews: newRemoteVal ?? this.data.agentViews + 1,
          lastAgent: detection.name,
          lastSeen: 'Agora há pouco',
          recentEvents: [newEvent, ...this.data.recentEvents.slice(0, 9)],
          isLoading: false,
        };
        this.notify();
        // Sincroniza o contador humano também
        this.syncWithRemote();
      } else {
        const newRemoteVal = await this.fetchRemoteCount(KEY_HUMANS, true);
        const newEvent: TelemetryEvent = {
          id: `h-${Date.now()}`,
          type: 'human',
          label: 'Sessão Humana Interativa',
          timestamp: nowTimeStr,
          detail: 'Navegação interativa no portfólio',
        };

        this.data = {
          ...this.data,
          humanViews: newRemoteVal ?? this.data.humanViews + 1,
          lastSeen: 'Agora há pouco',
          recentEvents: [newEvent, ...this.data.recentEvents.slice(0, 9)],
          isLoading: false,
        };
        this.notify();
        // Sincroniza o contador de agentes também
        this.syncWithRemote();
      }
    } else {
      // Se a sessão já foi contada, apenas puxa os números globais atualizados
      this.syncWithRemote();
    }
  }

  public async recordHumanView() {
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newRemoteVal = await this.fetchRemoteCount(KEY_HUMANS, true);

    const newEvent: TelemetryEvent = {
      id: `h-${Date.now()}`,
      type: 'human',
      label: 'Sessão Humana Interativa',
      timestamp: nowTimeStr,
      detail: 'Interação direta no portfólio',
    };

    this.data = {
      ...this.data,
      humanViews: newRemoteVal ?? this.data.humanViews + 1,
      lastSeen: 'Agora',
      recentEvents: [newEvent, ...this.data.recentEvents.slice(0, 9)],
    };
    this.notify();
  }

  public async recordAgentAction(
    action: 'view_page' | 'open_modal' | 'copy_llmstxt' | 'download_llmstxt',
    customAgentName?: string
  ) {
    const agentNames = [
      'Claude-3.5-Sonnet',
      'GPT-4o Deep Research',
      'Perplexity Pro Engine',
      'Cursor AI Composer',
      'Gemini 2.0 Flash Agent',
      'Recruiting LLM Agent',
    ];
    const pickedAgent =
      customAgentName ||
      agentNames[Math.floor(Math.random() * agentNames.length)];

    let detail = 'Acesso ao dossiê llms.txt';
    if (action === 'open_modal') detail = 'Abertura do dossiê de agentes';
    if (action === 'copy_llmstxt') detail = 'Cópia de llms.txt para prompt de sistema';
    if (action === 'download_llmstxt') detail = 'Download de llms.txt para ingestão';

    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newRemoteVal = await this.fetchRemoteCount(KEY_AGENTS, true);

    const newEvent: TelemetryEvent = {
      id: `a-${Date.now()}`,
      type: 'agent',
      label: `${pickedAgent}`,
      timestamp: nowTimeStr,
      detail,
    };

    this.data = {
      ...this.data,
      agentViews: newRemoteVal ?? this.data.agentViews + 1,
      lastAgent: `${pickedAgent} (${detail})`,
      lastSeen: 'Agora',
      recentEvents: [newEvent, ...this.data.recentEvents.slice(0, 9)],
    };
    this.notify();
  }
}

export const visitorTelemetry = new TelemetryStore();
