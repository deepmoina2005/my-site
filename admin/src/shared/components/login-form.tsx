"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field"
import { Input } from "@/shared/components/ui/input"

import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/redux/store"
import { adminLogin, clearState } from "@/features/login/adminSlice"

import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const { loading, error, token } = useSelector(
    (state: RootState) => state.admin
  )

  const [adminId, setAdminId] = React.useState("")
  const [password, setPassword] = React.useState("")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(adminLogin({ adminId, password }))
  }

  // Show error toast if login fails
  React.useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  // Redirect if login succeeds
  React.useEffect(() => {
    if (token) {
      toast.success("Login successful")
      navigate("/", { replace: true })
    }
  }, [token, navigate])

  // Clear admin slice state on unmount
  React.useEffect(() => {
    return () => {
      dispatch(clearState())
    }
  }, [dispatch])

  return (
    <div className={cn("flex flex-col gap-6 items-center justify-center min-h-screen", className)} {...props}>
      <Card className="w-full max-w-md mx-3">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Admin Dashboard
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup className="space-y-4">
              <Field>
                <FieldLabel htmlFor="adminId">Admin Id</FieldLabel>
                <Input
                  id="adminId"
                  type="text"
                  placeholder="Enter Admin Id"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
