import { useEffect, useState } from 'react'

export default function Insights({ anonId }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [range, setRange] = useState('7d')
  const [data, setData] = useState(null)

  const load = async (r = range) => {
    const res = await fetch(`${baseUrl}/api/insights?anonymous_id=${anonId}&range=${r}`)
    const d = await res.json()
    setData(d)
  }

  useEffect(() => { load('7d') }, [anonId])

  return (
    <div className="p-4 pb-24">
      <h2 className="text-lg font-medium">Insights</h2>
      <div className="mt-2 flex gap-2">
        <button className={`px-3 py-1 rounded-full border ${range==='7d'?'bg-[#FFD9B3] border-[#FFD9B3]':''}`} onClick={()=>{setRange('7d'); load('7d')}}>7d</button>
        <button className={`px-3 py-1 rounded-full border ${range==='30d'?'bg-[#FFD9B3] border-[#FFD9B3]':''}`} onClick={()=>{setRange('30d'); load('30d')}}>30d</button>
      </div>
      {data && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="bg-white rounded-xl p-3 shadow"><p className="text-xs text-gray-500">Avg mood</p><p className="text-lg font-semibold">{data.kpis.avg_mood ?? '-'}</p></div>
            <div className="bg-white rounded-xl p-3 shadow"><p className="text-xs text-gray-500">Entries</p><p className="text-lg font-semibold">{data.kpis.entries}</p></div>
            <div className="bg-white rounded-xl p-3 shadow"><p className="text-xs text-gray-500">Streak</p><p className="text-lg font-semibold">{data.kpis.streak}</p></div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <p className="text-sm font-medium">AI Summary</p>
            <ul className="list-disc ml-5 text-sm text-gray-700 mt-1">
              {data.ai_summary.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
            <p className="text-sm font-medium mt-3">Suggested actions</p>
            <ul className="list-disc ml-5 text-sm text-gray-700 mt-1">
              {data.suggested_actions.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
