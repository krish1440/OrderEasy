import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    orgName: string;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    orgName,
}) => {
    const [inputValue, setInputValue] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue === orgName) {
            onConfirm();
        }
    };

    const isMatch = inputValue === orgName;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in-up">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden scale-100 hover:scale-[1.01] transition-transform duration-200">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-rose-100 text-rose-600 rounded-lg">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 mb-2">Delete Organization?</h2>
                    <p className="text-slate-500 mb-6">
                        This action cannot be undone. This will permanently delete
                        <span className="font-bold text-slate-800"> {orgName} </span>
                        and all associated data (orders, users, deliveries).
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Type <span className="font-mono text-rose-600 font-bold">{orgName}</span> to confirm
                            </label>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={orgName}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all font-mono"
                                autoFocus
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!isMatch}
                                className={`flex-1 px-4 py-2 text-white rounded-lg font-medium transition-all ${isMatch
                                        ? 'bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-500/30'
                                        : 'bg-slate-200 cursor-not-allowed text-slate-400'
                                    }`}
                            >
                                Delete Organization
                            </button>
                        </div>
                    </form>
                </div>
                <div className="bg-rose-50 px-6 py-4 border-t border-rose-100">
                    <div className="flex items-center gap-2 text-rose-700 text-sm font-medium">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Warning: This action is irreversible</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
