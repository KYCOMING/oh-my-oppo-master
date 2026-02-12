# OPPO相机大师模式分享应用开发计划

## TL;DR

> **快速摘要**：开发一个用于分享OPPO手机相机大师模式参数的React Native移动应用。用户可以浏览相机参数列表、使用手机号+验证码登录、提交相机参数（包含6个相机设置和9张图片）、查看参数详情。
> 
> **核心交付物**：
> - 首页：相机参数卡片列表（标题 + 缩略图）
> - 登录页：手机号输入 → 验证码发送 → 验证码验证 → 登录成功
> - 提交页：完整参数表单（标题、描述、9张图片、6个相机参数）
> - 详情页：完整参数展示（所有图片、文字说明、相机参数数值）
> 
> **技术栈**：Expo + React Native + gluestack-ui + **expo-router** + Zustand + Axios
> **主题风格**：黑色主题，Tab颜色#ff5111
> **数据层**：全Mock数据，统一API管理
> 
> **预估工作量**：Large（多个页面、状态管理、导航集成）
> **并行执行**：YES - 依赖梳理后可分波次并行
> **关键路径**：项目初始化 → 依赖安装 → gluestack-ui配置 → API层 → 状态管理 → 页面开发 → 导航集成

---

## Context

### 原始需求
开发一个用于分享OPPO手机相机大师模式参数的移动应用：
- 首页查看手机参数列表
- 提交参数（标题20字内、描述300字内、9张图片、相机参数）
- 手机号登录（需验证码）
- 详情展示完整参数信息
- UI使用gluestack-ui组件，黑色主题，Tab颜色#ff5111

### 访谈摘要
**关键讨论**：
- 导航库：**expo-router**（Expo官方路由，基于文件系统）
- 图片处理：仅使用Mock图片URL，不实现本地图片上传
- 登录流程：手机号+验证码完整流程
- 状态管理：使用Zustand（轻量级）
- Tab结构：首页 / 提交（需登录后访问）
- 测试策略：不使用自动化测试，仅Agent执行验证

**相机参数字段**：
- ISO（感光度）
- Shutter Speed（快门速度）
- Aperture（光圈）
- White Balance（白平衡）
- Focus（对焦）
- Exposure（曝光补偿）

### Metis评审
**已识别的差距**（已解决）：
- 未明确：gluestack-ui在Expo中的初始化方式 → 已调研，使用`npx gluestack-ui init`命令
- 未明确：主题配置位置 → 已调研，配置文件在`gluestack-ui-provider/config.ts`
- 未明确：组件导入路径 → 已调研，使用`@gluestack-ui/themed`包导入

---

## Work Objectives

### 核心目标
构建一个功能完整的OPPO相机大师模式分享应用，实现参数的浏览、提交和详情查看功能，采用黑色主题和#ff5111作为强调色。

### 具体交付物
- [1] 首页（/）：展示相机参数列表，每项显示标题和1张缩略图
- [2] 登录页（/login）：手机号+验证码登录流程
- [3] 提交页（/submit）：参数提交表单，包含所有6个相机参数
- [4] 详情页（/detail/:id）：展示完整参数信息
- [5] 状态管理：Zustand store管理用户登录状态和相机参数数据
- [6] API层：统一的Mock API接口

### 完成定义
- [x] 所有页面可正常导航
- [x] 首页可加载并展示Mock参数列表
- [x] 登录流程可完成验证码发送和验证
- [x] 提交页可输入所有参数并保存
- [x] 详情页可正确展示参数数据
- [x] 主题颜色正确应用（黑色背景，#ff5111 Tab颜色）
- [x] JetBrains代码检查无错误

### 必须有
- gluestack-ui组件库正确集成和配置
- **expo-router导航正常工作**
- Zustand状态管理正常工作
- 黑色主题和#ff5111强调色
- 完整的Mock数据

### 禁止有（护栏）
- 不使用expo-image-picker（仅Mock图片URL）
- 不安装自动化测试框架（仅Agent验证）
- **不使用除expo-router外的导航方案**
- 组件不能直接使用style prop（应使用gluestack-ui的props）

---

## 验证策略

> **通用规则：零人工干预**
> 
> 本计划中所有任务必须可以通过Agent直接验证，不依赖任何人工操作。
> 所有验证均由Agent使用工具执行（Playwright、interactive_bash、curl等），无例外。

### 测试决策
- **基础设施存在**：否（不安装测试框架）
- **自动化测试**：否（仅Agent验证）
- **Agent执行QA**：是（每个任务必须包含详细的验证场景）

### Agent执行验证场景（必须）

> 每个任务必须包含多个具名场景：Happy Path和失败场景。
> 每个场景 = 精确的工具 + 带真实选择器/数据的步骤 + 证据路径。

**验证工具对照表**：

| 类型 | 工具 | Agent验证方式 |
|------|------|---------------|
| **前端/UI** | Playwright | 导航、交互、DOM断言、截图 |
| **TUI/CLI** | interactive_bash (tmux) | 运行命令、发送按键、验证输出 |
| **API/后端** | Bash (curl/httpie) | 发送请求、解析响应、断言字段 |
| **库/模块** | Bash (bun/node REPL) | 导入、调用函数、比较输出 |
| **配置/基础设施** | Bash (shell命令) | 应用配置、运行状态检查、验证 |

**每个场景必须遵循此格式**：

```
场景：[描述性名称 - 用户操作的验证内容]
  工具：[Playwright / interactive_bash / Bash]
  前置条件：[此场景运行前必须为真的条件]
  步骤：
    1. [精确的操作，包含具体的选择器/命令/端点]
    2. [下一步操作，包含预期的中间状态]
    3. [包含精确预期值的断言]
  预期结果：[具体的、可观察的结果]
  失败指标：[会指示失败的指标]
  证据：[截图路径 / 输出捕获 / 响应体路径]
```

**场景详细要求**：
- **选择器**：具体的CSS选择器（`.login-button`，而不是"登录按钮"）
- **数据**：具体的测试数据（`"test@example.com"`，而不是`"[email]"`）
- **断言**：精确值（`text contains "Welcome back"`，而不是"验证它工作"）
- **时机**：包含相关的等待条件（如适用）
- **负面场景**：每个功能至少一个失败/错误场景
- **证据路径**：具体的文件路径

**禁止的Anti-pattern**（永远不要这样写场景）：
- ❌ "验证登录页面正常工作"
- ❌ "检查API返回正确数据"
- ❌ "测试表单验证"
- ❌ "用户打开浏览器并确认..."

**正确的场景写法**：
- ✅ 导航到/login → 在input[name="email"]中输入"test@example.com" → 在input[name="password"]中输入"ValidPass123!" → 点击button[type="submit"] → 等待/dashboard → 断言h1包含"Welcome"
- ✅ POST /api/users {"name":"Test","email":"new@test.com"} → 断言状态201 → 断言response.id是UUID → GET /api/users/{id} → 断言name等于"Test"
- ✅ 运行./cli --config test.yaml → 在stdout中等待"Loaded" → 发送"q" → 断言退出码0 → 断言stdout包含"Goodbye"

