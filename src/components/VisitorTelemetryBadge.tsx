import React, { useState, useEffect } from 'react';
import { Users, Bot, Activity, Sparkles, ChevronRight, X, ShieldCheck, ArrowUpRight, Cpu } from 'lucide-react';
import { visitorTelemetry, TelemetryData } from '../lib/visitorTelemetry';

interface VisitorTelemetryBadgeProps {
  lang?: 'en' | 'pt';
  onOpenAgentModal?: () => void;
  variant?: 'compact' | 'full';
  className?: string;
}

export const VisitorTelemetryBadge: React.FC<VisitorTelemetryBadgeProps> = ({
  lang = 'en',
  onOpenAgentModal,
  variant = 'compact',
  className = '',
}) => {
  const [data, setData] = useState<TelemetryData>(visitorTelemetry.getData());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [justSimulated, setJustSimulated] = useState(false);

  useEffect(() => {
    // Record initial visit once on mount
    visitorTelemetry.recordInitialVisit();

    const unsubscribe = visitorTelemetry.subscribe((newData) => {
      setData(newData);
    });
    return () => unsubscribe();
  }, []);

  const totalViews = data.humanViews + data.agentViews;
  const humanPct = Math.round((data.humanViews / (totalViews || 1)) * 100);
  const agentPct = 100 - humanPct;

  const handleSimulateAgent = () => {
    const simulatedAgents = [
      'Gemini-2.0-Flash Evaluator',
      'Claude-3.5-Sonnet Agent',
      'GPT-4o Deep Research Bot',
      'Perplexity Enterprise Crawler',
      'Cursor IDE Context Indexer',
    ];
    const picked = simulatedAgents[Math.floor(Math.random() * simulatedAgents.length)];
    visitorTelemetry.simulateAgentInspection(picked);
    setJustSimulated(true);
    setTimeout(() => setJustSimulated(false), 2000);
  };

  return (
    <>
      {/* Clickable Badge */}
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        aria-haspopup="dialog"
        aria-label={
          lang === 'pt'
            ? `Contador de visualizações: ${data.humanViews} humanos, ${data.agentViews} agentes de IA. Clique para ver detalhes de telemetria.`
            : `View counter: ${data.humanViews} humans, ${data.agentViews} AI agents. Click to view telemetry details.`
        }
        className={`group inline-flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800 hover:border-[#adff2f]/60 text-xs font-mono transition-all cursor-pointer shadow-lg backdrop-blur-md focus:ring-2 focus:ring-[#adff2f] focus:outline-hidden ${className}`}
        title={
          lang === 'pt'
            ? 'Telemetria em tempo real de visualizações por Humanos vs Agentes de IA'
            : 'Real-time telemetry of Human vs AI Agent views'
        }
      >
        {/* Pulsing Live Dot */}
        <span className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-semibold border-r border-zinc-850 pr-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#adff2f] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#adff2f]" />
          </span>
          <span className="hidden sm:inline text-zinc-500 uppercase tracking-wider text-[9px]">LIVE</span>
        </span>

        {/* Human Count */}
        <span className="flex items-center gap-1 text-zinc-300 group-hover:text-white transition-colors">
          <Users className="w-3.5 h-3.5 text-[#38bdf8]" />
          <strong className="font-bold text-white tabular-nums">{data.humanViews.toLocaleString()}</strong>
          <span className="text-zinc-500 text-[10px]">{lang === 'pt' ? 'Humanos' : 'Humans'}</span>
        </span>

        <span className="text-zinc-700">|</span>

        {/* Agent Count */}
        <span className="flex items-center gap-1 text-zinc-300 group-hover:text-white transition-colors">
          <Bot className="w-3.5 h-3.5 text-[#adff2f]" />
          <strong className="font-bold text-[#adff2f] tabular-nums">{data.agentViews.toLocaleString()}</strong>
          <span className="text-zinc-500 text-[10px]">{lang === 'pt' ? 'Agentes' : 'Agents'}</span>
        </span>

        <ChevronRight className="w-3 h-3 text-zinc-600 group-hover:text-[#adff2f] transition-transform group-hover:translate-x-0.5 ml-0.5" />
      </button>

      {/* Telemetry Breakdown Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="telemetry-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="w-full max-w-xl bg-[#07080a] border border-zinc-800 rounded-2xl shadow-2xl p-5 sm:p-6 font-mono text-zinc-200 space-y-5 animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-zinc-850 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#adff2f]">
                  <Activity className="w-5 h-5 text-[#adff2f]" />
                </div>
                <div>
                  <h3 id="telemetry-modal-title" className="text-base font-bold text-white flex items-center gap-2">
                    <span>{lang === 'pt' ? 'Telemetria de Tráfego: Humanos vs Agentes' : 'Traffic Telemetry: Humans vs AI Agents'}</span>
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {lang === 'pt'
                      ? 'Distinção em tempo real entre leituras por humanos e ingestões por agentes de IA.'
                      : 'Real-time distinction between interactive human visits and automated AI agent ingestions.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                aria-label={lang === 'pt' ? 'Fechar' : 'Close'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Total Stat Cards */}
            <div className="grid grid-cols-2 gap-3">
              {/* Human Views Card */}
              <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-800/40 space-y-1">
                <div className="flex items-center justify-between text-xs text-sky-400">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Users className="w-4 h-4" />
                    <span>{lang === 'pt' ? 'Humanos' : 'Humans'}</span>
                  </span>
                  <span className="text-[10px] bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-800/60 font-bold">
                    {humanPct}%
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white tabular-nums">
                  {data.humanViews.toLocaleString()}
                </div>
                <p className="text-[10px] text-zinc-400 leading-tight">
                  {lang === 'pt'
                    ? 'Navegadores interativos, sessões de desenvolvedores e recrutadores tech.'
                    : 'Interactive browsers, tech recruiters, and engineer portfolio visitors.'}
                </p>
              </div>

              {/* Agent Views Card */}
              <div className="p-4 rounded-xl bg-lime-950/20 border border-lime-800/40 space-y-1">
                <div className="flex items-center justify-between text-xs text-[#adff2f]">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Bot className="w-4 h-4" />
                    <span>{lang === 'pt' ? 'Agentes de IA' : 'AI Agents'}</span>
                  </span>
                  <span className="text-[10px] bg-lime-950/60 px-1.5 py-0.5 rounded border border-lime-800/60 font-bold">
                    {agentPct}%
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#adff2f] tabular-nums">
                  {data.agentViews.toLocaleString()}
                </div>
                <p className="text-[10px] text-zinc-400 leading-tight">
                  {lang === 'pt'
                    ? 'Leituras de /llms.txt, crawlers AEO (Perplexity/GPTBot) e agentes de avaliação.'
                    : 'Ingestions of /llms.txt, AEO crawlers (Perplexity, GPTBot) and evaluation agents.'}
                </p>
              </div>
            </div>

            {/* Visual Ratio Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span className="flex items-center gap-1 text-[#38bdf8]">
                  <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
                  <span>{lang === 'pt' ? `Humanos (${humanPct}%)` : `Humans (${humanPct}%)`}</span>
                </span>
                <span className="text-zinc-500 font-bold">
                  {totalViews.toLocaleString()} {lang === 'pt' ? 'sessões registradas' : 'total sessions'}
                </span>
                <span className="flex items-center gap-1 text-[#adff2f]">
                  <span className="w-2 h-2 rounded-full bg-[#adff2f]" />
                  <span>{lang === 'pt' ? `Agentes (${agentPct}%)` : `Agents (${agentPct}%)`}</span>
                </span>
              </div>

              <div className="w-full h-3 rounded-full bg-zinc-900 border border-zinc-800 overflow-hidden flex">
                <div style={{ width: `${humanPct}%` }} className="h-full bg-sky-500 transition-all duration-500" />
                <div style={{ width: `${agentPct}%` }} className="h-full bg-[#adff2f] transition-all duration-500" />
              </div>
            </div>

            {/* How Detection Works */}
            <div className="p-3 bg-zinc-950/60 border border-zinc-850 rounded-xl text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-zinc-300 font-bold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#adff2f]" />
                <span>{lang === 'pt' ? 'Como a detecção é feita?' : 'How is detection performed?'}</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                {lang === 'pt'
                  ? 'Agentes são identificados por assinaturas de User-Agent (GPTBot, ClaudeBot, PerplexityBot, Cursor), drivers de automação headless, requisições diretas a /llms.txt e ações do botão de agentes. Humanos são identificados por navegação interativa no DOM.'
                  : 'Agents are identified via User-Agent signatures (GPTBot, ClaudeBot, PerplexityBot, Cursor), headless automation drivers, direct /llms.txt requests, and Agent View interactions. Humans are identified via interactive DOM navigation.'}
              </p>
            </div>

            {/* Recent Activity Log */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-bold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#adff2f]" />
                  <span>{lang === 'pt' ? 'Atividade Recente' : 'Recent Ingestion Log'}</span>
                </span>
                <span className="text-[10px] text-zinc-500">
                  {lang === 'pt' ? 'Tempo Real' : 'Real-time'}
                </span>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {data.recentEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/60 border border-zinc-850 text-[11px]"
                  >
                    <div className="flex items-center gap-2 truncate">
                      {evt.type === 'agent' ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#adff2f]" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
                      )}
                      <span className="font-bold text-zinc-200 truncate">{evt.label}</span>
                      <span className="text-zinc-500 text-[10px] truncate hidden sm:inline">
                        · {evt.detail}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-500 tabular-nums shrink-0 ml-2">
                      {evt.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-zinc-850">
              <button
                type="button"
                onClick={handleSimulateAgent}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#adff2f]/10 hover:bg-[#adff2f]/20 border border-[#adff2f]/40 text-xs font-bold text-[#adff2f] transition-all cursor-pointer"
                title={lang === 'pt' ? 'Simula a chegada de um agente de IA e incrementa o contador' : 'Simulate an incoming AI agent request and increment counter'}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {justSimulated
                    ? (lang === 'pt' ? '✓ Agente Registrado (+1)!' : '✓ Agent Recorded (+1)!')
                    : (lang === 'pt' ? 'Simular Ingestão por Agente (+1)' : 'Simulate Agent Ingest (+1)')}
                </span>
              </button>

              {onOpenAgentModal && (
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    onOpenAgentModal();
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs text-white transition-colors cursor-pointer"
                >
                  <Bot className="w-3.5 h-3.5 text-[#adff2f]" />
                  <span>{lang === 'pt' ? 'Abrir Dossiê llms.txt' : 'Open llms.txt Dossier'}</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-500" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
