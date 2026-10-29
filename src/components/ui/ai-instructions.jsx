import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  CheckmarkSquare02Icon,
  PlusSignIcon,
  SettingsIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"

// ============================================================================
// Context
// ============================================================================

const InstructionsContext = createContext(null)

/**
 * Hook to access the Instructions context
 * @throws Error if used outside of Instructions provider
 */
export const useInstructions = () => {
  const ctx = useContext(InstructionsContext)
  if (!ctx) {
    throw new Error(
      "useInstructions must be used within an Instructions provider"
    )
  }
  return ctx
}

// ============================================================================
// Controllable State Hook
// ============================================================================

function useControllableState(controlledValue, defaultValue, onChange) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : uncontrolledValue

  const setValue = useCallback(
    (nextValue) => {
      const resolvedValue =
        typeof nextValue === "function"
          ? (nextValue)(value)
          : nextValue

      if (!isControlled) {
        setUncontrolledValue(resolvedValue)
      }
      onChange?.(resolvedValue)
    },
    [isControlled, onChange, value]
  )

  return [value, setValue]
}

/**
 * Root component for the Instructions widget.
 * Provides context for all child components.
 */
export function Instructions({
  value,
  onValueChange,
  defaultValue = [],
  instructions: controlledInstructions,
  onInstructionsChange,
  open: controlledOpen,
  onOpenChange,
  children
}) {
  const [activeIds, setActiveIds] = useControllableState(
    value,
    defaultValue,
    onValueChange
  )

  const [internalInstructions, setInternalInstructions] = useState(controlledInstructions ?? [])

  const instructions = controlledInstructions ?? internalInstructions

  const [open, setOpen] = useControllableState(
    controlledOpen,
    false,
    onOpenChange
  )
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const toggle = useCallback(
    (id) => {
      setActiveIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      )
    },
    [setActiveIds]
  )

  const isActive = useCallback(
    (id) => activeIds.includes(id),
    [activeIds]
  )

  const addCustom = useCallback(
    (instruction) => {
      const newInstruction = {
        ...instruction,
        id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        isCustom: true,
      }

      if (controlledInstructions) {
        onInstructionsChange?.([...controlledInstructions, newInstruction])
      } else {
        setInternalInstructions((prev) => [...prev, newInstruction])
      }
    },
    [controlledInstructions, onInstructionsChange]
  )

  const removeCustom = useCallback(
    (id) => {
      // Also remove from active if it was active
      setActiveIds((prev) => prev.filter((i) => i !== id))

      if (controlledInstructions) {
        onInstructionsChange?.(
          controlledInstructions.filter((i) => i.id !== id)
        )
      } else {
        setInternalInstructions((prev) => prev.filter((i) => i.id !== id))
      }
    },
    [controlledInstructions, onInstructionsChange, setActiveIds]
  )

  const contextValue = useMemo(() => ({
    activeIds,
    toggle,
    isActive,
    instructions,
    addCustom,
    removeCustom,
    open,
    setOpen,
    createDialogOpen,
    setCreateDialogOpen,
  }), [
    activeIds,
    toggle,
    isActive,
    instructions,
    addCustom,
    removeCustom,
    open,
    setOpen,
    createDialogOpen,
  ])

  return (
    <InstructionsContext.Provider value={contextValue}>
      <Popover onOpenChange={setOpen} open={open}>
        {children}
      </Popover>
    </InstructionsContext.Provider>
  )
}

/**
 * Button that opens the instructions popover.
 * Shows active count badge when instructions are selected.
 */
export function InstructionsTrigger({
  className,
  label,
  children,
  ...props
}) {
  const { activeIds } = useInstructions()
  const activeCount = activeIds.length

  return (
    <PopoverTrigger asChild>
      <Button
        className={cn(
          "gap-1.5",
          activeCount > 0 && "text-foreground",
          className
        )}
        size="sm"
        type="button"
        variant="ghost"
        {...props}
      >
        {children ?? (
          <>
            <HugeiconsIcon
              className="size-3.5"
              icon={SettingsIcon}
              strokeWidth={2}
            />
            {label ?? "Instructions"}
            {activeCount > 0 && (
              <span
                className="bg-primary text-primary-foreground inline-flex size-4 items-center justify-center rounded-full text-[0.625rem]"
                data-slot="instructions-count"
              >
                {activeCount}
              </span>
            )}
          </>
        )}
      </Button>
    </PopoverTrigger>
  )
}

