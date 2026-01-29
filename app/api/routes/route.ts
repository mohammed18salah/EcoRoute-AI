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

        if (!ORS_API_KEY) {
            console.error("ORS_API_KEY is missing");
            return NextResponse.json({ error: 'Server configuration error: API Key missing' }, { status: 500 });
        }

        // Prepare Request to OpenRouteService
        // We ask for driving-car, and alternatives.
        const body = {
            coordinates: [
                [start.lng, start.lat],
                [end.lng, end.lat]
            ],
            alternative_routes: {
                target_count: 3, // Try to get 3 routes
                weight_factor: 1.4,
                share_factor: 0.6
            },
            preference: "recommended",
            units: "km",
            geometry: "true"
        };

        const response = await fetch('https://api.openrouteservice.org/v2/directions/driving-car', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': ORS_API_KEY
            },
            body: JSON.stringify(body)
        });

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
        return NextResponse.json({ error: 'Failed to fetch routes' }, { status: 500 });
    }
}
