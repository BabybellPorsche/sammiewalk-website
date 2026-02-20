import { useEffect } from 'react';
import { MapContainer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';

interface RouteMapProps {
    geoJsonData: unknown;
    mapCenter: [number, number];
    mapBounds: L.LatLngBounds | null;
}

function FitBounds({ bounds }: { bounds: L.LatLngBounds | null }) {
    const map = useMap();
    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds, { padding: [15, 15], animate: false });
        }
    }, [map, bounds]);
    return null;
}

export default function RouteMap({ geoJsonData, mapCenter, mapBounds }: RouteMapProps) {
    if (!geoJsonData) return null;

    return (
        <>
            <div className="rounded-3xl overflow-hidden border border-border/10 relative bg-[#0a0a0a] shadow-sm h-[300px]">
                <MapContainer
                    center={mapCenter}
                    zoom={13}
                    scrollWheelZoom={false}
                    dragging={false}
                    zoomControl={false}
                    doubleClickZoom={false}
                    className="w-full h-full"
                    style={{ background: '#0a0a0a' }}
                >
                    <FitBounds bounds={mapBounds} />
                    <GeoJSON
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        data={geoJsonData as any}
                        style={{
                            color: '#FF5722',
                            weight: 4,
                            opacity: 0.85,
                            lineCap: 'round',
                            lineJoin: 'round',
                        }}
                    />
                </MapContainer>
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(10,10,10,1)] z-40" />
            </div>
        </>
    );
}
