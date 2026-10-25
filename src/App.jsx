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

function Block({ block }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(block.text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = block.text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <article className="block">
      <header>
        <h2>{block.name}</h2>
        <button onClick={copy}>{copied ? 'Copied!' : 'Copy'}</button>
      </header>
      <pre>{block.text}</pre>
    </article>
  )
}

export default function App() {
  const [unlocked, setUnlocked] = useState(() => localStorage.getItem(config.unlockKey) === '1')
  const [blocks, setBlocks] = useState([])

  useEffect(() => {
    if (unlocked) getStaticBlocks().then(setBlocks)
  }, [unlocked])

  if (!unlocked) return <Login onUnlock={() => setUnlocked(true)} />

  return (
    <main>
      <h1>{config.title}</h1>
      {blocks.map((b) => <Block key={b.id} block={b} />)}
    </main>
  )
}
