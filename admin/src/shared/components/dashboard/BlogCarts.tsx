/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useMemo, useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { AppDispatch, RootState } from "@/redux/store"
import { getBlogs } from "@/features/blog/blogSlice"

import { TrendingUp } from "lucide-react"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/shared/components/ui/chart"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/shared/components/ui/card"

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/shared/components/ui/select"



/* ===============================
   CHART CONFIG
================================ */
const chartConfig = {
    blogs: {
        label: "Blogs",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

/* ===============================
   MONTH LIST
================================ */
const months = [
    "All", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

/* ===============================
   COMPONENT
================================ */
const BlogCharts = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { blogs } = useSelector((state: RootState) => state.blogs)
    const [selectedMonth, setSelectedMonth] = useState("All") // default "All"

    useEffect(() => {
        if (!blogs || blogs.length === 0) {
            dispatch(getBlogs())
        }
    }, [dispatch, blogs])

    // Use redux blogs
    const sourceBlogs = blogs || []

    // Transform blogs into monthly counts
    const chartData = useMemo(() => {
        const monthMap: Record<string, number> = {}

        sourceBlogs.forEach((blog: any) => {
            const date = new Date(blog.createdAt)
            const month = date.toLocaleString("default", { month: "short" })
            monthMap[month] = (monthMap[month] || 0) + 1
        })

        // Ensure months are in calendar order
        const orderedMonths = months.slice(1) // skip "All"
        const data = orderedMonths
            .filter((m) => monthMap[m])
            .map((m) => ({ month: m, blogs: monthMap[m] }))

        // Filter by selected month
        if (selectedMonth === "All") return data
        return data.filter((d) => d.month === selectedMonth)
    }, [sourceBlogs, selectedMonth])

    return (
        <Card className="flex flex-col">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <CardTitle>Blogs Trend</CardTitle>
                    <CardDescription>Monthly blog posts</CardDescription>
                </div>

                {/* Month filter dropdown */}
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-32">
                        <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                        {months.map((m) => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardHeader>

            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-62.5">
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{ left: 12, right: 12 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" hideLabel />}
                        />
                        <Area
                            type="linear"
                            dataKey="blogs"
                            fill="var(--color-blogs)"
                            fillOpacity={0.3}
                            stroke="var(--color-blogs)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>

            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium">
                    Blogs trending <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground">
                    Showing total blog posts per month
                </div>
            </CardFooter>
        </Card>
    )
}

export default BlogCharts
