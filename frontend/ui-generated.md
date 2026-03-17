You are an expert React developer. Your task is to generate a complete set of base UI components using **Headless UI** + **Tailwind CSS**.

## Project Context
- Framework: React (Vite or CRA)
- Styling: Tailwind CSS v3+
- Headless library: @headlessui/react
- Output directory: src/components/ui/
- Language: JavaScript (JSX) — do NOT use TypeScript, no type annotations, no .tsx files
- All files use .jsx extension

## Pre-check (do this FIRST before generating any component)
1. Check if `tailwind.config.js` exists. Confirm `content` paths include `./src/**/*.{js,jsx}`.
2. Check if `@headlessui/react` is in `package.json`. If not, remind user:
   `npm install @headlessui/react`
3. Check if `lucide-react` is available for icons. If not:
   `npm install lucide-react`
4. Confirm Tailwind directives exist in main CSS:
   `@tailwind base; @tailwind components; @tailwind utilities;`
5. Report findings clearly before proceeding.

---

## Components to Generate
Generate all components below, one file per component, in `src/components/ui/`.

---

### 1. `TextInput.jsx`
- Controlled text input
- Props: `label`, `value`, `onChange`, `placeholder`, `disabled`, `error`, `type` (default: "text"), `icon` (optional, rendered left-side)
- Show error message below input if `error` prop is provided
- Support `type="password"` with show/hide toggle button (eye icon from lucide-react)

---

### 2. `Textarea.jsx`
- Controlled textarea
- Props: `label`, `value`, `onChange`, `placeholder`, `rows` (default: 4), `disabled`, `error`
- Auto-grow optional via `autoGrow` prop (uses onInput to adjust height)

---

### 3. `Dropdown.jsx` (Listbox)
- Built with `@headlessui/react` Listbox
- Props: `label`, `options: [{ value, label }]`, `selected`, `onChange`, `disabled`, `placeholder`
- Floating panel with smooth Transition
- Check icon (lucide-react) on selected item
- Fully keyboard accessible

---

### 4. `Combobox.jsx` (Autocomplete)
- Built with `@headlessui/react` Combobox
- Props: `label`, `options: [{ value, label }]`, `selected`, `onChange`, `placeholder`, `disabled`
- Client-side filtering based on typed query
- Show "Tidak ada hasil" when filtered list is empty
- Support `nullable` prop to allow clearing selection

---

### 5. `RadioGroup.jsx`
- Built with `@headlessui/react` RadioGroup
- Props: `label`, `options: [{ value, label, description? }]`, `selected`, `onChange`
- Each option renders as selectable card
- Active and checked visual states clearly distinct

---

### 6. `Checkbox.jsx`
- Native HTML checkbox
- Props: `label`, `checked`, `onChange`, `disabled`, `description`, `indeterminate`
- Support `indeterminate` visual state via ref
- Proper `htmlFor` and `id` for accessibility

---

### 7. `Toggle.jsx` (Switch)
- Built with `@headlessui/react` Switch
- Props: `label`, `checked`, `onChange`, `disabled`, `description`
- Smooth transition animation on toggle
- Show label and optional description beside the switch

---

### 8. `Modal.jsx`
- Built with `@headlessui/react` Dialog
- Props: `isOpen`, `onClose`, `title`, `children`, `size` (sm | md | lg | xl | full), `closeOnOverlay` (default: true)
- Overlay backdrop with fade transition
- Panel slide-in transition
- Close button (X icon) in top-right corner
- Footer slot via `footer` prop (accepts JSX)

---

### 9. `DatePicker.jsx`
- Custom date picker (no external date library dependency)
- Props: `label`, `value` (ISO date string), `onChange`, `disabled`, `error`, `placeholder`, `minDate`, `maxDate`
- Show calendar popup on input click
- Navigate months with prev/next arrows
- Highlight today's date
- Disable dates outside minDate/maxDate range
- Format display as `DD/MM/YYYY` (locale-friendly)
- Close on outside click

---

### 10. `Badge.jsx`
- Simple status/label badge
- Props: `children`, `color` (gray | red | yellow | green | blue | indigo | purple | pink), `size` (sm | md), `dot` (boolean — show dot indicator), `rounded` (full | md)

---

### 11. `Alert.jsx`
- Notification/alert banner
- Props: `type` (info | success | warning | error), `title`, `children`, `dismissible` (boolean), `onDismiss`
- Each type has distinct icon (lucide-react) and color scheme
- Smooth dismiss animation

---

