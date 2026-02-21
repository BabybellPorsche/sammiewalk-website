import { Map as MapIcon } from 'lucide-react';
import { typography, borderRadius } from '../../lib/styleguide';
import { FadeIn } from '../ui/FadeIn';
import type { Route as RouteType } from '../../lib/data';

interface RouteContentProps {
    route: RouteType;
}

export default function RouteContent({ route }: RouteContentProps) {
    return (
        <div className="lg:col-span-2 space-y-12">
            <FadeIn>
                <h2 className={`${typography.h2} mb-4`}>Over deze route</h2>
                <div className={`prose prose-invert max-w-prose leading-relaxed ${typography.body} text-muted-foreground whitespace-pre-line`}>
                    {route.notes || "Geen beschrijving meegegeven."}
                </div>
            </FadeIn>

            {(!route.guidance_type || route.guidance_type === 'Nodes') && route.nodes && route.nodes.length > 0 && (
                <FadeIn>
                    <h2 className={`${typography.h2} mb-6 flex items-center gap-3`}>
                        <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                            <MapIcon className="w-4 h-4" />
                        </span>
                        Knooppunten
                    </h2>
                    <div className="flex flex-wrap gap-y-4 gap-x-2 items-center">
                        {route.nodes.map((node, i) => (
                            <div key={i} className="flex items-center">
                                <span className="w-12 h-12 rounded-full border-2 border-primary text-primary flex items-center justify-center font-bold text-lg bg-primary/5">
                                    {node.id}
                                </span>
                                {i < (route.nodes?.length || 0) - 1 && (
                                    <span className="mx-2 text-primary/40 font-bold">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </FadeIn>
            )}

            {route.guidance_type === 'Signage' && route.guidance_text && (
                <FadeIn>
                    <h2 className={`${typography.h2} mb-6 flex items-center gap-3`}>
                        <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                            <MapIcon className="w-4 h-4" />
                        </span>
                        Bewegwijzering
                    </h2>
                    <div className={`bg-card border border-primary/20 ${borderRadius.container} p-6 border-l-4 border-l-primary`}>
                        <p className={`${typography.body} text-foreground`}>{route.guidance_text}</p>
                    </div>
                </FadeIn>
            )}

            {route.guidance_type === 'GPX_Only' && (
                <FadeIn>
                    <h2 className={`${typography.h2} mb-6 flex items-center gap-3`}>
                        <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center">
                            <MapIcon className="w-4 h-4" />
                        </span>
                        Enkel GPX Track
                    </h2>
                    <div className={`bg-card border border-accent/20 ${borderRadius.container} p-6 border-l-4 border-l-accent`}>
                        <p className={`${typography.body} text-foreground`}>Deze route heeft geen borden ter plaatse en kan enkel gevolgd worden via de gedownloade GPX track op je smartphone of GPS-toestel.</p>
                    </div>
                </FadeIn>
            )}
        </div>
    );
}
