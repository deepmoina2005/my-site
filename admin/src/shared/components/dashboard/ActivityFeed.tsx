/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Activity, FileText, FolderKanban, Wrench, MessageSquare } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

const getIcon = (type: string) => {
    switch (type) {
        case "blog": return <FileText className="h-4 w-4 text-blue-500" />
        case "project": return <FolderKanban className="h-4 w-4 text-green-500" />
        case "service": return <Wrench className="h-4 w-4 text-indigo-500" />
        case "contact": return <MessageSquare className="h-4 w-4 text-rose-500" />
        default: return <Activity className="h-4 w-4 text-slate-400" />
    }
}

const getBg = (type: string) => {
    switch (type) {
        case "blog": return "bg-blue-100 dark:bg-blue-900/30"
        case "project": return "bg-green-100 dark:bg-green-900/30"
        case "service": return "bg-indigo-100 dark:bg-indigo-900/30"
        case "contact": return "bg-rose-100 dark:bg-rose-900/30"
        default: return "bg-slate-100 dark:bg-slate-800"
    }
}

const ActivityFeed = () => {
    const { blogs } = useSelector((state: RootState) => state.blogs)
    const { projects } = useSelector((state: RootState) => state.projects)
    const { contacts } = useSelector((state: RootState) => state.contacts)

    // Merge latest items from each as a unified activity stream
    const activities: { type: string; label: string; createdAt: string }[] = []

    blogs.slice(0, 3).forEach((b: any) => {
        activities.push({ type: "blog", label: `Blog "${b.title}" was published`, createdAt: b.createdAt })
    })
    projects.slice(0, 3).forEach((p: any) => {
        activities.push({ type: "project", label: `Project "${p.name}" was added`, createdAt: p.createdAt })
    })
    contacts.slice(0, 3).forEach((c: any) => {
        activities.push({ type: "contact", label: `New inquiry from ${c.name}`, createdAt: c.createdAt })
    })

    // Sort by date descending, take top 8
    const sorted = activities
        .filter(a => !!a.createdAt)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 8)

    return (
        <Card className="border-none shadow-xl bg-white/60 backdrop-blur-xl dark:bg-slate-900/60 overflow-hidden">
            <CardHeader className="flex flex-row items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-orange-500">
                    <Activity className="h-5 w-5" />
                    <CardTitle className="text-base font-semibold text-slate-800 dark:text-white">Activity Feed</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
                {sorted.length === 0 ? (
                    <p className="text-center text-slate-400 py-10 text-sm">No activity yet.</p>
                ) : (
                    <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                        {sorted.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                                <div className={`flex-shrink-0 w-7 h-7 rounded-full ${getBg(item.type)} flex items-center justify-center`}>
                                    {getIcon(item.type)}
                                </div>
                                <p className="flex-1 text-sm text-slate-700 dark:text-slate-300">{item.label}</p>
                                <span className="text-xs text-slate-400 shrink-0">
                                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    )
}

export default ActivityFeed
