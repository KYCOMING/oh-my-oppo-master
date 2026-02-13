# AGENTS.md - OPPO 相机大师模式分享应用

**技术栈**: Expo + React Native + gluestack-ui + expo-router + Zustand | iOS/Android/Web

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
npx expo lint          # ESLint 检查
npx tsc --noEmit       # TypeScript 类型检查
```

---

## 项目结构

```
app/                      # 路由层（expo-router 文件路由）
├── _layout.tsx          # 根布局（含 Tab）
├── index.tsx            # 首页
├── login.tsx            # 登录页
├── submit.tsx          # 提交页
└── detail/[id].tsx     # 详情页

src/
├── api/
│   ├── page-apis/     # 页面级 API
│   ├── public-apis/   # 类型和工具
│   └── mock/          # Mock 数据
├── components/
│   └── public-components/  # 共享组件
└── stores/             # Zustand 状态管理
```

---

## 代码规范

### 导入顺序（必须遵守）
```typescript
// 正确顺序：react > react-native > 外部库 > 项目内部导入
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useParamsStore } from '../src/stores/paramsStore';
import { Header } from '../src/components/public-components';

// 错误
import { useParamsStore } from '../src/stores/paramsStore';
import React, { useState } from 'react';
```

### 命名规范
| 类型 | 规范 | 示例 |
|------|------|------|
| 组件 | PascalCase | Header, ParamCard |
| Hooks | camelCase + use | useAuth |
| 状态库 | camelCase + Store | userStore |
| 类型 | PascalCase | CameraParam |
| 文件 | kebab-case | home-api.ts |
| 常量 | UPPER_SNAKE_CASE | API_BASE_URL |

### TypeScript 规则（严格）
- 为 props、state、参数显式声明类型 - 禁止使用隐式 `any`
- 对象使用 `interface`，联合类型使用 `type`
- 禁止使用 `as any`、`@ts-ignore`、`@ts-expect-error`

```typescript
// 正确
interface User { id: string; phone: string; }
const handlePress = (id: string): void => {};

// 错误 - 禁止这样做
const handlePress = (id: any) => {};
```

---

## UI 开发（优先使用 gluestack-ui）

### 重要：构建 UI 前先查询 gluestack-ui 组件文档
```bash
# 使用 MCP 工具查询组件用法
gluestack-ui-mcp_select_components # 选择需要的组件
gluestack-ui-mcp_get_selected_components_docs # 获取组件文档
```

### 可用组件
| 组件 | 用途 |
|------|------|
| Button | 按钮 |
| Input / Textarea | 输入框/多行文本 |
| Box / Center | 布局容器 |
| VStack / HStack | 垂直/水平布局 |
| Text / Heading | 文本/标题 |
| Image | 图片 |
| Badge | 徽章 |
| Avatar | 头像 |
| Modal | 弹窗 |
| Actionsheet | 底部操作表 |
| Switch | 开关 |
| Checkbox / Radio | 复选框/单选框 |
| Progress | 进度条 |
| Slider | 滑块 |

### 使用流程
1. **先查询**：使用 `gluestack-ui-mcp_get_selected_components_docs` 了解组件用法
2. **再实现**：优先使用 gluestack-ui 组件，而非纯 View/Text

---

## 状态管理（Zustand）

```typescript
interface ParamsState {
  params: CameraParam[];
  setParams: (params: CameraParam[]) => void;
  addParam: (param: CameraParam) => void;
}

export const useParamsStore = create<ParamsState>((set) => ({
  params: [],
  setParams: (params) => set({ params }),
  addParam: (param) => set((state) => ({ params: [param, ...state.params] })),
}));
```

---

## 错误处理

**禁止使用空 catch 块。**

```typescript
// 正确
try {
  await fetchData();
} catch (error) {
  console.error('Operation failed:', error);
}

// 错误 - 禁止这样做
try { await fetchData(); } catch (error) {}
```

---

## 样式规范

### 颜色主题
| 元素 | 颜色 |
|------|------|
| 背景 | #000000 |
| 强调色 | #ff5111 |
| 次要文字 | #a3a3a3 |
| 禁用 | #737373 |
| 边框 | #262626 |

### 样式指南
- 使用 `StyleSheet.create` 定义所有组件样式
- 使用 `react-native-safe-area-context`（不要使用 react-native 已废弃的 SafeAreaView）
- 浮动元素（tab bar、弹窗）使用 `position: 'absolute'`，容器设置 `pointerEvents: 'none'`

```typescript
// 浮动 tab bar 模式
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 32,
    pointerEvents: 'none', // 允许穿透滚动
  },
  tabBar: {
    pointerEvents: 'auto', // 恢复按钮点击
  },
});
```

---

## ScrollView 最佳实践

需要底部 padding 避免被浮动元素遮挡时：
- 同时使用 `style`（设置 flex）和 `contentContainerStyle`（设置 padding）
- 禁止在 contentContainerStyle 中使用 `flex: 1`

```typescript
<ScrollView
  style={styles.scrollView}           // 有 flex: 1
  contentContainerStyle={styles.content} // 有 paddingBottom
>
```

```typescript
const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  content: { paddingBottom: 120 },    // 为浮动 tab bar 留空间
});
```

---

## 代码完成后检查

### 必须执行 TypeScript 类型检查
```bash
npx tsc --noEmit
```

### 使用 JetBrains MCP 进行错误检查
- 使用 `webstorm-mcp_get_file_problems` 检查文件问题

---

## 禁止事项

1. `as any`、`@ts-ignore`、`@ts-expect-error` - 必须保证类型安全
2. 空 catch 块 - 必须记录错误
3. 使用主题外的颜色 - 使用常量定义
4. `console.log` - 使用 `console.error` 仅记录错误
5. react-native 的 SafeAreaView - 使用 react-native-safe-area-context

---

## 文件位置参考

| 任务 | 位置 |
|------|------|
| 添加页面 | app/ |
| 添加 API | src/api/page-apis/ |
| 添加状态库 | src/stores/ |
| 类型定义 | src/api/public-apis/types.ts |
| 组件 | src/components/public-components/ |

---

## 测试

当前未配置测试框架。如需添加测试，请先确认项目需求。

---

## 关键模式

### 自定义浮动 Tab Bar
- 容器：`position: 'absolute'`, `bottom: 32`, `pointerEvents: 'none'`
- 标签按钮：容器内，`pointerEvents: 'auto'`
- 激活态：橙色背景 `#ff5111`，白色文字
- 未激活：深色背景 `#1a1a1a`，灰色文字 `#a3a3a3`

### API 层
- Mock 数据位于 `src/api/mock/`
- 基于 Promise 的 API 函数
- 使用 try/catch 错误处理

### 导航
- 使用 `expo-router` 文件路由
- 使用 `useRouter` 编程式导航
- 使用 `usePathname` 获取当前路由
