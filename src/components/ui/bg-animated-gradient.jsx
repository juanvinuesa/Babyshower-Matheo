import React, { useEffect } from "react"
import { motion, useAnimation } from "motion/react"

export const GradientAnimation = ({
  gradients,
  animationDuration,
  className = "",
}) => {
  const controls = useAnimation()

  useEffect(() => {
    controls.start({
      background: gradients.map(
        (g) =>
          `radial-gradient(circle at ${g.centerX}% ${g.centerY}%, ${g.stops
            .map((s) => `${s.color} ${s.position}%`)
            .join(", ")})`
      ),
      transition: {
        duration: animationDuration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "linear",
      },
    })
  }, [controls, gradients, animationDuration])

  return (
    <motion.div
      className={`absolute inset-0 h-full w-full ${className}`}
      animate={controls}
    />
  )
}

export default React.memo(GradientAnimation)
