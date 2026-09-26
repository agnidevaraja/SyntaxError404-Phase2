import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { IconX, IconChevronLeft, IconChevronRight, IconBookOpen, IconFileText, IconSparkles } from '../common/Icons';

export const SlidePreviewModal: React.FC = () => {
  const { activeSlidePreviewDeck, setActiveSlidePreviewDeck } = useApp();
  const [currentSlidePage, setCurrentSlidePage] = useState<number>(1);

  const totalSlides = activeSlidePreviewDeck?.slidesCount || activeSlidePreviewDeck?.slides?.length || 1;

  useEffect(() => {
    if (!activeSlidePreviewDeck) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveSlidePreviewDeck(null);
        setCurrentSlidePage(1);
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlidePage((p) => Math.max(1, p - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentSlidePage((p) => Math.min(totalSlides, p + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSlidePreviewDeck, setActiveSlidePreviewDeck, totalSlides]);

  if (!activeSlidePreviewDeck) return null;

  const currentSlide =
    activeSlidePreviewDeck.slides.find(
      (s, idx) => (s.pageNumber ?? (s as any).slideNumber ?? idx + 1) === currentSlidePage
    ) ||
    activeSlidePreviewDeck.slides[0] || {
      pageNumber: 1,
      title: activeSlidePreviewDeck.title,
      contentBullets: ['No content bullets provided.'],
    };

  const currentPageNumber = currentSlide.pageNumber ?? (currentSlide as any).slideNumber ?? currentSlidePage;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0">
              <IconBookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 line-clamp-1">
                {activeSlidePreviewDeck.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span>{activeSlidePreviewDeck.filename}</span>
                <span>·</span>
                <span>{activeSlidePreviewDeck.fileSize}</span>
                <span>·</span>
                <span>Uploaded by {activeSlidePreviewDeck.uploadedBy}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveSlidePreviewDeck(null);
              setCurrentSlidePage(1);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer btn-tactile"
            title="Close (Esc)"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Canvas Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-900 text-white flex flex-col justify-between">
          <div className="max-w-2xl mx-auto w-full space-y-6">
            
            {/* Slide Header */}
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-mono uppercase tracking-wider text-indigo-400">
                  {activeSlidePreviewDeck.unit}
                </span>
                <span className="font-mono">
                  Slide {currentPageNumber} of {totalSlides}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                {currentSlide.title}
              </h3>
            </div>

            {/* Slide Bulleted Content */}
            <div className="space-y-3">
              {currentSlide.contentBullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-xs bg-indigo-500 mt-2 shrink-0" />
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                    {bullet}
                  </p>
                </div>
              ))}
            </div>

            {/* Formula snippet if present */}
            {currentSlide.formulaSnippet && (
              <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700/80 font-mono text-sm text-emerald-300">
                <span className="text-slate-400 text-xs block mb-1 font-sans font-medium">Key Mathematical & Chemical Formula:</span>
                <span className="font-semibold text-emerald-300 leading-relaxed block">{currentSlide.formulaSnippet}</span>
              </div>
            )}

            {/* Diagram or Callout */}
            {currentSlide.callout && (
              <div className="p-3.5 rounded-xl bg-indigo-950/60 border border-indigo-800 text-xs text-indigo-200 font-medium flex items-start gap-2">
                <IconSparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>{currentSlide.callout}</span>
              </div>
            )}
          </div>

          {/* Slide Navigation Pagination */}
          <div className="max-w-2xl mx-auto w-full pt-6 mt-6 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setCurrentSlidePage((p) => Math.max(1, p - 1))}
              disabled={currentSlidePage <= 1}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-900 disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold text-slate-200 transition-all cursor-pointer btn-tactile"
            >
              <IconChevronLeft className="w-4 h-4" />
              <span>Previous Slide</span>
            </button>

            {/* Page dots */}
            <div className="flex items-center gap-1.5">
              {activeSlidePreviewDeck.slides.map((s, idx) => {
                const pageNum = s.pageNumber ?? (s as any).slideNumber ?? (idx + 1);
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlidePage(pageNum)}
                    className={`h-1.5 rounded-xs transition-all cursor-pointer ${
                      pageNum === currentSlidePage
                        ? 'bg-indigo-400 w-6'
                        : 'bg-slate-700 hover:bg-slate-600 w-2'
                    }`}
                    title={`Go to slide ${pageNum}`}
                  />
                );
              })}
            </div>

            <button
              onClick={() => setCurrentSlidePage((p) => Math.min(totalSlides, p + 1))}
              disabled={currentSlidePage >= totalSlides}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-900 disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold text-slate-200 transition-all cursor-pointer btn-tactile"
            >
              <span>Next Slide</span>
              <IconChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <IconFileText className="w-4 h-4 text-slate-400" />
            <span>Use Left/Right arrow keys to navigate · Esc to close</span>
          </div>
          <button
            onClick={() => {
              setActiveSlidePreviewDeck(null);
              setCurrentSlidePage(1);
            }}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer btn-tactile"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
