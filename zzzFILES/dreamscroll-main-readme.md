# DreamScroll - AI-Powered Biblical Dream Journal

<div align="center">
  <img src="/public/icon-512.png" alt="DreamScroll Logo" width="120" />
  <h3>Transform Your Dreams into Spiritual Insights</h3>
  <p>An AI-powered dream journal that provides biblical interpretations and spiritual guidance</p>
</div>

## 🌟 Features

- **Voice & Text Recording**: Capture dreams through voice recording or text input
- **AI Interpretation**: Get meaningful interpretations powered by GPT-4, Claude, or Gemini
- **Biblical References**: Receive relevant scripture verses for spiritual context
- **Dream Analytics**: Track patterns, themes, and spiritual growth over time
- **Dark/Light Mode**: Comfortable viewing experience any time of day
- **Mobile-First Design**: Optimized for phones with PWA support
- **Secure & Private**: Your dreams are encrypted and stored safely

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/DarbyEntLLC/dreamscroll-pwa.git

# Navigate to project directory
cd dreamscroll-pwa

# Install dependencies
npm install

# Create environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see your app!

## 📱 Screenshots

<div align="center">
  <img src="docs/images/home-screen.png" alt="Home Screen" width="250" />
  <img src="docs/images/dream-recorder.png" alt="Dream Recorder" width="250" />
  <img src="docs/images/interpretation.png" alt="Interpretation" width="250" />
</div>

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI Integration**: OpenAI, Anthropic, Google AI APIs
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## 📖 Documentation

- [User Guide](docs/USER_GUIDE.md) - Complete guide for app users
- [Development Guide](docs/DEVELOPMENT.md) - For developers and contributors
- [API Documentation](docs/API.md) - API endpoints and integration
- [Deployment Guide](docs/DEPLOYMENT.md) - Deploy to production

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Services (choose one or multiple)
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GOOGLE_AI_API_KEY=your_google_ai_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🐛 Known Issues

- Voice recording requires HTTPS in production
- Some browsers may not support all PWA features
- See [Issues](https://github.com/DarbyEntLLC/dreamscroll-pwa/issues) for more

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- Created by Kevin Darby
- Inspired by the need for spiritual dream interpretation
- Thanks to all contributors and beta testers

## 📞 Support

- Email: support@dreamscroll.app
- Issues: [GitHub Issues](https://github.com/DarbyEntLLC/dreamscroll-pwa/issues)
- Discussions: [GitHub Discussions](https://github.com/DarbyEntLLC/dreamscroll-pwa/discussions)

---

<div align="center">
  Made with ❤️ and 🙏 by DarbyEnt LLC
</div>