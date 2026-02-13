# AGENTS.md - OPPO 相机大师模式分享应用

**技术栈**: Expo + React Native + gluestack-ui + expo-router + Zustand + expo-sqlite | iOS/Android/Web

---

## 命令

```bash
# 开发
npm start              # 启动 Metro 打包器
npx expo start --clear # 清除缓存并重启
npm run android        # Android 模拟器
npm run ios            # iOS 模拟器
npm run web            # Web 浏览器（开发模式）

# 构建
npx expo export --platform web     # 导出 Web 到 dist/
npx expo export --platform android # 导出 Android 安装包

# 代码质量
npm run lint        # ESLint 检查
npx tsc --noEmit   # TypeScript 类型检查

# 测试（本项目暂无测试框架）
# 如需添加测试，推荐: npm install jest @testing-library/react-native
```

---

## 项目结构

```
app/                         # 路由层（expo-router 文件路由，只做渲染）
├── _layout.tsx             # 根布局（含 Tab）
├── index.tsx               # 首页 → <HomePage />
├── submit.tsx              # 提交页 → <SubmitPage />
├── about.tsx               # 关于页 → <AboutPage />
└── detail/[id].tsx        # 详情页 → <DetailPage />

src/
├── api/
│   ├── page-apis/          # 页面级 API
│   ├── public-apis/        # 类型和工具
│   └── mock/               # Mock 数据
├── components/
│   ├── page-components/    # 页面组件（业务逻辑 + UI）
│   └── public-components/  # 公共组件（可复用 UI）
├── dao/                    # 数据库访问层（SQLite）
│   ├── database.ts        # 数据库初始化
│   └── camera-param-dao.ts # CameraParam CRUD 操作
└── stores/                 # Zustand 状态管理
```

---

## 代码规范

### 导入规范（必须使用 @ 别名）

```typescript
// 正确 - 使用 @ 别名
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useParamsStore } from '@/stores/paramsStore';
import { Header } from '@/components/public-components';

// 错误 - 禁止使用相对路径
import { Header } from '../public-components';
import { Header } from '../../components/public-components';
```

### 导入顺序（必须遵守）

```
1. React 相关 (react, react-native)
2. 外部库 (expo-router, zustand, axios 等)
3. @ 别名导入 (@/ 开头的路径)
4. 类型导入 (仅 type 关键字)
```

```typescript
// 标准示例
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { create } from 'zustand';
import axios from 'axios';

import { CameraParam } from '@/api/public-apis/types';
import { cameraParamDAO } from '@/dao/camera-param-dao';
import { useParamsStore } from '@/stores/paramsStore';
import { Header } from '@/components/public-components';

import type { SomeType } from '@/some/path';
```

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件 | PascalCase | Header, ParamCard |
| Hooks | camelCase + use | useAuth |
| 状态库 | camelCase + Store | userStore |
| DAO | camelCase + DAO | cameraParamDAO |
| 类型/接口 | PascalCase | CameraParam |
| 文件 | kebab-case | home-api.ts |
| 常量 | UPPER_SNAKE_CASE | API_BASE_URL |
| 数据库表 | snake_case | camera_params |
| 数据库列 | snake_case | created_at |

### TypeScript 规则（严格）

- 为 props、state、参数显式声明类型，禁止 `any`
- 对象用 `interface`，联合类型用 `type`
- 禁止 `as any`、`@ts-ignore`、`@ts-expect-error`
- 使用严格空检查：`strictNullChecks: true`

### 错误处理

- 禁止空 catch 块，必须记录错误
- 使用 `console.error` 记录错误，禁止 `console.log`
- DAO 层抛出错误，由调用层处理

```typescript
// 正确
try {
  await fetchData();
} catch (error) {
  console.error('Failed to fetch:', error);
  throw error;
}

// 错误
try { } catch (error) { }
```

### SQL 规范

- 使用参数化查询，禁止字符串拼接
- 表名、列名使用 snake_case
- 索引命名: `idx_<table>_<column>`
- JSON 字段存储序列化对象