### 12. `Spinner.jsx`
- Loading spinner
- Props: `size` (sm | md | lg), `color` (inherits from Tailwind color class), `label` (sr-only text for accessibility)
- Pure CSS animation via Tailwind `animate-spin`

---

### 13. `Avatar.jsx`
- User avatar display
- Props: `src`, `alt`, `name` (fallback initials if no src), `size` (xs | sm | md | lg | xl), `shape` (circle | square), `status` (online | offline | busy | away — shows dot indicator)

---

### 14. `Tooltip.jsx`
- Hover tooltip
- Props: `children`, `content`, `position` (top | bottom | left | right), `delay` (ms)
- Pure CSS/state approach (no external library)
- Accessible: uses `role="tooltip"` and `aria-describedby`

---

### 15. `Card.jsx`
- Content container card
- Props: `children`, `title`, `subtitle`, `footer`, `padding` (sm | md | lg), `shadow` (sm | md | lg | none), `border` (boolean), `hoverable` (boolean — adds hover shadow)

---

### 16. `Table.jsx`
- Reusable data table
- Props: `columns: [{ key, label, render? }]`, `data: []`, `loading`, `emptyText`, `striped`, `hoverable`
- `render` in column allows custom cell rendering: `render: (value, row) => JSX`
- Show Spinner when `loading` is true
- Show empty state illustration/text when data is empty

---

### 17. `Pagination.jsx`
- Props: `currentPage`, `totalPages`, `onPageChange`, `siblingCount` (default: 1), `showFirstLast` (boolean)
- Show ellipsis (...) for skipped page ranges
- Disable prev on first page, next on last page

---

### 18. `Tabs.jsx`
- Built with `@headlessui/react` Tab
- Props: `tabs: [{ label, content, icon?, disabled? }]`, `variant` (underline | pills | boxed)
- Animate active tab indicator

---

### 19. `Breadcrumb.jsx`
- Props: `items: [{ label, href?, onClick? }]`, `separator` (default: "/")
- Last item is non-clickable (current page)
- Support custom separator (string or JSX)

---

### 20. `EmptyState.jsx`
- Empty data placeholder
- Props: `title`, `description`, `icon` (JSX), `action` (JSX — e.g. a button), `compact` (boolean)

---

## Global Style Rules (apply consistently to ALL components)
- Tailwind utility classes only — no custom CSS files, no inline style objects
- Primary accent: `indigo` (`focus:ring-indigo-500`, `bg-indigo-600`, `text-indigo-600`)
- Border: `border border-gray-300 rounded-md`
- Focus: `focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`
- Disabled: `opacity-50 cursor-not-allowed`
- Error border: `border-red-500`, error text: `text-red-500 text-sm mt-1`
- Label: `block text-sm font-medium text-gray-700 mb-1`
- Transitions: use `@headlessui/react` Transition for all show/hide states
- Dark mode: add `dark:` variants where appropriate

---

## File Structure Rules
- One file per component, named exactly as listed above
- Each file is fully self-contained (imports its own dependencies)
- JSDoc comment at top of each file:
  /**
   * ComponentName
   * Brief description of what this component does and its main props.
   */
- Named export AND default export for every component

---

## After all components are generated, create:

### `src/components/ui/index.js`
Barrel file re-exporting all components:
```js
export { default as TextInput } from './TextInput';
export { default as Textarea } from './Textarea';
export { default as Dropdown } from './Dropdown';
export { default as Combobox } from './Combobox';
export { default as RadioGroup } from './RadioGroup';
export { default as Checkbox } from './Checkbox';
export { default as Toggle } from './Toggle';
export { default as Modal } from './Modal';
export { default as DatePicker } from './DatePicker';
export { default as Badge } from './Badge';
export { default as Alert } from './Alert';
export { default as Spinner } from './Spinner';
export { default as Avatar } from './Avatar';
export { default as Tooltip } from './Tooltip';
export { default as Card } from './Card';
export { default as Table } from './Table';
export { default as Pagination } from './Pagination';
export { default as Tabs } from './Tabs';
export { default as Breadcrumb } from './Breadcrumb';
export { default as EmptyState } from './EmptyState';
```

### `src/components/ui/README.md`
Generate a quick-reference usage doc with:
- Component name
- Available props (name, type, default, description) in a markdown table
- One minimal usage example per component

---

## Execution Order
1. Run pre-check → report results
2. Generate components in the order listed (1–20)
3. Generate index.js
4. Generate README.md
5. Summarize: list all files created, any missing dependency warnings
