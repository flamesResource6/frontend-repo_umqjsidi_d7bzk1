import { useEffect, useState } from 'react'
import { ChevronRight } from 'lucide-react'

const goalsList = [
  { id: 'stress', label: 'Reduce stress' },
  { id: 'focus', label: 'Improve focus' },
  { id: 'sleep', label: 'Sleep better' },
]

export default function Onboarding({ anonId }) {
  const [step, setStep] = useState(0)
  const [goals, setGoals] = useState([])
  const [notify, setNotify] = useState(true)
  const [language, setLanguage] = useState('en')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const slides = [
    { title: 'Feel better, one check-in at a time.', body: 'Track your mood in under 5 minutes and build a gentle habit.' },
    { title: 'Kind, helpful suggestions', body: 'Get empathetic tips like breathing, mini meditations, or a micro-walk.' },
    { title: 'Privacy-first', body: 'Stay anonymous by default. Your data stays on your device unless you opt-in.' },
  ]

  const toggleGoal = (id) => {
    setGoals(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id])
  }

  const complete = async () => {
    // Save minimal profile
    try {
      await fetch(`${baseUrl}/api/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          anonymous_id: anonId,
          goals,
          notify_enabled: notify,
          notify_times: ['09:00'],
          language,
          privacy_anonymous_mode: true,
          reduced_motion: false,
        })
      })
    } catch {}
    localStorage.setItem('onboarding_done', '1')
    window.location.href = '/home'
  }

  return (
    <div className="p-6 pt-10 relative z-10">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-[#1B1B1B]">{slides[step].title}</h1>
        <p className="text-[#6B6B6B] mt-2">{slides[step].body}</p>
      </div>

      <div className="space-y-4">
        {step === 2 && (
          <div className="bg-white/80 backdrop-blur rounded-xl p-4 border">
            <p className="text-sm font-medium mb-2">Personalize</p>
            <div className="flex gap-2 mb-3">
              {goalsList.map(g => (
                <button key={g.id} onClick={() => toggleGoal(g.id)}
                  className={`px-3 py-2 rounded-lg border text-sm ${goals.includes(g.id) ? 'bg-[#FFD9B3] border-[#FFD9B3]' : 'bg-white'}`}>
                  {g.label}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={notify} onChange={e => setNotify(e.target.checked)} />
              Enable daily reminders
            </label>
            <div className="mt-3">
              <label className="text-sm mr-2">Language</label>
              <select value={language} onChange={e=>setLanguage(e.target.value)} className="border rounded px-2 py-1 text-sm">
                <option value="en">English</option>
                <option value="ta">Tamil</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-20 left-0 right-0 px-6">
        <div className="flex justify-between items-center">
          <button onClick={() => setStep(Math.max(0, step-1))} className="text-sm text-[#6B6B6B]">{step>0 ? 'Back' : 'Skip'}</button>
          {step < slides.length - 1 ? (
            <button onClick={() => setStep(step+1)} className="bg-[#A7C7E7] text-[#1B1B1B] px-4 py-2 rounded-xl shadow active:scale-95 transition">
              Next <ChevronRight className="inline ml-1" size={18} />
            </button>
          ) : (
            <button onClick={complete} className="bg-[#E63946] text-white px-4 py-2 rounded-xl shadow active:scale-95 transition">Get Started</button>
          )}
        </div>
      </div>
    </div>
  )
}
