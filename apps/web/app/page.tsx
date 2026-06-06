'use client'

import { useState } from 'react'
import Link from 'next/link'

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

function GitHubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  )
}

function NpmIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331z"/>
    </svg>
  )
}

const GITHUB_URL = 'https://github.com/Prathamesh0901/sheltr'
const NPM_URL = 'https://www.npmjs.com/package/@sheltr_/agent'
const INSTALL_CMD = 'npx @sheltr_/agent'

export default function LandingPage() {
  const [copied, setCopied] = useState(false)

  const copyInstall = () => {
    navigator.clipboard.writeText(INSTALL_CMD)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen bg-[#0c0c0e] text-[#e8e8ec] font-sans antialiased">

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-white/[0.06] sticky top-0 bg-[#0c0c0e]/90 backdrop-blur-md z-50">
        <span className="font-mono text-[1.05rem] tracking-tight">
          sh<span className="text-[#7c6af7]">&gt;</span>ltr
        </span>
        <div className="flex items-center gap-4">
          {/* <Link href="/docs" className="text-sm text-[#6b6b78] hover:text-[#e8e8ec] transition-colors">docs</Link> */}
          <Link
            href={GITHUB_URL}
            target="_blank"
            className="text-[#c0c0cc] hover:text-white transition-colors"
            title="GitHub"
          >
            <GitHubIcon size={24} />
          </Link>
          <Link
            href={NPM_URL}
            target="_blank"
            className="text-[#c0c0cc] hover:text-white transition-colors"
            title="npm"
          >
            <NpmIcon size={24} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 md:px-10 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-[#7c6af7]/10 border border-[#7c6af7]/25 rounded-full px-4 py-1.5 text-xs font-mono text-[#a89cf8] mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3dd68c] animate-pulse" />
          v1.0.1 — now on npm
        </div>

        <h1 className="text-5xl md:text-6xl font-light tracking-[-0.035em] leading-[1.12] mb-6">
          Share your terminal,{' '}
          <span className="italic font-serif text-[#a89cf8]">instantly.</span>
        </h1>

        <p className="text-lg text-[#6b6b78] max-w-xl mx-auto leading-relaxed mb-10">
          Run one command. Get two links — one to control, one to watch.
          No SSH, no screen sharing, no installs on the other end.
        </p>

        <div className="flex items-center justify-center mb-14">
          <div className="flex items-center gap-0 bg-[#17171b] border border-white/[0.08] rounded-lg overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-2.5 font-mono text-sm">
              <span className="text-[#7c6af7]">$</span>
              <span>{INSTALL_CMD}</span>
            </div>
            <button
              onClick={copyInstall}
              className={`px-3 py-2.5 border-l border-white/[0.08] transition-colors flex items-center justify-center ${copied ? 'text-[#3dd68c]' : 'text-[#6b6b78] hover:text-[#a89cf8] hover:bg-white/[0.04]'}`}
              title="Copy to clipboard"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
        </div>

        {/* Terminal mockup */}
        <div className="bg-[#111114] border border-white/[0.07] rounded-xl overflow-hidden max-w-2xl mx-auto text-left shadow-2xl shadow-black/60">
          <div className="flex items-center gap-2 px-4 py-3 bg-[#17171b] border-b border-white/[0.06]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            <span className="font-mono text-xs text-[#6b6b78] mx-auto">sheltr — zsh</span>
          </div>
          <div className="p-6 font-mono text-sm leading-loose">
            <div>
              <span className="text-[#7c6af7]">~ $</span>{' '}
              <span className="text-[#e8e8ec]">npx @sheltr_/agent</span>
            </div>
            <div className="text-[#6b6b78]">Spawned zsh shell</div>
            <div className="text-[#6b6b78]">Connecting to server...</div>
            <div className="text-[#6b6b78]">✓ Connected. Session ready.</div>
            <div className="mt-3 space-y-0.5">
              <div>
                <span className="text-[#a89cf8]">Controller</span>{' '}
                <span className="text-[#6b6b78]">→</span>{' '}
                <span className="text-[#3dd68c]">https://sheltr.dev/s/f3a9c2?role=controller</span>
              </div>
              <div>
                <span className="text-[#a89cf8]">Viewer    </span>{' '}
                <span className="text-[#6b6b78]">→</span>{' '}
                <span className="text-[#3dd68c]">https://sheltr.dev/s/f3a9c2?role=viewer</span>
              </div>
            </div>
            <div className="mt-3">
              <span className="text-[#7c6af7]">~ $</span>{' '}
              <span className="inline-block w-2 h-[14px] bg-[#7c6af7] animate-pulse align-[-2px]" />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 md:px-10">
        <div className="h-px bg-white/[0.06]" />
      </div>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 md:px-10 py-20">
        <p className="font-mono text-xs text-[#7c6af7] uppercase tracking-widest mb-3">how it works</p>
        <h2 className="text-3xl md:text-4xl font-light tracking-[-0.025em] mb-3">
          Three steps.{' '}
          <span className="italic font-serif text-[#a89cf8]">No setup required.</span>
        </h2>
        <p className="text-[#6b6b78] mb-10 leading-relaxed">The fastest path from install to a shared terminal session.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              num: '01',
              title: 'Run the agent',
              desc: 'Install nothing. Run',
              code: 'npx @sheltr_/agent',
              after: 'and get two shareable URLs instantly.',
            },
            {
              num: '02',
              title: 'Share the link',
              desc: 'Send the controller link to a teammate or the viewer link to anyone who just needs to watch.',
              code: null,
              after: null,
            },
            {
              num: '03',
              title: 'Connect instantly',
              desc: 'They open a URL in any browser. No SSH, no installs. A full terminal — live.',
              code: null,
              after: null,
            },
          ].map((step) => (
            <div
              key={step.num}
              className="bg-[#111114] border border-white/[0.07] rounded-xl p-6 hover:border-[#7c6af7]/30 transition-colors"
            >
              <span className="font-mono text-xs text-[#7c6af7] mb-4 block">{step.num}</span>
              <h3 className="text-base font-medium mb-2">{step.title}</h3>
              <p className="text-sm text-[#6b6b78] leading-relaxed">
                {step.desc}{' '}
                {step.code && (
                  <code className="font-mono text-[0.78rem] text-[#a89cf8] bg-[#7c6af7]/10 px-1.5 py-0.5 rounded">
                    {step.code}
                  </code>
                )}{' '}
                {step.after}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 md:px-10">
        <div className="h-px bg-white/[0.06]" />
      </div>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 md:px-10 py-20">
        <p className="font-mono text-xs text-[#7c6af7] uppercase tracking-widest mb-3">features</p>
        <h2 className="text-3xl md:text-4xl font-light tracking-[-0.025em] mb-3">
          Built for{' '}
          <span className="italic font-serif text-[#a89cf8]">real workflows.</span>
        </h2>
        <p className="text-[#6b6b78] mb-10 leading-relaxed">
          Not another screen share. A purpose-built tool for developers who work remotely.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 divide-x divide-y divide-white/[0.06] border border-white/[0.06] rounded-xl overflow-hidden">
          {[
            { icon: '🔗', title: 'Shareable links', desc: 'Two URLs per session — controller and viewer. Share selectively. No accounts needed.' },
            { icon: '👁', title: 'Role-based access', desc: 'Viewers watch but can\'t type. Controllers have full access. Enforced server-side.' },
            { icon: '⏺', title: 'Session replay', desc: 'Every session recorded automatically. When it ends, get a shareable replay link.' },
            { icon: '🔄', title: 'Auto-reconnect', desc: 'The agent reconnects automatically on network drops. Sessions survive brief outages.' },
            { icon: '🖥', title: 'Real terminal', desc: 'Full PTY — vim, htop, colors, resize. Not a fake shell. Your actual machine.' },
            { icon: '🔒', title: 'Relay architecture', desc: 'Your shell stays on your machine. The server only relays bytes — never touches your PTY.' },
          ].map((f) => (
            <div key={f.title} className="p-6 hover:bg-white/[0.02] transition-colors">
              <div className="w-9 h-9 bg-[#7c6af7]/10 rounded-lg flex items-center justify-center text-base mb-4">
                {f.icon}
              </div>
              <h3 className="text-sm font-medium mb-1.5">{f.title}</h3>
              <p className="text-xs text-[#6b6b78] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 md:px-10">
        <div className="h-px bg-white/[0.06]" />
      </div>

      {/* Architecture */}
      <section className="max-w-4xl mx-auto px-6 md:px-10 py-20">
        <p className="font-mono text-xs text-[#7c6af7] uppercase tracking-widest mb-3">architecture</p>
        <h2 className="text-3xl md:text-4xl font-light tracking-[-0.025em] mb-3">
          How it{' '}
          <span className="italic font-serif text-[#a89cf8]">actually</span> works.
        </h2>
        <p className="text-[#6b6b78] mb-8 leading-relaxed">Your shell never leaves your machine. The server is just a relay.</p>

        <div className="bg-[#111114] border border-white/[0.07] rounded-xl p-6 font-mono text-sm leading-loose text-[#6b6b78]">
          <div><span className="text-[#e8e8ec]">Your machine</span>{'  →  '}sheltr agent{'  →  '}WebSocket (outbound)</div>
          <div className="pl-8 text-[#7c6af7]">↕</div>
          <div><span className="text-[#e8e8ec]">Sheltr server</span>{'  →  '}relay{'  →  '}session manager{'  →  '}recording</div>
          <div className="pl-8 text-[#7c6af7]">↕</div>
          <div><span className="text-[#e8e8ec]">Browser A</span>{'  (controller)  →  '}xterm.js{'  →  '}full control</div>
          <div><span className="text-[#e8e8ec]">Browser B</span>{'  (viewer)     →  '}xterm.js{'  →  '}read only</div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 md:px-10">
        <div className="h-px bg-white/[0.06]" />
      </div>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-6 md:px-10 py-24 text-center">
        <p className="font-mono text-xs text-[#7c6af7] uppercase tracking-widest mb-4">get started</p>
        <h2 className="text-3xl md:text-4xl font-light tracking-[-0.025em] mb-4">
          Ready to share{' '}
          <span className="italic font-serif text-[#a89cf8]">your terminal?</span>
        </h2>
        <p className="text-[#6b6b78] mb-8 leading-relaxed">
          One command. Works on Linux and macOS. Free and open source.
        </p>

        <div className="flex items-center gap-0 bg-[#17171b] border border-white/[0.08] rounded-lg overflow-hidden mx-auto w-fit mb-6">
          <div className="flex items-center gap-3 px-5 py-2.5 font-mono text-sm">
            <span className="text-[#7c6af7]">$</span>
            <span>{INSTALL_CMD}</span>
          </div>
          <button
            onClick={copyInstall}
            className={`px-3 py-2.5 border-l border-white/[0.08] transition-colors flex items-center justify-center ${copied ? 'text-[#3dd68c]' : 'text-[#6b6b78] hover:text-[#a89cf8] hover:bg-white/[0.04]'}`}
            title="Copy to clipboard"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {['node-pty', 'websockets', 'xterm.js', 'next.js', 'postgresql', 'typescript', 'turborepo'].map((tag) => (
            <span
              key={tag}
              className="font-mono text-xs text-[#6b6b78] bg-[#17171b] border border-white/[0.06] rounded-full px-3 py-1"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link
          href={GITHUB_URL}
          target="_blank"
          className="inline-flex items-center gap-2 bg-[#7c6af7] text-white px-8 py-3 rounded-lg hover:bg-[#6a59e0] transition-colors font-medium"
        >
          <GitHubIcon size={16} />
          view on github
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-6 md:px-10 py-5 flex items-center justify-between max-w-full">
        <span className="font-mono text-sm text-[#6b6b78]">
          sh<span className="text-[#7c6af7]">&gt;</span>ltr — open source
        </span>
        <div className="flex gap-4 items-center">
          {/* <Link href="/docs" className="text-sm text-[#6b6b78] hover:text-[#e8e8ec] transition-colors">docs</Link> */}
          <Link href={GITHUB_URL} target="_blank" className="text-[#6b6b78] hover:text-[#e8e8ec] transition-colors" title="GitHub">
            <GitHubIcon size={16} />
          </Link>
          <Link href={NPM_URL} target="_blank" className="text-[#6b6b78] hover:text-[#e8e8ec] transition-colors" title="npm">
            <NpmIcon size={16} />
          </Link>
        </div>
      </footer>

    </main>
  )
}
