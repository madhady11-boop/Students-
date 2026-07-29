import { SamplePoster } from '../types';

// Sample base64 placeholder SVGs rendered as base64 data URIs for immediate demo analysis
const lockerRoomSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
  <rect width="800" height="1000" fill="%230c0a09"/>
  <rect x="50" y="50" width="700" height="900" fill="%231c1917" stroke="%23292524" stroke-width="4"/>
  <!-- Lockers Background -->
  <rect x="100" y="80" width="600" height="700" fill="%2327272a" rx="8"/>
  <rect x="250" y="100" width="300" height="500" fill="%233f3f46" rx="4"/>
  <!-- Hanger & Jersey -->
  <path d="M 350 140 Q 400 120 450 140" stroke="%23e4e4e7" stroke-width="4" fill="none"/>
  <path d="M 300 160 L 500 160 L 520 380 L 280 380 Z" fill="%23dc2626"/>
  <text x="400" y="220" font-family="sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle">AHMED</text>
  <text x="400" y="310" font-family="sans-serif" font-size="72" font-weight="900" fill="white" text-anchor="middle">0</text>
  <!-- Overhead Spotlight -->
  <polygon points="400,0 200,400 600,400" fill="url(%23light)" opacity="0.35"/>
  <defs>
    <linearGradient id="light" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="%23fef08a" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="%23fef08a" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <!-- Player Sitting -->
  <circle cx="400" cy="460" r="50" fill="%23fca5a5"/>
  <path d="M 330 520 L 470 520 L 490 700 L 310 700 Z" fill="%23dc2626"/>
  <!-- Football in Hands -->
  <circle cx="400" cy="650" r="45" fill="%23ffffff" stroke="%23000" stroke-width="3"/>
  <polygon points="400,630 415,645 410,660 390,660 385,645" fill="%2318181b"/>
  <!-- Legs & Boots -->
  <rect x="340" y="700" width="40" height="180" fill="%23dc2626"/>
  <rect x="420" y="700" width="40" height="180" fill="%23dc2626"/>
  <rect x="320" y="870" width="70" height="30" fill="%23f8fafc" rx="6"/>
  <rect x="410" y="870" width="70" height="30" fill="%23f8fafc" rx="6"/>
  <!-- Title overlay -->
  <text x="400" y="960" font-family="sans-serif" font-size="28" font-weight="bold" fill="%23fbbf24" text-anchor="middle">MATCHDAY LOCKER ROOM PORTRAIT</text>
</svg>`;

const storefrontSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <rect width="800" height="500" fill="%2309090b"/>
  <rect x="50" y="100" width="700" height="140" fill="%23030712" stroke="%23f59e0b" stroke-width="3" rx="12"/>
  <text x="400" y="180" font-family="sans-serif" font-size="42" font-weight="900" fill="%23fbbf24" text-anchor="middle">تموينات الصادق الغذائية</text>
  <text x="400" y="215" font-family="sans-serif" font-size="20" fill="%23e2e8f0" text-anchor="middle">AL-SADIQ COMMERCIAL STOREFRONT 3D SIGN</text>
  <rect x="80" y="260" width="640" height="200" fill="%2318181b" rx="8"/>
</svg>`;

const majlisSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
  <rect width="800" height="1000" fill="%23050505"/>
  <circle cx="400" cy="300" r="220" fill="%237f1d1d" opacity="0.3"/>
  <text x="400" y="320" font-family="serif" font-size="60" font-weight="bold" fill="%23d4af37" text-anchor="middle">يا حسين</text>
  <text x="400" y="420" font-family="sans-serif" font-size="36" font-weight="bold" fill="%23ffffff" text-anchor="middle">مجلس عزاء حسيني ملحمي</text>
  <rect x="150" y="550" width="500" height="300" fill="%23111827" stroke="%23d4af37" stroke-width="2" rx="16"/>
  <text x="400" y="650" font-family="sans-serif" font-size="28" fill="%23f59e0b" text-anchor="middle">سماحة الشيخ الخطيب</text>
</svg>`;

export const SAMPLE_POSTERS: SamplePoster[] = [
  {
    id: 'locker-room-sports',
    title: 'بوستر غرفة الملابس الرياضية (AHMED #0)',
    category: 'رياضي احترافي',
    description: 'لاعب كرة قدم يرتدي القميص الأحمر ويمسك الكرة تحت إضاءة مركزية داخل غرفة تبديل الملابس',
    thumbnail: lockerRoomSvg,
    base64Data: lockerRoomSvg.split(',')[1],
    mimeType: 'image/svg+xml',
  },
  {
    id: 'storefront-3d',
    title: 'واجهة محل تجاري 3D نيون',
    category: 'دعاية وإعلان',
    description: 'قطعة ضوئية بارزة 3D مع إضاءة خ خلفية LED ومظهر معماري حديث',
    thumbnail: storefrontSvg,
    base64Data: storefrontSvg.split(',')[1],
    mimeType: 'image/svg+xml',
  },
  {
    id: 'majlis-mourning',
    title: 'بوستر مجلس حسيني ملحمي',
    category: 'إسلامي درامي',
    description: 'إضاءة إلهية مع مخطوطة ذهبية ورايات سوداء وإطار إسلامي هندسي',
    thumbnail: majlisSvg,
    base64Data: majlisSvg.split(',')[1],
    mimeType: 'image/svg+xml',
  },
];
