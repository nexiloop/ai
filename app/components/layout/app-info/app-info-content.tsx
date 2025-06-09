import { APP_DESCRIPTION } from "@/lib/config"
import React from "react"

export function AppInfoContent() {
  return (
    <div className="space-y-4">
      <p className="text-foreground leading-relaxed">
        {APP_DESCRIPTION}
      </p>
      <p className="text-foreground leading-relaxed">
        Made by <span className="font-semibold">Nexiloop</span>.{" "}
        <a
          href="https://nexiloop.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Learn more
        </a>
        .
      </p>
      <p className="text-foreground leading-relaxed">
        Thank you for using it (｡•́‿•̀｡)♡
      </p>
    </div>
  )
}
