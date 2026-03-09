import { useState, useMemo } from "react"
import { ChevronDown, ChevronUp, FileAudio, Mic, User } from "lucide-react"
import type { TranscriptionMessage as TMessage } from "@/types"
import { cn } from "@/lib/utils"

const SPEAKER_COLORS = [
  "text-blue-400",
  "text-emerald-400",
  "text-amber-400",
  "text-purple-400",
  "text-rose-400",
  "text-cyan-400",
  "text-orange-400",
  "text-indigo-400",
]

interface TranscriptionMessageProps {
  message: TMessage
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  const ms = Math.floor((seconds % 1) * 100)
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`
}

export function TranscriptionMessage({ message }: TranscriptionMessageProps) {
  const [showSegments, setShowSegments] = useState(false)
  const { result, source, fileName, modelName } = message

  const hasSpeakers = result.segments.some((s) => s.speaker)

  const speakerColorMap = useMemo(() => {
    if (!hasSpeakers) return new Map<string, string>()
    const unique = [...new Set(result.segments.map((s) => s.speaker).filter(Boolean))] as string[]
    return new Map(unique.map((s, i) => [s, SPEAKER_COLORS[i % SPEAKER_COLORS.length]]))
  }, [result.segments, hasSpeakers])

  const speakerLabel = (speaker: string) => {
    const num = speaker.replace(/\D/g, "")
    return `Osoba ${parseInt(num, 10) + 1}`
  }

  return (
    <div className="mx-auto w-full max-w-2xl animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            {source === "file" ? <FileAudio className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
            {source === "file" ? fileName : "Mikrofon"}
          </span>
          <span className="text-border">|</span>
          <span>{modelName}</span>
          <span className="text-border">|</span>
          <span>
            {result.info.language?.toUpperCase()}
            {result.info.language_probability > 0 && (
              <span className="ml-1 opacity-60">
                ({(result.info.language_probability * 100).toFixed(0)}%)
              </span>
            )}
          </span>
          <span className="text-border">|</span>
          <span>{formatDuration(result.info.duration)} audio</span>
          <span className="text-border">|</span>
          <span>{result.info.processing_time.toFixed(1)}s przetwarzania</span>
          {hasSpeakers && (
            <>
              <span className="text-border">|</span>
              <span className="inline-flex items-center gap-1">
                <User className="h-3 w-3" />
                {speakerColorMap.size} {speakerColorMap.size === 1 ? "osoba" : "osoby"}
              </span>
            </>
          )}
        </div>

        {hasSpeakers ? (
          <div className="space-y-2">
            {result.segments.map((seg) => (
              <div key={seg.id} className="text-sm leading-relaxed">
                {seg.speaker && (
                  <span className={cn("mr-2 text-xs font-medium", speakerColorMap.get(seg.speaker))}>
                    {speakerLabel(seg.speaker)}:
                  </span>
                )}
                <span className="text-card-foreground">{seg.text}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-card-foreground whitespace-pre-wrap">
            {result.text}
          </p>
        )}

        {result.segments.length > 1 && (
          <div className="mt-3 border-t border-border pt-3">
            <button
              onClick={() => setShowSegments(!showSegments)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {showSegments ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              {result.segments.length} segmentow
            </button>

            <div
              className={cn(
                "overflow-hidden transition-all duration-300",
                showSegments ? "mt-2 max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-2">
                {result.segments.map((seg) => (
                  <div key={seg.id} className="flex gap-3 text-xs">
                    <span className="shrink-0 font-mono text-muted-foreground w-24">
                      {formatTime(seg.start)} - {formatTime(seg.end)}
                    </span>
                    {seg.speaker && (
                      <span className={cn("shrink-0 w-16 font-medium", speakerColorMap.get(seg.speaker))}>
                        {speakerLabel(seg.speaker)}
                      </span>
                    )}
                    <span className="text-card-foreground">{seg.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
