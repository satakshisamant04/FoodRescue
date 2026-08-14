import mongoose, { Schema } from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data Directory for persistent backup JSON
const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// -------------------------------------------------------------
// TypeScript Interfaces
// -------------------------------------------------------------
export interface StoredUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  role: 'donor' | 'ngo' | 'volunteer';
  organization?: string;
  city: string;
  address?: string;
  fssaiNumber?: string;
  vehicleType?: string;
  joinedDate: string;
  stats: {
    mealsCount: number;
    donationsCount: number;
    deliveriesCount: number;
    volunteerHours: number;
    totalRupeesContributed?: number;
  };
}

export interface FoodDonationItem {
  id: string;
  donorId: string;
  donorName: string;
  donorType: 'Restaurant' | 'Hotel' | 'Catering' | 'Bakery' | 'Supermarket' | 'Corporate' | 'Individual';
  title: string;
  category: 'cooked_meals' | 'bakery' | 'produce' | 'dairy' | 'packaged';
  servings: number;
  weightKg: number;
  storage: 'ambient' | 'refrigerated' | 'frozen';
  vegNonVeg: 'pure_veg' | 'non_veg' | 'egg';
  preparedAt: string;
  expiryTime: string;
  pickupWindow: string;
  address: string;
  city: string;
  locality: string;
  status: 'available' | 'claimed' | 'in_transit' | 'completed';
  contactPhone: string;
  notes?: string;
  image?: string;
  createdAt: string;
  dispatchedAt?: string;
  deliveredAt?: string;
  milestones?: Array<{
    status: 'posted' | 'available' | 'claimed' | 'dispatched' | 'picked_up' | 'in_transit' | 'delivered' | 'completed';
    title: string;
    timestamp: string;
    description: string;
    actorName?: string;
    location?: string;
  }>;
  claimedByNGO?: {
    id: string;
    name: string;
    contact: string;
    address: string;
    claimedAt: string;
  };
  assignedVolunteer?: {
    id: string;
    name: string;
    phone: string;
    vehicle: string;
    status: 'assigned' | 'en_route_pickup' | 'picked_up' | 'en_route_delivery' | 'delivered';
  };
}

export interface NGOBroadcast {
  id: string;
  ngoName: string;
  location: string;
  requiredServings: number;
  foodType: string;
  urgency: 'high' | 'critical' | 'medium';
  timeNeededBy: string;
  contactPerson: string;
  contactPhone: string;
  createdAt: string;
}

export interface FundDonation {
  id: string;
  donorName: string;
  donorEmail: string;
  donorPan?: string;
  amountRupees: number;
  mealsSponsored: number;
  timestamp: string;
  paymentId: string;
  taxExemptionEligible: boolean;
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  message: string;
  type: 'donation_posted' | 'donation_claimed' | 'delivery_completed' | 'urgent_broadcast' | 'funds_donated';
  meals: number;
  location: string;
  amountRupees?: number;
}

export interface PlatformStats {
  totalMealsRescued: number;
  totalKgSaved: number;
  co2PreventedKg: number;
  totalRupeesDonated: number;
  activeVolunteers: number;
  verifiedNGOs: number;
  partnerRestaurants: number;
}

// -------------------------------------------------------------
// Mongoose Schemas & Models
// -------------------------------------------------------------
const UserSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String },
  phone: { type: String, default: '+91 94370 12345' },
  role: { type: String, required: true, enum: ['donor', 'ngo', 'volunteer'] },
  organization: { type: String },
  city: { type: String, default: 'Bhubaneswar (Odisha)' },
  address: { type: String, default: '' },
  fssaiNumber: { type: String },
  vehicleType: { type: String },
  joinedDate: { type: String, default: 'Today' },
  stats: {
    mealsCount: { type: Number, default: 0 },
    donationsCount: { type: Number, default: 0 },
    deliveriesCount: { type: Number, default: 0 },
    volunteerHours: { type: Number, default: 0 },
    totalRupeesContributed: { type: Number, default: 0 }
  }
}, { timestamps: true, strict: false });

