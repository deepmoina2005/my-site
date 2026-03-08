"use client"

import { useMemo } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"

import { Pie, PieChart } from "recharts"
import { TrendingUp } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/components/ui/chart"

// ✅ Demo categories fallback
const demoCategories: Record<string, number> = {
  Technology: 5,
  JavaScript: 3,
  React: 4,
  Backend: 2,
  AI: 1,
}

// 🎨 Color palette (shadcn compatible)
const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

const BlogCategoryPieChart = () => {
  const { blogs } = useSelector((state: RootState) => state.blogs)

  // 🧠 Prepare category data
  const chartData = useMemo(() => {
    const map: Record<string, number> = {}

    if (blogs && blogs.length > 0) {
      blogs.forEach((blog) => {
        if (blog.category) {
          map[blog.category] = (map[blog.category] || 0) + 1
        }
      })
    } else {
      Object.entries(demoCategories).forEach(
        ([category, count]) => {
          map[category] = count
        }
      )
    }

    return Object.entries(map).map(
      ([category, value], index) => ({
        category,
        value,
        fill: COLORS[index % COLORS.length],
      })
    )
  }, [blogs])

  // ⚙️ Chart config for shadcn
  const chartConfig = useMemo(() => {
    const config: ChartConfig = {
      value: { label: "Blogs" },
    }

    chartData.forEach((item, index) => {
      config[item.category] = {
        label: item.category,
        color: COLORS[index % COLORS.length],
      }
    })

    return config
  }, [chartData])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Blog Categories</CardTitle>
        <CardDescription>
          Distribution of blogs by category
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-65
          [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="category"
              label
            />
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium">
          Categories overview <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground">
          Showing blog category distribution
        </div>
      </CardFooter>
    </Card>
  )
}

export default BlogCategoryPieChart
