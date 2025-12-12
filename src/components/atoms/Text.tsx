import React from "react";

interface TextProps {
  variant?: "h1" | "h2" | "h3" | "h4" | "body" | "small" | "caption";
  weight?: "normal" | "medium" | "semibold" | "bold";
  color?: "default" | "muted" | "primary" | "success" | "error" | "gradient";
  className?: string;
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

const Text: React.FC<TextProps> = ({
  variant = "body",
  weight = "normal",
  color = "default",
  className = "",
  children,
  as,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "h1":
        return "text-4xl md:text-5xl font-display";
      case "h2":
        return "text-3xl md:text-4xl font-display";
      case "h3":
        return "text-2xl md:text-3xl font-display";
      case "h4":
        return "text-xl md:text-2xl font-display";
      case "body":
        return "text-base";
      case "small":
        return "text-sm";
      case "caption":
        return "text-xs";
      default:
        return "text-base";
    }
  };

  const getWeightClasses = () => {
    switch (weight) {
      case "normal":
        return "font-normal";
      case "medium":
        return "font-medium";
      case "semibold":
        return "font-semibold";
      case "bold":
        return "font-bold";
      default:
        return "font-normal";
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case "default":
        return "text-gray-800";
      case "muted":
        return "text-gray-500";
      case "primary":
        return "text-primary-600";
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      case "gradient":
        return "text-gradient";
      default:
        return "text-gray-800";
    }
  };

  const Component = as || getDefaultTag(variant);

  return React.createElement(
    Component,
    {
      className: `${getVariantClasses()} ${getWeightClasses()} ${getColorClasses()} ${className}`,
    },
    children
  );
};

const getDefaultTag = (
  variant: TextProps["variant"]
): keyof JSX.IntrinsicElements => {
  switch (variant) {
    case "h1":
      return "h1";
    case "h2":
      return "h2";
    case "h3":
      return "h3";
    case "h4":
      return "h4";
    case "caption":
      return "span";
    default:
      return "p";
  }
};

export default Text;
