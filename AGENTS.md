# AGENTS.md

**OPPO Camera Master Mode Sharing App** | Expo + React Native + Zustand | iOS/Android/Web

## COMMANDS

```bash
# Development
npm start              # Start Metro bundler
npx expo start --clear # Clear cache and restart
npm run android        # Android emulator
npm run ios            # iOS simulator
npm run web            # Web browser (dev)

# Build
npx expo export --platform web  # Export web to dist/
npx expo export --platform ios  # iOS archive
npx expo export --platform android  # Android archive

# Quality
npm run lint           # ESLint check
npx expo lint         # Expo lint with suggestions
npx tsc --noEmit      # TypeScript type check

# Project
npm run reset-project # Reset to Expo template
```

## PROJECT STRUCTURE

```
app/                      # Route layer - file-based routing
├── _layout.tsx          # Root layout with Tabs navigation
├── index.tsx            # Home page (camera params list)
├── login.tsx            # Login page (SMS verification)
├── submit.tsx           # Submit page (add new params)
└── detail/[id].tsx     # Detail page (view param)

src/
├── api/                  # API layer
│   ├── page-apis/       # Page-specific APIs
│   ├── public-apis/     # Shared types and utilities
│   └── mock/            # Mock data
├── components/          # UI components
│   └── public-components/  # Shared components
└── stores/              # Zustand state management
```

## IMPORT ORDER

1. React core (`react`, `react-native`)
2. Third-party (`expo-*`, `zustand`, etc.)
3. Path aliases (`@/src/*`)
4. Relative imports

```typescript
// CORRECT
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useParamsStore } from '../src/stores/paramsStore';
import { Header } from '../src/components/public-components';

// WRONG
import { useParamsStore } from '../src/stores/paramsStore';
import React, { useState } from 'react';
```

## NAMING CONVENTIONS

| Type | Convention | Example |
|------|------------|---------|
| Pages | PascalCase | `HomeScreen`, `LoginScreen` |
| Components | PascalCase | `Header`, `ParamCard` |
| Hooks | camelCase with 'use' | `useAuth`, `useParams` |
| Stores | camelCase + 'Store' | `userStore`, `paramsStore` |
| APIs | camelCase | `getParamsList`, `login` |
| Types | PascalCase | `CameraParam`, `User` |
| Constants | UPPER_SNAKE_CASE | `API_TIMEOUT`, `MAX_RETRY` |
| Files | kebab-case | `home-api.ts`, `params-store.ts` |

## STATE MANAGEMENT (Zustand)

```typescript
// CORRECT - Use typed store
interface ParamsState {
  params: CameraParam[];
  setParams: (params: CameraParam[]) => void;
}

export const useParamsStore = create<ParamsState>((set, get) => ({
  params: [],
  setParams: (params) => set({ params }),
}));

// WRONG - No type definition
export const useParamsStore = create((set) => ({
  params: [],
  setParams: (params) => set({ params }),
}));
```

## API RESPONSES

All APIs return Promises with mock delays.

```typescript
// Page API pattern
export function getParamsList(): Promise<CameraParam[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockParamsList);
    }, 150);
  });
}
```

## ERROR HANDLING

**NO empty catch blocks.**

```typescript
// CORRECT
try {
  await fetchData();
} catch (error) {
  console.error('Operation failed:', error);
  // Handle error - show alert, set error state, etc.
}

// WRONG - Empty catch
try {
  await fetchData();
} catch (error) {}
```

## TYPESCRIPT

- Use explicit types for props, state, and function parameters
- Use interface for objects, type for unions/primitives
- No `any` type - use `unknown` or specific types
- No type assertions (`as any`, `@ts-ignore`)

```typescript
// CORRECT
interface User {
  id: string;
  phone: string;
}
const handlePress = (id: string) => {};

// WRONG
const handlePress = (id: any) => {};
```

## UI COMPONENTS

- Use React Native components (`View`, `Text`, `FlatList`, etc.)
- Use `StyleSheet.create` for styles
- Use `SafeAreaView` for headers on mobile
- Use `testID` for testing

```typescript
// CORRECT
<View style={styles.container}>
  <Text style={styles.title}>Title</Text>
</View>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
```

## STYLING

- Theme: Black background `#000000`
- Accent color: `#ff5111` (orange)
- Secondary text: `#a3a3a3`
- Disabled text: `#737373`
- Borders: `#262626`

```typescript
container: {
  backgroundColor: '#000000',
  borderColor: '#262626',
},
title: {
  color: '#ffffff',
  fontSize: 20,
},
accent: {
  color: '#ff5111',
},
```

## PATH ALIASES

| Alias | Maps To |
|-------|---------|
| `@/*` | `./src/*` |

Relative imports for app/ directory files.

## TESTING

- Use `testID` props for element identification
- Use `Alert` for error messages
- Use `ActivityIndicator` for loading states
- Use `RefreshControl` for pull-to-refresh

## PROHIBITED

1. `as any`, `@ts-ignore`, `@ts-expect-error`
2. Empty catch blocks
3. `StyleSheet.flatten()` with inline styles
4. Hardcoded colors outside theme
5. Mixed import styles
6. `console.log` in production code (use `console.error` for errors)

## WHERE TO LOOK

| Task | Location |
|------|----------|
| Add page | `app/` + create file |
| Add API | `src/api/page-apis/` |
| Add store | `src/stores/` |
| Add component | `src/components/` |
| Types | `src/api/public-apis/types.ts` |
| Mock data | `src/api/mock/` |
