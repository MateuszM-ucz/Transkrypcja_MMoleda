import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DiarizationControlsProps {
  enabled: boolean
  numSpeakers: number | null
  onEnabledChange: (enabled: boolean) => void
  onNumSpeakersChange: (numSpeakers: number | null) => void
  disabled?: boolean
}

const SPEAKER_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "auto", label: "Auto" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
  { value: "7", label: "7" },
  { value: "8", label: "8" },
]

export function DiarizationControls({
  enabled,
  numSpeakers,
  onEnabledChange,
  onNumSpeakersChange,
  disabled = false,
}: DiarizationControlsProps) {
  const handleSpeakersChange = (value: string) => {
    onNumSpeakersChange(value === "auto" ? null : Number(value))
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-1.5 px-1">
        <Switch
          id="diarize-switch"
          checked={enabled}
          onCheckedChange={onEnabledChange}
          disabled={disabled}
          aria-label="Diaryzacja"
        />
        <label
          htmlFor="diarize-switch"
          className={
            "text-sm font-medium select-none cursor-pointer" +
            (disabled ? " opacity-50 cursor-not-allowed" : "")
          }
        >
          Diaryzacja
        </label>
      </div>

      {enabled && !disabled && (
        <Select
          value={numSpeakers == null ? "auto" : String(numSpeakers)}
          onValueChange={handleSpeakersChange}
        >
          <SelectTrigger
            className="h-9 w-auto min-w-[72px] border-0 bg-transparent shadow-none text-sm font-medium focus:ring-0 focus:ring-offset-0"
            aria-label="Liczba mowcow"
          >
            <SelectValue placeholder="Auto" />
          </SelectTrigger>
          <SelectContent>
            {SPEAKER_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  )
}
