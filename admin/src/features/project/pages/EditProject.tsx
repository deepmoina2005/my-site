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
import { ArrowLeft, Trash2, Plus } from "lucide-react"

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
  const [category, setCategory] = useState("")
  const [features, setFeatures] = useState<{ title: string; description: string }[]>([])

  const [coverImage, setCoverImage] = useState<File | undefined>(undefined)
  const [existingCoverImage, setExistingCoverImage] = useState<string>("")

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
      setExistingCoverImage(project.coverImage || "")
      setCategory(project.category || "")
      setFeatures(project.features || [])
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
     IMAGE HANDLER
  ================================ */
  const handleCoverChange = (file: File | null) => {
    if (!file) return
    setCoverImage(file)
  }

  /* ===============================
     UPDATE PROJECT
  ================================ */
  const handleUpdate = async () => {
    if (!name || !description || !startDate) {
      toast.error("Name, description and start date are required")
      return
    }

    const payload: any = {
      name,
      description,
      skills,
      liveLink,
      codeLink,
      startDate,
      endDate: isOngoing ? undefined : endDate,
      associatedWith,
      isOngoing,
      category,
      features,
      coverImage
    }

    try {
      await dispatch(
        updateProject({ id: project!._id, data: payload })
      ).unwrap()

      toast.success("Project updated successfully")
      navigate("/projects/all")
    } catch (err: any) {
      toast.error(err || "Update failed")
    }
  }

  if (loading && !project) return <p className="text-center py-20">Loading project...</p>
  if (!project) return (
    <div className="text-center py-20">
      <p className="text-destructive mb-4">Project not found</p>
      <Button onClick={() => navigate("/projects/all")}>Go back</Button>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate(-1)} className="gap-2 rounded-xl">
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card className="rounded-[2.5rem] border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <CardHeader>
              <CardTitle>Edit Project: {project.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Project Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} className="rounded-xl h-12" />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="rounded-xl h-12"
                />
              </div>
              <div className="space-y-2">
                <Label>Associated With</Label>
                <Input value={associatedWith} onChange={e => setAssociatedWith(e.target.value)} className="rounded-xl h-12" />
              </div>
            </CardContent>
          </Card>

          {/* Project Features */}
          <Card className="rounded-[2.5rem] border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Project Features</CardTitle>
              <Button onClick={() => setFeatures([...features, { title: "", description: "" }])} size="sm" variant="outline" className="rounded-xl gap-2">
                <Plus size={16} />
                Add Feature
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4 items-start p-6 border rounded-[1.5rem] relative bg-slate-50 dark:bg-slate-900/30 group border-slate-200 dark:border-slate-800 transition-all hover:border-blue-500/30">
                  <div className="flex-grow space-y-3">
                    <Input
                      placeholder="Feature Title"
                      value={feature.title}
                      onChange={e => {
                        const newFeatures = [...features];
                        newFeatures[index].title = e.target.value;
                        setFeatures(newFeatures);
                      }}
                      className="rounded-xl h-10"
                    />
                    <Input
                      placeholder="Feature Description"
                      value={feature.description}
                      onChange={e => {
                        const newFeatures = [...features];
                        newFeatures[index].description = e.target.value;
                        setFeatures(newFeatures);
                      }}
                      className="rounded-xl h-10"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFeatures(features.filter((_, i) => i !== index))}
                    className="shrink-0 text-slate-400 hover:text-red-500 rounded-xl"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              ))}
              {features.length === 0 && (
                <p className="text-center py-10 text-slate-400 border-2 border-dashed rounded-[1.5rem]">No features highlighted yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Timeline */}
          <Card className="rounded-[2.5rem] border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="rounded-xl h-12" />
              </div>

              {!isOngoing && (
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="rounded-xl h-12" />
                </div>
              )}

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                <Label>Ongoing</Label>
                <Switch checked={isOngoing} onCheckedChange={setIsOngoing} />
              </div>
            </CardContent>
          </Card>

          {/* Links */}
          <Card className="rounded-[2.5rem] border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <CardHeader>
              <CardTitle>Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Live Preview</Label>
                <Input placeholder="Live link" value={liveLink} onChange={e => setLiveLink(e.target.value)} className="rounded-xl h-11" />
              </div>
              <div className="space-y-2">
                <Label>Code Repository</Label>
                <Input placeholder="Code link" value={codeLink} onChange={e => setCodeLink(e.target.value)} className="rounded-xl h-11" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Skills */}
      <Card className="rounded-[2.5rem] border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <CardHeader>
          <CardTitle>Skills & Tech Stack</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              placeholder="Add skill"
              onKeyDown={e => e.key === "Enter" && addSkill()}
              className="rounded-xl h-12"
            />
            <Button onClick={addSkill} className="rounded-xl px-8">Add</Button>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {skills.map(skill => (
              <Badge
                key={skill}
                className="cursor-pointer px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 hover:text-red-500 border-0 transition-colors"
                onClick={() => removeSkill(skill)}
              >
                {skill} <span className="ml-2 font-normal opacity-50">✕</span>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cover Image */}
      <Card className="rounded-[2.5rem] border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <CardHeader>
          <CardTitle>Cover Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input type="file" accept="image/*" onChange={e => handleCoverChange(e.target.files ? e.target.files[0] : null)} className="rounded-xl pt-2 border-slate-200" />
          {existingCoverImage && !coverImage && (
            <img src={existingCoverImage} alt="Current Cover" className="w-full max-w-2xl aspect-video object-cover rounded-2xl shadow-md mt-2" />
          )}
          {coverImage && (
            <img src={URL.createObjectURL(coverImage)} alt="New Cover Preview" className="w-full max-w-2xl aspect-video object-cover rounded-2xl shadow-md mt-2" />
          )}
        </CardContent>
      </Card>

      {/* Save */}
      <div className="pt-6">
        <Button className="w-full h-16 rounded-[1.5rem] bg-blue-600 hover:bg-blue-700 text-lg font-black shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98]" onClick={handleUpdate} disabled={loading}>
          {loading ? "Updating Project..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}
