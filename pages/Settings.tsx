import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Lock, Trash2, AlertTriangle, CheckCircle, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Password Change State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passMsg, setPassMsg] = useState({ type: '', text: '' });
    const [passLoading, setPassLoading] = useState(false);

    // Delete Account State
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPassMsg({ type: '', text: '' });

        if (newPassword !== confirmPassword) {
            setPassMsg({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        setPassLoading(true);
        try {
            await api.post('/auth/change-password?current_password=' + encodeURIComponent(currentPassword) +
                '&new_password=' + encodeURIComponent(newPassword) +
                '&confirm_new_password=' + encodeURIComponent(confirmPassword), {});
            setPassMsg({ type: 'success', text: 'Password changed successfully' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setPassMsg({ type: 'error', text: err.message || 'Failed to change password' });
        } finally {
            setPassLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("FINAL WARNING: This action cannot be undone. All your data will be lost forever.")) return;

        try {
            await api.delete('/auth/delete-account');
            logout();
            navigate('/login');
        } catch (err: any) {
            alert(err.message || "Failed to delete account");
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
                <p className="text-slate-500">Manage your profile and security preferences.</p>
            </div>

            {/* Profile Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-2xl font-bold">
                        {user?.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">{user?.organization}</h2>
                        <p className="text-slate-500 font-medium">Username: {user?.username}</p>
                        {user?.email && <p className="text-slate-500 font-medium">Email: {user.email}</p>}
                        <p className="text-xs text-slate-400 mt-1">Role: {user?.is_admin ? 'Administrator' : 'Organization Admin'}</p>
                    </div>
                </div>
            </div>

            {/* Change Password */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-6">
                    <Lock className="w-5 h-5 text-slate-400" />
                    <h2 className="text-lg font-bold text-slate-800">Change Password</h2>
                </div>

                <form onSubmit={handleChangePassword} className="max-w-md space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Current Password</label>
                        <input
                            type="password" required
                            className="w-full p-2.5 border border-slate-200 rounded-lg text-sm"
                            value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">New Password</label>
                        <input
                            type="password" required minLength={4}
                            className="w-full p-2.5 border border-slate-200 rounded-lg text-sm"
                            value={newPassword} onChange={e => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Confirm New Password</label>
                        <input
                            type="password" required minLength={4}
                            className="w-full p-2.5 border border-slate-200 rounded-lg text-sm"
                            value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    {passMsg.text && (
                        <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${passMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                            {passMsg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                            {passMsg.text}
                        </div>
                    )}

                    <button
                        type="submit" disabled={passLoading}
                        className="bg-brand-600 hover:bg-brand-700 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                        {passLoading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>

            {/* Delete Account */}
            {!user?.is_admin && (
                <div className="bg-rose-50 p-6 rounded-xl border border-rose-100">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
                            <Trash2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-rose-800">Delete Account</h2>
                            <p className="text-rose-600 text-sm mt-1">
                                Permanently delete your organization account and all associated data (orders, deliveries, analytics).
                                <span className="font-bold"> This action cannot be undone.</span>
                            </p>

                            {!showDeleteConfirm ? (
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="mt-4 bg-white border border-rose-200 text-rose-600 font-medium px-4 py-2 rounded-lg hover:bg-rose-100 transition-colors"
                                >
                                    Delete Account
                                </button>
                            ) : (
                                <div className="mt-4 p-4 bg-white rounded-lg border border-rose-200 animate-in fade-in">
                                    <p className="text-sm font-bold text-rose-700 mb-3">Are you absolutely sure?</p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleDeleteAccount}
                                            className="bg-rose-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-rose-700"
                                        >
                                            Yes, Delete Everything
                                        </button>
                                        <button
                                            onClick={() => setShowDeleteConfirm(false)}
                                            className="text-slate-500 text-sm font-medium px-4 py-2 hover:bg-slate-50 rounded-lg"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
