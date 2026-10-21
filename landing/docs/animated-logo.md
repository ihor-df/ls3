# AnimatedLogo

`src/components/atoms/animated-logo.tsx` is the shared animated Linken Sphere mark.
The desktop header, mobile header, and mobile drawer all use this component.

## Usage

```tsx
import AnimatedLogo from "@/components/atoms/animated-logo";
import { Link } from "@/i18n/navigation";

export default function HomeLogo() {
  return (
    <Link href="/" aria-label="Главная">
      <AnimatedLogo className="w-16" />
    </Link>
  );
}
```

Use the existing translated accessible label in localized UI. `AnimatedLogo`
is decorative (`aria-hidden`), so the parent link or button supplies its name.
It automatically uses the nearest parent `<a>` or `<button>` as the interaction
target. Keep that element mounted around the component.

For an action instead of navigation:

```tsx
<button type="button" aria-label="Открыть меню" onClick={openMenu}>
  <AnimatedLogo className="h-12 w-auto" />
</button>
```

The exported `AnimatedLogoProps` type accepts `className?: string` and
`playKey?: string | number`. Set one dimension (`w-16` or `h-12`) and leave the
other automatic to preserve proportions. Avoid clipping the SVG's glow.
Multiple instances can share a page: each has an independent controller and
a unique SVG filter ID. The component can be imported by Server Components;
its own client boundary handles animation, while the initial SVG renders
before JavaScript loads.

Pass `playKey` to play one automatic turn on mount and whenever its value changes.
The component stays independent of routing; the desktop and mobile headers pass
their locale and pathname:

```tsx
<AnimatedLogo className="w-16" playKey={`${locale}:${pathname}`} />
```

This includes initial visits, client navigation, back/forward navigation, and
language changes. The drawer and other usages without `playKey` remain hover/focus
only. A request during rotation queues at most one more complete turn, without
resetting the current pose. Hidden desktop/mobile instances do not autoplay.

## Behavior

- Pointer hover or keyboard focus starts rotation. Touch pointer entry is ignored.
- Header logos also play one turn on initial page load and each page/language change.
- A complete turn takes 2.2 seconds. While hovered or focused, turns repeat.
- Leaving or blurring finishes the current turn and restores the exact original shape.
- The outer ring and side seams stay fixed. The inner oval never exceeds its original height.
- `prefers-reduced-motion: reduce` disables motion. Hiding the browser tab resets it.
- No animation frames run at rest. Unmounting cancels the frame and removes listeners.

The geometry, glow parameters, and controller live in `src/helpers/logo-motion.ts`.
Fixed coordinates are prepared once; matching glow layers reuse the same blur.
`LOGO_GLOW_OPACITY` controls the combined halo opacity (currently `0.85`),
leaving the white contours and blur radii unchanged.

## Verification and preview

```bash
npm run test:logo-motion
node --experimental-strip-types scripts/export-logo-preview.mjs
```

The second command regenerates the self-contained `design/logo-motion-preview.html`
with the production motion controller. Open it in a browser to compare the original
pose with hover animation. Node.js 22.6 or newer is required for these commands.
