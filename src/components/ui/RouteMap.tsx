import { MapContainer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';

interface RouteMapProps {
    geoJsonData: unknown;
    mapCenter: [number, number];
    mapBounds: L.LatLngBounds | null;
}

export default function RouteMap({ geoJsonData, mapCenter, mapBounds }: RouteMapProps) {
    if (!geoJsonData) return null;

    return (
        <>
            <div className="rounded-3xl overflow-hidden border border-border/10 relative bg-[#0a0a0a] shadow-sm h-[300px]">
                <MapContainer
                    center={mapCenter}
                    bounds={mapBounds || undefined}
                    zoom={13}
                    scrollWheelZoom={false}
                    dragging={false}
                    zoomControl={false}
                    doubleClickZoom={false}
                    className="w-full h-full"
                    style={{ background: '#0a0a0a' }}
                >
                    <GeoJSON
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        data={geoJsonData as any}
                        style={{
                            color: '#FF5722', // Neon Orange
                            weight: 4,
                            opacity: 0.8,
                            lineCap: 'round',
                            lineJoin: 'round',
                            className: 'gpx-glow-effect'
                        }}
                    />
                </MapContainer>
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(10,10,10,1)] z-40" />
            </div>
            <style>
                {`
                .gpx-glow-effect {
                    filter: drop-shadow(0 0 8px rgba(255, 87, 34, 0.6));
                }
                `}
            </style>
        </>
    );
}
