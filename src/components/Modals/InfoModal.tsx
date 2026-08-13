import React from 'react';
import { X, ShieldCheck, Heart, Mail, FileText, Users, Globe2 } from 'lucide-react';

interface InfoModalProps {
  type: 'about' | 'contact' | 'privacy' | 'terms' | 'volunteer' | 'donate' | null;
  onClose: () => void;
  onOpenDonateModal?: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  type,
  onClose,
  onOpenDonateModal
}) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-[#111c30] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#d3e4fe] dark:border-[#243452] my-8 max-h-[85vh] flex flex-col transition-colors">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-[#e5eeff] dark:border-[#243452]">
          <div className="flex items-center gap-2.5">
            {type === 'about' && <Globe2 className="w-5 h-5 text-[#ae3115] dark:text-[#ff7e62]" />}
            {type === 'contact' && <Mail className="w-5 h-5 text-[#ae3115] dark:text-[#ff7e62]" />}
            {type === 'privacy' && <ShieldCheck className="w-5 h-5 text-[#ae3115] dark:text-[#ff7e62]" />}
            {type === 'terms' && <FileText className="w-5 h-5 text-[#ae3115] dark:text-[#ff7e62]" />}
            {type === 'volunteer' && <Users className="w-5 h-5 text-[#ae3115] dark:text-[#ff7e62]" />}
            {type === 'donate' && <Heart className="w-5 h-5 text-[#ae3115] dark:text-[#ff7e62]" />}
            <h2 className="text-xl font-black text-[#0b1c30] dark:text-white capitalize">
              {type === 'about' && 'About FoodRescue India'}
              {type === 'contact' && 'Logistics & 24/7 Helpline'}
              {type === 'privacy' && 'Privacy & Partner Security'}
              {type === 'terms' && 'Food Safety & 80G Tax Terms'}
              {type === 'volunteer' && 'Join Volunteer Fleet'}
              {type === 'donate' && 'Support Our Mission'}
            </h2>
          </div>
          <button onClick={onClose} className="text-[#565e74] dark:text-[#94a3b8] hover:text-[#0b1c30] dark:hover:text-white p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="py-4 space-y-4 text-xs text-[#59413c] dark:text-[#cbd5e1] leading-relaxed overflow-y-auto pr-1">
          {type === 'about' && (
            <div className="space-y-3">
              <p className="font-semibold text-sm text-[#0b1c30] dark:text-white">
                FoodRescue India is a rapid food surplus distribution network connecting commercial banquets, restaurants, and bakeries with verified shelters and community kitchens.
              </p>
              <p>
                In India, an estimated 68 million tonnes of food is wasted annually while millions experience hunger and malnutrition. FoodRescue bridges this gap through automated proximity matching, FSSAI temperature compliant transit, and volunteer drivers.
              </p>
              <div className="bg-[#eff4ff] dark:bg-[#16243d] p-4 rounded-2xl border border-[#d3e4fe] dark:border-[#2b3e64] space-y-2">
                <h4 className="font-bold text-[#0b1c30] dark:text-white">Our Operational Core:</h4>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>Speed:</strong> Perishable and hot meals picked up and delivered in under 45 minutes.</li>
                  <li><strong>Food Safety First:</strong> Alignment with FSSAI regulations and strict sensory hygiene check.</li>
                  <li><strong>Tax Transparency:</strong> Instant Section 80G digital certificates for commercial donors.</li>
                </ul>
              </div>
            </div>
          )}

          {type === 'contact' && (
            <div className="space-y-3">
              <p>
                Our city operations and driver dispatch control rooms are active 7 days a week from 6:00 AM to 11:30 PM.
              </p>
              <div className="space-y-2 bg-[#eff4ff] dark:bg-[#16243d] p-4 rounded-2xl border border-[#d3e4fe] dark:border-[#2b3e64]">
                <p><strong>Emergency Food Rescue Helpline:</strong> 1800-266-3732 (Toll Free)</p>
                <p><strong>WhatsApp Quick Dispatch:</strong> +91 98201 44521</p>
                <p><strong>Email:</strong> dispatch@foodrescue.in</p>
                <p><strong>National Operations Hub:</strong> BKC, Bandra East, Mumbai, Maharashtra 400051</p>
              </div>
            </div>
          )}

          {type === 'privacy' && (
            <div className="space-y-3">
              <p>
                We value the privacy of our partner restaurants, shelter coordinators, and volunteer drivers. We encrypt all logistics and personal information.
              </p>
              <h4 className="font-bold text-[#0b1c30] dark:text-white">Data Usage</h4>
              <p>Contact details and addresses are only shared with the assigned volunteer driver and recipient shelter for that specific verified rescue run.</p>
            </div>
          )}

          {type === 'terms' && (
            <div className="space-y-3">
              <p>
                By participating in FoodRescue India, donors and volunteers operate under established statutory protections:
              </p>
              <h4 className="font-bold text-[#0b1c30] dark:text-white">Good Samaritan Protection</h4>
              <p>
                Food donors providing wholesome surplus in good faith without commercial sale are protected under Indian Good Samaritan guidelines and standard public health protocols.
              </p>
              <h4 className="font-bold text-[#0b1c30] dark:text-white">Section 80G Tax Exemption</h4>
              <p>
                All financial sponsorships and certified food donations receive Form 10BE valid for 50% deduction under Section 80G of the Income Tax Act.
              </p>
            </div>
          )}

          {type === 'volunteer' && (
            <div className="space-y-3">
              <p>
                Volunteer drivers are the backbone of our 45-minute food delivery guarantee. Whether you have 30 minutes in the evening or a free weekend morning, you can rescue meals in your neighborhood.
              </p>
              <div className="bg-[#eff4ff] dark:bg-[#16243d] p-4 rounded-2xl border border-[#d3e4fe] dark:border-[#2b3e64] space-y-1.5">
                <p><strong>Requirements:</strong> Two-wheeler or four-wheeler, valid driver license, smartphone for route guidance.</p>
                <p><strong>Provided:</strong> Insulated food transport bags, fuel reimbursement assistance, certified community impact certificate.</p>
              </div>
            </div>
          )}

          {type === 'donate' && (
            <div className="space-y-3">
              <p>
                Every ₹10 directly sponsors transport fuel, sanitary food-grade containers, and driver coordination for 1 hot wholesome meal.
              </p>
              <button
                onClick={() => {
                  onClose();
                  if (onOpenDonateModal) onOpenDonateModal();
                }}
                className="w-full py-3 bg-[#ff6b4a] hover:bg-[#ae3115] text-white font-bold rounded-xl cursor-pointer"
              >
                Open ₹ Donation Calculator (₹10 = 1 Meal)
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-[#e5eeff] dark:border-[#243452]">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#eff4ff] dark:bg-[#16243d] hover:bg-[#d3e4fe] dark:hover:bg-[#223554] text-[#0b1c30] dark:text-white rounded-xl font-bold cursor-pointer text-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
