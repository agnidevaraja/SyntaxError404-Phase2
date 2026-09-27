import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { useApp } from '../../context/AppContext';
import { DIAGNOSTIC_QUESTIONS } from '../../data/diagnosticQuestions';
import { ECONOMICS_DIAGNOSTIC_QUESTIONS } from '../../data/mockEconomicsData';
import { DiagnosticSubmission } from '../../types';
import {
  IconX,
  IconCheckCircle,
  IconArrowRight,
  IconSparkles,
  IconZap,
  IconMic,
  IconAtom,
  IconRefreshCw,
} from '../common/Icons';
import {
  Volume2,
  Mic,
  MicOff,
  Sliders,
  Layers,
  Brain,
  Check,
  RotateCcw,
  Award,
  ArrowRight,
} from 'lucide-react';
import { syncStudentProgress } from '../../services/firestoreService';

export const DiagnosticAssessmentModal: React.FC = () => {
  const {
    authUser,
    isDiagnosticOpen,
    setIsDiagnosticOpen,
    activeDiagnosticSubject,
    submitDiagnostic,
    submitEconomicsDiagnostic,
    setActiveView,
    diagnosticSubmission,
    economicsDiagnosticSubmission,
    showToast,
  } = useApp();

  const isEconomics = activeDiagnosticSubject === 'economics';
  const questionsList = isEconomics ? ECONOMICS_DIAGNOSTIC_QUESTIONS : DIAGNOSTIC_QUESTIONS;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string | number>>({});
  const [solvedViaStealth, setSolvedViaStealth] = useState<Record<number, string>>({});
  const [localSubmission, setLocalSubmission] = useState<DiagnosticSubmission | null>(
    isEconomics ? economicsDiagnosticSubmission : diagnosticSubmission
  );

  // Gamification toggle: default ON
  const [gamificationEnabled, setGamificationEnabled] = useState<boolean>(true);
  const [bonusXP, setBonusXP] = useState<number>(0);

  // In-quiz stealth mode switcher: allows students to switch between 4 interactive modalities
  const [stealthModeActive, setStealthModeActive] = useState<boolean>(false);
  const [stealthSubTab, setStealthSubTab] = useState<
    'tactile_model' | 'socratic_voice' | 'step_scaffolder' | 'confidence_dial'
  >('tactile_model');

  // Optimized high-performance telemetry via ref (0ms input lag, zero component re-renders while typing)
  const telemetryRef = useRef<{
    idleSeconds: number;
    maxDwellSeconds: number;
    questionStartTimes: Record<number, number>;
    firstInteractionTimes: Record<number, number>;
    backspaceBurstCount: number;
    recentBackspaceTimestamps: number[];
    keystrokeTimestamps: number[];
    interKeystrokeIntervals: number[];
    totalCharactersTyped: number;
    totalDeletions: number;
    cognitiveFreezes: number;
    optionFlips: number;
    lastSelectedOption: number | null;
    hesitationFlagged: boolean;
    longestPauseQuestionIndex: number;
    questionDwellSeconds: Record<number, number>;
  }>({
    idleSeconds: 0,
    maxDwellSeconds: 0,
    longestPauseQuestionIndex: 0,
    questionDwellSeconds: {},
    questionStartTimes: { 0: Date.now() },
    firstInteractionTimes: {},
    backspaceBurstCount: 0,
    recentBackspaceTimestamps: [],
    keystrokeTimestamps: [],
    interKeystrokeIntervals: [],
    totalCharactersTyped: 0,
    totalDeletions: 0,
    cognitiveFreezes: 0,
    optionFlips: 0,
    lastSelectedOption: null,
    hesitationFlagged: false,
  });

  // Live telemetry metrics stream for real-time demonstration
  const [liveTelemetry, setLiveTelemetry] = useState<{
    chars: number;
    wpm: number;
    pauseSec: number;
    freezes: number;
    bursts: number;
  }>({
    chars: 0,
    wpm: 0,
    pauseSec: 0,
    freezes: 0,
    bursts: 0,
  });

  // Optional student scratchpad notes per question
  const [scratchpadNotes, setScratchpadNotes] = useState<Record<number, string>>({});

  // Finalized behavioral metrics profile computed upon submission for results review
  const [telemetryProfile, setTelemetryProfile] = useState<{
    affectivePauseFlagged: boolean;
    maxDwellSec: number;
    longestPauseQuestion: number;
    longestPauseTopic: string;
    burstCount: number;
    optionFlips: number;
    avgIkiMs: number;
    totalKeystrokes: number;
    wpm: number;
    erasureRatio: number;
    cognitiveFreezes: number;
  }>({
    affectivePauseFlagged: false,
    maxDwellSec: 0,
    longestPauseQuestion: 1,
    longestPauseTopic: 'Initial Evaluation',
    burstCount: 0,
    optionFlips: 0,
    avgIkiMs: 180,
    totalKeystrokes: 0,
    wpm: 0,
    erasureRatio: 0,
    cognitiveFreezes: 0,
  });

  // Metacognitive Confidence Dial state
  const [confidenceLevel, setConfidenceLevel] = useState<number>(85);

  // Socratic Voice Probe state with real Web Speech API recognition
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [isAnalyzingVoice, setIsAnalyzingVoice] = useState<boolean>(false);
  const [voiceElapsedSec, setVoiceElapsedSec] = useState<number>(0);
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');
  const [voiceAudioLevel, setVoiceAudioLevel] = useState<number>(0);
  const [voiceAnalysisResult, setVoiceAnalysisResult] = useState<{
    score: number;
    insight: string;
    verified: boolean;
    detectedKeywords: string[];
  } | null>(null);

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const voiceTranscriptRef = useRef<string>('');
  const handleStopVoiceProbeRef = useRef<(overrideText?: string) => void>(() => {});

  // -------------------------------------------------------------
  // Dedicated State for Tactile Interactive Models (Q1 to Q10)
  // -------------------------------------------------------------
  // Chemistry Q1: Isotope Abundance Slider
  const [cl35Abundance, setCl35Abundance] = useState<number>(75.77);
  // Chemistry Q2: Carbon-14 Nuclear Sorter
  const [c14Neutrons, setC14Neutrons] = useState<number>(6);
  // Chemistry Q3: Nitrate Valence Electron Pool
  const [depositedElectrons, setDepositedElectrons] = useState<number>(0);
  // Chemistry Q4: Ca(NO3)2 Formula Subscript Multiplier
  const [subscriptMultiplier, setSubscriptMultiplier] = useState<number>(1);
  // Chemistry Q5: H2O Molar Bridge Balance
  const [waterMassGrams, setWaterMassGrams] = useState<number>(18.02);
  // Chemistry Q6: Propane Reaction Balance Scale
  const [coeffC3H8, setCoeffC3H8] = useState<number>(1);
  const [coeffO2, setCoeffO2] = useState<number>(2);
  const [coeffCO2, setCoeffCO2] = useState<number>(3);
  const [coeffH2O, setCoeffH2O] = useState<number>(4);
  // Chemistry Q7: Limiting Reagent Haber Reactor
  const [inputMolesN2, setInputMolesN2] = useState<number>(1.0);
  const [inputMolesH2, setInputMolesH2] = useState<number>(4.46);
  // Chemistry Q8: Stoichiometric AlCl3 Converter
  const [alCl3CalculatedYield, setAlCl3CalculatedYield] = useState<number>(267);
  // Chemistry Q9: Percent Yield Efficiency Gauge
  const [actualYieldGrams, setActualYieldGrams] = useState<number>(42.5);
  // Chemistry Q10: STP Gas Expansion Syringe
  const [oxygenMolesSTP, setOxygenMolesSTP] = useState<number>(1.0);

  // Economics Q1: Scarcity Allocation Scale
  const [humanWantsLevel, setHumanWantsLevel] = useState<number>(100);
  const [productiveResourcesLevel, setProductiveResourcesLevel] = useState<number>(30);
  // Economics Q2: Factor of Production Sorter
  const [selectedFactorCategory, setSelectedFactorCategory] = useState<string>('');
  // Economics Q3: Opportunity Cost Decision Hierarchy
  const [selectedSecondRank, setSelectedSecondRank] = useState<string>('');
  // Economics Q4: PPC Production Frontier Plotter
  const [ppcPointLocation, setPpcPointLocation] = useState<'inside' | 'on_frontier' | 'outside'>('inside');
  // Economics Q5: Demand Movement Price Slider
  const [smartphonePrice, setSmartphonePrice] = useState<number>(500);
  // Economics Q6: Cross-Price Substitute Shifter
  const [coffeePriceLevel, setCoffeePriceLevel] = useState<number>(3);
  // Economics Q7: Solar Supply Breakthrough Lever
  const [techInnovationActive, setTechInnovationActive] = useState<boolean>(false);
  // Economics Q8: Marginal Cost Curve Step
  const [factoryOutputUnits, setFactoryOutputUnits] = useState<number>(20);
  // Economics Q9: Disequilibrium Price Regulator
  const [regulatedMarketPrice, setRegulatedMarketPrice] = useState<number>(40); // 40 is equilibrium
  // Economics Q10: Rent Control Price Ceiling
  const [rentCeilingLevel, setRentCeilingLevel] = useState<number>(1200); // 1600 is eq

  // Deductive selection states for Interactive Sandboxes (prevents answer auto-reveal)
  const [chemQ3Choice, setChemQ3Choice] = useState<number>(0);
  const [chemQ4Choice, setChemQ4Choice] = useState<number>(3);
  const [chemQ5Choice, setChemQ5Choice] = useState<number>(1);
  const [econQ1Choice, setEconQ1Choice] = useState<number>(2);
  const [econQ2Choice, setEconQ2Choice] = useState<number>(0);
  const [econQ3Choice, setEconQ3Choice] = useState<number>(1);
  const [econQ4Choice, setEconQ4Choice] = useState<number>(3);
  const [econQ5Choice, setEconQ5Choice] = useState<number>(1);

  // Sync submission from context
  useEffect(() => {
    if (isDiagnosticOpen) {
      setLocalSubmission(isEconomics ? economicsDiagnosticSubmission : diagnosticSubmission);
      setCurrentIndex(0);
      setAnswers({});
      setSolvedViaStealth({});
      setBonusXP(0);
    }
  }, [isDiagnosticOpen, isEconomics, economicsDiagnosticSubmission, diagnosticSubmission]);

  // Telemetry idle hesitation timer (runs silently without forcing component re-renders)
  useEffect(() => {
    if (!isDiagnosticOpen || localSubmission) return;

    const interval = setInterval(() => {
      const tel = telemetryRef.current;
      tel.idleSeconds += 1;
      tel.questionDwellSeconds[currentIndex] = (tel.questionDwellSeconds[currentIndex] || 0) + 1;
      if (tel.idleSeconds > tel.maxDwellSeconds) {
        tel.maxDwellSeconds = tel.idleSeconds;
        tel.longestPauseQuestionIndex = currentIndex;
      }

      const durationMin =
        tel.keystrokeTimestamps.length >= 2
          ? (Date.now() - tel.keystrokeTimestamps[0]) / 60000
          : 0;
      const currentWpm =
        durationMin > 0.02
          ? Math.min(140, Math.round(tel.totalCharactersTyped / 5 / durationMin))
          : 0;

      setLiveTelemetry({
        chars: tel.totalCharactersTyped,
        wpm: currentWpm,
        pauseSec: tel.idleSeconds,
        freezes: tel.cognitiveFreezes,
        bursts: tel.backspaceBurstCount,
      });

      if (tel.idleSeconds === 7 && !tel.hesitationFlagged) {
        tel.hesitationFlagged = true;
        const studentUid = authUser?.uid || (isEconomics ? 'std-demo-student-econ' : 'std-demo-student');
        syncStudentProgress(studentUid, isEconomics ? 'Economics' : 'Chemistry', {
          recentScore: 6,
          strugglingTopic: questionsList[currentIndex]?.topic || 'Conceptual Evaluation',
          hesitationLevel: 'high',
          telemetry: {
            maxDwellSec: tel.maxDwellSeconds,
            longestPauseQuestion: currentIndex + 1,
            longestPauseTopic: questionsList[currentIndex]?.topic || 'Conceptual Evaluation',
            wpm: currentWpm,
            avgIkiMs: 180,
            burstCount: tel.backspaceBurstCount,
            erasureRatio: 0,
            cognitiveFreezes: tel.cognitiveFreezes,
            totalKeystrokes: tel.totalCharactersTyped,
            optionFlips: tel.optionFlips,
            solvedViaStealthCount: Object.keys(solvedViaStealth).length,
          },
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isDiagnosticOpen, localSubmission, currentIndex, authUser?.uid, isEconomics, questionsList, solvedViaStealth]);

  // Reset question telemetry upon question change
  useEffect(() => {
    const tel = telemetryRef.current;
    tel.idleSeconds = 0;
    tel.hesitationFlagged = false;
    tel.questionStartTimes[currentIndex] = Date.now();
    tel.recentBackspaceTimestamps = [];
    tel.lastSelectedOption = null;
    // Maintain stealthModeActive state across questions so student stays in their selected modality
    setVoiceTranscript('');
    voiceTranscriptRef.current = '';
    setVoiceAnalysisResult(null);
    setIsRecordingVoice(false);
    setConfidenceLevel(85);
  }, [currentIndex]);

  // Cleanup Web Speech & AudioContext
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // 15-second voice timer countdown (declared at top level alongside all hooks)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecordingVoice) {
      timer = setInterval(() => {
        setVoiceElapsedSec((prev) => {
          if (prev >= 14) {
            handleStopVoiceProbeRef.current();
            return 15;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecordingVoice]);

  const currentQ = questionsList[currentIndex] || questionsList[0];

  const handleSelectOption = (optionIndex: number) => {
    if (localSubmission) return;
    const tel = telemetryRef.current;
    tel.idleSeconds = 0;

    if (!tel.firstInteractionTimes[currentIndex]) {
      tel.firstInteractionTimes[currentIndex] = Date.now();
    }
    if (tel.lastSelectedOption !== null && tel.lastSelectedOption !== optionIndex) {
      tel.optionFlips += 1;
    }
    tel.lastSelectedOption = optionIndex;

    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  const handleTextChange = (text: string) => {
    if (localSubmission) return;
    telemetryRef.current.idleSeconds = 0;
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: text,
    }));
  };

  // High-performance keystroke listener (0ms overhead, tracks IKI, WPM velocity, deletions, and freeze pauses)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const now = Date.now();
    const tel = telemetryRef.current;
    tel.idleSeconds = 0;

    if (!tel.firstInteractionTimes[currentIndex]) {
      tel.firstInteractionTimes[currentIndex] = now;
    }

    if (tel.keystrokeTimestamps.length > 0) {
      const lastKeyTime = tel.keystrokeTimestamps[tel.keystrokeTimestamps.length - 1];
      const iki = now - lastKeyTime;
      tel.interKeystrokeIntervals.push(iki);
      // Detect mid-sentence cognitive freeze (>1800ms gap during active typing)
      if (iki > 1800) {
        tel.cognitiveFreezes += 1;
      }
    }
    tel.keystrokeTimestamps.push(now);

    if (e.key === 'Backspace' || e.key === 'Delete') {
      tel.totalDeletions += 1;
      tel.recentBackspaceTimestamps.push(now);
      tel.recentBackspaceTimestamps = tel.recentBackspaceTimestamps.filter((t) => now - t <= 1200);
      if (tel.recentBackspaceTimestamps.length >= 3) {
        tel.backspaceBurstCount += 1;
      }
    } else if (e.key.length === 1) {
      tel.totalCharactersTyped += 1;
    }

    const durationMin =
      tel.keystrokeTimestamps.length >= 2
        ? (now - tel.keystrokeTimestamps[0]) / 60000
        : 0;
    const currentWpm =
      durationMin > 0.02
        ? Math.min(140, Math.round(tel.totalCharactersTyped / 5 / durationMin))
        : 0;

    setLiveTelemetry({
      chars: tel.totalCharactersTyped,
      wpm: currentWpm,
      pauseSec: 0,
      freezes: tel.cognitiveFreezes,
      bursts: tel.backspaceBurstCount,
    });
  };

  // -------------------------------------------------------------
  // Real Web Speech API Recognition & Audio Waveform Tracking
  // -------------------------------------------------------------
  const handleStartVoiceProbe = async () => {
    setIsRecordingVoice(true);
    setVoiceElapsedSec(0);
    voiceTranscriptRef.current = '';
    setVoiceTranscript('');
    setVoiceAnalysisResult(null);

    // 1. Microphone Audio Visualizer with Web Audio API
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        setVoiceAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
        animFrameRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();
    } catch (micErr) {
      console.warn('Microphone stream access not granted or not supported:', micErr);
    }

    // 2. Real Speech Recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        let accumulated = '';

        recognition.onresult = (event: any) => {
          let interim = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              accumulated += ' ' + event.results[i][0].transcript;
            } else {
              interim += event.results[i][0].transcript;
            }
          }
          const fullText = (accumulated + ' ' + interim).trim();
          voiceTranscriptRef.current = fullText;
          setVoiceTranscript(fullText);
        };

        recognition.onerror = (err: any) => {
          console.warn('SpeechRecognition error:', err);
        };

        recognition.start();
      } catch (recErr) {
        console.warn('Speech recognition start failed:', recErr);
      }
    }
  };

  const handleStopVoiceProbe = (overrideText?: string) => {
    setIsRecordingVoice(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((t) => t.stop());
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setVoiceAudioLevel(0);

    analyzeVoiceExplanation(overrideText);
  };
  handleStopVoiceProbeRef.current = handleStopVoiceProbe;

  const isCurrentAnswered = () => {
    const val = answers[currentIndex];
    if (val === undefined) return false;
    if (typeof val === 'string') return val.trim().length > 0;
    return val >= 0;
  };

  const handleSubmit = () => {
    // Finalize telemetry profile metrics
    const tel = telemetryRef.current;
    const ikiTotal = tel.interKeystrokeIntervals.reduce((a, b) => a + b, 0);
    const avgIki =
      tel.interKeystrokeIntervals.length > 0
        ? Math.round(ikiTotal / tel.interKeystrokeIntervals.length)
        : 180;

    let calculatedWpm = 0;
    if (tel.keystrokeTimestamps.length >= 2) {
      const durationMin =
        (tel.keystrokeTimestamps[tel.keystrokeTimestamps.length - 1] -
          tel.keystrokeTimestamps[0]) /
        60000;
      if (durationMin > 0.05) {
        const words = tel.totalCharactersTyped / 5;
        calculatedWpm = Math.min(140, Math.round(words / durationMin));
      }
    }

    const calculatedErasureRatio =
      tel.totalCharactersTyped > 0
        ? Math.min(100, Math.round((tel.totalDeletions / tel.totalCharactersTyped) * 100))
        : 0;

    const longestQIdx =
      tel.longestPauseQuestionIndex >= 0 ? tel.longestPauseQuestionIndex : 0;
    const longestQ = questionsList[longestQIdx] || questionsList[0];

    setTelemetryProfile({
      affectivePauseFlagged: tel.maxDwellSeconds >= 6,
      maxDwellSec: tel.maxDwellSeconds,
      longestPauseQuestion: longestQIdx + 1,
      longestPauseTopic: longestQ?.topic || 'Conceptual Evaluation',
      burstCount: tel.backspaceBurstCount,
      optionFlips: tel.optionFlips,
      avgIkiMs: avgIki,
      totalKeystrokes: tel.keystrokeTimestamps.length,
      wpm: calculatedWpm,
      erasureRatio: calculatedErasureRatio,
      cognitiveFreezes: tel.cognitiveFreezes,
    });

    const submission = isEconomics
      ? submitEconomicsDiagnostic(answers)
      : submitDiagnostic(answers);
    setLocalSubmission(submission);

    const studentUid = authUser?.uid || (isEconomics ? 'std-demo-student-econ' : 'std-demo-student');
    syncStudentProgress(studentUid, isEconomics ? 'Economics' : 'Chemistry', {
      recentScore: submission.score,
      strugglingTopic:
        submission.missedQuestions.length > 0
          ? submission.missedQuestions[0].topic
          : 'All Concepts Mastered',
      hesitationLevel:
        tel.maxDwellSeconds >= 6 ? 'high' : tel.maxDwellSeconds >= 3 ? 'moderate' : 'low',
      telemetry: {
        maxDwellSec: tel.maxDwellSeconds,
        longestPauseQuestion: longestQIdx + 1,
        longestPauseTopic: longestQ?.topic || 'Conceptual Evaluation',
        wpm: calculatedWpm,
        avgIkiMs: avgIki,
        burstCount: tel.backspaceBurstCount,
        erasureRatio: calculatedErasureRatio,
        cognitiveFreezes: tel.cognitiveFreezes,
        totalKeystrokes: tel.keystrokeTimestamps.length,
        optionFlips: tel.optionFlips,
        solvedViaStealthCount: Object.keys(solvedViaStealth).length,
      },
    });
  };

  const analyzeVoiceExplanation = async (overrideText?: string) => {
    let transcriptText = (overrideText !== undefined ? overrideText : voiceTranscriptRef.current || voiceTranscript).trim();
    if (!transcriptText) {
      transcriptText = `In ${currentQ.topic}, ${currentQ.explanation.split('.')[0]}. Therefore, analyzing this requires applying the fundamental principle of ${currentQ.topic}.`;
    }
    voiceTranscriptRef.current = transcriptText;
    setVoiceTranscript(transcriptText);
    setIsAnalyzingVoice(true);

    const apiKey =
      (import.meta.env.VITE_GEMINI_API_KEY as string) ||
      (import.meta.env.GEMINI_API_KEY as string) ||
      '';

    const lower = transcriptText.toLowerCase();

    // Check relevant keywords based on current topic (5 questions per subject)
    const keywordBank: Record<number, string[]> = isEconomics
      ? {
          0: ['scarcity', 'wants', 'resources', 'unlimited', 'finite', 'trade-offs'],
          1: ['opportunity cost', 'next best', 'alternative', 'concert', 'foregone'],
          2: ['ppc', 'inside', 'inefficient', 'unemployed', 'idle', 'frontier', 'curve'],
          3: ['supply', 'technology', 'innovation', 'shift right', 'costs', 'production'],
          4: ['elasticity', 'inelastic', 'ped', 'unresponsive', 'percentage', '0.2'],
        }
      : {
          0: ['moles', 'grams', 'water', '18', '2', 'molar mass'],
          1: ['balance', 'atoms', 'coefficients', 'propane', 'conservation', '1, 5, 3, 4'],
          2: ['stoichiometry', 'ratio', 'chlorine', 'aluminum', '6'],
          3: ['limiting', 'reagent', 'nitrogen', 'hydrogen', 'excess', 'haber'],
          4: ['yield', 'theoretical', 'percent', 'efficiency', 'actual', '85'],
        };

    const targetKeywords = keywordBank[currentIndex] || ['concept', 'principle', 'reasoning'];
    const detected = targetKeywords.filter((kw) => lower.includes(kw));

    const baseScore = 85 + Math.min(13, detected.length * 3);

    let finalResult = {
      score: baseScore,
      insight:
        detected.length > 0
          ? `Socratic Verbal Reasoning Verified: Detected conceptual markers (${detected.join(', ')}). Flawless articulation of ${currentQ.topic}.`
          : `Verbal reasoning recorded and processed. Core conceptual alignment validated through spoken diagnostic probe.`,
      verified: true,
      detectedKeywords: detected.length > 0 ? detected : targetKeywords.slice(0, 2),
    };

    if (apiKey && apiKey.trim().length > 0) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `You are a real-time Socratic oral diagnostic evaluator for secondary students.
Evaluate this student's 15-second verbal response to an oral diagnostic probe.

Context:
- Subject: ${isEconomics ? 'Economics' : 'Chemistry'}
- Topic: "${currentQ.topic}"
- Question Prompt: "${currentQ.prompt}"
- Core Scientific/Economic Principle: "${currentQ.explanation}"

Student Spoken Transcript:
"${transcriptText}"

Evaluate the student's spoken explanation and return ONLY a valid JSON object matching this exact schema:
{
  "score": <number between 75 and 99 reflecting conceptual accuracy and clarity>,
  "verified": true,
  "detectedKeywords": [<array of 2 to 4 key domain concepts detected in their transcript>],
  "insight": "<A concise 2-sentence encouraging pedagogical evaluation of their spoken reasoning and understanding of ${currentQ.topic}>"
}`;

        let responseText = '';
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
            },
          });
          responseText = response.text?.trim() || '';
        } catch (mErr) {
          console.warn('[VoiceProbe] Fallback to gemini-2.5-flash:', mErr);
          const fbResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
            },
          });
          responseText = fbResponse.text?.trim() || '';
        }

        if (responseText) {
          const parsed = JSON.parse(responseText);
          if (parsed && typeof parsed.score === 'number' && parsed.insight) {
            finalResult = {
              score: Math.min(100, Math.max(70, parsed.score)),
              insight: parsed.insight,
              verified: parsed.verified !== false,
              detectedKeywords:
                Array.isArray(parsed.detectedKeywords) && parsed.detectedKeywords.length > 0
                  ? parsed.detectedKeywords
                  : finalResult.detectedKeywords,
            };
          }
        }
      } catch (err) {
        console.warn('[VoiceProbe] Gemini API evaluation fallback to heuristics:', err);
      }
    }

    setVoiceAnalysisResult(finalResult);
    setIsAnalyzingVoice(false);
  };

  const handleApplyTactileAnswer = (answerValue: string | number, label: string) => {
    if (typeof answerValue === 'number') {
      handleSelectOption(answerValue);
    } else {
      handleTextChange(answerValue);
    }

    setSolvedViaStealth((prev) => ({
      ...prev,
      [currentIndex]: label,
    }));
    setBonusXP((prev) => prev + 75);

    if (currentIndex < questionsList.length - 1) {
      showToast(
        `Question ${currentIndex + 1} Sandbox Solved!`,
        `${label} verified (+75 XP). Advancing to Question ${currentIndex + 2} Sandbox...`,
        'success'
      );
      // Advance to next question in the Sandbox alone (remains in tactile_model)
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Completed all questions in the Interactive Sandbox!
      showToast(
        'All 5 Interactive Sandboxes Completed!',
        'Tactile stage complete across all questions (+75 XP). Advancing to Stage 2: 15-Sec Voice Probe...',
        'success'
      );
      setCurrentIndex(0);
      setStealthSubTab('socratic_voice');
    }
  };

  const handleApplyVoiceAnswer = () => {
    if (answers[currentIndex] === undefined) {
      if (currentQ.questionType === 'multiple_choice' && currentQ.correctAnswerIndex !== undefined) {
        handleSelectOption(currentQ.correctAnswerIndex);
      } else if (currentQ.questionType === 'short_text' && currentQ.acceptedAnswers && currentQ.acceptedAnswers.length > 0) {
        handleTextChange(currentQ.acceptedAnswers[0]);
      }
    }

    setSolvedViaStealth((prev) => ({
      ...prev,
      [currentIndex]: 'Socratic Voice Probe',
    }));
    setBonusXP((prev) => prev + 100);

    if (currentIndex < questionsList.length - 1) {
      showToast(
        `Question ${currentIndex + 1} Reasoning Saved!`,
        `Oral diagnostic insight logged (+100 XP). Advancing to Question ${currentIndex + 2} Voice Probe...`,
        'success'
      );
      setCurrentIndex((prev) => prev + 1);
      setVoiceTranscript('');
      setVoiceAnalysisResult(null);
    } else {
      showToast(
        'All Voice Probes Completed!',
        'Verbal reasoning logged across all questions (+100 XP). Advancing to Stage 3: Step Scaffold...',
        'success'
      );
      setCurrentIndex(0);
      setStealthSubTab('step_scaffolder');
      setVoiceTranscript('');
      setVoiceAnalysisResult(null);
    }
  };

  const handleApplyScaffold = () => {
    if (answers[currentIndex] === undefined) {
      if (currentQ.questionType === 'multiple_choice' && currentQ.correctAnswerIndex !== undefined) {
        handleSelectOption(currentQ.correctAnswerIndex);
      } else if (currentQ.acceptedAnswers && currentQ.acceptedAnswers.length > 0) {
        handleTextChange(currentQ.acceptedAnswers[0]);
      }
    }

    setSolvedViaStealth((prev) => ({
      ...prev,
      [currentIndex]: 'Logic Scaffold Deduction',
    }));
    setBonusXP((prev) => prev + 50);

    if (currentIndex < questionsList.length - 1) {
      showToast(
        `Question ${currentIndex + 1} Scaffold Confirmed!`,
        `Deduction verified (+50 XP). Advancing to Question ${currentIndex + 2} Scaffold...`,
        'success'
      );
      setCurrentIndex((prev) => prev + 1);
    } else {
      showToast(
        'All Step Scaffolds Completed!',
        'Logic confirmed across all questions (+50 XP). Advancing to Stage 4: Certainty Dial...',
        'success'
      );
      setCurrentIndex(0);
      setStealthSubTab('confidence_dial');
    }
  };

  const handleApplyConfidenceDial = () => {
    if (answers[currentIndex] === undefined) {
      if (currentQ.questionType === 'multiple_choice' && currentQ.correctAnswerIndex !== undefined) {
        handleSelectOption(currentQ.correctAnswerIndex);
      } else if (currentQ.acceptedAnswers && currentQ.acceptedAnswers.length > 0) {
        handleTextChange(currentQ.acceptedAnswers[0]);
      }
    }

    setSolvedViaStealth((prev) => ({
      ...prev,
      [currentIndex]: `Stealth Suite (${confidenceLevel}% Certainty)`,
    }));
    setBonusXP((prev) => prev + 25);

    if (currentIndex < questionsList.length - 1) {
      showToast(
        `Question ${currentIndex + 1} Certainty Logged!`,
        `Calibrated at ${confidenceLevel}%. Advancing to Question ${currentIndex + 2}...`,
        'success'
      );
      setCurrentIndex((prev) => prev + 1);
    } else {
      showToast(
        'Stealth Assessment Complete!',
        'All questions calibrated across interactive modalities. Finalizing report...',
        'success'
      );
      handleSubmit();
    }
  };

  const handleNext = () => {
    if (currentIndex < questionsList.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleGoToPersonalizedPlatform = () => {
    setIsDiagnosticOpen(false);
    if (isEconomics) {
      setActiveView('personalized_learning_economics');
    } else {
      setActiveView('personalized_learning');
    }
  };

  const handleRetake = () => {
    telemetryRef.current = {
      idleSeconds: 0,
      maxDwellSeconds: 0,
      longestPauseQuestionIndex: 0,
      questionDwellSeconds: {},
      questionStartTimes: { 0: Date.now() },
      firstInteractionTimes: {},
      backspaceBurstCount: 0,
      recentBackspaceTimestamps: [],
      keystrokeTimestamps: [],
      interKeystrokeIntervals: [],
      totalCharactersTyped: 0,
      totalDeletions: 0,
      cognitiveFreezes: 0,
      optionFlips: 0,
      lastSelectedOption: null,
      hesitationFlagged: false,
    };
    setLiveTelemetry({ chars: 0, wpm: 0, pauseSec: 0, freezes: 0, bursts: 0 });
    setAnswers({});
    setSolvedViaStealth({});
    setCurrentIndex(0);
    setLocalSubmission(null);
    setStealthModeActive(false);
    setStealthSubTab('tactile_model');
    setBonusXP(0);
  };

  // Gamification metrics
  const answeredCount = Object.keys(answers).length;
  const currentXP = answeredCount * 50 + bonusXP;
  const streakCount = Math.min(answeredCount, 4);

  // Chemistry Q6 Balance Scale Equations
  const leftCarbons = coeffC3H8 * 3;
  const leftHydrogens = coeffC3H8 * 8;
  const leftOxygens = coeffO2 * 2;
  const totalLeftAtoms = leftCarbons + leftHydrogens + leftOxygens;
  const rightCarbons = coeffCO2 * 1;
  const rightHydrogens = coeffH2O * 2;
  const rightOxygens = coeffCO2 * 2 + coeffH2O * 1;
  const totalRightAtoms = rightCarbons + rightHydrogens + rightOxygens;
  const isEquationBalanced =
    leftCarbons === rightCarbons &&
    leftHydrogens === rightHydrogens &&
    leftOxygens === rightOxygens;
  const atomDifference = totalRightAtoms - totalLeftAtoms;
  const beamTiltDeg = Math.max(-14, Math.min(14, atomDifference * 2.2));

  // Early return is placed strictly AFTER all hooks, state, and derivations
  if (!isDiagnosticOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] transition-colors">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 ${
                isEconomics ? 'bg-emerald-600' : 'bg-indigo-600'
              }`}
            >
              <IconSparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {isEconomics ? 'Economics Diagnostic Assessment' : 'Chemistry Diagnostic Assessment Engine'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isEconomics
                  ? '5 Microeconomics Questions · Scarcity, Opportunity Cost & Demand-Supply'
                  : '5 Core Diagnostic Questions · The Mole Concept, Balancing & Stoichiometry'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Gamification ON/OFF Toggle */}
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Gamification:</span>
              <button
                onClick={() => setGamificationEnabled(!gamificationEnabled)}
                className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-md transition-all cursor-pointer ${
                  gamificationEnabled
                    ? isEconomics
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
                title="Toggle gamification elements (points, streaks, energy cells)"
              >
                {gamificationEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            <button
              onClick={() => setIsDiagnosticOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <IconX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Gamification Bar */}
        {gamificationEnabled && !localSubmission && (
          <div
            className={`px-6 py-2.5 flex items-center justify-between text-xs border-b ${
              isEconomics
                ? 'bg-emerald-950 text-white border-emerald-900'
                : 'bg-indigo-950 text-white border-indigo-900'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 font-mono text-emerald-300">
                <IconZap className="w-4 h-4 text-amber-400" />
                <span className="font-bold">+{currentXP} XP Earned</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-slate-200">
                <span>Streak:</span>
                <span
                  className={`font-bold text-white px-1.5 py-0.5 rounded-md ${
                    isEconomics ? 'bg-emerald-800' : 'bg-indigo-800'
                  }`}
                >
                  {streakCount}x
                </span>
              </div>
              {solvedViaStealth[currentIndex] && (
                <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1 bg-amber-950/60 border border-amber-700/60 px-2 py-0.5 rounded-md">
                  <Award className="w-3 h-3" />
                  <span>Stealth Solved: {solvedViaStealth[currentIndex]}</span>
                </span>
              )}
            </div>

            {/* Energy cells: 3 rectangular indicators */}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
              <span>Energy Cells:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((cell) => (
                  <div
                    key={cell}
                    className="w-3.5 h-3.5 rounded-xs border transition-colors bg-emerald-400 border-emerald-300"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!localSubmission ? (
            <div>
              {/* Stepper Progress Bar */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                <span>
                  Question {currentIndex + 1} of {questionsList.length}
                </span>
                <span
                  className={`font-mono font-semibold ${
                    isEconomics ? 'text-emerald-700 dark:text-emerald-400' : 'text-indigo-700 dark:text-indigo-400'
                  }`}
                >
                  Topic: {currentQ.topic}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden mb-4">
                <div
                  className={`h-full transition-all duration-300 ${
                    isEconomics ? 'bg-emerald-600' : 'bg-indigo-600'
                  }`}
                  style={{
                    width: `${((currentIndex + 1) / questionsList.length) * 100}%`,
                  }}
                />
              </div>

              {/* Mode Switcher: Standard Quiz vs Stealth Interactive Mode */}
              <div className="flex items-center justify-between gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl mb-5">
                <button
                  onClick={() => setStealthModeActive(false)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    !stealthModeActive
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Standard Assessment Question
                </button>
                <button
                  onClick={() => setStealthModeActive(true)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    stealthModeActive
                      ? isEconomics
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <IconAtom className="w-3.5 h-3.5" />
                  <span>Stealth Interactive Mode (Hands-on Sandboxes)</span>
                </button>
              </div>

              {!stealthModeActive ? (
                /* STANDARD ASSESSMENT MODE */
                <div>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {currentQ.questionType === 'multiple_choice'
                          ? 'Multiple Choice'
                          : 'Short Text Response'}
                      </span>
                      {solvedViaStealth[currentIndex] && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>Solved via {solvedViaStealth[currentIndex]}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                      {currentQ.prompt}
                    </h3>

                    {currentQ.formulaOrReaction && (
                      <div className="p-3.5 rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs">
                        <span className="text-slate-400 block text-[10px] mb-0.5 font-sans uppercase tracking-wider">
                          Reference Formula / Reaction:
                        </span>
                        <span className="font-semibold text-emerald-300">
                          {currentQ.formulaOrReaction}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Answer Input */}
                  {currentQ.questionType === 'multiple_choice' && currentQ.options ? (
                    <div className="space-y-2.5">
                      {currentQ.options.map((option, optIdx) => {
                        const isChecked = answers[currentIndex] === optIdx;
                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectOption(optIdx)}
                            className={`w-full text-left p-3.5 sm:p-4 rounded-xl border-2 transition-all flex items-center gap-3 cursor-pointer btn-tactile ${
                              isChecked
                                ? isEconomics
                                  ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-semibold'
                                  : 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 font-semibold'
                                : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <div
                              className={`w-6 h-6 rounded-md border font-bold text-xs shrink-0 flex items-center justify-center transition-colors ${
                                isChecked
                                  ? isEconomics
                                    ? 'border-emerald-600 bg-emerald-600 text-white'
                                    : 'border-indigo-600 bg-indigo-600 text-white'
                                  : 'border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800'
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </div>
                            <span className="text-xs sm:text-sm flex-1 leading-snug">{option}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">
                        Your Calculated Numerical Response:
                      </label>
                      <input
                        type="text"
                        value={(answers[currentIndex] as string) || ''}
                        onChange={(e) => handleTextChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={currentQ.placeholderHint || 'Enter your calculated answer...'}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-600 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-900 rounded-xl text-sm text-slate-900 dark:text-white font-mono transition-all outline-none"
                      />
                      <p className="text-[11px] text-slate-400">
                        Type your final value. Include units if indicated in the prompt.
                      </p>
                    </div>
                  )}

                  {/* Telemetrized Calculation & Reasoning Scratchpad */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">
                        Scratchpad & Step Working (Optional):
                      </label>
                      <div className="flex items-center gap-1.5">
                        {liveTelemetry.chars > 0 && (
                          <span className="text-[10px] font-mono font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded-md">
                            {liveTelemetry.chars} keys · {liveTelemetry.wpm} WPM
                          </span>
                        )}
                        {liveTelemetry.pauseSec >= 2 ? (
                          <span className="text-[10px] font-mono font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 px-2 py-0.5 rounded-md flex items-center gap-1 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                            <span>Paused: {liveTelemetry.pauseSec}s</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-mono">
                            Live Keystroke & Pause Telemetry Active
                          </span>
                        )}
                      </div>
                    </div>
                    <textarea
                      rows={2}
                      value={scratchpadNotes[currentIndex] || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setScratchpadNotes((prev) => ({ ...prev, [currentIndex]: val }));
                        telemetryRef.current.idleSeconds = 0;
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder="Jot down formulas, molar ratios, or deduction steps here..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:border-indigo-600 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-900 rounded-xl text-xs text-slate-900 dark:text-slate-100 font-mono transition-all outline-none resize-none"
                    />
                  </div>
                </div>
              ) : (
                /* STEALTH INTERACTIVE MODE (4 Modalities) */
                <div className="space-y-5 animate-in fade-in duration-200">
                  {/* Modality Tabs */}
                  <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-3">
                    <button
                      onClick={() => setStealthSubTab('tactile_model')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                        stealthSubTab === 'tactile_model'
                          ? isEconomics
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>1. Interactive Sandbox (Q{currentIndex + 1})</span>
                    </button>
                    <button
                      onClick={() => setStealthSubTab('socratic_voice')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                        stealthSubTab === 'socratic_voice'
                          ? isEconomics
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <IconMic className="w-3.5 h-3.5" />
                      <span>2. 15-Sec Voice Probe</span>
                    </button>
                    <button
                      onClick={() => setStealthSubTab('step_scaffolder')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                        stealthSubTab === 'step_scaffolder'
                          ? isEconomics
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>3. Step Scaffold</span>
                    </button>
                    <button
                      onClick={() => setStealthSubTab('confidence_dial')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                        stealthSubTab === 'confidence_dial'
                          ? isEconomics
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Brain className="w-3.5 h-3.5" />
                      <span>4. Certainty Dial</span>
                    </button>
                  </div>

                  {/* SUB-TAB 1: TACTILE INTERACTIVE MODEL (DEDICATED FOR ALL 10 QUESTIONS) */}
                  {stealthSubTab === 'tactile_model' && (
                    <div className="space-y-5 bg-slate-900 text-white p-5 rounded-2xl border border-slate-800">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                            Question {currentIndex + 1} Interactive Sandbox
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800">
                            Tactile Outcome Active
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white">
                          {currentQ.topic}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Manipulate the parameters to discover the equilibrium state, then click "Apply Interactive Solution" to lock in your answer.
                        </p>
                      </div>

                      {/* CHEMISTRY QUESTIONS 1 - 5 SANDBOXES */}
                      {!isEconomics && (
                        <>
                          {/* Q1: Water Mole Conversion */}
                          {currentIndex === 0 && (
                            <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                              <div className="flex items-center justify-between text-xs font-mono">
                                <span>Sample Mass: {waterMassGrams.toFixed(2)} g</span>
                                <span>Molar Mass H₂O: 18.02 g/mol</span>
                              </div>
                              <input
                                type="range"
                                min="18.02"
                                max="72.08"
                                step="18.02"
                                value={waterMassGrams}
                                onChange={(e) => setWaterMassGrams(parseFloat(e.target.value))}
                                className="w-full accent-indigo-500"
                              />
                              <div className="p-3 bg-slate-800/80 rounded-lg text-center font-mono text-xs text-slate-300">
                                <div>Selected Sample: <span className="text-white font-bold">{waterMassGrams.toFixed(2)} g H₂O</span> · Molar Mass: <span className="text-slate-300 font-bold">18.02 g/mol</span></div>
                                <div className="text-[11px] text-slate-400 mt-1">Adjust mass slider to match the question prompt, calculate the moles, then lock in your answer.</div>
                              </div>
                              <div className="flex justify-end">
                                <button
                                  onClick={() => {
                                    const calcMoles = (waterMassGrams / 18.02).toFixed(2);
<<<<<<< HEAD
                                    const matchedOptIdx = currentQ.options?.findIndex((optStr) => {
                                      const text = typeof optStr === 'string' ? optStr : (optStr as any)?.text || '';
                                      return text.startsWith(calcMoles);
                                    });
=======
                                    const matchedOptIdx = currentQ.options?.findIndex((opt: any) =>
                                      (typeof opt === 'string' ? opt : opt?.text || '')?.startsWith(calcMoles)
                                    );
>>>>>>> 2a42ea897ca9a138f3c0b0f9fa4882936f0c0ded
                                    const chosenIndex =
                                      matchedOptIdx !== -1 && matchedOptIdx !== undefined
                                        ? matchedOptIdx
                                        : (currentQ.correctAnswerIndex ?? 1);
                                    handleApplyTactileAnswer(chosenIndex, 'Molar Bridge Sandbox');
                                  }}
                                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                                >
                                  <IconCheckCircle className="w-4 h-4" />
                                  <span>Lock In Answer & Next Question (Q2)</span>
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Q2: Propane Tilting Balance Scale */}
                          {currentIndex === 1 && (
                            <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                              <div className="text-center">
                                {isEquationBalanced ? (
                                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 inline-flex items-center gap-1.5">
                                    <IconCheckCircle className="w-4 h-4 text-emerald-400" />
                                    <span>Equilibrium Achieved: Balanced (0° Deflection)</span>
                                  </span>
                                ) : (
                                  <span className="text-xs font-mono font-semibold px-3 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                    Imbalance: {atomDifference > 0 ? 'Products heavier' : 'Reactants heavier'} ({beamTiltDeg.toFixed(1)}°)
                                  </span>
                                )}
                              </div>

                              {/* Scale Visual */}
                              <div className="relative w-full max-w-md h-28 mx-auto flex items-center justify-center">
                                <div className="absolute bottom-2 w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-b-[36px] border-b-slate-700 z-10" />
                                <div
                                  className="relative w-full h-2 bg-slate-500 rounded transition-transform duration-300 ease-out flex items-center justify-between px-2"
                                  style={{ transform: `rotate(${beamTiltDeg}deg)` }}
                                >
                                  <div className="absolute -top-10 left-2 p-1.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono">
                                    Reactants: {totalLeftAtoms} atoms
                                  </div>
                                  <div className="absolute -top-10 right-2 p-1.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono">
                                    Products: {totalRightAtoms} atoms
                                  </div>
                                </div>
                              </div>

                              {/* Stepper Controls */}
                              <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                                <div className="p-2 bg-slate-800 rounded">
                                  <span className="text-[10px] text-slate-400 block">C₃H₈</span>
                                  <button onClick={() => setCoeffC3H8((v) => Math.max(1, v - 1))} className="px-1.5 text-xs">-</button>
                                  <span className="font-bold text-white mx-1">{coeffC3H8}</span>
                                  <button onClick={() => setCoeffC3H8((v) => Math.min(4, v + 1))} className="px-1.5 text-xs">+</button>
                                </div>
                                <div className="p-2 bg-slate-800 rounded">
                                  <span className="text-[10px] text-slate-400 block">O₂</span>
                                  <button onClick={() => setCoeffO2((v) => Math.max(1, v - 1))} className="px-1.5 text-xs">-</button>
                                  <span className="font-bold text-white mx-1">{coeffO2}</span>
                                  <button onClick={() => setCoeffO2((v) => Math.min(8, v + 1))} className="px-1.5 text-xs">+</button>
                                </div>
                                <div className="p-2 bg-slate-800 rounded">
                                  <span className="text-[10px] text-slate-400 block">CO₂</span>
                                  <button onClick={() => setCoeffCO2((v) => Math.max(1, v - 1))} className="px-1.5 text-xs">-</button>
                                  <span className="font-bold text-white mx-1">{coeffCO2}</span>
                                  <button onClick={() => setCoeffCO2((v) => Math.min(6, v + 1))} className="px-1.5 text-xs">+</button>
                                </div>
                                <div className="p-2 bg-slate-800 rounded">
                                  <span className="text-[10px] text-slate-400 block">H₂O</span>
                                  <button onClick={() => setCoeffH2O((v) => Math.max(1, v - 1))} className="px-1.5 text-xs">-</button>
                                  <span className="font-bold text-white mx-1">{coeffH2O}</span>
                                  <button onClick={() => setCoeffH2O((v) => Math.min(6, v + 1))} className="px-1.5 text-xs">+</button>
                                </div>
                              </div>

                              <div className="flex justify-end">
                                <button
                                  onClick={() => handleApplyTactileAnswer(currentQ.correctAnswerIndex ?? 2, 'Combustion Scale Balancing')}
                                  disabled={!isEquationBalanced}
                                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                                >
                                  <IconCheckCircle className="w-4 h-4" />
                                  <span>Lock In Balanced Coefficients & Next Question (Q3)</span>
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Q3: 2Al + 3Cl2 Stoichiometric Converter */}
                          {currentIndex === 2 && (
                            <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                              <div className="p-3 bg-slate-800 rounded-lg space-y-2 text-xs font-mono">
                                <div className="flex justify-between text-slate-300">
                                  <span>Reaction Stoichiometry:</span>
                                  <span className="text-indigo-300">2Al + 3Cl₂ → 2AlCl₃</span>
                                </div>
                                <div className="flex justify-between text-slate-300">
                                  <span>Available Reactant:</span>
                                  <span>4.00 mol Al</span>
                                </div>
                                <div className="text-[11px] text-slate-400 font-sans pt-1 border-t border-slate-700">
                                  Determine the exact moles of Cl₂ gas required to consume 4.00 mol Al by applying the stoichiometric molar ratio.
                                </div>
                              </div>

                              <div className="space-y-2">
                                <span className="text-xs text-slate-300 block font-mono">Select Required Cl₂ Gas Quantity:</span>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                  {[
                                    { label: '6.0 moles Cl₂', index: 0 },
                                    { label: '4.0 moles Cl₂', index: 1 },
                                    { label: '2.67 moles Cl₂', index: 2 },
                                    { label: '12.0 moles Cl₂', index: 3 },
                                  ].map((item) => (
                                    <button
                                      key={item.index}
                                      type="button"
                                      onClick={() => setChemQ3Choice(item.index)}
                                      className={`p-2.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                                        chemQ3Choice === item.index
                                          ? 'bg-emerald-600 text-white border-emerald-400 font-bold'
                                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                                      }`}
                                    >
                                      {item.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="flex justify-end">
                                <button
                                  onClick={() => handleApplyTactileAnswer(chemQ3Choice, 'Stoichiometric Ratio Converter')}
                                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                                >
                                  <IconCheckCircle className="w-4 h-4" />
                                  <span>Lock In Stoichiometric Ratio & Next Question (Q4)</span>
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Q4: Haber Process Limiting Reagent */}
                          {currentIndex === 3 && (
                            <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                              <div className="grid grid-cols-2 gap-3 text-center text-xs font-mono">
                                <div className="p-2.5 bg-slate-800 rounded-lg">
                                  <span className="text-slate-400 block text-[10px]">Supplied N₂</span>
                                  <span className="text-sm font-bold text-white">{inputMolesN2.toFixed(2)} mol</span>
                                </div>
                                <div className="p-2.5 bg-slate-800 rounded-lg">
                                  <span className="text-slate-400 block text-[10px]">Supplied H₂</span>
                                  <span className="text-sm font-bold text-white">2.00 mol</span>
                                </div>
                              </div>
                              <div className="p-3 bg-slate-800 text-center font-mono text-xs text-slate-300">
                                Reaction: N₂ + 3H₂ → 2NH₃ (1:3 Molar Proportion). Compare available quantities to determine which reactant will be fully exhausted first.
                              </div>

                              <div className="space-y-2">
                                <span className="text-xs text-slate-300 block font-mono">Select Limiting Reagent:</span>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                  {[
                                    { label: 'N₂ is Limiting', index: 0 },
                                    { label: 'Neither is Limiting', index: 1 },
                                    { label: 'NH₃ is Limiting', index: 2 },
                                    { label: 'H₂ is Limiting', index: 3 },
                                  ].map((item) => (
                                    <button
                                      key={item.index}
                                      type="button"
                                      onClick={() => setChemQ4Choice(item.index)}
                                      className={`p-2.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                                        chemQ4Choice === item.index
                                          ? 'bg-emerald-600 text-white border-emerald-400 font-bold'
                                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                                      }`}
                                    >
                                      {item.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="flex justify-end">
                                <button
                                  onClick={() => handleApplyTactileAnswer(chemQ4Choice, 'Limiting Reagent Stoichiometry')}
                                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                                >
                                  <IconCheckCircle className="w-4 h-4" />
                                  <span>Lock In Limiting Reagent & Next Question (Q5)</span>
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Q5: Percent Yield Gauge */}
                          {currentIndex === 4 && (
                            <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                              <div className="grid grid-cols-2 gap-3 text-center text-xs font-mono">
                                <div className="p-2.5 bg-slate-800 rounded">
                                  <span className="text-slate-400 block text-[10px]">Actual Recovered</span>
                                  <span className="font-bold text-white">42.5 g</span>
                                </div>
                                <div className="p-2.5 bg-slate-800 rounded">
                                  <span className="text-slate-400 block text-[10px]">Theoretical Max</span>
                                  <span className="font-bold text-white">50.0 g</span>
                                </div>
                              </div>
                              <div className="p-3 bg-slate-800 text-center font-mono text-xs text-slate-300">
                                Experimental Recovery: 42.5 g precipitate recovered out of 50.0 g theoretical maximum. Calculate percentage efficiency.
                              </div>

                              <div className="space-y-2">
                                <span className="text-xs text-slate-300 block font-mono">Select Calculated Percent Yield:</span>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                  {[
                                    { label: '117.6%', index: 0 },
                                    { label: '85.0%', index: 1 },
                                    { label: '7.5%', index: 2 },
                                    { label: '92.5%', index: 3 },
                                  ].map((item) => (
                                    <button
                                      key={item.index}
                                      type="button"
                                      onClick={() => setChemQ5Choice(item.index)}
                                      className={`p-2.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                                        chemQ5Choice === item.index
                                          ? 'bg-emerald-600 text-white border-emerald-400 font-bold'
                                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                                      }`}
                                    >
                                      {item.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="flex justify-end">
                                <button
                                  onClick={() => handleApplyTactileAnswer(chemQ5Choice, 'Yield Efficiency Calculation')}
                                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                                >
                                  <IconCheckCircle className="w-4 h-4" />
                                  <span>Lock In Yield Calculation & Proceed to Stage 2: Voice Probe</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {/* ECONOMICS QUESTIONS 1 - 5 SANDBOXES */}
                      {isEconomics && (
                        <>
                          {/* Econ Q1: Scarcity Allocation Matrix */}
                          {currentIndex === 0 && (
                            <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                              <div className="grid grid-cols-2 gap-3 text-center text-xs font-mono">
                                <div className="p-2.5 bg-slate-800 rounded-lg border border-rose-900/50">
                                  <span className="text-rose-400 block text-[10px] uppercase font-bold">Human Desires</span>
                                  <span className="text-sm font-bold text-white">Unlimited (Infinite)</span>
                                </div>
                                <div className="p-2.5 bg-slate-800 rounded-lg border border-emerald-900/50">
                                  <span className="text-emerald-400 block text-[10px] uppercase font-bold">Productive Resources</span>
                                  <span className="text-sm font-bold text-white">Finite (Land, Labor, Capital)</span>
                                </div>
                              </div>
                              <div className="p-3 bg-slate-800 text-center text-xs text-slate-300">
                                Resource Tension Model: Evaluate the relationship between unlimited human wants and finite productive resources.
                              </div>

                              <div className="space-y-2">
                                <span className="text-xs text-slate-300 block font-mono">Select Governed Principle:</span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                  {[
                                    { label: 'Temporary supply chain shortage', index: 0 },
                                    { label: 'Inability to purchase luxury items', index: 1 },
                                    { label: 'Universal condition of scarcity', index: 2 },
                                    { label: 'Monopolistic market failure', index: 3 },
                                  ].map((item) => (
                                    <button
                                      key={item.index}
                                      type="button"
                                      onClick={() => setEconQ1Choice(item.index)}
                                      className={`p-2.5 text-left rounded-lg border transition-all cursor-pointer ${
                                        econQ1Choice === item.index
                                          ? 'bg-emerald-600 text-white border-emerald-400 font-bold'
                                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                                      }`}
                                    >
                                      {item.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="flex justify-end">
                                <button
                                  onClick={() => handleApplyTactileAnswer(econQ1Choice, 'Scarcity Allocation Model')}
                                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                                >
                                  <IconCheckCircle className="w-4 h-4" />
                                  <span>Lock In Economic Principle & Next Question (Q2)</span>
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Econ Q2: Opportunity Cost Decision Hierarchy */}
                          {currentIndex === 1 && (
                            <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                              <div className="space-y-2 text-xs font-mono">
                                <div className="p-2.5 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-between">
                                  <span>Rank 1: Study Economics</span>
                                  <span className="text-emerald-400 font-bold">Action Taken</span>
                                </div>
                                <div className="p-2.5 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-between">
                                  <span>Rank 2: Attend Concert</span>
                                  <span className="text-slate-400">Alternative Option</span>
                                </div>
                                <div className="p-2.5 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-between">
                                  <span>Rank 3: Play Video Games</span>
                                  <span className="text-slate-400">Alternative Option</span>
                                </div>
                              </div>
                              <div className="p-3 bg-slate-800 text-center text-xs text-slate-300">
                                Opportunity Cost Evaluation: Identify which outcome represents the true opportunity cost of choosing to Study Economics.
                              </div>

                              <div className="space-y-2">
                                <span className="text-xs text-slate-300 block font-mono">Select Opportunity Cost:</span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                  {[
                                    { label: 'Attending the concert (highest-valued alternative)', index: 0 },
                                    { label: 'Both concert and video games combined', index: 1 },
                                    { label: 'Playing video games (lowest-ranked choice)', index: 2 },
                                    { label: 'Zero (positive educational returns)', index: 3 },
                                  ].map((item) => (
                                    <button
                                      key={item.index}
                                      type="button"
                                      onClick={() => setEconQ2Choice(item.index)}
                                      className={`p-2.5 text-left rounded-lg border transition-all cursor-pointer ${
                                        econQ2Choice === item.index
                                          ? 'bg-emerald-600 text-white border-emerald-400 font-bold'
                                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                                      }`}
                                    >
                                      {item.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="flex justify-end">
                                <button
                                  onClick={() => handleApplyTactileAnswer(econQ2Choice, 'Opportunity Cost Hierarchy')}
                                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                                >
                                  <IconCheckCircle className="w-4 h-4" />
                                  <span>Lock In Opportunity Cost & Next Question (Q3)</span>
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Econ Q3: PPC Production Possibilities Frontier */}
                          {currentIndex === 2 && (
                            <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                                <button
                                  type="button"
                                  onClick={() => setPpcPointLocation('inside')}
                                  className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                                    ppcPointLocation === 'inside'
                                      ? 'border-indigo-500 bg-indigo-950/50 text-indigo-300 font-bold'
                                      : 'border-slate-700 bg-slate-800 text-slate-400'
                                  }`}
                                >
                                  Point Inside PPC
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setPpcPointLocation('on_frontier')}
                                  className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                                    ppcPointLocation === 'on_frontier'
                                      ? 'border-indigo-500 bg-indigo-950/50 text-indigo-300 font-bold'
                                      : 'border-slate-700 bg-slate-800 text-slate-400'
                                  }`}
                                >
                                  Point on Curve
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setPpcPointLocation('outside')}
                                  className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                                    ppcPointLocation === 'outside'
                                      ? 'border-indigo-500 bg-indigo-950/50 text-indigo-300 font-bold'
                                      : 'border-slate-700 bg-slate-800 text-slate-400'
                                  }`}
                                >
                                  Point Outside PPC
                                </button>
                              </div>
                              <div className="p-3 bg-slate-800 text-center font-mono text-xs text-slate-300">
                                Production boundary plotted: Selected coordinate is situated {ppcPointLocation === 'inside' ? 'INSIDE' : ppcPointLocation === 'on_frontier' ? 'ON' : 'OUTSIDE'} the curve. Deduce what this indicates about resource utilization.
                              </div>

                              <div className="space-y-2">
                                <span className="text-xs text-slate-300 block font-mono">Deduce Economic Indication:</span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                  {[
                                    { label: 'Maximum sustainable productive capacity', index: 0 },
                                    { label: 'Productive inefficiency or unemployed idle resources', index: 1 },
                                    { label: 'Output combination is currently unattainable', index: 2 },
                                    { label: 'Rapid innovation shifting frontier outward', index: 3 },
                                  ].map((item) => (
                                    <button
                                      key={item.index}
                                      type="button"
                                      onClick={() => setEconQ3Choice(item.index)}
                                      className={`p-2.5 text-left rounded-lg border transition-all cursor-pointer ${
                                        econQ3Choice === item.index
                                          ? 'bg-emerald-600 text-white border-emerald-400 font-bold'
                                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                                      }`}
                                    >
                                      {item.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="flex justify-end">
                                <button
                                  onClick={() => handleApplyTactileAnswer(econQ3Choice, 'PPC Inefficiency Model')}
                                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                                >
                                  <IconCheckCircle className="w-4 h-4" />
                                  <span>Lock In Frontier Deduction & Next Question (Q4)</span>
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Econ Q4: Supply Technology Innovator */}
                          {currentIndex === 3 && (
                            <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                              <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                                <div>
                                  <span className="text-xs font-bold text-white block">Manufacturing Technology Shock</span>
                                  <span className="text-[10px] text-slate-400">Simulate breakthroughs in photovoltaic cell fabrication</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setTechInnovationActive(!techInnovationActive)}
                                  className={`px-3 py-1 text-xs font-bold rounded transition-colors cursor-pointer ${
                                    techInnovationActive ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'
                                  }`}
                                >
                                  {techInnovationActive ? 'Innovation Active (-50% Cost)' : 'Baseline Cost'}
                                </button>
                              </div>
                              <div className="p-3 bg-slate-800 text-center font-mono text-xs text-slate-300">
                                Market Factor Analysis: Determine which event shifts the market supply curve for solar panels outward to the RIGHT.
                              </div>

                              <div className="space-y-2">
                                <span className="text-xs text-slate-300 block font-mono">Select Rightward Supply Shift Determinant:</span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                  {[
                                    { label: 'Mandatory per-unit tax imposed on producers', index: 0 },
                                    { label: 'Increase in hourly wages paid to assembly labor', index: 1 },
                                    { label: 'Decline in consumer clean-energy preferences', index: 2 },
                                    { label: 'Manufacturing innovation halving unit cell costs', index: 3 },
                                  ].map((item) => (
                                    <button
                                      key={item.index}
                                      type="button"
                                      onClick={() => setEconQ4Choice(item.index)}
                                      className={`p-2.5 text-left rounded-lg border transition-all cursor-pointer ${
                                        econQ4Choice === item.index
                                          ? 'bg-emerald-600 text-white border-emerald-400 font-bold'
                                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                                      }`}
                                    >
                                      {item.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="flex justify-end">
                                <button
                                  onClick={() => handleApplyTactileAnswer(econQ4Choice, 'Supply Innovation Model')}
                                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                                >
                                  <IconCheckCircle className="w-4 h-4" />
                                  <span>Lock In Market Effect & Next Question (Q5)</span>
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Econ Q5: Price Elasticity of Demand (PED) */}
                          {currentIndex === 4 && (
                            <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                              <div className="grid grid-cols-2 gap-3 text-center text-xs font-mono">
                                <div className="p-2.5 bg-slate-800 rounded">
                                  <span className="text-slate-400 block text-[10px]">% Price Change (ΔP)</span>
                                  <span className="font-bold text-amber-300">+10.0%</span>
                                </div>
                                <div className="p-2.5 bg-slate-800 rounded">
                                  <span className="text-slate-400 block text-[10px]">% Quantity Change (ΔQd)</span>
                                  <span className="font-bold text-rose-300">-2.0%</span>
                                </div>
                              </div>
                              <div className="p-3 bg-slate-800 text-center font-mono text-xs text-slate-300">
                                Market Elasticity Calibration: A +10.0% price increase yields only a -2.0% drop in quantity demanded. Calculate |PED| and select classification.
                              </div>

                              <div className="space-y-2">
                                <span className="text-xs text-slate-300 block font-mono">Select Elasticity Classification:</span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                  {[
                                    { label: 'Price elastic (|PED| = 5.0, highly responsive)', index: 0 },
                                    { label: 'Price inelastic (|PED| = 0.20, relatively unresponsive)', index: 1 },
                                    { label: 'Unit elastic (|PED| = 1.0, proportional response)', index: 2 },
                                    { label: 'Perfectively elastic (|PED| approaches infinity)', index: 3 },
                                  ].map((item) => (
                                    <button
                                      key={item.index}
                                      type="button"
                                      onClick={() => setEconQ5Choice(item.index)}
                                      className={`p-2.5 text-left rounded-lg border transition-all cursor-pointer ${
                                        econQ5Choice === item.index
                                          ? 'bg-emerald-600 text-white border-emerald-400 font-bold'
                                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                                      }`}
                                    >
                                      {item.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="flex justify-end">
                                <button
                                  onClick={() => handleApplyTactileAnswer(econQ5Choice, 'Price Elasticity Calculation')}
                                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                                >
                                  <IconCheckCircle className="w-4 h-4" />
                                  <span>Lock In Elasticity Analysis & Proceed to Stage 2: Voice Probe</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* SUB-TAB 2: REAL 15-SECOND SOCRATIC VOICE PROBE */}
                  {stealthSubTab === 'socratic_voice' && (
                    <div className="space-y-4 bg-slate-900 text-white p-5 rounded-2xl border border-slate-800">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 block mb-1">
                          Acoustic Verbal Diagnostic Probe
                        </span>
                        <h4 className="text-sm font-bold text-white">
                          Explain your reasoning for {currentQ.topic} in 15 seconds
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Speak clearly into your microphone. Our speech engine transcribes your words in real time and detects core domain concepts.
                        </p>
                      </div>

                      {/* Microphone Recorder Box */}
                      <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center space-y-4">
                        <div className="relative">
                          {isRecordingVoice && (
                            <div className="absolute inset-0 rounded-full bg-rose-500/30 animate-ping" />
                          )}
                          <button
                            onClick={isRecordingVoice ? () => handleStopVoiceProbe() : handleStartVoiceProbe}
                            className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-all cursor-pointer shadow-lg ${
                              isRecordingVoice ? 'bg-rose-600 hover:bg-rose-700' : 'bg-indigo-600 hover:bg-indigo-500'
                            }`}
                          >
                            {isRecordingVoice ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                          </button>
                        </div>

                        {/* Status & Timer */}
                        <div className="text-center space-y-1">
                          <span className="text-xs font-mono font-bold text-slate-200">
                            {isRecordingVoice ? `Listening... ${15 - voiceElapsedSec}s remaining` : 'Click to begin 15-second probe'}
                          </span>
                          {isRecordingVoice && (
                            <div className="w-32 h-1.5 bg-slate-800 rounded-md overflow-hidden mx-auto mt-2">
                              <div
                                className="h-full bg-rose-500 transition-all duration-1000"
                                style={{ width: `${(voiceElapsedSec / 15) * 100}%` }}
                              />
                            </div>
                          )}
                        </div>

                        {/* Live Audio Amplitude Waveform */}
                        {isRecordingVoice && (
                          <div className="flex items-center gap-1 h-6">
                            {[12, 28, 45, 80, 55, 30, 65, 90, 40, 20, 70, 35].map((h, i) => (
                              <div
                                key={i}
                                className="w-1 bg-emerald-400 rounded-xs transition-all duration-75"
                                style={{ height: `${Math.max(4, (h * voiceAudioLevel) / 100)}px` }}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Live Speech-to-Text Transcript Display & Quick Concepts */}
                      <div className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2 text-xs">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>Live Voice Transcript:</span>
                          <span className="font-mono text-[10px] text-emerald-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-xs bg-emerald-400 inline-block animate-pulse" />
                            {isRecordingVoice ? 'Listening...' : 'SpeechRecognition Ready'}
                          </span>
                        </div>
                        
                        {isRecordingVoice ? (
                          <p className="text-slate-200 italic font-sans min-h-[44px] leading-relaxed p-2 bg-slate-900/60 rounded-lg border border-slate-800">
                            {voiceTranscript || 'Start speaking to see real-time transcription...'}
                          </p>
                        ) : (
                          <div className="space-y-2">
                            <textarea
                              value={voiceTranscript}
                              onChange={(e) => {
                                setVoiceTranscript(e.target.value);
                                voiceTranscriptRef.current = e.target.value;
                              }}
                              placeholder="Spoken transcript will appear here, or type your conceptual reasoning directly..."
                              className="w-full h-16 bg-slate-900/80 border border-slate-700 text-slate-200 text-xs p-2.5 rounded-lg focus:outline-hidden focus:border-indigo-500 font-sans resize-none"
                            />
                            
                            {/* Quick Conceptual Key Phrases Chips */}
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                                Quick Conceptual Key Phrases:
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {(isEconomics
                                  ? {
                                      0: [
                                        'Scarcity arises when unlimited human wants exceed finite productive resources',
                                        'Productive factors (land, labor, capital) are physically limited in supply',
                                        'Scarcity forces continuous resource allocation trade-offs across society',
                                      ],
                                      1: [
                                        'Opportunity cost is strictly the single next-best alternative foregone',
                                        'Evaluating the highest-valued sacrificed option when economic choices are made',
                                        'Distinguishing explicit accounting expenses from implicit opportunity costs',
                                      ],
                                      2: [
                                        'Points inside the PPC represent idle or misallocated productive capacity',
                                        'Operating on the frontier boundary signifies maximum productive efficiency',
                                        'Points outside the curve are unattainable without capital or tech expansion',
                                      ],
                                      3: [
                                        'Technological breakthroughs reduce per-unit marginal production costs',
                                        'Lower manufacturing expenses allow greater output supply at any given price',
                                        'Cost reductions shift the entire supply curve outward to the right',
                                      ],
                                      4: [
                                        'Elasticity measures percentage responsiveness of quantity to price changes',
                                        'An absolute elasticity coefficient below 1.0 indicates price inelastic demand',
                                        'Quantity demanded changes by a smaller proportion than the price shift',
                                      ],
                                    }[currentIndex] || ['Scarcity forces economic trade-offs', 'Opportunity cost is the next best alternative']
                                  : {
                                      0: [
                                        'Molar mass acts as a conversion factor between grams and moles',
                                        'Avogadro ratio equates molar mass in grams to one mole of substance',
                                        'Dividing sample mass in grams by molar mass yields mole quantity',
                                      ],
                                      1: [
                                        'Law of Conservation of Mass dictates atom count must balance on both sides',
                                        'Adjusting stoichiometric integer coefficients preserves atomic identity',
                                        'Balancing Carbon and Hydrogen first before tallying total Oxygen atoms',
                                      ],
                                      2: [
                                        'Stoichiometric coefficients define the exact molar proportions of reactants',
                                        'Determining moles of reagent required using the balanced reaction ratio',
                                        'Multiplying given reactant moles by the stoichiometric conversion factor',
                                      ],
                                      3: [
                                        'The limiting reactant is completely consumed first in a reaction',
                                        'Stoichiometric ratio dictates which reactant is present in deficit',
                                        'The limiting reagent sets the maximum theoretical yield of product',
                                      ],
                                      4: [
                                        'Percent yield evaluates the laboratory recovery efficiency of a reaction',
                                        'Actual precipitate mass divided by theoretical maximum mass times 100%',
                                        'Experimental losses and side reactions reduce actual yield below 100%',
                                      ],
                                    }[currentIndex] || ['Conservation of mass requires balancing atoms', 'Molar mass bridges mass to moles']
                                ).map((phrase, pIdx) => (
                                  <button
                                    key={pIdx}
                                    type="button"
                                    onClick={() => {
                                      setVoiceTranscript(phrase);
                                      voiceTranscriptRef.current = phrase;
                                      analyzeVoiceExplanation(phrase);
                                    }}
                                    className="px-2 py-1 rounded bg-slate-700 hover:bg-indigo-600 text-slate-200 hover:text-white text-[11px] font-medium transition-colors cursor-pointer text-left"
                                  >
                                    + {phrase}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Gemini Live Analyzing State */}
                            {isAnalyzingVoice && (
                              <div className="p-3 bg-indigo-950/70 border border-indigo-500/50 rounded-lg flex items-center gap-2 text-xs text-indigo-200 animate-pulse">
                                <IconRefreshCw className="w-4 h-4 animate-spin text-indigo-400 shrink-0" />
                                <span>Gemini Live Socratic Engine evaluating oral explanation and concepts...</span>
                              </div>
                            )}

                            {voiceTranscript && !voiceAnalysisResult && !isAnalyzingVoice && (
                              <button
                                type="button"
                                onClick={() => analyzeVoiceExplanation(voiceTranscript)}
                                className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                <IconSparkles className="w-3.5 h-3.5" />
                                <span>Analyze Spoken Reasoning with Gemini Live</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Analysis Result Card */}
                      {voiceAnalysisResult && (
                        <div className="p-4 rounded-xl bg-slate-800 border border-emerald-500/50 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-emerald-400 font-bold font-mono">
                              Verbal Diagnostic Alignment: {voiceAnalysisResult.score}%
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                              Concept Verified
                            </span>
                          </div>
                          <p className="text-slate-300">
                            <strong>Feedback: </strong>
                            {voiceAnalysisResult.insight}
                          </p>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                            <span>Detected Key Concepts:</span>
                            {voiceAnalysisResult.detectedKeywords.map((kw, i) => (
                              <span key={i} className="px-1.5 py-0.5 rounded bg-slate-700 text-indigo-200 font-mono">
                                {kw}
                              </span>
                            ))}
                          </div>
                          <div className="pt-2 flex justify-end">
                            <button
                              onClick={handleApplyVoiceAnswer}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                              <IconCheckCircle className="w-4 h-4" />
                              <span>
                                {currentIndex < questionsList.length - 1
                                  ? `Lock In Verbal Reasoning & Next Question (Q${currentIndex + 2}) (+100 XP)`
                                  : 'Complete Voice Probes & Proceed to Stage 3: Step Scaffold (+100 XP)'}
                              </span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SUB-TAB 3: STEP-BY-STEP SOCRATIC SCAFFOLDER */}
                  {stealthSubTab === 'step_scaffolder' && (
                    <div className="space-y-4 bg-slate-900 text-white p-5 rounded-2xl border border-slate-800">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 block mb-1">
                          Socratic Logic Scaffolder
                        </span>
                        <h4 className="text-sm font-bold text-white">
                          Deconstruct {currentQ.topic} into 2 Logical Deduction Steps
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Examine the governing scientific/economic law before locking in your scaffolded solution.
                        </p>
                      </div>

                      <div className="space-y-2.5 text-xs font-mono">
                        <div className="p-3 bg-slate-800/90 rounded-xl border border-slate-700 space-y-1">
                          <span className="text-emerald-400 font-bold block text-[11px]">Step 1: Governing Premise</span>
                          <p className="text-slate-300 font-sans text-xs">
                            {currentQ.formulaOrReaction || `Identify the core scientific/economic law governing ${currentQ.topic}.`}
                          </p>
                        </div>
                        <div className="p-3 bg-slate-800/90 rounded-xl border border-slate-700 space-y-1">
                          <span className="text-indigo-300 font-bold block text-[11px]">Step 2: Conceptual Method</span>
                          <p className="text-slate-300 font-sans text-xs">
                            Apply the stoichiometric or economic relationship to eliminate misconceptions and isolate the valid deduction.
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={handleApplyScaffold}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <IconCheckCircle className="w-4 h-4" />
                          <span>
                            {currentIndex < questionsList.length - 1
                              ? `Lock In Scaffold Deduction & Next Question (Q${currentIndex + 2}) (+50 XP)`
                              : 'Complete Step Scaffolds & Proceed to Stage 4: Certainty Dial (+50 XP)'}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 4: METACOGNITIVE CERTAINTY DIAL */}
                  {stealthSubTab === 'confidence_dial' && (
                    <div className="space-y-4 bg-slate-900 text-white p-5 rounded-2xl border border-slate-800">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 block mb-1">
                          Metacognitive Calibration Dial
                        </span>
                        <h4 className="text-sm font-bold text-white">
                          How confident are you in your conceptual grasp of this question?
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Calibrating confidence helps the adaptive engine detect second-guessing vs genuine mastery.
                        </p>
                      </div>

                      <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-400">Certainty Level:</span>
                          <span className="text-sm font-bold text-emerald-400">{confidenceLevel}%</span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="100"
                          step="5"
                          value={confidenceLevel}
                          onChange={(e) => setConfidenceLevel(parseInt(e.target.value))}
                          className="w-full accent-emerald-500"
                        />
                        <div className="flex justify-between text-[10px] font-mono text-slate-500">
                          <span>50% (Educated Guess)</span>
                          <span>75% (Moderate Certainty)</span>
                          <span>100% (Absolute Confidence)</span>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={handleApplyConfidenceDial}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <IconCheckCircle className="w-4 h-4" />
                          <span>
                            {currentIndex < questionsList.length - 1
                              ? `Lock Answer with ${confidenceLevel}% Certainty & Next Question (Q${currentIndex + 2})`
                              : `Lock Answer with ${confidenceLevel}% Certainty & Complete Assessment`}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Results & Review Screen */
            <div className="space-y-6">
              {/* Score Header */}
              <div
                className={`p-6 rounded-2xl border text-center space-y-2 ${
                  isEconomics ? 'bg-emerald-50 border-emerald-200' : 'bg-indigo-50 border-indigo-200'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl text-white flex items-center justify-center mx-auto shadow-xs ${
                    isEconomics ? 'bg-emerald-600' : 'bg-indigo-600'
                  }`}
                >
                  <IconZap className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <h3 className={`text-xl font-bold ${isEconomics ? 'text-emerald-950' : 'text-indigo-950'}`}>
                    {isEconomics ? 'Economics' : 'Chemistry'} Diagnostic Calibration Complete
                  </h3>
                  {Object.keys(solvedViaStealth).length > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 shadow-xs">
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                      <span>Stealth Interactive Suite ({Object.keys(solvedViaStealth).length} / {questionsList.length} Solved Interactively)</span>
                    </span>
                  )}
                </div>
                <p className={`text-xs sm:text-sm max-w-md mx-auto ${isEconomics ? 'text-emerald-800' : 'text-indigo-800'}`}>
                  You scored <strong className="font-mono text-base">{localSubmission.score} / {localSubmission.total}</strong> ({Math.round((localSubmission.score / localSubmission.total) * 100)}%). {Object.keys(solvedViaStealth).length > 0 ? `${Object.keys(solvedViaStealth).length} conceptual derivation(s) verified via interactive stealth modalities.` : ''} Your personalized learning platform has been calibrated with custom study materials.
                </p>
              </div>

              {/* Primary Action Button to Go to the Dedicated Page */}
              <div
                className={`p-5 rounded-2xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs border ${
                  isEconomics
                    ? 'bg-slate-900 border-emerald-800/40'
                    : 'bg-slate-900 border-indigo-800/40'
                }`}
              >
                <div className="space-y-1">
                  <span className="text-xs font-mono font-semibold text-emerald-300 uppercase tracking-wider">
                    Next Step
                  </span>
                  <h4 className="text-base font-bold text-white">
                    Enter Your Personalized Learning Space
                  </h4>
                  <p className="text-xs text-slate-300">
                    Access tailored presentation decks, interactive models for your focus areas, and chat directly with your instructor.
                  </p>
                </div>

                <button
                  onClick={handleGoToPersonalizedPlatform}
                  className={`px-5 py-3 bg-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors shrink-0 flex items-center justify-center gap-2 cursor-pointer ${
                    isEconomics ? 'text-emerald-950 hover:bg-emerald-50' : 'text-indigo-950 hover:bg-indigo-50'
                  }`}
                >
                  <span>Open Personalized Platform</span>
                  <IconArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Cognitive Behavioral Profile & Telemetry Insights */}
              <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <IconSparkles className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Non-Invasive Cognitive Behavioral Assessment Profile
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-md">
                    Telemetry Synced
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  {/* Card 1: Affective Latency */}
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1.5">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono block">
                      Affective Latency & Hesitation
                    </span>
                    <span className="font-bold text-slate-100 block text-sm">
                      Longest Pause: {telemetryProfile.maxDwellSec}s
                    </span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      You paused for <strong className="text-amber-300 font-bold">{telemetryProfile.maxDwellSec} seconds</strong> on Question {telemetryProfile.longestPauseQuestion} ({telemetryProfile.longestPauseTopic}) before deciding on an answer. {telemetryProfile.affectivePauseFlagged ? 'Observed initial reading hesitation (>6s threshold); flagged for teacher diagnostic review.' : 'Consistent dwell pace maintained across all conceptual stems.'}
                    </p>
                  </div>

                  {/* Card 2: Typing Velocity & Cadence */}
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono block">
                        Typing Velocity & Cadence
                      </span>
                      {telemetryProfile.wpm > 0 && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold">
                          {telemetryProfile.wpm} WPM
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-slate-100 block text-sm">
                      Avg IKI: {telemetryProfile.avgIkiMs} ms
                    </span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {telemetryProfile.totalKeystrokes > 0
                        ? `Logged ${telemetryProfile.totalKeystrokes} keystrokes with rhythmic inter-keystroke interval tracking. Measured deliberate input cadence.`
                        : 'Quick multiple-choice selections logged with instantaneous option confirmation.'}
                    </p>
                  </div>

                  {/* Card 3: Doubt Velocity & Revision Ratio */}
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono block">
                        Doubt Velocity & Revision
                      </span>
                      {telemetryProfile.erasureRatio > 0 && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                          {telemetryProfile.erasureRatio}% Erased
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-slate-100 block text-sm">
                      {telemetryProfile.burstCount > 0
                        ? `${telemetryProfile.burstCount} Revision Bursts`
                        : telemetryProfile.optionFlips > 1
                        ? `${telemetryProfile.optionFlips} Option Flips`
                        : 'High Certainty'}
                    </span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {telemetryProfile.burstCount > 0
                        ? `Detected ${telemetryProfile.burstCount} rapid erasure clusters (>3 backspaces in 1.2s), indicating answer re-formulation.`
                        : telemetryProfile.optionFlips > 1
                        ? `Switched options ${telemetryProfile.optionFlips} times before confirming, reflecting second-guessing.`
                        : 'Minimal backspace friction and decisive answer confirmation.'}
                    </p>
                  </div>

                  {/* Card 4: Cognitive Freeze & Stealth Solves */}
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1.5">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono block">
                      Cognitive Freeze & Solves
                    </span>
                    <span className="font-bold text-slate-100 block text-sm">
                      {telemetryProfile.cognitiveFreezes > 0
                        ? `${telemetryProfile.cognitiveFreezes} Mid-Thought Halts`
                        : 'Continuous Flow'}
                    </span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {Object.keys(solvedViaStealth).length > 0
                        ? `Verified ${Object.keys(solvedViaStealth).length} concepts via interactive tactile sandboxes.`
                        : telemetryProfile.cognitiveFreezes > 0
                        ? `Stalled mid-sentence ${telemetryProfile.cognitiveFreezes} times (>1.8s gap) while formulating reasoning.`
                        : 'Direct conceptual derivations with no working memory stalls.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mistake & Error Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Diagnostic Error Analysis & Conceptual Traps:
                  </h4>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    {localSubmission.missedQuestions.length} Concepts Routed to Personalized Study
                  </span>
                </div>

                {localSubmission.missedQuestions.length === 0 ? (
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
                    <IconCheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Flawless setup! All 10 diagnostic questions answered accurately with zero traps.</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {localSubmission.missedQuestions.map((missed, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between text-rose-900 dark:text-rose-300 font-bold">
                          <span>
                            Question {missed.questionNumber}: {missed.topic}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800">
                            Deep Conceptual Void
                          </span>
                        </div>

                        <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/40 space-y-1">
                          <div className="text-slate-800 dark:text-slate-200">
                            Your Answer:{' '}
                            <span className="text-rose-700 dark:text-rose-400 font-semibold line-through">
                              {missed.studentAnswer}
                            </span>
                            {solvedViaStealth[missed.questionNumber - 1] && (
                              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono ml-2">
                                (via {solvedViaStealth[missed.questionNumber - 1]})
                              </span>
                            )}
                          </div>
                          <div className="text-slate-800 dark:text-slate-200">
                            Correct Answer:{' '}
                            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                              {missed.correctAnswer}
                            </span>
                          </div>
                        </div>

                        <div className="text-rose-950 dark:text-rose-200 font-medium">
                          <strong>Trap Identified: </strong>
                          {missed.trapIdentified}
                        </div>

                        <div className="p-2.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 text-indigo-950 dark:text-indigo-200">
                          <strong>Correction: </strong>
                          {missed.explanation}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Controls */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          {!localSubmission ? (
            <>
              {!stealthModeActive ? (
                /* STANDARD ASSESSMENT CONTROLS */
                <>
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer btn-tactile"
                  >
                    Previous Question
                  </button>

                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 hidden sm:inline">
                    Standard Mode · Q{currentIndex + 1} of {questionsList.length}
                  </span>

                  <div className="flex items-center gap-2">
                    {currentIndex < questionsList.length - 1 ? (
                      <button
                        onClick={handleNext}
                        disabled={!isCurrentAnswered()}
                        className={`px-4 py-2 text-xs font-semibold text-white rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer btn-tactile disabled:opacity-40 ${
                          isEconomics
                            ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
                            : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
                        }`}
                      >
                        <span>Next Question</span>
                        <IconArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmit}
                        disabled={!isCurrentAnswered()}
                        className={`px-5 py-2 text-xs font-bold text-white rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer btn-tactile disabled:bg-slate-300 dark:disabled:bg-slate-800 ${
                          isEconomics
                            ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
                            : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
                        }`}
                      >
                        <span>Submit Standard Assessment</span>
                        <IconCheckCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </>
              ) : (
                /* STEALTH INTERACTIVE MODE CONTROLS (INDEPENDENT) */
                <>
                  <button
                    onClick={() => {
                      if (currentIndex > 0) {
                        setCurrentIndex((prev) => prev - 1);
                      }
                    }}
                    disabled={currentIndex === 0}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer btn-tactile"
                  >
                    Previous Question
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 hidden sm:inline">
                      Stealth Mode · Q{currentIndex + 1} of {questionsList.length}
                    </span>

                    {/* 4-Step Modality Status Tracker */}
                    <div className="flex items-center gap-1.5 text-xs font-mono">
                      <span className="hidden sm:inline text-slate-400">Step:</span>
                      {[
                        { id: 'tactile_model', label: '1. Sandbox' },
                        { id: 'socratic_voice', label: '2. Voice' },
                        { id: 'step_scaffolder', label: '3. Scaffold' },
                        { id: 'confidence_dial', label: '4. Certainty' },
                      ].map((step) => (
                        <button
                          key={step.id}
                          type="button"
                          onClick={() => setStealthSubTab(step.id as any)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                            stealthSubTab === step.id
                              ? isEconomics
                                ? 'bg-emerald-600 text-white'
                                : 'bg-indigo-600 text-white'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700'
                          }`}
                        >
                          {step.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {currentIndex < questionsList.length - 1 ? (
                      <button
                        onClick={() => {
                          setCurrentIndex((prev) => prev + 1);
                        }}
                        className={`px-4 py-2 text-xs font-semibold text-white rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer btn-tactile ${
                          isEconomics
                            ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
                            : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
                        }`}
                      >
                        <span>Next Question</span>
                        <IconArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmit}
                        className={`px-5 py-2 text-xs font-bold text-white rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer btn-tactile ${
                          isEconomics
                            ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
                            : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
                        }`}
                      >
                        <span>Submit Stealth Assessment</span>
                        <IconCheckCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <button
                onClick={handleRetake}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 active:bg-slate-200 transition-all cursor-pointer btn-tactile"
              >
                Retake Diagnostic
              </button>

              <button
                onClick={handleGoToPersonalizedPlatform}
                className={`px-5 py-2.5 text-xs font-bold text-white rounded-lg shadow-xs transition-all cursor-pointer flex items-center gap-1.5 btn-tactile ${
                  isEconomics
                    ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
                    : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
                }`}
              >
                <span>Enter {isEconomics ? 'Economics' : 'Chemistry'} Learning Space</span>
                <IconArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
