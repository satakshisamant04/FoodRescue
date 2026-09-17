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

### 🤖 5. FoodRescue AI Assistant (RAG Knowledge Engine)
- **Grounded Conversational Support**: Natural language conversational assistant answering queries regarding donor guidelines, NGO claiming, volunteer logistics, FSSAI hygiene rules, and direct INR meal sponsorship.
- **RAG Architecture**: Ingests, chunks, and semantically indexes official FoodRescue India documentation using LangChain text splitters and Gemini high-dimensional embeddings (`gemini-embedding-2-preview`).
- **Grounded Factual Guardrails**: System instructions strictly prevent hallucinations or invented policies, ensuring answers directly cite source documents.
- **Interactive UI**: Floating chat widget with quick suggestion prompts, auto-scrolling message streams, source attribution badges, and responsive design.

### 🌓 6. Complete Theme Customization
- **Light & Dark Mode**: Persistent toggle with an eye-safe dark theme.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Canvas-Confetti
- **Backend / API**: Node.js, Express (REST API endpoints for donations, claims, broadcasts, user personas, and AI chat)
- **AI & RAG Pipeline**:
  - `@google/genai` (Gemini 3.6 Flash / Gemini 3.1 Flash Lite LLMs & Gemini Embedding 2 Preview)
  - `@langchain/textsplitters` (`RecursiveCharacterTextSplitter`)
  - Modular Vector Store with Cosine Similarity Search & Persistent Cache
- **Storage**: Dual-mode persistence (MongoDB Atlas or resilient local storage `data/db.json` & `data/vector-store.json`)
- **Tooling & Build**: Vite, tsx, esbuild
- **Type Checking**: TypeScript (`tsc --noEmit`)

---

## 🧠 AI Knowledge Base & RAG Architecture

The platform includes an end-to-end Retrieval-Augmented Generation (RAG) pipeline:

```text
backend/ai/
├── documents/                     # Structured domain knowledge base
│   ├── platform-guide.txt         # Architecture, roles & overview
│   ├── donor-guide.txt            # Food surplus listing & donor protocols
│   ├── ngo-guide.txt              # Shelter eligibility & claiming procedures
│   ├── volunteer-guide.txt        # Volunteer driver onboarding & mission steps
│   ├── food-donation-guidelines.txt # Acceptable foods & quantity thresholds
│   ├── food-safety.txt            # FSSAI compliance & 4-hour temperature rule
│   ├── pickup-process.txt         # 4-stage end-to-end logistics workflow
│   └── faq.txt                    # Frequently asked questions & answers
├── embeddings.ts                  # Gemini & local fallback embedding providers
├── vectorStore.ts                 # Modular vector store interface & cosine similarity
├── ingest.ts                      # LangChain chunking & document ingestion pipeline
├── retriever.ts                   # Semantic search & prompt context assembler
├── chatbot.ts                     # Grounded RAG conversation generator with source citations
└── test-rag.ts                    # Automated 7-point RAG verification suite
```

### RAG Workflow:
1. **Document Ingestion (`npm run ingest`)**: Splits markdown/text knowledge documents into semantic chunks (700 chars with 120 char overlap), generates embeddings, and saves them to `data/vector-store.json`.
2. **Semantic Retrieval**: Incoming user inquiries are converted to vector embeddings; top-k nearest chunks are retrieved using cosine similarity.
3. **Prompt Augmentation**: Chunks are assembled into a grounded context window with strict system constraints.
4. **Grounded Generation**: Gemini generates a factual response with source attribution.

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0 or higher)
- [Git](https://git-scm.com/)
- [Gemini API Key](https://aistudio.google.com/) (configured in `.env`)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/food-rescue-india.git
cd food-rescue-india
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and provide your configuration:
```env
PORT=3000
MONGODB_URI=
GEMINI_API_KEY=your_gemini_api_key_here
TOP_K=4
VECTOR_DB_TYPE=local
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Ingest Knowledge Base (Optional — auto-initializes on startup)
```bash
npm run ingest
```

### 5. Run Development Server
```bash
npm run dev
```
Open your browser and visit: **`http://localhost:3000`**

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the full-stack server (Express + Vite) on port 3000 |
| `npm run build` | Compiles frontend assets and bundles the application to `dist/` |
| `npm start` | Launches the production server |
| `npm run lint` | Runs TypeScript compiler checks (`tsc --noEmit`) |
| `npm run ingest` | Ingests knowledge base documents into the vector store |
| `npm run test:rag` | Executes the 7-case automated RAG test suite |

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
│   │   ├── FoodRescueChatbot.tsx    # Floating RAG AI conversational widget
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
