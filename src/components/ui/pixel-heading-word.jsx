import { useCallback, useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

const PIXEL_FONT_MAP = {
  square: "font-pixel-square",
  grid: "font-pixel-grid",
  circle: "font-pixel-circle",
  triangle: "font-pixel-triangle",
  line: "font-pixel-line",
}

const PIXEL_FONTS = Object.values(PIXEL_FONT_MAP)
const PIXEL_FONT_KEYS = Object.keys(PIXEL_FONT_MAP)

/**
 * Interactive heading that swaps or cycles through pixel font styles on hover.
 *
 * **Swap mode** — set `initialFont` and `hoverFont` to swap between two
 * specific fonts on hover:
 *
 * @example
 * <PixelHeading initialFont="square" hoverFont="circle" className="text-6xl">
 *   Swap on hover
 * </PixelHeading>
 *
 * **Cycle mode** — omit `hoverFont` to cycle through every pixel font on
 * hover (the original behavior):
 *
 * @example
 * <PixelHeading
 *   as="h2"
 *   cycleInterval={200}
 *   onFontIndexChange={(i) => console.log(i)}
 * >
 *   Cycle on hover
 * </PixelHeading>
 */
export function PixelHeading({
  children,
  as: Tag = "h1",
  className,
  initialFont,
  hoverFont,
  cycleInterval = 300,
  defaultFontIndex = 0,
  onFontIndexChange,
  showLabel = false,
  disableHover = false,
  disableCycling = false,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onKeyDown,
  ...props
}) {
  /* ------------------------------------------------------------------ */
  /* Resolve the starting index from `initialFont` or `defaultFontIndex` */
  /* ------------------------------------------------------------------ */
  const resolvedDefaultIndex = initialFont
    ? PIXEL_FONT_KEYS.indexOf(initialFont)
    : defaultFontIndex

  const hoverIndex = hoverFont ? PIXEL_FONT_KEYS.indexOf(hoverFont) : null
  const isSwapMode = hoverIndex !== null

  const [fontIndex, setFontIndex] = useState(resolvedDefaultIndex)
  const [isActive, setIsActive] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  /* ---- Cycling helpers (cycle mode only) ---- */
  const advanceFont = useCallback(() => {
    setFontIndex((prev) => {
      const next = (prev + 1) % PIXEL_FONTS.length
      onFontIndexChange?.(next)
      return next
    })
  }, [onFontIndexChange])

  const startCycling = useCallback(() => {
    setIsActive(true)
    intervalRef.current = setInterval(advanceFont, cycleInterval)
  }, [advanceFont, cycleInterval])

  const stopCycling = useCallback(() => {
    setIsActive(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  /* ---- Swap helpers ---- */
  const swapToHover = useCallback(() => {
    if (hoverIndex === null) return
    setIsActive(true)
    setFontIndex(hoverIndex)
    onFontIndexChange?.(hoverIndex)
  }, [hoverIndex, onFontIndexChange])

  const swapToInitial = useCallback(() => {
    setIsActive(false)
    setFontIndex(resolvedDefaultIndex)
    onFontIndexChange?.(resolvedDefaultIndex)
  }, [resolvedDefaultIndex, onFontIndexChange])

  /* ---- Event handlers ---- */
  const handleMouseEnter = useCallback(
    (e) => {
      if (!disableHover) {
        if (isSwapMode) {
          swapToHover()
        } else if (!disableCycling) {
          startCycling()
        }
      }
      onMouseEnter?.(e)
    },
    [
      disableHover,
      disableCycling,
      isSwapMode,
      swapToHover,
      startCycling,
      onMouseEnter,
    ]
  )

  const handleMouseLeave = useCallback(
    (e) => {
      if (!disableHover) {
        isSwapMode ? swapToInitial() : stopCycling()
      }
      onMouseLeave?.(e)
    },
    [disableHover, isSwapMode, swapToInitial, stopCycling, onMouseLeave]
  )

  const handleFocus = useCallback(
    (e) => {
      if (!disableHover) {
        isSwapMode ? swapToHover() : setIsActive(true)
      }
      onFocus?.(e)
    },
    [disableHover, isSwapMode, swapToHover, onFocus]
  )

  const handleBlur = useCallback(
    (e) => {
      if (!disableHover) {
        isSwapMode ? swapToInitial() : setIsActive(false)
      }
      onBlur?.(e)
    },
    [disableHover, isSwapMode, swapToInitial, onBlur]
  )

  const handleKeyDown = useCallback(
    (e) => {
      if (!disableHover && !disableCycling) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          if (!isSwapMode) advanceFont()
        }
      }
      onKeyDown?.(e)
    },
    [disableHover, disableCycling, isSwapMode, advanceFont, onKeyDown]
  )

  const currentFontLabel = PIXEL_FONT_KEYS[fontIndex]

  return (
    <div
      data-slot="pixel-heading"
      className="inline-flex flex-col items-start gap-2"
    >
      <Tag
        data-state={isActive ? "active" : "idle"}
        data-font={currentFontLabel}
        tabIndex={0}
        className={cn(
          "cursor-default transition-all duration-150 select-none",
          "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
          PIXEL_FONTS[fontIndex],
          className
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </Tag>
      {showLabel && (
        <output
          data-slot="pixel-heading-label"
          aria-live="polite"
          className={cn(
            "text-muted-foreground text-xs tracking-widest uppercase transition-opacity duration-200",
            isActive ? "opacity-100" : "opacity-0"
          )}
        >
          {currentFontLabel}
        </output>
      )}
    </div>
  )
}
