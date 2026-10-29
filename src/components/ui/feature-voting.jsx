import { Children, createContext, isValidElement, useCallback, useContext, useMemo } from "react";
import { useControllableState } from "@radix-ui/react-use-controllable-state";

const FeatureVotingContext = createContext(null)

function useFeatureVotingContext() {
  const context = useContext(FeatureVotingContext)
  if (!context) {
    throw new Error(
      "FeatureVoting components must be used within FeatureVoting.Root"
    )
  }
  return context
}

const FeatureVotingItemContext =
  createContext(null)

function useFeatureVotingItemContext() {
  const context = useContext(FeatureVotingItemContext)
  if (!context) {
    throw new Error(
      "FeatureVoting.Item sub-components must be used within FeatureVoting.Item"
    )
  }
  return context
}

/* -----------------------------------------------------------------------------
 * Root
 * -------------------------------------------------------------------------- */

function FeatureVotingRoot({
  value: controlledValue,
  defaultValue = {},
  onValueChange,
  votedFeatures: controlledVotedFeatures,
  defaultVotedFeatures,
  onVotedFeaturesChange,
  disabled = false,
  children,
  ...props
}) {
  const [votes, setVotes] = useControllableState({
    prop: controlledValue,
    defaultProp: defaultValue,
    onChange: onValueChange,
  })

  const [votedFeaturesArray, setVotedFeaturesArray] = useControllableState({
    prop: controlledVotedFeatures
      ? Array.from(controlledVotedFeatures)
      : undefined,
    defaultProp: defaultVotedFeatures ? Array.from(defaultVotedFeatures) : [],
    onChange: (arr) => onVotedFeaturesChange?.(new Set(arr)),
  })

  const votedFeatures = useMemo(
    () => new Set(votedFeaturesArray),
    [votedFeaturesArray]
  )

  const vote = useCallback(
    (featureId) => {
      if (disabled || votedFeatures.has(featureId)) {
        return
      }

      setVotes((prev) => ({
        ...prev,
        [featureId]: (prev?.[featureId] ?? 0) + 1,
      }))
      setVotedFeaturesArray((prev) => [...(prev ?? []), featureId])
    },
    [disabled, votedFeatures, setVotes, setVotedFeaturesArray]
  )

  const unvote = useCallback(
    (featureId) => {
      if (disabled || !votedFeatures.has(featureId)) {
        return
      }

      setVotes((prev) => ({
        ...prev,
        [featureId]: Math.max((prev?.[featureId] ?? 0) - 1, 0),
      }))
      setVotedFeaturesArray((prev) =>
        (prev ?? []).filter((id) => id !== featureId)
      )
    },
    [disabled, votedFeatures, setVotes, setVotedFeaturesArray]
  )

  const toggleVote = useCallback(
    (featureId) => {
      if (votedFeatures.has(featureId)) {
        unvote(featureId)
      } else {
        vote(featureId)
      }
    },
    [votedFeatures, vote, unvote]
  )

  const getVoteCount = useCallback(
    (featureId) => votes?.[featureId] ?? 0,
    [votes]
  )

  const hasVoted = useCallback(
    (featureId) => votedFeatures.has(featureId),
    [votedFeatures]
  )

  const contextValue = useMemo(
    () => ({
      votes: votes ?? {},
      votedFeatures,
      disabled,
      vote,
      unvote,
      toggleVote,
      getVoteCount,
      hasVoted,
    }),
    [
      votes,
      votedFeatures,
      disabled,
      vote,
      unvote,
      toggleVote,
      getVoteCount,
      hasVoted,
    ]
  )

  return (
    <FeatureVotingContext.Provider value={contextValue}>
      <ul
        aria-label="Feature voting list"
        data-disabled={disabled ? true : undefined}
        {...props}
      >
        {children}
      </ul>
    </FeatureVotingContext.Provider>
  )
}

/* -----------------------------------------------------------------------------
 * Group (optional sorting wrapper)
 * -------------------------------------------------------------------------- */

function FeatureVotingGroup({
  sortBy = "none",
  children,
  ...props
}) {
  const { votes } = useFeatureVotingContext()

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

function FeatureVotingItem({
  value,
  disabled: itemDisabled = false,
  children,
  ...props
}) {
  const {
    disabled: rootDisabled,
    hasVoted,
    getVoteCount,
  } = useFeatureVotingContext()
  const disabled = rootDisabled || itemDisabled
  const voted = hasVoted(value)
  const voteCount = getVoteCount(value)

  const itemContextValue = useMemo(
    () => ({ featureId: value, disabled }),
    [value, disabled]
  )

  return (
    <FeatureVotingItemContext.Provider value={itemContextValue}>
      <li
        data-disabled={disabled ? true : undefined}
        data-feature={value}
        data-slot="feature-voting-item"
        data-vote-count={voteCount}
        data-voted={voted ? true : undefined}
        {...props}
      >
        {children}
      </li>
    </FeatureVotingItemContext.Provider>
  )
}

/* -----------------------------------------------------------------------------
 * Trigger
 * -------------------------------------------------------------------------- */

function FeatureVotingTrigger({
  children,
  onClick,
  ...props
}) {
  const {
    toggleVote,
    hasVoted,
    disabled: rootDisabled,
  } = useFeatureVotingContext()
  const { featureId, disabled: itemDisabled } = useFeatureVotingItemContext()

  const disabled = rootDisabled || itemDisabled
  const voted = hasVoted(featureId)

  const handleClick = useCallback(
    (event) => {
      onClick?.(event)
      if (!(event.defaultPrevented || disabled)) {
        toggleVote(featureId)
      }
    },
    [onClick, disabled, toggleVote, featureId]
  )

  return (
    <button
      aria-label={voted ? "Remove vote for feature" : "Vote for feature"}
      aria-pressed={voted}
      data-slot="feature-voting-trigger"
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

function FeatureVotingCount({
  children,
  ...props
}) {
  const { getVoteCount } = useFeatureVotingContext()
  const { featureId } = useFeatureVotingItemContext()

  const count = getVoteCount(featureId)

  return (
    <span data-slot="feature-voting-count" {...props}>
      {children ?? count}
    </span>
  )
}

/* -----------------------------------------------------------------------------
 * Title
 * -------------------------------------------------------------------------- */

function FeatureVotingTitle({
  children,
  ...props
}) {
  return (
    <span data-slot="feature-voting-title" {...props}>
      {children}
    </span>
  )
}

/* -----------------------------------------------------------------------------
 * Description
 * -------------------------------------------------------------------------- */

function FeatureVotingDescription({
  children,
  ...props
}) {
  return (
    <span data-slot="feature-voting-description" {...props}>
      {children}
    </span>
  )
}

/* -----------------------------------------------------------------------------
 * Hook for external access
 * -------------------------------------------------------------------------- */

export function useFeatureVoting() {
  return useFeatureVotingContext()
}

/* -----------------------------------------------------------------------------
 * Export
 * -------------------------------------------------------------------------- */

export const FeatureVoting = {
  Root: FeatureVotingRoot,
  Group: FeatureVotingGroup,
  Item: FeatureVotingItem,
  Trigger: FeatureVotingTrigger,
  Count: FeatureVotingCount,
  Title: FeatureVotingTitle,
  Description: FeatureVotingDescription,
}

export {
  FeatureVotingRoot,
  FeatureVotingGroup,
  FeatureVotingItem,
  FeatureVotingTrigger,
  FeatureVotingCount,
  FeatureVotingTitle,
  FeatureVotingDescription,
}
