/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import { ArrowLeft, Calendar, Pencil, Trash2, Star } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Separator } from "@/shared/components/ui/separator"

import ReactMarkdown from "react-markdown"
import rehypePrism from "rehype-prism-plus"

/* ===============================
   🔥 PRISM SETUP (CORRECT)
================================ */

// ✅ Prism core
import Prism from "prismjs"

  // ✅ Attach to window (REQUIRED)
  ; (window as any).Prism = Prism

// ✅ Theme
import "prismjs/themes/prism-tomorrow.css"

// ✅ Languages (AFTER window.Prism)
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-tsx"
import "prismjs/components/prism-css"
import "prismjs/components/prism-json"

/* =============================== */

import CodeBlock from "@/shared/components/CodeBlock"

import { getBlogBySlug, clearBlogState, deleteBlog } from "@/features/blog/blogSlice"
import type { RootState, AppDispatch } from "@/redux/store"
import { DeleteDialog } from "@/shared/components/DeleteDialog"
import toast from "react-hot-toast"

const ViewBlogDetails = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const { blog, loading, error } = useSelector(
    (state: RootState) => state.blogs
  )

  useEffect(() => {
    if (slug) dispatch(getBlogBySlug(slug))
    return () => {
      dispatch(clearBlogState())
    }
  }, [slug, dispatch])

  if (loading) {
    return <p className="text-center text-muted-foreground">Loading blog...</p>
  }

  if (error) {
    return <p className="text-center text-destructive">{error}</p>
  }

  if (!blog) return null


  // Delete blog
  const handleDelete = async (slug: string) => {
    try {
      await dispatch(deleteBlog(slug)).unwrap()
      toast.success("Blog deleted successfully")
      navigate("/blog/all")
    } catch (err: any) {
      toast.error(err || "Delete failed")
    }
  }

  return (
    <div className="space-y-6 mx-auto max-w-6xl py-6">
      {/* Top actions */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate(`/blog/${blog.slug}/edit`)}>
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          {/* Delete with AlertDialog */}
          <DeleteDialog
  onConfirm={() => handleDelete(blog.slug)}
  triggerButton={
    <Button variant="outline" size="sm" className="gap-2 text-destructive">
      <Trash2 className="h-4 w-4" />
      Delete
    </Button>
  }
  title="Delete Blog?"
  description="This will permanently delete this blog. This action cannot be undone."
/>

        </div>
      </div>

      {/* Cover */}
      {blog.coverImage && (
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-64 object-cover rounded-xl border"
        />
      )}

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{blog.category}</Badge>

            <Badge variant={blog.isPublished ? "default" : "secondary"}>
              {blog.isPublished ? "Published" : "Draft"}
            </Badge>

            {blog.isFeatured && (
              <Badge variant="outline" className="gap-1">
                <Star className="h-3 w-3" />
                Featured
              </Badge>
            )}
          </div>

          <CardTitle className="text-3xl font-bold">
            {blog.title}
          </CardTitle>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(blog.createdAt).toLocaleDateString()}
            </span>
            <span>{blog.views} views</span>
            <span className="italic">/{blog.slug}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {blog.tags?.map((tag: string) => (
              <Badge key={tag} variant="outline">
                #{tag}
              </Badge>
            ))}
          </div>
        </CardHeader>

        <Separator />

        {/* Markdown */}
        <CardContent className="py-6">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <ReactMarkdown
              rehypePlugins={[rehypePrism]}
              components={{ code: CodeBlock }}
            >
              {blog.content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ViewBlogDetails
