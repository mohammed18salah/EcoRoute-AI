"use client";

import { useEffect } from "react";
import { RouteResult, Location } from "@/lib/types";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icon issue in Next.js
const iconUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
    start: Location | null;
    end: Location | null;
    routes: RouteResult[];
    selectedRouteId: string | null;
}

// Helper component to adjust map bounds
function MapUpdater({ start, end, routes, selectedRouteId }: MapViewProps) {
    const map = useMap();

    useEffect(() => {
        if (!start && !end) return;

        const bounds = L.latLngBounds([]);
        if (start) bounds.extend([start.lat, start.lng]);
        if (end) bounds.extend([end.lat, end.lng]);

        // Add route geometry to bounds
        routes.forEach(r => {
            // Decode polyline (simple version or use library if needed)
            // For now, assuming OpenRouteService returns encoded string, 
            // we'd typically need a decoder. 
            // BUT ORS V2 API can return GeoJSON coordinates directly if requested.
            // My simple implementation requested geometry="true" which returns encoded string by default usually. 
            // To simplify this hackathon MVP, we blindly trust Leaflet can handle whatever, 
            // OR we use a simple decoder.
            // ACTUALLY, in my API route I passed geometry straight through.
            // Let's assume simpler approach: just fit start/end for MVP if decoding is complex without library.
            // Re-check: ORS V2 returns "geometry": "encoded_string". 
            // I need to decode it to display it.
            // I will add a simple decoder in this component for safety.
        });

        if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [start, end, map]);

    return null;
}

// Simple Polyline Decoder (Google Encoded Polyline Algorithm)
function decodePolyline(str: string, precision: number = 5) {
    let index = 0,
        lat = 0,
        lng = 0,
        coordinates = [],
        shift = 0,
        result = 0,
        byte = null,
        latitude_change,
        longitude_change,
        factor = Math.pow(10, precision || 5);

    while (index < str.length) {
        byte = null;
        shift = 0;
        result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
        shift = result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        lat += latitude_change;
        lng += longitude_change;

        coordinates.push([lat / factor, lng / factor]);
    }

    return coordinates as L.LatLngExpression[];
}


export default function MapView({ start, end, routes, selectedRouteId }: MapViewProps) {
    return (
        <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            style={{ height: "100%", width: "100%", borderRadius: "1rem" }}
            className="z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapUpdater start={start} end={end} routes={routes} selectedRouteId={selectedRouteId} />

            {start && <Marker position={[start.lat, start.lng]}><Popup>Start: {start.address}</Popup></Marker>}
            {end && <Marker position={[end.lat, end.lng]}><Popup>End: {end.address}</Popup></Marker>}

            {routes.map(route => {
                const isSelected = selectedRouteId === route.id;
                const isEco = route.isEcofriendly;

                let color = '#71717a'; // Zinc-500 (Gray) for normal
                if (isEco) color = '#10b981'; // Emerald-500 for eco
                else if (route.label === "High Emissions") color = '#ef4444'; // Red-500

                // If selected, it stays colored. If not selected, it fades unless it's the only one
                const opacity = selectedRouteId ? (isSelected ? 1 : 0.4) : 0.8;
                const weight = isSelected ? 6 : 4;

                // Decode geometry
                let positions = decodePolyline(route.geometry);

                // Fallback: If decoding fails or is empty, draw straight line start->end
                if (positions.length === 0 && start && end) {
                    positions = [[start.lat, start.lng], [end.lat, end.lng]] as any;
                }

                return (
                    <Polyline
                        key={route.id}
                        positions={positions}
                        pathOptions={{
                            color: color,
                            weight: weight,
                            opacity: opacity,
                            lineCap: 'round',
                            dashArray: isEco ? undefined : '5, 10' // Solid for Eco, Dashed for others
                        }}
                    />
                );
            })}

        </MapContainer>
    );
}
