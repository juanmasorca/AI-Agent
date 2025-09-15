import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Link from 'next/link'

export default function Dashboard() {
  const [tickets, setTickets] = useState([])
  const [agent, setAgent] = useState(null)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        window.location.href = '/login'
        return
      }

      const { data: agentData } = await supabase
        .from('agents')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      setAgent(agentData)

      if (!agentData) return

      let query = supabase.from('tickets')
        .select('*')
        .order('created_at', { ascending: false })

      if (agentData.role !== 'admin') {
        query = query.eq('assigned_agent_id', agentData.id)
      }

      const { data: ticketsData } = await query
      setTickets(ticketsData || [])
    }

    load()
  }, [])

  if (!agent) return <p className="text-center mt-10">Cargando...</p>

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">🎫 Tickets asignados</h1>
      <div className="space-y-4">
        {tickets.map((t) => (
          <div 
            key={t.id} 
            className="bg-white shadow rounded-lg p-4 border border-gray-200"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-blue-600">
                {t.category} / {t.priority}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(t.created_at).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-700">{t.ai_summary || t.message_text}</p>
            
            <div className="mt-3 text-right">
              <Link 
                href={`/ticket/${t.id}`} 
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
              >
                Ver historial 💬
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
