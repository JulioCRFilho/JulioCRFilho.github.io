import React, { useState } from 'react';
import {
  Send,
  Copy,
  Check,
  Terminal,
  Sparkles,
  MessageSquare,
  ArrowRight,
  Mail,
  Zap,
} from 'lucide-react';

interface ContactPromptConsoleProps {
  lang?: 'en' | 'pt';
  onOpenTerminal?: () => void;
}

export const ContactPromptConsole: React.FC<ContactPromptConsoleProps> = ({
  lang = 'en',
  onOpenTerminal,
}) => {
  const [promptText, setPromptText] = useState('');
  const [senderInfo, setSenderInfo] = useState('');
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const presets = [
    {
      label: lang === 'pt' ? '💼 Liderança Técnica / Contratação' : '💼 Tech Leadership / Hiring',
      text:
        lang === 'pt'
          ? 'Olá Julio, acompanhei seus projetos (CIR-Engine 503M, mddd-cli) e gostaria de conversar sobre uma oportunidade de Liderança Técnica / Engenharia de LLMs em nossa equipe.'
          : 'Hello Julio, I reviewed your projects (CIR-Engine 503M, mddd-cli) and would like to discuss a Technical Leadership / LLM Systems opportunity with our team.',
    },
    {
      label: lang === 'pt' ? '🤖 Engenharia de LLMs & Clusters' : '🤖 LLM Engineering & Clusters',
      text:
        lang === 'pt'
          ? 'Olá Julio, temos um desafio envolvendo pipelines de LLMs causais, otimização de FlashAttention/RoPE e treinamento distribuído (DDP). Gostaria de agendar uma reunião técnica.'
          : 'Hi Julio, we have an engineering challenge around causal LLM inference, FlashAttention/RoPE optimization, and distributed DDP pipelines. Would love to schedule a technical chat.',
    },
    {
      label: lang === 'pt' ? '⚡ Microsserviços & Arquitetura Go' : '⚡ Go Distributed Microservices',
      text:
        lang === 'pt'
          ? 'Olá Julio, gostaríamos de consultar sua experiência em arquitetura de microsserviços em Go corporativo, Clean Architecture e esteiras de alta resiliência.'
          : 'Hi Julio, we are looking for your expertise in enterprise Go microservices, Clean Architecture, and high-throughput resilient backends.',
    },
  ];

  const handleSelectPreset = (text: string) => {
    setPromptText(text);
    setStatusMessage(null);
  };

  const generateMailtoPayload = () => {
    const recipient = 'reisfilho1116@gmail.com';
    // Defense against CRLF injection in email subject headers
    const cleanSender = senderInfo.replace(/[\r\n\t\0]/g, ' ').trim().slice(0, 100);
    const cleanPrompt = promptText.trim().slice(0, 2000);

    const subjectStr =
      lang === 'pt'
        ? `[TRANSMISSÃO_PORTFÓLIO] Contato de ${cleanSender || 'Visitante'}`
        : `[PORTFOLIO_TRANSMISSION] Inquiry from ${cleanSender || 'Visitor'}`;

    const bodyContent = `${cleanPrompt}\n\n---\n${
      lang === 'pt' ? 'Remetente' : 'Sender'
    }: ${cleanSender || (lang === 'pt' ? 'Não informado' : 'Not specified')}\n${
      lang === 'pt' ? 'Origem' : 'Origin'
    }: The Latent Architect Portfolio Terminal\nTimestamp: ${new Date().toISOString()}`;

    const subject = encodeURIComponent(subjectStr);
    const body = encodeURIComponent(bodyContent);
    const mailto = `mailto:${recipient}?subject=${subject}&body=${body}`;

    return { mailto, bodyContent };
  };

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;

    const { mailto, bodyContent } = generateMailtoPayload();

    // Defense: If URL exceeds safe mailto length for certain OS/clients, copy payload to clipboard as fallback
    if (mailto.length > 1900) {
      navigator.clipboard.writeText(bodyContent);
      setStatusMessage(
        lang === 'pt'
          ? '✓ Mensagem longa copiada para a área de transferência. Abrindo e-mail...'
          : '✓ Long message copied to clipboard. Opening email...'
      );
    } else {
      setStatusMessage(
        lang === 'pt'
          ? '✓ Transmissão gerada. Abrindo seu cliente de e-mail...'
          : '✓ Transmission generated. Opening your email client...'
      );
    }

    window.location.href = mailto;
  };

  const handleCopyPrompt = () => {
    if (!promptText.trim()) return;

    const cleanSender = senderInfo.replace(/[\r\n\t\0]/g, ' ').trim().slice(0, 100);
    const cleanPrompt = promptText.trim().slice(0, 2000);

    const fullPayload = `${cleanPrompt}\n\n[${lang === 'pt' ? 'Remetente' : 'Sender'}: ${
      cleanSender || (lang === 'pt' ? 'Não especificado' : 'Not specified')
    }]`;

    navigator.clipboard.writeText(fullPayload);
    setCopied(true);
    setStatusMessage(
      lang === 'pt' ? '✓ Prompt copiado para a área de transferência!' : '✓ Prompt copied to clipboard!'
    );

    setTimeout(() => {
      setCopied(false);
      setTimeout(() => setStatusMessage(null), 3000);
    }, 2000);
  };

  return (
    <div className="w-full mt-6 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 sm:p-7 shadow-2xl relative font-mono space-y-5">
      {/* Console Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#adff2f] animate-pulse" />
          <span className="text-xs uppercase font-bold text-white tracking-wider flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-[#adff2f]" />
            <span>{lang === 'pt' ? 'PROMPT_DE_CONTATO_DIRETO' : 'DIRECT_CONTACT_PROMPT'}</span>
          </span>
          <span className="text-[10px] text-zinc-500 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700/50">
            STDIN :: UTF-8
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-zinc-400">
          <span className="text-[#38bdf8]">dest:</span>
          <span className="text-zinc-200">reisfilho1116@gmail.com</span>
        </div>
      </div>

      {/* Prompt Templates / Fast Presets */}
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-wider text-zinc-500 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#adff2f]" />
          <span>{lang === 'pt' ? 'Templates Rápidos de Prompt:' : 'Quick Prompt Presets:'}</span>
        </span>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(p.text)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-950/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer text-left"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleDispatch} className="space-y-4">
        {/* Main Prompt Textarea */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-zinc-400">
            <label htmlFor="contact-prompt-input" className="text-zinc-400">
              {lang === 'pt'
                ? '> Insira sua mensagem ou proposta:'
                : '> Enter your message or prompt:'}
            </label>
            <span className="text-zinc-500">{promptText.length} chars</span>
          </div>

          <div className="relative">
            <textarea
              id="contact-prompt-input"
              rows={4}
              maxLength={2000}
              value={promptText}
              onChange={(e) => {
                setPromptText(e.target.value);
                if (statusMessage) setStatusMessage(null);
              }}
              placeholder={
                lang === 'pt'
                  ? 'Ex: Olá Julio, gostaríamos de conversar sobre nossa infraestrutura de LLMs e arquitetura em Go...'
                  : 'E.g., Hi Julio, we would love to discuss our causal LLM infrastructure and Go distributed architecture...'
              }
              className="w-full p-3.5 bg-zinc-950 border border-zinc-800 focus:border-[#adff2f]/70 rounded-xl text-xs sm:text-sm text-zinc-100 placeholder-zinc-600 focus:outline-hidden transition-all resize-y font-mono leading-relaxed"
            />
          </div>
        </div>

        {/* Sender Contact or Company (Optional) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label htmlFor="contact-sender-info" className="text-[10px] uppercase text-zinc-500 tracking-wider">
              {lang === 'pt' ? 'Seu E-mail ou Empresa (Opcional):' : 'Your Email or Company (Optional):'}
            </label>
            <input
              id="contact-sender-info"
              type="text"
              maxLength={100}
              value={senderInfo}
              onChange={(e) => setSenderInfo(e.target.value)}
              placeholder={lang === 'pt' ? 'ex: contato@empresa.com / Nome' : 'e.g. contact@company.com / Name'}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-[#38bdf8]/70 rounded-xl text-xs text-zinc-200 placeholder-zinc-600 focus:outline-hidden transition-all"
            />
          </div>

          {/* Action Buttons Group */}
          <div className="flex items-end gap-2">
            <button
              type="submit"
              disabled={!promptText.trim()}
              className="flex-1 px-4 py-2 bg-[#adff2f] hover:bg-lime-300 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-lime-400/10"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{lang === 'pt' ? 'Disparar Mensagem' : 'Dispatch Message'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyPrompt}
              disabled={!promptText.trim()}
              className="px-3 py-2 bg-zinc-950 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              title={lang === 'pt' ? 'Copiar Prompt' : 'Copy Prompt'}
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-[#adff2f]" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">{copied ? (lang === 'pt' ? 'Copiado!' : 'Copied!') : (lang === 'pt' ? 'Copiar' : 'Copy')}</span>
            </button>

            {onOpenTerminal && (
              <button
                type="button"
                onClick={onOpenTerminal}
                className="px-3 py-2 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                title={lang === 'pt' ? 'Abrir no Terminal' : 'Open in Terminal'}
              >
                <Terminal className="w-3.5 h-3.5 text-[#38bdf8]" />
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Real-time Status / Feedback */}
      {statusMessage && (
        <div className="p-2.5 rounded-xl bg-lime-950/40 border border-lime-800/50 text-[11px] text-[#adff2f] flex items-center gap-2 animate-in fade-in duration-150">
          <Zap className="w-3.5 h-3.5 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}
    </div>
  );
};
