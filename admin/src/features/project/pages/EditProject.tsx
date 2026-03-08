/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useAppDispatch } from "@/redux/hooks"
import type { RootState } from "@/redux/store"

import {
  getProjectById,
  updateProject,
  clearProjectState,
} from "@/features/project/projectSlice"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Button } from "@/shared/components/ui/button"
import { Label } from "@/shared/components/ui/label"
import { Badge } from "@/shared/components/ui/badge"
import { Switch } from "@/shared/components/ui/switch"

import toast from "react-hot-toast"
import { ArrowLeft } from "lucide-react"

export default function EditProject() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { project, loading, error } = useSelector(
    (state: RootState) => state.projects
  )

  /* ===============================
     FORM STATE
  ================================ */
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState("")
  const [liveLink, setLiveLink] = useState("")
  const [codeLink, setCodeLink] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [associatedWith, setAssociatedWith] = useState("")
  const [isOngoing, setIsOngoing] = useState(false)

  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [existingMedia, setExistingMedia] = useState<string[]>([])

  /* ===============================
     LOAD PROJECT
  ================================ */
  useEffect(() => {
    if (id) dispatch(getProjectById(id))
    return () => {
      dispatch(clearProjectState())
    }
  }, [id, dispatch])

  /* ===============================
     POPULATE FORM
  ================================ */
  useEffect(() => {
    if (project) {
      setName(project.name)
      setDescription(project.description)
      setSkills(project.skills || [])
      setLiveLink(project.liveLink || "")
      setCodeLink(project.codeLink || "")
      setStartDate(project.startDate?.split("T")[0] || "")
      setEndDate(project.endDate?.split("T")[0] || "")
      setAssociatedWith(project.associatedWith || "")
      setIsOngoing(project.isOngoing)
      setExistingMedia(project.media || [])
    }
  }, [project])

  /* ===============================
     ERROR HANDLING
  ================================ */
  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  /* ===============================
     SKILLS HANDLERS
  ================================ */
  const addSkill = () => {
    if (!skillInput.trim()) return
    if (!skills.includes(skillInput.trim())) {
      setSkills(prev => [...prev, skillInput.trim()])
    }
    setSkillInput("")
  }

  const removeSkill = (skill: string) =>
    setSkills(prev => prev.filter(s => s !== skill))

  /* ===============================
     MEDIA HANDLER
  ================================ */
  const handleMediaChange = (files: FileList | null) => {
    if (!files) return
    setMediaFiles(Array.from(files))
  }

  /* ===============================
     UPDATE PROJECT
  ================================ */
  const handleUpdate = async () => {
    if (!name || !description || !startDate) {
      toast.error("Name, description and start date are required")
      return
    }

    const formData = new FormData()
    formData.append("name", name)
    formData.append("description", description)
    formData.append("skills", JSON.stringify(skills))
    formData.append("liveLink", liveLink)
    formData.append("codeLink", codeLink)
    formData.append("startDate", startDate)
    if (!isOngoing && endDate) formData.append("endDate", endDate)
    formData.append("associatedWith", associatedWith)
    formData.append("isOngoing", isOngoing.toString())

    mediaFiles.forEach(file => {
      formData.append("media", file)
    })

    try {
      await dispatch(
        updateProject({ id: project!._id, data: formData as any })
      ).unwrap()

      toast.success("Project updated successfully")
      navigate("/projects")
    } catch (err: any) {
      toast.error(err || "Update failed")
    }
  }

  if (loading) return <p className="text-center">Loading project...</p>
  if (!project) return <p className="text-center text-destructive">Project not found</p>

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Project</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Project Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div>
            <Label>Description</Label>
            <Input
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              placeholder="Add skill"
              onKeyDown={e => e.key === "Enter" && addSkill()}
            />
            <Button onClick={addSkill}>Add</Button>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {skills.map(skill => (
              <Badge
                key={skill}
                className="cursor-pointer"
                onClick={() => removeSkill(skill)}
              >
                {skill} ✕
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dates & Status */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Start Date</Label>
            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>

          {!isOngoing && (
            <div>
              <Label>End Date</Label>
              <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
          )}

          <div className="flex items-center gap-2 mt-2">
            <Label>Ongoing</Label>
            <Switch checked={isOngoing} onCheckedChange={setIsOngoing} />
          </div>
        </CardContent>
      </Card>

      {/* Links */}
      <Card>
        <CardHeader>
          <CardTitle>Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Live link" value={liveLink} onChange={e => setLiveLink(e.target.value)} />
          <Input placeholder="Code link" value={codeLink} onChange={e => setCodeLink(e.target.value)} />
        </CardContent>
      </Card>

      {/* Media */}
      <Card>
        <CardHeader>
          <CardTitle>Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input type="file" multiple onChange={e => handleMediaChange(e.target.files)} />

          {existingMedia.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Existing media: {existingMedia.length} files
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save */}
      <Button className="w-full" onClick={handleUpdate} disabled={loading}>
        {loading ? "Updating..." : "Update Project"}
      </Button>
    </div>
  )
}
