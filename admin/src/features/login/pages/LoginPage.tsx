import { LoginForm } from "@/shared/components/login-form"
import { ModeToggle } from "@/shared/components/mode-toggle"

export default function LoginPage() {
  return (
    <div className="bg-muted relative flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      
      {/* Bottom Right Mode Toggle */}
      <div className="fixed bottom-6 right-6 z-50">
        <ModeToggle />
      </div>

      <div className="flex w-full max-w-sm flex-col gap-6">
        <LoginForm />
      </div>
    </div>
  )
}
