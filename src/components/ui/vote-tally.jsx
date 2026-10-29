import { Children, createContext, isValidElement, useCallback, useContext, useMemo } from "react";
import { useControllableState } from "@radix-ui/react-use-controllable-state";

const VoteTallyContext = createContext(null)

function useVoteTallyContext() {
  const context = useContext(VoteTallyContext)
  if (!context) {
    throw new Error("VoteTally components must be used within VoteTally.Root")
  }
  return context
}

const VoteTallyItemContext = createContext(null)

function useVoteTallyItemContext() {
  const context = useContext(VoteTallyItemContext)
  if (!context) {
    throw new Error(
      "VoteTally.Item sub-components must be used within VoteTally.Item"
    )
  }
  return context
}

/* -----------------------------------------------------------------------------
 * Root
 * -------------------------------------------------------------------------- */

function VoteTallyRoot({
  value: controlledValue,
  defaultValue = {},
  onValueChange,
  votedItems: controlledVotedItems,
  defaultVotedItems,
  onVotedItemsChange,
  disabled = false,
  children,
  ...props
}) {
  const [votes, setVotes] = useControllableState({
    prop: controlledValue,
    defaultProp: defaultValue,
    onChange: onValueChange,
  })

  const [votedItemsArray, setVotedItemsArray] = useControllableState({
    prop: controlledVotedItems ? Array.from(controlledVotedItems) : undefined,
    defaultProp: defaultVotedItems ? Array.from(defaultVotedItems) : [],
    onChange: (arr) => onVotedItemsChange?.(new Set(arr)),
  })

  const votedItems = useMemo(() => new Set(votedItemsArray), [votedItemsArray])

  const vote = useCallback(
    (itemId) => {
      if (disabled || votedItems.has(itemId)) {
        return
      }

      setVotes((prev) => ({
        ...prev,
        [itemId]: (prev?.[itemId] ?? 0) + 1,
      }))
      setVotedItemsArray((prev) => [...(prev ?? []), itemId])
    },
    [disabled, votedItems, setVotes, setVotedItemsArray]
  )

  const unvote = useCallback(
    (itemId) => {
      if (disabled || !votedItems.has(itemId)) {
        return
      }

      setVotes((prev) => ({
        ...prev,
        [itemId]: Math.max((prev?.[itemId] ?? 0) - 1, 0),
      }))
      setVotedItemsArray((prev) => (prev ?? []).filter((id) => id !== itemId))
    },
    [disabled, votedItems, setVotes, setVotedItemsArray]
  )

  const toggleVote = useCallback(
    (itemId) => {
      if (votedItems.has(itemId)) {
        unvote(itemId)
      } else {
        vote(itemId)
      }
    },
    [votedItems, vote, unvote]
  )

  const getVoteCount = useCallback(
    (itemId) => votes?.[itemId] ?? 0,
    [votes]
  )

  const hasVoted = useCallback(
    (itemId) => votedItems.has(itemId),
    [votedItems]
  )

  const contextValue = useMemo(
    () => ({
      votes: votes ?? {},
      votedItems,
      disabled,
      vote,
      unvote,
      toggleVote,
      getVoteCount,
      hasVoted,
    }),
    [
      votes,
      votedItems,
      disabled,
      vote,
      unvote,
      toggleVote,
      getVoteCount,
      hasVoted,
    ]
  )

  return (
    <VoteTallyContext.Provider value={contextValue}>
      <ul
        aria-label="Vote tally list"
        data-disabled={disabled ? true : undefined}
        {...props}
      >
        {children}
      </ul>
    </VoteTallyContext.Provider>
  )
}

/* -----------------------------------------------------------------------------
 * Group (optional sorting wrapper)
 * -------------------------------------------------------------------------- */

