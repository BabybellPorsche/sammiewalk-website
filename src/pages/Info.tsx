import { Info as InfoIcon, Map, Smartphone } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';

export default function Info() {
    return (
        <div className="space-y-8 p-4 md:p-8 max-w-[1600px] mx-auto w-full pb-16">
            <PageHeader
                title="Info & FAQ"
                description="Welkom bij SammieWalk. Ontdek waarom we dit platform zijn gestart en hoe je je optimaal voorbereidt op je volgende wandeling."
                badgeText="Meer Weten"
                icon={<InfoIcon className="w-6 h-6" />}
            />

            <section className="bg-card border border-border/10 rounded-3xl p-8 md:p-10 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-primary/10 transition-colors duration-700 pointer-events-none" />
                <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-6">
                        <InfoIcon className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Over dit project</h2>
                    <div className="prose prose-invert prose-emerald max-w-none text-muted-foreground leading-relaxed">
                        <p>
                            Wandelen in de natuur hoort toegankelijk te zijn voor iedereen. Daarom is SammieWalk ontstaan: een modern platform zonder betaalmuren of abonnementen.
                        </p>
                        <p>
                            Gewoon een plek waar we mooie, betrouwbare routes delen die voor iedereen gratis toegankelijk zijn.
                        </p>
                    </div>
                </div>
            </section>

            <section className="bg-card border border-border/10 rounded-3xl p-8 md:p-10 shadow-sm relative overflow-hidden group mt-8">
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl translate-y-1/3 translate-x-1/4 group-hover:bg-amber-500/10 transition-colors duration-700 pointer-events-none" />
                <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center mb-6">
                        <Map className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Hoe volg ik een GPX-route?</h2>
                    <div className="prose prose-invert prose-amber max-w-none text-muted-foreground leading-relaxed">
                        <p>
                            Niet elke route is voorzien van knooppunten of duidelijke bordjes. Sommige, iets avontuurlijkere paden, volg je best via een GPX-bestand. Zie het als een digitale routekaart die je eenvoudig inlaadt op je smartphone of wandel-GPS.
                        </p>
                        <p>
                            We raden gratis apps aan zoals GPX Viewer of OsmAnd om je comfortabel op het juiste pad te houden:
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 mt-8 not-prose">
                            <div className="border border-border/10 bg-background/50 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <Smartphone className="w-5 h-5 text-primary" />
                                    <h3 className="font-bold text-lg text-foreground">GPX Viewer (Android & iOS)</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">Zeer simpele en snelle app. Download simpelweg mijn GPX bestand op je gsm en "Deel" hem met deze app om de lijn op de kaart te zien.</p>
                            </div>

                            <div className="border border-border/10 bg-background/50 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <Smartphone className="w-5 h-5 text-primary" />
                                    <h3 className="font-bold text-lg text-foreground">OsmAnd (Android & iOS)</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">Zeer gedetailleerde topografische offline kaarten. Iets technischer, maar perfect als je ook kleine bospaadjes wil zien.</p>
                            </div>
                        </div>

                        <div className="mt-8 bg-black/20 p-6 rounded-2xl border border-white/5">
                            <h3 className="font-bold text-white mb-2">Stappenplan:</h3>
                            <ol className="list-decimal pl-5 space-y-2">
                                <li>Download een van de gratis apps hierboven.</li>
                                <li>Klik op <strong>"Download GPX"</strong> op één van de wandelingen op SammieWalk.</li>
                                <li>Open het gedownloade bestand (of importeer het direct in je app).</li>
                                <li>Je ziet nu een gekleurde lijn op de wereldkaart. Zorg dat de stip van je eigen locatie (GPS) op de lijn blijft staan terwijl je wandelt!</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
