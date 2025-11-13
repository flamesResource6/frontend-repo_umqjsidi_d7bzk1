import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { Home, Notebook, BarChart3, User, Settings, Bell, HelpCircle, Smile, Sparkles } from 'lucide-react'
import Spline from '@splinetool/react-spline'
import Onboarding from './components/Onboarding'
import HomeScreen from './components/HomeScreen'
import MoodLog from './components/MoodLog'
import Suggestions from './components/Suggestions'
import Journal from './components/Journal'
import Insights from './components/Insights'
import Profile from './components/Profile'
import DesignSystem from './components/DesignSystem'
import Help from './components/Help'

const tokens = {
  colors: {
    lavender: '#EDE6F2',
    sky: '#A7C7E7',
    peach: '#FFD9B3',
    cta: '#E63946',
    text: '#1B1B1B',
    muted: '#6B6B6B'
  },
  radius: '12px',
  spacing: 8
}

function useAnonymousId() {
  const [id, setId] = useState(() => localStorage.getItem('anon_id') || '')
  useEffect(() => {
    if (!id) {
      const newId = 'anon_' + Math.random().toString(36).slice(2, 10)
      localStorage.setItem('anon_id', newId)
      setId(newId)
    }
  }, [id])
  return id
}

function Shell({ children }) {
  const location = useLocation()
  const hideTabs = location.pathname.startsWith('/onboarding')
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#EDE6F2]">
      <div className="w-full max-w-[390px] h-[844px] rounded-2xl shadow-xl overflow-hidden relative bg-white">
        {/* Hero/Spline Overlay only on onboarding */}
        {location.pathname === '/onboarding' && (
          <div className="absolute inset-0 pointer-events-none opacity-80">
            <Spline scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
          </div>
        )}
        <div className="absolute inset-0 overflow-y-auto">
          {children}
        </div>
        {!hideTabs && <TabBar />}
      </div>
    </div>
  )
}

function TabBar() {
  const location = useLocation()
  const items = [
    { to: '/home', icon: <Home size={24} />, label: 'Home' },
    { to: '/mood', icon: <Smile size={24} />, label: 'Mood' },
    { to: '/suggest', icon: <Sparkles size={24} />, label: 'AI' },
    { to: '/journal', icon: <Notebook size={24} />, label: 'Journal' },
    { to: '/insights', icon: <BarChart3 size={24} />, label: 'Insights' },
  ]
  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-gray-200">
      <div className="grid grid-cols-5 text-xs">
        {items.map(it => {
          const active = location.pathname.startsWith(it.to)
          return (
            <Link key={it.to} to={it.to} className="flex flex-col items-center py-2">
              <div className={`transition ${active ? 'text-blue-600' : 'text-gray-500'}`}>{it.icon}</div>
              <span className={`mt-1 ${active ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>{it.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default function App() {
  const anonId = useAnonymousId()
  const hasCompletedOnboarding = localStorage.getItem('onboarding_done') === '1'

  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Navigate to={hasCompletedOnboarding ? '/home' : '/onboarding'} replace />} />
        <Route path="/onboarding" element={<Onboarding anonId={anonId} />} />
        <Route path="/home" element={<HomeScreen anonId={anonId} />} />
        <Route path="/mood" element={<MoodLog anonId={anonId} />} />
        <Route path="/suggest" element={<Suggestions anonId={anonId} />} />
        <Route path="/journal" element={<Journal anonId={anonId} />} />
        <Route path="/insights" element={<Insights anonId={anonId} />} />
        <Route path="/profile" element={<Profile anonId={anonId} />} />
        <Route path="/help" element={<Help />} />
        <Route path="/design" element={<DesignSystem tokens={tokens} />} />
      </Routes>
    </Shell>
  )
}
