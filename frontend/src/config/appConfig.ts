/**
 * Outstand Platform - Centralized Application Configuration
 * Extracts all magic numbers, API endpoints, storage keys, and environment variables into a single typed source of truth.
 */

const env: Record<string, string | undefined> =
  typeof import.meta !== 'undefined' && import.meta.env
    ? (import.meta.env as any)
    : typeof process !== 'undefined'
    ? (process.env as any)
    : {};

export const APP_CONFIG = {
  app: {
    name: 'Outstand',
    version: '2.0.0',
    description: 'Adaptive Cognitive Mastery Engine',
    environment: env.MODE || (env.PROD ? 'production' : 'development'),
    isProduction: Boolean(env.PROD),
    isDevelopment: Boolean(env.DEV),
  },

  firebase: {
    apiKey: env.VITE_FIREBASE_API_KEY || '',
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'outstand-adaptive-learning-hub.firebaseapp.com',
    projectId: env.VITE_FIREBASE_PROJECT_ID || 'outstand-adaptive-learning-hub',
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'outstand-adaptive-learning-hub.firebasestorage.app',
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '865996503358',
    appId: env.VITE_FIREBASE_APP_ID || '1:865996503358:web:c6479bfff2a950c6b0146f',
    measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || 'G-R4SSDEC6SS',
  },

  gemini: {
    apiKey: env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || '',
    opportunitiesApiKey: env.VITE_GEMINI_OPPORTUNITIES_API_KEY || env.VITE_GEMINI_API_KEY || '',
    primaryModel: 'gemini-3.8-flash',
    fallbackModel: 'gemini-2.5-flash',
  },

  security: {
    minPasswordLength: 8,
    rateLimitMaxAttempts: 5,
    rateLimitLockoutMs: 30000,
  },

  storageKeys: {
    authUser: 'outstand_auth_user',
    authRole: 'outstand_auth_role',
    canSwitchSubject: 'outstand_can_switch_subject',
    facilitatorSubject: 'outstand_facilitator_subject',
    diagnosticSubmission: 'outstand_diagnostic_submission',
    economicsDiagnosticSubmission: 'outstand_economics_diagnostic_submission',
    theme: 'outstand_theme_preference',
  },

  firestoreCollections: {
    users: 'users',
    progress: 'progress',
    personalizedChats: 'personalized_chats',
    messagesSubcollection: 'messages',
  },

  defaults: {
    defaultStudentId: 'std-rohan',
    defaultStudentName: 'Demo Student',
    defaultChemistryFacilitator: 'Dr. Eleanor Vance',
    defaultEconomicsFacilitator: 'Prof. Arthur Sterling',
  },
} as const;

export default APP_CONFIG;
