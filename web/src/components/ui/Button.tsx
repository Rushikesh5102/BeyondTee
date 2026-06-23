import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { clsx } from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline";
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", isLoading, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={clsx(
                    "flex items-center justify-center gap-2 px-6 py-3 rounded font-bold transition-all uppercase tracking-wide",
                    {
                        "bg-[#CCFF00] text-black hover:bg-[#b3e600] disabled:opacity-50 disabled:cursor-not-allowed": variant === "primary",
                        "bg-zinc-800 text-white hover:bg-zinc-700": variant === "secondary",
                        "border border-zinc-700 hover:bg-zinc-800 text-white": variant === "outline",
                    },
                    className
                )}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;
