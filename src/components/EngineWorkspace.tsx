import React, { useState } from 'react';
import {
  Copy,
  Check,
  ArrowRight,
  Database,
  Microscope,
  Wand2,
  Sliders,
  Sparkles
} from 'lucide-react';
import { EngineId } from '../types';
import { BASE_ANALYSIS_PROMPTS, ENGINES_CONFIG } from '../data/analysisPrompts';
import { TerminalOutput } from './TerminalOutput';

interface EngineWorkspaceProps {
  engineId: EngineId;
  onGoHome: () => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const EngineWorkspace: React.FC<EngineWorkspaceProps> = ({
  engineId,
  onGoHome,
  showToast,
}) => {
  const engine = ENGINES_CONFIG.find((e) => e.id === engineId);

  const [aiDna, setAiDna] = useState<string>('');
  const [masterPrompt, setMasterPrompt] = useState<string>('');
  const [copiedAnalysisPrompt, setCopiedAnalysisPrompt] = useState<boolean>(false);

  // Form states per engine
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const handleInputChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  // Copy standard analysis prompt
  const copyAnalysisPrompt = () => {
    const prompt = BASE_ANALYSIS_PROMPTS[engineId] || BASE_ANALYSIS_PROMPTS['sports'];
    navigator.clipboard.writeText(prompt);
    setCopiedAnalysisPrompt(true);
    showToast('نسخ برومبت التحليل! الصقه في ChatGPT مع الصورة المرجعية', 'success');
    setTimeout(() => setCopiedAnalysisPrompt(false), 2500);
  };

  // Compile final prompt
  const generatePrompt = () => {
    if (!aiDna.trim()) {
      showToast('يرجى لصق نتيجة تحليل الذكاء الاصطناعي أولاً', 'error');
      return;
    }

    let prompt = '';
    let dataBlock = '';

    switch (engineId) {
      case 'storefront':
        dataBlock = `• اسم المحل الرئيسي: "${formValues['sfName'] || '[اسم المحل]'}"\n• مجال العمل: "${formValues['sfType'] || '[المجال]'}"\n• نوع اللوحة: "${formValues['sfSign'] || 'قطعة ضوئية 3D بارزة'}"\n• الخدمات/السلوكن: "${formValues['sfServices'] || '[الخدمات]'}"\n• التواصل: "${formValues['sfContact'] || '[رقم الهاتف]'}"`;
        prompt = `/imagine prompt: Hyper-realistic 3D commercial storefront signage exterior render.\n\n═══ [VISUAL DNA REFERENCE] ═══\n${aiDna}\n\n═══ [SIGNAGE SPECIFICATIONS] ═══\nSignage Type: ${formValues['sfSign'] || 'Illuminated 3D acrylic channel letters'} mounted professionally on a modern building facade with realistic architectural lighting and materials.\n\n═══ [TEXT TO INTEGRATE] ═══\nIntegrate this exact Arabic text with perfect 3D typography matching the DNA style:\n${dataBlock}\n\n═══ [TECHNICAL SPECS] ═══\nEvening ambient lighting showing illuminated sign, Unreal Engine 5 quality, V-Ray render, 8K architectural photography. --ar 16:9 --v 6.0 --style raw --iw 1.5`;
        break;

      case 'sports':
        dataBlock = `• البطولة: "${formValues['sTour'] || '[اسم البطولة]'}"\n• المواجهة: "${formValues['sTeam1'] || '[الفريق الأول]'} VS ${formValues['sTeam2'] || '[الفريق الثاني]'}"\n• التوقيت والملعب: "${formValues['sTime'] || '4:15 PM'} | ${formValues['sStadium'] || '[الملعب]'}"`;
        prompt = `/imagine prompt: Epic cinematic sports matchday poster design.\n\n═══ [VISUAL DNA REFERENCE] ═══\n${aiDna}\n\n═══ [MATCH DETAILS] ═══\n${dataBlock}\n\n═══ [DESIGN REQUIREMENTS] ═══\nDramatic sports stadium lighting, heroic player framing, 3D kinetic typography. --ar 4:5 --v 6.0 --style raw --iw 1.5`;
        break;

      case 'khatib':
        dataBlock = `• المناسبة: "${formValues['kEvent'] || '[المناسبة]'}"\n• الخطيب: "${formValues['kName'] || '[اسم الخطيب]'}"\n• المكان والزمان: "${formValues['kTime'] || '[الوقت]'} | ${formValues['kPlace'] || '[المكان]'}"`;
        prompt = `/imagine prompt: Sacred Islamic Majlis poster design with spiritual atmosphere.\n\n═══ [SPIRITUAL DNA REFERENCE] ═══\n${aiDna}\n\n═══ [EVENT DETAILS] ═══\n${dataBlock}\n\n═══ [DESIGN REQUIREMENTS] ═══\nThuluth Arabic calligraphy, divine light streams, Islamic geometric motifs. --ar 4:5 --v 6.0 --style raw --iw 1.5`;
        break;

      case 'radoud':
        dataBlock = `• العزاء: "${formValues['rEvent'] || '[العزاء]'}"\n• الرادود: "${formValues['rName'] || '[الرادود]'}"\n• الشاعر: "${formValues['rPoet'] || '[الشاعر]'}"\n• المكان والزمان: "${formValues['rTime'] || '[التوقيت]'} | ${formValues['rPlace'] || '[المكان]'}"`;
        prompt = `/imagine prompt: Epic cinematic Islamic mourning poster for Radoud.\n\n═══ [EPIC DNA REFERENCE] ═══\n${aiDna}\n\n═══ [EVENT DETAILS] ═══\n${dataBlock}\n\n═══ [DESIGN REQUIREMENTS] ═══\nDramatic chiaroscuro lighting, mourning flag imagery, bold distressed typography. --ar 4:5 --v 6.0 --style raw --iw 1.5`;
        break;

      case 'education':
        dataBlock = `• الإعلان: "${formValues['eType'] || '[نوع الإعلان]'}"\n• الأستاذ: "${formValues['eTeacher'] || '[اسم الأستاذ]'}"\n• المادة: "${formValues['eSubject'] || '[المادة]'}"\n• المعهد: "${formValues['eInstitute'] || '[المعهد]'}"\n• للحجز: "${formValues['eContact'] || '[التواصل]'}"`;
        prompt = `/imagine prompt: Premium academic educational poster design.\n\n═══ [ACADEMIC DNA REFERENCE] ═══\n${aiDna}\n\n═══ [COURSE DETAILS] ═══\n${dataBlock}\n\n═══ [DESIGN REQUIREMENTS] ═══\nClean professional studio lighting, frosted glass UI cards, trust-building navy blue palette. --ar 4:5 --v 6.0 --style raw --iw 1.5`;
        break;

      case 'personal':
        dataBlock = `• الاسم: "${formValues['pName'] || '[الاسم]'}"\n• التخصص: "${formValues['pTitle'] || '[التخصص]'}"\n• الشعار: "${formValues['pSlogan'] || '[الشعار]'}"\n• التواصل: "${formValues['pContact'] || '[التواصل]'}"`;
        prompt = `/imagine prompt: High-end luxury personal branding poster.\n\n═══ [PREMIUM DNA REFERENCE] ═══\n${aiDna}\n\n═══ [PERSONAL DETAILS] ═══\n${dataBlock}\n\n═══ [DESIGN REQUIREMENTS] ═══\nElegant minimalist layout, high-key studio lighting, gold metallic typography. --ar 4:5 --v 6.0 --style raw --iw 1.5`;
        break;

      default:
        prompt = `/imagine prompt: High quality design based on DNA:\n${aiDna}`;
    }

    setMasterPrompt(prompt);
    showToast('🎉 تم بناء البرومبت النهائي بنجاح!', 'success');
  };

  if (!engine) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold shadow-sm"
            style={{
              backgroundColor: `${engine.accentColor}20`,
              border: `1px solid ${engine.accentColor}50`,
              color: engine.accentColor,
            }}
          >
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black font-['Readex_Pro'] text-white italic uppercase">
              {engine.title}
            </h2>
            <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">{engine.subtitle}</p>
          </div>
        </div>

        <button
          onClick={onGoHome}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-bold uppercase tracking-wider transition-colors"
        >
          <ArrowRight className="w-4 h-4 text-indigo-400" />
          <span>العودة للرئيسية</span>
        </button>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Panel 1: Analysis DNA */}
        <div className="bg-[#0a0a16] border border-zinc-800 rounded-xl p-6 space-y-4 flex flex-col justify-between shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Microscope className="w-4 h-4 text-indigo-400" />
                <span>1. VISUAL DNA REFERENCE</span>
              </label>

