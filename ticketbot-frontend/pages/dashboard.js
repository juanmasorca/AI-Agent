import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

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

      let query = supabase
        .from('tickets')
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

  if (!agent) return <p className="text-center text-gray-500">Cargando...</p>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">🎟️ Tickets asignados</h1>
      
      <div className="grid gap-4">
        {tickets.map((t) => (
          <div
            key={t.id}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                {t.category} / <span className="capitalize">{t.priority}</span>
              </h2>
              <span className={`px-2 py-1 text-xs rounded-full font-medium 
                ${t.priority === 'alta' ? 'bg-red-100 text-red-700' :
                  t.priority === 'media' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'}`}>
                {t.priority}
              </span>
            </div>

            <p className="text-gray-600 mt-2">{t.ai_summary || t.message_text}</p>
            
            <div className="flex justify-between items-center mt-4">
              <small className="text-gray-400">
                {new Date(t.created_at).toLocaleString()}
              </small>
              <a
                href={`/ticket/${t.id}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Ver detalle →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