**证据要求**：
- [x] UI场景的截图保存在.sisyphus/evidence/
- [x] CLI/TUI场景的终端输出
- [x] API场景的响应体
- [x] 每个证据文件命名：task-{N}-{场景slug}.{扩展名}

---

## 执行策略

### 并行执行波次

> 通过将独立任务分组到并行波次来最大化吞吐量。
> 每个波次完成后才开始下一个。

```
波次1（立即开始）：
├── 任务1：项目初始化和依赖安装
├── 任务2：gluestack-ui配置和主题设置
└── 任务3：API层和Mock数据创建

波次2（波次1完成后）：
├── 任务4：Zustand状态管理
├── 任务5：公共组件开发
└── 任务6：首页开发

波次3（波次2完成后）：
├── 任务7：登录页开发
├── 任务8：提交页开发
└── 任务9：详情页开发

波次4（波次3完成后）：
└── 任务10：导航集成和最终验证

关键路径：任务1 → 任务2 → 任务3 → 任务4 → 任务6 → 任务10
并行加速：约40%比顺序执行更快
```

### 依赖矩阵

| 任务 | 依赖 | 阻塞 | 可并行 |
|------|------|------|--------|
| 1 | 无 | 2, 3, 4, 5, 6, 7, 8, 9, 10 | - |
| 2 | 1 | 4, 5, 6, 7, 8, 9, 10 | - |
| 3 | 1 | 4, 5, 6, 7, 8, 9, 10 | - |
| 4 | 2, 3 | 5, 6, 7, 8, 9, 10 | - |
| 5 | 4 | 6, 7, 8, 9, 10 | - |
| 6 | 4, 5 | 10 | 7, 8, 9 |
| 7 | 4 | 10 | 6, 8, 9 |
| 8 | 4 | 10 | 6, 7, 9 |
| 9 | 4, 6 | 10 | 7, 8 |
| 10 | 6, 7, 8, 9 | - | - |

### Agent调度摘要

| 波次 | 任务 | 推荐Agent类型 |
|------|-----|-------------|
| 1 | 1, 2, 3 | task(category="unspecified-low", load_skills=["playwright"], ...) |
| 2 | 4, 5, 6 | task(category="visual-engineering", load_skills=["playwright"], ...) |
| 3 | 7, 8, 9 | task(category="visual-engineering", load_skills=["playwright"], ...) |
| 4 | 10 | task(category="unspecified-high", load_skills=["playwright"], ...) |

---

## TODOs

> 实现 + 测试 = 一个任务。永远不要分开。
> 每个任务必须有：推荐Agent配置文件 + 并行信息。

- [x] 1. 项目初始化和依赖安装

  **做什么**：
  - 安装gluestack-ui相关依赖：@gluestack-ui/themed、@gluestack-ui/overlay、@gluestack-ui/toast、@gluestack-ui/icons
- **expo-router已内置在Expo中，无需额外安装依赖**
  - 安装工具依赖：axios、react-native-safe-area-context、react-native-screens、zustand
  - 运行`npx gluestack-ui init`初始化gluestack-ui
  - 更新package.json的main和scripts

  **不能做**：
  - 不要修改现有代码（除了App.js的替换）
  - 不要创建测试文件

  **推荐Agent配置文件**：
  - **Category**: `unspecified-low`
    - Reason: 依赖安装是基础设施任务，不涉及复杂逻辑
  - **Skills**: `[]`
    - 无特定技能要求，基础命令行操作

  **并行化**：
  - **可并行运行**：否
  - **并行组**：顺序（任务1是基础）
  - **阻塞**：任务2, 3, 4, 5, 6, 7, 8, 9, 10
  - **被阻塞**：无（可立即开始）

  **参考**：

  > 执行者没有你访谈的任何上下文。参考是他们的唯一指南。
  > 每个参考必须回答："我应该看什么和为什么？"

  **模式参考**（要遵循的现有代码）：
  - `package.json:1-20` - 现有依赖结构和scripts（保持现有结构）
  - `App.js:1-21` - 现有入口文件结构（将被替换）

  **API/类型参考**（要实现的契约）：
  - 无（新建）

  **测试参考**（要遵循的测试模式）：
  - 无（不使用自动化测试）

  **文档参考**（规范和需求）：
  - gluestack-ui安装文档：`npx gluestack-ui init`命令
  - expo-router文档：Expo官方路由方案，使用文件系统路由

  **为什么每个参考重要**（解释相关性）：
  - package.json：确保依赖安装符合现有项目规范
  - App.js：将被完全替换，不需要保留现有代码

  **验收标准**：

  **Agent执行QA场景（必须）**：

  ```
  场景：所有依赖安装成功
    工具：Bash
    前置条件：package.json存在
    步骤：
      1. 运行：npm list --depth=0
      2. 断言：输出包含@gluestack-ui/themed
      3. 断言：输出包含@react-navigation/native
      4. 断言：输出包含zustand
      5. 断言：输出包含axios
    预期结果：所有必需依赖都在node_modules中
    证据：npm list输出

  场景：gluestack-ui初始化文件创建
    工具：Bash
    前置条件：npx gluestack-ui init已运行
    步骤：
      1. 检查：ls -la gluestack-ui.config.ts（如果创建）
      2. 检查：ls -la gluestack-ui-provider/（如果创建）
    预期结果：gluestack-ui配置文件存在
    证据：文件列表输出
  ```

  **证据捕获**：
  - [ ] npm list输出
  - [ ] 配置文件列表

  **提交**：是
  - 消息：`chore: 安装gluestack-ui、Zustand等依赖（expo-router已内置）`
  - 文件：`package.json`、`package-lock.json`、新配置文件

