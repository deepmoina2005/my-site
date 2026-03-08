/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import { ArrowLeft, Calendar, Trash2, ExternalLink } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Separator } from "@/shared/components/ui/separator"

import { DeleteDialog } from "@/shared/components/DeleteDialog"
import toast from "react-hot-toast"

import {
  clearProductState,
  deleteProduct,
  getProductById,
} from "@/features/product/productSlice"
import type { RootState, AppDispatch } from "@/redux/store"

const ViewProductDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const { product, loading, error } = useSelector(
    (state: RootState) => state.products
  )

  useEffect(() => {
    if (id) dispatch(getProductById(id))
    return () => {
      dispatch(clearProductState())
    }
  }, [id, dispatch])

  if (loading) {
    return (
      <p className="text-center text-muted-foreground py-10">
        Loading product...
      </p>
    )
  }

  if (error) {
    return (
      <p className="text-center text-destructive py-10">
        {error}
      </p>
    )
  }

  if (!product) return null

  const handleDelete = async () => {
    try {
      await dispatch(deleteProduct(product._id)).unwrap()
      toast.success("Product deleted successfully")
      navigate("/products/all")
    } catch (err: any) {
      toast.error(err || "Delete failed")
    }
  }

  const handleVisitSubject = () => {
    if (!product.subject) return
    const url = product.subject.startsWith("http")
      ? product.subject
      : `https://${product.subject}`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className=" mx-auto px-4 py-8 space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <DeleteDialog
          onConfirm={handleDelete}
          triggerButton={
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-destructive border-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          }
          title="Delete Product?"
          description="This will permanently delete this product."
        />
      </div>

      {/* Thumbnail */}
      {product.thumbnail && (
        <Card className="overflow-hidden">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </Card>
      )}

      {/* Main Card */}
      <Card>
        <CardHeader className="space-y-5">
          {/* Category */}
          <div>
            <Badge variant="secondary">{product.category}</Badge>
          </div>

          {/* Title */}
          <CardTitle className="text-3xl leading-tight">
            {product.title}
          </CardTitle>

          {/* Visit Product Button */}
          {product.subject && (
            <Button
              variant="destructive"
              onClick={handleVisitSubject}
              className="
                w-fit
                bg-blue-600 
                hover:bg-blue-700 
                text-white 
                flex items-center gap-2
              "
            >
              Visit Product
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}

          {/* Meta */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {new Date(product.createdAt).toLocaleDateString()}
          </div>
        </CardHeader>

        <Separator />

        {/* Description */}
        {product.description && (
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </CardContent>
        )}
      </Card>
    </div>
  )
}

export default ViewProductDetails
