# Animated Shader Hero - Integration Package

This package contains a Vite-ready animated shader hero component with WebGL2 background effects and interactive animations.

## Files Created

- `components/animated-shader-hero.integration.tsx` - Main component (Vite-compatible, no styled-jsx)
- `components/animated-shader-hero.integration.css` - Required CSS animations
- `demo/HeroDemo.tsx` - Demo component showing usage
- `README.md` - This integration guide

## Integration Steps

### 1. Install Required Dependencies

The component requires these dependencies (check if already installed):

```bash
npm install react react-dom
npm install -D @types/react @types/react-dom typescript
```

### 2. Add CSS to Your Project

Import the CSS file in your main CSS or component:

```tsx
// In your main CSS file or component
import './src/integration/hiredai-shader/components/animated-shader-hero.integration.css';
```

### 3. Use the Component

```tsx
import Hero from './src/integration/hiredai-shader/components/animated-shader-hero.integration';

function App() {
  return (
    <Hero
      trustBadge={{
        text: "Trusted by forward-thinking teams.",
        icons: ["✨"]
      }}
      headline={{
        line1: "Launch Your",
        line2: "Workflow Into Orbit"
      }}
      subtitle="Supercharge productivity with AI-powered automation..."
      buttons={{
        primary: {
          text: "Get Started for Free",
          onClick: () => console.log('Primary clicked')
        },
        secondary: {
          text: "Explore Features",
          onClick: () => console.log('Secondary clicked')
        }
      }}
    />
  );
}
```

## Component Props

### HeroProps Interface

```tsx
interface HeroProps {
  trustBadge?: {
    text: string;
    icons?: string[];
  };
  headline: {
    line1: string;
    line2: string;
  };
  subtitle: string;
  buttons?: {
    primary?: {
      text: string;
      onClick?: () => void;
    };
    secondary?: {
      text: string;
      onClick?: () => void;
    };
  };
  className?: string;
}
```

## Features

- **WebGL2 Shader Background**: Complex noise patterns and cloud effects
- **Interactive Touch/Mouse**: Responds to pointer movements and multi-touch
- **Animated Content**: Staggered fade-in animations for all elements
- **Responsive Design**: Works on all screen sizes
- **TypeScript Support**: Full type safety
- **Vite Compatible**: No styled-jsx, uses standard CSS classes

## Testing

To test the component:

1. Import and use `HeroDemo` component
2. Make sure to include the CSS file
3. The component will render with a demo configuration

## Production Integration

To move to production paths:

1. Reply with: "OK to apply to /src/components/ui"
2. Component will be moved to `/src/components/ui/animated-shader-hero.tsx`
3. CSS will be integrated into your main stylesheet
4. Demo will be available at a production route

## Browser Support

- Modern browsers with WebGL2 support
- Mobile devices with touch support
- Graceful degradation for older browsers
