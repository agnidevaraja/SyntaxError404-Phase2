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
} from '../common/Icons';
import { SevenDayProficiencyChart } from '../common/SevenDayProficiencyChart';
import { ACHALESH_WEEKLY_PROGRESSION } from '../../data/weeklyProficiencyData';

export const StudentMainHub: React.FC = () => {
  const {
    syllabusFocus,
    studentTasks,
    toggleTaskCompleted,
    setActiveView,
    diagnosticSubmission,
    showToast,
  } = useApp();

  const [uploadedSyllabusName, setUploadedSyllabusName] = useState<string>(
    'Term_1_General_Exam_Syllabus_Focus.pdf'
  );
  const [uploadedSyllabusDate, setUploadedSyllabusDate] = useState<string>('Uploaded Sep 20, 2026');
  const [uploadedSyllabusSize, setUploadedSyllabusSize] = useState<string>('1.4 MB');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedSyllabusName(file.name);
      setUploadedSyllabusDate('Uploaded just now');
      setUploadedSyllabusSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      showToast(
        'Syllabus File Uploaded',
        `"${file.name}" is now set as your active Full Exam Syllabus Focus.`,
        'success'
      );
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
            <span>St. Jude Preparatory Academy</span>
            <span aria-hidden="true">·</span>
            <span>Grade 10</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Student Learning Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
            Welcome back, Achalesh. Check your exam syllabus focus file, review your daily tasks, and access your subject below.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveView('subject_chemistry')}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer btn-tactile group"
          >
            <span>Go to Chemistry</span>
            <IconArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* SECTION 1: Full Exam Syllabus Focus (With File Upload & No Mastery Progress) */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-200/80 text-indigo-600 flex items-center justify-center">
              <IconBookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Full Exam Syllabus Focus
              </h2>
              <p className="text-xs text-slate-500">
                Official exam guidelines and unit scope. Upload or replace your syllabus document.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,.txt,.png,.jpg"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-200/80 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs btn-tactile"
            >
              <IconUpload className="w-4 h-4" />
              <span>Upload Syllabus File</span>
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
                  Active Syllabus File
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {uploadedSyllabusSize} · {uploadedSyllabusDate} · Formatted for Term Exams
              </div>
            </div>
          </div>

          <div className="text-xs font-semibold text-slate-600">
            5 Exam Units Covered
          </div>
        </div>

        {/* Syllabus Units (Clean Exam Focus without mastery progress) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {syllabusFocus.map((unit) => (
            <div
              key={unit.id}
              className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 card-hover transition-all flex flex-col justify-between space-y-3 shadow-xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {unit.weighting}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {unit.targetDate}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {unit.unitTitle}
                </h3>

                <p className="text-xs text-slate-500">
                  Exam Scope: <span className="text-slate-700 font-medium">{unit.examRelevance}</span>
                </p>
              </div>

              {/* Core Topics Checklist */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Core Key Topics on Exam:
                </span>
                <div className="flex flex-wrap gap-1">
                  {unit.keyTopics.map((topic: string, i: number) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
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
              className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 cursor-pointer btn-tactile ${
                task.completed
                  ? 'bg-slate-50/70 border-slate-200 text-slate-400'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 text-slate-800 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompleted(task.id)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <div>
                  <h3
                    className={`text-xs sm:text-sm font-semibold transition-all ${
                      task.completed ? 'text-slate-400 line-through' : 'text-slate-900'
                    }`}
                  >
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span>Due: {task.dueDate}</span>
                    <span>·</span>
                    <span className="font-medium text-slate-600">{task.subject}</span>
                    {task.priority === 'high' && !task.completed && (
                      <>
                        <span>·</span>
                        <span className="text-rose-700 bg-rose-50 border border-rose-200/80 px-2 py-0.5 rounded text-[11px] font-bold">
                          High Priority
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {task.type === 'diagnostic' && !task.completed && (
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

      {/* SECTION 3: My Subjects (Only Chemistry - Clean) */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">
            My Subjects
          </h2>
          <span className="text-xs text-slate-500">
            Enrolled Subjects
          </span>
        </div>

        {/* Clean Subject Chemistry Card */}
        <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 card-hover">
          <div className="space-y-3">
            <span className="text-xs font-mono font-semibold text-indigo-300 bg-indigo-950/80 border border-indigo-700/60 px-2.5 py-1 rounded-md">
              Subject: Chemistry
            </span>

            <h3 className="text-2xl font-bold tracking-tight text-white">
              Chemistry
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Instructor: <strong className="text-white font-semibold">Dr. Eleanor Vance</strong>. Access your class presentation slides, study materials, and take your weekly 10-question personalized diagnostic setup.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-indigo-200 pt-1">
              <span>Class Drive: <strong>2 Lecture Decks</strong></span>
              <span>·</span>
              <span>
                Diagnostic Status:{' '}
                <strong className={diagnosticSubmission ? 'text-emerald-400' : 'text-amber-300'}>
                  {diagnosticSubmission ? `Calibrated (${diagnosticSubmission.score}/10)` : 'Ready to Start'}
                </strong>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {diagnosticSubmission && (
              <button
                onClick={() => setActiveView('personalized_learning')}
                className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer btn-tactile"
              >
                <IconSparkles className="w-4 h-4 text-indigo-300" />
                <span>Personalized Learning</span>
              </button>
            )}

            <button
              onClick={() => setActiveView('subject_chemistry')}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer group btn-tactile"
            >
              <span>Open Chemistry</span>
              <IconArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 4: 7-Day Daily Quiz & Chemistry Proficiency Growth */}
      <section className="space-y-4">
        <SevenDayProficiencyChart progression={ACHALESH_WEEKLY_PROGRESSION} />
      </section>
    </div>
  );
};