              <button
                onClick={copyAnalysisPrompt}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-700/60 text-indigo-300 hover:bg-indigo-600 hover:text-white text-xs font-bold uppercase tracking-wider transition-all"
              >
                {copiedAnalysisPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>نسخ برومبت التحليل</span>
              </button>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              انسخ البرومبت، اذهب إلى ChatGPT وارفع صورة التصميم المرجعي، ثم الصق نتيجة التحليل هنا:
            </p>

            <textarea
              value={aiDna}
              onChange={(e) => setAiDna(e.target.value)}
              placeholder="قم بلصق نتيجة تحليل ChatGPT هنا..."
              className="w-full h-56 bg-[#05050f] border border-zinc-800 rounded-lg p-4 text-xs sm:text-sm text-zinc-200 focus:border-indigo-500 focus:outline-none transition-all resize-none font-mono"
            />
          </div>
        </div>

        {/* Panel 2: Data Injection */}
        <div className="bg-[#0a0a16] border border-zinc-800 rounded-xl p-6 space-y-5 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-400" />
              <span>2. DATA INJECTION & METADATA</span>
            </label>

            {/* Fields rendering according to engine */}
            {engineId === 'storefront' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">🏪 اسم المحل</label>
                    <input
                      type="text"
                      placeholder="مثال: تموينات الصادق الغذائية"
                      value={formValues['sfName'] || ''}
                      onChange={(e) => handleInputChange('sfName', e.target.value)}
                      className="w-full bg-[#05050f] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">📋 مجال العمل</label>
                    <input
                      type="text"
                      placeholder="للمواد الغذائية / لطب الأسنان"
                      value={formValues['sfType'] || ''}
                      onChange={(e) => handleInputChange('sfType', e.target.value)}
                      className="w-full bg-[#05050f] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">🔮 نوع اللوحة</label>
                    <input
                      type="text"
                      placeholder="قطعة ضوئية 3D بارزة / فلكس"
                      value={formValues['sfSign'] || ''}
                      onChange={(e) => handleInputChange('sfSign', e.target.value)}
                      className="w-full bg-[#05050f] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">✨ الخدمات أو السلوكن</label>
                    <input
                      type="text"
                      placeholder="ابتسامتك تهمنا / يوجد شحن"
                      value={formValues['sfServices'] || ''}
                      onChange={(e) => handleInputChange('sfServices', e.target.value)}
                      className="w-full bg-[#05050f] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">📞 معلومات التواصل</label>
                  <input
                    type="text"
                    placeholder="077xxxxxxx - شارع..."
                    value={formValues['sfContact'] || ''}
                    onChange={(e) => handleInputChange('sfContact', e.target.value)}
                    className="w-full bg-[#05050f] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {engineId === 'sports' && (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">🏆 اسم البطولة</label>
                  <input
                    type="text"
                    placeholder="كأس شهداء المنصورية"
                    value={formValues['sTour'] || ''}
                    onChange={(e) => handleInputChange('sTour', e.target.value)}
                    className="w-full bg-[#05050f] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">🛡️ الفريق الأول</label>
                    <input
                      type="text"
                      placeholder="تحدي المنصورية"
                      value={formValues['sTeam1'] || ''}
                      onChange={(e) => handleInputChange('sTeam1', e.target.value)}
                      className="w-full bg-[#05050f] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">⚔️ الفريق الثاني</label>
                    <input
                      type="text"
                      placeholder="الكاظمية"
                      value={formValues['sTeam2'] || ''}
                      onChange={(e) => handleInputChange('sTeam2', e.target.value)}
                      className="w-full bg-[#05050f] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">📍 الملعب</label>
                    <input
                      type="text"
                      placeholder="ملعب المنصورية"
                      value={formValues['sStadium'] || ''}
                      onChange={(e) => handleInputChange('sStadium', e.target.value)}
                      className="w-full bg-[#05050f] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">⏰ التوقيت</label>
                    <input
                      type="text"
                      placeholder="4:15 PM"
                      value={formValues['sTime'] || ''}
                      onChange={(e) => handleInputChange('sTime', e.target.value)}
                      className="w-full bg-[#05050f] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {engineId === 'khatib' && (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">🕋 المناسبة</label>
                  <input
                    type="text"
                    placeholder="ذكرى استشهاد..."
                    value={formValues['kEvent'] || ''}
                    onChange={(e) => handleInputChange('kEvent', e.target.value)}
                    className="w-full bg-[#05050f] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">🎙️ الخطيب</label>
                    <input
                      type="text"
                      placeholder="الشيخ فلان"
                      value={formValues['kName'] || ''}
                      onChange={(e) => handleInputChange('kName', e.target.value)}
                      className="w-full bg-[#05050f] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">🕌 المكان والزمان</label>
                    <input
                      type="text"
                      placeholder="8:00 PM | حسينية..."
                      value={formValues['kTime'] || ''}
                      onChange={(e) => handleInputChange('kTime', e.target.value)}
                      className="w-full bg-[#05050f] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {engineId === 'radoud' && (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">🏴 العزاء</label>
                  <input
                    type="text"
                    placeholder="عشرة محرم الحرام"
                    value={formValues['rEvent'] || ''}
                    onChange={(e) => handleInputChange('rEvent', e.target.value)}
                    className="w-full bg-[#05050f] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">🎤 الرادود</label>
                    <input
                      type="text"
                      placeholder="الملا فلان"
                      value={formValues['rName'] || ''}
                      onChange={(e) => handleInputChange('rName', e.target.value)}
                      className="w-full bg-[#05050f] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">✍️ الشاعر</label>
                    <input
                      type="text"
                      placeholder="كلمات الشاعر فلان"
                      value={formValues['rPoet'] || ''}
                      onChange={(e) => handleInputChange('rPoet', e.target.value)}
                      className="w-full bg-[#05050f] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {engineId === 'education' && (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">📚 نوع الإعلان</label>
                  <input
                    type="text"
                    placeholder="الدورة الصيفية / مراجعة مركزة"
                    value={formValues['eType'] || ''}
                    onChange={(e) => handleInputChange('eType', e.target.value)}
                    className="w-full bg-[#05050f] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">👨‍🏫 الأستاذ</label>
                    <input
                      type="text"
                      placeholder="الأستاذ فلان"
                      value={formValues['eTeacher'] || ''}
                      onChange={(e) => handleInputChange('eTeacher', e.target.value)}
                      className="w-full bg-[#05050f] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">📖 المادة</label>
                    <input
                      type="text"
                      placeholder="اللغة الإنجليزية"
                      value={formValues['eSubject'] || ''}
                      onChange={(e) => handleInputChange('eSubject', e.target.value)}
                      className="w-full bg-[#05050f] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {engineId === 'personal' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">👤 الاسم</label>
                    <input
                      type="text"
                      placeholder="د. أحمد فلان"
                      value={formValues['pName'] || ''}
                      onChange={(e) => handleInputChange('pName', e.target.value)}
                      className="w-full bg-[#05050f] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">💼 التخصص</label>
                    <input
                      type="text"
                      placeholder="طبيب أسنان"
                      value={formValues['pTitle'] || ''}
                      onChange={(e) => handleInputChange('pTitle', e.target.value)}
                      className="w-full bg-[#05050f] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={generatePrompt}
            className="w-full py-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 mt-4"
          >
            <Wand2 className="w-4 h-4" />
            <span>GENERATE MASTER PROMPT</span>
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      {masterPrompt && (
        <TerminalOutput promptText={masterPrompt} showToast={showToast} />
      )}
    </div>
  );
};

