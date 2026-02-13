# SQLite DAO Layer Implementation Plan

## TL;DR

> **Quick Summary**: Add SQLite local database storage for submitted camera parameters. Create a dedicated DAO layer for database operations, replacing mock APIs with real SQLite queries.
> 
> **Deliverables**:
> - `src/dao/database.ts` - SQLite initialization and table creation
> - `src/dao/camera-param-dao.ts` - CRUD operations for CameraParam
> - Modified `src/api/page-apis/submit-api.ts` - Save to SQLite
> - Modified `src/api/page-apis/home-api.ts` - Query from SQLite
> - Modified `src/stores/paramsStore.ts` - Load from SQLite on init
> 
> **Estimated Effort**: Short (3-5 tasks)
> **Parallel Execution**: NO - sequential (DAO must exist before API integration)
> **Critical Path**: Database init → DAO → API integration → Store integration

---

## Context

### Original Request
提交时的数据保存本地，使用 SQLite，现在查询也从数据库中查询，目前暂时不会有网络请求，新增一个 DAO 层来专门存放调用数据库的 API，注意工程架构和 SQL 的合理性。

### Interview Summary
**Key Discussions**:
- Use expo-sqlite (Expo official library, works with Expo Go)
- Create `src/dao/` directory for database layer
- Save submitted data to SQLite instead of mock API
- Query data from SQLite instead of Zustand-only
- No network requests for now

**Data Model (CameraParam)**:
```typescript
interface CameraParam {
  id: string;
  title: string;
  description: string;
  images: string[];      // 9 image URLs
  thumbnail: string;
  cameraSettings: {
    iso: string;
    shutterSpeed: string;
    aperture: string;
    whiteBalance: string;
    focus: string;
    exposure: string;
  };
  author: { phone: string; nickname?: string };
  createdAt: string;
}
```

### Metis Review
**Identified Gaps** (addressed):
- ✅ Added error handling strategy (throw errors to UI)
- ✅ Defined 5 CRUD methods (getAll, getById, insert, delete, update)
- ✅ Specified JSON columns for arrays/objects
- ✅ Added index on created_at for query performance

**Guardrails Applied**:
- Keep Zustand for UI state, SQLite for persistence
- DAO returns Promise (async API)
- Parameterized SQL queries (no string concatenation)
- Simple function-based DAO, not classes with inheritance

---

## Work Objectives

### Core Objective
Implement SQLite local persistence layer with DAO pattern for camera parameter submissions.

### Concrete Deliverables
- [x] Database initialization with schema
- [x] CameraParam DAO with 5 CRUD methods
- [x] Submit API uses SQLite insert
- [x] Home API uses SQLite query
- [x] Zustand store loads from SQLite on app start

### Definition of Done
- [ ] Submit saves to SQLite and persists across app restarts
- [ ] Home page loads data from SQLite
- [ ] No mock API calls in final flow
- [ ] TypeScript compiles without errors
- [ ] ESLint passes

### Must Have
- expo-sqlite dependency installed
- Database created on first launch
- CRUD operations work correctly
- Data persists after app restart
- Proper error handling with descriptive messages

### Must NOT Have (Guardrails)
- ❌ Generic Repository pattern or base class
- ❌ Migration framework or versioning
- ❌ Search/filter functionality beyond basic getAll
- ❌ Pagination (unless needed for MVP)
- ❌ Image compression or external storage logic
- ❌ Data export functionality

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO (no test framework in project)
- **Automated tests**: NONE (manual verification)
- **Agent-Executed QA**: MANDATORY for all tasks

### Agent-Executed QA Scenarios (MANDATORY)

> Every task must include verification by running the app or inspecting the database.

**Scenario: Submit saves to SQLite**
```
Tool: Playwright (expo dev scenario)
Preconditions: Dev server running, app launched
Steps:
  1. Navigate to /submit
  2. Fill: title = "Test Photo", description = "Test desc"
  3. Fill: first image input = "https://example.com/img.jpg"
  4. Fill: ISO = "400", shutterSpeed = "1/60"
  5. Click submit button
  6. Wait for navigation to home
  7. Navigate to /submit again
  8. Assert: New record appears in list (from SQLite)
Expected Result: Data persists after navigation
```

