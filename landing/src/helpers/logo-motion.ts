// Geometry and glow come from assets/icons/logo-shine.svg (the source of Frame 22.png).
export const LOGO_VIEW_BOX = "0 0 79.181 71.492";
export const LOGO_OUTER_PATH =
  "M39.564 58.704c14.356 0 26.83-10.645 26.83-22.958S53.919 12.788 39.564 12.788c-14.356 0-26.776 10.645-26.776 22.958s12.42 22.958 26.776 22.958m0-1.935c-12.797 0-22.636-9.14-22.636-21.023s9.84-21.023 22.636-21.023 22.69 9.14 22.69 21.023-9.894 21.023-22.69 21.023";
export const LOGO_INNER_PATH =
  "M39.564 50.747c15.108 0 26.776-6.56 26.776-15.001s-11.668-15-26.776-15c-15.055 0-26.722 6.559-26.722 15s11.667 15 26.722 15m0-1.882c-11.829 0-20.97-5.7-20.97-13.12s9.141-13.118 20.97-13.118c11.882 0 21.023 5.7 21.023 13.119 0 7.42-9.14 13.119-21.023 13.119";
export const LOGO_GLOW_OPACITY = 0.85;
export const LOGO_GLOW_LAYERS = [
  [0.426, 1],
  [0.426, 1],
  [4.263, 0.5],
  [0.426, 0.7],
  [1.279, 0.3],
  [3.41, 1],
  [6.394, 1],
] as const;
export const LOGO_GLOW_BLURS: readonly number[] = [...new Set(LOGO_GLOW_LAYERS.map(([blur]) => blur))];

const CENTER_Y = 35.746;
const TURN_DURATION = 2200;
const TAU = Math.PI * 2;

// Absolute cubic coordinates preserve the asymmetric contours of the original.
const INNER_CONTOURS = [
  [
    [39.564, 50.747],
    [54.672, 50.747, 66.34, 44.187, 66.34, 35.746],
    [66.34, 27.305, 54.672, 20.746, 39.564, 20.746],
    [24.509, 20.746, 12.842, 27.305, 12.842, 35.746],
    [12.842, 44.187, 24.509, 50.746, 39.564, 50.746],
  ],
  [
    [39.564, 48.865],
    [27.735, 48.865, 18.594, 43.165, 18.594, 35.745],
    [18.594, 28.325, 27.735, 22.627, 39.564, 22.627],
    [51.446, 22.627, 60.587, 28.327, 60.587, 35.746],
    [60.587, 43.166, 51.447, 48.865, 39.564, 48.865],
  ],
];

// Prepare fixed X strings and Y offsets once; only the projected Y values change per frame.
const INNER_PATH_POINTS = INNER_CONTOURS.map((contour) =>
  contour.flatMap((coordinates, segment) =>
    Array.from({ length: coordinates.length / 2 }, (_, point) => {
      const command = point === 0 ? (segment === 0 ? "M" : "C") : " ";
      return [`${command}${coordinates[point * 2].toFixed(4)} `, coordinates[point * 2 + 1] - CENTER_Y] as const;
    }),
  ),
);

export function getInnerLogoPath(rotation: number) {
  if (rotation === 0) return LOGO_INNER_PATH;

  // Rotate the original oval on its horizontal hinge without expanding its height.
  const projection = Math.cos(rotation);
  let path = "";
  for (const contour of INNER_PATH_POINTS) {
    for (const [prefix, yOffset] of contour) {
      path += prefix + (CENTER_Y + yOffset * projection).toFixed(4);
    }
    path += "Z";
  }
  return path;
}

export function getInnerLogoStroke(rotation: number) {
  // Retain a luminous edge when the ring is viewed edge-on; no extra stroke at rest.
  return 0.6 * Math.sin(rotation) ** 2;
}

export type LogoMotionController = {
  playOnce: () => void;
  destroy: () => void;
};

export function createLogoMotion(svg: SVGSVGElement): LogoMotionController {
  const inner = svg.querySelector<SVGPathElement>("[data-logo-inner]");
  const trigger = svg.closest("a, button") ?? svg;
  if (!inner) return { playOnce() {}, destroy() {} };

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let frame = 0;
  let previousTime = 0;
  let elapsed = 0;
  let hovered = false;
  let focused = false;
  let playRequested = false;
  let destroyed = false;

  const reset = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
    elapsed = 0;
    playRequested = false;
    inner.setAttribute("d", LOGO_INNER_PATH);
    inner.setAttribute("stroke-width", "0");
  };

  const tick = (time: number) => {
    if (previousTime) elapsed += Math.min(time - previousTime, 50);
    previousTime = time;
    const progress = Math.min(elapsed / TURN_DURATION, 1);
    if (progress === 1) {
      // Finish the current turn after leave/blur, so there is no snap or frozen pose.
      const continuePlaying = hovered || focused || playRequested;
      reset();
      if (continuePlaying) start();
      return;
    }

    const eased = progress * progress * (3 - 2 * progress);
    const rotation = eased * TAU;
    inner.setAttribute("d", getInnerLogoPath(rotation));
    inner.setAttribute("stroke-width", getInnerLogoStroke(rotation).toFixed(4));
    frame = requestAnimationFrame(tick);
  };

  const start = () => {
    if (destroyed || frame || reducedMotion.matches || document.hidden || svg.getClientRects().length === 0)
      return false;
    frame = requestAnimationFrame(tick);
    return true;
  };
  const playOnce = () => {
    if (destroyed || reducedMotion.matches || svg.getClientRects().length === 0) return;
    // Coalesce requests during a turn; defer a background-tab request until visible.
    playRequested = !start();
  };
  const pointerEnter = (event: Event) => {
    if ((event as PointerEvent).pointerType === "touch") return;
    hovered = true;
    start();
  };
  const pointerLeave = () => {
    hovered = false;
  };
  const focus = () => {
    focused = true;
    start();
  };
  const blur = () => {
    focused = false;
  };
  const visibilityChange = () => {
    if (document.hidden) {
      hovered = false;
      reset();
    } else if (focused || playRequested) {
      if (start()) playRequested = false;
    }
  };
  const motionChange = () => {
    if (reducedMotion.matches) reset();
    else if (hovered || focused) start();
  };

  trigger.addEventListener("pointerenter", pointerEnter);
  trigger.addEventListener("pointerleave", pointerLeave);
  trigger.addEventListener("focus", focus);
  trigger.addEventListener("blur", blur);
  document.addEventListener("visibilitychange", visibilityChange);
  reducedMotion.addEventListener("change", motionChange);

  const destroy = () => {
    destroyed = true;
    reset();
    trigger.removeEventListener("pointerenter", pointerEnter);
    trigger.removeEventListener("pointerleave", pointerLeave);
    trigger.removeEventListener("focus", focus);
    trigger.removeEventListener("blur", blur);
    document.removeEventListener("visibilitychange", visibilityChange);
    reducedMotion.removeEventListener("change", motionChange);
  };

  return { playOnce, destroy };
}

export function attachLogoMotion(svg: SVGSVGElement) {
  return createLogoMotion(svg).destroy;
}
