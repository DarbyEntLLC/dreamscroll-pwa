# DreamScroll Development Guide

This guide covers everything you need to know to develop and contribute to DreamScroll.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Development Setup](#development-setup)
3. [Code Style Guide](#code-style-guide)
4. [Component Guidelines](#component-guidelines)
5. [State Management](#state-management)
6. [API Integration](#api-integration)
7. [Testing](#testing)
8. [Debugging](#debugging)
9. [Performance](#performance)
10. [Deployment](#deployment)

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **State**: React Context + Hooks
- **Database**: Supabase (PostgreSQL)
- **AI APIs**: OpenAI, Anthropic, Google AI
- **Deployment**: Vercel

### Project Structure
```
src/
├── app/          # Next.js app router pages
├── components/   # Reusable React components
├── lib/          # Utilities, types, constants
├── contexts/     # React context providers
├── services/     # API and external services
└── hooks/        # Custom React hooks
```

## Development Setup

### Prerequisites
```bash
# Required versions
node >= 18.0.0
npm >= 9.0.0
git >= 2.0.0
```

### Initial Setup
```bash
# Clone repository
git clone https://github.com/DarbyEntLLC/dreamscroll-pwa.git
cd dreamscroll-pwa

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Set up git hooks
npm run prepare

# Start development server
npm run dev
```

### Environment Variables

Create `.env.local`:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx

# AI Services
OPENAI_API_KEY=sk-xxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxx
GOOGLE_AI_API_KEY=xxxxx

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="DreamScroll"

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-xxxxx
```

## Code Style Guide

### TypeScript Guidelines

```typescript
// ✅ Good: Use explicit types
interface DreamProps {
  dream: Dream;
  onSelect: (dream: Dream) => void;
}

// ❌ Bad: Avoid 'any'
const processDream = (data: any) => { ... }

// ✅ Good: Use enums for constants
enum DreamCategory {
  Prophetic = 'prophetic',
  Encouragement = 'encouragement',
  Warning = 'warning'
}
```

### React Component Patterns

```typescript
// ✅ Good: Functional component with TypeScript
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary',
  children,
  onClick 
}) => {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-lg',
        variant === 'primary' && 'bg-blue-500 text-white',
        variant === 'secondary' && 'bg-gray-200 text-gray-800'
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### File Naming Conventions
- Components: `PascalCase.tsx` (e.g., `DreamCard.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Types: `types.ts` or `dream.types.ts`
- Hooks: `use*.ts` (e.g., `useDreams.ts`)

## Component Guidelines

### Component Structure

```typescript
// components/dreams/DreamCard.tsx
import { Dream } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';

interface DreamCardProps {
  dream: Dream;
  onSelect?: (dream: Dream) => void;
  isSelected?: boolean;
}

export function DreamCard({ dream, onSelect, isSelected }: DreamCardProps) {
  // Hooks first
  const [isBookmarked, setIsBookmarked] = useState(dream.isBookmarked);
  
  // Event handlers
  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    // API call to update bookmark
  };
  
  // Render
  return (
    <Card 
      onClick={() => onSelect?.(dream)}
      className={cn(
        'cursor-pointer transition-all',
        isSelected && 'ring-2 ring-blue-500'
      )}
    >
      {/* Card content */}
    </Card>
  );
}
```

### Reusable UI Components

Create small, focused components:
```typescript
// components/ui/Badge.tsx
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning';
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span className={cn(
      'px-2 py-1 text-xs rounded-full',
      variants[variant]
    )}>
      {children}
    </span>
  );
}
```

## State Management

### Context Pattern

```typescript
// contexts/DreamContext.tsx
interface DreamContextType {
  dreams: Dream[];
  loading: boolean;
  addDream: (dream: Omit<Dream, 'id'>) => Promise<void>;
  updateDream: (id: number, updates: Partial<Dream>) => Promise<void>;
  deleteDream: (id: number) => Promise<void>;
}

const DreamContext = createContext<DreamContextType | undefined>(undefined);

export function DreamProvider({ children }: { children: React.ReactNode }) {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Implementation...
  
  return (
    <DreamContext.Provider value={{ dreams, loading, addDream, updateDream, deleteDream }}>
      {children}
    </DreamContext.Provider>
  );
}

// Custom hook for using context
export function useDreams() {
  const context = useContext(DreamContext);
  if (!context) {
    throw new Error('useDreams must be used within DreamProvider');
  }
  return context;
}
```

## API Integration

### API Route Pattern

```typescript
// app/api/dreams/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const { data: dreams, error } = await supabase
      .from('dreams')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return NextResponse.json({ dreams });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch dreams' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const body = await request.json();
  
  try {
    // Validate input
    const validatedDream = dreamSchema.parse(body);
    
    // AI interpretation
    const interpretation = await interpretDream(validatedDream);
    
    // Save to database
    const { data, error } = await supabase
      .from('dreams')
      .insert({
        ...validatedDream,
        ...interpretation
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return NextResponse.json({ dream: data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create dream' },
      { status: 500 }
    );
  }
}
```

### Service Layer

```typescript
// services/dreams.ts
export class DreamService {
  static async interpretDream(content: string, llm: string): Promise<DreamInterpretation> {
    const endpoint = `/api/interpret`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, llm })
    });
    
    if (!response.ok) {
      throw new Error('Failed to interpret dream');
    }
    
    return response.json();
  }
  
  static async getDreamAnalytics(userId: string): Promise<DreamAnalytics> {
    // Implementation
  }
}
```

## Testing

### Component Testing

```typescript
// __tests__/components/DreamCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { DreamCard } from '@/components/dreams/DreamCard';
import { mockDream } from '@/tests/mocks';

describe('DreamCard', () => {
  it('renders dream title and content', () => {
    render(<DreamCard dream={mockDream} />);
    
    expect(screen.getByText(mockDream.title)).toBeInTheDocument();
    expect(screen.getByText(mockDream.content)).toBeInTheDocument();
  });
  
  it('calls onSelect when clicked', () => {
    const handleSelect = jest.fn();
    render(<DreamCard dream={mockDream} onSelect={handleSelect} />);
    
    fireEvent.click(screen.getByRole('article'));
    expect(handleSelect).toHaveBeenCalledWith(mockDream);
  });
});
```

### API Testing

```typescript
// __tests__/api/dreams.test.ts
import { GET, POST } from '@/app/api/dreams/route';
import { createMocks } from 'node-mocks-http';

describe('/api/dreams', () => {
  it('GET returns dreams', async () => {
    const { req, res } = createMocks({ method: 'GET' });
    
    await GET(req);
    
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toHaveProperty('dreams');
  });
});
```

## Debugging

### Debug Configuration

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "args": ["dev"],
      "env": {
        "NODE_OPTIONS": "--inspect"
      }
    }
  ]
}
```

### Common Issues & Solutions

**Build Errors**
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

**TypeScript Errors**
```bash
# Check types
npm run type-check

# Generate types from Supabase
npm run generate-types
```

## Performance

### Optimization Techniques

1. **Image Optimization**
```typescript
import Image from 'next/image';

<Image
  src="/dream-illustration.png"
  alt="Dream"
  width={300}
  height={200}
  loading="lazy"
  placeholder="blur"
/>
```

2. **Code Splitting**
```typescript
// Dynamic imports
const DreamAnalytics = dynamic(
  () => import('@/components/analytics/DreamAnalytics'),
  { loading: () => <Spinner /> }
);
```

3. **Memoization**
```typescript
const MemoizedDreamList = memo(DreamList, (prevProps, nextProps) => {
  return prevProps.dreams.length === nextProps.dreams.length;
});
```

## Deployment

### Pre-deployment Checklist

- [ ] Run `npm run build` successfully
- [ ] All tests pass: `npm test`
- [ ] TypeScript checks pass: `npm run type-check`
- [ ] Lint passes: `npm run lint`
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] API rate limits configured

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Monitoring

```typescript
// lib/monitoring.ts
export function logError(error: Error, context?: any) {
  console.error('Error:', error);
  
  // Send to monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Sentry, LogRocket, etc.
  }
}
```

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Commit Message Convention

Follow conventional commits:
```
feat: add dream export functionality
fix: resolve audio recording issue on iOS
docs: update API documentation
style: format code with prettier
refactor: simplify dream interpretation logic
test: add tests for dream service
chore: update dependencies
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Need Help?

- Check existing [issues](https://github.com/DarbyEntLLC/dreamscroll-pwa/issues)
- Join our [Discord community](https://discord.gg/dreamscroll)
- Email: dev@dreamscroll.app

---

Happy coding! 🚀