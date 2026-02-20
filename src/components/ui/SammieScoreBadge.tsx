import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { effects } from '../../lib/styleguide';

interface SammieScoreBadgeProps {
    score: number | string;
    className?: string;
}

export default function SammieScoreBadge({ score, className = '' }: SammieScoreBadgeProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.1, rotate: [-2, 2, 0] }}
            className={`flex items-center justify-center gap-1 bg-amber-500/90 text-gray-900 px-2.5 h-8 text-xs font-bold rounded-full ${effects.glass} ${className}`}
            title="SammieScore"
        >
            <Star className="w-3.5 h-3.5 fill-current" />
            {score}
        </motion.div>
    );
}
