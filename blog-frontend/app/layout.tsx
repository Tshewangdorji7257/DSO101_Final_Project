import type { Metadata } from 'next'
import { AuthProvider } from '@/lib/auth-context'
import { EditorProvider } from '@/lib/editor-context'
import './globals.css'

export const metadata: Metadata = {
  title: 'BlogPlatform | Share Your Stories',
  description: 'A community platform for sharing thoughts, stories, and reflections',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>
          <EditorProvider>
            {children}
          </EditorProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
