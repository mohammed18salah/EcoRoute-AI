import * as React from "react"
import { cn } from "@/lib/utils"

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "outline" | "ghost" }>(
    ({ className, variant = "default", ...props }, ref) => {
        const variants = {
            default: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md transform active:scale-95 transition-all text-sm font-medium",
            outline: "border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-900 text-sm font-medium",
            ghost: "hover:bg-zinc-100 text-zinc-900 text-sm font-medium",
        }
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 disabled:pointer-events-none disabled:opacity-50",
                    variants[variant],
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
