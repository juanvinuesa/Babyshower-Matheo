/**
 * @module PixelParagraph
 *
 * Renders a paragraph where specific words / phrases use a pixel font
 * while the rest of the text stays in the normal font.
 *
 * Setup — Geist Pixel Fonts with Tailwind CSS
 * =============================================
 *
 * All Geist fonts can be used through CSS variables:
 *
 *   GeistSans:          --font-geist-sans
 *   GeistMono:          --font-geist-mono
 *   GeistPixelSquare:   --font-geist-pixel-square
 *   GeistPixelGrid:     --font-geist-pixel-grid
 *   GeistPixelCircle:   --font-geist-pixel-circle
 *   GeistPixelTriangle: --font-geist-pixel-triangle
 *   GeistPixelLine:     --font-geist-pixel-line
 *
 * 1. Register the font variables in app/layout.js:
 *
 *   ```js
 *   import { GeistSans } from "geist/font/sans";
 *   import { GeistMono } from "geist/font/mono";
 *   import { GeistPixelSquare } from "geist/font/pixel";
 *
 *   export default function RootLayout({ children }) {
 *     return (
 *       <html
 *         lang="en"
 *         className={`${GeistSans.variable} ${GeistMono.variable} ${GeistPixelSquare.variable}`}
 *       >
 *         <body>{children}</body>
 *       </html>
 *     );
 *   }
 *   ```
 *
 * 2. Map the CSS variables in your Tailwind CSS v4 theme (tailwind.css):
 *
 *   ```css
 *   @theme {
 *     --font-sans: var(--font-geist-sans);
 *     --font-mono: var(--font-geist-mono);
 *     --font-pixel-square: var(--font-geist-pixel-square);
 *     --font-pixel-grid: var(--font-geist-pixel-grid);
 *     --font-pixel-circle: var(--font-geist-pixel-circle);
 *     --font-pixel-triangle: var(--font-geist-pixel-triangle);
 *     --font-pixel-line: var(--font-geist-pixel-line);
 *   }
 *   ```
 *
 * Once configured, the `font-pixel-*` utility classes used by this
 * component will resolve correctly.
 *
 * @example
 * <PixelParagraph
 *   text="54+ animated components and effects. Free, open source, and built to drop into any shadcn/ui project."
 *   pixelWords={["animated", "shadcn/ui"]}
 *   font="square"
 *   className="text-lg text-muted-foreground"
 * />
 */

import { cn } from "@/lib/utils"

const PIXEL_FONT_MAP = {
  square: "font-pixel-square",
  grid: "font-pixel-grid",
  circle: "font-pixel-circle",
  triangle: "font-pixel-triangle",
  line: "font-pixel-line",
}

/**
 * Splits `text` into alternating plain / pixel segments based on the
 * provided `pixelWords`.  Longer phrases are matched first so that
 * "shadcn/ui" wins over a hypothetical "ui" match.
 */
function splitTextByPixelWords(text, pixelWords) {
  if (pixelWords.length === 0) return [{ type: "plain", text }]

  // Sort by length descending so longer matches take priority
  const sorted = [...pixelWords].sort((a, b) => b.length - a.length)

  // Escape regex-special characters in each word
  const escaped = sorted.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))

  const pattern = new RegExp(`(${escaped.join("|")})`, "g")

  const segments = []
  let lastIndex = 0

  for (const match of text.matchAll(pattern)) {
    const matchStart = match.index ?? 0
    if (matchStart > lastIndex) {
      segments.push({ type: "plain", text: text.slice(lastIndex, matchStart) })
    }
    segments.push({ type: "pixel", text: match[0] })
    lastIndex = matchStart + match[0].length
  }

  if (lastIndex < text.length) {
    segments.push({ type: "plain", text: text.slice(lastIndex) })
  }

  return segments
}

/**
 * Paragraph that renders specific words / phrases in a pixel font
 * while the rest stays in the normal typeface.
 *
 * @example
 * <PixelParagraph
 *   text="54+ animated components and effects. Free, open source, and built to drop into any shadcn/ui project."
 *   pixelWords={["animated", "shadcn/ui"]}
 *   font="square"
 *   className="text-lg text-muted-foreground"
 * />
 */
export function PixelParagraph({
  text,
  pixelWords = [],
  as: Tag = "p",
  className,
  font = "square",
  pixelWordClassName,
  ...props
}) {
  const segments = splitTextByPixelWords(text, pixelWords)
  const fontClass = PIXEL_FONT_MAP[font]

  return (
    <Tag data-slot="pixel-paragraph" className={cn(className)} {...props}>
      {segments.map((segment, index) => {
        const key = `${segment.type}-${segment.text}-${index}`
        return segment.type === "pixel" ? (
          <span
            key={key}
            data-slot="pixel-word"
            className={cn(fontClass, pixelWordClassName)}
          >
            {segment.text}
          </span>
        ) : (
          <span key={key}>{segment.text}</span>
        )
      })}
    </Tag>
  )
}
