import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  Copy,
  Check,
  ArrowLeft,
  Sun,
  Layers,
  Zap,
  Droplet,
  Upload,
  Activity
} from 'lucide-react';

interface ColorTextureStudioProps {
  onGoHome: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const ColorTextureStudio: React.FC<ColorTextureStudioProps> = ({
  onGoHome,
  showToast,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractedData, setExtractedData] = useState<string | null>(null);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  // Sample default palette extracted if user hasn't uploaded yet
  const SAMPLE_PALETTE = [
    { hex: '#0B0B1A', name: 'Midnight Pitch Black', role: 'خلفية البوستر' },
    { hex: '#DC2626', name: 'Crimson Matchday Red', role: 'اللون الرئيسي / الشغف' },
    { hex: '#D4AF37', name: 'Trophy Imperial Gold', role: 'الشعارات والدرع' },
    { hex: '#1E293B', name: 'Locker Oak Shadow', role: 'ظلال غرفة الملابس' },
    { hex: '#38BDF8', name: 'Stadium Volumetric Rim', role: 'إضاءة الحواف 100%' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('يرجى اختيار صورة صالحة', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setSelectedImage(result);
      setMimeType(file.type || 'image/jpeg');
      setExtractedData(null);
      showToast('تم رفع الصورة بنجاح! انقر لبدء تفكيك الألوان والخامات.', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleExtract = async () => {
    if (!selectedImage) {
      showToast('يرجى رفع صورة أولاً للقيام بتفكيك الألوان والخامات', 'info');
      return;
    }

    setIsExtracting(true);
    setExtractedData(null);

    try {
      const res = await fetch('/api/analyze-poster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType: mimeType,
          customInstruction:
            'يرجى إجراء تفكيك مجهري مخصص للألوان والخامات فقط: استخرج أكواد HEX التقريبية لكل لون، ونسبة الإضاءة الباردة إلى الدافئة، ونوع الخامات (قماش القميص، خشب الخزانات، الجلد، المعدن)، مع صياغة لوحة ألوان كاملة جاهزة للاستخدام في التصميم.',
        }),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setExtractedData(data.analysis);
        showToast('🎨 تم تفكيك لوحة الألوان والخامات بنجاح!', 'success');
      } else {
        throw new Error(data.error || 'فشل في تفكيك الألوان');
      }
    } catch (err: any) {
      showToast(err.message || 'حدث خطأ أثناء تفكيك الألوان', 'error');
    } finally {
      setIsExtracting(false);
    }
  };

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    showToast(`تم نسخ كود اللون ${hex}`, 'success');
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0a0a18] border border-emerald-900/60 p-6 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded uppercase">
                COLOR & TEXTURE LAB
              </span>
              <span className="text-xs text-emerald-400 font-mono">
                HEX & Material Decompiler
              </span>
            </div>
            <h1 className="text-2xl font-black text-white font-['Readex_Pro'] mt-1">
              أستوديو تفكيك الألوان والخامات
            </h1>
          </div>
        </div>

        <button
          onClick={onGoHome}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>الرئيسية</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload & Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#070716] border border-emerald-900/40 rounded-2xl p-5 space-y-4">
            <label className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest block">
              📸 ارفع صورة البوستر لتفكيك ألوانها وخامتها
            </label>

            <div className="relative border-2 border-dashed border-emerald-500/30 hover:border-emerald-400 rounded-xl p-6 text-center bg-[#03030b] transition-colors cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                id="color-image-upload"
                className="hidden"
              />
              <label htmlFor="color-image-upload" className="cursor-pointer block space-y-3">
                {selectedImage ? (
                  <div className="w-full h-48 rounded-lg overflow-hidden border border-emerald-500/50 bg-black mx-auto">
                    <img src={selectedImage} alt="Uploaded" className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">انقر لرفع صورة للتفكيك</span>
                      <span className="text-[10px] text-zinc-400 font-mono block mt-1">PNG, JPG, WebP</span>
                    </div>
                  </>
                )}
              </label>
            </div>

            <button
              onClick={handleExtract}
              disabled={isExtracting || !selectedImage}
              className={`w-full py-3.5 rounded-xl text-white font-bold text-xs uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 transition-all ${
                isExtracting || !selectedImage
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20 hover:scale-[1.01]'
              }`}
            >
              {isExtracting ? (
                <>
                  <Activity className="w-4 h-4 animate-spin text-emerald-300" />
                  <span>جاري تفكيك الخامات والألوان...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>بدء تفكيك الألوان والخامات المجهري</span>
                </>
              )}
            </button>
          </div>

          {/* Preset Color Chips Showcase */}
          <div className="bg-[#070716] border border-zinc-800 rounded-2xl p-5 space-y-3">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">
              🎨 عينة أكواد HEX التفاعلية (انقر للنسخ)
            </span>
            <div className="space-y-2">
              {SAMPLE_PALETTE.map((item) => (
                <div
                  key={item.hex}
                  onClick={() => copyHex(item.hex)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#03030a] border border-zinc-800 hover:border-emerald-500/50 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-lg shadow-inner border border-white/20 shrink-0"
                      style={{ backgroundColor: item.hex }}
                    />
                    <div>
                      <span className="text-xs font-bold font-mono text-white block group-hover:text-emerald-300 transition-colors">
                        {item.hex}
                      </span>
                      <span className="text-[10px] text-zinc-400 block">{item.name}</span>
                    </div>
                  </div>

                  <span className="text-[10px] text-zinc-500 font-mono bg-zinc-900 px-2 py-1 rounded">
                    {copiedColor === item.hex ? 'تم النسخ!' : item.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7">
          <div className="bg-[#070716] border border-emerald-900/60 rounded-2xl p-6 space-y-4 min-h-[400px]">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-[10px] font-mono font-bold text-emerald-300 uppercase tracking-widest flex items-center gap-2">
                <Droplet className="w-4 h-4 text-emerald-400" />
                <span>نتائج تفكيك الألوان والنسيج الخامي (Visual DNA)</span>
              </span>
              {extractedData && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(extractedData);
                    showToast('تم نسخ تقرير الألوان الخامي!', 'success');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ التقرير</span>
                </button>
              )}
            </div>

            {extractedData ? (
              <div className="bg-[#03030b] border border-zinc-800 p-5 rounded-xl text-xs font-mono text-zinc-200 leading-relaxed whitespace-pre-wrap">
                {extractedData}
              </div>
            ) : (
              <div className="bg-[#03030b] border border-dashed border-zinc-800 p-12 rounded-xl text-center text-xs text-zinc-500 space-y-3 my-auto">
                <Palette className="w-10 h-10 mx-auto text-zinc-700" />
                <p className="max-w-md mx-auto">
                  ارفع صورة أي بوستر أو تصميم وانقر على زر التفكيك للحصول على تقرير مجهري يشمل أكواد HEX، درجات حرارة الضوء، وخامات القماش والجلد والأرضيات.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
