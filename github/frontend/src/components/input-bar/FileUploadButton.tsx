import { useRef } from "react"
import { Paperclip } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadButtonProps {
  isActive: boolean
  onFileSelect: (file: File) => void
  onActivate: () => void
  disabled: boolean
}

const ACCEPTED_FORMATS = ".wav,.mp3,.ogg,.flac,.m4a,.webm,.mp4,.wma,.aac"

export function FileUploadButton({ isActive, onFileSelect, onActivate, disabled }: FileUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    if (isActive) {
      inputRef.current?.click()
    } else {
      onActivate()
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_FORMATS}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            onFileSelect(file)
            e.target.value = ""
          }
        }}
      />
      <button
        onClick={handleClick}
        disabled={disabled}
        aria-label="Dodaj plik audio"
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isActive
            ? "bg-foreground text-background hover:bg-foreground/90"
            : "text-muted-foreground hover:text-foreground hover:bg-muted",
          disabled && "opacity-50 pointer-events-none"
        )}
      >
        <Paperclip className="h-4.5 w-4.5" />
      </button>
    </>
  )
}
