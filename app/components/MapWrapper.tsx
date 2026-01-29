"use client";

import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('./MapView'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-zinc-100 animate-pulse rounded-2xl flex items-center justify-center text-zinc-400">Loading Map...</div>
});

export default MapView;
