# FoodRescue India 🍲🤝

An intelligent surplus food redistribution platform connecting commercial banquets, restaurants, hotels, and caterers with verified community shelters and volunteer rescue drivers across Indian cities.

---

## 🌟 Key Features

### 🏢 1. Food Donor Portal (Restaurants, Banquets & Caterers)
- **Surplus Food Broadcasting**: Post surplus batches in seconds with food categories (cooked meals, bakery, fresh produce, dairy), dietary markers (Pure Veg 🟢, Non-Veg 🔴, Contains Egg 🟡), safe consumption countdown timers, and storage requirements.
- **Section 80G Tax Certificates**: Automatic generation of Form 10BE tax exemption certificates for commercial food donations.
- **Live Logistics Tracking**: View real-time status updates as batches are claimed, picked up, and delivered.

### 🏛️ 2. NGO & Shelter Distribution Portal
- **Instant Proximity Matching**: Claim available surplus batches with one click.
- **Urgent Need Broadcasts**: Post emergency meal requests (e.g. disaster relief, sudden influx) directly to the network.
- **Audited Delivery Handovers**: Verify volunteer arrival and meal distribution counts.

### 🛵 3. Volunteer Driver Fleet Portal
- **Mission Board**: Discover nearby active surplus rescue runs with turn-by-turn route previews.
- **Milestone Stepper**: Update real-time transit milestones (*Dispatched*, *Picked Up with Insulated Crate*, *En Route*, *Delivered*).
- **Impact Tracking**: Track total volunteer hours, deliveries made, and meals served.

### 🌍 4. Live Impact & Map Visualizer
- **Interactive City Map**: Visual pins for donation hubs, partner kitchens, and recipient shelters.
- **Real-Time Activity Feed**: Live ticker of rescued meals, carbon emissions (CO₂) prevented, and community funding.
- **Financial Sponsorship Calculator**: Micro-donations calculator where ₹10 directly funds 1 rescued meal transit.

### 🌓 5. Complete Theme Customization
- **Light & Dark Mode**: Persistent toggle with an eye-safe dark theme.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Canvas-Confetti
- **Backend / API**: Node.js, Express (REST API endpoints for donations, claims, broadcasts, and user personas)
- **Tooling & Build**: Vite, tsx, esbuild
- **Type Checking**: TypeScript (`tsc --noEmit`)

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0 or higher)
- [Git](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/food-rescue-india.git
cd food-rescue-india
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser and visit: **`http://localhost:3000`**

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the local full-stack server (Express + Vite) on port 3000 |
| `npm run build` | Compiles frontend assets and bundles the Node server to `dist/` |
| `npm start` | Launches the production-bundled server |
| `npm run lint` | Runs TypeScript compiler checks to ensure type safety |

---

## 📁 Project Structure

```text
├── src/
│   ├── components/
│   │   ├── DonorPortal.tsx          # Donor dashboard & listing management
│   │   ├── NGOPortal.tsx            # Shelter claim management & urgency broadcasts
│   │   ├── VolunteerPortal.tsx      # Volunteer pickup & route tracking
│   │   ├── LandingPage.tsx          # Public landing & mission metrics
│   │   ├── ImpactExplore.tsx        # Interactive map & live activities
│   │   ├── RegistrationScreen.tsx   # Multi-role authentication & registration
│   │   ├── Navbar.tsx               # Navigation & theme switcher
│   │   ├── Footer.tsx               # Footer with quick links & helpline info
│   │   └── Modals/                  # Modals for new donations, ₹ funding, tracking, info
│   ├── data/                        # Initial mock data & configurations
│   ├── services/                    # API client layer (REST endpoints)
│   ├── types.ts                     # TypeScript definitions & data models
│   ├── App.tsx                      # Root state orchestrator & view router
│   └── main.tsx                     # React application entry point
├── server.ts                        # Express backend server with REST API routes
├── package.json                     # Project dependencies & scripts
├── vite.config.ts                   # Vite build & Tailwind configuration
└── README.md                        # Documentation & setup guide
```

---

## 🤝 Contributing

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.
