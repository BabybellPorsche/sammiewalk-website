import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Route as RouteType } from '../lib/data';
import { motion, AnimatePresence } from 'framer-motion';
import RouteCard from '../components/ui/RouteCard';
import PageHeader from '../components/ui/PageHeader';
import AnimatedButton from '../components/ui/AnimatedButton';
import { Compass } from 'lucide-react';
import { borderRadius } from '../lib/styleguide';

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

export default function AllRoutes() {
    const [routes, setRoutes] = useState<RouteType[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<string>('all');

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
            }
            setLoading(false);
        }

        fetchRoutes();
    }, []);

    if (loading) {
        return (
            <div className="space-y-8 p-4 md:p-8 max-w-[1600px] mx-auto w-full">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="h-8 w-48 bg-muted/40 animate-pulse rounded-full mb-2"></div>
                        <div className="h-5 w-64 bg-muted/20 animate-pulse rounded-full mt-1"></div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className={`h-[360px] ${borderRadius.container} bg-muted/40 animate-pulse border border-border/10`} />
                    ))}
                </div>
            </div>
        );
    }

    const filteredRoutes = routes.filter(route => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'easy') return route.difficulty === 'Easy';
        if (activeFilter === 'hard') return route.difficulty === 'Hard';
        if (activeFilter === 'short') return (route.distance_km || 0) < 5;
        if (activeFilter === 'long') return (route.distance_km || 0) >= 10;
        return true;
    });

    return (
        <div className="space-y-8 p-4 md:p-8 max-w-[1600px] mx-auto w-full">

            <PageHeader
                title="Alle Routes"
                description="Verken de mooiste wandelpaden, door ons geselecteerd en uitgetest."
                badgeText="Verken Verder"
                icon={<Compass className="w-6 h-6" />}
            />

            <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                    {[
                        { id: 'all', label: 'Alle Routes', icon: '🌿' },
                        { id: 'easy', label: 'Ontspannen', icon: '🚶‍♂️' },
                        { id: 'hard', label: 'Uitdagend', icon: '⛰️' },
                        { id: 'short', label: 'Korte Wandeling (<5km)', icon: '⏱️' },
                        { id: 'long', label: 'Stevige Tocht (10km+)', icon: '🥾' },
                    ].map(filter => (
                        <div key={filter.id} className="relative">
                            <AnimatedButton
                                onClick={() => setActiveFilter(filter.id)}
                                variant={activeFilter === filter.id ? 'primary' : 'ghost'}
                                className={`rounded-full px-4 py-2 border ${activeFilter === filter.id ? 'border-primary' : 'border-border/20 bg-background'} text-sm`}
                                icon={<span className="text-base">{filter.icon}</span>}
                            >
                                {filter.label}
                            </AnimatedButton>
                        </div>
                    ))}
                </div>
            </div>


            {filteredRoutes.length === 0 ? (
                <div className={`text-center py-20 bg-card ${borderRadius.max} border border-border/10`}>
                    <p className="text-muted-foreground mb-4 font-medium">
                        {routes.length === 0 ? "Nog geen routes beschikbaar." : "Geen routes gevonden voor deze filter."}
                    </p>
                </div>
            ) : (
                <motion.div
                    layout
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredRoutes.map(route => (
                            <motion.div
                                layout
                                key={route.id}
                                variants={itemVariants}
                                initial="hidden"
                                animate="show"
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="h-full"
                            >
                                <RouteCard route={route} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
}
