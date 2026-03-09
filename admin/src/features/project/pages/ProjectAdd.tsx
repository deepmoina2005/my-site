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
import { ArrowLeft, Trash2, Plus } from "lucide-react"

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
  const [coverImage, setCoverImage] = useState<File | undefined>(undefined)
  const [coverPreview, setCoverPreview] = useState<string>("")
  const [liveLink, setLiveLink] = useState("")
  const [codeLink, setCodeLink] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isOngoing, setIsOngoing] = useState(false)
  const [associatedWith, setAssociatedWith] = useState("")
  const [features, setFeatures] = useState<{ title: string; description: string }[]>([])

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
      setCoverImage(undefined)
      setCoverPreview("")
      setLiveLink("")
      setCodeLink("")
      setStartDate("")
      setEndDate("")
      setIsOngoing(false)
      setAssociatedWith("")
      setFeatures([])
    }
  }, [error, success, dispatch])

  // Skills
  const addSkill = () => {
    if (!skillInput.trim()) return
    if (!skills.includes(skillInput.trim())) setSkills(prev => [...prev, skillInput.trim()])
    setSkillInput("")
  }
  const removeSkill = (skill: string) => setSkills(prev => prev.filter(s => s !== skill))

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
      coverImage,
      features,
    }

    dispatch(createProject(projectPayload as any))
  }

  return (
    <div className="py-6 space-y-6">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Button variant="outline" className="gap-2 rounded-xl" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Project Info */}
          <Card className="rounded-[2rem] border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Project Name</Label>
                <Input placeholder="Project Name" value={name} onChange={e => setName(e.target.value)} className="rounded-xl h-12" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input placeholder="Project Description" value={description} onChange={e => setDescription(e.target.value)} className="rounded-xl h-12" />
              </div>
              <div className="space-y-2">
                <Label>Associated With</Label>
                <Input placeholder="Company / Personal / Course" value={associatedWith} onChange={e => setAssociatedWith(e.target.value)} className="rounded-xl h-12" />
              </div>
            </CardContent>
          </Card>

          {/* Project Features */}
          <Card className="rounded-[2rem] border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Project Features</CardTitle>
              <Button onClick={() => setFeatures([...features, { title: "", description: "" }])} size="sm" variant="outline" className="rounded-xl gap-2">
                <Plus size={16} />
                Add Feature
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4 items-start p-6 border rounded-[1.5rem] relative bg-slate-50 dark:bg-slate-900/30 group border-slate-100 dark:border-slate-800 transition-all hover:border-blue-500/30">
                  <div className="flex-grow space-y-3">
                    <Input
                      placeholder="e.g., Responsive Design"
                      value={feature.title}
                      onChange={e => {
                        const newFeatures = [...features];
                        newFeatures[index].title = e.target.value;
                        setFeatures(newFeatures);
                      }}
                      className="rounded-xl border-slate-200 dark:border-slate-700 h-10"
                    />
                    <Input
                      placeholder="Brief details about this feature..."
                      value={feature.description}
                      onChange={e => {
                        const newFeatures = [...features];
                        newFeatures[index].description = e.target.value;
                        setFeatures(newFeatures);
                      }}
                      className="rounded-xl border-slate-200 dark:border-slate-700 h-10"
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
                <div className="text-center py-10 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[1.5rem] text-slate-400">
                  No features added yet. Click "Add Feature" to highlight project highlights.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Category */}
          <Card className="rounded-[2rem] border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <CardHeader>
              <CardTitle>Categorization</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full rounded-xl h-12">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {categories.map((cat: any) => (
                    <SelectItem key={cat._id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="rounded-[2rem] border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
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
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <Label className="cursor-pointer">Ongoing Project</Label>
                <Switch checked={isOngoing} onCheckedChange={setIsOngoing} />
              </div>
            </CardContent>
          </Card>

          {/* Links */}
          <Card className="rounded-[2rem] border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <CardHeader>
              <CardTitle>Project Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Live Link</Label>
                <Input placeholder="https://example.com" value={liveLink} onChange={e => setLiveLink(e.target.value)} className="rounded-xl h-11" />
              </div>
              <div className="space-y-2">
                <Label>Code Link</Label>
                <Input placeholder="https://github.com/username/repo" value={codeLink} onChange={e => setCodeLink(e.target.value)} className="rounded-xl h-11" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Skills */}
      <Card className="rounded-[2rem] border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <CardHeader>
          <CardTitle>Skills & Technologies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="e.g., React, Node.js, AWS"
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addSkill()}
              className="rounded-xl h-12"
            />
            <Button onClick={addSkill} className="rounded-xl px-8">Add</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {skills.map(skill => (
              <Badge key={skill} variant="secondary" className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer border-0" onClick={() => removeSkill(skill)}>
                {skill} <span className="ml-2 font-normal opacity-50">✕</span>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cover Image */}
      <Card className="rounded-[2rem] border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <CardHeader>
          <CardTitle>Cover Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input type="file" accept="image/*" onChange={e => handleCoverChange(e.target.files ? e.target.files[0] : null)} className="rounded-xl h-11 pt-2" />
          {coverPreview && <img src={coverPreview} alt="Cover Preview" className="w-full max-w-2xl aspect-video object-cover rounded-2xl shadow-lg" />}
        </CardContent>
      </Card>

      {/* Submit */}
        <Button onClick={handleSubmit} className="w-full" disabled={loading}>
          {loading ? "Creating Project..." : "Publish Project"}
        </Button>
    </div>
  )
}

export default ProjectAdd
