import React, { useState, useRef } from "react"
import { Copy, Check } from "lucide-react"
import toast from "react-hot-toast"

const CodeBlock = ({
  inline,
  className,
  children,
}: {
  inline?: boolean
  className?: string
  children?: React.ReactNode
}) => {
  const [copied, setCopied] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)

  // Inline code
  if (inline) {
    return (
      <code className="rounded bg-muted px-1 py-0.5 text-sm">{children}</code>
    )
  }

  const handleCopy = async () => {
    try {
      if (preRef.current) {
        const text = preRef.current.innerText
        await navigator.clipboard.writeText(text)
        setCopied(true)
        toast.success("Code copied")
        setTimeout(() => setCopied(false), 1500)
      }
    } catch {
      toast.error("Copy failed")
    }
  }

  return (
    <div className="relative group">
      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 z-10 rounded-md bg-background/80 px-2 py-1 text-xs
        opacity-0 group-hover:opacity-100 transition flex items-center gap-1 shadow"
      >
        {copied ? (
          <>
            <Check className="h-3 w-3" /> Copied
          </>
        ) : (
          <>
            <Copy className="h-3 w-3" /> Copy
          </>
        )}
      </button>

      <pre
        ref={preRef}
        className="overflow-x-auto rounded-md bg-muted p-4 text-sm"
      >
        <code className={className}>{children}</code>
      </pre>
    </div>
  )
}

export default CodeBlock