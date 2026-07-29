import React, { useState } from 'react';
import { EngineId } from './types';
import { ENGINES_CONFIG } from './data/analysisPrompts';
import { Navbar } from './components/Navbar';
import { HubView } from './components/HubView';
import { PosterAnalyzerEngine } from './components/PosterAnalyzerEngine';
import { LogoTypographyStudio } from './components/LogoTypographyStudio';
import { ColorTextureStudio } from './components/ColorTextureStudio';
import { PromptVault } from './components/PromptVault';
import { EngineWorkspace } from './components/EngineWorkspace';
import { Toast, ToastMessage } from './components/Toast';

export default function App() {
  const [activeEngineId, setActiveEngineId] = useState<EngineId | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (
    message: string,
    type: 'success' | 'error' | 'info' = 'info'
  ) => {
    setToast({
      id: Date.now().toString(),
      type,
      message,
    });
  };

  const handleGoHome = () => {
    setActiveEngineId(null);
  };

  const handleOpenAnalyzer = () => {
    setActiveEngineId('poster-analyzer');
  };

  return (
    <div className="min-h-screen bg-[#050510] text-slate-100 flex flex-col justify-between selection:bg-indigo-600 selection:text-white relative">
      {/* Background Glow Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[10%] left-[5%] w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[160px]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Navigation Bar */}
        <Navbar
          activeEngineId={activeEngineId}
          onGoHome={handleGoHome}
          onOpenAnalyzer={handleOpenAnalyzer}
        />

        {/* Main Content Area */}
        <main className="flex-1">
          {activeEngineId === null && (
            <HubView
              engines={ENGINES_CONFIG}
              onSelectEngine={(id) => setActiveEngineId(id)}
            />
          )}

          {activeEngineId === 'poster-analyzer' && (
            <PosterAnalyzerEngine
              onGoHome={handleGoHome}
              showToast={showToast}
            />
          )}

          {activeEngineId === 'logo-typography' && (
            <LogoTypographyStudio
              onGoHome={handleGoHome}
              showToast={showToast}
            />
          )}

          {activeEngineId === 'color-palette' && (
            <ColorTextureStudio
              onGoHome={handleGoHome}
              showToast={showToast}
            />
          )}

          {activeEngineId === 'prompt-vault' && (
            <PromptVault
              onGoHome={handleGoHome}
              showToast={showToast}
            />
          )}

          {activeEngineId !== null &&
            activeEngineId !== 'poster-analyzer' &&
            activeEngineId !== 'logo-typography' &&
            activeEngineId !== 'color-palette' &&
            activeEngineId !== 'prompt-vault' && (
              <EngineWorkspace
                engineId={activeEngineId}
                onGoHome={handleGoHome}
                showToast={showToast}
              />
            )}
        </main>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#181836] bg-[#070718] py-6 px-4 text-center text-xs text-slate-500 space-y-2">
        <p className="font-semibold text-slate-400">
          أستوديو التصميم والتحليل البصري الاحترافي Pro v4.2
        </p>
        <p>
          مدعوم بواسطة Gemini 3.6 Flash Vision للتحليل البصري المجهري وتفكيك حمض البوسترات والشعارات
        </p>
      </footer>

      {/* Toast Notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
