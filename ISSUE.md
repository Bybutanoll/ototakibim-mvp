# UI Regression Analysis - OtoTakibim

## Problem Description
Web sitesinde UI bozulması tespit edildi. Ana sayfa, dashboard ve work-orders sayfalarında görsel sorunlar mevcut.

## Environment Details
- **Project**: OtoTakibim MVP
- **Frontend**: Next.js 15.5.2
- **Tailwind CSS**: 3.4.17
- **React**: 19.1.0
- **Package Manager**: npm (pnpm not available)

## Current Configuration Analysis

### Tailwind Config Issues
- **File**: `frontend/tailwind.config.js`
- **Content Path**: Multiple overlapping paths detected
  ```js
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{ts,tsx,js,jsx}',        // ❌ This path doesn't exist
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ]
  ```

### Global CSS Issues
- **File**: `frontend/src/app/globals.css`
- **Problems**:
  - Duplicate keyframe definitions (blob animation defined twice)
  - Duplicate scrollbar styles
  - CSS custom properties mixed with Tailwind
  - Potential conflicts between custom animations and Tailwind utilities

### Layout Issues
- **File**: `frontend/src/app/layout.tsx`
- **Problems**:
  - Missing proper layout structure (no header, sidebar, main container)
  - Portal root exists but no proper z-index management
  - No responsive layout structure

## Identified Issues

### 1. Tailwind Content Path Mismatch
- Config references `./app/**/*` but actual structure is `./src/app/**/*`
- This causes Tailwind to miss many component files

### 2. CSS Conflicts
- Custom animations conflict with Tailwind utilities
- Duplicate definitions cause unpredictable behavior
- CSS custom properties override Tailwind defaults

### 3. Layout Structure Missing
- No proper header/sidebar/main layout
- Portal elements not properly managed
- Z-index conflicts between components

### 4. Build Issues
- Build command not producing output (potential silent failures)
- Missing error reporting

## Reproduction Steps
1. Navigate to `/` (homepage)
2. Navigate to `/dashboard` 
3. Navigate to `/work-orders/[id]`
4. Check browser console for errors
5. Test responsive behavior on mobile

## Expected Fixes
1. **ADIM 1**: Fix Tailwind content paths
2. **ADIM 2**: Clean up globals.css conflicts
3. **ADIM 3**: Implement proper layout structure
4. **ADIM 4**: Add responsive fixes
5. **ADIM 5**: Redesign landing page (pentayazilim.com style)
6. **ADIM 6**: Add CI/build smoke tests

## Priority
**HIGH** - UI regression affecting user experience

## Next Steps
1. Create `hotfix/repro-logs` branch
2. Document current state with screenshots
3. Begin systematic fixes following the 6-step plan