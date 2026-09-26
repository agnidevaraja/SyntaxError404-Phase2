import React from 'react';
import {
  BookOpenIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  ArrowUpTrayIcon,
  ShieldCheckIcon,
  UserIcon,
  BellIcon,
  PlayIcon,
  PauseIcon,
  MicrophoneIcon,
  AdjustmentsHorizontalIcon,
  LockClosedIcon,
  LockOpenIcon,
  XMarkIcon,
  SparklesIcon,
  BoltIcon,
  CalendarIcon,
  AcademicCapIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

import {
  CheckCircleIcon as CheckCircleSolid,
  ExclamationTriangleIcon as ExclamationTriangleSolid,
  ShieldCheckIcon as ShieldCheckSolid,
  BoltIcon as BoltSolid,
} from '@heroicons/react/24/solid';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

// Clean Heroicons mappings
export const IconBookOpen = BookOpenIcon;
export const IconFileText = DocumentTextIcon;
export const IconArrowRight = ArrowRightIcon;
export const IconCheckCircle = CheckCircleIcon;
export const IconCheckCircleSolid = CheckCircleSolid;
export const IconAlertTriangle = ExclamationTriangleIcon;
export const IconAlertTriangleSolid = ExclamationTriangleSolid;
export const IconChevronLeft = ChevronLeftIcon;
export const IconChevronRight = ChevronRightIcon;
export const IconRefreshCw = ArrowPathIcon;
export const IconUpload = ArrowUpTrayIcon;
export const IconShield = ShieldCheckIcon;
export const IconShieldSolid = ShieldCheckSolid;
export const IconUser = UserIcon;
export const IconBell = BellIcon;
export const IconPlay = PlayIcon;
export const IconPause = PauseIcon;
export const IconMic = MicrophoneIcon;
export const IconSliders = AdjustmentsHorizontalIcon;
export const IconLock = LockClosedIcon;
export const IconUnlock = LockOpenIcon;
export const IconX = XMarkIcon;
export const IconSparkles = SparklesIcon;
export const IconZap = BoltIcon;
export const IconZapSolid = BoltSolid;
export const IconCalendar = CalendarIcon;
export const IconAcademic = AcademicCapIcon;
export const IconSearch = MagnifyingGlassIcon;
export const IconChat = ChatBubbleLeftRightIcon;

// Chemistry / Scientific Domain SVG Icons (matching Heroicons 24x24 stroke aesthetic)
export const IconAtom: React.FC<IconProps> = ({ className = 'w-5 h-5', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="2.25" fill="currentColor" />
    <ellipse cx="12" cy="12" rx="9" ry="3.75" transform="rotate(30 12 12)" />
    <ellipse cx="12" cy="12" rx="9" ry="3.75" transform="rotate(90 12 12)" />
    <ellipse cx="12" cy="12" rx="9" ry="3.75" transform="rotate(150 12 12)" />
  </svg>
);

export const IconFlask: React.FC<IconProps> = ({ className = 'w-5 h-5', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M10 2v7.31L4.2 18.06A2 2 0 0 0 5.86 21h12.28a2 2 0 0 0 1.66-2.94L14 9.31V2" />
    <path d="M8.5 2h7" />
    <path d="M7 16h10" />
    <circle cx="10" cy="18.5" r="0.75" fill="currentColor" />
    <circle cx="14" cy="18" r="0.75" fill="currentColor" />
  </svg>
);

export const IconMolecule: React.FC<IconProps> = ({ className = 'w-5 h-5', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="3" />
    <circle cx="19" cy="5" r="2.5" />
    <circle cx="5" cy="19" r="2.5" />
    <circle cx="20" cy="18" r="2" />
    <path d="M14.5 9.5l2.5-2.5" />
    <path d="M9.5 14.5l-2.5 2.5" />
    <path d="M14.5 13.5l3.5 3" />
  </svg>
);

export const IconGraph: React.FC<IconProps> = ({ className = 'w-5 h-5', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="5" cy="12" r="2.5" />
    <circle cx="19" cy="6" r="2.5" />
    <circle cx="19" cy="18" r="2.5" />
    <path d="M7.5 11l9-3.5" />
    <path d="M7.5 13l9 3.5" />
  </svg>
);
