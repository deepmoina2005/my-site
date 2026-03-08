"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import toast from "react-hot-toast"
import { useAppDispatch } from "@/redux/hooks"
import { useSelector } from "react-redux"
import { createSkill, clearSkillState } from "@/features/skill/skillSlice"
import type { RootState } from "@/redux/store"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Button } from "@/shared/components/ui/button"
import { Label } from "@/shared/components/ui/label"
import { Badge } from "@/shared/components/ui/badge"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select"

import { fetchCategories } from "@/features/category/categorySlice"

const AddSkill = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { categories } = useSelector((state: RootState) => state.categories);

  const { loading, success, error } = useSelector(
    (state: RootState) => state.skills
  )

  /* ================= STATES ================= */
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [level, setLevel] = useState("")
  const [link, setLink] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [iconFile, setIconFile] = useState<File | null>(null)
  const [iconPreview, setIconPreview] = useState("")

  useEffect(() => {
    dispatch(fetchCategories("skill"))
  }, [dispatch])

  /* ================= OPTIONS ================= */

  const skillLevels = ["Beginner", "Intermediate", "Advanced", "Expert", "Completed"]

  /* ================= TAGS ================= */
  const addTag = () => {
    const tag = tagInput.trim()
    if (!tag) return
    if (!tags.includes(tag)) setTags(prev => [...prev, tag])
    setTagInput("")
  }

  const removeTag = (tag: string) =>
    setTags(prev => prev.filter(t => t !== tag))

  /* ================= ICON ================= */
  const handleIconChange = (file: File | null) => {
    setIconFile(file)
    if (!file) {
      setIconPreview("")
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => setIconPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  /* ================= SUBMIT ================= */
  const handleSubmit = () => {
    if (!name || !category || !level) {
      toast.error("Skill Name, Category & Level are required")
      return
    }

    const formData = new FormData()
    formData.append("name", name)
    formData.append("description", description)
    formData.append("category", category)
    formData.append("level", level)
    formData.append("link", link)
    formData.append("tags", JSON.stringify(tags))
    if (iconFile) formData.append("icon", iconFile)

    dispatch(createSkill(formData))
  }

  /* ================= EFFECTS ================= */
  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearSkillState())
    }
    if (success) {
      toast.success("Skill added successfully ✅")
      dispatch(clearSkillState())
      navigate("/skills/all")
    }
  }, [error, success, dispatch, navigate])

  /* ================= UI ================= */
  return (
    <div className="py-6 space-y-6 mx-auto">
      {/* Back */}
      <Button variant="ghost" className="gap-2" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      {/* Skill Info */}
      <Card>
        <CardHeader>
          <CardTitle>Skill Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Skill Name</Label>
            <Input
              placeholder="React"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              placeholder="Used for building frontend UI"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Category + Level */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <Card>
          <CardHeader>
            <CardTitle>Skill Level</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select skill level" />
              </SelectTrigger>
              <SelectContent>
                {skillLevels.map(lvl => (
                  <SelectItem key={lvl} value={lvl}>
                    {lvl}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Official Link */}
      <Card>
        <CardHeader>
          <CardTitle>Official Link</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="https://react.dev"
            value={link}
            onChange={e => setLink(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="react, javascript"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addTag()}
            />
            <Button type="button" onClick={addTag}>
              Add
            </Button>
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

      {/* Icon Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Skill Icon</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            type="file"
            accept="image/*"
            onChange={e => handleIconChange(e.target.files?.[0] || null)}
          />
          {iconPreview && (
            <img
              src={iconPreview}
              alt="Skill Icon"
              className="w-28 h-28 object-cover rounded-md border"
            />
          )}
        </CardContent>
      </Card>

      {/* Submit */}
      <Button className="w-full" onClick={handleSubmit} disabled={loading}>
        {loading ? "Saving..." : "Save Skill"}
      </Button>
    </div>
  )
}

export default AddSkill