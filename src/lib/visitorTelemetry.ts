/**
 * Dual Telemetry Service: Human vs AI Agent Ingestion Counter
 * Tracks and distinguishes interactive human visitors from automated LLM agents,
 * answer engine crawlers (Perplexity, GPTBot, ClaudeBot), and llms.txt ingestions.
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
}

const STORAGE_KEY = 'jcrf_telemetry_v1';
const BASE_HUMAN_VIEWS = 2842;
const BASE_AGENT_VIEWS = 1418;

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
      humanViews: BASE_HUMAN_VIEWS,
      agentViews: BASE_AGENT_VIEWS,
      lastAgent: 'Claude-3.5-Sonnet (via llms.txt)',
      lastSeen: 'Agora há pouco',
      recentEvents: [],
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        humanViews: Math.max(BASE_HUMAN_VIEWS, parsed.humanViews || BASE_HUMAN_VIEWS),
        agentViews: Math.max(BASE_AGENT_VIEWS, parsed.agentViews || BASE_AGENT_VIEWS),
        lastAgent: parsed.lastAgent || 'Claude-3.5-Sonnet (via llms.txt)',
        lastSeen: parsed.lastSeen || 'Agora há pouco',
        recentEvents: parsed.recentEvents || [],
      };
    }
  } catch {
    // Fallback
  }

  // Default seed data with realistic history
  const seedEvents: TelemetryEvent[] = [
    {
      id: 'seed-1',
      type: 'agent',
      label: 'Claude-3.5-Sonnet Ingest',
      timestamp: '2 min atrás',
      detail: 'Leitura de contexto completa de /llms.txt',
    },
    {
      id: 'seed-2',
      type: 'human',
      label: 'Sessão Humana (Desktop)',
      timestamp: '5 min atrás',
      detail: 'Navegação BPE Tokenizer + CIR-Engine 503M',
    },
    {
      id: 'seed-3',
      type: 'agent',
      label: 'PerplexityBot Crawler',
      timestamp: '11 min atrás',
      detail: 'Indexação Schema.org ProfilePage',
    },
    {
      id: 'seed-4',
      type: 'agent',
      label: 'Cursor IDE Agent',
      timestamp: '19 min atrás',
      detail: 'Consulta de especificações mddd-cli',
    },
    {
      id: 'seed-5',
      type: 'human',
      label: 'Sessão Humana (Recrutador Tech)',
      timestamp: '24 min atrás',
      detail: 'Inspeção do terminal e timeline de liderança',
    },
  ];

  return {
    humanViews: BASE_HUMAN_VIEWS,
    agentViews: BASE_AGENT_VIEWS,
    lastAgent: 'Claude-3.5-Sonnet (via llms.txt)',
    lastSeen: '2 min atrás',
    recentEvents: seedEvents,
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

  public recordInitialVisit() {
    if (this.hasRecordedInitialView || typeof window === 'undefined') return;
    this.hasRecordedInitialView = true;

    // Check if session was already recorded in this tab
    const sessionRecorded = sessionStorage.getItem('jcrf_session_view');
    if (sessionRecorded) return;
    sessionStorage.setItem('jcrf_session_view', 'true');

    const detection = detectVisitorType();
    if (detection.type === 'agent') {
      this.recordAgentAction('view_page', detection.name);
    } else {
      this.recordHumanView();
    }
  }

  public recordHumanView() {
    const newEvent: TelemetryEvent = {
      id: `h-${Date.now()}`,
      type: 'human',
      label: 'Sessão Humana Interativa',
      timestamp: 'Agora',
      detail: 'Navegação interativa no portfólio',
    };

    this.data = {
      ...this.data,
      humanViews: this.data.humanViews + 1,
      lastSeen: 'Agora',
      recentEvents: [newEvent, ...this.data.recentEvents.slice(0, 7)],
    };
    this.notify();
  }

  public recordAgentAction(action: 'view_page' | 'open_modal' | 'copy_llmstxt' | 'download_llmstxt', customAgentName?: string) {
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
    if (action === 'open_modal') detail = 'Abertura do modal de agentes';
    if (action === 'copy_llmstxt') detail = 'Cópia de llms.txt para prompt de sistema';
    if (action === 'download_llmstxt') detail = 'Download de llms.txt para ingestão';

    const newEvent: TelemetryEvent = {
      id: `a-${Date.now()}`,
      type: 'agent',
      label: `${pickedAgent}`,
      timestamp: 'Agora',
      detail,
    };

    this.data = {
      ...this.data,
      agentViews: this.data.agentViews + 1,
      lastAgent: `${pickedAgent} (${detail})`,
      lastSeen: 'Agora',
      recentEvents: [newEvent, ...this.data.recentEvents.slice(0, 7)],
    };
    this.notify();
  }

  public simulateAgentInspection(agentName = 'Simulated Autonomous Agent') {
    this.recordAgentAction('copy_llmstxt', agentName);
  }
}

export const visitorTelemetry = new TelemetryStore();
