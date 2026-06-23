# 🚀 Quick Start Guide - E-Commerce Frontend

## Installation & Setup (2 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# http://localhost:3000
```

## Project Structure Overview

```
Key Folders:
├── src/app/components/     → UI Components (Button, Form, Modal, etc.)
├── src/app/products/       → Product listing & detail pages
├── src/app/cart/          → Shopping cart page
├── src/app/checkout/      → Checkout flow
├── src/redux/             → Redux store (auth, cart)
├── src/services/          → API services
└── tailwind.config.js     → Tailwind configuration
```

## Core Components You'll Use

### Display Components
```tsx
import { Button, Badge, Rating, PriceTag } from "@/app/components";

<Button variant="primary" size="lg">Click Me</Button>
<Badge variant="success">In Stock</Badge>
<Rating rating={4.5} reviews={128} />
<PriceTag original={100} current={80} />
```

### Form Components
```tsx
import { FormInput, FormSelect, FormCheckbox } from "@/app/components";

<FormInput label="Email" type="email" error={errors.email} required />
<FormSelect label="Country" options={[]} />
<FormCheckbox label="Agree to terms" />
```

### Feedback Components
```tsx
import { useToast, ToastContainer, Modal } from "@/app/components";

const { toasts, add, remove } = useToast();
add("Success!", "success");

<ToastContainer toasts={toasts} onRemove={remove} />
<Modal isOpen={isOpen} title="Confirm" onClose={onClose}>
  Content here
</Modal>
```

### State Components
```tsx
import { EmptyState, LoadingState, ErrorState } from "@/app/components";

<EmptyState icon="🛒" title="Empty Cart" action={{...}} />
<LoadingState text="Loading..." />
<ErrorState title="Error" message="Something went wrong" />
```

## Common Tasks

### Add a New Page
```bash
# 1. Create page file
touch src/app/new-page/page.tsx

# 2. Add content
export default function NewPage() {
  return <div>Your content</div>;
}

# 3. Access at http://localhost:3000/new-page
```

### Add a Protected Route
```tsx
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function ProtectedPageWrapper() {
  return (
    <ProtectedRoute>
      <YourComponent />
    </ProtectedRoute>
  );
}
```

### Use Redux State
```tsx
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { setCart } from "@/redux/slices/cartSlice";

const cart = useAppSelector(state => state.cart.items);
const dispatch = useAppDispatch();

dispatch(setCart(newItems));
```

### Show a Toast
```tsx
import { useToast, ToastContainer } from "@/app/components";

function MyComponent() {
  const { toasts, add, remove } = useToast();
  
  return (
    <>
      <ToastContainer toasts={toasts} onRemove={remove} />
      <button onClick={() => add("Success!", "success")}>
        Show Toast
      </button>
    </>
  );
}
```

## Styling

### Use Tailwind Classes
```tsx
<div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
  Content
</div>
```

### Use CSS Variables
```css
:root {
  --primary: #0ea5a4;
  --secondary: #1e293b;
  --accent: #06b6d4;
}
```

### Custom Colors
```tsx
// In tailwind.config.js
colors: {
  primary: '#0ea5a4',
  secondary: '#1e293b',
  success: '#10b981',
  error: '#ef4444',
}
```

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## File Naming Conventions

```
Components:    PascalCase    (Button.tsx, FormInput.tsx)
Pages:         kebab-case    (products.tsx, cart.tsx)
Utilities:     camelCase     (formatPrice.ts)
Styles:        globals.css, [name].css
Types:         PascalCase    (Product.ts, User.ts)
Hooks:         useHookName   (useCart.ts, useAuth.ts)
```

## Responsive Design Tips

### Mobile First
```tsx
// Start with mobile styles, add larger screens
<div className="p-4 sm:p-6 md:p-8 lg:p-12">
  Content
</div>
```

### Breakpoints
- `sm`: 640px (tablets)
- `md`: 768px (small laptops)
- `lg`: 1024px (laptops)
- `xl`: 1280px (desktops)

## Performance Tips

1. **Use React Compiler** - Already enabled in next.config.ts
2. **Lazy Load Images** - Use Next.js Image component
3. **Code Splitting** - Next.js handles automatically
4. **Memoize Components** - Use React.memo for expensive components
5. **Avoid Props Drilling** - Use Redux or Context for global state

## Debugging

### Browser DevTools
```javascript
// Check Redux state
console.log(store.getState());

// Check API responses
Network tab → API calls
```

### VS Code Extensions
Recommended:
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Thunder Client (API testing)

## Deployment

### Vercel (Recommended)
```bash
# 1. Push to GitHub
# 2. Connect to Vercel
# 3. Auto deploys on push
```

### Docker
```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD npm start
```

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
STRIPE_KEY=sk_test_...
```

## Troubleshooting

### Build Errors
```bash
# Clear cache
rm -rf .next
npm run build
```

### Module Not Found
```bash
# Update imports with correct paths
import Button from "@/app/components/Button"  # Correct
import Button from "../components/Button"      # Also works
```

### TypeScript Errors
```bash
# Run type check
npm run lint
# or rebuild
npm run build
```

## Resources

- 📖 [Next.js Docs](https://nextjs.org/docs)
- 🎨 [Tailwind CSS Docs](https://tailwindcss.com/docs)
- 🔧 [Redux Toolkit Docs](https://redux-toolkit.js.org)
- 📝 [Component Docs](./COMPONENT_DOCS.md)
- 📊 [Build Summary](./BUILD_SUMMARY.md)

## Support

For detailed component documentation, see `COMPONENT_DOCS.md`
For build information, see `BUILD_SUMMARY.md`

---

**Happy Coding! 🎉**
