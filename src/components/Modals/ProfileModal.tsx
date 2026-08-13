import React from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Utensils, 
  Truck, 
  Calendar, 
  Award, 
  ShieldCheck, 
  X, 
  LogOut
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types';

interface ProfileModalProps {
  user: UserProfile;
  savedAccounts: UserProfile[];
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onSwitchAccount: (user: UserProfile) => void;
  onRegisterNewRole: (role: UserRole) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  savedAccounts,
  isOpen,
  onClose,
  onLogout,
  onSwitchAccount,
  onRegisterNewRole
}) => {
  if (!isOpen) return null;

  const otherAccounts = savedAccounts.filter(acc => acc.id !== user.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/70 dark:bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-[#111c30] rounded-3xl shadow-2xl border border-[#d3e4fe] dark:border-[#243452] overflow-hidden max-h-[90vh] flex flex-col transition-colors">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0b1c30] to-[#1a2f4c] dark:from-[#09101d] dark:to-[#132038] text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#ffdad2] flex items-center justify-center text-[#8c1900] font-black text-xl shadow-md border-2 border-white dark:border-[#243452]">
              {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">{user.name}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  user.role === 'donor'
                    ? 'bg-[#ffdad2] text-[#8c1900]'
                    : user.role === 'ngo'
                    ? 'bg-blue-100 text-blue-950'
                    : 'bg-emerald-100 text-emerald-950'
                }`}>
                  {user.role === 'donor' ? 'Food Donor' : user.role === 'ngo' ? 'NGO Shelter' : 'Volunteer Driver'}
                </span>
              </div>
              <p className="text-xs text-[#d3e4fe] mt-0.5">
                {user.organization || (user.role === 'volunteer' ? (user.vehicleType || 'Certified Rescue Driver') : 'Individual Community Partner')}
              </p>
              <div className="flex items-center gap-2 mt-2 text-[11px] text-[#ffdad2]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Active Persona • Odisha Food Rescue Network</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          
          {/* User Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div className="p-3 rounded-xl bg-[#eff4ff] dark:bg-[#16243d] border border-[#d3e4fe] dark:border-[#2b3e64]">
              <div className="flex items-center gap-1.5 text-[#565e74] dark:text-[#94a3b8] mb-1 font-semibold">
                <Mail className="w-3.5 h-3.5 text-[#ae3115] dark:text-[#ff7e62]" />
                <span>Registered Email</span>
              </div>
              <div className="font-bold text-[#0b1c30] dark:text-white truncate">{user.email}</div>
            </div>

            <div className="p-3 rounded-xl bg-[#eff4ff] dark:bg-[#16243d] border border-[#d3e4fe] dark:border-[#2b3e64]">
              <div className="flex items-center gap-1.5 text-[#565e74] dark:text-[#94a3b8] mb-1 font-semibold">
                <Phone className="w-3.5 h-3.5 text-[#ae3115] dark:text-[#ff7e62]" />
                <span>Contact Phone</span>
              </div>
              <div className="font-bold text-[#0b1c30] dark:text-white">{user.phone || '+91 98200 12345'}</div>
            </div>

            <div className="p-3 rounded-xl bg-[#eff4ff] dark:bg-[#16243d] border border-[#d3e4fe] dark:border-[#2b3e64]">
              <div className="flex items-center gap-1.5 text-[#565e74] dark:text-[#94a3b8] mb-1 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-[#ae3115] dark:text-[#ff7e62]" />
                <span>Location City</span>
              </div>
              <div className="font-bold text-[#0b1c30] dark:text-white">{user.city || 'Bhubaneswar, Odisha'}</div>
            </div>

            <div className="p-3 rounded-xl bg-[#eff4ff] dark:bg-[#16243d] border border-[#d3e4fe] dark:border-[#2b3e64]">
              <div className="flex items-center gap-1.5 text-[#565e74] dark:text-[#94a3b8] mb-1 font-semibold">
                <Calendar className="w-3.5 h-3.5 text-[#ae3115] dark:text-[#ff7e62]" />
                <span>Member Since</span>
              </div>
              <div className="font-bold text-[#0b1c30] dark:text-white">{user.joinedDate || 'Today'}</div>
            </div>
          </div>

          {/* Impact Stats Strip */}
          <div className="p-4 rounded-2xl bg-[#ffdad2]/40 dark:bg-[#ae3115]/20 border border-[#ffdad2] dark:border-[#ae3115]/40">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#8c1900] dark:text-[#ffdad2] mb-2 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#ae3115] dark:text-[#ff7e62]" />
              <span>Personal Impact Contribution</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-xl font-extrabold text-[#0b1c30] dark:text-white">{user.stats.mealsCount}</div>
                <div className="text-[10px] text-[#565e74] dark:text-[#94a3b8]">Meals Rescued</div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-[#ae3115] dark:text-[#ff7e62]">
                  {user.role === 'donor' ? user.stats.donationsCount : user.stats.deliveriesCount}
                </div>
                <div className="text-[10px] text-[#565e74] dark:text-[#94a3b8]">
                  {user.role === 'donor' ? 'Batches Donated' : 'Deliveries Done'}
                </div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400">
                  {user.role === 'volunteer' ? `${user.stats.volunteerHours}h` : `₹${(user.stats.totalRupeesContributed || 0).toLocaleString()}`}
                </div>
                <div className="text-[10px] text-[#565e74] dark:text-[#94a3b8]">
                  {user.role === 'volunteer' ? 'Service Hours' : 'Tax Exempt (80G)'}
                </div>
              </div>
            </div>
          </div>

          {/* Other Registered Accounts / Person Switcher */}
          {otherAccounts.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#565e74] dark:text-[#94a3b8]">
                Switch to Another Person on this Device:
              </div>
              <div className="space-y-2">
                {otherAccounts.map(account => (
                  <button
                    key={account.id}
                    onClick={() => {
                      onSwitchAccount(account);
                      onClose();
                    }}
                    className="w-full p-3 rounded-xl bg-[#eff4ff] dark:bg-[#16243d] hover:bg-[#ffdad2]/70 dark:hover:bg-[#223554] border border-[#d3e4fe] dark:border-[#2b3e64] transition-all flex items-center justify-between cursor-pointer"
                  >
                    <div className="text-left">
                      <div className="text-xs font-bold text-[#0b1c30] dark:text-white">{account.name}</div>
                      <div className="text-[11px] text-[#565e74] dark:text-[#94a3b8]">
                        {account.organization || account.email} • {account.city}
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                      account.role === 'donor'
                        ? 'bg-[#ffdad2] text-[#8c1900]'
                        : account.role === 'ngo'
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-emerald-100 text-emerald-900'
                    }`}>
                      {account.role}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Register New Account with Another Role */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#565e74] dark:text-[#94a3b8]">
              Register / Add Another Person:
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => { onRegisterNewRole('donor'); onClose(); }}
                className="py-2.5 px-2 rounded-xl border border-[#d3e4fe] dark:border-[#2b3e64] bg-[#eff4ff] dark:bg-[#16243d] hover:bg-[#ffdad2] dark:hover:bg-[#223554] text-xs font-bold text-[#0b1c30] dark:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-[#ae3115] dark:text-[#ff7e62]" />
                <span>+ Food Donor</span>
              </button>

              <button
                onClick={() => { onRegisterNewRole('ngo'); onClose(); }}
                className="py-2.5 px-2 rounded-xl border border-[#d3e4fe] dark:border-[#2b3e64] bg-[#eff4ff] dark:bg-[#16243d] hover:bg-[#ffdad2] dark:hover:bg-[#223554] text-xs font-bold text-[#0b1c30] dark:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Utensils className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>+ NGO Shelter</span>
              </button>

              <button
                onClick={() => { onRegisterNewRole('volunteer'); onClose(); }}
                className="py-2.5 px-2 rounded-xl border border-[#d3e4fe] dark:border-[#2b3e64] bg-[#eff4ff] dark:bg-[#16243d] hover:bg-[#ffdad2] dark:hover:bg-[#223554] text-xs font-bold text-[#0b1c30] dark:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Truck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>+ Driver</span>
              </button>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-2 flex items-center justify-between border-t border-[#e5eeff] dark:border-[#243452]">
            <button
              onClick={() => { onLogout(); onClose(); }}
              className="px-4 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 bg-[#0b1c30] hover:bg-[#1a2f4c] dark:bg-[#ff6b4a] dark:hover:bg-[#ae3115] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Done
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
