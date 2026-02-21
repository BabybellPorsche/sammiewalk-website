import { Star } from 'lucide-react';

interface SammieScoreBadgeProps {
    score: number | string;
    className?: string;
}

export default function SammieScoreBadge({ score, className = '' }: SammieScoreBadgeProps) {
    return (
        <div
            className={`flex items-center justify-center gap-1.5 bg-black/60 backdrop-blur-md text-accent border border-accent/30 px-3 h-8 text-[11px] font-bold rounded-lg ${className}`}
            title="SammieScore"
        >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="tracking-wide">
                {score}
            </span>
        </div>
    );
}
