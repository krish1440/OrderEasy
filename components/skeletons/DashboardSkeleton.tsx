import React from 'react';
import { motion } from 'framer-motion';

const SkeletonStatCard = () => (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm overflow-hidden relative group h-[120px]">
        <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        />
        <div className="flex justify-between items-start">
            <div className="space-y-3 w-full">
                <div className="h-4 w-1/3 bg-slate-100 rounded animate-pulse" />
                <div className="h-8 w-1/2 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="h-10 w-10 bg-slate-100 rounded-lg animate-pulse" />
        </div>
        <div className="mt-4 h-3 w-2/3 bg-slate-50 rounded animate-pulse" />
    </div>
);

const SkeletonChartArea = ({ colSpan = 1 }: { colSpan?: number }) => (
    <div className={`bg-white p-6 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden h-[400px] ${colSpan > 1 ? 'lg:col-span-' + colSpan : ''}`}>
        <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        />
        <div className="flex justify-between items-center mb-6">
            <div className="h-6 w-1/4 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-20 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="h-[300px] w-full bg-slate-50 rounded animate-pulse" />
    </div>
);

const DashboardSkeleton: React.FC = () => {
    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-2">
                <div className="h-8 w-1/4 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-1/3 bg-slate-100 rounded animate-pulse" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <SkeletonStatCard key={i} />
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <SkeletonChartArea />
                </div>
                <div>
                    <SkeletonChartArea />
                </div>
            </div>
        </div>
    );
};

export default DashboardSkeleton;