const DonationSchema = new Schema({
  id: { type: String, required: true, unique: true },
  donorId: { type: String, required: true },
  donorName: { type: String, required: true },
  donorType: { type: String, default: 'Restaurant' },
  title: { type: String, required: true },
  category: { type: String, default: 'cooked_meals' },
  servings: { type: Number, default: 0 },
  weightKg: { type: Number, default: 0 },
  storage: { type: String, default: 'ambient' },
  vegNonVeg: { type: String, default: 'pure_veg' },
  preparedAt: { type: String, default: 'Freshly prepared' },
  expiryTime: { type: String, default: 'In 4 hours' },
  pickupWindow: { type: String, default: 'Immediate' },
  address: { type: String, default: '' },
  city: { type: String, default: 'Bhubaneswar (Odisha)' },
  locality: { type: String, default: 'Local Area' },
  status: { type: String, default: 'available' },
  contactPhone: { type: String, default: '+91 94370 12345' },
  notes: { type: String },
  image: { type: String },
  createdAt: { type: String, default: 'Just now' },
  dispatchedAt: { type: String },
  deliveredAt: { type: String },
  milestones: { type: Array, default: [] },
  claimedByNGO: { type: Schema.Types.Mixed },
  assignedVolunteer: { type: Schema.Types.Mixed }
}, { timestamps: true, strict: false });

const BroadcastSchema = new Schema({
  id: { type: String, required: true, unique: true },
  ngoName: { type: String, required: true },
  location: { type: String, required: true },
  requiredServings: { type: Number, required: true },
  foodType: { type: String, required: true },
  urgency: { type: String, default: 'high' },
  timeNeededBy: { type: String, required: true },
  contactPerson: { type: String, required: true },
  contactPhone: { type: String, required: true },
  createdAt: { type: String, default: 'Just now' }
}, { timestamps: true, strict: false });

const FundDonationSchema = new Schema({
  id: { type: String, required: true, unique: true },
  donorName: { type: String, required: true },
  donorEmail: { type: String, required: true },
  donorPan: { type: String },
  amountRupees: { type: Number, required: true },
  mealsSponsored: { type: Number, required: true },
  timestamp: { type: String, default: 'Just now' },
  paymentId: { type: String, required: true },
  taxExemptionEligible: { type: Boolean, default: true }
}, { timestamps: true, strict: false });

const ActivitySchema = new Schema({
  id: { type: String, required: true, unique: true },
  timestamp: { type: String, default: 'Just now' },
  message: { type: String, required: true },
  type: { type: String, required: true },
  meals: { type: Number, default: 0 },
  location: { type: String, default: '' },
  amountRupees: { type: Number }
}, { timestamps: true, strict: false });

const PlatformStatsSchema = new Schema({
  totalMealsRescued: { type: Number, default: 0 },
  totalKgSaved: { type: Number, default: 0 },
  co2PreventedKg: { type: Number, default: 0 },
  totalRupeesDonated: { type: Number, default: 0 },
  activeVolunteers: { type: Number, default: 0 },
  verifiedNGOs: { type: Number, default: 0 },
  partnerRestaurants: { type: Number, default: 0 }
}, { timestamps: true, strict: false });

export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
export const DonationModel = mongoose.models.Donation || mongoose.model('Donation', DonationSchema);
export const BroadcastModel = mongoose.models.Broadcast || mongoose.model('Broadcast', BroadcastSchema);
export const FundDonationModel = mongoose.models.FundDonation || mongoose.model('FundDonation', FundDonationSchema);
export const ActivityModel = mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);
export const PlatformStatsModel = mongoose.models.PlatformStats || mongoose.model('PlatformStats', PlatformStatsSchema);

// -------------------------------------------------------------
// In-Memory Cache with Disk & MongoDB synchronization
// -------------------------------------------------------------
interface DatabaseStore {
  users: StoredUser[];
  donations: FoodDonationItem[];
  broadcasts: NGOBroadcast[];
  fundDonations: FundDonation[];
  activities: ActivityItem[];
  stats: PlatformStats;
}

const defaultStats: PlatformStats = {
  totalMealsRescued: 0,
  totalKgSaved: 0,
  co2PreventedKg: 0,
  totalRupeesDonated: 0,
  activeVolunteers: 0,
  verifiedNGOs: 0,
  partnerRestaurants: 0
};

