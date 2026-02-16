import { FC, ReactNode, useEffect, useRef } from "react";
import { gsap } from "gsap";

interface BlurTextProps {
  text?: string;
  children?: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  direction?: "top" | "bottom" | "left" | "right";
  splitBy?: "characters" | "words" | "none";
}

export const BlurText: FC<BlurTextProps> = ({
  text,
  children,
  className = "",
  delay = 0,
  duration = 1,
  stagger = 0.03,
  direction = "bottom",
  splitBy = "none",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const content = text || (typeof children === "string" ? children : "");

  useEffect(() => {
    if (!containerRef.current) return;

    const yOffset = direction === "top" ? -20 : direction === "bottom" ? 20 : 0;
    const xOffset = direction === "left" ? -20 : direction === "right" ? 20 : 0;

    if (splitBy === "none") {
      // Animate the whole text
      gsap.fromTo(
        containerRef.current,
        {
          opacity: 0,
          filter: "blur(10px)",
          y: yOffset,
          x: xOffset,
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          x: 0,
          duration: duration,
          delay: delay,
          ease: "power2.out",
        }
      );
    } else {
      // Animate each character/word
      const elements = containerRef.current.querySelectorAll(".blur-char");

      gsap.fromTo(
        elements,
        {
          opacity: 0,
          filter: "blur(10px)",
          y: yOffset,
          x: xOffset,
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          x: 0,
          duration: duration,
          delay: delay,
          stagger: stagger,
          ease: "power2.out",
        }
      );
    }

    return () => {
      gsap.killTweensOf(containerRef.current);
    };
  }, [delay, duration, stagger, direction, splitBy]);

  const renderSplitText = () => {
    if (splitBy === "words") {
      return (content as string).split(" ").map((word, i) => (
        <span key={i} className="blur-char inline-block" style={{ opacity: 0 }}>
          {word}
          {i < (content as string).split(" ").length - 1 ? "\u00A0" : ""}
        </span>
      ));
    }

    if (splitBy === "characters") {
      return (content as string).split("").map((char, i) => (
        <span key={i} className="blur-char inline-block" style={{ opacity: 0 }}>
          {char === " " ? "\u00A0" : char}
        </span>
      ));
    }

    return content;
  };

  return (
    <div ref={containerRef} className={className}>
      {renderSplitText()}
    </div>
  );
};

export default BlurText;
