import { useState, useCallback } from "react"
import type { ModelInfo } from "@/types"
import { toast } from "sonner"

const STATIC_MODELS: ModelInfo[] = [
  {
    id: "whisperx/large-v3-turbo",
    name: "WhisperX Large v3 Turbo",
    plugin_name: "whisperx",
    variant: "large-v3-turbo",
    vram_estimate_mb: 3200,
    is_loaded: true,
    supports_streaming: false,
    supports_diarization: true,
  },
]

export function useModels() {
  const [isLoading] = useState(false)
  const [models] = useState<ModelInfo[]>(STATIC_MODELS)
  const [currentModelId, setCurrentModelId] = useState("whisperx/large-v3-turbo")

  const loadModel = useCallback(async (_modelId: string) => {
    toast.info("Model zmienia sie przez restart kontenera (docker-compose.whisper.yml)")
  }, [])

  const fetchModels = useCallback(async () => {}, [])

  const fileModels = models

  return { isLoading, currentModelId, setCurrentModelId, loadModel, fetchModels, models, voiceModels: [], fileModels }
}
