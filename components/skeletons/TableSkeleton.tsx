import React from 'react';
import { motion } from 'framer-motion';

const TableSkeleton: React.FC = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in-up">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <th key={i} className="px-6 py-4">
                                    <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
                            <tr key={row} className="relative group">
                                {/* Shimmer Overlay for Row */}
                                <td colSpan={8} className="p-0 relative h-[70px]">
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent z-10"
                                        animate={{ x: ['-100%', '100%'] }}
                                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                    />
                                    <div className="flex items-center h-full px-6 gap-6">
                                        <div className="h-4 w-12 bg-slate-100 rounded animate-pulse" />
                                        <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
                                        <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
                                        <div className="h-4 w-20 bg-slate-100 rounded animate-pulse" />
                                        <div className="h-6 w-16 bg-slate-100 rounded-full animate-pulse" />
                                        <div className="h-4 w-12 bg-slate-100 rounded animate-pulse" />
                                        <div className="h-4 w-20 bg-slate-100 rounded animate-pulse" />
                                        <div className="h-4 w-10 bg-slate-100 rounded animate-pulse" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableSkeleton;
