import { EngineConfig } from '../types';

export const ENGINES_CONFIG: EngineConfig[] = [
  {
    id: 'poster-analyzer',
    title: 'تحليل البوستر المباشر بالذكاء الاصطناعي',
    subtitle: 'Direct Poster Vision Analyzer Pro',
    description: 'ارفع صورة بوستر مع إمكانية رفع صورة لاعب لحفظ وجهه وملابسه واستبداله في التصميم مع تفاصيل الأحداث الرياضية!',
    iconName: 'Sparkles',
    accentColor: '#ec4899',
    badge: 'مُحتَرِف ✨',
    isNew: true,
  },
  {
    id: 'sports',
    title: 'الرياضة والملاعب',
    subtitle: 'Sports & Matchday Studio',
    description: 'بطولات، تشكيلات، وتغطية مباريات كرة قدم ببوسترات حماسية سينمائية',
    iconName: 'Trophy',
    accentColor: '#0ea5e9',
  },
  {
    id: 'logo-typography',
    title: 'مولد الشعارات والتايبوغرافي',
    subtitle: 'Sports Badges & 3D Typography',
    description: 'إنشاء برومبتات احترافية لشعارات الأندية، دروع البطولات، وتايبوغرافي 3D نيون وبارز للاعبين والأحداث',
    iconName: 'Shield',
    accentColor: '#8b5cf6',
    badge: 'جديد ⚡',
    isNew: true,
  },
  {
    id: 'color-palette',
    title: 'أستوديو تفكيك الألوان والخامات',
    subtitle: 'Color & Texture Extractor',
    description: 'تفكيك بالتفصيل لوحة الألوان (HEX codes)، الإضاءة الساقطة، خامات القماش والجلد، ونغمات التدريج البصري',
    iconName: 'Palette',
    accentColor: '#10b981',
    badge: 'جديد 🎨',
    isNew: true,
  },
  {
    id: 'prompt-vault',
    title: 'أرشيف وحافظة البرومبتات',
    subtitle: 'Prompt Vault & Saved History',
    description: 'استعراض وإدارة جميع التحليلات والبرومبتات المحفوظة، وإمكانية البحث والتصدير بصيغة Text أو Markdown',
    iconName: 'BookmarkCheck',
    accentColor: '#f43f5e',
    badge: 'سريع 📂',
    isNew: true,
  },
  {
    id: 'khatib',
    title: 'المنبر الحسيني والخطباء',
    subtitle: 'Hussaini Majlis & Khatib',
    description: 'إعلانات مجالس عزاء، خطباء، واقتباسات دينية مع مخطوطات إسلامية',
    iconName: 'Flame',
    accentColor: '#d4af37',
  },
  {
    id: 'radoud',
    title: 'الرواديد والقصائد',
    subtitle: 'Radoud & Epic Eulogies',
    description: 'بوسترات ملحمية، مجالس عزاء، ورايات حسينية ذات طابع درامي',
    iconName: 'Flag',
    accentColor: '#dc2626',
  },
  {
    id: 'education',
    title: 'التعليم والدورات',
    subtitle: 'Academic & Course Studio',
    description: 'إعلانات أساتذة، دورات صيفية، ومراجعات مركزة بتصاميم حديثة',
    iconName: 'GraduationCap',
    accentColor: '#6366f1',
  },
  {
    id: 'personal',
    title: 'إعلان شخصي وفاخر',
    subtitle: 'Personal Branding & Luxury',
    description: 'أطباء، مهندسين، وأعمال حرة احترافية بطابع زجاجي وفخم',
    iconName: 'UserCheck',
    accentColor: '#14b8a6',
  },
  {
    id: 'storefront',
    title: 'واجهات المحلات والفلكسات',
    subtitle: 'Storefronts & 3D Signage',
    description: 'أسواق، عيادات، قطع ضوئية 3D، ولوحات فلكس بارزة للمحلات',
    iconName: 'Store',
    accentColor: '#f59e0b',
  },
];

export const BASE_ANALYSIS_PROMPTS: Record<string, string> = {
  sports: `Act as a Master Sports Art Director who has designed for FIFA World Cup, UEFA Champions League, and Premier League campaigns. Analyze the attached matchday poster or sports graphic with forensic precision. Extract its pure "Athletic Visual DNA".

Output a single dense paragraph covering these 7 dimensions:
1. CINEMATIC LIGHTING & ATMOSPHERE: Deconstruct the lighting setup in detail (volumetric stadium floodlights, overhead spotlights in locker rooms, rim light separation, lens flare, dust motes).
2. COLOR GRADING & TONAL PALETTE: Extract the precise color grading approach (teal and orange, desaturated moody tones, crimson red accents, deep dark blacks).
3. SPORTS TYPOGRAPHY & KINETIC TEXT: Bold italicized fonts, metallic chrome bevels, 3D text placement, jersey numbers.
4. BACKGROUND & TEXTURE LAYERS: Locker room wooden cabinets, stadium bokeh, concrete/grunge overlays.
5. PLAYER/SUBJECT COMPOSITION: Hero pose sitting on bench holding football, low angle/eye level, muscle definition.
6. GRAPHIC ELEMENTS & UI OVERLAYS: Match details, VS graphics, tournament badges.
7. POST-PROCESSING EFFECTS: Chromatic aberration, film grain, vignette, sharp detail boost.`,

  khatib: `Act as an Elite Islamic Art Director specializing in Hussaini and Majlis poster design. Analyze the attached Islamic poster with deep reverence and artistic precision. Extract its pure "Spiritual Visual DNA".`,

  radoud: `Act as a Cinematic Art Director specializing in Epic Islamic Mourning visuals and Ashura campaign designs. Analyze the attached Radoud poster with intense emotional precision.`,

  education: `Act as a Premium Educational Art Director and Academic Brand Identity Specialist. Analyze the attached educational poster with professional precision. Extract its pure "Academic Trust DNA".`,

  personal: `Act as a High-End Brand Identity Designer specializing in luxury personal branding. Extract its pure "Premium Personal DNA".`,

  storefront: `Act as an Elite Commercial Signage Designer and 3D Visualization Expert. Analyze the attached storefront sign or flex banner. Extract its pure "Signage Visual DNA".`
};
