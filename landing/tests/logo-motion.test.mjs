import assert from "node:assert/strict";
import { getEventListeners } from "node:events";
import { test } from "node:test";
import { attachLogoMotion, createLogoMotion, LOGO_INNER_PATH } from "../src/helpers/logo-motion.ts";

function createHarness(t, { reducedMotion = false } = {}) {
  const frames = new Map();
  const cleanups = [];
  const media = Object.assign(new EventTarget(), { matches: reducedMotion });
  const document = Object.assign(new EventTarget(), { hidden: false });
  let now = 0;
  let frameId = 0;

  const globals = {
    document,
    window: { matchMedia: () => media },
    IntersectionObserver: class {
      constructor(callback, options) {
        this.callback = callback;
        this.options = options;
      }
      observe(svg) {
        this.svg = svg;
        svg.intersectionOptions = this.options;
        svg.intersect = (isIntersecting) => this.callback([{ target: svg, isIntersecting }]);
        svg.intersect(svg.inViewport);
      }
      disconnect() {
        delete this.svg.intersect;
      }
    },
    requestAnimationFrame: (callback) => {
      frames.set(++frameId, callback);
      return frameId;
    },
    cancelAnimationFrame: (id) => frames.delete(id),
  };
  const originalDescriptors = Object.entries(globals).map(([key, value]) => {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
    return [key, descriptor];
  });
  t.after(() => {
    try {
      for (const cleanup of cleanups) cleanup();
    } finally {
      for (const [key, descriptor] of originalDescriptors) {
        if (descriptor) Object.defineProperty(globalThis, key, descriptor);
        else delete globalThis[key];
      }
    }
  });

  function emit(target, type, properties = {}) {
    target.dispatchEvent(Object.assign(new Event(type), properties));
  }

  return {
    pending: () => frames.size,
    advance(milliseconds) {
      for (let remaining = milliseconds; remaining > 0; remaining -= 50) {
        now += Math.min(remaining, 50);
        const callbacks = [...frames.values()];
        frames.clear();
        for (const callback of callbacks) callback(now);
      }
    },
    setReducedMotion(matches) {
      media.matches = matches;
      emit(media, "change");
    },
    setHidden(hidden) {
      document.hidden = hidden;
      emit(document, "visibilitychange");
    },
    logo({
      wrapped = true,
      visible = true,
      hasInner = true,
      controlled = false,
      loop = false,
      playOnView = false,
      viewportMargin = "0px",
      inViewport = true,
    } = {}) {
      const attributes = new Map([
        ["d", LOGO_INNER_PATH],
        ["stroke-width", "0"],
      ]);
      const inner = { setAttribute: (key, value) => attributes.set(key, value) };
      const svg = Object.assign(new EventTarget(), {
        querySelector: () => (hasInner ? inner : null),
        closest: () => (wrapped ? parent : null),
        getClientRects: () => (visible ? [{}] : []),
        inViewport,
      });
      const parent = new EventTarget();
      const trigger = wrapped ? parent : svg;
      const controller =
        controlled || loop || playOnView ? createLogoMotion(svg, { loop, playOnView, viewportMargin }) : null;
      const cleanup = controller ? controller.destroy : attachLogoMotion(svg);
      cleanups.push(cleanup);
      return {
        cleanup,
        playOnce: controller?.playOnce,
        setInView: (value) => svg.intersect?.(value),
        viewportMargin: () => svg.intersectionOptions?.rootMargin,
        path: () => attributes.get("d"),
        stroke: () => attributes.get("stroke-width"),
        listenerCount: () =>
          getEventListeners(document, "visibilitychange").length +
          getEventListeners(media, "change").length +
          ["pointerenter", "pointerleave", "focus", "blur"].reduce(
            (count, type) => count + getEventListeners(trigger, type).length,
            0,
          ),
        enter: (pointerType = "mouse") => emit(trigger, "pointerenter", { pointerType }),
        leave: () => emit(trigger, "pointerleave"),
        focus: () => emit(trigger, "focus"),
        blur: () => emit(trigger, "blur"),
      };
    },
  };
}

test("mounting and touch stay idle; repeated hover starts only one loop", (t) => {
  const clock = createHarness(t);
  const logo = clock.logo();
  assert.equal(clock.pending(), 0);
  assert.equal(logo.path(), LOGO_INNER_PATH);
  logo.enter("touch");
  clock.advance(500);
  assert.equal(clock.pending(), 0);
  assert.equal(logo.path(), LOGO_INNER_PATH);

  logo.enter();
  logo.enter();
  assert.equal(clock.pending(), 1);
  clock.advance(500);
  assert.notEqual(logo.path(), LOGO_INNER_PATH);
});

