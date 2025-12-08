# IKON Property Management Platform - Style Guide

## 1. Design Philosophy

IKON is a modern, corporate SaaS platform designed with a focus on **trust, clarity, and efficiency**. The design system balances professional aesthetics with user-friendly interfaces across three distinct user types: Landlords, Tenants, and Admin users.

---

## 2. Color Palette

### Primary Colors
- **Primary (Navy)**: `#0f172a` (RGB: 15, 23, 42) - Deep navy that conveys trust and stability
- **Primary Foreground**: `#faf8f6` (RGB: 250, 248, 246) - Off-white for text on navy
- **Secondary (Sky Blue)**: `#f0f7ff` (RGB: 240, 247, 255) - Light blue accent for UI elements

### Semantic Colors
- **Success (Green)**: `#10b981` - Positive actions, confirmations, and approved states
- **Warning (Amber)**: `#f59e0b` - Cautionary states, pending items
- **Danger (Red)**: `#ef4444` - Destructive actions, rejections, errors
- **Neutral Gray**: `#6b7280` - Supporting text and disabled states

### Background Colors
- **Light Mode**: 
  - Background: `#fafafa` (Very light gray)
  - Card: `#ffffff` (Pure white)
  - Subtle Pattern: Radial gradient dots (24px spacing)
  
- **Dark Mode**:
  - Background: `#0f172a` (Navy)
  - Card: `#1a2332` (Slightly lighter navy)

---

## 3. Typography

### Font Families
1. **Headings**: `Plus Jakarta Sans` (Google Fonts)
   - Geometric, modern sans-serif with excellent legibility
   - Used for: h1, h2, h3, h4, h5, h6
   - Font weights: 700 (bold), 600 (semibold)

2. **Body Text**: `Inter` (Google Fonts)
   - Clean, highly legible sans-serif
   - Used for: paragraphs, labels, input text
   - Font weights: 400 (regular), 500 (medium), 600 (semibold)

3. **Monospace**: `Menlo` (System fallback for code)
   - Used sparingly for technical content

### Type Scale
| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| h1 | 2.75rem (44px) | 700 | 1.2 |
| h2 | 2rem (32px) | 700 | 1.3 |
| h3 | 1.5rem (24px) | 700 | 1.4 |
| Body Large | 1.125rem (18px) | 400 | 1.6 |
| Body | 1rem (16px) | 400 | 1.5 |
| Body Small | 0.875rem (14px) | 400 | 1.5 |
| Label | 0.875rem (14px) | 600 | 1.4 |
| Caption | 0.75rem (12px) | 500 | 1.4 |

---

## 4. Spacing System

Using a base unit of **0.25rem (4px)**:

| Scale | Pixels | Token |
|-------|--------|-------|
| xs | 4px | spacing-1 |
| sm | 8px | spacing-2 |
| md | 12px | spacing-3 |
| lg | 16px | spacing-4 |
| xl | 24px | spacing-6 |
| 2xl | 32px | spacing-8 |
| 3xl | 48px | spacing-12 |
| 4xl | 64px | spacing-16 |

**Key Applications**:
- Card padding: 24px (spacing-6)
- Section margin: 48px (spacing-12)
- Input padding: 10px 12px
- Border radius: 8px (0.5rem default)

---

## 5. Components & Visual Elements

### Cards
- Background: White (light mode) or `#1a2332` (dark mode)
- Border: 1px solid `#e5e7eb` (light) or `#374151` (dark)
- Border Radius: 8px
- Padding: 24px
- Shadow: `shadow-sm` (hover: `shadow-md`)
- Glassmorphism option: `bg-white/80 backdrop-blur-md`

### Buttons
- **Primary Button**:
  - Background: Navy (`#0f172a`)
  - Text: White
  - Padding: 10px 16px (standard), 12px 20px (large)
  - Border Radius: 8px (standard), 24px (rounded variant)
  - State: Hover darkens background, active adds shadow

- **Secondary Button**:
  - Background: Light blue (`#f0f7ff`)
  - Text: Navy
  - Border: 1px solid primary

- **Outline Button**:
  - Background: Transparent
  - Border: 1px solid border color
  - Text: Foreground color

- **Ghost Button**:
  - No background or border
  - Text hover: Primary color

### Badges
- **Default**: Navy background + white text
- **Secondary**: Light blue background + navy text
- **Outline**: Transparent + border
- **Destructive**: Red background + white text
- Border Radius: 4px
- Padding: 4px 8px

### Input Fields
- Border: 1px solid `#e5e7eb`
- Background: White
- Padding: 10px 12px
- Border Radius: 6px
- Focus: Border color changes to primary (navy)
- Placeholder: Gray text (`#9ca3af`)

### Checkboxes & Radio Buttons
- Rounded appearance for modern feel
- Primary color when checked/selected
- Size: 16x16px

---

## 6. Visual Effects

### Shadows
- `shadow-sm`: Subtle, used for cards and lifted elements
- `shadow-md`: Moderate depth for interactive elements
- `shadow-lg`: Prominent depth for modals and overlays
- `shadow-xl`: Maximum depth for hero sections

