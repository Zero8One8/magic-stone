# 🔮 Magic Stone - Crystal e-Commerce & Knowledge Platform

> A modern, fully-featured React application for crystal enthusiasts, featuring e-commerce, educational content, and interactive tools.

## ✨ Features

### Core Features
- **Crystal Catalog**: Comprehensive database of crystals with detailed information
- **Quiz System**: Interactive personality and compatibility quiz
- **E-Commerce**: Shopping cart and order management with Telegram/WhatsApp contact
- **Blog**: Educational articles and crystal guides
- **Moon Calendar**: Lunar phase tracking and astral planning tools
- **Chakra Map**: Chakra-crystal alignment information
- **Meditations**: Guided meditation content
- **Diagnostika**: Crystal diagnostic tools

### Technical Features
- ✅ **Lazy-loaded Routes**: Code splitting for optimal performance
- ✅ **Type-safe Code**: Full TypeScript with strict mode
- ✅ **Responsive Design**: Mobile-first UI with Tailwind CSS
- ✅ **Dark Mode**: Built-in theme switching
- ✅ **Real-time Database**: Supabase PostgreSQL integration
- ✅ **Admin Panel**: User request management
- ✅ **Automated Notifications**: Telegram bot integration
- ✅ **E2E Tests**: Playwright test suite

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/Zero8One8/magic-stone.git
cd magic-stone

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

## 📦 Development

### Available Scripts

```bash
# Development server (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Deploy to production
npm run deploy
```

## 🏗️ Architecture

### Frontend Stack
- **React 18.3**: UI framework with React Router for navigation
- **Vite 5.4**: Ultra-fast build tool with code splitting
- **TypeScript 5.8**: Type safety and developer experience
- **Tailwind CSS 3.4**: Utility-first CSS framework
- **Shadcn UI**: High-quality component library
- **React Query 5.83**: Server state management
- **React Hook Form 7.61**: Form handling with Zod validation

### Backend Stack
- **Supabase**: PostgreSQL database with realtime capabilities
- **Edge Functions**: Deno-based serverless functions
- **Telegram Bot**: Automated notifications and messaging

### Database Schema
- `crystals`: Crystal catalog with properties and energies
- `contact_requests`: User inquiries (name, email, contact_method, message)
- `blog_articles`: Blog content
- `users`: User accounts and preferences
- `favorites`: User's favorite crystals

## 📋 Environment Variables

```env
# Supabase Configuration
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SUPABASE_URL=https://your_project_id.supabase.co

# Optional: Telegram Bot Integration
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

## 🔒 Security

- ✅ Environment variables properly managed (no secrets in git)
- ✅ Supabase RLS policies for data protection
- ✅ CORS properly configured
- ✅ Contact method validation (Telegram/WhatsApp)
- ✅ Rate limiting on form submissions

## 📊 Performance Metrics

### Bundle Size (Optimized)
- Main app: 273 KB (gzip: 75 KB)
- Vendor React: 155 KB (gzip: 51 KB)
- Lazy-loaded pages: 0.6 - 115 KB each
- **Total initial load: ~400 KB (gzip)**

### Build Times
- Development: <2s hot reload
- Production: ~16s full build
- ESLint checks: <5s

### Performance Optimizations
- Route-based code splitting via lazy loading
- Manual chunk configuration for optimal caching
- Image optimization via Vite
- CSS minification and purging
- Tree-shaking of unused dependencies

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

**Test Coverage**:
- Home page navigation
- Crystal catalog browsing
- Contact form submission
- Quiz functionality
- Scroll-to-top behavior
- Dark mode toggle
- Route navigation

## 📝 Code Quality

### Linting
```bash
npm run lint
```

**ESLint Configuration**:
- TypeScript strict mode
- React/Hooks best practices
- No unused variables
- Proper type annotations
- Fast Refresh compatibility

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 Project Structure

```
src/
├── pages/              # Route components
├── components/         # Reusable UI components
├── lib/               # Utilities and helpers
├── data/              # Static data (crystals, products)
├── hooks/             # Custom React hooks
├── integrations/      # External API integrations
└── test/              # Unit tests

public/
├── sitemap.xml        # SEO sitemap
└── robots.txt         # Search engine configuration

supabase/
├── functions/         # Edge functions for Telegram
└── migrations/        # Database schema versions
```

## 🔄 Deployment

### Automatic Deployment
- Push to `main` branch triggers GitHub Actions
- Build verification and tests run automatically
- Production deployment on success

### Manual Deployment
```bash
npm run deploy
```

## 🐛 Known Issues

- Large crystals dataset may need pagination on slower connections
- Telegram notifications may have slight delays during peak hours

## 🎯 Roadmap

### Planned Features
- [ ] User authentication system
- [ ] Wishlist functionality
- [ ] Crystal comparator tool
- [ ] Advanced search with filters
- [ ] Mobile app (React Native)
- [ ] Payment gateway integration
- [ ] Analytics dashboard

### Performance Goals
- [ ] Main bundle <200 KB gzip
- [ ] Initial load <2s on 3G
- [ ] 95+ Lighthouse score

## 📞 Support

For issues and questions:
- GitHub Issues: [Report a bug](https://github.com/Zero8One8/magic-stone/issues)
- Email: support@magic-stone.com

## 📄 License

This project is proprietary. All rights reserved.

## ✨ Credits

- Crystal data sourced from metaphysical databases
- UI components from [Shadcn UI](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Hosting by [Supabase](https://supabase.com/)

---

**Last Updated**: April 21, 2026
**Version**: 1.0.0
