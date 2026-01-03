import React from 'react';
import { motion } from 'framer-motion';

const SkeletonCard = () => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm overflow-hidden relative">
        <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        />
        <div className="space-y-4">
            <div className="h-4 w-1/3 bg-slate-100 rounded animate-pulse" />
            <div className="h-8 w-1/2 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-1/4 bg-slate-100 rounded animate-pulse" />
        </div>
    </div>
);

const SkeletonChart = () => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-[400px] relative overflow-hidden">
        <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        />
        <div className="flex justify-between items-center mb-8">
            <div className="h-6 w-1/4 bg-slate-200 rounded animate-pulse" />
            <div className="h-8 w-24 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="h-[300px] w-full bg-slate-50 rounded-lg animate-pulse" />
    </div>
);

const AnalyticsSkeleton: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* KPI Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>

            {/* Charts Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SkeletonChart />
                <SkeletonChart />
            </div>

            {/* Wide Chart Skeleton */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-[300px] relative overflow-hidden">
                <div className="h-6 w-1/6 bg-slate-200 rounded animate-pulse mb-6" />
                <div className="h-full w-full bg-slate-50 rounded animate-pulse" />
            </div>
        </div>
    );
};

export default AnalyticsSkeleton;
