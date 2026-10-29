import * as React from "react"
import createGlobe from "cobe"
import { motion, useInView, useReducedMotion } from "motion/react";
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

const DEFAULT_KEY = "default"

// Showcase: Default (matches hero globe exactly)
export const showcaseDefaultMarkers = [
  {
    id: "default-sf",
    location: [37.7595, -122.4367],
    label: "San Francisco",
  },
  {
    id: "default-nyc",
    location: [40.7128, -74.006],
    label: "New York",
  },
  {
    id: "default-tokyo",
    location: [35.6762, 139.6503],
    label: "Tokyo",
  },
  {
    id: "default-london",
    location: [51.5074, -0.1278],
    label: "London",
  },
  {
    id: "default-sydney",
    location: [-33.8688, 151.2093],
    label: "Sydney",
  },
  {
    id: "default-capetown",
    location: [-33.9249, 18.4241],
    label: "Cape Town",
  },
  {
    id: "default-dubai",
    location: [25.2048, 55.2708],
    label: "Dubai",
  },
  //   {
  //     id: "default-paris",
  //     location: [48.8566, 2.3522] as [number, number],
  //     label: "Paris",
  //   },
  {
    id: "default-saopaulo",
    location: [-23.5505, -46.6333],
    label: "São Paulo",
  },
]

export const showcaseDefaultArcs = [
  {
    id: "default-sf-tokyo",
    from: [37.7595, -122.4367],
    to: [35.6762, 139.6503],
    label: "SF → Tokyo",
  },
  {
    id: "default-nyc-london",
    from: [40.7128, -74.006],
    to: [51.5074, -0.1278],
    label: "NYC → London",
  },
]

// Showcase: Stickers
export const stickerMarkers = [
  {
    id: "sticker-paris",
    location: [48.86, 2.35],
    sticker: "🥐",
  },
  {
    id: "sticker-tokyo",
    location: [35.68, 139.65],
    sticker: "🗼",
  },
  {
    id: "sticker-nyc",
    location: [40.71, -74.01],
    sticker: "🍎",
  },
  {
    id: "sticker-rio",
    location: [-22.91, -43.17],
    sticker: "🎭",
  },
  {
    id: "sticker-sydney",
    location: [-33.87, 151.21],
    sticker: "🐨",
  },
  {
    id: "sticker-cairo",
    location: [30.04, 31.24],
    sticker: "🐪",
  },
  {
    id: "sticker-rome",
    location: [41.9, 12.5],
    sticker: "🍕",
  },
  {
    id: "sticker-mexico",
    location: [19.43, -99.13],
    sticker: "🌮",
  },
  {
    id: "sticker-india",
    location: [28.61, 77.21],
    sticker: "🐘",
  },
  {
    id: "sticker-iceland",
    location: [64.15, -21.94],
    sticker: "🧊",
  },
  {
    id: "sticker-london",
    location: [51.51, -0.13],
    sticker: "☕",
  },
  {
    id: "sticker-hawaii",
    location: [21.31, -157.86],
    sticker: "🏄",
  },
  {
    id: "sticker-amsterdam",
    location: [52.37, 4.9],
    sticker: "🚲",
  },
  {
    id: "sticker-beijing",
    location: [39.9, 116.4],
    sticker: "🐉",
  },
  {
    id: "sticker-moscow",
    location: [55.75, 37.62],
    sticker: "🪆",
  },
  {
    id: "sticker-seoul",
    location: [37.57, 126.98],
    sticker: "🎮",
  },
]

// Showcase: Live badge
export const liveMarkers = [
  { id: "live-sf", location: [37.78, -122.44] },
  { id: "live-london", location: [51.51, -0.13] },
  { id: "live-tokyo", location: [35.68, 139.65] },
  { id: "live-paris", location: [48.86, 2.35] },
  { id: "live-sydney", location: [-33.87, 151.21] },
  { id: "live-nyc", location: [40.71, -74.01] },
]

// Showcase: Interactive markers
export const interactiveMarkers = [
  {
    id: "hq",
    location: [37.78, -122.44],
    name: "HQ",
    users: 1420,
  },
  {
    id: "eu",
    location: [52.52, 13.41],
    name: "EU",
    users: 892,
  },
  {
    id: "asia",
    location: [35.68, 139.65],
    name: "Asia",
    users: 2103,
  },
  {
    id: "latam",
    location: [-23.55, -46.63],
    name: "LATAM",
    users: 567,
  },
  {
    id: "mena",
    location: [25.2, 55.27],
    name: "MENA",
    users: 734,
  },
  {
    id: "oceania",
    location: [-33.87, 151.21],
    name: "APAC",
    users: 445,
  },
]

