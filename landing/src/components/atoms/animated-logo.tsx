"use client";

import {
  createLogoMotion,
  LOGO_GLOW_BLURS,
  LOGO_GLOW_LAYERS,
  LOGO_GLOW_OPACITY,
  LOGO_INNER_PATH,
  LOGO_OUTER_PATH,
  LOGO_VIEW_BOX,
  type LogoMotionController,
} from "@/helpers/logo-motion";
import { cn } from "@/lib/utils";
import { Fragment, useEffect, useId, useRef } from "react";

export type AnimatedLogoProps = {
  className?: string;
  /** Play once on mount and whenever this value changes; omit for hover/focus only. */
  playKey?: string | number;
  /** Continuously rotate while visible, without hover or focus interaction. */
  loop?: boolean;
  /** Play one turn each time the logo enters the viewport. */
  playOnView?: boolean;
  /** IntersectionObserver root margin; negative values inset the viewport. */
  viewportMargin?: string;
};

/** Decorative logo; wrap in a labeled link or button for hover and keyboard activation. */
const AnimatedLogo = ({
  className,
  playKey,
  loop = false,
  playOnView = false,
  viewportMargin = "0px",
}: AnimatedLogoProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const motionRef = useRef<LogoMotionController | null>(null);
  const glowId = `logo-glow-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    if (!svgRef.current) return;
    const motion = createLogoMotion(svgRef.current, { loop, playOnView, viewportMargin });
    motionRef.current = motion;
    return () => {
      motionRef.current = null;
      motion.destroy();
    };
  }, [loop, playOnView, viewportMargin]);

  useEffect(() => {
    if (playKey !== undefined) motionRef.current?.playOnce();
  }, [playKey, loop, playOnView, viewportMargin]);

  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={LOGO_VIEW_BOX}
      width="79.181"
      height="71.492"
      className={cn("block aspect-1452/1311 h-auto w-auto shrink-0", className)}
      aria-hidden="true"
      focusable="false"
      data-animated-logo=""
    >
      <defs>
        <filter
          id={glowId}
          x="0"
          y="0"
          width="79.181"
          height="71.492"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="background" />
          <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          {LOGO_GLOW_BLURS.map((blur) => (
            <feGaussianBlur key={blur} in="hardAlpha" stdDeviation={blur} result={`blur-${blur}`} />
          ))}
          {LOGO_GLOW_LAYERS.map(([blur, opacity], index) => (
            <Fragment key={index}>
              {/* Composite the halo beneath the core to avoid a dark antialiasing fringe. */}
              <feColorMatrix in={`blur-${blur}`} values={`0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 ${opacity} 0`} />
              <feBlend in2={index === 0 ? "background" : `glow${index - 1}`} result={`glow${index}`} />
            </Fragment>
          ))}
          <feComponentTransfer in={`glow${LOGO_GLOW_LAYERS.length - 1}`} result="adjustedGlow">
            <feFuncA type="linear" slope={LOGO_GLOW_OPACITY} />
          </feComponentTransfer>
          <feBlend in="SourceGraphic" in2="adjustedGlow" />
          <feGaussianBlur stdDeviation=".329" />
        </filter>
      </defs>
      <g fill="#fff" filter={`url(#${glowId})`}>
        <path d={LOGO_OUTER_PATH} />
        <path data-logo-inner="" d={LOGO_INNER_PATH} stroke="#fff" strokeWidth="0" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export default AnimatedLogo;
