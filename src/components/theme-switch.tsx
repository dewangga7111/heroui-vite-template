import { FC } from "react";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { useTheme } from "next-themes";
import { useIsSSR } from "@react-aria/ssr";
import { Tooltip } from "@heroui/react";
import clsx from "clsx";
import { Moon, Sun } from "lucide-react";

export interface ThemeSwitchProps {
  className?: string;
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({ className }) => {
  const { theme, setTheme } = useTheme();
  const isSSR = useIsSSR();

  const isLight = theme === "light" || isSSR;

  const handleToggle = () => {
    setTheme(isLight ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={clsx(
        "inline-flex items-center justify-center transition-opacity hover:opacity-80 cursor-pointer bg-transparent border-none outline-none",
        className,
      )}
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
    >
      <VisuallyHidden>
        <input
          type="checkbox"
          checked={!isLight}
          onChange={handleToggle}
          aria-label="Toggle theme"
          readOnly
        />
      </VisuallyHidden>
      {isLight ? (
        <Tooltip delay={500} closeDelay={0}>
          <Tooltip.Trigger>
            <Sun size={22} className="text-default-500" />
          </Tooltip.Trigger>
          <Tooltip.Content showArrow placement="bottom">Light Mode</Tooltip.Content>
        </Tooltip>
      ) : (
        <Tooltip delay={500} closeDelay={0}>
          <Tooltip.Trigger>
            <Moon size={22} className="text-default-500" />
          </Tooltip.Trigger>
          <Tooltip.Content showArrow placement="bottom">Dark Mode</Tooltip.Content>
        </Tooltip>
      )}
    </button>
  );
};