**Scenario: Data persists after app restart**
```
Tool: Bash (expo restart)
Preconditions: App has submitted data
Steps:
  1. Force close the app
  2. Re-launch the app
  3. Navigate to home
  4. Assert: Previously submitted data is visible
Expected Result: Data loaded from SQLite
```

**Scenario: Query from SQLite works**
```
Tool: Manual inspection via debug
Preconditions: Database has data
Steps:
  1. Open React Native Debugger
  2. Execute: DAO.getAll()
  3. Assert: Returns array of CameraParam objects
  4. Assert: JSON fields parse correctly (images, cameraSettings)
Expected Result: Proper data retrieval
```

---

## Execution Strategy

### Sequential Execution
```
Step 1: Install expo-sqlite dependency
Step 2: Create database.ts with init
Step 3: Create camera-param-dao.ts with CRUD
Step 4: Modify submit-api.ts to use DAO
Step 5: Modify home-api.ts to use DAO
Step 6: Modify paramsStore.ts to load from SQLite
```

---

## TODOs

### Task 1: Install expo-sqlite Dependency

**What to do**:
- Run `npx expo install expo-sqlite` to add the dependency
- Verify package.json includes expo-sqlite
- Run `npx expo install --check` to verify compatibility

**Must NOT do**:
- Don't modify any other files yet

**Recommended Agent Profile**:
- **Category**: `quick`
- **Skills**: None required for dependency installation
- **Skills Evaluated but Omitted**: N/A

**Parallelization**:
- **Can Run In Parallel**: NO
- **Sequential**: First task
- **Blocks**: All subsequent tasks

**References**:
- Official docs: `https://docs.expo.dev/versions/latest/sdk/sqlite/` - Installation and basic usage

**Acceptance Criteria**:
- [ ] `expo-sqlite` added to package.json dependencies
- [ ] `npx expo install --check` passes
- [ ] Import works: `import * as SQLite from 'expo-sqlite'`

**Commit**: NO

---

### Task 2: Create Database Initialization (src/dao/database.ts)

**What to do**:
- Create `src/dao/database.ts`
- Export function `initDatabase()` that:
  - Opens/creates SQLite database named `camera_params.db`
  - Creates table `camera_params` with proper schema
  - Creates index on `created_at`
  - Returns the database connection
- Handle errors with descriptive messages

**Schema Design**:
```sql
CREATE TABLE IF NOT EXISTS camera_params (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  images TEXT NOT NULL,      -- JSON array stringified
  thumbnail TEXT,
  camera_settings TEXT NOT NULL,  -- JSON object stringified
  author_phone TEXT,
  author_nickname TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_created_at ON camera_params(created_at DESC);
```

**Must NOT do**:
- Don't implement CRUD here (separate file)
- Don't use string concatenation for SQL (use parameterized queries)

**Recommended Agent Profile**:
- **Category**: `unspecified-low`
- **Skills**: None
- **Skills Evaluated but Omitted**: N/A

**Parallelization**:
- **Can Run In Parallel**: NO
- **Depends On**: Task 1 (dependency installed)
- **Blocks**: Task 3 (DAO needs database)

**References**:
- `src/api/public-apis/types.ts:CameraParam` - Data model to map to
- `https://docs.expo.dev/versions/latest/sdk/sqlite/` - expo-sqlite API

**Acceptance Criteria**:
- [ ] File created: `src/dao/database.ts`
- [ ] `initDatabase()` creates table if not exists
- [ ] Index created on `created_at`
- [ ] Function is async and returns database connection
- [ ] Error handling with try/catch and descriptive errors

**Commit**: NO (will batch commit at end)

---

### Task 3: Create CameraParam DAO (src/dao/camera-param-dao.ts)

**What to do**:
- Create `src/dao/camera-param-dao.ts` with 5 CRUD functions:
  - `getAll(): Promise<CameraParam[]>` - Get all records sorted by created_at DESC
  - `getById(id: string): Promise<CameraParam | null>` - Get single record
  - `insert(param: CameraParam): Promise<void>` - Insert new record
  - `update(id: string, updates: Partial<CameraParam>): Promise<boolean>` - Update record
  - `delete(id: string): Promise<boolean>` - Delete record
