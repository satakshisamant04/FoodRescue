import React from 'react';
import { 
  Utensils, 
  Truck, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Building2, 
  Users, 
  Clock, 
  IndianRupee, 
  MapPin, 
  Leaf,
  LogIn
} from 'lucide-react';
import { PlatformStats, UserRole } from '../types';

interface LandingPageProps {
  stats: PlatformStats;
  isLoggedIn?: boolean;
  onSelectRole: (role: UserRole) => void;
  onOpenAuth: (tab?: 'login' | 'register', role?: UserRole) => void;
  onOpenDonate: () => void;
  onExploreMap: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  stats,
  isLoggedIn = false,
  onSelectRole,
  onOpenAuth,
  onOpenDonate,
  onExploreMap
}) => {
  return (
    <div className="w-full bg-[#f8f9ff] dark:bg-[#080e1a] transition-colors">
      {/* 1. Minimal Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 md:pt-12 md:pb-16 border-b border-[#e5eeff] dark:border-[#243452]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Heading & Concise Pitch */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffdad2] dark:bg-[#ae3115]/30 text-[#8c1900] dark:text-[#ffb4a3] text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 fill-current text-[#ae3115] dark:text-[#ff7e62]" />
                <span>Odisha Pilot • FSSAI Food Safety Standards</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0b1c30] dark:text-white tracking-tight leading-tight">
                Connect surplus food to <span className="text-[#ae3115] dark:text-[#ff7e62]">local shelters</span> in minutes.
              </h1>

              <p className="text-sm sm:text-base text-[#59413c] dark:text-[#cbd5e1] leading-relaxed max-w-xl">
                A minimal, real-time platform connecting caterers and restaurants with verified NGOs and volunteer drivers in Bhubaneswar, Cuttack, and nearby cities.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {!isLoggedIn ? (
                  <>
                    <button
                      onClick={() => onOpenAuth('register')}
                      className="px-5 py-3 rounded-xl bg-[#ff6b4a] hover:bg-[#ae3115] text-white text-xs font-bold shadow-md shadow-[#ae3115]/20 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>Join as Partner or Volunteer</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onOpenAuth('login')}
                      className="px-4 py-3 rounded-xl bg-white dark:bg-[#111c30] hover:bg-[#eff4ff] dark:hover:bg-[#1c2d49] text-[#0b1c30] dark:text-white border border-[#d3e4fe] dark:border-[#2b3e64] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <LogIn className="w-4 h-4 text-[#ae3115] dark:text-[#ff7e62]" />
                      <span>Sign In</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => onSelectRole('donor')}
                    className="px-5 py-3 rounded-xl bg-[#ff6b4a] hover:bg-[#ae3115] text-white text-xs font-bold shadow-md shadow-[#ae3115]/20 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Go to My Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={onOpenDonate}
                  className="px-4 py-3 rounded-xl bg-white dark:bg-[#111c30] hover:bg-[#eff4ff] dark:hover:bg-[#1c2d49] text-[#ae3115] dark:text-[#ff7e62] border border-[#ffdad2] dark:border-[#2b3e64] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <IndianRupee className="w-4 h-4" />
                  <span>Sponsor Fuel (₹10 = 1 Meal)</span>
                </button>

                <button
                  onClick={onExploreMap}
                  className="px-3.5 py-3 rounded-xl text-xs font-semibold text-[#565e74] dark:text-[#94a3b8] hover:text-[#0b1c30] dark:hover:text-white hover:bg-[#eff4ff] dark:hover:bg-[#16243d] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-[#ae3115] dark:text-[#ff7e62]" />
                  <span>Live Map</span>
                </button>
              </div>

              {/* Badges */}
              <div className="pt-3 border-t border-[#e5eeff] dark:border-[#243452] flex flex-wrap items-center gap-4 text-xs text-[#565e74] dark:text-[#94a3b8]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Good Samaritan Protected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>Fast Delivery</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto rounded-2xl overflow-hidden shadow-lg border-2 border-white dark:border-[#243452]">
                <img
                  src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=700&q=80"
                  alt="Food Rescue Distribution"
                  className="w-full h-64 sm:h-72 object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1c30]/90 via-[#0b1c30]/30 to-transparent flex flex-col justify-end p-5 text-white">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">Live Pilot Hub</span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug">
                    {stats.totalMealsRescued}+ meals delivered across Bhubaneswar & Cuttack.
                  </h3>
                  <p className="text-xs text-[#d3e4fe] mt-0.5">
                    Real-time community food distribution.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Realistic Minimal Stats Bar */}
      <section className="bg-white dark:bg-[#0c1424] py-6 border-b border-[#e5eeff] dark:border-[#243452] transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            
            <div className="p-3.5 rounded-xl bg-[#f8f9ff] dark:bg-[#111c30] border border-[#d3e4fe] dark:border-[#243452] transition-colors">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#ae3115] dark:text-[#ff7e62]">
                {stats.totalMealsRescued}+
              </div>
              <div className="text-[11px] font-semibold text-[#565e74] dark:text-[#94a3b8] mt-0.5 flex items-center justify-center gap-1">
                <Utensils className="w-3 h-3 text-[#ae3115] dark:text-[#ff7e62]" />
                <span>Meals Delivered</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#f8f9ff] dark:bg-[#111c30] border border-[#d3e4fe] dark:border-[#243452] transition-colors">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30] dark:text-white">
                ₹{stats.totalRupeesDonated.toLocaleString()}
              </div>
              <div className="text-[11px] font-semibold text-[#565e74] dark:text-[#94a3b8] mt-0.5 flex items-center justify-center gap-1">
                <IndianRupee className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Fuel Fund Raised</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#f8f9ff] dark:bg-[#111c30] border border-[#d3e4fe] dark:border-[#243452] transition-colors">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-400">
                {stats.totalKgSaved} kg
              </div>
              <div className="text-[11px] font-semibold text-[#565e74] dark:text-[#94a3b8] mt-0.5 flex items-center justify-center gap-1">
                <Leaf className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Food Saved</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#f8f9ff] dark:bg-[#111c30] border border-[#d3e4fe] dark:border-[#243452] transition-colors">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30] dark:text-white">
                {stats.activeVolunteers + stats.verifiedNGOs}
              </div>
              <div className="text-[11px] font-semibold text-[#565e74] dark:text-[#94a3b8] mt-0.5 flex items-center justify-center gap-1">
                <Users className="w-3 h-3 text-[#ae3115] dark:text-[#ff7e62]" />
                <span>NGOs & Volunteers</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Three Dedicated Portals */}
      <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl font-extrabold text-[#0b1c30] dark:text-white">
            Choose Your Role
          </h2>
          <p className="text-xs text-[#59413c] dark:text-[#cbd5e1] mt-1">
            Sign in or register to access your dedicated workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: Donor */}
          <div className="bg-white dark:bg-[#111c30] rounded-2xl p-5 shadow-xs border border-[#d3e4fe] dark:border-[#243452] flex flex-col justify-between hover:border-[#ae3115]/50 transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#ffdad2] dark:bg-[#ae3115]/30 flex items-center justify-center text-[#ae3115] dark:text-[#ff7e62]">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0b1c30] dark:text-white">Food Donors</h3>
              <p className="text-xs text-[#59413c] dark:text-[#cbd5e1] leading-relaxed">
                Restaurants and caterers post excess fresh food with photo, portion count, and pickup window.
              </p>
            </div>
            <div className="pt-5">
              <button
                onClick={() => onSelectRole('donor')}
                className="w-full py-2.5 rounded-xl bg-[#eff4ff] dark:bg-[#16243d] hover:bg-[#ffdad2] text-[#0b1c30] dark:text-white hover:text-[#8c1900] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{isLoggedIn ? 'Open Donor Portal' : 'Access as Donor'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: NGO */}
          <div className="bg-white dark:bg-[#111c30] rounded-2xl p-5 shadow-xs border-2 border-[#ae3115]/30 dark:border-[#ae3115]/50 flex flex-col justify-between hover:border-[#ae3115] transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#ffdad2] dark:bg-[#ae3115]/30 flex items-center justify-center text-[#ae3115] dark:text-[#ff7e62]">
                <Utensils className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0b1c30] dark:text-white">NGOs & Shelters</h3>
              <p className="text-xs text-[#59413c] dark:text-[#cbd5e1] leading-relaxed">
                Verified shelters claim available food batches or broadcast emergency food requirements.
              </p>
            </div>
            <div className="pt-5">
              <button
                onClick={() => onSelectRole('ngo')}
                className="w-full py-2.5 rounded-xl bg-[#ff6b4a] hover:bg-[#ae3115] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>{isLoggedIn ? 'Open NGO Board' : 'Access as NGO'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Volunteer */}
          <div className="bg-white dark:bg-[#111c30] rounded-2xl p-5 shadow-xs border border-[#d3e4fe] dark:border-[#243452] flex flex-col justify-between hover:border-[#ae3115]/50 transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#ffdad2] dark:bg-[#ae3115]/30 flex items-center justify-center text-[#ae3115] dark:text-[#ff7e62]">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0b1c30] dark:text-white">Volunteers</h3>
              <p className="text-xs text-[#59413c] dark:text-[#cbd5e1] leading-relaxed">
                Drivers and riders pick up surplus batches and deliver them safely to nearby shelter homes.
              </p>
            </div>
            <div className="pt-5">
              <button
                onClick={() => onSelectRole('volunteer')}
                className="w-full py-2.5 rounded-xl bg-[#eff4ff] dark:bg-[#16243d] hover:bg-[#ffdad2] text-[#0b1c30] dark:text-white hover:text-[#8c1900] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{isLoggedIn ? 'Open Volunteer Portal' : 'Access as Volunteer'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Minimal How It Works */}
      <section className="bg-[#eff4ff]/60 dark:bg-[#0c1424] py-10 border-y border-[#d3e4fe] dark:border-[#243452] transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-xl font-extrabold text-[#0b1c30] dark:text-white">How the Live Flow Works</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-white dark:bg-[#111c30] p-4 rounded-xl border border-[#d3e4fe] dark:border-[#243452] transition-colors">
              <div className="w-7 h-7 rounded-full bg-[#ae3115] text-white flex items-center justify-center font-bold text-xs mx-auto mb-2">
                1
              </div>
              <h4 className="font-bold text-xs text-[#0b1c30] dark:text-white">Donor Adds Food</h4>
              <p className="text-[11px] text-[#59413c] dark:text-[#cbd5e1] mt-1">
                Post surplus meals with quantity, city, and pickup time.
              </p>
            </div>

            <div className="bg-white dark:bg-[#111c30] p-4 rounded-xl border border-[#d3e4fe] dark:border-[#243452] transition-colors">
              <div className="w-7 h-7 rounded-full bg-[#ae3115] text-white flex items-center justify-center font-bold text-xs mx-auto mb-2">
                2
              </div>
              <h4 className="font-bold text-xs text-[#0b1c30] dark:text-white">NGO Claims Food</h4>
              <p className="text-[11px] text-[#59413c] dark:text-[#cbd5e1] mt-1">
                Shelter claims the food for distribution.
              </p>
            </div>

            <div className="bg-white dark:bg-[#111c30] p-4 rounded-xl border border-[#d3e4fe] dark:border-[#243452] transition-colors">
              <div className="w-7 h-7 rounded-full bg-[#ae3115] text-white flex items-center justify-center font-bold text-xs mx-auto mb-2">
                3
              </div>
              <h4 className="font-bold text-xs text-[#0b1c30] dark:text-white">Volunteer Delivers</h4>
              <p className="text-[11px] text-[#59413c] dark:text-[#cbd5e1] mt-1">
                Volunteer accepts mission, picks up food, and marks delivered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Minimal Fuel Sponsorship */}
      <section className="py-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#0b1c30] to-[#1a2f4c] dark:from-[#080e18] dark:to-[#14233a] rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-6 border border-white/10">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl font-bold text-white">
              Support Local Rescue Runs
            </h3>
            <p className="text-xs text-[#d3e4fe] max-w-lg">
              Every ₹10 sponsors transport and crate fuel for 1 wholesome rescued meal in Odisha.
            </p>
          </div>

          <button
            onClick={onOpenDonate}
            className="px-6 py-3 bg-[#ff6b4a] hover:bg-[#ae3115] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <IndianRupee className="w-4 h-4" />
            <span>Sponsor Fuel (₹10 = 1 Meal)</span>
          </button>
        </div>
      </section>

    </div>
  );
};