/**
 * Popover content container for the instructions list.
 */
export function InstructionsContent({
  className,
  children,
  ...props
}) {
  return (
    <PopoverContent
      align="start"
      className={cn("w-80 p-0", className)}
      side="top"
      sideOffset={8}
      {...props}
    >
      <Command className="rounded-lg" data-slot="instructions-content">
        {children}
      </Command>
    </PopoverContent>
  )
}

/**
 * Search input for filtering instructions.
 */
export function InstructionsSearch({
  placeholder = "Search instructions...",
  className,
  ...props
}) {
  return (
    <CommandInput
      className={cn(className)}
      data-slot="instructions-search"
      placeholder={placeholder}
      {...props}
    />
  )
}

/**
 * Scrollable list container for instructions.
 */
export function InstructionsList({
  className,
  children,
  ...props
}) {
  return (
    <CommandList
      className={cn("max-h-64", className)}
      data-slot="instructions-list"
      {...props}
    >
      {children}
    </CommandList>
  )
}

/**
 * Empty state shown when no instructions match the search.
 */
export function InstructionsEmpty({
  children = "No instructions found.",
  className,
  ...props
}) {
  return (
    <CommandEmpty
      className={cn(className)}
      data-slot="instructions-empty"
      {...props}
    >
      {children}
    </CommandEmpty>
  )
}

/**
 * Group container for categorizing instructions.
 * Applies rounded corners to first/last items only.
 */
export function InstructionsGroup({
  className,
  ...props
}) {
  return (
    <CommandGroup
      className={cn(
        // Remove default rounding from all items
        "**:[[cmdk-item]]:rounded-none",
        // First child in group gets rounded top
        "[&_[cmdk-group-items]>:first-child_[cmdk-item]]:rounded-t-md",
        // Last child in group gets rounded bottom
        "[&_[cmdk-group-items]>:last-child_[cmdk-item]]:rounded-b-md",
        className
      )}
      data-slot="instructions-group"
      {...props}
    />
  )
}

/**
 * Visual separator between instruction groups.
 */
export function InstructionsSeparator({
  className,
  ...props
}) {
  return (
    <CommandSeparator
      className={cn(className)}
      data-slot="instructions-separator"
      {...props}
    />
  )
}

/**
 * Individual instruction item with toggle state and optional hover preview.
 */
