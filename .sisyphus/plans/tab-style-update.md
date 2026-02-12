# Tab Style Update Plan

## TL;DR

> **Quick Summary**: Modify tab bar to remove icons, add #ff5111 background on selected tab, keep text color white, add soft rounded corners
>
> **Deliverables**: Updated `app/_layout.tsx` with new tab styling
>
> **Estimated Effort**: Quick (simple UI modification)
> **Parallel Execution**: NO (single file change)
> **Critical Path**: Modify _layout.tsx → Verify changes

---

## Context

### User Requirements
1. Remove all tab icons - show only titles
2. Text color should NOT change between selected/unselected states (keep white)
3. Selected tab should have background color #ff5111 (orange accent)
4. Background should have soft rounded corners (borderRadius: 16)
5. Overall look should be soft/gentle

### Current Implementation
- `app/_layout.tsx` uses emoji icons in `TabIcon` component
- Currently uses tabBarIcon callback
- Active tint color: `#ff5111` (orange) for text
- Inactive tint color: `#737373` (gray) for text

---

## Work Objectives

### Core Objective
Modify tab bar styling to meet user requirements

### Concrete Deliverables
- Modified `app/_layout.tsx` with:
  - TabIcon component removed
  - tabBarIcon callback removed (icons gone)
  - Custom tab button with conditional background styling
  - Selected background: `#ff5111`
  - Text color: `#ffffff` (consistent for all states)
  - Border radius: `16` (soft rounded corners)

### Definition of Done
- [x] No icons displayed in tab bar
- [x] Text color is white for both active/inactive states
- [x] Selected tab shows #ff5111 background
- [x] Background has soft rounded corners (borderRadius: 16)
- [x] Tab titles remain visible
- [x] App runs without errors

### Must Have
- Text color stays consistent (white #ffffff)
- Selected tab has #ff5111 background color
- Background has gentle rounded corners (borderRadius: 16)
- Clean removal of icon code

### Must NOT Have (Guardrails)
- Text color should NOT change between selected/unselected
- No icons displayed in tab bar
- No breaking changes to navigation logic
- Keep AGENTS.md styling conventions (black background #000000)

---

## Technical Approach

### Challenge
Expo Router's `tabBarItemStyle` doesn't natively support different styles for focused/unfocused states. We need to use `tabBarButton` render callback to customize tab button behavior.

### Solution: Custom Tab Button with Conditional Styling

```typescript
import { Pressable, StyleSheet } from 'react-native';

// Custom tab bar button with selected background
function CustomTabButton({ children, onPress, isFocused }: { children: React.ReactNode; onPress: () => void; isFocused: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.tabButton,
        isFocused && styles.tabButtonFocused,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  tabButtonFocused: {
    backgroundColor: '#ff5111', // Selected background - ORANGE
  },
});
```

### Changes to `app/_layout.tsx`

1. **Remove TabIcon component** (lines 6-24)
2. **Remove tabBarIcon callback** from screenOptions
3. **Add tabBarButton render callback** to customize tab button rendering
4. **Set text colors to white** for both active/inactive:
   ```typescript
   tabBarActiveTintColor: '#ffffff',
   tabBarInactiveTintColor: '#ffffff',
   ```
5. **Keep tabBarStyle** with dark background for contrast
6. **Remove unused imports** (TabIcon-related View/Text imports, keep Pressable, StyleSheet)

### Style Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Text color | `#ffffff` | Consistent white text |
| Selected background | `#ff5111` | Orange accent (as requested) |
| Tab bar background | `#1a1a1a` | Darker for contrast |
| Border radius | `16` | Soft, gentle rounded corners |
| Padding | `12 horizontal, 8 vertical` | Comfortable touch area |
| Margin | `4 horizontal` | Spacing between tabs |

---

## Execution Strategy

### Single Sequential Task
All changes in one file - no parallel execution needed.

---

## TODOs

- [x] 1. Modify `app/_layout.tsx`

  **What to do**:
  - Remove `TabIcon` component (lines 6-24)
  - Remove `tabBarIcon` callback from `screenOptions`
  - Add `CustomTabButton` component with conditional background styling
  - Add `tabBarButton` render callback to `screenOptions`
  - Set `tabBarActiveTintColor: '#ffffff'`
  - Set `tabBarInactiveTintColor: '#ffffff'`
  - Import `Pressable` and `StyleSheet` from 'react-native'
  - Keep `tabBarStyle` with dark background

  **Must NOT do**:
  - Don't modify navigation structure
  - Don't change route names or titles
  - Don't change tab bar background color

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple file modification, clear scope
  - **Skills**: []
    - No specialized skills needed for this basic React Native styling

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocks**: None
  - **Blocked By**: None

  **References**:
  - `app/_layout.tsx:26-80` - Current implementation to modify

  **Acceptance Criteria**:
  - [ ] TabIcon component removed
  - [ ] tabBarIcon callback removed
  - [ ] CustomTabButton component added with #ff5111 background
  - [ ] Text color is white for both active/inactive (`#ffffff`)
  - [ ] Border radius is 16 (soft rounded corners)
  - [ ] App compiles without errors

  **Agent-Executed QA Scenarios**:
  ```
  Scenario: Tab bar shows only titles without icons
    Tool: Bash
    Preconditions: None
    Steps:
      1. grep -n "tabBarIcon" app/_layout.tsx
      2. Verify no matches found
      3. grep -n "TabIcon" app/_layout.tsx
      4. Verify no matches found
    Expected Result: No tabBarIcon or TabIcon references
    Evidence: grep output captured

  Scenario: Text color is consistent (white)
    Tool: Bash
    Preconditions: None
    Steps:
      1. grep "tabBarActiveTintColor" app/_layout.tsx
      2. Verify value is '#ffffff'
      3. grep "tabBarInactiveTintColor" app/_layout.tsx
      4. Verify value is '#ffffff'
    Expected Result: Both active and inactive text colors are white
    Evidence: grep output captured

  Scenario: Selected tab has orange background styling
    Tool: Bash
    Preconditions: None
    Steps:
      1. grep -A 5 "tabButtonFocused" app/_layout.tsx
      2. Verify "backgroundColor: '#ff5111'" is present
      3. grep "borderRadius.*16" app/_layout.tsx
      4. Verify borderRadius is 16
    Expected Result: Selected tab has orange background with soft rounded corners
    Evidence: grep output captured
  ```

  **Commit**: YES
  - Message: `style(tabs): remove icons and add orange background for selected state`
  - Files: `app/_layout.tsx`
  - Pre-commit: None

---

## Success Criteria

### Verification Commands
```bash
# Check no icon-related code remains
grep -c "tabBarIcon\|TabIcon" app/_layout.tsx  # Expected: 0

# Verify text colors are white (consistent)
grep "tabBarActiveTintColor" app/_layout.tsx   # Expected: #ffffff
grep "tabBarInactiveTintColor" app/_layout.tsx # Expected: #ffffff

# Verify orange background styling
grep "backgroundColor: '#ff5111'" app/_layout.tsx  # Expected: 1 match
grep "borderRadius.*16" app/_layout.tsx             # Expected: 16
```

### Final Checklist
- [ ] All icons removed from tab bar
- [ ] Tab titles remain visible
- [ ] Text color is consistent (white)
- [ ] Selected tab has orange background (`#ff5111`)
- [ ] Background has soft rounded corners (borderRadius: 16)
- [ ] Code follows AGENTS.md conventions
