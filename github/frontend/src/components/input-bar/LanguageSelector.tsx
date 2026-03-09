import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LANGUAGES } from "@/types"

interface LanguageSelectorProps {
  value: string
  onChange: (value: string) => void
  disabled: boolean
}

export function LanguageSelector({ value, onChange, disabled }: LanguageSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        className="h-9 w-auto min-w-[100px] border-0 bg-transparent shadow-none text-sm font-medium focus:ring-0 focus:ring-offset-0"
        aria-label="Wybierz jezyk"
      >
        <SelectValue placeholder="Wykryj" />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((lang) => (
          <SelectItem key={lang.code ?? "auto"} value={lang.code ?? "auto"}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
