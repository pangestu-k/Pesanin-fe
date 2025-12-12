import React from "react";
import { Input as AntInput } from "antd";
import type { InputProps as AntInputProps } from "antd";

interface InputProps extends AntInputProps {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <AntInput
        className={`
          input-field
          ${error ? "border-red-500 focus:ring-red-500" : ""}
          ${className}
        `}
        status={error ? "error" : undefined}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export const TextArea: React.FC<InputProps & { rows?: number }> = ({
  label,
  error,
  className = "",
  rows = 4,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <AntInput.TextArea
        rows={rows}
        className={`
          input-field
          ${error ? "border-red-500 focus:ring-red-500" : ""}
          ${className}
        `}
        status={error ? "error" : undefined}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export const Password: React.FC<InputProps> = ({
  label,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <AntInput.Password
        className={`
          input-field
          ${error ? "border-red-500 focus:ring-red-500" : ""}
          ${className}
        `}
        status={error ? "error" : undefined}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
