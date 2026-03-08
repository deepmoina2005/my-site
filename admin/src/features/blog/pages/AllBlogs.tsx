/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/redux/store"
import {
    getBlogs,
    clearBlogState,
    deleteBlog,
} from "@/features/blog/blogSlice"

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
import { Eye, Pen, Pencil, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { DeleteDialog } from "@/shared/components/DeleteDialog"

const ITEMS_PER_PAGE = 10

const AllBlogs = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { blogs, error, success } = useSelector((state: RootState) => state.blogs)
    const navigate = useNavigate()

    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [page, setPage] = useState(1)

    // Fetch blogs on mount
    useEffect(() => {
        dispatch(getBlogs())
    }, [dispatch])

    // Toast notifications
    useEffect(() => {
        if (error) {
            toast.error(error)
            dispatch(clearBlogState())
        }
        if (success) {
            dispatch(getBlogs())
            dispatch(clearBlogState())
        }
    }, [error, success, dispatch])

    // Filtered blogs
    const filteredBlogs = useMemo(() => {
        return blogs.filter(blog => {
            const matchesSearch =
                blog.title.toLowerCase().includes(search.toLowerCase()) ||
                blog.category.toLowerCase().includes(search.toLowerCase())

            const matchesStatus =
                statusFilter === "all" ? true : blog.isPublished === (statusFilter === "Published")

            return matchesSearch && matchesStatus
        })
    }, [blogs, search, statusFilter])

    const totalPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE)
    const paginatedBlogs = filteredBlogs.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    )

    // Delete blog
    const handleDelete = async (slug: string) => {
        try {
            await dispatch(deleteBlog(slug)).unwrap()
            toast.success("Blog deleted successfully")
        } catch (err: any) {
            toast.error(err || "Delete failed")
        }
    }

    return (
        <div className="space-y-6 mt-4">

            {/* Header */}
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl font-semibold">All Blogs</CardTitle>
                <Button onClick={() => navigate("/blog/add")}><Pen/> Write Blog</Button>
            </CardHeader>

            <Card>
                <CardContent className="space-y-6 pt-4">
                    {/* Search + Filter */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <Input
                            placeholder="Search by title or category..."
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
                                <SelectItem value="Published">Published</SelectItem>
                                <SelectItem value="Draft">Draft</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Table */}
                    <div className="rounded-md border overflow-x-auto">
                        <Table className="min-w-full border-collapse">
                            <TableHeader className="bg-muted/20">
                                <TableRow className="text-left">
                                    <TableHead className="px-3 py-2">Cover</TableHead>
                                    <TableHead className="px-3 py-2">Title</TableHead>
                                    <TableHead className="px-3 py-2">Category</TableHead>
                                    <TableHead className="px-3 py-2">Status</TableHead>
                                    <TableHead className="px-3 py-2">Date</TableHead>
                                    <TableHead className="px-3 py-2 text-right pr-20">Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {paginatedBlogs.length ? (
                                    paginatedBlogs.map(blog => (
                                        <TableRow
                                            key={blog._id}
                                            className="hover:bg-muted/50 transition-colors duration-150"
                                        >
                                            {/* Cover */}
                                            <TableCell className="px-3 py-2">
                                                {blog.coverImage ? (
                                                    <img
                                                        src={blog.coverImage}
                                                        alt={blog.title}
                                                        className="w-20 h-12 object-cover rounded-md border"
                                                    />
                                                ) : (
                                                    <span className="text-muted-foreground text-sm">No Image</span>
                                                )}
                                            </TableCell>

                                            {/* Title */}
                                            <TableCell className="px-3 py-2 font-medium">{blog.title}</TableCell>

                                            {/* Category */}
                                            <TableCell className="px-3 py-2">{blog.category}</TableCell>

                                            {/* Status */}
                                            <TableCell className="px-3 py-2">
                                                <Badge
                                                    variant={blog.isPublished ? "default" : "secondary"}
                                                    className="capitalize"
                                                >
                                                    {blog.isPublished ? "Published" : "Draft"}
                                                </Badge>
                                            </TableCell>

                                            {/* Date */}
                                            <TableCell className="px-3 py-2 text-muted-foreground">
                                                {new Date(blog.createdAt).toLocaleDateString()}
                                            </TableCell>

                                            {/* Actions */}
                                            <TableCell className="px-3 py-2 text-right">
                                                <div className="inline-flex items-center gap-2">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => navigate(`/blog/${blog.slug}`)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>

                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => navigate(`/blog/${blog.slug}/edit`)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>

                                                    {/* Delete with AlertDialog */}
                                                    <DeleteDialog
                                                        onConfirm={() => handleDelete(blog.slug)}
                                                        triggerButton={
                                                            <Button size="icon" variant="ghost" className="text-destructive">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        }
                                                        title="Delete Blog?"
                                                        description="This will permanently delete this blog. This action cannot be undone."
                                                    />

                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                            No blogs found
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

export default AllBlogs
