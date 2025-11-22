# UI Specification: SAM App

## 1. Design System & Tokens

### Colors
- **Background**: Dark Gradient
  - `bg-gray-950` to `bg-black` (or `from-gray-900 to-gray-950`)
  - Hex approximation: `#1a1a1a` -> `#0d0d0d`
- **Primary Accent**: Blue
  - Chat Bubbles (AI): `bg-blue-600` to `bg-blue-500` gradient.
  - Sliders (Active): `bg-blue-500`
  - Send Button: `bg-blue-600` (or Red if matching screenshot strictly, but requirements said Blue. **Decision: Blue**)
- **Secondary Accent**: Dark Gray/Surface
  - Cards/Inputs: `bg-gray-800/50` or `bg-white/5` (glassmorphism)
  - Chat Bubbles (User): `bg-gray-800`
- **Text**:
  - Primary: `text-white`
  - Secondary: `text-gray-400`
  - Muted: `text-gray-600`

### Typography
- **Font**: Inter (Next.js default) or system-ui.
- **Sizes**:
  - Header: `text-lg font-semibold`
  - Body: `text-sm` or `text-base`
  - Small: `text-xs` (dates, labels)

### Spacing & Layout
- **Container**: Mobile-first, max-width `md` (centered on desktop).
- **Padding**: `p-4` (16px) standard.
- **Gap**: `gap-3` or `gap-4`.
- **Radius**: `rounded-2xl` or `rounded-3xl` for cards/bubbles.

## 2. Component Specs

### Header
- "Open Sam" text centered or left-aligned? Screenshot shows "ChatAI" centered.
- Menu icon (left), More icon (right).

### Calendar Strip
- Horizontal scroll.
- Pills: Date number + Day name.
- Active: White text, Blue dot? Or Blue background.
- Inactive: Gray text.

### Sliders (Mood & Sleep)
- **Track**: Dark gray background, Blue active portion.
- **Thumb**: Circular, white/light gray, shadow.
- **Value Bubble**: Floating above thumb.
- **Sleep**: Includes "chips" (Great, Okay, Meh) below slider.

### Chat
- **Stream**: Vertical scroll, bottom anchored.
- **Bubbles**:
  - AI: Left aligned, Blue gradient, rounded-tr-xl rounded-tl-xl rounded-br-xl.
  - User: Right aligned, Dark gray, rounded-tr-xl rounded-tl-xl rounded-bl-xl.
- **Input**:
  - Floating pill shape.
  - Placeholder: "write your question..."
  - Mic icon (right inside input).
  - Send button (circle, outside or inside? Screenshot shows outside/adjacent).

### Bottom Nav
- 3 Tabs: Log Viewer, Insights, Sensor Data.
- Active: Blue icon/text.
- Inactive: Gray.

## 3. Interaction Patterns
- **Slider**: Draggable, updates state in real-time.
- **Input**: Auto-expand? No, pill shape usually fixed height or grows slightly.
- **Transitions**: Smooth fade-ins for messages.

## 4. Accessibility
- `aria-label` on all buttons.
- `role="slider"` for custom sliders.
- Keyboard navigation support.
