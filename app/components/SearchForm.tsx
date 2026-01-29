"use client";

import { useState } from 'react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Search, MapPin, Loader2, Car } from 'lucide-react';
import { Location } from '@/lib/types';
import { VehicleType } from '../../lib/emissions';

interface SearchFormProps {
    onSearch: (start: Location, end: Location, vehicleType: VehicleType) => void;
    isLoading: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
    const [startQuery, setStartQuery] = useState('');
    const [endQuery, setEndQuery] = useState('');
    const [vehicleType, setVehicleType] = useState<VehicleType>('gas');
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [error, setError] = useState('');

    const handleDemo = () => {
        const demoRoutes = [
            { start: "Berlin, Germany", end: "Potsdam, Germany" },
            { start: "New York, NY", end: "Philadelphia, PA" },
            { start: "London, UK", end: "Oxford, UK" },
            { start: "San Francisco, CA", end: "San Jose, CA" },
            { start: "Paris, France", end: "Versailles, France" },
            { start: "Amsterdam, Netherlands", end: "Utrecht, Netherlands" },
            { start: "Los Angeles, CA", end: "Santa Monica, CA" }
        ];

        // Pick random
        const randomRoute = demoRoutes[Math.floor(Math.random() * demoRoutes.length)];

        setStartQuery(randomRoute.start);
        setEndQuery(randomRoute.end);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!startQuery || !endQuery) {
            setError("Please enter both locations.");
            return;
        }
        setError('');
        setIsGeocoding(true);

        try {
            const [startRes, endRes] = await Promise.all([
                fetch(`/api/geocode?q=${encodeURIComponent(startQuery)}`),
                fetch(`/api/geocode?q=${encodeURIComponent(endQuery)}`)
            ]);

            const startData = await startRes.json();
            const endData = await endRes.json();

            if (startData.error || !startData[0]) throw new Error(`Could not find location: ${startQuery}`);
            if (endData.error || !endData[0]) throw new Error(`Could not find location: ${endQuery}`);

            onSearch(startData[0], endData[0], vehicleType);
        } catch (err: any) {
            setError(err.message || "Geocoding failed. Try a different address.");
        } finally {
            setIsGeocoding(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-lg mx-auto bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl">
            <div className="space-y-3">
                <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-emerald-600" />
                    <Input
                        placeholder="Start Location (e.g. Baghdad)"
                        value={startQuery}
                        onChange={(e) => setStartQuery(e.target.value)}
                        className="pl-10 bg-white/60 border-zinc-200 focus:bg-white transition-all text-zinc-900"
                    />
                </div>
                <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-red-500" />
                    <Input
                        placeholder="Destination (e.g. Ramadi)"
                        value={endQuery}
                        onChange={(e) => setEndQuery(e.target.value)}
                        className="pl-10 bg-white/60 border-zinc-200 focus:bg-white transition-all text-zinc-900"
                    />
                </div>

                {/* Vehicle Selector */}
                <div className="relative">
                    <Car className="absolute left-3 top-2.5 h-5 w-5 text-zinc-500" />
                    <select
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                        className="flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 pl-10 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 text-zinc-900 appearance-none"
                    >
                        <option value="gas">Gasoline Car (Standard)</option>
                        <option value="diesel">Diesel Car</option>
                        <option value="suv">SUV / Truck</option>
                        <option value="hybrid">Hybrid (Eco)</option>
                        <option value="ev">Electric Vehicle (EV)</option>
                    </select>
                </div>
            </div>

            {error && <p className="text-red-500 text-sm font-medium animate-pulse">{error}</p>}

            <div className="flex gap-2 pt-2">
                <Button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 shadow-emerald-200 shadow-lg"
                    disabled={isLoading || isGeocoding}
                >
                    {isLoading || isGeocoding ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {isGeocoding ? 'Locating...' : 'Routing...'}</>
                    ) : (
                        <><Search className="mr-2 h-4 w-4" /> Find Eco Routes</>
                    )}
                </Button>
                <Button type="button" variant="outline" onClick={handleDemo} className="h-11 rounded-xl">
                    Demo
                </Button>
            </div>

            <p className="text-xs text-center text-zinc-400 mt-2">
                * Estimates based on EEA 2024 emission factors.
            </p>
        </form>
    );
}
