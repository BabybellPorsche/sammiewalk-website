import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <Compass className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">404 - Weg Kwijt?</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-md">
                Oeps, deze route lijkt niet (meer) te bestaan. Laten we je terug naar het overzicht brengen.
            </p>
            <Link
                to="/"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
                Terug naar Uitgelicht
            </Link>
        </div>
    );
}
