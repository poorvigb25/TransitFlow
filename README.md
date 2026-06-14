# TransitFlow — Real-Time Transit Crowd Intelligence Platform

TransitFlow is a cloud-based real-time public transportation crowd intelligence platform focusing on helping passengers avoid overcrowding in public transit systems. It aggregates live GPS location tracking, station congestion levels, and compartment load breakdowns (coaches 1-6) across Indian cities.

---

## Technical Architecture

* **Frontend**: React (Vite) + Tailwind CSS + React Router v6 + Socket.io Client + Recharts + React Leaflet (OpenStreetMap)
* **Backend**: Node.js + Express.js + Socket.io Server + JWT Sessions + Bcrypt Hashing + Express Validator
* **Database**: MongoDB (Mongoose ODM)

---

## Directory Structure

```
transitflow/
├── backend/
│   ├── config/             # MongoDB connection
│   ├── controllers/        # Express API logics
│   ├── middleware/         # Security guards & validations
│   ├── models/             # Mongoose DB schemas
│   ├── routes/             # Router mappings
│   ├── scripts/            # Database seeder scripts
│   ├── utils/              # Crowd calculation categorizers
│   ├── server.js           # Server loop & WebSockets simulation
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/     # Sidebars, guards, maps
    │   ├── context/        # Websocket and login states
    │   ├── pages/          # COMMUTER pages and Admin operations
    │   ├── services/       # Axios client connection
    │   ├── App.jsx         # Router path mappings
    │   └── index.css       # Styles & Leaflet custom config
    ├── tailwind.config.js  # Theme configuration
    └── package.json
```

---

## Local Setup Instructions

### Prerequisites
* Node.js >= 18.x
* MongoDB Server (Running locally on `mongodb://localhost:27017` or Atlas cluster)

---

### Step 1: Install Dependencies & Run Backend

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the database seeding script:
   ```bash
   node scripts/seed.js
   ```
   *This seeds 20 Metro Stations, 50 Buses, 10 Trains, 60 Coaches, and default Admin/Passenger users.*

4. Launch the Express server:
   ```bash
   npm start
   ```
   *The console will display: `🚀 TransitFlow Full Stack API listening on http://localhost:4000`*

---

### Step 2: Install Dependencies & Run Frontend

1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch the Vite client:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to [http://localhost:5173](http://localhost:5173).

---

## Demo Test Credentials

To log in and test user role permissions:

* **Commuter (Passenger role)**:
  * **Email**: `user@metroconnect.com`
  * **Password**: `user123`
* **Controller (Admin role)**:
  * **Email**: `admin@metroconnect.com`
  * **Password**: `admin123`
