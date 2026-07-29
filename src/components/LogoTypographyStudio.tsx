import React, { useState } from 'react';
import {
  Shield,
  Type,
  Sparkles,
  Copy,
  Check,
  ArrowLeft,
  Flame,
  Award,
  Crown,
  Zap,
  Layers,
  Sliders
} from 'lucide-react';

interface LogoTypographyStudioProps {
  onGoHome: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const LogoTypographyStudio: React.FC<LogoTypographyStudioProps> = ({
  onGoHome,
  showToast,
}) => {
  const [badgeType, setBadgeType] = useState<string>('درع بطولة ذهبي فخم');
  const [typographyStyle, setTypographyStyle] = useState<string>('تايبوغرافي 3D نيون مائل');
  const [textString, setTextString] = useState<string>('MATCHDAY');
  const [clubOrPlayer, setClubOrPlayer] = useState<string>('REAL MADRID // AL ZAWRAA');
  const [primaryColor, setPrimaryColor] = useState<string>('الذهبي والأسود الفاخر');
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const BADGE_PRESETS = [
    { title: 'درع بطولة ذهبي فخم', desc: '3D Gold Laurel Wreath Shield with polished chrome finish', icon: Crown },
    { title: 'شعار نادي حديث أدنى', desc: 'Modern Minimalist Vector Emblem with clean geometric lines', icon: Shield },
    { title: 'شارة نيون فلكس 3D', desc: 'Futuristic Neon Glow Badge with dark stadium reflections', icon: Zap },
    { title: 'تايبوغرافي كربون مطفي', desc: 'Carbon Fiber & Titanium Beveled Text Lockup', icon: Layers },
  ];

  const TYPOGRAPHY_STYLES = [
    'تايبوغرافي 3D نيون مائل',
    'خط معدني كروم بارز مع انعكاسات الملعب',
    'تايبوغرافي زجاجي بلوري شفاف (Frosted Glass)',
    'خط رياضي ملحمي ممزق وبارود (Grunge Athletic)',
  ];

  const handleGeneratePrompt = () => {
    const prompt = `/imagine prompt: High-end professional sports emblem and 3D typography lockup featuring text "${textString}" for "${clubOrPlayer}". Style: ${badgeType}, ${typographyStyle}. Color palette: ${primaryColor}, volumetric stadium lighting, 8k resolution, ultra-detailed textures, octane render, Raytracing reflections, isolated dark background --ar ${aspectRatio} --v 6.0 --style raw`;

    setGeneratedPrompt(prompt);
    showToast('⚡ تم توليد برومبت الشعار والتايبوغرافي بنجاح!', 'success');
  };

  const handleCopy = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    showToast('تم نسخ برومبت الشعار والتايبوغرافي!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0a0a18] border border-purple-900/60 p-6 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded uppercase">
                SPORTS BADGE & TYPOGRAPHY GENERATOR
              </span>
              <span className="text-xs text-purple-400 font-mono">
                Midjourney v6.0 Ready
              </span>
            </div>
            <h1 className="text-2xl font-black text-white font-['Readex_Pro'] mt-1">
              مولد الشعارات والتايبوغرافي الرياضي 3D
            </h1>
          </div>
        </div>

        <button
          onClick={onGoHome}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-purple-400" />
          <span>الرئيسية</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Preset Selection */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest block">
              🛡️ اختر نمط الشعار أو الشارة البصرية
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BADGE_PRESETS.map((preset) => {
                const PresetIcon = preset.icon;
                const isSelected = badgeType === preset.title;
                return (
                  <button
                    key={preset.title}
                    onClick={() => setBadgeType(preset.title)}
                    className={`p-3.5 rounded-xl border text-right transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-purple-950/60 border-purple-500 text-white shadow-md shadow-purple-600/20'
                        : 'bg-[#070714] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-purple-600 text-white' : 'bg-zinc-900 text-purple-400'}`}>
                      <PresetIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block text-white">{preset.title}</span>
                      <span className="text-[10px] text-zinc-400 block mt-0.5">{preset.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Typography Style */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest block">
              ✍️ نمط وتأثير التايبوغرافي (Typography & Material Style)
            </label>
            <select
              value={typographyStyle}
              onChange={(e) => setTypographyStyle(e.target.value)}
              className="w-full bg-[#070714] border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none"
            >
              {TYPOGRAPHY_STYLES.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </div>

          {/* Text String and Club */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">
                🔤 النص المراد كتابته (Text Content)
              </label>
              <input
                type="text"
                value={textString}
                onChange={(e) => setTextString(e.target.value)}
                placeholder="MATCHDAY / HERE WE GO / 10"
                className="w-full bg-[#070714] border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">
                ⚽ اسم النادي أو اللاعب
              </label>
              <input
                type="text"
                value={clubOrPlayer}
                onChange={(e) => setClubOrPlayer(e.target.value)}
                placeholder="Real Madrid / Al Zawraa"
                className="w-full bg-[#070714] border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Colors and Aspect Ratio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">
                🎨 الألوان والتأثيرات اللوحية
              </label>
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                placeholder="الذهبي والأسود الفاخر / نيون أزرق وبنفسجي"
                className="w-full bg-[#070714] border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">
                📐 أبعاد الشعار (Aspect Ratio)
              </label>
              <div className="flex items-center gap-2">
                {['1:1', '4:5', '16:9'].map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                      aspectRatio === ratio
                        ? 'bg-purple-600 text-white border-purple-500'
                        : 'bg-[#070714] text-zinc-400 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGeneratePrompt}
            className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          >
            <Sparkles className="w-4 h-4" />
            <span>توليد برومبت الشعار والتايبوغرافي 3D</span>
          </button>
        </div>

        {/* Output Prompt Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#070716] border border-purple-900/60 rounded-2xl p-5 space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-purple-300 uppercase tracking-widest flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-purple-400" />
                  <span>البرومبت المولد لشعارات Midjourney</span>
                </span>
                {generatedPrompt && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-600 text-white text-xs font-bold shadow-sm"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
                  </button>
                )}
              </div>

              {generatedPrompt ? (
                <div className="bg-[#03030b] border border-purple-800/50 p-4 rounded-xl text-xs font-mono text-purple-200 leading-relaxed whitespace-pre-wrap select-all">
                  {generatedPrompt}
                </div>
              ) : (
                <div className="bg-[#03030b] border border-dashed border-zinc-800 p-8 rounded-xl text-center text-xs text-zinc-500 space-y-2">
                  <Shield className="w-8 h-8 mx-auto text-zinc-700" />
                  <p>انقر على "توليد البرومبت" لعرض كود Midjourney المخصص للشعار والتايبوغرافي.</p>
                </div>
              )}
            </div>

            <div className="bg-purple-950/30 border border-purple-800/40 p-3 rounded-xl text-[11px] text-purple-300 font-mono space-y-1">
              <span className="font-bold block text-white">💡 نصيحة التصميم:</span>
              <p>استخدم هذا البرومبت مباشرة في Midjourney v6 للحصول على شعارات مفرغة أو ملصقات تايبوغرافي 3D فخمة لاستخدامها فوق بوسترات المباريات.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
