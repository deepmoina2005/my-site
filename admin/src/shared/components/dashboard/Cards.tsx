import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/redux/store"
import { fetchDashboardStats } from "@/features/dashboard/dashboardSlice"
import {
  BookOpen,
  FolderKanban,
  FileText,
  GraduationCap,
  StickyNote,
  Boxes,
  Award,
  Briefcase,
  MessageSquare,
  School,
  Tags,
  LayoutGrid,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"

const Cards = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { stats, loading } = useSelector((state: RootState) => state.dashboard)

  useEffect(() => {
    dispatch(fetchDashboardStats())
  }, [dispatch])

  const statsData = [
    { title: "Total Blogs", value: stats?.blogs || 0, icon: FileText, color: "text-blue-500" },
    { title: "Total Projects", value: stats?.projects || 0, icon: FolderKanban, color: "text-green-500" },
    { title: "Total Skills", value: stats?.skills || 0, icon: Boxes, color: "text-purple-500" },
    { title: "Total Products", value: stats?.products || 0, icon: BookOpen, color: "text-yellow-500" },
    { title: "Total Books", value: stats?.books || 0, icon: GraduationCap, color: "text-red-500" },
    { title: "Total Notes", value: stats?.notes || 0, icon: StickyNote, color: "text-pink-500" },
    { title: "Total Services", value: stats?.services || 0, icon: LayoutGrid, color: "text-indigo-500" },
    { title: "Certificates", value: stats?.certificates || 0, icon: Award, color: "text-cyan-500" },
    { title: "Experiences", value: stats?.experiences || 0, icon: Briefcase, color: "text-orange-500" },
    { title: "Educations", value: stats?.educations || 0, icon: School, color: "text-emerald-500" },
    { title: "Contact Msgs", value: stats?.contacts || 0, icon: MessageSquare, color: "text-rose-500" },
    { title: "Categories", value: stats?.categories || 0, icon: Tags, color: "text-violet-500" },
  ]

  if (loading && !stats) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(12)].map((_, i) => (
          <Card key={i} className="animate-pulse h-32 bg-slate-100/50 dark:bg-slate-800/50 border-none" />
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {statsData.map((item) => {
          const Icon = item.icon
          return (
            <Card key={item.title} className="hover:shadow-lg transition-all duration-300 border-none bg-white/50 backdrop-blur-xl dark:bg-slate-900/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {item.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${item.color.replace('text-', 'bg-')}/10`}>
                  <Icon className={`h-5 w-5 ${item.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold tracking-tight ${item.color}`}>
                  {item.value}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default Cards
