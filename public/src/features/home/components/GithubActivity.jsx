"use client"

import React, { useState } from "react"
import { GitHubCalendar } from "react-github-calendar"
import { useTheme } from "next-themes"

export default function GithubActivity() {

  const [year, setYear] = useState(new Date().getFullYear())
  const { theme } = useTheme()

  const isDark = theme === "dark"

  return (
    <section className="w-full py-8 flex flex-col items-center">

      {/* Year Buttons */}
      <div className="flex gap-3 mb-10">
        {[2026, 2025, 2024].map((y) => (
          <button
            key={y}
            onClick={() => setYear(y)}
            className={`px-5 py-2 rounded-lg border transition-all duration-200
            ${
              year === y
                ? "bg-blue-600 text-white border-blue-600"
                : "border-gray-300 dark:border-gray-700 hover:border-blue-500"
            }`}
          >
            {y}
          </button>
        ))}
      </div>

      {/* Calendar */}
      <div className="w-full max-w-7xl overflow-x-auto flex justify-center">

        <div className="min-w-max">

          <GitHubCalendar
            username="deepmoina2005"
            year={year}
            blockSize={16}
            blockMargin={6}
            fontSize={14}
            colorScheme={isDark ? "dark" : "light"}
            theme={{
              light: [
                "#ebedf0",
                "#9be9a8",
                "#40c463",
                "#30a14e",
                "#216e39",
              ],
              dark: [
                "#161b22",
                "#0e4429",
                "#006d32",
                "#26a641",
                "#39d353",
              ],
            }}
          />

        </div>

      </div>

    </section>
  )
}