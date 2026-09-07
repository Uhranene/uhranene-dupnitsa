import Link from "next/link";
import { forwardRef } from "react";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

const base =
  "uhd-focus-ring inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

const variants = {
  primary: "bg-primary text-on-primary hover:bg-primary-hover",
  secondary: "bg-secondary text-on-secondary hover:bg-secondary-hover",
  outline:
    "border border-border bg-transparent text-foreground hover:bg-muted",
  ghost: "bg-transparent text-foreground hover:bg-muted",
  destructive: "bg-destructive text-on-destructive hover:opacity-90",
  // Solid white pill for use on colored/photo backgrounds — keep this
  // variant free of border/transparent utilities so it never collides
  // with an outline-style override passed through className.
  inverse: "bg-white text-primary hover:bg-white/90",
  // Translucent outline for use on colored/photo backgrounds.
  "outline-inverse":
    "border border-white/50 bg-white/10 text-white hover:bg-white/20",
};

const sizes = {
  sm: "text-sm px-4 py-2",
  md: "text-[0.95rem] px-5 py-2.5",
  lg: "text-base px-7 py-3.5",
};

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
};

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type LinkButtonProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps | LinkButtonProps
>(function Button(
  { variant = "primary", size = "md", className = "", ...props },
  ref
) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if ("href" in props && props.href) {
    const { href, ...rest } = props as LinkButtonProps;
    return (
      <Link
        href={href}
        className={classes}
        ref={ref as React.Ref<HTMLAnchorElement>}
        {...rest}
      >
        {props.children}
      </Link>
    );
  }

  const { ...rest } = props as ButtonProps;
  return (
    <button
      className={classes}
      ref={ref as React.Ref<HTMLButtonElement>}
      {...rest}
    >
      {props.children}
    </button>
  );
});
