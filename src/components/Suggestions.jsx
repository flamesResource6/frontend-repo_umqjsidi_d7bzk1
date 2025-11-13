import { useEffect, useState } from 'react'

export default function Suggestions({ anonId }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [data, setData] = useState({ reason: '', items: [], insights: null })

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${baseUrl}/api/suggestions?anonymous_id=${anonId}`)
      const d = await res.json()
      setData(d)
      // track viewed
      d.items.forEach(async (it) => {
        try {
          await fetch(`${baseUrl}/api/engagement`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ anonymous_id: anonId, suggestion_id: it.id, action: 'viewed', reason: d.reason })
          })
        } catch {}
      })
    }
    load()
  }, [anonId])

  const mark = async (id, action) => {
    try {
      await fetch(`${baseUrl}/api/engagement`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ anonymous_id: anonId, suggestion_id: id, action, reason: data.reason })
      })
      alert(action === 'completed' ? 'Great job — you did it.' : 'Saved to favorites.')
    } catch {}
  }

  return (
    <div className="p-4 pb-24">
      <h2 className="text-lg font-medium">AI Suggestions</h2>
      <p className="text-xs text-gray-500 mt-1">{data.reason}</p>
      <div className="mt-3 space-y-3">
        {data.items.map(it => (
          <div key={it.id} className="bg-white rounded-xl p-4 shadow">
            <div className="flex justify-between items-center">
              <p className="font-medium">{it.title}</p>
              <span className="text-xs text-gray-500">{it.duration} min</span>
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={()=>mark(it.id,'completed')} className="px-3 py-2 rounded-lg bg-[#A7C7E7]">Mark done</button>
              <button onClick={()=>mark(it.id,'favorited')} className="px-3 py-2 rounded-lg border">Save</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
