import React from "react";

interface InputProps {
  label?: string;
  value: string | number;
  onChange: (value: any) => void;
  placeholder?: string;
  type?: "text" | "number" | "date";
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="text-sm text-gray-400 mb-1">
          {label}
        </label>
      )}

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(
            type === "number"
              ? Number(e.target.value)
              : e.target.value
          )
        }
        className="
          w-full
          px-3 py-2
          rounded-md
          bg-[#0d1821]
          border border-[#12202a]
          text-white
          placeholder-gray-500
          focus:outline-none
          focus:ring-2
          focus:ring-blue-600
          transition
        "
      />
    </div>
  );
};
