import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Route as RouteType } from '../lib/data';
import L from 'leaflet';
import { gpx } from '@mapbox/togeojson';

export function useRouteDetail(id: string | undefined) {
    const [route, setRoute] = useState<RouteType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [geoJsonData, setGeoJsonData] = useState<unknown>(null);
    const [mapCenter, setMapCenter] = useState<[number, number]>([51.2194, 4.4025]);
    const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);
    const [similarRoutes, setSimilarRoutes] = useState<RouteType[]>([]);

    useEffect(() => {
        async function fetchRoute() {
            if (!id) return;

            const { data, error: dbError } = await supabase
                .from('routes')
                .select('*')
                .eq('id', id)
                .single();

            if (dbError) {
                setError("Could not load this route.");
                setLoading(false);
                return;
            }

            if (data.gpx_file_url) {
                try {
                    const response = await fetch(data.gpx_file_url);
                    const gpxText = await response.text();
                    const parser = new DOMParser();
                    const gpxDoc = parser.parseFromString(gpxText, "text/xml");
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const geoJson = gpx(gpxDoc) as any;
                    setGeoJsonData(geoJson);

                    if (geoJson.features && geoJson.features.length > 0) {
                        const coords = geoJson.features[0].geometry.coordinates;
                        if (coords && coords.length > 0) {
                            const bounds = L.geoJSON(geoJson).getBounds();
                            setMapBounds(bounds);
                            setMapCenter([bounds.getCenter().lat, bounds.getCenter().lng]);
                        }
                    }
                } catch (e) {
                    console.error("Error parsing GPX:", e);
                }
            }

            setRoute(data);
            setLoading(false);

            // Fetch similar routes
            if (data?.difficulty) {
                const { data: similar } = await supabase
                    .from('routes')
                    .select('*')
                    .eq('difficulty', data.difficulty)
                    .neq('id', data.id)
                    .limit(4);
                if (similar) {
                    setSimilarRoutes(similar);
                }
            }
        }

        fetchRoute();
    }, [id]);

    const handleDelete = async (onSuccess: () => void) => {
        if (!id) return;
        if (!window.confirm("Ben je zeker dat je deze route wilt verwijderen? Dit kan niet ongedaan worden gemaakt.")) return;

        const { error } = await supabase
            .from('routes')
            .delete()
            .eq('id', id);

        if (error) {
            alert(`Error deleting route: ${error.message}`);
        } else {
            onSuccess();
        }
    };

    const handleShare = async () => {
        if (!route) return;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `SammieWalk: ${route.title}`,
                    text: `Ontdek deze wandeling: ${route.title} (${route.distance_km || 0}km in ${route.location})\n\n`,
                    url: window.location.href,
                });
            } catch (error) {
                console.error('Error sharing', error);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link gekopieerd naar klembord!');
        }
    };

    return {
        route,
        loading,
        error,
        geoJsonData,
        mapCenter,
        mapBounds,
        similarRoutes,
        handleDelete,
        handleShare
    };
}
