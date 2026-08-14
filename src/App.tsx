import React, { useState, useEffect } from 'react';
import { UserRole, UserProfile, FoodDonation, ActivityItem, PlatformStats } from './types';
import { INITIAL_DONATIONS, INITIAL_ACTIVITIES, INITIAL_PLATFORM_STATS } from './data/mockData';
import { api } from './services/api';
import { LandingPage } from './components/LandingPage';
import { RegistrationScreen } from './components/RegistrationScreen';
import { Navbar } from './components/Navbar';
import { DonorPortal } from './components/DonorPortal';
import { NGOPortal } from './components/NGOPortal';
import { VolunteerPortal } from './components/VolunteerPortal';
import { ImpactExplore } from './components/ImpactExplore';
import { NewDonationModal } from './components/Modals/NewDonationModal';
import { DonateModal } from './components/Modals/DonateModal';
import { InfoModal } from './components/Modals/InfoModal';
import { ProfileModal } from './components/Modals/ProfileModal';
import { Footer } from './components/Footer';

const DEFAULT_GUEST_USER: UserProfile = {
  id: 'guest',
  name: 'Community Member',
  email: 'member@foodrescue.in',
  phone: '+91 94370 00000',
  role: 'donor',
  city: 'Bhubaneswar (Odisha)',
  joinedDate: 'Today',
  stats: {
    mealsCount: 0,
    donationsCount: 0,
    deliveriesCount: 0,
    volunteerHours: 0
  }
};

