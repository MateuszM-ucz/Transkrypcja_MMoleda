import { cn } from "@/lib/utils"

interface EmptyStateProps {
  visible: boolean
}

export function EmptyState({ visible }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-3 transition-all duration-300",
        visible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none absolute"
      )}
    >
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        {"W czym mog\u0119 pom\u00f3c?"}
      </h1>
      <p className="text-sm text-muted-foreground">
        {"Zacznij m\u00f3wi\u0107 lub dodaj plik audio, by rozpocz\u0105\u0107 transkrypcj\u0119."}
      </p>
    </div>
  )
}