function VoteTallyGroup({
  sortBy = "none",
  children,
  ...props
}) {
  const { votes } = useVoteTallyContext()

  const sortedChildren = useMemo(() => {
    if (sortBy === "none") {
      return children
    }

    const childArray = Children.toArray(children)

    return childArray.sort((a, b) => {
      if (!(isValidElement(a) && isValidElement(b))) {
        return 0
      }

      const aValue = (a.props).value
      const bValue = (b.props).value
      const aVotes = votes[aValue] ?? 0
      const bVotes = votes[bValue] ?? 0

      return sortBy === "votes-desc" ? bVotes - aVotes : aVotes - bVotes
    });
  }, [children, sortBy, votes])

  return <div {...props}>{sortedChildren}</div>
}

/* -----------------------------------------------------------------------------
 * Item
 * -------------------------------------------------------------------------- */

function VoteTallyItem({
  value,
  disabled: itemDisabled = false,
  children,
  ...props
}) {
  const {
    disabled: rootDisabled,
    hasVoted,
    getVoteCount,
  } = useVoteTallyContext()
  const disabled = rootDisabled || itemDisabled
  const voted = hasVoted(value)
  const voteCount = getVoteCount(value)

  const itemContextValue = useMemo(
    () => ({ itemId: value, disabled }),
    [value, disabled]
  )

  return (
    <VoteTallyItemContext.Provider value={itemContextValue}>
      <li
        data-disabled={disabled ? true : undefined}
        data-item={value}
        data-slot="vote-tally-item"
        data-vote-count={voteCount}
        data-voted={voted ? true : undefined}
        {...props}
      >
        {children}
      </li>
    </VoteTallyItemContext.Provider>
  )
}

/* -----------------------------------------------------------------------------
 * Trigger
 * -------------------------------------------------------------------------- */

function VoteTallyTrigger({
  children,
  onClick,
  ...props
}) {
  const { toggleVote, hasVoted, disabled: rootDisabled } = useVoteTallyContext()
  const { itemId, disabled: itemDisabled } = useVoteTallyItemContext()

  const disabled = rootDisabled || itemDisabled
  const voted = hasVoted(itemId)

  const handleClick = useCallback(
    (event) => {
      onClick?.(event)
      if (!(event.defaultPrevented || disabled)) {
        toggleVote(itemId)
      }
    },
    [onClick, disabled, toggleVote, itemId]
  )

  return (
    <button
      aria-label={voted ? "Remove vote" : "Vote"}
      aria-pressed={voted}
      data-slot="vote-tally-trigger"
      data-state={voted ? "voted" : "idle"}
      disabled={disabled}
      onClick={handleClick}
      type="button"
      {...props}
    >
      {children}
    </button>
  )
}

/* -----------------------------------------------------------------------------
 * Count
 * -------------------------------------------------------------------------- */

function VoteTallyCount({
  children,
  ...props
}) {
  const { getVoteCount } = useVoteTallyContext()
  const { itemId } = useVoteTallyItemContext()

  const count = getVoteCount(itemId)

  return (
    <span data-slot="vote-tally-count" {...props}>
      {children ?? count}
    </span>
  )
}

/* -----------------------------------------------------------------------------
 * Title
 * -------------------------------------------------------------------------- */

function VoteTallyTitle({
  children,
  ...props
}) {
  return (
    <span data-slot="vote-tally-title" {...props}>
      {children}
    </span>
  )
}

/* -----------------------------------------------------------------------------
 * Description
 * -------------------------------------------------------------------------- */

function VoteTallyDescription({
  children,
  ...props
}) {
  return (
    <span data-slot="vote-tally-description" {...props}>
      {children}
    </span>
  )
}

/* -----------------------------------------------------------------------------
 * Hook for external access
 * -------------------------------------------------------------------------- */

export function useVoteTally() {
  return useVoteTallyContext()
}

/* -----------------------------------------------------------------------------
 * Export
 * -------------------------------------------------------------------------- */

export const VoteTally = {
  Root: VoteTallyRoot,
  Group: VoteTallyGroup,
  Item: VoteTallyItem,
  Trigger: VoteTallyTrigger,
  Count: VoteTallyCount,
  Title: VoteTallyTitle,
  Description: VoteTallyDescription,
}

export {
  VoteTallyRoot,
  VoteTallyGroup,
  VoteTallyItem,
  VoteTallyTrigger,
  VoteTallyCount,
  VoteTallyTitle,
  VoteTallyDescription,
}
