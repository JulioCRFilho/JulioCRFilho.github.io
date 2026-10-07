# Estratégia Completa de Distribuição & Descoberta — Julio Cesar Reis Filho 🚀

Este guia contém todos os materiais prontos para publicação para transformar seu portfólio em um ímã de tráfego qualificado de **recrutadores técnicos, engenheiros de IA e agentes autônomos**.

---

## 1. Show HN (Hacker News) — Alto Potencial de Viralização (2k–10k visitas)

> **Onde postar**: [news.ycombinator.com/submit](https://news.ycombinator.com/submit)  
> **Melhor horário**: Terça ou Quarta-feira, entre 10h00 e 13h00 (Horário de Brasília / 9am ET).  
> **Tipo**: "Show HN"

### Título:
```text
Show HN: Interactive Byte-Level Tokenizer, 503M Transformer & Browser Neural HUD
```

### URL:
```text
https://juliocrfilho.github.io
```

### Texto / Primeiro Comentário (em Inglês):
```markdown
Hi HN! I'm Julio, a Systems Architect and LLM Engineer.

Over the past months, I trained a 503M-parameter causal autoregressive Transformer (CIR-Engine) from scratch in pure PyTorch (no Hugging Face high-level wrappers) across distributed Tesla T4/L4 clusters via PyTorch DDP (~6,200 tokens/sec throughput).

Instead of a static portfolio, I built an interactive technical dossier in React 19 + Three.js featuring:
1. **Byte-Level Tokenizer Sandbox**: Interactive UTF-8 byte decomposition with color-coded token IDs and sub-word merge steps.
2. **Live Neural HUD (ONNX WebAssembly SIMD)**: Real-time policy evaluation loops running reinforcement learning agents (LunarLander, MountainCar, Acrobot) entirely client-side.
3. **Model Context Protocol (MCP) Server**: You can connect my engineering portfolio directly into Claude Desktop or Cursor via `npx -y juliocrfilho-portfolio-mcp` to inspect model specs or run automated job-fit matching.
4. **Machine-Readable Dossier (`llms.txt`)**: Standardized context endpoint at `/llms.txt` designed for zero-drift LLM ingestion.

Would love any architectural feedback on the causal graph verification layer and the browser ONNX inference loops!

Live Demo: https://juliocrfilho.github.io
GitHub: https://github.com/JulioCRFilho
```

---

## 2. Reddit (`r/LocalLLaMA` & `r/MachineLearning`)

> **Onde postar**: [reddit.com/r/LocalLLaMA](https://reddit.com/r/LocalLLaMA)  
> **Flair**: `Project` ou `Discussion`

### Título:
```text
Trained a 503M Causal Transformer from scratch in PyTorch (RoPE, GQA, DDP) — Built an interactive browser sandbox & MCP server
```

### Conteúdo do Post:
```markdown
Hey everyone!

I wanted to share my findings training **CIR-Engine (503M parameters)** completely from scratch in PyTorch, without pre-baked wrappers.

### Key Architecture & Benchmarks:
- **Architecture**: 16 decoder layers, 1536 hidden dimension, 12 attention heads (4 Key/Value heads via Grouped-Query Attention for a 4:1 compression ratio).
- **Positioning**: Rotary Position Embeddings (RoPE) with base frequency $\Theta = 10,000$.
- **Distributed Training**: `torchrun` with PyTorch DistributedDataParallel (DDP) across mixed NVIDIA Tesla T4 and L4 clusters (FP16/AMP). Reached ~6,200 tokens/s throughput and cut epoch runtime from 180 min to 61 min.
- **Inference Companion**: Coupled with a sub-10ms fast-path heuristic engine (`system_one`) for dual-process cognitive routing.

### Live Demos & Tooling:
- **Interactive Web Sandbox**: https://juliocrfilho.github.io (features byte-level tokenizer playground + client-side ONNX Runtime Web evaluation).
- **Model Context Protocol (MCP)**: If you use Claude Desktop or Cursor, you can query the entire architectural dossier with `npx -y juliocrfilho-portfolio-mcp`.
- **llms.txt endpoint**: https://juliocrfilho.github.io/llms.txt

Happy to discuss training stability, SFT prompt loss masking (labels = -100), and KV-cache radix optimizations in the comments!
```

---

## 3. LinkedIn (Publicação de Alto Impacto para Recrutadores & CTOs)

### Versão em Português:
```text
Lançamento: Portfólio Interativo de Engenharia de LLMs & Servidor MCP Oficial ⚡

Nas últimas semanas, unifiquei minha experiência de 8+ anos em arquitetura de sistemas distribuídos e modelos generativos em um projeto interativo:

🌐 https://juliocrfilho.github.io

Diferente de um currículo estático, construí uma plataforma que demonstra na prática o funcionamento de IA de baixo nível:

🔬 CIR-Engine 503M: Transformer causal de 503M parâmetros treinado do zero em PyTorch com RoPE, Grouped-Query Attention (GQA) e clusters distribuídos DDP (~6.200 tokens/s).
🧩 Tokenizer Sandbox: Playground interativo de decomposição byte-level em tempo real no navegador.
🎮 Neural HUD (ONNX Wasm SIMD): Avaliação ao vivo de agentes de RL (LunarLander, MountainCar) rodando 100% no client-side.
🤖 Servidor MCP Integrável: Se você utiliza Claude Desktop ou Cursor, pode conectar meu portfólio como ferramenta de contexto via:
👉 npx -y juliocrfilho-portfolio-mcp

Aberto para posições de Staff/Principal Systems Architect, Senior LLM Engineer e liderança técnica de IA.

Link direto: https://juliocrfilho.github.io
llms.txt para agentes de IA: https://juliocrfilho.github.io/llms.txt

#ArtificialIntelligence #LLM #MachineLearning #PyTorch #ModelContextProtocol #SystemsArchitecture #SoftwareEngineering
```

---

## 4. Como Registrar seu Servidor MCP no Smithery.ai & Glama.ai

### No Smithery.ai:
1. Acesse [smithery.ai](https://smithery.ai).
2. Clique em **"Add Server"** (Login com GitHub).
3. Selecione o repositório `JulioCRFilho/JulioCRFilho.github.io` (o arquivo `mcp-server/smithery.yaml` já está pronto na raiz da pasta `mcp-server`).
4. Seu servidor passará a ser indexado na maior biblioteca de MCPs do mundo!

### No Glama.ai:
1. Acesse [glama.ai/mcp/servers](https://glama.ai/mcp/servers).
2. Clique em **"Submit Server"** e aponte para o repositório.
