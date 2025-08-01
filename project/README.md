# DareStream - Live Challenge Platform

A viral live streaming platform where users submit, vote on, and perform challenges in real-time.

## 🚀 Features

### Core Functionality
- **Live Streaming**: Real-time video streaming with audience interaction
- **Dare Roulette**: Community-driven challenge submission and voting system
- **Interactive Chat**: Live chat with pressure meter and tipping system
- **User Authentication**: Secure sign-up and login system
- **Leaderboards**: Track top performers and their achievements

### Stream Modes
- **Solo Challenges**: Individual performers taking on dares
- **1v1 Battles**: Head-to-head competitions between streamers
- **Audience Interaction**: Real-time voting, pressure meter, and tipping

### Monetization Ready
- Dare submission fees ($1-10)
- Audience tipping system
- Platform revenue sharing (20% on submissions, 50% on tips)
- Sponsorship integration ready

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Vite

### Planned Integrations
- **Database**: Supabase (PostgreSQL + Real-time)
- **Authentication**: Supabase Auth
- **Live Streaming**: Agora.io WebRTC
- **Payments**: Stripe (disabled for demo)
- **Video Processing**: FFmpeg.wasm
- **Moderation**: Content filtering APIs

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd darestream
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📱 Features Overview

### Home Page
- Hero section with platform introduction
- Live stream previews
- Top voted dares
- Platform statistics

### Live Streams
- Grid view of active streams
- Filter by stream type (Solo/Battle)
- Real-time viewer counts
- Stream categories

### Dare Roulette
- Submit new challenges
- Vote on pending dares
- Difficulty levels (Easy/Medium/Hard/Extreme)
- Cost-based submission system

### Stream Viewer
- Full-screen video player
- Live chat with pressure meter
- Tipping system
- Current challenge display
- Audience interaction tools

### Leaderboard
- Top performer rankings
- Earnings tracking
- Completion statistics
- Achievement streaks

## 🔧 Configuration

### Supabase Setup (Required for full functionality)
1. Create a Supabase project
2. Set up the database schema (migrations coming soon)
3. Configure authentication
4. Update environment variables

### Agora.io Setup (For live streaming)
1. Create an Agora.io account
2. Get your App ID
3. Update environment variables

## 🎨 Design System

- **Colors**: Dark theme with red/orange accents
- **Typography**: Modern, readable fonts with proper hierarchy
- **Components**: Reusable, accessible UI components
- **Responsive**: Mobile-first design approach
- **Animations**: Smooth transitions and micro-interactions

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify/Vercel
The app is ready for deployment to any static hosting service.

## 🔒 Safety & Moderation

The platform is designed with safety in mind:
- Age verification system (18+)
- Content moderation APIs integration ready
- Community reporting system
- Automated content filtering
- Terms of service enforcement

## 📈 Scalability

- **PWA Ready**: Installable on mobile devices
- **API-First**: RESTful backend for future mobile apps
- **Real-time**: WebSocket connections for live features
- **CDN Ready**: Optimized for global content delivery

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎯 Roadmap

- [ ] Supabase integration
- [ ] Live streaming with Agora.io
- [ ] Payment processing with Stripe
- [ ] Mobile app development
- [ ] Advanced moderation tools
- [ ] Analytics dashboard
- [ ] Social media integration
- [ ] Clip generation and sharing

---

Built with ❤️ for the streaming community# DareStream
