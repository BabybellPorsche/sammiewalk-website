import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useFavorites } from '../hooks/useFavorites';
import RouteCard from '../components/ui/RouteCard';
import PageHeader from '../components/ui/PageHeader';
import type { Route } from '../lib/data';
import { Heart, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function SavedRoutes() {
    const { favorites } = useFavorites();
    const [routes, setRoutes] = useState<Route[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSavedRoutes() {
            if (favorites.length === 0) {
                setRoutes([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            const { data } = await supabase
                .from('routes')
                .select('*')
                .in('id', favorites)
                .order('created_at', { ascending: false });

            if (data) {
                // Ensure routes are returned in the order of favorites (newest favorited first might be nice, 
                // but for now just showing them based on the DB return is fine, but they should only be favorites)
                setRoutes(data);
            }
            setLoading(false);
        }

        fetchSavedRoutes();
    }, [favorites]);

    if (loading) {
        return (
            <div className="p-4 md:p-8 flex justify-center py-20">
                <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-4 md:p-8 max-w-[1600px] mx-auto w-full">
            <title>SammieWalk | Bewaarde Routes</title>

            <PageHeader
                title="Bewaarde Routes"
                description="Hier vind je alle wandelingen die je hebt opgeslagen voor later."
                badgeText="Jouw Collectie"
                icon={<Heart className="w-6 h-6 fill-primary" />}
            />

            {routes.length === 0 ? (
                <div className="bg-card border border-border/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[40vh]">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                        <Heart className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight mb-2">Nog geen routes bewaard</h2>
                    <p className="text-muted-foreground mb-6 max-w-md">
                        Klik op het hartje bij een wandeling om deze toe te voegen aan je persoonlijke lijst. Handig voor je volgende uitstap!
                    </p>
                    <Link to="/routes" className="px-6 py-3 rounded-xl font-bold text-primary-foreground bg-primary hover:bg-primary/90 transition-colors flex items-center gap-2">
                        <Compass className="w-5 h-5" />
                        Ontdek Routes
                    </Link>
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
                        {routes.map(route => (
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
