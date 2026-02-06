import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#00d4aa] text-[#0a0e1a] hover:bg-[#00d4aa]/80",
        secondary:
          "border-transparent bg-[#1a1f2e] text-[#e0e0e0] hover:bg-[#1a1f2e]/80",
        destructive:
          "border-transparent bg-red-500 text-white hover:bg-red-500/80",
        outline:
          "text-[#e0e0e0] border-[#00d4aa]/30 hover:bg-[#00d4aa]/10",
        low: "border-transparent bg-blue-500/20 text-blue-400",
        medium: "border-transparent bg-yellow-500/20 text-yellow-400",
        high: "border-transparent bg-orange-500/20 text-orange-400",
        critical: "border-transparent bg-red-500/20 text-red-400 animate-pulse",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
