import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface BadgeProps {
  children: ReactNode;
  variant?:
    | "default"
    | "success"
    | "warning"
    | "danger"
    | "primary"
    | "outline";
  size?: "sm" | "md";
  className?: string;
}

const variantClasses = {
  default: "bg-border-subtle text-text-secondary border border-border",
  primary:
    "bg-primary-100 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800",
  success:
    "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
  warning:
    "bg-orange-50 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800",
  danger:
    "bg-rose-50 dark:bg-rose-950/80 text-[#D11149] dark:text-rose-300 border border-rose-200 dark:border-rose-800",
  outline: "border border-border text-text-secondary bg-surface",
};

const sizeClasses = {
  sm: "text-[0.7rem] px-2 py-0.5",
  md: "text-xs px-2.5 py-1",
};

export function Badge({
  children,
  variant = "default",
  size = "md",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "badge",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </span>
  );
}
