# SkinCare AI Platform - Implementation Guide

## Current State

✅ **Foundation Complete**
- Design system properly configured (Figtree + Noto Sans, healthcare color palette)
- Accessible components created (Button, Input with WCAG AAA focus rings)
- Global accessibility features (skip links, keyboard navigation, prefers-reduced-motion)
- Login page implemented with role selection
- Patient dashboard and AI detection pages functional
- Dashboard layout with role-based navigation

## Component Patterns

### Button Component
```tsx
<Button variant="cta" size="md" isLoading={false}>
  Action
</Button>
// Variants: primary, secondary, cta, outline
// Sizes: sm, md, lg
```

### Input Component
```tsx
<Input
  type="email"
  label="Email"
  placeholder="Enter email"
  error="Invalid email"
  helperText="Use your work email"
  required
/>
```

## Pages to Complete

### Doctor Module

#### 1. `/app/(dashboard)/doctor/dashboard/page.tsx`
```
- Stats: Pending requests, active consultations, completed consultations
- Recent requests from patients
- Quick action: View patient list
- Mock data from lib/mock-data.ts
```

#### 2. `/app/(dashboard)/doctor/requests/page.tsx`
```
- List of patients requesting consultation
- Each row: Patient name, scan preview, date, status
- Actions: View details, accept, decline
- Filter by status (pending, completed)
```

#### 3. `/app/(dashboard)/doctor/consultations/page.tsx`
```
- Chat interface (UI only)
- Message list with bubbles
- Input form at bottom
- Attach file option (UI only)
- Display previous consulted patients
```

#### 4. `/app/(dashboard)/doctor/profile/page.tsx`
```
- Doctor info (name, specialization, experience)
- Edit button (UI only - no save)
- Availability management
- Rating and reviews display
```

### Patient Module

#### 5. `/app/(dashboard)/patient/consultations/page.tsx`
```
- Doctor list with search/filter
- Each doctor card: name, specialization, rating, availability, book button
- Booking form (modal or inline)
- Display if user already has an active consultation with doctor
```

#### 6. `/app/(dashboard)/patient/history/page.tsx`
```
- Tabbed interface: Scans | Consultations
- Scans: date, prediction, confidence, view details button
- Consultations: date, doctor name, status, view details button
- Pagination for large lists
```

## Shared Components to Create

### 1. `components/UserCard.tsx`
```tsx
interface UserCardProps {
  name: string;
  role: 'doctor' | 'patient';
  avatar?: string;
  specialty?: string;
  rating?: number;
  onAction?: () => void;
}
```

### 2. `components/ResultCard.tsx`
```tsx
interface ResultCardProps {
  disease: string;
  confidence: number;
  description: string;
  date: Date;
  viewDetails?: () => void;
}
```

### 3. `components/ChatBubble.tsx`
```tsx
interface ChatBubbleProps {
  message: string;
  sender: 'user' | 'doctor';
  timestamp: Date;
  avatar?: string;
}
```

### 4. `components/Modal.tsx`
```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
```

### 5. `components/Tabs.tsx`
```tsx
interface TabsProps {
  tabs: Array<{ label: string; id: string }>;
  activeTab: string;
  onChange: (id: string) => void;
  children: React.ReactNode;
}
```

## Icon Usage (Heroicons)

Replace all emojis with Heroicons:
```tsx
import { UserIcon, CalendarIcon, ChatBubbleLeftIcon, HeartIcon } from 'heroicons/react/24/outline';

<UserIcon className="w-6 h-6" aria-hidden="true" />
```

## Accessibility Checklist

- [ ] All buttons have `focus-ring` class
- [ ] All links and clickable elements use `cursor-pointer`
- [ ] Forms have `<label>` with `htmlFor`
- [ ] Images have `alt` text
- [ ] Use `aria-label` for icon-only buttons
- [ ] Use `aria-describedby` for error messages
- [ ] Keyboard navigation works (Tab order makes sense)
- [ ] Skip link visible on Tab press
- [ ] Color contrast 4.5:1 minimum (use online checker)
- [ ] Responsive at 375px, 768px, 1024px, 1440px

## Build & Test

```bash
# Build and check for errors
npm run build

# Run dev server
npm run dev

# Visit http://localhost:3000 for testing
```

## File Structure After Completion

```
app/
├── (auth)/
│   └── login/page.tsx ✅
├── (dashboard)/
│   ├── layout.tsx ✅
│   ├── patient/
│   │   ├── dashboard/page.tsx ✅
│   │   ├── detection/page.tsx ✅
│   │   ├── consultations/page.tsx 📝
│   │   └── history/page.tsx 📝
│   └── doctor/
│       ├── dashboard/page.tsx 📝
│       ├── requests/page.tsx 📝
│       ├── consultations/page.tsx 📝
│       └── profile/page.tsx 📝
└── page.tsx ✅ (redirect to login)

components/
├── Button.tsx ✅
├── Input.tsx ✅
├── UserCard.tsx 📝
├── ResultCard.tsx 📝
├── ChatBubble.tsx 📝
├── Modal.tsx 📝
└── Tabs.tsx 📝

lib/
├── types.ts ✅
└── mock-data.ts ✅

app/
├── globals.css ✅
└── layout.tsx ✅
```

## Next Priority

1. Create shared components (UserCard, ResultCard, ChatBubble, Modal, Tabs)
2. Build doctor module pages
3. Build patient consultations and history
4. Add Heroicons ✅ (already installed)
5. Replace all emojis with icons
6. Test full keyboard navigation
7. Final build and accessibility audit
