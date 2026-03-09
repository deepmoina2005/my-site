import { useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { format } from "date-fns"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Button } from "@/shared/components/ui/button"
import { Label } from "@/shared/components/ui/label"
import { Badge } from "@/shared/components/ui/badge"
import { Switch } from "@/shared/components/ui/switch"
import { Textarea } from "@/shared/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover"
import { Calendar } from "@/shared/components/ui/calendar"
import { ArrowLeft, CalendarIcon } from "lucide-react"

import { useDispatch, useSelector } from "react-redux"
import { createExperience } from "@/features/experience/experienceSlice"
import type { AppDispatch, RootState } from "@/redux/store"

export const AddExperience = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { loading } = useSelector((state: RootState) => state.experiences)

  /* ================= STATES ================= */
  const [title, setTitle] = useState("")
  const [company, setCompany] = useState("")
  const [location, setLocation] = useState("")
  const [workMode, setWorkMode] = useState<"Onsite" | "Remote" | "Hybrid">("Onsite")


  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [isOngoing, setIsOngoing] = useState(false)

  const [category, setCategory] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  const [logo, setLogo] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState("")

  const [description, setDescription] = useState("")
  const [isPublic, setIsPublic] = useState(true)

  const categories = [
    "Full-time",
    "Part-time",
    "Internship",
    "Freelance",
    "Volunteer",
  ]

  /* ================= TAGS ================= */
  const addTag = () => {
    if (!tagInput.trim()) return
    if (!tags.includes(tagInput.trim())) {
      setTags(prev => [...prev, tagInput.trim()])
    }
    setTagInput("")
  }

  const removeTag = (tag: string) =>
    setTags(prev => prev.filter(t => t !== tag))

  /* ================= LOGO ================= */
  const handleLogoChange = (file: File | null) => {
    setLogo(file)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setLogoPreview(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      setLogoPreview("")
    }
  }

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!title || !company || !startDate) {
      toast.error("Title, Company & Start Date are required")
      return
    }

    const formData = new FormData()
    formData.append("title", title)
    formData.append("company", company)
    formData.append("workMode", workMode)
    formData.append("location", workMode === "Remote" ? "Remote" : location)
    formData.append("startDate", startDate.toISOString())
    formData.append(
      "endDate",
      isOngoing || !endDate ? "" : endDate.toISOString()
    )
    formData.append("isOngoing", JSON.stringify(isOngoing))
    formData.append("category", category)
    formData.append("tags", JSON.stringify(tags))
    formData.append("description", description)
    formData.append("visibility", isPublic ? "public" : "private")
    if (logo) formData.append("logo", logo)

    try {
      await dispatch(createExperience(formData)).unwrap()
      toast.success("Experience added successfully 💼")
      navigate("/experience/all")
    } catch (err: any) {
      toast.error(err || "Failed to add experience")
    }
  }

  return (
    <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Back */}
      <div className="md:col-span-2">
        {/* Back */}
        <Button variant="ghost" className="gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Title */}
      <Card>
        <CardHeader>
          <CardTitle>Position / Title</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Frontend Developer"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Company */}
      <Card>
        <CardHeader>
          <CardTitle>Company / Organization</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Google / Startup XYZ"
            value={company}
            onChange={e => setCompany(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle>Work Location</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Work Mode */}
          <div className="space-y-1">
            <Label>Work Mode</Label>
            <Select value={workMode} onValueChange={(value: any) => setWorkMode(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select work mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Onsite">Onsite</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* City / Country */}
          <div className="space-y-1">
            <Label>Location</Label>
            <Input
              placeholder={
                workMode === "Remote"
                  ? "Remote"
                  : "City, Country"
              }
              value={workMode === "Remote" ? "Remote" : location}
              disabled={workMode === "Remote"}
              onChange={e => setLocation(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>


      {/* Dates with Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Duration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Start Date */}
          <div className="space-y-1">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* End Date */}
          <div className="space-y-1">
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  disabled={isOngoing}
                  className="w-full justify-start"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Ongoing */}
          <div className="flex items-center gap-2">
            <Label>Ongoing</Label>
            <Switch checked={isOngoing} onCheckedChange={setIsOngoing} />
          </div>
        </CardContent>
      </Card>

      {/* Category */}
      <Card>
        <CardHeader>
          <CardTitle>Category / Type</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(c => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Skills / Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="React, Node.js"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addTag()}
            />
            <Button onClick={addTag}>Add</Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <Badge
                key={tag}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => removeTag(tag)}
              >
                {tag} ✕
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Describe your role & achievements"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Logo */}
      <Card>
        <CardHeader>
          <CardTitle>Company Logo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input
            type="file"
            accept="image/*"
            onChange={e => handleLogoChange(e.target.files?.[0] || null)}
          />
          {logoPreview && (
            <img
              src={logoPreview}
              alt="Logo Preview"
              className="w-32 h-32 rounded-md border"
            />
          )}
        </CardContent>
      </Card>

      {/* Visibility */}
      <Card>
        <CardHeader>
          <CardTitle>Visibility</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          <Label>Public</Label>
          <Switch checked={isPublic} onCheckedChange={setIsPublic} />
        </CardContent>
      </Card>

      {/* Submit */}
      <Button className="md:col-span-2" onClick={handleSubmit} disabled={loading}>
        {loading ? "Adding..." : "Add Experience"}
      </Button>
    </div>
  )
}

export default AddExperience