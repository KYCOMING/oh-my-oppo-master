# 提交页面参数结构调整工作计划

## TL;DR

> **Quick Summary**: 将提交页面的「相机参数」板块替换为「基础参数」「调色参数」「其他」三个板块，基础参数包含拍摄模式、滤镜风格、柔光效果；调色参数包含5个Slider控件（影调、饱和度、冷暖、青品、锐度）；其他包含暗角开关。详情页同步调整。
> 
> **Deliverables**:
> - 更新类型定义 `CameraParam.cameraSettings`
> - 新增相机选项常量（拍摄模式、柔光效果、暗角）
> - 重构 `SubmitPage.tsx` 组件
> - 重构 `DetailPage.tsx` 组件
> - 更新数据库初始数据
> - TypeScript 类型检查通过
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: NO - sequential
> **Critical Path**: 类型定义 → 选项常量 → SubmitPage → DetailPage → 初始数据

---

## Context

### Original Request
用户要求调整提交页面的参数板块：
- 将「相机参数」改为「基础参数」「调色参数」「其他」三个板块
- **基础参数**：拍摄模式（AUTO/PRO）、滤镜风格（现有FILTER_OPTIONS）、柔光效果（无/柔美/梦幻/朦胧）
- **调色参数**：影调、饱和度、冷暖、青品、锐度（Slider 0-100）
- **其他**：暗角（开启/关闭）
- 图片选择、标题、图片内容保持不变
- 详情页同步调整
- 注意写入数据库的字段

### Interview Summary
- **核心需求**: 整体替换相机参数板块为新的三板块结构
- **图片相关**: 标题、图片选择、图片内容均保持不变
- **数据库**: camera_settings JSON 字段需要更新结构

---

## Work Objectives

### Core Objective
将相机参数从原有的 ISO/快门/光圈等替换为基础参数/调色参数/其他的结构。

### Concrete Deliverables
1. 更新 `src/api/public-apis/types.ts` 中的 CameraParam 类型
2. 更新 `src/utils/camera-options.ts` 添加新选项常量
3. 重构 `src/components/page-components/SubmitPage.tsx` 提交页面
4. 重构 `src/components/page-components/DetailPage.tsx` 详情页面
5. 更新 `src/dao/database.ts` 中的初始数据

### Definition of Done
- [ ] TypeScript 类型检查通过 (`npx tsc --noEmit`)
- [ ] ESLint 检查通过 (`npm run lint`)
- [ ] 提交页面可正常选择参数并提交
- [ ] 详情页面可正确显示所有参数

### Must Have
- 新的参数结构正确写入数据库
- 详情页正确读取并显示所有参数
- 保持图片选择、标题、图片内容功能不变

### Must NOT Have
- 不保留原有的 ISO/快门速度/光圈等参数
- 不能破坏现有功能

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO (项目无测试框架)
- **Automated tests**: NO
- **Agent-Executed QA**: YES (手动验证提交和详情展示)

### Agent-Executed QA Scenarios (MANDATORY)

#### Scenario: Submit new param with new structure
  Tool: Manual verification
  Preconditions: App running
  Steps:
    1. 打开提交页面
    2. 填写标题和描述
    3. 选择图片
    4. 在基础参数中选择：拍摄模式=PRO，滤镜=「明艳」，柔光效果=「梦幻」
    5. 在调色参数中设置：影调=60，饱和度=70，冷暖=30，青品=40，锐度=80
    6. 在其他中设置：暗角=开启
    7. 点击提交
  Expected Result: 提交成功，首页显示新条目

#### Scenario: View detail page with new param structure
  Tool: Manual verification
  Preconditions: 存在新结构的数据
  Steps:
    1. 点击任意参数条目进入详情页
    2. 查看参数展示区域
  Expected Result: 正确显示「基础参数」「调色参数」「其他」三个板块及所有参数值

---

## Execution Strategy

### Sequential Execution

```
Step 1: 更新类型定义 (types.ts)
Step 2: 新增相机选项常量 (camera-options.ts)
Step 3: 重构提交页面 (SubmitPage.tsx)
Step 4: 重构详情页面 (DetailPage.tsx)
Step 5: 更新数据库初始数据 (database.ts)
Step 6: 类型检查和验证
```

---

## TODOs

### Step 1: 更新类型定义

**File**: `src/api/public-apis/types.ts`

**What to do**:
- 更新 `CameraParam.cameraSettings` 类型：
  ```typescript
  cameraSettings: {
    // 基础参数
    shootMode: 'AUTO' | 'PRO';  // 拍摄模式
    filter: string;              // 滤镜风格 (保持现有)
    softLight: 'none' | 'soft' | 'dreamy' | 'hazy';  // 柔光效果
    // 调色参数 (0-100)
    tone: number;                // 影调
    saturation: number;          // 饱和度
    temperature: number;         // 冷暖
    tint: number;                // 青品
    sharpness: number;           // 锐度
    // 其他
    vignette: 'on' | 'off';     // 暗角
  };
  ```

**Must NOT do**:
- 保留旧的 iso, shutterSpeed, aperture 等字段

