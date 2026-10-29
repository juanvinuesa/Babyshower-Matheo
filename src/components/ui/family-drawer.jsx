import { createContext, useContext, useMemo, useRef, useState } from "react";
import { Slot } from "@radix-ui/react-slot"
import { AnimatePresence, motion } from "motion/react"
import useMeasure from "react-use-measure"
import { Drawer } from "vaul"

import { cn } from "@/lib/utils";

const FamilyDrawerContext = createContext(undefined)

function useFamilyDrawer() {
  const context = useContext(FamilyDrawerContext)
  if (!context) {
    throw new Error(
      "FamilyDrawer components must be used within FamilyDrawerRoot"
    )
  }
  return context
}

function FamilyDrawerRoot({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  defaultView = "default",
  onViewChange,
  views: customViews
}) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const [view, setView] = useState(defaultView)
  const [elementRef, bounds] = useMeasure()
  const previousHeightRef = useRef(0)

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setIsOpen = onOpenChange || setInternalOpen

  const opacityDuration = useMemo(() => {
    const currentHeight = bounds.height
    const previousHeight = previousHeightRef.current

    const MIN_DURATION = 0.15
    const MAX_DURATION = 0.27

    if (!previousHeightRef.current) {
      previousHeightRef.current = currentHeight
      return MIN_DURATION
    }

    const heightDifference = Math.abs(currentHeight - previousHeight)
    previousHeightRef.current = currentHeight

    const duration = Math.min(
      Math.max(heightDifference / 500, MIN_DURATION),
      MAX_DURATION
    )

    return duration
  }, [bounds.height])

  const handleViewChange = (newView) => {
    setView(newView)
    onViewChange?.(newView)
  }

  // Use custom views if provided, otherwise pass undefined
  const views =
    customViews && Object.keys(customViews).length > 0 ? customViews : undefined

  const contextValue = {
    isOpen,
    view,
    setView: handleViewChange,
    opacityDuration,
    elementRef,
    bounds,
    views,
  }

  return (
    <FamilyDrawerContext.Provider value={contextValue}>
      <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
        {children}
      </Drawer.Root>
    </FamilyDrawerContext.Provider>
  )
}

function FamilyDrawerTrigger({
  children,
  asChild = false,
  className
}) {
  if (asChild) {
    return (
      <Drawer.Trigger asChild>
        <Slot>{children}</Slot>
      </Drawer.Trigger>
    )
  }

  return (
    <Drawer.Trigger asChild>
      <button
        className={cn(
          "bg-background text-foreground hover:bg-accent focus-visible:shadow-focus-ring-button fixed top-1/2 left-1/2 h-[44px] -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border px-4 py-2 font-medium antialiased transition-colors md:font-medium",
          className
        )}
        type="button"
      >
        {children}
      </button>
    </Drawer.Trigger>
  )
}

// ============================================================================
// Portal Component
// ============================================================================

function FamilyDrawerPortal({
  children
}) {
  return <Drawer.Portal>{children}</Drawer.Portal>
}

function FamilyDrawerOverlay({
  className,
  onClick
}) {
  const { setView } = useFamilyDrawer()

  return (
    <Drawer.Overlay
      className={cn("fixed inset-0 z-50 bg-black/30", className)}
      onClick={onClick || (() => setView("default"))}
    />
  )
}

function FamilyDrawerContent({
  children,
  className,
  asChild = false
}) {
  const { bounds } = useFamilyDrawer()

  const content = (
    <motion.div
      animate={{
        height: bounds.height,
        transition: {
          duration: 0.27,
          ease: [0.25, 1, 0.5, 1],
        },
      }}
    >
      {children}
    </motion.div>
  )

  if (asChild) {
    return (
      <Drawer.Content
        asChild
        className={cn(
          "bg-background fixed inset-x-4 bottom-4 z-50 mx-auto max-w-[361px] overflow-hidden rounded-[36px] outline-none md:mx-auto md:w-full",
          className
        )}
      >
        <Slot>{content}</Slot>
      </Drawer.Content>
    )
  }

  return (
    <Drawer.Content
      asChild
      className={cn(
        "bg-background fixed inset-x-4 bottom-4 z-50 mx-auto max-w-[361px] overflow-hidden rounded-[36px] outline-none md:mx-auto md:w-full",
        className
      )}
    >
      {content}
    </Drawer.Content>
  )
}

function FamilyDrawerAnimatedWrapper({
  children,
  className
}) {
  const { elementRef } = useFamilyDrawer()

  return (
    <div
      ref={elementRef}
      className={cn("px-6 pt-2.5 pb-6 antialiased", className)}
    >
      {children}
    </div>
  )
}

