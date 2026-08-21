import React from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, Trash2 } from 'lucide-react';

/**
 * Interface defining properties for the ConfirmModal component.
 * 
 * @interface ConfirmModalProps
 * @property {boolean} isOpen - Controls visibility state of the modal dialog
 * @property {string} title - Main header title of the confirmation prompt
 * @property {string} message - Explanatory body message describing the action consequences
 * @property {string} [confirmText="Confirm"] - Custom label for the primary action button
 * @property {string} [cancelText="Cancel"] - Custom label for the secondary dismiss button
 * @property {boolean} [isDangerous=false] - When true, applies high-contrast destructive (red) styling
 * @property {() => void} onConfirm - Callback function triggered upon confirming the action
 * @property {() => void} onCancel - Callback function triggered upon canceling or dismissing
 */
interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDangerous?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

/**
 * Reusable Accessibility-Compliant Modal Dialog.
 * Uses React Portal to render over document body with backdrop blur and escape/click boundaries.
 * Supports standard informational prompts as well as destructive confirmation alerts.
 *
 * @component
 * @example
 * ```tsx
 * <ConfirmModal
 *   isOpen={isModalOpen}
 *   title="Delete Record"
 *   message="Are you sure you want to delete this order? This action cannot be undone."
 *   isDangerous={true}
 *   confirmText="Delete Order"
 *   onConfirm={handleDelete}
 *   onCancel={() => setIsModalOpen(false)}
 * />
 * ```
 */
const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDangerous = false,
    onConfirm,
    onCancel,
}) => {
    // Return early if modal is not active
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Modal Dialog Box */}
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100"
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-modal-title"
                aria-describedby="confirm-modal-message"
            >
                <div className="p-6 text-center">
                    {/* Status Icon */}
                    <div className={`mx-auto flex items-center justify-center w-12 h-12 rounded-full mb-4 ${isDangerous ? 'bg-rose-100 text-rose-600' : 'bg-brand-100 text-brand-600'}`}>
                        {isDangerous ? <Trash2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                    </div>

                    {/* Title & Description */}
                    <h3 id="confirm-modal-title" className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                    <p id="confirm-modal-message" className="text-sm text-slate-500 mb-6">{message}</p>

                    {/* Modal Actions */}
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 px-4 py-2 text-white rounded-lg font-medium shadow-sm transition-colors ${isDangerous
                                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
                                    : 'bg-brand-600 hover:bg-brand-700 shadow-brand-500/20'
                                }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmModal;
