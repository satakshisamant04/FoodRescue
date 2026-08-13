import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// In-Memory fallback store with initial realistic Indian data
interface FoodDonationItem {
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

interface FundDonation {
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

interface NGOBroadcast {
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

// Initial Sample Data in INR & Indian Cities
interface StoredUser {
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

let users: StoredUser[] = [];

let donations: FoodDonationItem[] = [];

let fundDonations: FundDonation[] = [];

let ngobroadcasts: NGOBroadcast[] = [];

let stats = {
  totalMealsRescued: 0,
  totalKgSaved: 0,
  co2PreventedKg: 0,
  totalRupeesDonated: 0,
  activeVolunteers: 0,
  verifiedNGOs: 0,
  partnerRestaurants: 0
};

// API ROUTES
// Auth Routes
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password, phone, role, organization, city, address, fssaiNumber, vehicleType } = req.body;

  if (!email || !role) {
    return res.status(400).json({ success: false, error: 'Email and role are required' });
  }

  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ success: false, error: 'An account with this email already exists' });
  }

  const newUser: StoredUser = {
    id: `user-${role}-${Date.now()}`,
    name: name || (role === 'donor' ? 'Partner Food Donor' : role === 'ngo' ? 'Shelter Director' : 'Volunteer Hero'),
    email: email.toLowerCase(),
    password: password || 'password123',
    phone: phone || '+91 98200 12345',
    role,
    organization: organization || (role === 'donor' ? `${name || 'Commercial'} Kitchen` : role === 'ngo' ? `${name || 'Community'} Shelter` : undefined),
    city: city || 'Bhubaneswar (Odisha)',
    address: address || '',
    fssaiNumber: fssaiNumber || undefined,
    vehicleType: vehicleType || (role === 'volunteer' ? 'Two-Wheeler with Insulated Food Bag' : undefined),
    joinedDate: 'Today',
    stats: {
      mealsCount: 0,
      donationsCount: 0,
      deliveriesCount: 0,
      volunteerHours: 0
    }
  };

  users.push(newUser);

  // Update platform stats
  if (role === 'donor') stats.partnerRestaurants += 1;
  if (role === 'ngo') stats.verifiedNGOs += 1;
  if (role === 'volunteer') stats.activeVolunteers += 1;

  const { password: _, ...safeUser } = newUser;
  res.status(201).json({
    success: true,
    user: safeUser,
    token: `jwt_token_${newUser.id}_${Date.now()}`,
    message: 'Account created successfully!'
  });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password, role } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }

  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    // If user doesn't exist yet, return helpful error
    return res.status(404).json({ 
      success: false, 
      error: 'No account found with this email. Please click Register to create your account as a Food Donor, NGO, or Volunteer Driver.' 
    });
  }

  if (password && user.password && user.password !== password) {
    return res.status(401).json({ success: false, error: 'Invalid password. Please check your credentials.' });
  }

  const { password: _, ...safeUser } = user;
  res.json({
    success: true,
    user: safeUser,
    token: `jwt_token_${user.id}_${Date.now()}`,
    message: `Welcome back, ${user.name}!`
  });
});

app.get('/api/auth/users', (_req: Request, res: Response) => {
  const safeList = users.map(({ password: _, ...u }) => u);
  res.json({ success: true, users: safeList });
});

app.get('/api/auth/demo-users', (_req: Request, res: Response) => {
  const safeList = users.map(({ password: _, ...u }) => u);
  res.json({ success: true, users: safeList });
});

app.get('/api/stats', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: stats
  });
});

app.get('/api/donations', (req: Request, res: Response) => {
  const { status, city, category } = req.query;
  let filtered = [...donations];

  if (status && typeof status === 'string' && status !== 'all') {
    filtered = filtered.filter(d => d.status === status);
  }
  if (city && typeof city === 'string' && city !== 'all') {
    filtered = filtered.filter(d => d.city.toLowerCase().includes(city.toLowerCase()));
  }
  if (category && typeof category === 'string' && category !== 'all') {
    filtered = filtered.filter(d => d.category === category);
  }

  res.json({
    success: true,
    data: filtered,
    count: filtered.length
  });
});

app.post('/api/donations', (req: Request, res: Response) => {
  const body = req.body;
  const newDonation: FoodDonationItem = {
    id: `food-ind-${Date.now()}`,
    donorId: body.donorId || 'donor-guest',
    donorName: body.donorName || 'Generous Donor',
    donorType: body.donorType || 'Restaurant',
    title: body.title || 'Fresh Food Surplus',
    category: body.category || 'cooked_meals',
    servings: Number(body.servings) || 50,
    weightKg: Number(body.weightKg) || Math.round((Number(body.servings) || 50) * 0.25),
    storage: body.storage || 'ambient',
    vegNonVeg: body.vegNonVeg || 'pure_veg',
    preparedAt: body.preparedAt || 'Today',
    expiryTime: body.expiryTime || 'In 4 hours',
    pickupWindow: body.pickupWindow || 'Today 5:00 PM - 8:00 PM',
    address: body.address || 'Central District',
    city: body.city || 'Mumbai',
    locality: body.locality || 'Downtown',
    status: 'available',
    contactPhone: body.contactPhone || '+91 98000 00000',
    notes: body.notes,
    image: body.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    createdAt: 'Just now'
  };

  donations.unshift(newDonation);

  res.status(201).json({
    success: true,
    data: newDonation,
    message: 'Food surplus listed successfully for rescue!'
  });
});

