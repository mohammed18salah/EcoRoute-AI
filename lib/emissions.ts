/**
 * Calculate estimated CO2 emissions for a driving route.
 * 
 * Formula:
 * base_factor = 0.192 kg CO2 / km (gasoline car baseline)
 * expected_duration = distance_km / 50km/h
 * congestion_factor = 1 + clamp((actual_duration / expected_duration) - 1, 0, 0.6)
 * emissions_kg = distance_km * base_factor * congestion_factor
 */
export function calculateEmissions(distanceKm: number, durationMin: number): number {
    const BASE_FACTOR = 0.192; // kg CO2 per km
    const AVG_SPEED_KMH = 50;

    const expectedDurationMin = (distanceKm / AVG_SPEED_KMH) * 60;

    // Calculate potential delay ratio
    // If actual duration is longer than expected, it implies traffic/stop-and-go
    let delayRatio = 0;
    if (expectedDurationMin > 0) {
        delayRatio = (durationMin / expectedDurationMin) - 1;
    }

    // Sustainabilty logic: Traffic increases fuel consumption.
    // We clamp the penalty between 0 (no traffic/highway) and 0.6 (heavy traffic +60% emissions)
    const congestionFactor = 1 + Math.max(0, Math.min(delayRatio, 0.6));

    const emissions = distanceKm * BASE_FACTOR * congestionFactor;

    return parseFloat(emissions.toFixed(2));
}

export function calculateSavings(currentEmissions: number, maxEmissions: number): number {
    if (maxEmissions === 0) return 0;
    const savings = ((maxEmissions - currentEmissions) / maxEmissions) * 100;
    return Math.max(0, parseFloat(savings.toFixed(0)));
}
