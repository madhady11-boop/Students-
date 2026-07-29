import React, { useState } from 'react';
import { Copy, Check, Terminal, Sparkles } from 'lucide-react';

interface TerminalOutputProps {
  promptText: string;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({ promptText, showToast }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!promptText) return;
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    showToast('تم نسخ البرومبت إلى الحافظة بنجاح!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!promptText) return null;

  return (
    <div className="bg-[#05050f] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl animate-fade-in space-y-0">
      {/* Header */}
      <div className="bg-zinc-900 px-5 py-3 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
            AI_GENERATION_PAYLOAD // MASTER_PROMPT
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-indigo-600 border border-zinc-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          <span>{copied ? 'تم النسخ' : 'نسخ البرومبت'}</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-6 font-mono text-xs sm:text-sm text-emerald-400 bg-black/90 leading-relaxed dir-ltr text-left overflow-x-auto whitespace-pre-wrap select-all">
        {promptText}
      </div>
    </div>
  );
};
