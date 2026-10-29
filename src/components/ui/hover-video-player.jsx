"use client";
/**
 * HoverVideoPlayer Component
 *
 * A React component that plays video on hover/touch with advanced features like:
 * - Lazy loading and intersection observer support
 * - Mobile touch support
 * - Picture-in-Picture
 * - Custom overlay support
 * - Thumbnail support
 * - Playback controls
 *
 * @example
 * ```tsx
 * <HoverVideoPlayer
 *   videoSrc="/path/to/video.mp4"
 *   thumbnailSrc="/path/to/thumbnail.jpg"
 *   pausedOverlay={<PlayIcon />}
 *   loadingOverlay={<Spinner />}
 *   enableControls
 * />
 * ```
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image"
import { Maximize, Minimize, Pause, Play, Volume2, VolumeX } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

const hoverTransition = {
  duration: 0.18,
  ease: [0.2, 0, 0, 1]
}

const hoverSpring = {
  type: "spring",
  duration: 0.3,
  bounce: 0
}

// Context
const HoverVideoPlayerContext =
  createContext(null)

/**
 * Custom hook to access HoverVideoPlayer context
 * @throws {Error} If used outside of HoverVideoPlayerContext
 */
const useHoverVideoPlayer = () => {
  const context = useContext(HoverVideoPlayerContext)
  if (!context) {
    throw new Error(
      "useHoverVideoPlayer must be used within a HoverVideoPlayer"
    )
  }
  return context
}

// Add this helper function before the HoverVideoPlayer component
function debounce(func, wait) {
  let timeoutId = null

  const debouncedFn = (...args) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), wait)
  }

  debouncedFn.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return debouncedFn
}

// Add this helper function
function isVimeoUrl(url) {
  return url.includes("player.vimeo.com/video/") || url.includes("vimeo.com/")
}

// Add this helper function
function loadVimeoSDK() {
  return new Promise((resolve, reject) => {
    if ((window).Vimeo) {
      resolve((window).Vimeo)
      return
    }

    const script = document.createElement("script")
    script.src = "https://player.vimeo.com/api/player.js"
    script.async = true
    script.onload = () => resolve((window).Vimeo)
    script.onerror = reject
    document.body.appendChild(script)
  });
}

