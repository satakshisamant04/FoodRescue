import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { initDatabase, db, StoredUser, FoodDonationItem, NGOBroadcast, FundDonation } from './src/server/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(cors());
app.use(express.json());

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// DB Status Endpoint
app.get('/api/db-status', (_req: Request, res: Response) => {
  res.json({
    success: true,
    engine: db.isMongo() ? 'MongoDB (Atlas / Remote Cluster)' : 'Local Persistent Database (data/db.json)',
    isMongo: db.isMongo(),
    totalUsers: db.getUsers().length,
    totalDonations: db.getDonations().length
  });
});

// Auth Routes
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role, organization, city, address, fssaiNumber, vehicleType } = req.body;

    if (!email || !role) {
      return res.status(400).json({ success: false, error: 'Email and role are required' });
    }

    const existing = db.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, error: 'An account with this email already exists' });
    }

    const newUser: StoredUser = {
      id: `user-${role}-${Date.now()}`,
      name: name || (role === 'donor' ? 'Partner Food Donor' : role === 'ngo' ? 'Shelter Director' : 'Volunteer Hero'),
      email: email.toLowerCase(),
      password: password || 'password123',
      phone: phone || '+91 94370 12345',
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
        volunteerHours: 0,
        totalRupeesContributed: 0
      }
    };

    const saved = await db.createUser(newUser);
    const { password: _, ...safeUser } = saved;

    res.status(201).json({
      success: true,
      user: safeUser,
      token: `jwt_token_${saved.id}_${Date.now()}`,
      message: 'Account created and saved to database successfully!'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password, role } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }

  const user = db.findUserByEmail(email);

  if (!user) {
    return res.status(404).json({ 
      success: false, 
      error: 'No account found with this email. Please click Register to create your account as a Food Donor, NGO, or Volunteer Driver.' 
    });
  }

  if (password && user.password && user.password !== password) {
    return res.status(401).json({ success: false, error: 'Invalid password. Please check your credentials.' });
  }

  if (role && user.role !== role) {
    // Return the user anyway with their real role or switch
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
  const safeList = db.getUsers().map(({ password: _, ...u }) => u);
  res.json({ success: true, users: safeList });
});

app.get('/api/auth/demo-users', (_req: Request, res: Response) => {
  const safeList = db.getUsers().map(({ password: _, ...u }) => u);
  res.json({ success: true, users: safeList });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const email = req.query.email as string;
  const id = req.query.id as string;
  if (!email && !id) {
    return res.status(400).json({ success: false, error: 'Email or id required' });
  }
  const user = email ? db.findUserByEmail(email) : db.findUserById(id);
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }
  const { password: _, ...safeUser } = user;
  res.json({ success: true, user: safeUser });
});

// Platform Stats
app.get('/api/stats', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: db.getStats()
  });
});

// Activity Feed
app.get('/api/activities', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: db.getActivities()
  });
});

// Food Donations
app.get('/api/donations', (req: Request, res: Response) => {
  const { status, city, category } = req.query;
  const filtered = db.getDonations({
    status: status as string,
    city: city as string,
    category: category as string
  });

  res.json({
    success: true,
    data: filtered,
    count: filtered.length
  });
});

