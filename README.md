# EcoRoute AI 🌿🚗
> **Sustainable Solutions Powered by AI (Hack-Earth 2026)**

EcoRoute AI is a smart navigation assistant that calculates and visualizes the carbon footprint of different route options. It empowers drivers to make eco-friendly decisions by prioritizing low-emission routes over slightly faster but more polluting ones.

![EcoRoute AI Banner](https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop)

## 🌍 The Problem
Transportation accounts for nearly 24% of global CO₂ emissions. Traditional GPS apps (Google Maps, Waze) optimize almost exclusively for *time*, often routing drivers through high-speed, high-consumption highways or stop-and-go congestion that drastically reduces fuel efficiency.

## 💡 The Solution
EcoRoute AI introduces a "Green Routing" algorithm that considers:
1. **Distance vs. Speed**: analyzing the trade-off between highway speeds (higher drag) and shorter, moderate-speed routes.
2. **Congestion penalty**: comparing estimated durations against theoretical free-flow times to detect idling/traffic.
3. **CO₂ Estimator**: providing a transparent kg CO₂ metric for every trip.

## 🛠️ Tech Stack
- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui (custom implementation)
- **Maps**: Leaflet (OpenStreetMap)
- **Routing Engine**: OpenRouteService API (for alternatives & geometry)
- **Geocoding**: Nominatim (OSM) server-side handler

## 🚀 How to Run Locally

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/ecoroute-ai.git
   cd ecoroute-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   - Create a `.env.local` file in the root.
   - Add your [OpenRouteService API Key](https://openrouteservice.org/):
   ```env
   ORS_API_KEY=your_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🎥 Demo Script (For Video)
1. **Intro**: "Hi, this is [Name] for Hack-Earth. We built EcoRoute AI to make sustainable driving the default choice."
2. **Problem**: "We all use GPS, but it always picks the *fastest* route, even if it burns 20% more fuel."
3. **Demo**: 
   - Click "Demo" button.
   - Show the 3 cards.
   - Point to the green badge: "See? This route takes only 2 mins longer but saves 1.2kg of CO₂."
   - Click the map lines to show interactive selection.
4. **Impact**: "If 10% of drivers chose the green route daily, we could reduce emissions by tons annually."

## 📄 License
MIT
