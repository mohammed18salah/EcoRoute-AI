"use client";

import { Leaf, Info, Github, ExternalLink, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";

export function AboutSection() {
    return (
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-zinc-100 mb-12">
            <h2 className="text-2xl font-bold text-zinc-800 mb-6 flex items-center">
                <Info className="w-6 h-6 mr-2 text-emerald-600" /> About EcoRoute AI
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-lg font-semibold text-zinc-900 mb-2">The Problem</h3>
                    <p className="text-zinc-600 leading-relaxed mb-4">
                        Transport accounts for ~24% of global CO₂ emissions. Most navigation apps prioritize speed, often routing drivers through congestion or longer distances that burn more fuel.
                    </p>

                    <h3 className="text-lg font-semibold text-zinc-900 mb-2">Our Solution</h3>
                    <p className="text-zinc-600 leading-relaxed">
                        EcoRoute AI calculates the carbon footprint of multiple route options. By analyzing distance, duration, and traffic congestion patterns, we identify the standard "fastest" route versus the "greenest" route, empowering users to reduce their impact.
                    </p>
                </div>

                <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
                    <h3 className="text-lg font-semibold text-emerald-900 mb-4 flex items-center">
                        <Leaf className="w-5 h-5 mr-2" /> How it Works
                    </h3>
                    <ol className="space-y-3 text-emerald-800 text-sm">
                        <li className="flex gap-2">
                            <span className="font-bold bg-emerald-200 w-6 h-6 flex items-center justify-center rounded-full text-xs shrink-0">1</span>
                            <span>We fetch route alternatives using <strong>OpenRouteService</strong>.</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold bg-emerald-200 w-6 h-6 flex items-center justify-center rounded-full text-xs shrink-0">2</span>
                            <span>Our algorithm estimates fuel consumption based on distance and traffic factors.</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold bg-emerald-200 w-6 h-6 flex items-center justify-center rounded-full text-xs shrink-0">3</span>
                            <span>We rank routes by CO₂ emissions and highlight the greenest choice.</span>
                        </li>
                    </ol>

                    <div className="mt-6 pt-6 border-t border-emerald-200/50 flex gap-4">
                        <Button
                            variant="outline"
                            className="w-full text-emerald-700 border-emerald-200 hover:bg-emerald-100 bg-transparent"
                            onClick={() => window.open('https://github.com/mohammed18salah/EcoRoute-AI', '_blank')}
                        >
                            <Github className="w-4 h-4 mr-2" /> View Code
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
