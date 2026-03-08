/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/redux/store"
import { getNotes, deleteNote, clearNoteState } from "@/features/notes/noteSlice"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import { Button } from "@/shared/components/ui/button"
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
import { DeleteDialog } from "@/shared/components/DeleteDialog"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const ITEMS_PER_PAGE = 10

const AllNotes = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const { notes, error, success } = useSelector(
    (state: RootState) => state.notes
  )

  const [page, setPage] = useState(1)

  /* ===============================
     FETCH NOTES
  ================================ */
  useEffect(() => {
    dispatch(getNotes())
  }, [dispatch])

  /* ===============================
     TOAST HANDLING
  ================================ */
  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearNoteState())
    }
    if (success) {
      dispatch(getNotes())
      dispatch(clearNoteState())
    }
  }, [error, success, dispatch])

  /* ===============================
     PAGINATION (NO FILTER)
  ================================ */
  const totalPages = Math.ceil(notes.length / ITEMS_PER_PAGE)

  const paginatedNotes = notes.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  /* ===============================
     DELETE NOTE
  ================================ */
  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteNote(id)).unwrap()
      toast.success("Note deleted successfully")
    } catch (err: any) {
      toast.error(err || "Delete failed")
    }
  }

  return (
    <div className="space-y-6 mt-4">

      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-semibold">
          All Notes
        </CardTitle>
        <Button onClick={() => navigate("/notes/add")}>
          <Pencil className="mr-2 h-4 w-4" /> Add Note
        </Button>
      </CardHeader>

      <Card>
        <CardContent className="pt-4">

          {/* Table */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/20">
                <TableRow>
                  <TableHead>Thumbnail</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedNotes.length ? (
                  paginatedNotes.map(note => (
                    <TableRow key={note._id}>

                      {/* Thumbnail */}
                      <TableCell>
                        {note.thumbnail ? (
                          <img
                            src={note.thumbnail}
                            alt={note.title}
                            className="w-20 h-12 object-cover rounded-md border"
                          />
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            No Image
                          </span>
                        )}
                      </TableCell>

                      <TableCell className="font-medium">
                        {note.title}
                      </TableCell>

                      <TableCell>{note.category}</TableCell>

                      <TableCell className="text-muted-foreground">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </TableCell>

                      <TableCell>
                        <div className="items-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              navigate(`/notes/${note._id}`)
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <DeleteDialog
                            onConfirm={() =>
                              handleDelete(note._id)
                            }
                            triggerButton={
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            }
                            title="Delete Note?"
                            description="This will permanently delete this note."
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No notes found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setPage(p => Math.max(p - 1, 1))
                      }
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
                      onClick={() =>
                        setPage(p =>
                          Math.min(p + 1, totalPages)
                        )
                      }
                    />
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

export default AllNotes
