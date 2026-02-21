import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Route as RouteType } from '../lib/data';
import { motion, AnimatePresence } from 'framer-motion';
import RouteCard from '../components/ui/RouteCard';
import PageHeader from '../components/ui/PageHeader';
import AnimatedButton from '../components/ui/AnimatedButton';
import { Compass, Filter, MapPin, X } from 'lucide-react';
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

    // New Advanced Filter State
    const [minDistance, setMinDistance] = useState<number>(0);
    const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
    const [selectedRegion, setSelectedRegion] = useState<string>('all');

    // Desktop layout might want the sidebar always visible, but mobile needs a toggle
    const [isFilterOpen, setIsFilterOpen] = useState(false);

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

    // Calculate max distance for the slider dynamically
    const maxDistanceAvailable = routes.length > 0
        ? Math.max(...routes.map(r => r.distance_km || 0))
        : 30; // fallback

    const filteredRoutes = routes.filter(route => {
        // 1. Distance filter
        if ((route.distance_km || 0) < minDistance) return false;

        // 2. Difficulty filter
        if (selectedDifficulties.length > 0) {
            if (!selectedDifficulties.includes(route.difficulty)) return false;
        }

        // 3. Region filter
        if (selectedRegion !== 'all') {
            if (route.region !== selectedRegion) return false;
        }

        return true;
    });

    const toggleDifficulty = (diff: string) => {
        setSelectedDifficulties(prev =>
            prev.includes(diff)
                ? prev.filter(d => d !== diff)
                : [...prev, diff]
        );
    };

    const resetFilters = () => {
        setMinDistance(0);
        setSelectedDifficulties([]);
        setSelectedRegion('all');
    };

    const activeFilterCount = (minDistance > 0 ? 1 : 0) + selectedDifficulties.length + (selectedRegion !== 'all' ? 1 : 0);

    return (
        <div className="space-y-8 p-4 md:p-8 max-w-[1600px] mx-auto w-full pb-16">

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <PageHeader
                    title="Alle Routes"
                    description="Dit zijn, volgens mij toch, de mooiste wandelingen om te ontdekken."
                    badgeText="Verken Verder"
                    icon={<Compass className="w-6 h-6" />}
                />

                {/* Filter Toggle Button */}
                <div className="flex justify-end">
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`flex items-center gap-2 px-6 py-3 border rounded-full text-sm font-bold transition-colors ${isFilterOpen || activeFilterCount > 0
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-card text-foreground border-border/20 hover:bg-muted'
                            }`}
                    >
                        <Filter className="w-4 h-4" />
                        {isFilterOpen ? 'Verberg Filters' : 'Toon Filters'}
                        {activeFilterCount > 0 && (
                            <span className="flex items-center justify-center w-5 h-5 ml-1 text-xs bg-white text-primary rounded-full">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-6 items-stretch">

                {/* Top Filters Panel */}
                <motion.div
                    initial={false}
                    animate={{
                        height: isFilterOpen ? 'auto' : 0,
                        opacity: isFilterOpen ? 1 : 0,
                    }}
                    className={`nav-blur w-full rounded-[2rem] border border-border/10 overflow-hidden ${isFilterOpen ? 'block' : 'hidden'}`}
                >
                    <div className="p-6 md:p-8">
                        <div className="flex items-center justify-between mb-8 border-b border-border/10 pb-4">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <Filter className="w-5 h-5 text-primary" />
                                Filters
                                {activeFilterCount > 0 && (
                                    <span className="flex items-center justify-center w-5 h-5 text-xs bg-primary text-primary-foreground rounded-full">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </h3>
                            {activeFilterCount > 0 && (
                                <button
                                    onClick={resetFilters}
                                    className="text-xs font-semibold text-muted-foreground hover:text-foreground underline decoration-muted-foreground/30 underline-offset-4"
                                >
                                    Reset
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Region Filter */}
                            <div>
                                <label className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-muted-foreground" />
                                    Regio
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { id: 'all', label: 'Alle Regio\'s' },
                                        { id: 'West-Vlaanderen', label: 'West-Vlaanderen' },
                                        { id: 'Oost-Vlaanderen', label: 'Oost-Vlaanderen' },
                                        { id: 'Andere', label: 'Andere' },
                                    ].map(reg => (
                                        <button
                                            key={reg.id}
                                            onClick={() => setSelectedRegion(reg.id)}
                                            className={`text-left px-4 py-2 rounded-full text-sm font-medium transition-all border ${selectedRegion === reg.id
                                                ? 'bg-primary text-primary-foreground border-primary'
                                                : 'bg-background/50 border-border/20 text-muted-foreground hover:bg-muted'
                                                }`}
                                        >
                                            {reg.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Distance Filter */}
                            <div>
                                <div className="flex justify-between items-end mb-4">
                                    <label className="text-sm font-medium text-foreground">Minimum Afstand</label>
                                    <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                                        {minDistance} km
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max={Math.ceil(maxDistanceAvailable)}
                                    step="1"
                                    value={minDistance}
                                    onChange={(e) => setMinDistance(Number(e.target.value))}
                                    className="w-full accent-primary h-2 bg-muted rounded-full appearance-none cursor-pointer mt-2"
                                />
                                <div className="flex justify-between mt-3 text-xs text-muted-foreground font-medium">
                                    <span>0 km</span>
                                    <span>{Math.ceil(maxDistanceAvailable)} km</span>
                                </div>
                            </div>

                            {/* Difficulty Filter */}
                            <div>
                                <label className="text-sm font-medium text-foreground mb-3 block">Moeilijkheidsgraad</label>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { id: 'Easy', label: 'Makkelijk' },
                                        { id: 'Moderate', label: 'Gemiddeld' },
                                        { id: 'Hard', label: 'Moeilijk' },
                                        { id: 'Expert', label: 'Expert' }
                                    ].map(diff => {
                                        const isSelected = selectedDifficulties.includes(diff.id);
                                        return (
                                            <button
                                                key={diff.id}
                                                onClick={() => toggleDifficulty(diff.id)}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${isSelected
                                                    ? 'bg-foreground text-background border-foreground'
                                                    : 'bg-background/50 text-muted-foreground border-border/20 hover:border-border/40 hover:bg-muted'
                                                    }`}
                                            >
                                                {diff.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content Area */}
                <div className="flex-1 w-full min-w-0 mt-4 md:mt-0">

                    {/* Active filters summary bar visible always when filters are active */}
                    {activeFilterCount > 0 && (
                        <div className="flex flex-wrap items-center gap-2 mb-6">
                            <span className="text-sm text-muted-foreground mr-2 font-medium">Actieve filters:</span>
                            {selectedRegion !== 'all' && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted border border-border/20 rounded-full text-xs font-semibold">
                                    {selectedRegion}
                                    <button onClick={() => setSelectedRegion('all')} className="hover:text-primary"><X className="w-3 h-3" /></button>
                                </span>
                            )}
                            {minDistance > 0 && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted border border-border/20 rounded-full text-xs font-semibold">
                                    Min. {minDistance} km
                                    <button onClick={() => setMinDistance(0)} className="hover:text-primary"><X className="w-3 h-3" /></button>
                                </span>
                            )}
                            {selectedDifficulties.map(diff => (
                                <span key={diff} className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted border border-border/20 rounded-full text-xs font-semibold">
                                    {diff === 'Easy' ? 'Makkelijk' : diff === 'Moderate' ? 'Gemiddeld' : diff === 'Hard' ? 'Moeilijk' : 'Expert'}
                                    <button onClick={() => toggleDifficulty(diff)} className="hover:text-primary"><X className="w-3 h-3" /></button>
                                </span>
                            ))}
                            <button onClick={resetFilters} className="text-xs text-primary font-semibold underline ml-2">Alles wissen</button>
                        </div>
                    )}

                    {filteredRoutes.length === 0 ? (
                        <div className={`text-center py-20 bg-card ${borderRadius.max} border border-border/10`}>
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                                <Filter className="w-8 h-8 opacity-50" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Geen routes gevonden</h3>
                            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                                Er zijn geen wandelingen die aan al deze specifieke filters voldoen.
                            </p>
                            <AnimatedButton variant="secondary" onClick={resetFilters}>
                                Wis alle filters
                            </AnimatedButton>
                        </div>
                    ) : (
                        <motion.div
                            layout
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            <AnimatePresence mode="popLayout">
                                {filteredRoutes.map(route => (
                                    <motion.div
                                        layout
                                        key={route.id}
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="show"
                                        exit={{ opacity: 0, scale: 0.95 }}
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
            </div>
        </div>
    );
}
