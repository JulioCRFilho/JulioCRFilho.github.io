export interface ProjectData {
  id: string;
  title: string;
  badge: string;
  category: 'ml_ai' | 'developer_tooling' | 'mobile_graphics';
  specs?: string;
  summary: string;
  details: string[];
  techStack: string[];
  githubUrl: string;
  packageUrl?: string;
  interactiveType?: 'transformer_sim' | 'mermaid_demo' | 'graphics_demo' | 'git_telemetry';
  metrics?: { label: string; value: string }[];
}

export interface ExperienceData {
  company: string;
  role: string;
  period: string;
  location: string;
  type: string;
  highlights: string[];
  technologies: string[];
}

export interface SkillCategory {
  title: string;
  skills: { name: string; level?: string; highlight?: boolean }[];
}

export const PORTFOLIO_INFO = {
  name: 'Julio Cesar da Costa Reis Filho',
  handle: 'juliocrfilho',
  title: 'Senior Systems Architect & LLM Engineer',
  location: 'Curitiba, Paraná, Brazil (Open to Remote & Relocation)',
  email: 'reisfilho1116@gmail.com',
  phone: '+55 41 9 9626 8203',
  github: 'https://github.com/juliocrfilho',
  linkedin: 'https://linkedin.com/in/juliocrfilho',
  languages: [
    { name: 'English', level: 'Proficient C2 (EF SET 75/100)' },
    { name: 'Portuguese', level: 'Native' },
    { name: 'Spanish', level: 'Intermediate' },
  ],
  bio: 'Systems Architect and Machine Learning Engineer with 8+ years of engineering experience spanning custom Causal Transformers (CIR-Engine 503M) trained from scratch, distributed DDP clusters, autonomous tool-use orchestration, and high-concurrency microservices in Go, Next.js, and Flutter.',
};

