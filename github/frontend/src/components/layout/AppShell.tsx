import { useState, useCallback } from "react"
import { Moon, Sun, Settings } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { EmptyState } from "@/components/shared/EmptyState"
import { MessageList } from "@/components/messages/MessageList"
import { InputBar } from "@/components/input-bar/InputBar"
import { useModels } from "@/hooks/useModels"
import { useTranscription } from "@/hooks/useTranscription"

export function AppShell() {
  const { theme, setTheme } = useTheme()
  const [language, setLanguage] = useState("auto")
  const [diarize, setDiarize] = useState(false)
  const [numSpeakers, setNumSpeakers] = useState<number | null>(null)

  const { isLoading: isModelLoading, loadModel, models, fileModels } = useModels()
  const { messages, isTranscribing, uploadFile } = useTranscription()

  const [fileModelId, setFileModelId] = useState("whisperx/large-v3-turbo")

  const handleFileSelect = useCallback((file: File) => {
    const name = models.find(m => m.id === fileModelId)?.name ?? fileModelId
    uploadFile(file, fileModelId, name, language === "auto" ? null : language, diarize, numSpeakers)
  }, [uploadFile, fileModelId, language, models, diarize, numSpeakers])

  const handleModelChange = useCallback((modelId: string) => {
    setFileModelId(modelId)
    loadModel(modelId)
  }, [loadModel])

  const hasMessages = messages.length > 0 || isTranscribing

  return (
    <div className="relative flex h-screen flex-col bg-background text-foreground">
      <div className="absolute top-0 right-0 z-10 flex items-center gap-1 rounded-bl-2xl bg-muted/60 px-3 py-2 backdrop-blur-sm">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Przelacz motyw"
            >
              <Sun className="h-3.5 w-3.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-3.5 w-3.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Motyw</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
              aria-label="Ustawienia"
            >
              <Settings className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Ustawienia</TooltipContent>
        </Tooltip>
      </div>

      <main className="relative flex flex-1 flex-col items-center overflow-auto">
        <EmptyState visible={!hasMessages} />
        {hasMessages && (
          <MessageList
            messages={messages}
            liveText=""
            isTranscribing={isTranscribing}
          />
        )}
      </main>

      <InputBar
        modelId={fileModelId}
        models={fileModels}
        language={language}
        isTranscribing={isTranscribing}
        isModelLoading={isModelLoading}
        diarize={diarize}
        numSpeakers={numSpeakers}
        onFileSelect={handleFileSelect}
        onModelChange={handleModelChange}
        onLanguageChange={setLanguage}
        onDiarizeChange={setDiarize}
        onNumSpeakersChange={setNumSpeakers}
      />
    </div>
  )
}
