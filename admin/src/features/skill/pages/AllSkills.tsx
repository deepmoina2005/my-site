/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/redux/store"
import {
  getSkills,
  deleteSkill,
  updateSkillLevel,
  clearSkillState,
} from "@/features/skill/skillSlice"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"

import { Eye, Pencil, Trash2, Link as LinkIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { DeleteDialog } from "@/shared/components/DeleteDialog"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const ITEMS_PER_PAGE = 6

type SkillLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced"
  | "Expert"
  | "Completed"

const AllSkills = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const { skills, loading, success, error } = useSelector(
    (state: RootState) => state.skills
  )

  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [page, setPage] = useState(1)

  // dialog state
  const [open, setOpen] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState<any>(null)

  /* ================= FETCH ================= */
  useEffect(() => {
    dispatch(getSkills())
  }, [dispatch])

  /* ================= TOAST ================= */
  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearSkillState())
    }
    if (success) {
      dispatch(getSkills())
      dispatch(clearSkillState())
    }
  }, [error, success, dispatch])

  /* ================= FILTER ================= */
  const filteredSkills = useMemo(() => {
    return skills.filter(skill => {
      const matchesSearch =
        skill.name.toLowerCase().includes(search.toLowerCase()) ||
        skill.description?.toLowerCase().includes(search.toLowerCase())

      const matchesCategory =
        categoryFilter === "all" ? true : skill.category === categoryFilter

      return matchesSearch && matchesCategory
    })
  }, [skills, search, categoryFilter])

  const totalPages = Math.ceil(filteredSkills.length / ITEMS_PER_PAGE)
  const paginatedSkills = filteredSkills.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  /* ================= UPDATE LEVEL ================= */
  const handleLevelChange = async (id: string, level: SkillLevel) => {
    try {
      await dispatch(updateSkillLevel({ id, level })).unwrap()
      toast.success("Skill level updated")
    } catch (err: any) {
      toast.error(err || "Update failed")
    }
  }

  /* ================= DELETE ================= */
  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteSkill(id)).unwrap()
      toast.success("Skill deleted")
    } catch (err: any) {
      toast.error(err || "Delete failed")
    }
  }

  return (
    <div className="space-y-6 mt-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-semibold">All Skills</CardTitle>
        <Button onClick={() => navigate("/skills/add")}>
          <Pencil className="mr-2 h-4 w-4" /> Add Skill
        </Button>
      </CardHeader>

      <Card>
        <CardContent className="space-y-6 pt-4">
          {/* Search + Filter */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Input
              placeholder="Search skills..."
              value={search}
              onChange={e => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="sm:max-w-sm"
            />

            <Select
              value={categoryFilter}
              onValueChange={value => {
                setCategoryFilter(value)
                setPage(1)
              }}
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Filter category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Frontend">Frontend</SelectItem>
                <SelectItem value="Backend">Backend</SelectItem>
                <SelectItem value="UI/UX">UI/UX</SelectItem>
                <SelectItem value="Tools">Tools</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* TABLE */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead>Icon</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedSkills.length ? (
                  paginatedSkills.map(skill => (
                    <TableRow key={skill._id}>
                      <TableCell>
                        <img
                          src={skill.icon}
                          className="w-8 h-8 rounded-md border"
                        />
                      </TableCell>

                      <TableCell className="font-medium">
                        {skill.name}
                      </TableCell>

                      <TableCell>
                        <Badge variant="secondary">{skill.category}</Badge>
                      </TableCell>

                      <TableCell>
                        <Select
                          value={skill.level}
                          onValueChange={value =>
                            handleLevelChange(
                              skill._id,
                              value as SkillLevel
                            )
                          }
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "Beginner",
                              "Intermediate",
                              "Advanced",
                              "Expert",
                              "Completed",
                            ].map(l => (
                              <SelectItem key={l} value={l}>
                                {l}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>

                      <TableCell className="flex gap-2">
                        {/* 👁 EYE → OPEN DIALOG */}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setSelectedSkill(skill)
                            setOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        <DeleteDialog
                          onConfirm={() => handleDelete(skill._id)}
                          triggerButton={
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          }
                          title="Delete Skill?"
                          description="This action cannot be undone."
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      {loading ? "Loading..." : "No skills found"}
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
                      onClick={() => setPage(p => Math.max(p - 1, 1))}
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
                        setPage(p => Math.min(p + 1, totalPages))
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ================= SKILL DETAILS DIALOG ================= */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          {selectedSkill && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedSkill.name}</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <img
                  src={selectedSkill.icon}
                  className="w-16 h-16 rounded-md border"
                />

                <p className="text-sm text-muted-foreground">
                  {selectedSkill.description}
                </p>

                <div className="flex gap-2">
                  <Badge>{selectedSkill.category}</Badge>
                  <Badge variant="outline">{selectedSkill.level}</Badge>
                </div>

                {selectedSkill.officialLink && (
                  <a
                    href={selectedSkill.officialLink}
                    target="_blank"
                    className="flex items-center gap-2 text-primary underline"
                  >
                    <LinkIcon size={16} />
                    Official Resource
                  </a>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AllSkills