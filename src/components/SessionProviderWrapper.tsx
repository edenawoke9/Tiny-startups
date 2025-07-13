// components/SessionProviderWrapper.tsx
'use client'

import { ReactNode } from "react"

export default function SessionProviderWrapper({
  children,
}: {
  children: ReactNode
}) {
  return <>{children}</>;
}
