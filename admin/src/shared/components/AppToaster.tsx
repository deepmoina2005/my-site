/* eslint-disable react-hooks/set-state-in-effect */
import { Toaster } from "react-hot-toast"
import { useTheme } from "./theme-provider"
import { useEffect, useState, useMemo } from "react"

const AppToaster = () => {
  const { theme } = useTheme()
  const [isDark, setIsDark] = useState(false)

  // Detect theme changes
  useEffect(() => {
    if (theme === "dark") setIsDark(true)
    else if (theme === "light") setIsDark(false)
    else {
      const darkQuery = window.matchMedia("(prefers-color-scheme: dark)")
      setIsDark(darkQuery.matches)

      const listener = (e: MediaQueryListEvent) => setIsDark(e.matches)
      darkQuery.addEventListener("change", listener)
      return () => darkQuery.removeEventListener("change", listener)
    }
  }, [theme])

  // Base style memoized for performance
  const baseStyle = useMemo(() => ({
    background: isDark ? "#09090b" : "#ffffff", // dark / light
    color: isDark ? "#fafafa" : "#09090b",
    borderRadius: "12px",
    padding: "12px 16px",
    fontSize: "14px",
    fontWeight: 500,
    border: isDark ? "1px solid #27272a" : "1px solid #e4e4e7",
    boxShadow: isDark
      ? "0 10px 30px rgba(0,0,0,0.4)"
      : "0 10px 30px rgba(0,0,0,0.08)",
  }), [isDark])

  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: baseStyle,

        success: {
          iconTheme: {
            primary: "#22c55e", // green-500
            secondary: isDark ? "#09090b" : "#ffffff",
          },
          style: {
            ...baseStyle,
            border: isDark
              ? "1px solid #14532d" // green-900
              : "1px solid #bbf7d0", // green-200
          },
        },

        error: {
          iconTheme: {
            primary: "#ef4444", // red-500
            secondary: isDark ? "#09090b" : "#ffffff",
          },
          style: {
            background: isDark ? "#991b1b" : "#dc2626", // red-900 / red-600
            color: "#ffffff",
            borderRadius: "12px",
            padding: "12px 16px",
            fontSize: "14px",
            fontWeight: 500,
            border: isDark ? "1px solid #7f1d1d" : "1px solid #b91c1c", // dark/light borders
            boxShadow: isDark
              ? "0 10px 30px rgba(0,0,0,0.4)"
              : "0 10px 30px rgba(0,0,0,0.08)",
          },
        },
      }}
    />
  )
}

export default AppToaster