```typescript
// 正确
await db.runAsync(
  'INSERT INTO camera_params (id, title) VALUES (?, ?)',
  [id, title]
);

// 错误
await db.runAsync(
  'INSERT INTO camera_params (id, title) VALUES ("' + id + '", "' + title + '")'
);
```

---

## UI 开发

### 优先使用 gluestack-ui

使用 MCP 工具查询组件：

```bash
gluestack-ui-mcp_select_components       # 选择组件
gluestack-ui-mcp_get_selected_components_docs  # 获取文档
```

### 样式规范

- 使用 `StyleSheet.create` 定义样式
- 使用 `react-native-safe-area-context`（禁用 react-native SafeAreaView）
- 颜色主题：背景 #000000、强调色 #ff5111、次要文字 #a3a3a3

### ScrollView 最佳实践

```typescript
<ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
// style 设置 flex，contentContainerStyle 设置 padding
const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  content: { paddingBottom: 120 },
});
```

---

## 组件分层架构

### 三分法（必须遵守）

1. **路由组件** (`app/`) — 只负责路由渲染，不含业务逻辑
2. **页面组件** (`src/components/page-components/`) — 包含页面业务逻辑和 UI
3. **公共组件** (`src/components/public-components/`) — 可复用的 UI 组件

### 示例

```typescript
// app/index.tsx（路由组件）
import HomePage from '@/components/page-components/HomePage';
export default function HomeScreen() { return <HomePage />; }

// src/components/page-components/HomePage.tsx（页面组件）
export default function HomePage() { /* 业务逻辑 + UI */ }
```

---

## 数据库层（DAO）

### 架构

```
src/dao/
├── database.ts          # 数据库初始化、表创建、初始数据
└── camera-param-dao.ts  # CameraParam CRUD 操作
```

### 数据库初始化

```typescript
import { initDatabase } from '@/dao/database';

// 在 app/_layout.tsx 中调用
await initDatabase();
```

### DAO 使用

```typescript
import { cameraParamDAO } from '@/dao/camera-param-dao';

// 查询
const params = await cameraParamDAO.getAll();
const param = await cameraParamDAO.getById(id);

// 插入
await cameraParamDAO.insert(param);

// 更新
await cameraParamDAO.update(id, { title: '新标题' });

// 删除
await cameraParamDAO.delete(id);
```

### 数据库表结构

```sql
CREATE TABLE camera_params (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  images TEXT NOT NULL,      -- JSON array
  thumbnail TEXT,
  camera_settings TEXT NOT NULL,  -- JSON object
  author_phone TEXT,
  author_nickname TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX idx_created_at ON camera_params(created_at);
```

---

## 状态管理（Zustand）

```typescript
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
    const params = await cameraParamDAO.getAll();
    set({ params, loading: false });
  },
}));
```

---

## 禁止事项

1. `as any`、`@ts-ignore`、`@ts-expect-error` — 必须保证类型安全
2. 空 catch 块 — 必须记录错误
3. 使用主题外的颜色
4. `console.log` — 用 `console.error` 记录错误
5. react-native SafeAreaView — 用 react-native-safe-area-context
6. 相对路径导入 — 必须使用 `@` 别名
7. SQL 字符串拼接 — 必须使用参数化查询

---

## 代码完成后检查

```bash
npx tsc --noEmit   # TypeScript 类型检查
npm run lint       # ESLint 检查
```

---

## 关键模式

### 导航
- expo-router 文件路由
- `useRouter` 编程式导航
- `usePathname` 获取当前路由

### API 层
- Mock 数据：`src/api/mock/`
- API 函数：基于 Promise + try/catch 错误处理

### 数据流
1. App 启动 → `initDatabase()` → `loadFromDatabase()`
2. 提交 → API → DAO → SQLite
3. 首页 → API → DAO → SQLite → Zustand

### 路径别名配置
- TypeScript: `tsconfig.json` 中 `paths: { "@/*": ["./src/*"] }`
- Babel: `babel.config.js` 中 `module-resolver` 插件配置
