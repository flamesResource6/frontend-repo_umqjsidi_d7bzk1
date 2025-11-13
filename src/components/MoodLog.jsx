import { useState } from 'react'

const emojis = ['😞','😐','🙂','😊','😁']

export default function MoodLog({ anonId }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [mood, setMood] = useState(3)
  const [note, setNote] = useState('')
  const [tags, setTags] = useState([])
  const tagList = ['work','family','sleep','food']

  const toggleTag = (t) => setTags(prev => prev.includes(t) ? prev.filter(x=>x!==t) : [...prev, t])

  const submit = async () => {
    try {
      await fetch(`${baseUrl}/api/moodlog`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ anonymous_id: anonId, mood, emoji: emojis[mood-1], note, tags })
      })
      alert('Nice — one small step.')
      window.history.back()
    } catch {}
  }

  return (
    <div className="p-4 pb-24">
      <h2 className="text-lg font-medium">Log Mood</h2>
      <div className="mt-4 flex justify-between">
        {emojis.map((e, i) => (
          <button key={i} onClick={() => setMood(i+1)} className={`w-14 h-14 rounded-full text-2xl shadow transition ${mood===i+1?'bg-[#FFD9B3]':'bg-white'}`}>{e}</button>
        ))}
      </div>
      <input value={note} onChange={e=>setNote(e.target.value)} placeholder="What’s on your mind?" className="mt-4 w-full border rounded-xl p-3" maxLength={200} />
      <div className="mt-3 flex gap-2 flex-wrap">
        {tagList.map(t => (
          <button key={t} onClick={()=>toggleTag(t)} className={`px-3 py-2 rounded-lg border text-sm ${tags.includes(t)?'bg-[#FFD9B3] border-[#FFD9B3]':'bg-white'}`}>{t}</button>
        ))}
      </div>
      <button onClick={submit} className="mt-6 w-full bg-[#A7C7E7] py-3 rounded-xl shadow active:scale-95 transition">Log</button>
    </div>
  )
}
