import { FileUploadButton } from "./FileUploadButton"
import { ModelSelector } from "./ModelSelector"
import { LanguageSelector } from "./LanguageSelector"
import { DiarizationControls } from "./DiarizationControls"

interface InputBarProps {
  modelId: string
  models: { id: string; name: string }[]
  language: string
  isTranscribing: boolean
  isModelLoading: boolean
  diarize: boolean
  numSpeakers: number | null
  onFileSelect: (file: File) => void
  onModelChange: (modelId: string) => void
  onLanguageChange: (language: string) => void
  onDiarizeChange: (enabled: boolean) => void
  onNumSpeakersChange: (numSpeakers: number | null) => void
}

export function InputBar({
  modelId,
  models,
  language,
  isTranscribing,
  isModelLoading,
  diarize,
  numSpeakers,
  onFileSelect,
  onModelChange,
  onLanguageChange,
  onDiarizeChange,
  onNumSpeakersChange,
}: InputBarProps) {
  const isBusy = isTranscribing || isModelLoading

  return (
    <div className="flex w-full justify-center px-4 pb-4 pt-2">
      <div className="flex w-fit items-center gap-1 rounded-full border border-border bg-card px-2 py-1.5 shadow-sm transition-shadow hover:shadow-md">
        <FileUploadButton
          isActive={true}
          onFileSelect={onFileSelect}
          onActivate={() => {}}
          disabled={isBusy}
        />

        <div className="h-5 w-px bg-border" />

        <ModelSelector
          value={modelId}
          models={models}
          onChange={onModelChange}
          disabled={isBusy}
        />

        <LanguageSelector
          value={language}
          onChange={onLanguageChange}
          disabled={isBusy}
        />

        <div className="h-5 w-px bg-border" />

        <DiarizationControls
          enabled={diarize}
          numSpeakers={numSpeakers}
          onEnabledChange={onDiarizeChange}
          onNumSpeakersChange={onNumSpeakersChange}
          disabled={isBusy}
        />
      </div>
    </div>
  )
}
