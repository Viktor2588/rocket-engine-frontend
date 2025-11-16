# ⚡ Quick Start Guide

Get the Rocket Engine Frontend running in 2 minutes.

---

## 1️⃣ Install Dependencies

```bash
cd rocket-engine-frontend
npm install
```

## 2️⃣ Start Backend API

Ensure Spring Boot backend is running:
```bash
# In your backend directory
mvn spring-boot:run
# Backend should be available at http://localhost:8080
```

## 3️⃣ Configure Environment (Optional)

Create `.env` file (or use defaults):
```bash
cp .env.example .env
# Edit .env if backend is on different URL
```

## 4️⃣ Start Development Server

```bash
npm start
```

## 5️⃣ Open in Browser

```
http://localhost:3000
```

---

## 📍 Key Routes

| URL | Page |
|-----|------|
| `/` | Engine List |
| `/engines/1` | Engine Details (ID: 1) |
| `/compare` | Compare Engines |

---

## 🛠️ Build for Production

```bash
npm run build
# Creates optimized bundle in ./build/
```

---

## 📚 Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Full page components
├── services/        # API calls (engineService.js)
├── hooks/           # Custom hooks (useEngines.js)
└── App.js           # Main app with routing
```

---

## 🔗 API Endpoints

Backend should provide these endpoints:

```
GET    /api/engines              → All engines
GET    /api/engines/{id}         → Single engine
POST   /api/engines              → Create engine
PUT    /api/engines/{id}         → Update engine
DELETE /api/engines/{id}         → Delete engine
GET    /api/compare?e1=X&e2=Y   → Compare engines
```

---

## 🐛 Troubleshooting

### Backend not connecting?
- Check if `http://localhost:8080` is running
- Check CORS is enabled on backend
- Verify `.env` has correct `REACT_APP_API_URL`

### Tailwind classes not showing?
- Restart dev server: `npm start`
- Check `tailwind.config.js` includes `src/**/*.{js,jsx}`

### Port 3000 already in use?
```bash
PORT=3001 npm start
```

---

## 📖 Full Documentation

- **Architecture:** See `ARCHITECTURE.md`
- **Setup Details:** See `SETUP.md`
- **Development:** See `ARCHITECTURE.md` for structure

---

✨ **Ready to go!** Start exploring the Rocket Engine Comparison App.
