import React, { forwardRef } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react"
import useMeasure from "react-use-measure"

import { cn } from "@/lib/utils"

const sectionVariants = {
  open: {
    width: "97%",
    transition: {
      duration: 0.3,
      ease: [0.42, 0, 0.58, 1],
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
  closed: {
    transition: { duration: 0.2, ease: [0.42, 0, 0.58, 1] },
  },
}

const sharedTransition = { duration: 0.6, ease: [0.42, 0, 0.58, 1] }

export const SidePanel = forwardRef(
  ({ panelOpen, handlePanelOpen, className, renderButton, children }, ref) => {
    const [measureRef, bounds] = useMeasure()

    return (
      <ResizablePanel>
        <motion.div
          className={cn(
            "w-[160px] rounded-r-[44px] bg-neutral-900 md:w-[260px]",
            className
          )}
          animate={panelOpen ? "open" : "closed"}
          variants={sectionVariants}
          transition={{ duration: 0.2, ease: [0.42, 0, 0.58, 1] }}
        >
          <motion.div
            animate={{ height: bounds.height > 0 ? bounds.height : 0.1 }}
            className="h-auto"
            transition={{ type: "spring", bounce: 0.02, duration: 0.65 }}
          >
            <div ref={measureRef}>
              <AnimatePresence mode="popLayout">
                <motion.div
                  exit={{ opacity: 0 }}
                  transition={{
                    ...sharedTransition,
                    duration: sharedTransition.duration / 2,
                  }}
                  key="form"
                >
                  <div
                    className={cn(
                      "flex w-full items-center justify-start py-1 pl-4 md:py-3 md:pl-4",
                      panelOpen ? "pr-3" : ""
                    )}
                  >
                    {renderButton && renderButton(handlePanelOpen)}
                  </div>

                  {panelOpen && (
                    <motion.div
                      exit={{ opacity: 0 }}
                      transition={sharedTransition}
                    >
                      {children}
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </ResizablePanel>
    );
  }
)

SidePanel.displayName = "SidePanel"

export default SidePanel

const ResizablePanel = React.forwardRef(({ children }, ref) => {
  const transition = {
    type: "tween",
    ease: [0.42, 0, 0.58, 1],
    duration: 0.4,
  }

  return (
    <MotionConfig transition={transition}>
      <div className="flex w-full flex-col items-start">
        <div className="mx-auto w-full">
          <div
            ref={ref}
            className={cn(
              children ? "rounded-r-none" : "rounded-sm",
              "relative overflow-hidden"
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </MotionConfig>
  )
})

ResizablePanel.displayName = "ResizablePanel"
