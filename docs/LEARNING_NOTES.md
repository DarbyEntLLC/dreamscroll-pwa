# Learning Notes

## Things I Learned Building DreamScroll

### React Hooks
- `useEffect` runs after render, great for API calls
- Always include dependencies array to avoid infinite loops
- Custom hooks start with 'use' (convention)

### Tailwind CSS
- `className` not `class` in React
- Responsive: `sm:`, `md:`, `lg:` prefixes
- Dark mode: `dark:` prefix with class strategy

### Common Gotchas
- State updates are asynchronous
- Don't mutate state directly
- Always handle loading and error states