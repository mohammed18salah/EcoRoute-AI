/**
 * Calculate estimated CO2 emissions for a driving route.
 */
export type VehicleType = 'gas' | 'diesel' | 'hybrid' | 'ev' | 'suv';

export const VEHICLE_FACTORS: Record<VehicleType, number> = {
    gas: 0.192,    // Baseline (sedan) - Source: EEA
    diesel: 0.171, // Efficient engine but higher NOx (CO2 is lower per km sometimes)
    suv: 0.255,    // Heavy, poor aerodynamics
    hybrid: 0.108, // Mixed cycle
    ev: 0.045      // Indirect emissions (grid power generation)
};

export function calculateEmissions(distanceKm: number, durationMin: number, type: VehicleType = 'gas'): number {
    const baseFactor = VEHICLE_FACTORS[type] || VEHICLE_FACTORS.gas;
    const AVG_SPEED_KMH = 50;

    const expectedDurationMin = (distanceKm / AVG_SPEED_KMH) * 60;

    // Calculate potential delay ratio (Traffic Penalty)
    let delayRatio = 0;
    if (expectedDurationMin > 0) {
        delayRatio = (durationMin / expectedDurationMin) - 1;
    }

    // Sustainability logic: Traffic increases fuel consumption.
    // We clamp the penalty between 0 (no traffic) and 0.6 (heavy traffic)
    // EVs suffer less from traffic (regenerative braking), so we reduce penalty for them.
    let trafficMultiplier = type === 'ev' || type === 'hybrid' ? 0.3 : 1.0;

    const congestionFactor = 1 + (Math.max(0, Math.min(delayRatio, 0.6)) * trafficMultiplier);

    const emissions = distanceKm * baseFactor * congestionFactor;

    return parseFloat(emissions.toFixed(2));
}

export function calculateSavings(currentEmissions: number, maxEmissions: number): number {
    if (maxEmissions === 0) return 0;
    const savings = ((maxEmissions - currentEmissions) / maxEmissions) * 100;
    return Math.max(0, parseFloat(savings.toFixed(0)));
}
