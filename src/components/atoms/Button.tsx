import React from "react";
import { Button as AntButton, ButtonProps as AntButtonProps } from "antd";

interface ButtonProps extends AntButtonProps {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  gradient?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  gradient = false,
  className = "",
  children,
  ...props
}) => {
  const getVariantClasses = () => {
    if (gradient) {
      return "gradient-primary text-white border-none hover:shadow-xl";
    }

    switch (variant) {
      case "primary":
        return "";
      case "secondary":
        return "bg-white text-primary-600 border-primary-200 hover:bg-primary-50";
      case "ghost":
        return "bg-transparent text-gray-600 border-gray-200 hover:bg-gray-50";
      case "danger":
        return "bg-red-500 text-white border-red-500 hover:bg-red-600";
      default:
        return "";
    }
  };

  return (
    <AntButton
      className={`
        font-medium rounded-xl transition-all duration-300
        ${gradient ? "hover:-translate-y-0.5" : ""}
        ${getVariantClasses()}
        ${className}
      `}
      type={variant === "primary" && !gradient ? "primary" : "default"}
      {...props}
    >
      {children}
    </AntButton>
  );
};

export default Button;
