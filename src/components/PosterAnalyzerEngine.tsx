import React, { useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  ArrowRight,
  Sliders,
  FileText,
  Layers,
  Wand2,
  Maximize2,
  Activity,
  CheckCircle2,
  SlidersHorizontal,
  User,
  UserCheck,
  UserPlus,
  X,
  Trophy,
  Repeat,
  FileSignature,
  Stethoscope,
  Swords,
  Megaphone,
  Shield,
  Tag,
  BookmarkCheck,
  Download,
  Ratio
} from 'lucide-react';
import { SAMPLE_POSTERS } from '../data/samplePosters';
import { SavedAnalysis } from '../types';

interface PosterAnalyzerEngineProps {
  onGoHome: () => void;
  onSendDnaToEngine?: (dnaText: string, targetEngineId: string) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const PosterAnalyzerEngine: React.FC<PosterAnalyzerEngineProps> = ({
  onGoHome,
  onSendDnaToEngine,
  showToast,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    SAMPLE_POSTERS[0].thumbnail
  );
  const [selectedMimeType, setSelectedMimeType] = useState<string>('image/svg+xml');
  const [playerImage, setPlayerImage] = useState<string | null>(null);
  const [playerMimeType, setPlayerMimeType] = useState<string>('image/jpeg');
  
  // Sports Event Context Details
  const [eventType, setEventType] = useState<string>('انتقال جديد');
  const [playerName, setPlayerName] = useState<string>('');
  const [teamName, setTeamName] = useState<string>('');
  const [eventDetailsText, setEventDetailsText] = useState<string>('');

  // Advanced Render Parameters
  const [aspectRatio, setAspectRatio] = useState<string>('4:5');
  const [renderEngine, setRenderEngine] = useState<string>('Midjourney v6.0');
  const [rawStyle, setRawStyle] = useState<boolean>(true);
  const [stylizeValue, setStylizeValue] = useState<number>(250);

  const [customNotes, setCustomNotes] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [copiedFull, setCopiedFull] = useState<boolean>(false);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [isSavedInVault, setIsSavedInVault] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'samples'>('samples');

  // Handle poster image upload from file input
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setSelectedImage(result);
      setSelectedMimeType(file.type || 'image/jpeg');
      setAnalysisResult(null);
      showToast('تم تحميل صورة البوستر بنجاح!', 'success');
    };
    reader.readAsDataURL(file);
  };

  // Handle target player face image upload
  const handlePlayerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('يرجى اختيار ملف صورة لاعب صالح (JPG, PNG, WebP)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPlayerImage(result);
      setPlayerMimeType(file.type || 'image/jpeg');
      setAnalysisResult(null);
      showToast('👕 تم رفع صورة اللاعب وسسيتم دمج وجهه وملابسه/قميصه بالكامل!', 'success');
    };
    reader.readAsDataURL(file);
  };

  // Handle drag and drop for poster
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setSelectedMimeType(file.type || 'image/jpeg');
        setAnalysisResult(null);
        showToast('تم إفلات الصورة بنجاح!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  // Save to Prompt Vault
  const handleSaveToVault = () => {
    if (!analysisResult) return;
    try {
      const saved: SavedAnalysis = {
        id: 'analysis-' + Date.now(),
        timestamp: Date.now(),
        title: playerName ? `تحليل ${playerName} - ${eventType}` : `تحليل بوستر ${eventType}`,
        posterImage: selectedImage || undefined,
        playerImage: playerImage || undefined,
        eventType,
        playerName,
        teamName,
        analysisText: analysisResult,
        aspectRatio,
        renderEngine,
      };

      const existing = localStorage.getItem('saved_poster_analyses');
      const list: SavedAnalysis[] = existing ? JSON.parse(existing) : [];
      list.unshift(saved);
      localStorage.setItem('saved_poster_analyses', JSON.stringify(list));
      setIsSavedInVault(true);
      showToast('📌 تم حفظ التحليل والبرومبت في أرشيف الحافظة بنجاح!', 'success');
    } catch (e) {
      showToast('فشل حفظ التحليل في الحافظة', 'error');
    }
  };

  const handleDownloadReport = () => {
    if (!analysisResult) return;
    const titleText = playerName ? `poster-analysis-${playerName}` : 'poster-analysis';
    const blob = new Blob([analysisResult], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${titleText}-${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('📄 تم تنزيل التقرير بصيغة Markdown', 'success');
  };

  // Run poster analysis via Gemini Vision API
  const runAnalysis = async () => {
    if (!selectedImage) {
      showToast('يرجى اختيار أو رفع صورة بوستر أولاً', 'error');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setIsSavedInVault(false);

    try {
      const res = await fetch('/api/analyze-poster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType: selectedMimeType,
          playerImageBase64: playerImage,
          playerMimeType: playerMimeType,
          eventDetails: {
            eventType,
            playerName,
            teamName,
            eventDetailsText,
          },
          customInstruction: customNotes ? `${customNotes} | Target Engine: ${renderEngine}, Aspect Ratio: ${aspectRatio}` : `Target Engine: ${renderEngine}, Aspect Ratio: ${aspectRatio}`,
        }),
      });

      const data = await res.json();

      if (data.success && data.analysis) {
        setAnalysisResult(data.analysis);
        showToast(
          playerImage
            ? '⚡ تم تحليل البوستر ودمج وجه اللاعب مع الحفاظ التام على ملامحه!'
            : '🎉 تم تحليل البوستر بنجاح بدقة مجهرية!',
          'success'
        );
      } else {
        throw new Error(data.error || 'فشل في تحليل الصورة');
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'حدث خطأ أثناء الاتصال بالخادم', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Copy helpers
  const handleCopyFull = () => {
    if (!analysisResult) return;
    navigator.clipboard.writeText(analysisResult);
    setCopiedFull(true);
    showToast('تم نسخ التحليل الكامل بنجاح!', 'success');
    setTimeout(() => setCopiedFull(false), 2500);
  };

  const handleCopyPromptOnly = () => {
    if (!analysisResult) return;
    // Extract Midjourney prompt block if exists
    const match = analysisResult.match(/\/imagine prompt:[\s\S]+/i);
    const textToCopy = match ? match[0] : analysisResult;
    navigator.clipboard.writeText(textToCopy);
    setCopiedPrompt(true);
    showToast('تم نسخ برومبت Midjourney فقط!', 'success');
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black font-['Readex_Pro'] text-white italic uppercase">
                قسم تحليل البوستر المباشر الفائق
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-500/40 uppercase">
                GEMINI 3.6 VISION
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              قم برفع صورة البوستر (مثل غرف الملابس الرياضية أو واجهات المحلات) ليقوم الذكاء الاصطناعي بتفكيكها مجهرياً
            </p>
          </div>
        </div>

        <button
          onClick={onGoHome}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-bold uppercase tracking-wider transition-colors"
        >
          <ArrowRight className="w-4 h-4 text-indigo-400" />
          <span>عودة للمحركات</span>
        </button>
      </div>

      {/* Main Workspace Layout (Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Selection & Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Source Tabs */}
          <div className="bg-[#0b0b18] p-1.5 rounded-lg border border-zinc-800 flex items-center gap-2">
            <button
              onClick={() => setActiveTab('samples')}
              className={`flex-1 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                activeTab === 'samples'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>عينات البوسترات الجاهزة</span>
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                activeTab === 'upload'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>رفع صورة من جهازك</span>
            </button>
          </div>

          {/* Sample Posters Drawer */}
          {activeTab === 'samples' && (
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                SAMPLE POSTER PRESETS:
              </label>
              <div className="grid grid-cols-3 gap-3">
                {SAMPLE_POSTERS.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => {
                      setSelectedImage(sample.thumbnail);
                      setSelectedMimeType(sample.mimeType);
                      setAnalysisResult(null);
                    }}
                    className={`group relative rounded-lg overflow-hidden border transition-all text-right p-1.5 bg-[#090914] ${
                      selectedImage === sample.thumbnail
                        ? 'border-indigo-500 shadow-md shadow-indigo-600/20'
                        : 'border-zinc-800 opacity-75 hover:opacity-100 hover:border-zinc-600'
                    }`}
                  >
                    <div className="aspect-[4/5] rounded overflow-hidden bg-black mb-2 relative">
                      <img
                        src={sample.thumbnail}
                        alt={sample.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <p className="text-[11px] font-bold text-zinc-200 line-clamp-1">
                      {sample.title}
                    </p>
                    <span className="text-[10px] text-indigo-400 font-mono block">
                      {sample.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Upload Dropzone */}
          {activeTab === 'upload' && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-indigo-500/40 hover:border-indigo-500 rounded-xl p-6 text-center bg-[#090914] hover:bg-[#0e0e20] transition-colors cursor-pointer group"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                id="poster-upload"
                className="hidden"
              />
              <label htmlFor="poster-upload" className="cursor-pointer space-y-3 block">
                <div className="w-12 h-12 rounded-lg bg-indigo-600/10 border border-indigo-500/30 mx-auto flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                    انقر هنا لاختيار صورة البوستر أو اسحبها إلى هنا
                  </p>
                  <p className="text-[11px] font-mono text-zinc-400 mt-1">
                    PNG, JPG, WEBP (UP TO 25MB)
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Active Image Preview Box */}
          <div className="bg-[#0a0a16] border border-zinc-800 rounded-xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span>SELECTED WORKSPACE POSTER:</span>
              </span>
              {selectedImage && (
                <span className="text-indigo-400 text-[10px] font-mono font-bold bg-indigo-950/60 border border-indigo-800/60 px-2 py-0.5 rounded">
                  REF: POSTER_DESIGN.JPG
                </span>
              )}
            </div>

            <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-black/60 border border-zinc-800 flex items-center justify-center group">
              {selectedImage ? (
                <>
                  <img
                    src={selectedImage}
                    alt="Poster Preview"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex items-end justify-between">
                    <span className="text-xs font-semibold text-white font-mono">
                      IMAGE READY FOR NEURAL SCAN
                    </span>
                    <button
                      onClick={() => {
                        const win = window.open();
                        win?.document.write(`<img src="${selectedImage}" style="max-width:100%"/>`);
                      }}
                      className="p-1.5 rounded bg-white/20 hover:bg-white/40 text-white backdrop-blur-md"
                      title="تكبير الصورة"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center p-6 text-zinc-500 space-y-2">
                  <ImageIcon className="w-10 h-10 mx-auto opacity-40" />
                  <p className="text-xs">لم يتم اختيار أي صورة بعد</p>
                </div>
              )}
            </div>
          </div>

          {/* Target Player Face & Outfit Upload Box (Identity & Outfit Lock) */}
          <div className="bg-[#0b0b1f] border border-indigo-900/60 rounded-xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>صورة اللاعب / الوجه والزي المراد حفظ ملامحه وقميصه (اختياري)</span>
              </label>

              {playerImage && (
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40 uppercase flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-emerald-400" />
                  <span>FACE & OUTFIT LOCKED</span>
                </span>
              )}
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              ارفع صورة اللاعب التي تحتوي على وجهه والزي/القميص الرياضي الذي يرتديه، وسيستخرج الذكاء الاصطناعي ملامح الوجه وتفاصيل القميص بالكامل لتركيبهما بدقة 100% في البوستر المستهدف.
            </p>

            {playerImage ? (
              <div className="flex items-center justify-between bg-[#070716] p-3 rounded-lg border border-indigo-800/60">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-indigo-500 shrink-0 bg-black">
                    <img src={playerImage} alt="Player Face & Kit" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">صورة اللاعب والقميص جاهزة</span>
                    <span className="text-[10px] text-emerald-400 font-mono">سيتم حفظ الوجه + الملابس والقميص 100% في البرومبت</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setPlayerImage(null);
                    showToast('تم إزالة صورة اللاعب والملابس', 'info');
                  }}
                  className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 text-xs transition-colors"
                  title="إزالة صورة اللاعب"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="relative border border-dashed border-indigo-500/40 hover:border-indigo-400 rounded-lg p-3 text-center bg-[#070716] transition-colors cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePlayerUpload}
                  id="player-face-upload"
                  className="hidden"
                />
                <label htmlFor="player-face-upload" className="cursor-pointer flex items-center justify-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-indigo-200 group-hover:text-white transition-colors">
                    + انقر لرفع صورة اللاعب (حفظ الوجه والقميص / Face & Kit Reference)
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Sports Event Details & Context Integration */}
          <div className="bg-[#0a0a1a] border border-zinc-800 rounded-xl p-4 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-400" />
                <span>تفاصيل وسياق الحدث الرياضي (Sports Event Metadata)</span>
              </label>
              <span className="text-[9px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/50">
                DYNAMIC INJECTION
              </span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              اختر نوع الإعلان الرياضي واملأ بيانات اللاعب والنادي ليتم دمجها تلقائياً في التايبوغرافي والشعارات والبرومبت النهائي:
            </p>

            {/* Event Type Quick Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {[
                { label: 'انتقال جديد', icon: Repeat },
                { label: 'تجديد عقد', icon: FileSignature },
                { label: 'إصابة لاعب', icon: Stethoscope },
                { label: 'مباراة قادمة', icon: Swords },
                { label: 'جائزة / إنجاز', icon: Trophy },
                { label: 'إعلان عام', icon: Megaphone },
              ].map((item) => {
                const ItemIcon = item.icon;
                const isSelected = eventType === item.label;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setEventType(item.label)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                        : 'bg-[#050512] text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <ItemIcon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-indigo-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">
                  👤 اسم اللاعب
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="مثال: علي جاسم / Mbappé"
                  className="w-full bg-[#05050f] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">
                  🛡️ اسم النادي / الفريق
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="مثال: نادي الزوراء / Real Madrid"
                  className="w-full bg-[#05050f] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">
                📝 تفاصيل إضافية للحدث (تفاصيل العقد، الإصابة، أو موعد المباراة)
              </label>
              <input
                type="text"
                value={eventDetailsText}
                onChange={(e) => setEventDetailsText(e.target.value)}
                placeholder="مثال: عقد يمتد لـ 3 مواسم حقيقية | أو: إصابة بالرباط الصليبي | أو: ديربي بغداد الساعة 8:00 مساءً"
                className="w-full bg-[#05050f] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Advanced Render Parameters Box */}
          <div className="bg-[#0a0a1a] border border-zinc-800 rounded-xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
                <Ratio className="w-3.5 h-3.5 text-indigo-400" />
                <span>إعدادات وأبعاد توليد البرومبت (Render Engine & Aspect Ratio)</span>
              </label>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                PRO ENGINE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">
                  📐 أبعاد الصورة (--ar)
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['4:5', '9:16', '1:1', '16:9'].map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setAspectRatio(ratio)}
                      className={`py-1.5 rounded text-xs font-mono font-bold transition-all border ${
                        aspectRatio === ratio
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-[#050512] text-zinc-400 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">
                  🤖 محرك الذكاء الاصطناعي
                </label>
                <select
                  value={renderEngine}
                  onChange={(e) => setRenderEngine(e.target.value)}
                  className="w-full bg-[#05050f] border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Midjourney v6.0">Midjourney v6.0</option>
                  <option value="Midjourney v6.1">Midjourney v6.1</option>
                  <option value="Niji 6 (Anime/Graphic)">Niji 6 (Graphic/Anime)</option>
                  <option value="Flux.1 Dev">Flux.1 Dev</option>
                  <option value="Stable Diffusion XL">Stable Diffusion XL</option>
                </select>
              </div>
            </div>
          </div>

          {/* Optional Custom Instructions Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>CUSTOM ANALYSIS INSTRUCTIONS (OPTIONAL):</span>
            </label>
            <textarea
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="مثال: ركزلي على تحليل إضاءة القميص والخزانات وتفاصيل كرة القدم والخشب..."
              className="w-full h-20 bg-[#090914] border border-zinc-800 rounded-lg p-3 text-xs text-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all resize-none"
            />
          </div>

          {/* Big Action Button */}
          <button
            onClick={runAnalysis}
            disabled={isAnalyzing || !selectedImage}
            className={`w-full py-3.5 rounded-lg font-bold text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2.5 transition-all ${
              isAnalyzing || !selectedImage
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 hover:scale-[1.01] active:scale-95'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Wand2 className="w-4 h-4 animate-spin" />
                <span>جاري تحليل البوستر بواسطة Gemini 3.6...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>EXECUTE DEEP VISION ANALYSIS</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: AI Visual DNA Results (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quick Metrics & Color Swatches Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#0a0a16] border border-zinc-800 rounded-xl p-4 shadow-sm space-y-3">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                COMPOSITION METRICS
              </label>
              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-xs mb-1 font-mono">
                    <span className="text-zinc-400">Visual Balance</span>
                    <span className="text-zinc-100 font-bold">98.4%</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="w-[98.4%] h-full bg-emerald-500"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1 font-mono">
                    <span className="text-zinc-400">Legibility Index</span>
                    <span className="text-zinc-100 font-bold">88.5%</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="w-[88.5%] h-full bg-indigo-500"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0a0a16] border border-zinc-800 rounded-xl p-4 shadow-sm space-y-3">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                COLOR PALETTE DETECTION
              </label>
              <div className="flex gap-2">
                <div className="flex-1 aspect-square rounded bg-[#1e1b4b] border border-zinc-700" title="Indigo-950"></div>
                <div className="flex-1 aspect-square rounded bg-[#312e81] border border-zinc-700" title="Indigo-900"></div>
                <div className="flex-1 aspect-square rounded bg-[#6366f1] border border-zinc-700" title="Indigo-500"></div>
                <div className="flex-1 aspect-square rounded bg-[#ffffff] border border-zinc-700" title="White"></div>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono">
                MOOD: <span className="text-zinc-200 font-bold uppercase">CINEMATIC / HIGH-CONTRAST</span>
              </p>
            </div>
          </div>

          <div className="bg-[#0a0a16] border border-zinc-800 rounded-xl p-6 min-h-[580px] flex flex-col justify-between space-y-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold font-['Readex_Pro'] text-white italic uppercase">
                  نتيجة التفكيك والتحليل البصري (Poster Visual DNA)
                </h3>
              </div>

              {analysisResult && (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleSaveToVault}
                    disabled={isSavedInVault}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                      isSavedInVault
                        ? 'bg-rose-950 text-rose-300 border-rose-800'
                        : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-200'
                    }`}
                  >
                    <BookmarkCheck className={`w-3.5 h-3.5 ${isSavedInVault ? 'text-rose-400' : 'text-indigo-400'}`} />
                    <span>{isSavedInVault ? 'محفوظ في الحافظة' : 'حفظ في الأرشيف'}</span>
                  </button>

                  <button
                    onClick={handleDownloadReport}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-emerald-300 text-xs font-bold transition-all"
                    title="تنزيل كملف تقرير Markdown"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>تنزيل (.md)</span>
                  </button>

                  <button
                    onClick={handleCopyPromptOnly}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950 hover:bg-indigo-900 border border-indigo-700 text-indigo-200 text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>البرومبت فقط</span>
                  </button>

                  <button
                    onClick={handleCopyFull}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-indigo-600/30 transition-all"
                  >
                    {copiedFull ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>نسخ التحليل الكامل</span>
                  </button>
                </div>
              )}
            </div>

            {/* Content Display Area */}
            <div className="flex-1 overflow-y-auto max-h-[600px] space-y-4 pr-1">
              {isAnalyzing ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-10 space-y-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin mx-auto" />
                    <Sparkles className="w-6 h-6 text-indigo-400 absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-white font-mono uppercase">
                      ANALYZING SUB-PIXEL DNA...
                    </h4>
                    <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                      يتم تفكيك الإضاءة، التدريج اللوني، زوايا الكاميرا، خامات الخشبيات، والأقمشة لبناء الهيكل الفني التام.
                    </p>
                  </div>
                </div>
              ) : analysisResult ? (
                <div className="space-y-4 text-zinc-200 text-sm leading-relaxed font-[#Tajawal]">
                  <div className="bg-[#05050f] border border-zinc-800/90 rounded-xl p-5 font-mono text-xs sm:text-sm whitespace-pre-wrap leading-relaxed text-zinc-100 select-text">
                    {analysisResult}
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[350px] flex flex-col items-center justify-center text-center p-8 border border-dashed border-zinc-800 rounded-xl text-zinc-500 space-y-3">
                  <Layers className="w-10 h-10 text-zinc-600 opacity-50" />
                  <div>
                    <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-widest">
                      AWAITING ANALYSIS INITIATION
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                      اختر أي صورة بوستر واضغط على زر "EXECUTE DEEP VISION ANALYSIS" لعرض التفكيك الكامل هنا.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