test("leaving finishes the turn at the exact resting shape and stops scheduling frames", (t) => {
  const clock = createHarness(t);
  const logo = clock.logo();
  logo.enter();
  clock.advance(500);
  const movingPath = logo.path();
  logo.leave();
  assert.equal(logo.path(), movingPath, "leaving must not snap to rest");
  assert.equal(clock.pending(), 1);
  clock.advance(2500);
  assert.equal(logo.path(), LOGO_INNER_PATH);
  assert.equal(logo.stroke(), "0");
  assert.equal(clock.pending(), 0);

  logo.enter();
  clock.advance(500);
  assert.notEqual(logo.path(), LOGO_INNER_PATH, "a later hover can start another turn");
});

test("keyboard focus keeps rotation running independently of hover, then blur finishes it", (t) => {
  const clock = createHarness(t);
  const logo = clock.logo();
  logo.focus();
  clock.advance(500);
  assert.notEqual(logo.path(), LOGO_INNER_PATH);
  logo.enter();
  logo.leave();
  clock.advance(2500);
  assert.equal(clock.pending(), 1, "focus keeps the logo active after pointer leave");
  logo.blur();
  clock.advance(2500);
  assert.equal(clock.pending(), 0);
  assert.equal(logo.path(), LOGO_INNER_PATH);
});

test("reduced motion suppresses, cancels, and re-enables an active interaction", (t) => {
  const clock = createHarness(t, { reducedMotion: true });
  const logo = clock.logo();
  logo.enter();
  clock.advance(500);
  assert.equal(clock.pending(), 0);
  assert.equal(logo.path(), LOGO_INNER_PATH);

  clock.setReducedMotion(false);
  clock.advance(500);
  assert.notEqual(logo.path(), LOGO_INNER_PATH);
  clock.setReducedMotion(true);
  assert.equal(clock.pending(), 0);
  assert.equal(logo.path(), LOGO_INNER_PATH);
  assert.equal(logo.stroke(), "0");
  clock.setReducedMotion(false);
  assert.equal(clock.pending(), 1, "hover is still active when the preference is restored");
});

test("multiple logo instances animate and stop independently", (t) => {
  const clock = createHarness(t);
  const first = clock.logo();
  const second = clock.logo();
  first.enter();
  clock.advance(500);
  assert.notEqual(first.path(), LOGO_INNER_PATH);
  assert.equal(second.path(), LOGO_INNER_PATH);

  second.focus();
  assert.equal(clock.pending(), 2);
  first.leave();
  clock.advance(2500);
  assert.equal(first.path(), LOGO_INNER_PATH);
  assert.equal(clock.pending(), 1, "the focused instance continues after its sibling stops");
  second.cleanup();
  assert.equal(clock.pending(), 0);
});

test("cleanup cancels pending motion and removes all interaction and preference handlers", (t) => {
  const clock = createHarness(t);
  const logo = clock.logo();
  logo.enter();
  clock.advance(500);
  assert.ok(logo.listenerCount() > 0);
  logo.cleanup();
  assert.equal(logo.listenerCount(), 0);
  assert.equal(clock.pending(), 0);
  assert.equal(logo.path(), LOGO_INNER_PATH);
  assert.equal(logo.stroke(), "0");

  logo.enter();
  logo.focus();
  clock.setReducedMotion(true);
  clock.setReducedMotion(false);
  clock.setHidden(true);
  clock.setHidden(false);
  clock.advance(2500);
  assert.equal(clock.pending(), 0);
  assert.equal(logo.path(), LOGO_INNER_PATH);
});

test("hiding the document resets motion and only retained keyboard focus resumes it", (t) => {
  const clock = createHarness(t);
  const logo = clock.logo();
  logo.enter();
  clock.advance(500);
  clock.setHidden(true);
  assert.equal(clock.pending(), 0);
  assert.equal(logo.path(), LOGO_INNER_PATH);
  clock.setHidden(false);
  assert.equal(clock.pending(), 0, "stale hover must not resume after returning to the tab");

  logo.focus();
  clock.advance(500);
  clock.setHidden(true);
  assert.equal(clock.pending(), 0);
  logo.enter();
  assert.equal(clock.pending(), 0, "interactions in a hidden document cannot schedule frames");
  clock.setHidden(false);
  assert.equal(clock.pending(), 1, "retained focus resumes when the document is visible");
});

test("unwrapped SVG supports hover while hidden or incomplete artwork remains idle", (t) => {
  const clock = createHarness(t);
  const hidden = clock.logo({ visible: false });
  hidden.enter();
  hidden.focus();
  const incomplete = clock.logo({ hasInner: false });
  incomplete.enter();
  incomplete.focus();
  assert.equal(clock.pending(), 0);

  const standalone = clock.logo({ wrapped: false });
  standalone.enter();
  clock.advance(500);
  assert.notEqual(standalone.path(), LOGO_INNER_PATH);
  standalone.leave();
  clock.advance(2500);
  assert.equal(clock.pending(), 0);
  assert.equal(standalone.path(), LOGO_INNER_PATH);
});