**References**:
- `src/api/public-apis/types.ts:7-15` - 现有类型结构

---

### Step 2: 新增相机选项常量

**File**: `src/utils/camera-options.ts`

**What to do**:
- 添加拍摄模式选项：
  ```typescript
  export const SHOOT_MODE_OPTIONS = [
    { label: 'AUTO', value: 'AUTO' },
    { label: 'PRO', value: 'PRO' },
  ];
  ```
- 添加柔光效果选项：
  ```typescript
  export const SOFT_LIGHT_OPTIONS = [
    { label: '无', value: 'none' },
    { label: '柔美', value: 'soft' },
    { label: '梦幻', value: 'dreamy' },
    { label: '朦胧', value: 'hazy' },
  ];
  ```
- 添加暗角选项：
  ```typescript
  export const VIGNETTE_OPTIONS = [
    { label: '开启', value: 'on' },
    { label: '关闭', value: 'off' },
  ];
  ```
- 添加调色参数默认值（用于 Slider）：
  ```typescript
  export const TONE_DEFAULT = 50;
  export const SATURATION_DEFAULT = 50;
  export const TEMPERATURE_DEFAULT = 50;
  export const TINT_DEFAULT = 50;
  export const SHARPNESS_DEFAULT = 50;
  ```

**Must NOT do**:
- 删除现有的 FILTER_OPTIONS（保持不变）

**References**:
- `src/utils/camera-options.ts:67-86` - 现有 FILTER_OPTIONS 结构

---

### Step 3: 重构提交页面

**File**: `src/components/page-components/SubmitPage.tsx`

**What to do**:

1. **更新状态初始化**：
   ```typescript
   const [cameraSettings, setCameraSettings] = useState({
     shootMode: 'AUTO',
     filter: FILTER_OPTIONS[0].value,
     softLight: 'none',
     tone: 50,
     saturation: 50,
     temperature: 50,
     tint: 50,
     sharpness: 50,
     vignette: 'off',
   });
   ```

2. **更新 UI 结构**：
   - 将「相机参数」标题改为显示三个板块
   - **基础参数板块**：
     - CameraParamPicker: 拍摄模式 (SHOOT_MODE_OPTIONS)
     - FilterPicker: 滤镜风格 (FILTER_OPTIONS)
     - CameraParamPicker: 柔光效果 (SOFT_LIGHT_OPTIONS)
   - **调色参数板块**：
     - CameraParamSlider x5: 影调、饱和度、冷青、锐度（0-100）
   - **其他板块**：
     - CameraParamPicker: 暗角 (VIGNETTE_OPTIONS)

3. **更新处理函数**：
   - `handleSettingChange` 需要处理数值类型的调色参数

**Must NOT do**:
- 修改图片选择、标题、描述相关代码

**References**:
- `src/components/page-components/SubmitPage.tsx:26-34` - 现有状态初始化
- `src/components/page-components/SubmitPage.tsx:140-196` - 现有参数UI

---

### Step 4: 重构详情页面

**File**: `src/components/page-components/DetailPage.tsx`

**What to do**:

1. **更新参数展示**：
   - 将「相机参数」标题改为显示三个板块
   - **基础参数板块**：显示拍摄模式、滤镜风格、柔光效果
   - **调色参数板块**：显示影调、饱和度、冷暖、青品、锐度（数值）
   - **其他板块**：显示暗角状态

2. **更新 ParamRow 显示**：
   - 需要处理新的参数结构
   - 需要将数值类型的调色参数显示为具体数值

3. **添加必要的导入**：
   - 导入新的选项常量用于滤镜、柔光效果等label转换

**Must NOT do**:
- 修改图片、标题、描述展示逻辑

**References**:
- `src/components/page-components/DetailPage.tsx:98-109` - 现有参数展示

---

### Step 5: 更新数据库初始数据

**File**: `src/dao/database.ts`

**What to do**:
- 更新 `initialData` 中的 `cameraSettings` 为新结构：
  ```typescript
  cameraSettings: {
    shootMode: 'PRO',
    filter: 'vivid',
    softLight: 'dreamy',
    tone: 60,
    saturation: 70,
    temperature: 30,
    tint: 40,
    sharpness: 80,
    vignette: 'on',
  },
  ```

**Must NOT do**:
- 保留旧的 cameraSettings 字段

**References**:
- `src/dao/database.ts:25-33` - 现有初始数据结构

---

### Step 6: 类型检查验证

**Commands**:
```bash
npx tsc --noEmit   # TypeScript 类型检查
npm run lint       # ESLint 检查
```

---

## Success Criteria

### Verification Commands
```bash
npx tsc --noEmit   # Expected: no errors
npm run lint       # Expected: no errors
```

### Final Checklist
- [ ] 类型定义正确更新
- [ ] 新选项常量已添加
- [ ] 提交页面可正常提交新结构参数
- [ ] 详情页面正确展示所有参数
- [ ] 初始数据使用新结构
- [ ] TypeScript 检查通过
- [ ] ESLint 检查通过
