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
import { createProduct, clearProductState } from "@/features/product/productSlice"

import { fetchCategories } from "@/features/category/categorySlice"

export default function AddProducts() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { categories } = useSelector((state: RootState) => state.categories);

  const { loading, success, error } = useSelector(
    (state: RootState) => state.products
  )

  // ---------------- STATES ----------------
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [subject, setSubject] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("")
  const [description, setDescription] = useState("")
  const [isPublic, setIsPublic] = useState(true)

  useEffect(() => {
    dispatch(fetchCategories("product"))
  }, [dispatch])

  // ---------------- TAGS ----------------
  const addTag = () => {
    const tag = tagInput.trim()
    if (!tag) return
    if (!tags.includes(tag)) setTags(prev => [...prev, tag])
    setTagInput("")
  }

  const removeTag = (tag: string) => setTags(prev => prev.filter(t => t !== tag))

  // ---------------- THUMBNAIL ----------------
  const handleThumbnailChange = (file: File | null) => {
    setThumbnail(file)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setThumbnailPreview(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      setThumbnailPreview("")
    }
  }

  // ---------------- SUBMIT ----------------
  const handleSubmit = () => {
    if (!title || !category) {
      toast.error("Title & Category are required")
      return
    }

    const formData = new FormData()
    formData.append("title", title)
    formData.append("category", category)
    if (subject) formData.append("subject", subject)
    formData.append("tags", JSON.stringify(tags))
    if (description) formData.append("description", description)
    formData.append("visibility", isPublic ? "public" : "private")
    if (thumbnail) formData.append("thumbnail", thumbnail)

    dispatch(createProduct(formData))
  }

  // ---------------- EFFECTS ----------------
  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearProductState())
    }
    if (success) {
      toast.success("Product uploaded successfully 🚀")
      dispatch(clearProductState())
      navigate("/products/all")
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
          <CardTitle>Product Title</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Awesome UI Template / React Website"
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
          <CardTitle>Subject / Skill</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="React, UI/UX, Photoshop..."
            value={subject}
            onChange={e => setSubject(e.target.value)}
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
            onChange={e => handleThumbnailChange(e.target.files?.[0] || null)}
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
              placeholder="react, website, ui"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addTag()}
            />
            <Button onClick={addTag}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
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
            placeholder="Short description of your digital product"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Visibility */}
      <Card className="md:col-span-2">
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

      {/* Submit */}
      <Button
        className="w-full md:col-span-2"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Save Product"}
      </Button>
    </div>
  )
}
