// components/SessionProviderWrapper.tsx
'use client'

import { SessionProvider, useSession } from "next-auth/react"
import { ReactNode } from "react"
import { Session } from "next-auth"

export default function SessionProviderWrapper({
  children,
}: {
  children: ReactNode
}) {
  // const { data: session, status } = useSession()
  return <SessionProvider>{children}</SessionProvider>
}
