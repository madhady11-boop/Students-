import React from 'react';
import {
  Sparkles,
  Trophy,
  Flame,
  Flag,
  GraduationCap,
  UserCheck,
  Store,
  ArrowLeft,
  ScanLine,
  Zap,
  ShieldCheck,
  Shield,
  Palette,
  BookmarkCheck
} from 'lucide-react';
import { EngineConfig, EngineId } from '../types';

interface HubViewProps {
  engines: EngineConfig[];
  onSelectEngine: (id: EngineId) => void;
}

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'Sparkles':
      return Sparkles;
    case 'Trophy':
      return Trophy;
    case 'Flame':
      return Flame;
    case 'Flag':
      return Flag;
    case 'GraduationCap':
      return GraduationCap;
    case 'UserCheck':
      return UserCheck;
    case 'Store':
      return Store;
    case 'Shield':
      return Shield;
    case 'Palette':
      return Palette;
    case 'BookmarkCheck':
      return BookmarkCheck;
    default:
      return ScanLine;
  }
};

export const HubView: React.FC<HubViewProps> = ({ engines, onSelectEngine }) => {
  const posterAnalyzer = engines.find((e) => e.id === 'poster-analyzer');
  const otherEngines = engines.filter((e) => e.id !== 'poster-analyzer');

  return (
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-10 animate-fade-in">
      {/* Top Banner Status Bar */}
      <div className="bg-[#0c0c16] border border-zinc-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
            SYSTEM STATUS: ONLINE // SUB-PIXEL NEURAL ENGINE v4.2
          </span>
        </div>
        <div className="flex items-center gap-6 text-[11px] font-mono font-semibold text-zinc-400">
          <span className="flex items-center gap-1.5 text-indigo-400">
            <Zap className="w-3.5 h-3.5" /> ACCURACY: 99.4%
          </span>
          <span className="hidden sm:inline-block text-zinc-600">|</span>
          <span className="hidden sm:flex items-center gap-1.5 text-zinc-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> SECURE GEMINI 3.6 PIPELINE
          </span>
        </div>
      </div>

      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block bg-indigo-950/40 border border-indigo-800/40 w-fit mx-auto px-3 py-1 rounded-full">
          Deep Visual Decomposition Protocol
        </label>

        <h1 className="text-3xl sm:text-5xl font-black font-['Readex_Pro'] leading-tight tracking-tight text-white italic uppercase">
          أستوديو <span className="text-indigo-500 font-normal">التصميم والتحليل</span> الذكي
        </h1>

        <p className="text-xs sm:text-base text-zinc-400 leading-relaxed font-normal max-w-2xl mx-auto">
          اختر المحرك المخصص لمشروعك. 7 محركات تحليل وبناء برومبتات فائقة الدقة مدعومة بـ Gemini 3.6 Flash لتفكيك بوسترات الصور واستخراج الحمض النووي البصري (Visual DNA).
        </p>
      </div>

      {/* Featured Engine Card (Direct Poster Image Analyzer) */}
      {posterAnalyzer && (
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition duration-300" />
          
          <div
            onClick={() => onSelectEngine('poster-analyzer')}
            className="relative bg-[#0c0c1a] border border-indigo-500/40 hover:border-indigo-400 rounded-xl p-6 sm:p-8 cursor-pointer transition-all duration-300 hover:translate-y-[-2px] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-right gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-indigo-600/20 border border-indigo-500/50 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/20">
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-400 animate-pulse" />
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-950 border border-indigo-500/40 text-indigo-300 uppercase tracking-widest">
                    FEATURED VISION MODULE
                  </span>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    DIRECT POSTER VISION SCANNER
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black font-['Readex_Pro'] text-white">
                  {posterAnalyzer.title}
                </h2>

                <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
                  {posterAnalyzer.description}
                </p>
              </div>
            </div>

            <button className="shrink-0 flex items-center gap-2 px-6 py-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/30 transition-all group-hover:scale-105">
              <span>بدء تحليل البوستر الآن</span>
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:translate-x-[-4px]" />
            </button>
          </div>
        </div>
      )}

      {/* Grid of 6 Category Engines */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <ScanLine className="w-4 h-4 text-indigo-400" />
            <span>SPECIALIZED ENGINE MODULES:</span>
          </label>
          <span className="text-[11px] font-mono text-zinc-500">6 Specialized Pipelines</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {otherEngines.map((engine) => {
            const IconComponent = getIconComponent(engine.iconName);
            return (
              <div
                key={engine.id}
                onClick={() => onSelectEngine(engine.id)}
                className="group relative bg-[#0a0a16] hover:bg-[#0e0e20] border border-zinc-800 hover:border-indigo-500/50 rounded-xl p-5 cursor-pointer transition-all duration-300 hover:translate-y-[-4px] shadow-sm flex flex-col justify-between"
              >
                {/* Accent line on top */}
                <div
                  className="absolute top-0 right-6 left-6 h-[2px] rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: engine.accentColor }}
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-11 h-11 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{
                        backgroundColor: `${engine.accentColor}18`,
                        border: `1px solid ${engine.accentColor}40`,
                      }}
                    >
                      <IconComponent
                        className="w-5 h-5"
                        style={{ color: engine.accentColor }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      {engine.badge && (
                        <span
                          className="px-2 py-0.5 rounded text-[9px] font-bold text-white uppercase tracking-wider shadow-sm"
                          style={{ backgroundColor: engine.accentColor }}
                        >
                          {engine.badge}
                        </span>
                      )}
                      <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase group-hover:text-zinc-400">
                        {engine.subtitle}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-bold font-['Readex_Pro'] text-zinc-100 group-hover:text-white transition-colors">
                      {engine.title}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed line-clamp-2">
                      {engine.description}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 group-hover:text-indigo-400">
                  <span>ACTIVATE MODULE</span>
                  <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:translate-x-[-4px]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

