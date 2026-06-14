# Frontend Specification & Component List: Admin Panel

## 1. Overview
The Admin Panel is a Next.js 16 app designed with a premium, responsive, and modern UI. It uses Tailwind CSS for styling, Lucide React for consistent iconography, and Framer Motion for smooth micro-animations. The color palette focuses on slate tones with a vibrant brand accent.

## 2. Global Layout & Structure
- **Global Theme (`globals.css`)**: Defines color variables (brand tones, background, foreground) and imports Inter font.
- **RootLayout (`app/layout.tsx`)**: Integrates the `Sidebar` and `Header` globally, wrapping the main content area in a flexible, scrollable `main` tag.
- **Utility Functions (`lib/utils.ts`)**: Export `cn` function (using `clsx` and `tailwind-merge`) to conditionally join Tailwind classes smoothly.

## 3. UI Components (Shared)
- **`Sidebar` (`components/layout/Sidebar.tsx`)**: 
  - Vertical navigation pane containing links to all core entities.
  - Active state detection using Next.js `usePathname`.
  - Polished hover effects and consistent icon sizing.
- **`Header` (`components/layout/Header.tsx`)**: 
  - Top navigation bar featuring a global search input and user profile/notification actions.
  - Sticky positioning with backdrop blur for a glass-panel effect.

## 4. Page Components
1. **Dashboard (`app/page.tsx`)**: 
   - Quick stats row using Framer Motion for staggered entrance animations.
   - Recent Rentals table for quick status checks.
   - Quick Actions sidebar for standard operational shortcuts.
2. **Categories (`app/categories/page.tsx`)**: 
   - Grid layout of cards representing item categories.
   - Includes dropdown menus for Edit/Delete actions (styled with hover group utilities).
3. **Items Catalog (`app/items/page.tsx`)**: 
   - Data table displaying items with their category, pricing, and availability status.
   - Features a search bar and filter button.
4. **Rentals Management (`app/rentals/page.tsx`)**: 
   - Data table tracking active/pending rentals.
   - Includes date filtering and status indicators using color-coded Tailwind badges.
5. **Users Management (`app/users/page.tsx`)**: 
   - List of both CLIENT and ADMIN roles.
   - Displays contact information, total rentals, and account status with clear iconography.
6. **Discounts & Promos (`app/discounts/page.tsx`)**: 
   - Card-based layout showing active vs. inactive promotional codes, use count, and value.
7. **Reviews (`app/reviews/page.tsx`)**: 
   - List layout of user feedback with star rating representations.
   - Includes an inline reply action.

## 5. UI/UX Notes
- **Spacing & Layout**: Employs generous padding (e.g., `p-6`) and spacing (`space-y-6`, `gap-6`) to create a breathable, uncluttered interface.
- **Typography**: Uses the Inter font family. High contrast on primary text (`text-slate-900`) and soft contrast on secondary text (`text-slate-500`).
- **Micro-Animations**: Framer Motion powers slight fade-and-slide up transitions (`y: 20` to `y: 0`, `opacity: 0` to `1`) on cards and table rows, giving a snappy, application-like feel.
- **Borders & Shadows**: Heavy reliance on subtle borders (`border-slate-200`) combined with soft shadows (`shadow-sm`) to define container edges without feeling heavy.
