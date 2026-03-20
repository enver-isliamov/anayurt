'use client'

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Users, Calendar, Heart, MapPin, BookOpen, 
  Shield, Loader2, ChevronRight, BarChart3 
} from "lucide-react"
import { toast } from "sonner"

interface Stats {
  users: number
  meetings: number
  emergency: number
  villages: number
  events: number
}

const adminMenu = [
  { icon: Users, label: 'Пользователи', href: '/admin/users', color: 'bg-blue-500' },
  { icon: Calendar, label: 'Встречи сел', href: '/admin/meetings', color: 'bg-green-500' },
  { icon: Heart, label: 'Микро-Ярдым', href: '/admin/emergency', color: 'bg-red-500' },
  { icon: MapPin, label: 'Сёла', href: '/admin/villages', color: 'bg-amber-500' },
  { icon: BookOpen, label: 'Обряды', href: '/admin/rituals', color: 'bg-purple-500' },
  { icon: Calendar, label: 'Календарь', href: '/admin/calendar', color: 'bg-pink-500' },
  { icon: Shield, label: 'Роли и доступ', href: '/admin/roles', color: 'bg-gray-700' },
]

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return

    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
      router.push('/')
      toast.error('Доступ запрещен')
      return
    }

    fetchStats()
  }, [session, status, router])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Панель администратора</h1>
              <p className="text-gray-400 text-sm">ORAZA.RU</p>
            </div>
            <a 
              href="/" 
              className="px-4 py-2 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition-colors"
            >
              На сайт
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <StatCard icon={Users} label="Пользователи" value={stats.users} color="bg-blue-500" />
            <StatCard icon={Calendar} label="Встречи" value={stats.meetings} color="bg-green-500" />
            <StatCard icon={Heart} label="Запросы помощи" value={stats.emergency} color="bg-red-500" />
            <StatCard icon={MapPin} label="Сёла" value={stats.villages} color="bg-amber-500" />
            <StatCard icon={BookOpen} label="События" value={stats.events} color="bg-purple-500" />
          </div>
        )}

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminMenu.map(item => (
            <a
              key={item.href}
              href={item.href}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group"
            >
              <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center text-white`}>
                <item.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.label}</h3>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            </a>
          ))}
        </div>
      </main>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }: { 
  icon: typeof Users
  label: string
  value: number
  color: string
}) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center text-white mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-gray-500 text-sm">{label}</p>
    </div>
  )
}
