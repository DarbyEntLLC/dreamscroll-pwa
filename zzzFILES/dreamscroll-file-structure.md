# DreamScroll File Structure

```
dreamscroll-pwa/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Home page (redirects to dashboard)
│   ├── globals.css             # Global styles
│   ├── api/                    # API routes
│   │   ├── dreams/
│   │   │   └── route.ts        # Dreams CRUD operations
│   │   └── interpret/
│   │       └── route.ts        # AI interpretation endpoint
│   └── (dashboard)/            # Grouped routes
│       ├── layout.tsx          # Dashboard layout with nav
│       ├── home/
│       │   └── page.tsx
│       ├── journal/
│       │   └── page.tsx
│       ├── record/
│       │   └── page.tsx
│       ├── trends/
│       │   └── page.tsx
│       └── profile/
│           └── page.tsx
├── components/
│   ├── ui/                     # Reusable UI components
│   │   ├── DreamScrollLogo.tsx
│   │   ├── NotificationBar.tsx
│   │   ├── BottomNav.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   ├── dreams/                 # Dream-specific components
│   │   ├── DreamCard.tsx
│   │   ├── DreamList.tsx
│   │   ├── DreamRecorder.tsx
│   │   └── DreamInterpretation.tsx
│   └── auth/                   # Auth components
│       ├── SignInForm.tsx
│       └── SignUpForm.tsx
├── lib/
│   ├── types.ts                # TypeScript interfaces
│   ├── utils.ts                # Utility functions
│   ├── constants.ts            # App constants
│   └── hooks/                  # Custom React hooks
│       ├── useAudioRecorder.ts
│       ├── useNotification.ts
│       └── useDreams.ts
├── contexts/
│   ├── AuthContext.tsx         # Authentication context
│   ├── ThemeContext.tsx        # Theme/dark mode context
│   └── DreamContext.tsx        # Dreams data context
├── services/
│   ├── api.ts                  # API client
│   ├── auth.ts                 # Auth service
│   ├── dreams.ts               # Dreams service
│   └── ai.ts                   # AI interpretation service
├── docs/                       # Documentation
│   ├── README.md               # Main documentation
│   ├── DEVELOPMENT.md          # Developer guide
│   ├── USER_GUIDE.md           # User manual
│   ├── API.md                  # API documentation
│   └── DEPLOYMENT.md           # Deployment guide
└── tests/                      # Test files
    ├── components/
    └── services/
```

## Benefits of This Structure:
1. **Separation of Concerns**: Each component has its own file
2. **Reusability**: Shared components in `components/ui`
3. **Maintainability**: Easy to find and update specific features
4. **Scalability**: Easy to add new features without cluttering
5. **Type Safety**: Centralized types in `lib/types.ts`