// Showcase: Polaroid photos
export const polaroidMarkers = [
  {
    id: "polaroid-sf",
    location: [37.78, -122.44],
    image: "/sf.jpg",
    caption: "San Francisco",
    rotate: -5,
  },
  {
    id: "polaroid-nyc",
    location: [40.71, -74.01],
    image: "/nyc.jpg",
    caption: "New York",
    rotate: 4,
  },
  {
    id: "polaroid-tokyo",
    location: [35.68, 139.65],
    image: "/tokyo.jpg",
    caption: "Tokyo",
    rotate: -3,
  },
  {
    id: "polaroid-sydney",
    location: [-33.87, 151.21],
    image: "/sydney.jpg",
    caption: "Sydney",
    rotate: 6,
  },
  {
    id: "polaroid-beijing",
    location: [39.9, 116.4],
    image: "/beijing.jpg",
    caption: "Beijing",
    rotate: -4,
  },
  {
    id: "polaroid-egypt",
    location: [29.98, 31.13],
    image: "/egypt.jpg",
    caption: "Egypt",
    rotate: 3,
  },
  {
    id: "polaroid-pisa",
    location: [43.72, 10.4],
    image: "/pisa.jpg",
    caption: "Pisa",
    rotate: -6,
  },
  {
    id: "polaroid-singapore",
    location: [1.35, 103.82],
    image: "/singapore.jpg",
    caption: "Singapore",
    rotate: 5,
  },
]

// Showcase: Pulse animations
export const pulseMarkers = [
  { id: "pulse-1", location: [51.51, -0.13], delay: 0 },
  { id: "pulse-2", location: [40.71, -74.01], delay: 0.5 },
  { id: "pulse-3", location: [35.68, 139.65], delay: 1 },
  { id: "pulse-4", location: [-33.87, 151.21], delay: 1.5 },
]

// Showcase: Highlight bars
export const barMarkers = [
  {
    id: "bar-1",
    location: [40.71, -74.01],
    value: 85,
    label: "NYC",
  },
  {
    id: "bar-2",
    location: [51.51, -0.13],
    value: 62,
    label: "London",
  },
  {
    id: "bar-3",
    location: [35.68, 139.65],
    value: 94,
    label: "Tokyo",
  },
  {
    id: "bar-4",
    location: [1.35, 103.82],
    value: 78,
    label: "Singapore",
  },
]

// Showcase: Analytics (visitor tracking)
export const analyticsMarkers = [
  {
    id: "vis-1",
    location: [40.71, -74.01],
    visitors: 847,
    trend: 12,
  },
  {
    id: "vis-2",
    location: [51.51, -0.13],
    visitors: 623,
    trend: -3,
  },
  {
    id: "vis-3",
    location: [35.68, 139.65],
    visitors: 412,
    trend: 8,
  },
  {
    id: "vis-4",
    location: [48.86, 2.35],
    visitors: 385,
    trend: 5,
  },
  {
    id: "vis-5",
    location: [-33.87, 151.21],
    visitors: 201,
    trend: 15,
  },
  {
    id: "vis-6",
    location: [52.52, 13.41],
    visitors: 178,
    trend: -1,
  },
]

// Showcase: Flights
export const flightArcs = [
  {
    id: "flight-1",
    from: [40.64, -73.78],
    to: [51.47, -0.46],
  },
  {
    id: "flight-2",
    from: [51.47, -0.46],
    to: [25.25, 55.36],
  },
  {
    id: "flight-3",
    from: [35.55, 139.78],
    to: [37.62, -122.38],
  },
  {
    id: "flight-4",
    from: [1.36, 103.99],
    to: [-33.95, 151.18],
  },
  {
    id: "flight-5",
    from: [48.86, 2.35],
    to: [40.64, -73.78],
  },
]

export const flightMarkers = [
  { id: "apt-jfk", location: [40.64, -73.78] },
  { id: "apt-lhr", location: [51.47, -0.46] },
  { id: "apt-dxb", location: [25.25, 55.36] },
  { id: "apt-nrt", location: [35.55, 139.78] },
  { id: "apt-sfo", location: [37.62, -122.38] },
  { id: "apt-sin", location: [1.36, 103.99] },
  { id: "apt-syd", location: [-33.95, 151.18] },
  { id: "apt-cdg", location: [48.86, 2.35] },
]

