import { forwardRef } from "react";
import { BorderBeam } from "border-beam";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export const BorderBeamButton = forwardRef(function BorderBeamButton(
  {
    beamSize = "sm",
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
    className,
    ...buttonProps
  },
  ref
) {
  return (
    <BorderBeam
      active={active}
      borderRadius={borderRadius}
      brightness={brightness}
      className={cn(
        "overflow-visible! inline-flex w-fit min-w-0 flex-col items-stretch leading-none",
        borderBeamClassName
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
      <Button className={className} {...buttonProps} />
    </BorderBeam>
  )
})

BorderBeamButton.displayName = "BorderBeamButton"

export const BorderBeamIconButton = forwardRef(function BorderBeamIconButton(
  { size = "icon-sm", className, ...props },
  ref
) {
  return (
    <BorderBeamButton
      className={cn("!leading-none [&_svg]:block [&_svg]:shrink-0", className)}
      ref={ref}
      size={size}
      {...props}
    />
  )
})

BorderBeamIconButton.displayName = "BorderBeamIconButton"
