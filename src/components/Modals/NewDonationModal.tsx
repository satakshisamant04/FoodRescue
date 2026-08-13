import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Utensils
} from 'lucide-react';
import { FoodDonation, UserProfile, CITIES_LIST } from '../../types';

interface NewDonationModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (donation: Partial<FoodDonation>) => void;
  presetCategory?: string;
}

export const NewDonationModal: React.FC<NewDonationModalProps> = ({
  user,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'cooked_meals' | 'bakery' | 'produce' | 'dairy' | 'packaged'>('cooked_meals');
  const [vegNonVeg, setVegNonVeg] = useState<'pure_veg' | 'non_veg' | 'egg'>('pure_veg');
  const [servings, setServings] = useState<string>('');
  const [weightKg, setWeightKg] = useState<string>('');
  const [storage, setStorage] = useState<'ambient' | 'refrigerated' | 'frozen'>('ambient');
  const [preparedAt, setPreparedAt] = useState('');
  const [expiryTime, setExpiryTime] = useState('');
  const [pickupWindow, setPickupWindow] = useState('');
  const [address, setAddress] = useState(user.address || '');
  const [city, setCity] = useState(user.city || CITIES_LIST[0]);
  const [notes, setNotes] = useState('');
  const [contactPhone, setContactPhone] = useState(user.phone || '');
  const [image] = useState('https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numServings = Number(servings) || 10;
    const numWeight = Number(weightKg) || Math.max(1, Math.round(numServings * 0.25));

    onSubmit({
      title: title.trim(),
      category,
      vegNonVeg,
      servings: numServings,
      weightKg: numWeight,
      storage,
      preparedAt: preparedAt || 'Freshly prepared today',
      expiryTime: expiryTime || 'In 4 hours',
      pickupWindow: pickupWindow || 'Immediate pickup available',
      address: address || user.address || 'Central City Hub',
      city: city || user.city || CITIES_LIST[0],
      locality: 'Local Area',
      notes,
      contactPhone: contactPhone || user.phone || '+91 98765 43210',
      image
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-[#111c30] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#d3e4fe] dark:border-[#243452] my-8 max-h-[90vh] flex flex-col transition-colors">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-[#e5eeff] dark:border-[#243452]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#ffdad2] dark:bg-[#ae3115]/30 flex items-center justify-center text-[#ae3115] dark:text-[#ff7e62]">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#0b1c30] dark:text-white">Post Surplus Food Batch</h2>
              <p className="text-xs text-[#565e74] dark:text-[#94a3b8]">Automated match with verified community shelters & volunteer drivers</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#565e74] dark:text-[#94a3b8] hover:text-[#0b1c30] dark:hover:text-white p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 py-4 overflow-y-auto pr-1 text-xs">
          
          {/* Title */}
          <div>
            <label className="block text-[11px] font-bold text-[#59413c] dark:text-[#cbd5e1] mb-1">
              Food Title & Description *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Fresh Paneer Gravy, Dal Tadka & 100 Butter Rotis"
              className="w-full px-3.5 py-2.5 bg-[#eff4ff] dark:bg-[#16243d] border border-[#d3e4fe] dark:border-[#2b3e64] rounded-xl text-xs text-[#0b1c30] dark:text-white outline-none focus:ring-2 focus:ring-[#ae3115]"
            />
          </div>

          {/* Diet & Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-[#59413c] dark:text-[#cbd5e1] mb-1">Dietary Classification *</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setVegNonVeg('pure_veg')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    vegNonVeg === 'pure_veg' 
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-300' 
                      : 'bg-[#eff4ff] dark:bg-[#16243d] border-[#d3e4fe] dark:border-[#2b3e64] text-[#565e74] dark:text-[#94a3b8]'
                  }`}
                >
                  🟢 Pure Veg
                </button>
                <button
                  type="button"
                  onClick={() => setVegNonVeg('non_veg')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    vegNonVeg === 'non_veg' 
                      ? 'bg-red-100 dark:bg-red-950/60 border-red-500 text-red-900 dark:text-red-300' 
                      : 'bg-[#eff4ff] dark:bg-[#16243d] border-[#d3e4fe] dark:border-[#2b3e64] text-[#565e74] dark:text-[#94a3b8]'
                  }`}
                >
                  🔴 Non-Veg
                </button>
                <button
                  type="button"
                  onClick={() => setVegNonVeg('egg')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    vegNonVeg === 'egg' 
                      ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-500 text-amber-900 dark:text-amber-300' 
                      : 'bg-[#eff4ff] dark:bg-[#16243d] border-[#d3e4fe] dark:border-[#2b3e64] text-[#565e74] dark:text-[#94a3b8]'
                  }`}
                >
                  🟡 Contains Egg
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#59413c] dark:text-[#cbd5e1] mb-1">Food Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-[#eff4ff] dark:bg-[#16243d] border border-[#d3e4fe] dark:border-[#2b3e64] rounded-xl text-xs font-bold text-[#0b1c30] dark:text-white outline-none"
              >
                <option value="cooked_meals">🍲 Cooked Meals (Hot Gravies, Rice, Breads)</option>
                <option value="bakery">🍞 Bakery & Bread</option>
                <option value="produce">🥦 Fresh Vegetables & Fruits</option>
                <option value="dairy">🥛 Dairy & Paneer</option>
                <option value="packaged">📦 Packaged & Canned Goods</option>
              </select>
            </div>
          </div>

          {/* Portions & Weight */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#59413c] dark:text-[#cbd5e1] mb-1">Portions (Servings) *</label>
              <input
                type="number"
                min="1"
                required
                value={servings}
                onChange={(e) => {
                  const val = e.target.value;
                  setServings(val);
                  const s = Number(val);
                  if (s > 0) {
                    setWeightKg(String(Math.max(1, Math.round(s * 0.25))));
                  }
                }}
                placeholder="e.g. 50"
                className="w-full px-3.5 py-2 bg-[#eff4ff] dark:bg-[#16243d] border border-[#d3e4fe] dark:border-[#2b3e64] rounded-xl text-xs text-[#0b1c30] dark:text-white outline-none focus:ring-2 focus:ring-[#ae3115]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#59413c] dark:text-[#cbd5e1] mb-1">Approx. Weight (kg)</label>
              <input
                type="number"
                min="1"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="e.g. 12"
                className="w-full px-3.5 py-2 bg-[#eff4ff] dark:bg-[#16243d] border border-[#d3e4fe] dark:border-[#2b3e64] rounded-xl text-xs text-[#0b1c30] dark:text-white outline-none focus:ring-2 focus:ring-[#ae3115]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#59413c] dark:text-[#cbd5e1] mb-1">Storage Condition</label>
              <select
                value={storage}
                onChange={(e) => setStorage(e.target.value as any)}
                className="w-full px-3.5 py-2 bg-[#eff4ff] dark:bg-[#16243d] border border-[#d3e4fe] dark:border-[#2b3e64] rounded-xl text-xs font-bold text-[#0b1c30] dark:text-white outline-none"
              >
                <option value="ambient">Ambient / Insulated Container</option>
                <option value="refrigerated">Refrigerated (Below 5°C)</option>
                <option value="frozen">Frozen (Below 0°C)</option>
              </select>
            </div>
          </div>

          {/* Timers & Pickup */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#59413c] dark:text-[#cbd5e1] mb-1">Safe Expiry Timer</label>
              <input
                type="text"
                value={expiryTime}
                onChange={(e) => setExpiryTime(e.target.value)}
                placeholder="e.g. In 3.5 hours"
                className="w-full px-3.5 py-2 bg-[#eff4ff] dark:bg-[#16243d] border border-[#d3e4fe] dark:border-[#2b3e64] rounded-xl text-xs text-[#0b1c30] dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#59413c] dark:text-[#cbd5e1] mb-1">Pickup Time Window</label>
              <input
                type="text"
                value={pickupWindow}
                onChange={(e) => setPickupWindow(e.target.value)}
                placeholder="e.g. Today 5:00 PM - 7:30 PM"
                className="w-full px-3.5 py-2 bg-[#eff4ff] dark:bg-[#16243d] border border-[#d3e4fe] dark:border-[#2b3e64] rounded-xl text-xs text-[#0b1c30] dark:text-white outline-none"
              />
            </div>
          </div>

          {/* Location & Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#59413c] dark:text-[#cbd5e1] mb-1">Pickup Address *</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Gate / Street / Locality"
                className="w-full px-3.5 py-2 bg-[#eff4ff] dark:bg-[#16243d] border border-[#d3e4fe] dark:border-[#2b3e64] rounded-xl text-xs text-[#0b1c30] dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#59413c] dark:text-[#cbd5e1] mb-1">City / Region *</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#eff4ff] dark:bg-[#16243d] border border-[#d3e4fe] dark:border-[#2b3e64] rounded-xl text-xs font-bold text-[#0b1c30] dark:text-white outline-none"
              >
                {CITIES_LIST.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Special notes */}
          <div>
            <label className="block text-[11px] font-bold text-[#59413c] dark:text-[#cbd5e1] mb-1">Packaging / Special Handling Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Stored in 3 large thermal food-grade milk cans; bring extra carrying crates."
              className="w-full px-3.5 py-2 bg-[#eff4ff] dark:bg-[#16243d] border border-[#d3e4fe] dark:border-[#2b3e64] rounded-xl text-xs text-[#0b1c30] dark:text-white outline-none"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-[#ff6b4a] hover:bg-[#ae3115] text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Broadcast Surplus for Instant Rescue</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
