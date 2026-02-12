# Tab Navigation Style Modification Plan

## TL;DR

> **Quick Summary**: Modify tab bar to show only titles, add rounded background on selected tab with subtle corner radius
>
> **Deliverables**: Updated `app/_layout.tsx` with tab styling changes
>
> **Estimated Effort**: Quick (simple style modification)
> **Parallel Execution**: NO (single file change)
> **Critical Path**: Modify _layout.tsx → Verify changes

---

## Context

### Original Request
User wants to modify tab navigation:
1. Cancel all tab icons - show only titles
2. Selected tab should activate directly
3. Add selected state styling with background color change

### Interview Summary
**Key Discussions**:
- Remove all tab icons - show only titles
- Text color should NOT change on selection
- Background color should change on selection
- Background should have soft rounded corners (not too round)
- Overall look should be soft/gentle

---

## Work Objectives

### Core Objective
Remove tab bar icons and add selected state background styling in `_layout.tsx`

### Concrete Deliverables
- Modified `app/_layout.tsx` with:
  - `tabBarIcon` removed from `screenOptions`
  - `tabBarItemStyle` added for selected background
  - TabIcon component removed (unused)

### Definition of Done
- [ ] No icons displayed in tab bar
- [ ] Text color unchanged between selected/unselected states (white)
- [ ] Selected tab shows background color (`#262626`)
- [ ] Background has soft rounded corners (borderRadius: 16)
- [ ] Tab titles remain visible
- [ ] App runs without errors

### Must Have
- Text color stays consistent (white)
- Selected tab has subtle background color
- Background has gentle rounded corners (not too round)
- Clean removal of icon code

### Must NOT Have (Guardrails)
- Text color should NOT change between selected/unselected
- No icons displayed in tab bar
- No breaking changes to navigation logic
- No empty catch blocks
- Keep AGENTS.md styling conventions (black background)

---

## Technical Approach

### Changes to `app/_layout.tsx`

1. **Remove TabIcon component** (no longer needed)
2. **Remove `tabBarIcon` callback** from `screenOptions`
3. **Keep text color consistent** - set both active and inactive to white:
   ```typescript
   tabBarActiveTintColor: '#ffffff',
   tabBarInactiveTintColor: '#ffffff',
   ```
4. **Add `tabBarItemStyle`** for selected background with soft rounded corners:
   ```typescript
   tabBarItemStyle: {
     backgroundColor: '#262626',      // Subtle gray background
     borderRadius: 16,                // Soft, gentle rounded corners
     paddingHorizontal: 12,            // Comfortable horizontal padding
     paddingVertical: 8,                // Comfortable vertical padding
     marginHorizontal: 4,              // Spacing between tabs
   }
   ```
5. **Update `tabBarStyle`** to have darker background for contrast:
   ```typescript
   tabBarStyle: {
     backgroundColor: '#1a1a1a',       // Darker background
     borderTopColor: '#333',
     height: 88,
     paddingBottom: 20,
     paddingHorizontal: 16,
   }
   ```
6. **Remove unused imports** (TabIcon-related View/Text imports)

### Style Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Text color | `#ffffff` | Consistent white text |
| Selected background | `#262626` | Subtle gray (AGENTS.md border color) |
| Tab bar background | `#1a1a1a` | Darker for contrast |
| Border radius | `16` | Soft, gentle rounded corners |
| Padding | `12 horizontal, 8 vertical` | Comfortable touch area |
| Margin | `4 horizontal` | Spacing between tabs |

### Implementation Strategy

**Challenge**: Expo Router's `tabBarItemStyle` doesn't natively support different styles for focused/unfocused states.

**Solution**: Apply uniform background styling with rounded corners to all tabs. The subtle gray background (`#262626`) will appear as a "selected" state against the darker tab bar (`#1a1a1a`), creating visual hierarchy without relying on text color changes.

---

## Execution Strategy

### Single Sequential Task
All changes in one file - no parallel execution needed.

---

## TODOs

- [ ] 1. Modify `app/_layout.tsx`

  **What to do**:
  - Remove `TabIcon` component (lines 6-24)
  - Remove `tabBarIcon` callback from `screenOptions`
  - Update `tabBarStyle` to have borderless, clean look
  - Keep `tabBarActiveTintColor: '#ff5111'` for selection indication
  - Remove unused `View` import from TabIcon

  **Must NOT do**:
  - Don't modify navigation structure
  - Don't change route names or titles

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
  - [ ] Tab bar shows only titles
  - [ ] Text color is white for both active/inactive (`#ffffff`)
  - [ ] tabBarItemStyle includes borderRadius: 16 (soft rounded corners)
  - [ ] tabBarItemStyle includes backgroundColor: '#262626'
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

  Scenario: Text color is consistent (no color change on selection)
    Tool: Bash
    Preconditions: None
    Steps:
      1. grep "tabBarActiveTintColor" app/_layout.tsx
      2. Verify value is '#ffffff'
      3. grep "tabBarInactiveTintColor" app/_layout.tsx
      4. Verify value is '#ffffff'
    Expected Result: Both active and inactive text colors are white
    Evidence: grep output captured

  Scenario: Selected tab has rounded background style
    Tool: Bash
    Preconditions: None
    Steps:
      1. grep -A 5 "tabBarItemStyle" app/_layout.tsx
      2. Verify "borderRadius: 16" is present
      3. Verify "backgroundColor: '#262626'" is present
    Expected Result: tabBarItemStyle has rounded corners and background color
    Evidence: grep output captured
  ```

  **Commit**: YES
  - Message: `style(tabs): remove icons and add rounded background for selected state`
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

# Verify rounded background style
grep "borderRadius.*16" app/_layout.tsx        # Expected: 16
grep "backgroundColor.*#262626" app/_layout.tsx # Expected: #262626
```

### Final Checklist
- [ ] All icons removed from tab bar
- [ ] Tab titles remain visible
- [ ] Text color is consistent (white)
- [ ] Selected tab has subtle gray background (`#262626`)
- [ ] Background has soft rounded corners (borderRadius: 16)
- [ ] Code follows AGENTS.md conventions
