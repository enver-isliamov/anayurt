'use client'

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, Loader2, Shield, User } from "lucide-react"
import { Modal } from "@/components/ui/modal"
import { toast } from "sonner"

interface UserData {
  id: string
  name: string | null
  email: string | null
  role: string
  createdAt: string
  _count: {
    meetings: number
    emergencyResponses: number
  }
}

const roles = [
  { value: 'USER', label: 'Пользователь', color: 'bg-gray-100 text-gray-700' },
  { value: 'MODERATOR', label: 'Модератор', color: 'bg-blue-100 text-blue-700' },
  { value: 'ADMIN', label: 'Администратор', color: 'bg-purple-100 text-purple-700' },
  { value: 'SUPERADMIN', label: 'Супер админ', color: 'bg-red-100 text-red-700' },
]

export default function AdminUsersPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
    } catch (error) {
      toast.error('Ошибка загрузки пользователей')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })

      if (res.ok) {
        toast.success('Роль обновлена')
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
        setSelectedUser(null)
      } else {
        toast.error('Ошибка при обновлении роли')
      }
    } catch (error) {
      toast.error('Ошибка при обновлении роли')
    }
  }

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <a href="/admin" className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div>
              <h1 className="text-xl font-bold">Пользователи</h1>
              <p className="text-gray-400 text-sm">Управление пользователями и ролями</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск пользователей..."
            className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Users List */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Пользователь</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Роль</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Дата регистрации</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Активность</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map(user => {
                  const roleConfig = roles.find(r => r.value === user.role)
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium">{user.name || 'Без имени'}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleConfig?.color}`}>
                          {roleConfig?.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex gap-4">
                          <span>Встречи: {user._count.meetings}</span>
                          <span>Помощь: {user._count.emergencyResponses}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                          Изменить роль
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Role Change Modal */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="Изменить роль пользователя"
        size="sm"
      >
        {selectedUser && (
          <div className="p-6 space-y-4">
            <p className="text-gray-600">
              Пользователь: <span className="font-semibold">{selectedUser.name || selectedUser.email}</span>
            </p>
            <div className="space-y-2">
              {roles.map(role => (
                <button
                  key={role.value}
                  onClick={() => handleRoleChange(selectedUser.id, role.value)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-colors ${
                    selectedUser.role === role.value
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium">{role.label}</span>
                  {selectedUser.role === role.value && (
                    <span className="text-green-600 font-semibold">Текущая</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
