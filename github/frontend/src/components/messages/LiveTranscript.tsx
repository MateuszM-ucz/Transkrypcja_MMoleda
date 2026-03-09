import { cn } from "@/lib/utils"

interface LiveTranscriptProps {
  text: string
}

export function LiveTranscript({ text }: LiveTranscriptProps) {
  if (!text) return null

  return (
    <div className="mx-auto w-full max-w-2xl animate-in fade-in-0 duration-200">
      <div className="rounded-xl border border-primary/20 bg-card p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
          </span>
          <span className="text-xs text-muted-foreground">Nagrywanie...</span>
        </div>
        <p className={cn("text-sm leading-relaxed text-card-foreground whitespace-pre-wrap")}>
          {text}
          <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse" />
        </p>
      </div>
    </div>
  )
}
