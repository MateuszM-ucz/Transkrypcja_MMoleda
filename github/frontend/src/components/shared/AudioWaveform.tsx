import { useEffect, useRef } from "react"

interface AudioWaveformProps {
  analyserNode: AnalyserNode | null
  isRecording: boolean
}

export function AudioWaveform({ analyserNode, isRecording }: AudioWaveformProps) {
  const barsRef = useRef<HTMLDivElement>(null)
  const animFrameRef = useRef<number>(0)

  useEffect(() => {
    if (!analyserNode || !isRecording || !barsRef.current) return

    const bufferLength = analyserNode.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    const bars = barsRef.current.children

    const animate = () => {
      analyserNode.getByteFrequencyData(dataArray)

      const barCount = bars.length
      const step = Math.floor(bufferLength / barCount)

      for (let i = 0; i < barCount; i++) {
        const value = dataArray[i * step] / 255
        const height = Math.max(4, value * 28)
        const el = bars[i] as HTMLElement
        el.style.height = `${height}px`
        el.style.opacity = `${0.4 + value * 0.6}`
      }

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [analyserNode, isRecording])

  if (!isRecording) return null

  return (
    <div
      ref={barsRef}
      className="flex items-center gap-[3px] h-8 px-2"
    >
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full bg-primary transition-all duration-75"
          style={{ height: "4px", opacity: 0.4 }}
        />
      ))}
    </div>
  )
}
