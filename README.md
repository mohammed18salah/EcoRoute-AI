# 🌿 EcoRoute AI
> **Smart Navigation for a Greener Future.**  
> *Built for Hack-Earth 2026*

![EcoRoute AI Banner](https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop)

EcoRoute AI is an intelligent navigation assistant that empowers drivers to reduce their carbon footprint. By analyzing route efficiency, vehicle type, and traffic patterns, it helps you choose the most compliant path—saving fuel and the planet.

---

## 🚀 Key Features

### 🌱 **Smart Eco-Routing**
Compare routes not just by time, but by **environmental impact**. The "Eco Pick" highlights the path with the lowest CO₂ emissions.

### 🚗 **Vehicle Specific Analysis** (NEW)
Customize calculations based on your vehicle:
- **EV (Electric)**: Optimized for range and regenerative efficiency.
- **Hybrid**: Balanced mixed-cycle routing.
- **Gas/Diesel/SUV**: Traditional emission factors based on EEA standards.

### 🗺️ **3-Path Diversity System**
Our advanced algorithm generates three distinct geographic alternatives for every trip, ensuring you have real choices:
1.  **Eco-Friendly**: The greenest path.
2.  **Balanced**: A mix of speed and efficiency.
3.  **Fastest**: Pure speed, regardless of emissions.

### 📍 **Seamless Navigation**
Found your perfect route? Click **"Start Navigation"** to instantly open the path in Google Maps and hit the road.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + Custom ID Components
- **Mapping**: Leaflet.js
- **Routing Engine**: OpenRouteService API
- **Logic**: Custom emissions algorithm based on European Environment Agency (EEA) factors.

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- [OpenRouteService API Key](https://openrouteservice.org/) (Free)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mohammed18salah/EcoRoute-AI.git
   cd EcoRoute-AI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env.local` file:
   ```env
   # Get your key from OpenRouteService
   ORS_API_KEY=your_api_key_here
   ```

4. **Run Locally**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`

---

## 🎥 Demo Highlights

1. **Select Vehicle**: Choose between **SUV**, **Sedan**, or **EV** to see how emissions change drastically.
2. **Search**: Enter cities (e.g., *Baghdad* to *Ramadi*) or use the **Random Global Demo** button.
3. **Compare**: View the "Savings Badge" showing % CO₂ reduction.
4. **Navigate**: One-click integration with Google Maps.

---

## 🤝 Contributing

Contributions are welcome! Please fork the repo and submit a PR.

## 📄 License

MIT License © 2026 Mohammed Salahuldeen

