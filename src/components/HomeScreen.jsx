import { useEffect, useMemo, useState } from 'react'
import { Settings, Bell, Notebook, BarChart3 } from 'lucide-react'
import { Link } from 'react-router-dom'

const emojis = ['😞','😐','🙂','😊','😁']

export default function HomeScreen({ anonId }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [greeting, setGreeting] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [reason, setReason] = useState('')
  const [insights, setInsights] = useState(null)

  useEffect(() => {
    const hour = new Date().getHours()
    setGreeting(hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening')
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/suggestions?anonymous_id=${anonId}`)
        const data = await res.json()
        setSuggestions(data.items || [])
        setReason(data.reason || '')
        setInsights(data.insights || null)
      } catch (e) {}
    }
    load()
  }, [anonId])

  const logQuick = async (idx) => {
    try {
      await fetch(`${baseUrl}/api/moodlog`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ anonymous_id: anonId, mood: idx+1, emoji: emojis[idx], note: '', tags: [] })
      })
      // Tiny toast
      alert('Nice — one small step.')
    } catch {}
  }

  return (
    <div className="p-4 pb-24">
      <header className="flex items-center justify-between">
        <Link to="/profile" className="w-8 h-8 rounded-full bg-[#A7C7E7]" aria-label="Profile" />
        <div className="text-center">
          <p className="text-xs text-gray-500">{new Date().toDateString()}</p>
          <h2 className="text-lg font-medium text-[#1B1B1B]">{greeting}</h2>
        </div>
        <div className="flex gap-2">
          <Link to="/help" aria-label="Help"><Bell size={22} className="text-gray-700"/></Link>
          <Link to="/profile" aria-label="Settings"><Settings size={22} className="text-gray-700"/></Link>
        </div>
      </header>

      <section className="mt-4 bg-[#EDE6F2] rounded-xl p-4">
        <p className="text-sm text-gray-700 mb-2">Hi there — how are you feeling?</p>
        <div className="flex justify-between">
          {emojis.map((e, i) => (
            <button key={i} onClick={() => logQuick(i)} className="w-14 h-14 rounded-full bg-white text-2xl shadow active:scale-95 transition" aria-label={`Log mood ${i+1}`}>
              {e}
            </button>
          ))}
        </div>
        <div className="flex justify-between mt-3">
          <Link to="/mood" className="text-sm text-blue-700">Add note</Link>
          <Link to="/mood" className="px-3 py-2 bg-[#A7C7E7] rounded-lg text-sm">Log Mood</Link>
        </div>
      </section>

      <section className="mt-4">
        <h3 className="text-sm text-gray-700">Quick suggestions</h3>
        <p className="text-xs text-gray-500 mb-2">{reason}</p>
        <div className="flex gap-3 overflow-auto pb-2">
          {suggestions.map(s => (
            <Link key={s.id} to="/suggest" className="min-w-[180px] bg-white rounded-xl p-3 shadow">
              <p className="text-sm font-medium">{s.title}</p>
              <p className="text-xs text-gray-500">{s.duration} min</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-4 grid grid-cols-2 gap-3">
        <Link to="/journal" className="bg-white rounded-xl p-4 shadow flex items-center gap-2"><Notebook size={18}/> Journal</Link>
        <Link to="/insights" className="bg-white rounded-xl p-4 shadow flex items-center gap-2"><BarChart3 size={18}/> Insights</Link>
      </section>

      {insights && (
        <section className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
          <div className="bg-white rounded-xl p-3 shadow"><p className="text-xs text-gray-500">Avg</p><p className="text-lg font-semibold">{insights.avg_mood ?? '-'}</p></div>
          <div className="bg-white rounded-xl p-3 shadow"><p className="text-xs text-gray-500">Entries</p><p className="text-lg font-semibold">{insights.entries}</p></div>
          <div className="bg-white rounded-xl p-3 shadow"><p className="text-xs text-gray-500">Streak</p><p className="text-lg font-semibold">{insights.streak}</p></div>
        </section>
      )}
    </div>
  )
}
