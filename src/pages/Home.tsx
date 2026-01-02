import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart2, Truck, Database, ShieldCheck, Zap, Globe } from 'lucide-react';

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const FeatureCard = ({ icon: Icon, title, desc, delay }: { icon: any, title: string, desc: string, delay: number }) => (
    <motion.div
        variants={fadeInUp}
        className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all cursor-default group"
    >
        <div className="w-12 h-12 bg-gradient-to-br from-brand-400 to-indigo-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Icon className="text-white w-6 h-6" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-slate-300 leading-relaxed text-sm">
            {desc}
        </p>
    </motion.div>
);

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 overflow-x-hidden selection:bg-brand-500 selection:text-white font-sans">

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <motion.img
                            initial={{ rotate: -180, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            src="/logo.svg"
                            alt="OrderEasy Logo"
                            className="h-10 w-10"
                        />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-indigo-400">
                            OrderEasy
                        </span>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/login')}
                        className="px-6 py-2 bg-white text-slate-900 font-semibold rounded-full hover:shadow-lg hover:shadow-brand-500/20 transition-all text-sm"
                    >
                        Login
                    </motion.button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-screen -z-10">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-[100px] animate-pulse"></div>
                    <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
                </div>

                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="max-w-4xl mx-auto"
                    >
                        <motion.div variants={fadeInUp} className="inline-block mb-4 px-4 py-1.5 rounded-full bg-brand-900/40 border border-brand-500/30 text-brand-300 text-sm font-medium">
                            ✨ The Future of Order Management is Here
                        </motion.div>

                        <motion.h1
                            variants={fadeInUp}
                            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight"
                        >
                            Streamline Operations with <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-400 to-purple-400 animate-gradient-x">
                                Intelligent Analytics
                            </span>
                        </motion.h1>

                        <motion.p
                            variants={fadeInUp}
                            className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto"
                        >
                            Automate E-Way bills, predict trends with AI, and track deliveries in real-time.
                            The all-in-one platform designed for modern logistics.
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button
                                onClick={() => navigate('/login')}
                                className="px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold text-lg flex items-center gap-2 transition-all hover:scale-105 shadow-xl shadow-brand-600/20"
                            >
                                Get Started Now <ArrowRight size={20} />
                            </button>
                            <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold text-lg border border-slate-700 transition-all hover:scale-105">
                                View Documentation
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-slate-950/50 backdrop-blur-sm relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Powerful Features</h2>
                        <p className="text-slate-400 mt-4">Everything you need to scale your delivery operations.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={BarChart2}
                            title="AI Business Analyst"
                            desc="Ask questions in plain English and get data-driven insights instantly using our integrated LLM engine."
                            delay={0}
                        />
                        <FeatureCard
                            icon={Truck}
                            title="Real-Time Tracking"
                            desc="Live status updates for every order and delivery. Never lose track of a shipment again."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={Database}
                            title="Automated Data Ingestion"
                            desc="Seamlessly process CSV/Excel bulk uploads and sync with your central Supabase database."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={ShieldCheck}
                            title="Secure Authentication"
                            desc="Enterprise-grade security with OTP-based login and role-based access control."
                            delay={0.3}
                        />
                        <FeatureCard
                            icon={Zap}
                            title="Instant E-Way Bills"
                            desc="Generate compliant E-Way bills automatically with a single click based on order details."
                            delay={0.4}
                        />
                        <FeatureCard
                            icon={Globe}
                            title="Global Accessibility"
                            desc="Access your dashboard from anywhere in the world on any device with our responsive cloud platform."
                            delay={0.5}
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5 bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
                        <img src="/logo.svg" alt="Footer Logo" className="h-6 w-6 grayscale" />
                        <span className="font-semibold text-white">OrderEasy</span>
                    </div>
                    <p className="text-slate-500 text-sm">
                        © {new Date().getFullYear()} OrderEasy Analytics. Built for Abhay Engineering.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
