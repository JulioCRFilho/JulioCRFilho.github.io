import React, { useState, useMemo } from 'react';
import { EXPERIENCES, SKILL_CATEGORIES } from '../data/portfolio-data';
import {
  Briefcase,
  GraduationCap,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  Code2,
  Search,
  Sparkles,
  Award,
} from 'lucide-react';

interface ExperienceTimelineProps {
  lang?: 'en' | 'pt';
}

export const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({ lang = 'en' }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [skillSearch, setSkillSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const categoryIcons: Record<string, React.ReactNode> = {
    'Machine Learning & AI': <Cpu className="w-4 h-4 text-[#adff2f]" />,
    'Software Architecture & Systems': <Layers className="w-4 h-4 text-[#38bdf8]" />,
    'Languages & Core Tech': <Code2 className="w-4 h-4 text-[#c4b5fd]" />,
    'Education & Honors': <Award className="w-4 h-4 text-[#fb923c]" />,
  };

  // Filter skills based on search query and category
  const filteredCategories = useMemo(() => {
    return SKILL_CATEGORIES.map((cat) => {
      const isCatSelected = selectedCategory === 'all' || selectedCategory === cat.title;
      if (!isCatSelected) return null;

      const matchingSkills = cat.skills.filter((skill) => {
        if (!skillSearch.trim()) return true;
        const q = skillSearch.toLowerCase();
        return (
          skill.name.toLowerCase().includes(q) ||
          (skill.level && skill.level.toLowerCase().includes(q))
        );
      });

      return {
        ...cat,
        skills: matchingSkills,
      };
    }).filter(Boolean) as typeof SKILL_CATEGORIES;
  }, [skillSearch, selectedCategory]);

  const totalSkillCount = useMemo(() => {
    return SKILL_CATEGORIES.reduce((acc, cat) => acc + cat.skills.length, 0);
  }, []);

  return (
    <div className="space-y-12">
      {/* Experience Timeline */}
      <div className="space-y-4">
        {EXPERIENCES.map((exp, idx) => {
          const isExpanded = expandedIndex === idx;

          return (
            <div
              key={idx}
              className="p-6 bg-zinc-950/70 border border-zinc-800 hover:border-zinc-700 rounded-2xl transition-all duration-200"
            >
              <div
                onClick={() => toggleExpand(idx)}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer select-none"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h4 className="text-lg font-bold text-white hover:text-[#adff2f] transition-colors">
                      {exp.company}
                    </h4>
                    <span className="text-xs font-mono text-[#38bdf8] bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded">
                      {exp.role}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-zinc-400 mt-1 flex items-center gap-2">
                    <span>{exp.period}</span>
                    <span>·</span>
                    <span>{exp.location}</span>
                    <span>·</span>
                    <span className="text-zinc-400">{exp.type}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className="text-xs font-mono text-zinc-500 hidden sm:inline">
                    {isExpanded ? (lang === 'pt' ? 'Ocultar' : 'Collapse') : (lang === 'pt' ? 'Detalhes' : 'Expand')}
                  </span>
                  <div className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Highlights & Tech Stack */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-zinc-850 space-y-4 animate-in fade-in duration-200">
                  <ul className="space-y-2">
                    {exp.highlights.map((item, hIdx) => (
                      <li key={hIdx} className="text-xs text-zinc-300 flex items-start gap-2.5 leading-relaxed">
                        <span className="text-[#adff2f] font-mono mt-0.5">▹</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {exp.technologies.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Skills Matrix & Competencies */}
      <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-6 lg:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-850">
          <div>
            <h4 className="text-xl font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#adff2f]" />
              <span>{lang === 'pt' ? 'Competências Técnicas & Formação' : 'Core Competencies & Academic Formation'}</span>
              <span className="text-xs font-mono font-normal text-[#adff2f] bg-[#adff2f]/10 border border-[#adff2f]/30 px-2 py-0.5 rounded-full">
                {totalSkillCount} {lang === 'pt' ? 'Especialidades' : 'Specialties'}
              </span>
            </h4>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              {lang === 'pt'
                ? 'Todas as competências destacadas com níveis de proficiência em produção, LLMs e arquitetura.'
                : 'All engineering competencies highlighted with production, LLM, and architecture proficiency tiers.'}
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={skillSearch}
              onChange={(e) => setSkillSearch(e.target.value)}
              placeholder={lang === 'pt' ? 'Filtrar (ex: PyTorch, Go, CUDA)...' : 'Filter (e.g. PyTorch, Go, CUDA)...'}
              className="w-full pl-9 pr-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-[#adff2f]/60 transition-colors"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#adff2f] text-black font-bold'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            {lang === 'pt' ? 'Todas' : 'All'} ({totalSkillCount})
          </button>
          {SKILL_CATEGORIES.map((cat) => (
            <button
              key={cat.title}
              onClick={() => setSelectedCategory(cat.title)}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === cat.title
                  ? 'bg-zinc-800 text-white border border-zinc-700 font-semibold'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800/80'
              }`}
            >
              <span>{categoryIcons[cat.title]}</span>
              <span>{cat.title}</span>
              <span className="text-[10px] opacity-60">({cat.skills.length})</span>
            </button>
          ))}
        </div>

        {/* Grid of Competencies */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {filteredCategories.map((cat, cIdx) => (
            <div key={cIdx} className="space-y-3">
              <div className="flex items-center justify-between pb-1.5 border-b border-zinc-850">
                <h5 className="text-xs font-mono uppercase text-zinc-300 font-bold tracking-wider flex items-center gap-1.5">
                  {categoryIcons[cat.title]}
                  <span>{cat.title}</span>
                </h5>
                <span className="text-[10px] font-mono text-zinc-500">{cat.skills.length}</span>
              </div>

              <ul className="space-y-1.5">
                {cat.skills.map((skill, sIdx) => (
                  <li
                    key={sIdx}
                    className="text-xs font-mono flex items-center justify-between p-2 rounded-xl bg-zinc-900/70 border border-zinc-850 hover:border-zinc-700/90 text-zinc-100 transition-all hover:bg-zinc-900/95 group shadow-2xs"
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#adff2f] shrink-0 shadow-xs shadow-lime-400/50" />
                      <span className="font-medium text-zinc-200 group-hover:text-white transition-colors truncate">
                        {skill.name}
                      </span>
                    </div>

                    {skill.level && (
                      <span className="text-[10px] font-mono text-[#38bdf8] bg-sky-950/40 border border-sky-800/40 px-1.5 py-0.5 rounded shrink-0 tabular-nums">
                        {skill.level}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
