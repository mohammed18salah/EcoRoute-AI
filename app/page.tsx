"use client";

import { useState } from "react";
import Image from "next/image";
import { SearchForm } from "@/app/components/SearchForm";
import { RouteCards } from "@/app/components/RouteCards";
import MapWrapper from "@/app/components/MapWrapper";
import { AboutSection } from "@/app/components/AboutSection";
import { Location, RouteResult } from "@/lib/types";
import { Leaf, Map as MapIcon } from "lucide-react";

export default function Home() {
  const [startLoc, setStartLoc] = useState<Location | null>(null);
  const [endLoc, setEndLoc] = useState<Location | null>(null);
  const [routes, setRoutes] = useState<RouteResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  const handleSearch = async (start: Location, end: Location, vehicleType: string) => {
    setStartLoc(start);
    setEndLoc(end);
    setLoading(true);
    setRoutes([]);
    setSelectedRouteId(null);

    try {
      const res = await fetch('/api/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start, end, vehicleType })
      });

      if (!res.ok) throw new Error("Failed to fetch routes");

      const data = await res.json();
      if (Array.isArray(data)) {
        setRoutes(data);
        // Auto-select the first (eco) route
        if (data.length > 0) setSelectedRouteId(data[0].id);
      }
    } catch (err) {
      console.error(err);
      // In a real app, show a toast error here
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 text-zinc-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
              <Leaf size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900">EcoRoute <span className="text-emerald-600">AI</span></span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-zinc-500">
            <a href="#demo" className="hover:text-emerald-600 transition-colors">Demo</a>
            <a href="#about" className="hover:text-emerald-600 transition-colors">About</a>
            <a href="https://github.com/mohammed18salah/EcoRoute-AI" target="_blank" className="hover:text-emerald-600 transition-colors">GitHub</a>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Hero / Search Section */}
        <section id="demo" className="mb-8 flex flex-col items-center justify-center min-h-[40vh] relative rounded-3xl overflow-hidden bg-zinc-900 text-white shadow-2xl">
          {/* Background Image Placeholder - using CSS gradient for MVP speed */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900/90"></div>

          <div className="relative z-10 w-full max-w-2xl px-4 py-16 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
              Drive Green, <span className="text-emerald-400">Save Earth.</span>
            </h1>
            <p className="text-lg text-zinc-200 mb-8 max-w-xl mx-auto">
              AI-powered navigation that finds the most fuel-efficient routes to reduce your carbon footprint instantly.
            </p>
            <SearchForm onSearch={handleSearch} isLoading={loading} />
          </div>
        </section>

        {/* Results Section */}
        {(startLoc && endLoc) && (
          <div className="grid lg:grid-cols-3 gap-6 mb-16 animate-in slide-in-from-bottom-4 duration-700">
            {/* Left Panel: Route List */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <MapIcon className="w-5 h-5 text-emerald-600" /> Found Routes
                </h2>
                <span className="text-xs font-medium text-zinc-500 bg-zinc-100 px-2 py-1 rounded-full">{routes.length} options</span>
              </div>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-32 bg-zinc-200 animate-pulse rounded-xl" />)}
                </div>
              ) : (
                <RouteCards
                  routes={routes}
                  selectedRouteId={selectedRouteId}
                  onSelect={setSelectedRouteId}
                  start={startLoc}
                  end={endLoc}
                />
              )}
            </div>

            {/* Right Panel: Map */}
            <div className="lg:col-span-2 h-[500px] lg:h-auto bg-zinc-100 rounded-2xl overflow-hidden border border-zinc-200 shadow-inner relative">
              <MapWrapper
                start={startLoc}
                end={endLoc}
                routes={routes}
                selectedRouteId={selectedRouteId}
              />
              {/* Floating Info Pill */}
              {selectedRouteId && routes.find(r => r.id === selectedRouteId)?.isEcofriendly && (
                <div className="absolute top-4 right-4 z-[400] bg-emerald-600 text-white px-4 py-2 rounded-full shadow-lg text-sm font-bold flex items-center animate-bounce-slow">
                  <Leaf className="w-4 h-4 mr-2" />
                  Recommended Green Route
                </div>
              )}
            </div>
          </div>
        )}

        <div id="about">
          <AboutSection />
        </div>

      </div>

      <footer className="border-t border-zinc-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-zinc-500 text-sm">
          <p>&copy; 2026 EcoRoute AI. Created by <strong>Mohammed Salahuldeen</strong>.</p>
        </div>
      </footer>
    </main>
  );
}