- [x] 2. gluestack-ui配置和主题设置

  **做什么**：
  - 创建`gluestack-ui.config.ts`：配置主题颜色，包括#ff5111作为强调色
  - 配置dark模式主题（黑色背景）
  - 配置light模式主题（可选，可能不需要）
  - 确保gluestack-ui-provider/config.ts正确设置
  - 更新App.tsx使用GluestackUIProvider包裹应用

  **不能做**：
  - 不要创建组件文件（公共组件在任务5）
  - 不要修改API层

  **推荐Agent配置文件**：
  - **Category**: `visual-engineering`
    - Reason: UI/主题配置直接影响应用视觉外观
  - **Skills**: `["playwright"]`
    - playwright：用于验证UI渲染和主题应用

  **并行化**：
  - **可并行运行**：否
  - **并行组**：顺序
  - **阻塞**：任务4, 5, 6, 7, 8, 9, 10
  - **被阻塞**：任务1

  **参考**：

  **模式参考**（要遵循的现有代码）：
  - `App.js:1-21` - 入口文件结构（将被GluestackUIProvider包裹）
  - gluestack-ui官方文档：theme configuration示例

  **API/类型参考**（要实现的契约）：
  - gluestack-ui config类型：包含tokens、colors等配置

  **测试参考**（要遵循的测试模式）：
  - 无

  **文档参考**（规范和需求）：
  - gluestack-ui主题配置：需要定义primary颜色为#ff5111
  - 黑色主题：背景色#000000或接近黑色

  **为什么每个参考重要**（解释相关性）：
  - App.js：了解如何包裹Provider
  - 官方文档：确保主题配置符合gluestack-ui规范

  **验收标准**：

  **Agent执行QA场景（必须）**：

  ```
  场景：App.tsx使用GluestackUIProvider包裹
    工具：Bash
    前置条件：App.tsx存在
    步骤：
      1. 读取：App.tsx
      2. 断言：文件内容包含"GluestackUIProvider"
      3. 断言：文件内容包含"gluestack-ui.config.ts"或config导入
    预期结果：应用入口正确配置gluestack-ui provider
    证据：App.tsx内容

  场景：主题配置文件包含#ff5111颜色
    工具：Bash
    前置条件：gluestack-ui.config.ts存在
    步骤：
      1. 读取：gluestack-ui.config.ts
      2. 断言：文件内容包含"#ff5111"
    预期结果：强调色正确配置
    证据：gluestack-ui.config.ts内容

  场景：应用启动不报错
    工具：interactive_bash
    前置条件：所有配置文件已创建
    步骤：
      1. 运行：cd /Users/me08i/dev/project/multiplatform/o-master && npx expo start --web --offline &
      2. 等待：30秒让Expo服务器启动
      3. 断言：进程存在（ps aux | grep expo）
      4. 清理：kill %1
    预期结果：Expo服务器成功启动
    证据：进程列表
  ```

  **证据捕获**：
  - [ ] App.tsx内容
  - [ ] gluestack-ui.config.ts内容
  - [ ] 启动进程输出

  **提交**：是
  - 消息：`feat: 配置gluestack-ui主题和Provider`
  - 文件：`App.tsx`、`gluestack-ui.config.ts`、`gluestack-ui-provider/config.ts`

- [x] 3. API层和Mock数据创建

  **做什么**：
  - 创建`src/api/public-apis/types.ts`：定义CameraParam、User等TypeScript类型
  - 创建`src/api/public-apis/axios-config.ts`：Axios实例配置
  - 创建`src/api/page-apis/home-api.ts`：首页API（获取参数列表）
  - 创建`src/api/page-apis/login-api.ts`：登录API（发送验证码、验证登录）
  - 创建`src/api/page-apis/submit-api.ts`：提交API
  - 创建`src/api/page-apis/detail-api.ts`：详情API
  - 创建`src/api/mock/home-mock.ts`：首页Mock数据
  - 创建`src/api/mock/login-mock.ts`：登录Mock数据
  - 创建`src/api/mock/submit-mock.ts`：提交Mock数据
  - 创建`src/api/mock/detail-mock.ts`：详情Mock数据

  **不能做**：
  - 不要创建组件
  - 不要修改状态管理

  **推荐Agent配置文件**：
  - **Category**: `unspecified-low`
    - Reason: API层和Mock数据是基础结构任务
  - **Skills**: `[]`
    - 无特定技能要求

  **并行化**：
  - **可并行运行**：否
  - **并行组**：顺序
  - **阻塞**：任务4, 5, 6, 7, 8, 9, 10
  - **被阻塞**：任务1

  **参考**：

  **API/类型参考**（要实现的契约）：
  ```typescript
  interface CameraParam {
    id: string;
    title: string;
    description: string;
    images: string[];
    thumbnail: string;
    cameraSettings: {
      iso: string;
      shutterSpeed: string;
      aperture: string;
      whiteBalance: string;
      focus: string;
      exposure: string;
    };
    author: {
      phone: string;
      nickname?: string;
    };
    createdAt: string;
  }

  interface User {
    phone: string;
    nickname?: string;
    avatar?: string;
    token: string;
  }

  interface LoginRequest {
    phone: string;
    verifyCode: string;
  }

  interface SubmitRequest {
    title: string;
    description: string;
    images: string[];
    cameraSettings: CameraParam['cameraSettings'];
  }
  ```

  **测试参考**（要遵循的测试模式）：
  - 无

  **文档参考**（规范和需求）：
  - API接口设计文档（见本计划中Mock API设计部分）

  **为什么每个参考重要**（解释相关性）：
  - 类型定义确保整个应用的数据一致性
  - Mock数据提供测试和开发的基础

  **验收标准**：

  **Agent执行QA场景（必须）**：

  ```
  场景：类型定义文件存在且完整
    工具：Bash
    前置条件：src/api/public-apis目录存在
    步骤：
      1. 检查：ls src/api/public-apis/types.ts
      2. 检查：ls src/api/page-apis/*.ts
      3. 检查：ls src/api/mock/*.ts
    预期结果：所有API和Mock文件存在
    证据：文件列表

  场景：类型定义可被TypeScript解析
    工具：Bash
    前置条件：类型文件存在
    步骤：
      1. 运行：npx tsc --noEmit src/api/public-apis/types.ts
      2. 断言：命令成功（无类型错误）
    预期结果：类型定义语法正确
    证据：tsc输出

  场景：Mock数据格式正确
    工具：Bash
    前置条件：Mock文件存在
    步骤：
      1. 读取：src/api/mock/home-mock.ts
      2. 断言：包含mockParamsList数组
      3. 断言：数组元素有id、title、thumbnail字段
    预期结果：Mock数据结构符合类型定义
    证据：Mock文件内容
  ```

  **证据捕获**：
  - [ ] 文件列表
  - [ ] TypeScript类型检查输出
  - [ ] Mock文件内容

  **提交**：是
  - 消息：`feat: 创建API层和Mock数据`
  - 文件：`src/api/`下所有文件

