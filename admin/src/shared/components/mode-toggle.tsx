
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/shared/components/theme-provider";
import { cn } from "@/lib/utils";

interface ModeToggleProps {
  className?: string;
}

export function ModeToggle({ className }: ModeToggleProps) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className={cn(
        "relative inline-flex h-8 w-8 items-center justify-center rounded-md border border-border",
        "bg-background hover:bg-muted transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      {/* Sun */}
      <Sun
        className={cn(
          "absolute h-4 w-4 transition-all",
          isDark ? "scale-0 rotate-90" : "scale-100 rotate-0"
        )}
      />

      {/* Moon */}
      <Moon
        className={cn(
          "absolute h-4 w-4 transition-all",
          isDark ? "scale-100 rotate-0" : "scale-0 -rotate-90"
        )}
      />
    </button>
  );
}
