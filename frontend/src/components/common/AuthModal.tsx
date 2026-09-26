import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  IconAtom,
  IconX,
  IconSparkles,
  IconShield,
  IconCheckCircle,
  IconAlertTriangle,
  IconArrowRight,
  IconZap,
} from './Icons';
import { Eye, EyeOff, Mail, Lock, User, LogIn, UserPlus } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalInitialRole,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    loginDemoQuickFill,
  } = useApp();

  const [activeRole, setActiveRole] = useState<'student' | 'facilitator'>(authModalInitialRole);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync role when modal opens with initial role
  React.useEffect(() => {
    if (isAuthModalOpen) {
      setActiveRole(authModalInitialRole);
      setErrorMessage(null);
    }
  }, [isAuthModalOpen, authModalInitialRole]);

  if (!isAuthModalOpen) return null;

  const handleRoleChange = (role: 'student' | 'facilitator') => {
    setActiveRole(role);
    setErrorMessage(null);
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      await loginWithGoogle(activeRole);
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Google Sign-In was cancelled or popup window was closed.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setErrorMessage('Domain not authorized in Firebase Console. Use Developer Quick-Fill or authorize localhost.');
      } else {
        setErrorMessage(err.message || 'Failed to authenticate with Google.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage('Please enter an email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter a password.');
      return;
    }

    if (authMode === 'signup') {
      if (!name.trim()) {
        setErrorMessage('Please provide your full name for registration.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please re-enter.');
        return;
      }

      setIsLoading(true);
      try {
        await registerWithEmail(cleanEmail, password, name.trim(), activeRole);
      } catch (err: any) {
        console.error('Registration failed:', err);
        if (err.code === 'auth/email-already-in-use') {
          setErrorMessage('An account with this email already exists. Switch to Sign In.');
        } else if (err.code === 'auth/invalid-email') {
          setErrorMessage('Please enter a valid email address.');
        } else if (err.code === 'auth/weak-password') {
          setErrorMessage('Password is too weak. Must be at least 6 characters.');
        } else {
          setErrorMessage(err.message || 'Failed to create account.');
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(true);
      try {
        await loginWithEmail(cleanEmail, password, activeRole);
      } catch (err: any) {
        console.error('Email sign-in failed:', err);
        // If demo credentials and not in Firebase yet, launch demo
        if (cleanEmail === 'student@outstand.edu') {
          loginDemoQuickFill('student');
          return;
        }
        if (cleanEmail === 'facilitator.chem@outstand.edu' || cleanEmail === 'facilitator@outstand.edu') {
          loginDemoQuickFill('facilitator', 'chemistry');
          return;
        }
        if (cleanEmail === 'facilitator.econ@outstand.edu') {
          loginDemoQuickFill('facilitator', 'economics');
          return;
        }
        if (
          err.code === 'auth/invalid-credential' ||
          err.code === 'auth/wrong-password' ||
          err.code === 'auth/user-not-found'
        ) {
          setErrorMessage('Invalid email or password. Please verify or use Developer Quick-Fill.');
        } else if (err.code === 'auth/invalid-email') {
          setErrorMessage('Please enter a valid email address.');
        } else {
          setErrorMessage(err.message || 'Authentication failed. Please check credentials.');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleQuickFillForm = () => {
    if (activeRole === 'student') {
      setEmail('student@outstand.edu');
      setPassword('Outstand2026!');
      setName('Demo Student');
      setConfirmPassword('Outstand2026!');
    } else {
      setEmail('facilitator.chem@outstand.edu');
      setPassword('Outstand2026!');
      setName('Dr. Eleanor Vance');
      setConfirmPassword('Outstand2026!');
    }
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <IconAtom className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-snug">
                Sign In to Outstand
              </h2>
              <p className="text-xs text-slate-500">
                Personalized Adaptive Learning Portal
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Role Switcher Tabs */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Select Your Role:
            </span>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => handleRoleChange('student')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeRole === 'student'
                    ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <IconAtom className="w-4 h-4 text-indigo-600" />
                <span>Student Portal</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('facilitator')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeRole === 'facilitator'
                    ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <IconShield className="w-4 h-4 text-emerald-600" />
                <span>Facilitator Portal</span>
              </button>
            </div>
          </div>

          {/* SECTION 1: DEVELOPER / DEMO QUICK-FILL (ONE-CLICK LOGIN) */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xs border border-indigo-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-amber-400/20 text-amber-300 flex items-center justify-center text-xs">
                  <IconZap className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Developer / Demo Quick-Fill
                </span>
              </div>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-slate-300 font-mono">
                One-Click
              </span>
            </div>

            {activeRole === 'student' ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">
                    Demo Student (Student Portal)
                  </span>
                  <span className="text-[11px] text-slate-300 font-mono block">
                    student@outstand.edu • Chemistry & Economics
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleQuickFillForm}
                    className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition-colors cursor-pointer"
                    title="Populate input fields below"
                  >
                    Fill Form
                  </button>
                  <button
                    type="button"
                    onClick={() => loginDemoQuickFill('student')}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer btn-tactile"
                  >
                    <IconSparkles className="w-3.5 h-3.5" />
                    <span>Launch Student ➔</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                {/* Chemistry Facilitator */}
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-emerald-300">Chemistry Facilitator</span>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">Fixed Subject</span>
                    </div>
                    <span className="text-[10px] text-slate-300 font-mono block">
                      facilitator.chem@outstand.edu (Dr. Eleanor Vance)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEmail('facilitator.chem@outstand.edu');
                        setPassword('Outstand2026!');
                        setName('Dr. Eleanor Vance');
                        setConfirmPassword('Outstand2026!');
                        setErrorMessage(null);
                      }}
                      className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] font-semibold transition-colors cursor-pointer"
                    >
                      Fill Form
                    </button>
                    <button
                      type="button"
                      onClick={() => loginDemoQuickFill('facilitator', 'chemistry')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <IconSparkles className="w-3 h-3" />
                      <span>Chemistry Portal ➔</span>
                    </button>
                  </div>
                </div>

                {/* Economics Facilitator */}
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-amber-300">Economics Facilitator</span>
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">Fixed Subject</span>
                    </div>
                    <span className="text-[10px] text-slate-300 font-mono block">
                      facilitator.econ@outstand.edu (Prof. Arthur Sterling)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEmail('facilitator.econ@outstand.edu');
                        setPassword('Outstand2026!');
                        setName('Prof. Arthur Sterling');
                        setConfirmPassword('Outstand2026!');
                        setErrorMessage(null);
                      }}
                      className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] font-semibold transition-colors cursor-pointer"
                    >
                      Fill Form
                    </button>
                    <button
                      type="button"
                      onClick={() => loginDemoQuickFill('facilitator', 'economics')}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <IconSparkles className="w-3 h-3" />
                      <span>Economics Portal ➔</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2 animate-in fade-in duration-150">
              <IconAlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                <strong>Authentication Notice: </strong>
                {errorMessage}
              </div>
            </div>
          )}

          {/* SECTION 2: GOOGLE SIGN-IN */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer btn-tactile disabled:opacity-50"
            >
              {/* Google G Logo */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 absolute">
              or with email & password
            </span>
          </div>

          {/* SECTION 3: EMAIL & PASSWORD AUTHENTICATION */}
          <form onSubmit={handleEmailAuth} className="space-y-3.5">
            
            {/* Mode Toggle: Sign In vs Sign Up */}
            <div className="flex items-center justify-between text-xs pb-1">
              <span className="font-semibold text-slate-700">
                {authMode === 'signin' ? 'Sign In with Password' : 'Create New Account'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setAuthMode((prev) => (prev === 'signin' ? 'signup' : 'signin'));
                  setErrorMessage(null);
                }}
                className="text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer"
              >
                {authMode === 'signin' ? 'Need an account? Register' : 'Existing account? Sign In'}
              </button>
            </div>

            {/* Name Field (if Registration) */}
            {authMode === 'signup' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={activeRole === 'student' ? 'e.g., Demo Student' : 'e.g., Dr. Eleanor Vance'}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-indigo-600 focus:bg-white focus:outline-none transition-all shadow-xs"
                />
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={activeRole === 'student' ? 'student@outstand.edu' : 'facilitator@outstand.edu'}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-indigo-600 focus:bg-white focus:outline-none transition-all shadow-xs"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Password</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-indigo-600 focus:bg-white focus:outline-none transition-all shadow-xs"
              />
            </div>

            {/* Confirm Password Field (if Registration) */}
            {authMode === 'signup' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Confirm Password</span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-indigo-600 focus:bg-white focus:outline-none transition-all shadow-xs"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer btn-tactile disabled:opacity-50 mt-2 ${
                activeRole === 'student'
                  ? 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
                  : 'bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900'
              }`}
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : authMode === 'signin' ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In as {activeRole === 'student' ? 'Student' : 'Facilitator'}</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Register {activeRole === 'student' ? 'Student' : 'Facilitator'} Account</span>
                </>
              )}
            </button>
          </form>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <span>Protected with Firebase Authentication</span>
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(false)}
            className="hover:text-slate-600 underline cursor-pointer"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};
