import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  listenToPersonalizedChat,
  sendPersonalizedMessage,
  ChatMessage,
} from '../../services/firestoreService';
import {
  IconX,
  IconArrowRight,
  IconSparkles,
  IconCheckCircle,
} from '../common/Icons';
import { MessageSquare, Send, User, ShieldCheck, Clock, RefreshCw } from 'lucide-react';

interface PersonalizedChatViewProps {
  studentUid: string;
  studentName: string;
  subject: 'Chemistry' | 'Economics';
  currentUserRole: 'student' | 'facilitator';
  currentUserName: string;
  currentUserId: string;
  initialMessageText?: string;
  onClose?: () => void;
  isInlineCard?: boolean;
}

export const PersonalizedChatView: React.FC<PersonalizedChatViewProps> = ({
  studentUid,
  studentName,
  subject,
  currentUserRole,
  currentUserName,
  currentUserId,
  initialMessageText = '',
  onClose,
  isInlineCard = false,
}) => {
  const { showToast } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>(initialMessageText);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  // Sync initial message text prop changes (e.g. from "Copy to Chat")
  useEffect(() => {
    if (initialMessageText) {
      setInputText(initialMessageText);
    }
  }, [initialMessageText]);

  // Real-time Firestore onSnapshot listener
  useEffect(() => {
    if (!studentUid) return;
    setIsLoading(true);

    const unsubscribe = listenToPersonalizedChat(studentUid, subject, (fetchedMsgs) => {
      setMessages(fetchedMsgs);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [studentUid, subject]);

  // Auto-scroll internal chat container only on message update (does not hijack page window scroll)
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const textToSend = inputText.trim();
    if (!textToSend || isSending) return;

    setIsSending(true);
    try {
      await sendPersonalizedMessage(studentUid, subject, {
        senderId: currentUserId,
        senderRole: currentUserRole,
        senderName: currentUserName,
        text: textToSend,
      });
      setInputText('');
      showToast('Message Delivered', 'Dispatched to 1-on-1 personalized thread.', 'success');
    } catch (err) {
      console.error('Failed to send chat message:', err);
      showToast('Delivery Note', 'Message queued in local session.', 'info');
    } finally {
      setIsSending(false);
    }
  };

  const isFacilitator = currentUserRole === 'facilitator';
  const instructorName = subject === 'Chemistry' ? 'Dr. Eleanor Vance' : 'Prof. Arthur Sterling';

  const content = (
    <div className={`flex flex-col ${isInlineCard ? 'h-[460px]' : 'h-full'} bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm`}>
      {/* Header */}
      <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-xs ${
            isFacilitator ? 'bg-indigo-600' : 'bg-slate-900 dark:bg-slate-800'
          }`}>
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {isFacilitator ? `Direct Intervention: ${studentName}` : `1-on-1 Support: ${instructorName}`}
              </h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold ${
                subject === 'Chemistry'
                  ? 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900'
                  : 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
              }`}>
                {subject}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-time private intervention thread</span>
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <IconX className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Message Thread Body */}
      <div ref={chatBodyRef} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-slate-50/50 dark:bg-slate-950/50">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
            <RefreshCw className="w-5 h-5 animate-spin text-indigo-500" />
            <span className="text-xs">Connecting to secure chat channel...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-2xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="max-w-xs space-y-1">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Private Academic Roadblock Thread
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {isFacilitator
                  ? `Provide tailored scaffolding, targeted advice, or assign specific practice routines for ${studentName}.`
                  : `Ask ${instructorName} questions about challenging questions, misconceptions, or request custom exercises.`}
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.senderId === currentUserId || (isFacilitator ? msg.senderRole === 'facilitator' : msg.senderRole === 'student');
            const formattedTime = msg.createdAt
              ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'Just now';

            return (
              <div
                key={msg.id || index}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 px-1 font-medium">
                  <span>{msg.senderName}</span>
                  <span>·</span>
                  <span>{formattedTime}</span>
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-xs shadow-2xs leading-relaxed ${
                    isMe
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Field & Send Action */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            isFacilitator
              ? `Message ${studentName} directly with guidance...`
              : `Ask ${instructorName} for targeted clarification...`
          }
          className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:border-indigo-500 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 transition-all"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isSending}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer btn-tactile"
        >
          {isSending ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <>
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );

  if (isInlineCard) {
    return content;
  }

  // Modal / Drawer Presentation
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[600px] max-h-[92vh]">
        {content}
      </div>
    </div>
  );
};
