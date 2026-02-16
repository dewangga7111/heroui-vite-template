import { FC, ReactNode, useEffect, useRef } from "react";
import { gsap } from "gsap";

interface SplitTextProps {
  text?: string;
  children?: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  stagger?: number;
  ease?: string;
  splitBy?: "characters" | "words";
}

export const SplitText: FC<SplitTextProps> = ({
  text,
  children,
  className = "",
  delay = 0,
  duration = 0.5,
  y = 20,
  stagger = 0.03,
  ease = "power3.out",
  splitBy = "characters",
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const content = text || (typeof children === "string" ? children : "");

  useEffect(() => {
    if (!containerRef.current) return;

    const elements = containerRef.current.querySelectorAll(".split-char");

    gsap.fromTo(
      elements,
      {
        opacity: 0,
        y: y,
      },
      {
        opacity: 1,
        y: 0,
        duration: duration,
        delay: delay,
        stagger: stagger,
        ease: ease,
      }
    );
  }, [delay, duration, y, stagger, ease]);

  const renderSplitText = () => {
    if (splitBy === "words") {
      return content.split(" ").map((word, i) => (
        <span key={i} className="split-char inline-block" style={{ opacity: 0 }}>
          {word}
          {i < content.split(" ").length - 1 ? "\u00A0" : ""}
        </span>
      ));
    }

    return content.split("").map((char, i) => (
      <span key={i} className="split-char inline-block" style={{ opacity: 0 }}>
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <span ref={containerRef} className={className}>
      {renderSplitText()}
    </span>
  );
};

export default SplitText;