// Main Component
const HoverVideoPlayer = ({
  videoSrc,
  thumbnailSrc,
  hoverOverlay,
  pausedOverlay,
  loadingOverlay,
  playbackStartDelay = 0,
  restartOnPaused = false,
  unloadVideoOnPaused = false,
  playbackRangeStart,
  playbackRangeEnd,
  muted: initialMuted = false,
  loop = true,
  preload = "metadata",
  className,
  style,
  onHoverStart,
  onHoverEnd,
  enableControls = false,
  cropTop = 0,
  cropBottom = 0,
  isVimeo = false,
}) => {
  const isVimeoVideo = isVimeo || isVimeoUrl(videoSrc)

  // Refs for DOM elements and timing
  const containerRef = useRef(null)
  const videoRef = useRef(null)
  const playbackTimeoutRef = useRef(null)
  const lastPlayAttemptRef = useRef(0)
  const seekProgressHandlerRef = useRef(null)

  // Consolidated state management
  const [state, setState] = useState({
    isHovering: false,
    isPlaying: false,
    isLoading: false,
    progress: 0,
    muted: initialMuted,
    volume: 1,
    isPiP: false,
    isMobile: false,
    controlsVisible: false,
    showThumbnail: true,
    isInView: false,
  })

  // Mobile detection
  const checkMobile = useMemo(
    () =>
      debounce(() => {
        setState((prev) => ({ ...prev, isMobile: window.innerWidth <= 768 }))
      }, 200),
    []
  )

  // Event Handlers
  const handleTouchStart = useCallback(() => {
    if (state.isMobile) {
      setState((prev) => ({ ...prev, controlsVisible: !prev.controlsVisible }))
    }
  }, [state.isMobile])

  const handleHoverStart = useCallback(() => {
    if (!state.isMobile) {
      console.log("Hover start")
      setState((prev) => ({ ...prev, isHovering: true }))
      onHoverStart?.()
    }
  }, [state.isMobile, onHoverStart])

  const handleHoverEnd = useCallback(() => {
    if (!state.isMobile) {
      console.log("Hover end")
      setState((prev) => ({ ...prev, isHovering: false }))
      onHoverEnd?.()
    }
  }, [state.isMobile, onHoverEnd])

  // Video Playback Controls
  const playVideo = useCallback(() => {
    if (!videoRef.current || !state.isInView) {
      console.log("PlayVideo blocked:", {
        hasVideo: !!videoRef.current,
        isInView: state.isInView,
      })
      return
    }

    const video = videoRef.current
    console.log("Attempting to play video:", {
      readyState: video.readyState,
      paused: video.paused,
      currentSrc: video.currentSrc,
    })

    // Reset loading state when attempting to play
    setState((prev) => ({ ...prev, isLoading: true }))

    // Ensure video is ready to play
    const attemptPlay = () => {
      video
        .play()
        .then(() => {
          console.log("Video play success")
          setState((prev) => ({
            ...prev,
            isLoading: false,
            isPlaying: true,
            showThumbnail: false,
          }))
        })
        .catch((error) => {
          console.log("Video play error:", error.name)
          if (error.name === "NotAllowedError") {
            // User interaction required - show thumbnail
            setState((prev) => ({
              ...prev,
              isLoading: false,
              showThumbnail: true,
            }))
          } else if (error.name !== "AbortError") {
            console.error("HoverVideoPlayer: Playback error:", error)
            setState((prev) => ({
              ...prev,
              isLoading: false,
              showThumbnail: true,
            }))
          }
        })
    }

    if (video.readyState >= 3) {
      console.log("Video ready, attempting immediate play")
      attemptPlay()
    } else {
      console.log("Video not ready, waiting for canplay event")
      const handleCanPlay = () => {
        console.log("Canplay event fired")
        video.removeEventListener("canplay", handleCanPlay)
        attemptPlay()
      }
      video.addEventListener("canplay", handleCanPlay)
    }
  }, [state.isInView])

  const pauseVideo = useCallback(() => {
    if (!videoRef.current) return

    videoRef.current.pause()
    setState((prev) => ({
      ...prev,
      isPlaying: false,
      showThumbnail: true,
    }))

    if (restartOnPaused) {
      videoRef.current.currentTime = playbackRangeStart || 0
    }
  }, [restartOnPaused, playbackRangeStart])

  // Effects

  // Mobile detection effect
  useEffect(() => {
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => {
      window.removeEventListener("resize", checkMobile)
      checkMobile.cancel()
    }
  }, [checkMobile])

  // Intersection Observer effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isNowInView = entry.isIntersecting
          setState((prev) => ({ ...prev, isInView: isNowInView }))

          if (!isNowInView) {
            pauseVideo()
          }
        })
      },
      {
        root: null,
        rootMargin: "50px",
        threshold: 0.1,
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [pauseVideo])

  // Video event handlers effect
  useEffect(() => {
    const video = videoRef.current
    if (!video || !state.isInView) return

    const handlers = {
      loadstart: () => {
        console.log("Video loadstart")
        setState((prev) => ({ ...prev, isLoading: true }))
      },
      loadeddata: () => {
        console.log("Video loadeddata", {
          readyState: video.readyState,
          duration: video.duration,
          paused: video.paused,
          isHovering: state.isHovering,
          controlsVisible: state.controlsVisible,
        })
        setState((prev) => ({ ...prev, isLoading: false }))
        // Only attempt to play if we're hovering or controls are visible
        if (state.isHovering || state.controlsVisible) {
          console.log("Video loaded and hover/controls active, attempting play")
          playVideo()
        }
      },
      timeupdate: () => {
        if (!Number.isFinite(video.duration) || video.duration <= 0) return

        const nextProgress = (video.currentTime / video.duration) * 100
        setState((prev) => ({ ...prev, progress: nextProgress }))
      },
      canplay: () => {
        console.log("Video canplay event")
      },
      playing: () => {
        console.log("Video playing")
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isPlaying: true,
          showThumbnail: false,
        }))
      },
      pause: () => {
        console.log("Video paused")
        setState((prev) => ({
          ...prev,
          isPlaying: false,
          showThumbnail: true,
        }))
      },
      error: (e) => {
        const videoError = (e.target).error
        console.error("Video error:", {
          code: videoError?.code,
          message: videoError?.message,
          currentSrc: video.currentSrc,
        })
        setState((prev) => ({
          ...prev,
          isLoading: false,
          showThumbnail: true,
        }))
      },
    }

    // Add event listeners
    Object.entries(handlers).forEach(([event, handler]) => {
      video.addEventListener(event, handler)
    })

    // Set initial source and load the video
    if (!video.src) {
      console.log("Setting video source:", videoSrc)
      video.src = videoSrc
      video.load()
    }

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        video.removeEventListener(event, handler)
      })
    }
  }, [
    state.isInView,
    state.isHovering,
    state.controlsVisible,
    playVideo,
    videoSrc,
  ])

  // Playback control effect
  useEffect(() => {
    console.log("Playback control effect:", {
      isInView: state.isInView,
      isMobile: state.isMobile,
      controlsVisible: state.controlsVisible,
      isHovering: state.isHovering,
    })

    if (!state.isInView) {
      console.log("Not in view, skipping playback")
      return
    }

    if (isVimeoVideo) {
      return
    }

    let playbackTimeout

    if (state.isMobile) {
      if (state.controlsVisible) {
        console.log("Mobile controls visible, playing")
        playVideo()
      } else {
        console.log("Mobile controls hidden, pausing")
        pauseVideo()
      }
    } else if (state.isHovering) {
      console.log(
        "Hovering, scheduling playback with delay:",
        playbackStartDelay
      )
      playbackTimeout = setTimeout(() => {
        console.log("Playback delay completed, attempting to play")
        playVideo()
      }, playbackStartDelay)
    } else {
      console.log("Not hovering, pausing")
      pauseVideo()
    }

    return () => {
      if (playbackTimeout) {
        console.log("Clearing playback timeout")
        clearTimeout(playbackTimeout)
      }
    }
  }, [
    state.isInView,
    state.isMobile,
    state.controlsVisible,
    state.isHovering,
    playVideo,
    pauseVideo,
    playbackStartDelay,
    isVimeoVideo,
  ])

  // Volume effect
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = state.muted
    video.volume = state.volume
  }, [state.muted, state.volume])

  // Control handlers
  const togglePlayPause = useCallback(() => {
    if (state.isPlaying) {
      pauseVideo()
    } else {
      playVideo()
    }
  }, [state.isPlaying, pauseVideo, playVideo])

  const toggleMute = useCallback(() => {
    setState((prev) => ({ ...prev, muted: !prev.muted }))
  }, [])

  const togglePiP = useCallback(async () => {
    if (!document.pictureInPictureEnabled) return

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture()
        setState((prev) => ({ ...prev, isPiP: false }))
      } else if (videoRef.current) {
        await videoRef.current.requestPictureInPicture()
        setState((prev) => ({ ...prev, isPiP: true }))
      }
    } catch (error) {
      console.error("PiP error:", error)
    }
  }, [])

  const setSeekProgressHandler = useCallback(
    (handler) => {
      seekProgressHandlerRef.current = handler
    },
    []
  )

  const seekProgress = useCallback((value) => {
    const nextProgress = Math.min(100, Math.max(0, value))
    setState((prev) => ({ ...prev, progress: nextProgress }))

    if (seekProgressHandlerRef.current) {
      void seekProgressHandlerRef.current(nextProgress)
      return
    }

    const video = videoRef.current
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) {
      return
    }

    video.currentTime = (nextProgress / 100) * video.duration
  }, [])

  const setProgress = useCallback((value) => {
    setState((prev) => ({ ...prev, progress: value }))
  }, [])

  const setVolume = useCallback((value) => {
    setState((prev) => ({ ...prev, volume: value }))
  }, [])

  const setVideoLoading = useCallback((isLoading) => {
    setState((prev) => ({ ...prev, isLoading }))
  }, [])

  const setVideoPlaying = useCallback((isPlaying) => {
    setState((prev) => ({
      ...prev,
      isPlaying,
      showThumbnail: !isPlaying,
    }))
  }, [])

  // Context value
  const contextValue = useMemo(() => ({
    isPlaying: state.isPlaying,
    isHovering: state.isHovering,
    isLoading: state.isLoading,
    progress: state.progress,
    volume: state.volume,
    muted: state.muted,
    isPiP: state.isPiP,
    isMobile: state.isMobile,
    controlsVisible: state.controlsVisible,
    videoRef,
    togglePlay: togglePlayPause,
    toggleMute,
    togglePiP,
    setVolume,
    setProgress,
    seekProgress,
    setSeekProgressHandler,
    setVideoLoading,
    setVideoPlaying,
    cropTop,
    cropBottom,
    thumbnailSrc,
  }), [
    state,
    togglePlayPause,
    toggleMute,
    togglePiP,
    setVolume,
    setProgress,
    seekProgress,
    setSeekProgressHandler,
    setVideoLoading,
    setVideoPlaying,
    cropTop,
    cropBottom,
    thumbnailSrc,
  ])

  // Render
  return (
    <HoverVideoPlayerContext.Provider value={contextValue}>
      <motion.div
        ref={containerRef}
        className={cn(
          "group relative cursor-pointer overflow-hidden",
          className
        )}
        style={{
          ...style,
          paddingTop: `${cropTop}%`,
          paddingBottom: `${cropBottom}%`,
        }}
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
        onTouchStart={handleTouchStart}
      >
        {/* Video Element */}
        {state.isInView && (
          <HoverVideoPlayerVideo
            src={videoSrc}
            unloadVideoOnPaused={unloadVideoOnPaused}
            loop={loop}
            preload={preload}
          />
        )}

        {/* Thumbnail */}
        {thumbnailSrc && <HoverVideoPlayerThumbnail src={thumbnailSrc} />}

        {/* Overlays */}
        {pausedOverlay && (
          <HoverVideoPlayerPausedOverlay>
            {pausedOverlay}
          </HoverVideoPlayerPausedOverlay>
        )}
        {loadingOverlay && (
          <HoverVideoPlayerLoadingOverlay>
            {loadingOverlay}
          </HoverVideoPlayerLoadingOverlay>
        )}
        {hoverOverlay && !state.isMobile && (
          <HoverVideoPlayerHoverOverlay>
            {hoverOverlay}
          </HoverVideoPlayerHoverOverlay>
        )}

        {/* Controls */}
        {enableControls && (
          <HoverVideoPlayerControls>
            <div className="flex items-center space-x-2">
              <HoverVideoPlayerPlayPauseButton />
              <HoverVideoPlayerVolumeControl />
              <HoverVideoPlayerPiPButton />
            </div>
            <HoverVideoPlayerProgressBar />
          </HoverVideoPlayerControls>
        )}
      </motion.div>
    </HoverVideoPlayerContext.Provider>
  )
}

