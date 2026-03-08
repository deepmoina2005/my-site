/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useAppDispatch } from "@/redux/hooks"
import type { RootState } from "@/redux/store"
import { createProject, clearProjectState } from "@/features/project/projectSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Button } from "@/shared/components/ui/button"
import { Label } from "@/shared/components/ui/label"
import { Badge } from "@/shared/components/ui/badge"
import { Switch } from "@/shared/components/ui/switch"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

import { fetchCategories } from "@/features/category/categorySlice"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"

// AddProject Component
const ProjectAdd = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, success, error } = useSelector((state: RootState) => state.projects)
  const { categories } = useSelector((state: RootState) => state.categories)

  // Form state
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState("")
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([])
  const [coverImage, setCoverImage] = useState<File | undefined>(undefined)
  const [coverPreview, setCoverPreview] = useState<string>("")
  const [liveLink, setLiveLink] = useState("")
  const [codeLink, setCodeLink] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isOngoing, setIsOngoing] = useState(false)
  const [associatedWith, setAssociatedWith] = useState("")

  useEffect(() => {
    dispatch(fetchCategories("project"))
  }, [dispatch])

  // Toast notifications
  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearProjectState())
    }
    if (success) {
      toast.success("Project saved successfully ✨")
      navigate("/projects/all")
      dispatch(clearProjectState())
      // Clear form
      setName("")
      setDescription("")
      setSkills([])
      setSkillInput("")
      setMediaFiles([])
      setMediaPreviews([])
      setCoverImage(undefined)
      setCoverPreview("")
      setLiveLink("")
      setCodeLink("")
      setStartDate("")
      setEndDate("")
      setIsOngoing(false)
      setAssociatedWith("")
    }
  }, [error, success, dispatch])

  // Skills
  const addSkill = () => {
    if (!skillInput.trim()) return
    if (!skills.includes(skillInput.trim())) setSkills(prev => [...prev, skillInput.trim()])
    setSkillInput("")
  }
  const removeSkill = (skill: string) => setSkills(prev => prev.filter(s => s !== skill))

  // Media previews
  const handleMediaChange = (files: FileList | null) => {
    if (!files) return
    const fileArray = Array.from(files)
    setMediaFiles(fileArray)
    const previews = fileArray.map(f => URL.createObjectURL(f))
    setMediaPreviews(previews)
  }

  // Cover image preview
  const handleCoverChange = (file: File | null) => {
    if (!file) return
    setCoverImage(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  // Submit project
  const handleSubmit = () => {
    if (!name || !description || !startDate) {
      toast.error("Please fill all required fields: name, description, start date")
      return
    }

    const projectPayload = {
      name,
      description,
      category,
      skills,
      startDate,
      endDate: isOngoing ? undefined : endDate,
      isOngoing,
      liveLink,
      codeLink,
      associatedWith,
      mediaFiles,
      coverImage,
    }

    dispatch(createProject(projectPayload))
  }

  return (
    <div className="py-6 space-y-6">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Project Info */}
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input placeholder="Project Name" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input placeholder="Project Description" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Associated With</Label>
            <Input placeholder="Company / Personal / Course" value={associatedWith} onChange={e => setAssociatedWith(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Category */}
      <Card>
        <CardHeader>
          <CardTitle>Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat: any) => (
                <SelectItem key={cat._id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Add skill"
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addSkill()}
            />
            <Button onClick={addSkill}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {skills.map(skill => (
              <Badge key={skill} variant="secondary" className="cursor-pointer" onClick={() => removeSkill(skill)}>
                {skill} ✕
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cover Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Cover Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input type="file" accept="image/*" onChange={e => handleCoverChange(e.target.files ? e.target.files[0] : null)} />
          {coverPreview && <img src={coverPreview} alt="Cover Preview" className="w-48 h-48 object-cover rounded-md mt-2" />}
        </CardContent>
      </Card>

      {/* Media Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input type="file" multiple accept="image/*,video/*,application/pdf" onChange={e => handleMediaChange(e.target.files)} />
          <div className="flex flex-wrap gap-2 mt-2">
            {mediaPreviews.map((src, idx) => (
              <img key={idx} src={src} alt={`Media ${idx}`} className="w-32 h-32 object-cover rounded-md" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Links */}
      <Card>
        <CardHeader>
          <CardTitle>Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-2">
            <Label>Live Link</Label>
            <Input placeholder="https://example.com" value={liveLink} onChange={e => setLiveLink(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Code Link</Label>
            <Input placeholder="https://github.com/username/repo" value={codeLink} onChange={e => setCodeLink(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Dates & Ongoing */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-6 items-center">
          <div className="flex flex-col gap-1">
            <Label>Start Date</Label>
            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>End Date</Label>
            <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} disabled={isOngoing} />
          </div>
          <div className="flex items-center gap-2">
            <Label>Ongoing</Label>
            <Switch checked={isOngoing} onCheckedChange={setIsOngoing} />
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <Button onClick={handleSubmit} className="w-full" disabled={loading}>
        {loading ? "Saving..." : "Save Project"}
      </Button>
    </div>
  )
}

export default ProjectAdd