test("an automatic request plays one full turn, stops, and can be requested again", (t) => {
  const clock = createHarness(t);
  const logo = clock.logo({ controlled: true });
  assert.equal(clock.pending(), 0);

  logo.playOnce();
  assert.equal(clock.pending(), 1);
  clock.advance(500);
  assert.notEqual(logo.path(), LOGO_INNER_PATH);
  clock.advance(2000);
  assert.equal(clock.pending(), 0);
  assert.equal(logo.path(), LOGO_INNER_PATH);
  assert.equal(logo.stroke(), "0");

  logo.playOnce();
  clock.advance(500);
  assert.notEqual(logo.path(), LOGO_INNER_PATH, "a later page change can replay the logo");
  clock.advance(2000);
  assert.equal(clock.pending(), 0);
  assert.equal(logo.path(), LOGO_INNER_PATH);
});

test("requests during rotation coalesce into one additional turn without snapping", (t) => {
  const clock = createHarness(t);
  const logo = clock.logo({ controlled: true });
  logo.playOnce();
  clock.advance(500);
  const movingPath = logo.path();

  logo.playOnce();
  logo.playOnce();
  logo.playOnce();
  assert.equal(logo.path(), movingPath, "new requests must not reset an active pose");
  assert.equal(clock.pending(), 1, "requests share a single animation loop");

  clock.advance(2000);
  assert.equal(clock.pending(), 1, "the queued full turn continues after the first completes");
  assert.notEqual(logo.path(), LOGO_INNER_PATH);
  clock.advance(2300);
  assert.equal(clock.pending(), 0, "repeated requests must not accumulate more turns");
  assert.equal(logo.path(), LOGO_INNER_PATH);
});

test("automatic turns hand over to hover and focus without interrupting either interaction", (t) => {
  const clock = createHarness(t);
  const logo = clock.logo({ controlled: true });
  logo.playOnce();
  clock.advance(500);
  logo.enter();
  logo.focus();
  clock.advance(2500);
  assert.equal(clock.pending(), 1, "interaction keeps the logo active after the automatic turn");

  logo.leave();
  clock.advance(2500);
  assert.equal(clock.pending(), 1, "keyboard focus remains active after pointer leave");
  logo.blur();
  clock.advance(2500);
  assert.equal(clock.pending(), 0);
  assert.equal(logo.path(), LOGO_INNER_PATH);
});

test("reduced motion and display:none skip automatic requests without replaying them later", (t) => {
  const clock = createHarness(t, { reducedMotion: true });
  const logo = clock.logo({ controlled: true });
  logo.playOnce();
  clock.advance(500);
  assert.equal(clock.pending(), 0);
  assert.equal(logo.path(), LOGO_INNER_PATH);
  clock.setReducedMotion(false);
  assert.equal(clock.pending(), 0, "suppressed requests must not replay on a preference change");

  const hidden = clock.logo({ controlled: true, visible: false });
  hidden.playOnce();
  clock.setHidden(true);
  clock.setHidden(false);
  clock.advance(2500);
  assert.equal(clock.pending(), 0);
  assert.equal(hidden.path(), LOGO_INNER_PATH);

  const incomplete = clock.logo({ controlled: true, hasInner: false });
  incomplete.playOnce();
  assert.equal(clock.pending(), 0);
});

test("a request made in a hidden document waits until visible without scheduling frames", (t) => {
  const clock = createHarness(t);
  const logo = clock.logo({ controlled: true });
  clock.setHidden(true);
  logo.playOnce();
  logo.playOnce();
  clock.advance(2500);
  assert.equal(clock.pending(), 0);
  assert.equal(logo.path(), LOGO_INNER_PATH);

  clock.setHidden(false);
  assert.equal(clock.pending(), 1);
  clock.advance(500);
  assert.notEqual(logo.path(), LOGO_INNER_PATH);
  clock.advance(2000);
  assert.equal(clock.pending(), 0, "deferred requests coalesce into one visible turn");
  assert.equal(logo.path(), LOGO_INNER_PATH);
});

test("hiding a running automatic turn cancels it and clears queued replays", (t) => {
  const clock = createHarness(t);
  const logo = clock.logo({ controlled: true });
  logo.playOnce();
  clock.advance(500);
  logo.playOnce();
  clock.setHidden(true);
  assert.equal(clock.pending(), 0);
  assert.equal(logo.path(), LOGO_INNER_PATH);
  clock.setHidden(false);
  clock.advance(5000);
  assert.equal(clock.pending(), 0);
  assert.equal(logo.path(), LOGO_INNER_PATH);
});

