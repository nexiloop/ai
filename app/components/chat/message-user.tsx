"use client"

import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogImage,
  MorphingDialogTrigger,
} from "@/components/motion-primitives/morphing-dialog"
import {
  Message as MessageContainer,
  MessageContent,
} from "@/components/prompt-kit/message"
import { cn } from "@/lib/utils"
import { Message as MessageType } from "@ai-sdk/react"
import Image from "next/image"
import { useRef } from "react"

const getTextFromDataUrl = (dataUrl: string) => {
  const base64 = dataUrl.split(",")[1]
  return base64
}

export type MessageUserProps = {
  hasScrollAnchor?: boolean
  attachments?: MessageType["experimental_attachments"]
  children: string
}

export function MessageUser({
  hasScrollAnchor,
  attachments,
  children,
}: MessageUserProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <MessageContainer
      className={cn(
        "group flex w-full max-w-3xl flex-col items-end gap-0.5 px-6 pb-2",
        hasScrollAnchor && "min-h-scroll-anchor"
      )}
    >
      {attachments?.map((attachment, index) => (
        <div
          className="flex flex-row gap-2"
          key={`${attachment.name}-${index}`}
        >
          {attachment.contentType?.startsWith("image") ? (
            <MorphingDialog
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 18,
                mass: 0.3,
              }}
            >
              <MorphingDialogTrigger className="z-10">
                <Image
                  className="mb-1 w-40 rounded-md"
                  key={attachment.name}
                  src={attachment.url}
                  alt={attachment.name || "Attachment"}
                  width={160}
                  height={120}
                />
              </MorphingDialogTrigger>
              <MorphingDialogContainer>
                <MorphingDialogContent className="relative rounded-lg">
                  <MorphingDialogImage
                    src={attachment.url}
                    alt={attachment.name || ""}
                    className="max-h-[90vh] max-w-[90vw] object-contain"
                  />
                </MorphingDialogContent>
                <MorphingDialogClose className="text-primary" />
              </MorphingDialogContainer>
            </MorphingDialog>
          ) : attachment.contentType?.startsWith("text") ? (
            <div className="text-primary mb-3 h-24 w-40 overflow-hidden rounded-md border p-2 text-xs">
              {getTextFromDataUrl(attachment.url)}
            </div>
          ) : null}
        </div>
      ))}
      <MessageContent
        className="bg-accent relative max-w-[70%] rounded-3xl px-5 py-2.5"
        markdown={true}
        ref={contentRef}
        components={{
          code: ({ children }) => <>{children}</>,
          pre: ({ children }) => <>{children}</>,
          h1: ({ children }) => <p>{children}</p>,
          h2: ({ children }) => <p>{children}</p>,
          h3: ({ children }) => <p>{children}</p>,
          h4: ({ children }) => <p>{children}</p>,
          h5: ({ children }) => <p>{children}</p>,
          h6: ({ children }) => <p>{children}</p>,
          p: ({ children }) => <p>{children}</p>,
          li: ({ children }) => <p>- {children}</p>,
          ul: ({ children }) => <>{children}</>,
          ol: ({ children }) => <>{children}</>,
        }}
      >
        {children}
      </MessageContent>
    </MessageContainer>
  )
}
