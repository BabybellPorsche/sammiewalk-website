
import { translateDifficulty, type RouteDifficulty } from '../../lib/data';

interface DifficultyBadgeProps {
    difficulty: 'Easy' | 'Moderate' | 'Hard' | string;
    className?: string;
}

export default function DifficultyBadge({ difficulty, className = '' }: DifficultyBadgeProps) {
    const colorMap: Record<string, string> = {
        'Easy': 'text-[#8AA868] border-[#8AA868]/30',     // Soft, lighter primary green
        'Moderate': 'text-accent border-accent/40',       // The site's gold accent
        'Hard': 'text-[#D48F6C] border-[#D48F6C]/30',     // Earthy clay/terracotta
        'Expert': 'text-[#B85C4F] border-[#B85C4F]/30',   // Muted brick red
    };

    const styleVariants = colorMap[difficulty] || 'text-white/80 border-white/10';

    return (
        <span className={`text-[11px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-[0.1em] bg-black/60 backdrop-blur-md border ${styleVariants} ${className}`}>
            {translateDifficulty(difficulty as RouteDifficulty)}
        </span>
    );
}