export default function App() {
  // Theme state with local storage persistence
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('foodrescue_theme');
    if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('foodrescue_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Navigation: 'landing' (public marketing), 'auth' (registration/login screen), 'portal' (active dashboard - auth protected), 'explore' (live map)
  const [currentView, setCurrentView] = useState<'landing' | 'auth' | 'portal' | 'explore'>('landing');
  
  // Auth state - Defaults to logged out (false) unless explicitly authenticated
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('foodrescue_is_logged_in') === 'true';
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('foodrescue_auth_user');
    return saved ? JSON.parse(saved) : DEFAULT_GUEST_USER;
  });

  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    return currentUser.role || 'donor';
  });

  const [savedAccounts, setSavedAccounts] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('foodrescue_saved_accounts_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    const currentSaved = localStorage.getItem('foodrescue_auth_user');
    return currentSaved ? [JSON.parse(currentSaved)] : [];
  });

  const [authTab, setAuthTab] = useState<'login' | 'register'>('register');
  const [authRole, setAuthRole] = useState<UserRole>('donor');

  // Platform stats - starting clean, synced with live actions
  const [platformStats, setPlatformStats] = useState<PlatformStats>(() => {
    const saved = localStorage.getItem('foodrescue_stats_v3');
    return saved ? JSON.parse(saved) : INITIAL_PLATFORM_STATS;
  });

  // Food Donations - starting empty for real user input
  const [donations, setDonations] = useState<FoodDonation[]>(() => {
    const saved = localStorage.getItem('foodrescue_donations_v3');
    return saved ? JSON.parse(saved) : INITIAL_DONATIONS;
  });

  // Activity Feed
  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    const saved = localStorage.getItem('foodrescue_activities_v3');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  // Modals state
  const [isNewDonationOpen, setIsNewDonationOpen] = useState(false);
  const [isDonateFundsOpen, setIsDonateFundsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [infoModalType, setInfoModalType] = useState<'about' | 'contact' | 'privacy' | 'terms' | 'volunteer' | 'donate' | null>(null);

  // Fetch initial data from persistent database on load
  useEffect(() => {
    // 1. Load Platform Stats
    api.getStats().then(serverStats => {
      if (serverStats) setPlatformStats(serverStats);
    });

    // 2. Load Donations
    api.getDonations().then(serverDonations => {
      if (serverDonations && serverDonations.length > 0) {
        setDonations(serverDonations);
      }
    });

    // 3. Load Activities
    api.getActivities().then(serverActs => {
      if (serverActs && serverActs.length > 0) {
        setActivities(serverActs);
      }
    });

    // 4. Sync current user data from database if logged in
    const savedUserRaw = localStorage.getItem('foodrescue_auth_user');
    if (savedUserRaw) {
      try {
        const parsed = JSON.parse(savedUserRaw);
        if (parsed?.email) {
          api.getMe(parsed.email).then(remoteUser => {
            if (remoteUser) {
              setCurrentUser(remoteUser);
              setSavedAccounts(prev => {
                const filtered = prev.filter(u => u.email.toLowerCase() !== remoteUser.email.toLowerCase());
                return [remoteUser, ...filtered];
              });
            }
          });
        }
      } catch {
        // ignore parse error
      }
    }
  }, []);

  // Sync to local storage for instant offline fallback
  useEffect(() => {
    localStorage.setItem('foodrescue_stats_v3', JSON.stringify(platformStats));
  }, [platformStats]);

  useEffect(() => {
    localStorage.setItem('foodrescue_donations_v3', JSON.stringify(donations));
  }, [donations]);

  useEffect(() => {
    localStorage.setItem('foodrescue_activities_v3', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('foodrescue_auth_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('foodrescue_saved_accounts_v1', JSON.stringify(savedAccounts));
  }, [savedAccounts]);

  useEffect(() => {
    localStorage.setItem('foodrescue_is_logged_in', String(isLoggedIn));
  }, [isLoggedIn]);

  // Keep activeRole in sync with currentUser
  useEffect(() => {
    if (currentUser?.role) {
      setActiveRole(currentUser.role);
    }
  }, [currentUser]);

  // Auth Handlers
  const handleRegister = async ({ 
    name, 
    email, 
    phone, 
    role, 
    organization,
    city,
    address,
    fssaiNumber,
    vehicleType
  }: { 
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
  }) => {
    const newUser: UserProfile = {
      id: `user-${role}-${Date.now()}`,
      name: name || 'Partner User',
      email: (email || `${role}@foodrescue.in`).toLowerCase(),
      phone: phone || '+91 94370 12345',
      role,
      organization: organization || (role === 'donor' ? `${name} Kitchen` : role === 'ngo' ? `${name} Relief Shelter` : undefined),
      city: city || 'Bhubaneswar (Odisha)',
      address: address || '',
      fssaiNumber,
      vehicleType: role === 'volunteer' ? (vehicleType || 'Two-Wheeler with Insulated Food Bag') : undefined,
      joinedDate: 'Today',
      stats: {
        mealsCount: 0,
        donationsCount: 0,
        deliveriesCount: 0,
        volunteerHours: 0
      }
    };

    // Store in backend database
    api.register({
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      organization: newUser.organization,
      city: newUser.city,
      address: newUser.address,
      fssaiNumber: newUser.fssaiNumber,
      vehicleType: newUser.vehicleType
    }).then(res => {
      if (res?.user) {
        setCurrentUser(res.user);
      }
    });

    setCurrentUser(newUser);
    setActiveRole(role);
    setSavedAccounts(prev => {
      const filtered = prev.filter(u => u.email.toLowerCase() !== newUser.email.toLowerCase());
      return [newUser, ...filtered];
    });
    setIsLoggedIn(true);
    setCurrentView('portal');

    // Update stats
    setPlatformStats(prev => ({
      ...prev,
      verifiedNGOs: role === 'ngo' ? prev.verifiedNGOs + 1 : prev.verifiedNGOs,
      activeVolunteers: role === 'volunteer' ? prev.activeVolunteers + 1 : prev.activeVolunteers,
      partnerRestaurants: role === 'donor' ? prev.partnerRestaurants + 1 : prev.partnerRestaurants
    }));
  };

  const handleLogin = async ({ email, role, user }: { email: string; password?: string; role: UserRole; user?: UserProfile }) => {
    if (user) {
      setCurrentUser(user);
      setActiveRole(user.role);
      setSavedAccounts(prev => {
        const filtered = prev.filter(u => u.email.toLowerCase() !== user.email.toLowerCase());
        return [user, ...filtered];
      });
      setIsLoggedIn(true);
      setCurrentView('portal');
      return;
    }

    // Try logging in with backend database
    const loginRes = await api.login({ email, role });
    if (loginRes?.success && loginRes.user) {
      setCurrentUser(loginRes.user);
      setActiveRole(loginRes.user.role);
      setSavedAccounts(prev => {
        const filtered = prev.filter(u => u.email.toLowerCase() !== loginRes.user!.email.toLowerCase());
        return [loginRes.user!, ...filtered];
      });
    } else {
      const existingAccount = savedAccounts.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role)
        || savedAccounts.find(u => u.role === role);

      if (existingAccount) {
        setCurrentUser(existingAccount);
        setActiveRole(existingAccount.role);
      } else {
        const fallbackName = role === 'donor' ? 'Mayfair Lagoon Kitchen' : role === 'ngo' ? 'Asha Child Shelter' : 'Alok Mohanty (Rider)';
        const loggedUser: UserProfile = {
          id: `user-${role}-${Date.now()}`,
          name: fallbackName,
          email: (email || `${role}@foodrescue.in`).toLowerCase(),
          phone: '+91 94370 12345',
          role,
          organization: role === 'donor' ? 'Mayfair Convention Hotel' : role === 'ngo' ? 'Asha Child Shelter Foundation' : undefined,
          city: 'Bhubaneswar (Odisha)',
          vehicleType: role === 'volunteer' ? 'Two-Wheeler (Honda Activa)' : undefined,
          joinedDate: 'Today',
          stats: {
            mealsCount: 0,
            donationsCount: 0,
            deliveriesCount: 0,
            volunteerHours: 0
          }
        };
        // Register in DB
        api.register({
          name: loggedUser.name,
          email: loggedUser.email,
          phone: loggedUser.phone,
          role: loggedUser.role,
          organization: loggedUser.organization,
          city: loggedUser.city,
          vehicleType: loggedUser.vehicleType
        });
        setCurrentUser(loggedUser);
        setActiveRole(role);
        setSavedAccounts(prev => [loggedUser, ...prev.filter(u => u.id !== loggedUser.id)]);
      }
    }

    setIsLoggedIn(true);
    setCurrentView('portal');
  };

  const handleSwitchAccount = (user: UserProfile) => {
    setCurrentUser(user);
    setActiveRole(user.role);
    setIsLoggedIn(true);
    setCurrentView('portal');
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await api.deleteUser(userId);
      setSavedAccounts(prev => {
        const updated = prev.filter(u => u.id !== userId);
        localStorage.setItem('foodrescue_saved_accounts_v1', JSON.stringify(updated));
        return updated;
      });
      if (currentUser.id === userId) {
        setIsLoggedIn(false);
        setCurrentUser(DEFAULT_GUEST_USER);
        localStorage.removeItem('foodrescue_auth_user');
        localStorage.setItem('foodrescue_is_logged_in', 'false');
        setIsProfileOpen(false);
        setCurrentView('landing');
      }
      api.getStats().then(s => {
        if (s) setPlatformStats(s);
      });
    } catch (err) {
      console.error('Failed to delete account:', err);
    }
  };

  const handleRegisterNewRole = (role: UserRole) => {
    setAuthRole(role);
    setAuthTab('register');
    setCurrentView('auth');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(DEFAULT_GUEST_USER);
    setCurrentView('landing');
  };

  const handleQuickDemo = (role: UserRole) => {
    const existing = savedAccounts.find(a => a.role === role);
    if (existing) {
      handleSwitchAccount(existing);
    } else {
      handleLogin({ email: `${role}@foodrescue.in`, role });
    }
  };

  const handleOpenAuth = (tab: 'login' | 'register' = 'register', role?: UserRole) => {
    setAuthTab(tab);
    if (role) setAuthRole(role);
    setCurrentView('auth');
  };

  // Actions on Donations
  const handleCreateDonation = (newDonationData: Partial<FoodDonation>) => {
    const newDonation: FoodDonation = {
      id: `food-${Date.now()}`,
      donorId: currentUser.id,
      donorName: currentUser.organization || currentUser.name,
      donorType: 'Restaurant',
      title: newDonationData.title || 'Fresh Cooked Meals',
      category: newDonationData.category || 'cooked_meals',
      servings: newDonationData.servings || 25,
      weightKg: newDonationData.weightKg || 8,
      storage: newDonationData.storage || 'ambient',
      vegNonVeg: newDonationData.vegNonVeg || 'pure_veg',
      preparedAt: newDonationData.preparedAt || 'Freshly prepared',
      expiryTime: newDonationData.expiryTime || 'In 4 hours',
      pickupWindow: newDonationData.pickupWindow || 'Immediate pickup available',
      address: newDonationData.address || currentUser.address || 'Central City Area',
      city: newDonationData.city || currentUser.city || 'Bhubaneswar (Odisha)',
      locality: newDonationData.locality || 'Local Area',
      status: 'available',
      contactPhone: newDonationData.contactPhone || currentUser.phone || '+91 94370 12345',
      notes: newDonationData.notes,
      image: newDonationData.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
      createdAt: 'Just now',
      milestones: [
        {
          status: 'available',
          title: 'Food Surplus Broadcasted',
          timestamp: 'Just now',
          description: `Listed ${newDonationData.servings || 25} portions from ${currentUser.name}`
        }
      ]
    };

    setDonations(prev => [newDonation, ...prev]);

    // Update user stats
    setCurrentUser(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        donationsCount: prev.stats.donationsCount + 1,
        mealsCount: prev.stats.mealsCount + newDonation.servings
      }
    }));

    // Update platform stats
    setPlatformStats(prev => ({
      ...prev,
      totalMealsRescued: prev.totalMealsRescued + newDonation.servings,
      totalKgSaved: prev.totalKgSaved + newDonation.weightKg,
      co2PreventedKg: prev.co2PreventedKg + Math.round(newDonation.weightKg * 2.5)
    }));

    // Add activity
    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      message: `${currentUser.organization || currentUser.name} posted ${newDonation.servings} meals of ${newDonation.title}`,
      type: 'donation_posted',
      meals: newDonation.servings,
      location: newDonation.city
    };
    setActivities(prev => [newActivity, ...prev]);

    // Call server
    api.createDonation(newDonation);
  };

  const handleClaimDonation = (donationId: string) => {
    const target = donations.find(d => d.id === donationId);
    if (!target) return;

    const claimedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updatedDonations = donations.map(d => {
      if (d.id === donationId) {
        return {
          ...d,
          status: 'claimed' as const,
          claimedByNGO: {
            id: currentUser.id,
            name: currentUser.organization || currentUser.name,
            contact: currentUser.phone,
            address: currentUser.address || `${currentUser.city}`,
            claimedAt: `Today, ${claimedAt}`
          },
          milestones: [
            ...(d.milestones || []),
            {
              status: 'claimed' as const,
              title: `Claimed by ${currentUser.name}`,
              timestamp: 'Just now',
              description: `Shelter assigned. Ready for volunteer pickup dispatch.`
            }
          ]
        };
      }
      return d;
    });

    setDonations(updatedDonations);

    // Update user stats
    setCurrentUser(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        donationsCount: prev.stats.donationsCount + 1,
        mealsCount: prev.stats.mealsCount + target.servings
      }
    }));

    // Add activity
    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      message: `${currentUser.organization || currentUser.name} claimed ${target.servings} meals (${target.title})`,
      type: 'donation_claimed',
      meals: target.servings,
      location: target.city
    };
    setActivities(prev => [newActivity, ...prev]);

    api.claimDonation(donationId, {
      id: currentUser.id,
      name: currentUser.organization || currentUser.name,
      contact: currentUser.phone || '+91 94370 12345',
      address: currentUser.address || `${currentUser.city}`,
      claimedAt: `Today, ${claimedAt}`
    });
  };

  const handleAcceptMission = (donationId: string) => {
    const target = donations.find(d => d.id === donationId);
    if (!target) return;

    const dispatchedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updatedDonations: FoodDonation[] = donations.map(d => {
      if (d.id === donationId) {
        return {
          ...d,
          status: 'in_transit' as const,
          dispatchedAt: `Dispatched at ${dispatchedAt}`,
          assignedVolunteer: {
            id: currentUser.id,
            name: currentUser.name,
            phone: currentUser.phone || '+91 94370 12345',
            vehicle: currentUser.vehicleType || 'Two-Wheeler / Bike',
            status: 'en_route_pickup' as const
          },
          milestones: [
            ...(d.milestones || []),
            {
              status: 'in_transit' as const,
              title: `Dispatched with Driver ${currentUser.name}`,
              timestamp: 'Just now',
              description: `Volunteer en route to pickup with thermal crate.`
            }
          ]
        };
      }
      return d;
    });

    setDonations(updatedDonations);

    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      message: `Volunteer ${currentUser.name} accepted delivery mission for ${target.title} (${target.servings} portions)`,
      type: 'delivery_completed',
      meals: target.servings,
      location: target.city
    };
    setActivities(prev => [newActivity, ...prev]);

    api.assignVolunteer(donationId, {
      id: currentUser.id,
      name: currentUser.name,
      phone: currentUser.phone || '+91 94370 12345',
      vehicle: currentUser.vehicleType || 'Two-Wheeler'
    });
  };

  const handleUpdateMissionStatus = (donationId: string, status: 'picked_up' | 'delivered') => {
    const target = donations.find(d => d.id === donationId);
    if (!target) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updatedDonations: FoodDonation[] = donations.map(d => {
      if (d.id === donationId) {
        const isCompleted = status === 'delivered';
        return {
          ...d,
          status: isCompleted ? ('completed' as const) : ('in_transit' as const),
          deliveredAt: isCompleted ? `Delivered at ${timestamp}` : d.deliveredAt,
          assignedVolunteer: d.assignedVolunteer ? {
            ...d.assignedVolunteer,
            status: isCompleted ? ('delivered' as const) : ('picked_up' as const)
          } : undefined,
          milestones: [
            ...(d.milestones || []),
            {
              status: isCompleted ? ('delivered' as const) : ('picked_up' as const),
              title: isCompleted ? `Delivered to Shelter & Distributed` : `Picked up from Donor`,
              timestamp: `Today, ${timestamp}`,
              description: isCompleted ? `Delivered by ${currentUser.name}. Fresh food handed over.` : `Collected safely in food-grade container.`
            }
          ]
        };
      }
      return d;
    });

    setDonations(updatedDonations);

    if (status === 'delivered') {
      setCurrentUser(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          deliveriesCount: prev.stats.deliveriesCount + 1,
          mealsCount: prev.stats.mealsCount + target.servings,
          volunteerHours: prev.stats.volunteerHours + 1
        }
      }));

      const newActivity: ActivityItem = {
        id: `act-${Date.now()}`,
        timestamp: 'Just now',
        message: `DELIVERED: ${target.servings} meals handed over safely to ${target.claimedByNGO?.name || 'Shelter'}`,
        type: 'delivery_completed',
        meals: target.servings,
        location: target.city
      };
      setActivities(prev => [newActivity, ...prev]);
    }

    api.updateVolunteerStatus(donationId, status);
  };

  const handleFundsDonated = (amountRupees: number, meals: number) => {
    setPlatformStats(prev => ({
      ...prev,
      totalRupeesDonated: prev.totalRupeesDonated + amountRupees,
      totalMealsRescued: prev.totalMealsRescued + meals
    }));

    setCurrentUser(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        totalRupeesContributed: (prev.stats.totalRupeesContributed || 0) + amountRupees,
        mealsCount: prev.stats.mealsCount + meals
      }
    }));

    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      message: `${currentUser.name} sponsored ₹${amountRupees.toLocaleString()} (${meals} rescue meals funded)`,
      type: 'funds_donated',
      meals,
      amountRupees,
      location: 'Community Fund'
    };
    setActivities(prev => [newActivity, ...prev]);

    api.donateFunds({
      donorName: currentUser.name || 'Generous Donor',
      donorEmail: currentUser.email || 'donor@example.com',
      amountRupees
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff] dark:bg-[#080e1a] text-[#0b1c30] dark:text-[#f1f5f9] transition-colors duration-200">
      
      {/* Top Navbar with Dark/Light mode switch */}
      <Navbar
        currentView={currentView}
        activeRole={activeRole}
        user={currentUser}
        savedAccounts={savedAccounts}
        isLoggedIn={isLoggedIn}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onSelectView={(v) => {
          if (v === 'portal' && !isLoggedIn) {
            handleOpenAuth('login', activeRole);
          } else {
            setCurrentView(v);
          }
        }}
        onSwitchAccount={handleSwitchAccount}
        onRegisterNewRole={handleRegisterNewRole}
        onOpenNewDonation={() => {
          if (isLoggedIn && currentUser.role === 'donor') {
            setIsNewDonationOpen(true);
          } else if (isLoggedIn && currentUser.role !== 'donor') {
            const donorAcc = savedAccounts.find(a => a.role === 'donor');
            if (donorAcc) {
              handleSwitchAccount(donorAcc);
              setIsNewDonationOpen(true);
            } else {
              handleRegisterNewRole('donor');
            }
          } else {
            handleOpenAuth('register', 'donor');
          }
        }}
        onOpenDonateFunds={() => setIsDonateFundsOpen(true)}
        onOpenAuth={(tab, role) => handleOpenAuth(tab, role)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onDeleteUser={handleDeleteUser}
        onLogout={handleLogout}
        totalMealsRescued={platformStats.totalMealsRescued}
      />

      {/* Main Screen Views */}
      <main className="flex-grow flex flex-col">
        {currentView === 'landing' && (
          <LandingPage
            stats={platformStats}
            isLoggedIn={isLoggedIn}
            onSelectRole={(role) => {
              if (!isLoggedIn) {
                handleOpenAuth('register', role);
              } else {
                if (currentUser.role === role) {
                  setCurrentView('portal');
                } else {
                  const existingAccount = savedAccounts.find(a => a.role === role);
                  if (existingAccount) {
                    handleSwitchAccount(existingAccount);
                  } else {
                    handleRegisterNewRole(role);
                  }
                }
              }
            }}
            onOpenAuth={(tab, role) => handleOpenAuth(tab || 'register', role)}
            onOpenDonate={() => setIsDonateFundsOpen(true)}
            onExploreMap={() => setCurrentView('explore')}
          />
        )}

        {currentView === 'auth' && (
          <RegistrationScreen
            initialTab={authTab}
            initialRole={authRole}
            onRegister={handleRegister}
            onLogin={handleLogin}
            onQuickDemo={handleQuickDemo}
            onBackToHome={() => setCurrentView('landing')}
            onOpenInfo={setInfoModalType}
            totalMealsRescued={platformStats.totalMealsRescued}
          />
        )}

        {currentView === 'explore' && (
          <ImpactExplore
            donations={donations}
            activities={activities}
            totalMealsRescued={platformStats.totalMealsRescued}
            onOpenDonateFunds={() => setIsDonateFundsOpen(true)}
            onSelectRole={(role) => {
              if (!isLoggedIn) {
                handleOpenAuth('register', role);
              } else {
                if (currentUser.role === role) {
                  setCurrentView('portal');
                } else {
                  const existingAccount = savedAccounts.find(a => a.role === role);
                  if (existingAccount) {
                    handleSwitchAccount(existingAccount);
                  } else {
                    handleRegisterNewRole(role);
                  }
                }
              }
            }}
          />
        )}

        {currentView === 'portal' && isLoggedIn && (
          <>
            {currentUser.role === 'donor' && (
              <DonorPortal
                user={currentUser}
                donations={donations}
                onOpenNewDonation={() => setIsNewDonationOpen(true)}
              />
            )}

            {currentUser.role === 'ngo' && (
              <NGOPortal
                user={currentUser}
                donations={donations}
                onClaimDonation={handleClaimDonation}
                onRequestNeed={(need) => {
                  const newAct: ActivityItem = {
                    id: `act-${Date.now()}`,
                    timestamp: 'Just now',
                    message: `${currentUser.organization || 'Shelter'} requested: "${need}"`,
                    type: 'urgent_broadcast',
                    meals: 80,
                    location: 'Urgent Dispatch'
                  };
                  setActivities(prev => [newAct, ...prev]);
                }}
              />
            )}

            {currentUser.role === 'volunteer' && (
              <VolunteerPortal
                user={currentUser}
                donations={donations}
                onAcceptMission={handleAcceptMission}
                onUpdateMissionStatus={handleUpdateMissionStatus}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer onOpenInfo={setInfoModalType} />

      {/* Global Modals */}
      <NewDonationModal
        user={currentUser}
        isOpen={isNewDonationOpen}
        onClose={() => setIsNewDonationOpen(false)}
        onSubmit={handleCreateDonation}
      />

      <DonateModal
        isOpen={isDonateFundsOpen}
        onClose={() => setIsDonateFundsOpen(false)}
        onDonationComplete={handleFundsDonated}
      />

      <ProfileModal
        user={currentUser}
        savedAccounts={savedAccounts}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onLogout={handleLogout}
        onSwitchAccount={handleSwitchAccount}
        onRegisterNewRole={handleRegisterNewRole}
        onDeleteUser={handleDeleteUser}
      />

      <InfoModal
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
        onOpenDonateModal={() => setIsDonateFundsOpen(true)}
      />
    </div>
  );
}
