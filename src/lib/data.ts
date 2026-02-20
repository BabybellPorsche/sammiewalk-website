// src/lib/data.ts
import { v4 as uuidv4 } from 'uuid';

export type RouteDifficulty = 'Easy' | 'Moderate' | 'Hard' | 'Expert';
export type RouteType = 'GPX' | 'Nodes' | 'Both';

export const translateDifficulty = (difficulty: RouteDifficulty): string => {
    switch (difficulty) {
        case 'Easy': return 'Makkelijk';
        case 'Moderate': return 'Gemiddeld';
        case 'Hard': return 'Moeilijk';
        case 'Expert': return 'Expert';
        default: return difficulty;
    }
};

export interface RouteNode {
    id: string; // The literal node number or label
    description?: string;
    distanceFromStart?: number;
}

export interface Route {
    id: string;
    title: string;
    location: string;
    distance_km: number;
    route_type: RouteType;
    gpx_file_url?: string;
    nodes?: RouteNode[];
    difficulty: RouteDifficulty;
    notes?: string;
    cover_photo_url?: string;
    start_point?: string;
    sammiescore?: string;
    guidance_type?: string;
    guidance_text?: string;
    gallery_urls?: string[];
    tags?: string[];
    created_at: string;
    // Adding synthetic data for the MVP UI like the mock duration or stats
    duration?: string;
    surface?: string;
}

export const mockRoutes: Route[] = [
    {
        id: uuidv4(),
        title: "Veluwe Forest Trail Loop",
        location: "National Park Veluwezoom, NL",
        distance_km: 14.2,
        route_type: "Both",
        difficulty: "Moderate",
        duration: "3h 15m",
        surface: "Mixed",
        tags: ["Forest", "Dog Friendly", "Loop"],
        nodes: [
            { id: "12", description: "Start" },
            { id: "13" },
            { id: "18" },
            { id: "22" },
            { id: "45" },
            { id: "82" },
            { id: "12", description: "End" }
        ],
        cover_photo_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
        notes: "Immerse yourself in the tranquility of the Veluwezoom National Park, the oldest national park in the Netherlands...",
        created_at: new Date().toISOString(),
    },
    {
        id: uuidv4(),
        title: "Alpine Ridge Explorer",
        location: "Chamonix, France",
        distance_km: 12.4,
        route_type: "GPX",
        difficulty: "Hard",
        duration: "4.5h",
        surface: "Rocky",
        tags: ["High Elevation", "Loop"],
        cover_photo_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
        notes: "A challenging but rewarding loop that takes you through the misty peaks. Expect steep ascents.",
        created_at: new Date().toISOString(),
    },
    {
        id: uuidv4(),
        title: "Whispering Pines",
        location: "Oregon Coast",
        distance_km: 14.5,
        route_type: "GPX",
        difficulty: "Hard",
        duration: "5h 45m",
        surface: "Dirt",
        tags: ["Coastal", "Forest"],
        cover_photo_url: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
        notes: "Beautiful coastal views mingled with deep pine forests.",
        created_at: new Date().toISOString(),
    }
];

// Mock basic GPX file trace data as text for the UI since we don't have a real file URL yet.
export const mockGpxText = `
<?xml version="1.0" encoding="UTF-8"?>
<gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1" creator="SammieWalk">
  <trk>
    <name>Veluwe Loop</name>
    <trkseg>
      <trkpt lat="52.0298" lon="5.9863"></trkpt>
      <trkpt lat="52.0310" lon="5.9890"></trkpt>
      <trkpt lat="52.0325" lon="5.9920"></trkpt>
      <trkpt lat="52.0350" lon="5.9940"></trkpt>
      <trkpt lat="52.0380" lon="5.9910"></trkpt>
      <trkpt lat="52.0360" lon="5.9850"></trkpt>
      <trkpt lat="52.0320" lon="5.9820"></trkpt>
      <trkpt lat="52.0298" lon="5.9863"></trkpt>
    </trkseg>
  </trk>
</gpx>
`;
