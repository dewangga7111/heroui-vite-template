import { CSSProperties, FC, ReactNode } from "react";

interface ShinyTextProps {
  text?: string;
  children?: ReactNode;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export const ShinyText: FC<ShinyTextProps> = ({
  text,
  children,
  disabled = false,
  speed = 5,
  className = "",
}) => {
  const animationDuration = `${speed}s`;

  const maskStyle: CSSProperties = disabled
    ? {}
    : {
        maskImage:
          "linear-gradient(-75deg, rgba(0,0,0,0.6) 30%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.6) 70%)",
        maskSize: "200%",
        animation: `shine ${animationDuration} infinite`,
      };

  return (
    <>
      <style>
        {`
          @keyframes shine {
            from {
              mask-position: 150%;
            }
            to {
              mask-position: -50%;
            }
          }
        `}
      </style>
      <span className={className} style={maskStyle}>
        {children || text}
      </span>
    </>
  );
};

export default ShinyText;
