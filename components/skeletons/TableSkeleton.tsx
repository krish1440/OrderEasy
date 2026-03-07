import React from 'react';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1,
        }
    }
};

const rowVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    show: {
        opacity: 1,
        x: 0,
        transition: { type: "spring", stiffness: 300, damping: 24 }
    }
};

const shimmer: Variants = {
    hidden: { x: '-100%', opacity: 0 },
    show: {
        x: '100%',
        opacity: [0, 0.5, 0],
        transition: {
            repeat: Infinity,
            duration: 2,
            ease: "linear",
            repeatDelay: 0.1
        }
    }
};

const TableSkeleton: React.FC = () => {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-100 overflow-hidden"
        >
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/80 border-b border-slate-100">
                        <tr>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <th key={i} className="px-6 py-4">
                                    <div className="h-4 w-20 bg-slate-200/80 rounded-md animate-pulse" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <motion.tbody
                        variants={containerVariants}
                        className="divide-y divide-slate-100/80"
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
                            <motion.tr variants={rowVariants} key={row} className="relative group hover:bg-slate-50/50 transition-colors">
                                {/* Shimmer Overlay for Row */}
                                <td colSpan={8} className="p-0 relative h-[70px] overflow-hidden">
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-100/20 to-transparent skew-x-12 origin-left z-10"
                                        variants={shimmer}
                                    />
                                    <div className="flex items-center h-full px-6 gap-6 relative z-0">
                                        <div className="h-4 w-12 bg-slate-100 rounded-md animate-pulse" />
                                        <div className="h-4 w-32 bg-slate-100 rounded-md animate-pulse" />
                                        <div className="h-4 w-24 bg-brand-50 rounded-md animate-pulse" />
                                        <div className="h-4 w-20 bg-slate-100 rounded-md animate-pulse" />
                                        <div className="h-6 w-16 bg-emerald-50 rounded-full animate-pulse" />
                                        <div className="h-4 w-12 bg-slate-100 rounded-md animate-pulse" />
                                        <div className="h-4 w-20 bg-slate-100 rounded-md animate-pulse" />
                                        <div className="h-8 w-8 bg-slate-100 rounded-md animate-pulse ml-auto" />
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </motion.tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default TableSkeleton;