function FamilyDrawerAnimatedContent({
  children
}) {
  const { view, opacityDuration } = useFamilyDrawer()

  return (
    <AnimatePresence initial={false} mode="popLayout" custom={view}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        key={view}
        transition={{
          duration: opacityDuration,
          ease: [0.26, 0.08, 0.25, 1],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

function FamilyDrawerClose({
  children,
  asChild = false,
  className
}) {
  const defaultClose = (
    <button
      data-vaul-no-drag=""
      className={cn(
        "bg-muted text-muted-foreground focus-visible:shadow-focus-ring-button absolute top-7 right-8 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-transform focus:scale-95 active:scale-75",
        className
      )}
      type="button"
    >
      {children || <CloseIcon />}
    </button>
  )

  if (asChild) {
    return (
      <Drawer.Close asChild>
        <Slot>{defaultClose}</Slot>
      </Drawer.Close>
    )
  }

  return <Drawer.Close asChild>{defaultClose}</Drawer.Close>
}

/**
 * Accessible title for the drawer. Every view must render one (directly or via
 * `FamilyDrawerHeader`) so screen readers can announce the dialog.
 */
function FamilyDrawerTitle({
  className,
  ...props
}) {
  return (
    <Drawer.Title
      data-slot="family-drawer-title"
      className={cn(
        "text-foreground text-[22px] font-semibold md:font-medium",
        className
      )}
      {...props}
    />
  )
}

function FamilyDrawerDescription({
  className,
  ...props
}) {
  return (
    <Drawer.Description
      data-slot="family-drawer-description"
      className={cn(
        "text-muted-foreground text-[17px] leading-[24px] font-medium md:font-normal",
        className
      )}
      {...props}
    />
  )
}

function FamilyDrawerHeader({
  icon,
  title,
  description,
  className
}) {
  return (
    <header className={cn("mt-[21px]", className)}>
      {icon}
      <FamilyDrawerTitle className="mt-2.5">{title}</FamilyDrawerTitle>
      <FamilyDrawerDescription className="mt-3">
        {description}
      </FamilyDrawerDescription>
    </header>
  )
}

function FamilyDrawerButton({
  children,
  onClick,
  className,
  asChild = false
}) {
  const button = (
    <button
      data-vaul-no-drag=""
      className={cn(
        "bg-muted text-foreground focus-visible:shadow-focus-ring-button flex h-12 w-full cursor-pointer items-center gap-[15px] rounded-[16px] px-4 text-[17px] font-semibold transition-transform focus:scale-95 active:scale-95 md:font-medium",
        className
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  )

  if (asChild) {
    return <Slot>{button}</Slot>
  }

  return button
}

function FamilyDrawerSecondaryButton({
  children,
  onClick,
  className,
  asChild = false
}) {
  const button = (
    <button
      data-vaul-no-drag=""
      type="button"
      className={cn(
        "focus-visible:shadow-focus-ring-button flex h-12 w-full cursor-pointer items-center justify-center gap-[15px] rounded-full text-center text-[19px] font-semibold transition-transform focus:scale-95 active:scale-95 md:font-medium",
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )

  if (asChild) {
    return <Slot>{button}</Slot>
  }

  return button
}

function FamilyDrawerViewContent(
  {
    views: propViews
  } = {}
) {
  const { view, views: contextViews } = useFamilyDrawer()

  // Use prop views first, then context views
  const views = propViews || contextViews

  if (!views) {
    throw new Error(
      "FamilyDrawerViewContent requires views to be provided via props or FamilyDrawerRoot"
    )
  }

  const ViewComponent = views[view]

  if (!ViewComponent) {
    // Fallback to default view if view not found
    const DefaultComponent = views.default
    return DefaultComponent ? <DefaultComponent /> : null
  }

  return <ViewComponent />
}

// ============================================================================
// Icons
// ============================================================================

function CloseIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Close Icon</title>
      <path
        d="M10.4854 1.99998L2.00007 10.4853"
        stroke="#999999"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.4854 10.4844L2.00007 1.99908"
        stroke="#999999"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ============================================================================
// Exports
// ============================================================================

export { FamilyDrawerRoot, FamilyDrawerTrigger, FamilyDrawerPortal, FamilyDrawerOverlay, FamilyDrawerContent, FamilyDrawerAnimatedWrapper, FamilyDrawerAnimatedContent, FamilyDrawerClose, FamilyDrawerHeader, FamilyDrawerTitle, FamilyDrawerDescription, FamilyDrawerButton, FamilyDrawerSecondaryButton, FamilyDrawerViewContent, useFamilyDrawer };
