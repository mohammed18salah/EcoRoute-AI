"use client";

import { useState } from 'react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { Location } from '@/lib/types';

interface SearchFormProps {
    onSearch: (start: Location, end: Location) => void;
    isLoading: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
    const [startQuery, setStartQuery] = useState('');
    const [endQuery, setEndQuery] = useState('');
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [error, setError] = useState('');

    // Example placeholders related to sustainability/nature
    const handleDemo = () => {
        setStartQuery("Berlin, Germany");
        setEndQuery("Potsdam, Germany");
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
            // Geocode both
            const [startRes, endRes] = await Promise.all([
                fetch(`/api/geocode?q=${encodeURIComponent(startQuery)}`),
                fetch(`/api/geocode?q=${encodeURIComponent(endQuery)}`)
            ]);

            const startData = await startRes.json();
            const endData = await endRes.json();

            if (startData.error || !startData[0]) throw new Error(`Could not find location: ${startQuery}`);
            if (endData.error || !endData[0]) throw new Error(`Could not find location: ${endQuery}`);

            onSearch(startData[0], endData[0]);
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
                        placeholder="Start Location (e.g. New York)"
                        value={startQuery}
                        onChange={(e) => setStartQuery(e.target.value)}
                        className="pl-10 bg-white/60 border-zinc-200 focus:bg-white transition-all"
                    />
                </div>
                <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-red-500" />
                    <Input
                        placeholder="Destination (e.g. Boston)"
                        value={endQuery}
                        onChange={(e) => setEndQuery(e.target.value)}
                        className="pl-10 bg-white/60 border-zinc-200 focus:bg-white transition-all"
                    />
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
        </form>
    );
}
