import { Mic, Square } from "lucide-react"
import { cn } from "@/lib/utils"

interface MicrophoneButtonProps {
  isActive: boolean
  isRecording: boolean
  onClick: () => void
  onActivate: () => void
  disabled: boolean
}

export function MicrophoneButton({ isActive, isRecording, onClick, onActivate, disabled }: MicrophoneButtonProps) {
  const handleClick = () => {
    if (isActive) {
      onClick()
    } else {
      onActivate()
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      aria-label={isRecording ? "Zatrzymaj nagrywanie" : "Rozpocznij nagrywanie"}
      aria-pressed={isRecording}
      className={cn(
        "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isRecording
          ? "bg-destructive text-white hover:bg-destructive/90"
          : isActive
            ? "bg-foreground text-background hover:bg-foreground/90"
            : "text-muted-foreground hover:text-foreground hover:bg-muted",
        disabled && "opacity-50 pointer-events-none"
      )}
    >
      {isRecording && (
        <span className="absolute inset-0 animate-ping rounded-full bg-destructive/30" />
      )}
      {isRecording ? (
        <Square className="h-4 w-4 fill-current" />
      ) : (
        <Mic className="h-4.5 w-4.5" />
      )}
    </button>
  )
}
