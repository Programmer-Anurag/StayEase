import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <div className="relative flex-1 bg-slate-900 overflow-hidden min-h-[500px] flex items-center">
                {/* Background image overlay */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1600" 
                        alt="Beautiful travel lodging scenery" 
                        className="w-full h-full object-cover opacity-35 scale-105"
                    />
                    <div className="absolute inset-0 bg-radial-[at_50%_50%] from-indigo-900/40 to-slate-950/80" />
                </div>

                <div className="relative z-10 mx-auto max-w-5xl px-6 py-20 text-center lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300 ring-1 ring-inset ring-indigo-500/20 mb-4">
                            Welcome to StayEase
                        </span>
                        <h1 className="text-4xl font-extrabold tracking-tight text-white font-display sm:text-6xl leading-tight">
                            Stays that feel like <span className="text-indigo-400">home</span>.
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-slate-300 max-w-2xl mx-auto">
                            A curated platform connecting modern travelers with verified cabins, beachfront cottages, luxury apartments, and unique homestays around the globe.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link
                                to="/listings"
                                className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3 text-base font-bold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/45 hover:scale-102 active:scale-98 transition-all duration-300"
                            >
                                Explore Stays
                            </Link>
                            <a 
                                href="#about"
                                className="text-sm font-semibold leading-6 text-white hover:text-indigo-400 transition-colors"
                            >
                                Learn more <span aria-hidden="true">→</span>
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* About our Mission (Split Section) */}
            <div id="about" className="py-20 bg-white border-b border-slate-200/50">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className="aspect-4/3 rounded-2xl overflow-hidden shadow-lg border border-slate-200/60 bg-slate-100"
                        >
                            <img 
                                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800" 
                                alt="Cozy check-in desk" 
                                className="h-full w-full object-cover"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className="space-y-6"
                        >
                            <h2 className="text-3xl font-bold font-display text-slate-900 sm:text-4xl">
                                Redefining Travel Lodging
                            </h2>
                            <p className="text-base text-slate-600 leading-relaxed font-sans">
                                StayEase was founded on a simple premise: travel should be comfortable, authentic, and stress-free. We bypass the sterile nature of conventional hotel bookings by offering handpicked, character-rich homes hosted by genuine people.
                            </p>
                            <p className="text-base text-slate-600 leading-relaxed font-sans">
                                Whether you are looking for a remote forest treehouse to unplug, a fully equipped downtown condo for business, or a spacious beach resort for a family getaway, StayEase makes listing, discovery, and booking effortless.
                            </p>
                            <div className="pt-2">
                                <Link 
                                    to="/signup" 
                                    className="inline-flex items-center justify-center rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-5 py-2.5 text-sm font-semibold transition-colors"
                                >
                                    Join the Community
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Core Values Section (Grid) */}
            <div className="py-20 bg-slate-50">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <div className="max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold font-display text-slate-900 sm:text-4xl">What Makes Us Different</h2>
                        <p className="text-sm text-slate-500 mt-2">Every feature we design is centered around transparency and quality stay experiences.</p>
                    </div>

                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {/* Card 1 */}
                        <motion.div 
                            variants={itemVariants}
                            whileHover={{ y: -6 }}
                            className="bg-white rounded-2xl border border-slate-200/50 p-8 text-left shadow-xs hover:shadow-md transition-all duration-300"
                        >
                            <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl mb-6 shadow-xs">
                                🏠
                            </div>
                            <h3 className="text-lg font-bold font-display text-slate-900 mb-3">100% Quality Verified</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">Each listing goes through a comprehensive inspection to ensure active amenities, cleanliness, and security align with descriptions.</p>
                        </motion.div>

                        {/* Card 2 */}
                        <motion.div 
                            variants={itemVariants}
                            whileHover={{ y: -6 }}
                            className="bg-white rounded-2xl border border-slate-200/50 p-8 text-left shadow-xs hover:shadow-md transition-all duration-300"
                        >
                            <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl mb-6 shadow-xs">
                                ⭐
                            </div>
                            <h3 className="text-lg font-bold font-display text-slate-900 mb-3">Interactive Guest Reviews</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">No fake or modified ratings. Our platform uses verified guest authentication to ensure reviews are written by real travelers.</p>
                        </motion.div>

                        {/* Card 3 */}
                        <motion.div 
                            variants={itemVariants}
                            whileHover={{ y: -6 }}
                            className="bg-white rounded-2xl border border-slate-200/50 p-8 text-left shadow-xs hover:shadow-md transition-all duration-300"
                        >
                            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl mb-6 shadow-xs">
                                🤝
                            </div>
                            <h3 className="text-lg font-bold font-display text-slate-900 mb-3">Host Protections</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">We protect our hosts and community with robust check-in verifications, and streamlined listings management tools.</p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Final CTA Banner */}
            <div className="bg-indigo-900 py-16 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-15">
                    <img 
                        src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1200" 
                        alt="Adventure backdrop" 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="relative z-10 mx-auto max-w-4xl px-6">
                    <h2 className="text-3xl font-bold font-display sm:text-4xl">Ready to discover your next escape?</h2>
                    <p className="mt-4 text-indigo-200 text-sm max-w-md mx-auto">Join StayEase for free, explore vacation locations, and lock in the best stay accommodations.</p>
                    <div className="mt-8">
                        <Link 
                            to="/listings"
                            className="inline-flex items-center justify-center rounded-xl bg-white hover:bg-slate-100 text-indigo-900 px-6 py-3.5 text-base font-bold shadow-lg shadow-indigo-950/20 hover:scale-102 active:scale-98 transition-all"
                        >
                            Explore All Listings
                        </Link>
                    </div>
                </div>
            </div>

            {/* Dark Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12 mt-auto border-t border-slate-800">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-8">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                </svg>
                            </div>
                            <span className="font-display font-bold text-lg text-white">StayEase</span>
                        </div>
                        <div className="flex flex-wrap gap-8 text-sm">
                            <Link to="/listings" className="hover:text-white transition-colors">Find Stays</Link>
                            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
                            <Link to="/signup" className="hover:text-white transition-colors">Register</Link>
                            <a href="#about" className="hover:text-white transition-colors">About Us</a>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 text-xs text-slate-500">
                        <p>© 2026 StayEase Inc. All rights reserved.</p>
                        <p>Designed for premium hospitality and seamless travel experiences.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;