// Showcase: Labels (text stickers)
export const labelMarkers = [
  {
    id: "label-1",
    location: [48.86, 2.35],
    text: "visit soon!",
    color: "#e84855",
    rotate: -8,
  },
  {
    id: "label-2",
    location: [35.68, 139.65],
    text: "amazing food",
    color: "#2a9d8f",
    rotate: 5,
  },
  {
    id: "label-3",
    location: [40.71, -74.01],
    text: "home ♥",
    color: "#e76f51",
    rotate: -3,
  },
  {
    id: "label-4",
    location: [-33.87, 151.21],
    text: "bucket list",
    color: "#264653",
    rotate: 7,
  },
  {
    id: "label-5",
    location: [51.51, -0.13],
    text: "rainy but fun",
    color: "#7b2cbf",
    rotate: -5,
  },
  {
    id: "label-6",
    location: [-22.91, -43.17],
    text: "samba time!",
    color: "#f4a261",
    rotate: 4,
  },
  {
    id: "label-7",
    location: [55.75, 37.62],
    text: "cold but cozy",
    color: "#457b9d",
    rotate: -6,
  },
  {
    id: "label-8",
    location: [25.2, 55.27],
    text: "so luxurious",
    color: "#d4a373",
    rotate: 3,
  },
  {
    id: "label-9",
    location: [1.35, 103.82],
    text: "foodie heaven",
    color: "#e63946",
    rotate: -4,
  },
  {
    id: "label-10",
    location: [-34.6, -58.38],
    text: "tango nights",
    color: "#9d4edd",
    rotate: 6,
  },
]

// Showcase: Satellites
export const satelliteMarkers = [
  { id: "sat-1", location: [45.0, -120.0] },
  { id: "sat-2", location: [30.0, 45.0] },
  { id: "sat-3", location: [-15.0, 100.0] },
  { id: "sat-4", location: [60.0, -30.0] },
  { id: "sat-5", location: [-40.0, -60.0] },
  { id: "sat-6", location: [10.0, 150.0] },
  { id: "sat-7", location: [55.0, 80.0] },
  { id: "sat-8", location: [-25.0, 20.0] },
  { id: "sat-9", location: [70.0, 25.0] },
  { id: "sat-10", location: [-5.0, -75.0] },
  { id: "sat-11", location: [35.0, -95.0] },
  { id: "sat-12", location: [-50.0, 140.0] },
  { id: "sat-13", location: [20.0, -20.0] },
  { id: "sat-14", location: [50.0, 120.0] },
  { id: "sat-15", location: [-30.0, 70.0] },
  { id: "sat-16", location: [5.0, -150.0] },
]

// Showcase: CDN (Vercel-style edge network)
export const cdnMarkers = [
  {
    id: "cdn-iad",
    location: [38.95, -77.45],
    region: "iad1",
  },
  {
    id: "cdn-sfo",
    location: [37.62, -122.38],
    region: "sfo1",
  },
  {
    id: "cdn-cdg",
    location: [49.01, 2.55],
    region: "cdg1",
  },
  {
    id: "cdn-hnd",
    location: [35.55, 139.78],
    region: "hnd1",
  },
  {
    id: "cdn-syd",
    location: [-33.95, 151.18],
    region: "syd1",
  },
  {
    id: "cdn-gru",
    location: [-23.43, -46.47],
    region: "gru1",
  },
  {
    id: "cdn-sin",
    location: [1.36, 103.99],
    region: "sin1",
  },
  {
    id: "cdn-arn",
    location: [59.65, 17.93],
    region: "arn1",
  },
  {
    id: "cdn-dub",
    location: [53.43, -6.25],
    region: "dub1",
  },
  {
    id: "cdn-bom",
    location: [19.09, 72.87],
    region: "bom1",
  },
]

export const cdnArcs = [
  {
    id: "cdn-arc-1",
    from: [38.95, -77.45], // IAD
    to: [49.01, 2.55], // CDG
    traffic: "2.4 TB/s",
  },
  {
    id: "cdn-arc-2",
    from: [37.62, -122.38], // SFO
    to: [35.55, 139.78], // HND
    traffic: "1.8 TB/s",
  },
  {
    id: "cdn-arc-3",
    from: [49.01, 2.55], // CDG
    to: [1.36, 103.99], // SIN
    traffic: "1.2 TB/s",
  },
  {
    id: "cdn-arc-4",
    from: [38.95, -77.45], // IAD
    to: [-23.43, -46.47], // GRU
    traffic: "890 GB/s",
  },
  {
    id: "cdn-arc-5",
    from: [35.55, 139.78], // HND
    to: [-33.95, 151.18], // SYD
    traffic: "720 GB/s",
  },
  {
    id: "cdn-arc-6",
    from: [49.01, 2.55], // CDG
    to: [19.09, 72.87], // BOM
    traffic: "650 GB/s",
  },
]

// Showcase: Weather emojis
export const weatherMarkers = [
  {
    id: "weather-1",
    location: [50.0, -100.0],
    emoji: "☀️",
  },
  { id: "weather-2", location: [55.0, 10.0], emoji: "🌧️" },
  { id: "weather-3", location: [25.0, 80.0], emoji: "⛈️" },
  {
    id: "weather-4",
    location: [-10.0, -60.0],
    emoji: "🌤️",
  },
  { id: "weather-5", location: [65.0, 100.0], emoji: "❄️" },
  { id: "weather-6", location: [35.0, 140.0], emoji: "🌸" },
  { id: "weather-7", location: [-30.0, 25.0], emoji: "🌈" },
  { id: "weather-8", location: [40.0, -5.0], emoji: "☁️" },
  {
    id: "weather-9",
    location: [-45.0, 170.0],
    emoji: "🌊",
  },
  {
    id: "weather-10",
    location: [15.0, -130.0],
    emoji: "🌴",
  },
  {
    id: "weather-11",
    location: [70.0, -40.0],
    emoji: "🌨️",
  },
  {
    id: "weather-12",
    location: [-20.0, 130.0],
    emoji: "🔥",
  },
  { id: "weather-13", location: [5.0, 40.0], emoji: "🌪️" },
  { id: "weather-14", location: [45.0, 60.0], emoji: "🌙" },
  {
    id: "weather-15",
    location: [-35.0, -70.0],
    emoji: "⭐",
  },
  {
    id: "weather-16",
    location: [20.0, -20.0],
    emoji: "🌞",
  },
]

