import React from 'react';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 24
        }
    }
};

const shimmer: Variants = {
    hidden: { x: '-100%', opacity: 0 },
    show: {
        x: '100%',
        opacity: [0, 0.4, 0],
        transition: {
            repeat: Infinity,
            duration: 1.5,
            ease: "linear",
            repeatDelay: 0.3
        }
    }
};

const SkeletonCard = () => (
    <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 overflow-hidden relative group">
        <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-100/30 to-transparent skew-x-12 origin-left"
            variants={shimmer}
        />
        <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center">
                <div className="h-4 w-1/3 bg-slate-100/80 rounded-md animate-pulse" />
                <div className="h-8 w-8 bg-brand-50/50 rounded-lg animate-pulse ring-1 ring-brand-100/50" />
            </div>
            <div className="h-8 w-1/2 bg-slate-200/80 rounded-lg animate-pulse" />
            <div className="h-4 w-1/4 bg-emerald-50 text-emerald-100 rounded-md animate-pulse bg-opacity-50" />
        </div>
    </motion.div>
);

const SkeletonChart = () => (
    <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 h-[400px] relative overflow-hidden group">
        <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-100/20 to-transparent skew-x-12 origin-left z-0"
            variants={shimmer}
        />
        <div className="flex justify-between items-center mb-8 relative z-10">
            <div className="h-6 w-1/3 bg-slate-200/80 rounded-lg animate-pulse" />
            <div className="h-8 w-24 bg-brand-50/50 rounded-lg animate-pulse border border-brand-100/50" />
        </div>
        <div className="h-[280px] w-full bg-slate-50/80 rounded-xl animate-pulse relative overflow-hidden flex items-end px-4 pb-4 gap-3">
            {/* Fake chart bars with cascade motion */}
            {[40, 60, 45, 80, 50, 90, 70, 100].map((h, i) => (
                <motion.div
                    key={i}
                    className="flex-1 bg-brand-200/50 rounded-t-sm"
                    style={{ height: `${h}%`, originY: 1 }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                />
            ))}
        </div>
    </motion.div>
);

const AnalyticsSkeleton: React.FC = () => {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8"
        >
            <motion.div variants={itemVariants} className="space-y-3">
                <div className="h-10 w-1/3 bg-slate-200/80 rounded-xl animate-pulse" />
                <div className="h-5 w-1/4 bg-slate-100/80 rounded-md animate-pulse" />
            </motion.div>

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
            <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 h-[350px] relative overflow-hidden group">
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-100/20 to-transparent skew-x-12 origin-left z-0"
                    variants={shimmer}
                />
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <div className="h-6 w-1/4 bg-slate-200/80 rounded-lg animate-pulse mb-6" />
                    <div className="flex gap-2">
                        <div className="h-8 w-24 bg-brand-50/50 rounded-lg animate-pulse border border-brand-100/50" />
                        <div className="h-8 w-8 bg-brand-50/50 rounded-lg animate-pulse border border-brand-100/50" />
                    </div>
                </div>

                <div className="h-[220px] w-full bg-slate-50/80 rounded-xl animate-pulse flex flex-col justify-end p-4 relative overflow-hidden">
                    {/* Fake Area Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 0.3, y: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-t from-brand-200 to-transparent rounded-b-xl"
                        style={{ clipPath: 'polygon(0% 100%, 0% 80%, 10% 60%, 20% 70%, 30% 40%, 40% 50%, 50% 20%, 60% 30%, 70% 10%, 80% 40%, 90% 20%, 100% 50%, 100% 100%)' }}
                    />
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AnalyticsSkeleton;
