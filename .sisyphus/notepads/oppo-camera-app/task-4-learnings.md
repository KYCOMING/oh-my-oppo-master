# Zustand状态管理实现

## 创建的文件

- src/stores/userStore.ts - 用户状态管理
- src/stores/paramsStore.ts - 相机参数状态管理

## 学习总结

### Zustand使用模式

```typescript
import { create } from 'zustand';

interface UserState {
  phone: string | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (phone: string, token: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  phone: null,
  token: null,
  isLoggedIn: false,
  login: (phone, token) => set({ phone, token, isLoggedIn: true }),
  logout: () => set({ phone: null, token: null, isLoggedIn: false }),
}));
```

### 状态管理最佳实践

1. 分离关注点：用户状态和业务状态分开管理
2. 使用TypeScript类型定义确保类型安全
3. 避免在store中包含复杂逻辑
4. 必要时使用持久化（可选）
