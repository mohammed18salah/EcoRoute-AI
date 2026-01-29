import { NextResponse } from 'next/server';

// Simple in-memory cache to prevent spamming Nominatim
const cache = new Map<string, any>();

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    // --- HACKATHON FIX: Override "Al Anbar" to point to Ramadi City (on the road) ---
    // The default "Al Anbar" point is in the deep desert and causes routing errors.
    // We map it to Ramadi (approx coordinates) so we get a REAL road route.
    const lowerQ = query.toLowerCase();
    if (lowerQ.includes("الانبار") || lowerQ.includes("al anbar") || lowerQ.includes("anbar")) {
        const ramadiCoords = [{
            lat: 33.4318,
            lng: 43.2987,
            displayName: "Al Anbar (Ramadi), Iraq"
        }];
        return NextResponse.json(ramadiCoords);
    }
    // --------------------------------------------------------------------------------

    // Check cache
    if (cache.has(query)) {
        return NextResponse.json(cache.get(query));
    }

    try {
        // Nominatim requires a User-Agent
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
            {
                headers: {
                    'User-Agent': 'EcoRouteAI-Hackathon/1.0',
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Nominatim API error: ${response.statusText}`);
        }

        const data = await response.json();

        // Map to simplified format
        const results = data.map((item: any) => ({
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            displayName: item.display_name,
        }));

        // Cache logic (keep cache size manageable)
        if (cache.size > 100) {
            const firstKey = cache.keys().next().value;
            if (firstKey) cache.delete(firstKey);
        }
        cache.set(query, results);

        return NextResponse.json(results);
    } catch (error: any) {
        console.error('Geocoding error:', error);
        return NextResponse.json({ error: 'Failed to fetch location data' }, { status: 500 });
    }
}
