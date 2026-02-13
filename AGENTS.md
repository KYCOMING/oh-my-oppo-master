# AGENTS.md - OPPO Camera Master Mode Sharing App

**Tech Stack**: Expo + React Native + gluestack-ui + expo-router + Zustand | iOS/Android/Web

---

## COMMANDS

```bash
# Development
npm start              # Start Metro bundler
npx expo start --clear # Clear cache and restart
npm run android        # Android emulator
npm run ios            # iOS simulator
npm run web            # Web browser (dev)

# Build
npx expo export --platform web   # Export web to dist/
npx expo export --platform android # Android archive

# Quality
npm run lint           # ESLint check
npx tsc --noEmit      # TypeScript type check
```

---

## PROJECT STRUCTURE

```
app/                      # Route layer (expo-router file-based)
├── _layout.tsx          # Root layout with Tabs
├── index.tsx            # Home page
├── login.tsx            # Login page
├── submit.tsx          # Submit page
└── detail/[id].tsx     # Detail page

src/
├── api/
│   ├── page-apis/     # Page-specific APIs
│   ├── public-apis/   # Types & utilities
│   └── mock/          # Mock data
├── components/
│   └── public-components/  # Shared components
└── stores/             # Zustand stores
```

---

## CODE STYLE

### Import Order
```typescript
// CORRECT
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useParamsStore } from '../src/stores/paramsStore';

// WRONG
import { useParamsStore } from '../src/stores/paramsStore';
import React, { useState } from 'react';
```

### Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | Header, ParamCard |
| Hooks | camelCase + use | useAuth |
| Stores | camelCase + Store | userStore |
| Types | PascalCase | CameraParam |
| Files | kebab-case | home-api.ts |

### TypeScript Rules
- Explicit types for props, state, parameters
- Use interface for objects, type for unions
- NEVER use any, @ts-ignore, as any

```typescript
// CORRECT
interface User { id: string; phone: string; }
const handlePress = (id: string) => {};

// WRONG
const handlePress = (id: any) => {};
```

---

## STATE MANAGEMENT (Zustand)

```typescript
interface ParamsState {
  params: CameraParam[];
  setParams: (params: CameraParam[]) => void;
}

export const useParamsStore = create<ParamsState>((set) => ({
  params: [],
  setParams: (params) => set({ params }),
}));
```

---

## ERROR HANDLING

NO empty catch blocks.

```typescript
// CORRECT
try {
  await fetchData();
} catch (error) {
  console.error('Operation failed:', error);
}

// WRONG
try { await fetchData(); } catch (error) {}
```

---

## STYLING

| Element | Color |
|---------|-------|
| Background | #000000 |
| Accent | #ff5111 |
| Secondary text | #a3a3a3 |
| Disabled | #737373 |
| Borders | #262626 |

Use StyleSheet.create for styles.

---

## PROHIBITED

1. as any, @ts-ignore, @ts-expect-error
2. Empty catch blocks
3. Hardcoded colors outside theme
4. console.log (use console.error for errors)

---

## WHERE TO LOOK

| Task | Location |
|------|----------|
| Add page | app/ |
| Add API | src/api/page-apis/ |
| Add store | src/stores/ |
| Types | src/api/public-apis/types.ts |
