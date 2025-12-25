import './globals.css'

export const metadata = {
  title: 'RAG Chat System',
  description: 'Retrieval-Augmented Generation Chat Interface',
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