### Backdrop Blur
- Used in: Headers, navigation, glassmorphic cards
- Blur value: `backdrop-blur-md`
- Opacity: 80% (`bg-white/80`)

### Gradients
- **Hero Background**: Linear gradient from light gray to white
- **Text Gradient**: Primary blue to darker blue (used in headings)
- **Accent**: Radial gradients for decorative elements (blur applied)

### Animations & Transitions
- **Standard Transition**: 200-300ms ease
- **Hover States**: Subtle brightness/elevation changes
- **Entry Animations**: 
  - `animate-in fade-in` for fade effects
  - `animate-in slide-in-from-bottom-10` for bottom slides
  - Duration: 500-700ms

### Interactive States
- **Hover**: 
  - Cards: Slight shadow increase
  - Buttons: Background darkens or background appears
  - Links: Color changes to primary
  
- **Active/Focus**: 
  - Border or ring highlight in primary color
  - Visibility: Ring color `hsl(var(--ring))`
  
- **Disabled**: 
  - Opacity: 50%
  - Cursor: Not-allowed

---

## 7. Layout Patterns

### Dashboard Layout
- **Sidebar**: 256px (16rem) fixed, navy background on desktop, collapsible on mobile
- **Header**: 64px (4rem) height, white background with subtle glassmorphism
- **Content Area**: Responsive grid with max-width container
- **Spacing**: 24-32px padding around main content

### Mobile Layout
- **Notch Phone Frame**: Simulates iOS/Android phone interface
- **Borders**: 32px (2rem) thick phone frame border
- **Navigation**: Bottom tab bar (20px height, 4 tabs)
- **Home Indicator**: Small bar at bottom center
- **Padding**: 24px internal padding for content

### Form Layout
- **Grid**: 2-column on desktop, 1-column on mobile
- **Input Spacing**: 16px vertical gap between fields
- **Label Positioning**: Above inputs, bold text (600 weight)
- **Helper Text**: Optional text below input in muted color

---

## 8. Responsive Design

### Breakpoints
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md/lg)
- **Desktop**: > 1024px (lg)
- **Large Desktop**: > 1280px (xl)

### Mobile-First Approach
- Start with mobile styles, use `md:` and `lg:` prefixes for larger screens
- Cards stack vertically on mobile
- Grids: 1 column (mobile) → 2 columns (tablet) → 4 columns (desktop)

---

## 9. Data Visualization

### Charts (Recharts)
- **Colors**:
  - Primary line: `hsl(var(--primary))`
  - Secondary: `hsl(var(--chart-2))`
  - Accent colors from chart palette
  
- **Styling**:
  - Grid: Faint dots (opacity: 5%)
  - Axis labels: Small, gray text
  - Tooltips: White background with shadow
  - Animation: Smooth line animation on load

### Progress Bars
- Height: 4px (small), 8px (standard)
- Background: Light gray
- Fill: Primary color
- Border Radius: 2-4px

### Status Indicators
- **Badges**: Small, colored squares with text
- **Dots**: 8px circles for inline status
- **Icons**: With color-coded backgrounds

---

## 10. Accessibility & Usability

### Test IDs
Every interactive element and data display element has a `data-testid`:
- **Interactive**: `{action}-{target}` (e.g., `button-submit`, `input-email`)
- **Display**: `{type}-{content}` (e.g., `text-username`, `status-payment`)
- **Lists**: `{type}-{description}-{id}` (e.g., `card-property-${id}`)

### Keyboard Navigation
- Tab order: Logical flow through interactive elements
- Focus states: Clear ring indicator in primary color
- Links: Underline on hover

### Color Contrast
- All text meets WCAG AA standards (4.5:1 for normal, 3:1 for large)
- Do not rely on color alone for meaning

---

## 11. Component Library Usage

### Shadcn/UI Components Used
- Button, Card, Input, Label, Badge, Dialog, Tabs, Select, Checkbox, etc.
- **Customization**: Stripped of default styling and re-applied per design system
- **Consistency**: All components follow same spacing, typography, and color rules

---

## 12. Implementation Examples

### Creating a Styled Card
```tsx
<Card className="shadow-sm hover:shadow-md transition-shadow">
  <CardHeader>
    <CardTitle>Your Title</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

### Creating a Form Field
```tsx
<div className="space-y-2">
  <Label htmlFor="field" className="font-medium">Label</Label>
  <Input 
    id="field" 
    placeholder="Placeholder text"
    className="h-10 px-3"
    data-testid="input-field"
  />
</div>
```

### Using Glassmorphism
```tsx
<div className="glass-card p-6">
  <p>Blurred background effect</p>
</div>
```

---

## 13. Brand Voice

- **Tone**: Professional yet approachable
- **Language**: Clear, jargon-minimal, action-oriented
- **Messaging**: Focus on benefits (efficiency, transparency, growth)
- **Visual Language**: Modern, minimal, data-driven

---

## 14. Future Considerations

- Animation library: `framer-motion` (already installed)
- Dark mode: Fully supported with CSS variables
- Internationalization: Text can be easily swapped
- Responsive images: Use modern formats (WebP fallbacks)

---

**Last Updated**: December 8, 2025  
**Version**: 1.0  
**Designed for**: IKON Property Management Platform
