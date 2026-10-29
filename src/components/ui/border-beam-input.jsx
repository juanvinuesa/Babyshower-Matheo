"use client";
import { forwardRef } from "react";
import { Input as InputPrimitive } from "@base-ui/react/input"
import { BorderBeam } from "border-beam";

import { cn } from "@/lib/utils"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"

/** Mirrors `components/ui/input` shell — adjust here for border-beam-specific fields. */
const borderBeamInputPrimitiveClass =
  "box-border h-7 w-full min-w-0 self-stretch rounded-md border border-input bg-input/20 px-2 py-0.5 text-sm outline-none transition-colors file:inline-flex file:h-6 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-xs/relaxed placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[2px] focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[2px] aria-invalid:ring-destructive/20 md:text-xs/relaxed dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"

/**
 * Beam layers use `inset:0` on this box — it must match the control width. `flex` + `stretch`
 * avoids shrink-to-content in flex parents; `max-w-full` keeps `className` max-width in sync.
 */
const borderBeamFieldShellClass =
  "flex w-full min-w-0 max-w-full flex-col items-stretch overflow-visible!"

export const BorderBeamInput = forwardRef(function BorderBeamInput(
  {
    beamSize = "line",
    borderBeamClassName,
    borderBeamStyle,
    theme = "auto",
    colorVariant,
    staticColors,
    duration,
    active,
    borderRadius,
    brightness,
    saturation,
    hueRange,
    strength,
    onActivate,
    onDeactivate,
    pill,
    className,
    type,
    ...inputProps
  },
  ref
) {
  return (
    <BorderBeam
      active={active}
      borderRadius={borderRadius}
      brightness={brightness}
      className={cn(
        borderBeamFieldShellClass,
        borderBeamClassName,
        className
      )}
      colorVariant={colorVariant}
      duration={duration}
      hueRange={hueRange}
      onActivate={onActivate}
      onDeactivate={onDeactivate}
      ref={ref}
      saturation={saturation}
      size={beamSize}
      staticColors={staticColors}
      strength={strength}
      style={borderBeamStyle}
      theme={theme}
    >
      <InputPrimitive
        className={cn(
          borderBeamInputPrimitiveClass,
          pill && "h-9 rounded-full",
          className
        )}
        data-slot="input"
        type={type}
        {...inputProps}
      />
    </BorderBeam>
  )
})

BorderBeamInput.displayName = "BorderBeamInput"

export const BorderBeamInputGroup = forwardRef(function BorderBeamInputGroup(
  {
    beamSize = "line",
    borderBeamClassName,
    borderBeamStyle,
    theme = "auto",
    colorVariant,
    staticColors,
    duration,
    active,
    borderRadius,
    brightness,
    saturation,
    hueRange,
    strength,
    onActivate,
    onDeactivate,
    pill,
    className,
    ...groupProps
  },
  ref
) {
  return (
    <BorderBeam
      active={active}
      borderRadius={borderRadius}
      brightness={brightness}
      className={cn(borderBeamFieldShellClass, borderBeamClassName, className)}
      colorVariant={colorVariant}
      duration={duration}
      hueRange={hueRange}
      onActivate={onActivate}
      onDeactivate={onDeactivate}
      ref={ref}
      saturation={saturation}
      size={beamSize}
      staticColors={staticColors}
      strength={strength}
      style={borderBeamStyle}
      theme={theme}
    >
      <InputGroup
        className={cn(
          "min-w-0 self-stretch",
          pill && "h-9 rounded-full has-[textarea]:rounded-md",
          className
        )}
        {...groupProps}
      />
    </BorderBeam>
  )
})

BorderBeamInputGroup.displayName = "BorderBeamInputGroup"

export function BorderBeamInputGroupAddon(
  props
) {
  return <InputGroupAddon {...props} />
}
BorderBeamInputGroupAddon.displayName = "BorderBeamInputGroupAddon"

export function BorderBeamInputGroupButton(
  props
) {
  return <InputGroupButton {...props} />
}
BorderBeamInputGroupButton.displayName = "BorderBeamInputGroupButton"

export function BorderBeamInputGroupInput(
  props
) {
  return <InputGroupInput {...props} />
}
BorderBeamInputGroupInput.displayName = "BorderBeamInputGroupInput"

export function BorderBeamInputGroupText(
  props
) {
  return <InputGroupText {...props} />
}
BorderBeamInputGroupText.displayName = "BorderBeamInputGroupText"

export function BorderBeamInputGroupTextarea(
  props
) {
  return <InputGroupTextarea {...props} />
}
BorderBeamInputGroupTextarea.displayName = "BorderBeamInputGroupTextarea"
