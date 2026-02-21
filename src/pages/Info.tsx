import { Info as InfoIcon, Map, Smartphone, ExternalLink, MapPin, Footprints } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';

export default function Info() {
    return (
        <div className="space-y-8 p-4 md:p-8 max-w-[1600px] mx-auto w-full pb-16">
            <PageHeader
                title="Info & FAQ"
                description="Sammie en Winnie wandelen graag. Hier verzamelen we onze routes."
                badgeText="Meer Weten"
                icon={<InfoIcon className="w-6 h-6" />}
            />

            <section className="bg-card border border-border/10 rounded-3xl p-8 md:p-10 relative overflow-hidden group">
                <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-6">
                        <Footprints className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Over dit project</h2>
                    <div className="prose prose-invert prose-emerald max-w-none text-muted-foreground leading-relaxed">
                        <p>
                            Omdat Winnie en ik veel wandelen wou ik een verzamelpunt maken van mijn favoriete wandelingen (veel natuur, weinig mensen).
                        </p>
                        <p>
                            Hier verzamel ik dus m'n favorieten. Van korte toertjes van 5km tot routes van meer dan 20km voor de masochisten onder ons.
                        </p>
                    </div>
                </div>
            </section>

            <section className="bg-card border border-border/10 rounded-3xl p-8 md:p-10 relative overflow-hidden group mt-8">
                <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-6">
                        <Map className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Hoe volg ik een GPX-route?</h2>
                    <p className="mb-6">
                        Niet elke route is voorzien van knooppunten of duidelijke bordjes. Sommige routes, volg je best via een GPX-bestand... een wuk dadde?.. ewel, een GPX-bestand. Een soort digitale routekaart die je kan inladen op je smartphone of wandel-GPS.
                    </p>

                    <a
                        href="https://apps.apple.com/nl/app/gpx-viewer-2/id6444086445"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block not-prose mb-8 border border-border/10 bg-background/50 hover:bg-card/80 hover:border-primary/30 transition-colors rounded-3xl p-6 md:p-8 cursor-pointer group"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                    <Smartphone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg md:text-xl text-foreground group-hover:text-primary transition-colors">GPX Viewer 2</h3>
                                    <p className="text-sm font-medium text-muted-foreground">Mijn aanrader voor iPhone</p>
                                </div>
                            </div>
                            <div className="hidden sm:flex self-start items-center gap-2 text-sm font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                                App Store <ExternalLink className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                            Ik raad deze gratis app aan. Er zijn er nog natuurlijk, maar voor zover ik weet is dit de enige die niet alles achter een paywall steekt.<br className="hidden md:block" />
                            <span className="italic mt-2 block">Voor de Android gebruikers: geen idee, zoekt zelf, ik heb een iPhone en kdoe hier al moeite genoeg.</span>
                        </p>
                    </a>

                    <div className="mt-8 bg-black/40 p-6 md:p-8 rounded-3xl border border-white/10 relative overflow-hidden">
                        <h3 className="font-bold text-xl text-white mb-6 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" />
                            Stappenplan
                        </h3>
                        <div className="space-y-4 not-prose">
                            {[
                                "Download de gratis app hierboven.",
                                "Klik op \"Download GPX\" op één van de wandelingen op SammieWalk.",
                                "Open het gedownloade bestand (of importeer het direct in je app).",
                                "Je ziet nu een gekleurde lijn op de wereldkaart. Zorg dat de stip van je eigen locatie (GPS) op de lijn blijft staan terwijl je wandelt!",
                                "Van de lijn afwijken mag, zie het als een persoonlijke act van rebellie op de GPS industrie."
                            ].map((step, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-white/10 text-primary font-bold flex items-center justify-center shrink-0 border border-white/5">
                                        {index + 1}
                                    </div>
                                    <p className="text-white/80 pt-1 leading-relaxed">
                                        {index === 1 ? (
                                            <span>Klik op <strong className="text-white font-semibold">"Download GPX"</strong> op één van de wandelingen op SammieWalk.</span>
                                        ) : (
                                            step
                                        )}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