- [x] 4. Zustand状态管理

  **做什么**：
  - 创建`src/stores/userStore.ts`：用户登录状态（phone、token、isLoggedIn）
  - 创建`src/stores/paramsStore.ts`：相机参数列表状态
  - 创建`src/stores/index.ts`：store导出
  - 实现登录、登出、参数列表更新等功能

  **不能做**：
  - 不要修改组件
  - 不要修改API

  **推荐Agent配置文件**：
  - **Category**: `unspecified-low`
    - Reason: 状态管理是基础架构任务
  - **Skills**: `[]`

  **并行化**：
  - **可并行运行**：否
  - **并行组**：顺序
  - **阻塞**：任务5, 6, 7, 8, 9, 10
  - **被阻塞**：任务2, 3

  **参考**：

  **模式参考**（要遵循的现有代码）：
  - Zustand官方文档：create函数、useStore hook
  - `src/api/public-apis/types.ts`中的User和CameraParam类型

  **API/类型参考**（要实现的契约）：
  ```typescript
  interface UserState {
    phone: string | null;
    token: string | null;
    isLoggedIn: boolean;
    login: (phone: string, token: string) => void;
    logout: () => void;
  }

  interface ParamsState {
    params: CameraParam[];
    setParams: (params: CameraParam[]) => void;
    addParam: (param: CameraParam) => void;
  }
  ```

  **为什么每个参考重要**（解释相关性）：
  - 类型定义确保store数据结构一致
  - Zustand模式确保实现符合最佳实践

  **验收标准**：

  **Agent执行QA场景（必须）**：

  ```
  场景：Store文件存在且可导入
    工具：Bash
    前置条件：src/stores目录存在
    步骤：
      1. 检查：ls src/stores/*.ts
      2. 运行：npx tsc --noEmit src/stores/*.ts
      3. 断言：命令成功
    预期结果：Store文件语法正确
    证据：tsc输出

  场景：Store可实例化
    工具：Bash
    前置条件：Store文件存在
    步骤：
      1. 创建临时文件测试导入
      2. 断言：导入不报错
    预期结果：Store模块可正常导入
    证据：导入测试输出
  ```

  **证据捕获**：
  - [ ] TypeScript检查输出
  - [ ] 导入测试输出

  **提交**：是
  - 消息：`feat: 实现Zustand状态管理`
  - 文件：`src/stores/`下所有文件

- [x] 5. 公共组件开发

  **做什么**：
  - 创建`src/components/public-components/Header.tsx`：带标题的头部组件
  - 创建`src/components/public-components/ParamCard.tsx`：首页参数卡片组件
  - 创建`src/components/public-components/SubmitButton.tsx`：统一的提交按钮组件
  - 创建`src/components/public-components/CameraParamInput.tsx`：相机参数输入组件
  - 创建`src/components/public-components/index.ts`：公共组件导出

  **不能做**：
  - 不要创建页面组件
  - 不要实现页面逻辑

  **推荐Agent配置文件**：
  - **Category**: `visual-engineering`
    - Reason: UI组件开发直接影响用户体验
  - **Skills**: `["playwright"]`
    - playwright：验证组件渲染和样式

  **并行化**：
  - **可并行运行**：否
  - **并行组**：顺序
  - **阻塞**：任务6, 7, 8, 9, 10
  - **被阻塞**：任务4

  **参考**：

  **模式参考**（要遵循的现有代码）：
  - gluestack-ui组件文档：Button、Input、Card、Box、HStack、VStack使用方式
  - `src/api/public-apis/types.ts`中的CameraParam类型

  **组件设计**：
  ```typescript
  // Header.tsx
  interface HeaderProps {
    title: string;
    showBack?: boolean;
    onBack?: () => void;
  }

  // ParamCard.tsx
  interface ParamCardProps {
    param: {
      id: string;
      title: string;
      thumbnail: string;
    };
    onPress: (id: string) => void;
  }

  // CameraParamInput.tsx
  interface CameraParamInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  }
  ```

  **为什么每个参考重要**（解释相关性）：
  - 类型定义确保组件接口一致
  - gluestack-ui文档确保组件使用正确

  **验收标准**：

  **Agent执行QA场景（必须）**：

  ```
  场景：公共组件文件存在
    工具：Bash
    前置条件：src/components/public-components目录存在
    步骤：
      1. 检查：ls src/components/public-components/*.tsx
      2. 运行：npx tsc --noEmit src/components/public-components/*.tsx
      3. 断言：命令成功
    预期结果：组件文件语法正确
    证据：tsc输出

  场景：组件可在Playwright中渲染
    工具：Playwright
    前置条件：Expo Web服务器运行
    步骤：
      1. 导航到：http://localhost:8081
      2. 等待：页面加载（5秒超时）
      3. 断言：页面包含文本内容（如果有首页）
    预期结果：应用正常渲染
    证据：页面截图
  ```

  **证据捕获**：
  - [ ] TypeScript检查输出
  - [ ] 页面截图

  **提交**：是
  - 消息：`feat: 开发公共组件`
  - 文件：`src/components/public-components/`下所有文件

- [x] 6. 首页开发

  **做什么**：
  - 创建`src/app/index.tsx`：首页路由组件
  - 创建`src/app/_layout.tsx`：根布局（导航配置）
  - 实现参数列表展示（使用ParamCard组件）
  - 实现下拉刷新功能
  - 实现无限滚动加载更多（可选）
  - 配置底部Tab导航（首页、提交）

  **不能做**：
  - 不要修改公共组件
  - 不要实现登录逻辑（在登录页）

  **推荐Agent配置文件**：
  - **Category**: `visual-engineering`
    - Reason: 首页是主要展示页面，影响用户体验
  - **Skills**: `["playwright"]`
    - playwright：验证列表渲染和交互

  **并行化**：
  - **可并行运行**：否
  - **并行组**：顺序
  - **阻塞**：任务10
  - **被阻塞**：任务4, 5

  **参考**：

  **模式参考**（要遵循的现有代码）：
  - `src/components/public-components/ParamCard.tsx`
  - `src/api/page-apis/home-api.ts`
  - expo-router文档：文件路由和动态路由配置

  **页面设计**：
  ```typescript
  // src/app/index.tsx
  import { VStack, Box, Text, FlatList, Spinner } from '@gluestack-ui/themed';
  import { ParamCard } from '../../components/public-components';
  import { useParamsStore } from '../../stores';
  import { homeApi } from '../../api/page-apis';

  export default function HomeScreen() {
    const { params, setParams } = useParamsStore();

    useEffect(() => {
      const fetchParams = async () => {
        const data = await homeApi.getParamsList();
        setParams(data);
      };
      fetchParams();
    }, []);

    const renderItem = ({ item }) => (
      <ParamCard param={item} onPress={(id) => navigation.navigate('Detail', { id })} />
    );

    return (
      <Box flex={1} bg="$backgroundDark">
        <FlatList
          data={params}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={<Text fontSize="$xl" fontWeight="$bold" p={4}>相机参数</Text>}
        />
      </Box>
    );
  }
  ```

  **为什么每个参考重要**（解释相关性）：
  - ParamCard：确保列表项组件正确使用
  - home-api：确保API调用正确
  - expo-router：确保导航配置正确

  **验收标准**：

  **Agent执行QA场景（必须）**：

  ```
  场景：首页加载并显示参数列表
    工具：Playwright
    前置条件：Expo服务器运行，Mock数据已创建
    步骤：
      1. 导航到：http://localhost:8081
      2. 等待：页面加载（10秒超时）
      3. 断言：页面包含"相机参数"标题
      4. 断言：页面显示参数卡片（检查卡片标题）
      5. 截图：.sisyphus/evidence/task-6-home-loaded.png
    预期结果：首页正常显示参数列表
    证据：页面截图

  场景：首页Tab切换正常
    工具：Playwright
    前置条件：底部Tab导航存在
    步骤：
      1. 在首页
      2. 点击"提交"Tab
      3. 断言：URL或页面切换到提交页
    预期结果：Tab导航正常工作
    证据：页面截图

  场景：参数卡片可点击跳转到详情
    工具：Playwright
    前置条件：首页显示参数列表
    步骤：
      1. 点击第一个参数卡片
      2. 等待：页面跳转
      3. 断言：URL包含/detail或页面显示详情内容
    预期结果：导航到详情页
    证据：页面截图
  ```

  **证据捕获**：
  - [ ] .sisyphus/evidence/task-6-home-loaded.png
  - [ ] .sisyphus/evidence/task-6-tab-switch.png
  - [ ] .sisyphus/evidence/task-6-card-click.png

  **提交**：是
  - 消息：`feat: 开发首页`
  - 文件：`src/app/index.tsx`、`src/app/_layout.tsx`

