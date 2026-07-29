import React, { useState, useEffect } from 'react';
import {
  BookmarkCheck,
  Search,
  Trash2,
  Copy,
  Check,
  Download,
  ArrowLeft,
  Calendar,
  Sparkles,
  UserCheck,
  Tag,
  Share2,
  FolderOpen
} from 'lucide-react';
import { SavedAnalysis } from '../types';

interface PromptVaultProps {
  onGoHome: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  onOpenAnalyzerWithSaved?: (saved: SavedAnalysis) => void;
}

export const PromptVault: React.FC<PromptVaultProps> = ({
  onGoHome,
  showToast,
  onOpenAnalyzerWithSaved,
}) => {
  const [savedItems, setSavedItems] = useState<SavedAnalysis[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadSavedItems();
  }, []);

  const loadSavedItems = () => {
    try {
      const data = localStorage.getItem('saved_poster_analyses');
      if (data) {
        setSavedItems(JSON.parse(data));
      }
    } catch (e) {
      console.error('Failed to load saved analyses:', e);
    }
  };

  const handleDelete = (id: string) => {
    try {
      const updated = savedItems.filter((item) => item.id !== id);
      localStorage.setItem('saved_poster_analyses', JSON.stringify(updated));
      setSavedItems(updated);
      showToast('تم حذف التحليل من الحافظة', 'info');
    } catch (e) {
      showToast('فشل في حذف عنصر الحافظة', 'error');
    }
  };

  const handleClearAll = () => {
    if (window.confirm('هل أنت تأكد من رغبتك في مسح كافة العناصر المحفوظة في الأرشيف؟')) {
      localStorage.removeItem('saved_poster_analyses');
      setSavedItems([]);
      showToast('تم مسح الأرشيف بالكامل', 'info');
    }
  };

  const handleCopyPrompt = (id: string, text: string) => {
    // Extract Section 7 (the generated prompt) if present, or copy full text
    const promptMatch = text.match(/7\.\s*🚀[\s\S]*$/i) || text.match(/\/imagine prompt[\s\S]*/i);
    const contentToCopy = promptMatch ? promptMatch[0] : text;

    navigator.clipboard.writeText(contentToCopy);
    setCopiedId(id);
    showToast('⚡ تم نسخ البرومبت بنجاح إلى الحافظة!', 'success');

    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  };

  const handleExportMarkdown = (item: SavedAnalysis) => {
    const mdContent = `# ${item.title}\nDate: ${new Date(item.timestamp).toLocaleString('ar-EG')}\nEngine: ${item.renderEngine} | Aspect Ratio: ${item.aspectRatio}\n\n${item.analysisText}`;
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `poster-analysis-${item.id.slice(0, 6)}.md`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('📄 تم تحميل ملف التقرير بصيغة Markdown', 'success');
  };

  const filteredItems = savedItems.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      (item.playerName && item.playerName.toLowerCase().includes(q)) ||
      (item.eventType && item.eventType.toLowerCase().includes(q)) ||
      item.analysisText.toLowerCase().includes(q)
    );
  });

  return (
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0a0a18] border border-zinc-800 p-6 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <BookmarkCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded uppercase">
                PROMPT ARCHIVE
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                {savedItems.length} عناصر محفوظة
              </span>
            </div>
            <h1 className="text-2xl font-black text-white font-['Readex_Pro'] mt-1">
              أرشيف وحافظة البرومبتات والتحليلات
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {savedItems.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-950/40 hover:bg-rose-900 border border-rose-800/60 text-rose-300 text-xs font-bold transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>مسح الأرشيف</span>
            </button>
          )}

          <button
            onClick={onGoHome}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-400" />
            <span>الرئيسية</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {savedItems.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في التحليلات المحفوظة باسم اللاعب، نوع الحدث، أو كلمات البحث..."
            className="w-full bg-[#070714] border border-zinc-800 rounded-xl pr-10 pl-4 py-3 text-xs text-zinc-200 placeholder-zinc-500 focus:border-rose-500 focus:outline-none transition-colors"
          />
        </div>
      )}

      {/* Grid of Saved Items */}
      {filteredItems.length === 0 ? (
        <div className="bg-[#090916] border border-zinc-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
            <FolderOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-zinc-300 font-['Readex_Pro']">
            لا توجد تحليلات محفوظة في الأرشيف
          </h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            قم بإجراء تحليل لأي بوستر من قسم التحليل المباشر وانقر على زر "حفظ في الأرشيف" لتتمكن من الرجوع إليه وإدارته في أي وقت.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#090916] border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 space-y-4 flex flex-col justify-between shadow-sm transition-all"
            >
              <div className="space-y-3">
                {/* Card Header & Images */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {item.posterImage && (
                      <div className="w-14 h-16 rounded-lg overflow-hidden border border-zinc-700 shrink-0 bg-black">
                        <img
                          src={item.posterImage}
                          alt="Poster"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {item.playerImage && (
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-indigo-500 shrink-0 bg-black">
                        <img
                          src={item.playerImage}
                          alt="Player"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-bold text-white font-['Readex_Pro'] line-clamp-1">
                        {item.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-rose-400" />
                          {new Date(item.timestamp).toLocaleDateString('ar-EG')}
                        </span>
                        {item.eventType && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/60 flex items-center gap-1">
                            <Tag className="w-2.5 h-2.5" />
                            {item.eventType}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg bg-zinc-900 hover:bg-rose-950 border border-zinc-800 text-zinc-400 hover:text-rose-400 transition-colors"
                    title="حذف من الأرشيف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Analysis Excerpt */}
                <div className="bg-[#050510] border border-zinc-800/80 rounded-xl p-3 text-xs text-zinc-300 font-mono leading-relaxed max-h-40 overflow-y-auto custom-scrollbar">
                  <p className="whitespace-pre-wrap">{item.analysisText}</p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">
                  AR: {item.aspectRatio} // {item.renderEngine}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExportMarkdown(item)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-bold transition-colors"
                    title="تصدير كتقرير Markdown"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>تصدير</span>
                  </button>

                  <button
                    onClick={() => handleCopyPrompt(item.id, item.analysisText)}
                    className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition-all"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>تم النسخ!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ البرومبت</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
