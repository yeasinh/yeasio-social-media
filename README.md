# Yeasio: Full-Stack Social Media App

Yeasio is a full-featured social media application with post creation, likes, comments, chat (real-time), media sharing, profiles, notifications, and more.

---

## 🌐 Tech Stack

### Backend

- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: PostgreSQL (via [Prisma](https://www.prisma.io/))
- **GraphQL**: Apollo Server + Subscriptions (WebSocket)
- **File Uploads**: `graphql-upload`
- **Auth**: JWT-based

### Frontend

- **Framework**: React Native (without Expo)
- **Navigation**: React Navigation
- **State Management**: Redux Toolkit + Redux Persist
- **Networking**: Apollo Client (with file upload support)

---

## ⚙️ Requirements

- Node.js (v18+)
- PostgreSQL (via pgAdmin or CLI)
- Android Studio (with emulator set up)
- Yarn / npm

---

## 📁 Project Structure

```
root
├── server                 # NestJS backend
│   ├── prisma             # Prisma schema & migrations
│   └── src                # All backend features
│
└── mobile                 # React Native app
    ├── src
    │   ├── screens
    │   ├── components
    │   ├── navigation
    │   ├── store          # Redux slices
    │   └── apollo         # Apollo client setup
```

---

## 🚀 Getting Started

### 1. Backend Setup

#### ⬇️ Install dependencies

```bash
cd server
npm install
```

#### 🛠 Configure DB

Ensure PostgreSQL is running. Create DB `yeasio_db` manually or via pgAdmin.

Set `.env` in `server/`:

```env
DATABASE_URL="postgresql://yeasio:yeasio123@localhost:5432/yeasio_db?schema=public"
PORT=8000
JWT_SECRET=your_jwt_secret_here
```

#### 🔄 Generate Prisma Client

```bash
npx prisma generate
npx prisma migrate dev --name init
```

#### ▶️ Start server

```bash
npm run start:dev
```

Server will run at `http://localhost:8000/graphql`

---

### 2. Frontend Setup

#### ⬇️ Install dependencies

```bash
cd mobile
npm install
```

#### ⚙️ Set up env file

Create `.env.mobile` in `mobile/`:

```env
API_URL=http://10.0.2.2:8000/graphql
```

(For real device, replace with LAN IP of PC)

#### 🧩 Install pods (iOS only)

```bash
cd ios
pod install
```

#### 🛠 Link native modules

```bash
npx react-native link react-native-config
```

#### ▶️ Run on Android Emulator

```bash
ENVFILE=.env.mobile npx react-native run-android
```

---

## ✨ Features Implemented

### 🧑 Auth

- Register (email/password)
- Login
- JWT persistence with Redux + AsyncStorage

### 📝 Posts

- Create text/image posts
- Like, comment, share
- Feed display with pagination

### 💬 Chat

- One-to-one messaging
- Realtime updates via GraphQL subscriptions
- Image/file sharing in chat
- Chat bubble design

### 🔔 Notifications

- Triggered on like, comment, share, message
- Notification badge display

### 🧑 Profile

- View your own profile
- View other users' profiles
- Update avatar and name

### ⚙️ Settings

- Dark mode toggle (persisted)
- Logout

---

## 📦 Deployment Notes

### 🖥 Backend

- Use PM2 or Docker for production
- Serve `uploads` folder as static assets
- Allow CORS for mobile origin

### 📱 Mobile

- Set `API_URL` to production IP/domain
- Build release APK via:

```bash
cd android
./gradlew assembleRelease
```

---

## 🧪 Debug Tips

### Android Emulator Can't Reach API?

- Use `http://10.0.2.2:PORT` (NOT `localhost`)
- Make sure backend listens on `0.0.0.0`:

```ts
await app.listen(8000, "0.0.0.0");
```

### Network Request Failed?

- Check `.env.mobile` is loaded
- `console.log(Config.API_URL)` to verify

---

## 👨‍💻 Dev Scripts

### Backend

```bash
npm run start:dev         # Start NestJS
npx prisma studio         # View DB in browser
```

### Mobile

```bash
npx react-native run-android
npx react-native log-android
```

---

## 🧩 Future Improvements

- Group Chat / Chat Search
- Stories
- Comments with threads
- Settings for privacy/security
- Real-time online status

---

## 🙏 Acknowledgements

Built with ❤️ using NestJS, React Native, GraphQL, Prisma, and Apollo.

---

## 📬 Contact

**Author**: Muhammad Yeasin Hossain
GitHub: [@yeasinh](https://github.com/yeasinh)
