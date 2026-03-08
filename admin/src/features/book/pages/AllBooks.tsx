/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/redux/store"
import { getBooks, deleteBook, clearBookState } from "@/features/book/bookSlice"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Eye, Pencil, Trash2 } from "lucide-react"
import toast from "react-hot-toast"
import { DeleteDialog } from "@/shared/components/DeleteDialog"
import { useNavigate } from "react-router-dom"

const ITEMS_PER_PAGE = 5

const AllBooks = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const { books, success, error } = useSelector((state: RootState) => state.books)

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [visibilityFilter, setVisibilityFilter] = useState("all")

  // ---------------- FETCH BOOKS ----------------
  useEffect(() => {
    dispatch(getBooks())
  }, [dispatch])

  // ---------------- HANDLE TOASTS ----------------
  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearBookState())
    }
    if (success) {
      dispatch(getBooks())
      dispatch(clearBookState())
    }
  }, [error, success, dispatch])

  // ---------------- FILTERED + PAGINATION ----------------
  const filteredBooks = books.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.category.toLowerCase().includes(search.toLowerCase())
    const matchesVisibility =
      visibilityFilter === "all" ? true : book.visibility === visibilityFilter
    return matchesSearch && matchesVisibility
  })

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE)
  const paginatedBooks = filteredBooks.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  // ---------------- DELETE BOOK ----------------
  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteBook(id)).unwrap()
      toast.success("Book deleted successfully")
    } catch (err: any) {
      toast.error(err || "Delete failed")
    }
  }

  return (
    <div className="space-y-6 mt-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-semibold">All Books</CardTitle>
          <Button onClick={() => navigate("/books/add")}>
            <Pencil className="mr-2 h-4 w-4" /> Add Book
          </Button>
        </CardHeader>

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
              value={visibilityFilter}
              onValueChange={value => {
                setVisibilityFilter(value)
                setPage(1)
              }}
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Filter visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
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
                  <TableHead className="px-3 py-2">Visibility</TableHead>
                  <TableHead className="px-3 py-2">Date</TableHead>
                  <TableHead className="px-3 py-2">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedBooks.length ? (
                  paginatedBooks.map(book => (
                    <TableRow key={book._id} className="hover:bg-muted/50 transition-colors duration-150">
                      <TableCell className="px-3 py-2">
                        {book.thumbnail ? (
                          <img
                            src={book.thumbnail}
                            alt={book.title}
                            className="w-20 h-12 object-cover rounded-md border"
                          />
                        ) : (
                          <span className="text-muted-foreground text-sm">No Image</span>
                        )}
                      </TableCell>
                      <TableCell className="px-3 py-2 font-medium">{book.title}</TableCell>
                      <TableCell className="px-3 py-2">{book.category}</TableCell>
                      <TableCell className="px-3 py-2">
                        <Badge
                          variant={book.visibility === "public" ? "default" : "secondary"}
                          className="capitalize"
                        >
                          {book.visibility}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-3 py-2 text-muted-foreground">
                        {new Date(book.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="px-3 py-2 text-muted-foreground">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => navigate(`/books/${book._id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <DeleteDialog
                            onConfirm={() => handleDelete(book._id)}
                            triggerButton={
                              <Button size="icon" variant="ghost" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            }
                            title="Delete Book?"
                            description="This will permanently delete this book."
                          />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No books found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <div className="inline-flex gap-1">
                <Button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>Prev</Button>
                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    variant={page === i + 1 ? "default" : "outline"}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>Next</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AllBooks
