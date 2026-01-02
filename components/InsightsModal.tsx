import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { X, Sparkles, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

interface InsightsModalProps {
    isOpen: boolean;
    onClose: () => void;
    dataSummary: any;
}

export const InsightsModal: React.FC<InsightsModalProps> = ({ isOpen, onClose, dataSummary }) => {
    const [insights, setInsights] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && dataSummary) {
            generateInsights();
        }
    }, [isOpen, dataSummary]);

    const generateInsights = async () => {
        setLoading(true);
        setError(null);
        setInsights('');

        try {
            const res = await api.post<{ insights: string }>('/analytics/ai-insights', { summary: dataSummary });
            setInsights(res.insights);
        } catch (e: any) {
            console.error(e);
            setError("Failed to generate insights. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in-up">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-brand-600">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">OrderEasy Intelligence</h2>
                            <p className="text-sm text-slate-500">Your Personal Business Analyst</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div>
                            <p className="text-slate-500 animate-pulse">Analyzing your data...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-8 text-rose-500">
                            <AlertCircle className="w-8 h-8 mb-2" />
                            <p>{error}</p>
                            <button
                                onClick={generateInsights}
                                className="mt-4 px-4 py-2 bg-rose-50 hover:bg-rose-100 rounded-lg text-sm font-medium transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <div className="prose prose-slate max-w-none">
                            <ReactMarkdown>{insights}</ReactMarkdown>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