test("destroying a controller cancels motion and prevents future automatic requests", (t) => {
  const clock = createHarness(t);
  const logo = clock.logo({ controlled: true });
  logo.playOnce();
  clock.advance(500);
  logo.playOnce();
  logo.cleanup();
  assert.equal(logo.listenerCount(), 0);
  assert.equal(clock.pending(), 0);
  assert.equal(logo.path(), LOGO_INNER_PATH);

  logo.playOnce();
  logo.enter();
  logo.focus();
  clock.setHidden(true);
  clock.setHidden(false);
  clock.advance(5000);
  assert.equal(clock.pending(), 0);
  assert.equal(logo.path(), LOGO_INNER_PATH);
});

test("loop mode starts automatically and keeps rotating without hover or focus", (t) => {
  const clock = createHarness(t);
  const logo = clock.logo({ loop: true, wrapped: false });
  assert.equal(clock.pending(), 1);
  clock.advance(5000);
  assert.equal(clock.pending(), 1);
  assert.notEqual(logo.path(), LOGO_INNER_PATH);
  logo.leave();
  logo.blur();
  clock.advance(2500);
  assert.equal(clock.pending(), 1);
  logo.cleanup();
  assert.equal(clock.pending(), 0);
  assert.equal(logo.listenerCount(), 0);
  logo.setInView(true);
  assert.equal(clock.pending(), 0);
});

test("loop mode pauses offscreen and in hidden tabs, then resumes when visible", (t) => {
  const clock = createHarness(t);
  const logo = clock.logo({ loop: true, inViewport: false });
  assert.equal(clock.pending(), 0);
  logo.setInView(true);
  clock.advance(500);
  assert.notEqual(logo.path(), LOGO_INNER_PATH);
  logo.setInView(false);
  assert.equal(clock.pending(), 0);
  assert.equal(logo.path(), LOGO_INNER_PATH);
  clock.setHidden(true);
  logo.setInView(true);
  assert.equal(clock.pending(), 0);
  clock.setHidden(false);
  assert.equal(clock.pending(), 1);
  clock.advance(500);
  clock.setHidden(true);
  assert.equal(clock.pending(), 0);
  assert.equal(logo.path(), LOGO_INNER_PATH);
  clock.setHidden(false);
  assert.equal(clock.pending(), 1);
});

test("loop mode honors reduced motion and resumes only while onscreen", (t) => {
  const clock = createHarness(t, { reducedMotion: true });
  const logo = clock.logo({ loop: true });
  assert.equal(clock.pending(), 0);
  clock.setReducedMotion(false);
  clock.advance(500);
  assert.notEqual(logo.path(), LOGO_INNER_PATH);
  clock.setReducedMotion(true);
  assert.equal(clock.pending(), 0);
  assert.equal(logo.path(), LOGO_INNER_PATH);
  logo.setInView(false);
  clock.setReducedMotion(false);
  assert.equal(clock.pending(), 0);
  logo.setInView(true);
  assert.equal(clock.pending(), 1);
});

test("viewport mode plays a single turn per entry with the configured margin", (t) => {
  const clock = createHarness(t);
  const logo = clock.logo({ playOnView: true, viewportMargin: "-40px 0px", inViewport: false });
  assert.equal(logo.viewportMargin(), "-40px 0px");
  assert.equal(clock.pending(), 0);
  logo.setInView(true);
  clock.advance(500);
  assert.notEqual(logo.path(), LOGO_INNER_PATH);
  clock.advance(2500);
  assert.equal(clock.pending(), 0);
  assert.equal(logo.path(), LOGO_INNER_PATH);

  logo.setInView(true);
  logo.enter();
  logo.focus();
  clock.advance(2500);
  assert.equal(clock.pending(), 0, "staying in view or clicking must not repeat the turn");

  logo.setInView(false);
  logo.setInView(true);
  clock.advance(500);
  assert.notEqual(logo.path(), LOGO_INNER_PATH, "a new entry starts one new turn");
  clock.advance(2500);
  assert.equal(clock.pending(), 0);
});

test("viewport mode respects reduced motion and stops when the logo leaves the viewport", (t) => {
  const clock = createHarness(t, { reducedMotion: true });
  const logo = clock.logo({ playOnView: true });
  clock.advance(500);
  assert.equal(clock.pending(), 0);
  clock.setReducedMotion(false);
  assert.equal(clock.pending(), 0);
  logo.setInView(false);
  logo.setInView(true);
  clock.advance(500);
  assert.notEqual(logo.path(), LOGO_INNER_PATH);
  logo.setInView(false);
  assert.equal(clock.pending(), 0);
  assert.equal(logo.path(), LOGO_INNER_PATH);
  logo.cleanup();
  logo.setInView(true);
  assert.equal(clock.pending(), 0);
});
