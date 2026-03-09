import { useRef, useState, useCallback } from "react"
import type { TranscriptionResult } from "@/types"

interface UseAudioRecorderOptions {
  onPartial: (text: string) => void
  onFinal: (result: TranscriptionResult) => void
  onError: (error: string) => void
  language: string | null
  diarize?: boolean
  numSpeakers?: number | null
}

function downsample(buffer: Float32Array, inputRate: number, outputRate: number): Float32Array {
  if (inputRate === outputRate) return buffer
  const ratio = inputRate / outputRate
  const newLength = Math.round(buffer.length / ratio)
  const result = new Float32Array(newLength)
  for (let i = 0; i < newLength; i++) {
    const srcIndex = i * ratio
    const low = Math.floor(srcIndex)
    const high = Math.min(low + 1, buffer.length - 1)
    const frac = srcIndex - low
    result[i] = buffer[low] * (1 - frac) + buffer[high] * frac
  }
  return result
}

export function useAudioRecorder(options: UseAudioRecorderOptions) {
  const [isRecording, setIsRecording] = useState(false)
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const processorRef = useRef<ScriptProcessorNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const optionsRef = useRef(options)
  optionsRef.current = options

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      })
      streamRef.current = stream

      const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:"
      const wsHost = window.location.host
      const params = new URLSearchParams()
      if (optionsRef.current.language) params.set("language", optionsRef.current.language)
      if (optionsRef.current.diarize) params.set("diarize", "true")
      if (optionsRef.current.numSpeakers != null) params.set("num_speakers", String(optionsRef.current.numSpeakers))
      const ws = new WebSocket(`${wsProtocol}//${wsHost}/api/stream?${params}`)
      wsRef.current = ws

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.type === "partial") {
          optionsRef.current.onPartial(data.text)
        } else if (data.type === "final") {
          const result = data as TranscriptionResult
          optionsRef.current.onFinal(result)
        } else if (data.type === "error") {
          optionsRef.current.onError(data.detail || data.message || "Blad serwera")
        }
      }

      ws.onerror = () => {
        optionsRef.current.onError("Blad polaczenia WebSocket")
      }

      await new Promise<void>((resolve, reject) => {
        ws.onopen = () => resolve()
        ws.onerror = () => reject(new Error("Nie udalo sie polaczyc z serwerem"))
      })

      const audioContext = new AudioContext()
      audioContextRef.current = audioContext
      const sampleRate = audioContext.sampleRate

      const source = audioContext.createMediaStreamSource(stream)

      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      setAnalyserNode(analyser)

      const processor = audioContext.createScriptProcessor(4096, 1, 1)
      processorRef.current = processor

      processor.onaudioprocess = (event) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          const inputData = event.inputBuffer.getChannelData(0)
          const pcm16k = downsample(inputData, sampleRate, 16000)
          wsRef.current.send(pcm16k.buffer.slice(0) as ArrayBuffer)
        }
      }

      source.connect(processor)
      processor.connect(audioContext.destination)

      setIsRecording(true)
    } catch (err) {
      streamRef.current?.getTracks().forEach(t => t.stop())
      optionsRef.current.onError(
        err instanceof Error ? err.message : "Nie udalo sie uzyskac dostepu do mikrofonu"
      )
    }
  }, [])

  const stopRecording = useCallback(() => {
    // Stop capturing audio immediately
    processorRef.current?.disconnect()
    processorRef.current = null
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    audioContextRef.current?.close()
    audioContextRef.current = null
    setAnalyserNode(null)

    const ws = wsRef.current
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "stop" }))
      // Wait for the server to send the final result and close the connection
      // before marking recording as done (so model switching is safe)
      const onClose = () => {
        ws.removeEventListener("close", onClose)
        wsRef.current = null
        setIsRecording(false)
      }
      ws.addEventListener("close", onClose)
      // Safety timeout — don't hang forever
      setTimeout(() => {
        if (wsRef.current === ws) {
          ws.removeEventListener("close", onClose)
          try { ws.close() } catch { /* ignore */ }
          wsRef.current = null
          setIsRecording(false)
        }
      }, 5000)
    } else {
      wsRef.current = null
      setIsRecording(false)
    }
  }, [])

  return { isRecording, analyserNode, startRecording, stopRecording }
}
