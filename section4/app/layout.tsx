import './globals.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Providers } from '@/app/providers'

export const metadata: Metadata = {
  title: 'Task Dashboard',
  description: 'Manage your tasks efficiently',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
