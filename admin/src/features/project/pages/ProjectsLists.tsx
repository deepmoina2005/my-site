/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/redux/store"
import {
    getProjects,
    clearProjectState,
    deleteProject,
} from "@/features/project/projectSlice"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/shared/components/ui/pagination"
import { Eye, Pencil, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { DeleteDialog } from "@/shared/components/DeleteDialog"

const ITEMS_PER_PAGE = 10

const ProjectsLists = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const { projects, error, success } = useSelector((state: RootState) => state.projects)

    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [page, setPage] = useState(1)

    // Fetch projects on mount
    useEffect(() => {
        dispatch(getProjects())
    }, [dispatch])

    // Toast notifications
    useEffect(() => {
        if (error) {
            toast.error(error)
            dispatch(clearProjectState())
        }
        if (success) {
            dispatch(getProjects())
            dispatch(clearProjectState())
        }
    }, [error, success, dispatch])

    // Filtered projects
    const filteredProjects = useMemo(() => {
        return projects.filter(proj => {
            const matchesSearch =
                proj.name.toLowerCase().includes(search.toLowerCase()) ||
                (proj.associatedWith?.toLowerCase() || "").includes(search.toLowerCase())

            const matchesStatus =
                statusFilter === "all" ? true : proj.isOngoing === (statusFilter === "Ongoing")

            return matchesSearch && matchesStatus
        })
    }, [projects, search, statusFilter])

    const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE)
    const paginatedProjects = filteredProjects.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    )

    // Delete project
    const handleDelete = async (id: string) => {
        try {
            await dispatch(deleteProject(id)).unwrap()
            toast.success("Project deleted successfully")
        } catch (err: any) {
            toast.error(err || "Delete failed")
        }
    }

    // Format date as YYYY-MM-DD without timezone issues
    const formatDate = (dateString?: string) => {
        if (!dateString) return "-"
        return dateString.split("T")[0]
    }

    return (
        <div className="space-y-6 mt-4">
            {/* Header */}
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl font-semibold">All Projects</CardTitle>
                <Button onClick={() => navigate("/projects/add")}>
                    <Pencil className="h-4 w-4 mr-1" /> Add Project
                </Button>
            </CardHeader>

            <Card>
                <CardContent className="space-y-6 pt-4">
                    {/* Search + Filter */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <Input
                            placeholder="Search by name or associated with..."
                            value={search}
                            onChange={e => {
                                setSearch(e.target.value)
                                setPage(1)
                            }}
                            className="sm:max-w-sm"
                        />
                        <Select
                            value={statusFilter}
                            onValueChange={value => {
                                setStatusFilter(value)
                                setPage(1)
                            }}
                        >
                            <SelectTrigger className="w-full sm:w-44">
                                <SelectValue placeholder="Filter status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="Ongoing">Ongoing</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Table */}
                    <div className="rounded-md border overflow-x-auto">
                        <Table className="min-w-full border-collapse">
                            <TableHeader className="bg-muted/20">
                                <TableRow className="text-left">
                                    <TableHead className="px-3 py-2">Cover</TableHead>
                                    <TableHead className="px-3 py-2">Name</TableHead>
                                    <TableHead className="px-3 py-2">Associated With</TableHead>
                                    <TableHead className="px-3 py-2">Status</TableHead>
                                    <TableHead className="px-3 py-2">Start Date</TableHead>
                                    <TableHead className="px-3 py-2">End Date</TableHead>
                                    <TableHead className="px-3 py-2 text-right pr-20">Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {paginatedProjects.length ? (
                                    paginatedProjects.map(proj => (
                                        <TableRow
                                            key={proj._id}
                                            className="hover:bg-muted/50 transition-colors duration-150"
                                        >
                                            {/* Cover */}
                                            <TableCell className="px-3 py-2">
                                                {proj.coverImage ? (
                                                    proj.coverImage.endsWith(".mp4") ? (
                                                        <video
                                                            src={proj.coverImage}
                                                            className="w-20 h-12 object-cover rounded-md border"
                                                            controls
                                                        />
                                                    ) : (
                                                        <img
                                                            src={proj.coverImage}
                                                            alt={proj.name}
                                                            className="w-20 h-12 object-cover rounded-md border"
                                                        />
                                                    )
                                                ) : (
                                                    <span className="text-muted-foreground text-sm">No Image</span>
                                                )}
                                            </TableCell>

                                            {/* Name */}
                                            <TableCell className="px-3 py-2 font-medium">{proj.name}</TableCell>

                                            {/* Associated With */}
                                            <TableCell className="px-3 py-2">{proj.associatedWith || "-"}</TableCell>

                                            {/* Status */}
                                            <TableCell className="px-3 py-2">
                                                <Badge
                                                    variant={proj.isOngoing ? "default" : "secondary"}
                                                    className="capitalize"
                                                >
                                                    {proj.isOngoing ? "Ongoing" : "Completed"}
                                                </Badge>
                                            </TableCell>

                                            {/* Start Date */}
                                            <TableCell className="px-3 py-2">{formatDate(proj.startDate)}</TableCell>

                                            {/* End Date */}
                                            <TableCell className="px-3 py-2">{formatDate(proj.endDate)}</TableCell>

                                            {/* Actions */}
                                            <TableCell className="px-3 py-2 text-right">
                                                <div className="inline-flex items-center gap-2">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => navigate(`/projects/${proj._id}`)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>

                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => navigate(`/projects/${proj._id}/edit`)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>

                                                    <DeleteDialog
                                                        onConfirm={() => handleDelete(proj._id)}
                                                        triggerButton={
                                                            <Button size="icon" variant="ghost" className="text-destructive">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        }
                                                        title="Delete Project?"
                                                        description="This will permanently delete this project. This action cannot be undone."
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                            No projects found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious onClick={() => setPage(p => Math.max(p - 1, 1))} />
                                    </PaginationItem>

                                    {[...Array(totalPages)].map((_, i) => (
                                        <PaginationItem key={i}>
                                            <PaginationLink
                                                isActive={page === i + 1}
                                                onClick={() => setPage(i + 1)}
                                            >
                                                {i + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}

                                    <PaginationItem>
                                        <PaginationNext onClick={() => setPage(p => Math.min(p + 1, totalPages))} />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default ProjectsLists
