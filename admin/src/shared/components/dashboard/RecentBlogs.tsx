/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/redux/store"
import { getBlogs } from "@/features/blog/blogSlice"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { FileText, ArrowRight } from "lucide-react"
import { format } from "date-fns"

const RecentBlogs = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { blogs, loading } = useSelector((state: RootState) => state.blogs)

    useEffect(() => {
        if (!blogs || blogs.length === 0) {
            dispatch(getBlogs())
        }
    }, [dispatch, blogs])

    const recent = [...(blogs || [])].slice(0, 5)

    return (
        <Card className="border-none shadow-xl bg-white/60 backdrop-blur-xl dark:bg-slate-900/60 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-blue-500">
                    <FileText className="h-5 w-5" />
                    <CardTitle className="text-base font-semibold text-slate-800 dark:text-white">Recent Blogs</CardTitle>
                </div>
                <Button asChild variant="ghost" size="sm" className="text-slate-500 hover:text-purple-600 text-xs gap-1">
                    <Link to="/blog/all">View All <ArrowRight className="h-3 w-3" /></Link>
                </Button>
            </CardHeader>
            <CardContent className="px-0 pb-0">
                {loading && recent.length === 0 ? (
                    <div className="p-6 space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-12 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 animate-pulse" />
                        ))}
                    </div>
                ) : recent.length === 0 ? (
                    <p className="text-center text-slate-400 py-10 text-sm">No blogs yet.</p>
                ) : (
                    <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                        {recent.map((blog: any) => (
                            <li key={blog._id} className="flex items-start gap-3 px-6 py-3.5 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500">
                                    <FileText className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-slate-800 dark:text-white truncate">{blog.title}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-none">
                                            {blog.category}
                                        </Badge>
                                        <span className="text-xs text-slate-400">
                                            {blog.createdAt ? format(new Date(blog.createdAt), "MMM d, yyyy") : ""}
                                        </span>
                                    </div>
                                </div>
                                {blog.isPublished ? (
                                    <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] px-1.5 py-0 h-4 border-none shrink-0">Published</Badge>
                                ) : (
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 shrink-0">Draft</Badge>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    )
}

export default RecentBlogs
