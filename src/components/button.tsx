import type { ButtonHTMLAttributes, Ref } from "react";

type ButtonVariant = "outline" | "primary" | "danger" | "ghost" | "floating" | "custom";

const variantClassName: Record<ButtonVariant, string> = {
  outline: "inline-flex items-center gap-2 min-h-10 justify-center rounded-md border border-navy/15 bg-white px-3 text-sm font-medium text-navy hover:border-gold hover:text-gold",
  primary: "inline-flex items-center gap-2 min-h-12 justify-center rounded-lg bg-navy px-6 text-sm font-semibold text-white hover:bg-blue-deep",
  danger: "inline-flex items-center gap-2 min-h-10 justify-center rounded-md bg-red-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-800",
  ghost: "inline-flex items-center gap-2 min-h-10 w-full justify-start rounded-md px-3 text-left text-sm text-navy hover:bg-paper focus-visible:bg-paper",
  floating: "inline-flex items-center gap-2 size-11 justify-center rounded-full bg-white text-navy shadow-md hover:text-red-700",
  custom: "",
};

export function Button({
  className = "",
  variant = "outline",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; ref?: Ref<HTMLButtonElement> }) {
  return (
    <button
      {...props}
      type={type}
      className={`cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-50 ${variantClassName[variant]} ${className}`}
    />
  );
}
