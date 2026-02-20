import { translateDifficulty, type RouteDifficulty } from '../../lib/data';
import { effects } from '../../lib/styleguide';

interface DifficultyBadgeProps {
    difficulty: 'Easy' | 'Moderate' | 'Hard' | string;
    className?: string;
}

export default function DifficultyBadge({ difficulty, className = '' }: DifficultyBadgeProps) {
    const bgColor =
        difficulty === 'Easy' ? 'bg-primary/90 text-primary-foreground' :
            difficulty === 'Moderate' ? 'bg-accent/90 text-accent-foreground' :
                'bg-destructive/90 text-destructive-foreground';

    return (
        <span className={`text-xs font-bold px-3 py-1.5 rounded-lg capitalize tracking-wider ${effects.glass} ${bgColor} ${className}`}>
            {translateDifficulty(difficulty as RouteDifficulty)}
        </span>
    );
}
