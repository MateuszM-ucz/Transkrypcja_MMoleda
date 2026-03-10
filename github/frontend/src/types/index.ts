export interface WordInfo {
  start: number
  end: number
  word: string
  probability: number
}

export interface Segment {
  id: number
  start: number
  end: number
  text: string
  words?: WordInfo[] | null
  avg_logprob: number
  no_speech_prob: number
  speaker?: string | null
}

export interface TranscriptionInfo {
  language: string
  language_probability: number
  duration: number
  processing_time: number
}

export interface TranscriptionResult {
  text: string
  segments: Segment[]
  info: TranscriptionInfo
}

// Raw response from whisper-asr-webservice POST /asr?output=json
export interface WhisperAsrSegment {
  id: number
  seek: number
  start: number
  end: number
  text: string
  tokens: number[]
  avg_logprob: number
  compression_ratio: number
  no_speech_prob: number
  words: null
  temperature: number
  speaker?: string
}

export interface WhisperAsrResponse {
  text: string
  segments: WhisperAsrSegment[]
  language: string
}

export function normalizeWhisperResponse(raw: WhisperAsrResponse, processingTime: number): TranscriptionResult {
  const lastSegment = raw.segments[raw.segments.length - 1]
  const duration = lastSegment ? lastSegment.end : 0

  return {
    text: raw.text,
    segments: raw.segments.map(s => ({
      id: s.id,
      start: s.start,
      end: s.end,
      text: s.text,
      words: null,
      avg_logprob: s.avg_logprob,
      no_speech_prob: s.no_speech_prob,
      speaker: s.speaker ?? null,
    })),
    info: {
      language: raw.language,
      language_probability: 0,
      duration,
      processing_time: processingTime,
    },
  }
}

export interface TranscriptionMessage {
  id: string
  source: "file" | "microphone"
  fileName?: string
  modelId: string
  modelName: string
  result: TranscriptionResult
  timestamp: Date
}

export interface ModelInfo {
  id: string
  name: string
  plugin_name: string
  variant: string
  vram_estimate_mb: number
  is_loaded: boolean
  supports_streaming: boolean
  supports_diarization?: boolean
}

export interface GpuInfo {
  available: boolean
  device: string
  name?: string
  vram_total_mb?: number
  vram_used_mb?: number
  vram_free_mb?: number
}

export interface ModelsResponse {
  models: ModelInfo[]
  gpu: GpuInfo
  loaded_model_id: string | null
}

export interface LanguageOption {
  code: string | null
  name: string
}

export const LANGUAGES: LanguageOption[] = [
  { code: null, name: "Wykryj" },
  { code: "pl", name: "Polski" },
  { code: "en", name: "English" },
  { code: "de", name: "Deutsch" },
  { code: "fr", name: "Francais" },
  { code: "es", name: "Espanol" },
  { code: "uk", name: "Ukrainski" },
  { code: "cs", name: "Cesky" },
  { code: "it", name: "Italiano" },
  { code: "pt", name: "Portugues" },
  { code: "nl", name: "Nederlands" },
  { code: "ja", name: "Japonski" },
  { code: "zh", name: "Chinski" },
]

export type InputMode = "file"
