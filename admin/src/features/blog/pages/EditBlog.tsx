/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useAppDispatch } from "@/redux/hooks"
import type { RootState } from "@/redux/store"
import {
    getBlogBySlug,
    clearBlogState,
    updateBlog,
} from "@/features/blog/blogSlice"
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
import { ArrowLeft } from "lucide-react"

// Markdown parser
const mdParser = new MarkdownIt()

const categories = ["Tech", "Lifestyle", "Education", "Travel", "Health"]

export default function EditBlog() {
    const { slug } = useParams<{ slug: string }>()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { blog, loading, error, success } = useSelector(
        (state: RootState) => state.blogs
    )

    // Form state
    const [title, setTitle] = useState("")
    const [slugState, setSlugState] = useState("")
    const [category, setCategory] = useState("")
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState("")
    const [coverImage, setCoverImage] = useState<File | null>(null)
    const [coverPreview, setCoverPreview] = useState<string>("")
    const [isPublished, setIsPublished] = useState(false)
    const [isFeatured, setIsFeatured] = useState(false)
    const [content, setContent] = useState("")

    // Load blog on mount
    useEffect(() => {
        if (slug) dispatch(getBlogBySlug(slug))
        return () => {
            dispatch(clearBlogState())
        }
    }, [slug, dispatch])

    // Populate form when blog loads
    useEffect(() => {
        if (blog) {
            setTitle(blog.title)
            setSlugState(blog.slug)
            setCategory(blog.category)
            setTags(blog.tags || [])
            setCoverPreview(blog.coverImage || "")
            setIsPublished(blog.isPublished)
            setIsFeatured(blog.isFeatured)
            setContent(blog.content)
        }
    }, [blog])

    // Auto-generate slug when title changes
    useEffect(() => {
        const generatedSlug = title
            .toLowerCase()
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, "")
        setSlugState(generatedSlug)
    }, [title])

    // Toast notifications
    useEffect(() => {
        if (error) toast.error(error)
    }, [error, success])

    // Tags handlers
    const addTag = () => {
        if (!tagInput.trim()) return
        if (!tags.includes(tagInput.trim())) setTags(prev => [...prev, tagInput.trim()])
        setTagInput("")
    }
    const removeTag = (tag: string) =>
        setTags(prev => prev.filter(t => t !== tag))

    // Cover image preview
    const handleCoverChange = (file: File | null) => {
        setCoverImage(file)
        if (file) {
            const reader = new FileReader()
            reader.onload = () => setCoverPreview(reader.result as string)
            reader.readAsDataURL(file)
        }
    }

    // Update blog
    const handleUpdate = async () => {
        if (!title || !category || tags.length === 0 || !content) {
            toast.error("Please fill all required fields: title, category, tags, content")
            return
        }

        const formData = new FormData()
        formData.append("title", title)
        formData.append("slug", slugState)
        formData.append("category", category)
        formData.append("tags", JSON.stringify(tags))
        formData.append("content", content)
        formData.append("isPublished", isPublished.toString())
        formData.append("isFeatured", isFeatured.toString())
        if (coverImage) formData.append("coverImage", coverImage)

        try {
            await dispatch(updateBlog({ slug: blog!.slug, data: formData })).unwrap()
            toast.success("Blog updated successfully")
            navigate("/blog/all")
        } catch (err: any) {
            toast.error(err || "Update failed")
        }
    }

    if (loading) return <p className="text-center text-muted-foreground">Loading blog...</p>
    if (!blog) return <p className="text-center text-destructive">Blog not found</p>

    return (
        <div className="py-6 space-y-6 max-w-6xl mx-auto">

            {/* Top actions */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" className="gap-2" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>
            </div>

            {/* Title & Slug */}
            <Card>
                <CardHeader>
                    <CardTitle>Edit Blog</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Blog title" />
                    </div>
                    <div className="space-y-2">
                        <Label>Slug</Label>
                        <Input value={slugState} onChange={e => setSlugState(e.target.value)} placeholder="blog-slug" />
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
                            value={tagInput}
                            onChange={e => setTagInput(e.target.value)}
                            placeholder="Add tag"
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
                            {categories.map(cat => (
                                <SelectItem key={cat} value={cat}>
                                    {cat}
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
                    <MdEditor
                        value={content}
                        style={{ height: "500px" }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={({ text }) => setContent(text)}
                    />
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex">
                <Button onClick={handleUpdate} className="flex-1" disabled={loading}>
                    {loading ? "Updating..." : "Update Blog"}
                </Button>
            </div>
        </div>
    )
}