// Showcase configs
export const showcaseConfigs = {
  default: {
    theta: 0.2,
    dark: 0,
    mapBrightness: 10,
    markerColor: [0.3, 0.45, 0.85],
    baseColor: [1, 1, 1],
    arcColor: [0.3, 0.45, 0.85],
    markerSize: 0.025,
    markerElevation: 0.01,
  },
  stickers: {
    theta: 0.2,
    dark: 0,
    mapBrightness: 8,
    markerColor: [0.85, 0.35, 0.6],
    baseColor: [1, 1, 1],
    arcColor: [0.9, 0.4, 0.7],
    markerSize: 0.03,
    markerElevation: 0,
  },
  live: {
    theta: 0.2,
    dark: 0,
    mapBrightness: 10,
    markerColor: [0.9, 0.2, 0.2],
    baseColor: [0.95, 0.95, 0.95],
    arcColor: [0.9, 0.3, 0.3],
    markerSize: 0.02,
    markerElevation: 0.01,
  },
  pulse: {
    theta: 0.2,
    dark: 1,
    mapBrightness: 10,
    markerColor: [0.2, 0.8, 0.9],
    baseColor: [0.5, 0.5, 0.5],
    arcColor: [0.3, 0.85, 0.95],
    markerSize: 0.025,
    markerElevation: 0,
  },
  interactive: {
    theta: 0.2,
    dark: 0,
    mapBrightness: 10,
    markerColor: [0.1, 0.2, 0.45],
    baseColor: [1, 1, 1],
    arcColor: [0.15, 0.3, 0.55],
    markerSize: 0.025,
    markerElevation: 0,
  },
  polaroids: {
    theta: 0.2,
    dark: 0,
    mapBrightness: 9,
    markerColor: [0.4, 0.6, 0.9],
    baseColor: [1, 1, 1],
    arcColor: [0.5, 0.7, 1],
    markerSize: 0.02,
    markerElevation: 0,
  },
  bars: {
    theta: 0.2,
    dark: 0,
    mapBrightness: 9,
    markerColor: [0.15, 0.55, 0.55],
    baseColor: [1, 1, 1],
    arcColor: [0.2, 0.6, 0.6],
    markerSize: 0.02,
    markerElevation: 0,
  },
  analytics: {
    theta: 0.2,
    dark: 0,
    mapBrightness: 10,
    markerColor: [0.3, 0.85, 0.45],
    baseColor: [1, 1, 1],
    arcColor: [0.25, 0.9, 0.5],
    markerSize: 0.04,
    markerElevation: 0,
  },
  flights: {
    theta: 0.2,
    dark: 0.05,
    mapBrightness: 8,
    markerColor: [0.3, 0.55, 0.95],
    baseColor: [0.98, 0.98, 1],
    arcColor: [0.35, 0.6, 1],
    markerSize: 0.02,
    markerElevation: 0,
  },
  labels: {
    theta: 0.2,
    dark: 0,
    mapBrightness: 9,
    markerColor: [0.55, 0.35, 0.75],
    baseColor: [1, 1, 1],
    arcColor: [0.6, 0.4, 0.8],
    markerSize: 0.025,
    markerElevation: 0,
  },
  satellites: {
    theta: 0.2,
    dark: 0.01,
    mapBrightness: 9,
    markerColor: [0.9, 0.9, 0.9],
    baseColor: [0.95, 0.95, 0.95],
    arcColor: [0.5, 0.8, 1],
    markerSize: 0.03,
    markerElevation: 0.15,
  },
  weather: {
    theta: 0.2,
    dark: 0,
    mapBrightness: 10,
    markerColor: [0.4, 0.7, 0.95],
    baseColor: [0.98, 0.98, 1],
    arcColor: [0.5, 0.8, 1],
    markerSize: 0.025,
    markerElevation: 0.12,
  },
  cdn: {
    theta: 0.2,
    dark: 0,
    mapBrightness: 10,
    markerColor: [0, 0, 0],
    baseColor: [1, 1, 1],
    arcColor: [0, 0, 0],
    markerSize: 0.012,
    markerElevation: 0.02,
  },
}

