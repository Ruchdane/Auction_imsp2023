import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../utils";
import { Loader } from "lucide-react";

const buttonVariants = cva(
  "inline-flex  items-center justify-center rounded-md text-sm font-medium transition-all transition-250 focus-visible:outline-none focus-visible:hover:translate-y-ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 hover:opacity-60 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        primary: "text-secondary bg-primary",
        secondary: "text-primary bg-secondary border-solid border-black",
        accent:
          "text-accent bg-accent hover:bg-accent/50 border-solid border-black",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, isLoading, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return isLoading ? (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        disabled
      >
        <Loader className="animate-spin-slow" />
      </Comp>
    ) : (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
