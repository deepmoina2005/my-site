/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import { ArrowLeft, Calendar, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Separator } from "@/shared/components/ui/separator"

import toast from "react-hot-toast"

import {
  getProjectById,
  deleteProject,
  clearProjectState,
} from "@/features/project/projectSlice"

import type { RootState, AppDispatch } from "@/redux/store"
import { DeleteDialog } from "@/shared/components/DeleteDialog"

const ViewProjectDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const { project, loading, error } = useSelector(
    (state: RootState) => state.projects
  )

  /* ===============================
     FETCH PROJECT
  ================================ */
  useEffect(() => {
    if (id) dispatch(getProjectById(id))
    return () => {
      dispatch(clearProjectState())
    }
  }, [id, dispatch])

  if (loading) {
    return (
      <p className="text-center text-muted-foreground">
        Loading project...
      </p>
    )
  }

  if (error) {
    return (
      <p className="text-center text-destructive">
        {error}
      </p>
    )
  }

  if (!project) return null

  /* ===============================
     DELETE PROJECT
  ================================ */
  const handleDelete = async () => {
    try {
      await dispatch(deleteProject(project._id)).unwrap()
      toast.success("Project deleted successfully")
      navigate("/projects/all")
    } catch (err: any) {
      toast.error(err || "Delete failed")
    }
  }

  return (
    <div className="space-y-6 mx-auto max-w-6xl py-6">
      {/* Top actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() =>
              navigate(`/projects/${project._id}/edit`)
            }
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Button>

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
            title="Delete Project?"
            description="This project will be permanently deleted. This action cannot be undone."
          />
        </div>
      </div>

      {/* Cover Image */}
      {project.coverImage && (
        <img
          src={project.coverImage}
          alt={project.name}
          className="w-full h-64 object-cover rounded-xl border"
        />
      )}

      <Card>
        <CardHeader className="space-y-4">
          {/* Status */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              {project.associatedWith || "Personal"}
            </Badge>

            <Badge
              variant={project.isOngoing ? "default" : "outline"}
            >
              {project.isOngoing ? "Ongoing" : "Completed"}
            </Badge>
          </div>

          {/* Title */}
          <CardTitle className="text-3xl font-bold">
            {project.name}
          </CardTitle>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(project.startDate).toLocaleDateString()}
              {project.endDate &&
                ` → ${new Date(project.endDate).toLocaleDateString()}`}
            </span>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2">
            {project.skills.map(skill => (
              <Badge key={skill} variant="outline">
                {skill}
              </Badge>
            ))}
          </div>
        </CardHeader>

        <Separator />

        {/* Description */}
        <CardContent className="py-6 space-y-4">
          <p className="text-muted-foreground">
            {project.description}
          </p>

          {/* Links */}
          {(project.liveLink || project.codeLink) && (
            <div className="flex flex-wrap gap-4">
              {project.liveLink && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  Live Project
                </a>
              )}

              {project.codeLink && (
                <a
                  href={project.codeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  Source Code
                </a>
              )}
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  )
}

export default ViewProjectDetails