- Convert between CameraParam (with JSON objects) and SQLite rows (with stringified JSON)
- Use parameterized queries for all SQL

**JSON Serialization**:
```typescript
// To SQLite row:
const row = {
  ...param,
  images: JSON.stringify(param.images),
  cameraSettings: JSON.stringify(param.cameraSettings),
  author_phone: param.author.phone,
  author_nickname: param.author.nickname || null,
  created_at: param.createdAt,
};

// From SQLite row to CameraParam:
const param: CameraParam = {
  id: row.id,
  title: row.title,
  description: row.description,
  images: JSON.parse(row.images),
  thumbnail: row.thumbnail,
  cameraSettings: JSON.parse(row.cameraSettings),
  author: { phone: row.author_phone, nickname: row.author_nickname },
  createdAt: row.created_at,
};
```

**Must NOT do**:
- Don't expose raw SQL outside this file
- Don't add search/filter beyond getAll

**Recommended Agent Profile**:
- **Category**: `unspecified-high`
- **Skills**: None
- **Skills Evaluated but Omitted**: N/A

**Parallelization**:
- **Can Run In Parallel**: NO
- **Depends On**: Task 2 (database init)
- **Blocks**: Task 4 (API integration)

**References**:
- `src/dao/database.ts:initDatabase()` - Database connection
- `src/api/public-apis/types.ts:CameraParam` - Data model

**Acceptance Criteria**:
- [ ] File created: `src/dao/camera-param-dao.ts`
- [ ] All 5 functions exported
- [ ] getAll returns sorted array (DESC by created_at)
- [ ] getById returns null for non-existent (not throw)
- [ ] insert/update/delete use parameterized queries
- [ ] JSON serialization handles nested objects correctly
- [ ] Error handling with descriptive error messages

**Commit**: NO

---

### Task 4: Modify Submit API to Use SQLite (src/api/page-apis/submit-api.ts)

**What to do**:
- Modify `src/api/page-apis/submit-api.ts`
- Replace mockSubmit with DAO insert:
  ```typescript
  import { CameraParam } from '@/api/public-apis/types';
  import { cameraParamDAO } from '@/dao/camera-param-dao';

  export function submitParam(param: Omit<CameraParam, 'id' | 'createdAt'>): Promise<{ id: string }> {
    const id = 'sub_' + Date.now().toString(16) + Math.random().toString(16).slice(2, 6);
    const fullParam: CameraParam = {
      ...param,
      id,
      createdAt: new Date().toISOString(),
    };
    return cameraParamDAO.insert(fullParam).then(() => ({ id }));
  }
  ```

**Must NOT do**:
- Don't remove type definitions
- Don't change the function signature (must return `{ id: string }`)

**Recommended Agent Profile**:
- **Category**: `unspecified-low`
- **Skills**: None
- **Skills Evaluated but Omitted**: N/A

**Parallelization**:
- **Can Run In Parallel**: NO
- **Depends On**: Task 3 (DAO created)
- **Blocks**: Task 5

**References**:
- `src/api/page-apis/submit-api.ts` - Current implementation
- `src/dao/camera-param-dao.ts:insert()` - DAO method

**Acceptance Criteria**:
- [ ] Function signature unchanged: `(param: Omit<CameraParam, 'id' | 'createdAt'>) => Promise<{ id: string }>`
- [ ] Inserts to SQLite via DAO
- [ ] Returns generated id
- [ ] No more mockSubmit import
- [ ] Error handling (try/catch)

**Commit**: NO

---

### Task 5: Modify Home API to Use SQLite (src/api/page-apis/home-api.ts)

**What to do**:
- Read current implementation of `src/api/page-apis/home-api.ts`
- Modify to use DAO instead of mock:
  ```typescript
  import { cameraParamDAO } from '@/dao/camera-param-dao';

  export async function getParams(): Promise<CameraParam[]> {
    return cameraParamDAO.getAll();
  }
  ```

