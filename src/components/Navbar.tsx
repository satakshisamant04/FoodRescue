import React, { useState } from 'react';
import { 
  Heart, 
  PlusCircle, 
  Building2, 
  Utensils, 
  Truck, 
  MapPin, 
  IndianRupee, 
  LogOut, 
  Globe2,
  LayoutDashboard,
  User,
  ChevronDown,
  LogIn,
  UserPlus,
  Sun,
  Moon
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface NavbarProps {
  currentView: 'landing' | 'portal' | 'explore' | 'auth';
  activeRole: UserRole;
  user: UserProfile;
  savedAccounts: UserProfile[];
  isLoggedIn?: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onSelectView: (view: 'landing' | 'portal' | 'explore') => void;
  onSwitchAccount: (user: UserProfile) => void;
  onRegisterNewRole: (role: UserRole) => void;
  onOpenNewDonation: () => void;
  onOpenDonateFunds: () => void;
  onOpenAuth: (tab: 'login' | 'register', role?: UserRole) => void;
  onOpenProfile: () => void;
  onLogout: () => void;
  totalMealsRescued: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  user,
  savedAccounts,
  isLoggedIn = false,
  theme,
  onToggleTheme,
  onSelectView,
  onSwitchAccount,
  onRegisterNewRole,
  onOpenNewDonation,
  onOpenDonateFunds,
  onOpenAuth,
  onOpenProfile,
  onLogout
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const otherAccounts = savedAccounts.filter(acc => acc.id !== user.id);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0c1424]/95 backdrop-blur-md border-b border-[#e5eeff] dark:border-[#243452] shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectView('landing')}
              className="flex items-center gap-2 text-left cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-[#ffdad2] dark:bg-[#ae3115]/30 flex items-center justify-center text-[#ae3115] dark:text-[#ff7e62] group-hover:scale-105 transition-transform">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <span className="text-lg font-black text-[#0b1c30] dark:text-white tracking-tight group-hover:text-[#ae3115] dark:group-hover:text-[#ff7e62] transition-colors">
                  FoodRescue
                </span>
                <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded-full bg-[#eff4ff] dark:bg-[#16243d] text-[#ae3115] dark:text-[#ff7e62] text-[10px] font-extrabold border border-[#d3e4fe] dark:border-[#2b3e64]">
                  INDIA
                </span>
              </div>
            </button>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 ml-4 bg-[#eff4ff] dark:bg-[#16243d] p-1 rounded-xl border border-[#d3e4fe] dark:border-[#2b3e64]">
              <button
                id="nav-btn-home"
                onClick={() => onSelectView('landing')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentView === 'landing'
                    ? 'bg-white dark:bg-[#223554] text-[#0b1c30] dark:text-white shadow-xs'
                    : 'text-[#565e74] dark:text-[#94a3b8] hover:text-[#0b1c30] dark:hover:text-white'
                }`}
              >
                <Globe2 className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>

              {/* Show Portal tab only when logged in */}
              {isLoggedIn && (
                <button
                  id="nav-btn-portal"
                  onClick={() => onSelectView('portal')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    currentView === 'portal'
                      ? 'bg-white dark:bg-[#223554] text-[#ae3115] dark:text-[#ff7e62] shadow-xs'
                      : 'text-[#565e74] dark:text-[#94a3b8] hover:text-[#0b1c30] dark:hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>
                    {user.role === 'donor' && 'Donor Dashboard'}
                    {user.role === 'ngo' && 'NGO Rescue Hub'}
                    {user.role === 'volunteer' && 'Driver Dispatch'}
                  </span>
                </button>
              )}

              <button
                id="nav-btn-explore"
                onClick={() => onSelectView('explore')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentView === 'explore'
                    ? 'bg-white dark:bg-[#223554] text-[#0b1c30] dark:text-white shadow-xs'
                    : 'text-[#565e74] dark:text-[#94a3b8] hover:text-[#0b1c30] dark:hover:text-white'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-[#ae3115] dark:text-[#ff7e62]" />
                <span>Live Rescue Map</span>
              </button>
            </nav>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-2.5">

            {/* Dark/Light Mode Toggle Switch */}
            <button
              id="theme-toggle-btn"
              onClick={onToggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              className="p-2 rounded-xl bg-[#eff4ff] dark:bg-[#16243d] hover:bg-[#d3e4fe] dark:hover:bg-[#233758] border border-[#d3e4fe] dark:border-[#2b3e64] text-[#0b1c30] dark:text-[#f1f5f9] transition-all cursor-pointer flex items-center gap-1.5"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <span className="hidden lg:inline text-[11px] font-bold">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden lg:inline text-[11px] font-bold">Light</span>
                </>
              )}
            </button>

            {/* Post Food Action */}
            <button
              id="nav-btn-post-food"
              onClick={() => {
                if (isLoggedIn && user.role === 'donor') {
                  onOpenNewDonation();
                } else if (isLoggedIn && user.role !== 'donor') {
                  onRegisterNewRole('donor');
                } else {
                  onOpenAuth('register', 'donor');
                }
              }}
              className="px-3 py-2 bg-[#0b1c30] dark:bg-[#1e2f4d] hover:bg-[#1a2f4c] dark:hover:bg-[#293e64] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#ffb4a3]" />
              <span className="hidden sm:inline">Post Surplus Food</span>
              <span className="sm:hidden">Post Food</span>
            </button>

            {/* Rupees Donation Sponsorship */}
            <button
              id="nav-btn-donate-funds"
              onClick={onOpenDonateFunds}
              className="px-3 py-2 bg-[#ff6b4a] hover:bg-[#ae3115] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
            >
              <IndianRupee className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Donate ₹</span>
            </button>

            {/* User Account or Auth Buttons */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  id="nav-btn-user-profile"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl bg-[#eff4ff] dark:bg-[#16243d] hover:bg-[#ffdad2] dark:hover:bg-[#203050] border border-[#d3e4fe] dark:border-[#2b3e64] transition-colors cursor-pointer group"
                >
                  <div className={`w-7 h-7 rounded-lg text-white text-[11px] font-black flex items-center justify-center ${
                    user.role === 'donor' ? 'bg-[#ae3115]' : user.role === 'ngo' ? 'bg-[#1a2f4c]' : 'bg-[#0f766e]'
                  }`}>
                    {user.role === 'donor' && <Building2 className="w-3.5 h-3.5" />}
                    {user.role === 'ngo' && <Utensils className="w-3.5 h-3.5" />}
                    {user.role === 'volunteer' && <Truck className="w-3.5 h-3.5" />}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-bold text-[#0b1c30] dark:text-white leading-tight truncate max-w-[130px]">
                      {user.name}
                    </div>
                    <div className="text-[9px] uppercase font-extrabold text-[#ae3115] dark:text-[#ff7e62]">
                      {user.role === 'donor' ? 'Food Donor' : user.role === 'ngo' ? 'NGO Shelter' : 'Volunteer Driver'}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#565e74] dark:text-[#94a3b8] group-hover:text-[#0b1c30] dark:group-hover:text-white" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-30" 
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#111c30] rounded-2xl shadow-2xl border border-[#d3e4fe] dark:border-[#243452] py-2 z-40 animate-fadeIn">
                      
                      {/* Active Profile Header */}
                      <div className="px-4 py-3 border-b border-[#e5eeff] dark:border-[#243452] bg-[#f8f9ff] dark:bg-[#16243d]">
                        <div className="text-[10px] uppercase font-extrabold text-[#565e74] dark:text-[#94a3b8] tracking-wider mb-1">
                          Current Signed-in Person
                        </div>
                        <div className="text-xs font-bold text-[#0b1c30] dark:text-white">{user.name}</div>
                        <div className="text-[11px] text-[#565e74] dark:text-[#94a3b8] truncate">{user.email}</div>
                        {user.organization && (
                          <div className="text-[11px] font-semibold text-[#0b1c30] dark:text-[#cbd5e1] mt-0.5">
                            {user.organization}
                          </div>
                        )}
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            user.role === 'donor'
                              ? 'bg-[#ffdad2] dark:bg-[#ae3115]/30 text-[#8c1900] dark:text-[#ffb4a3]'
                              : user.role === 'ngo'
                              ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300'
                              : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300'
                          }`}>
                            {user.role === 'donor' ? 'Food Donor' : user.role === 'ngo' ? 'NGO Shelter' : 'Volunteer Driver'}
                          </span>
                          <span className="text-[10px] text-[#565e74] dark:text-[#94a3b8]">
                            • {user.city}
                          </span>
                        </div>
                      </div>

                      {/* Switch to Other Registered Persons */}
                      {otherAccounts.length > 0 && (
                        <div className="px-4 py-2 border-b border-[#e5eeff] dark:border-[#243452]">
                          <div className="text-[10px] uppercase font-extrabold text-[#565e74] dark:text-[#94a3b8] tracking-wider mb-2">
                            Switch to Another Person:
                          </div>
                          <div className="space-y-1.5">
                            {otherAccounts.map(account => (
                              <button
                                key={account.id}
                                onClick={() => {
                                  onSwitchAccount(account);
                                  setUserDropdownOpen(false);
                                }}
                                className="w-full p-2 text-left bg-[#eff4ff] dark:bg-[#16243d] hover:bg-[#ffdad2]/60 dark:hover:bg-[#203050] rounded-xl transition-all flex items-center justify-between gap-2 cursor-pointer border border-[#d3e4fe] dark:border-[#2b3e64]"
                              >
                                <div className="min-w-0">
                                  <div className="text-xs font-bold text-[#0b1c30] dark:text-white truncate">{account.name}</div>
                                  <div className="text-[10px] text-[#565e74] dark:text-[#94a3b8] truncate">
                                    {account.organization || account.email}
                                  </div>
                                </div>
                                <span className={`shrink-0 px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase ${
                                  account.role === 'donor'
                                    ? 'bg-[#ffdad2] dark:bg-[#ae3115]/30 text-[#8c1900] dark:text-[#ffb4a3]'
                                    : account.role === 'ngo'
                                    ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300'
                                    : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                                }`}>
                                  {account.role}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Register / Sign in as New Person with Specific Role */}
                      <div className="py-2 px-2 border-b border-[#e5eeff] dark:border-[#243452]">
                        <div className="text-[10px] uppercase font-extrabold text-[#565e74] dark:text-[#94a3b8] tracking-wider px-2 mb-1.5">
                          Add / Register Another Person:
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <button
                            onClick={() => {
                              onRegisterNewRole('donor');
                              setUserDropdownOpen(false);
                            }}
                            className="p-1.5 text-center bg-[#eff4ff] dark:bg-[#16243d] hover:bg-[#ffdad2] dark:hover:bg-[#203050] rounded-lg text-[10px] font-bold text-[#0b1c30] dark:text-white transition-colors cursor-pointer"
                          >
                            + Donor
                          </button>
                          <button
                            onClick={() => {
                              onRegisterNewRole('ngo');
                              setUserDropdownOpen(false);
                            }}
                            className="p-1.5 text-center bg-[#eff4ff] dark:bg-[#16243d] hover:bg-[#ffdad2] dark:hover:bg-[#203050] rounded-lg text-[10px] font-bold text-[#0b1c30] dark:text-white transition-colors cursor-pointer"
                          >
                            + NGO
                          </button>
                          <button
                            onClick={() => {
                              onRegisterNewRole('volunteer');
                              setUserDropdownOpen(false);
                            }}
                            className="p-1.5 text-center bg-[#eff4ff] dark:bg-[#16243d] hover:bg-[#ffdad2] dark:hover:bg-[#203050] rounded-lg text-[10px] font-bold text-[#0b1c30] dark:text-white transition-colors cursor-pointer"
                          >
                            + Driver
                          </button>
                        </div>
                      </div>

                      {/* Profile & Logout Links */}
                      <div className="py-1">
                        <button
                          onClick={() => { onOpenProfile(); setUserDropdownOpen(false); }}
                          className="w-full px-4 py-2 text-left text-xs font-semibold text-[#0b1c30] dark:text-white hover:bg-[#eff4ff] dark:hover:bg-[#16243d] flex items-center gap-2 cursor-pointer"
                        >
                          <User className="w-3.5 h-3.5 text-[#ae3115] dark:text-[#ff7e62]" />
                          <span>View Profile & Credentials</span>
                        </button>
                        
                        <button
                          onClick={() => { onOpenAuth('login'); setUserDropdownOpen(false); }}
                          className="w-full px-4 py-2 text-left text-xs font-semibold text-[#0b1c30] dark:text-white hover:bg-[#eff4ff] dark:hover:bg-[#16243d] flex items-center gap-2 cursor-pointer"
                        >
                          <LogIn className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Sign In / Switch Person</span>
                        </button>
                      </div>

                      <div className="pt-1 border-t border-[#e5eeff] dark:border-[#243452]">
                        <button
                          onClick={() => { onLogout(); setUserDropdownOpen(false); }}
                          className="w-full px-4 py-2 text-left text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  id="nav-btn-signin"
                  onClick={() => onOpenAuth('login')}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-[#0b1c30] dark:text-white hover:bg-[#eff4ff] dark:hover:bg-[#16243d] border border-transparent hover:border-[#d3e4fe] dark:hover:border-[#2b3e64] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#ae3115] dark:text-[#ff7e62]" />
                  <span>Sign In</span>
                </button>

                <button
                  id="nav-btn-register"
                  onClick={() => onOpenAuth('register')}
                  className="px-3.5 py-2 rounded-xl bg-[#ffdad2] dark:bg-[#ae3115]/30 hover:bg-[#ffb4a3] text-[#8c1900] dark:text-[#ffb4a3] text-xs font-extrabold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Mobile Sub-Navigation */}
      <div className="md:hidden flex items-center justify-around border-t border-[#e5eeff] dark:border-[#243452] px-2 py-1.5 bg-[#f8f9ff] dark:bg-[#0c1424] text-[11px] font-bold text-[#565e74] dark:text-[#94a3b8]">
        <button
          onClick={() => onSelectView('landing')}
          className={`py-1 px-2.5 rounded-lg cursor-pointer ${currentView === 'landing' ? 'text-[#ae3115] dark:text-[#ff7e62] bg-[#ffdad2] dark:bg-[#ae3115]/30' : ''}`}
        >
          Home
        </button>

        {isLoggedIn ? (
          <>
            <button
              onClick={() => onSelectView('portal')}
              className={`py-1 px-2 rounded-lg cursor-pointer ${currentView === 'portal' ? 'text-[#ae3115] dark:text-[#ff7e62] bg-[#ffdad2] dark:bg-[#ae3115]/30' : ''}`}
            >
              {user.role === 'donor' ? 'Donor Hub' : user.role === 'ngo' ? 'NGO Hub' : 'Driver Hub'}
            </button>
            <button
              onClick={() => onOpenProfile()}
              className="py-1 px-2 rounded-lg cursor-pointer text-[#0b1c30] dark:text-white"
            >
              Account
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onOpenAuth('login')}
              className="py-1 px-2.5 rounded-lg text-[#0b1c30] dark:text-white cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => onOpenAuth('register')}
              className="py-1 px-2.5 rounded-lg text-[#8c1900] dark:text-[#ffb4a3] bg-[#ffdad2] dark:bg-[#ae3115]/30 cursor-pointer"
            >
              Register
            </button>
          </>
        )}

        <button
          onClick={() => onSelectView('explore')}
          className={`py-1 px-2.5 rounded-lg cursor-pointer ${currentView === 'explore' ? 'text-[#ae3115] dark:text-[#ff7e62] bg-[#ffdad2] dark:bg-[#ae3115]/30' : ''}`}
        >
          Live Map
        </button>
      </div>
    </header>
  );
};
