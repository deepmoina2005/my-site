/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/redux/store"
import {
  fetchCategories,
  deleteCategory,
  addCategory,
  updateCategory,
} from "@/features/category/categorySlice"

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog"

import { Trash2, Pencil, Plus, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import toast from "react-hot-toast"

const ITEMS_PER_PAGE = 6
const MODULES = ["blog", "project", "book", "note", "service", "product", "skill"]

const CategoryList = () => {
  const dispatch = useDispatch<AppDispatch>()

  const { categories, loading, error } = useSelector(
    (state: RootState) => state.categories
  )

  const [search, setSearch] = useState("")
  const [moduleFilter, setModuleFilter] = useState("all")
  const [page, setPage] = useState(1)

  // Dialog state
  const [open, setOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ name: "", module: "", description: "" })

  /* ================= FETCH ================= */
  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  /* ================= TOAST ================= */
  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error, dispatch])

  /* ================= FILTER ================= */
  const filteredCategories = useMemo(() => {
    return categories.filter((cat: any) => {
      const matchesSearch =
        cat.name.toLowerCase().includes(search.toLowerCase()) ||
        (cat.description?.toLowerCase().includes(search.toLowerCase()) ?? false)

      const matchesModule =
        moduleFilter === "all" ? true : cat.module === moduleFilter

      return matchesSearch && matchesModule
    })
  }, [categories, search, moduleFilter])

  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE)
  const paginatedCategories = filteredCategories.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  /* ================= DELETE ================= */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return
    try {
      await dispatch(deleteCategory(id)).unwrap()
      toast.success("Category deleted successfully")
    } catch (err: any) {
      toast.error(err || "Delete failed")
    }
  }

  /* ================= OPEN DIALOG ================= */
  const handleOpenDialog = (category?: any, edit = false) => {
    if (category) {
      setSelectedCategory(category)
      setFormData({
        name: category.name,
        module: category.module,
        description: category.description || "",
      })
      setIsEditing(edit)
    } else {
      setSelectedCategory(null)
      setFormData({ name: "", module: "", description: "" })
      setIsEditing(false)
    }
    setOpen(true)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.module) {
      toast.error("Name and module are required")
      return
    }

    try {
      if (isEditing && selectedCategory) {
        await dispatch(
          updateCategory({ id: selectedCategory._id, data: formData })
        ).unwrap()
        toast.success("Category updated")
      } else {
        await dispatch(addCategory(formData)).unwrap()
        toast.success("Category added")
      }
      dispatch(fetchCategories())
      setOpen(false)
    } catch (err: any) {
      toast.error(err || "Operation failed")
    }
  }

  return (
    <div className="space-y-6 mt-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-semibold">All Categories</CardTitle>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </CardHeader>

      <Card>
        <CardContent className="space-y-6 pt-4">
          {/* Search + Filter */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Input
              placeholder="Search categories..."
              value={search}
              onChange={e => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="sm:max-w-sm"
            />

            <Select
              value={moduleFilter}
              onValueChange={value => {
                setModuleFilter(value)
                setPage(1)
              }}
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Filter module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {MODULES.map(mod => (
                  <SelectItem key={mod} value={mod} className="capitalize">
                    {mod}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedCategories.length ? (
                  paginatedCategories.map((cat: any) => (
                    <TableRow key={cat._id}>
                      <TableCell className="font-medium">{cat.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {cat.module}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {cat.description || "-"}
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleOpenDialog(cat, true)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => handleDelete(cat._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      {loading ? (
                        "Loading..."
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <AlertCircle className="h-6 w-6 text-slate-400" />
                          <span>No categories found</span>
                        </div>
                      )}
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
                    <PaginationPrevious
                      onClick={() => setPage(p => Math.max(p - 1, 1))}
                    />
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
                    <PaginationNext
                      onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Category Name</label>
              <Input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Category name"
                className="h-11 w-full rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Module</label>
              <Select
                value={formData.module}
                onValueChange={val => setFormData({ ...formData, module: val })}
              >
                <SelectTrigger className="h-11 w-full rounded-xl">
                  <SelectValue placeholder="Select Module" />
                </SelectTrigger>
                <SelectContent>
                  {MODULES.map(mod => (
                    <SelectItem key={mod} value={mod} className="capitalize">
                      {mod}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Description (Optional)</label>
              <Input
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Short description"
                className="h-11 w-full rounded-xl"
              />
            </div>

            <DialogFooter className="pt-4 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="h-11 flex-1 rounded-xl"
              >
                Cancel
              </Button>
              <Button type="submit" className="h-11 flex-1 rounded-xl bg-purple-600 hover:bg-purple-700">
                {isEditing ? "Update Category" : "Save Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CategoryList