**Must NOT do**:
- Don't break the return type contract

**Recommended Agent Profile**:
- **Category**: `unspecified-low`
- **Skills**: None
- **Skills Evaluated but Omitted**: N/A

**Parallelization**:
- **Can Run In Parallel**: NO
- **Depends On**: Task 3 (DAO created)
- **Blocks**: Task 6

**References**:
- `src/api/page-apis/home-api.ts` - Current implementation
- `src/dao/camera-param-dao.ts:getAll()` - DAO method

**Acceptance Criteria**:
- [ ] Returns `Promise<CameraParam[]>`
- [ ] Queries from SQLite via DAO
- [ ] No more mockHome import

**Commit**: NO

---

### Task 6: Modify Zustand Store to Load from SQLite (src/stores/paramsStore.ts)

**What to do**:
- Modify `src/stores/paramsStore.ts`
- Add initialization that loads from SQLite:
  ```typescript
  import { cameraParamDAO } from '@/dao/camera-param-dao';

  interface ParamsState {
    params: CameraParam[];
    loading: boolean;
    setParams: (params: CameraParam[]) => void;
    addParam: (param: CameraParam) => void;
    getParam: (id: string) => CameraParam | undefined;
    loadFromDatabase: () => Promise<void>;
  }

  export const useParamsStore = create<ParamsState>((set, get) => ({
    params: [],
    loading: true,
    
    setParams: (params) => set({ params }),
    
    addParam: (param) => set((state) => ({
      params: [param, ...state.params]
    })),
    
    getParam: (id) => get().params.find((p) => p.id === id),
    
    loadFromDatabase: async () => {
      try {
        const params = await cameraParamDAO.getAll();
        set({ params, loading: false });
      } catch (error) {
        console.error('Failed to load params from database:', error);
        set({ loading: false });
      }
    },
  }));
  ```
- Ensure the app calls `loadFromDatabase()` on mount (e.g., in _layout.tsx or HomePage)

**Must NOT do**:
- Don't remove the Zustand store entirely (still needed for UI state)
- Don't break existing API (setParams, addParam, getParam must work)

**Recommended Agent Profile**:
- **Category**: `unspecified-low`
- **Skills**: None
- **Skills Evaluated but Omitted**: N/A

**Parallelization**:
- **Can Run In Parallel**: NO
- **Depends On**: Task 5 (home-api uses DAO)
- **Blocks**: None (final integration)

**References**:
- `src/stores/paramsStore.ts` - Current implementation
- `src/dao/camera-param-dao.ts:getAll()` - DAO method
- `app/_layout.tsx` or `app/index.tsx` - Where to call init

**Acceptance Criteria**:
- [ ] `loadFromDatabase()` function exists
- [ ] Called on app startup
- [ ] Loading state handled
- [ ] Error handling for database failures

**Commit**: YES (after all tasks complete)

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 6 | `feat(db): add SQLite DAO layer for camera params` | src/dao/*, src/api/page-apis/*, src/stores/paramsStore.ts | Manual QA |

---

## Success Criteria

### Verification Commands
```bash
npx tsc --noEmit   # TypeScript type check
npm run lint       # ESLint check
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] Submit saves to SQLite
- [ ] Home loads from SQLite
- [ ] Data persists after app restart

---

## Default Decisions Applied

Based on Metis analysis, I applied these defaults:

| Decision | Default Applied | Can Override |
|----------|-----------------|--------------|
| Image storage | Store as JSON array of URLs (not base64) | User can change to base64 if needed |
| Existing Zustand data | Start fresh (no migration) | Can add migration logic if needed |
| Error handling | Throw errors to UI (not silent) | - |
| DAO pattern | Simple functions, not classes | - |

---

## Decisions Needed

Do you agree with these decisions? Please confirm:

1. **Image storage**: Store image URLs as JSON array (not base64) - simpler for MVP
2. **Data migration**: Start fresh, no migration from existing Zustand data
3. **Error handling**: Throw descriptive errors to UI

If you have different preferences, let me know before I finalize the plan.
