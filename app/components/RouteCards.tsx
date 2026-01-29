"use client";

import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { RouteResult } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Leaf, Clock, Car, Trophy } from "lucide-react";

interface RouteCardsProps {
    routes: RouteResult[];
    selectedRouteId: string | null;
    onSelect: (id: string) => void;
}

export function RouteCards({ routes, selectedRouteId, onSelect }: RouteCardsProps) {
    return (
        <div className="space-y-4">
            {routes.map((route) => (
                <Card
                    key={route.id}
                    onClick={() => onSelect(route.id)}
                    className={cn(
                        "cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg border-2",
                        selectedRouteId === route.id
                            ? "border-emerald-500 shadow-emerald-100 bg-emerald-50/30"
                            : "border-transparent hover:border-zinc-200"
                    )}
                >
                    <CardContent className="p-5 flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                            <div className="flex gap-2 items-center">
                                {route.isEcofriendly && <Badge className="bg-emerald-500 hover:bg-emerald-600"><Leaf className="w-3 h-3 mr-1" /> Best Choice</Badge>}
                                {route.label && !route.isEcofriendly && <Badge variant="secondary" className="text-zinc-600">{route.label}</Badge>}
                            </div>
                            {route.savingsPercent > 0 && (
                                <span className="text-emerald-700 font-bold text-sm bg-emerald-100 px-2 py-1 rounded-full flex items-center">
                                    <Trophy className="w-3 h-3 mr-1" /> Saves {route.savingsPercent}% CO₂
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center py-2">
                            <div className="flex flex-col items-center p-2 bg-zinc-50 rounded-lg">
                                <Car className="w-4 h-4 text-zinc-400 mb-1" />
                                <span className="text-sm font-semibold">{route.distanceKm} km</span>
                                <span className="text-[10px] text-zinc-500 uppercase">Distance</span>
                            </div>
                            <div className="flex flex-col items-center p-2 bg-zinc-50 rounded-lg">
                                <Clock className="w-4 h-4 text-zinc-400 mb-1" />
                                <span className="text-sm font-semibold">{route.durationMin} min</span>
                                <span className="text-[10px] text-zinc-500 uppercase">Duration</span>
                            </div>
                            <div className={cn("flex flex-col items-center p-2 rounded-lg", route.isEcofriendly ? "bg-emerald-100 text-emerald-800" : "bg-red-50 text-red-800")}>
                                <Leaf className="w-4 h-4 mb-1" />
                                <span className="text-sm font-bold">{route.emissionsKg} kg</span>
                                <span className="text-[10px] opacity-70 uppercase">CO₂ Est.</span>
                            </div>
                        </div>

                        {route.description && (
                            <p className="text-xs text-center text-zinc-500 font-medium italic">
                                "{route.description}"
                            </p>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
