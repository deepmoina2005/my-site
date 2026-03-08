/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/redux/store"
import { fetchContacts } from "@/features/contact/contactSlice"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { MessageSquare, ArrowRight, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

const RecentContacts = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { contacts, loading } = useSelector((state: RootState) => state.contacts)

    useEffect(() => {
        if (!contacts || contacts.length === 0) {
            dispatch(fetchContacts())
        }
    }, [dispatch, contacts])

    const recent = [...(contacts || [])].slice(0, 5)

    return (
        <Card className="border-none shadow-xl bg-white/60 backdrop-blur-xl dark:bg-slate-900/60 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-rose-500">
                    <MessageSquare className="h-5 w-5" />
                    <CardTitle className="text-base font-semibold text-slate-800 dark:text-white">Recent Contact Messages</CardTitle>
                </div>
                <Button asChild variant="ghost" size="sm" className="text-slate-500 hover:text-purple-600 text-xs gap-1">
                    <Link to="/contact">View All <ArrowRight className="h-3 w-3" /></Link>
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
                    <p className="text-center text-slate-400 py-10 text-sm">No messages yet.</p>
                ) : (
                    <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                        {recent.map((c: any) => (
                            <li key={c._id} className="flex items-center gap-3 px-6 py-3.5 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-500 font-bold text-sm">
                                    {c.name?.charAt(0)?.toUpperCase() || "?"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-slate-800 dark:text-white truncate">{c.name}</p>
                                    <p className="text-xs text-slate-500 truncate">{c.service || c.subject || "General Inquiry"}</p>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-slate-400 shrink-0">
                                    <Clock className="h-3 w-3" />
                                    <span>{formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}</span>
                                </div>
                                {c.status === "unread" && (
                                    <Badge className="bg-rose-500 text-white text-[10px] px-1.5 py-0 h-4">New</Badge>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    )
}

export default RecentContacts
