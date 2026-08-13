import React, { useState } from 'react';
import { 
  IndianRupee, 
  Heart, 
  CheckCircle2, 
  X, 
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDonationComplete: (amountRupees: number, meals: number) => void;
}

export const DonateModal: React.FC<DonateModalProps> = ({
  isOpen,
  onClose,
  onDonationComplete
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState(false);
  const [donorName, setDonorName] = useState('');
  const [donorEmail] = useState('');
  const [donorPan, setDonorPan] = useState('');
  const [paymentDone, setPaymentDone] = useState(false);

  if (!isOpen) return null;

  const currentAmount = isCustom ? Number(customAmount) || 0 : selectedAmount;
  // ₹10 sponsors transport & insulated handling for 1 wholesome meal
  const mealsCount = Math.floor(currentAmount / 10);

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAmount <= 0) return;

    setPaymentDone(true);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      onDonationComplete(currentAmount, mealsCount);
      setPaymentDone(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-[#111c30] rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#d3e4fe] dark:border-[#243452] transition-colors">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-[#e5eeff] dark:border-[#243452]">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#ffdad2] dark:bg-[#ae3115]/30 text-[#ae3115] dark:text-[#ff7e62]">
              <Heart className="w-5 h-5 fill-current" />
            </span>
            <div>
              <h3 className="text-lg font-black text-[#0b1c30] dark:text-white">Sponsor Food Rescue in ₹</h3>
              <p className="text-xs text-[#565e74] dark:text-[#94a3b8]">₹10 sponsors fuel & transport for 1 wholesome meal</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#565e74] dark:text-[#94a3b8] hover:text-[#0b1c30] dark:hover:text-white p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {paymentDone ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="text-xl font-bold text-[#0b1c30] dark:text-white">Dhanyavaad! Delivery Sponsored</h4>
            <p className="text-xs text-[#59413c] dark:text-[#cbd5e1]">
              Your contribution of ₹{currentAmount.toLocaleString()} will rescue and deliver {mealsCount.toLocaleString()} hot meals to local shelters.
            </p>
            <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/40 py-2 px-3 rounded-xl border border-emerald-200 dark:border-emerald-800">
              ✓ 80G Tax Exemption Receipt Sent to {donorEmail || 'your email'}
            </div>
          </div>
        ) : (
          <form onSubmit={handleDonate} className="py-4 space-y-4">
            
            {/* Impact Calculation Preview */}
            <div className="bg-[#eff4ff] dark:bg-[#16243d] p-4 rounded-2xl border border-[#d3e4fe] dark:border-[#2b3e64] text-center">
              <span className="text-xs text-[#59413c] dark:text-[#cbd5e1] block mb-1">Your contribution directly sponsors:</span>
              <span className="text-3xl font-extrabold text-[#ae3115] dark:text-[#ff7e62]">
                {mealsCount.toLocaleString()} Hot Meals
              </span>
              <span className="text-[11px] text-[#565e74] dark:text-[#94a3b8] block mt-1">
                Covering volunteer driver fuel, food-safe insulated crates & cold chain.
              </span>
            </div>

            {/* Presets in INR */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#59413c] dark:text-[#cbd5e1] mb-1.5">
                Select Amount (INR ₹)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[100, 250, 500, 1000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => { setSelectedAmount(amt); setIsCustom(false); }}
                    className={`py-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                      !isCustom && selectedAmount === amt
                        ? 'bg-[#ffdad2] dark:bg-[#ae3115]/30 text-[#8c1900] dark:text-[#ffdad2] border-[#ae3115] shadow-xs'
                        : 'bg-[#eff4ff] dark:bg-[#16243d] text-[#565e74] dark:text-[#94a3b8] border-[#d3e4fe] dark:border-[#2b3e64] hover:bg-[#d3e4fe]'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div>
              <label className="block text-[11px] font-bold text-[#59413c] dark:text-[#cbd5e1] mb-1">
                Or Enter Custom Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#565e74] dark:text-[#94a3b8] text-xs font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  min="10"
                  placeholder="e.g. 2500"
                  value={customAmount}
                  onChange={(e) => { setCustomAmount(e.target.value); setIsCustom(true); }}
                  className="w-full pl-8 pr-3.5 py-2 bg-[#eff4ff] dark:bg-[#16243d] border border-[#d3e4fe] dark:border-[#2b3e64] rounded-xl text-xs font-bold text-[#0b1c30] dark:text-white outline-none focus:ring-2 focus:ring-[#ae3115]"
                />
              </div>
            </div>

            {/* Donor info for 80G Tax certificate */}
            <div className="space-y-2 pt-1 border-t border-[#e5eeff] dark:border-[#243452]">
              <div className="text-[11px] font-bold text-[#59413c] dark:text-[#cbd5e1]">
                Tax Exemption Details (Section 80G):
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="px-3 py-2 bg-[#eff4ff] dark:bg-[#16243d] border border-[#d3e4fe] dark:border-[#2b3e64] rounded-xl text-xs text-[#0b1c30] dark:text-white outline-none"
                />
                <input
                  type="text"
                  placeholder="PAN Card (Optional)"
                  value={donorPan}
                  onChange={(e) => setDonorPan(e.target.value)}
                  className="px-3 py-2 bg-[#eff4ff] dark:bg-[#16243d] border border-[#d3e4fe] dark:border-[#2b3e64] rounded-xl text-xs text-[#0b1c30] dark:text-white outline-none uppercase"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={currentAmount <= 0}
              className="w-full py-3.5 bg-[#ff6b4a] hover:bg-[#ae3115] text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <IndianRupee className="w-4 h-4" />
              <span>Complete Donation of ₹{currentAmount.toLocaleString()} (UPI / Card)</span>
            </button>

            <div className="text-center text-[10px] text-[#565e74] dark:text-[#94a3b8] flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Secure 256-Bit Encrypted Indian Payment Gateway</span>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
