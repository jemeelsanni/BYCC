import { ButtonHTMLAttributes } from "react";

// Define the variants for the Button component without the circular reference
export interface ButtonVariantProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

// Export the Button component props type
export interface ButtonProps 
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariantProps {
  asChild?: boolean;
  className?: string;
}

// This is for the buttonVariants function
declare const buttonVariants: (props?: ButtonVariantProps) => string;

// Export the Button component
declare const Button: React.ForwardRefExoticComponent<
  ButtonProps & React.RefAttributes<HTMLButtonElement>
>;

export { Button, buttonVariants };