export const showcases = [
  { name: "Globe hero", key: "default" },
  { name: "▲ CDN", key: "cdn" },
  { name: "Stickers", key: "stickers" },
  { name: "Labels", key: "labels" },
  { name: "Satellites", key: "satellites" },
  { name: "Polaroids", key: "polaroids" },
  { name: "Live Badge", key: "live" },
  { name: "Flights", key: "flights" },
  { name: "Interactive", key: "interactive" },
  { name: "Analytics", key: "analytics" },
  { name: "Pulse", key: "pulse" },
  { name: "Weather", key: "weather" },
  { name: "Bars", key: "bars" }
]

// Helper to get markers for a showcase
export function getShowcaseMarkers(key, size) {
  const markerArrays = {
    default: showcaseDefaultMarkers,
    cdn: cdnMarkers,
    stickers: stickerMarkers,
    live: liveMarkers,
    interactive: interactiveMarkers,
    polaroids: polaroidMarkers,
    pulse: pulseMarkers,
    bars: barMarkers,
    analytics: analyticsMarkers,
    flights: flightMarkers,
    labels: labelMarkers,
    satellites: satelliteMarkers,
    weather: weatherMarkers,
  }
  const arr = markerArrays[key]
  if (!arr) {
    return []
  }
  return arr.map((m) => ({ location: m.location, size, id: m.id }))
}

// Helper to get arcs for a showcase
export function getShowcaseArcs(key) {
  if (key === "default") {
    return showcaseDefaultArcs.map((a) => ({
      from: a.from,
      to: a.to,
      id: a.id,
    }))
  }
  if (key === "flights") {
    return flightArcs.map((a) => ({ ...a }))
  }
  if (key === "cdn") {
    return cdnArcs.map((a) => ({ ...a }))
  }
  return []
}

// ---------------------------------------------------------------------------
// Theme → RGB for the WebGL globe (dark mode only; light matches the default demo look)
// ---------------------------------------------------------------------------

const CSS_RGB_RE = /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i

function probeCssColorToRgb01(color) {
  if (typeof document === "undefined") {
    return [0.5, 0.5, 0.5]
  }
  const el = document.createElement("div")
  el.style.color = color
  el.style.position = "fixed"
  el.style.left = "0"
  el.style.top = "0"
  el.style.opacity = "0"
  el.style.pointerEvents = "none"
  document.body.appendChild(el)
  const rgb = getComputedStyle(el).color
  document.body.removeChild(el)
  const m = rgb.match(CSS_RGB_RE)
  if (!m) {
    return [0.5, 0.5, 0.5]
  }
  return [Number(m[1]) / 255, Number(m[2]) / 255, Number(m[3]) / 255]
}

function cssVarTriplet(name) {
  return probeCssColorToRgb01(`var(${name})`)
}

function clamp01(n) {
  return Math.min(1, Math.max(0, n))
}

function saturateRgb(rgb, amount) {
  const lum = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
  return [
    clamp01(lum + (rgb[0] - lum) * amount),
    clamp01(lum + (rgb[1] - lum) * amount),
    clamp01(lum + (rgb[2] - lum) * amount),
  ]
}

function useResolvedIsDark() {
  const { resolvedTheme } = useTheme()
  return resolvedTheme === "dark"
}

function anchorLabelStyle(id, kind) {
  const visible =
    kind === "marker" ? `--cobe-visible-${id}` : `--cobe-visible-arc-${id}`
  const anchor = kind === "marker" ? `--cobe-${id}` : `--cobe-arc-${id}`
  return {
    position: "absolute",
    bottom: "anchor(top)",
    filter: `blur(calc((1 - var(${visible}, 0)) * 8px))`,
    left: "anchor(center)",
    opacity: `var(${visible}, 0)`,
    positionAnchor: anchor,
    transform: "translateX(-50%)",
    transition: "opacity 0.3s ease, filter 0.3s ease"
  };
}

const demoConfig = showcaseConfigs[DEFAULT_KEY]

// ---------------------------------------------------------------------------
// Heading motion (aligned with marketing-hero-dither)
// ---------------------------------------------------------------------------

const textGroupVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
}

const textWordVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", duration: 0.65, bounce: 0.14 },
  },
}

const textBlockVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", duration: 0.65, bounce: 0.1, delay: 0.18 },
  },
}

const eyebrowVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", duration: 0.5, bounce: 0.1 },
  },
}

