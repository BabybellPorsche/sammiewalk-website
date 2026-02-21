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
            <div className="rounded-3xl overflow-hidden relative bg-background h-[300px]">
                <MapContainer
                    center={mapCenter}
                    zoom={13}
                    scrollWheelZoom={false}
                    dragging={false}
                    zoomControl={false}
                    doubleClickZoom={false}
                    className="w-full h-full"
                    style={{ background: '#1B211A' }}
                >
                    <FitBounds bounds={mapBounds} />
                    <GeoJSON
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        data={geoJsonData as any}
                        style={{
                            color: '#628141',
                            weight: 3,
                            opacity: 1,
                            lineCap: 'round',
                            lineJoin: 'round',
                        }}
                    />
                </MapContainer>
            </div>
            <style>
                {`
                .leaflet-container {
                    background: #1B211A !important;
                }
                `}
            </style>
        </>
    );
}
