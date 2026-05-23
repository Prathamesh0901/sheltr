import dynamic from 'next/dynamic'

const Terminal = dynamic(() => import('./components/Terminal'), { ssr: true })

export default function Home() {
  return (
    <main className="w-screen h-screen bg-[#0a0a0a] p-4">
      <Terminal />
    </main>
  )
}