app.post('/api/donations', async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const newDonation: FoodDonationItem = {
      id: body.id || `food-ind-${Date.now()}`,
      donorId: body.donorId || 'donor-guest',
      donorName: body.donorName || 'Generous Donor',
      donorType: body.donorType || 'Restaurant',
      title: body.title || 'Fresh Food Surplus',
      category: body.category || 'cooked_meals',
      servings: Number(body.servings) || 25,
      weightKg: Number(body.weightKg) || Math.round((Number(body.servings) || 25) * 0.25),
      storage: body.storage || 'ambient',
      vegNonVeg: body.vegNonVeg || 'pure_veg',
      preparedAt: body.preparedAt || 'Freshly prepared',
      expiryTime: body.expiryTime || 'In 4 hours',
      pickupWindow: body.pickupWindow || 'Immediate pickup available',
      address: body.address || 'Central District',
      city: body.city || 'Bhubaneswar (Odisha)',
      locality: body.locality || 'Local Area',
      status: 'available',
      contactPhone: body.contactPhone || '+91 94370 12345',
      notes: body.notes,
      image: body.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
      createdAt: 'Just now',
      milestones: [
        {
          status: 'available',
          title: 'Food Surplus Broadcasted',
          timestamp: 'Just now',
          description: `Listed ${body.servings || 25} portions from ${body.donorName || 'Donor'}`
        }
      ]
    };

    const saved = await db.createDonation(newDonation);

    res.status(201).json({
      success: true,
      data: saved,
      message: 'Food surplus listed and saved to database!'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// NGO Claim
app.patch('/api/donations/:id/claim', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { ngoId, ngoName, ngoContact, ngoAddress } = req.body;

    const updated = await db.claimDonation(id, {
      id: ngoId || 'ngo-user',
      name: ngoName || 'Community Shelter',
      contact: ngoContact || '+91 94370 12345',
      address: ngoAddress || 'Shelter Facility'
    });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Donation not found' });
    }

    res.json({
      success: true,
      data: updated,
      message: 'Food surplus claimed successfully and synced to database!'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// Volunteer / Status update
app.patch('/api/donations/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, volunteerName, volunteerPhone, volunteerVehicle, volunteerId } = req.body;

    let updated: FoodDonationItem | null = null;

    if (volunteerName && status === 'in_transit') {
      updated = await db.assignVolunteer(id, {
        id: volunteerId || `vol-${Date.now()}`,
        name: volunteerName,
        phone: volunteerPhone || '+91 94370 12345',
        vehicle: volunteerVehicle || 'Two-Wheeler / Bike with Insulated Box'
      });
    } else if (status === 'picked_up' || status === 'delivered' || status === 'completed') {
      const normalizedStatus = status === 'completed' || status === 'delivered' ? 'delivered' : 'picked_up';
      updated = await db.updateVolunteerStatus(id, normalizedStatus, volunteerId);
    } else if (status) {
      updated = await db.updateDonation(id, { status: status as FoodDonationItem['status'] });
    }

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Donation not found' });
    }

    res.json({
      success: true,
      data: updated,
      message: 'Status updated and stored in database'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// NGO Broadcasts
app.get('/api/broadcasts', (_req: Request, res: Response) => {
  res.json({ success: true, data: db.getBroadcasts() });
});

app.post('/api/broadcasts', async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const newBroadcast: NGOBroadcast = {
      id: `broad-${Date.now()}`,
      ngoName: body.ngoName || 'Urgent Shelter Kitchen',
      location: body.location || 'Bhubaneswar (Odisha)',
      requiredServings: Number(body.requiredServings) || 50,
      foodType: body.foodType || 'Nutritious Cooked Meals',
      urgency: body.urgency || 'high',
      timeNeededBy: body.timeNeededBy || 'Today evening',
      contactPerson: body.contactPerson || 'Shelter Coordinator',
      contactPhone: body.contactPhone || '+91 94370 12345',
      createdAt: 'Just now'
    };

    const saved = await db.createBroadcast(newBroadcast);
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// Money Donation in INR (Rupees)
app.post('/api/donate-funds', async (req: Request, res: Response) => {
  try {
    const { donorName, donorEmail, donorPan, amountRupees } = req.body;
    const amount = Number(amountRupees) || 100;
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

    const saved = await db.createFundDonation(donationRecord);

    res.status(201).json({
      success: true,
      data: saved,
      message: `Thank you! Sponsoring ₹${amount} feeds ${mealsSponsored} vulnerable people.`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// -------------------------------------------------------------
// Server Start
// -------------------------------------------------------------
async function startServer() {
  // Initialize MongoDB / Disk Store
  await initDatabase();

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
    console.log(`🚀 FoodRescue server running on http://0.0.0.0:${PORT} with persistent database store`);
  });
}

startServer();