/**
 * Video component that handles the actual video element
 */
const HoverVideoPlayerVideo = ({ src, loop, preload }) => {
  const {
    videoRef,
    muted,
    cropTop,
    cropBottom,
    isHovering,
    isMobile,
    controlsVisible,
    setProgress,
    setSeekProgressHandler,
    setVideoLoading,
    setVideoPlaying,
  } = useHoverVideoPlayer()
  const isVimeoVideo = isVimeoUrl(src)
  const containerRef = useRef(null)
  const playerRef = useRef(null)
  const shouldPlayVimeo = isMobile ? controlsVisible : isHovering
  const shouldPlayVimeoRef = useRef(shouldPlayVimeo)

  useEffect(() => {
    shouldPlayVimeoRef.current = shouldPlayVimeo
  }, [shouldPlayVimeo])

  useEffect(() => {
    if (!isVimeoVideo || !containerRef.current) return

    const videoId = src.split("/").pop() || ""
    let player = null
    setVideoLoading(true)

    loadVimeoSDK()
      .then((Vimeo) => {
        if (!containerRef.current) return

        player = new Vimeo.Player(containerRef.current, {
          id: videoId,
          autopause: false,
          muted,
          loop,
          responsive: true,
          controls: false,
          autoplay: false,
          volume: 1,
        })

        playerRef.current = player
        setSeekProgressHandler(async (value) => {
          const duration = await player?.getDuration()
          if (!duration || !Number.isFinite(duration)) return

          await player?.setCurrentTime((value / 100) * duration)
        })

        player.ready().then(() => {
          console.log("Vimeo video loaded")
          setVideoLoading(false)

          if (shouldPlayVimeoRef.current) {
            player
              ?.play()
              .then(() => setVideoPlaying(true))
              .catch((error) => {
                setVideoPlaying(false)
                console.error("Vimeo play error:", error)
              })
          }
        })

        player.on("play", () => {
          console.log("Vimeo video playing")
          setVideoLoading(false)
          setVideoPlaying(true)
        })
        player.on("pause", () => {
          console.log("Vimeo video paused")
          setVideoPlaying(false)
        })
        player.on("timeupdate", (data) => {
          if (!data.duration || !Number.isFinite(data.duration)) return

          setProgress((data.seconds / data.duration) * 100)
        })
        player.on("error", (err) => {
          setVideoLoading(false)
          setVideoPlaying(false)
          console.error("Vimeo player error:", err)
        })
      })
      .catch((error) => {
        setVideoLoading(false)
        console.error("Failed to load Vimeo SDK:", error)
      })

    return () => {
      if (player) {
        player.destroy()
        playerRef.current = null
      }
      setSeekProgressHandler(null)
    }
  }, [
    isVimeoVideo,
    src,
    muted,
    loop,
    setProgress,
    setSeekProgressHandler,
    setVideoLoading,
    setVideoPlaying,
  ])

  useEffect(() => {
    if (!isVimeoVideo) return

    const player = playerRef.current
    if (!player) return

    if (shouldPlayVimeo) {
      setVideoLoading(true)
      player
        .play()
        .then(() => {
          setVideoLoading(false)
          setVideoPlaying(true)
        })
        .catch((error) => {
          setVideoLoading(false)
          setVideoPlaying(false)
          console.error("Vimeo play error:", error)
        })
    } else {
      player
        .pause()
        .then(() => setVideoPlaying(false))
        .catch((error) => {
          console.error("Vimeo pause error:", error)
        })
    }
  }, [isVimeoVideo, shouldPlayVimeo, setVideoLoading, setVideoPlaying])

  if (isVimeoVideo) {
    return <div ref={containerRef} className="absolute inset-0" />
  }

  return (
    <video
      ref={videoRef}
      className={cn("absolute inset-0 h-full w-full object-cover")}
      style={{
        top: `-${cropTop}%`,
        bottom: `-${cropBottom}%`,
        height: `calc(100% + ${cropTop + cropBottom}%)`,
      }}
      muted={muted}
      loop={loop}
      preload={preload}
      playsInline
      crossOrigin="anonymous"
      aria-label="Video player"
    />
  )
}

