/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

import type { AppDispatch, RootState } from "@/redux/store"
import {
  getExperiences,
  deleteExperience,
  clearExperienceState,
} from "@/features/experience/experienceSlice"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"

import { Eye, Pencil, Trash2, Plus } from "lucide-react"
import { DeleteDialog } from "@/shared/components/DeleteDialog"

const ITEMS_PER_PAGE = 10

const AllExperience = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const { experiences, loading, error, success } = useSelector(
    (state: RootState) => state.experiences
  )

  const [search, setSearch] = useState("")
  const [visibilityFilter, setVisibilityFilter] = useState("all")
  const [page, setPage] = useState(1)

  /* ================= FETCH ================= */
  useEffect(() => {
    dispatch(getExperiences())
  }, [dispatch])

  /* ================= TOAST HANDLING ================= */
  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearExperienceState())
    }

    if (success) {
      dispatch(getExperiences())
      dispatch(clearExperienceState())
    }
  }, [error, success, dispatch])

  /* ================= FILTER ================= */
  const filteredExperience = useMemo(() => {
    return experiences.filter(exp => {
      const matchesSearch =
        exp.title.toLowerCase().includes(search.toLowerCase()) ||
        exp.company.toLowerCase().includes(search.toLowerCase()) ||
        exp.category?.toLowerCase().includes(search.toLowerCase())

      const matchesVisibility =
        visibilityFilter === "all"
          ? true
          : exp.visibility === visibilityFilter

      return matchesSearch && matchesVisibility
    })
  }, [experiences, search, visibilityFilter])

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredExperience.length / ITEMS_PER_PAGE)

  const paginatedExperience = filteredExperience.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  /* ================= DELETE ================= */
  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteExperience(id)).unwrap()
      toast.success("Experience deleted successfully")
    } catch (err: any) {
      toast.error(err || "Delete failed")
    }
  }

  return (
    <div className="space-y-6 mt-4">
      {/* HEADER */}
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-semibold">
          All Experience
        </CardTitle>

        <Button onClick={() => navigate("/experience/add")}>
          <Plus className="h-4 w-4 mr-1" />
          Add Experience
        </Button>
      </CardHeader>

      <Card>
        <CardContent className="space-y-6 pt-4">
          {/* SEARCH + FILTER */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Input
              placeholder="Search by title, company or category..."
              value={search}
              onChange={e => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="sm:max-w-sm"
            />

            <Select
              value={visibilityFilter}
              onValueChange={value => {
                setVisibilityFilter(value)
                setPage(1)
              }}
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Filter visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* TABLE */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/20">
                <TableRow>
                  <TableHead>Logo</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead className="text-right pr-16">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedExperience.length ? (
                  paginatedExperience.map(exp => (
                    <TableRow
                      key={exp._id}
                      className="hover:bg-muted/50 transition"
                    >
                      {/* LOGO */}
                      <TableCell>
                        {exp.logo ? (
                          <img
                            src={exp.logo}
                            alt={exp.company}
                            className="w-20 h-12 object-cover rounded border"
                          />
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            No Logo
                          </span>
                        )}
                      </TableCell>

                      {/* TITLE */}
                      <TableCell className="font-medium">
                        {exp.title}
                      </TableCell>

                      {/* COMPANY */}
                      <TableCell>{exp.company}</TableCell>

                      {/* CATEGORY */}
                      <TableCell>{exp.category}</TableCell>

                      {/* DURATION */}
                      <TableCell className="text-muted-foreground">
                        {exp.isOngoing
                          ? `${new Date(
                            exp.startDate
                          ).toLocaleDateString()} - Present`
                          : `${new Date(
                            exp.startDate
                          ).toLocaleDateString()} - ${new Date(
                            exp.endDate!
                          ).toLocaleDateString()}`}
                      </TableCell>

                      {/* VISIBILITY */}
                      <TableCell>
                        <Badge
                          variant={
                            exp.visibility === "public"
                              ? "default"
                              : "secondary"
                          }
                          className="capitalize"
                        >
                          {exp.visibility}
                        </Badge>
                      </TableCell>

                      {/* ACTIONS */}
                      <TableCell className="text-right">
                        <div className="inline-flex gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              navigate(`/experience/${exp._id}`)
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              navigate(`/experience/${exp._id}/edit`)
                            }
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <DeleteDialog
                            title="Delete Experience?"
                            description="This experience will be permanently deleted."
                            onConfirm={() => handleDelete(exp._id)}
                            triggerButton={
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            }
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {loading ? "Loading..." : "No experience found"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setPage(p => Math.max(p - 1, 1))
                      }
                    />
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
                    <PaginationNext
                      onClick={() =>
                        setPage(p =>
                          Math.min(p + 1, totalPages)
                        )
                      }
                    />
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

export default AllExperience
