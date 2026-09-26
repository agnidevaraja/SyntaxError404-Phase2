import React from 'react';

interface SkeletonBoxProps {
  className?: string;
  width?: string;
  height?: string;
}

export const SkeletonBox: React.FC<SkeletonBoxProps> = ({
  className = '',
  width = 'w-full',
  height = 'h-4',
}) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800 ${width} ${height} ${className}`}
      aria-hidden="true"
    />
  );
};

export const CardSkeleton: React.FC<{ count?: number; className?: string }> = ({
  count = 1,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <SkeletonBox width="w-9" height="h-9" className="rounded-lg" />
            <SkeletonBox width="w-16" height="h-5" className="rounded" />
          </div>
          <div className="space-y-2">
            <SkeletonBox width="w-3/4" height="h-5" />
            <SkeletonBox width="w-1/2" height="h-3" />
          </div>
          <div className="space-y-1.5 pt-2">
            <SkeletonBox width="w-full" height="h-3" />
            <SkeletonBox width="w-5/6" height="h-3" />
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between">
            <SkeletonBox width="w-24" height="h-4" />
            <SkeletonBox width="w-12" height="h-4" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const GraphSkeleton: React.FC<{ height?: string }> = ({ height = 'h-64' }) => {
  return (
    <div className={`p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs`}>
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <SkeletonBox width="w-48" height="h-5" />
          <SkeletonBox width="w-72" height="h-3" />
        </div>
        <SkeletonBox width="w-36" height="h-8" className="rounded-xl" />
      </div>
      <div className={`w-full ${height} rounded-xl bg-slate-100 dark:bg-slate-950 flex items-end p-4 gap-4 animate-pulse`}>
        <div className="w-1/7 h-1/3 bg-slate-200 dark:bg-slate-800 rounded-t" />
        <div className="w-1/7 h-1/2 bg-slate-200 dark:bg-slate-800 rounded-t" />
        <div className="w-1/7 h-2/3 bg-slate-200 dark:bg-slate-800 rounded-t" />
        <div className="w-1/7 h-3/4 bg-slate-200 dark:bg-slate-800 rounded-t" />
        <div className="w-1/7 h-4/5 bg-slate-200 dark:bg-slate-800 rounded-t" />
        <div className="w-1/7 h-5/6 bg-slate-200 dark:bg-slate-800 rounded-t" />
        <div className="w-1/7 h-full bg-slate-200 dark:bg-slate-800 rounded-t" />
      </div>
    </div>
  );
};

export const LessonSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
        <SkeletonBox width="w-1/2" height="h-6" />
        <div className="w-full aspect-video rounded-xl bg-slate-950 animate-pulse flex items-center justify-center">
          <SkeletonBox width="w-16" height="h-16" className="rounded-2xl bg-slate-800" />
        </div>
        <div className="flex justify-between pt-2">
          <SkeletonBox width="w-32" height="h-4" />
          <SkeletonBox width="w-48" height="h-4" />
        </div>
      </div>
      <div className="lg:col-span-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
        <SkeletonBox width="w-36" height="h-5" />
        <div className="space-y-3">
          <SkeletonBox width="w-full" height="h-12" className="rounded-xl" />
          <SkeletonBox width="w-full" height="h-12" className="rounded-xl" />
          <SkeletonBox width="w-full" height="h-12" className="rounded-xl" />
          <SkeletonBox width="w-full" height="h-12" className="rounded-xl" />
        </div>
      </div>
    </div>
  );
};
