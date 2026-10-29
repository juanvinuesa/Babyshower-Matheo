import { forwardRef, useCallback, useRef } from "react";
import { Warp } from "@paper-design/shaders-react";
import { motion, useInView, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

const DEFAULT_WARP = {
  /** Same stops as the main glow in `halo-search.tsx` (90deg linear-gradient). */
  colors: ["#ff0080", "#7928ca", "#00d4ff", "#0070f3"],
  distortion: 0.25,
  height: 720,
  proportion: 0.54,
  scale: 0.2,
  shape: "checks",
  shapeScale: 1,
  softness: 1,
  speed: 1,
  swirl: 0.8,
  swirlIterations: 10,
  width: 1280,
}

/**
 * Circular avatar frame with an animated Warp shader inside.
 * Motion uses transforms only; shader speed pauses off-screen and when `prefers-reduced-motion` is set.
 */
export const AiBlobWarpAvatar = forwardRef(function AiBlobWarpAvatarImpl(
  { className, warpProps, ...props },
  forwardedRef
) {
  const {
    className: warpClassName,
    speed: warpSpeed,
    ...restWarpProps
  } = warpProps ?? {}
  const rootRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const inView = useInView(rootRef, {
    amount: 0.2,
    margin: "0px 0px -10% 0px",
  })
  const live = inView && !reduceMotion

  const setRefs = useCallback(
    (node) => {
      rootRef.current = node
      if (typeof forwardedRef === "function") {
        forwardedRef(node)
      } else if (forwardedRef) {
        forwardedRef.current = node
      }
    },
    [forwardedRef]
  )

  const baseSpeed = warpSpeed ?? DEFAULT_WARP.speed ?? 1

  return (
    <div
      className={cn(
        "relative isolate size-8 overflow-hidden rounded-full border border-border/10 bg-muted",
        className
      )}
      ref={setRefs}
      {...props}
    >
      <motion.div
        animate={
          live
            ? {
                scale: [1, 1.055, 0.99, 1],
                rotate: [0, 2, -1.5, 0],
              }
            : { scale: 1, rotate: 0 }
        }
        aria-hidden
        className="pointer-events-none absolute inset-0 origin-center rounded-full"
        transition={{
          duration: 5.2,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }}
      >
        <Warp
          {...DEFAULT_WARP}
          {...restWarpProps}
          speed={live ? baseSpeed : 0}
        />
      </motion.div>
    </div>
  )
})

AiBlobWarpAvatar.displayName = "AiBlobWarpAvatar"
