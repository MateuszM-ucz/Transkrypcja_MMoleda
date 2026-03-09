import { Skeleton } from "@/components/ui/skeleton"

export function LoadingIndicator() {
  return (
    <div className="mx-auto w-full max-w-2xl animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-3 mb-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      </div>
    </div>
  )
}
