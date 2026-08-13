import React from 'react';
import { Heart, IndianRupee } from 'lucide-react';

interface FooterProps {
  onOpenInfo: (type: 'about' | 'contact' | 'privacy' | 'terms' | 'volunteer' | 'donate') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenInfo }) => {
  return (
    <footer className="bg-[#0b1c30] text-white w-full py-10 px-4 md:px-8 border-t border-[#1c2d42] mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left space-y-1">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#ffdad2] flex items-center justify-center text-[#ae3115]">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <span className="text-xl font-black text-white tracking-tight">
              FoodRescue <span className="text-[#ffdad2] text-sm">INDIA</span>
            </span>
          </div>
          <p className="text-[#d3e4fe] text-xs max-w-sm">
            © 2026 FoodRescue India Foundation. 80G Tax Exemption Certified (Reg. No. AACTF0987N). Delivering hope, one meal at a time.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 items-center justify-center text-xs">
          <button
            onClick={() => onOpenInfo('about')}
            className="text-[#d3e4fe] hover:text-[#ffdad2] transition-colors cursor-pointer"
          >
            About Us
          </button>
          <button
            onClick={() => onOpenInfo('volunteer')}
            className="text-[#d3e4fe] hover:text-[#ffdad2] transition-colors cursor-pointer"
          >
            Volunteer Driver Fleet
          </button>
          <button
            onClick={() => onOpenInfo('terms')}
            className="text-[#d3e4fe] hover:text-[#ffdad2] transition-colors cursor-pointer"
          >
            80G Tax Terms & FSSAI
          </button>
          <button
            onClick={() => onOpenInfo('privacy')}
            className="text-[#d3e4fe] hover:text-[#ffdad2] transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => onOpenInfo('contact')}
            className="text-[#d3e4fe] hover:text-[#ffdad2] transition-colors cursor-pointer"
          >
            Helpline & Contact
          </button>
          <button
            onClick={() => onOpenInfo('donate')}
            className="text-[#ffdad2] hover:text-white font-bold transition-colors cursor-pointer flex items-center gap-1"
          >
            <IndianRupee className="w-3.5 h-3.5" />
            <span>Sponsor in ₹</span>
          </button>
        </nav>
      </div>
    </footer>
  );
};
