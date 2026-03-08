/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { ArrowLeft, Trash2, Calendar, FileText } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Separator } from "@/shared/components/ui/separator"
import { DeleteDialog } from "@/shared/components/DeleteDialog"
import toast from "react-hot-toast"

import { getExperienceById, deleteExperience, clearExperienceState } from "@/features/experience/experienceSlice"
import type { RootState, AppDispatch } from "@/redux/store"

const ViewExperienceDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const { experience, loading, error } = useSelector((state: RootState) => state.expriences)

  /* ===============================
     FETCH EXPERIENCE
  ================================ */
  useEffect(() => {
    if (id) dispatch(getExperienceById(id))
    return () => { dispatch(clearExperienceState()) }
  }, [id, dispatch])

  if (loading) return <p className="text-center text-muted-foreground">Loading experience...</p>
  if (error) return <p className="text-center text-destructive">{error}</p>
  if (!experience) return null

  /* ===============================
     DELETE EXPERIENCE
  ================================ */
  const handleDelete = async () => {
    try {
      await dispatch(deleteExperience(experience._id)).unwrap()
      toast.success("Experience deleted successfully")
      navigate("/experience/all")
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
          title="Delete Experience?"
          description="This will permanently delete this experience. This action cannot be undone."
        />
      </div>

      <Card>
        <CardHeader className="space-y-4">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {experience.category && <Badge variant="secondary">{experience.category}</Badge>}
            {experience.tags?.map(tag => (
              <Badge key={tag} variant="outline" className="capitalize">{tag}</Badge>
            ))}
            <Badge variant={experience.visibility === "public" ? "default" : "secondary"} className="capitalize">
              {experience.visibility}
            </Badge>
          </div>

          {/* Title */}
          <CardTitle className="text-3xl font-bold">{experience.title}</CardTitle>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>Company: {experience.company}</span>
            <span>Work Mode: {experience.workMode}</span>
            <span>Location: {experience.location}</span>
            <span>
              <Calendar className="h-4 w-4 inline mr-1" />
              {new Date(experience.startDate).toLocaleDateString()} -{" "}
              {experience.isOngoing ? "Present" : experience.endDate ? new Date(experience.endDate).toLocaleDateString() : "-"}
            </span>
          </div>
        </CardHeader>

        <Separator />

        {/* Description */}
        {experience.description && (
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">{experience.description}</p>
          </CardContent>
        )}

        {/* Proofs / Documents */}
        {experience.proofs?.length > 0 && (
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" /> Proofs / Documents
            </h3>

            <div className="space-y-4">
              {experience.proofs.map((link: any, idx: number) => (
                <div key={idx} className="space-y-2">
                  {/* Only show iframe if it's a Google Drive link */}
                  {typeof link === 'string' && link.includes("drive.google.com") && (
                    <iframe
                      src={`https://drive.google.com/file/d/${extractDriveId(link)}/preview`}
                      className="w-full h-60 rounded-md border"
                      title="Proof Document"
                    />
                  )}
                  {/* Always show open/download link */}
                  <Button variant="outline" asChild>
                    <a href={typeof link === 'string' ? link : '#'} target="_blank" rel="noopener noreferrer">
                      Open / Download
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        )}

        {/* Company Logo */}
        {experience.logo && (
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">Company Logo</h3>
            <img
              src={experience.logo}
              alt={experience.company}
              className="w-32 h-32 object-cover rounded-md border"
            />
          </CardContent>
        )}
      </Card>
    </div>
  )
}

/* Helper to extract Google Drive file ID */
function extractDriveId(url: string) {
  const match = url.match(/[-\w]{25,}/)
  return match ? match[0] : ""
}

export default ViewExperienceDetails
