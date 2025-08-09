import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Password Reset App',
  description: 'Secure password reset for your application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}