function AnimatedTextLine({
  content,
  splitWords = false
}) {
  const reduceMotion = useReducedMotion()

  if (!splitWords || typeof content !== "string") {
    return (
      <motion.span
        className="inline-block"
        variants={reduceMotion ? undefined : textWordVariants}
      >
        {content}
      </motion.span>
    )
  }

  const words = content.split(" ")

  return (
    <motion.span
      className="text-balance"
      variants={reduceMotion ? undefined : textGroupVariants}
    >
      {words.map((word, index) => (
        <motion.span
          className="mr-[0.25em] inline-block last:mr-0"
          key={`${word}-${index}`}
          variants={reduceMotion ? undefined : textWordVariants}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}

function CobeScanlineTitle({
  className,
  title
}) {
  return (
    <div
      className={cn(
        "pointer-events-none flex items-center justify-center",
        className
      )}
    >
      <div className="relative inline-block">
        <h1
          className={cn(
            "relative z-0 text-center font-extrabold font-mono tracking-[-0.07em]",
            "text-[clamp(2rem,8.5vw,3.85rem)]",
            "text-chart-3 dark:text-chart-2",
            "drop-shadow-[0_0_40px_oklch(from_var(--color-chart-3)_l_c_h/0.28)]",
            "dark:drop-shadow-[0_0_36px_oklch(from_var(--color-chart-2)_l_c_h/0.25)]"
          )}
        >
          {title}
        </h1>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 opacity-[0.38] mix-blend-soft-light dark:opacity-25"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.5) 3px, rgba(255,255,255,0.5) 4px)",
          }}
        />
      </div>
    </div>
  )
}

export function DefaultShowcaseGlobe({
  className,
  globeSize = 520,
  title = "CULT PRO",
  orbitPhrase = "Ship-ready sections · ",
  hideCenterTitle = false
}) {
  const canvasRef = React.useRef(null)
  const rootRef = React.useRef(null)
  const isInView = useInView(rootRef, { once: false, margin: "120px" })
  const shouldReduceMotion = useReducedMotion()
  const isDark = useResolvedIsDark()
  const phiAutoRef = React.useRef(0)
  const pointerInteracting = React.useRef(null)
  const lastPointer = React.useRef(null)
  const dragOffset = React.useRef({ phi: 0, theta: 0 })
  const velocity = React.useRef({ phi: 0, theta: 0 })
  const phiOffsetRef = React.useRef(0)
  const thetaOffsetRef = React.useRef(0)
  const isPausedRef = React.useRef(false)
  const speedRef = React.useRef(1)
  const bufferSize = globeSize * 2
  const reactId = React.useId()
  const orbitPathId = `hero-orbit-${reactId.replace(/:/g, "")}`

  const cobeMarkers = React.useMemo(
    () => getShowcaseMarkers(DEFAULT_KEY, demoConfig.markerSize),
    []
  )
  const cobeArcs = React.useMemo(() => getShowcaseArcs(DEFAULT_KEY), [])

  const handlePointerDown = React.useCallback(
    (e) => {
      pointerInteracting.current = { x: e.clientX, y: e.clientY }
      if (canvasRef.current) {
        canvasRef.current.style.cursor = "grabbing"
      }
      isPausedRef.current = true
    },
    []
  )

  const handlePointerMove = React.useCallback((e) => {
    if (pointerInteracting.current === null) {
      return
    }
    const deltaX = e.clientX - pointerInteracting.current.x
    const deltaY = e.clientY - pointerInteracting.current.y
    dragOffset.current = { phi: deltaX / 300, theta: deltaY / 1000 }

    const now = Date.now()
    if (lastPointer.current) {
      const dt = Math.max(now - lastPointer.current.t, 1)
      const maxVelocity = 0.15
      velocity.current = {
        phi: Math.max(
          -maxVelocity,
          Math.min(
            maxVelocity,
            ((e.clientX - lastPointer.current.x) / dt) * 0.3
          )
        ),
        theta: Math.max(
          -maxVelocity,
          Math.min(
            maxVelocity,
            ((e.clientY - lastPointer.current.y) / dt) * 0.08
          )
        ),
      }
    }
    lastPointer.current = { x: e.clientX, y: e.clientY, t: now }
  }, [])

  const handlePointerUp = React.useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi
      thetaOffsetRef.current += dragOffset.current.theta
      dragOffset.current = { phi: 0, theta: 0 }
      lastPointer.current = null
    }
    pointerInteracting.current = null
    if (canvasRef.current) {
      canvasRef.current.style.cursor = "grab"
    }
    isPausedRef.current = false
  }, [])

  React.useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerup", handlePointerUp, { passive: true })
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [handlePointerMove, handlePointerUp])

  React.useEffect(() => {
    if (!(canvasRef.current && isInView)) {
      return
    }

    const canvas = canvasRef.current
    const logicalSize = bufferSize
    const dpr = Math.min(
      window.devicePixelRatio || 1,
      window.innerWidth < 640 ? 1.8 : 2
    )

    let baseColor
    let markerColor
    let arcColor
    let glowColor
    let dark
    let mapBrightness
    let opacity

    if (isDark) {
      const cardRgb = cssVarTriplet("--card")
      const mutedRgb = cssVarTriplet("--muted")
      baseColor = [
        cardRgb[0] * 0.52 + 0.03,
        cardRgb[1] * 0.55 + 0.05,
        Math.min(0.96, cardRgb[2] * 0.6 + 0.1),
      ]
      markerColor = saturateRgb(cssVarTriplet("--chart-3"), 1.28)
      arcColor = saturateRgb(cssVarTriplet("--chart-4"), 1.18)
      glowColor = mutedRgb.map((c) => Math.min(1, c * 0.55))
      dark = 1
      mapBrightness = 6.8
      opacity = 0.88
    } else {
      baseColor = demoConfig.baseColor
      markerColor = demoConfig.markerColor
      arcColor = demoConfig.arcColor
      glowColor = [0.94, 0.93, 0.91]
      dark = demoConfig.dark
      mapBrightness = demoConfig.mapBrightness
      opacity = 0.72
    }

    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: logicalSize,
      height: logicalSize,
      phi: phiAutoRef.current + phiOffsetRef.current,
      theta: demoConfig.theta + thetaOffsetRef.current,
      dark,
      diffuse: 1.5,
      mapSamples: 16_000,
      mapBrightness,
      baseColor,
      markerColor,
      glowColor,
      scale: 1,
      offset: [0, 0],
      opacity,
      markers: cobeMarkers,
      arcs: cobeArcs,
      arcColor,
      arcWidth: 0.5,
      arcHeight: 0.25,
      markerElevation: demoConfig.markerElevation
    })

    let raf = 0
    const tick = () => {
      if (!isPausedRef.current) {
        if (!shouldReduceMotion) {
          phiAutoRef.current += 0.003 * speedRef.current
        }
        if (
          Math.abs(velocity.current.phi) > 0.0001 ||
          Math.abs(velocity.current.theta) > 0.0001
        ) {
          phiOffsetRef.current += velocity.current.phi
          thetaOffsetRef.current += velocity.current.theta
          velocity.current.phi *= 0.95
          velocity.current.theta *= 0.95
        }
        const thetaMin = -0.4
        const thetaMax = 0.4
        if (thetaOffsetRef.current < thetaMin) {
          thetaOffsetRef.current += (thetaMin - thetaOffsetRef.current) * 0.1
        } else if (thetaOffsetRef.current > thetaMax) {
          thetaOffsetRef.current += (thetaMax - thetaOffsetRef.current) * 0.1
        }
      }
      globe.update({
        phi: phiAutoRef.current + phiOffsetRef.current + dragOffset.current.phi,
        theta:
          demoConfig.theta + thetaOffsetRef.current + dragOffset.current.theta,
        width: logicalSize,
        height: logicalSize,
        markers: cobeMarkers,
        arcs: cobeArcs,
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      globe.destroy()
    }
  }, [isInView, cobeMarkers, cobeArcs, bufferSize, shouldReduceMotion, isDark])

  const orbitText = React.useMemo(() => orbitPhrase.repeat(12), [orbitPhrase])

  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[min(100vw-2rem,640px)] lg:mx-0 lg:max-w-none",
        className
      )}
      data-slot="default-showcase-globe"
      ref={rootRef}
    >
      <motion.div
        animate={
          isInView ? { opacity: 1, scale: 1 } : { opacity: 0.85, scale: 0.98 }
        }
        className="relative mx-auto aspect-square w-full"
        initial={{ opacity: 0, scale: 0.96 }}
        style={{ maxWidth: globeSize, height: globeSize, width: globeSize }}
        transition={{ duration: 0.9, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
        >
          <svg
            className={cn(
              "h-full max-h-[300px] w-full max-w-[300px] text-chart-3 dark:text-chart-2",
              !shouldReduceMotion &&
                "motion-safe:animate-[spin_360s_linear_infinite]"
            )}
            viewBox="0 0 300 300"
          >
            <defs>
              <path
                d="M 150,150 m -130,0 a 130,130 0 1,0 260,0 a 130,130 0 1,0 -260,0"
                id={orbitPathId}
              />
            </defs>
            <text
              className="fill-current font-medium font-mono uppercase tracking-[0.22em]"
              style={{ fontSize: 8.5 }}
            >
              <textPath href={`#${orbitPathId}`} startOffset="0%">
                {orbitText}
              </textPath>
            </text>
          </svg>
        </div>

        <canvas
          className="relative z-1 block size-full max-h-full max-w-full cursor-grab touch-none"
          height={bufferSize}
          onPointerDown={handlePointerDown}
          onPointerEnter={() => {
            speedRef.current = 0.8
          }}
          onPointerLeave={() => {
            speedRef.current = 1
          }}
          ref={canvasRef}
          style={{ contain: "layout paint size" }}
          width={bufferSize}
        />

        {hideCenterTitle ? null : (
          <CobeScanlineTitle className="absolute inset-0 z-2" title={title} />
        )}

        {showcaseDefaultMarkers.map((m) => (
          <div
            className="pointer-events-none z-3 rounded-sm border border-chart-4/80 bg-chart-3 px-2 py-1 font-mono text-[9px] text-white uppercase tracking-wide shadow-sm sm:text-[10px] dark:border-chart-2/70 dark:bg-chart-2 dark:text-background"
            key={m.id}
            style={anchorLabelStyle(m.id, "marker")}
          >
            {m.label}
          </div>
        ))}
        {showcaseDefaultArcs.map((a) => (
          <div
            className="pointer-events-none z-3 rounded-sm border-2 border-chart-3 bg-background px-1.5 py-0.5 font-mono text-[8px] text-chart-3 uppercase tracking-wide shadow-sm sm:text-[9px] dark:border-chart-2 dark:bg-card dark:text-chart-2"
            key={a.id}
            style={anchorLabelStyle(a.id, "arc")}
          >
            {a.label}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export function MarketingHeroGlobe({
  className,
  srTitle,
  title = "Cult Pro",
  headingSubtitle = "Sections you can ship today.",
  subtitle,
  orbitPhrase,
  globeSize = 460,
  hideEyebrow = false
}) {
  const ref = React.useRef(null)
  const reduceMotion = useReducedMotion()
  const resolvedSrTitle = srTitle ?? `${title} — ${headingSubtitle}`

  return (
    <section
      className={cn(
        "relative min-h-svh overflow-hidden bg-background pt-20 pb-16 text-foreground sm:pb-20 lg:pb-24",
        className
      )}
      data-slot="marketing-hero-globe"
      ref={ref}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_85%_35%,var(--color-chart-3)_0%,transparent_55%)] opacity-[0.07] dark:opacity-[0.12]"
      />

      <h1 className="sr-only">{resolvedSrTitle}</h1>

      <div
        className={cn(
          "container relative z-10 grid gap-8 sm:gap-10",
          "lg:grid-cols-[1fr_minmax(280px,500px)] lg:items-center lg:gap-12",
          "xl:grid-cols-[1fr_1fr]"
        )}
      >
        <div className="flex flex-col justify-center gap-4 sm:gap-5 sm:px-4 md:px-8 lg:gap-6 lg:pr-0 lg:pl-4 xl:pl-8 2xl:pl-0">
          <div className="pt-2 text-center sm:pt-4 lg:pt-0 lg:text-left">
            {hideEyebrow ? null : (
              <motion.p
                animate="visible"
                className="mb-3 font-medium font-mono text-chart-4 text-xs uppercase tracking-[0.14em] dark:text-chart-2"
                initial={reduceMotion ? "visible" : "hidden"}
                variants={reduceMotion ? undefined : eyebrowVariants}
                viewport={{ once: true, amount: 0.5 }}
                whileInView="visible"
              >
                From the registry · globe hero
              </motion.p>
            )}

            <motion.div
              animate="visible"
              className="relative"
              initial={reduceMotion ? "visible" : "hidden"}
              variants={reduceMotion ? undefined : textGroupVariants}
              viewport={{ once: true, amount: 0.45 }}
              whileInView="visible"
            >
              <h2
                className={cn(
                  "relative mb-0 flex flex-col gap-1.5 font-medium sm:gap-2",
                  "tracking-[-0.04em] lg:tracking-[-0.05em]",
                  "text-foreground"
                )}
                data-slot="marketing-hero-globe-heading"
              >
                <span className="block text-[clamp(1.875rem,1.1rem+2.8vw,3.75rem)] text-chart-3 leading-[1.1] dark:text-chart-2">
                  <AnimatedTextLine content={title} splitWords />
                </span>
                <span className="block text-pretty text-[clamp(1.625rem,1rem+2.4vw,3.25rem)] text-foreground leading-[1.15]">
                  <AnimatedTextLine content={headingSubtitle} splitWords />
                </span>
              </h2>
            </motion.div>
          </div>

          {subtitle ? (
            <motion.div
              animate="visible"
              className="mx-auto max-w-xl pb-1 text-center sm:pb-2 lg:mx-0 lg:max-w-lg lg:pb-0 lg:text-left"
              initial={reduceMotion ? "visible" : "hidden"}
              variants={reduceMotion ? undefined : textBlockVariants}
              viewport={{ once: true, amount: 0.45 }}
              whileInView="visible"
            >
              <p className="text-pretty font-sans text-base text-foreground/70 leading-relaxed md:text-foreground/80 lg:text-lg">
                {subtitle}
              </p>
            </motion.div>
          ) : null}
        </div>

        <div className="flex min-h-[min(72vw,320px)] items-center justify-center lg:min-h-[380px] lg:justify-end xl:min-h-[440px]">
          <DefaultShowcaseGlobe
            className="w-full max-w-[min(100vw-2rem,520px)] lg:max-w-[min(100%,500px)]"
            globeSize={globeSize}
            hideCenterTitle
            orbitPhrase={orbitPhrase}
            title={title}
          />
        </div>
      </div>
    </section>
  )
}

export default MarketingHeroGlobe
