/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import { ArrowLeft, Calendar, Trash2, FileText } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Separator } from "@/shared/components/ui/separator"

import { DeleteDialog } from "@/shared/components/DeleteDialog"
import toast from "react-hot-toast"

import {
  getNoteById,
  deleteNote,
  clearNoteState,
} from "@/features/notes/noteSlice"
import type { RootState, AppDispatch } from "@/redux/store"

const ViewNoteDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const { note, loading, error } = useSelector(
    (state: RootState) => state.notes
  )

  /* ===============================
     FETCH NOTE
  ================================ */
  useEffect(() => {
    if (id) dispatch(getNoteById(id))
    return () => {
      dispatch(clearNoteState())
    }
  }, [id, dispatch])

  if (loading) {
    return <p className="text-center text-muted-foreground">Loading note...</p>
  }

  if (error) {
    return <p className="text-center text-destructive">{error}</p>
  }

  if (!note) return null

  /* ===============================
     DELETE NOTE
  ================================ */
  const handleDelete = async () => {
    try {
      await dispatch(deleteNote(note._id)).unwrap()
      toast.success("Note deleted successfully")
      navigate("/notes/all")
    } catch (err: any) {
      toast.error(err || "Delete failed")
    }
  }

  return (
    <div className="space-y-6 mx-auto max-w-6xl py-6">

      {/* Top Actions */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="flex gap-2">
          <DeleteDialog
            onConfirm={handleDelete}
            triggerButton={
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            }
            title="Delete Note?"
            description="This will permanently delete this note. This action cannot be undone."
          />
        </div>
      </div>

      {/* Thumbnail */}
      {note.thumbnail && (
        <img
          src={note.thumbnail}
          alt={note.title}
          className="w-full h-64 object-cover rounded-xl border"
        />
      )}

      <Card>
        <CardHeader className="space-y-4">

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{note.category}</Badge>
          </div>

          {/* Title */}
          <CardTitle className="text-3xl font-bold">
            {note.title}
          </CardTitle>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(note.createdAt).toLocaleDateString()}
            </span>
          </div>
        </CardHeader>

        <Separator />

        {/* Description */}
        {note.description && (
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {note.description}
            </p>
          </CardContent>
        )}

        {/* PDF / Google Drive Viewer */}
        {note.fileUrl && (
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Notes File
            </h3>

            {/* Embed Google Drive PDF if possible */}
            {note.fileUrl.includes("drive.google.com") ? (
              <iframe
                src={`https://drive.google.com/file/d/${extractDriveId(
                  note.fileUrl
                )}/preview`}
                className="w-full h-150 rounded-md border"
                title="Notes PDF"
              />
            ) : (
              <iframe
                src={note.fileUrl}
                className="w-full h-150 rounded-md border"
                title="Notes PDF"
              />
            )}

            {/* Open / Download */}
            <div className="mt-3">
              <Button variant="outline" asChild>
                <a
                  href={note.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
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

export default ViewNoteDetails
