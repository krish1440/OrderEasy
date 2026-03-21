import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Globe, Scale, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';

const Privacy: React.FC = () => {
    const navigate = useNavigate();

    const sections = [
        {
            icon: Eye,
            title: "Information We Collect",
            content: "We collect information you provide directly to us when you create an account, such as your name, email address, organization name, and phone number. We also collect business-related data including order details, delivery schedules, and uploaded E-Way bills."
        },
        {
            icon: Database,
            title: "How We Use Your Data",
            content: "Your data is used to provide, maintain, and improve our services. This includes processing orders, tracking fulfillment, and providing AI-driven business insights. We use aggregated, de-identified data for analytics to help you understand your business trends."
        },
        {
            icon: Shield,
            title: "Data Security",
            content: "We implement enterprise-grade security measures. All data is stored in secure PostgreSQL databases via Supabase, protected by Row Level Security (RLS). Sensitive information is encrypted, and access is restricted through JWT-based authentication."
        },
        {
            icon: Globe,
            title: "AI Processing",
            content: "OrderEazy integrates with Google Gemini AI to provide strategic business analysis. Your business metrics are processed securely to generate insights; we do not use your private business data to train external public AI models."
        },
        {
            icon: Lock,
            title: "Data Sharing",
            content: "We do not sell your personal or business data to third parties. Data is only shared with essential service providers (like Supabase for storage or Web3Forms for contact messages) necessary to operate the application."
        },
        {
            icon: Scale,
            title: "Your Rights",
            content: "You have the right to access, update, or delete your information at any time through your account settings. If you close your account, we will delete your personal data from our active databases in accordance with our retention policy."
        }
    ];

    return (
        <div className="min-h-screen bg-[#05050A] text-slate-100 font-sans selection:bg-brand-500/30 selection:text-white pb-20">
            <SEO 
                title="Privacy Policy"
                description="Learn how OrderEazy protects your business data and manages privacy in our smart order management platform."
            />
            
            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none opacity-30">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 bg-[#05050A]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium text-sm">Back</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <img src="/logo.svg" alt="Logo" className="w-7 h-7" />
                        <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-indigo-400">OrderEasy</span>
                    </div>
                    <div className="w-20" /> {/* Spacer */}
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 pt-16 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-white">Privacy Policy</h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        At OrderEazy, we believe in radical transparency. Here is how we handle your data with the care it deserves.
                    </p>
                    <div className="mt-4 text-sm font-mono text-brand-400/80">Last Updated: March 2024</div>
                </motion.div>

                <div className="grid gap-8 md:grid-cols-2">
                    {sections.map((section, idx) => (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] transition-colors group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <section.icon className="w-6 h-6 text-brand-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">{section.title}</h3>
                            <p className="text-slate-400 leading-relaxed text-sm antialiased">
                                {section.content}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-20 p-10 rounded-3xl border border-brand-500/20 bg-brand-500/5 text-center"
                >
                    <h2 className="text-2xl font-bold text-white mb-4">Questions about your privacy?</h2>
                    <p className="text-slate-300 mb-8 max-w-lg mx-auto">
                        If you have any concerns or questions about this policy, please reach out to our security team.
                    </p>
                    <a 
                        href="mailto:krishchaudhary144@gmail.com"
                        className="inline-flex px-8 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-full font-bold transition-all shadow-lg shadow-brand-600/20"
                    >
                        Contact Security Team
                    </a>
                </motion.div>

                <footer className="mt-20 text-center text-slate-500 text-sm">
                    <p>© 2024 OrderEazy Analytics. All rights reserved.</p>
                </footer>
            </main>
        </div>
    );
};

export default Privacy;