export const PROJECTS: ProjectData[] = [
  {
    id: 'cir-engine',
    title: 'CIR-Engine & Cir-Jev',
    badge: 'Core ML Architecture',
    category: 'ml_ai',
    specs: '503M Parameters · 16 Layers · 1536 Dim · 12 Heads (4 KV Heads)',
    summary: 'Proprietary 503M-parameter causal autoregressive Transformer designed, trained, and benchmarked from scratch in PyTorch without pre-baked high-level wrappers.',
    details: [
      'Implemented modern attention and normalization techniques including Rotary Position Embeddings (RoPE), RMSNorm, and Scaled Dot-Product Attention (SDPA/FlashAttention).',
      'Architected distributed training pipeline via torchrun & PyTorch DistributedDataParallel (DDP) across NVIDIA Tesla T4 and L4 clusters with mixed-precision (FP16/AMP).',
      'Achieved throughput of ~6,200 tokens/s and cut epoch runtime by 66% (from 180 min to 61 min).',
      'Formulated strict canonical communication grammar ([OP:QUERY], [OP:SOLVE], [OP:RESULT] [VAL: ...]) with 98–100% format compliance and zero anthropomorphic drift.',
      'Autonomous runtime tool-use interceptor: generates structured subroutine calls ([OP:CALC]) triggering deterministic Python execution loop returning verified outputs in O(1) with 100% calculation accuracy.',
      'SFT Prompt Loss Masking (labels = -100) preventing overfitting on reasoning templates.',
      'Headless MLOps linking VS Code, Git, and Kaggle API to autonomously dispatch training jobs and evaluate local inference via Apple Silicon Metal Performance Shaders (MPS) at ~0.19s latency.'
    ],
    techStack: ['PyTorch', 'DistributedDataParallel (DDP)', 'CUDA', 'RoPE', 'FlashAttention', 'Kaggle API', 'Apple Metal (MPS)'],
    githubUrl: 'https://github.com/juliocrfilho/cir-engine',
    interactiveType: 'transformer_sim',
    metrics: [
      { label: 'Parameters', value: '503M' },
      { label: 'DDP Throughput', value: '~6,200 t/s' },
      { label: 'Epoch Time Cut', value: '-66%' },
      { label: 'Tool Accuracy', value: '100% O(1)' },
    ],
  },
  {
    id: 'mddd-cli',
    title: 'mddd-cli (Mermaid Diagram-Driven Dev)',
    badge: 'Developer Tooling & NPM Package',
    category: 'developer_tooling',
    specs: 'Architecture-as-Code · NPM Published Tool',
    summary: 'CLI tool and framework that converts Mermaid sequence, class, and flowchart diagrams directly into concrete software architectures, directory trees, and API contracts.',
    details: [
      'Bridges the gap between architectural whiteboard diagrams and production-grade code scaffolding.',
      'Automates generation of Clean Architecture domain entities, use-cases, and HTTP/gRPC interface definitions.',
      'Published on npm for global developer consumption; eliminates architectural drift across multi-repo teams.'
    ],
    techStack: ['TypeScript', 'Node.js', 'Mermaid.js', 'AST Parsing', 'CLI', 'Clean Architecture'],
    githubUrl: 'https://github.com/juliocrfilho/mddd-cli',
    packageUrl: 'https://www.npmjs.com/package/mddd-cli',
    interactiveType: 'mermaid_demo',
    metrics: [
      { label: 'Distribution', value: 'NPM Global' },
      { label: 'Workflow', value: 'Diagram-to-Code' },
      { label: 'Pattern', value: 'Clean Architecture' },
    ],
  },
  {
    id: 'mad-cli',
    title: 'MAD-cli (Mermaid Auto-Doccing)',
    badge: 'Living Documentation & Architecture CLI',
    category: 'developer_tooling',
    specs: 'Code-to-Mermaid Living Docs · MAD Tags Parser',
    summary: 'CLI and automation tool that parses special MAD comment tags (<!-- MAD:... -->, @mad) across codebases and transforms them into living, auto-updating Mermaid architecture diagrams directly within repository Markdown documentation.',
    details: [
      'Engineered to eliminate documentation rot by extracting living Mermaid sequence, class, and architecture flowcharts directly from AST and comment tags in Go, Dart, TypeScript, and Python.',
      'Scans and synchronizes <!-- MAD:SEQUENCE -->, <!-- MAD:FLOWCHART -->, and <!-- MAD:ARCHITECTURE --> blocks on every commit or CI pipeline run.',
      'Forms a continuous bidirectional architecture loop with mddd-cli: mddd-cli compiles diagrams to code, while MAD-cli extracts living code reality back into verifiable diagrams.',
      'Published open-source developer tooling for clean architectural visibility across distributed teams.'
    ],
    techStack: ['Go', 'TypeScript', 'AST Parsing', 'Mermaid.js', 'Living Documentation', 'Git Hooks', 'CLI'],
    githubUrl: 'https://github.com/juliocrfilho/mad-cli',
    metrics: [
      { label: 'Syntax Engine', value: 'MAD Tags' },
      { label: 'Sync Loop', value: 'Code-to-Diagram' },
    ],
  },
  {
    id: 'system_one',
    title: 'system_one',
    badge: 'Fast-Path Heuristic Engine & Dual-Process AI',
    category: 'ml_ai',
    specs: 'Sub-10ms Inference · Dual-Process Cognitive Layer · Fast-Path Routing',
    summary: 'Fast-path heuristic inference kernel and reactive cognitive layer (System 1) designed as the low-latency companion to the 503M CIR-Engine. Dispatches intuitive, sub-10ms classifications before triggering deliberate causal reasoning.',
    details: [
      'Implements dual-process cognitive architecture (System 1 fast heuristic dispatch vs System 2 slow causal deliberation).',
      'Sub-10ms local evaluation loop leveraging INT8/FP8 weight quantization, optimized vector embeddings, and zero-allocation memory buffers.',
      'Dynamically routes queries: handles high-probability heuristic paths instantly, while dispatching high-complexity reasoning graphs to the 503M CIR-Engine.',
      'Integrates with CIR-Engine KV-cache and canonical grammar loops for seamless token handoff.'
    ],
    techStack: ['Python', 'PyTorch', 'Quantization (INT8/FP8)', 'Vector Embeddings', 'Apple MPS / CUDA', 'Inference Optimization'],
    githubUrl: 'https://github.com/juliocrfilho/system_one',
    metrics: [
      { label: 'Latency', value: '<10ms Local' },
      { label: 'Architecture', value: 'System 1 Fast-Path' },
    ],
  },
  {
    id: 'flutter-scene-fork',
    title: 'flutter_scene (High-Performance 3D Fork)',
    badge: 'Graphics & Low-Latency Rendering',
    category: 'mobile_graphics',
    specs: '3D Scene Graph · Custom Shader Pipeline',
    summary: 'Custom fork and performance optimization of Flutter 3D graphics engine, focusing on low-latency framebuffers, custom Metal/Vulkan shaders, and spatial interaction.',
    details: [
      'Engineered custom shader pipelines and memory buffer optimizations for real-time 3D asset rendering.',
      'Demonstrates deep fluency in low-level rendering (C++, shaders) seamlessly unified with high-level mobile applications (Dart/Flutter).'
    ],
    techStack: ['Dart', 'C++', 'Flutter Scene', 'Metal/Vulkan', 'GLSL/MSL Shaders'],
    githubUrl: 'https://github.com/juliocrfilho/flutter_scene',
    interactiveType: 'graphics_demo',
    metrics: [
      { label: 'Target', value: '60-120 FPS' },
      { label: 'Substrate', value: 'Metal / Vulkan' },
    ],
  },
  {
    id: 'gittrack',
    title: 'GitTrack',
    badge: 'Observability & Dev Velocity',
    category: 'developer_tooling',
    specs: 'Granular Git Telemetry · Commit Stream Analytics',
    summary: 'Granular developer activity observability and Git telemetry tool tracking engineering velocity, architectural iteration cycles, and commit quality metrics.',
    details: [
      'Extracts code churn, dependency graph changes, and developer cognitive load metrics directly from repository logs.',
      'Integrates with headless CI pipelines for team health diagnostics.'
    ],
    techStack: ['Go', 'Git Plumbing APIs', 'CLI', 'SQLite', 'Analytics'],
    githubUrl: 'https://github.com/juliocrfilho/gittrack',
    interactiveType: 'git_telemetry',
    metrics: [
      { label: 'Telemetry', value: 'Raw Git Plumbing' },
      { label: 'Engine', value: 'Golang Core' },
    ],
  },
];

