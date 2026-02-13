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
```

---

## 项目结构

```
app/                         # 路由层（expo-router 文件路由）
├── _layout.tsx             # 根布局（含 Tab）
├── index.tsx               # 首页 → <HomePage />
├── submit.tsx              # 提交页 → <SubmitPage />
├── about.tsx               # 关于页
└── detail/[id].tsx        # 详情页

src/
├── api/page-apis/          # 页面级 API
├── api/public-apis/types.ts # 类型定义
├── api/mock/               # Mock 数据
├── components/page-components/ # 页面组件
├── components/public-components/ # 公共组件
├── components/ui/           # UI 组件库
├── dao/                    # 数据库访问层
└── stores/                 # Zustand 状态管理
```

---

## 代码规范

### 导入规范

```typescript
// 正确 - 使用 @ 别名
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { cameraParamDAO } from '@/dao/camera-param-dao';

// 错误 - 禁止相对路径
import { Header } from '../public-components';
```

**导入顺序**: React → 外部库 → @别名 → type

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件 | PascalCase | Header, ParamCard |
| Hooks | use前缀 | useAuth |
| 状态库 | 后缀Store | useParamsStore |
| DAO | 后缀DAO | cameraParamDAO |
| 类型/接口 | PascalCase | CameraParam |
| 文件 | kebab-case | home-api.ts |
| 常量 | UPPER_SNAKE | API_BASE_URL |
| 数据库 | snake_case | camera_params |

### TypeScript 规则

- 显式声明类型，禁止 `any`
- 禁止 `as any`、`@ts-ignore`、`@ts-expect-error`
- `strict: true` 已启用

### 错误处理

```typescript
// 正确
try {
  await fetchData();
} catch (error) {
  console.error('Failed to fetch:', error);
  throw error;
}

// 错误 - 空 catch
try { } catch (error) { }
```

---

## UI 开发

### 颜色主题
- 背景: #000000
- 强调色: #ff5111
- 次要文字: #a3a3a3
- 输入框边框: #262626

### 组件架构（三分法）

```
app/          → 路由渲染
page-components/ → 业务逻辑 + UI
public-components/ → 可复用 UI
```

### 常用组件

```typescript
import { CameraParamSlider } from '@/components/public-components';
import { CameraParamPicker } from '@/components/public-components';
```

---

## 数据库（DAO）

```typescript
// 查询
const params = await cameraParamDAO.getAll();

// 插入
await cameraParamDAO.insert(param);

// 参数化查询（必须）
await db.runAsync('INSERT INTO table VALUES (?, ?)', [id, name]);
```

---

## 状态管理（Zustand）

```typescript
import { create } from 'zustand';

interface ParamsState {
  params: CameraParam[];
  loading: boolean;
  setParams: (params: CameraParam[]) => void;
  loadFromDatabase: () => Promise<void>;
}

export const useParamsStore = create<ParamsState>((set) => ({
  params: [],
  loading: true,
  setParams: (params) => set({ params }),
  loadFromDatabase: async () => {
    const params = await cameraParamDAO.getAll();
    set({ params, loading: false });
  },
}));
```

---

## 禁止事项

1. `as any`、`@ts-ignore` — 必须保证类型安全
2. 空 catch 块 — 必须记录错误
3. `console.log` — 用 `console.error`
4. 相对路径导入 — 必须用 `@` 别名
5. SQL 字符串拼接 — 必须参数化查询
6. react-native SafeAreaView — 用 react-native-safe-area-context

---

## 代码完成后检查

```bash
npx tsc --noEmit   # TypeScript 类型检查
npm run lint       # ESLint 检查
```
