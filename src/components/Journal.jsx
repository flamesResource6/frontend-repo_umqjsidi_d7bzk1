import { useEffect, useState } from 'react'

export default function Journal({ anonId }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [text, setText] = useState('')
  const [items, setItems] = useState([])

  const save = async () => {
    if (!text.trim()) return
    await fetch(`${baseUrl}/api/journal`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ anonymous_id: anonId, text, mood_at_time: null, voice_note_url: null })
    })
    setText('')
    load()
  }

  const load = async () => {
    const res = await fetch(`${baseUrl}/api/journal?anonymous_id=${anonId}`)
    const d = await res.json()
    setItems(d)
  }

  useEffect(() => { load() }, [anonId])

  return (
    <div className="p-4 pb-24">
      <h2 className="text-lg font-medium">Journal</h2>
      <div className="mt-3 bg-white rounded-xl p-3 shadow">
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="What helped you today? One thing I’m grateful for…" className="w-full outline-none" />
        <div className="mt-2 text-right">
          <button onClick={save} className="px-3 py-2 rounded-lg bg-[#A7C7E7]">Save</button>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {items.map((it, idx) => (
          <div key={idx} className="bg-white rounded-xl p-3 shadow">
            <p className="text-sm">{it.text}</p>
            <p className="text-xs text-gray-500 mt-1">{new Date(it.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
