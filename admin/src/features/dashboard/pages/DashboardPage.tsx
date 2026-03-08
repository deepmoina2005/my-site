import React from "react"
import Cards from "@/shared/components/dashboard/Cards"
import BlogCharts from "@/shared/components/dashboard/BlogCarts"
import BlogCategoryPieChart from "@/shared/components/dashboard/BlogCategoryPieChart"
import RecentBlogs from "@/shared/components/dashboard/RecentBlogs"
import RecentProjects from "@/shared/components/dashboard/RecentProjects"
import RecentContacts from "@/shared/components/dashboard/RecentContacts"
import ActivityFeed from "@/shared/components/dashboard/ActivityFeed"
import QuickActions from "@/shared/components/dashboard/QuickActions"
import {
  LayoutDashboard,
  BarChart3,
  Clock,
  Zap,
  Activity,
} from "lucide-react"

const SectionHeader = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
  <div className="flex items-center gap-2 mb-4">
    <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
      <Icon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
    </div>
    <h2 className="text-base font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">{title}</h2>
  </div>
)

const DashboardPage = () => {
  return (
    <div className="space-y-10 p-6">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <LayoutDashboard className="h-7 w-7 text-purple-500" />
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400">
          Complete overview of your portfolio CMS content and activity.
        </p>
      </div>

      {/* ── Stats Cards ────────────────────────────────────────── */}
      <section>
        <Cards />
      </section>

      {/* ── Quick Actions ──────────────────────────────────────── */}
      <section>
        <SectionHeader icon={Zap} title="Quick Actions" />
        <QuickActions />
      </section>

      {/* ── Charts Section ─────────────────────────────────────── */}
      <section>
        <SectionHeader icon={BarChart3} title="Analytics" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BlogCharts />
          <BlogCategoryPieChart />
        </div>
      </section>

      {/* ── Recent Content ─────────────────────────────────────── */}
      <section>
        <SectionHeader icon={Clock} title="Recently Added" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecentBlogs />
          <RecentProjects />
        </div>
      </section>

      {/* ── Activity Section ───────────────────────────────────── */}
      <section>
        <SectionHeader icon={Activity} title="Activity & Inquiries" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecentContacts />
          <ActivityFeed />
        </div>
      </section>

    </div>
  )
}

export default DashboardPage