let store: DatabaseStore = {
  users: [],
  donations: [],
  broadcasts: [],
  fundDonations: [],
  activities: [],
  stats: { ...defaultStats }
};

let isMongoConnected = false;

// Save current state to local JSON file for bulletproof persistence
function saveToDisk() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB] Error writing to disk store:', err);
  }
}

// Load from disk file
function loadFromDisk() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      if (raw.trim()) {
        const parsed = JSON.parse(raw);
        store = {
          users: parsed.users || [],
          donations: parsed.donations || [],
          broadcasts: parsed.broadcasts || [],
          fundDonations: parsed.fundDonations || [],
          activities: parsed.activities || [],
          stats: parsed.stats || { ...defaultStats }
        };
        console.log(`[DB] Successfully loaded persistent data from disk (${store.users.length} users, ${store.donations.length} donations)`);
      }
    }
  } catch (err) {
    console.error('[DB] Error reading from disk store:', err);
  }
}

// Initialize Database (MongoDB + Disk Fallback)
export async function initDatabase(): Promise<void> {
  // Always load disk database first so data is immediately available
  loadFromDisk();

  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;

  if (mongoUri) {
    try {
      console.log('[DB] Connecting to MongoDB cluster...');
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000
      });
      isMongoConnected = true;
      console.log('[DB] MongoDB Connected Successfully!');

      // Hydrate memory from MongoDB if MongoDB has data
      const dbUsers = await (UserModel as any).find().lean();
      const dbDonations = await (DonationModel as any).find().lean();
      const dbBroadcasts = await (BroadcastModel as any).find().lean();
      const dbFunds = await (FundDonationModel as any).find().lean();
      const dbActivities = await (ActivityModel as any).find().lean();
      const dbStats = await (PlatformStatsModel as any).findOne().lean();

      if (dbUsers.length > 0 || dbDonations.length > 0) {
        store.users = (dbUsers as unknown as StoredUser[]) || [];
        store.donations = (dbDonations as unknown as FoodDonationItem[]) || [];
        store.broadcasts = (dbBroadcasts as unknown as NGOBroadcast[]) || [];
        store.fundDonations = (dbFunds as unknown as FundDonation[]) || [];
        store.activities = (dbActivities as unknown as ActivityItem[]) || [];
        if (dbStats) {
          const s = dbStats as unknown as PlatformStats;
          store.stats = {
            totalMealsRescued: s.totalMealsRescued || 0,
            totalKgSaved: s.totalKgSaved || 0,
            co2PreventedKg: s.co2PreventedKg || 0,
            totalRupeesDonated: s.totalRupeesDonated || 0,
            activeVolunteers: s.activeVolunteers || 0,
            verifiedNGOs: s.verifiedNGOs || 0,
            partnerRestaurants: s.partnerRestaurants || 0
          };
        }
        saveToDisk();
      } else if (store.users.length > 0 || store.donations.length > 0) {
        // Seed MongoDB from local disk data
        console.log('[DB] Seeding MongoDB from local storage...');
        if (store.users.length) await (UserModel as any).insertMany(store.users);
        if (store.donations.length) await (DonationModel as any).insertMany(store.donations);
        if (store.broadcasts.length) await (BroadcastModel as any).insertMany(store.broadcasts);
        if (store.fundDonations.length) await (FundDonationModel as any).insertMany(store.fundDonations);
        if (store.activities.length) await (ActivityModel as any).insertMany(store.activities);
        await (PlatformStatsModel as any).create(store.stats);
      }
    } catch (error) {
      console.warn('[DB] Could not connect to MongoDB cluster, falling back seamlessly to persistent disk store:', (error as Error).message);
      isMongoConnected = false;
    }
  } else {
    console.log('[DB] No MONGODB_URI found. Operating with persistent local storage in data/db.json.');
  }
}

