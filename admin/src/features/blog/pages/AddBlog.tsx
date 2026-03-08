/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useAppDispatch } from "@/redux/hooks"
import type { RootState } from "@/redux/store"
import { createBlog, clearBlogState } from "@/features/blog/blogSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Button } from "@/shared/components/ui/button"
import { Label } from "@/shared/components/ui/label"
import { Badge } from "@/shared/components/ui/badge"
import toast from "react-hot-toast"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"

import { Switch } from "@/shared/components/ui/switch"
import MarkdownIt from "markdown-it"
import MdEditor from "react-markdown-editor-lite"
import "react-markdown-editor-lite/lib/index.css"

import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

// Markdown parser
const mdParser = new MarkdownIt()

import { fetchCategories } from "@/features/category/categorySlice"

export default function AddBlog() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, success, error } = useSelector((state: RootState) => state.blogs)
  const { categories } = useSelector((state: RootState) => state.categories)

  // Form state
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string>("")
  const [isPublished, setIsPublished] = useState(false)
  const [isFeatured, setIsFeatured] = useState(false)
  const [content, setContent] = useState("")

  useEffect(() => {
    dispatch(fetchCategories("blog"))
  }, [dispatch])

  // Auto-generate slug
  useEffect(() => {
    const generatedSlug = title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "")
    setSlug(generatedSlug)
  }, [title])

  // Toast notifications
  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearBlogState())
    }
    if (success) {
      toast.success("Blog saved successfully ✨")
      navigate("/blog/all")
      dispatch(clearBlogState())
      // Clear form after success
      setTitle("")
      setSlug("")
      setCategory("")
      setTags([])
      setCoverImage(null)
      setCoverPreview("")
      setIsPublished(false)
      setIsFeatured(false)
      setContent("")
    }
  }, [error, success, dispatch])

  // Tags
  const addTag = () => {
    if (!tagInput.trim()) return
    if (!tags.includes(tagInput.trim())) setTags(prev => [...prev, tagInput.trim()])
    setTagInput("")
  }
  const removeTag = (tag: string) => setTags(prev => prev.filter(t => t !== tag))

  // Cover image preview
  const handleCoverChange = (file: File | null) => {
    setCoverImage(file)
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setCoverPreview(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      setCoverPreview("")
    }
  }

  // Submit blog
  const handleSubmit = () => {
    if (!title || !category || tags.length === 0 || !content) {
      toast.error("Please fill all required fields: title, category, tags, content")
      return
    }

    const formData = new FormData()
    formData.append("title", title)
    formData.append("slug", slug)
    formData.append("category", category)
    formData.append("tags", JSON.stringify(tags))
    formData.append("content", content)
    formData.append("isPublished", isPublished.toString())
    formData.append("isFeatured", isFeatured.toString())
    if (coverImage) formData.append("coverImage", coverImage)

    dispatch(createBlog(formData))
  }

  return (
    <div className="py-6 space-y-6">
      {/* Top actions */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Title & Slug */}
      <Card>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input placeholder="Blog title" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Slug (auto-generated)</Label>
            <Input placeholder="blog-url-slug" value={slug} onChange={e => setSlug(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Cover Image */}
      <Card>
        <CardHeader>
          <CardTitle>Cover Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input type="file" accept="image/*" onChange={e => handleCoverChange(e.target.files?.[0] || null)} />
          {coverPreview && (
            <img src={coverPreview} alt="Cover Preview" className="mt-2 w-full max-h-60 object-cover rounded-md" />
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
              placeholder="Add tag"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addTag()}
            />
            <Button onClick={addTag}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map(tag => (
              <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                {tag} ✕
              </Badge>
            ))}
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

      {/* Publish & Featured */}
      <Card>
        <CardHeader>
          <CardTitle>Publish Options</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-6">
          <div className="flex items-center gap-2">
            <Label>Publish</Label>
            <Switch checked={isPublished} onCheckedChange={setIsPublished} />
          </div>
          <div className="flex items-center gap-2">
            <Label>Featured</Label>
            <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
          </div>
        </CardContent>
      </Card>

      {/* Markdown Editor */}
      <Card className="h-150 scrollbar-custom">
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent className="h-full scrollbar-custom">
          <MdEditor value={content} style={{ height: "500px" }} renderHTML={text => mdParser.render(text)} onChange={({ text }) => setContent(text)} />
        </CardContent>
      </Card>

      {/* Submit */}
      <Button onClick={handleSubmit} className="w-full" disabled={loading}>
        {loading ? "Saving..." : "Save Blog"}
      </Button>
    </div>
  )
}
