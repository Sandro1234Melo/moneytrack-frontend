type AlertVariant = "success" | "error" | "warning" | "info";

type Props = {
  message: string;
  variant?: AlertVariant;
};

const variantStyles: Record<AlertVariant, string> = {
  success: `
    bg-green-600/10
    border-green-600
    text-green-400
  `,
  error: `
    bg-red-600/10
    border-red-600
    text-red-400
  `,
  warning: `
    bg-yellow-600/10
    border-yellow-600
    text-yellow-400
  `,
  info: `
    bg-blue-600/10
    border-blue-600
    text-blue-400
  `
};

const Alert: React.FC<Props> = ({
  message,
  variant = "success"
}) => {
  return (
    <div
      className={`
        p-3 rounded-lg
        border
        ${variantStyles[variant]}
      `}
    >
      {message}
    </div>
  );
};

export default Alert;
