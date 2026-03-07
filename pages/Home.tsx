import React, { useRef, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionTemplate, useMotionValue, useScroll, useTransform, Variants } from 'framer-motion';
import { ArrowRight, BarChart2, Truck, Database, ShieldCheck, Zap, PieChart, Check, X, Minus, Mail, Send } from 'lucide-react';
import { SEO } from '../components/SEO';

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

// --- Spotlight Card Component ---
const SpotlightCard = ({ icon: Icon, title, desc, delay }: { icon: any, title: string, desc: string, delay: number }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            variants={fadeInUp}
            onMouseMove={handleMouseMove}
            whileHover={{ y: -5 }}
            className="group relative border border-white/10 bg-slate-900/40 backdrop-blur-md overflow-hidden rounded-2xl px-6 py-8 shadow-2xl transition-all duration-300"
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(99, 102, 241, 0.15),
              transparent 80%
            )
          `,
                }}
            />
            <div className="relative h-full flex flex-col">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 border border-brand-500/10 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6 text-brand-400" />
                </div>
                <h3 className="mb-3 text-lg font-bold text-white tracking-tight">{title}</h3>
                <p className="text-sm leading-relaxed text-slate-300 grow font-medium">
                    {desc}
                </p>
            </div>
        </motion.div>
    );
};

const comparisonData = [
    { feature: "Order Management", ordereasy: true, erp: true, basic: true },
    { feature: "Partial Delivery Management", ordereasy: true, erp: "partial", basic: false },
    { feature: "AI Business Analyst", ordereasy: true, erp: false, basic: false },
    { feature: "RFM Customer Analysis", ordereasy: true, erp: false, basic: false },
    { feature: "Automated Forecasts", ordereasy: true, erp: "partial", basic: false },
    { feature: "Data Export", ordereasy: true, erp: true, basic: false },
    { feature: "User-Friendly UI", ordereasy: true, erp: false, basic: true },
];

const RenderIcon = ({ status }: { status: boolean | string }) => {
    if (status === true) return <div className="flex justify-center"><div className="bg-emerald-500/20 p-1.5 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"><Check className="w-5 h-5 text-emerald-400" /></div></div>;
    if (status === false) return <div className="flex justify-center"><X className="w-5 h-5 text-slate-400/50" /></div>;
    return <div className="flex justify-center"><div className="bg-amber-500/20 p-1.5 rounded-full"><Minus className="w-5 h-5 text-amber-400" /></div></div>; // Partial
};

// --- Parallax Section Wrapper ---
const ParallaxSection = ({ children, offset = 50 }: { children: React.ReactNode, offset?: number }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);

    return (
        <motion.div ref={ref} style={{ y, opacity }}>
            {children}
        </motion.div>
    );
};

// --- Contact Section Component (Web3Forms) ---
const ContactSection = () => {
    const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [message, setMessage] = React.useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('submitting');
        const formData = new FormData(e.currentTarget);
        formData.append("access_key", "12d44591-0dc6-43fe-afd2-278e097fe923");

        try {
            const res = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            if (res.ok) {
                setStatus('success');
                setMessage("Success! Your message has been sent.");
                (e.target as HTMLFormElement).reset();
            } else {
                setStatus('error');
                setMessage(data.message || "Something went wrong.");
            }
        } catch (err) {
            setStatus('error');
            setMessage("Failed to send message. Please try again later.");
        }

        // Reset status after a few seconds
        setTimeout(() => setStatus('idle'), 5000);
    };

    return (
        <section id="contact" className="py-24 relative z-10 overflow-hidden">
            <ParallaxSection offset={20}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    {/* Background glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none"></div>

                    <div className="text-center mb-12 relative z-10">
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-4 drop-shadow-lg">Get in Touch</h2>
                        <div className="h-1 w-20 bg-gradient-to-r from-brand-500 to-purple-500 mx-auto rounded-full mb-6"></div>
                        <p className="text-slate-300 text-lg">Have questions or need help? We'd love to hear from you.</p>
                        <a href="mailto:krishchaudhary144@gmail.com" className="inline-flex items-center gap-2 mt-6 text-brand-300 hover:text-white transition-colors font-medium bg-brand-500/20 px-5 py-2.5 rounded-full border border-brand-500/30 hover:bg-brand-500/30 hover:scale-105 backdrop-blur-sm">
                            <Mail className="w-5 h-5" /> krishchaudhary144@gmail.com
                        </a>
                    </div>

                    <div className="relative z-10 border border-white/10 bg-slate-900/60 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
                                    <input type="text" name="name" id="name" required className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all placeholder:text-slate-500" placeholder="Your Name" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                                    <input type="email" name="email" id="email" required className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all placeholder:text-slate-500" placeholder="user@email.com" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                                <textarea name="message" id="message" rows={5} required className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all placeholder:text-slate-500 resize-none" placeholder="How can we help you?"></textarea>
                            </div>

                            {status !== 'idle' && status !== 'submitting' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-4 rounded-xl text-sm font-medium border ${status === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}
                                >
                                    {message}
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className="w-full py-4 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:opacity-70 disabled:cursor-not-allowed group"
                            >
                                {status === 'submitting' ? (
                                    <span className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Sending...</span>
                                ) : (
                                    <span className="flex items-center gap-2">Send Message <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></span>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </ParallaxSection>
        </section>
    );
};


const Home: React.FC = () => {
    const navigate = useNavigate();
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"]
    });

    // Smooth background parallax
    const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 0.6, 0.4]);

    return (
        <div ref={targetRef} className="min-h-screen bg-[#05050A] text-slate-100 overflow-x-hidden selection:bg-brand-500 selection:text-white font-sans relative">
            <SEO
                title="Home"
                description="Welcome to OrderEazy. One Platform to Manage Orders & Turn Data into Actionable Insights. AI business analyst, smart delivery, and instant sync."
                keywords="ordereazy, order management system, inventory tracking, ai business analyst, smart delivery, instant data exports, supply chain"
            />
            {/* Visual Analytics Background with Parallax */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <motion.div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat mix-blend-screen will-change-transform"
                    style={{
                        backgroundImage: 'url("/bg-analytics.png")',
                        y: bgY,
                        opacity: bgOpacity,
                        scale: 1.1 // Slight scale to prevent gaps
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#05050A]/70 via-[#05050A]/60 to-[#05050A]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_100%,transparent_100%)]"></div>
            </div>

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-[#05050A]/70 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <motion.img
                            initial={{ rotate: -180, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            src="/logo.svg"
                            alt="OrderEasy Logo"
                            className="h-10 w-10 relative z-10"
                        />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-indigo-400">
                            OrderEasy
                        </span>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/login')}
                        className="px-6 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium rounded-full backdrop-blur-md transition-all text-sm"
                    >
                        Login
                    </motion.button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 overflow-hidden z-10 min-h-[90vh] flex items-center justify-center">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="max-w-4xl mx-auto"
                    >
                        {/* Static parallax for hero elements to create depth */}
                        <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], [0, -100]) }} >
                            <motion.div variants={fadeInUp} className="inline-block mb-4 px-4 py-1.5 rounded-full bg-brand-900/60 border border-brand-500/30 text-brand-300 text-sm font-medium shadow-[0_0_20px_rgba(99,102,241,0.2)] backdrop-blur-sm">
                                ✨ The Future of Order Management is Here
                            </motion.div>

                            <motion.h1
                                variants={fadeInUp}
                                className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight drop-shadow-2xl"
                            >
                                One Platform to Manage Orders & <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-400 to-purple-400 animate-gradient-x">
                                    Turn Data into Actionable Insights
                                </span>
                            </motion.h1>

                            <motion.p
                                variants={fadeInUp}
                                className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-lg"
                            >
                                Track orders, manage partial deliveries, upload bills, and analyze everything with interactive charts to turn your data into clear business insights.
                            </motion.p>

                            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg flex items-center gap-2 transition-transform hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.3)] overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                    <span className="relative">Get Started Now</span>
                                    <ArrowRight size={20} className="relative group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={() => {
                                        const el = document.getElementById('contact');
                                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="px-8 py-4 bg-slate-800/80 hover:bg-slate-700/80 text-white rounded-full font-semibold text-lg border border-slate-700 backdrop-blur-sm transition-all hover:scale-105"
                                >
                                    Contact Us
                                </button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid with Scroll Reveal */}
            <section className="py-24 relative z-10">
                <ParallaxSection offset={30}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-6 drop-shadow-lg">Powerful Features</h2>
                            <div className="h-1 w-20 bg-gradient-to-r from-brand-500 to-purple-500 mx-auto rounded-full"></div>
                            <p className="text-slate-300 mt-6 text-lg drop-shadow-md">Everything you need to scale your delivery operations.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <SpotlightCard
                                icon={BarChart2}
                                title="AI Business Analyst"
                                desc="Ask questions in plain English and get data-driven insights instantly using our integrated LLM engine."
                                delay={0}
                            />
                            <SpotlightCard
                                icon={Truck}
                                title="Smart Delivery Management"
                                desc="Track order fulfillment status and manage partial deliveries with ease. Monitor dispatched quantities and pending balances."
                                delay={0.1}
                            />
                            <SpotlightCard
                                icon={Database}
                                title="Instant Data Exports"
                                desc="Seamlessly download reports and analytics data in CSV/Excel formats for offline analysis."
                                delay={0.2}
                            />
                            <SpotlightCard
                                icon={ShieldCheck}
                                title="Secure Authentication"
                                desc="Enterprise-grade security with OTP-based login and role-based access control."
                                delay={0.3}
                            />
                            <SpotlightCard
                                icon={Zap}
                                title="E-Way Bill Management"
                                desc="Easily upload, store, and retrieve E-Way bills for your orders. Keep all your compliance documents in one secure place."
                                delay={0.4}
                            />
                            <SpotlightCard
                                icon={PieChart}
                                title="Visual Data Analytics"
                                desc="Visualize your business performance with dynamic charts covering sales trends, product distribution, and revenue analysis."
                                delay={0.5}
                            />
                        </div>
                    </div>
                </ParallaxSection>
            </section>

            {/* Comparative Analysis Table with Scroll Reveal */}
            <section className="py-24 relative z-10 overflow-hidden">
                <ParallaxSection offset={-20}>
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-6 drop-shadow-lg">Why Choose OrderEasy?</h2>
                            <div className="h-1 w-20 bg-gradient-to-r from-brand-500 to-purple-500 mx-auto rounded-full"></div>
                            <p className="text-slate-300 mt-6 text-lg drop-shadow-md">See how we stack up against traditional solutions.</p>
                        </div>

                        <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl relative">
                            {/* Glowing backdrop for table */}
                            <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                            <div className="grid grid-cols-4 p-8 border-b border-white/5 bg-white/5 text-sm font-semibold text-slate-300 backdrop-blur-sm">
                                <div className="col-span-1">Feature</div>
                                <div className="col-span-1 text-center text-brand-400 font-bold uppercase tracking-wider text-xs">OrderEasy</div>
                                <div className="col-span-1 text-center font-medium uppercase tracking-wider text-xs opacity-70">Legacy ERP</div>
                                <div className="col-span-1 text-center font-medium uppercase tracking-wider text-xs opacity-70">Basic App</div>
                            </div>

                            {comparisonData.map((row, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ delay: i * 0.1 }}
                                    key={i}
                                    className={`grid grid-cols-4 p-6 items-center border-b border-white/5 hover:bg-white/[0.05] transition-colors relative group ${i === comparisonData.length - 1 ? 'border-none' : ''}`}
                                >
                                    <div className="col-span-1 font-medium text-slate-200 text-sm md:text-lg group-hover:text-white transition-colors">{row.feature}</div>

                                    {/* OrderEasy Column - Highlighted */}
                                    <div className="col-span-1 relative flex justify-center">
                                        <div className="absolute inset-0 bg-gradient-to-b from-brand-500/0 via-brand-500/5 to-brand-500/0 opacity-0 group-hover:opacity-100 transition-opacity w-full h-20 -top-4 rounded-lg blur-xl"></div>
                                        <div className="relative z-10 font-bold text-white">
                                            <RenderIcon status={row.ordereasy} />
                                        </div>
                                    </div>

                                    <div className="col-span-1">
                                        <RenderIcon status={row.erp} />
                                    </div>
                                    <div className="col-span-1">
                                        <RenderIcon status={row.basic} />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </ParallaxSection>
            </section>

            {/* Contact Section */}
            <ContactSection />

            {/* Footer */}
            <footer className="py-12 border-t border-white/5 bg-[#05050A]/80 backdrop-blur-lg relative z-10">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4 opacity-50 hover:opacity-100 transition-opacity">
                        <img src="/logo.svg" alt="Footer Logo" className="h-6 w-6 grayscale hover:grayscale-0 transition-all" />
                        <span className="font-semibold text-white">OrderEasy</span>
                    </div>
                    <p className="text-slate-500 text-sm">
                        © {new Date().getFullYear()} OrderEasy Analytics.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
