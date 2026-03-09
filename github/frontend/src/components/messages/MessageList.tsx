import { useRef, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TranscriptionMessage } from "./TranscriptionMessage"
import { LiveTranscript } from "./LiveTranscript"
import { LoadingIndicator } from "@/components/shared/LoadingIndicator"
import type { TranscriptionMessage as TMessage } from "@/types"

interface MessageListProps {
  messages: TMessage[]
  liveText: string
  isTranscribing: boolean
}

export function MessageList({ messages, liveText, isTranscribing }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length, liveText, isTranscribing])

  return (
    <ScrollArea className="flex-1 w-full">
      <div className="flex flex-col gap-4 p-4 pb-6">
        {messages.map((msg) => (
          <TranscriptionMessage key={msg.id} message={msg} />
        ))}
        {liveText && <LiveTranscript text={liveText} />}
        {isTranscribing && <LoadingIndicator />}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  )
}
