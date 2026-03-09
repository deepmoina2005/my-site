import { useEffect, useState, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/redux/store"
import { fetchServices, deleteService } from "../serviceSlice"
import { Button } from "@/shared/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Trash2, Pencil, Plus, Eye } from "lucide-react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { DeleteDialog } from "@/shared/components/DeleteDialog"

const ITEMS_PER_PAGE = 10

const AllServices = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { services, loading } = useSelector((state: RootState) => state.services) as { services: Array<{ _id: string; image?: string; title: string; category?: string; status?: string }>; loading: boolean }
  const [page, setPage] = useState(1)

  useEffect(() => {
    dispatch(fetchServices())
  }, [dispatch])

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteService(id)).unwrap()
      toast.success("Service deleted successfully")
    } catch (err: Error | unknown) {
      toast.error(err instanceof Error ? err.message : "Delete failed")
    }
  }

  const totalPages = Math.ceil((services?.length || 0) / ITEMS_PER_PAGE)
  const paginatedServices = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE
    return services?.slice(start, start + ITEMS_PER_PAGE) || []
  }, [services, page])

  return (
    <div className="space-y-6 mt-4">
      {/* Header */}
      <CardHeader className="flex justify-between items-center px-0">
        <CardTitle className="text-2xl font-bold">All Services</CardTitle>
        <Button onClick={() => navigate("/services/add")} className="gap-2">
          <Plus className="h-4 w-4" /> Add Service
        </Button>
      </CardHeader>

      {/* Table */}
      <Card>
        <CardContent className="overflow-x-auto">
          <Table className="min-w-full border-collapse">
            <TableHeader className="bg-muted/20">
              <TableRow>
                <TableHead>Banner</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">Loading...</TableCell>
                </TableRow>
              ) : paginatedServices.length > 0 ? (
                paginatedServices.map(service => (
                  <TableRow key={service._id} className="hover:bg-muted/50 transition-colors duration-150">
                    {/* Banner */}
                    <TableCell className="px-3 py-2">
                      {service.image ? (
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-24 h-12 object-cover rounded-md border"
                        />
                      ) : (
                        <span className="text-muted-foreground text-sm">No Image</span>
                      )}
                    </TableCell>

                    {/* Title */}
                    <TableCell className="px-3 py-2 font-medium">{service.title}</TableCell>

                    {/* Category */}
                    <TableCell className="px-3 py-2">{service.category || "N/A"}</TableCell>

                    {/* Status */}
                    <TableCell className="px-3 py-2">
                      <Badge
                        variant={service.status === "Active" ? "default" : "secondary"}
                        className="capitalize"
                      >
                        {service.status || "Draft"}
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="px-3 py-2 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => navigate(`/services/${service._id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => navigate(`/services/${service._id}/edit`)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <DeleteDialog
                          onConfirm={() => handleDelete(service._id)}
                          triggerButton={
                            <Button size="icon" variant="ghost" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          }
                          title="Delete Service?"
                          description="This will permanently delete this service. This action cannot be undone."
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    No services found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <div className="inline-flex gap-2">
            <Button
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(p - 1, 1))}
            >
              Previous
            </Button>
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                size="sm"
                variant={page === i + 1 ? "default" : "outline"}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AllServices