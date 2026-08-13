import { FoodDonation, ActivityItem, UserProfile, NGOBroadcastRequest, PlatformStats } from '../types';

export const INITIAL_PLATFORM_STATS: PlatformStats = {
  totalMealsRescued: 0,
  totalKgSaved: 0,
  co2PreventedKg: 0,
  totalRupeesDonated: 0,
  activeVolunteers: 0,
  verifiedNGOs: 0,
  partnerRestaurants: 0
};

export const MOCK_USERS: Record<string, UserProfile> = {};

// Clean slate: start with completely empty lists so user can enter everything themselves
export const INITIAL_DONATIONS: FoodDonation[] = [];
export const INITIAL_ACTIVITIES: ActivityItem[] = [];
export const INITIAL_BROADCASTS: NGOBroadcastRequest[] = [];
