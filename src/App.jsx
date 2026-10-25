import { useEffect, useState } from 'react'
import { config } from './config.js'
import { getStaticBlocks } from './blocksService.js'

function Login({ onUnlock }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (value === config.masterPassword) {
      localStorage.setItem(config.unlockKey, '1')
      onUnlock()
    } else {
      setError(true)
    }
  }

  return (
    <form className="login" onSubmit={submit}>
      <h1>{config.title}</h1>
      <input
        type="password"
        placeholder="Password"
        value={value}
        autoFocus
        onChange={(e) => { setValue(e.target.value); setError(false) }}
      />
      <button type="submit">Enter</button>
      {error && <p className="error">Wrong password</p>}
    </form>
  )
}

const PREVIEW_LENGTH = 120

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    ta.remove()
  }
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  const copy = async (e) => {
    e.stopPropagation()
    await copyText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return <button onClick={copy}>{copied ? 'Copied!' : 'Copy'}</button>
}

function Block({ block, onOpen }) {
  const truncated = block.text.length > PREVIEW_LENGTH
  const preview = truncated ? block.text.slice(0, PREVIEW_LENGTH).trimEnd() + '...' : block.text

  return (
    <article
      className="card"
      tabIndex={0}
      role="button"
      onClick={() => onOpen(block)}
      onKeyDown={(e) => {
        if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onOpen(block)
        }
      }}
    >
      <h2>{block.name}</h2>
      <p className="preview">{preview}</p>
      <CopyButton text={block.text} />
    </article>
  )
}

function Modal({ block, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <header>
          <h2>{block.name}</h2>
          <div className="actions">
            <CopyButton text={block.text} />
            <button className="secondary" onClick={onClose}>Close</button>
          </div>
        </header>
        <pre>{block.text}</pre>
      </div>
    </div>
  )
}

export default function App() {
  const [unlocked, setUnlocked] = useState(() => localStorage.getItem(config.unlockKey) === '1')
  const [blocks, setBlocks] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (unlocked) getStaticBlocks().then(setBlocks)
  }, [unlocked])

  if (!unlocked) return <Login onUnlock={() => setUnlocked(true)} />

  return (
    <main>
      <h1>{config.title}</h1>
      <div className="grid">
        {blocks.map((b) => <Block key={b.id} block={b} onOpen={setSelected} />)}
      </div>
      {selected && <Modal block={selected} onClose={() => setSelected(null)} />}
    </main>
  )
}
