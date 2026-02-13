# 提交页面图片选择器改造

## TL;DR

> **Quick Summary**: 将提交页面的图片输入从"手动填写URL"改为"拉起相册选择图片"，选择后复制到文档目录持久化存储
> 
> **Deliverables**:
> - 添加 expo-image-picker 依赖
> - 创建 ImagePicker 公共组件
> - 修改 SubmitPage 支持图片选择（最多3张）
> - 图片持久化存储到文档目录
> - iOS 权限配置
> 
> **Estimated Effort**: Short
> **Parallel Execution**: NO - sequential
> **Critical Path**: 安装依赖 → 创建组件 → 修改SubmitPage → 权限配置

---

## Context

### Original Request
将提交页面的图片输入方式从手动填写URL改为拉起相册选择图片

### Interview Summary
**Key Discussions**:
- 图片存储: 本地URI，直接存储到数据库
- 图片数量: 最多3张
- 输入方式: 仅图片选择器（移除手动URL输入）
- 测试策略: 仅 Agent QA 验证
- Web兼容性: 仅 iOS/Android，Web 跳过
- 持久化: 复制到文档目录

**Research Findings**:
- 当前SubmitPage有9个URL输入字段
- 数据库images字段存储JSON数组
- 无 expo-image-picker 依赖
- expo-image-picker 不支持 Web

### Metis Review
**Identified Gaps** (addressed):
- Web平台兼容: 确认仅 iOS/Android 实现
- 图片持久化: 确认复制到文档目录
- 现有数据显示: 无需修改，Image组件通用处理uri

---

## Work Objectives

### Core Objective
将提交页面的图片输入从手动URL改为相册选择，选择后复制到文档目录持久化存储

### Concrete Deliverables
- [x] 添加 expo-image-picker 依赖
- [x] 创建 ImagePicker 组件 (public-components)
- [x] 修改 SubmitPage 支持图片选择（最多3张）
- [x] iOS/Android 权限配置
- [x] 图片复制到文档目录持久化

### Definition of Done
- [ ] 用户可从相册选择1-3张图片
- [ ] 选择的图片显示缩略图
- [ ] 提交后图片持久化存储
- [ ] iOS photo library permission 配置正确

### Must Have
- 相册选择图片功能
- 最多3张限制
- 图片持久化存储
- iOS 权限配置
- 现有HTTPS URL图片仍能正常显示

### Must NOT Have (Guardrails)
- 移除现有URL支持（显示组件需兼容）
- Web平台图片选择（Web跳过）
- 图片编辑/裁剪功能
- 相机拍照功能
- 云上传功能

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: NO
- **Framework**: N/A
- **Agent-Executed QA**: YES (MANDATORY)

### Agent-Executed QA Scenarios (MANDATORY — ALL tasks)

> 验证工具: iOS需要用 xcrun simctl + adb shell 安卓模拟器，或直接物理设备测试

**Scenario 1: 图片选择流程**
- Tool: interactive_bash / manual test
- Preconditions: iOS模拟器运行
- Steps:
  1. 启动App，进入提交页面
  2. 点击"选择图片"按钮
  3. iOS权限弹窗出现 → 同意
  4. 相册打开，选择1-3张图片
  5. 返回App，验证缩略图显示
- Expected Result: 缩略图正确显示，提交按钮可用

**Scenario 2: 图片数量限制**
- Steps:
  1. 已选择3张图片
  2. 再次点击"选择图片"
  3. 验证提示"最多选择3张"
- Expected Result: 无法选择超过3张

**Scenario 3: 权限拒绝处理**
- Steps:
  1. 首次点击"选择图片"
  2. 选择"不允许"权限
  3. 验证提示"需要相册权限"
- Expected Result: 显示权限说明

**Scenario 4: 提交后持久化**
- Steps:
  1. 选择图片并提交
  2. 杀掉App，重新打开
  3. 进入详情页查看
- Expected Result: 图片仍能正常显示

---

## Execution Strategy

### Sequential Execution

```
Task 1: 安装依赖 (expo-image-picker)
    ↓
Task 2: 创建 ImagePicker 公共组件
    ↓
Task 3: 修改 SubmitPage 集成图片选择
    ↓
Task 4: iOS/Android 权限配置
    ↓
Task 5: 图片持久化存储逻辑
```

---

## TODOs

### Task 1: 安装 expo-image-picker 依赖

**What to do**:
- 运行 `npx expo install expo-image-picker expo-file-system` 安装依赖
- 验证 package.json 添加成功

