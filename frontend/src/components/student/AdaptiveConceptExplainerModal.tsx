import React, { useState, useEffect } from 'react';
import {
  generateAdaptiveConceptExplanation,
  ConceptExplanationResult,
} from '../../services/conceptExplainerService';
import {
  IconSparkles,
  IconCheckCircle,
  IconAlertTriangle,
  IconX,
  IconArrowRight,
  IconZap,
} from '../common/Icons';
import { Lightbulb, RefreshCw, CheckCircle2, XCircle, BookOpen } from 'lucide-react';

interface AdaptiveConceptExplainerModalProps {
  isOpen: boolean;
  topic: string;
  subject: 'Chemistry' | 'Economics';
  struggleContext?: string;
  onClose: () => void;
}

export const AdaptiveConceptExplainerModal: React.FC<AdaptiveConceptExplainerModalProps> = ({
  isOpen,
  topic,
  subject,
  struggleContext = 'Struggling with multi-step conversion and concept application',
  onClose,
}) => {
  const [data, setData] = useState<ConceptExplanationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasCheckedAnswer, setHasCheckedAnswer] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsLoading(true);
    setSelectedOption(null);
    setHasCheckedAnswer(false);

    generateAdaptiveConceptExplanation(topic, subject, struggleContext)
      .then((res) => {
        if (isMounted) {
          setData(res);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching adaptive concept explanation:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, topic, subject, struggleContext]);

  if (!isOpen) return null;

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
    setHasCheckedAnswer(true);
  };

  const isCorrect = selectedOption !== null && data?.checkpointQuestion.correctIndex === selectedOption;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-xs ${
              subject === 'Chemistry' ? 'bg-indigo-600' : 'bg-emerald-700'
            }`}>
              <Lightbulb className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                  subject === 'Chemistry'
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  Adaptive Concept Explainer · {subject}
                </span>
                <span className="text-xs text-slate-400">· Powered by Outstand AI</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-0.5">
                Break It Down: {topic}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            title="Close"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3 text-slate-500">
              <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
              <p className="text-xs font-semibold">Generating your tailored analogy and worked example with Outstand AI...</p>
              <span className="text-[11px] text-slate-400">Isolating intuition without academic jargon</span>
            </div>
          ) : data ? (
            <>
              {/* SECTION 1: Real-World Visual Analogy */}
              <div className="bg-amber-50/70 dark:bg-amber-950/20 rounded-2xl border border-amber-200/80 dark:border-amber-900/60 p-5 sm:p-6 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-xs uppercase tracking-wider">
                  <IconSparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>1. Real-World Visual Analogy: {data.analogyTitle}</span>
                </div>
                <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                  {data.analogyStory}
                </p>
              </div>

              {/* SECTION 2: Step-by-Step Breakdown Solving One Example */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>2. Step-by-Step Concrete Example</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-800">
                  <span className="text-slate-400 font-mono text-[10px] uppercase block mb-1">Problem Scenario:</span>
                  {data.stepByStepExample.problemStatement}
                </div>

                <div className="space-y-2.5">
                  {data.stepByStepExample.steps.map((st) => (
                    <div
                      key={st.stepNumber}
                      className="p-3.5 rounded-xl bg-indigo-50/40 border border-indigo-100 flex items-start gap-3"
                    >
                      <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-mono text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">
                        {st.stepNumber}
                      </span>
                      <div className="space-y-1 text-xs">
                        <span className="font-bold text-slate-900 block">{st.instruction}</span>
                        <div className="font-mono text-indigo-950 font-medium bg-white/80 p-2 rounded-md border border-indigo-100">
                          {st.calculation}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-slate-900 text-white text-xs space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block font-semibold">
                    Takeaway Rule:
                  </span>
                  <p className="text-slate-200 leading-relaxed">{data.stepByStepExample.solutionSummary}</p>
                </div>
              </div>

              {/* SECTION 3: Quick Checkpoint Question */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
                    <IconZap className="w-4 h-4 text-amber-500" />
                    <span>3. Quick Intuition Checkpoint</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">1 Question</span>
                </div>

                <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                  {data.checkpointQuestion.question}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {data.checkpointQuestion.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isTheCorrectOne = idx === data.checkpointQuestion.correctIndex;

                    let btnStyle = 'border-slate-200 bg-slate-50 hover:bg-white hover:border-indigo-300 text-slate-800';

                    if (hasCheckedAnswer) {
                      if (isTheCorrectOne) {
                        btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                      } else if (isSelected) {
                        btnStyle = 'border-rose-400 bg-rose-50 text-rose-950';
                      } else {
                        btnStyle = 'border-slate-200 bg-slate-50/50 text-slate-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={hasCheckedAnswer}
                        className={`p-3.5 rounded-xl border text-xs text-left transition-all flex items-center justify-between gap-2 cursor-pointer btn-tactile ${btnStyle}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-md bg-white border border-slate-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{option}</span>
                        </div>
                        {hasCheckedAnswer && isTheCorrectOne && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        {hasCheckedAnswer && isSelected && !isTheCorrectOne && (
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {hasCheckedAnswer && (
                  <div
                    className={`p-4 rounded-xl text-xs space-y-1.5 animate-in fade-in duration-200 ${
                      isCorrect
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-950'
                        : 'bg-amber-50 border border-amber-200 text-amber-950'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold">
                      {isCorrect ? (
                        <>
                          <IconCheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>Spot on! Your intuition is clear.</span>
                        </>
                      ) : (
                        <>
                          <IconAlertTriangle className="w-4 h-4 text-amber-600" />
                          <span>Close! Here is the foundational rule to remember:</span>
                        </>
                      )}
                    </div>
                    <p className="text-[11px] leading-relaxed pl-6">
                      {data.checkpointQuestion.explanation}
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            onClick={() => {
              setIsLoading(true);
              setSelectedOption(null);
              setHasCheckedAnswer(false);
              generateAdaptiveConceptExplanation(topic, subject, struggleContext).then((res) => {
                setData(res);
                setIsLoading(false);
              });
            }}
            disabled={isLoading}
            className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Regenerate Analogy</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer btn-tactile"
          >
            <span>Got It, Return to Practice</span>
            <IconArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
