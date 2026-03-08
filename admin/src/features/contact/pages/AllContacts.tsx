"use client"

import { useState, useMemo, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/redux/store"
import { fetchContacts, deleteContact, updateContactStatus } from "../contactSlice"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { Eye, Trash2, CheckCircle, XCircle } from "lucide-react"
import { toast } from "react-hot-toast"

const ITEMS_PER_PAGE = 10

const AllContacts = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { contacts, loading } = useSelector((state: RootState) => state.contacts as any)

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)

  useEffect(() => {
    dispatch(fetchContacts())
  }, [dispatch])

  const filteredContacts = useMemo(() => {
    if (!contacts) return []
    return contacts.filter((contact: any) => {
      const matchesSearch =
        (contact.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (contact.email?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (contact.subject?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (contact.service?.toLowerCase() || "").includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === "all" ? true : contact.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [contacts, search, statusFilter])

  const totalPages = Math.ceil(filteredContacts.length / ITEMS_PER_PAGE)
  const paginatedContacts = filteredContacts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await dispatch(deleteContact(id)).unwrap()
        toast.success("Contact deleted successfully")
      } catch (err: any) {
        toast.error(err || "Failed to delete")
      }
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "read" ? "unread" : "read"
    try {
      await dispatch(updateContactStatus({ id, status: newStatus })).unwrap()
      toast.success(`Marked as ${newStatus}`)
    } catch (err: any) {
      toast.error(err || "Failed to update status")
    }
  }

  const viewMessage = (message: string) => {
    alert(message)
  }

  return (
    <div className="space-y-6 mt-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-semibold">Inquiries & Contacts</CardTitle>
          {loading && <div className="text-sm text-muted-foreground animate-pulse">Updating...</div>}
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <Input
              placeholder="Search by name, email, service..."
              value={search}
              onChange={e => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="sm:max-w-sm"
            />

            <Select
              value={statusFilter}
              onValueChange={value => {
                setStatusFilter(value)
                setPage(1)
              }}
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border overflow-x-auto">
            <Table className="min-w-full border-collapse">
              <TableHeader className="bg-muted/20">
                <TableRow>
                  <TableHead className="px-3 py-2">Name</TableHead>
                  <TableHead className="px-3 py-2">Email</TableHead>
                  <TableHead className="px-3 py-2">Service</TableHead>
                  <TableHead className="px-3 py-2">Subject</TableHead>
                  <TableHead className="px-3 py-2">Received At</TableHead>
                  <TableHead className="px-3 py-2">Status</TableHead>
                  <TableHead className="px-3 py-2 text-right pr-10">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedContacts.length ? (
                  paginatedContacts.map((contact: any) => (
                    <TableRow key={contact._id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="px-3 py-2 font-medium">{contact.name}</TableCell>
                      <TableCell className="px-3 py-2">{contact.email}</TableCell>
                      <TableCell className="px-3 py-2">
                        {contact.service ? (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            {contact.service}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs italic">General</span>
                        )}
                      </TableCell>
                      <TableCell className="px-3 py-2 max-w-[200px] truncate">{contact.subject}</TableCell>
                      <TableCell className="px-3 py-2 text-muted-foreground whitespace-nowrap">
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="px-3 py-2">
                        <Badge variant={contact.status === "read" ? "default" : "destructive"} className="capitalize">
                          {contact.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-3 py-2 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => viewMessage(contact.message)}
                            title="View Message"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleToggleStatus(contact._id, contact.status)}
                            title={contact.status === "read" ? "Mark as Unread" : "Mark as Read"}
                          >
                            {contact.status === "read" ? (
                              <XCircle className="h-4 w-4 text-amber-500" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-emerald-500" />
                            )}
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() => handleDelete(contact._id)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      {loading ? "Loading..." : "No contacts found"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-1">
              <Button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} variant="outline" size="sm">
                Prev
              </Button>
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i}
                  variant={page === i + 1 ? "default" : "outline"}
                  onClick={() => setPage(i + 1)}
                  size="sm"
                >
                  {i + 1}
                </Button>
              ))}
              <Button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages} variant="outline" size="sm">
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AllContacts
