import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ModelSelectorProps {
  value: string
  models: { id: string; name: string }[]
  onChange: (modelId: string) => void
  disabled: boolean
}

export function ModelSelector({ value, models, onChange, disabled }: ModelSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        className="h-9 w-auto min-w-[100px] border-0 bg-transparent shadow-none text-sm font-medium focus:ring-0 focus:ring-offset-0"
        aria-label="Wybierz model"
      >
        <SelectValue placeholder="Model" />
      </SelectTrigger>
      <SelectContent>
        {models.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            {model.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
