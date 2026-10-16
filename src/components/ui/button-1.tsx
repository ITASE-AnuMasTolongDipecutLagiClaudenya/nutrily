import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        mono: "bg-zinc-950 text-white hover:bg-zinc-950/90 dark:bg-zinc-300 dark:text-black",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        outline: "border border-input bg-background hover:bg-accent",
        dashed:
          "border border-dashed border-input bg-background hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        dim: "text-muted-foreground hover:text-foreground",
        foreground: "text-foreground",
        inverse: "text-inherit hover:bg-black/5 dark:hover:bg-white/10",
      },
      appearance: { default: "", ghost: "" },
      underline: { solid: "", dashed: "" },
      underlined: { solid: "", dashed: "" },
      size: {
        lg: "h-10 gap-1.5 px-4",
        md: "h-9 gap-1.5 px-3",
        sm: "h-7 gap-1 px-2.5 text-xs",
        icon: "size-8",
      },
      autoHeight: { true: "h-auto", false: "" },
      shape: { default: "", circle: "rounded-full" },
      mode: {
        default: "",
        icon: "",
        link: "h-auto rounded-none bg-transparent p-0",
        input: "justify-start",
      },
      placeholder: { true: "text-muted-foreground", false: "" },
    },
    defaultVariants: {
      variant: "primary",
      mode: "default",
      size: "md",
      shape: "default",
      appearance: "default",
    },
  },
)

type ButtonProps = React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & {
  selected?: boolean
}

function Button({
  className,
  selected,
  variant,
  shape,
  appearance,
  mode,
  size,
  autoHeight,
  underlined,
  underline,
  placeholder,
  ...props
}: ButtonProps) {
  return (
    <button
      data-slot="button"
      data-state={selected ? "open" : undefined}
      className={cn(
        buttonVariants({
          variant,
          shape,
          appearance,
          mode,
          size,
          autoHeight,
          underlined,
          underline,
          placeholder,
        }),
        className,
      )}
      {...props}
    />
  )
}

export { Button, buttonVariants }
