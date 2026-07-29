import React from 'react';
import { Sparkles, Home, Cpu, Layers, Activity } from 'lucide-react';
import { EngineId } from '../types';

interface NavbarProps {
  activeEngineId: EngineId | null;
  onGoHome: () => void;
  onOpenAnalyzer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeEngineId,
  onGoHome,
  onOpenAnalyzer,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#090912]/90 backdrop-blur-md border-b border-zinc-800/80 shrink-0 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo / Brand */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-3 text-right group focus:outline-none"
        >
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            Σ
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-extrabold font-['Readex_Pro'] text-white tracking-tight italic uppercase flex items-center gap-1.5">
              <span>VisionCore</span>
              <span className="text-indigo-400 font-normal">Analytica</span>
            </h1>
            <p className="text-[10px] font-mono text-zinc-400 tracking-wider uppercase">
              AI Prompt Studio Pro // v4.2
            </p>
          </div>
        </button>

        {/* Center Badge / Direct Action */}
        <div className="hidden md:flex items-center gap-2.5 bg-zinc-900/90 px-3.5 py-1.5 rounded-full border border-zinc-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[11px] font-mono font-semibold text-zinc-300 tracking-wide uppercase">
            Neural Engine Latency: 42ms // Vision active
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {activeEngineId !== 'poster-analyzer' && (
            <button
              onClick={onOpenAnalyzer}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold tracking-wider uppercase shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>قسم تحليل البوستر</span>
            </button>
          )}

          {activeEngineId && (
            <button
              onClick={onGoHome}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-indigo-400" />
              <span>الرئيسية</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