export function InstructionsItem({
  instruction,
  disablePreview = false,
  className,
  children,
  ...props
}) {
  const { toggle, isActive } = useInstructions()
  const active = isActive(instruction.id)

  const handleSelect = () => {
    toggle(instruction.id)
  }

  const itemContent = (
    <CommandItem
      className={cn(
        "group/instruction-item flex cursor-pointer items-start gap-3 py-2",
        active && "bg-accent",
        className
      )}
      data-checked={active}
      data-slot="instructions-item"
      data-state={active ? "active" : "inactive"}
      onSelect={handleSelect}
      value={instruction.title}
      {...props}
    >
      <div
        className={cn(
          "mt-0.5 flex size-4 shrink-0 items-center justify-center border first:rounded-t-lg last:rounded-b-lg",
          active
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/30"
        )}
        data-slot="instructions-item-checkbox"
      >
        {active && (
          <HugeiconsIcon
            className="size-3"
            icon={CheckmarkSquare02Icon}
            strokeWidth={2.5}
          />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        {children ?? (
          <>
            <InstructionsItemTitle>{instruction.title}</InstructionsItemTitle>
            <InstructionsItemDescription>
              {instruction.description}
            </InstructionsItemDescription>
          </>
        )}
      </div>
    </CommandItem>
  )

  if (disablePreview || !instruction.content) {
    return itemContent
  }

  return (
    <InstructionsHoverCard instruction={instruction}>
      {itemContent}
    </InstructionsHoverCard>
  )
}

/**
 * Title text for an instruction item.
 */
export function InstructionsItemTitle({
  className,
  ...props
}) {
  return (
    <span
      className={cn("text-foreground text-xs font-medium", className)}
      data-slot="instructions-item-title"
      {...props}
    />
  )
}

/**
 * Description text for an instruction item.
 */
export function InstructionsItemDescription({
  className,
  ...props
}) {
  return (
    <span
      className={cn("text-muted-foreground line-clamp-2 text-xs", className)}
      data-slot="instructions-item-description"
      {...props}
    />
  )
}

/**
 * Hover card that shows the full instruction content on hover.
 */
export function InstructionsHoverCard({
  instruction,
  children
}) {
  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger>{children}</HoverCardTrigger>
      <HoverCardContent
        align="start"
        className="w-72"
        data-slot="instructions-hover-card"
        side="right"
        sideOffset={8}
      >
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">{instruction.title}</span>
            <span className="text-muted-foreground text-xs">
              {instruction.description}
            </span>
          </div>
          {instruction.content && (
            <div className="bg-muted/50 rounded-md p-2">
              <p className="text-muted-foreground text-xs whitespace-pre-wrap">
                {instruction.content}
              </p>
            </div>
          )}
          {instruction.isCustom && (
            <span className="text-muted-foreground text-[0.625rem]">
              Custom instruction
            </span>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

/**
 * Footer container that stays fixed at the bottom of the popover.
 * Use this to place the create trigger outside the scrollable list.
 */
export function InstructionsFooter({
  className,
  children,
  ...props
}) {
  return (
    <div
      className={cn("border-t p-1", className)}
      data-slot="instructions-footer"
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Button that opens the create instruction dialog.
 */
export function InstructionsCreateTrigger({
  label = "New Instruction",
  className,
  children,
  ...props
}) {
  const { setCreateDialogOpen, setOpen } = useInstructions()

  const handleSelect = () => {
    setOpen(false)
    setCreateDialogOpen(true)
  }

  return (
    <CommandItem
      className={cn(
        "text-muted-foreground flex cursor-pointer items-center gap-2",
        className
      )}
      data-slot="instructions-create-trigger"
      onSelect={handleSelect}
      value="__new_instruction__"
      {...props}
    >
      {children ?? (
        <>
          <HugeiconsIcon
            className="size-3.5"
            icon={PlusSignIcon}
            strokeWidth={2}
          />
          {label}
        </>
      )}
    </CommandItem>
  )
}

/**
 * Modal dialog for creating custom instructions.
 */
export function InstructionsCreateDialog({
  title = "Create Instruction",
  description = "Create a custom instruction to guide the AI's behavior.",
  children,
  ...props
}) {
  const { createDialogOpen, setCreateDialogOpen, addCustom } = useInstructions()
  const [formTitle, setFormTitle] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formContent, setFormContent] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!(formTitle.trim() && formDescription.trim())) {
      return
    }

    addCustom({
      title: formTitle.trim(),
      description: formDescription.trim(),
      content: formContent.trim() || undefined,
    })

    // Reset form
    setFormTitle("")
    setFormDescription("")
    setFormContent("")
    setCreateDialogOpen(false)
  }

  const handleOpenChange = (open) => {
    setCreateDialogOpen(open)
    if (!open) {
      // Reset form when closing
      setFormTitle("")
      setFormDescription("")
      setFormContent("")
    }
  }

  return (
    <Dialog
      data-slot="instructions-create-dialog"
      onOpenChange={handleOpenChange}
      open={createDialogOpen}
      {...props}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children ?? (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label
                className="text-xs font-medium"
                htmlFor="instruction-title"
              >
                Title
              </label>
              <Input
                id="instruction-title"
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g., Be Concise"
                required
                value={formTitle}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                className="text-xs font-medium"
                htmlFor="instruction-description"
              >
                Description
              </label>
              <Input
                id="instruction-description"
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="e.g., Keep responses short and to the point"
                required
                value={formDescription}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                className="text-xs font-medium"
                htmlFor="instruction-content"
              >
                Full Instruction (optional)
              </label>
              <Textarea
                className="min-h-24 resize-none"
                id="instruction-content"
                onChange={(e) => setFormContent(e.target.value)}
                placeholder="Detailed instruction text that will be shown in the preview..."
                value={formContent}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ============================================================================
// Compound Export
// ============================================================================

export const InstructionsWidget = Object.assign(Instructions, {
  Trigger: InstructionsTrigger,
  Content: InstructionsContent,
  Search: InstructionsSearch,
  List: InstructionsList,
  Empty: InstructionsEmpty,
  Group: InstructionsGroup,
  Separator: InstructionsSeparator,
  Item: InstructionsItem,
  ItemTitle: InstructionsItemTitle,
  ItemDescription: InstructionsItemDescription,
  HoverCard: InstructionsHoverCard,
  Footer: InstructionsFooter,
  CreateTrigger: InstructionsCreateTrigger,
  CreateDialog: InstructionsCreateDialog,
})
