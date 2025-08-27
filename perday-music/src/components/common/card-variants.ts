import { cva, type VariantProps } from "class-variance-authority"

export const cardVariants = cva(
  "rounded-xl border bg-card text-card-foreground shadow",
  {
    variants: {
      variant: {
        default: "border-border",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>div]:text-destructive",
        success: "border-green-500/50 text-green-700 dark:text-green-400",
        warning: "border-yellow-500/50 text-yellow-700 dark:text-yellow-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export type CardVariants = VariantProps<typeof cardVariants>
