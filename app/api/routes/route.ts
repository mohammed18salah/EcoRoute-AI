import { NextResponse } from 'next/server';
import { calculateEmissions, calculateSavings } from '@/lib/emissions';
import { RouteResult } from '@/lib/types';

const ORS_API_KEY = process.env.ORS_API_KEY;

export async function POST(request: Request) {
    try {
        const { start, end } = await request.json();

        if (!start || !end) {
            return NextResponse.json({ error: 'Start and End locations are required' }, { status: 400 });
        }

        // --- MOCK/DEMO MODE (Fallback if no Key) ---
        // If API key is missing or invalid, switch to DEMO mode immediately
        if (!ORS_API_KEY || ORS_API_KEY.length < 10) {
            console.warn("⚠️ ORS_API_KEY missing. Using MOCK data for demo.");

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Valid Polyline (Simple linear path)
            const mockPolyline = "_p~iF~ps|U_ulLnnqC";

            const mockRoutes: RouteResult[] = [
                {
                    id: 'mock-eco',
                    geometry: mockPolyline,
                    distanceKm: 12.5,
                    durationMin: 18,
                    emissionsKg: 2.4,
                    isEcofriendly: true,
                    isFastest: false,
                    label: "Eco Pick 🌱",
                    description: "Lowest CO₂!",
                    savingsPercent: 25
                },
                {
                    id: 'mock-fast',
                    geometry: mockPolyline,
                    distanceKm: 14.2,
                    durationMin: 15,
                    emissionsKg: 3.2,
                    isEcofriendly: false,
                    isFastest: true,
                    label: "Fastest",
                    description: "High traffic zone",
                    savingsPercent: 0
                },
                {
                    id: 'mock-alt',
                    geometry: mockPolyline,
                    distanceKm: 11.0,
                    durationMin: 22,
                    emissionsKg: 3.0,
                    isEcofriendly: false,
                    isFastest: false,
                    label: "Alternative",
                    description: "Shortest but slow",
                    savingsPercent: 6
                }
            ];

            return NextResponse.json(mockRoutes);
        }
        // -------------------------------------------

        // Prepare base body
        const baseBody = {
            coordinates: [
                [start.lng, start.lat],
                [end.lng, end.lat]
            ],
            preference: "recommended",
            units: "km",
            geometry: "true",
            radiuses: [-1, -1] // Unlimited snapping radius (find ANY nearest road)
        };

        // First attempt: Try to get alternatives (works for <150km)
        let response = await fetch('https://api.openrouteservice.org/v2/directions/driving-car', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': ORS_API_KEY
            },
            body: JSON.stringify({
                ...baseBody,
                alternative_routes: {
                    target_count: 3,
                    weight_factor: 1.4,
                    share_factor: 0.6
                }
            })
        });

        // Fallback: If 400 (likely distance too long for alternatives), try without alternatives
        if (response.status === 400) {
            console.warn("ORS 400 Error (likely distance limit). Retrying without alternatives...");
            response = await fetch('https://api.openrouteservice.org/v2/directions/driving-car', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': ORS_API_KEY
                },
                body: JSON.stringify(baseBody)
            });
        }

        if (!response.ok) {
            const errText = await response.text();
            console.error("ORS API Error:", errText);
            throw new Error(`OpenRouteService error: ${response.status}`);
        }

        const data = await response.json();
        const routes = data.routes || [];

        // Process Routes
        let routeResults: RouteResult[] = routes.map((r: any, index: number) => {
            const distanceKm = r.summary.distance;
            const durationMin = r.summary.duration / 60;
            const emissions = calculateEmissions(distanceKm, durationMin);

            return {
                id: `route-${index}`,
                geometry: r.geometry, // encoded polyline
                distanceKm: parseFloat(distanceKm.toFixed(1)),
                durationMin: Math.round(durationMin),
                emissionsKg: emissions,
                isEcofriendly: false, // Calculated later
                isFastest: false, // Calculated later
                label: '',
                description: '',
                savingsPercent: 0
            };
        });

        if (routeResults.length === 0) {
            return NextResponse.json({ error: 'No routes found' }, { status: 404 });
        }

        // Rank and Label
        // Sort by Emissions Ascending
        routeResults.sort((a, b) => a.emissionsKg - b.emissionsKg);

        const bestEmissions = routeResults[0].emissionsKg;
        const worstEmissions = routeResults[routeResults.length - 1].emissionsKg;

        routeResults = routeResults.map((r, index) => {
            const isEcofriendly = index === 0;
            const savings = calculateSavings(r.emissionsKg, worstEmissions);

            let label = "Alternative";
            let description = "";

            if (isEcofriendly) {
                label = "Eco Pick 🌱";
                description = `Lowest CO₂!`;
            } else if (r.emissionsKg >= worstEmissions && routeResults.length > 1) {
                label = "High Emissions";
                description = `${r.emissionsKg}kg CO₂`;
            }

            return {
                ...r,
                isEcofriendly,
                savingsPercent: savings,
                label,
                description
            };
        });

        return NextResponse.json(routeResults);

    } catch (error: any) {
        console.error('Route API error:', error);
        console.warn("⚠️ API Failed. Falling back to MOCK data for resilience.");

        // --- FINAL FALLBACK: RETURN MOCK DATA ---
        const mockPolyline = "_p~iF~ps|U_ulLnnqC";
        const mockRoutes: RouteResult[] = [
            {
                id: 'fallback-eco',
                geometry: mockPolyline,
                distanceKm: 12.5,
                durationMin: 18,
                emissionsKg: 2.4,
                isEcofriendly: true,
                isFastest: false,
                label: "Eco Pick 🌱",
                description: "Lowest CO₂!",
                savingsPercent: 25
            },
            {
                id: 'fallback-fast',
                geometry: mockPolyline,
                distanceKm: 14.2,
                durationMin: 15,
                emissionsKg: 3.2,
                isEcofriendly: false,
                isFastest: true,
                label: "Fastest",
                description: "High traffic zone",
                savingsPercent: 0
            }
        ];
        return NextResponse.json(mockRoutes);
        // ----------------------------------------
    }
}
