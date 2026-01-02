import React, { useState } from 'react';
import { api } from '../services/api';
import { FileDown, Calendar, Filter, AlertCircle } from 'lucide-react';

const Exports: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Orders Filter
    const [orderStatus, setOrderStatus] = useState('All');
    const [orderStart, setOrderStart] = useState('');
    const [orderEnd, setOrderEnd] = useState('');

    // Revenue Filter
    const [revStartYear, setRevStartYear] = useState('');
    const [revEndYear, setRevEndYear] = useState('');

    // Deliveries Filter
    const [delStart, setDelStart] = useState('');
    const [delEnd, setDelEnd] = useState('');

    const handleExportOrders = async () => {
        setLoading(true);
        setError('');
        try {
            const params = new URLSearchParams();
            if (orderStatus !== 'All') params.append('status', orderStatus);
            if (orderStart) params.append('start_date', orderStart);
            if (orderEnd) params.append('end_date', orderEnd);

            await api.download(`/exports/orders?${params.toString()}`, 'orders_export.xlsx');
        } catch (e: any) {
            console.error(e);
            setError(e.message || "Failed to export orders");
        } finally {
            setLoading(false);
        }
    };

    const handleExportRevenue = async () => {
        setLoading(true);
        setError('');
        try {
            const params = new URLSearchParams();
            if (revStartYear) params.append('start_year', revStartYear);
            if (revEndYear) params.append('end_year', revEndYear);

            await api.download(`/exports/revenue-summary?${params.toString()}`, 'revenue_summary.xlsx');
        } catch (e: any) {
            console.error(e);
            setError(e.message || "Failed to export revenue report");
        } finally {
            setLoading(false);
        }
    };

    const handleExportDeliveries = async () => {
        setLoading(true);
        setError('');
        try {
            const params = new URLSearchParams();
            if (delStart) params.append('start_date', delStart);
            if (delEnd) params.append('end_date', delEnd);

            await api.download(`/exports/deliveries-zip?${params.toString()}`, 'all_deliveries.zip');
        } catch (e: any) {
            console.error(e);
            setError(e.message || "Failed to export deliveries");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Data Exports</h1>
                <p className="text-slate-500">Download your data for offline analysis and reporting.</p>
            </div>

            {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Orders Export */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            <FileDown className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">Export Orders</h3>
                            <p className="text-xs text-slate-500">Full order list with details.</p>
                        </div>
                    </div>

                    <div className="space-y-3 flex-1">
                        <div>
                            <label className="text-xs font-semibold text-slate-500 mb-1 block">Status</label>
                            <select
                                value={orderStatus}
                                onChange={e => setOrderStatus(e.target.value)}
                                className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                            >
                                <option value="All">All Statuses</option>
                                <option value="Completed">Completed</option>
                                <option value="Pending">Pending</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 mb-1 block">From</label>
                                <input type="date" className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                                    value={orderStart} onChange={e => setOrderStart(e.target.value)} />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 mb-1 block">To</label>
                                <input type="date" className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                                    value={orderEnd} onChange={e => setOrderEnd(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleExportOrders}
                        disabled={loading}
                        className="mt-6 w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <FileDown className="w-4 h-4" /> Download Excel
                    </button>
                </div>

                {/* Revenue Export */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-brand-50 text-brand-600 rounded-lg">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">Revenue Reports</h3>
                            <p className="text-xs text-slate-500">Monthly and yearly summaries.</p>
                        </div>
                    </div>

                    <div className="space-y-3 flex-1">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 mb-1 block">Start Year</label>
                                <input type="number" placeholder="2024" className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                                    value={revStartYear} onChange={e => setRevStartYear(e.target.value)} />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 mb-1 block">End Year</label>
                                <input type="number" placeholder="2025" className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                                    value={revEndYear} onChange={e => setRevEndYear(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleExportRevenue}
                        disabled={loading}
                        className="mt-6 w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <FileDown className="w-4 h-4" /> Download Report
                    </button>
                </div>

                {/* Deliveries Export */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                            <Filter className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">Bulk Deliveries</h3>
                            <p className="text-xs text-slate-500">ZIP archive of all deliveries.</p>
                        </div>
                    </div>

                    <div className="space-y-3 flex-1">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 mb-1 block">From</label>
                                <input type="date" className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                                    value={delStart} onChange={e => setDelStart(e.target.value)} />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 mb-1 block">To</label>
                                <input type="date" className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                                    value={delEnd} onChange={e => setDelEnd(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleExportDeliveries}
                        disabled={loading}
                        className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <FileDown className="w-4 h-4" /> Download ZIP
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Exports;
