import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Dashboard() {
  const [tickets, setTickets] = useState([])
  const [agent, setAgent] = useState(null)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      // Obtener sesión
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        window.location.href = '/'
        return
      }

      // Obtener agente (vinculado con auth.users)
      const { data: agentData } = await supabase
        .from('agents')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      setAgent(agentData)

      if (!agentData) return

      let query = supabase.from('tickets').select('*').order('created_at', { ascending: false })

      if (agentData.role !== 'admin') {
        // Agentes ven solo sus tickets
        query = query.eq('assigned_agent_id', agentData.id)
      }

      const { data: ticketsData } = await query
      setTickets(ticketsData || [])
    }

    load()
  }, [])

  if (!agent) return <p>Cargando...</p>

  return (
    <div style={{ maxWidth: 800, margin: '20px auto' }}>
      <h1>Tickets asignados</h1>
      <ul>
        {tickets.map((t) => (
          <li key={t.id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: 10 }}>
            <strong>{t.category} / {t.priority}</strong>
            <p>{t.ai_summary || t.message_text}</p>
            <small>{new Date(t.created_at).toLocaleString()}</small>
            <br />
            <button
              style={{ marginTop: 8, padding: '5px 10px', cursor: 'pointer' }}
              onClick={() => router.push(`/ticket/${t.id}`)}
            >
              Ver historial del ticket
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