/**
 * Thumbnail component shown when video is not playing
 */
const HoverVideoPlayerThumbnail = ({ src }) => {
  const { cropTop, cropBottom, isLoading, isPlaying } = useHoverVideoPlayer()
  const shouldReduceMotion = useReducedMotion()
  const shouldShowThumbnail = !isPlaying || isLoading

  return (
    <motion.div
      className={cn(
        "pointer-events-none absolute inset-0 z-1 h-full w-full transform-gpu"
      )}
      style={{
        top: `-${cropTop}%`,
        bottom: `-${cropBottom}%`,
        height: `calc(100% + ${cropTop + cropBottom}%)`,
      }}
      animate={{
        opacity: shouldShowThumbnail ? 1 : 0,
        scale: shouldShowThumbnail ? 1 : 1.01,
      }}
      initial={false}
      transition={shouldReduceMotion ? { duration: 0 } : hoverTransition}
    >
      <Image
        src={src}
        alt="Video thumbnail"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover"
        priority
      />
    </motion.div>
  )
}

/**
 * Controls overlay with play/pause, volume, and progress bar
 */
const HoverVideoPlayerControls = ({
  children,
}) => {
  const { isHovering, isMobile, controlsVisible } = useHoverVideoPlayer()
  const shouldReduceMotion = useReducedMotion()

  const shouldShowControls = isMobile ? controlsVisible : isHovering

  return (
    <AnimatePresence initial={false}>
      {shouldShowControls && (
        <motion.div
          className="absolute right-0 bottom-0 left-0 z-40 bg-linear-to-t from-black to-transparent p-4"
          initial={
            shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }
          }
          animate={{ opacity: 1, y: 0 }}
          exit={
            shouldReduceMotion ? { opacity: 0, y: 0 } : { opacity: 0, y: 8 }
          }
          transition={shouldReduceMotion ? { duration: 0 } : hoverSpring}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Overlay shown when hovering over the video
 */
const HoverVideoPlayerHoverOverlay = ({
  children,
}) => {
  const { isHovering, isLoading } = useHoverVideoPlayer()
  const shouldReduceMotion = useReducedMotion()

  return (
    <AnimatePresence initial={false}>
      {isHovering && !isLoading && (
        <motion.div
          className="absolute inset-0 z-30 flex items-center justify-center"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : hoverTransition}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Overlay shown when video is paused
 */
const HoverVideoPlayerPausedOverlay = ({ children }) => {
  const { isPlaying, isLoading, isHovering } = useHoverVideoPlayer()
  const shouldReduceMotion = useReducedMotion()

  return (
    <AnimatePresence initial={false}>
      {!isPlaying && !isLoading && !isHovering && (
        <motion.div
          className="bg-opacity-50 absolute inset-0 z-10 flex items-center justify-center bg-black"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : hoverTransition}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Overlay shown while video is loading
 */
const HoverVideoPlayerLoadingOverlay = ({ children }) => {
  const { isLoading } = useHoverVideoPlayer()
  const shouldReduceMotion = useReducedMotion()

  return (
    <AnimatePresence initial={false} mode="wait">
      {isLoading && (
        <motion.div
          className="bg-opacity-50 absolute inset-0 z-20 flex items-center justify-center bg-black"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : hoverTransition}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Play/Pause button component
 */
const HoverVideoPlayerPlayPauseButton = () => {
  const { isPlaying, togglePlay } = useHoverVideoPlayer()

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={togglePlay}
      className="hover:text-primary-foreground text-white"
      aria-label={isPlaying ? "Pause video" : "Play video"}
    >
      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
    </Button>
  )
}

/**
 * Volume control component with mute toggle and volume slider
 */
const HoverVideoPlayerVolumeControl = () => {
  const { muted, toggleMute, volume, setVolume } = useHoverVideoPlayer()

  return (
    <div className="flex items-center space-x-2">
      <Button
        size="icon"
        variant="ghost"
        onClick={toggleMute}
        className="hover:text-primary-foreground text-white"
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? (
          <VolumeX className="h-6 w-6" />
        ) : (
          <Volume2 className="h-6 w-6" />
        )}
      </Button>
      <Slider
        className="w-24"
        value={[muted ? 0 : volume * 100]}
        min={0}
        max={100}
        step={1}
        onValueChange={(value) => setVolume(value[0] / 100)}
        aria-label="Volume"
      />
    </div>
  )
}

/**
 * Progress bar component for video timeline
 */
const HoverVideoPlayerProgressBar = () => {
  const { progress, seekProgress } = useHoverVideoPlayer()

  return (
    <Slider
      className="mt-2"
      value={[progress]}
      min={0}
      max={100}
      step={0.1}
      onValueChange={(value) => {
        seekProgress(value[0])
      }}
      aria-label="Video progress"
    />
  )
}

/**
 * Picture-in-Picture toggle button
 */
const HoverVideoPlayerPiPButton = () => {
  const { isPiP, togglePiP } = useHoverVideoPlayer()

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={togglePiP}
      className="hover:text-primary-foreground text-white"
      aria-label={
        isPiP ? "Exit picture in picture" : "Enter picture in picture"
      }
    >
      {isPiP ? (
        <Minimize className="h-6 w-6" />
      ) : (
        <Maximize className="h-6 w-6" />
      )}
    </Button>
  )
}

/**
 * Wrapper component for maintaining aspect ratio with padding
 */
const HoverVideoPaddingWrapper = ({ width, height, className, children }) => {
  return (
    <div
      style={{
        "--width": width,
        "--height": height
      }}
      className={cn(
        className,
        "relative aspect-[var(--width)/var(--height)] [--radius:theme(borderRadius.xl)]"
      )}
    >
      <div className="absolute -inset-[var(--padding)] rounded-[calc(var(--radius)+var(--padding))] shadow-sm ring-1 ring-black/5 [--padding:theme(spacing.2)]" />
      {children}
    </div>
  );
}

// Add display names for better debugging
HoverVideoPlayerControls.displayName = "HoverVideoPlayerControls"
HoverVideoPaddingWrapper.displayName = "HoverVideoPaddingWrapper"
HoverVideoPlayerHoverOverlay.displayName = "HoverVideoPlayerHoverOverlay"
HoverVideoPlayerPausedOverlay.displayName = "HoverVideoPlayerPausedOverlay"
HoverVideoPlayerLoadingOverlay.displayName = "HoverVideoPlayerLoadingOverlay"
HoverVideoPlayerPlayPauseButton.displayName = "HoverVideoPlayerPlayPauseButton"
HoverVideoPlayerVolumeControl.displayName = "HoverVideoPlayerVolumeControl"
HoverVideoPlayerProgressBar.displayName = "HoverVideoPlayerProgressBar"
HoverVideoPlayerPiPButton.displayName = "HoverVideoPlayerPiPButton"

export {
  HoverVideoPlayer,
  HoverVideoPlayerControls,
  HoverVideoPlayerHoverOverlay,
  HoverVideoPlayerPausedOverlay,
  HoverVideoPlayerLoadingOverlay,
  HoverVideoPlayerPlayPauseButton,
  HoverVideoPlayerVolumeControl,
  HoverVideoPlayerProgressBar,
  HoverVideoPlayerPiPButton,
  HoverVideoPaddingWrapper,
}

export default HoverVideoPlayer