**Must NOT do**:
- 不要手动修改版本号

**References**:
- `package.json` - 现有依赖配置

**Acceptance Criteria**:
- [ ] package.json 包含 expo-image-picker
- [ ] package.json 包含 expo-file-system
- [ ] npx expo install 成功无报错

---

### Task 2: 创建 ImagePicker 公共组件

**What to do**:
- 在 `src/components/public-components/` 创建 `ImagePicker.tsx`
- 组件功能:
  - 接收 maxImages prop (默认3)
  - 显示"选择图片"按钮
  - 调用 expo-image-picker
  - 显示已选图片缩略图网格
  - 支持删除已选图片
  - 返回选中图片URI数组

**Must NOT do**:
- 不要在这里处理权限（放在SubmitPage层）

**Recommended Agent Profile**:
- **Category**: `visual-engineering`
- **Skills**: [`frontend-ui-ux`]
- Reason: 需要创建UI组件，涉及gluestack-ui使用

**References**:
- `src/components/public-components/CameraParamInput.tsx` - 现有公共组件模式
- `gluestack-ui-mcp` - 组件文档

**Acceptance Criteria**:
- [ ] ImagePicker.tsx 创建成功
- [ ] 组件可接受 maxImages prop
- [ ] 返回选中图片URI数组

---

### Task 3: 修改 SubmitPage 集成图片选择

**What to do**:
- 读取现有 SubmitPage.tsx
- 移除9个URL输入字段
- 集成 ImagePicker 组件
- 修改验证逻辑: 验证图片数组长度1-3
- 修改提交逻辑: 使用图片URI数组
- 处理权限请求

**Must NOT do**:
- 不要修改数据库schema
- 不要修改显示组件

**References**:
- `src/components/page-components/SubmitPage.tsx` - 现有提交页面
- `src/api/page-apis/submit-api.ts` - 提交API

**Acceptance Criteria**:
- [ ] SubmitPage 不再有URL输入字段
- [ ] ImagePicker 集成成功
- [ ] 验证: 至少1张图片才能提交
- [ ] 验证: 最多3张图片限制

---

### Task 4: iOS/Android 权限配置

**What to do**:
- iOS: 在 app.json/app.config 添加 `ios.infoPlist.NSPhotoLibraryUsageDescription`
- Android: 在 app.json 添加 `android.permissions.READ_EXTERNAL_STORAGE` (如果需要)

**References**:
- Expo文档: expo-image-picker permissions

**Acceptance Criteria**:
- [ ] iOS info.plist 包含相册权限描述
- [ ] 构建不报权限错误

---

### Task 5: 图片持久化存储逻辑

**What to do**:
- 在选择图片后，使用 expo-file-system 将图片复制到文档目录
- 生成唯一文件名避免冲突
- 使用持久化的URI提交到数据库
- 清理临时文件

**技术方案**:
```typescript
import * as FileSystem from 'expo-file-system';

const copyToDocuments = async (uri: string): Promise<string> => {
  const filename = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const dest = `${FileSystem.documentDirectory}images/${filename}.jpg`;
  
  await FileSystem.makeDirectoryAsync(
    `${FileSystem.documentDirectory}images`,
    { intermediates: true }
  );
  
  await FileSystem.copyAsync({ from: uri, to: dest });
  return dest;
};
```

**References**:
- `expo-file-system` - 文档

**Acceptance Criteria**:
- [ ] 选择图片后复制到文档目录
- [ ] 提交后图片持久化，重启App仍可查看

---

## Commit Strategy

| After Task | Message | Files |
|------------|---------|-------|
| 1 | `feat: add expo-image-picker and expo-file-system dependencies` | package.json |
| 2 | `feat: create ImagePicker component` | ImagePicker.tsx |
| 3 | `feat: integrate image picker in SubmitPage` | SubmitPage.tsx |
| 4 | `feat: add iOS photo library permission` | app.json |
| 5 | `feat: persist images to document directory` | ImagePicker.tsx |

---

## Success Criteria

### Verification Commands
```bash
npx tsc --noEmit  # TypeScript 检查
```

### Final Checklist
- [ ] expo-image-picker 依赖添加成功
- [ ] ImagePicker 组件创建完成
- [ ] SubmitPage 移除URL输入，集成图片选择
- [ ] iOS 权限配置正确
- [ ] 图片持久化到文档目录
- [ ] 现有HTTPS URL图片仍正常显示
