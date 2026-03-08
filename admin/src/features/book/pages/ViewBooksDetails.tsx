/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { ArrowLeft, Calendar, Trash2, FileText } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Separator } from "@/shared/components/ui/separator"
import { DeleteDialog } from "@/shared/components/DeleteDialog"
import toast from "react-hot-toast"

import { getBookById, deleteBook, clearBookState } from "@/features/book/bookSlice"
import type { RootState, AppDispatch } from "@/redux/store"

const ViewBooksDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const { book, loading, error } = useSelector((state: RootState) => state.books)

  /* ===============================
     FETCH BOOK
  ================================ */
  useEffect(() => {
    if (id) dispatch(getBookById(id))
    return () => {
      dispatch(clearBookState())
    }
  }, [id, dispatch])

  if (loading) {
    return <p className="text-center text-muted-foreground">Loading book...</p>
  }

  if (error) {
    return <p className="text-center text-destructive">{error}</p>
  }

  if (!book) return null

  /* ===============================
     DELETE BOOK
  ================================ */
  const handleDelete = async () => {
    try {
      await dispatch(deleteBook(book._id)).unwrap()
      toast.success("Book deleted successfully")
      navigate("/books/all")
    } catch (err: any) {
      toast.error(err || "Delete failed")
    }
  }

  return (
    <div className="space-y-6 mx-auto max-w-6xl py-6">
      {/* Top Actions */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        <DeleteDialog
          onConfirm={handleDelete}
          triggerButton={
            <Button variant="outline" size="sm" className="gap-2 text-destructive">
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          }
          title="Delete Book?"
          description="This will permanently delete this book. This action cannot be undone."
        />
      </div>

      {/* Thumbnail */}
      {book.thumbnail && (
        <img
          src={book.thumbnail}
          alt={book.title}
          className="w-full h-64 object-cover rounded-xl border"
        />
      )}

      <Card>
        <CardHeader className="space-y-4">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{book.category}</Badge>
            {book.tags?.map(tag => (
              <Badge key={tag} variant="outline" className="capitalize">{tag}</Badge>
            ))}
            <Badge variant={book.visibility === "public" ? "default" : "secondary"} className="capitalize">
              {book.visibility}
            </Badge>
          </div>

          {/* Title */}
          <CardTitle className="text-3xl font-bold">{book.title}</CardTitle>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(book.createdAt).toLocaleDateString()}
            </span>
          </div>
        </CardHeader>

        <Separator />

        {/* Description */}
        {book.description && (
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">{book.description}</p>
          </CardContent>
        )}

        {/* PDF / Google Drive Viewer */}
        {book.bookFileUrl && (
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" /> Book File
            </h3>

            {book.bookFileUrl.includes("drive.google.com") ? (
              <iframe
                src={`https://drive.google.com/file/d/${extractDriveId(book.bookFileUrl)}/preview`}
                className="w-full h-150 rounded-md border"
                title="Book PDF"
              />
            ) : (
              <iframe
                src={book.bookFileUrl}
                className="w-full h-150 rounded-md border"
                title="Book PDF"
              />
            )}

            {/* Open / Download */}
            <div className="mt-3">
              <Button variant="outline" asChild>
                <a href={book.bookFileUrl} target="_blank" rel="noopener noreferrer">
                  Open / Download PDF
                </a>
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}

/* Helper to extract Google Drive file ID from link */
function extractDriveId(url: string) {
  const match = url.match(/[-\w]{25,}/)
  return match ? match[0] : ""
}

export default ViewBooksDetails
