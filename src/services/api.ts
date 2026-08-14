import { ActivityItem, FoodDonation, NGOBroadcastRequest, PlatformStats, UserProfile, UserRole } from '../types';

export const api = {
  async register(userData: {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    role: UserRole;
    organization?: string;
    city?: string;
    address?: string;
    fssaiNumber?: string;
    vehicleType?: string;
  }): Promise<{ success: boolean; user?: UserProfile; token?: string; error?: string; message?: string }> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      return data;
    } catch {
      return { success: false, error: 'Failed to connect to authentication server' };
    }
  },

  async login(credentials: {
    email: string;
    password?: string;
    role?: UserRole;
  }): Promise<{ success: boolean; user?: UserProfile; token?: string; error?: string; message?: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await res.json();
      return data;
    } catch {
      return { success: false, error: 'Failed to connect to authentication server' };
    }
  },

  async getMe(email: string): Promise<UserProfile | null> {
    try {
      const res = await fetch(`/api/auth/me?email=${encodeURIComponent(email)}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.user || null;
    } catch {
      return null;
    }
  },

  async getDemoUsers(): Promise<UserProfile[] | null> {
    try {
      const res = await fetch('/api/auth/demo-users');
      if (!res.ok) return null;
      const data = await res.json();
      return data.users;
    } catch {
      return null;
    }
  },

  async deleteUser(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/auth/users/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      return Boolean(data.success);
    } catch {
      return false;
    }
  },

  async getDbStatus(): Promise<{ success: boolean; engine: string; isMongo: boolean; totalUsers: number; totalDonations: number } | null> {
    try {
      const res = await fetch('/api/db-status');
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async getStats(): Promise<PlatformStats | null> {
    try {
      const res = await fetch('/api/stats');
      if (!res.ok) return null;
      const data = await res.json();
      return data.data;
    } catch {
      return null;
    }
  },

  async getActivities(): Promise<ActivityItem[] | null> {
    try {
      const res = await fetch('/api/activities');
      if (!res.ok) return null;
      const data = await res.json();
      return data.data;
    } catch {
      return null;
    }
  },

  async getDonations(): Promise<FoodDonation[] | null> {
    try {
      const res = await fetch('/api/donations');
      if (!res.ok) return null;
      const data = await res.json();
      return data.data;
    } catch {
      return null;
    }
  },

  async createDonation(donationData: Partial<FoodDonation>): Promise<FoodDonation | null> {
    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donationData)
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.data;
    } catch {
      return null;
    }
  },

  async claimDonation(
    id: string,
    ngoDetails: { id: string; name: string; contact: string; address: string; claimedAt?: string; deliveryType?: string }
  ): Promise<FoodDonation | null> {
    try {
      const res = await fetch(`/api/donations/${id}/claim`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ngoId: ngoDetails.id,
          ngoName: ngoDetails.name,
          ngoContact: ngoDetails.contact,
          ngoAddress: ngoDetails.address,
          deliveryType: ngoDetails.deliveryType || 'Standard Volunteer Dispatch'
        })
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.data;
    } catch {
      return null;
    }
  },

  async assignVolunteer(
    id: string,
    volunteerDetails: { id: string; name: string; phone: string; vehicle: string }
  ): Promise<FoodDonation | null> {
    try {
      const res = await fetch(`/api/donations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'in_transit',
          volunteerName: volunteerDetails.name,
          volunteerPhone: volunteerDetails.phone,
          volunteerVehicle: volunteerDetails.vehicle
        })
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.data;
    } catch {
      return null;
    }
  },

  async updateVolunteerStatus(
    id: string,
    status: 'picked_up' | 'delivered',
    volunteerId?: string
  ): Promise<FoodDonation | null> {
    try {
      const res = await fetch(`/api/donations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: status === 'delivered' ? 'completed' : 'in_transit',
          volunteerId
        })
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.data;
    } catch {
      return null;
    }
  },

  async updateDonationStatus(
    id: string,
    statusData: { status?: string; volunteerName?: string; volunteerPhone?: string; volunteerVehicle?: string }
  ): Promise<FoodDonation | null> {
    try {
      const res = await fetch(`/api/donations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(statusData)
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.data;
    } catch {
      return null;
    }
  },

  async getBroadcasts(): Promise<NGOBroadcastRequest[] | null> {
    try {
      const res = await fetch('/api/broadcasts');
      if (!res.ok) return null;
      const data = await res.json();
      return data.data;
    } catch {
      return null;
    }
  },

  async createBroadcast(broadcast: Partial<NGOBroadcastRequest>): Promise<NGOBroadcastRequest | null> {
    try {
      const res = await fetch('/api/broadcasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(broadcast)
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.data;
    } catch {
      return null;
    }
  },

  async donateFunds(payload: {
    donorName: string;
    donorEmail: string;
    donorPan?: string;
    amountRupees: number;
  }) {
    try {
      const res = await fetch('/api/donate-funds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }
};
