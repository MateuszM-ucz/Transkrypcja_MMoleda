import { useState, useCallback } from "react"
import type { TranscriptionMessage, TranscriptionResult, WhisperAsrResponse } from "@/types"
import { normalizeWhisperResponse } from "@/types"
import { toast } from "sonner"

let messageCounter = 0

export function useTranscription() {
  const [messages, setMessages] = useState<TranscriptionMessage[]>([])
  const [isTranscribing, setIsTranscribing] = useState(false)

  const addMessage = useCallback((
    source: "file" | "microphone",
    result: TranscriptionResult,
    modelId: string,
    modelName: string,
    fileName?: string,
  ) => {
    const msg: TranscriptionMessage = {
      id: `msg-${++messageCounter}`,
      source,
      fileName,
      modelId,
      modelName,
      result,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, msg])
    return msg
  }, [])

  const uploadFile = useCallback(async (
    file: File,
    modelId: string,
    modelName: string,
    language: string | null,
    diarize?: boolean,
    _numSpeakers?: number | null,
  ) => {
    setIsTranscribing(true)
    const startTime = performance.now()
    try {
      const formData = new FormData()
      formData.append("audio_file", file)

      const params = new URLSearchParams()
      params.set("output", "json")
      params.set("word_timestamps", "true")
      params.set("vad_filter", "true")
      if (language) params.set("language", language)
      if (diarize) params.set("diarize", "true")

      const res = await fetch(`/asr?${params.toString()}`, {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Blad transkrypcji" }))
        throw new Error(err.detail || `HTTP ${res.status}`)
      }

      const raw: WhisperAsrResponse = await res.json()
      const processingTime = (performance.now() - startTime) / 1000
      const result = normalizeWhisperResponse(raw, processingTime)
      addMessage("file", result, modelId, modelName, file.name)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Blad transkrypcji pliku")
    } finally {
      setIsTranscribing(false)
    }
  }, [addMessage])

  return { messages, isTranscribing, addMessage, uploadFile }
}
