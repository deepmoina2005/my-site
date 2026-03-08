"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"

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

import { useAppDispatch } from "@/redux/hooks"
import type { RootState } from "@/redux/store"
import { createNote, clearNoteState } from "@/features/notes/noteSlice"

import { fetchCategories } from "@/features/category/categorySlice"

export default function AddNotes() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { categories } = useSelector((state: RootState) => state.categories);

  const { loading, success, error } = useSelector(
    (state: RootState) => state.notes
  )

  // ---------------- STATES ----------------
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [subject, setSubject] = useState("")
  const [course, setCourse] = useState("")
  const [semester, setSemester] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [pdfLink, setPdfLink] = useState("")

  // 🔥 Thumbnail states
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState("")

  const [description, setDescription] = useState("")
  const [isPublic, setIsPublic] = useState(true)

  useEffect(() => {
    dispatch(fetchCategories("note"))
  }, [dispatch])

  // ---------------- CONSTANTS ----------------
  const courses = ["BCA", "BEd"]

  const semesters = [
    "1st Semester",
    "2nd Semester",
    "3rd Semester",
    "4th Semester",
    "5th Semester",
    "6th Semester",
    "1st Year",
    "2nd Year",
  ]

  // ---------------- TAGS ----------------
  const addTag = () => {
    if (!tagInput.trim()) return
    if (!tags.includes(tagInput.trim())) {
      setTags(prev => [...prev, tagInput.trim()])
    }
    setTagInput("")
  }

  const removeTag = (tag: string) =>
    setTags(prev => prev.filter(t => t !== tag))

  // ---------------- THUMBNAIL HANDLER ----------------
  const handleThumbnailChange = (file: File | null) => {
    setThumbnail(file)

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setThumbnailPreview("")
    }
  }

  // ---------------- SUBMIT ----------------
  const handleSubmit = () => {
    if (!title || !category || !subject || !pdfLink) {
      toast.error("Title, Category, Subject & PDF Link are required")
      return
    }

    const formData = new FormData()
    formData.append("title", title)
    formData.append("category", category)
    formData.append("subject", subject)
    formData.append("course", course)
    formData.append("semester", semester)
    formData.append("tags", JSON.stringify(tags))
    formData.append("description", description)
    formData.append("visibility", isPublic ? "public" : "private")
    formData.append("file", pdfLink) // <-- Google Drive link

    if (thumbnail) {
      formData.append("thumbnail", thumbnail)
    }

    dispatch(createNote(formData))
  }

  // ---------------- EFFECTS ----------------
  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearNoteState())
    }

    if (success) {
      toast.success("Notes saved successfully 📚")
      dispatch(clearNoteState())
      navigate("/notes/all")
    }
  }, [error, success, dispatch, navigate])

  return (
    <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Back Button */}
      <div className="md:col-span-2">
        <Button variant="ghost" className="gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Title */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Note Title</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="HTML Basics / BEd Unit 1"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Category */}
      <Card>
        <CardHeader>
          <CardTitle>Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
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

      {/* Subject */}
      <Card>
        <CardHeader>
          <CardTitle>Subject</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Enter subject name"
            value={subject}
            onChange={e => setSubject(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Course */}
      <Card>
        <CardHeader>
          <CardTitle>Course (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={course} onValueChange={setCourse}>
            <SelectTrigger>
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map(c => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Semester */}
      <Card>
        <CardHeader>
          <CardTitle>Semester / Year</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={semester} onValueChange={setSemester}>
            <SelectTrigger>
              <SelectValue placeholder="Select semester/year" />
            </SelectTrigger>
            <SelectContent>
              {semesters.map(s => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* PDF Link */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Notes Google Drive Link</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Paste Google Drive shareable link here"
            value={pdfLink}
            onChange={e => setPdfLink(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Thumbnail */}
      <Card>
        <CardHeader>
          <CardTitle>Thumbnail Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            type="file"
            accept="image/*"
            onChange={e =>
              handleThumbnailChange(e.target.files?.[0] || null)
            }
          />

          {thumbnailPreview && (
            <img
              src={thumbnailPreview}
              alt="Thumbnail Preview"
              className="w-full h-40 object-cover rounded-md border"
            />
          )}
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="html, css, frontend"
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

      {/* Visibility */}
      <Card>
        <CardHeader>
          <CardTitle>Visibility</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          <Label>Public</Label>
          <Switch checked={isPublic} onCheckedChange={setIsPublic} />
          <span className="text-sm text-muted-foreground">
            {isPublic ? "Visible to everyone" : "Only admin can see"}
          </span>
        </CardContent>
      </Card>

      {/* Description */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Short description of notes"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Submit */}
      <Button
        className="w-full md:col-span-2"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Notes"}
      </Button>
    </div>
  )
}
