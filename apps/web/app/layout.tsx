import type { Metadata } from 'next'
import { DM_Sans, DM_Mono, Instrument_Serif } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500'],
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: '400',
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: 'Sheltr — Share your terminal, instantly',
  description: 'Run one command. Get two links — one to control, one to watch. No SSH, no screen sharing, no installs on the other end.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable} ${instrumentSerif.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}