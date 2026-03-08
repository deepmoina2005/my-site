"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination"
import { Eye, Pencil, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { DeleteDialog } from "@/shared/components/DeleteDialog"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

import { useSelector } from "react-redux"
import { useAppDispatch } from "@/redux/hooks"
import type { RootState } from "@/redux/store"
import { getProducts, deleteProduct, clearProductState } from "@/features/product/productSlice"

const ITEMS_PER_PAGE = 5

const AllProducts = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { products, error } = useSelector((state: RootState) => state.products)

  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  // Fetch products on mount
  useEffect(() => {
    dispatch(getProducts())
  }, [dispatch])

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearProductState())
    }
  }, [error, dispatch])

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch =
        product.title.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase())

    

      return matchesSearch
    })
  }, [products, search])

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  const handleDelete = (slug: string) => {
    dispatch(deleteProduct(slug))
      .unwrap()
      .then(() => toast.success(`Product deleted successfully 🚀`))
      .catch(err => toast.error(err))
  }

  return (
    <div className="space-y-6 mt-4">
      {/* Header */}
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-2xl font-semibold">All Products</CardTitle>
        <Button onClick={() => navigate("/products/add")}>
          <Pencil /> Add Product
        </Button>
      </CardHeader>

      <Card>
        <CardContent className="space-y-6 pt-4">
          {/* Search + Filter */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Input
              placeholder="Search by name or category..."
              value={search}
              onChange={e => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="sm:max-w-sm"
            />

          </div>

          {/* Table */}
          <div className="rounded-md border overflow-x-auto">
            <Table className="min-w-full border-collapse">
              <TableHeader className="bg-muted/20">
                <TableRow className="text-left">
                  <TableHead className="px-3 py-2">Thumbnail</TableHead>
                  <TableHead className="px-3 py-2">Name</TableHead>
                  <TableHead className="px-3 py-2">Category</TableHead>
                  <TableHead className="px-3 py-2">Date</TableHead>
                  <TableHead className="px-3 py-2">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedProducts.length ? (
                  paginatedProducts.map(product => (
                    <TableRow
                      key={product._id}
                      className="hover:bg-muted/50 transition-colors duration-150"
                    >
                      <TableCell className="px-3 py-2">
                        <img
                          src={product.thumbnail || "https://picsum.photos/80/50"}
                          alt={product.title}
                          className="w-20 h-12 object-cover rounded-md border"
                        />
                      </TableCell>
                      <TableCell className="px-3 py-2 font-medium">{product.title}</TableCell>
                      <TableCell className="px-3 py-2">{product.category}</TableCell>
  
                      <TableCell className="px-3 py-2 text-muted-foreground">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="px-3 py-2 text-muted-foreground">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => navigate(`/products/${product._id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <DeleteDialog
                            onConfirm={() => handleDelete(product._id)}
                            triggerButton={
                              <Button size="icon" variant="ghost" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            }
                            title="Delete Product?"
                            description="This will permanently delete this product. This action cannot be undone."
                          />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No products found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => setPage(p => Math.max(p - 1, 1))} />
                  </PaginationItem>

                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        isActive={page === i + 1}
                        onClick={() => setPage(i + 1)}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext onClick={() => setPage(p => Math.min(p + 1, totalPages))} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AllProducts
