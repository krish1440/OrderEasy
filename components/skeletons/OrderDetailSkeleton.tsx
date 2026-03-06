import React from 'react';
import TableSkeleton from './TableSkeleton';

const OrderDetailSkeleton: React.FC = () => {
    return (
        <div className="space-y-6 max-w-6xl mx-auto animate-fade-in-up">
            {/* Back Button Skeleton */}
            <div className="h-6 w-32 bg-slate-200 rounded animate-pulse mb-4" />

            {/* Header Card Skeleton */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
                            <div className="h-6 w-24 bg-slate-200 rounded-full animate-pulse" />
                        </div>
                        <div className="h-4 w-40 bg-slate-200 rounded animate-pulse mt-2" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-24 bg-slate-200 rounded-lg animate-pulse" />
                        <div className="h-10 w-36 bg-slate-200 rounded-lg animate-pulse" />
                        <div className="h-10 w-10 bg-slate-200 rounded-lg animate-pulse" />
                    </div>
                </div>

                {/* Stats Grid Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="col-span-2 space-y-2">
                        <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
                        <div className="h-6 w-full bg-slate-200 rounded animate-pulse" />
                        <div className="h-3 w-3/4 bg-slate-200 rounded mt-1 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
                        <div className="h-5 w-24 bg-slate-200 rounded animate-pulse" />
                        <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
                        <div className="h-5 w-24 bg-slate-200 rounded animate-pulse" />
                        <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
                        <div className="h-6 w-28 bg-slate-200 rounded animate-pulse" />
                        <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
                    </div>

                    <div className="space-y-2 mt-2">
                        <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
                        <div className="h-5 w-12 bg-slate-200 rounded animate-pulse" />
                    </div>
                    <div className="space-y-2 mt-2">
                        <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
                        <div className="h-5 w-12 bg-slate-200 rounded animate-pulse" />
                    </div>
                    <div className="space-y-2 mt-2">
                        <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
                        <div className="h-5 w-12 bg-slate-200 rounded animate-pulse" />
                    </div>
                    <div className="col-span-2 space-y-2 mt-2">
                        <div className="h-3 w-32 bg-slate-200 rounded animate-pulse" />
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden animate-pulse" />
                            <div className="h-3 w-6 bg-slate-200 rounded animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Deliveries Section Skeleton */}
            <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="h-5 w-5 bg-slate-200 rounded animate-pulse" />
                        <div className="h-6 w-36 bg-slate-200 rounded animate-pulse" />
                    </div>
                    <div className="flex gap-2">
                        <div className="h-9 w-32 bg-slate-200 rounded-lg animate-pulse" />
                        <div className="h-9 w-32 bg-slate-200 rounded-lg animate-pulse" />
                    </div>
                </div>
                <TableSkeleton />
            </div>
        </div>
    );
};

export default OrderDetailSkeleton;
