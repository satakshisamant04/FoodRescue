import React from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  Truck, 
  CheckCircle2, 
  Building2, 
  Utensils, 
  Download, 
  ShieldCheck, 
  Phone,
  FileCheck,
  Calendar,
  Share2
} from 'lucide-react';
import { FoodDonation } from '../../types';

interface RescueTrackingModalProps {
  donation: FoodDonation | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RescueTrackingModal: React.FC<RescueTrackingModalProps> = ({
  donation,
  isOpen,
  onClose
}) => {
  if (!isOpen || !donation) return null;

  const isCompleted = donation.status === 'completed';
  const isInTransit = donation.status === 'in_transit';
  const isClaimed = donation.status === 'claimed' || isInTransit || isCompleted;
  const isAvailable = true;

  const steps = [
    {
      title: 'Food Surplus Listed',
      subtitle: `${donation.donorName} (${donation.donorType})`,
      time: donation.createdAt || 'Initial Listing',
      detail: `${donation.servings} portions • ${donation.weightKg} kg • ${donation.address}, ${donation.city}`,
      status: 'done',
      icon: Building2,
      activeColor: 'bg-emerald-500 text-white'
    },
    {
      title: 'Claimed by Shelter & Verified',
      subtitle: donation.claimedByNGO?.name || 'Awaiting Shelter Claim',
      time: donation.claimedByNGO?.claimedAt || (isClaimed ? 'Claimed' : 'Pending'),
      detail: donation.claimedByNGO ? `Contact: ${donation.claimedByNGO.contact} • Address: ${donation.claimedByNGO.address}` : 'Listed on live rescue marketplace for shelter allocation',
      status: isClaimed ? 'done' : 'pending',
      icon: Utensils,
      activeColor: 'bg-blue-500 text-white'
    },
    {
      title: 'Dispatched & In Transit',
      subtitle: donation.assignedVolunteer?.name ? `Driver: ${donation.assignedVolunteer.name}` : (isClaimed ? 'Driver being dispatched' : 'Pending'),
      time: donation.dispatchedAt || (isInTransit || isCompleted ? 'Dispatched' : 'Pending'),
      detail: donation.assignedVolunteer ? `Vehicle: ${donation.assignedVolunteer.vehicle} • Contact: ${donation.assignedVolunteer.phone}` : 'Thermal cold-chain vehicle allocation in progress',
      status: (isInTransit || isCompleted) ? 'done' : isClaimed ? 'current' : 'pending',
      icon: Truck,
      activeColor: 'bg-amber-500 text-white'
    },
    {
      title: 'Delivered & Distributed',
      subtitle: isCompleted ? (donation.claimedByNGO?.name || 'Shelter Facility') : 'Final Handover',
      time: donation.deliveredAt || (isCompleted ? 'Delivered' : 'Estimated 20-35 mins'),
      detail: isCompleted ? 'Handed over safely with temperature inspection & food safety sign-off' : 'Shelter meal serving to underprivileged children and families',
      status: isCompleted ? 'done' : 'pending',
      icon: CheckCircle2,
      activeColor: 'bg-emerald-600 text-white'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/70 dark:bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-2xl bg-white dark:bg-[#111c30] rounded-3xl shadow-2xl border border-[#d3e4fe] dark:border-[#243452] overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0b1c30] to-[#1a2f4c] dark:from-[#09101d] dark:to-[#132038] text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
              donation.status === 'completed'
                ? 'bg-emerald-400 text-emerald-950'
                : donation.status === 'in_transit'
                ? 'bg-amber-400 text-amber-950 animate-pulse'
                : donation.status === 'claimed'
                ? 'bg-blue-400 text-blue-950'
                : 'bg-[#ffdad2] text-[#8c1900]'
            }`}>
              {donation.status === 'completed' ? '✓ Delivered & Preserved' : donation.status === 'in_transit' ? '🚚 In Transit / Dispatched' : donation.status === 'claimed' ? '📦 Claimed for Rescue' : '🟢 Surplus Available'}
            </span>
            <span className="text-xs text-[#d3e4fe] font-mono">
              ID #{donation.id.slice(-8).toUpperCase()}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">{donation.title}</h2>
          <p className="text-xs text-[#d3e4fe] mt-1">
            {donation.servings} Servings • {donation.weightKg} kg • {donation.vegNonVeg === 'pure_veg' ? 'Pure Vegetarian' : 'Non-Veg'} • {donation.city}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Key Rescue Metrics Summary */}
          <div className="grid grid-cols-3 gap-3 bg-[#eff4ff] dark:bg-[#182640] p-4 rounded-2xl border border-[#d3e4fe] dark:border-[#2b3e64] text-center">
            <div>
              <span className="text-[10px] uppercase font-extrabold text-[#565e74] dark:text-[#94a3b8] block">Portions</span>
              <span className="text-base sm:text-lg font-black text-[#ae3115] dark:text-[#ff7e62]">{donation.servings} Meals</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-extrabold text-[#565e74] dark:text-[#94a3b8] block">Food Weight</span>
              <span className="text-base sm:text-lg font-black text-emerald-700 dark:text-emerald-400">{donation.weightKg} kg</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-extrabold text-[#565e74] dark:text-[#94a3b8] block">CO₂ Avoided</span>
              <span className="text-base sm:text-lg font-black text-blue-700 dark:text-blue-400">{Math.round(donation.weightKg * 2.5)} kg</span>
            </div>
          </div>

          {/* Step-by-Step Historical Timeline */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#565e74] dark:text-[#94a3b8]">
              Preserved Rescue Journey & Timeline
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-[#d3e4fe] dark:before:bg-[#2b3e64]">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isDone = step.status === 'done';
                const isCurrent = step.status === 'current';

                return (
                  <div key={index} className="relative group">
                    {/* Circle Indicator */}
                    <div className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                      isDone
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-amber-500 border-amber-500 text-white animate-pulse'
                        : 'bg-white dark:bg-[#111c30] border-[#d3e4fe] dark:border-[#2b3e64] text-[#8e98af]'
                    }`}>
                      <Icon className="w-3 h-3" />
                    </div>

                    <div className={`p-4 rounded-2xl border transition-all ${
                      isDone
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40'
                        : isCurrent
                        ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-900/50'
                        : 'bg-[#f8f9ff] dark:bg-[#142036] border-[#e5eeff] dark:border-[#243452] opacity-70'
                    }`}>
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <h4 className="text-sm font-bold text-[#0b1c30] dark:text-white">{step.title}</h4>
                        <span className="text-[11px] font-semibold text-[#565e74] dark:text-[#94a3b8] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {step.time}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-[#ae3115] dark:text-[#ff7e62] mt-0.5">
                        {step.subtitle}
                      </div>
                      <p className="text-xs text-[#59413c] dark:text-[#cbd5e1] mt-1">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Location details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-[#eff4ff] dark:bg-[#16243d] border border-[#d3e4fe] dark:border-[#2b3e64] space-y-1">
              <div className="text-[10px] uppercase font-bold text-[#ae3115] dark:text-[#ff7e62] flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>Pickup Origin</span>
              </div>
              <div className="font-bold text-[#0b1c30] dark:text-white">{donation.donorName}</div>
              <div className="text-[#565e74] dark:text-[#94a3b8]">{donation.address}, {donation.city}</div>
              <div className="text-[#565e74] dark:text-[#94a3b8] pt-1">Contact: {donation.contactPhone}</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#eff4ff] dark:bg-[#16243d] border border-[#d3e4fe] dark:border-[#2b3e64] space-y-1">
              <div className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <Utensils className="w-3 h-3" />
                <span>Destination Shelter</span>
              </div>
              <div className="font-bold text-[#0b1c30] dark:text-white">{donation.claimedByNGO?.name || 'Assigned Shelter Community'}</div>
              <div className="text-[#565e74] dark:text-[#94a3b8]">{donation.claimedByNGO?.address || `${donation.city}`}</div>
              <div className="text-[#565e74] dark:text-[#94a3b8] pt-1">Contact: {donation.claimedByNGO?.contact || 'Rescue Coordinator'}</div>
            </div>
          </div>

          {/* Good Samaritan & Verification Seal */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <div className="font-bold text-emerald-900 dark:text-emerald-200">
                Verified Food Safety & Good Samaritan Protected
              </div>
              <div className="text-emerald-800 dark:text-emerald-300/80 text-[11px]">
                This rescued batch complies with national food safety guidelines and Section 80G tax valuation provisions.
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#f8f9ff] dark:bg-[#0c1424] border-t border-[#e5eeff] dark:border-[#243452] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-[#565e74] dark:text-[#94a3b8]">
            Status: <span className="font-bold capitalize text-[#0b1c30] dark:text-white">{donation.status.replace('_', ' ')}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const text = `Food Rescue Batch: ${donation.title} (${donation.servings} meals) - Status: ${donation.status}`;
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(text);
                  alert('Rescue batch details copied to clipboard!');
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#182640] border border-[#d3e4fe] dark:border-[#2b3e64] hover:bg-[#eff4ff] dark:hover:bg-[#203050] text-xs font-bold text-[#0b1c30] dark:text-white flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 bg-[#0b1c30] dark:bg-[#1e2f4d] hover:bg-[#1a2f4c] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
