import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { LibraryIcon, PlusSignIcon } from "@hugeicons/core-free-icons"
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

const PromptLibraryContext = createContext(null)

/**
 * Hook to access the PromptLibrary context
 * @throws Error if used outside of PromptLibrary provider
 */
export const usePromptLibrary = () => {
  const ctx = useContext(PromptLibraryContext)
  if (!ctx) {
    throw new Error(
      "usePromptLibrary must be used within a PromptLibrary provider"
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
 * Root component for the PromptLibrary widget.
 * Provides context for all child components.
 */
export function PromptLibrary({
  prompts: controlledPrompts,
  onPromptsChange,
  onSelect,
  onInsert,
  open: controlledOpen,
  onOpenChange,
  children
}) {
  const [internalPrompts, setInternalPrompts] = useState(controlledPrompts ?? [])

  const prompts = controlledPrompts ?? internalPrompts

  const [open, setOpen] = useControllableState(
    controlledOpen,
    false,
    onOpenChange
  )
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [lastSelectedId, setLastSelectedId] = useState(null)

  const selectPrompt = useCallback(
    async (prompt) => {
      setLastSelectedId(prompt.id)

      if (onInsert) {
        onInsert(prompt.prompt)
      } else {
        try {
          await navigator.clipboard.writeText(prompt.prompt)
        } catch (err) {
          console.error("Failed to copy to clipboard:", err)
        }
      }

      // Close popover after selection
      setOpen(false)

      // Call onSelect callback
      onSelect?.(prompt)
    },
    [onInsert, setOpen, onSelect]
  )

  const addCustom = useCallback(
    (prompt) => {
      const newPrompt = {
        ...prompt,
        id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        isCustom: true,
      }

      if (controlledPrompts) {
        onPromptsChange?.([...controlledPrompts, newPrompt])
      } else {
        setInternalPrompts((prev) => [...prev, newPrompt])
      }
    },
    [controlledPrompts, onPromptsChange]
  )

  const removeCustom = useCallback(
    (id) => {
      if (controlledPrompts) {
        onPromptsChange?.(controlledPrompts.filter((p) => p.id !== id))
      } else {
        setInternalPrompts((prev) => prev.filter((p) => p.id !== id))
      }
    },
    [controlledPrompts, onPromptsChange]
  )

  const contextValue = useMemo(() => ({
    prompts,
    addCustom,
    removeCustom,
    selectPrompt,
    lastSelectedId,
    open,
    setOpen,
    createDialogOpen,
    setCreateDialogOpen,
  }), [
    prompts,
    addCustom,
    removeCustom,
    selectPrompt,
    lastSelectedId,
    open,
    setOpen,
    createDialogOpen,
  ])

  return (
    <PromptLibraryContext.Provider value={contextValue}>
      <Popover onOpenChange={setOpen} open={open}>
        {children}
      </Popover>
    </PromptLibraryContext.Provider>
  )
}

/**
 * Button that opens the prompt library popover.
 */
export function PromptLibraryTrigger({
  className,
  label,
  children,
  ...props
}) {
  return (
    <PopoverTrigger asChild>
      <Button
        className={cn("gap-1.5", className)}
        size="sm"
        type="button"
        variant="ghost"
        {...props}
      >
        {children ?? (
          <>
            <HugeiconsIcon
              className="size-3.5"
              icon={LibraryIcon}
              strokeWidth={2}
            />
            {label ?? "Prompts"}
          </>
        )}
      </Button>
    </PopoverTrigger>
  )
}

/**
 * Popover content container for the prompt library list.
 */
export function PromptLibraryContent({
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
      <Command className="rounded-lg" data-slot="prompt-library-content">
        {children}
      </Command>
    </PopoverContent>
  )
}

/**
 * Search input for filtering prompts.
 */
export function PromptLibrarySearch({
  placeholder = "Search prompts...",
  className,
  ...props
}) {
  return (
    <CommandInput
      className={cn(className)}
      data-slot="prompt-library-search"
      placeholder={placeholder}
      {...props}
    />
  )
}

/**
 * Scrollable list container for prompts.
 */
export function PromptLibraryList({
  className,
  children,
  ...props
}) {
  return (
    <CommandList
      className={cn("max-h-64", className)}
      data-slot="prompt-library-list"
      {...props}
    >
      {children}
    </CommandList>
  )
}

/**
 * Empty state shown when no prompts match the search.
 */
export function PromptLibraryEmpty({
  children = "No prompts found.",
  className,
  ...props
}) {
  return (
    <CommandEmpty
      className={cn(className)}
      data-slot="prompt-library-empty"
      {...props}
    >
      {children}
    </CommandEmpty>
  )
}

/**
 * Group container for categorizing prompts.
 */
export function PromptLibraryGroup({
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
      data-slot="prompt-library-group"
      {...props}
    />
  )
}

/**
 * Visual separator between prompt groups.
 */
export function PromptLibrarySeparator({
  className,
  ...props
}) {
  return (
    <CommandSeparator
      className={cn(className)}
      data-slot="prompt-library-separator"
      {...props}
    />
  )
}

/**
 * Individual prompt item with click-to-select and optional hover preview.
 */
export function PromptLibraryItem({
  prompt,
  disablePreview = false,
  className,
  children,
  ...props
}) {
  const { selectPrompt, lastSelectedId } = usePromptLibrary()
  const isLastSelected = lastSelectedId === prompt.id

  const handleSelect = () => {
    selectPrompt(prompt)
  }

  const itemContent = (
    <CommandItem
      className={cn(
        "group/prompt-item flex cursor-pointer items-start gap-3 py-2",
        isLastSelected && "bg-accent/50",
        className
      )}
      data-slot="prompt-library-item"
      data-state={isLastSelected ? "selected" : "idle"}
      onSelect={handleSelect}
      value={prompt.title}
      {...props}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        {children ?? (
          <>
            <PromptLibraryItemTitle>{prompt.title}</PromptLibraryItemTitle>
            <PromptLibraryItemDescription>
              {prompt.description}
            </PromptLibraryItemDescription>
          </>
        )}
      </div>
    </CommandItem>
  )

  if (disablePreview || !prompt.prompt) {
    return itemContent
  }

  return (
    <PromptLibraryHoverCard prompt={prompt}>
      {itemContent}
    </PromptLibraryHoverCard>
  )
}

/**
 * Title text for a prompt item.
 */
export function PromptLibraryItemTitle({
  className,
  ...props
}) {
  return (
    <span
      className={cn("text-foreground text-xs font-medium", className)}
      data-slot="prompt-library-item-title"
      {...props}
    />
  )
}

/**
 * Description text for a prompt item.
 */
export function PromptLibraryItemDescription({
  className,
  ...props
}) {
  return (
    <span
      className={cn("text-muted-foreground line-clamp-2 text-xs", className)}
      data-slot="prompt-library-item-description"
      {...props}
    />
  )
}

/**
 * Hover card that shows the full prompt content on hover.
 */
export function PromptLibraryHoverCard({
  prompt,
  children
}) {
  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger>{children}</HoverCardTrigger>
      <HoverCardContent
        align="start"
        className="w-80"
        data-slot="prompt-library-hover-card"
        side="right"
        sideOffset={8}
      >
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">{prompt.title}</span>
            <span className="text-muted-foreground text-xs">
              {prompt.description}
            </span>
          </div>
          {prompt.prompt && (
            <div className="bg-muted/50 rounded-md p-2">
              <p className="text-muted-foreground line-clamp-6 text-xs whitespace-pre-wrap">
                {prompt.prompt}
              </p>
            </div>
          )}
          {prompt.category && (
            <span className="text-muted-foreground text-[0.625rem]">
              Category: {prompt.category}
            </span>
          )}
          {prompt.isCustom && (
            <span className="text-muted-foreground text-[0.625rem]">
              Custom prompt
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
export function PromptLibraryFooter({
  className,
  children,
  ...props
}) {
  return (
    <div
      className={cn("border-t p-1", className)}
      data-slot="prompt-library-footer"
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Button that opens the create prompt dialog.
 */
export function PromptLibraryCreateTrigger({
  label = "New Prompt",
  className,
  children,
  ...props
}) {
  const { setCreateDialogOpen, setOpen } = usePromptLibrary()

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
      data-slot="prompt-library-create-trigger"
      onSelect={handleSelect}
      value="__new_prompt__"
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
 * Modal dialog for creating custom prompts.
 */
export function PromptLibraryCreateDialog({
  title = "Create Prompt",
  description = "Create a custom prompt template for quick access.",
  children,
  ...props
}) {
  const { createDialogOpen, setCreateDialogOpen, addCustom } =
    usePromptLibrary()
  const [formTitle, setFormTitle] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formPrompt, setFormPrompt] = useState("")
  const [formCategory, setFormCategory] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!(formTitle.trim() && formDescription.trim() && formPrompt.trim())) {
      return
    }

    addCustom({
      title: formTitle.trim(),
      description: formDescription.trim(),
      prompt: formPrompt.trim(),
      category: formCategory.trim() || undefined,
    })

    // Reset form
    setFormTitle("")
    setFormDescription("")
    setFormPrompt("")
    setFormCategory("")
    setCreateDialogOpen(false)
  }

  const handleOpenChange = (open) => {
    setCreateDialogOpen(open)
    if (!open) {
      // Reset form when closing
      setFormTitle("")
      setFormDescription("")
      setFormPrompt("")
      setFormCategory("")
    }
  }

  return (
    <Dialog
      data-slot="prompt-library-create-dialog"
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
              <label className="text-xs font-medium" htmlFor="prompt-title">
                Title
              </label>
              <Input
                id="prompt-title"
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g., Code Review"
                required
                value={formTitle}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                className="text-xs font-medium"
                htmlFor="prompt-description"
              >
                Description
              </label>
              <Input
                id="prompt-description"
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="e.g., Review code for best practices"
                required
                value={formDescription}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium" htmlFor="prompt-content">
                Prompt
              </label>
              <Textarea
                className="min-h-24 resize-none"
                id="prompt-content"
                onChange={(e) => setFormPrompt(e.target.value)}
                placeholder="Enter the prompt text..."
                required
                value={formPrompt}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium" htmlFor="prompt-category">
                Category (optional)
              </label>
              <Input
                id="prompt-category"
                onChange={(e) => setFormCategory(e.target.value)}
                placeholder="e.g., Development"
                value={formCategory}
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

export const PromptLibraryWidget = Object.assign(PromptLibrary, {
  Trigger: PromptLibraryTrigger,
  Content: PromptLibraryContent,
  Search: PromptLibrarySearch,
  List: PromptLibraryList,
  Empty: PromptLibraryEmpty,
  Group: PromptLibraryGroup,
  Separator: PromptLibrarySeparator,
  Item: PromptLibraryItem,
  ItemTitle: PromptLibraryItemTitle,
  ItemDescription: PromptLibraryItemDescription,
  HoverCard: PromptLibraryHoverCard,
  Footer: PromptLibraryFooter,
  CreateTrigger: PromptLibraryCreateTrigger,
  CreateDialog: PromptLibraryCreateDialog,
})
