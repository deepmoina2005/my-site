/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import toast from "react-hot-toast"
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
import { createBook } from "@/features/book/bookSlice"
import type { AppDispatch } from "@/redux/store"

import { fetchCategories } from "@/features/category/categorySlice"

export const AddBooks = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { categories } = useSelector((state: RootState) => state.categories);

  // ---------------- STATES ----------------
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState("")
  const [bookLink, setBookLink] = useState("") // Google Drive link
  const [description, setDescription] = useState("")
  const [isPublic, setIsPublic] = useState(true)

  useEffect(() => {
    dispatch(fetchCategories("book"))
  }, [dispatch])

  // ---------------- TAGS ----------------
  const addTag = () => {
    if (!tagInput.trim()) return
    if (!tags.includes(tagInput.trim())) setTags(prev => [...prev, tagInput.trim()])
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

  // ---------------- SLUG ----------------
  const generateSlug = (title: string) => {
    const s = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "")
    setSlug(s)
  }

  // ---------------- SUBMIT ----------------
  const handleSubmit = async () => {
    if (!title || !category || !bookLink) {
      toast.error("Title, Category, and Book link are required")
      return
    }

    const formData = new FormData()
    formData.append("title", title)
    formData.append("slug", slug)
    formData.append("category", category)
    formData.append("tags", JSON.stringify(tags))
    formData.append("description", description)
    formData.append("visibility", isPublic ? "public" : "private")
    formData.append("file", bookLink) // <-- Google Drive link
    if (thumbnail) formData.append("thumbnail", thumbnail)

    try {
      await dispatch(createBook(formData)).unwrap()
      toast.success("Book uploaded successfully 📚")
      navigate("/books/all")
    } catch (err: any) {
      toast.error(err || "Failed to upload book")
    }
  }

  return (
    <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Back Button */}
      <div className="md:col-span-2">
        <Button variant="ghost" className="gap-2" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      {/* Title */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Book Title</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Learn React / Physics 101"
            value={title}
            onChange={e => {
              setTitle(e.target.value)
              generateSlug(e.target.value)
            }}
          />
          <Input
            placeholder="Slug auto-generated"
            value={slug}
            onChange={e => setSlug(e.target.value)}
            className="mt-2"
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

      {/* Google Drive Link */}
      <Card>
        <CardHeader>
          <CardTitle>Book File (Google Drive Link)</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Enter Google Drive link here"
            value={bookLink}
            onChange={e => setBookLink(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Thumbnail */}
      <Card>
        <CardHeader>
          <CardTitle>Thumbnail Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input
            type="file"
            accept="image/*"
            onChange={e => handleThumbnailChange(e.target.files?.[0] || null)}
          />
          {thumbnailPreview && (
            <img
              src={thumbnailPreview}
              alt="Thumbnail Preview"
              className="w-full h-40 object-cover rounded-md border mt-2"
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
              placeholder="react, physics, chapter1"
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
            placeholder="Short description about the book"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
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
            {isPublic ? "Visible to everyone" : "Private / Only admin"}
          </span>
        </CardContent>
      </Card>

      {/* Submit */}
      <Button className="w-full md:col-span-2" onClick={handleSubmit}>
        Upload Book
      </Button>
    </div>
  )
}

export default AddBooks
