import { Link } from "react-router-dom"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { FileText, FolderKanban, Wrench, Package, Boxes } from "lucide-react"

const actions = [
    { label: "Add Blog", icon: FileText, to: "/blog/add", color: "bg-blue-500 hover:bg-blue-600" },
    { label: "Add Project", icon: FolderKanban, to: "/projects/add", color: "bg-green-500 hover:bg-green-600" },
    { label: "Add Service", icon: Wrench, to: "/services/add", color: "bg-indigo-500 hover:bg-indigo-600" },
    { label: "Add Product", icon: Package, to: "/products/add", color: "bg-yellow-500 hover:bg-yellow-600" },
    { label: "Add Skill", icon: Boxes, to: "/skills/add", color: "bg-purple-500 hover:bg-purple-600" },
]

const QuickActions = () => {
    return (
        <Card className="border-none shadow-xl bg-white/60 backdrop-blur-xl dark:bg-slate-900/60">
            <CardContent className="pt-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {actions.map((action) => {
                        const Icon = action.icon
                        return (
                            <Button
                                key={action.label}
                                asChild
                                className={`${action.color} text-white font-semibold rounded-xl h-auto py-3 flex-col gap-2 shadow-md transition-all duration-200 hover:scale-[1.04] hover:shadow-lg`}
                            >
                                <Link to={action.to}>
                                    <Icon className="h-5 w-5" />
                                    <span className="text-xs">{action.label}</span>
                                </Link>
                            </Button>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}

export default QuickActions