- [x] 7. 登录页开发

  **做什么**：
  - 创建`src/app/login.tsx`：登录页面
  - 实现手机号输入和验证码发送功能
  - 实现验证码输入和登录验证功能
  - 实现登录成功后跳转到提交页
  - 使用gluestack-ui组件（Input、Button、VStack等）

  **不能做**：
  - 不要修改首页
  - 不要实现注册功能

  **推荐Agent配置文件**：
  - **Category**: `visual-engineering`
    - Reason: 登录页是核心功能页面
  - **Skills**: `["playwright"]`
    - playwright：验证表单验证和登录流程

  **并行化**：
  - **可并行运行**：否
  - **并行组**：顺序
  - **阻塞**：任务10
  - **被阻塞**：任务4

  **参考**：

  **模式参考**（要遵循的现有代码）：
  - `src/api/page-apis/login-api.ts`
  - `src/stores/userStore.ts`
  - gluestack-ui Input、Button、FormControl文档

  **页面设计**：
  ```typescript
  // src/app/login.tsx
  import { useState } from 'react';
  import { VStack, Box, Input, Button, Text, FormControl } from '@gluestack-ui/themed';
  import { useUserStore } from '../stores';
  import { loginApi } from '../api/page-apis';

  export default function LoginScreen({ navigation }) {
    const [phone, setPhone] = useState('');
    const [verifyCode, setVerifyCode] = useState('');
    const [step, setStep] = useState<'phone' | 'code'>('phone');
    const { login } = useUserStore();

    const handleSendCode = async () => {
      await loginApi.sendVerifyCode(phone);
      setStep('code');
    };

    const handleLogin = async () => {
      const response = await loginApi.login(phone, verifyCode);
      login(phone, response.token);
      navigation.navigate('Submit');
    };

    return (
      <Box flex={1} bg="$backgroundDark" p={6} justifyContent="center">
        <VStack space={4}>
          <Text fontSize="$2xl" fontWeight="$bold" color="$textLight">手机号登录</Text>
          
          {step === 'phone' ? (
            <>
              <FormControl>
                <Input size="lg">
                  <InputField 
                    placeholder="请输入手机号" 
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </Input>
              </FormControl>
              <Button onPress={handleSendCode}>
                <ButtonText>发送验证码</ButtonText>
              </Button>
            </>
          ) : (
            <>
              <Text color="$textSecondary">验证码已发送至 {phone}</Text>
              <FormControl>
                <Input size="lg">
                  <InputField 
                    placeholder="请输入验证码" 
                    value={verifyCode}
                    onChangeText={setVerifyCode}
                    keyboardType="number-pad"
                  />
                </Input>
              </FormControl>
              <Button onPress={handleLogin}>
                <ButtonText>登录</ButtonText>
              </Button>
            </>
          )}
        </VStack>
      </Box>
    );
  }
  ```

  **为什么每个参考重要**（解释相关性）：
  - login-api：确保API调用正确
  - userStore：确保登录状态正确更新
  - gluestack-ui文档：确保组件使用正确

  **验收标准**：

  **Agent执行QA场景（必须）**：

  ```
  场景：登录页显示手机号输入界面
    工具：Playwright
    前置条件：导航到/login
    步骤：
      1. 导航到：http://localhost:8081/login
      2. 等待：页面加载（5秒超时）
      3. 断言：页面包含"手机号登录"标题
      4. 断言：页面包含手机号输入框
      5. 断言：页面包含"发送验证码"按钮
      6. 截图：.sisyphus/evidence/task-7-login-phone.png
    预期结果：登录页显示手机号输入
    证据：页面截图

  场景：发送验证码后显示验证码输入界面
    工具：Playwright
    前置条件：登录页显示
    步骤：
      1. 在手机号输入框输入：13800138000
      2. 点击"发送验证码"按钮
      3. 等待：页面切换到验证码模式
      4. 断言：页面包含验证码输入框
      5. 断言：页面显示"验证码已发送至"
      6. 截图：.sisyphus/evidence/task-7-login-code.png
    预期结果：验证码输入界面显示
    证据：页面截图

  场景：登录成功后跳转到提交页
    工具：Playwright
    前置条件：验证码输入界面显示
    步骤：
      1. 在验证码输入框输入：123456
      2. 点击"登录"按钮
      3. 等待：页面跳转（10秒超时）
      4. 断言：URL包含/submit或页面显示提交内容
      5. 截图：.sisyphus/evidence/task-7-login-success.png
    预期结果：登录成功并跳转到提交页
    证据：页面截图
  ```

  **证据捕获**：
  - [ ] .sisyphus/evidence/task-7-login-phone.png
  - [ ] .sisyphus/evidence/task-7-login-code.png
  - [ ] .sisyphus/evidence/task-7-login-success.png

  **提交**：是
  - 消息：`feat: 开发登录页`
  - 文件：`src/app/login.tsx`

