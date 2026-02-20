import { Link } from 'react-router-dom';
import { MapPin, Clock, Heart, Navigation } from 'lucide-react';
import { useFavorites } from '../../hooks/useFavorites';
import type { Route as RouteType } from '../../lib/data';
import { motion } from 'framer-motion';
import { typography, borderRadius, effects } from '../../lib/styleguide';
import DifficultyBadge from './DifficultyBadge';
import SammieScoreBadge from './SammieScoreBadge';

const MotionLink = motion.create(Link);

interface RouteCardProps {
    route: RouteType;
    onClick?: () => void;
}

export default function RouteCard({ route, onClick }: RouteCardProps) {
    const { isFavorite, toggleFavorite } = useFavorites();
    const isFav = route.id ? isFavorite(route.id) : false;

    return (
        <MotionLink
            to={`/route/${route.id}`}
            onClick={onClick}
            whileHover="hover"
            initial="idle"
            variants={{
                idle: { y: 0 },
                hover: { y: -8 }
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`group h-full flex flex-col bg-card ${borderRadius.container} overflow-hidden border border-border/10 hover:border-primary/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]`}
        >
            <div className="relative h-56 overflow-hidden">
                <motion.img
                    src={route.cover_photo_url || "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80"}
                    alt={route.title}
                    variants={{
                        idle: { scale: 1 },
                        hover: { scale: 1.05 }
                    }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="w-full h-full object-cover"
                />

                <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                    {route.sammiescore && (
                        <SammieScoreBadge score={route.sammiescore} />
                    )}

                    <motion.button
                        onClick={(e) => {
                            e.preventDefault();
                            if (route.id) toggleFavorite(route.id);
                        }}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${effects.glass} ${isFav ? 'bg-primary/90 text-primary-foreground' : 'bg-black/20 text-white hover:bg-black/40'
                            }`}
                        aria-label={isFav ? "Verwijder uit bewaard" : "Bewaar route"}
                    >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </motion.button>
                </div>

                <div className="absolute top-3 left-3 flex gap-2">
                    <DifficultyBadge difficulty={route.difficulty} />
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <h3 className={`${typography.h4} line-clamp-2`}>{route.title}</h3>

                <div className="flex items-center text-muted-foreground text-sm mt-1 mb-4">
                    <MapPin className="w-3.5 h-3.5 mr-1 shrink-0 text-primary/70" />
                    <span className="line-clamp-1">{route.location}</span>
                </div>

                <div className="mt-auto pt-4 border-t border-border/10 flex items-center justify-between text-sm font-medium">
                    <div className="flex items-center gap-1.5 text-foreground whitespace-nowrap">
                        <span className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                            <Navigation className="w-3.5 h-3.5" />
                        </span>
                        <span>{route.distance_km || 0} km</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-muted-foreground whitespace-nowrap">
                        <Clock className="w-4 h-4" />
                        <span>{route.duration || (route.distance_km ? `${Math.floor(route.distance_km / 5) > 0 ? Math.floor(route.distance_km / 5) + 'u ' : ''}${Math.round((route.distance_km % 5) / 5 * 60)}m` : "--")}</span>
                    </div>
                </div>
            </div>
        </MotionLink>
    );
}
