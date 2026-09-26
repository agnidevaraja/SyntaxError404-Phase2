import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  IconBookOpen,
  IconCheckCircle,
  IconArrowRight,
  IconFileText,
  IconUpload,
  IconZap,
  IconSparkles,
  IconX,
} from '../common/Icons';
import {
  Download,
  Eye,
  Calculator,
  Atom,
  FlaskConical,
  Dna,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { GRADE_9_FULL_SYLLABUS_SUBJECTS } from '../../data/mockStudentHubData';

export const StudentMainHub: React.FC = () => {
  const {
    studentTasks,
    toggleTaskCompleted,
    setActiveView,
    diagnosticSubmission,
    economicsDiagnosticSubmission,
    setIsDiagnosticOpen,
    setActiveDiagnosticSubject,
    showToast,
    authUser,
  } = useApp();

  const [uploadedSyllabusName, setUploadedSyllabusName] = useState<string>(
    'Grade_9_Full_Exam_Syllabus_Focus.pdf'
  );
  const [uploadedSyllabusDate, setUploadedSyllabusDate] = useState<string>('Official Curriculum · 2026');
  const [uploadedSyllabusSize, setUploadedSyllabusSize] = useState<string>('1.8 MB');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // In-App Document Viewer Modal state
  const [isDocModalOpen, setIsDocModalOpen] = useState<boolean>(false);
  const [selectedSubjectTab, setSelectedSubjectTab] = useState<string>('ALL');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedSyllabusName(file.name);
      setUploadedSyllabusDate('Uploaded just now');
      setUploadedSyllabusSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      showToast(
        'Syllabus File Uploaded',
        `"${file.name}" is now set as your active Grade 9 Syllabus Focus.`,
        'success'
      );
    }
  };

  const getSubjectIcon = (sub: string) => {
    switch (sub) {
      case 'Mathematics':
        return <Calculator className="w-5 h-5 text-blue-600" />;
      case 'Physics':
        return <Atom className="w-5 h-5 text-violet-600" />;
      case 'Chemistry':
        return <FlaskConical className="w-5 h-5 text-indigo-600" />;
      case 'Biology':
        return <Dna className="w-5 h-5 text-emerald-600" />;
      default:
        return <Layers className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Welcome Banner - Grade 9 Academic Profile */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
            <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/60">
              Grade 9
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Student Learning Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Welcome back, {authUser?.displayName || 'Demo Student'}. Access your Grade 9 Full Exam Syllabus (Mathematics & Core Sciences), manage daily tasks, and explore your enrolled subjects below.
          </p>
        </div>
      </div>

      {/* SECTION 1: Full Exam Syllabus Focus (Grade 9: Mathematics & All 3 Sciences) */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200/80 text-indigo-600 flex items-center justify-center shrink-0">
              <IconBookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Grade 9 Full Academic Syllabus Focus
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
                  Math & 3 Sciences
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Official curriculum scope covering Mathematics, Physics, Chemistry, and Biology.
              </p>
            </div>
          </div>

          {/* Action Buttons: View Document, Download PDF, Upload */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setSelectedSubjectTab('ALL');
                setIsDocModalOpen(true);
              }}
              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs btn-tactile"
              title="View full curriculum document in browser"
            >
              <Eye className="w-4 h-4" />
              <span>View Document</span>
            </button>

            <a
              href="/documents/Grade_9_Full_Exam_Syllabus_Focus.pdf"
              download="Grade_9_Full_Exam_Syllabus_Focus.pdf"
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs btn-tactile"
              title="Download official PDF file"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Download PDF</span>
            </a>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs btn-tactile"
              title="Upload your school's syllabus file"
            >
              <IconUpload className="w-4 h-4" />
              <span>Upload Custom</span>
            </button>
          </div>
        </div>

        {/* Uploaded File Banner */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-lg bg-indigo-600 text-white shrink-0 shadow-2xs">
              <IconFileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">{uploadedSyllabusName}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Active Syllabus Focus
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {uploadedSyllabusSize} · {uploadedSyllabusDate} · Formatted for Grade 9 Term Exams
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
            <span>4 Academic Disciplines</span>
            <span>·</span>
            <span>16 Core Units Total</span>
          </div>
        </div>

        {/* 4 Subject Focus Cards (Math, Physics, Chemistry, Biology) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {GRADE_9_FULL_SYLLABUS_SUBJECTS.map((sub) => (
            <div
              key={sub.code}
              onClick={() => {
                setSelectedSubjectTab(sub.subject);
                setIsDocModalOpen(true);
              }}
              className="p-5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 card-hover transition-all flex flex-col justify-between space-y-4 shadow-xs cursor-pointer group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {getSubjectIcon(sub.subject)}
                  </div>
                  <span className="text-[11px] font-bold font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {sub.weighting.split(' ')[0]} Weight
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {sub.subject}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                    {sub.code} · {sub.examDuration}
                  </span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {sub.summary}
                </p>
              </div>

              {/* Units summary list */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  4 Core Units Covered:
                </span>
                <div className="space-y-1">
                  {sub.units.map((u) => (
                    <div key={u.unitCode} className="text-[11px] text-slate-600 flex items-center gap-1.5 truncate">
                      <span className="w-1.5 h-1.5 rounded-xs bg-indigo-500 shrink-0" />
                      <span className="truncate">{u.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:text-indigo-800">
                <span>View Full Syllabus Scope</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: Daily Tasks */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <IconFileText className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              Daily Tasks
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            {studentTasks.filter((t) => t.completed).length} of {studentTasks.length} Completed
          </span>
        </div>

        <div className="space-y-2.5">
          {studentTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTaskCompleted(task.id)}
              className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 cursor-pointer ${
                task.completed
                  ? 'bg-slate-50 border-slate-200 opacity-70'
                  : 'bg-white border-slate-200 hover:border-indigo-300 shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <button
                  type="button"
                  className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                    task.completed
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 hover:border-indigo-500 bg-white'
                  }`}
                >
                  {task.completed && <IconCheckCircle className="w-3.5 h-3.5" />}
                </button>

                <div>
                  <div
                    className={`text-xs font-bold ${
                      task.completed ? 'line-through text-slate-500' : 'text-slate-900'
                    }`}
                  >
                    {task.title}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <span>Due: {task.dueDate}</span>
                    <span>·</span>
                    <span className="text-indigo-600 font-semibold">{task.subject}</span>
                    {task.priority === 'high' && (
                      <span className="text-rose-600 font-bold bg-rose-50 px-1.5 py-0.2 rounded text-[10px]">
                        Priority
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {!task.completed && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveView('subject_chemistry');
                  }}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-all shrink-0 flex items-center gap-1.5 cursor-pointer btn-tactile"
                >
                  <IconZap className="w-3.5 h-3.5" />
                  <span>Start in Chemistry</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: My Subjects (Chemistry & Economics) */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              My Subjects
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enrolled Academic Courses · Personalized Adaptive Learning Spaces
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
            2 Subjects Enrolled
          </span>
        </div>

        <div className="space-y-5">
          {/* Subject 1: Chemistry Card */}
          <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 card-hover border border-indigo-900/40">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold text-indigo-300 bg-indigo-950/80 border border-indigo-700/60 px-2.5 py-1 rounded-md">
                  Subject: Chemistry · Grade 9
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded border border-emerald-500/30">
                  STEM Sciences
                </span>
              </div>

              <h3 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                <FlaskConical className="w-6 h-6 text-indigo-400" />
                <span>Chemistry</span>
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Instructor: <strong className="text-white font-semibold">Dr. Eleanor Vance</strong>. Access your Chemistry Syllabus Focus (The Mole Concept, Redox Reactions, & Stoichiometry), view lecture presentations, and take diagnostic calibrations.
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-indigo-200 pt-1">
                <span>Class Drive: <strong>2 Lecture Decks</strong></span>
                <span>·</span>
                <span>
                  Diagnostic Calibration:{' '}
                  <strong className={diagnosticSubmission ? 'text-emerald-400' : 'text-amber-300'}>
                    {diagnosticSubmission ? `Calibrated (${diagnosticSubmission.score}/10)` : 'Ready to Start'}
                  </strong>
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              {diagnosticSubmission ? (
                <button
                  onClick={() => setActiveView('personalized_learning')}
                  className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer btn-tactile"
                >
                  <IconSparkles className="w-4 h-4 text-indigo-300" />
                  <span>Personalized Learning</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setActiveDiagnosticSubject('chemistry');
                    setIsDiagnosticOpen(true);
                  }}
                  className="px-5 py-3.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 font-bold text-sm rounded-xl border border-indigo-400/40 transition-all flex items-center justify-center gap-2 cursor-pointer btn-tactile"
                >
                  <IconSparkles className="w-4 h-4 text-amber-300" />
                  <span>Take Diagnostic to Unlock</span>
                </button>
              )}

              <button
                onClick={() => setActiveView('subject_chemistry')}
                className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer group btn-tactile"
              >
                <span>Open Chemistry Page</span>
                <IconArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Subject 2: Economics Card */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/80 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 card-hover border border-amber-900/40">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold text-amber-300 bg-amber-950/80 border border-amber-700/60 px-2.5 py-1 rounded-md">
                  Subject: Economics · Grade 9
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded border border-amber-500/30">
                  Social Sciences & Finance
                </span>
              </div>

              <h3 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                <TrendingUp className="w-6 h-6 text-amber-400" />
                <span>Economics</span>
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Instructor: <strong className="text-white font-semibold">Prof. Arthur Sterling</strong>. Master fundamental microeconomics (Scarcity, Opportunity Cost, PPC, & Market Supply & Demand), calibrate with the diagnostic assessment, and discover international competitions.
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-amber-200/90 pt-1">
                <span>Class Drive: <strong>3 Lecture Decks</strong></span>
                <span>·</span>
                <span>
                  Diagnostic Calibration:{' '}
                  <strong className={economicsDiagnosticSubmission ? 'text-emerald-400' : 'text-amber-300'}>
                    {economicsDiagnosticSubmission ? `Calibrated (${economicsDiagnosticSubmission.score}/10)` : 'Diagnostic Required'}
                  </strong>
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              {economicsDiagnosticSubmission ? (
                <button
                  onClick={() => setActiveView('personalized_learning_economics')}
                  className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer btn-tactile"
                >
                  <IconSparkles className="w-4 h-4 text-amber-300" />
                  <span>Personalized Learning</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setActiveDiagnosticSubject('economics');
                    setIsDiagnosticOpen(true);
                  }}
                  className="px-5 py-3.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-bold text-sm rounded-xl border border-amber-400/40 transition-all flex items-center justify-center gap-2 cursor-pointer btn-tactile"
                >
                  <IconSparkles className="w-4 h-4 text-amber-300" />
                  <span>Take Diagnostic to Unlock</span>
                </button>
              )}

              <button
                onClick={() => setActiveView('subject_economics')}
                className="px-6 py-3.5 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer group btn-tactile"
              >
                <span>Open Economics Page</span>
                <IconArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FULL SYLLABUS INTERACTIVE DOCUMENT VIEWER MODAL */}
      {isDocModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <IconBookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Grade 9 Full Academic Syllabus Document
                  </h3>
                  <div className="text-xs text-slate-500">
                    Grade 9 · Term 1 Examination Scope
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="/documents/Grade_9_Full_Exam_Syllabus_Focus.pdf"
                  download="Grade_9_Full_Exam_Syllabus_Focus.pdf"
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>

                <button
                  onClick={() => setIsDocModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <IconX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Subject Tabs */}
            <div className="px-6 py-2.5 border-b border-slate-200 bg-white flex items-center gap-1 overflow-x-auto shrink-0">
              {['ALL', 'Mathematics', 'Physics', 'Chemistry', 'Biology'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedSubjectTab(tab)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    selectedSubjectTab === tab
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab === 'ALL' ? 'All 4 Disciplines' : tab}
                </button>
              ))}
            </div>

            {/* Document Content Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {GRADE_9_FULL_SYLLABUS_SUBJECTS
                .filter((sub) => selectedSubjectTab === 'ALL' || sub.subject === selectedSubjectTab)
                .map((sub) => (
                  <div key={sub.code} className="border border-slate-200 rounded-xl p-5 bg-white space-y-4 shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        {getSubjectIcon(sub.subject)}
                        <h4 className="text-base font-bold text-slate-900">
                          {sub.subject} ({sub.code})
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200/60">
                          {sub.weighting}
                        </span>
                        <span className="text-slate-500">
                          Duration: {sub.examDuration}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {sub.summary}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      {sub.units.map((u) => (
                        <div key={u.unitCode} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white text-indigo-700 border border-slate-200">
                              {u.unitCode} · {u.weight}
                            </span>
                          </div>

                          <h5 className="text-xs font-bold text-slate-900">
                            {u.title}
                          </h5>

                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              Key Topics:
                            </span>
                            <ul className="text-[11px] text-slate-600 list-disc list-inside space-y-0.5">
                              {u.topics.map((t, idx) => (
                                <li key={idx}>{t}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="pt-1.5 border-t border-slate-200/60 text-[10px] text-rose-700">
                            <strong>Common Diagnostic Trap:</strong> {u.coreTrap}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
