import React, { useState } from 'react';
import { 
  PlusCircle, 
  Building2, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Truck, 
  FileText, 
  Download, 
  ShieldCheck, 
  IndianRupee,
  Leaf,
  Utensils,
  History,
  Navigation,
  Eye
} from 'lucide-react';
import { FoodDonation, UserProfile } from '../types';
import { RescueTrackingModal } from './Modals/RescueTrackingModal';

interface DonorPortalProps {
  user: UserProfile;
  donations: FoodDonation[];
  onOpenNewDonation: () => void;
}

export const DonorPortal: React.FC<DonorPortalProps> = ({
  user,
  donations,
  onOpenNewDonation,
}) => {
  const [selectedReceiptDonation, setSelectedReceiptDonation] = useState<FoodDonation | null>(null);
  const [selectedTrackingDonation, setSelectedTrackingDonation] = useState<FoodDonation | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  // Filter donor's listings
  const myDonations = donations.filter(d => 
    d.donorId === user.id || 
    d.donorName === user.organization || 
    d.donorName === user.name
  );
  const activeListings = myDonations.filter(d => d.status !== 'completed');
  const pastListings = myDonations.filter(d => d.status === 'completed');

  const totalMeals = myDonations.reduce((acc, curr) => acc + curr.servings, user.stats.mealsCount || 0);
  const totalKg = myDonations.reduce((acc, curr) => acc + curr.weightKg, Math.round((user.stats.mealsCount || 0) * 0.25));
  // Tax calculation: ~ ₹35 estimated value per meal portion
  const totalTaxValue = totalMeals * 35;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header & Quick Action */}
      <div className="bg-white dark:bg-[#111c30] rounded-3xl p-6 sm:p-8 border border-[#d3e4fe] dark:border-[#243452] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-colors">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdad2] dark:bg-[#ae3115]/30 text-[#8c1900] dark:text-[#ffb4a3] text-xs font-bold">
            <Building2 className="w-3.5 h-3.5" />
            <span>Commercial Food Donor Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0b1c30] dark:text-white">
            {user.organization || user.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#59413c] dark:text-[#cbd5e1]">
            {user.address ? `${user.address}, ` : ''}{user.city || 'Bhubaneswar (Odisha)'} • FSSAI ID: {user.fssaiNumber || '12022001000341'}
          </p>
        </div>

        <button
          onClick={onOpenNewDonation}
          className="px-6 py-3.5 bg-[#ff6b4a] hover:bg-[#ae3115] text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-md shadow-[#ae3115]/20 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Post Surplus Food Now</span>
        </button>
      </div>

      {/* Impact Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-[#111c30] p-5 rounded-2xl border border-[#d3e4fe] dark:border-[#243452] shadow-xs transition-colors">
          <div className="text-xs text-[#565e74] dark:text-[#94a3b8] font-semibold flex items-center gap-1.5">
            <Utensils className="w-4 h-4 text-[#ae3115] dark:text-[#ff7e62]" />
            <span>Meals Provided</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#ae3115] dark:text-[#ff7e62] mt-2">
            {totalMeals.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#59413c] dark:text-[#94a3b8] mt-1">Zero hunger milestone</div>
        </div>

        <div className="bg-white dark:bg-[#111c30] p-5 rounded-2xl border border-[#d3e4fe] dark:border-[#243452] shadow-xs transition-colors">
          <div className="text-xs text-[#565e74] dark:text-[#94a3b8] font-semibold flex items-center gap-1.5">
            <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Food Saved (Kg)</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-2">
            {totalKg.toLocaleString()} kg
          </div>
          <div className="text-[11px] text-[#59413c] dark:text-[#94a3b8] mt-1">{Math.round(totalKg * 2.5).toLocaleString()} kg CO₂ avoided</div>
        </div>

        <div className="bg-white dark:bg-[#111c30] p-5 rounded-2xl border border-[#d3e4fe] dark:border-[#243452] shadow-xs transition-colors">
          <div className="text-xs text-[#565e74] dark:text-[#94a3b8] font-semibold flex items-center gap-1.5">
            <IndianRupee className="w-4 h-4 text-[#0b1c30] dark:text-[#cbd5e1]" />
            <span>80G Tax Valuation</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30] dark:text-white mt-2">
            ₹{totalTaxValue.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#59413c] dark:text-[#94a3b8] mt-1">Eligible tax deduction</div>
        </div>

        <div className="bg-white dark:bg-[#111c30] p-5 rounded-2xl border border-[#d3e4fe] dark:border-[#243452] shadow-xs transition-colors">
          <div className="text-xs text-[#565e74] dark:text-[#94a3b8] font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Compliance Status</span>
          </div>
          <div className="text-lg font-bold text-blue-800 dark:text-blue-300 mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Good Samaritan Protected</span>
          </div>
          <div className="text-[11px] text-[#59413c] dark:text-[#94a3b8] mt-1">100% liability protected</div>
        </div>
      </div>

      {/* Tabs for Active vs Preserved History */}
      <div className="flex items-center gap-2 border-b border-[#d3e4fe] dark:border-[#243452] pb-3">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'active'
              ? 'bg-[#0b1c30] dark:bg-white text-white dark:text-[#0b1c30] shadow-sm'
              : 'bg-[#eff4ff] dark:bg-[#16243d] text-[#565e74] dark:text-[#94a3b8] hover:bg-[#d3e4fe]/50'
          }`}
        >
          <Utensils className="w-3.5 h-3.5" />
          <span>Active Surplus Postings ({activeListings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-[#0b1c30] dark:bg-white text-white dark:text-[#0b1c30] shadow-sm'
              : 'bg-[#eff4ff] dark:bg-[#16243d] text-[#565e74] dark:text-[#94a3b8] hover:bg-[#d3e4fe]/50'
          }`}
        >
          <History className="w-3.5 h-3.5 text-[#ae3115] dark:text-[#ff7e62]" />
          <span>Preserved History & Delivered Batches ({pastListings.length})</span>
        </button>
      </div>

      {/* ACTIVE TAB */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#0b1c30] dark:text-white">Active Postings in Marketplace</h2>
            <span className="text-xs font-semibold text-[#565e74] dark:text-[#94a3b8]">{activeListings.length} Active in Dispatch</span>
          </div>

          {activeListings.length === 0 ? (
            <div className="bg-white dark:bg-[#111c30] rounded-3xl p-10 text-center border border-dashed border-[#d3e4fe] dark:border-[#243452] space-y-3">
              <Utensils className="w-8 h-8 text-[#565e74] dark:text-[#94a3b8] mx-auto" />
              <h4 className="text-base font-bold text-[#0b1c30] dark:text-white">No Active Surplus Postings Right Now</h4>
              <p className="text-xs text-[#59413c] dark:text-[#cbd5e1] max-w-md mx-auto">
                Got extra food from lunch, dinner, or kitchen preparations? Post it now so nearby shelters can claim it before expiry.
              </p>
              <button
                onClick={onOpenNewDonation}
                className="px-5 py-2.5 bg-[#ff6b4a] hover:bg-[#ae3115] text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm transition-all"
              >
                Post Food Surplus Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {activeListings.map(item => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-[#111c30] rounded-2xl p-5 border border-[#d3e4fe] dark:border-[#243452] shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            item.vegNonVeg === 'pure_veg' 
                              ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400' 
                              : 'bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-400'
                          }`}>
                            {item.vegNonVeg === 'pure_veg' ? '🟢 Pure Veg' : '🔴 Non-Veg'}
                          </span>
                          <span className="text-xs text-[#565e74] dark:text-[#94a3b8] font-medium">{item.createdAt}</span>
                        </div>
                        <h3 className="text-base font-bold text-[#0b1c30] dark:text-white mt-1">{item.title}</h3>
                      </div>

                      {/* Status Badge */}
                      <div>
                        {item.status === 'available' && (
                          <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-bold rounded-full flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Waiting Claim
                          </span>
                        )}
                        {item.status === 'claimed' && (
                          <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 text-xs font-bold rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Claimed by NGO
                          </span>
                        )}
                        {item.status === 'in_transit' && (
                          <span className="px-2.5 py-1 bg-[#ffdad2] dark:bg-[#ae3115]/30 text-[#8c1900] dark:text-[#ffb4a3] text-xs font-bold rounded-full flex items-center gap-1 animate-pulse">
                            <Truck className="w-3 h-3" /> Dispatched / En Route
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity & Details */}
                    <div className="grid grid-cols-3 gap-2 bg-[#eff4ff] dark:bg-[#16243d] p-3 rounded-xl text-center text-xs">
                      <div>
                        <span className="text-[#565e74] dark:text-[#94a3b8] block text-[10px]">Quantity</span>
                        <span className="font-extrabold text-[#ae3115] dark:text-[#ff7e62]">{item.servings} Servings</span>
                      </div>
                      <div>
                        <span className="text-[#565e74] dark:text-[#94a3b8] block text-[10px]">Weight</span>
                        <span className="font-bold text-[#0b1c30] dark:text-white">{item.weightKg} kg</span>
                      </div>
                      <div>
                        <span className="text-[#565e74] dark:text-[#94a3b8] block text-[10px]">Expiry Window</span>
                        <span className="font-bold text-[#0b1c30] dark:text-white">{item.expiryTime}</span>
                      </div>
                    </div>

                    {/* Claimed / Driver info */}
                    {item.claimedByNGO && (
                      <div className="bg-[#eff4ff]/80 dark:bg-[#182640] p-3 rounded-xl border border-[#d3e4fe] dark:border-[#2b3e64] space-y-1 text-xs">
                        <div className="font-bold text-[#0b1c30] dark:text-white flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-[#ae3115] dark:text-[#ff7e62]" />
                          <span>Claimed by: {item.claimedByNGO.name}</span>
                        </div>
                        <div className="text-[#565e74] dark:text-[#cbd5e1] text-[11px]">
                          Contact: {item.claimedByNGO.contact} • Drop-off: {item.claimedByNGO.address}
                        </div>
                        {item.assignedVolunteer && (
                          <div className="text-emerald-700 dark:text-emerald-400 font-semibold text-[11px] flex items-center gap-1 pt-1">
                            <Truck className="w-3.5 h-3.5" />
                            <span>Driver: {item.assignedVolunteer.name} ({item.assignedVolunteer.vehicle})</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bottom Actions */}
                  <div className="pt-2 border-t border-[#e5eeff] dark:border-[#243452] flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedTrackingDonation(item)}
                      className="px-3 py-1.5 rounded-lg bg-[#eff4ff] dark:bg-[#16243d] hover:bg-[#ffdad2] dark:hover:bg-[#203050] text-xs font-bold text-[#0b1c30] dark:text-white flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5 text-[#ae3115] dark:text-[#ff7e62]" />
                      <span>Track Journey</span>
                    </button>

                    <button
                      onClick={() => setSelectedReceiptDonation(item)}
                      className="text-xs font-bold text-[#ae3115] dark:text-[#ff7e62] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>80G Receipt</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#0b1c30] dark:text-white">Preserved Donation History</h2>
              <p className="text-xs text-[#565e74] dark:text-[#94a3b8]">All delivered food batches and complete rescue receipts are archived permanently.</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-900/50">
              {pastListings.length} Completed Batches
            </span>
          </div>

          {pastListings.length === 0 ? (
            <div className="bg-white dark:bg-[#111c30] rounded-3xl p-10 text-center border border-dashed border-[#d3e4fe] dark:border-[#243452] space-y-3">
              <History className="w-8 h-8 text-[#565e74] dark:text-[#94a3b8] mx-auto" />
              <h4 className="text-base font-bold text-[#0b1c30] dark:text-white">No Completed History Yet</h4>
              <p className="text-xs text-[#59413c] dark:text-[#cbd5e1] max-w-md mx-auto">
                Once an NGO claims and the volunteer driver completes delivery of your surplus batch, its full journey, timestamps, and 80G tax certificates will be preserved here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {pastListings.map(item => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-[#111c30] rounded-2xl p-5 border border-emerald-200 dark:border-emerald-900/40 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400">
                            ✓ Delivered & Preserved
                          </span>
                          <span className="text-xs text-[#565e74] dark:text-[#94a3b8] font-medium">{item.deliveredAt || 'Delivered'}</span>
                        </div>
                        <h3 className="text-base font-bold text-[#0b1c30] dark:text-white mt-1">{item.title}</h3>
                      </div>

                      <span className="text-xs font-mono font-bold text-[#565e74] dark:text-[#94a3b8]">
                        #{item.id.slice(-6).toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-[#eff4ff] dark:bg-[#16243d] p-3 rounded-xl text-center text-xs">
                      <div>
                        <span className="text-[#565e74] dark:text-[#94a3b8] block text-[10px]">Portions</span>
                        <span className="font-extrabold text-[#ae3115] dark:text-[#ff7e62]">{item.servings} Servings</span>
                      </div>
                      <div>
                        <span className="text-[#565e74] dark:text-[#94a3b8] block text-[10px]">Food Saved</span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">{item.weightKg} kg</span>
                      </div>
                      <div>
                        <span className="text-[#565e74] dark:text-[#94a3b8] block text-[10px]">Tax Value</span>
                        <span className="font-bold text-[#0b1c30] dark:text-white">₹{(item.servings * 35).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/30 text-xs space-y-1">
                      <div className="text-emerald-900 dark:text-emerald-200 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Received by: {item.claimedByNGO?.name || 'Local Community Shelter'}</span>
                      </div>
                      {item.assignedVolunteer && (
                        <div className="text-[#565e74] dark:text-[#94a3b8] text-[11px]">
                          Delivered by volunteer driver {item.assignedVolunteer.name} ({item.assignedVolunteer.vehicle})
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#e5eeff] dark:border-[#243452] flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedTrackingDonation(item)}
                      className="px-3 py-1.5 rounded-lg bg-[#eff4ff] dark:bg-[#16243d] hover:bg-[#ffdad2] dark:hover:bg-[#203050] text-xs font-bold text-[#0b1c30] dark:text-white flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>View Journey Log</span>
                    </button>

                    <button
                      onClick={() => setSelectedReceiptDonation(item)}
                      className="text-xs font-bold text-[#ae3115] dark:text-[#ff7e62] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download 80G Form</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Rescue Journey Tracking Modal */}
      <RescueTrackingModal
        donation={selectedTrackingDonation}
        isOpen={Boolean(selectedTrackingDonation)}
        onClose={() => setSelectedTrackingDonation(null)}
      />

      {/* Tax Exemption Certificate Modal */}
      {selectedReceiptDonation && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-[#111c30] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#d3e4fe] dark:border-[#243452] space-y-6">
            <div className="flex justify-between items-start pb-4 border-b border-[#e5eeff] dark:border-[#243452]">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ae3115] dark:text-[#ff7e62]">
                  Form 10BE / 80G Tax Exemption
                </span>
                <h3 className="text-lg font-black text-[#0b1c30] dark:text-white">Donation Value Certificate</h3>
              </div>
              <button
                onClick={() => setSelectedReceiptDonation(null)}
                className="text-[#565e74] dark:text-[#94a3b8] hover:text-[#0b1c30] dark:hover:text-white text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#eff4ff] dark:bg-[#16243d] p-5 rounded-2xl border border-[#d3e4fe] dark:border-[#2b3e64] space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-[#565e74] dark:text-[#94a3b8]">Certificate ID:</span>
                <span className="font-mono font-bold text-[#0b1c30] dark:text-white">FR-80G-{selectedReceiptDonation.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#565e74] dark:text-[#94a3b8]">Donor Name / Entity:</span>
                <span className="font-bold text-[#0b1c30] dark:text-white">{user.organization || user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#565e74] dark:text-[#94a3b8]">Food Title:</span>
                <span className="font-bold text-[#0b1c30] dark:text-white">{selectedReceiptDonation.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#565e74] dark:text-[#94a3b8]">Total Portions:</span>
                <span className="font-bold text-[#ae3115] dark:text-[#ff7e62]">{selectedReceiptDonation.servings} Servings ({selectedReceiptDonation.weightKg} kg)</span>
              </div>
              <div className="flex justify-between border-t border-[#d3e4fe] dark:border-[#2b3e64] pt-2">
                <span className="text-[#565e74] dark:text-[#94a3b8] font-bold">Assessed Fair Market Value:</span>
                <span className="font-extrabold text-base text-[#0b1c30] dark:text-white">₹{(selectedReceiptDonation.servings * 35).toLocaleString()}</span>
              </div>
            </div>

            <div className="text-[11px] text-[#565e74] dark:text-[#cbd5e1] leading-relaxed">
              Certified under Section 80G(5)(vi) of the Income Tax Act, 1961. This digital acknowledgement confirms the donation of wholesome, fresh food surplus without commercial consideration.
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  alert('Form 10BE / 80G Tax Exemption certificate downloaded successfully to your device!');
                  setSelectedReceiptDonation(null);
                }}
                className="flex-1 py-3 bg-[#0b1c30] dark:bg-[#1e2f4d] hover:bg-[#1a2f4c] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
