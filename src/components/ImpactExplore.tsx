import React, { useState } from 'react';
import { 
  MapPin, 
  Utensils, 
  Leaf, 
  IndianRupee, 
  Activity, 
  CheckCircle2, 
  Heart, 
  Sparkles, 
  TrendingUp,
  Building2,
  Users,
  Compass
} from 'lucide-react';
import { FoodDonation, ActivityItem, UserRole } from '../types';

interface ImpactExploreProps {
  donations: FoodDonation[];
  activities: ActivityItem[];
  totalMealsRescued: number;
  onOpenDonateFunds: () => void;
  onSelectRole: (role: UserRole) => void;
}

const CITY_HUBS = [
  { name: 'Bhubaneswar', activeRescues: 2, mealsRescued: '20+', pin: { top: '54%', left: '72%' } },
  { name: 'Cuttack', activeRescues: 1, mealsRescued: '15+', pin: { top: '50%', left: '74%' } },
  { name: 'Rourkela', activeRescues: 0, mealsRescued: 'Pilot', pin: { top: '44%', left: '68%' } },
  { name: 'Puri', activeRescues: 0, mealsRescued: 'Pilot', pin: { top: '60%', left: '75%' } },
];

export const ImpactExplore: React.FC<ImpactExploreProps> = ({
  activities,
  totalMealsRescued,
  onOpenDonateFunds,
}) => {
  const [selectedCity, setSelectedCity] = useState('Bhubaneswar');

  const totalKg = Math.round(totalMealsRescued * 0.25);
  const totalCo2 = Math.round(totalKg * 2.5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdad2] dark:bg-[#ae3115]/30 text-[#8c1900] dark:text-[#ffb4a3] text-xs font-bold">
          <Compass className="w-3.5 h-3.5" />
          <span>Real-time National Operations</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#0b1c30] dark:text-white">
          Live Food Rescue & Impact Matrix
        </h1>
        <p className="text-xs sm:text-sm text-[#59413c] dark:text-[#cbd5e1]">
          Transparent, live operational monitoring of surplus redistribution across Indian metropolitan corridors.
        </p>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#111c30] p-5 rounded-2xl border border-[#d3e4fe] dark:border-[#243452] shadow-xs text-center transition-colors">
          <Utensils className="w-5 h-5 text-[#ae3115] dark:text-[#ff7e62] mx-auto mb-1" />
          <div className="text-2xl sm:text-3xl font-black text-[#ae3115] dark:text-[#ff7e62]">
            {totalMealsRescued.toLocaleString()}
          </div>
          <div className="text-xs text-[#565e74] dark:text-[#94a3b8] mt-1 font-semibold">Wholesome Meals Delivered</div>
        </div>

        <div className="bg-white dark:bg-[#111c30] p-5 rounded-2xl border border-[#d3e4fe] dark:border-[#243452] shadow-xs text-center transition-colors">
          <Leaf className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400">
            {totalKg.toLocaleString()} kg
          </div>
          <div className="text-xs text-[#565e74] dark:text-[#94a3b8] mt-1 font-semibold">Food Waste Avoided</div>
        </div>

        <div className="bg-white dark:bg-[#111c30] p-5 rounded-2xl border border-[#d3e4fe] dark:border-[#243452] shadow-xs text-center transition-colors">
          <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400">
            {totalCo2.toLocaleString()} kg
          </div>
          <div className="text-xs text-[#565e74] dark:text-[#94a3b8] mt-1 font-semibold">CO₂ Emissions Abated</div>
        </div>

        <div className="bg-white dark:bg-[#111c30] p-5 rounded-2xl border border-[#d3e4fe] dark:border-[#243452] shadow-xs text-center transition-colors">
          <IndianRupee className="w-5 h-5 text-[#0b1c30] dark:text-white mx-auto mb-1" />
          <div className="text-2xl sm:text-3xl font-black text-[#0b1c30] dark:text-white">
            ₹{(totalMealsRescued * 35).toLocaleString()}
          </div>
          <div className="text-xs text-[#565e74] dark:text-[#94a3b8] mt-1 font-semibold">Economic Value Preserved</div>
        </div>
      </div>

      {/* Interactive Hub Grid & Map Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Map visual container */}
        <div className="lg:col-span-7 bg-white dark:bg-[#111c30] rounded-3xl p-6 border border-[#d3e4fe] dark:border-[#243452] shadow-xs space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#0b1c30] dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#ae3115] dark:text-[#ff7e62]" />
              <span>Active City Rescue Corridors</span>
            </h3>
            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Live Telemetry
            </span>
          </div>

          {/* Interactive City Hub Selector */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {CITY_HUBS.map(city => (
              <button
                key={city.name}
                onClick={() => setSelectedCity(city.name)}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                  selectedCity === city.name
                    ? 'bg-[#ae3115] text-white border-[#ae3115] shadow-xs'
                    : 'bg-[#eff4ff] dark:bg-[#16243d] text-[#565e74] dark:text-[#94a3b8] border-[#d3e4fe] dark:border-[#2b3e64] hover:bg-[#d3e4fe] dark:hover:bg-[#223554]'
                }`}
              >
                <div>{city.name}</div>
                <div className="text-[9px] opacity-80 mt-0.5">{city.activeRescues} active</div>
              </button>
            ))}
          </div>

          {/* City spotlight card */}
          <div className="relative rounded-2xl bg-gradient-to-br from-[#0b1c30] to-[#1e3046] dark:from-[#080f1a] dark:to-[#17253b] text-white p-6 overflow-hidden min-h-[260px] flex flex-col justify-between border border-white/10">
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#ffdad2]">
                  Selected Operational Zone
                </span>
                <h4 className="text-2xl font-black text-white mt-0.5">{selectedCity} Corridor</h4>
              </div>
              <div className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-emerald-300">
                Dispatch Speed ~ 19 mins
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-3 gap-3 bg-white/10 p-4 rounded-xl text-center text-xs">
              <div>
                <span className="text-[#d3e4fe] block text-[10px]">Active Hot Batches</span>
                <span className="font-extrabold text-base text-[#ffb4a3]">
                  {CITY_HUBS.find(c => c.name === selectedCity)?.activeRescues} Runs
                </span>
              </div>
              <div>
                <span className="text-[#d3e4fe] block text-[10px]">Total City Rescues</span>
                <span className="font-extrabold text-base text-white">
                  {CITY_HUBS.find(c => c.name === selectedCity)?.mealsRescued}
                </span>
              </div>
              <div>
                <span className="text-[#d3e4fe] block text-[10px]">Cold-Chain Rating</span>
                <span className="font-extrabold text-base text-emerald-400">99.4% Safe</span>
              </div>
            </div>

            <div className="relative z-10 flex justify-between items-center text-[11px] text-[#d3e4fe]">
              <span>Partnered Banquets & Cloud Kitchens: 140+</span>
              <button
                onClick={onOpenDonateFunds}
                className="font-bold text-[#ffdad2] hover:underline cursor-pointer"
              >
                Sponsor {selectedCity} Routes →
              </button>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Live Activity Feed */}
        <div className="lg:col-span-5 bg-white dark:bg-[#111c30] rounded-3xl p-6 border border-[#d3e4fe] dark:border-[#243452] shadow-xs space-y-4 flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff] dark:border-[#243452]">
              <h3 className="text-base font-bold text-[#0b1c30] dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#ae3115] dark:text-[#ff7e62]" />
                <span>Live Activity Stream</span>
              </h3>
              <span className="text-[10px] font-bold uppercase text-[#565e74] dark:text-[#94a3b8] bg-[#eff4ff] dark:bg-[#16243d] px-2 py-0.5 rounded-full">
                Real-Time
              </span>
            </div>

            <div className="space-y-3 pt-3 max-h-[380px] overflow-y-auto pr-1">
              {activities.map(act => (
                <div key={act.id} className="p-3 bg-[#eff4ff] dark:bg-[#16243d] rounded-xl border border-[#d3e4fe] dark:border-[#2b3e64] space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold uppercase text-[#ae3115] dark:text-[#ff7e62]">{act.location}</span>
                    <span className="text-[#565e74] dark:text-[#94a3b8]">{act.timestamp}</span>
                  </div>
                  <p className="text-xs font-semibold text-[#0b1c30] dark:text-white leading-snug">{act.message}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#e5eeff] dark:border-[#243452]">
            <button
              onClick={onOpenDonateFunds}
              className="w-full py-3 bg-[#ff6b4a] hover:bg-[#ae3115] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <IndianRupee className="w-4 h-4" />
              <span>Sponsor Fuel & Crates in INR</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
