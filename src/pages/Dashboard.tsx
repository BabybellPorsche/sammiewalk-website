import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Route as RouteType } from '../lib/data';
import { useAuth } from '../lib/AuthContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import RouteCard from '../components/ui/RouteCard';
import RouteCardSkeleton from '../components/ui/RouteCardSkeleton';
import AnimatedButton from '../components/ui/AnimatedButton';
import { Dog, ArrowRight, Sparkles } from 'lucide-react';
import { typography, borderRadius, effects } from '../lib/styleguide';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function Dashboard() {
    const { user } = useAuth();
    const [routes, setRoutes] = useState<RouteType[]>([]);
    const [loading, setLoading] = useState(true);
    const [randomRoute, setRandomRoute] = useState<RouteType | null>(null);

    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 500], [0, 200]);
    const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

    useEffect(() => {
        async function fetchRoutes() {
            const { data, error } = await supabase
                .from('routes')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching routes:', error);
            } else {
                setRoutes(data || []);
                if (data && data.length > 0) {
                    setRandomRoute(data[Math.floor(Math.random() * data.length)]);
                }
            }
            setLoading(false);
        }

        fetchRoutes();
    }, []);

    if (loading) {
        return (
            <div className="space-y-8 p-4 md:p-8 max-w-[1600px] mx-auto w-full">
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`bg-card ${borderRadius.container} p-6 border border-border/10 flex-1 h-28 animate-pulse bg-muted/40`} />
                    ))}
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <div className="h-8 w-48 bg-muted/40 animate-pulse rounded-full mb-2"></div>
                        <div className="h-5 w-64 bg-muted/20 animate-pulse rounded-full mt-1"></div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <RouteCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    const featuredRoutes = routes.slice(0, 3);

    return (
        <div className="w-full pb-12">
            <title>SammieWalk | Uitgelicht</title>

            {/* Immersive Premium Hero Section */}
            <div className={`relative w-full h-[65vh] min-h-[500px] bg-black mb-12 md:mb-16 overflow-hidden flex flex-col justify-end`}>
                <motion.img
                    src="/hero-cover.jpeg"
                    alt="Hero Background"
                    style={{ y: heroY }}
                    className="absolute inset-0 w-full h-full object-cover opacity-80 origin-bottom"
                />

                {/* Gradient overlay to seamlessly blend into background color */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

                <div className="relative z-10 p-4 md:p-8 md:pb-16 max-w-[1600px] mx-auto w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ staggerChildren: 0.15, delayChildren: 0.1 }}
                        className="max-w-3xl"
                        style={{ opacity: heroOpacity }}
                    >
                        <motion.div
                            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                            initial="hidden" animate="show"
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white text-sm font-semibold mb-6 ${effects.glass}`}
                        >
                            <Dog className="w-4 h-4 text-primary line-clamp-1 dark:text-foreground" />
                            <span>100% Winnie Approved</span>
                        </motion.div>

                        <motion.h1
                            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                            initial="hidden" animate="show"
                            className={`${typography.display} text-white mb-6`}
                        >
                            Mijn favoriete wandelroutes
                        </motion.h1>

                        <motion.p
                            variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                            initial="hidden" animate="show"
                            transition={{ duration: 0.8 }}
                            className={`${typography.lead} text-white/90 mb-10 max-w-2xl`}
                        >
                            Een collectie van mijn favoriete wandelingen in West- en Oost-Vlaanderen.
                        </motion.p>

                        <motion.div
                            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                            initial="hidden" animate="show"
                            className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 pointer-events-auto"
                        >
                            <Link to="/routes" className="w-full sm:w-auto relative z-20">
                                <motion.div
                                    whileHover="hover"
                                    whileTap="tap"
                                    variants={{
                                        hover: { opacity: 0.9, transition: { duration: 0.2 } },
                                        tap: { opacity: 0.8, transition: { duration: 0.1 } }
                                    }}
                                    className="group w-full relative flex items-center justify-center sm:justify-between gap-3 sm:gap-4 bg-primary text-primary-foreground h-14 pr-2 pl-2 sm:pl-6 rounded-full font-bold text-base transition-colors duration-150"
                                >
                                    <span className="relative z-10 pl-4 sm:pl-0">Vind een wandeling</span>

                                    <motion.div
                                        variants={{
                                            hover: { x: 2, backgroundColor: "rgba(255,255,255,0.25)" }
                                        }}
                                        className="relative z-10 w-10 h-10 shrink-0 rounded-full bg-white/15 flex items-center justify-center transition-colors duration-300 ml-2 sm:ml-0"
                                    >
                                        <ArrowRight className="w-5 h-5" />
                                    </motion.div>
                                </motion.div>
                            </Link>

                            {randomRoute && (
                                <Link to={`/route/${randomRoute.id}`} className="w-full sm:w-auto relative z-20">
                                    <motion.div
                                        whileHover="hover"
                                        whileTap="tap"
                                        variants={{
                                            hover: { backgroundColor: "rgba(255,255,255,0.15)", transition: { duration: 0.2 } },
                                            tap: { opacity: 0.8, transition: { duration: 0.1 } }
                                        }}
                                        className="group w-full relative flex items-center justify-center gap-2.5 bg-white/5 border border-white/20 text-white h-14 px-6 rounded-full font-bold text-base backdrop-blur-md transition-colors duration-150 hover:border-white/40 hover:bg-white/10"
                                    >
                                        <Sparkles className="w-5 h-5 text-white/70 group-hover:text-primary group-hover:rotate-12 transition-all duration-300" />
                                        <span>Willekeurige route</span>
                                    </motion.div>
                                </Link>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="space-y-12 p-4 md:p-8 pt-0 max-w-[1600px] mx-auto w-full">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6"
                >
                    <div className="max-w-xl">
                        <h2 className={typography.h2}>Mijn nieuwste routes</h2>
                        <p className={`${typography.body} text-muted-foreground mt-2`}>Ontdek de recentste wandelingen die Winnie en ik hebben gelopen.</p>
                    </div>
                    {user && (
                        <Link to="/editor" className="w-full sm:w-auto shrink-0">
                            <AnimatedButton variant="primary" icon={<PlusCircle className="w-5 h-5" />} className="w-full justify-center py-3.5">
                                <span>Nieuwe Route</span>
                            </AnimatedButton>
                        </Link>
                    )}
                </motion.div>

                {featuredRoutes.length === 0 ? (
                    <div className={`text-center py-20 bg-card ${borderRadius.max} border border-border/10`}>
                        <p className="text-muted-foreground mb-4 font-medium">
                            Nog geen routes beschikbaar.
                        </p>
                        {user && (
                            <Link to="/editor">
                                <AnimatedButton variant="primary">
                                    Maak je eerste route
                                </AnimatedButton>
                            </Link>
                        )}
                    </div>
                ) : (
                    <>
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {featuredRoutes.map(route => (
                                <motion.div key={route.id} variants={itemVariants} className="h-full">
                                    <RouteCard route={route} />
                                </motion.div>
                            ))}
                        </motion.div>

                        {routes.length > 3 && (
                            <motion.div
                                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                className="mt-12 text-center pb-8 border-t border-border/10 pt-10"
                            >
                                <h3 className="text-2xl font-bold mb-4">Meer routes zien?</h3>
                                <div className="flex justify-center">
                                    <Link to="/routes">
                                        <AnimatedButton variant="secondary">
                                            Ontdek alle wandelingen
                                        </AnimatedButton>
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
