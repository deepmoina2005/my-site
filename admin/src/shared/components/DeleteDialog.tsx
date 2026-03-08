"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog"
import { Button } from "@/shared/components/ui/button"
import { Trash2 } from "lucide-react"

interface DeleteDialogProps {
  title?: string
  description?: string
  onConfirm: () => void
  triggerButton?: React.ReactNode
}

export function DeleteDialog({
  title = "Are you sure?",
  description = "This action cannot be undone.",
  onConfirm,
  triggerButton,
}: DeleteDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {triggerButton ?? <Button variant="destructive">Delete</Button>}
      </AlertDialogTrigger>

      <AlertDialogContent size="sm">
        <AlertDialogHeader className="text-center">
          <AlertDialogMedia className="mx-auto mb-2 bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive rounded-full p-3">
            <Trash2 className="h-6 w-6" />
          </AlertDialogMedia>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex justify-end gap-2 mt-4">
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
