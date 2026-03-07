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
        opacity: [0, 0.5, 0],
        transition: {
            repeat: Infinity,
            duration: 1.5,
            ease: "linear",
            repeatDelay: 0.2
        }
    }
};

const SkeletonStatCard = () => (
    <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 overflow-hidden relative group h-[120px]">
        <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-100/30 to-transparent skew-x-12 origin-left"
            variants={shimmer}
        />
        <div className="flex justify-between items-start">
            <div className="space-y-3 w-full">
                <div className="h-4 w-1/3 bg-slate-100/80 rounded-md animate-pulse" />
                <div className="h-8 w-1/2 bg-slate-200/80 rounded-lg animate-pulse" />
            </div>
            <div className="h-10 w-10 bg-brand-50/50 rounded-xl animate-pulse ring-1 ring-brand-100/50" />
        </div>
        <div className="mt-4 h-3 w-2/3 bg-slate-50 rounded-md animate-pulse" />
    </motion.div>
);

const SkeletonChartArea = ({ colSpan = 1 }: { colSpan?: number }) => (
    <motion.div variants={itemVariants} className={`bg-white p-6 rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 relative overflow-hidden h-[400px] ${colSpan > 1 ? 'lg:col-span-' + colSpan : ''}`}>
        <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-100/20 to-transparent skew-x-12 origin-left"
            variants={shimmer}
        />
        <div className="flex justify-between items-center mb-6">
            <div className="h-6 w-1/4 bg-slate-200/80 rounded-lg animate-pulse" />
            <div className="h-5 w-24 bg-brand-50/50 rounded-lg animate-pulse ring-1 ring-brand-100/50" />
        </div>
        <div className="h-[300px] w-full bg-slate-50/80 rounded-xl animate-pulse relative overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-slate-100/50 to-transparent" />

            {/* Fake chart bars */}
            <div className="absolute bottom-4 left-6 right-6 h-3/4 flex items-end justify-between gap-2 opacity-30">
                {[40, 70, 45, 90, 60, 30, 80, 50, 100, 65, 40, 85].map((h, i) => (
                    <motion.div
                        key={i}
                        className="w-full bg-brand-200 rounded-t-sm"
                        style={{ height: `${h}%`, originY: 1 }}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 1, delay: i * 0.05, ease: "easeOut" }}
                    />
                ))}
            </div>
        </div>
    </motion.div>
);

const DashboardSkeleton: React.FC = () => {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8"
        >
            <motion.div variants={itemVariants} className="space-y-3">
                <div className="h-10 w-1/4 bg-slate-200/80 rounded-xl animate-pulse" />
                <div className="h-5 w-1/3 bg-slate-100/80 rounded-md animate-pulse" />
            </motion.div>

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
        </motion.div>
    );
};

export default DashboardSkeleton;
