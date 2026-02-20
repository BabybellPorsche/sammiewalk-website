import { borderRadius } from '../../lib/styleguide';

interface RouteCardSkeletonProps {
    className?: string;
}

export default function RouteCardSkeleton({ className = '' }: RouteCardSkeletonProps) {
    return (
        <div className={`h-[360px] ${borderRadius.container} bg-muted/40 animate-pulse border border-border/10 ${className}`} />
    );
}
