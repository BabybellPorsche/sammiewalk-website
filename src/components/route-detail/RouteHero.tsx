import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, Map as MapIcon, Edit, Trash2 } from 'lucide-react';
import AnimatedButton from '../ui/AnimatedButton';
import DifficultyBadge from '../ui/DifficultyBadge';
import { typography } from '../../lib/styleguide';
import type { Route as RouteType } from '../../lib/data';
import type { User } from '@supabase/supabase-js';

interface RouteHeroProps {
    route: RouteType;
    user: User | null;
    onDelete: () => void;
}

export default function RouteHero({ route, user, onDelete }: RouteHeroProps) {
    const navigate = useNavigate();
    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 500], [0, 150]);
    //    const heroScale = useTransform(scrollY, [0, 500], [1, 1.1]);

    return (
        <div className="relative w-full h-[60vh] min-h-[400px] bg-black mb-8 md:mb-12 overflow-hidden">
            <motion.img
                src={route.cover_photo_url || "https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?auto=format&fit=crop&w=2400&q=80"}
                alt="Cover"
                style={{ y: heroY }}
                className="w-full h-full object-cover opacity-70 origin-bottom"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>

            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 max-w-[1600px] mx-auto w-full flex flex-col justify-end pointer-events-none">
                <div className="inline-flex items-center gap-2 text-sm text-white/90 mb-5 pointer-events-auto bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full ring-1 ring-white/10 max-w-fit">
                    <Link to="/" className="hover:text-white transition-colors flex items-center gap-1 font-medium">
                        <ArrowLeft className="w-4 h-4" /> Overzicht
                    </Link>
                    <span>/</span>
                    <span className="font-medium">{route.title}</span>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-6 pointer-events-auto"
                >
                    <div className="max-w-3xl">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 24 }}
                            className={`${typography.h1} text-white mb-4 break-all sm:break-normal`}
                        >
                            {route.title}
                        </motion.h1>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 24 }}
                            className="flex flex-wrap items-center gap-4 text-white/90"
                        >
                            <span className="flex items-center gap-1.5 font-medium text-lg">
                                <MapIcon className="w-5 h-5 text-primary" />
                                {route.location}
                            </span>
                            <DifficultyBadge difficulty={route.difficulty} />
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.3 }}
                        className="flex flex-wrap gap-3"
                    >
                        {user && (
                            <>
                                <AnimatedButton
                                    onClick={() => navigate(`/editor/${route.id}`)}
                                    variant="glass"
                                    icon={<Edit className="w-4 h-4 md:w-5 md:h-5" />}
                                >
                                    <span className="hidden sm:inline">Bewerk</span>
                                </AnimatedButton>
                                <AnimatedButton
                                    onClick={onDelete}
                                    variant="danger"
                                    icon={<Trash2 className="w-4 h-4 md:w-5 md:h-5" />}
                                >
                                    <span className="hidden sm:inline">Verwijder</span>
                                </AnimatedButton>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