// -------------------------------------------------------------
// Database Operations (CRUD) with dual MongoDB & Disk sync
// -------------------------------------------------------------
export const db = {
  isMongo(): boolean {
    return isMongoConnected;
  },

  // USERS
  getUsers(): StoredUser[] {
    return store.users;
  },

  findUserByEmail(email: string): StoredUser | undefined {
    return store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  findUserById(id: string): StoredUser | undefined {
    return store.users.find(u => u.id === id);
  },

  async createUser(user: StoredUser): Promise<StoredUser> {
    store.users = store.users.filter(u => u.email.toLowerCase() !== user.email.toLowerCase());
    store.users.unshift(user);

    // Update stats count
    if (user.role === 'donor') store.stats.partnerRestaurants += 1;
    if (user.role === 'ngo') store.stats.verifiedNGOs += 1;
    if (user.role === 'volunteer') store.stats.activeVolunteers += 1;

    saveToDisk();

    if (isMongoConnected) {
      try {
        await (UserModel as any).findOneAndUpdate({ id: user.id }, user, { upsert: true, new: true }).exec();
        await (PlatformStatsModel as any).findOneAndUpdate({}, store.stats, { upsert: true }).exec();
      } catch (err) {
        console.error('[DB-Mongo] Error saving user to MongoDB:', err);
      }
    }

    return user;
  },

  async updateUser(id: string, updates: Partial<StoredUser>): Promise<StoredUser | null> {
    const idx = store.users.findIndex(u => u.id === id);
    if (idx === -1) return null;

    store.users[idx] = { ...store.users[idx], ...updates };
    saveToDisk();

    if (isMongoConnected) {
      try {
        await (UserModel as any).findOneAndUpdate({ id }, { $set: updates }).exec();
      } catch (err) {
        console.error('[DB-Mongo] Error updating user in MongoDB:', err);
      }
    }

    return store.users[idx];
  },

  // DONATIONS
  getDonations(filters?: { status?: string; city?: string; category?: string }): FoodDonationItem[] {
    let result = [...store.donations];
    if (filters?.status && filters.status !== 'all') {
      result = result.filter(d => d.status === filters.status);
    }
    if (filters?.city && filters.city !== 'all') {
      result = result.filter(d => d.city.toLowerCase().includes(filters.city!.toLowerCase()));
    }
    if (filters?.category && filters.category !== 'all') {
      result = result.filter(d => d.category === filters.category);
    }
    return result;
  },

  findDonationById(id: string): FoodDonationItem | undefined {
    return store.donations.find(d => d.id === id);
  },

  async createDonation(donation: FoodDonationItem): Promise<FoodDonationItem> {
    store.donations.unshift(donation);

    // Update stats
    store.stats.totalMealsRescued += donation.servings || 0;
    store.stats.totalKgSaved += donation.weightKg || 0;
    store.stats.co2PreventedKg += Math.round((donation.weightKg || 0) * 2.5);

    // Update donor stats
    const donor = store.users.find(u => u.id === donation.donorId);
    if (donor) {
      donor.stats.donationsCount += 1;
      donor.stats.mealsCount += donation.servings || 0;
    }

    // Add activity
    const activity: ActivityItem = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      message: `${donation.donorName} listed ${donation.servings} portions of ${donation.title}`,
      type: 'donation_posted',
      meals: donation.servings,
      location: donation.city
    };
    store.activities.unshift(activity);

    saveToDisk();

    if (isMongoConnected) {
      try {
        await (DonationModel as any).create(donation);
        await (ActivityModel as any).create(activity);
        if (donor) await (UserModel as any).findOneAndUpdate({ id: donor.id }, { $set: donor }).exec();
        await (PlatformStatsModel as any).findOneAndUpdate({}, store.stats, { upsert: true }).exec();
      } catch (err) {
        console.error('[DB-Mongo] Error saving donation to MongoDB:', err);
      }
    }

    return donation;
  },

  async updateDonation(id: string, updates: Partial<FoodDonationItem>): Promise<FoodDonationItem | null> {
    const idx = store.donations.findIndex(d => d.id === id);
    if (idx === -1) return null;

    store.donations[idx] = { ...store.donations[idx], ...updates };
    saveToDisk();

    if (isMongoConnected) {
      try {
        await (DonationModel as any).findOneAndUpdate({ id }, { $set: updates }).exec();
      } catch (err) {
        console.error('[DB-Mongo] Error updating donation in MongoDB:', err);
      }
    }

    return store.donations[idx];
  },

  async claimDonation(
    id: string, 
    ngo: { id: string; name: string; contact: string; address: string; claimedAt?: string }
  ): Promise<FoodDonationItem | null> {
    const donation = store.donations.find(d => d.id === id);
    if (!donation) return null;

    const claimedTime = ngo.claimedAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    donation.status = 'claimed';
    donation.claimedByNGO = {
      id: ngo.id,
      name: ngo.name,
      contact: ngo.contact,
      address: ngo.address,
      claimedAt: `Today, ${claimedTime}`
    };

    donation.milestones = donation.milestones || [];
    donation.milestones.push({
      status: 'claimed',
      title: `Claimed by ${ngo.name}`,
      timestamp: 'Just now',
      description: `Assigned to shelter. Ready for volunteer dispatch.`
    });

    // Update NGO user stats
    const ngoUser = store.users.find(u => u.id === ngo.id || u.name === ngo.name);
    if (ngoUser) {
      ngoUser.stats.donationsCount += 1;
      ngoUser.stats.mealsCount += donation.servings;
    }

    const activity: ActivityItem = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      message: `${ngo.name} claimed ${donation.servings} meals (${donation.title})`,
      type: 'donation_claimed',
      meals: donation.servings,
      location: donation.city
    };
    store.activities.unshift(activity);

    saveToDisk();

    if (isMongoConnected) {
      try {
        await (DonationModel as any).findOneAndUpdate({ id }, { $set: donation }).exec();
        await (ActivityModel as any).create(activity);
        if (ngoUser) await (UserModel as any).findOneAndUpdate({ id: ngoUser.id }, { $set: ngoUser }).exec();
      } catch (err) {
        console.error('[DB-Mongo] Error updating claim in MongoDB:', err);
      }
    }

    return donation;
  },

  async assignVolunteer(
    id: string,
    volunteer: { id: string; name: string; phone: string; vehicle: string }
  ): Promise<FoodDonationItem | null> {
    const donation = store.donations.find(d => d.id === id);
    if (!donation) return null;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    donation.status = 'in_transit';
    donation.dispatchedAt = `Dispatched at ${timeStr}`;
    donation.assignedVolunteer = {
      id: volunteer.id,
      name: volunteer.name,
      phone: volunteer.phone,
      vehicle: volunteer.vehicle,
      status: 'en_route_pickup'
    };

    donation.milestones = donation.milestones || [];
    donation.milestones.push({
      status: 'in_transit',
      title: `Mission Accepted by ${volunteer.name}`,
      timestamp: 'Just now',
      description: `Rider en route to pickup location.`
    });

    const activity: ActivityItem = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      message: `Volunteer ${volunteer.name} accepted mission for ${donation.title} (${donation.servings} portions)`,
      type: 'delivery_completed',
      meals: donation.servings,
      location: donation.city
    };
    store.activities.unshift(activity);

    saveToDisk();

    if (isMongoConnected) {
      try {
        await (DonationModel as any).findOneAndUpdate({ id }, { $set: donation }).exec();
        await (ActivityModel as any).create(activity);
      } catch (err) {
        console.error('[DB-Mongo] Error in assignVolunteer MongoDB:', err);
      }
    }

    return donation;
  },

  async updateVolunteerStatus(
    id: string,
    status: 'picked_up' | 'delivered',
    volunteerId?: string
  ): Promise<FoodDonationItem | null> {
    const donation = store.donations.find(d => d.id === id);
    if (!donation) return null;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isCompleted = status === 'delivered';

    donation.status = isCompleted ? 'completed' : 'in_transit';
    if (isCompleted) {
      donation.deliveredAt = `Delivered at ${timestamp}`;
    }

    if (donation.assignedVolunteer) {
      donation.assignedVolunteer.status = isCompleted ? 'delivered' : 'picked_up';
    }

    donation.milestones = donation.milestones || [];
    donation.milestones.push({
      status: isCompleted ? 'delivered' : 'picked_up',
      title: isCompleted ? 'Delivered & Distributed' : 'Picked up from Donor',
      timestamp: `Today, ${timestamp}`,
      description: isCompleted 
        ? `Delivered by ${donation.assignedVolunteer?.name || 'Volunteer'}. Handed over fresh.` 
        : 'Collected safely in thermal carrier.'
    });

    if (isCompleted && donation.assignedVolunteer) {
      const vId = volunteerId || donation.assignedVolunteer.id;
      const vUser = store.users.find(u => u.id === vId || u.name === donation.assignedVolunteer?.name);
      if (vUser) {
        vUser.stats.deliveriesCount += 1;
        vUser.stats.mealsCount += donation.servings;
        vUser.stats.volunteerHours += 1;
        if (isMongoConnected) {
          (UserModel as any).findOneAndUpdate({ id: vUser.id }, { $set: vUser }).exec().catch(console.error);
        }
      }

      const activity: ActivityItem = {
        id: `act-${Date.now()}`,
        timestamp: 'Just now',
        message: `DELIVERED: ${donation.servings} meals distributed to ${donation.claimedByNGO?.name || 'Shelter'}`,
        type: 'delivery_completed',
        meals: donation.servings,
        location: donation.city
      };
      store.activities.unshift(activity);
    }

    saveToDisk();

    if (isMongoConnected) {
      try {
        await (DonationModel as any).findOneAndUpdate({ id }, { $set: donation }).exec();
      } catch (err) {
        console.error('[DB-Mongo] Error in updateVolunteerStatus MongoDB:', err);
      }
    }

    return donation;
  },

  // BROADCASTS
  getBroadcasts(): NGOBroadcast[] {
    return store.broadcasts;
  },

  async createBroadcast(broadcast: NGOBroadcast): Promise<NGOBroadcast> {
    store.broadcasts.unshift(broadcast);

    const activity: ActivityItem = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      message: `URGENT BROADCAST: ${broadcast.ngoName} requested ${broadcast.requiredServings} servings of ${broadcast.foodType}`,
      type: 'urgent_broadcast',
      meals: broadcast.requiredServings,
      location: broadcast.location
    };
    store.activities.unshift(activity);

    saveToDisk();

    if (isMongoConnected) {
      try {
        await (BroadcastModel as any).create(broadcast);
        await (ActivityModel as any).create(activity);
      } catch (err) {
        console.error('[DB-Mongo] Error saving broadcast to MongoDB:', err);
      }
    }

    return broadcast;
  },

  // FUND DONATIONS
  getFundDonations(): FundDonation[] {
    return store.fundDonations;
  },

  async createFundDonation(donation: FundDonation): Promise<FundDonation> {
    store.fundDonations.unshift(donation);

    store.stats.totalRupeesDonated += donation.amountRupees;
    store.stats.totalMealsRescued += donation.mealsSponsored;

    // Update user stats if matches donorEmail
    const donorUser = store.users.find(u => u.email.toLowerCase() === donation.donorEmail.toLowerCase());
    if (donorUser) {
      donorUser.stats.totalRupeesContributed = (donorUser.stats.totalRupeesContributed || 0) + donation.amountRupees;
      donorUser.stats.mealsCount += donation.mealsSponsored;
    }

    const activity: ActivityItem = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      message: `${donation.donorName} sponsored ₹${donation.amountRupees.toLocaleString()} (${donation.mealsSponsored} rescue meals funded)`,
      type: 'funds_donated',
      meals: donation.mealsSponsored,
      amountRupees: donation.amountRupees,
      location: 'Community Fund'
    };
    store.activities.unshift(activity);

    saveToDisk();

    if (isMongoConnected) {
      try {
        await (FundDonationModel as any).create(donation);
        await (ActivityModel as any).create(activity);
        if (donorUser) await (UserModel as any).findOneAndUpdate({ id: donorUser.id }, { $set: donorUser }).exec();
        await (PlatformStatsModel as any).findOneAndUpdate({}, store.stats, { upsert: true }).exec();
      } catch (err) {
        console.error('[DB-Mongo] Error saving fund donation to MongoDB:', err);
      }
    }

    return donation;
  },

  // ACTIVITIES
  getActivities(): ActivityItem[] {
    return store.activities;
  },

  // STATS
  getStats(): PlatformStats {
    return store.stats;
  }
};
