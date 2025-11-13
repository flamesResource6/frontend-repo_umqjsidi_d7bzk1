import { useEffect, useState } from 'react'

export default function Profile({ anonId }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [profile, setProfile] = useState(null)

  const load = async () => {
    const res = await fetch(`${baseUrl}/api/profile?anonymous_id=${anonId}`)
    const d = await res.json()
    setProfile(d)
  }

  const save = async () => {
    if (!profile) return
    await fetch(`${baseUrl}/api/profile`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) })
    alert('Saved')
  }

  useEffect(() => { load() }, [anonId])

  if (!profile) return <div className="p-4">Loading…</div>

  const toggleGoal = (g) => setProfile(p=> ({...p, goals: p.goals.includes(g) ? p.goals.filter(x=>x!==g) : [...p.goals, g]}))

  return (
    <div className="p-4 pb-24">
      <h2 className="text-lg font-medium">Profile & Settings</h2>

      <div className="bg-white rounded-xl p-4 shadow mt-3">
        <label className="text-sm">Display name</label>
        <input value={profile.name||''} onChange={e=>setProfile(p=>({...p, name:e.target.value}))} className="w-full border rounded-xl p-2 mt-1" placeholder="Optional" />
      </div>

      <div className="bg-white rounded-xl p-4 shadow mt-3">
        <label className="text-sm mr-2">Language</label>
        <select value={profile.language||'en'} onChange={e=>setProfile(p=>({...p, language:e.target.value}))} className="border rounded px-2 py-1 text-sm">
          <option value="en">English</option>
          <option value="ta">Tamil</option>
        </select>
      </div>

      <div className="bg-white rounded-xl p-4 shadow mt-3">
        <p className="text-sm font-medium">Goals</p>
        <div className="mt-2 flex gap-2 flex-wrap">
          {['stress','focus','sleep'].map(g => (
            <button key={g} onClick={()=>toggleGoal(g)} className={`px-3 py-2 rounded-lg border text-sm ${profile.goals?.includes(g)?'bg-[#FFD9B3] border-[#FFD9B3]':'bg-white'}`}>{g}</button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow mt-3">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!profile.notify_enabled} onChange={e=>setProfile(p=>({...p, notify_enabled:e.target.checked}))} />
          Enable notifications/reminders
        </label>
        <label className="flex items-center gap-2 text-sm mt-2">
          <input type="checkbox" checked={!!profile.privacy_anonymous_mode} onChange={e=>setProfile(p=>({...p, privacy_anonymous_mode:e.target.checked}))} />
          Anonymous mode
        </label>
        <label className="flex items-center gap-2 text-sm mt-2">
          <input type="checkbox" checked={!!profile.reduced_motion} onChange={e=>setProfile(p=>({...p, reduced_motion:e.target.checked}))} />
          Reduced motion
        </label>
      </div>

      <div className="mt-6 flex gap-2">
        <button onClick={save} className="flex-1 bg-[#A7C7E7] py-3 rounded-xl shadow">Save</button>
        <button onClick={()=>alert('Export coming soon via /api/export')} className="flex-1 border py-3 rounded-xl">Export</button>
      </div>

      <div className="text-xs text-gray-500 mt-4">
        <p>Privacy: Data stays local by default. Cloud sync is opt-in. No personal health data is shared. Aggregate, anonymized metrics only.</p>
      </div>
    </div>
  )
}
