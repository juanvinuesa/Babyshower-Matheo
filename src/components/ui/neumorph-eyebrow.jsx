import { cva } from "class-variance-authority";

const neumorphEyebrowVariants = cva(
  "mb-2 flex h-6 w-fit items-center rounded-full border-[.75px] px-2.5 text-xs font-medium shadow-[inset_0px_-2.10843px_0px_0px_rgb(244,241,238),_0px_1.20482px_6.3253px_0px_rgb(244,241,238)]",
  {
    variants: {
      intent: {
        default: "border-[#E9E3DD] bg-[#FBFAF9] text-[#36322F]",
        primary: "border-blue-200 bg-blue-50 text-blue-800",
        secondary: "border-green-200 bg-green-50 text-green-800",
      },
    },
    defaultVariants: {
      intent: "default",
    },
  }
)

export const NeumorphEyebrow = ({
  children,
  intent,
  className,
  ...props
}) => {
  return (
    <div className={neumorphEyebrowVariants({ intent, className })} {...props}>
      {children}
    </div>
  )
}

export default NeumorphEyebrow