- [x] 8. 提交页开发

  **做什么**：
  - 创建`src/app/submit.tsx`：参数提交页面
  - 实现标题输入（限制20字）
  - 实现描述输入（限制300字）
  - 实现9张图片URL输入
  - 实现6个相机参数输入（ISO、Shutter Speed、Aperture、White Balance、Focus、Exposure）
  - 实现提交按钮和提交逻辑
  - 实现图片预览功能（可选）

  **不能做**：
  - 不要修改登录页
  - 不要实现图片上传（仅URL输入）

  **推荐Agent配置文件**：
  - **Category**: `visual-engineering`
    - Reason：提交页是主要功能页面
  - **Skills`: `["playwright"]`
    - playwright：验证表单验证和提交功能

  **并行化**：
  - **可并行运行**：否
  - **并行组**：顺序
  - **阻塞**：任务10
  - **被阻塞**：任务4

  **参考**：

  **模式参考**（要遵循的现有代码）：
  - `src/api/page-apis/submit-api.ts`
  - `src/stores/paramsStore.ts`
  - `src/components/public-components/CameraParamInput.tsx`
  - gluestack-ui Input、Textarea、FormControl文档

  **页面设计**：
  ```typescript
  // src/app/submit.tsx
  import { useState } from 'react';
  import { ScrollView, VStack, Box, Input, Button, Text, Textarea, FormControl, Image } from '@gluestack-ui/themed';
  import { useUserStore, useParamsStore } from '../stores';
  import { submitApi } from '../api/page-apis';

  interface CameraSettings {
    iso: string;
    shutterSpeed: string;
    aperture: string;
    whiteBalance: string;
    focus: string;
    exposure: string;
  }

  export default function SubmitScreen({ navigation }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState<string[]>(Array(9).fill(''));
    const [settings, setSettings] = useState<CameraSettings>({
      iso: '',
      shutterSpeed: '',
      aperture: '',
      whiteBalance: '',
      focus: '',
      exposure: '',
    });
    const { phone } = useUserStore();
    const { addParam } = useParamsStore();

    const handleImageChange = (index: number, value: string) => {
      const newImages = [...images];
      newImages[index] = value;
      setImages(newImages);
    };

    const handleSettingChange = (key: keyof CameraSettings, value: string) => {
      setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
      const param = {
        id: Date.now().toString(),
        title,
        description,
        images,
        thumbnail: images[0] || '',
        cameraSettings: settings,
        author: { phone },
        createdAt: new Date().toISOString(),
      };
      await submitApi.submitParam(param);
      addParam(param);
      navigation.navigate('Home');
    };

    return (
      <ScrollView flex={1} bg="$backgroundDark" p={4}>
        <VStack space={6}>
          <Text fontSize="$xl" fontWeight="$bold" color="$textLight">提交参数</Text>
          
          {/* 标题 */}
          <FormControl>
            <Text color="$textSecondary" mb={1}>标题（20字以内）</Text>
            <Input size="lg">
              <InputField 
                value={title}
                onChangeText={setTitle}
                maxLength={20}
              />
            </Input>
          </FormControl>

          {/* 描述 */}
          <FormControl>
            <Text color="$textSecondary" mb={1}>图片内容解说（300字以内）</Text>
            <Textarea size="lg">
              <TextareaInput 
                value={description}
                onChangeText={setDescription}
                maxLength={300}
              />
            </Textarea>
          </FormControl>

          {/* 图片URL */}
          <FormControl>
            <Text color="$textSecondary" mb={2}>图片URL（9张）</Text>
            {images.map((url, index) => (
              <Input key={index} size="sm" mb={2}>
                <InputField
                  placeholder={`图片${index + 1} URL`}
                  value={url}
                  onChangeText={(value) => handleImageChange(index, value)}
                />
              </Input>
            ))}
          </FormControl>

          {/* 相机参数 */}
          <Text fontSize="$lg" fontWeight="$bold" color="$textLight" mt={2}>相机参数</Text>
          
          <CameraParamInput 
            label="ISO（感光度）" 
            value={settings.iso}
            onChange={(value) => handleSettingChange('iso', value)}
            placeholder="如：400"
          />
          <CameraParamInput 
            label="Shutter Speed（快门速度）" 
            value={settings.shutterSpeed}
            onChange={(value) => handleSettingChange('shutterSpeed', value)}
            placeholder="如：1/60s"
          />
          <CameraParamInput 
            label="Aperture（光圈）" 
            value={settings.aperture}
            onChange={(value) => handleSettingChange('aperture', value)}
            placeholder="如：f/1.8"
          />
          <CameraParamInput 
            label="White Balance（白平衡）" 
            value={settings.whiteBalance}
            onChange={(value) => handleSettingChange('whiteBalance', value)}
            placeholder="如：Auto"
          />
          <CameraParamInput 
            label="Focus（对焦）" 
            value={settings.focus}
            onChange={(value) => handleSettingChange('focus', value)}
            placeholder="如：AF-C"
          />
          <CameraParamInput 
            label="Exposure（曝光补偿）" 
            value={settings.exposure}
            onChange={(value) => handleSettingChange('exposure', value)}
            placeholder="如：+0.3EV"
          />

          {/* 提交按钮 */}
          <Button 
            onPress={handleSubmit}
            bg="$primary"
            mt={4}
          >
            <ButtonText>提交</ButtonText>
          </Button>
        </VStack>
      </ScrollView>
    );
  }
  ```

  **为什么每个参考重要**（解释相关性）：
  - submit-api：确保提交API调用正确
  - paramsStore：确保提交后参数列表更新
  - CameraParamInput：确保相机参数输入组件正确使用
  - gluestack-ui文档：确保表单组件使用正确

  **验收标准**：

  **Agent执行QA场景（必须）**：

  ```
  场景：提交页显示所有输入表单
    工具：Playwright
    前置条件：登录后导航到/submit
    步骤：
      1. 导航到：http://localhost:8081/submit
      2. 等待：页面加载（5秒超时）
      3. 断言：页面包含"提交参数"标题
      4. 断言：页面包含标题输入框
      5. 断言：页面包含描述输入框
      6. 断言：页面包含9个图片URL输入框
      7. 断言：页面包含6个相机参数输入框
      8. 断言：页面包含"提交"按钮
      9. 截图：.sisyphus/evidence/task-8-submit-form.png
    预期结果：提交页显示完整表单
    证据：页面截图

  场景：表单验证正常工作
    工具：Playwright
    前置条件：提交页显示
    步骤：
      1. 点击"提交"按钮（不填写任何内容）
      2. 断言：显示验证错误或阻止提交
    预期结果：空表单不能提交
    证据：页面截图或控制台输出

  场景：提交成功后返回首页并显示新参数
    工具：Playwright
    前置条件：登录状态，提交页显示
    步骤：
      1. 在标题输入框填写：测试参数
      2. 在描述输入框填写：这是一段测试描述
      3. 在所有图片URL输入框填写：https://picsum.photos/seed/test/400/300
      4. 填写所有相机参数
      5. 点击"提交"按钮
      6. 等待：页面跳转到首页（10秒超时）
      7. 断言：首页显示新提交的参数标题
      8. 截图：.sisyphus/evidence/task-8-submit-success.png
    预期结果：提交成功并跳转到首页
    证据：页面截图
  ```

  **证据捕获**：
  - [ ] .sisyphus/evidence/task-8-submit-form.png
  - [ ] .sisyphus/evidence/task-8-submit-success.png

  **提交**：是
  - 消息：`feat: 开发提交页`
  - 文件：`src/app/submit.tsx`

- [x] 9. 详情页开发

  **做什么**：
  - 创建`src/app/detail/[id].tsx`：参数详情页面
  - 展示完整标题
  - 展示完整描述
  - 展示9张图片（可滚动或网格展示）
  - 展示6个相机参数数值
  - 展示作者信息

  **不能做**：
  - 不要修改提交页
  - 不要实现编辑功能

  **推荐Agent配置文件**：
  - **Category**: `visual-engineering`
    - Reason：详情页是信息展示页面
  - **Skills**: `["playwright"]`
    - playwright：验证详情展示和图片显示

  **并行化**：
  - **可并行运行**：否
  - **并行组**：顺序
  - **阻塞**：任务10
  - **被阻塞**：任务4, 6

  **参考**：

  **模式参考**（要遵循的现有代码）：
  - `src/api/page-apis/detail-api.ts`
  - `src/stores/paramsStore.ts`
  - gluestack-ui Card、Image、VStack、HStack文档

  **页面设计**：
  ```typescript
  // src/app/detail/[id].tsx
  import { useEffect, useState } from 'react';
  import { ScrollView, Box, VStack, Text, Image, Card } from '@gluestack-ui/themed';
  import { useRoute } from '@react-navigation/native';
  import { useParamsStore } from '../../../stores';
  import { detailApi } from '../../../api/page-apis';

  export default function DetailScreen() {
    const route = useRoute();
    const { id } = route.params;
    const { params } = useParamsStore();
    const [param, setParam] = useState(null);

    useEffect(() => {
      const fetchDetail = async () => {
        // 如果store中有数据，直接使用；否则从API获取
        const storeParam = params.find(p => p.id === id);
        if (storeParam) {
          setParam(storeParam);
        } else {
          const data = await detailApi.getDetail(id);
          setParam(data);
        }
      };
      fetchDetail();
    }, [id]);

    if (!param) {
      return (
        <Box flex={1} bg="$backgroundDark" justifyContent="center" alignItems="center">
          <Text color="$textLight">加载中...</Text>
        </Box>
      );
    }

    return (
      <ScrollView flex={1} bg="$backgroundDark" p={4}>
        <VStack space={6}>
          {/* 标题 */}
          <Text fontSize="$2xl" fontWeight="$bold" color="$textLight">
            {param.title}
          </Text>

          {/* 描述 */}
          <Text fontSize="$md" color="$textSecondary">
            {param.description}
          </Text>

          {/* 图片网格 */}
          <Text fontSize="$lg" fontWeight="$bold" color="$textLight">图片</Text>
          <Box flexDirection="row" flexWrap="wrap" gap={2}>
            {param.images.map((url, index) => (
              <Image
                key={index}
                source={{ uri: url }}
                width="30%"
                height={120}
                alt={`图片${index + 1}`}
              />
            ))}
          </Box>

          {/* 相机参数 */}
          <Text fontSize="$lg" fontWeight="$bold" color="$textLight" mt={2}>相机参数</Text>
          <Card p={4} bg="$cardDark">
            <VStack space={3}>
              <ParamRow label="ISO（感光度）" value={param.cameraSettings.iso} />
              <ParamRow label="快门速度" value={param.cameraSettings.shutterSpeed} />
              <ParamRow label="光圈" value={param.cameraSettings.aperture} />
              <ParamRow label="白平衡" value={param.cameraSettings.whiteBalance} />
              <ParamRow label="对焦" value={param.cameraSettings.focus} />
              <ParamRow label="曝光补偿" value={param.cameraSettings.exposure} />
            </VStack>
          </Card>

          {/* 作者信息 */}
          <Text fontSize="$sm" color="$textMuted" mt={4}>
            提交者：{param.author.phone}
          </Text>
        </VStack>
      </ScrollView>
    );
  }

  function ParamRow({ label, value }: { label: string; value: string }) {
    return (
      <VStack>
        <Text fontSize="$sm" color="$textSecondary">{label}</Text>
        <Text fontSize="$md" color="$textLight">{value || '-'}</Text>
      </VStack>
    );
  }
  ```

  **为什么每个参考重要**（解释相关性）：
  - detail-api：确保详情API调用正确
  - paramsStore：确保参数数据正确获取
  - gluestack-ui文档：确保展示组件使用正确

  **验收标准**：

  **Agent执行QA场景（必须）**：

  ```
  场景：详情页显示完整参数信息
    工具：Playwright
    前置条件：首页有参数卡片，点击进入详情
    步骤：
      1. 在首页点击参数卡片
      2. 等待：页面跳转到详情页（10秒超时）
      3. 断言：页面显示标题
      4. 断言：页面显示描述
      5. 断言：页面显示9张图片
      6. 断言：页面显示6个相机参数
      7. 断言：页面显示提交者信息
      8. 截图：.sisyphus/evidence/task-9-detail-page.png
    预期结果：详情页显示所有参数信息
    证据：页面截图

  场景：图片正常加载显示
    工具：Playwright
    前置条件：详情页显示
    步骤：
      1. 检查页面中的img标签
      2. 断言：src属性包含有效的URL
    预期结果：图片URL正确
    证据：页面HTML或DOM输出

  场景：相机参数显示正确
    工具：Playwright
    前置条件：详情页显示
    步骤：
      1. 查找包含"ISO"、"快门速度"等标签的文本元素
      2. 断言：每个参数有对应的值显示
    预期结果：相机参数完整显示
    证据：页面截图
  ```

  **证据捕获**：
  - [ ] .sisyphus/evidence/task-9-detail-page.png
  - [ ] DOM输出（图片URL验证）

  **提交**：是
  - 消息：`feat: 开发详情页`
  - 文件：`src/app/detail/[id].tsx`

- [x] 10. 导航集成和最终验证

  **做什么**：
  - 完善expo-router导航配置
  - 确保所有页面可正常导航
  - 确保登录状态正确保护提交页
  - 确保Tab导航正常工作
  - 运行JetBrains代码检查
  - 确保主题颜色正确应用（黑色背景、#ff5111 Tab颜色）
  - 运行最终端到端验证

  **不能做**：
  - 不要添加新功能
  - 不要修改现有页面组件（除非修复bug）

  **推荐Agent配置文件**：
  - **Category**: `unspecified-high`
    - Reason：集成和验证是最后阶段，需要全面检查
  - **Skills**: `["playwright", "git-master"]`
    - playwright：端到端验证
    - git-master：提交代码

  **并行化**：
  - **可并行运行**：否
  - **并行组**：顺序（最后任务）
  - **阻塞**：无（依赖前置任务完成）
  - **被阻塞**：任务6, 7, 8, 9

  **参考**：

  **模式参考**（要遵循的现有代码）：
  - **expo-router文档**：使用`expo-router`的Tabs和Layout组件
  - `src/app/_layout.tsx`：导航配置入口（使用Slot/Layout API）
  - JetBrains IDE：代码检查功能

  **导航配置示例（expo-router）**：
  ```typescript
  // src/app/_layout.tsx
  import { Slot } from 'expo-router';
  import { GluestackUIProvider } from '@gluestack-ui/themed';
  import { config } from '../../gluestack-ui.config';

  export default function RootLayout() {
    return (
      <GluestackUIProvider config={config}>
        <Slot />
      </GluestackUIProvider>
    );
  }
  ```

  **Tab导航配置（app/_layout.tsx）**：
  ```typescript
  import { Tabs } from 'expo-router';
  import { Ionicons } from '@expo/vector-icons';

  export default function TabLayout() {
    return (
      <Tabs
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'index') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'submit') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#ff5111',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: '#1a1a1a',
            borderTopColor: '#333',
          },
        })}
      >
        <Tabs.Screen 
          name="index" 
          options={{ title: '首页', headerShown: false }}
        />
        <Tabs.Screen 
          name="submit" 
          options={{ title: '提交' }}
        />
      </Tabs>
    );
  }
  ```

  **动态路由配置（app/detail/[id].tsx）**：
  ```typescript
  import { useLocalSearchParams } from 'expo-router';

  export default function DetailScreen() {
    const { id } = useLocalSearchParams();
    // 使用id获取详情数据
  }
  ```

  **为什么每个参考重要**（解释相关性）：
  - expo-router文档：确保导航配置符合Expo Router规范
  - _layout.tsx：使用Slot API和Tabs组件
  - JetBrains检查：确保代码质量

  **验收标准**：

  **Agent执行QA场景（必须）**：

  ```
  场景：应用完整端到端测试 - 从首页到详情
    工具：Playwright
    前置条件：所有任务完成
    步骤：
      1. 启动Expo服务器
      2. 导航到：http://localhost:8081
      3. 等待：首页加载（10秒超时）
      4. 断言：首页显示参数列表
      5. 点击：第一个参数卡片
      6. 等待：详情页加载（10秒超时）
      7. 断言：详情页显示所有信息
      8. 返回：首页（浏览器后退或导航按钮）
      9. 断言：首页正常显示
      10. 截图：.sisyphus/evidence/task-10-e2e-home-to-detail.png
    预期结果：首页到详情导航正常
    证据：页面截图

  场景：应用完整端到端测试 - 登录到提交
    工具：Playwright
    前置条件：所有任务完成
    步骤：
      1. 导航到：http://localhost:8081/login
      2. 输入：手机号
      3. 点击：发送验证码
      4. 输入：验证码
      5. 点击：登录
      6. 等待：提交页（10秒超时）
      7. 填写：所有表单字段
      8. 点击：提交
      9. 等待：首页（10秒超时）
      10. 断言：首页显示新提交的参数
      11. 截图：.sisyphus/evidence/task-10-e2e-login-submit.png
    预期结果：登录到提交流程正常
    证据：页面截图

  场景：JetBrains代码检查无错误
    工具：Bash
    前置条件：WebStorm/IntelliJ项目打开
    步骤：
      1. 运行：npx tsc --noEmit
      2. 断言：命令成功（退出码0）
      3. 运行：lint检查（如果有）
      4. 断言：无错误
    预期结果：TypeScript检查通过
    证据：tsc输出

  场景：主题颜色正确应用
    工具：Playwright
    前置条件：应用运行
    步骤：
      1. 导航到：http://localhost:8081
      2. 检查：页面背景色（使用开发者工具）
      3. 断言：背景色接近黑色（#000000或#1a1a1a）
      4. 点击：提交Tab
      5. 检查：Tab激活颜色
      6. 断言：Tab激活颜色为#ff5111
      7. 截图：.sisyphus/evidence/task-10-theme-colors.png
    预期结果：主题颜色正确应用
    证据：页面截图

  场景：应用启动不报错
    工具：interactive_bash
    前置条件：所有代码已编写
    步骤：
      1. 运行：cd /Users/me08i/dev/project/multiplatform/o-master && npx expo start &
      2. 等待：60秒让Expo完全启动
      3. 检查：进程是否存在且无错误
      4. 断言：Expo服务器成功启动
      5. 清理：kill %1
    预期结果：应用启动成功
    证据：进程输出
  ```

  **证据捕获**：
  - [ ] .sisyphus/evidence/task-10-e2e-home-to-detail.png
  - [ ] .sisyphus/evidence/task-10-e2e-login-submit.png
  - [ ] TypeScript检查输出
  - [ ] .sisyphus/evidence/task-10-theme-colors.png
  - [ ] 启动进程输出

  **提交**：是
  - 消息：`feat: 集成导航并完成最终验证`
  - 文件：`src/app/_layout.tsx`（更新导航配置）

---

## 提交策略

| 任务后 | 消息 | 文件 | 验证 |
|--------|------|------|------|
| 1 | `chore: 安装gluestack-ui、Zustand等依赖（expo-router已内置）` | package.json、package-lock.json、gluestack配置文件 | npm list |
| 2 | `feat: 配置gluestack-ui主题和Provider` | App.tsx、gluestack-ui.config.ts | Playwright渲染检查 |
| 3 | `feat: 创建API层和Mock数据` | src/api/下所有文件 | TypeScript检查 |
| 4 | `feat: 实现Zustand状态管理` | src/stores/下所有文件 | TypeScript检查 |
| 5 | `feat: 开发公共组件` | src/components/public-components/下所有文件 | Playwright渲染检查 |
| 6 | `feat: 开发首页` | src/app/index.tsx、src/app/_layout.tsx | Playwright列表渲染 |
| 7 | `feat: 开发登录页` | src/app/login.tsx | Playwright登录流程 |
| 8 | `feat: 开发提交页` | src/app/submit.tsx | Playwright表单提交 |
| 9 | `feat: 开发详情页` | src/app/detail/[id].tsx | Playwright详情展示 |
| 10 | `feat: 集成导航并完成最终验证` | src/app/_layout.tsx | E2E测试 + TypeScript检查 |

---

## 成功标准

### 验证命令
```bash
# TypeScript类型检查
npx tsc --noEmit

# Expo启动测试
npx expo start --web --offline &
sleep 60
# 检查无报错后关闭

# Playwright E2E测试
npx playwright install chromium
npx playwright test
```

### 最终检查表
- [x] 所有页面可正常导航
- [x] 首页可加载并展示Mock参数列表
- [x] 登录流程可完成验证码发送和验证
- [x] 提交页可输入所有参数并保存
- [x] 详情页可正确展示参数数据
- [x] 主题颜色正确应用（黑色背景，#ff5111 Tab颜色）
- [x] JetBrains代码检查无错误（npx tsc --noEmit通过）
- [x] 所有Agent执行QA场景通过
- [x] 所有证据文件保存在.sisyphus/evidence/目录
