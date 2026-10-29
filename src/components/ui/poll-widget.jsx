import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useControllableState } from "@radix-ui/react-use-controllable-state"
import { cva } from "class-variance-authority"
import { BarChart3Icon, CheckIcon, Vote } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

const PollWidgetContext = createContext(null)

/**
 * Hook to access the PollWidget context
 * @throws Error if used outside of PollWidget.Root
 */
export function usePollWidget() {
  const context = useContext(PollWidgetContext)
  if (!context) {
    throw new Error("PollWidget components must be used within PollWidget.Root")
  }
  return context
}

const PollWidgetOptionContext =
  createContext(null)

function usePollWidgetOptionContext() {
  const context = useContext(PollWidgetOptionContext)
  if (!context) {
    throw new Error(
      "PollWidget.Option sub-components must be used within PollWidget.Option"
    )
  }
  return context
}

// ============================================================================
// Variants
// ============================================================================

const optionVariants = cva(
  [
    "group relative flex w-full cursor-pointer items-center gap-3 rounded-lg border p-3 text-left",
    "transition-all duration-200 ease-out",
    "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
  {
    variants: {
      state: {
        idle: [
          "border-border bg-background hover:border-primary/50 hover:bg-accent/50",
        ],
        selected: [
          "border-primary bg-primary/5 shadow-sm",
          "hover:border-primary hover:bg-primary/10",
        ],
        voted: ["border-border bg-muted/30 cursor-default"],
      },
    },
    defaultVariants: {
      state: "idle",
    },
  }
)

const indicatorVariants = cva(
  [
    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
    "transition-all duration-200 ease-out",
  ],
  {
    variants: {
      state: {
        idle: "border-muted-foreground/30 bg-background",
        selected: "border-primary bg-primary text-primary-foreground",
        voted: "border-muted-foreground/30 bg-muted",
      },
      multiple: {
        true: "rounded-sm",
        false: "rounded-full",
      },
    },
    defaultVariants: {
      state: "idle",
      multiple: false,
    },
  }
)

const progressVariants = cva(
  [
    "absolute inset-y-0 left-0 rounded-l-lg",
    "transition-all duration-500 ease-out",
  ],
  {
    variants: {
      state: {
        idle: "bg-transparent",
        selected: "bg-primary/10",
        voted: "bg-muted/50",
      },
    },
    defaultVariants: {
      state: "idle",
    },
  }
)

// ============================================================================
// Root Component
// ============================================================================

/**
 * Root component for PollWidget. Provides context for all child components.
 * Supports three rendering modes: inline, popover, and dialog.
 */
export function PollWidgetRoot({
  question,
  description,
  options,
  value: controlledValue,
  defaultValue,
  onValueChange,
  multiple = false,
  disabled = false,
  votes = {},
  hasVoted = false,
  onVote,
  mode = "inline",
  open: controlledOpen,
  onOpenChange,
  autoCollapseDelay = 2500,
  successDuration = 1500,
  successTitle = "Thanks for voting!",
  successDescription = "Your vote has been recorded",
  children
}) {
  const normalizeValue = val => {
    if (!val) {
      return []
    }
    return Array.isArray(val) ? val : [val]
  }

  const [selectedArray, setSelectedArray] = useControllableState({
    prop: controlledValue ? normalizeValue(controlledValue) : undefined,
    defaultProp: normalizeValue(defaultValue),
    onChange: (arr) => {
      if (onValueChange) {
        onValueChange(multiple ? arr : (arr[0] ?? ""))
      }
    },
  })

  const [open, setOpen] = useControllableState({
    prop: controlledOpen,
    defaultProp: false,
    onChange: onOpenChange,
  })

  // Animation state
  const [animationPhase, setAnimationPhase] =
    useState("idle")

  const selected = selectedArray ?? []

  const totalVotes = useMemo(
    () => Object.values(votes).reduce((sum, count) => sum + count, 0),
    [votes]
  )

  const select = useCallback(
    (optionId) => {
      if (disabled || hasVoted || animationPhase !== "idle") {
        return
      }

      setSelectedArray((prev) => {
        const current = prev ?? []
        const isCurrentlySelected = current.includes(optionId)

        if (multiple) {
          if (isCurrentlySelected) {
            return current.filter((id) => id !== optionId)
          }
          return [...current, optionId]
        }
        if (isCurrentlySelected) {
          return []
        }
        return [optionId]
      })
    },
    [disabled, hasVoted, multiple, setSelectedArray, animationPhase]
  )

  const isSelected = useCallback(
    (optionId) => selected.includes(optionId),
    [selected]
  )

  const getPercentage = useCallback(
    (optionId) => {
      if (totalVotes === 0) {
        return 0
      }
      return Math.round(((votes[optionId] ?? 0) / totalVotes) * 100)
    },
    [votes, totalVotes]
  )

  const submitVote = useCallback(() => {
    if (selected.length > 0 && onVote && animationPhase === "idle") {
      // Start animation sequence
      setAnimationPhase("voting")

      // Brief delay before showing results
      setTimeout(() => {
        onVote(selected)
        setAnimationPhase("results")

        // Show success after results
        setTimeout(() => {
          setAnimationPhase("success")

          // Auto-collapse after success (for popover/dialog modes)
          if (autoCollapseDelay > 0 && mode !== "inline") {
            setTimeout(() => {
              setOpen(false)
              // Reset animation phase after close
              setTimeout(() => setAnimationPhase("idle"), 300)
            }, successDuration)
          } else if (autoCollapseDelay > 0 && mode === "inline") {
            // For inline mode, just go back to idle after showing success
            setTimeout(() => setAnimationPhase("idle"), successDuration)
          }
        }, autoCollapseDelay)
      }, 400)
    }
  }, [
    selected,
    onVote,
    animationPhase,
    autoCollapseDelay,
    successDuration,
    mode,
    setOpen,
  ])

  // Reset animation phase when opening
  useEffect(() => {
    if (open && !hasVoted) {
      setAnimationPhase("idle")
    }
  }, [open, hasVoted])

  // Update animation phase when hasVoted changes externally
  useEffect(() => {
    if (hasVoted && animationPhase === "idle") {
      setAnimationPhase("results")
    }
  }, [hasVoted, animationPhase])

  const canSubmit =
    selected.length > 0 && !hasVoted && !disabled && animationPhase === "idle"

  const contextValue = useMemo(() => ({
    question,
    description,
    options,
    selected,
    multiple,
    disabled,
    showResults: hasVoted || animationPhase === "results",
    votes,
    totalVotes,
    hasVoted,
    mode,
    open: open ?? false,
    setOpen: (value) => setOpen(value),
    select,
    isSelected,
    getPercentage,
    submitVote,
    canSubmit,
    animationPhase,
    successTitle,
    successDescription,
  }), [
    question,
    description,
    options,
    selected,
    multiple,
    disabled,
    hasVoted,
    votes,
    totalVotes,
    mode,
    open,
    setOpen,
    select,
    isSelected,
    getPercentage,
    submitVote,
    canSubmit,
    animationPhase,
    successTitle,
    successDescription,
  ])

  // Render based on mode
  if (mode === "popover") {
    return (
      <PollWidgetContext.Provider value={contextValue}>
        <Popover onOpenChange={setOpen} open={open}>
          {children}
        </Popover>
      </PollWidgetContext.Provider>
    )
  }

  if (mode === "dialog") {
    return (
      <PollWidgetContext.Provider value={contextValue}>
        <Dialog onOpenChange={setOpen} open={open}>
          {children}
        </Dialog>
      </PollWidgetContext.Provider>
    )
  }

  // Inline mode - just render children with context
  return (
    <PollWidgetContext.Provider value={contextValue}>
      <div data-mode={mode} data-slot="poll-widget">
        {children}
      </div>
    </PollWidgetContext.Provider>
  )
}

/**
 * Button that opens the poll popover/dialog.
 * Only rendered in popover or dialog modes.
 */
export function PollWidgetTrigger({
  className,
  label,
  children,
  ...props
}) {
  const { mode, hasVoted, totalVotes } = usePollWidget()

  if (mode === "inline") {
    return null
  }

  const content = children ?? (
    <>
      <Vote className="size-3.5" />
      {label ?? "Poll"}
      {totalVotes > 0 && (
        <span
          className="bg-primary text-primary-foreground inline-flex min-w-4 items-center justify-center rounded-full px-1 text-[0.625rem]"
          data-slot="poll-widget-vote-count"
        >
          {totalVotes}
        </span>
      )}
    </>
  )

  const button = (
    <Button
      className={cn("gap-1.5", hasVoted && "text-foreground", className)}
      data-slot="poll-widget-trigger"
      size="sm"
      type="button"
      variant="ghost"
      {...props}
    >
      {content}
    </Button>
  )

  if (mode === "dialog") {
    return <DialogTrigger asChild>{button}</DialogTrigger>
  }

  return <PopoverTrigger asChild>{button}</PopoverTrigger>
}

/**
 * Container for the poll content. Adapts to the current mode.
 * Includes animation transitions between voting states.
 */
export function PollWidgetContent({
  className,
  children,
  ...props
}) {
  const { mode, animationPhase } = usePollWidget()

  const innerContent = (
    <AnimatePresence mode="popLayout">
      {animationPhase === "success" ? (
        <motion.div
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          className="flex h-full min-h-[120px] flex-col items-center justify-center"
          exit={{ y: 32, opacity: 0, filter: "blur(4px)" }}
          initial={{ y: -32, opacity: 0, filter: "blur(4px)" }}
          key="success"
          transition={{
            type: "spring",
            duration: 0.4,
            bounce: 0,
          }}
        >
          <PollWidgetSuccess />
        </motion.div>
      ) : (
        <motion.div
          className="flex flex-col gap-3"
          exit={{ y: 8, opacity: 0, filter: "blur(4px)" }}
          initial={false}
          key="poll-content"
          transition={{
            type: "spring",
            duration: 0.4,
            bounce: 0,
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )

  if (mode === "popover") {
    return (
      <PopoverContent
        align="start"
        className={cn("w-80 overflow-hidden p-3", className)}
        data-animation-phase={animationPhase}
        data-slot="poll-widget-content"
        side="top"
        sideOffset={8}
        {...props}
      >
        {innerContent}
      </PopoverContent>
    )
  }

  if (mode === "dialog") {
    return (
      <DialogContent
        className={cn("overflow-hidden sm:max-w-md", className)}
        data-animation-phase={animationPhase}
        data-slot="poll-widget-content"
        {...props}
      >
        {innerContent}
      </DialogContent>
    )
  }

  // Inline mode
  return (
    <div
      className={cn("flex flex-col gap-3", className)}
      data-animation-phase={animationPhase}
      data-slot="poll-widget-content"
      {...props}
    >
      {innerContent}
    </div>
  )
}

/**
 * Success state shown after voting with animated checkmark.
 */
export function PollWidgetSuccess({
  title,
  description,
  className,
  ...props
}) {
  const { successTitle, successDescription, totalVotes, selected, options } =
    usePollWidget()

  const displayTitle = title ?? successTitle
  const displayDescription = description ?? successDescription

  // Get voted option labels
  const votedOptions = selected
    .map((id) => options.find((o) => o.id === id)?.label)
    .filter(Boolean)

  return (
    <div
      className={cn("flex flex-col items-center gap-2 text-center", className)}
      data-slot="poll-widget-success"
      {...props}
    >
      <motion.div
        animate={{ scale: 1, opacity: 1 }}
        initial={{ scale: 0, opacity: 0 }}
        transition={{
          type: "spring",
          duration: 0.5,
          bounce: 0.4,
          delay: 0.1,
        }}
      >
        <svg
          aria-hidden="true"
          className="-mt-1"
          fill="none"
          height="40"
          viewBox="0 0 32 32"
          width="40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Success</title>
          <path
            className="fill-primary/20"
            d="M27.6 16C27.6 17.5234 27.3 19.0318 26.717 20.4392C26.1341 21.8465 25.2796 23.1253 24.2025 24.2025C23.1253 25.2796 21.8465 26.1341 20.4392 26.717C19.0318 27.3 17.5234 27.6 16 27.6C14.4767 27.6 12.9683 27.3 11.5609 26.717C10.1535 26.1341 8.87475 25.2796 7.79759 24.2025C6.72043 23.1253 5.86598 21.8465 5.28302 20.4392C4.70007 19.0318 4.40002 17.5234 4.40002 16C4.40002 12.9235 5.62216 9.97301 7.79759 7.79759C9.97301 5.62216 12.9235 4.40002 16 4.40002C19.0765 4.40002 22.027 5.62216 24.2025 7.79759C26.3779 9.97301 27.6 12.9235 27.6 16Z"
          />
          <path
            className="stroke-primary"
            d="M12.1334 16.9667L15.0334 19.8667L19.8667 13.1M27.6 16C27.6 17.5234 27.3 19.0318 26.717 20.4392C26.1341 21.8465 25.2796 23.1253 24.2025 24.2025C23.1253 25.2796 21.8465 26.1341 20.4392 26.717C19.0318 27.3 17.5234 27.6 16 27.6C14.4767 27.6 12.9683 27.3 11.5609 26.717C10.1535 26.1341 8.87475 25.2796 7.79759 24.2025C6.72043 23.1253 5.86598 21.8465 5.28302 20.4392C4.70007 19.0318 4.40002 17.5234 4.40002 16C4.40002 12.9235 5.62216 9.97301 7.79759 7.79759C9.97301 5.62216 12.9235 4.40002 16 4.40002C19.0765 4.40002 22.027 5.62216 24.2025 7.79759C26.3779 9.97301 27.6 12.9235 27.6 16Z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.4"
          />
        </svg>
      </motion.div>
      <motion.div
        animate={{ y: 0, opacity: 1 }}
        className="space-y-1"
        initial={{ y: 10, opacity: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <h3 className="text-primary text-sm font-medium">{displayTitle}</h3>
        <p className="text-muted-foreground mx-auto max-w-xs text-xs text-pretty">
          {displayDescription}
        </p>
        {votedOptions.length > 0 && (
          <p className="text-muted-foreground text-xs">
            You voted for:{" "}
            <span className="text-foreground font-medium">
              {votedOptions.join(", ")}
            </span>
          </p>
        )}
        <p className="text-muted-foreground pt-1 text-xs">
          {totalVotes.toLocaleString()} total{" "}
          {totalVotes === 1 ? "vote" : "votes"}
        </p>
      </motion.div>
    </div>
  )
}

/**
 * Displays the poll question and optional description.
 */
export function PollWidgetQuestion({
  className,
  children,
  ...props
}) {
  const { question, description, mode } = usePollWidget()

  if (mode === "popover") {
    return (
      <PopoverHeader className={className} {...props}>
        <PopoverTitle>{children ?? question}</PopoverTitle>
        {description && <PopoverDescription>{description}</PopoverDescription>}
      </PopoverHeader>
    )
  }

  if (mode === "dialog") {
    return (
      <DialogHeader className={className} {...props}>
        <DialogTitle>{children ?? question}</DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
      </DialogHeader>
    )
  }

  // Inline mode
  return (
    <div
      className={cn("flex flex-col gap-1", className)}
      data-slot="poll-widget-question"
      {...props}
    >
      <h3 className="text-base font-semibold tracking-tight">
        {children ?? question}
      </h3>
      {description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}
    </div>
  )
}

/**
 * Container for poll options with keyboard navigation.
 */
export function PollWidgetOptions({
  className,
  children,
  ...props
}) {
  const containerRef = useRef(null)

  const handleKeyDown = useCallback((event) => {
    const container = containerRef.current
    if (!container) {
      return
    }

    const options = Array.from(
      container.querySelectorAll('[data-slot="poll-widget-option"]:not([disabled])')
    )
    const currentIndex = options.indexOf(
      document.activeElement
    )

    let nextIndex = currentIndex

    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault()
        nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0
        break
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault()
        nextIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1
        break
      case "Home":
        event.preventDefault()
        nextIndex = 0
        break
      case "End":
        event.preventDefault()
        nextIndex = options.length - 1
        break
      default:
        break
    }

    options[nextIndex]?.focus()
  }, [])

  return (
    <div
      className={cn("flex flex-col gap-2", className)}
      data-slot="poll-widget-options"
      onKeyDown={handleKeyDown}
      ref={containerRef}
      role="listbox"
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Individual poll option with indicator, label, and progress bar.
 */
export function PollWidgetOption({
  value,
  disabled: optionDisabled = false,
  children,
  className,
  onClick,
  ...props
}) {
  const {
    options,
    disabled: rootDisabled,
    hasVoted,
    showResults,
    isSelected,
    select,
    getPercentage,
  } = usePollWidget()

  const option = options.find((o) => o.id === value)
  const disabled = rootDisabled || optionDisabled
  const selected = isSelected(value)
  const percentage = getPercentage(value)

  const getState = () => {
    if (hasVoted) {
      return "voted"
    }
    if (selected) {
      return "selected"
    }
    return "idle"
  }
  const state = getState()

  const handleClick = useCallback(
    (event) => {
      onClick?.(event)
      if (!(event.defaultPrevented || disabled)) {
        select(value)
      }
    },
    [onClick, disabled, select, value]
  )

  const optionContextValue = useMemo(
    () => ({
      optionId: value,
      disabled,
      isSelected: selected,
      percentage,
    }),
    [value, disabled, selected, percentage]
  )

  return (
    <PollWidgetOptionContext.Provider value={optionContextValue}>
      <button
        aria-disabled={disabled || hasVoted}
        aria-selected={selected}
        className={cn(optionVariants({ state }), className)}
        data-disabled={disabled ? true : undefined}
        data-percentage={percentage}
        data-selected={selected ? true : undefined}
        data-slot="poll-widget-option"
        data-state={state}
        data-value={value}
        disabled={disabled || hasVoted}
        onClick={handleClick}
        role="option"
        type="button"
        {...props}
      >
        {/* Animated progress bar background */}
        {showResults && (
          <motion.span
            animate={{ width: `${percentage}%` }}
            aria-hidden="true"
            className={cn(
              progressVariants({ state: selected ? "selected" : "voted" })
            )}
            initial={{ width: 0 }}
            transition={{
              type: "spring",
              duration: 0.8,
              bounce: 0.1,
              delay: 0.1,
            }}
          />
        )}

        {/* Content */}
        <span className="relative z-10 flex w-full items-center gap-3">
          {children ?? (
            <>
              <PollWidgetIndicator />
              {option?.icon && (
                <span className="text-muted-foreground shrink-0">
                  {option.icon}
                </span>
              )}
              <PollWidgetLabel>
                {option?.label ?? value}
                {option?.description && (
                  <span className="text-muted-foreground block text-xs font-normal">
                    {option.description}
                  </span>
                )}
              </PollWidgetLabel>
              {showResults && <PollWidgetPercentage />}
            </>
          )}
        </span>
      </button>
    </PollWidgetOptionContext.Provider>
  )
}

/**
 * Selection indicator (checkbox/radio visual) for an option.
 */
export function PollWidgetIndicator({
  className,
  children,
  ...props
}) {
  const { multiple, hasVoted } = usePollWidget()
  const { isSelected } = usePollWidgetOptionContext()

  const getState = () => {
    if (hasVoted) {
      return "voted"
    }
    if (isSelected) {
      return "selected"
    }
    return "idle"
  }
  const state = getState()

  return (
    <span
      aria-hidden="true"
      className={cn(indicatorVariants({ state, multiple }), className)}
      data-slot="poll-widget-indicator"
      data-state={state}
      {...props}
    >
      {isSelected && (
        <CheckIcon
          className={cn(
            "h-2.5 w-2.5 transition-transform duration-200",
            isSelected ? "scale-100" : "scale-0"
          )}
          strokeWidth={3}
        />
      )}
      {children}
    </span>
  )
}

/**
 * Label text for a poll option.
 */
export function PollWidgetLabel({
  className,
  ...props
}) {
  return (
    <span
      className={cn("flex-1 text-sm font-medium", className)}
      data-slot="poll-widget-label"
      {...props}
    />
  )
}

/**
 * Displays the vote percentage for an option (only visible after voting).
 */
export function PollWidgetPercentage({
  children,
  className,
  ...props
}) {
  const { showResults } = usePollWidget()
  const { percentage } = usePollWidgetOptionContext()

  if (!showResults) {
    return null
  }

  return (
    <span
      className={cn(
        "text-muted-foreground min-w-[3ch] text-right text-xs font-medium tabular-nums",
        className
      )}
      data-slot="poll-widget-percentage"
      {...props}
    >
      {children ?? `${percentage}%`}
    </span>
  )
}

/**
 * Displays voting results summary (total votes, user vote status).
 */
export function PollWidgetResults({
  children,
  className,
  ...props
}) {
  const { totalVotes, hasVoted } = usePollWidget()

  return (
    <div
      className={cn(
        "text-muted-foreground flex items-center justify-between text-xs",
        className
      )}
      data-slot="poll-widget-results"
      {...props}
    >
      {children ?? (
        <>
          <span className="flex items-center gap-1.5">
            <BarChart3Icon className="size-3" />
            {totalVotes.toLocaleString()} {totalVotes === 1 ? "vote" : "votes"}
          </span>
          {hasVoted && (
            <span className="text-primary flex items-center gap-1.5">
              <CheckIcon className="size-3" />
              <span>You voted</span>
            </span>
          )}
        </>
      )}
    </div>
  )
}

/**
 * Submit button for the poll. Disabled when no option is selected or already voted.
 * Shows loading state during vote submission animation.
 */
export function PollWidgetSubmit({
  className,
  children,
  onClick,
  loadingText = "Submitting...",
  ...props
}) {
  const { canSubmit, submitVote, hasVoted, mode, animationPhase } =
    usePollWidget()

  const isSubmitting = animationPhase === "voting"

  const handleClick = (
    event
  ) => {
    onClick?.(event)
    if (!event.defaultPrevented) {
      submitVote()
    }
  }

  if (
    hasVoted ||
    animationPhase === "results" ||
    animationPhase === "success"
  ) {
    return null
  }

  const buttonContent = (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.span
        animate={{ opacity: 1, y: 0 }}
        className="flex w-full items-center justify-center gap-2"
        exit={{ opacity: 0, y: 20 }}
        initial={{ opacity: 0, y: -20 }}
        key={isSubmitting ? "loading" : "submit"}
        transition={{
          type: "spring",
          duration: 0.3,
          bounce: 0,
        }}
      >
        {isSubmitting ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              className="size-3.5 rounded-full border-2 border-current border-t-transparent"
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
            {loadingText}
          </>
        ) : (
          (children ?? "Submit Vote")
        )}
      </motion.span>
    </AnimatePresence>
  )

  // For dialog mode, wrap in DialogFooter
  if (mode === "dialog") {
    return (
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>
        <Button
          className={cn("min-w-[120px]", className)}
          data-slot="poll-widget-submit"
          disabled={!canSubmit || isSubmitting}
          onClick={handleClick}
          type="button"
          {...props}
        >
          {buttonContent}
        </Button>
      </DialogFooter>
    )
  }

  return (
    <Button
      className={cn("w-full overflow-hidden", className)}
      data-slot="poll-widget-submit"
      disabled={!canSubmit || isSubmitting}
      onClick={handleClick}
      type="button"
      {...props}
    >
      {buttonContent}
    </Button>
  )
}

/**
 * Dialog wrapper component. Use when mode="dialog" to wrap PollWidget.Content.
 * This is an alternative to PollWidget.Content for more control over dialog rendering.
 */
export function PollWidgetDialog({
  className,
  children,
  ...props
}) {
  return (
    <DialogContent
      className={cn("sm:max-w-md", className)}
      data-slot="poll-widget-dialog"
      {...props}
    >
      {children}
    </DialogContent>
  )
}

// ============================================================================
// Compound Export
// ============================================================================

export const PollWidget = Object.assign(PollWidgetRoot, {
  Trigger: PollWidgetTrigger,
  Content: PollWidgetContent,
  Question: PollWidgetQuestion,
  Options: PollWidgetOptions,
  Option: PollWidgetOption,
  Indicator: PollWidgetIndicator,
  Label: PollWidgetLabel,
  Percentage: PollWidgetPercentage,
  Results: PollWidgetResults,
  Submit: PollWidgetSubmit,
  Success: PollWidgetSuccess,
  Dialog: PollWidgetDialog,
})