// NGO Claim
app.patch('/api/donations/:id/claim', (req: Request, res: Response) => {
  const { id } = req.params;
  const { ngoId, ngoName, ngoContact, ngoAddress, deliveryType } = req.body;

  const itemIndex = donations.findIndex(d => d.id === id);
  if (itemIndex === -1) {
    return res.status(404).json({ success: false, error: 'Donation not found' });
  }

  donations[itemIndex].status = 'claimed';
  donations[itemIndex].claimedByNGO = {
    id: ngoId || 'ngo-user',
    name: ngoName || 'Community Shelter & Kitchen',
    contact: ngoContact || '+91 98000 12345',
    address: ngoAddress || 'Shelter Facility',
    claimedAt: 'Just now'
  };

  // Leave assignedVolunteer undefined if volunteer delivery requested so real volunteers can accept
  if (deliveryType === 'self_pickup') {
    donations[itemIndex].assignedVolunteer = undefined;
  }

  res.json({
    success: true,
    data: donations[itemIndex],
    message: 'Food surplus claimed successfully!'
  });
});

// Volunteer / Status update
app.patch('/api/donations/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, volunteerName, volunteerPhone, volunteerVehicle } = req.body;

  const itemIndex = donations.findIndex(d => d.id === id);
  if (itemIndex === -1) {
    return res.status(404).json({ success: false, error: 'Donation not found' });
  }

  if (status) {
    donations[itemIndex].status = status;
    if (status === 'completed') {
      stats.totalMealsRescued += donations[itemIndex].servings;
      stats.totalKgSaved += donations[itemIndex].weightKg;
      stats.co2PreventedKg += Math.round(donations[itemIndex].weightKg * 2.5);
    }
  }

  if (volunteerName) {
    donations[itemIndex].assignedVolunteer = {
      id: `vol-${Date.now()}`,
      name: volunteerName,
      phone: volunteerPhone || '+91 99000 11223',
      vehicle: volunteerVehicle || 'Two-Wheeler / Bike with Insulated Box',
      status: status === 'in_transit' ? 'picked_up' : status === 'completed' ? 'delivered' : 'en_route_pickup'
    };
  } else if (donations[itemIndex].assignedVolunteer && status) {
    if (status === 'in_transit') {
      donations[itemIndex].assignedVolunteer!.status = 'picked_up';
    } else if (status === 'completed') {
      donations[itemIndex].assignedVolunteer!.status = 'delivered';
    }
  }

  res.json({
    success: true,
    data: donations[itemIndex],
    message: 'Status updated successfully'
  });
});

// NGO Broadcasts
app.get('/api/broadcasts', (_req: Request, res: Response) => {
  res.json({ success: true, data: ngobroadcasts });
});

app.post('/api/broadcasts', (req: Request, res: Response) => {
  const body = req.body;
  const newBroadcast: NGOBroadcast = {
    id: `broad-${Date.now()}`,
    ngoName: body.ngoName || 'Urgent Shelter Kitchen',
    location: body.location || 'Metro Area',
    requiredServings: Number(body.requiredServings) || 50,
    foodType: body.foodType || 'Nutritious Cooked Meals',
    urgency: body.urgency || 'high',
    timeNeededBy: body.timeNeededBy || 'Today evening',
    contactPerson: body.contactPerson || 'Coordinator',
    contactPhone: body.contactPhone || '+91 98000 00000',
    createdAt: 'Just now'
  };

  ngobroadcasts.unshift(newBroadcast);
  res.status(201).json({ success: true, data: newBroadcast });
});

// Money Donation in INR (Rupees)
app.post('/api/donate-funds', (req: Request, res: Response) => {
  const { donorName, donorEmail, donorPan, amountRupees } = req.body;
  const amount = Number(amountRupees) || 100;
  // In India: ~ ₹10 rescues and transports 1 wholesome hot meal
  const mealsSponsored = Math.floor(amount / 10);

  const donationRecord: FundDonation = {
    id: `fund-${Date.now()}`,
    donorName: donorName || 'Kind Donor',
    donorEmail: donorEmail || 'donor@example.com',
    donorPan: donorPan || undefined,
    amountRupees: amount,
    mealsSponsored,
    timestamp: 'Just now',
    paymentId: `UPI_RZP_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    taxExemptionEligible: true
  };

  fundDonations.unshift(donationRecord);
  stats.totalRupeesDonated += amount;
  stats.totalMealsRescued += mealsSponsored;

  res.status(201).json({
    success: true,
    data: donationRecord,
    message: `Thank you! Sponsoring ₹${amount} feeds ${mealsSponsored} vulnerable people.`
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 FoodRescue server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
