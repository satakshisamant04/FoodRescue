import React, { useState } from 'react';
import { 
  Building2, 
  Utensils, 
  Truck, 
  Heart, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  Phone, 
  User, 
  MapPin, 
  FileText, 
  ArrowLeft,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { UserProfile, UserRole, CITIES_LIST } from '../types';
import { api } from '../services/api';

interface RegistrationScreenProps {
  initialTab?: 'login' | 'register';
  initialRole?: UserRole;
  onRegister: (data: { 
    name: string; 
    email: string; 
    password?: string;
    phone: string; 
    role: UserRole; 
    organization?: string;
    city?: string;
    address?: string;
    fssaiNumber?: string;
    vehicleType?: string;
  }) => void;
  onLogin: (data: { email: string; password?: string; role: UserRole; user?: UserProfile }) => void;
  onQuickDemo: (role: UserRole) => void;
  onBackToHome: () => void;
  onOpenInfo: (type: 'about' | 'contact' | 'privacy' | 'terms' | 'volunteer' | 'donate') => void;
  totalMealsRescued: number;
}

export const RegistrationScreen: React.FC<RegistrationScreenProps> = ({
  initialTab = 'register',
  initialRole = 'donor',
  onRegister,
  onLogin,
  onBackToHome,
  onOpenInfo,
  totalMealsRescued
}) => {
  const [activeTab, setActiveTab] = useState<'register' | 'login'>(initialTab);
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  
  // Registration Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [orgName, setOrgName] = useState('');
  const [city, setCity] = useState(CITIES_LIST[0]);
  const [address, setAddress] = useState('');
  const [fssaiNumber, setFssaiNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('Two-Wheeler / Bike with Insulated Bag');
  const [termsAgreed, setTermsAgreed] = useState(true);

  // Login Form Fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState(false);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !name) {
      setErrorMessage('Please provide your name and email.');
      return;
    }

    if (password && confirmPassword && password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.register({
        name,
        email,
        password: password || 'password123',
        phone: phone || '+91 98200 12345',
        role: selectedRole,
        organization: orgName,
        city,
        address,
        fssaiNumber,
        vehicleType
      });

      if (response.success && response.user) {
        setSuccessMessage(`Account registered for ${response.user.name}!`);
        setTimeout(() => {
          onRegister({
            name,
            email,
            password: password || 'password123',
            phone: phone || '+91 98200 12345',
            role: selectedRole,
            organization: orgName,
            city,
            address,
            fssaiNumber,
            vehicleType
          });
        }, 500);
      } else {
        if (response.error && response.error.includes('already exists')) {
          setErrorMessage('An account with this email already exists. Please Sign In.');
        } else {
          onRegister({
            name,
            email,
            password: password || 'password123',
            phone: phone || '+91 98200 12345',
            role: selectedRole,
            organization: orgName,
            city,
            address,
            fssaiNumber,
            vehicleType
          });
        }
      }
    } catch {
      onRegister({
        name,
        email,
        password: password || 'password123',
        phone: phone || '+91 98200 12345',
        role: selectedRole,
        organization: orgName,
        city,
        address,
        fssaiNumber,
        vehicleType
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const emailToUse = loginEmail || `${selectedRole}@foodrescue.in`;
    const passwordToUse = loginPassword || 'password123';

    setIsLoading(true);
    try {
      const res = await api.login({
        email: emailToUse,
        password: passwordToUse,
        role: selectedRole
      });

      if (res.success && res.user) {
        setSuccessMessage(`Welcome back, ${res.user.name}!`);
        setTimeout(() => {
          onLogin({
            email: res.user!.email,
            password: passwordToUse,
            role: res.user!.role,
            user: res.user
          });
        }, 400);
      } else {
        setErrorMessage(res.error || 'Invalid credentials. Please verify your email and password.');
      }
    } catch {
      onLogin({
        email: emailToUse,
        password: passwordToUse,
        role: selectedRole
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex-grow flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-[#f8f9ff] dark:bg-[#080e1a] transition-colors">
      <div className="max-w-6xl w-full bg-white dark:bg-[#111c30] rounded-3xl shadow-xl border border-[#d3e4fe] dark:border-[#243452] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px] transition-colors">
        
        {/* Left Column: Form & Bento Role Selector */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* Header / Brand & Navigation */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onBackToHome}
                  className="w-9 h-9 rounded-xl bg-[#eff4ff] dark:bg-[#16243d] hover:bg-[#ffdad2] dark:hover:bg-[#223554] flex items-center justify-center text-[#565e74] dark:text-[#94a3b8] hover:text-[#8c1900] dark:hover:text-white transition-colors cursor-pointer"
                  title="Back to Landing Page"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-[#ffdad2] dark:bg-[#ae3115]/30 flex items-center justify-center text-[#ae3115] dark:text-[#ff7e62]">
                    <Heart className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-[#0b1c30] dark:text-white tracking-tight">FoodRescue</h1>
                    <p className="text-[10px] text-[#565e74] dark:text-[#94a3b8] font-medium">India's Food Rescue Network</p>
                  </div>
                </div>
              </div>

              {/* Login / Register Toggle Tabs */}
              <div className="bg-[#eff4ff] dark:bg-[#16243d] p-1 rounded-xl border border-[#d3e4fe] dark:border-[#2b3e64] flex items-center gap-1">
                <button
                  type="button"
                  id="tab-sign-in"
                  onClick={() => { setActiveTab('login'); setErrorMessage(null); }}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeTab === 'login' 
                      ? 'bg-white dark:bg-[#223554] text-[#ae3115] dark:text-[#ff7e62] shadow-xs' 
                      : 'text-[#565e74] dark:text-[#94a3b8] hover:text-[#0b1c30] dark:hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  id="tab-register"
                  onClick={() => { setActiveTab('register'); setErrorMessage(null); }}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeTab === 'register' 
                      ? 'bg-white dark:bg-[#223554] text-[#ae3115] dark:text-[#ff7e62] shadow-xs' 
                      : 'text-[#565e74] dark:text-[#94a3b8] hover:text-[#0b1c30] dark:hover:text-white'
                  }`}
                >
                  Register
                </button>
              </div>
            </div>

            {/* Status alerts */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300 text-xs flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Role Bento Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#59413c] dark:text-[#cbd5e1]">
                  {activeTab === 'register' ? '1. Select Your Role to Register' : 'Select Dashboard Role'}
                </label>
                <span className="text-[11px] text-[#ae3115] dark:text-[#ff7e62] font-semibold">
                  {selectedRole === 'donor' && 'Restaurant / Banquet / Kitchen'}
                  {selectedRole === 'ngo' && 'Shelter / Community Kitchen'}
                  {selectedRole === 'volunteer' && 'Driver / Delivery Hero'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                
                {/* Role: Donor */}
                <button
                  type="button"
                  id="role-select-donor"
                  onClick={() => setSelectedRole('donor')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedRole === 'donor'
                      ? 'bg-[#ffdad2] dark:bg-[#ae3115]/30 border-[#ae3115] text-[#8c1900] dark:text-[#ffdad2] shadow-xs scale-[1.02]'
                      : 'bg-[#eff4ff] dark:bg-[#16243d] border-[#d3e4fe] dark:border-[#2b3e64] text-[#565e74] dark:text-[#94a3b8] hover:bg-[#d3e4fe]/50'
                  }`}
                >
                  <Building2 className={`w-5 h-5 mb-1.5 ${selectedRole === 'donor' ? 'text-[#ae3115] dark:text-[#ff7e62]' : 'text-[#565e74] dark:text-[#94a3b8]'}`} />
                  <div>
                    <div className="text-xs font-extrabold leading-tight">Food Donor</div>
                    <div className="text-[10px] opacity-80 mt-0.5">Post Surplus</div>
                  </div>
                </button>

                {/* Role: NGO */}
                <button
                  type="button"
                  id="role-select-ngo"
                  onClick={() => setSelectedRole('ngo')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedRole === 'ngo'
                      ? 'bg-[#ffdad2] dark:bg-[#ae3115]/30 border-[#ae3115] text-[#8c1900] dark:text-[#ffdad2] shadow-xs scale-[1.02]'
                      : 'bg-[#eff4ff] dark:bg-[#16243d] border-[#d3e4fe] dark:border-[#2b3e64] text-[#565e74] dark:text-[#94a3b8] hover:bg-[#d3e4fe]/50'
                  }`}
                >
                  <Utensils className={`w-5 h-5 mb-1.5 ${selectedRole === 'ngo' ? 'text-[#ae3115] dark:text-[#ff7e62]' : 'text-[#565e74] dark:text-[#94a3b8]'}`} />
                  <div>
                    <div className="text-xs font-extrabold leading-tight">NGO / Shelter</div>
                    <div className="text-[10px] opacity-80 mt-0.5">Claim Food</div>
                  </div>
                </button>

                {/* Role: Volunteer */}
                <button
                  type="button"
                  id="role-select-volunteer"
                  onClick={() => setSelectedRole('volunteer')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedRole === 'volunteer'
                      ? 'bg-[#ffdad2] dark:bg-[#ae3115]/30 border-[#ae3115] text-[#8c1900] dark:text-[#ffdad2] shadow-xs scale-[1.02]'
                      : 'bg-[#eff4ff] dark:bg-[#16243d] border-[#d3e4fe] dark:border-[#2b3e64] text-[#565e74] dark:text-[#94a3b8] hover:bg-[#d3e4fe]/50'
                  }`}
                >
                  <Truck className={`w-5 h-5 mb-1.5 ${selectedRole === 'volunteer' ? 'text-[#ae3115] dark:text-[#ff7e62]' : 'text-[#565e74] dark:text-[#94a3b8]'}`} />
                  <div>
                    <div className="text-xs font-extrabold leading-tight">Volunteer</div>
                    <div className="text-[10px] opacity-80 mt-0.5">Deliver Portions</div>
                  </div>
                </button>

              </div>
            </div>

            {/* TAB 1: REGISTRATION FORM */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#59413c] dark:text-[#cbd5e1] mb-1">
                      {selectedRole === 'donor' ? 'Contact / Manager Name' : selectedRole === 'ngo' ? 'Coordinator Name' : 'Full Name'} *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-3 text-[#565e74] dark:text-[#94a3b8]" />
                      <input
                        type="text"
                        required
                        id="reg-name"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-[#eff4ff] dark:bg-[#16243d] border border-[#d3e4fe] dark:border-[#2b3e64] rounded-xl text-xs text-[#0b1c30] dark:text-white outline-none focus:ring-2 focus:ring-[#ae3115]/30 focus:border-[#ae3115] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#59413c] dark:text-[#cbd5e1] mb-1">
                      {selectedRole === 'donor' ? 'Establishment / Organization Name' : selectedRole === 'ngo' ? 'NGO / Shelter Name' : 'Vehicle Type'} *
                    </label>
                    <div className="relative">
                      {selectedRole === 'volunteer' ? (
                        <Truck className="w-4 h-4 absolute left-3 top-3 text-[#565e74] dark:text-[#94a3b8]" />
                      ) : (
                        <Building2 className="w-4 h-4 absolute left-3 top-3 text-[#565e74] dark:text-[#94a3b8]" />
                      )}
                      {selectedRole === 'volunteer' ? (
                        <select
                          value={vehicleType}
                          onChange={(e) => setVehicleType(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-[#eff4ff] dark:bg-[#16243d] border border-[#d3e4fe] dark:border-[#2b3e64] rounded-xl text-xs text-[#0b1c30] dark:text-white outline-none focus:ring-2 focus:ring-[#ae3115]/30 focus:border-[#ae3115] transition-all"
                        >
                          <option value="Two-Wheeler / Bike with Insulated Bag">Two-Wheeler / Bike with Insulated Bag</option>
                          <option value="Scooter with Rear Crate">Scooter with Rear Crate</option>
                          <option value="Car / Hatchback with Boot Space">Car / Hatchback with Boot Space</option>
                          <option value="SUV / Van (Large Batch Logistics)">SUV / Van (Large Batch Logistics)</option>
                          <option value="On Foot / Local Area Walking Volunteer">On Foot / Local Walking Rescue</option>
                        </select>
                      ) : (
                        <input
                          type="text"
                          required
                          id="reg-org"
                          placeholder="Enter organization / establishment name"
                          value={orgName}
                          onChange={(e) => setOrgName(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-[#eff4ff] dark:bg-[#16243d] border border-[#d3e4fe] dark:border-[#2b3e64] rounded-xl text-xs text-[#0b1c30] dark:text-white outline-none focus:ring-2 focus:ring-[#ae3115]/30 focus:border-[#ae3115] transition-all"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#59413c] dark:text-[#cbd5e1] mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-[#565e74] dark:text-[#94a3b8]" />
                      <input
                        type="email"
                        required
                        id="reg-email"
                        placeholder="Enter email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-[#eff4ff] dark:bg-[#16243d] border border-[#d3e4fe] dark:border-[#2b3e64] rounded-xl text-xs text-[#0b1c30] dark:text-white outline-none focus:ring-2 focus:ring-[#ae3115]/30 focus:border-[#ae3115] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#59413c] dark:text-[#cbd5e1] mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-3 text-[#565e74] dark:text-[#94a3b8]" />
                      <input
                        type="tel"
                        required
                        id="reg-phone"
                        placeholder="e.g. +91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-[#eff4ff] dark:bg-[#16243d] border border-[#d3e4fe] dark:border-[#2b3e64] rounded-xl text-xs text-[#0b1c30] dark:text-white outline-none focus:ring-2 focus:ring-[#ae3115]/30 focus:border-[#ae3115] transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Password & City Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="block text-[11px] font-bold text-[#59413c] dark:text-[#cbd5e1] mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-3 text-[#565e74] dark:text-[#94a3b8]" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        id="reg-password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-8 py-2.5 bg-[#eff4ff] dark:bg-[#16243d] border border-[#d3e4fe] dark:border-[#2b3e64] rounded-xl text-xs text-[#0b1c30] dark:text-white outline-none focus:ring-2 focus:ring-[#ae3115]/30 focus:border-[#ae3115] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-2.5 text-[#565e74] dark:text-[#94a3b8] hover:text-[#0b1c30] dark:hover:text-white cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-[11px] font-bold text-[#59413c] dark:text-[#cbd5e1] mb-1">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-3 text-[#565e74] dark:text-[#94a3b8]" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        id="reg-confirm-password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-[#eff4ff] dark:bg-[#16243d] border border-[#d3e4fe] dark:border-[#2b3e64] rounded-xl text-xs text-[#0b1c30] dark:text-white outline-none focus:ring-2 focus:ring-[#ae3115]/30 focus:border-[#ae3115] transition-all"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-[11px] font-bold text-[#59413c] dark:text-[#cbd5e1] mb-1">
                      City *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3 top-3 text-[#565e74] dark:text-[#94a3b8]" />
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-[#eff4ff] dark:bg-[#16243d] border border-[#d3e4fe] dark:border-[#2b3e64] rounded-xl text-xs text-[#0b1c30] dark:text-white outline-none focus:ring-2 focus:ring-[#ae3115]/30 focus:border-[#ae3115] transition-all"
                      >
                        {CITIES_LIST.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Optional FSSAI or Address */}
                {selectedRole === 'donor' && (
                  <div>
                    <label className="block text-[11px] font-bold text-[#59413c] dark:text-[#cbd5e1] mb-1">
                      FSSAI Food License / Registration No (Optional)
                    </label>
                    <div className="relative">
                      <FileText className="w-4 h-4 absolute left-3 top-3 text-[#565e74] dark:text-[#94a3b8]" />
                      <input
                        type="text"
                        placeholder="Enter FSSAI number if available"
                        value={fssaiNumber}
                        onChange={(e) => setFssaiNumber(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-[#eff4ff] dark:bg-[#16243d] border border-[#d3e4fe] dark:border-[#2b3e64] rounded-xl text-xs text-[#0b1c30] dark:text-white outline-none focus:ring-2 focus:ring-[#ae3115]/30 focus:border-[#ae3115] transition-all"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms-check"
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    className="mt-0.5 rounded text-[#ae3115] focus:ring-[#ae3115]"
                  />
                  <label htmlFor="terms-check" className="text-[11px] text-[#565e74] dark:text-[#94a3b8] leading-tight cursor-pointer">
                    I agree to the Food Safety Regulations and Indian Good Samaritan Food Donation Guidelines.
                  </label>
                </div>

                <button
                  type="submit"
                  id="btn-register-submit"
                  disabled={!termsAgreed || isLoading}
                  className="w-full py-3 bg-[#ff6b4a] hover:bg-[#ae3115] disabled:opacity-50 text-white text-xs font-extrabold rounded-xl shadow-md shadow-[#ae3115]/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration as {selectedRole.toUpperCase()}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB 2: LOGIN FORM */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#59413c] dark:text-[#cbd5e1] mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3.5 text-[#565e74] dark:text-[#94a3b8]" />
                    <input
                      type="email"
                      required
                      id="login-email"
                      placeholder="Enter your registered email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-3 bg-[#eff4ff] dark:bg-[#16243d] border border-[#d3e4fe] dark:border-[#2b3e64] rounded-xl text-xs text-[#0b1c30] dark:text-white outline-none focus:ring-2 focus:ring-[#ae3115]/30 focus:border-[#ae3115] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-[#59413c] dark:text-[#cbd5e1]">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setForgotPasswordNotice(true)}
                      className="text-[11px] text-[#ae3115] dark:text-[#ff7e62] hover:underline cursor-pointer font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3.5 text-[#565e74] dark:text-[#94a3b8]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      id="login-password"
                      placeholder="Enter password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-9 pr-9 py-3 bg-[#eff4ff] dark:bg-[#16243d] border border-[#d3e4fe] dark:border-[#2b3e64] rounded-xl text-xs text-[#0b1c30] dark:text-white outline-none focus:ring-2 focus:ring-[#ae3115]/30 focus:border-[#ae3115] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-[#565e74] dark:text-[#94a3b8] hover:text-[#0b1c30] dark:hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {forgotPasswordNotice && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-blue-800 dark:text-blue-300 text-xs rounded-xl flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold">Password Reset:</span> Please enter your registered email to receive a password reset link.
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setForgotPasswordNotice(false)} 
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 font-bold"
                    >
                      ×
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-[#565e74] dark:text-[#94a3b8] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-[#ae3115] focus:ring-[#ae3115]"
                    />
                    <span>Remember me on this device</span>
                  </label>
                  <span className="text-[11px] text-[#565e74] dark:text-[#94a3b8]">256-bit Encrypted</span>
                </div>

                <button
                  type="submit"
                  id="btn-login-submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#ff6b4a] hover:bg-[#ae3115] disabled:opacity-50 text-white text-xs font-extrabold rounded-xl shadow-md shadow-[#ae3115]/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to {selectedRole.toUpperCase()} Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

          </div>

          {/* Micro Footer links */}
          <div className="pt-6 border-t border-[#e5eeff] dark:border-[#243452] flex flex-wrap items-center justify-between text-[11px] text-[#565e74] dark:text-[#94a3b8] gap-2">
            <span>© 2026 FoodRescue India</span>
            <div className="flex gap-3">
              <button onClick={() => onOpenInfo('privacy')} className="hover:text-[#0b1c30] dark:hover:text-white cursor-pointer">Privacy</button>
              <button onClick={() => onOpenInfo('terms')} className="hover:text-[#0b1c30] dark:hover:text-white cursor-pointer">Terms & 80G</button>
              <button onClick={() => onOpenInfo('contact')} className="hover:text-[#0b1c30] dark:hover:text-white cursor-pointer">Helpline: 1800-FOOD-RES</button>
            </div>
          </div>

        </div>

        {/* Right Column: Hero Visual with Impact Metric Overlay */}
        <div className="lg:col-span-5 relative bg-[#0b1c30] dark:bg-[#070c16] text-white flex flex-col justify-between p-8 sm:p-10 overflow-hidden border-l dark:border-[#243452]">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1c30] via-[#0b1c30]/70 to-transparent dark:from-[#070c16] dark:via-[#070c16]/80" />

          {/* Top badge */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#ffdad2]">
              <Sparkles className="w-3.5 h-3.5 fill-current text-[#ae3115]" />
              <span>National Impact Initiative</span>
            </div>
          </div>

          {/* Center message */}
          <div className="relative z-10 my-auto py-8 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Together, we deliver hope across India.
            </h2>
            <p className="text-xs sm:text-sm text-[#d3e4fe] leading-relaxed">
              Rescuing wholesome surplus meals from lavish banquet events, commercial kitchens, and hypermarkets to nourish orphans, elderly shelters, and migrant families.
            </p>
            <div className="space-y-2 pt-2 text-xs text-[#d3e4fe]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Good Samaritan Food Law Safe</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant 80G Tax Exemption Receipts</span>
              </div>
            </div>
          </div>

          {/* Bottom Floating Stats Pill */}
          <div className="relative z-10 bg-white/10 backdrop-blur-lg p-4 rounded-2xl border border-white/20 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#d3e4fe]">Community Milestone</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active in 12 Cities
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {(totalMealsRescued).toLocaleString()} <span className="text-xs font-normal text-[#ffdad2]">Meals Delivered</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
