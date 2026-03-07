import React from 'react';
import { motion, Variants } from 'framer-motion';
import TableSkeleton from './TableSkeleton';

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
    hidden: { opacity: 0, y: 15 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 300, damping: 24 }
    }
};

const OrderDetailSkeleton: React.FC = () => {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6 max-w-6xl mx-auto"
        >
            {/* Back Button Skeleton */}
            <motion.div variants={itemVariants} className="h-6 w-32 bg-slate-200/80 rounded-md animate-pulse mb-4" />

            {/* Header Card Skeleton */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-100 p-6 space-y-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-50/20 to-transparent skew-x-12 translate-x-[-100%] animate-[shimmer_2s_infinite]" />

                <div className="flex flex-col md:flex-row justify-between items-start gap-4 relative z-10">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-48 bg-slate-200/80 rounded-lg animate-pulse" />
                            <div className="h-6 w-24 bg-brand-100/50 rounded-full animate-pulse" />
                        </div>
                        <div className="h-4 w-40 bg-slate-100/80 rounded-md animate-pulse mt-2" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-24 bg-slate-100/80 rounded-xl animate-pulse" />
                        <div className="h-10 w-36 bg-brand-50/50 rounded-xl animate-pulse" />
                        <div className="h-10 w-10 bg-rose-50/50 rounded-xl animate-pulse" />
                    </div>
                </div>

                {/* Stats Grid Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 p-4 bg-slate-50/80 rounded-xl border border-slate-100/80 relative z-10">
                    <div className="col-span-2 space-y-2">
                        <div className="h-3 w-16 bg-slate-200/80 rounded-sm animate-pulse" />
                        <div className="h-6 w-full bg-slate-200/80 rounded-md animate-pulse" />
                        <div className="h-3 w-3/4 bg-slate-100/80 rounded-sm mt-1 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 w-20 bg-slate-200/80 rounded-sm animate-pulse" />
                        <div className="h-5 w-24 bg-slate-200/80 rounded-md animate-pulse" />
                        <div className="h-3 w-16 bg-slate-100/80 rounded-sm animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 w-20 bg-slate-200/80 rounded-sm animate-pulse" />
                        <div className="h-5 w-24 bg-brand-50/80 rounded-md animate-pulse" />
                        <div className="h-3 w-20 bg-brand-100/50 rounded-sm animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 w-24 bg-slate-200/80 rounded-sm animate-pulse" />
                        <div className="h-6 w-28 bg-slate-200/80 rounded-md animate-pulse" />
                        <div className="h-3 w-20 bg-slate-100/80 rounded-sm animate-pulse" />
                    </div>

                    <div className="space-y-2 mt-2">
                        <div className="h-3 w-16 bg-slate-200/80 rounded-sm animate-pulse" />
                        <div className="h-5 w-12 bg-slate-200/80 rounded-md animate-pulse" />
                    </div>
                    <div className="space-y-2 mt-2">
                        <div className="h-3 w-16 bg-slate-200/80 rounded-sm animate-pulse" />
                        <div className="h-5 w-12 bg-emerald-50 text-emerald-100 rounded-md animate-pulse" />
                    </div>
                    <div className="space-y-2 mt-2">
                        <div className="h-3 w-20 bg-slate-200/80 rounded-sm animate-pulse" />
                        <div className="h-5 w-12 bg-amber-50 text-amber-100 rounded-md animate-pulse" />
                    </div>
                    <div className="col-span-2 space-y-2 mt-2">
                        <div className="h-3 w-32 bg-slate-200/80 rounded-sm animate-pulse" />
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full w-1/2 bg-brand-300 rounded-full animate-pulse" />
                            </div>
                            <div className="h-3 w-6 bg-slate-200/80 rounded-sm animate-pulse" />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Deliveries Section Skeleton */}
            <motion.div variants={itemVariants} className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="h-5 w-5 bg-slate-200/80 rounded-md animate-pulse" />
                        <div className="h-6 w-36 bg-slate-200/80 rounded-lg animate-pulse" />
                    </div>
                    <div className="flex gap-2">
                        <div className="h-9 w-32 bg-slate-100/80 rounded-lg animate-pulse" />
                        <div className="h-9 w-32 bg-brand-100/50 rounded-lg animate-pulse" />
                    </div>
                </div>
                <TableSkeleton />
            </motion.div>
        </motion.div>
    );
};

export default OrderDetailSkeleton;