export const EXPERIENCES: ExperienceData[] = [
  {
    company: 'Asapp Desenvolvimento',
    role: 'Principal Architect & Founder',
    period: '2026 – Present',
    location: 'Curitiba & Pontal do Paraná, Brazil',
    type: 'Full-time / Leadership',
    highlights: [
      'Spearhead software architecture and technology strategy, delivering microservices, cloud-native platforms, and high-performance cross-platform applications using Go, Next.js, and Flutter.',
      'Architected Appfy, a modular micro-apps platform and marketplace leveraging distributed services on Google Cloud Platform (GCP).',
      'Created and maintain open-source developer tooling, including mddd-cli (Mermaid Diagram Driven Development CLI) on npm.',
      'Integrate multi-agent AI development workflows (Cursor, Cline, Roo Code, LiteLLM) to accelerate code generation, automated review, and testing pipelines.'
    ],
    technologies: ['Go (Golang)', 'Next.js', 'Flutter', 'Google Cloud Platform (GCP)', 'mddd-cli', 'Multi-Agent LLMs'],
  },
  {
    company: 'Opah IT',
    role: 'Senior Software Engineer / Mobile Specialist',
    period: '2026 – Present',
    location: 'Remote',
    type: 'Consulting',
    highlights: [
      'Consult and engineer mission-critical, high-performance Flutter/Android solutions for enterprise clients.',
      'Enforce robust architecture design patterns, code quality standards, and CI/CD best practices across distributed engineering teams.',
      'Grant security of 3rd-party libraries for mobile applications with Dex-guard, Obfuscation, and Encryption.'
    ],
    technologies: ['Flutter', 'Android', 'Clean Architecture', 'CI/CD', 'Dex-guard', 'Security Hardening'],
  },
  {
    company: 'Arlequim Technologies',
    role: 'Flutter Specialist & Multiplatform Lead',
    period: '07/2025 – Present',
    location: 'Curitiba, Brazil',
    type: 'Full-time',
    highlights: [
      'Technical leadership in the development of multiplatform solutions, integrating high-performance Flutter front-ends.',
      'Implementation of Technical SEO and AEO (Answer Engine Optimization) strategies to optimize content discoverability by search engines and AI-based answer engines.',
      'Migration of state management and dependency injection systems, resulting in increased stability and reduced technical debt.',
      'Configuration of CI/CD pipelines focusing on automated testing (Golden Image) to ensure visual integrity at scale.'
    ],
    technologies: ['Flutter', 'Technical SEO', 'AEO', 'Golden Image Tests', 'CI/CD Pipelines', 'GCP'],
  },
  {
    company: 'Asapp Desenvolvimento (Consulting Era)',
    role: 'Founder / Lead Developer',
    period: '10/2023 – 03/2024',
    location: 'Curitiba, Brazil',
    type: 'Leadership',
    highlights: [
      'Founded and led a consultancy focused on high-complexity Desktop, Mobile, and Web applications.',
      'Developed web applications with a focus on hybrid rendering, ensuring maximum performance and superior indexing for corporate clients.',
      'Led the refactoring of MVP to V2 for strategic projects, resulting in an App Store rating increase from 4.2 to 4.87.'
    ],
    technologies: ['Next.js', 'Flutter', 'Hybrid Rendering', 'SSR/ISR', 'Core Web Vitals'],
  },
  {
    company: 'Grupo Data',
    role: 'Flutter Architect & Technical Lead',
    period: '11/2021 – 10/2022',
    location: 'Curitiba, Brazil',
    type: 'Contract',
    highlights: [
      'Responsible for the maintenance and evolution of the "Tim Beta" mobile application, serving over 1 million active users.',
      'Orchestrated the complete refactoring of the mobile application to align with the critical enterprise backend migration from .NET to Java.'
    ],
    technologies: ['Flutter', '1M+ Active Users', 'Java', '.NET Migration', 'Clean Architecture'],
  },
  {
    company: 'Grupo GFT',
    role: 'Mobile Developer & Tech Lead',
    period: '07/2020 – 11/2021',
    location: 'Curitiba, Brazil',
    type: 'Full-time',
    highlights: [
      'Development of critical features for tier-1 financial institutions (Banco Original and Banco Votorantim) using Java, Kotlin, and Flutter.',
      'Pioneered the implementation of custom native keyboard SDKs with IPC communication for secure Flutter financial applications.'
    ],
    technologies: ['Flutter', 'Kotlin', 'Java', 'Banking FinTech', 'IPC Native Keyboards'],
  },
  {
    company: 'DevMaker Mobile Apps',
    role: 'Mobile Developer',
    period: '04/2019 – 07/2020',
    location: 'Curitiba, Brazil',
    type: 'Full-time',
    highlights: [
      'Android (Java/Kotlin), iOS (Swift), and React Native engineering.',
      'Acted as the company’s first React Native developer, leading new client projects and training internal engineering teams.'
    ],
    technologies: ['React Native', 'Swift', 'Kotlin', 'iOS', 'Android'],
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Machine Learning & AI',
    skills: [
      { name: 'Causal LLMs & Transformers', level: 'Core Architect', highlight: true },
      { name: 'PyTorch & torchrun (DDP)', level: 'Cluster Scale', highlight: true },
      { name: 'CUDA & Apple Metal (MPS)', level: 'Acceleration', highlight: true },
      { name: 'Rotary Position Embeddings (RoPE)', level: 'Positional Logic', highlight: true },
      { name: 'RMSNorm & SDPA / FlashAttention', level: 'Kernel Opt', highlight: true },
      { name: 'DistributedDataParallel (DDP)', level: 'Multi-GPU Cluster', highlight: true },
      { name: 'Grouped-Query Attention (GQA)', level: 'Memory Efficient', highlight: true },
      { name: 'Byte-Level BPE Tokenization', level: 'Custom Tokenizer', highlight: true },
      { name: 'SFT Prompt Loss Masking', level: 'Fine-Tuning', highlight: true },
      { name: 'Autonomous Tool-Use Interception', level: 'Agentic Tooling', highlight: true },
      { name: 'Kaggle API Automation', level: 'MLOps Pipelines', highlight: true },
    ],
  },
  {
    title: 'Software Architecture & Systems',
    skills: [
      { name: 'Distributed Microservices', level: 'Enterprise Go', highlight: true },
      { name: 'Clean Architecture & SOLID', level: 'Domain Driven', highlight: true },
      { name: 'Multi-Agent AI Pipelines', level: 'Agentic Workflows', highlight: true },
      { name: 'Mermaid Diagram-Driven Dev (mddd)', level: 'Author & Maintainer', highlight: true },
      { name: 'Micro-apps Architecture', level: 'Modular Scale', highlight: true },
      { name: 'CI/CD & Golden Image Testing', level: 'Automated QA', highlight: true },
      { name: 'Technical SEO & AEO (Answer Engine)', level: 'AI Search Opt', highlight: true },
    ],
  },
  {
    title: 'Languages & Core Tech',
    skills: [
      { name: 'Python (PyTorch / Data Science)', level: 'Senior ML', highlight: true },
      { name: 'Go (Golang)', level: 'Principal Services', highlight: true },
      { name: 'Dart / Flutter (Mobile, Desktop, Web)', level: 'Lead / 8+ Years', highlight: true },
      { name: 'TypeScript / JavaScript', level: 'Full-Stack Modern', highlight: true },
      { name: 'Next.js (App Router, SSR, ISR)', level: 'Web Architect', highlight: true },
      { name: 'Java & Kotlin', level: 'Android & Enterprise', highlight: true },
      { name: 'Swift (iOS Native)', level: 'iOS Native', highlight: true },
      { name: 'SQL & PostgreSQL', level: 'Relational Scale', highlight: true },
      { name: 'Firestore / Redis / MongoDB', level: 'Distributed Caching', highlight: true },
      { name: 'C++ & Metal/Vulkan Shaders', level: 'Low-Level Graphics', highlight: true },
    ],
  },
  {
    title: 'Education & Honors',
    skills: [
      { name: 'B.Sc. in Data Science', level: 'Higher Education', highlight: true },
      { name: 'Postgraduate: Machine Learning & Deep Learning', level: 'Specialization', highlight: true },
      { name: 'EF SET English Certificate C2 Proficient (75/100)', level: 'CEFR C2 Native Equiv', highlight: true },
      { name: 'Go Programming: The Complete Bootcamp', level: 'Certified', highlight: true },
      { name: 'Next.js Specialist (SSR, ISR, Core Web Vitals)', level: 'Certified Specialist', highlight: true },
    ],
  },
];
