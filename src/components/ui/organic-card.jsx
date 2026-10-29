import { createContext, useContext } from "react";
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

const OrganicCardContext = createContext(null)

function useOrganicCardContext() {
  const context = useContext(OrganicCardContext)

  if (!context) {
    throw new Error("OrganicCard components must be used inside OrganicCard.")
  }

  return context
}

export function OrganicCard({
  children,
  backgroundColor = "hsl(var(--card))",
  className,
  ...props
}) {
  const sharedClassName =
    "group/calloutCard group/organic-card relative flex h-full w-full max-w-[617px] flex-col overflow-hidden rounded-lg lg:rounded-xl"

  if ("href" in props && props.href !== undefined) {
    const { href, ...linkProps } = props

    return (
      <OrganicCardContext.Provider value={{ backgroundColor }}>
        <Link
          {...linkProps}
          className={cn(sharedClassName, className)}
          data-slot="organic-card"
          href={href}
        >
          {children}
        </Link>
      </OrganicCardContext.Provider>
    )
  }

  return (
    <OrganicCardContext.Provider value={{ backgroundColor }}>
      <div
        {...(props)}
        className={cn(sharedClassName, className)}
        data-slot="organic-card"
      >
        {children}
      </div>
    </OrganicCardContext.Provider>
  );
}

export function OrganicCardBody({
  className,
  style,
  ...props
}) {
  const { backgroundColor } = useOrganicCardContext()

  return (
    <div
      {...props}
      className={cn(
        "flex w-full flex-1 flex-col justify-between rounded-t-lg p-4 text-foreground lg:rounded-t-xl",
        className
      )}
      data-slot="organic-card-body"
      style={{ backgroundColor, ...style }}
    />
  )
}

export function OrganicCardImage({
  alt = "Card image",
  className,
  style,
  height = 208,
  width = 670,
  ...props
}) {
  return (
    <Image
      {...props}
      alt={alt}
      className={cn(
        "mb-5 h-[138px] w-full animate-fade-in-up rounded object-cover opacity-0 sm:h-[168px]",
        className
      )}
      data-slot="organic-card-image"
      height={height}
      style={{ animationDelay: "150ms", ...style }}
      width={width}
    />
  )
}

export function OrganicCardEyebrow({
  className,
  style,
  ...props
}) {
  return (
    <p
      {...props}
      className={cn(
        "mb-5 animate-fade-in-up font-medium text-muted-foreground text-xs uppercase tracking-wider opacity-0",
        className
      )}
      data-slot="organic-card-eyebrow"
      style={{ animationDelay: "200ms", ...style }}
    />
  )
}

export function OrganicCardTitle({
  className,
  style,
  ...props
}) {
  return (
    <h3
      {...props}
      className={cn(
        "mb-2 animate-fade-in-up font-medium text-foreground text-xl opacity-0 lg:text-2xl",
        className
      )}
      data-slot="organic-card-title"
      style={{ animationDelay: "250ms", ...style }}
    />
  )
}

export function OrganicCardDescription({
  className,
  style,
  ...props
}) {
  return (
    <p
      {...props}
      className={cn(
        "animate-fade-in-up text-pretty text-base text-muted-foreground leading-relaxed opacity-0 lg:text-lg",
        className
      )}
      data-slot="organic-card-description"
      style={{ animationDelay: "300ms", ...style }}
    />
  )
}

export function OrganicCardBand({
  className,
  ...props
}) {
  const { backgroundColor } = useOrganicCardContext()

  return (
    <svg
      {...props}
      className={cn("-mt-px -mr-px", className)}
      data-slot="organic-card-band"
      preserveAspectRatio="none"
      viewBox="0 0 670 111"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Callout card band</title>
      <path
        className="w-full transition-[d] duration-300 ease-in-out group-hover/calloutCard:[d:path('M670_0H0V91C0_102.046_8.9543_111_20_111H470C477.575_111_484.499_106.721_487.888_99.9469L522.347_31.0531C525.736_24.2789_532.66_20_540.234_20H650C661.046_20_670_11.0457_670_0Z')]"
        d="M670 0H0V91C0 102.046 8.9543 111 20 111H518.641C526.216 111 533.14 106.721 536.529 99.9469L570.988 31.0531C574.377 24.2789 581.301 20 588.875 20H650C661.046 20 670 11.0457 670 0Z"
        fill={backgroundColor}
      />
    </svg>
  )
}

export function OrganicCardFooter({
  className,
  ...props
}) {
  return (
    <div
      {...props}
      className={cn(
        "absolute bottom-3 flex w-full items-center justify-between px-4 md:bottom-4",
        className
      )}
      data-slot="organic-card-footer"
    />
  )
}

export function OrganicCardFooterLabel({
  className,
  style,
  children = "Read more",
  ...props
}) {
  return (
    <p
      {...props}
      className={cn(
        "animate-fade-in-up font-medium text-base text-foreground opacity-0 lg:text-lg",
        className
      )}
      data-slot="organic-card-footer-label"
      style={{ animationDelay: "350ms", ...style }}
    >
      {children}
    </p>
  )
}

export function OrganicCardFooterIcon({
  className,
  style,
  children,
  ...props
}) {
  return (
    <div
      {...props}
      className={cn(
        "flex size-8 animate-fade-in-up items-center justify-center rounded-full bg-foreground text-background opacity-0 transition-transform duration-300 group-hover/organic-card:scale-110",
        className
      )}
      data-slot="organic-card-footer-icon"
      style={{ animationDelay: "400ms", ...style }}
    >
      {children ?? <ArrowRight className="size-4" />}
    </div>
  )
}
