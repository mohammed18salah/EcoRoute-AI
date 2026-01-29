export interface Location {
    lat: number;
    lng: number;
    address?: string;
}

export interface RouteResult {
    id: string; // unique id for list keys
    geometry: string; // encoded polyline
    distanceKm: number;
    durationMin: number;
    emissionsKg: number;
    savingsPercent: number; // vs worst route
    isEcofriendly: boolean;
    isFastest: boolean;
    label: string; // "Eco Best", "Fastest", etc.
    description: string; // e.g., "Saves 1.2kg CO2"
}

export interface SearchState {
    start: Location | null;
    end: Location | null;
}
