import { motion } from 'framer-motion';
import { Share2, Clock, Download, Navigation, Star, Footprints, Mountain } from 'lucide-react';
import RouteMap from '../ui/RouteMap';
import AnimatedButton from '../ui/AnimatedButton';
import { typography, borderRadius } from '../../lib/styleguide';
import type { Route as RouteType } from '../../lib/data';
import L from 'leaflet';

const staggerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, stiffness: 400, damping: 18 } }
};

interface RouteSidebarProps {
    route: RouteType;
    geoJsonData: unknown;
    mapCenter: [number, number];
    mapBounds: L.LatLngBounds | null;
    onShare: () => void;
}

export default function RouteSidebar({ route, geoJsonData, mapCenter, mapBounds, onShare }: RouteSidebarProps) {
    return (
        <div className="lg:col-span-1 space-y-8 lg:sticky lg:top-8">
            {geoJsonData ? (
                <RouteMap
                    geoJsonData={geoJsonData}
                    mapCenter={mapCenter}
                    mapBounds={mapBounds}
                />
            ) : null}

            {/* Action Buttons Sidebar */}
            <div className="flex flex-col gap-3">
                {route.start_point && (
                    <AnimatedButton
                        onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(route.start_point || '')}`, '_blank')}
                        variant="secondary"
                        className="w-full text-lg border-primary/30 text-primary hover:bg-primary/10"
                        icon={<Navigation className="w-5 h-5" />}
                    >
                        Naar Startpunt
                    </AnimatedButton>
                )}

                <div className="grid grid-cols-2 gap-3">
                    {route.gpx_file_url ? (
                        <AnimatedButton
                            onClick={() => window.open(route.gpx_file_url || '', '_blank')}
                            variant="primary"
                            icon={<Download className="w-5 h-5" />}
                        >
                            GPX Track
                        </AnimatedButton>
                    ) : <div />}
                    <AnimatedButton
                        onClick={onShare}
                        variant="secondary"
                        icon={<Share2 className="w-5 h-5" />}
                    >
                        Deel Route
                    </AnimatedButton>
                </div>
            </div>

            <motion.div
                variants={staggerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 gap-4"
            >
                {[
                    { icon: <Footprints className="w-5 h-5 stroke-[2.5]" />, label: "Afstand", val: `${route.distance_km || 0} km` },
                    { icon: <Clock className="w-5 h-5 stroke-[2.5]" />, label: "Duur", val: route.duration || (route.distance_km ? `${Math.floor(route.distance_km / 5) > 0 ? Math.floor(route.distance_km / 5) + 'u ' : ''}${Math.round((route.distance_km % 5) / 5 * 60)}m` : "--") },
                    { icon: <Mountain className="w-5 h-5 stroke-[2.5]" />, label: "Niveau", val: route.difficulty },
                    { icon: <Star className="w-5 h-5 stroke-[2.5] text-accent" />, label: "Sammiescore", val: route.sammiescore ? `${route.sammiescore}/10` : "--" },
                ].map((stat, i) => (
                    <motion.div key={i} variants={cardVariants} className={`bg-card border border-border/10 ${borderRadius.container} p-6 flex flex-col items-center justify-center text-center`}>
                        <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-3">
                            {stat.icon}
                        </div>
                        <p className={`${typography.small} text-muted-foreground opacity-80 mb-1`}>{stat.label}</p>
                        <h3 className={`${typography.h4} font-semibold`}>{stat.val}</h3>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
