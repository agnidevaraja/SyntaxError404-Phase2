import React from 'react';
import { DiagnosticSubmission, ConceptNode } from '../../types';
import { CURRICULUM_CONCEPT_NODES } from '../../data/diagnosticQuestions';
import { ECONOMICS_CONCEPT_NODES } from '../../data/mockEconomicsData';
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Award,
  Layers,
  HelpCircle,
} from 'lucide-react';

export interface ConceptKnowledgeGraphProps {
  diagnosticSubmission?: DiagnosticSubmission | null;
  selectedPackageId?: string;
  onSelectPackage?: (packageId: string) => void;
  className?: string;
  subject?: 'chemistry' | 'economics';
  activeUnitId?: string;
  onSelectNode?: (node: ConceptNode) => void;
}

export const ConceptKnowledgeGraph: React.FC<ConceptKnowledgeGraphProps> = ({
  diagnosticSubmission = null,
  selectedPackageId,
  onSelectPackage,
  className = '',
  subject = 'chemistry',
  activeUnitId,
  onSelectNode,
}) => {
  const isEcon = subject === 'economics';
  const nodes = isEcon ? ECONOMICS_CONCEPT_NODES : CURRICULUM_CONCEPT_NODES;

  const isPerfectScore = diagnosticSubmission?.generatedLearningPlan?.isPerfectScore ?? false;
  const weakUnits = diagnosticSubmission?.weakUnitIds ?? [];

  // Count how many nodes are fully mastered
  const masteredCount = diagnosticSubmission
    ? nodes.filter((n) => !weakUnits.includes(n.unitId)).length
    : nodes.length;

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-5 ${className}`}>
      
      {/* Knowledge Graph Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
            isEcon
              ? 'bg-emerald-50 border-emerald-200/80 text-emerald-700'
              : 'bg-indigo-50 border-indigo-200/80 text-indigo-600'
          }`}>
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                {isEcon ? 'Grade 9 Economics Concept Dependency Graph' : 'Grade 9 Chemistry Concept Dependency Graph'}
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                isEcon
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}>
                {nodes.length} Sequenced Nodes
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {isEcon
                ? 'Prerequisite mastery mapping across scarcity, opportunity cost, supply & demand, and price equilibrium.'
                : 'Prerequisite mastery mapping across atomic structure, mole conversions, and reaction stoichiometry.'}
            </p>
          </div>
        </div>

        {/* Global Mastery Status Pill */}
        <div className="flex items-center gap-2 shrink-0">
          {diagnosticSubmission ? (
            isPerfectScore ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>{nodes.length}/{nodes.length} Nodes Mastered (100% Mastery)</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold">
                <span className={`font-mono font-bold ${isEcon ? 'text-emerald-700' : 'text-indigo-600'}`}>
                  {masteredCount} / {nodes.length}
                </span>
                <span>Nodes Mastered · {weakUnits.length} Remediation Target{weakUnits.length > 1 ? 's' : ''}</span>
              </div>
            )
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium">
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>Standard Baseline Calibration</span>
            </div>
          )}
        </div>
      </div>

      {/* Nodes Visual Grid with Dependency Connectors */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 relative">
        {nodes.map((node) => {
          const isSelected = selectedPackageId === node.packageId || (activeUnitId && activeUnitId === node.unitId);
          const isUnitMissed = weakUnits.includes(node.unitId);
          const isMastered = diagnosticSubmission ? !isUnitMissed : true;
          
          // Count mistakes specifically in this node's questions
          const missedInNode = diagnosticSubmission?.missedQuestions.filter(
            (m) => node.questionNumbers.includes(m.questionNumber)
          ).length || 0;

          return (
            <div
              key={node.unitId}
              onClick={() => {
                if (onSelectPackage) onSelectPackage(node.packageId);
                if (onSelectNode) onSelectNode(node);
              }}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between space-y-3 cursor-pointer btn-tactile relative group ${
                isSelected
                  ? isEcon
                    ? 'ring-2 ring-emerald-600 shadow-xs'
                    : 'ring-2 ring-indigo-600 shadow-xs'
                  : 'hover:shadow-xs'
              } ${
                diagnosticSubmission
                  ? isMastered
                    ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/70'
                    : 'bg-rose-50/40 border-rose-200 hover:border-rose-400 hover:bg-rose-50/70'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-2">
                {/* Node Level and Mastery Status */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Node {node.unitNumber}
                  </span>
                  
                  {diagnosticSubmission ? (
                    isMastered ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Mastered</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        <span>{missedInNode} Missed</span>
                      </span>
                    )
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      Calibrated
                    </span>
                  )}
                </div>

                {/* Node Name */}
                <div>
                  <h4 className={`text-xs font-bold text-slate-900 transition-colors leading-snug line-clamp-2 ${
                    isEcon ? 'group-hover:text-emerald-700' : 'group-hover:text-indigo-600'
                  }`}>
                    {node.shortTitle}
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                    Q{node.questionNumbers.join(', Q')}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {node.keyConcept}
                </p>
              </div>

              {/* Action / Select Callout */}
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold">
                <span className={isSelected ? (isEcon ? 'text-emerald-700 font-bold' : 'text-indigo-700 font-bold') : 'text-slate-500'}>
                  {isSelected ? 'Viewing' : 'Select'}
                </span>
                <ArrowRight
                  className={`w-3 h-3 transition-transform ${
                    isSelected
                      ? isEcon
                        ? 'text-emerald-600 translate-x-1'
                        : 'text-indigo-600 translate-x-1'
                      : 'text-slate-400'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bonus Olympiad Honors Extension Banner (Shown if Perfect 10/10 Score) */}
      {isPerfectScore && (
        <div
          onClick={() => onSelectPackage && onSelectPackage(isEcon ? 'econ_market_equilibrium' : 'olympiad_enrichment')}
          className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 btn-tactile ${
            selectedPackageId === (isEcon ? 'econ_market_equilibrium' : 'olympiad_enrichment')
              ? isEcon
                ? 'border-emerald-600 bg-gradient-to-r from-emerald-950 to-slate-900 text-white ring-2 ring-emerald-500'
                : 'border-indigo-600 bg-gradient-to-r from-indigo-900 to-indigo-950 text-white ring-2 ring-indigo-500'
              : isEcon
                ? 'border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-950'
                : 'border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100/70 text-indigo-950'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className={`w-10 h-10 rounded-xl text-white flex items-center justify-center shrink-0 shadow-xs ${
              isEcon ? 'bg-amber-600' : 'bg-amber-500'
            }`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-100 px-2 py-0.5 rounded">
                  {isEcon ? 'Economics Olympiad Extension Unlocked' : 'Olympiad Extension Unlocked'}
                </span>
                <span className="text-xs font-mono font-semibold opacity-75">100% Score Reward</span>
              </div>
              <h4 className="text-sm font-bold mt-0.5">
                {isEcon
                  ? 'Advanced Macro & International Trade Policy Sandbox'
                  : 'Advanced Olympiad Extension: Real Gas Corrections & Multi-Phase Stoichiometry'}
              </h4>
              <p className="text-xs opacity-80 mt-0.5">
                {isEcon
                  ? 'All 5 core microeconomic foundation nodes mastered flawlessly. Explore deadweight loss models and fiscal policy.'
                  : 'All 5 foundational curriculum nodes mastered flawlessly. Explore non-ideal gas laws and college-level kinetics.'}
              </p>
            </div>
          </div>

          <button
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors shrink-0 ${
              selectedPackageId === (isEcon ? 'econ_market_equilibrium' : 'olympiad_enrichment')
                ? 'bg-white ' + (isEcon ? 'text-emerald-950' : 'text-indigo-950')
                : isEcon
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {selectedPackageId === (isEcon ? 'econ_market_equilibrium' : 'olympiad_enrichment')
              ? 'Currently Selected'
              : 'Explore Advanced Deck ➔'}
          </button>
        </div>
      )}

      {/* Conceptual Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-[11px] text-slate-500 border-t border-slate-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
            <span>Mastered (0 Missed)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-rose-500" />
            <span>Remediation Target (&gt;=1 Missed)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-xs ${isEcon ? 'bg-emerald-600' : 'bg-indigo-500'}`} />
            <span>Currently Selected</span>
          </div>
        </div>

        <span>Click any node to dynamically load its tailored presentation deck and materials</span>
      </div>
    </div>
  );
};
